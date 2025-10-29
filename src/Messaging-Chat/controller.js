// backend/src/Messaging-Chat/controller.js
const pool = require("../../db");

const getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;

    // First, get the match details to find both users
    const matchInfo = await pool.query(
      `SELECT user_id, matched_user_id FROM matches WHERE id = $1`,
      [matchId]
    );

    if (matchInfo.rows.length === 0) {
      return res.status(404).json({ error: "Match not found" });
    }

    const match = matchInfo.rows[0];
    const user1 = match.user_id;
    const user2 = match.matched_user_id;

    // Verify current user is part of this match
    if (user1 !== req.user.id && user2 !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Find the reverse match ID
    const reverseMatch = await pool.query(
      `SELECT id FROM matches WHERE user_id = $1 AND matched_user_id = $2`,
      [user2, user1]
    );

    const reverseMatchId =
      reverseMatch.rows.length > 0 ? reverseMatch.rows[0].id : null;

    // Get all messages from both match records
    const result = await pool.query(
      `SELECT m.*, u.first_name, u.profile_picture
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.match_id = $1 ${reverseMatchId ? "OR m.match_id = $2" : ""}
       ORDER BY m.created_at ASC`,
      reverseMatchId ? [matchId, reverseMatchId] : [matchId]
    );

    // Mark all messages in this conversation as read for the current user
    await pool.query(
      `UPDATE messages SET read = true 
       WHERE (match_id = $1 ${reverseMatchId ? "OR match_id = $2" : ""})
       AND sender_id != $3`,
      reverseMatchId
        ? [matchId, reverseMatchId, req.user.id]
        : [matchId, req.user.id]
    );

    const messages = result.rows.map((msg) => ({
      id: msg.id,
      message: msg.message,
      senderId: msg.sender_id,
      senderName: msg.first_name,
      senderPicture: msg.profile_picture,
      createdAt: msg.created_at,
      read: msg.read,
    }));

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

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
      return res
        .status(403)
        .json({ error: "Access denied - Not a valid match" });
    }

    // Insert message with the provided matchId
    const result = await pool.query(
      `INSERT INTO messages (match_id, sender_id, message) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [matchId, req.user.id, message.trim()]
    );

    const newMessage = result.rows[0];

    res.status(201).json({
      id: newMessage.id,
      message: newMessage.message,
      senderId: newMessage.sender_id,
      createdAt: newMessage.created_at,
      read: newMessage.read,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(DISTINCT msg.id) as unread_count
       FROM messages msg
       JOIN matches m ON msg.match_id = m.id
       WHERE (m.user_id = $1 OR m.matched_user_id = $1) 
       AND msg.sender_id != $1 
       AND msg.read = false`,
      [req.user.id]
    );

    res.json({
      unreadCount: parseInt(result.rows[0].unread_count) || 0,
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  getUnreadCount,
};
