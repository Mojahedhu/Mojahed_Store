import mongoose, { Document } from "mongoose";

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
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
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

const User = mongoose.model<IUser>("User", userSchema);
export { User };
