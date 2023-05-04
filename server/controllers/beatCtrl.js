const { Users, SubDivision, PoliceStation } = require('../models/userModel')
const { BeatArea, Table, Data, Assign } = require('../models/beatModel')
const { ColumnInfo } = require('../models/columnInfoModel')

const beatCtrl = {
    createBeatArea: async (req, res) => {
        try {
            const { name, geometry } = req.body;
            const { designation, policeStation } = req.user.user;

            if (!['pi'].includes(designation)) {
                return res.status(403).json({ msg: "You are not authorized to create BeatAreas." });
            }

            const newBeatArea = new BeatArea({
                name,
                policeStation,
                geometry
            });

            await newBeatArea.save();

            res.status(201).json(newBeatArea);
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    getAllBeatAreas: async (req, res) => {
        try {
            const beatAreas = await BeatArea.find()
                .populate({
                    path: 'policeStation',
                    select: 'name subDivision',
                    populate: {
                        path: 'subDivision',
                        select: 'name'
                    }
                })
            res.status(200).json(beatAreas);
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    getAllBeatAreasOfPoliceStation: async (req, res) => {
        try {
            const { policeStationId } = req.params
            const beatAreas = await BeatArea.find({ policeStation: policeStationId})
                .populate({
                    path: 'policeStation',
                    select: 'name subDivision',
                    populate: {
                        path: 'subDivision',
                        select: 'name'
                    }
                })
            res.status(200).json(beatAreas)
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    getBeatAreaById: async (req, res) => {
        try {
            const { beatAreaId } = req.params
            const beatAreas = await BeatArea.findById(beatAreaId)
                .populate({
                    path: 'policeStation',
                    select: 'name subDivision',
                    populate: {
                        path: 'subDivision',
                        select: 'name'
                    }
                })
            res.status(200).json(beatAreas);
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    updateBeatArea: async (req, res) => {
            try {
            const { id } = req.params;
            const { name, geometry } = req.body;
            const { designation } = req.user.user;

            if (!['pi'].includes(designation)) {
                return res.status(403).json({ msg: "You are not authorized to update BeatAreas." });
            }

            const beatArea = await BeatArea.findById(id);

            if (!beatArea) {
                return res.status(404).json({ msg: "BeatArea not found." });
            }

            if (name) beatArea.name = name;
            if (geometry) {
                beatArea.geometry = geometry;
                beatArea.geometry.type = 'Polygon';
            }

            await beatArea.save();

            res.json(beatArea);
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    deleteBeatArea: async (req, res) => {
        try {
            const { id } = req.params;
            const { designation } = req.user.user;

            if (!['admin', 'pi'].includes(designation)) {
                return res.status(403).json({ msg: "You are not authorized to delete BeatAreas." });
            }
            const beatArea = await BeatArea.findById({_id: id});

            if (!beatArea) {
                return res.status(404).json({ msg: "BeatArea not found." });
            }

            await BeatArea.findByIdAndDelete({_id: id})
            res.json({msg: "Beat Area Deleted Successfully!"})
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    createTable: async (req, res) => {
        try {
            const { name, columns } = req.body
            const { designation } = req.user.user
            
            if (!['admin', 'pi', 'sp', 'dsp'].includes(designation)) {
                return res.status(403).json({ msg: "You are not authorized to update BeatAreas." })
            }

            // Validate request body
            if (!name) {
                return res.status(400).json({ message: 'Table name is required' })
            }
            if (!columns || !Array.isArray(columns)) {
                return res.status(400).json({ message: 'Columns must be an array' })
            }
            for (const column of columns) {
                if (!column.columnName || !column.label) {
                    return res.status(400).json({ message: 'Each column must have a columnName and label' })
                }
            }

            // Create new Table document
            const table = new Table({
                name,
                columns
            })
            await table.save()
            res.status(201).json({msg: "Table created", table})
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    assignBeatOfficer: async (req, res) => {
        try {
            // Check if 'pi'
            if (req.user.user.designation !== 'pi') {
                return res.status(403).json({msg: "Only 'pi' can assign BeatAreas."})
            }

            // Get assignedUser and beatArea from request body
            const { assignedUserId, beatAreaId } = req.body

            // Check if assignedUser and beatArea exist
            const assignedUser = await Users.findById(assignedUserId)
            const beatArea = await BeatArea.findById(beatAreaId)
            if (!assignedUser || !beatArea) {
                return res.status(404).json({msg: "Assigned user or beat area not found."})
            }

            // Check if assignedUser has required designation
            if (!['psi', 'hc', 'constable'].includes(assignedUser.designation)) {
                return res.status(403).json({msg: "Only 'psi', 'hc', and 'constable' can be assigned to BeatAreas."})
            }

            // Check if assignedUser and beatArea are in the same police station as the assigning user
            if (assignedUser.policeStation.toString() !== req.user.user.policeStation._id.toString() || beatArea.policeStation.toString() !== req.user.user.policeStation._id.toString()) {
                return res.status(403).json({msg: "Assigned user and beat area must be in the same police station as the assigning user."})
            }

            // Check if assignedUser is already assigned to beatArea and is active
            const existingAssign = await Assign.findOne({ assignedUser: assignedUserId, beatArea: beatAreaId, active: true });
            if (existingAssign) {
                return res.status(400).json({ msg: "Assigned user is already assigned to this beat area and is active." });
            }


            // Create new Assign document
            const newAssign = new Assign({
                assignedUser: assignedUserId,
                beatArea: beatAreaId,
                assignedBy: req.user.user._id
            })
            await newAssign.save()

            const populatedAssign = await Assign.findById(newAssign._id)
                .populate('assignedUser', 'fullName phoneNumber designation district')
                .populate('beatArea', 'name')
                .populate('assignedBy', 'fullName phoneNumber')
            res.status(201).json({msg: "Beat Officer Assigned", populatedAssign})
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    getAllAssignedBeatOfficers: async (req, res) => {
        try {
            const assigns = await Assign.find({ active: true })
                .populate('assignedUser', 'fullName phoneNumber designation district')
                .populate('beatArea', 'name')
                .populate('assignedBy', 'fullName phoneNumber')
    
            // Map assigns to only include assignedUser and beatArea
            const assignedBeatOfficers = assigns.map(assign => ({
                _id: assign._id,
                assignedUser: assign.assignedUser,
                beatArea: assign.beatArea,
                assignedBy: assign.assignedBy
            }))

            res.json({msg:"List of all assigned beat officers found.", assignedBeatOfficers})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getTables: async (req, res) => {
        try {
            const tables = await Table.find()
            res.status(200).json(tables)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getTableById: async (req, res) => {
        try {
            const table = await Table.findById(req.params.id)
            if (!table) {
                return res.status(404).json({ msg: "Table not found" })
            }
            res.status(200).json(table)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    getAssignedBeatOfficersByPoliceStation: async (req, res) => {
        try {
            const { policeStationId } = req.params

            const assigns = await Assign.find({ active: true })
                .populate({
                    path: 'assignedUser',
                    match: { policeStation: policeStationId },
                    select: 'fullName phoneNumber designation district'
                })
                .populate('beatArea', 'name')
                .populate('assignedBy', 'fullName phoneNumber')

            const assignedBeatOfficers = assigns.map(assign => ({
                _id: assign._id,
                assignedUser: assign.assignedUser,
                beatArea: assign.beatArea,
                assignedBy: assign.assignedBy
            }))

            res.json({msg:"List of assigned Beat Officers found.", assignedBeatOfficers})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAssignedBeatOfficersByBeatArea: async (req, res) => {
        try {
            const { beatAreaId } = req.params

            const assigns = await Assign.find({ active: true, beatArea: beatAreaId })
                .populate('assignedUser', 'fullName phoneNumber designation district')
                .populate('beatArea', 'name')
                .populate('assignedBy', 'fullName phoneNumber')
            
            const assignedBeatOfficers = assigns.map(assign => ({
                _id: assign._id,
                assignedUser: assign.assignedUser,
                beatArea: assign.beatArea,
                assignedBy: assign.assignedBy
            }))

            res.json({msg:"List of assigned Beat Officers found.", assignedBeatOfficers})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAssignedBeatAreasByBeatOfficer: async (req, res) => {
        try {
            const { beatOfficerId } = req.params

            const assigns = await Assign.find({ active: true, assignedUser: beatOfficerId })
                .populate('assignedUser', 'fullName phoneNumber designation district')
                .populate('beatArea', 'name')
                .populate('assignedBy', 'fullName phoneNumber')
            
            const assignedBeatOfficers = assigns.map(assign => ({
                _id: assign._id,
                assignedUser: assign.assignedUser,
                beatArea: assign.beatArea,
                assignedBy: assign.assignedBy
            }))

            res.json({msg:"List of assigned Beat Officers found.", assignedBeatOfficers})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unassignBeatOfficer: async (req, res) => {
        try {
            const { assignId } = req.params
            const assigned = await Assign.findById({ _id: assignId })
            if (!assigned) return res.status(404).json({msg: "Beat Officer not found."})
            assigned.active = false
            const newAssigned = await assigned.save()
            res.json({msg:"Beat Officer Unassigned.", newAssigned})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getData: async (req, res) => {
        try {
            const { columnInfoId, beatAreaId, tableId } = req.query
            let query = {}
            if (columnInfoId) {
                query.columnInfo = columnInfoId
            }
            if (beatAreaId) {
                const columnInfos = await ColumnInfo.find({ beatArea: beatAreaId }, '_id')
                query.columnInfo = { $in: columnInfos.map(columnInfo => columnInfo._id) }
            }
            if (tableId) {
                const columnInfos = await ColumnInfo.find({ table: tableId }, '_id')
                query.columnInfo = { $in: columnInfos.map(columnInfo => columnInfo._id) }
            }
            const data = await Data.find(query).populate('columnInfo').populate('user')
            res.status(200).json(data)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = beatCtrl