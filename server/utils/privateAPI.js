class PrivateAPI{
    constructor(rosterManager){
        this.logout=(req,res)=>{
            res.clearCookie('isAdmin',{ path: '/rosterWeb/privateAPI/' });
            console.log("Admin. logout success.");
            res.send({});
        }
    }
}
module.exports = PrivateAPI;