const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} = require("@/services/auth/auth.service.js");

// user regiteration
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({ name, email, password });

    const { password: _, ...safeUser } = user;

    res.status(201).json({
      success: true,
      message: "Registeration Successfully",
      data: safeUser,
    });
  } catch (error) {
    console.error("error in register:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await loginUser({
      email,
      password,
    });
    const { password: _, ...safeUser } = user;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: safeUser,
    });
  } catch (error) {
    console.error("error in login:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// refresh token
exports.refresh = async (req, res) => {
  try {
    token = req.cookies["refreshToken"];
    const { newAccessToken } = await refreshAccessToken({ token });
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({ success: true, message: "Token Refreshed!" });
  } catch (error) {
    console.error("error in refreshing token:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// user logout
exports.logout = async (req, res) => {
  try {
    logoutUser();

    res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict" });
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("error in logout:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
