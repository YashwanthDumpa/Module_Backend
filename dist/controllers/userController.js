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
exports.userController = void 0;
const User_1 = require("../models/User");
class UserController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { EmpId, fname, lname, number, email, password } = req.body;
                var data1 = {
                    EMP_ID: EmpId,
                    FirstName: fname,
                    LastName: lname,
                    Number: number,
                    Employee_Email: email,
                    Password: password
                };
                console.log(data1);
                const userExist = yield User_1.User.findByPk(data1.EMP_ID);
                console.log(userExist);
                if (userExist) {
                    console.log("already exist");
                }
                else {
                    yield User_1.User.create(data1).then(() => {
                        console.log("success");
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'An error occurred' });
            }
        });
    }
}
exports.userController = new UserController();
