import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({

  userEmail: { type: String, required: true },

  otp: { type: String, required: true },

  expireAt: { type: Date, default: Date.now, index: { expires: 180 } }, // TTL index set to 600 seconds (10 minutes)
});

export const Otp = mongoose.model('Otp', otpSchema);