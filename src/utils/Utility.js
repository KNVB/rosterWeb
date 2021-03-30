import SessionExpiredError from './SessionExpiredError';
export default class Utility{
  static calculateMean(data){
      return data.reduce(function (a, b) {
          return Number(a) + Number(b);
      }) / data.length;
  }
  static calculateStdDev(data){
      let m =this.calculateMean(data);
    return Math.sqrt(data.reduce(function (sq, n) {
            return sq + Math.pow(n - m, 2);
        }, 0) / (data.length - 1));
  } 
  
  static async fetchAPI(url,method,params){
    console.log("=======================");
    console.log("url="+url);
    console.log("method="+method);
    console.log("params="+params);
    console.log("=======================");
    let requestPara={
      headers:{
        'Content-Type': 'application/json'
      },
      "method":method || 'GET',
    }
    switch (method.toUpperCase()){
      case 'GET':
        const paramsObject = new URLSearchParams(params);
        const queryString = paramsObject.toString();  
        url+="?"+queryString;
        break;
      case 'POST':
        requestPara["body"]=JSON.stringify(params);
        break;
      default:
        break;  
    }
    url="/rosterWeb"+url;
    let response = await fetch(url,requestPara);
    /*
    response.headers.forEach((value,name)=>{
      console.log(name+","+value);
    })
    */
    
    if (response.headers.get('content-disposition')){
      let value=response.headers.get('content-disposition');
      if (value.indexOf("attachment; filename=")>-1){
        let fileName=value.replace("attachment; filename=","").replaceAll("\"","");
        let blob=await response.blob();
        const newBlob = new Blob([blob], { type:response.headers.get('content-type')});
        const objUrl = window.URL.createObjectURL(newBlob);
        let link = document.createElement('a');
        link.href = objUrl;
        link.download = fileName;
        link.click();
      }
    } else {
      let responseObj=await response.json();
      switch (response.status){
        case 401:
          throw new SessionExpiredError(responseObj.message);
          break;
        case 200:
          return responseObj;  
          break;
        default:
          throw new Error(responseObj.message);
          break;  
      }
    }
  }
      
  static getSystemParam(){
      return this.fetchAPI('/publicAPI/getSystemParam','GET');
  }
   
}