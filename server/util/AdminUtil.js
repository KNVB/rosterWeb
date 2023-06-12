export default class AdminUtil {
    constructor(timeOut) {
        let accessTokenList = [];
        let actualTimeOut = timeOut * 60 * 1000;
        this.isAuthenticated = accessToken => {
            if (isAuthenticated(accessToken)) {
                accessTokenList[accessToken].timeStamp = new Date().getTime();
                return true;
            }
            return false;
        }
        this.login = loginObj => {
            if ((loginObj.userName === process.env["ADMIN_LOGIN_NAME"]) &&
                (loginObj.password === process.env["ADMIN_LOGIN_PASSWORD"])) {
                let uid = genID();
                let now = new Date().getTime();
                accessTokenList[uid] = { "timeStamp": now };
                console.log("AdminUtil:accessToken:" + uid + " is added to token list.");
                return { accessToken: uid, isSuccess: true};
            }
            return { isSuccess: false };
        }
        this.logout = accessToken => {
            if (isAuthenticated(accessToken)) {
                delete accessTokenList[accessToken];
                console.log("AdminUtil:accessToken:" + accessToken + " is removed to token list.");
                return { isSuccess: true };
            } else {
                throw new Error("Cannot found the access token");
            }
        }
        //============================================================
        let genID = () => {
            let tokenLen = 10;
            let text = "";
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < tokenLen; ++i)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }
        let isAuthenticated = accessToken => {
            if (accessToken in accessTokenList) {
                let now = new Date().getTime();
                let tokenTime = accessTokenList[accessToken].timeStamp;
                if ((now - tokenTime) > actualTimeOut) {
                    delete accessTokenList[accessToken];
                    console.log("AdminUtil:accessToken:" + accessToken + " is removed to token list.");
                    return false;
                } else {
                    accessTokenList[accessToken].timeStamp = new Date().getTime();
                    return true;
                }
            }
            return false;
        }
    }
}