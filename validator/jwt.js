import jwt from "jsonwebtoken";

const createToken = (userId, email, password) => {
  const options = {
    expiresIn: 60 * 60,
  };
  const token = jwt.sign(
    { userId, email, password },
    process.env.JWT_TOKEN,
    options
  );
  return token;
};

const refreshToken = (userId) => {
  const options = {
    expiresIn: "1m",
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
    res.send(err);
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
