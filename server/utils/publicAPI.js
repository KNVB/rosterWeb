class PublicAPI{
    constructor(rosterManager){
        this.adminLogin=(req,res)=>{
            let loginName=req.body.loginName;
            let password=req.body.adminPwd;
            
            if ((process.env['ADMIN_LOGIN_NAME']===loginName) && (process.env['ADMIN_LOGIN_PASSWORD']===password)){
                res.cookie('isAdmin',true,{
                    path:'/rosterWeb/privateAPI/',
                    httpOnly:true,
                    signed: true, 
                    maxAge:3600000
                });
                res.status(200).send({});
            } else {
                res.status(401).send();
            }
        };
        this.getITORosterList = async (req, res) =>{
            let result=await rosterManager.getRosterList(req.query.year,req.query.month);
            res.send(result);
        };
        this.getRosterRule = (req, res) =>{
            res.send(rosterManager.getRosterRule());
        };
    }
}

module.exports = PublicAPI;