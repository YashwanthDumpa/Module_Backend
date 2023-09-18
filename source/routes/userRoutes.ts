export {}
const { Router } = require('express');
const {userController}  = require('../controllers/userController') 
const {notificationController} = require("../controllers/notificationController")
const router = new Router();

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/verify', userController.verify)

router.get('/notification',notificationController.getNotifications)


module.exports = router;
