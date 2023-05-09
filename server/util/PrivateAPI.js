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
            default:
                next();
                break;
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
//====================================================================================================================================
let sendResponse = async (res, action, param) => {
    try {
        res.send(await action(param));
    } catch (error) {
        res.status(400).send(error.message);
    }
}
