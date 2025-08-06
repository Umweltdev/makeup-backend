import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    identificationNumber: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
    },
    img: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
}, { timestamps: true, toJSON: { virtuals: true } });

UserSchema.virtual("name").get(function () {
  return this.firstName + " " + this.lastName;
});
export default mongoose.model("User", UserSchema);