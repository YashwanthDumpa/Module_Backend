export {}
const { Router } = require('express');
const {userController}  = require('../controllers/userController') 

const router = new Router();

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/verify', userController.verify)




module.exports = router;
