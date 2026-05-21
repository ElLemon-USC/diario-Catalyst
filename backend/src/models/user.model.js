import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
},

  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  IntentosFallidos: {
    type: Number,
    default: 0,
  },

  BloquearHasta: {
    type: Date,
    default: null,
  },

  blocked: {
    type: Boolean,
    default: false,
  }

}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);