import {Col,Container,Row} from 'react-bootstrap';
function App() {
  let dateRow=[],dayRow=[];
  let holidayRow=[],itoShiftsRow=[];
  let counter;
  dateRow.push(<td  key="date0" style={{
    "borderTop":"1px inset #e0e0e0",
    "borderLeft":"1px inset #e0e0e0",
    "padding":"0px",
    "width":"200px",
    "fontSize":"17px",
    "textAlign":"left"}}>Resident Support<br/>Team Members</td>); 

  for (counter=0;counter<31;counter++){
    dateRow.push(
      <td className="text-center" 
          key={"date"+(counter+1)}
          style={{"borderTop":"1px inset #e0e0e0",
                  "borderLeft":"1px inset #e0e0e0",
                  }}>
        {counter+1}
      </td>
    )
  }
  dateRow.push(
    <td className="text-center" 
        key="lastMonth"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                }}>
      Last<br/>Month
    </td>
  )
  dateRow.push(
    <td className="text-center" 
        key="thisMonth"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                }}>
      This<br/>Month
    </td>
  )
  dateRow.push(
    <td className="text-center" 
        key="total"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                }}>
      Total
    </td>
  )

  dateRow.push(
    <td className="text-center" 
        key="totalAShift"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                "width":"60px"
                }}>
      Total No. of<br/>
      A Shift
    </td>
  )
  dateRow.push(
    <td className="text-center" 
        key="totalBShift"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                "width":"60px"
                }}>
      Total No. of<br/>
      Bx Shift
    </td>
  )  
  dateRow.push(
    <td className="text-center" 
        key="totalCShift"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                "width":"60px"
                }}>
      Total No. of<br/>
      C Shift
    </td>
  )
  dateRow.push(
    <td className="text-center" 
        key="totalDShift"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                "width":"60px"
                }}>
      Total No. of<br/>
      Dx Shift
    </td>
  )
  dateRow.push(
    <td className="text-center" 
        key="noOfWorkingDay"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                "borderRight":"1px inset #e0e0e0",
                "width":"60px"
                }}>
      No. of<br/>
      working<br/>
      day
    </td>
  )

//=========================================================================================================================
  dayRow.push(<td  key="day0" style={{
    "borderTop":"1px inset #e0e0e0",
    "borderLeft":"1px inset #e0e0e0",
    "padding":"0px",
    "width":"200px",
    "fontSize":"17px",
    "textAlign":"left"}}>Days</td>); 
  for (counter=0;counter<31;counter++){
    dayRow.push(
      <td className="font-weight-bold text-center" 
          key={"day"+(counter+1)}
          style={{"borderTop":"1px inset #e0e0e0",
                  "borderLeft":"1px inset #e0e0e0",
                  "color":"#ff0000"
                  }}>
        Su
      </td>
    )
  }
  dayRow.push(
    <td className="text-center" 
        key="totalHour"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                }}>
      Total<br/>Hour
    </td>
  )
  dayRow.push(
    <td className="text-center" 
        key="actualHour"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                }}>
      Actual<br/>Hour
    </td>
  )
  dayRow.push(
    <td className="text-center" 
        key="hourOffDue"
        colSpan="8"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                "borderRight":"1px inset #e0e0e0",
                }}>
      Hour Off Due
    </td>
  )
//=========================================================================================================================
  holidayRow.push(<td  key="holiday0" style={{
    "borderTop":"1px inset #e0e0e0",
    "borderLeft":"1px inset #e0e0e0",
    "padding":"0px",
    "width":"200px",
    "fontSize":"17px",
    "textAlign":"left"}}>Holiday</td>);

  for (counter=0;counter<31;counter++){
    holidayRow.push(
      <td className="font-weight-bold text-center" 
          key={"holiday"+(counter+1)}
          style={{"borderTop":"1px inset #e0e0e0",
                  "borderLeft":"1px inset #e0e0e0",
                  "color":"#ff0000"
                  }}>
        PH
      </td>
    )
  }
  holidayRow.push(
    <td className="text-center text-danger" 
        colSpan="10"
        key="32"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                "borderRight":"1px inset #e0e0e0",
                }}>
    </td>
  );
//=========================================================================================================================
  itoShiftsRow.push(<td  key="ito0" style={{
    "borderTop":"1px inset #e0e0e0",
    "borderLeft":"1px inset #e0e0e0",
    "padding":"0px",
    "width":"200px",
    "fontSize":"17px",
    "textAlign":"left"}}>TSANG Ka Shing Gary<br/>ITO1 Extn. 2458</td>)
  for (counter=0;counter<31;counter++){
    itoShiftsRow.push(
      <td className="font-weight-bold text-center" 
          key={"ito0_"+(counter+1)}
          style={{"borderTop":"1px inset #e0e0e0",
                  "borderLeft":"1px inset #e0e0e0",
                  }}>
        a
      </td>
    )
  }
  itoShiftsRow.push(
    <td className="text-center" 
        key="ito0_totalHour"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                }}>
      163.8
    </td>
  )
  itoShiftsRow.push(
    <td className="text-center" 
        key="ito0_actualHour"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                }}>
     166.0
    </td>
  )
  itoShiftsRow.push(
    <td className="text-center" 
        key="ito0_lastMonth"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                }}>
      12.35
    </td>
  )
  itoShiftsRow.push(
    <td className="text-center" 
        key="ito0_thisMonth"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                }}>
      2.20
    </td>
  )
  itoShiftsRow.push(
    <td className="text-center" 
        key="ito0_total"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                }}>
      14.55
    </td>
  )

  itoShiftsRow.push(
    <td className="text-center" 
        key="ito0_totalAShift"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                "width":"60px"
                }}>
      3
    </td>
  )
  itoShiftsRow.push(
    <td className="text-center" 
        key="ito0_totalBShift"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                "width":"60px"
                }}>
      6
    </td>
  )  
  itoShiftsRow.push(
    <td className="text-center" 
        key="ito0_totalCShift"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                "width":"60px"
                }}>
      6
    </td>
  )
  itoShiftsRow.push(
    <td className="text-center" 
        key="totalDShift"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                "width":"60px"
                }}>
      5
    </td>
  )
  itoShiftsRow.push(
    <td className="text-center" 
        key="ito0_noOfWorkingDay"
        rowSpan="2"
        style={{"borderTop":"1px inset #e0e0e0",
                "borderLeft":"1px inset #e0e0e0",
                "borderRight":"1px inset #e0e0e0",
                "width":"60px"
                }}>
      20
    </td>
  )  
  return (
    <div className="App p-1">
      <Container fluid={true} style={{"fontFamily":"Times New Roman"}}>
        <Row>
          <Col className="font-weight-bold text-center" md={12} lg={12} sm={12} xl={12} xs={12}>
            <u style={{"fontSize":"18px"}}>EMSTF Resident Support & Computer Operation Support Services Team Roster</u>
          </Col>
        </Row>
        <Row>
          <Col className="font-weight-bold text-center" md={12} lg={12} sm={12} xl={12} xs={12}>
            <u style={{"fontSize":"15px"}}>
              &lt; November 2020 &gt;
            </u>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center p-0" md={12} lg={12} sm={12} xl={12} xs={12}>
            <table style={{"width":"100%","borderCollapse":"collapse"}}>
              <thead>
                <tr>{holidayRow}</tr>
                <tr>{dayRow}</tr>
                <tr>{dateRow}</tr>
              </thead>
              <tbody>
                <tr>{itoShiftsRow}</tr>
              </tbody>
            </table>
          </Col>
        </Row>    
      </Container>
    </div>
  );
}

export default App;
