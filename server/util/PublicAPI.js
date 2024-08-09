import Express from 'express';
export default function PublicAPI(adminUtil, systemParam){
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
    let shiftInfo = new ShiftInfo();
    let activeShiftList = await shiftInfo.getActiveShiftList();
    return activeShiftList;
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