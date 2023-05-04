const router = require('express').Router()
const contactCtrl = require('../controllers/contactCtrl')
const auth = require('../middleware/auth')

router.post('/create', auth, contactCtrl.createContact )

router.patch('/update/:id', auth, contactCtrl.updateContact )

router.delete('/delete/:id', auth, contactCtrl.deleteContact )

router.get('/contacts/all', auth, contactCtrl.getAllContacts )

router.get('/getcontact/:id', auth, contactCtrl.getContactById )


module.exports = router