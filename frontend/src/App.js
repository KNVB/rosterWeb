import {Col,Container,Row} from 'react-bootstrap';
function App() {
  return (
    <div className="App p-1">
      <Container fluid={true} className="border border-info">
        <Row>
          <Col className="font-weight-bold text-center" md={12} lg={12} sm={12} xl={12} xs={12}>
            <u style={{"font-size":"18px"}}>EMSTF Resident Support & Computer Operation Support Services Team Roster</u>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
