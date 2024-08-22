// models/Settings.ts
import mongoose, { Schema, Document } from "mongoose";

interface Settings extends Document {
  id: number;
  data1: number;
}

const SettingsSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  data1: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Create a singleton model
const SettingsModel =
  mongoose.models.Settings ||
  mongoose.model<Settings>("Settings", SettingsSchema);

export default SettingsModel;
