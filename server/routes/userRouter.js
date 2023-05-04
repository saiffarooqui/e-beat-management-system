const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')

router.post('/register', userCtrl.register )

router.post('/verify', userCtrl.verify )

router.post('/login', userCtrl.login )

router.get('/unverified-users', auth, userCtrl.getUnverifiedUsers )

router.get('/userinfo', auth, userCtrl.getUserInfo )

router.get('/all', auth, userCtrl.getAllUsers)

router.get('/getNewToken', auth, userCtrl.getNewToken )

router.post('/addSubDivision', auth, userCtrl.addSubDivision )

router.post('/addPoliceStation', auth, userCtrl.addPoliceStation )

router.delete('/deleteSubDivision/:subDivisionId', auth, userCtrl.deleteSubDivision )

router.patch('/updateSubDivision/:subDivisionId', auth, userCtrl.updateSubDivision )

router.delete('/deletePoliceStation/:policeStationId', auth, userCtrl.deletePoliceStation )

router.patch('/updatePoliceStation/:policeStationId', auth, userCtrl.updatePoliceStation )

router.get('/getAllSubDivisions', userCtrl.getAllSubDivisions)

router.get('/getAllPoliceStations', userCtrl.getAllPoliceStations)

router.get('/getPoliceStation/:policeStationId', auth, userCtrl.getPoliceStationById)

router.get('/getSubDivision/:subDivisionId', auth, userCtrl.getSubDivisionById)

router.get('/all/:designation', auth, userCtrl.getUsersByDesignation)

router.get('/assignableUsers/:policeStationId', auth, userCtrl.getAssignableUsers)

router.patch('/verify/:userId', auth, userCtrl.verifyUser )

router.delete('/reject/:userId', auth, userCtrl.rejectUser )

module.exports = router