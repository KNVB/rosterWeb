import { useParams } from 'react-router-dom';
import TimeOffForm from "./TimeOffForm";
import TimeOffList from "./TimeOffList";
import "./TimeOffManagement.css";
export default function TimeOffManagement(){
    document.title="ITO Time Off Maintenance";
    const params = useParams();
    let obj;
    switch (params.action) {
      case "add":
      case "edit":
        obj = <TimeOffForm timeOffAction={params.action}/>
        break;
      case "list":
        obj = <TimeOffList />
        break;
      default:
        break;  
    }
    return obj
} 