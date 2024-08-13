import Express from 'express';
import ITOInfo from '../classes/ITOInfo.js';
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
            case "getActiveShiftList":
                sendResponse(res,getActiveShiftList);
                break
            case "getITOList":
                sendResponse(res, getITOList);
                break;
            case "getRosterSchedulerData":
                sendResponse(res, getRosterSchedulerData, { month: req.query.month, "systemParam": systemParam, "year": req.query.year });
                break;
            default:
                next();
                break;
        }
    });
    router.post('/:action', async (req, res, next) => {
        switch (req.params.action) {
            case "addITO":
                sendResponse(res, addITO, req.body.ito);
                break;
            case "updateITO":
                sendResponse(res, updateITO, req.body.ito);
                break;
            default:
                next();
                break;
        }
    });
    return router;
}
let addITO = async ito => {
    let itoUtil = new ITOInfo();
    return await itoUtil.addITO(ito);
}
let getActiveShiftList=async()=>{
    let shiftInfo = await ShiftInfo.create();
    return shiftInfo.activeShiftList;
}
let getITOList = async () => {
    let itoUtil = new ITOInfo();
    return await itoUtil.getITOList();
}
let getRosterSchedulerData= async params=>{
    let roster = new Roster();
    let rosterData=await roster.getRoster(params.year, params.month);
    let shiftInfo = await ShiftInfo.create();
    let sP=structuredClone(params.systemParam);
    sP.monthPickerMinDate = new Date(sP.monthPickerMinDate.year, sP.monthPickerMinDate.month - 1, sP.monthPickerMinDate.date);
    return {
        activeShiftList:shiftInfo.activeShiftList,
        rosterData,
        systemParam:sP
    }
}
let updateITO = async ito => {
    let itoUtil = new ITOInfo();
    return await itoUtil.updateITO(ito);
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