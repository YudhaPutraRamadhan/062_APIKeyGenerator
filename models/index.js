const sequelize = require('../config/database');
const User = require('./user');
const ApiKey = require('./apiKey');
const Admin = require('./admin');

// Definisikan Relasi: User (one) -> ApiKey (many)
User.hasMany(ApiKey, { foreignKey: 'userId' });
ApiKey.belongsTo(User, { foreignKey: 'userId' });

const models = {
  User,
  ApiKey,
  Admin,
};

// Sinkronisasi semua model dengan database
const db = {
  sequelize,
  Sequelize: sequelize.Sequelize,
  ...models,
};

module.exports = db;