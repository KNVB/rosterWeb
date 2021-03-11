class PrivateAPI{
    constructor(rosterManager,systemParam){
        this.systemParam=systemParam;
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
            try{
                let result=rosterManager.saveToDB(req.body);
                res.send(result);
            }catch(error){
                res.send(error);
            }
        }
    }
}
module.exports = PrivateAPI;