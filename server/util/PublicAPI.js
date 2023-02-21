import Express from 'express';
import RosterUtil from './RosterUtil.js';
let wrapper=function (adminUtil,systemParam){
    const router = Express.Router();
    router.get('/:action', async(req, res, next) => {
        console.log(req.params.action);
        switch (req.params.action) {
            case "getRosterViewerData":
                let rosterUtil=new RosterUtil();
                try{
                    let activeShiftList=await rosterUtil.getActiveShiftList();
                    let rosterList=await rosterUtil.getRosterList(req.query.year,req.query.month);
                    res.send({
                        rosterList:rosterList,
                        systemParam:systemParam,
                        activeShiftList:activeShiftList
                    });
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