const { Users, SubDivision, PoliceStation } = require('../models/userModel')
const { BeatArea, Table, Data, Assign } = require('../models/beatModel')
const { ColumnInfo } = require('../models/columnInfoModel')

const columnCtrl = {
    createColumnInfo: async (req, res) => {
        try {
            const { designation, _id } = req.user.user
            const { beatArea } = req.body

            if (!['psi', 'hc', 'constable'].includes(designation)) {
                return res.status(403).json({ msg: "You are not authorized for this action." })
            }

            // Check if user is an assigned beat officer
            const assign = await Assign.findOne({ assignedUser: _id, beatArea, active: true })
            if (!assign) {
                return res.status(403).json({ msg: "Only assigned beat officers can create ColumnInfo." })
            }

            // Get the table specified in the request
            const table = await Table.findById(req.body.table)
            if (!table) {
                return res.status(404).json({ message: 'Table not found' })
            }

            // Validate req.body
            for (const column of table.columns) {
                if (['user', 'archived'].includes(column.columnName)) continue;
                if (!req.body[column.columnName]) {
                    return res.status(400).json({ message: `${column.columnName} is required` })
                }
            }

            // Create new ColumnInfo document
            const columnInfoData = {}
            for (const column of table.columns) {
                columnInfoData[column.columnName] = req.body[column.columnName]
            }
            columnInfoData.user = req.user.user._id
            const columnInfo = new ColumnInfo(columnInfoData)
            await columnInfo.save()
            res.status(201).json({msg: "Created Column", columnInfo})
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    createData: async (req, res) => {
        try {
            const { image_url, review, status, geometry, columnInfo } = req.body

            const { designation, _id } = req.user.user 
            if (!['psi', 'hc', 'constable'].includes(designation)) {
                return res.status(403).json({ msg: "You are not authorized to add information." })
            }

            // Check if user is an assigned beat officer
            const assign = await Assign.findOne({ assignedUser: _id, active: true })
            if (!assign) {
                return res.status(403).json({ msg: "Only assigned beat officers can create Data." })
            }

            if (!image_url) {
                return res.status(400).json({ message: 'image_url is required' })
            }
            if (!review) {
                return res.status(400).json({ message: 'review is required' })
            }
            if (!status) {
                return res.status(400).json({ message: 'status is required' })
            }
            if (!geometry) {
                return res.status(400).json({ message: 'geometry is required' })
            }
            if (!columnInfo) {
                return res.status(400).json({ message: 'columnInfo is required' })
            }

            const data = new Data({
                ...req.body,
                user: req.user.user._id
            });
            await data.save()
            res.status(201).json({msg: "Data has been recorded",data})
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    getColumnInfos: async (req, res) => {
        try {
            const columnInfos = await ColumnInfo.find()
            .populate({
                    path: 'beatArea',
                    select: 'name',
                    populate: {
                        path: 'policeStation',
                        select: 'name subDivision'
                    }
                })
            .populate('table', 'name')
            .populate('user', 'fullName phoneNumber district designation avatar')
            res.status(200).json(columnInfos)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    getColumnInfosByBeatArea: async (req, res) => {
        try {
            const columnInfos = await ColumnInfo.find({ beatArea: req.params.beatAreaId })
                .populate({
                    path: 'beatArea',
                    select: 'name',
                    populate: {
                        path: 'policeStation',
                        select: 'name subDivision'
                    }
                })
                .populate('table', 'name')
                .populate('user', 'fullName phoneNumber district designation')
            res.status(200).json(columnInfos)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    getColumnInfosByBeatAreaAndTable: async (req, res) => {
        try {
            const { beatAreaId, tableId } = req.params
            const columnInfos = await ColumnInfo.find({ beatArea: beatAreaId, table: tableId })
                .populate({
                    path: 'beatArea',
                    select: 'name',
                    populate: {
                        path: 'policeStation',
                        select: 'name subDivision'
                    }
                })
                .populate('table', 'name')
                .populate('user', 'fullName phoneNumber district designation')
            res.status(200).json(columnInfos)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    getDataByStatus: async (req, res) => {
        try {
            const { status } = req.query
            let query = {}
            if (status) {
                query.status = status;
            }
            const data = await Data.find(query).populate({
                path: 'columnInfo',
                populate: [
                    { path: 'beatArea', select: 'name' },
                    { path: 'table', select: 'name' },
                    { path: 'user', select: 'fullName phoneNumber district designation' }
                ]
            }).populate({
                path: 'user',
                populate: { path: 'policeStation', select: 'name' },
                select: 'fullName phoneNumber district designation avatar'   
            });
            res.status(200).json(data)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    getDataByBeatArea: async (req, res) => {
        try {
            const { beatAreaId } = req.params
            const columnInfos = await ColumnInfo.find({ beatArea: beatAreaId }, '_id')
            const data = await Data.find({ columnInfo: { $in: columnInfos.map(columnInfo => columnInfo._id) } }).populate({
                path: 'columnInfo',
                populate: [
                    { path: 'beatArea', select: 'name' },
                    { path: 'table', select: 'name' },
                    { path: 'user', select: 'fullName phoneNumber district designation' }
                ]
            }).populate({
                path: 'user',
                populate: { path: 'policeStation', select: 'name' },
                select: 'fullName phoneNumber district designation avatar'   
            })
            res.status(200).json(data)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    getDataByColumnInfoBeatAreaAndTable: async (req, res) => {
        try {
            const { columnInfoId, beatAreaId, tableId } = req.params
            const columnInfos = await ColumnInfo.find({ _id: columnInfoId, beatArea: beatAreaId, table: tableId }, '_id')
            const data = await Data.find({ columnInfo: { $in: columnInfos.map(columnInfo => columnInfo._id) } }).populate({
                path: 'columnInfo',
                populate: [
                    { path: 'beatArea', select: 'name' },
                    { path: 'table', select: 'name' },
                    { path: 'user', select: 'fullName phoneNumber district designation' }
                ]
            }).populate('user');
            res.status(200).json(data)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    },
    getRecentDataByStatus: async (req, res) => {
        try {
            const { status } = req.query
            let query = {}
            if (status) {
                query.status = status;
            }
            const data = await Data.find(query).populate({
                path: 'columnInfo',
                populate: [
                    { path: 'beatArea', select: 'name' },
                    { path: 'table', select: 'name' },
                    { path: 'user', select: 'fullName phoneNumber district designation' }
                ]
            }).populate({
                path: 'user',
                populate: { path: 'policeStation', select: 'name' },
                select: 'fullName phoneNumber district designation avatar'
            });

            // Group data by beatArea and table
            const groupedData = data.reduce((acc, curr) => {
                const beatAreaId = curr.columnInfo.beatArea._id.toString();
                const tableId = curr.columnInfo.table._id.toString();
                if (!acc[beatAreaId]) {
                    acc[beatAreaId] = {};
                }
                if (!acc[beatAreaId][tableId]) {
                    acc[beatAreaId][tableId] = [];
                }
                acc[beatAreaId][tableId].push(curr);
                return acc;
            }, {});

            // Get most recent entry for each table of each beat area
            const mostRecentData = Object.values(groupedData).flatMap(beatAreaTables => {
                return Object.values(beatAreaTables).map(tableData => {
                    return tableData.reduce((acc, curr) => {
                        if (!acc || curr.createdAt > acc.createdAt) {
                            return curr;
                        }
                        return acc;
                    }, null);
                });
            });

            res.status(200).json(mostRecentData)
        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = columnCtrl