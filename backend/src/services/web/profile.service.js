const prisma = require("@/lib/prisma.js");

/**
 * Get Profile of user by userId
 * @param {string} userId - The UUID of the user from Supabase DB
 * @returns {object} - user details found from DB
 */
exports.getProfile = async ({ userId }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
