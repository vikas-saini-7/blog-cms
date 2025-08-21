const { getProfile } = require("@/services/web/profile.service");

exports.profile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await getProfile({ id });

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
