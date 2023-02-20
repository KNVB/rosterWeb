import Express from 'express';
import RosterUtil from './RosterUtil.js';
import SystemUtil from "./SystemUtil.js";
let wrapper=function (adminUtil){
    const router = Express.Router();
    router.get('/:action', async(req, res, next) => {
        console.log(req.params.action);
        switch (req.params.action) {
            case "getRosterViewerData":
                let rosterUtil=new RosterUtil();
                let systemUtil=new SystemUtil();
                try{
                    let rosterList=await rosterUtil.getRosterList(req.query.year,req.query.month);
                    let systemParam=await systemUtil.getSystemParam();
                    res.send(rosterList);
                } catch (error) {
                    res.status(400).send(error.message);
                }
                break;
            default:
                next();
                break;
        }
    })
    return router;
}
export default wrapper;