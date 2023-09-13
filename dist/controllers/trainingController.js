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
exports.trainingController = void 0;
const TrainingRegisteredUser_1 = require("../models/TrainingRegisteredUser");
const { Op } = require("sequelize");
const trainingModel_1 = require("../models/trainingModel");
const jwt = require("jsonwebtoken");
class TrainingController {
    static trainingExists(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const training = yield trainingModel_1.trainingModel.findOne({
                    where: { trainingTitle: data.trainingTitle },
                });
                if (training) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error("Error checking user existence:", error);
                throw error;
            }
        });
    }
    createTraining(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const trainingData = req.body;
            try {
                const trainingExists = yield TrainingController.trainingExists(trainingData);
                if (trainingExists) {
                    res.status(201).json({ message: "Training Already Exists" });
                }
                else {
                    yield trainingModel_1.trainingModel.create(trainingData).then(() => {
                        res.status(201).json({ message: "Training Created Successfully" });
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getTrainingData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization;
            if (token) {
                yield jwt.verify(token, "naren", (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        if ((err === null || err === void 0 ? void 0 : err.name) === "TokenExpiredError") {
                            res.status(200).json({ message: "TokenExpiredError" });
                        }
                        console.log(err);
                    }
                    if (decoded) {
                        console.log("decodded", decoded.userExist);
                        if (decoded.userExist) {
                            const getData = yield trainingModel_1.trainingModel.findAll({
                                where: { is_active: true },
                            });
                            return res
                                .status(200)
                                .json({
                                message: "successfully",
                                trainingData: getData,
                                userName: decoded.userExist.FirstName,
                            });
                        }
                    }
                }));
            }
            else {
                res.status(200).json({ message: "Token Not Found" });
            }
        });
    }
    trainingRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization;
            const trainingName = req.params.training;
            console.log(token);
            console.log(trainingName);
            try {
                if (token) {
                    yield jwt.verify(token, "naren", (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            if ((err === null || err === void 0 ? void 0 : err.name) === "TokenExpiredError") {
                                res.status(200).json({ message: "TokenExpiredError" });
                            }
                            console.log(err);
                        }
                        if (decoded) {
                            console.log("decodded", decoded.userExist);
                            const user = decoded.userExist;
                            if (user) {
                                const training = yield trainingModel_1.trainingModel.findOne({
                                    where: { trainingTitle: trainingName },
                                });
                                console.log("training", training === null || training === void 0 ? void 0 : training.dataValues);
                                if (training === null || training === void 0 ? void 0 : training.dataValues) {
                                    const alreadyRegistered = yield TrainingRegisteredUser_1.TrainingRegisteredUser.findOne({
                                        where: {
                                            [Op.and]: [
                                                { Email: user.Employee_Email },
                                                { trainingTitle: trainingName },
                                            ],
                                        },
                                    });
                                    if (alreadyRegistered === null || alreadyRegistered === void 0 ? void 0 : alreadyRegistered.dataValues) {
                                        res.status(200).json({ message: "already exists" });
                                    }
                                    else {
                                        const trainingCount = yield TrainingRegisteredUser_1.TrainingRegisteredUser.count({
                                            where: { trainingTitle: trainingName },
                                        });
                                        if (trainingCount >= training.dataValues.limit) {
                                            res.status(200).json({ message: "Limit Reached" });
                                        }
                                        else {
                                            const info = {
                                                Email: user.Employee_Email,
                                                Firstname: user.FirstName,
                                                Lastname: user.LastName,
                                                trainingTitle: trainingName,
                                                MobileNumber: user.Number,
                                                RegisteredDateTime: new Date(),
                                                is_disabled: true,
                                            };
                                            console.log("this is info : ", info);
                                            yield TrainingRegisteredUser_1.TrainingRegisteredUser.create(info).then(() => {
                                                res.status(200).json({ message: "success" });
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }));
                }
                else {
                    res.status(200).json({ message: "Token Not Found" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    // delete training
    trainingDelete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization;
            const trainingName = req.params.training;
            if (token) {
                yield jwt.verify(token, "naren", (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        if ((err === null || err === void 0 ? void 0 : err.name) === "TokenExpiredError") {
                            res.status(200).json({ message: "TokenExpiredError" });
                        }
                        console.log(err);
                    }
                    if (decoded) {
                        console.log(decoded.userExist);
                        const trainingExists = yield trainingModel_1.trainingModel.findOne({
                            where: { trainingTitle: trainingName },
                        });
                        if (trainingExists) {
                            yield trainingModel_1.trainingModel.update({ is_active: false }, { where: { trainingTitle: trainingName } });
                            res.status(200).json({ message: "Deleted Successfully" });
                        }
                    }
                }));
            }
        });
    }
    static verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield jwt.verify(token, "naren");
                if (result.error === "TokenExpiredError") {
                    return "TokenExpiredError";
                }
                if (result.userExist) {
                    return result.userExist;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    // Recycle bin
    recycleBin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization;
            try {
                if (token) {
                    const verifiedUser = yield TrainingController.verifyToken(token);
                    if (verifiedUser) {
                        const getData = yield trainingModel_1.trainingModel.findAll({
                            where: { is_active: false },
                        });
                        if (getData) {
                            res
                                .status(200)
                                .json({ message: "successfully", trainingData: getData });
                        }
                        else {
                            res.status(200).json({ message: "No Training Found" });
                        }
                    }
                    else if (verifiedUser === "TokenExpiredError") {
                        res.status(200).json({ message: "TokenExpiredError" });
                    }
                    else {
                        res.status(200).json({ message: "Verification Failed" });
                    }
                }
                else {
                    res.status(200).json({ message: "Token Not Found" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    dashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization;
            try {
                if (token) {
                    const verifiedUser = yield TrainingController.verifyToken(token);
                    if (verifiedUser) {
                        const getData = yield TrainingRegisteredUser_1.TrainingRegisteredUser.findAll({
                            where: { Email: verifiedUser.Employee_Email },
                        });
                        const trainings = yield Promise.all(getData.map((data) => __awaiter(this, void 0, void 0, function* () {
                            const trainingName = yield trainingModel_1.trainingModel.findOne({
                                where: { trainingTitle: data.trainingTitle },
                            });
                            return (trainingName === null || trainingName === void 0 ? void 0 : trainingName.dataValues) || null;
                        })));
                        if (getData) {
                            res
                                .status(200)
                                .json({ message: "successfully", trainingData: trainings });
                        }
                        else {
                            res.status(200).json({ message: "No Training Found" });
                        }
                    }
                    else if (verifiedUser === "TokenExpiredError") {
                        res.status(200).json({ message: "TokenExpiredError" });
                    }
                    else {
                        res.status(200).json({ message: "Verification Failed" });
                    }
                }
                else {
                    res.status(200).json({ message: "Token Not Found" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.trainingController = new TrainingController();
