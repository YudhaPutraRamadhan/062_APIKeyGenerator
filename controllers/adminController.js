const { Admin, User, ApiKey } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.create({ email, password });
    res.status(201).json({ message: 'Admin berhasil dibuat', admin });
  } catch (error) {
    res.status(500).json({ message: 'Error server', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: 'Admin tidak ditemukan' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login berhasil', token });
  } catch (error) {
    res.status(500).json({ message: 'Error server', error: error.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: ApiKey,
          attributes: ['id', 'apiKey', 'createdAt'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const processedData = users.map((user) => {
      const apiKeysWithStatus = user.ApiKeys.map((key) => {
        const keyDate = new Date(key.createdAt);
        const isValid = keyDate > thirtyDaysAgo;
        return {
          id: key.id,
          apiKey: key.apiKey,
          createdAt: key.createdAt,
          status: isValid ? 'Valid' : 'Invalid',
        };
      });
      return {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        apiKeys: apiKeysWithStatus,
      };
    });

    res.status(200).json(processedData);
  } catch (error) {
    res.status(500).json({ message: 'Error server', error: error.message });
  }
};

exports.updateApiKey = async (req, res) => {
  const { id } = req.params;
  const { newApiKey } = req.body;

  try {
    const apiKey = await ApiKey.findByPk(id);
    if (!apiKey) {
      return res.status(404).json({ message: 'API key tidak ditemukan' });
    }

    apiKey.apiKey = newApiKey;
    await apiKey.save();

    res.status(200).json({ message: 'API key berhasil diupdate', apiKey });
  } catch (error) {
    res.status(500).json({ message: 'Error server', error: error.message });
  }
};

exports.createDefaultAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.log('⚠️ Harap set ADMIN_EMAIL dan ADMIN_PASSWORD di .env untuk membuat admin otomatis.');
      return;
    }

    const existingAdmin = await Admin.findOne({ where: { email: email } });

    if (!existingAdmin) {
      await Admin.create({
        email: email,
        password: password
      });
      console.log(`✅ Default Admin berhasil dibuat: ${email}`);
    } else {
      console.log(`ℹ️ Admin ${email} sudah tersedia.`);
    }
  } catch (error) {
    console.error('❌ Gagal membuat default admin:', error.message);
  }
};