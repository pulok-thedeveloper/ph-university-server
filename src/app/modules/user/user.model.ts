import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt"

const userSchema = new Schema<TUser>(
  {
    id: { type: String, required: true },
    password: { type: String, required: true },
    neddPasswordChange: { type: Boolean, default: true },
    role: { type: String, enum: ["student", "faculty", "admin"] },
    status: { type: String, enum: ["in-progress", "blocked"], default: "in-progress" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);


// pre save middleware / hook
userSchema.pre("save", async function (next) {
  // console.log(this, "pre hook: we will save the data");
  // hashing password and save into DB
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

// set '' after saving password
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
  console.log(this, "post hook: we have saved the data");
});

export const User = model<TUser>("User", userSchema);
