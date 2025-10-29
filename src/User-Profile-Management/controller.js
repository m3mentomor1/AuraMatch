// backend/src/User-Profile-Management/controller.js
const pool = require("../../db");
const { uploadToSupabase, deleteFromSupabase } = require("../../supabase");

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, age, bio } = req.body;

    if (!firstName || !age) {
      return res.status(400).json({ error: "First name and age are required" });
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

    // If new profile picture uploaded
    if (req.file) {
      // Get old profile picture URL
      const oldUser = await pool.query(
        "SELECT profile_picture FROM users WHERE id = $1",
        [req.user.id]
      );

      if (oldUser.rows.length > 0) {
        const oldPictureUrl = oldUser.rows[0].profile_picture;
        // Delete old file from Supabase
        await deleteFromSupabase(oldPictureUrl);
      }

      // Upload new file to Supabase
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
      RETURNING id, email, first_name, last_name, age, bio, profile_picture, updated_at
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
        bio: user.bio,
        profilePicture: user.profile_picture,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  updateProfile,
};
