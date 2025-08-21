const prisma = require("@/lib/prisma.js");

exports.getProfile = async ({ id }) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
