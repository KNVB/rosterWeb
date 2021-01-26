const accessTokenSecret = '這三件事';
const jwt = require('jsonwebtoken');
module.exports ={
    adminLogin,
    checkToken
}
function isEmpty(obj){
    return (Object.keys(obj).length === 0 && obj.constructor === Object);
  }
function checkToken(req,res,next){
    let signedCookies=req.signedCookies;

    if (isEmpty(signedCookies)){
        return res.status(401).end();
    } else {
        let token=signedCookies.isAdmin;
        try{
        jwt.verify(token,accessTokenSecret);
        next();
        }
        catch (error){
        return res.status(401).end();
        }
    }
}
function adminLogin(req,res){
    let loginName=req.body.loginName;
    let password=req.body.adminPwd;
    //console.log("ADMIN_LOGIN_NAME="+process.env['ADMIN_LOGIN_NAME']);
    if ((process.env['ADMIN_LOGIN_NAME']===loginName) && (process.env['ADMIN_LOGIN_PASSWORD']===password)){
        const accessToken = jwt.sign({ admin: true }, accessTokenSecret,{ expiresIn: '1h' });
        res.cookie('isAdmin',accessToken,{
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