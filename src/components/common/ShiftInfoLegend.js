import { Col, Container, Row } from "react-bootstrap";

export default function ShiftInfoLegend({activeShiftList}) {
    return (
        <Container fluid className="border m-0">
            <Row>
                <Col className={activeShiftList.a.cssClassName}>
                    {activeShiftList.a.type} : {activeShiftList.a.timeSlot}
                </Col>
            </Row>
            <Row>
                <Col className={activeShiftList.b.cssClassName}>
                    {activeShiftList.b.type} : {activeShiftList.b.timeSlot}
                </Col>
            </Row>
            <Row>
                <Col className={activeShiftList.b1.cssClassName}>
                    {activeShiftList.b1.type} : {activeShiftList.b1.timeSlot}
                </Col>
            </Row>
            <Row>
                <Col className={activeShiftList.c.cssClassName}>
                    {activeShiftList.c.type} : {activeShiftList.c.timeSlot}
                </Col>
            </Row>
            <Row>
                <Col className={activeShiftList.d.cssClassName}>
                    {activeShiftList.d.type} : {activeShiftList.d.timeSlot}
                </Col>
            </Row>
            <Row>
                <Col className={activeShiftList.d1.cssClassName}>
                    {activeShiftList.d1.type} : {activeShiftList.d1.timeSlot}
                </Col>
            </Row>
            <Row>
                <Col className={activeShiftList.d2.cssClassName}>
                    {activeShiftList.d2.type} : {activeShiftList.d2.timeSlot}
                </Col>
            </Row>
            <Row>
                <Col className={activeShiftList.d3.cssClassName}>
                    {activeShiftList.d3.type} : {activeShiftList.d3.timeSlot}
                </Col>
            </Row>
            <Row>
                <Col className={activeShiftList.s.cssClassName}>
                    {activeShiftList.s.type} : {activeShiftList.s.timeSlot}
                </Col>
            </Row>
            <Row>
                <Col className={activeShiftList.O.cssClassName}>
                    {activeShiftList.O.type} : {activeShiftList.O.timeSlot}
                </Col>
            </Row>
        </Container>
    )
}