import mongoose from "mongoose";
import Rating from "../models/rating.models.js";

export const addRatings = async (req, res) => {
  try {
    const { gameId } = req.params
    const { reviewedPlayerId, rating, sport, comment } = req.body
    const reviewerId = req.user._id

    if (reviewerId.toString() === reviewedPlayerId.toString()) {
      return res.status(401).json({ message: "You can't rate yourself" })
    }

    const existing = await Rating.findOne({ gameId, reviewerId, reviewedPlayerId })
    if (existing) {
      return res.status(401).json({ message: "You have already rated this player" })
    }

    const newRating = await Rating.create({
      gameId,
      sport,
      reviewerId,
      reviewedPlayerId,
      rating,
      comment,
    })

    res.status(200).json(newRating)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while adding rating",
      error: error.message,
    })
  }
}

export const getAllRating = async (req, res) => {
  try {
    const { userId } = req.params
    const ratings = await Rating.find({ reviewedPlayerId: userId })
      .populate("reviewerId", "name email")
      .populate("reviewedPlayerId", "name email")
      .populate("gameId")

    res.status(200).json({
      success: true,
      total: ratings.length,
      ratings,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching ratings",
      error: error.message,
    })
  }
}

export const averageRatings = async (req, res) => {
  try {
    const userId = req.user._id

    const average = await Rating.aggregate([
      { $match: { reviewedPlayerId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$reviewedPlayerId",
          averageRatings: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ])

    if (average.length === 0) {
      return res.status(200).json({ averageRatings: 0, totalReviews: 0 })
    }

    res.status(200).json({
      averageRatings: average[0].averageRatings.toFixed(1),
      totalReviews: average[0].totalReviews,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while calculating average rating",
      error: error.message,
    })
  }
}
