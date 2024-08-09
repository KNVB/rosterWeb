export default class AdminUtil {
    #accessTokenList;
    #actualTimeOut;
    constructor(timeOut) {
        this.#accessTokenList=[];
        this.#actualTimeOut=timeOut * 60 * 1000;
    }
    isAuthenticated = accessToken => {
        if (accessToken in this.#accessTokenList) {
            let now = new Date().getTime();
            let tokenTime =  this.#accessTokenList[accessToken].timeStamp;
            if ((now - tokenTime) > this.#actualTimeOut) {
                delete this.#accessTokenList[accessToken];
                console.log("AdminUtil:accessToken:" + accessToken + " is removed to token list.");
                return false;
            } else {
                this.#accessTokenList[accessToken].timeStamp = new Date().getTime();
                return true;
            }
        }
        return false;
    }
    login=loginObj =>{
        if ((loginObj.userName === process.env["ADMIN_LOGIN_NAME"]) &&
                (loginObj.password === process.env["ADMIN_LOGIN_PASSWORD"])) {
                let uid = this.#genID();
                let now = new Date().getTime();
                this.#accessTokenList[uid] = { "timeStamp": now };
                console.log("AdminUtil:accessToken:" + uid + " is added to token list.");
                return { accessToken: uid, isSuccess: true};
            }
            return { isSuccess: false };
    }
    logout = accessToken => {
        if (this.isAuthenticated(accessToken)) {
            delete this.#accessTokenList[accessToken];
            console.log("AdminUtil:accessToken:" + accessToken + " is removed to token list.");
            return { isSuccess: true };
        } else {
            throw new Error("Cannot found the access token");
        }
    }
    //============================================================
    #genID = () => {
        let tokenLen = 10;
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < tokenLen; ++i)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}