const router = require('express').Router()
const beatCtrl = require('../controllers/beatCtrl')
const auth = require('../middleware/auth')

router.post('/create', auth, beatCtrl.createBeatArea )

router.get('/beatarea/all', auth, beatCtrl.getAllBeatAreas )

router.get('/beatarea/all/:policeStationId', auth, beatCtrl.getAllBeatAreasOfPoliceStation )

router.get('/beatarea/beatAreaId/:beatAreaId', auth, beatCtrl.getBeatAreaById )

router.post('/table/create', auth, beatCtrl.createTable )

router.post('/beatarea/assign', auth, beatCtrl.assignBeatOfficer )

router.get('/beatofficer/all', auth, beatCtrl.getAllAssignedBeatOfficers )

router.get('/table/all', auth, beatCtrl.getTables)

router.get('/table/:id', auth, beatCtrl.getTableById)

router.get('/beatofficer/policeStation/:policeStationId', auth, beatCtrl.getAssignedBeatOfficersByPoliceStation )

router.get('/beatofficer/beatArea/:beatAreaId', auth, beatCtrl.getAssignedBeatOfficersByBeatArea )

router.get('/beatofficer/beatOfficerId/:beatOfficerId', auth, beatCtrl.getAssignedBeatAreasByBeatOfficer )

router.patch('/beatofficer/unassign/:assignId', auth, beatCtrl.unassignBeatOfficer )

router.patch('/beatarea/update/:id', auth, beatCtrl.updateBeatArea )

router.delete('/beatarea/delete/:id', auth, beatCtrl.deleteBeatArea )

router.get('/data', auth, beatCtrl.getData)

module.exports = router