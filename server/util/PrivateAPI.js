import Express from 'express';
export default function PrivateAPI(adminUtil, systemParam) {
    const router = Express.Router();
    router.get('/:action', async (req, res, next) => {
        switch (req.params.action) {
            case "logout":
                sendResponse(res, logout, req.headers['access-token']);
                break;
            default:
                next();
                break;
        }
    });
    let logout = (accessToken) => {
        return adminUtil.logout(accessToken);
    }
    return router;
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