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
function adminLogin(loginName,password){
    //console.log("ADMIN_LOGIN_NAME="+process.env['ADMIN_LOGIN_NAME']);
    if ((process.env['ADMIN_LOGIN_NAME']===loginName) && (process.env['ADMIN_LOGIN_PASSWORD']===password)){
        let accessToken = jwt.sign({ admin: true }, accessTokenSecret,{ expiresIn: '1h' });
        return accessToken;
    } else {
       return null
    }
};  