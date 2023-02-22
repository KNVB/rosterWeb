import Express from 'express';
import RosterUtil from './RosterUtil.js';
let wrapper = function (systemParam) {
    const router = Express.Router();
    router.get('/:action', async (req, res, next) => {
        console.log(req.params.action);
        switch (req.params.action) {
            case "getRosterSchedulerData":
                let rosterUtil = new RosterUtil();
                try {
                    let activeShiftList = await rosterUtil.getActiveShiftList();
                    let rosterList = await rosterUtil.getRosterList(req.query.year, req.query.month);
                    let preferredShiftList = await rosterUtil.getPreferredShiftList(req.query.year, req.query.month);
                    let results = await rosterUtil.getPreviousMonthShiftList(req.query.year, req.query.month, systemParam);
                    results.forEach(result => {
                        if (rosterList[result.ito_id].previousMonthShiftList === undefined) {
                            rosterList[result.ito_id].previousMonthShiftList = [];
                        }
                        rosterList[result.ito_id].previousMonthShiftList.push(result.shift);
                    });
                    preferredShiftList.forEach(preferredShift => {
                        if (rosterList[preferredShift.ito_id].preferredShiftList === undefined) {
                            rosterList[preferredShift.ito_id].preferredShiftList = {};
                        }
                        rosterList[preferredShift.ito_id].preferredShiftList[preferredShift.d] = preferredShift.preferred_shift;
                    })
                    res.send({
                        activeShiftList: activeShiftList,
                        rosterList: rosterList,
                        systemParam: systemParam,
                    });
                } catch (error) {
                    console.log(error)
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