export default function AdminShiftStatUtil() {
    const getAllITOStat = (activeShiftInfoList, startDate, endDate, inITORosterList,blackListShiftPattern) => {
        let blackListShiftList = {};
        let duplicateShiftList = {};
        let vacantShiftList = {};
        let itoIdList = Object.keys(inITORosterList);
        let itoShiftList = {};
        Object.keys(inITORosterList).forEach(itoId => {
            duplicateShiftList[itoId] = [];
            blackListShiftList[itoId] = [];
            itoShiftList[itoId] = [];
        });
        console.log(blackListShiftPattern);
        //console.log("startDate:"+startDate+",endDate:"+endDate);
        for (let i = startDate; i <= endDate; i++) {
            let vacantShift = activeShiftInfoList.essentialShift;
            let temp = [], tempShiftString,blist;

            itoIdList.forEach(itoId => {
                let itoRoster = inITORosterList[itoId];
                //blist=blackListShiftPattern[itoId];
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
                        itoShiftList[itoId].push(shiftType);
                    });
                    tempShiftString = itoShiftList[itoId].join(",");
                    /*
                    for (let x=0;x<blist.length;x++){
                        if (tempShiftString.indexOf(blist[i])>-1){
                            blackListShiftList[itoId].push(i);
                        }
                    }
                    */
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