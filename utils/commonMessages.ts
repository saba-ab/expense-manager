import { Expense } from "../interfaces/interface.js";

export const dataNotFound = (err: any) => {
  return {
    statusCode: 400,
    errorCode: err.code || "unknown error code",
    message: err.message || "unknown error",
  };
};
export const postSuccess = (exp: Expense) => {
  return {
    statusCode: 200,
    message: "expense has been successfully added to expenses.json",
    expense: exp,
  };
};
export const fileCreated = "File not found in directory, creating new one...";

export const divTemplate = (exp: Expense) => {
  return `<div><p>name - ${exp.name}</p><p>cost - ${exp.cost}</p><p>date - ${exp.createdAt}</p></div>`;
};
