import jwt from "jsonwebtoken";

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // or "1h", "30m", etc.
  });
  return token;
};

export { generateToken };
