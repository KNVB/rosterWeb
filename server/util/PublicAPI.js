import Express from 'express';
import Roster from '../classes/Roster.js';
import ShiftInfo from "../classes/ShiftInfo.js";
export default function PublicAPI(adminUtil, systemParam) {
    const router = Express.Router();
    router.get('/:action', async (req, res, next) => {
        switch (req.params.action) {
            case "getActiveShiftList":
                sendResponse(res, getActiveShiftList);
                break;
            case "getRoster":
                sendResponse(res, getRoster, { year: req.query.year, month: req.query.month });
                break;
            case "getSystemParam":
                res.send(systemParam);
                break;
            default:
                next();
                break;
        }
    });
    return router;
}
//====================================================================================================================================
let getActiveShiftList = async () => {
    let shiftInfo = await ShiftInfo.create();
    return shiftInfo.activeShiftList;
}
let getRoster = async (params) => {
    let roster = new Roster();
    return await roster.getRoster(params.year, params.month);
}
//====================================================================================================================================
let sendResponse = async (res, action, param) => {
    try {
        res.send(await action(param));
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}