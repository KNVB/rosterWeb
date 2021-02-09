class PrivateAPI{
    constructor(rosterManager,systemParam){
        this.systemParam=systemParam;
        this.getRosterSchedulerList=async(req,res)=>{
            let result=await rosterManager.getRosterSchedulerList(req.query.year,req.query.month);
            res.send(result);
        }
        this.logout=(req,res)=>{
            res.clearCookie('isAdmin',{ path: '/rosterWeb/privateAPI/' });
            console.log("Admin. logout success.");
            res.send({});
        }
    }
}
module.exports = PrivateAPI;