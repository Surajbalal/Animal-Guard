const { response } = require("express");
const NGO = require("../models/ngoSchema");
exports.registerNgo = async (req, res) => {
  console.log("req.body:", req.body);

  const {
    name,
    email,
    contactPhone,
    password,
    description,
    rescueCategories,
    rescueDistance,
    serviceHours,
    registrationNumber,
    address,
    roleType,
  } = req.body;
  try {
    const newNgo = new NGO({
      name,
      email,
      contactPhone,
      password,
      description,
      rescueCategories,
      rescueDistance,
      serviceHours,
      registrationNumber,
      roleType,
      address: {
        street: address?.street || "",
        city: address?.city || "",
        state: address?.state || "",
        postalCode: address?.postalCode || "",
        country: address?.country || "",
      },
    });
    const accessToken = await newNgo.genrateAccessToken();
    newNgo.token = accessToken;
    console.log("new access token", accessToken);
    await newNgo.save();
    res.status(201).json({ message: "new NGO created", newNgo });
  } catch (error) {
    console.error("Error during NGO registration:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
exports.loginNgo = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await NGO.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid user email or password" });
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid user email or password" });
    }

    const accessToken = await user.genrateAccessToken();
    console.log("new accessToken", accessToken);
                  
    await NGO.findByIdAndUpdate(user._id, { token: accessToken });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};
