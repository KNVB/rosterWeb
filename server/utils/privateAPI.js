class PrivateAPI{
    constructor(rosterManager,systemParam){
        this.systemParam=systemParam;
        this.exportExcel=async(req,res)=>{
            let ExcelExporter=require('../classes/ExcelExporter');
            let excelExporter=new ExcelExporter(res);
        }
        this.getRosterSchedulerList=async(req,res)=>{
            let result=await rosterManager.getRosterSchedulerList(req.body.year,req.body.month);
            res.send(result);
        }
        this.getYearlyRosterStatistic=async(req,res)=>{
            let result=await rosterManager.getYearlyRosterStatistic(req.body.year,req.body.month);
            res.send(result);
        }
        this.logout=(req,res)=>{
            res.clearCookie('isAdmin',{ path: '/rosterWeb/privateAPI/' });
            console.log("Admin. logout success.");
            res.send({});
        }
        this.saveRosterToDB=async(req,res)=>{
            await rosterManager.saveToDB(req.body)
            .then(result=>{
                res.status(200).json({"result":result});
            })
            .catch(error=>{
                console.log("3 Exception Caught");
                return res.status(500).json({
                    status: 'error',
                    message: error,
                });
            })
        }
    }
}
module.exports = PrivateAPI;