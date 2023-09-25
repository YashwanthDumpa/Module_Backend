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
const { Op } = require('sequelize');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const url = require('url');
const dotenv = require('dotenv');
dotenv.config();
class UserController {
    // User Registration
    static userExists(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findOne({ where: { [Op.or]: [{ EMP_ID: data.EMP_ID }, { Employee_Email: data.Employee_Email }] } });
                if (user) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error('Error checking user existence:', error);
                throw error;
            }
        });
    }
    static emailVerificationLink(token, hashUser) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("madhumita mazundar");
            const transporter = yield nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            const mailOptions = {
                from: process.env.SMTP_FROM,
                to: hashUser.Employee_Email,
                subject: process.env.SMTP_SUBJECT,
                text: `Please click the following link to verify your email: ${process.env.url}/verify?token=${token}`,
            };
            yield transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                }
                if (info.response) {
                    console.log(info.response);
                }
            });
        });
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { EmpId, fname, lname, number, email, password } = req.body;
            try {

                if (EmpId && fname && number && email && password) {
                    const emailRegex = /@jmangroup\.com$/;

        if (!emailRegex.test(email)) {

          return res.status(400).json({ message: "Invalid email format" });

        }

 

        // Check if the number contains digits

        const numberRegex = /^\d+$/;

        if (!numberRegex.test(number)) {

          return res.status(400).json({ message: "Number should contain digits only" });

        }

 

        // Check if the password meets the criteria

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {

          return res.status(400).json({

            message:

              "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",

          });
                    var userData = {
                        EMP_ID: EmpId,
                        FirstName: fname,
                        LastName: lname,
                        Number: number,
                        Employee_Email: email,
                        Password: password
                    };
                    const userAlreadyExist = yield UserController.userExists(userData);
                    if (userAlreadyExist) {
                        res.status(200).json({ message: "User Already Registered" });
                    }
                    else {
                        yield bcrypt.hash(userData.Password, 10, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                res.status(500).json({ message: "Server Error" });
                            }
                            if (hash) {
                                const hashUser = {
                                    EMP_ID: EmpId,
                                    FirstName: fname,
                                    LastName: lname,
                                    Number: number,
                                    Employee_Email: email,
                                    Password: hash
                                };
                                const token = yield UserController.createJwtToken(hashUser);
                                yield UserController.emailVerificationLink(token, hashUser).then(() => __awaiter(this, void 0, void 0, function* () {
                                    yield User_1.User.create(hashUser).then(() => {
                                        res.status(200).json({ message: "email sent" });
                                    }).catch((error) => {
                                        console.log(error);
                                    });
                                }));
                            }
                        }));
                    }
                }
                else {
                    res.json({ message: "empty data" });
                }
            }
        }
            catch (error) {
                res.status(500).json({ error: 'An error occurred' });
            }
        });
    }
    static verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield jwt.verify(token, "naren", (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    if ((err === null || err === void 0 ? void 0 : err.name) === 'TokenExpiredError') {
                        return false;
                    }
                    console.log(err);
                }
                if (decoded) {
                    console.log("decodded", decoded.userExist);
                    if (decoded.userExist) {
                        const userVerification = yield User_1.User.findOne({ where: { [Op.and]: [{ EMP_ID: decoded.userExist.EMP_ID }, { Employee_Email: decoded.userExist.Employee_Email }] } });
                        console.log("query : ", userVerification === null || userVerification === void 0 ? void 0 : userVerification.dataValues);
                        if (userVerification) {
                            yield User_1.User.update({ is_activated: true }, { where: { [Op.and]: [{ EMP_ID: decoded.userExist.EMP_ID }, { Employee_Email: decoded.userExist.Employee_Email }] } });
                        }
                    }
                }
            }));
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedUrl = yield url.parse(req.url, true);
            console.log(parsedUrl);
            console.log("parser token : ", parsedUrl.query.token);
            yield UserController.verifyToken(parsedUrl.query.token).then(() => {
                res.send("<h1>Verification success</h1>");
            });
        });
    }
    static createJwtToken(userExist) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield jwt.sign({ userExist }, 'naren', { expiresIn: '1h' });
            return token;
        });
    }
    // User Login
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                var loginData = {
                    Employee_Email: email,
                    Password: password
                };
                console.log(loginData);
                const userExist = yield User_1.User.findOne({ where: { Employee_Email: loginData.Employee_Email } });
                console.log(userExist === null || userExist === void 0 ? void 0 : userExist.dataValues);
                if (userExist) {
                    if (userExist.dataValues.is_activated) {
                        bcrypt.compare(loginData.Password, userExist.dataValues.Password, (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                res.status(500).json({ message: "Server Error" });
                            }
                            if (result) {
                                // const token = await jwt.sign({userExist}, 'naren', { expiresIn: '1h' })
                                const token = yield UserController.createJwtToken(userExist);
                                if (userExist.dataValues.is_admin) {
                                    res.status(200).json({ message: "Login-admin", data: userExist, token });
                                }
                                else {
                                    res.status(200).json({ message: "Login", data: userExist, token });
                                }
                            }
                            else {
                                res.status(200).json({ message: "password not matching" });
                            }
                        }));
                    }
                    else {
                        res.status(200).json({ message: "Activation Required" });
                    }
                }
                else {
                    res.status(200).json({ message: "User Not Found" });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'An error occurred' });
            }
        });
    }
}
exports.userController = new UserController();
