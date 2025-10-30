// backend/src/User-Discovery-and-Matching/controller.js
const pool = require("../../db");

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getAvailableUsers = async (req, res) => {
  try {
    const { minAge, maxAge, maxDistance, genders } = req.query;

    // Get current user's location
    const currentUserResult = await pool.query(
      `SELECT latitude, longitude FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (currentUserResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUser = currentUserResult.rows[0];

    const result = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.age, u.gender, u.bio, u.profile_picture,
              u.latitude, u.longitude, u.location_city, u.location_country
       FROM users u
       WHERE u.id != $1 
       AND u.id NOT IN (
         SELECT swiped_user_id FROM swipes WHERE user_id = $1
       )
       ORDER BY u.created_at DESC`,
      [req.user.id]
    );

    let users = result.rows.map((user) => {
      const distance =
        user.latitude &&
        user.longitude &&
        currentUser.latitude &&
        currentUser.longitude
          ? calculateDistance(
              currentUser.latitude,
              currentUser.longitude,
              user.latitude,
              user.longitude
            )
          : null;

      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        age: user.age,
        gender: user.gender,
        bio: user.bio,
        profilePicture: user.profile_picture,
        distance: distance ? Math.round(distance) : null,
        locationCity: user.location_city,
        locationCountry: user.location_country,
      };
    });

    // Apply age filter
    if (minAge && maxAge) {
      const min = parseInt(minAge);
      const max = parseInt(maxAge);
      users = users.filter((user) => user.age >= min && user.age <= max);
    }

    // Apply distance filter
    if (maxDistance && maxDistance !== "500") {
      const maxDist = parseInt(maxDistance);
      users = users.filter(
        (user) => user.distance !== null && user.distance <= maxDist
      );
    }

    // Apply gender filter
    if (genders && genders !== "male,female,other") {
      const genderArray = genders.split(",").map((g) => g.toLowerCase().trim());
      users = users.filter(
        (user) => user.gender && genderArray.includes(user.gender.toLowerCase())
      );
    }

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const recordSwipe = async (req, res) => {
  try {
    const { swipedUserId, swipeType } = req.body;

    if (!swipedUserId || !swipeType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!["like", "pass"].includes(swipeType)) {
      return res.status(400).json({ error: "Invalid swipe type" });
    }

    // Record the swipe
    await pool.query(
      `INSERT INTO swipes (user_id, swiped_user_id, swipe_type) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, swiped_user_id) 
       DO UPDATE SET swipe_type = $3, created_at = CURRENT_TIMESTAMP`,
      [req.user.id, swipedUserId, swipeType]
    );

    let isMatch = false;
    let matchId = null;

    // Check if it's a mutual like
    if (swipeType === "like") {
      const mutualLike = await pool.query(
        `SELECT * FROM swipes 
         WHERE user_id = $1 AND swiped_user_id = $2 AND swipe_type = 'like'`,
        [swipedUserId, req.user.id]
      );

      if (mutualLike.rows.length > 0) {
        isMatch = true;

        // Create match record
        const matchResult = await pool.query(
          `INSERT INTO matches (user_id, matched_user_id) 
           VALUES ($1, $2), ($2, $1)
           ON CONFLICT (user_id, matched_user_id) DO NOTHING
           RETURNING id`,
          [req.user.id, swipedUserId]
        );

        if (matchResult.rows.length > 0) {
          matchId = matchResult.rows[0].id;
        }
      }
    }

    res.json({
      message: "Swipe recorded successfully",
      isMatch,
      matchId,
    });
  } catch (error) {
    console.error("Swipe error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getMatches = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         u.id, u.first_name, u.last_name, u.age, u.gender, u.bio, u.profile_picture,
         m.created_at as matched_at,
         m.id as match_id,
         m.user_id as match_user_id,
         m.matched_user_id as match_matched_user_id
       FROM matches m
       JOIN users u ON m.matched_user_id = u.id
       WHERE m.user_id = $1
       ORDER BY m.created_at DESC`,
      [req.user.id]
    );

    // For each match, get message stats
    const matchesWithStats = await Promise.all(
      result.rows.map(async (match) => {
        // Find reverse match ID
        const reverseMatch = await pool.query(
          `SELECT id FROM matches WHERE user_id = $1 AND matched_user_id = $2`,
          [match.match_matched_user_id, match.match_user_id]
        );

        const reverseMatchId =
          reverseMatch.rows.length > 0 ? reverseMatch.rows[0].id : null;

        // Get unread count
        const unreadResult = await pool.query(
          `SELECT COUNT(*) as count FROM messages 
           WHERE (match_id = $1 ${reverseMatchId ? "OR match_id = $2" : ""})
           AND sender_id = $3 AND read = false`,
          reverseMatchId
            ? [match.match_id, reverseMatchId, match.id]
            : [match.match_id, match.id]
        );

        // Get last message
        const lastMessageResult = await pool.query(
          `SELECT message, created_at FROM messages 
           WHERE match_id = $1 ${reverseMatchId ? "OR match_id = $2" : ""}
           ORDER BY created_at DESC LIMIT 1`,
          reverseMatchId ? [match.match_id, reverseMatchId] : [match.match_id]
        );

        return {
          id: match.id,
          matchId: match.match_id,
          firstName: match.first_name,
          lastName: match.last_name,
          age: match.age,
          gender: match.gender,
          bio: match.bio,
          profilePicture: match.profile_picture,
          matchedAt: match.matched_at,
          unreadCount: parseInt(unreadResult.rows[0].count) || 0,
          lastMessage:
            lastMessageResult.rows.length > 0
              ? lastMessageResult.rows[0].message
              : null,
          lastMessageTime:
            lastMessageResult.rows.length > 0
              ? lastMessageResult.rows[0].created_at
              : null,
        };
      })
    );

    // Sort by most recent message
    matchesWithStats.sort((a, b) => {
      const timeA = a.lastMessageTime
        ? new Date(a.lastMessageTime).getTime()
        : new Date(a.matchedAt).getTime();
      const timeB = b.lastMessageTime
        ? new Date(b.lastMessageTime).getTime()
        : new Date(b.matchedAt).getTime();
      return timeB - timeA;
    });

    res.json(matchesWithStats);
  } catch (error) {
    console.error("Get matches error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const unmatchUser = async (req, res) => {
  try {
    const { matchId } = req.params;

    // Get the match details
    const matchInfo = await pool.query(
      `SELECT user_id, matched_user_id FROM matches WHERE id = $1`,
      [matchId]
    );

    if (matchInfo.rows.length === 0) {
      return res.status(404).json({ error: "Match not found" });
    }

    const match = matchInfo.rows[0];

    // Verify current user is part of this match
    if (
      match.user_id !== req.user.id &&
      match.matched_user_id !== req.user.id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Find the reverse match
    const reverseMatch = await pool.query(
      `SELECT id FROM matches WHERE user_id = $1 AND matched_user_id = $2`,
      [match.matched_user_id, match.user_id]
    );

    const reverseMatchId =
      reverseMatch.rows.length > 0 ? reverseMatch.rows[0].id : null;

    // Delete all messages associated with both matches
    await pool.query(
      `DELETE FROM messages WHERE match_id = $1 ${
        reverseMatchId ? "OR match_id = $2" : ""
      }`,
      reverseMatchId ? [matchId, reverseMatchId] : [matchId]
    );

    // Delete both match records (bidirectional)
    await pool.query(
      `DELETE FROM matches WHERE id = $1 ${reverseMatchId ? "OR id = $2" : ""}`,
      reverseMatchId ? [matchId, reverseMatchId] : [matchId]
    );

    res.json({ message: "Unmatched successfully" });
  } catch (error) {
    console.error("Unmatch error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, locationCity, locationCountry } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const query = `
      UPDATE users 
      SET latitude = $1,
          longitude = $2,
          location_city = $3,
          location_country = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, latitude, longitude, location_city, location_country
    `;

    const result = await pool.query(query, [
      parseFloat(latitude),
      parseFloat(longitude),
      locationCity || null,
      locationCountry || null,
      req.user.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Location updated successfully",
      location: {
        latitude: result.rows[0].latitude,
        longitude: result.rows[0].longitude,
        city: result.rows[0].location_city,
        country: result.rows[0].location_country,
      },
    });
  } catch (error) {
    console.error("Update location error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getLocation = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT latitude, longitude, location_city, location_country 
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const hasLocation = user.latitude !== null && user.longitude !== null;

    res.json({
      hasLocation,
      location: hasLocation
        ? {
            latitude: user.latitude,
            longitude: user.longitude,
            city: user.location_city,
            country: user.location_country,
          }
        : null,
    });
  } catch (error) {
    console.error("Get location error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAvailableUsers,
  recordSwipe,
  getMatches,
  unmatchUser,
  updateLocation,
  getLocation,
};
