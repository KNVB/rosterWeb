import { useParams } from 'react-router-dom';
import ITOForm from "./ITOForm";
import ITOList from "./ITOList";
export default function ITOManagement() {
    document.title="ITO Info. Maintenance";
    const params = useParams();
    let obj;
    switch (params.action) {
      case "add":
      case "edit":
        obj = <ITOForm itoAction={params.action}/>
        break;
      case "list":
        obj = <ITOList />
        break;
      default:
        break;  
    }
    return obj
}