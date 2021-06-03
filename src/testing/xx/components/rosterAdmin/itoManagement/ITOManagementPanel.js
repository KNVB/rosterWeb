import {Fragment,useState} from 'react';
import './ITOManagementPanel.css';
import ITODetailTable from './ITODetailTable';
import ITOListTable from './ITOListTable';
export default function ITOManagementPanel(props){
    let contextValue=props.contextValue;
    const [itoId,setITOId]=useState(Object.keys(contextValue.allITOList)[0]);
    return(
        <Fragment>
            <ITOListTable 
                allITOList={contextValue.allITOList}
                setITOId={setITOId}/>
            <br/>
            <ITODetailTable 
                activeShiftInfoList={contextValue.activeShiftInfoList}
                allITOList={contextValue.allITOList}
                itoId={itoId}/>
        </Fragment>
    )
}