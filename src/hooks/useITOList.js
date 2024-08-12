import { useEffect, useReducer } from "react";
import ITO from "../dataUtil/ITO";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.itoList = action.itoList;
            result.isLoading = false;
            break
        case "setError":
            result.error = action.error;
            break;
        default:
            break;
    }
    return result;
}
export function useITOList(){
    const [itemList, updateItemList] = useReducer(reducer, {
        error: null,
        isLoading: true,
        ito:new ITO(),
        itoList: {}
    });
    useEffect(() => {
        let getData = async () => {
            try {
               
                let itoList = await itemList.ito.getITOList();
                updateItemList({                    
                    itoList,
                    type: "init"
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, []);
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        itoList: itemList.itoList,
    }
}