export default function AdminShiftStatUtil() {
    const getAllITOStat = (activeShiftInfoList, startDate, endDate, inITORosterList) => {
        let allITOStat = {};
        let aShiftCount = [], bxShiftCount = [], cShiftCount = [];
        let duplicateShiftList = {};
        let vacantShiftList = {};
        let itoIdList = Object.keys(inITORosterList);
        Object.keys(inITORosterList).forEach(itoId => {
            duplicateShiftList[itoId] = [];
        });
        for (let i = startDate; i <= endDate; i++) {
            let vacantShift = activeShiftInfoList.essentialShift;
            let temp = [];
            itoIdList.forEach(itoId => {
                let itoRoster = inITORosterList[itoId];
                if (itoRoster.shiftList[i] !== undefined) {
                    let shiftTypeList = itoRoster.shiftList[i].split("+");
                    shiftTypeList.forEach(shiftType => {
                        if (shiftType === "b1") {
                            vacantShift = vacantShift.replace("b", "");
                        } else {
                            vacantShift = vacantShift.replace(shiftType, "");
                        }
                        switch (shiftType) {
                            case "a":
                            case "c":
                                if (temp.includes(shiftType)) {
                                    duplicateShiftList[itoId].push(i);
                                } else {
                                    temp.push(shiftType);
                                }
                                break;
                            case "b":
                            case "b1":
                                if (temp.includes("b")) {
                                    duplicateShiftList[itoId].push(i);
                                } else {
                                    temp.push('b');
                                }
                                break;
                            default: break;
                        }
                    });
                }
            });
            if (vacantShift !== '') {
                vacantShiftList[i] = vacantShift;
            }
        }
        itoIdList.forEach((itoId, index) => {
            aShiftCount.push(inITORosterList[itoId].shiftCountList.aShiftCount);
            bxShiftCount.push(inITORosterList[itoId].shiftCountList.bxShiftCount);
            cShiftCount.push(inITORosterList[itoId].shiftCountList.cShiftCount);
        });

        let aShiftSD = calculateStdDev(aShiftCount);
        let bShiftSD = calculateStdDev(bxShiftCount);
        let cShiftSD = calculateStdDev(cShiftCount);
        let avgStdDev = (aShiftSD + bShiftSD + cShiftSD) / 3;
        allITOStat = {
            aShiftStdDev: aShiftSD.toFixed(2),
            avgStdDev: avgStdDev.toFixed(2),
            bxShiftStdDev: bShiftSD.toFixed(2),
            cShiftStdDev: cShiftSD.toFixed(2),
            duplicateShiftList,            
            vacantShiftList: vacantShiftList
        }
        return allITOStat
    }
    const calculateMean = (data) => {
        return data.reduce(function (a, b) {
            return Number(a) + Number(b);
        }) / data.length;
    }
    const calculateStdDev = (data) => {
        let m = calculateMean(data);
        return Math.sqrt(data.reduce(function (sq, n) {
            return sq + Math.pow(n - m, 2);
        }, 0) / (data.length - 1));
    }
    return { getAllITOStat };
}