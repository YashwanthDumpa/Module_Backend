// src/controllers/UserController.ts
import { Request, Response } from 'express';
const jwt = require('jsonwebtoken')
const {Notification} = require('../models/Notification')
class NotificationController {


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


    public async getNotifications(req:Request,res:Response){
        const token:string |undefined = req.headers.authorization
        try {
            if(token){
                const authUser = await NotificationController.verifyToken(token)
                if(authUser){
                    const notificationData = await Notification.findAll()
                    const arr:any[] = []
                    notificationData.map((data: any)=>{
                        arr.push(data.dataValues)
                    })
                    console.log(arr);
                    
                    res.status(200).json({success:true,notification:arr})
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

}
export const notificationController = new NotificationController();