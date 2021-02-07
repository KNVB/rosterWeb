class PublicAPI{
    constructor(rosterManager){
        let SystemParam=require("../classes/SystemParam");
        this.systemParam=new SystemParam();
        this.getAllActiveShiftInfo=async (req,res)=>{
            let result=await rosterManager.getAllActiveShiftInfo();
            res.send(result);
        }
        this.getITORosterList = async (req, res) =>{
            let result=await rosterManager.getRosterList(req.query.year,req.query.month);
            res.send(result);
        };
        this.getRosterParam = (req, res) =>{
            res.send(rosterManager.getRosterParam());
        };
        this.getSystemParam=(req,res)=>{
            res.send(this.systemParam);
        }
    }
}

module.exports = PublicAPI;