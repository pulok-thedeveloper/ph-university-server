/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse.";
import httpStatus from "http-status";

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, student: studentData } = req.body;

    // const { error, value } = studentValidation.studentJoiSchema.validate(studentData);

    // if (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: "Something went wrong",
    //     error: error.details,
    //   });
    // }
    // const zodParsedData = studentValidation.studentZodSchema.parse(studentData);

    const result = await UserServices.createStudentIntoDB(
      password,
      studentData
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student has created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createStudent,
};
