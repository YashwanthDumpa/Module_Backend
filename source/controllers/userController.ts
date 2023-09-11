// src/controllers/UserController.ts
import { Request, Response } from 'express';
import { User } from '../models/User';
const {Op} = require('sequelize')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

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
            console.log(userData);
            
            // const userAlreadyExist = await User.findOne({where: {[Op.or]:[{EMP_ID: userData.EMP_ID} ,{Employee_Email:userData.Employee_Email}]}});
            const userAlreadyExist = await UserController.userExists(userData)
            // const emailExist = await User.findOne(userData.Employee_Email)
            // console.log("email : ",emailExist);
            // console.log("userExist : ",userAlreadyExist?.dataValues);
            

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
                  await User.create(hashUser).then(()=>{
                    res.status(201).json({ message: "User Created" })
                  }).catch((error:any)=>{
                    console.log(error);
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
        res.status(200).json({ message: "User Not Found" })
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }
}
export const userController = new UserController();





 
 

  

