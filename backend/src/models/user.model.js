import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'seller'],
    },
    refreshToken: {
      type: String,
      
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('User', userSchema);
export default userModel;
