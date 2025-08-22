const bcrypt = require("bcrypt");
const prisma = require("@/lib/prisma.js");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("@/utils/jwt");

/**
 *
 * @param {string} name - Name of user (required)
 * @param {string} email - Email of user (required)
 * @param {string} password - Password of user (required)
 * @returns user details found in DB
 */
exports.registerUser = async ({ name, email, password }) => {
  existingUser = await prisma.user.findUnique({
    where: { email },
  });

  // 1. Check if user already exists
  if (existingUser) {
    throw new Error("User Already Exists");
  }

  // 2. hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. save user
  const user = prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

/**
 *
 * @param {string} email - Email of user (required)
 * @param {string} password - Password of user (required)
 * @returns user details found in DB + accessToken + refreshToken
 */
exports.loginUser = async ({ email, password }) => {
  // 1. check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error("Invalid Email or Password");
  }

  // 2. compare password
  const isMatch = bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid Email or Password");
  }

  // sign jwts with required payload
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };

  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  return { user, accessToken, refreshToken };
};

/**
 * @param {string} token - Refresh token which is valid for 15
 * @returns accessToken - new signed token
 */
exports.refreshAccessToken = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new Error("Unauthorized");
  }

  const decoded = verifyRefreshToken(refreshToken);

  const user = prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new Error("Invalid Token");
  }

  // sign brand new jwt token
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };

  const accessToken = createAccessToken(payload);

  return { accessToken };
};
/**
 *
 * @returns true
 */
exports.logoutUser = () => {
  // simple returning true because no DB or other interactions needed
  return true;
};
