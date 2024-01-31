export const logUserAgent = (req, res, next) => {
  const userAgent = req.headers["user-agent"];
  console.log(userAgent);
  next();
};
