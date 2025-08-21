const bcrypt = require("bcrypt");
const prisma = require("@/lib/prisma.js");
const { createAccessToken, createRefreshToken } = require("@/utils/jwt");

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
