export const dataNotFound = (err) => {
  return {
    statusCode: 400,
    errorCode: err.code || "unknown error code",
    message: err.message || "unknown error",
  };
};
export const postSuccess = (exp) => {
  return {
    statusCode: 200,
    message: "expense has been successfully added to expenses.json",
    expense: exp,
  };
};
export const fileCreated = "File not found in directory, creating new one...";

export const divTemplate = (exp) => {
  return `<div><p>name - ${exp.name}</p><p>cost - ${exp.cost}</p><p>date - ${exp.createdAt}</p></div>`;
};
