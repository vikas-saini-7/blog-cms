const { getProfile } = require("@/services/web/profile.service");

/*
 Get Profile of currently loggeg in user
*/
exports.profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getProfile({ userId });

    res.status(201).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("error in getting profile:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
