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
    status: {
      type: String,
      required: true,
      enum: ["Checked-Out", "Checked-in", "Reserved"],
      default: "Checked-Out",
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
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "admin"],
    },
}, { timestamps: true, toJSON: { virtuals: true } });

UserSchema.virtual("name").get(function () {
  return this.firstName + " " + this.lastName;
});
export default mongoose.model("User", UserSchema);