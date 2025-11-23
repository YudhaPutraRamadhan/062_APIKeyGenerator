const { v4: uuidv4 } = require('uuid');
const { User, ApiKey } = require('../models');

exports.generateKey = (req, res) => {
  const newKey = uuidv4();
  res.status(200).json({ apiKey: newKey });
};

exports.saveUserData = async (req, res) => {
  const { firstName, lastName, email, apiKey } = req.body;

  if (!firstName || !lastName || !email || !apiKey) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  try {
    const [user, created] = await User.findOrCreate({
      where: { email: email },
      defaults: { firstName, lastName },
    });

    if (!created) {
      user.firstName = firstName;
      user.lastName = lastName;
      await user.save();
    }

    const newApiKey = await ApiKey.create({
      apiKey: apiKey,
      userId: user.id,
    });

    res.status(201).json({
      message: 'Data user dan API key berhasil disimpan',
      user: user,
      apiKey: newApiKey,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'API key atau Email sudah digunakan.' });
    }
    res.status(500).json({ message: 'Error server', error: error.message });
  }
};