// src/controllers/UserController.ts
import { Request, Response } from 'express';
import { User } from '../models/User';
const {Op} = require('sequelize')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')
const url = require('url')
const dotenv = require('dotenv')
dotenv.config()
class UserController {
  // User Registration
  private static async userExists(data:any){
    try {
      const user = await User.findOne({where: {[Op.or]:[{EMP_ID: data.EMP_ID} ,{Employee_Email:data.Employee_Email}]}});
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw error; 
    }
  }

private static async emailVerificationLink(token: any, hashUser: any){
  console.log("madhumita mazundar")
  const transporter = await nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: hashUser.Employee_Email,
    subject: process.env.SMTP_SUBJECT,
    text: `Please click the following link to verify your email: ${process.env.url}/verify?token=${token}`,
  };
  await transporter.sendMail(mailOptions, (err: any,info: any)=>{
    if (err){
      console.log(err);
    }
      if(info.response){
        console.log(info.response);
      }
  })
}

  public async registerUser(req: Request, res: Response) {
    const {EmpId,fname,lname,number,email,password} = req.body
    try {      
      if(EmpId && fname && number && email && password){
        var userData = {
          EMP_ID: EmpId,
          FirstName: fname,
          LastName: lname,
          Number: number,
          Employee_Email: email,
          Password: password
        }
            const userAlreadyExist = await UserController.userExists(userData)
            if(userAlreadyExist){
              res.status(200).json({ message: "User Already Registered" })
            }else{
              await bcrypt.hash(userData.Password,10,async (err: any, hash: any)=>{
                if(err){res.status(500).json({ message: "Server Error" })}
                if(hash){
                  const hashUser = {
                    EMP_ID: EmpId,
                    FirstName: fname,
                    LastName: lname,
                    Number: number,
                    Employee_Email: email,
                    Password: hash
                  }
                  const token = await UserController.createJwtToken(hashUser)
                  await UserController.emailVerificationLink(token, hashUser).then(async ()=>{
                    await User.create(hashUser).then(()=>{
                      res.status(200).json({message:"email sent"})
                    }).catch((error:any)=>{
                      console.log(error);
                    })
                  })
                }
              })
            }
      }else{
        res.json({ message: "empty data" })
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }

  private static async verifyToken(token:string){
    await jwt.verify(token,"naren",async (err: any,decoded: any)=>{
      if(err){
          if (err?.name === 'TokenExpiredError') {
              return false
              }
          console.log(err);
      }
      if(decoded){
          console.log("decodded", decoded.userExist);
          if(decoded.userExist){
              const userVerification = await User.findOne({where:{[Op.and]:[{EMP_ID:decoded.userExist.EMP_ID},{Employee_Email:decoded.userExist.Employee_Email}]}})
              console.log("query : ",userVerification?.dataValues);
              if(userVerification){
                await User.update({is_activated:true},{where:{[Op.and]:[{EMP_ID:decoded.userExist.EMP_ID},{Employee_Email:decoded.userExist.Employee_Email}]}})
              }
          }
      }
  })
  }

  public async verify(req: Request, res: Response){
    const parsedUrl = await url.parse(req.url,true)
    console.log(parsedUrl);
    console.log("parser token : ",parsedUrl.query.token)
    await UserController.verifyToken(parsedUrl.query.token).then(()=>{
      res.send("<h1>Verification success</h1>")
    })
  }

  private static async createJwtToken(userExist:any){
    const token = await jwt.sign({userExist}, 'naren', { expiresIn: '1h' })
    return token
  }
  
  // User Login

  public async loginUser(req: Request, res: Response) {
    const {email,password} = req.body
    try {      
       var loginData = {
    Employee_Email: email,
    Password: password
    }
      console.log(loginData);
      const userExist = await User.findOne({where: {Employee_Email: loginData.Employee_Email}})
      console.log(userExist?.dataValues);
      if(userExist){
        if(userExist.dataValues.is_activated){
          bcrypt.compare(loginData.Password,userExist.dataValues.Password,async (err: any, result: any)=>{
            if(err){res.status(500).json({ message: "Server Error" })}
            if(result){
              // const token = await jwt.sign({userExist}, 'naren', { expiresIn: '1h' })
              const token = await UserController.createJwtToken(userExist)
              if(userExist.dataValues.is_admin){
                res.status(200).json({ message: "Login-admin", data: userExist, token })
              }else{
                res.status(200).json({ message: "Login", data: userExist, token })
              }
            }else{
              res.status(200).json({ message: "password not matching" })
            }
          })
        }else{
          res.status(200).json({ message: "Activation Required" })
        }
      }else{
        res.status(200).json({ message: "User Not Found" })
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }
}
export const userController = new UserController();