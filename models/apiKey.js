const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ApiKey = sequelize.define('ApiKey', {
  apiKey: { type: DataTypes.STRING, allowNull: false, unique: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
}, {
    tableName: 'apikeys'
});

module.exports = ApiKey;