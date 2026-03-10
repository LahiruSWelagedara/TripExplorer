const express = require("express");
const Listing = require("../models/Listing");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { title, location, imageUrl, description, price } = req.body;

    if (!title || !location || !imageUrl || !description) {
      return res
        .status(400)
        .json({ message: "Title, location, image URL and description are required" });
    }

    const listing = await Listing.create({
      title,
      location,
      imageUrl,
      description,
      price,
      createdBy: req.user.id,
    });

    const populated = await listing.populate("createdBy", "name");

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const perPage = parseInt(limit, 10) || 10;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.json({
      data: listings,
      pagination: {
        total,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("createdBy", "name");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own listings" });
    }

    const { title, location, imageUrl, description, price } = req.body;

    listing.title = title || listing.title;
    listing.location = location || listing.location;
    listing.imageUrl = imageUrl || listing.imageUrl;
    listing.description = description || listing.description;
    if (price !== undefined) {
      listing.price = price;
    }

    await listing.save();
    const populated = await listing.populate("createdBy", "name");

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    await listing.deleteOne();

    res.json({ message: "Listing deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/like", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const userId = req.user.id;
    const index = listing.likes.findIndex((id) => id.toString() === userId);

    if (index === -1) {
      listing.likes.push(userId);
    } else {
      listing.likes.splice(index, 1);
    }

    await listing.save();
    const populated = await listing.populate("createdBy", "name");

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me/mine", auth, async (req, res) => {
  try {
    const listings = await Listing.find({ createdBy: req.user.id })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

