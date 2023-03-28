export default class AutoPlannerUtil {
    constructor() {
        let iterationCount = 100;
        let startDate = 1, endDate;
        this.autoPlan = (rosterDataUtil, systemParam) => {
            let activeShiftList = rosterDataUtil.getActiveShiftList();
            let itoIdList = rosterDataUtil.getItoIdList();
            let previousShiftList = {};

            console.log(activeShiftList);
            console.log(systemParam);

            itoIdList.forEach(itoId => {
                let rosterList = rosterDataUtil.getRosterList(itoId);
                //console.log(rosterList);
                previousShiftList[itoId] = [];
                if (startDate < systemParam.maxConsecutiveWorkingDay) {
                    for (let i = startDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
                        previousShiftList[itoId].push(rosterList.previousMonthShiftList[i]);
                    }
                } else {
                    for (let i = startDate - systemParam.maxConsecutiveWorkingDay; i < startDate; i++) {
                        previousShiftList[itoId].push(rosterList.shiftList[i + 1]);
                    }
                }
            });
            console.log(previousShiftList);
        }
        this.getIterationCount = () => {
            return iterationCount;
        }
        this.getEndDate = () => {
            return endDate;
        }
        this.getStartDate = () => {
            return startDate;
        }
        this.setEndDate = e => {
            endDate = e;
        }
        this.setIterationCount = (newCount) => {
            iterationCount = newCount;
        }
        this.setStartDate = s => {
            startDate = s;
        }
    }
}