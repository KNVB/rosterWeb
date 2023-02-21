import Dbo from "./Dbo.js";
export default class SystemParam {
    constructor() {
        let dbo = new Dbo();
        this.maxConsecutiveWorkingDay = 0;
        this.monthPickerMinDate = {};
        this.noOfPrevDate = 0;

        dbo.getSystemParam()
            .then(resultList => {
                resultList.forEach(result => {
                    switch (result.param_type) {
                        case 'ConsecutiveWorkingDay':
                            this.maxConsecutiveWorkingDay = parseInt(result.param_value);
                            break;
                        case 'monthPicker':
                            this.monthPickerMinDate = JSON.parse(result.param_value);
                            break;
                        case 'tables':
                            this.noOfPrevDate = parseInt(result.param_value);
                            break;
                        default:
                            break;
                    }
                })
                console.log("Get System Parameter successfully!");
            })
            .catch(err => {
                console.log("Some wrong when getting System Parameter:" + err);
            })
            .finally(() => {
                dbo.close();
            });
    }
}