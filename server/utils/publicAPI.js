
class PublicAPI{
    constructor(rosterManager){
        let SystemParam=require("../classes/SystemParam");
        this.systemParam=new SystemParam();
        let util=require("../utils/utility.js");
        this.adminLogin=(req,res)=>{
            let loginName=req.body.loginName;
            let password=req.body.adminPwd;
            let token=util.adminLogin(loginName,password);
            if (token){
                res.cookie('isAdmin',token,{
                    path:'/rosterWeb/privateAPI/',
                    httpOnly:true,
                    signed: true, 
                    maxAge:3600000
                });
                res.status(200).send({});
            } else {
                res.status(401).send();
            }
        }
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