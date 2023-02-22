import Express from 'express';
import RosterUtil from './RosterUtil.js';
import ShiftUtil from './ShiftUtil.js';
let wrapper=function (adminUtil,systemParam){
    const router = Express.Router();
    
    router.get('/:action', async(req, res, next) => {
        //console.log(req.params.action);
        switch (req.params.action) {
            case "getActiveShiftList":
                let shiftUtil=new ShiftUtil();
                try{
                    let activeShiftList=await shiftUtil.getActiveShiftList();
                    res.send(activeShiftList);
                }catch (error) {
                    res.status(400).send(error.message);
                }
                break;
            case "getRosterList":
                let rosterUtil=new RosterUtil();
                try{
                    let rosterList=await rosterUtil.getRosterList(req.query.year,req.query.month);
                    res.send(rosterList);
                } catch (error) {
                    res.status(400).send(error.message);
                }
                break;
            case "getSystemParam":
                res.send(systemParam);
                break;    
            default:
                next();
                break;
        }
    })
    return router;
}
export default wrapper;