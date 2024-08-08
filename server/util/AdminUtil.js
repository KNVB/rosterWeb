export default class AdminUtil {
    #accessTokenList;
    #actualTimeOut;
    constructor(timeOut) {
        this.#accessTokenList=[];
        this.#actualTimeOut=timeOut * 60 * 1000;
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