'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const process = require('process');
const configJson = require('../config/config.js');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configJson[env];
const db: any = {};

let sequelize: Sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const activity = require('./activity')(sequelize);
db[activity.name] = activity;

const location = require('./location')(sequelize);
db[location.name] = location;

const locationService = require('./locationService')(sequelize);
db[locationService.name] = locationService;

const product = require('./product')(sequelize);
db[product.name] = product;

const quest = require('./quest')(sequelize);
db[quest.name] = quest;

const role = require('./role')(sequelize);
db[role.name] = role;

const service = require('./service')(sequelize);
db[service.name] = service;

const user = require('./user')(sequelize);
db[user.name] = user;

const userQuest = require('./userQuest')(sequelize);
db[userQuest.name] = userQuest;

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
