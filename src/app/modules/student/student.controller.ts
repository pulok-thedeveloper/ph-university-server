/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse.";
import httpStatus from "http-status";

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();

    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Students has retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const getSingleStudent = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);


    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student has created successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const deleteStudent = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentId);

    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student has deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
