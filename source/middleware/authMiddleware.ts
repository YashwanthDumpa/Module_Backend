// // authMiddleware.js
// const jwt = require('jsonwebtoken');
// const { jwtSecret } = require('../config/config');
// const User = require('../models/User')
// import { Request, Response } from 'express';
// const authenticateJWT = (req:Request, res:Response, next:any) => {
//   const token = req.header('Authorization');
//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   jwt.verify(token, 'naren', async (err: any, decodded: any) => {
//     if (err) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }
//     if(decodded){
//         var user = await User.findOne({where:{EMP_ID:decodded.userExist.EMP_ID}})
//         res.status(200).json({user})
//     }
//     next();
//   });
// };

// module.exports = { authenticateJWT };
