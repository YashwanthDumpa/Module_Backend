// src/controllers/UserController.ts
export {};
import { Request, Response } from "express";
import { TrainingRegisteredUser } from "../models/TrainingRegisteredUser";
const { Op } = require("sequelize");
import { trainingModel } from "../models/trainingModel";
const jwt = require("jsonwebtoken");

class TrainingController {

  private static async trainingExists(data: any) {
    try {
      const training = await trainingModel.findOne({
        where: { trainingTitle: data.trainingTitle },
      });
      if (training) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error;
    }
  }

  public async createTraining(req: Request, res: Response) {
    const trainingData = req.body;
    try {
      const trainingExists = await TrainingController.trainingExists(
        trainingData
      );
      if (trainingExists) {
        res.status(201).json({ message: "Training Already Exists" });
      } else {
        await trainingModel.create(trainingData).then(() => {
          res.status(201).json({ message: "Training Created Successfully" });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getTrainingData(req: Request, res: Response) {
    const token = req.headers.authorization;
    if (token) {
      await jwt.verify(token, "naren", async (err: any, decoded: any) => {
        if (err) {
          if (err?.name === "TokenExpiredError") {
            res.status(200).json({ message: "TokenExpiredError" });
          }
          console.log(err);
        }
        if (decoded) {
          console.log("decodded", decoded.userExist);
          if (decoded.userExist) {
            const getData = await trainingModel.findAll({
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
      });
    } else {
      res.status(200).json({ message: "Token Not Found" });
    }
  }

  public async trainingRequest(req: Request, res: Response) {
    const token = req.headers.authorization;
    const trainingName = req.params.training;
    console.log(token);
    console.log(trainingName);
    try {
      if (token) {
        await jwt.verify(token, "naren", async (err: any, decoded: any) => {
          if (err) {
            if (err?.name === "TokenExpiredError") {
              res.status(200).json({ message: "TokenExpiredError" });
            }
            console.log(err);
          }
          if (decoded) {
            console.log("decodded", decoded.userExist);
            const user = decoded.userExist;
            if (user) {
              const training = await trainingModel.findOne({
                where: { trainingTitle: trainingName },
              });
              console.log("training", training?.dataValues);
              if (training?.dataValues) {
                const alreadyRegistered = await TrainingRegisteredUser.findOne({
                  where: {
                    [Op.and]: [
                      { Email: user.Employee_Email },
                      { trainingTitle: trainingName },
                    ],
                  },
                });
                if (alreadyRegistered?.dataValues) {
                  res.status(200).json({ message: "already exists" });
                } else {
                  const trainingCount = await TrainingRegisteredUser.count({
                    where: { trainingTitle: trainingName },
                  });
                  if (trainingCount >= training.dataValues.limit) {
                    res.status(200).json({ message: "Limit Reached" });
                  } else {
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

                    await TrainingRegisteredUser.create(info).then(() => {
                      res.status(200).json({ message: "success" });
                    });
                  }
                }
              }
            }
          }
        });
      } else {
        res.status(200).json({ message: "Token Not Found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // delete training

  public async trainingDelete(req: Request, res: Response) {
    const token = req.headers.authorization;
    const trainingName = req.params.training;
    if (token) {
      await jwt.verify(token, "naren", async (err: any, decoded: any) => {
        if (err) {
          if (err?.name === "TokenExpiredError") {
            res.status(200).json({ message: "TokenExpiredError" });
          }
          console.log(err);
        }
        if (decoded) {
          console.log(decoded.userExist);
          const trainingExists = await trainingModel.findOne({
            where: { trainingTitle: trainingName },
          });
          if (trainingExists) {
            await trainingModel.update(
              { is_active: false },
              { where: { trainingTitle: trainingName } }
            );
            res.status(200).json({ message: "Deleted Successfully" });
          }
        }
      });
    }
  }
// token verification

  private static async verifyToken(token: string) {
    try {
      const result = await jwt.verify(token, "naren");

      if (result.error === "TokenExpiredError") {
        return "TokenExpiredError";
      }
      if (result.userExist) {
        return result.userExist;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Recycle bin

  public async recycleBin(req: Request, res: Response) {
    const token = req.headers.authorization;
    try {
      if (token) {
        const verifiedUser: any = await TrainingController.verifyToken(token);
        if (verifiedUser) {
          const getData = await trainingModel.findAll({
            where: { is_active: false },
          });
          if (getData) {
            res
              .status(200)
              .json({ message: "successfully", trainingData: getData });
          } else {
            res.status(200).json({ message: "No Training Found" });
          }
        } else if (verifiedUser === "TokenExpiredError") {
          res.status(200).json({ message: "TokenExpiredError" });
        } else {
          res.status(200).json({ message: "Verification Failed" });
        }
      } else {
        res.status(200).json({ message: "Token Not Found" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async dashboard(req: Request, res: Response) {
    const token = req.headers.authorization;
    try {
      if (token) {
        const verifiedUser: any = await TrainingController.verifyToken(token);
        if (verifiedUser) {
          const getData = await TrainingRegisteredUser.findAll({
            where: { Email: verifiedUser.Employee_Email },
          });
          const trainings = await Promise.all(
            getData.map(async (data) => {
              const trainingName = await trainingModel.findOne({
                where: { trainingTitle: data.trainingTitle },
              });
              return trainingName?.dataValues || null;
            })
          );
          if (getData) {
            res
              .status(200)
              .json({ message: "successfully", trainingData: trainings });
          } else {
            res.status(200).json({ message: "No Training Found" });
          }
        } else if (verifiedUser === "TokenExpiredError") {
          res.status(200).json({ message: "TokenExpiredError" });
        } else {
          res.status(200).json({ message: "Verification Failed" });
        }
      } else {
        res.status(200).json({ message: "Token Not Found" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async restore(req:Request,res:Response){
    const token = req.headers.authorization;
    const trainingName = req.params.training;
    if (token) {
      await jwt.verify(token, "naren", async (err: any, decoded: any) => {
        if (err) {
          if (err?.name === "TokenExpiredError") {
            res.status(200).json({ message: "TokenExpiredError" });
          }
          console.log(err);
        }
        if (decoded) {
          console.log(decoded.userExist);
          const trainingExists = await trainingModel.findOne({
            where: { trainingTitle: trainingName },
          });
          if (trainingExists) {
            await trainingModel.update(
              { is_active: true },
              { where: { trainingTitle: trainingName } }
            );
            res.status(200).json({ message: "Restored Successfully" });
          }
        }
      });
    }
  }

}

export const trainingController = new TrainingController();
