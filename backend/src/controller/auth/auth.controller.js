const { registerUser, loginUser } = require("@/services/auth/auth.service.js");

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
