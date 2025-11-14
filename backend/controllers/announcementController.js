import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getLatestAnnouncements,
} from "../models/announcementModel.js";

// Create announcement (Principal only)
export async function createAnnouncementHandler(req, res) {
  try {
    const { title, content } = req.body;
    const createdBy = req.user.user_id;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    // Validate title length (max 200 characters)
    if (title.length > 200) {
      return res.status(400).json({
        message: "Title must be 200 characters or less",
      });
    }

    // Validate content length (max 2000 characters)
    if (content.length > 2000) {
      return res.status(400).json({
        message: "Content must be 2000 characters or less",
      });
    }

    const announcementId = await createAnnouncement(
      title.trim(),
      content.trim(),
      createdBy
    );

    const newAnnouncement = await getAnnouncementById(announcementId);

    res.status(201).json({
      message: "Announcement created successfully",
      announcement: newAnnouncement,
    });
  } catch (err) {
    console.error("Create announcement error:", err);
    res.status(500).json({ message: "Failed to create announcement" });
  }
}

// Get all announcements
export async function getAllAnnouncementsHandler(req, res) {
  try {
    const announcements = await getAllAnnouncements();
    res.json({ announcements });
  } catch (err) {
    console.error("Get announcements error:", err);
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
}

// Get latest announcements for dashboard
export async function getLatestAnnouncementsHandler(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const announcements = await getLatestAnnouncements(limit);
    res.json({ announcements });
  } catch (err) {
    console.error("Get latest announcements error:", err);
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
}

// Update announcement (Principal only)
export async function updateAnnouncementHandler(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    // Validate title length
    if (title.length > 200) {
      return res.status(400).json({
        message: "Title must be 200 characters or less",
      });
    }

    // Validate content length
    if (content.length > 2000) {
      return res.status(400).json({
        message: "Content must be 2000 characters or less",
      });
    }

    const updated = await updateAnnouncement(id, title.trim(), content.trim());

    if (!updated) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    const updatedAnnouncement = await getAnnouncementById(id);

    res.json({
      message: "Announcement updated successfully",
      announcement: updatedAnnouncement,
    });
  } catch (err) {
    console.error("Update announcement error:", err);
    res.status(500).json({ message: "Failed to update announcement" });
  }
}

// Delete announcement (Principal only)
export async function deleteAnnouncementHandler(req, res) {
  try {
    const { id } = req.params;

    const deleted = await deleteAnnouncement(id);

    if (!deleted) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    console.error("Delete announcement error:", err);
    res.status(500).json({ message: "Failed to delete announcement" });
  }
}