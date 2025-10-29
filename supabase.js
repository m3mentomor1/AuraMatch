// backend/supabase.js
require("dotenv").config();
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET_NAME || "profile-pictures";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to extract filename from Supabase URL
function extractFilenameFromUrl(fileUrl) {
  try {
    // Supabase URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{filename}
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/");

    // Find the bucket name in the path and get everything after it
    const bucketIndex = pathParts.indexOf(SUPABASE_BUCKET);
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      // Get all parts after the bucket name and join them (in case filename has slashes)
      return pathParts.slice(bucketIndex + 1).join("/");
    }

    // Fallback: just get the last part
    return pathParts[pathParts.length - 1];
  } catch (error) {
    console.error("Error parsing URL:", error);
    // Fallback: try to extract filename from the end of the string
    return fileUrl.split("/").pop();
  }
}

// Helper function to upload file to Supabase Storage
async function uploadToSupabase(file) {
  const fileExt = path.extname(file.originalname);
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;

  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error("Failed to upload file");
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

// Helper function to delete file from Supabase Storage
async function deleteFromSupabase(fileUrl) {
  try {
    if (!fileUrl) {
      console.log("No file URL provided to delete");
      return;
    }

    // Extract filename from URL
    const fileName = extractFilenameFromUrl(fileUrl);

    if (!fileName) {
      console.error("Could not extract filename from URL:", fileUrl);
      return;
    }

    console.log("Attempting to delete file:", fileName);

    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .remove([fileName]);

    if (error) {
      console.error("Supabase delete error:", error);
    } else {
      console.log("Successfully deleted file:", fileName);
    }
  } catch (error) {
    console.error("Error deleting from Supabase:", error);
  }
}

module.exports = supabase;
module.exports.uploadToSupabase = uploadToSupabase;
module.exports.deleteFromSupabase = deleteFromSupabase;
