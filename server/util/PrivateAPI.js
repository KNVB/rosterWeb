import Express from 'express';
import ITOInfo from '../classes/ITOInfo.js';
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
            case "getITOList":
                sendResponse(res, getITOList);
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
let getITOList = async () => {
    let itoUtil = new ITOInfo();
    return await itoUtil.getITOList();
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