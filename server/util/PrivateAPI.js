import Express from 'express';
import Roster from '../classes/Roster.js';
import ShiftInfo from "../classes/ShiftInfo.js";
export default function PrivateAPI(adminUtil, systemParam) {
    const router = Express.Router();
    //===================================================================================================    
    /*
    router.use((req, res, next) => {
        let isAuthenticated = adminUtil.isAuthenticated(req.headers['access-token']);
        console.log("PrivateAPI:access token:" + req.headers['access-token'] + ",isAuthenticated=" + isAuthenticated);
        if (isAuthenticated) {
            next();
        } else {
            res.status(401).send("You are not authorized to access this API, please login first.");
        }
    });
    */
    router.get('/:action', async (req, res, next) => {
        switch (req.params.action) {
            case "getRosterSchedulerData":
                sendResponse(res, getRosterSchedulerData, { month: req.query.month, "systemParam": systemParam, "year": req.query.year });
                break;
            default:
                next();
                break;
        }
    });
    return router;
}
//====================================================================================================================================
let getRosterSchedulerData = async params => {
    let temp;
    let roster = new Roster();
    let previousMonthShiftList = {};
    let shiftInfo = new ShiftInfo();
    let sP = structuredClone(params.systemParam);
    await shiftInfo.init();
    temp = await roster.getPreviousMonthShiftList(params.year, params.month, params.systemParam);
    temp.forEach(p => {
        if (previousMonthShiftList[p.ito_id] === undefined) {
            previousMonthShiftList[p.ito_id] = [];
        }
        previousMonthShiftList[p.ito_id].push({shiftType:p.shift});
    });
    
    sP.monthPickerMinDate = new Date(sP.monthPickerMinDate.year, sP.monthPickerMinDate.month - 1, sP.monthPickerMinDate.date);
    return {
        activeShiftList: shiftInfo.activeShiftList,
        essentialShift: shiftInfo.essentialShift,
        itoBlackListShiftPattern: await shiftInfo.getITOBlackListShiftPattern(params.year, params.month),
        preferredShiftList: await roster.getPreferredShiftList(params.year, params.month),
        previousMonthShiftList: previousMonthShiftList,
        systemParam: sP
    }
}
let sendResponse = async (res, action, param) => {
    try {
        res.send(await action(param));
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}