import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  img?: string;
  otp?: string;
  isVerified?: boolean;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    img: { type: String },
    otp: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
