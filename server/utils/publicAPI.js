
class PublicAPI{
    constructor(rosterManager,systemParam){
        this.systemParam=systemParam;
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
                res.status(401).send({message:"Invalid user name or password."});
            }
        }
        this.getAllActiveShiftInfo=async (req,res)=>{
            let result=await rosterManager.getAllActiveShiftInfo();
            res.send(result);
        }
        this.getExcel=async(req,res)=>{
            
        }
        this.getITORosterList = async (req, res) =>{
            let result=await rosterManager.getRosterList(req.query.year,req.query.month);
            res.send(result);
        };       
        this.getSystemParam=(req,res)=>{
            res.send(this.systemParam);
        }        
    }
}

module.exports = PublicAPI;