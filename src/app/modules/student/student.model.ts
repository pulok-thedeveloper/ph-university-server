import { model, Schema } from "mongoose";
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  // StudentMethods,
  StudentModel,
  TUserName,
} from "./student.interface";
import validator from "validator";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
    trim: true,
    maxlength: [20, "First Name can not be more than 20 characters"],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return value === firstNameStr;
      },
      message:
        "{VALUE is not valid. First Name should be in capitalize format.}",
    },
  },
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    trim: true,
    validate: {
      validator: function (value: string) {
        return validator.isAlpha(value);
      },
      message: "{VALUE is not valid}",
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: [true, "Father Name is required"] },
  fatherOccupation: {
    type: String,
    required: [true, "fatherOccupation is required"],
  },
  fatherContactNo: {
    type: String,
    required: [true, "fatherContactNo is required"],
  },
  motherName: { type: String, required: [true, "motherName is required"] },
  motherOccupation: {
    type: String,
    required: [true, "motherOccupation is required"],
  },
  motherContactNo: {
    type: String,
    required: [true, "motherContactNo is required"],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: [true, "localGuardian name is required"] },
  occupation: {
    type: String,
    required: [true, "localGuardian occupation is required"],
  },
  contactNo: {
    type: String,
    required: [true, "localGuardian contactNo is required"],
  },
  address: {
    type: String,
    required: [true, "localGuardian address is required"],
  },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, required: true, unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      unique: true,
      ref: 'User'
    },
    name: {
      type: userNameSchema,
      required: [true, "name is required"],
      maxlength: [20, "Password can not be more than 20"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not valid",
      },
      required: [true, "gender is required"],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validate: {
        validator: function (value: string) {
          return validator.isEmail(value);
        },
        message: "{VALUE is not valid email type.}",
      },
    },
    contactNo: { type: String, required: [true, "contactNo is required"] },
    emergencyContactNo: {
      type: String,
      required: [true, "emergencyContactNo is required"],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        message: "{VALUE} is not valid",
      },
    },
    presentAddress: {
      type: String,
      required: [true, "presentAddress is required"],
    },
    permanentAddress: {
      type: String,
      required: [true, "permanentAddress is required"],
    },
    guardian: { type: guardianSchema, required: [true, "is required"] },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, "localGuardian is required"],
    },
    profileImg: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

//virtual
studentSchema.virtual("fullName").get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// Query middleware

studentSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

// Creating a custom static method
studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>("Student", studentSchema);
