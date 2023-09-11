"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingRegisteredUser = void 0;
const sequelize_1 = require("sequelize");
const sequelize = require("../database/sequelize");
class TrainingRegisteredUser extends sequelize_1.Model {
}
exports.TrainingRegisteredUser = TrainingRegisteredUser;
TrainingRegisteredUser.init({
    Email: {
        type: sequelize_1.DataTypes.STRING
    },
    Firstname: {
        type: sequelize_1.DataTypes.STRING
    },
    Lastname: {
        type: sequelize_1.DataTypes.STRING
    },
    trainingTitle: {
        type: sequelize_1.DataTypes.STRING
    },
    MobileNumber: {
        type: sequelize_1.DataTypes.STRING
    },
    RegisteredDateTime: {
        type: sequelize_1.DataTypes.STRING,
    }
}, {
    tableName: 'TrainingRegisteredUser',
    sequelize,
});
