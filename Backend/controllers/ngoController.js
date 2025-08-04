
const { response } = require('express')
const NGO = require('../models/ngoSchema')
exports.registerNgo = async (req, res) => {
 console.log('req.body:', req.body)

  const {
    name, email, contactPhone, password, description,
    rescueCategories, rescueDistance, serviceHours,
    registrationNumber, address
  } = req.body;

  try {
    const accessToken = await NGO.genrateAccessToken();
    const newNgo = new NGO({
      name, email, contactPhone, password, description,
      rescueCategories,
      rescueDistance,  // fixed assignment
      serviceHours,
      registrationNumber,
      token: accessToken,
      address: {
        street: address?.street || '',
        city: address?.city || '',
        state: address?.state || '',
        postalCode: address?.postalCode || '',
        country: address?.country || ''
      }
    });
    await newNgo.save();
    res.status(201).json({ message: "new NGO created", newNgo });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error.message });
  }
};
