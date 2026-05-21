import mongoose from "mongoose";

const diarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  content: {
    type: String,
    required: true
  },

  fontFamily: {
    type: String,
    default: "Arial"
  },

  favorite: {
    type: Boolean,
    default: false
  },

 visibility: {
  type: String,
  enum: ["private", "public", "shared"],
  default: "private"
},

sharedWith: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],

allowedUsers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],

blocked: {
    type: Boolean,
    default: false
},

}, { timestamps: true });

export default mongoose.model("Diary", diarySchema);