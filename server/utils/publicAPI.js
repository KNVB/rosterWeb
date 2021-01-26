class PublicAPI{
    constructor(rosterManager){
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