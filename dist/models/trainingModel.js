"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainingModel = void 0;
const sequelize_1 = require("sequelize");
const sequelize = require("../database/sequelize");
class trainingModel extends sequelize_1.Model {
}
exports.trainingModel = trainingModel;
trainingModel.init({
    trainingTitle: {
        type: sequelize_1.DataTypes.STRING
    },
    skillTitle: {
        type: sequelize_1.DataTypes.STRING
    },
    skillCategory: {
        type: sequelize_1.DataTypes.STRING
    },
    startDateTime: {
        type: sequelize_1.DataTypes.STRING
    },
    endDateTime: {
        type: sequelize_1.DataTypes.STRING
    },
    description: {
        type: sequelize_1.DataTypes.STRING
    },
    limit: {
        type: sequelize_1.DataTypes.INTEGER,
    }
}, {
    tableName: 'TrainingDetails',
    sequelize,
});
