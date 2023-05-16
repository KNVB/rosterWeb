import RosterExporter from './RosterExporter.js';
import Express from 'express';
import RosterUtil from "./RosterUtil.js";
import ShiftUtil from './ShiftUtil.js';
export function PrivateAPI(systemParam) {
    const router = Express.Router();
    let rosterUtil;
    router.get('/:action', async (req, res, next) => {
        switch (req.params.action) {
            case "getITOBlackListShiftPattern":
                sendResponse(res, getITOBlackListShiftPattern, { year: req.query.year, month: req.query.month });
                break;
            case "getPreferredShiftList":
                sendResponse(res, getPreferredShiftList, { year: req.query.year, month: req.query.month });
                break;
            case "getPreviousMonthShiftList":
                sendResponse(res, getPreviousMonthShiftList, { year: req.query.year, month: req.query.month, systemParam: systemParam });
                break;
            case "getRosterSchedulerData":
                sendResponse(res, getRosterSchedulerData, { year: req.query.year, month: req.query.month, systemParam: systemParam });
                break;
            case "getYearlyRosterStatistic":
                sendResponse(res, getYearlyRosterStatistic, { year: req.query.year, month: req.query.month });
                break;
            default:
                next();
                break;
        }
    });
    router.post('/:action', async (req, res, next) => {
        switch (req.params.action) {
            case "exportRosterDataToExcel":
                try {
                    let rosterExporter = new RosterExporter();
                    let outputFileName = (req.body.genExcelData.year % 100) * 100 + req.body.genExcelData.month + ".xlsx";

                    res.setHeader("Content-disposition", "attachment; filename=" + outputFileName);
                    res.setHeader("Content-type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.send(await rosterExporter.export(req.body.genExcelData));

                } catch (error) {
                    console.log(error);
                    res.status(400).send(error.message);
                }
                break;
            case "saveRosterToDB":
                sendResponse(res, saveRosterToDB, req.body.rosterData);
                break;
            default:
                next();
                break
        }
    });
    return router;

}
//====================================================================================================================================
let getITOBlackListShiftPattern = async (params) => {
    let shiftUtil = new ShiftUtil();
    let itoBlackListShiftPattern = await shiftUtil.getITOBlackListShiftPattern(params.year, params.month);
    return itoBlackListShiftPattern;
}
let getPreferredShiftList = async (params) => {
    let rosterUtil = new RosterUtil();
    let preferredShiftList = await rosterUtil.getPreferredShiftList(params.year, params.month);
    return preferredShiftList;
}
let getPreviousMonthShiftList = async (params) => {
    let rosterUtil = new RosterUtil();
    let previousMonthShiftList = await rosterUtil.getPreviousMonthShiftList(params.year, params.month, params.systemParam);
    return previousMonthShiftList;
}
let getRosterSchedulerData = async params => {
    let rosterUtil = new RosterUtil();
    let previousMonthShiftList = await rosterUtil.getPreviousMonthShiftList(params.year, params.month, params.systemParam);
    let preferredShiftList = await rosterUtil.getPreferredShiftList(params.year, params.month);
    let yearlyRosterStatistic = await rosterUtil.getYearlyRosterStatistic(params.year, params.month);

    let shiftUtil = new ShiftUtil();
    let itoBlackListShiftPattern = await shiftUtil.getITOBlackListShiftPattern(params.year, params.month);

    return {
        itoBlackListShiftPattern,
        previousMonthShiftList,
        preferredShiftList,
        yearlyRosterStatistic
    };
}
let getYearlyRosterStatistic = async params => {
    let rosterUtil = new RosterUtil();
    let yearlyRosterStatistic = rosterUtil.getYearlyRosterStatistic(params.year, params.month);
    return yearlyRosterStatistic;
}
let saveRosterToDB = async rosterData => {
    let rosterUtil = new RosterUtil();
    await rosterUtil.saveRosterToDB(rosterData);
    return "";
}
//====================================================================================================================================
let sendResponse = async (res, action, param) => {
    try {
        res.send(await action(param));
    } catch (error) {
        res.status(400).send(error.message);
    }
}
