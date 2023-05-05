import Express from 'express';
import ShiftUtil from './ShiftUtil.js';
import RosterUtil from './RosterUtil.js';
let wrapper = function (systemParam) {
    const router = Express.Router();
    let rosterUtil;
    router.get('/:action', async (req, res, next) => {
        console.log(req.params.action);
        switch (req.params.action) {
            case "getITOBlackListShiftPattern":
                let shiftUtil = new ShiftUtil();
                try {
                    let itoBlackListShiftPattern = await shiftUtil.getITOBlackListShiftPattern(req.query.year, req.query.month);
                    res.send(itoBlackListShiftPattern);
                } catch (error) {
                    res.status(400).send(error.message);
                }
                break;
            case "getPreferredShiftList":
                rosterUtil = new RosterUtil();
                try {
                    let preferredShiftList = await rosterUtil.getPreferredShiftList(req.query.year, req.query.month);
                    res.send(preferredShiftList);
                } catch (error) {
                    console.log(error)
                    res.status(400).send(error.message);
                }
                break;
            case "getPreviousMonthShiftList":
                rosterUtil = new RosterUtil();
                try {
                    let previousMonthShiftList = await rosterUtil.getPreviousMonthShiftList(req.query.year, req.query.month, systemParam);
                    res.send(previousMonthShiftList);
                } catch (error) {
                    res.status(400).send(error.message);
                }
                break;
            default:
                next();
                break;
        }
    });
    router.post("/:action", async (req, res, next) => {
        switch (req.params.action) {
            case "exportRosterDataToExcel":
                rosterUtil = new RosterUtil();
                try{
                    let result=rosterUtil.exportRosterDataToExcel(req.body.roster,req.body.rosterSchedulerData);
                }catch (error){
                    res.status(400).send(error.message);
                }
                break;
            default:
                next();
                break;
        }
    });
    return router
}
export default wrapper;