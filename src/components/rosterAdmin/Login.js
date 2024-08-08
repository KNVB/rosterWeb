import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Container,Col,Row } from 'react-bootstrap';
import AdminUtil from "../../util/AdminUtil";
export default function Login(){
    document.title="EMSTF Roster Administration Page";
    const[loginObj,updateObj]=useState({"password":"","userName":""});
    const navigate = useNavigate ();
    let adminUtil=new AdminUtil();
    let login=async e=>{
        e.preventDefault();
        try{
            let loginResult=await adminUtil.login(loginObj);
            if (loginResult.isSuccess){
                sessionStorage.setItem("accessToken",loginResult.accessToken);
                navigate("/admin");
            }else {
                alert("Invalid user name or password");
            }
        }catch (error) {
            alert("An error occur when login Call Tree to administration page:\n" + error.message);
        }
    }
    let updateField = e => {
        let fiedName = e.target.name;
        let temp={...loginObj};
        temp[fiedName] = e.target.value;       
        updateObj(temp);
    }
    return (
        <form onSubmit={login}>
            <Container>
                <Row>
                    <Col className='text-center'>EMSTF Roster Administration Page</Col>
                </Row>
                <Row className="mb-1">
                    <Col className='me-1 pe-0 text-end'>User Name:</Col>
                    <Col className='ms-0 ps-0 text-start'>
                        <input name="userName" onChange={updateField} required type="text" value={loginObj.userName}/>
                    </Col>
                </Row>
                <Row className="mt-0">
                    <Col className='me-1 pe-0 text-end'>Password:</Col>
                    <Col className='ms-0 ps-0 text-start'>
                        <input name="password" onChange={updateField} required type="password" value={loginObj.password}/>
                    </Col>
                </Row>
                <Row>
                    <Col className='mt-1 text-center'>
                        <Button type="submit">Login</Button>
                    </Col>
                </Row>
            </Container>
        </form>
    )
}