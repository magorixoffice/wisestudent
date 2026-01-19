import mongoose from "mongoose";

const goodieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    coins: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

const Goodie = mongoose.model("Goodie", goodieSchema);
export default Goodie;
