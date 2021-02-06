class PublicAPI{
    constructor(rosterManager){
        this.getITORosterList = async (req, res) =>{
            let result=await rosterManager.getRosterList(req.query.year,req.query.month);
            res.send(result);
        };
        this.getRosterParam = (req, res) =>{
            res.send(rosterManager.getRosterParam());
        };
        this.getSystemParam=(req,res)=>{
            res.senStatus(200)
        }
    }
}

module.exports = PublicAPI;