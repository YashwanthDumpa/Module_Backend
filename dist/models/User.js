"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// src/models/User.ts
const sequelize_1 = require("sequelize");
const sequelize = require("../database/sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    EMP_ID: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true
    },
    FirstName: {
        type: sequelize_1.DataTypes.STRING
    },
    LastName: {
        type: sequelize_1.DataTypes.STRING
    },
    Number: {
        type: sequelize_1.DataTypes.STRING
    },
    Employee_Email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true
    },
    Password: {
        type: sequelize_1.DataTypes.STRING
    },
    is_admin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_activated: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'Users',
    sequelize,
});
