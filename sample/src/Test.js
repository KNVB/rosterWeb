import { useEffect,useReducer} from "react";
import handleAPIError from "./handleAPIError";
import FetchAPI from "./FetchAPI";
          let reducer = (state, action) => {
    let result = { ...state };
    //let temp;
    switch (action.type) {
        case "init":
            result.isLoading = false;
            result.roster = action.roster;
            break;
        case "setError":
            result.error = action.error;
            break;
        default:
            break;
    }
    return result;
}
export function Test() {
    const [itemList, updateItemList] = useReducer(reducer,
        {
            error: null,
            isLoading: true,
            rost: [],
            
        });
    useEffect(()=>{
        let fetch =new FetchAPI();
        let getData = async () => {
            let now = new Date();
            let rosterYear = now.getFullYear();
            let rosterMonth = now.getMonth();            
            try{
                let roster = await fetch.getRoster(rosterYear, rosterMonth);
            } catch (error) {
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    },[]);
    if (itemList.error) {
        return handleAPIError(itemList.error);
    }
}