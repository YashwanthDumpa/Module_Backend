// src/controllers/UserController.tsEmployee_email
export {};
import { Request, Response, response } from "express";
import { TrainingRegisteredUser } from "../models/TrainingRegisteredUser";
const { Op } = require("sequelize");
import { trainingModel } from "../models/trainingModel";
import { Notification } from "../models/Notification";
import { User } from "../models/User";

const jwt = require("jsonwebtoken");

class TrainingController {

  private static async trainingExists(data: any) {
    try {
      const training:trainingModel|null = await trainingModel.findOne({
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
        console.log("training : ",trainingExists);
        
        await trainingModel.create(trainingData).then(async() => {
          const notification_data = {
            trainingTitle:trainingData.trainingTitle,
            description:trainingData.description,
            limit:trainingData.limit
          }
          await Notification.create(notification_data);
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
              where: { isActive: true },
            });

            const trainingDataAndStatus =await Promise.all(getData.map(async(training)=>{
              const trainingDetails = await TrainingRegisteredUser.findOne({where:{[Op.and]:[{email:decoded.userExist.employeeEmail},{trainingTitle:training.trainingTitle}]}})
              
              if(trainingDetails){
                var obj = training.dataValues
                obj['isDisabled']=true
              }else{
                var obj = training.dataValues
                obj['isDisabled']=false

              }
              return obj
            })
            );


            return res
              .status(200)
              .json({
                message: "successfully",
                trainingData: trainingDataAndStatus,
                userName: decoded.userExist.firstName
              });
          }
        }
      });
    } else {
      res.status(200).json({ message: "Token Not Found" });
    }
  }
  public async getUserData(req: Request, res: Response) {
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
            const getData = await User.findAll();
            return res
              .status(200)
              .json({
                message: "successfully",
                userData: getData,
                userName: decoded.userExist.firstName,
              });
          }
        }
      });
    } else {
      res.status(200).json({ message: "Token Not Found" });
    }
  }



  public async adminStatus(req:Request, res: Response){
    const {mailId,token} = req.body;
    console.log(mailId, token);
    
    try {

      if(token && mailId){
        const user = await User.findOne({
          where:{employeeEmail:mailId}
        })
        if(user){
          await User.update({isAdmin:!user.isAdmin}, {where:{employeeEmail:mailId}})
          .then(()=>{
            res.status(200).json({success:true,adminStatus:user.isAdmin})
          })
        }

      }
    } catch (error) {
      
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
                      { email: user.employeeEmail },
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
                      email: user.employeeEmail,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      trainingTitle: trainingName,
                      mobileNumber: user.number,
                      registeredDateTime: new Date(),
                      isDisabled: true,
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
              { isActive: false },
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
            where: { isActive: false },
          });
          if (getData) {
            res
              .status(200)
              .json({ message: "successfully", trainingData: getData,userName: verifiedUser.firstName, });
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
            where: { email: verifiedUser.employeeEmail },
          });
          
          if (getData) {
            const trainings = await Promise.all(
              getData.map(async (data) => {
                const trainingName = await trainingModel.findOne({
                  where: { trainingTitle: data.trainingTitle },
                });
                const obj = trainingName?.dataValues
                obj['registeredDateTime']= data.registeredDateTime
                return obj;
              })
            );
            res
              .status(200)
              .json({ message: "successfully", trainingData: trainings,userName:verifiedUser.firstName });
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
              { isActive: true },
              { where: { trainingTitle: trainingName } }
            );
            res.status(200).json({ message: "Restored Successfully" });
          }
        }
      });
    }
  }


  public async getOngoingTraining(req:Request, res:Response){
    const token = req.headers.authorization
    try {
      if(token){
        const authUser = await TrainingController.verifyToken(token)
        if(authUser){
          const todayDate = new Date()
          const getData = await trainingModel.findAll({
            where: {
              startDateTime: {
                [Op.lte]: todayDate.toISOString().substring(0, 10), // Convert today to 'YYYY-MM-DD' format
              },
              endDateTime: {
                [Op.gte]: todayDate.toISOString().substring(0, 10), // Exclude trainings where endDateTime is in the past
              },
            },
          });
          
          return res
            .status(200)
            .json({
              message: "successfully",
              getOngoingTraining: getData,
            });
        }
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  public async getRegisteredTraining(req:Request, res:Response){
    const token = req.headers.authorization
    try {
      if(token){
        const authUser = await TrainingController.verifyToken(token)
        if(authUser){
          const getData = await TrainingRegisteredUser.findAll({
            where: {
              email:authUser.employeeEmail
            },
          });

          const registeredTrainings =await Promise.all(getData.map(async(training)=>{
            const trainingDetails = await trainingModel.findOne({where:{trainingTitle:training.trainingTitle}})
            return trainingDetails
          })
          );
          
          return res
            .status(200)
            .json({
              message: "successfully",
              getRegisteredTraining: registeredTrainings,
            });
        }
      }
    } catch (error) {
      console.log(error);
      
    }
  }
}

export const trainingController = new TrainingController();
