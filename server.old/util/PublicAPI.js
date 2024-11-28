import Express from 'express';
import Roster from '../classes/Roster.js';
import ShiftInfo from "../classes/ShiftInfo.js";
import ShiftDetail from "../classes/ShiftDetail.js";
import TimeOff from '../classes/TimeOff.js';
export default function PublicAPI(adminUtil, systemParam) {
    const router = Express.Router();
    router.get('/:action', async (req, res, next) => {
        switch (req.params.action) {
            case "getRosterViewerData":
                sendResponse(res, getRosterViewerData, { 
                    month: req.query.month, year: req.query.year,
                    systemParam 
                });
                break;
            default:
                next();
                break;
        }
    });
    return router;
}
//====================================================================================================================================
let getRosterViewerData = async (params) => {
    let roster = new Roster();
    //let timeOff=new TimeOff();
    let rosterData=await roster.getRoster(params.year, params.month);
    let shiftDetail=new ShiftDetail();
    let shiftInfo = new ShiftInfo();
    let sP=structuredClone(params.systemParam);
    await shiftInfo.init();
    
    sP.monthPickerMinDate = new Date(sP.monthPickerMinDate.year, sP.monthPickerMinDate.month - 1, sP.monthPickerMinDate.date);
    sP.noOfPrevDate = 0;
    //let timeOffList = await timeOff.getTimeOffList(params.year, params.month);
    let shiftDetailList=await shiftDetail.getShiftDetailList(params.year, params.month);
    return {
        "activeShiftList":shiftInfo.activeShiftList,
        rosterData,
        systemParam:sP,
        shiftDetailList
    //    timeOffList
    }
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