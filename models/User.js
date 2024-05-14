import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
      Name: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      Amount: {
        type: Number,
        required: true,
      },
      Childrens: {
        type: Array,
        default: [],
      },
    },
    { timestamps: true }
  );

  const User = mongoose.model('User', UserSchema);
  export default User;