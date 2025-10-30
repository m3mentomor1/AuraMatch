// backend/src/User-Profile-Management/controller.js
const pool = require("../../db");
const { uploadToSupabase, deleteFromSupabase } = require("../../supabase");

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, age, bio, gender } = req.body;

    if (!firstName || !age) {
      return res.status(400).json({ error: "First name and age are required" });
    }

    // Validate gender if provided
    if (gender) {
      const validGenders = ["male", "female", "other"];
      if (!validGenders.includes(gender.toLowerCase())) {
        return res.status(400).json({ error: "Invalid gender value" });
      }
    }

    let updateFields = [];
    let updateValues = [];
    let paramCount = 1;

    updateFields.push(`first_name = $${paramCount}`);
    updateValues.push(firstName);
    paramCount++;

    updateFields.push(`last_name = $${paramCount}`);
    updateValues.push(lastName || null);
    paramCount++;

    updateFields.push(`age = $${paramCount}`);
    updateValues.push(parseInt(age));
    paramCount++;

    updateFields.push(`bio = $${paramCount}`);
    updateValues.push(bio || null);
    paramCount++;

    if (gender) {
      updateFields.push(`gender = $${paramCount}`);
      updateValues.push(gender.toLowerCase());
      paramCount++;
    }

    // Replace profile picture
    if (req.file) {
      const oldUser = await pool.query(
        "SELECT profile_picture FROM users WHERE id = $1",
        [req.user.id]
      );

      if (oldUser.rows.length > 0) {
        const oldPictureUrl = oldUser.rows[0].profile_picture;
        await deleteFromSupabase(oldPictureUrl);
      }

      const newProfilePictureUrl = await uploadToSupabase(req.file);

      updateFields.push(`profile_picture = $${paramCount}`);
      updateValues.push(newProfilePictureUrl);
      paramCount++;
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(req.user.id);

    const query = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, email, first_name, last_name, age, gender, bio, profile_picture, updated_at
    `;

    const result = await pool.query(query, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        age: user.age,
        gender: user.gender,
        bio: user.bio,
        profilePicture: user.profile_picture,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
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
  updateProfile,
  updateLocation,
  getLocation,
};
