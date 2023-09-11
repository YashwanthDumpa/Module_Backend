"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// src/models/User.ts
const sequelize_1 = require("sequelize");
const sequelize = require("../database/sequelize");
const bcrypt = require("bcrypt");
class User extends sequelize_1.Model {
    hashPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.Password = yield bcrypt.hash(this.Password, 10); // 10 is the number of salt rounds
                console.log('Password hashed successfully:', this.Password);
            }
            catch (error) {
                console.error('Error hashing password:', error);
            }
        });
    }
    // Hook to hash the password before saving
    beforeCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hashPassword();
        });
    }
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
    }
}, {
    tableName: 'Users',
    sequelize,
});
