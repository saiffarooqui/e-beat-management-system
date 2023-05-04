const { ContactBook } = require('../models/contactModel')

const contactCtrl = {
    createContact: async (req, res) => {
        try {
            if (!req.body.name || !req.body.phoneNumber) {
            return res.status(400).json({ message: 'Name and phone number are required.' })
        }

        const newContact = new ContactBook({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            createdBy: req.user.user._id
        });
        const contact = await newContact.save()
        res.status(201).json(contact)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    updateContact: async (req, res) => {
        try {
            if (!req.body.name || !req.body.phoneNumber) {
                return res.status(400).json({ message: 'Name and phone number are required.' })
            }

            const contact = await ContactBook.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true }
            )
            if (!contact) {
                return res.status(404).json({ message: 'Contact not found' })
            }
            res.json(contact)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    deleteContact: async (req, res) => {
        try {
            const contact = await ContactBook.findOneAndDelete({
                _id: req.params.id
            })
            if (!contact) {
                return res.status(404).json({ message: 'Contact not found' })
            }
            res.json({ message: 'Contact deleted' })
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    getAllContacts: async (req, res) => {
        try {
            const contacts = await ContactBook.find()
            res.json(contacts)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    getContactById: async (req, res) => {
        try {
            const contact = await ContactBook.findById({ _id: req.params.id })
            if (!contact) {
                return res.status(404).json({ message: 'Contact not found' })
            }
            res.json(contact)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = contactCtrl