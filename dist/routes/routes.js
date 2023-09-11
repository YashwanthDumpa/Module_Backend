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
const { Router } = require('express');
const { userModel } = require('../models');
const router = new Router();
var data1 = {
    EMP_ID: 'jmd234',
    FirstName: "narendra",
    LastName: "godara",
    Number: "9352641216",
    Employee_Email: "narendragodara@jmangroup.com",
    Password: "123456789",
    is_admin: false
};
router.get('/home', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data1);
    console.log(userModel);
    const user = yield userModel.create({
        EMP_ID: 'jmd234',
        FirstName: "narendra",
        LastName: "godara",
        Number: "9352641216",
        Employee_Email: "narendragodara@jmangroup.com",
        Password: "123456789",
        is_admin: false
    });
    res.send(user);
}));
// router.post('/', async (req:any, res:any) => {
//   const { name, email } = req.body;
//   await User.create({ name, email });
//   res.send('post ocurred');
// });
module.exports = router;
