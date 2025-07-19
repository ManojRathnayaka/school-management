import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export function authenticateJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
