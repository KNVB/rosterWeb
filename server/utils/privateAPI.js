class PrivateAPI{
    constructor(rosterManager,systemParam){
        this.systemParam=systemParam;
        this.exportExcel=(req,res)=>{
            rosterManager.exportExcel(req.body)
            .then(()=>{
                //res.send({message:"Export Sucess"})
                console.log("Export Excel completed.");
                let fileName=(req.body.rosterYear%100)*100+(1+req.body.rosterMonth);
                res.download('./output.xlsx',fileName.toString());
            })
            .catch(error=>{
                console.log("Export Excel failure:"+error.stack);
                return res.status(500).json({
                    status: 'error',
                    message: error,
                });
            })
        }
        this.getRosterSchedulerList=async(req,res)=>{
            let result=await rosterManager.getRosterSchedulerList(req.body.year,req.body.month);
            console.log(result);
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