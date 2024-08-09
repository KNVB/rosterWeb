import Express from 'express';
import ITOUtil from './ITOUtil.js';
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
let getITOList = async () => {
    let itoUtil = new ITOUtil();
    return await itoUtil.getITOList();
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
        console.log(error);
        res.status(400).send(error.message);
    }
}