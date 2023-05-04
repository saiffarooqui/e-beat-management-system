const router = require('express').Router()
const columnCtrl = require('../controllers/columnCtrl')
const auth = require('../middleware/auth')

router.post('/create', auth, columnCtrl.createColumnInfo )

router.post('/data/create', auth, columnCtrl.createData )

router.get('/columninfo/all', auth, columnCtrl.getColumnInfos )

router.get('/columninfo/beatarea/:beatAreaId', auth, columnCtrl.getColumnInfosByBeatArea )

router.get('/columninfo/beatarea/:beatAreaId/table/:tableId', auth, columnCtrl.getColumnInfosByBeatAreaAndTable )

router.get('/data/status', auth, columnCtrl.getDataByStatus)

router.get('/data/beatarea/:beatAreaId', auth, columnCtrl.getDataByBeatArea)

router.get('/data/columninfo/:columnInfoId/beatarea/:beatAreaId/table/:tableId', auth, columnCtrl.getDataByColumnInfoBeatAreaAndTable)

router.get('/data/recent/status', auth, columnCtrl.getRecentDataByStatus)

module.exports = router