import {Fragment,useState} from 'react';
import './ITOManagementPanel.css';
import ITODetailTable from './ITODetailTable';
import ITOListTable from './ITOListTable';
export default function ITOManagementPanel(props){
    let contextValue=props.contextValue;
    let itoId=Object.keys(contextValue.allITOList)[0];
    const [ito,setITO]=useState(contextValue.allITOList[itoId]);
    return(
        <Fragment>
            <ITOListTable 
                allITOList={contextValue.allITOList}
                activeShiftInfoList={contextValue.activeShiftInfoList}
                setITO={setITO}/>
            <br/>
            <ITODetailTable 
                activeShiftInfoList={contextValue.activeShiftInfoList}                
                ito={ito}/>
        </Fragment>
    )
}