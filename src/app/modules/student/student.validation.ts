import Joi from "joi";
import z from "zod";

const capitalize = (value: string) => {
  const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
  return value === firstNameStr;
};

const userNameJoiSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(20)
    .required()
    .custom(capitalize)
    .messages({
      "string.empty": "First Name is required",
      "string.max": "First Name can not be more than 20 characters",
      "string.capitalize":
        "{#value} is not valid. First Name should be in capitalize format.",
    }),
  middleName: Joi.string().trim(),
  lastName: Joi.string()
    .trim()
    .required()
    .pattern(/^[a-zA-Z]+$/)
    .messages({
      "string.empty": "Last Name is required",
      "string.pattern.base": "{#value} is not valid",
    }),
});

const guardianJoiSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    "string.empty": "Father Name is required",
  }),
  fatherOccupation: Joi.string().required().messages({
    "string.empty": "Father Occupation is required",
  }),
  fatherContactNo: Joi.string().required().messages({
    "string.empty": "Father Contact No is required",
  }),
  motherName: Joi.string().required().messages({
    "string.empty": "Mother Name is required",
  }),
  motherOccupation: Joi.string().required().messages({
    "string.empty": "Mother Occupation is required",
  }),
  motherContactNo: Joi.string().required().messages({
    "string.empty": "Mother Contact No is required",
  }),
});

const localGuardianJoiSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Local Guardian name is required",
  }),
  occupation: Joi.string().required().messages({
    "string.empty": "Local Guardian occupation is required",
  }),
  contactNo: Joi.string().required().messages({
    "string.empty": "Local Guardian contact No is required",
  }),
  address: Joi.string().required().messages({
    "string.empty": "Local Guardian address is required",
  }),
});

const studentJoiSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.empty": "ID is required",
  }),
  name: userNameJoiSchema.required().messages({
    "any.required": "Name is required",
  }),
  gender: Joi.string().valid("male", "female", "other").required().messages({
    "any.only": "{#value} is not valid",
    "string.empty": "Gender is required",
  }),
  dateOfBirth: Joi.string(),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "{#value} is not a valid email type.",
  }),
  contactNo: Joi.string().required().messages({
    "string.empty": "Contact No is required",
  }),
  emergencyContactNo: Joi.string().required().messages({
    "string.empty": "Emergency Contact No is required",
  }),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .messages({
      "any.only": "{#value} is not valid",
    }),
  presentAddress: Joi.string().required().messages({
    "string.empty": "Present Address is required",
  }),
  permanentAddress: Joi.string().required().messages({
    "string.empty": "Permanent Address is required",
  }),
  guardian: guardianJoiSchema.required().messages({
    "any.required": "Guardian information is required",
  }),
  localGuardian: localGuardianJoiSchema.required().messages({
    "any.required": "Local Guardian information is required",
  }),
  profileImg: Joi.string(),
  isActive: Joi.string()
    .valid("active", "blocked")
    .required()
    .default("active")
    .messages({
      "any.only": "{#value} is not valid",
      "string.empty": "Status is required",
    }),
});

// Zod schema for UserName
const userNameZodSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, "First Name can not be more than 20 characters")
    .min(1, "First Name is required")
    .refine(capitalize, {
      message: "First Name should be in capitalize format.",
    }),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .min(1, "Last Name is required")
    .regex(/^[a-zA-Z]+$/, "Last Name is not valid"),
});

// Zod schema for Guardian
const guardianZodSchema = z.object({
  fatherName: z.string().min(1, "Father Name is required"),
  fatherOccupation: z.string().min(1, "Father Occupation is required"),
  fatherContactNo: z.string().min(1, "Father Contact No is required"),
  motherName: z.string().min(1, "Mother Name is required"),
  motherOccupation: z.string().min(1, "Mother Occupation is required"),
  motherContactNo: z.string().min(1, "Mother Contact No is required"),
});

// Zod schema for LocalGuardian
const localGuardianZodSchema = z.object({
  name: z.string().min(1, "Local Guardian name is required"),
  occupation: z.string().min(1, "Local Guardian occupation is required"),
  contactNo: z.string().min(1, "Local Guardian contact No is required"),
  address: z.string().min(1, "Local Guardian address is required"),
});

// Zod schema for Student
const studentZodSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: userNameZodSchema,
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Gender is not valid" }),
  }),
  dateOfBirth: z.string().optional(),
  email: z.string().email("Email is not valid").min(1, "Email is required"),
  contactNo: z.string().min(1, "Contact No is required"),
  emergencyContactNo: z.string().min(1, "Emergency Contact No is required"),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  presentAddress: z.string().min(1, "Present Address is required"),
  permanentAddress: z.string().min(1, "Permanent Address is required"),
  guardian: guardianZodSchema,
  localGuardian: localGuardianZodSchema,
  profileImg: z.string().optional(),
  isDeleted: z.boolean(),
});

export const studentValidation = {
  studentJoiSchema,
  studentZodSchema,
};
