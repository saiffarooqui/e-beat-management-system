const { Users, SubDivision, PoliceStation } = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

const userCtrl = {
    register: async (req, res) => {
        try {
            const { fullName, phoneNumber, district, designation, subDivision, policeStation, avatar } = req.body
            if (!avatar) {
                return res.status(400).json({ msg: 'Avatar is required' })
            }
            const newUser = await Users.findOne({phoneNumber})
            if (newUser && newUser.registered) return res.status(400).json({ msg: 'Already registered'})
            
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOtp = await bcrypt.hash(otp, 10);
            const otpCreatedTime = Date.now()

            if (newUser && !newUser.registered) {
                await Users.findOneAndUpdate({phoneNumber}, {
                    otp: hashedOtp,
                    otpCreatedAt: otpCreatedTime
                })
                return res.status(200).json({ msg: 'OTP sent for verification.', otp})
            }
            
            const user = new Users({ fullName, phoneNumber, district, designation, avatar });
            if (designation !== 'sp') {
                user.subDivision = subDivision;
                user.policeStation = policeStation;
            }
            user.otp = hashedOtp;
            user.otpCreatedAt = Date.now();
            await user.save();
            // await client.messages.create({
            //     body: `Greetings from Goa Police. Your OTP is ${otp}`,
            //     from: process.env.TWILIO_PHONE_NUMBER,
            //     to: phone
            // }).then(message => console.log(message))

            res.status(201).json({ msg: 'OTP sent for verification.', otp})
        } catch (err) {
            return res.status(500).json({ msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const { phoneNumber } = req.body
            const user = await Users.findOne({phoneNumber})
            if (!user) return res.status(404).json({ msg: 'User not found.'})
            if (user && !user.registered) return res.status(400).json({ msg: 'User not registered. Please Register.'})

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOtp = await bcrypt.hash(otp, 10);
            const otpCreatedTime = Date.now()
            await Users.findOneAndUpdate({phoneNumber}, {
                otp: hashedOtp,
                otpCreatedAt: otpCreatedTime
            })
            // await client.messages.create({
            //     body: `Greetings from Goa Police. Your OTP is ${otp}`,
            //     from: process.env.TWILIO_PHONE_NUMBER,
            //     to: phone
            // }).then(message => console.log(message))
            console.log(otp)
            res.status(200).json({ msg: 'OTP sent for verification.', otp})
        } catch (err) {
            return res.status(500).json({ msg: err.message})
        }
    },
    verify: async (req, res) => {
        try {
            const { phoneNumber, otp } = req.body;
            if (otp.length < 6) return res.status(400).json({ msg: 'Invalid OTP' })
            const user = await Users.findOne({ phoneNumber })
                .populate({ path: 'subDivision', select: 'name _id' })
                .populate({ path: 'policeStation', select: 'name _id' })
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (Date.now() - user.otpCreatedAt > OTP_EXPIRY_TIME) {
                return res.status(400).json({ error: 'OTP expired' });
            }
            const isMatch = await bcrypt.compare(otp, user.otp);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid OTP' })

            await Users.findOneAndUpdate({ phoneNumber }, {
                otp: "",
                otpCreatedAt: "",
                registered: true
            })

            user.otp = "";
            user.otpCreatedAt = "";
            user.registered = true;

            const token = createToken({ user })

            if (!user.verified) return res.status(200).json({ msg: 'OTP verified. Waiting for admin verification', user, token })

            res.status(200).json({ msg: 'OTP verified. User logged in', user, token })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUnverifiedUsers: async (req, res) => {
        try {
            const user = req.user.user
            let query = { verified: false, registered: true }
            if (user.designation === 'admin') {
                query.designation = { $in: ['sp', 'dsp', 'pi', 'psi', 'hc', 'constable'] }
            } else if (user.designation === 'sp') {
                query.designation = 'dsp'
            } else if (user.designation === 'dsp') {
                query.designation = 'pi'
                query.subDivision = user.subDivision
            } else if (user.designation === 'pi') {
                query.designation = { $in: ['psi', 'hc', 'constable'] }
                query.subDivision = user.subDivision
                query.policeStation = user.policeStation
            } else {
                return res.status(403).json({ msg: 'You do not have permission to access this resource' })
            }
            const users = await Users.find(query).select(['-otp', '-otpCreatedAt'])
            res.json(users)
        } catch (err) {
            return res.status(500).json({ msg: err.message})
        }
    },
    verifyUser: async (req, res) => {
        try {
            const user = req.user.user;
            const userId = req.params.userId;
            let query = { _id: userId, verified: false, registered: true };
            if (user.designation === 'admin') {
                query.designation = { $in: ['sp', 'dsp', 'pi', 'psi', 'hc', 'constable'] };
            } else if (user.designation === 'sp') {
                query.designation = 'dsp';
            } else if (user.designation === 'dsp') {
                query.designation = 'pi';
                query.subDivision = user.subDivision;
            } else if (user.designation === 'pi') {
                query.designation = { $in: ['psi', 'hc', 'constable'] };
                query.subDivision = user.subDivision;
                query.policeStation = user.policeStation;
            } else {
                return res.status(403).json({ msg: 'You do not have permission to access this resource' });
            }
            const updatedUser = await Users.findOneAndUpdate(query, { verified: true }, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ msg: 'User not found or already verified' });
            }
            res.json(updatedUser);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    rejectUser: async (req, res) => {
        try {
            const user = req.user.user
            const userId = req.params.userId
            console.log(userId)
            let query = { _id: userId, registered: true }
            if (user.designation === 'admin') {
                query.designation = { $in: ['sp', 'dsp', 'pi', 'psi', 'hc', 'constable'] }
            } else if (user.designation === 'sp') {
                query.designation = 'dsp'
            } else if (user.designation === 'dsp') {
                query.designation = 'pi'
                query.subDivision = user.subDivision;
            } else if (user.designation === 'pi') {
                query.designation = { $in: ['psi', 'hc', 'constable'] }
                query.subDivision = user.subDivision
                query.policeStation = user.policeStation
            } else {
                return res.status(403).json({ msg: 'You do not have permission to access this resource' })
            }
            const deletedUser = await Users.findOneAndDelete(query)
            
            if (!deletedUser) {
                return res.status(404).json({ msg: 'User not found' })
            }
            res.json(deletedUser)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserInfo: async (req, res) => {
        try {
            const user = req.user.user
            if(!user) return res.status(400).json({msg: "User not found"})

            res.json(user)     
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getNewToken: async (req, res) => {
        try {
            const _id = req.user.user._id
            const user = await Users.findById(_id)
                .populate({ path: 'subDivision', select: 'name' })
                .populate({ path: 'policeStation', select: 'name' })
                .select('-otp -otpCreatedAt')
            if (!user) return res.status(400).json({ msg: "User not found" })

            const token = createToken({ user })

            res.status(200).json({ msg: 'New token generated', user, token })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateProfile: async (req, res) => {
        try {
            const user = req.user.user;
            if (user.designation === 'admin') {
                return res.status(403).json({ msg: 'Admins cannot update their profile' });
            }
            const { fullName, district, designation, subDivision, policeStation, avatar } = req.body;
            if (!avatar) {
                return res.status(400).json({ msg: 'Avatar is required' });
            }
            const updatedUser = await Users.findOneAndUpdate(
                { _id: user._id },
                { fullName, district, designation, subDivision, policeStation, avatar, verified: false },
                { new: true }
            );
            res.json(updatedUser);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    addSubDivision: async (req, res) => {
        try {
            const { name, district } = req.body;
            const user = req.user.user;
            if (!['sp', 'admin'].includes(user.designation)) {
                return res.status(403).json({ msg: 'Only SP or Admin can add subDivisions' });
            }
            const newSubDivision = new SubDivision({ name, district });
            await newSubDivision.save();
            res.status(201).json({ msg: 'SubDivision added successfully' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    addPoliceStation: async (req, res) => {
        try {
            const { name, subDivision } = req.body;
            const user = req.user.user;
            if (!['dsp', 'admin'].includes(user.designation)) {
                return res.status(403).json({ msg: 'Only DSP or Admin can add police stations' });
            }
            const newPoliceStation = new PoliceStation({ name, subDivision });
            await newPoliceStation.save();
            res.status(201).json({ msg: 'Police station added successfully' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteSubDivision: async (req, res) => {
        try {
            const { subDivisionId } = req.params;
            const user = req.user.user;
            if (!['sp', 'admin'].includes(user.designation)) {
                return res.status(403).json({ msg: 'Only SP or Admin can delete subDivisions' });
            }
            await SubDivision.findByIdAndDelete(subDivisionId);
            await PoliceStation.deleteMany({ subDivision: subDivisionId });
            res.status(200).json({ msg: 'SubDivision and associated police stations deleted successfully' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateSubDivision: async (req, res) => {
        try {
            const { name, district } = req.body;
            const { subDivisionId } = req.params;
            const user = req.user.user;
            if (!['sp', 'admin'].includes(user.designation)) {
                return res.status(403).json({ msg: 'Only SP or Admin can update subDivisions' });
            }
            await SubDivision.findByIdAndUpdate(subDivisionId, { name, district });
            res.status(200).json({ msg: 'SubDivision updated successfully' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updatePoliceStation: async (req, res) => {
        try {
            const { name, subDivision } = req.body;
            const { policeStationId } = req.params;
            const user = req.user.user;
            if (!['dsp', 'admin'].includes(user.designation)) {
                return res.status(403).json({ msg: 'Only DSP or Admin can update police stations' });
            }
            await PoliceStation.findByIdAndUpdate(policeStationId, { name, subDivision });
            res.status(200).json({ msg: 'Police station updated successfully' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deletePoliceStation: async (req, res) => {
        try {
            const { policeStationId } = req.params;
            const user = req.user.user;
            if (!['dsp', 'admin'].includes(user.designation)) {
                return res.status(403).json({ msg: 'Only DSP or Admin can delete police stations' });
            }
            await PoliceStation.findByIdAndDelete(policeStationId);
            res.status(200).json({ msg: 'Police station deleted successfully' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getAllSubDivisions: async (req, res) => {
        try {
            const subDivisions = await SubDivision.find();
            res.json(subDivisions);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getAllPoliceStations: async (req, res) => {
        try {
            const policeStations = await PoliceStation.find()
                .populate('subDivision', 'name')
            res.json(policeStations);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getPoliceStationById: async (req, res) => {
        try {
            const { policeStationId } = req.params
            const policeStations = await PoliceStation.findById({ _id: policeStationId })
                .populate('subDivision', 'name')
            res.json(policeStations);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getSubDivisionById: async (req, res) => {
        try {
            const { subDivisionId } = req.params
            const subDivision = await SubDivision.findById({ _id: subDivisionId })
            res.json(subDivision);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await Users.find().select(['-otp', '-otpCreatedAt']);
            res.json(users);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getAssignableUsers: async (req, res) => {
        try {
            const policeStationId = req.params.policeStationId;
            const assignableUsers = await Users.find({
                policeStation: policeStationId,
                designation: { $in: ['psi', 'hc', 'constable'] },
                verified: true,
                archived: false
            })
            .populate('policeStation', 'name')
            .populate('subDivision', 'name')
            res.json(assignableUsers)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUsersByDesignation: async (req, res) => {
        try {
            const designation = req.params.designation;
            if (!['sp', 'dsp', 'pi', 'psi', 'hc', 'constable', 'admin'].includes(designation)) {
                return res.status(400).json({ msg: 'Invalid designation' });
            }
            const users = await Users.find({ designation }).select(['-otp', '-otpCreatedAt']);
            res.json(users);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}

const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'})
}

module.exports = userCtrl