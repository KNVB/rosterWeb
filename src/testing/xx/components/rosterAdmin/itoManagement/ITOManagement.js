import {Col,Container,Row} from 'react-bootstrap';
import {useEffect,useState} from 'react';
import AdminUtility from '../AdminUtility';
import ITOManagementPanel from './ITOManagementPanel';

export default function ITOManagment(props){
    let [contextValue,setContextValue]=useState();
    useEffect(()=>{
        const getData = async () => {
            console.log("Undo:Get All ITO information from DB");
            let adminUtility = new AdminUtility(props.changeLoggedInFlag);
            let temp=await adminUtility.getAllITOList();
            let activeShiftInfoList= await adminUtility.getAllActiveShiftInfo();
           
            setContextValue({
                allITOList:temp,
                activeShiftInfoList:activeShiftInfoList
            });
        }
        getData();
    },[props.changeLoggedInFlag])
    return(
        <Container>
            <Row>
                <Col className="font-weight-bold text-center tableCaption" md={12} lg={12} sm={12} xl={12} xs={12}>
                    <u>ITO Management Panel</u>
                </Col>
            </Row>
            <Row>
                <Col md={12} lg={12} sm={12} xl={12} xs={12} className="d-flex flex-column flex-grow-1 justify-content-center">
                    {contextValue && <ITOManagementPanel contextValue={contextValue}/>}    
                </Col>
            </Row>    
        </Container>
    )
}