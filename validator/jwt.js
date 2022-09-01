import jwt from "jsonwebtoken";

const createToken = (userId) => {
  const options = {
    expiresIn: 60,
  };
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, options);
  return token;
};

const refreshToken = (userId) => {
  const options = {
    expiresIn: "1y",
  };
  const token = jwt.sign({ userId }, process.env.REFRESH_TOKEN, options);
  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.redirect("/users/login");
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = verified;
    next();
  } catch (err) {
    res.redirect("/users/login");
  }
};

const verifyRefreshToken = (req, res, next) => {
  const token = req.header("refresh-token");
  if (!token) {
    res.send("Access denied");
  }
  try {
    const verified = jwt.verify(token, process.env.REFRESH_TOKEN);
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
  }
};

export { createToken, verifyToken, refreshToken, verifyRefreshToken };
