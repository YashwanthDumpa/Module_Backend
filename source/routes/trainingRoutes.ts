export {}
const { Router } = require('express');
const {trainingController}  = require('../controllers/trainingController') 

const trainingrRoutes = new Router();

trainingrRoutes.post('/admin', trainingController.createTraining)
trainingrRoutes.get('/get-training-data', trainingController.getTrainingData)
trainingrRoutes.get('/training-request/:training', trainingController.trainingRequest)
trainingrRoutes.get('/deleteTraining/:training',trainingController.trainingDelete)
trainingrRoutes.get('/dashboard',trainingController.dashboard)
trainingrRoutes.get('/recycle-bin',trainingController.recycleBin)
trainingrRoutes.get('/restore/:training',trainingController.restore)



module.exports = trainingrRoutes;
