import jwt from "jsonwebtoken";

const createToken = (userId) => {
  const token = jwt.sign({ userId }, "MySecreteKey");
  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.send("Access denied");
  }
  try {
    const verified = jwt.verify(token, "MySecreteKey");
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
  }
};

export { createToken, verifyToken };
