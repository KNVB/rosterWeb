export default function AdminShiftStatUtil() {
    const getAllITOStat = (activeShiftInfoList, startDate, endDate, inITORosterList) => {
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
        return {
            duplicateShiftList,
            vacantShiftList: vacantShiftList
        }
    }
    return { getAllITOStat };
}