import RosterExporter from './RosterExporter.js';
import Express from 'express';
import ITOUtil from './ITOUtil.js';
import RosterUtil from "./RosterUtil.js";
import ShiftUtil from './ShiftUtil.js';
export function PrivateAPI(adminUtil, systemParam) {
    const router = Express.Router();
    //===================================================================================================    
    router.use((req, res, next) => {
        let isAuthenticated = adminUtil.isAuthenticated(req.headers['access-token']);
        console.log("PrivateAPI:access token:" + req.headers['access-token'] + ",isAuthenticated=" + isAuthenticated);
        if (isAuthenticated) {
            next();
        } else {
            res.status(401).send("You are not authorized to access this API, please login first.");
        }
    });
    router.get('/:action', async (req, res, next) => {
        switch (req.params.action) {
            /*
            case "getITOBlackListShiftPattern":
                sendResponse(res, getITOBlackListShiftPattern, { year: req.query.year, month: req.query.month });
                break;
            case "getPreferredShiftList":
                sendResponse(res, getPreferredShiftList, { year: req.query.year, month: req.query.month });
                break;
            case "getPreviousMonthShiftList":
                sendResponse(res, getPreviousMonthShiftList, { year: req.query.year, month: req.query.month, systemParam: systemParam });
                break;
            */
            case "getITOList":
                sendResponse(res, getITOList);
                break;
            case "getRosterSchedulerData":
                sendResponse(res, getRosterSchedulerData, { year: req.query.year, month: req.query.month, systemParam: systemParam });
                break;
            case "getYearlyRosterStatistic":
                sendResponse(res, getYearlyRosterStatistic, { year: req.query.year, month: req.query.month });
                break;
            case "logout":
                sendResponse(res, logout, req.headers['access-token']);
                break;
            default:
                next();
                break;
        }
    });
    router.post('/:action', async (req, res, next) => {
        switch (req.params.action) {
            case "addITOToDB":
                sendResponse(res, addITOToDB, req.body.ito);
                break;
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
            case "updateITO":
                sendResponse(res, updateITO, req.body.ito);
                break;
            default:
                next();
                break
        }
    });
    let logout = (accessToken) => {
        return adminUtil.logout(accessToken);
    }
    return router;
}
//====================================================================================================================================
let addITOToDB = async ito => {
    let itoUtil = new ITOUtil();
    return await itoUtil.addITOToDB(ito);
}
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
let getITOList = async () => {
    let itoUtil = new ITOUtil();
    return await itoUtil.getITOList();
}
let getRosterSchedulerData = async params => {
    let itoUtil = new ITOUtil();
    let rosterUtil = new RosterUtil();
    let activeITOList= await itoUtil.getActiveITOList(params.year, params.month);
    let previousMonthShiftList = await rosterUtil.getPreviousMonthShiftList(params.year, params.month, params.systemParam);
    let preferredShiftList = await rosterUtil.getPreferredShiftList(params.year, params.month);
    let yearlyRosterStatistic = await rosterUtil.getYearlyRosterStatistic(params.year, params.month);

    let shiftUtil = new ShiftUtil();
    let itoBlackListShiftPattern = await shiftUtil.getITOBlackListShiftPattern(params.year, params.month);

    return {
        activeITOList,
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
let updateITO = async ito => {
    let itoUtil = new ITOUtil();
    return await itoUtil.updateITO(ito);
}
//====================================================================================================================================
let sendResponse = async (res, action, param) => {
    try {
        res.send(await action(param));
    } catch (error) {
        res.status(400).send(error.message);
    }
}
