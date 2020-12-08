import React from "react";
import "./MonthPicker.css";
class MonthPicker extends React.Component {
  constructor(props) {
    super(props);
    this.calendarDate = this.initialDate;
    this.initialDate = this.props.initialDate || new Date();
    this.maxDate=this.props.maxDate||new Date(9999,11,31);
    this.minDate=this.props.minDate||new Date(1000,0,1);
    this.monthFullName = this.props.monthFullName || [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    this.monthShortName = this.props.monthShortName || [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC'];
    this.obj = React.createRef();
    this.state = {"currentDate": this.initialDate, showCalendar: false };
    this.resultDate= this.monthFullName[this.state.currentDate.getMonth()]+" "+this.state.currentDate.getFullYear();
    this.addAMonth=()=>{
      let newDate=this.state.currentDate;
      let newMonth=newDate.getMonth()+1;
      newDate.setMonth(newMonth);
      this.resultDate= this.monthFullName[newDate.getMonth()]+" "+newDate.getFullYear();
      this.setState({ currentDate: newDate});
      if (this.props.onSelect){
        this.props.onSelect(newDate.getFullYear(),newDate.getMonth());
      }
    };
    this.addAYear=()=>{
      let newDate=this.state.currentDate;
      let newYear=newDate.getFullYear()+1;
      newDate.setFullYear(newYear);
      this.setState({"currentDate": newDate});
    };    
    
    this.minusAMonth=()=>{
      let newDate=this.state.currentDate;
      let newMonth=newDate.getMonth()-1;
      newDate.setMonth(newMonth);
      this.resultDate= this.monthFullName[newDate.getMonth()]+" "+newDate.getFullYear();
      this.setState({ currentDate: newDate});
      if (this.props.onSelect){
        this.props.onSelect(newDate.getFullYear(),newDate.getMonth());
      }
    }
    this.minusAYear=()=>{
      let newDate=this.state.currentDate;
      let newYear=newDate.getFullYear()-1;
      newDate.setFullYear(newYear);
      this.setState({"currentDate": newDate});
    };
    this.handleClick = e => {
      if (!this.obj.current.contains(e.target)) {
        this.setState({ showCalendar: false });
      }
    };    
    this.toggleCalendar = e => {
      let result = !this.state.showCalendar;
      this.setState({ showCalendar: result });
    };
    this.updateMonth = monthValue => {
      let newDate = this.state.currentDate;
      newDate.setMonth(monthValue);
      this.setState({ currentDate: newDate, showCalendar: false });
      this.resultDate= this.monthFullName[newDate.getMonth()]+" "+newDate.getFullYear();
      if (this.props.onSelect){
        this.props.onSelect(newDate.getFullYear(),newDate.getMonth());
      }
    };
  }
  componentDidMount() {
    document.addEventListener("mouseup", this.handleClick);
  }
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleClick);
  }
  render() {
    return (
      <div ref={this.obj}>
        <div className="d-flex justify-content-center result">
          <div className="changeBtn p-1" onClick={this.minusAMonth}>&lt;</div>
          <div className="changeBtn p-1" onClick={this.toggleCalendar}>
            {this.resultDate}   
          </div>
          <div className="changeBtn p-1" onClick={this.addAMonth}>&gt;</div>
        </div>
        {this.state.showCalendar ? (
          <div className="d-flex justify-content-center position-relative">
            <div className="popup">
              <div className="d-flex flex-row justify-content-around">
                <div className="changeBtn" onClick={this.minusAYear}>&lt;</div>
                <div>{this.state.currentDate.getFullYear()}</div>
                <div className="changeBtn" onClick={this.addAYear}>&gt;</div>
              </div>
              <div className="d-flex flex-row justify-content-around">
                <div
                  className="p-1 monthCell"
                  onClick={() => this.updateMonth(0)}
                >
                  {this.monthShortName[0]}
                </div>
                <div
                  className="p-1 monthCell"
                  onClick={() => this.updateMonth(1)}
                >
                  {this.monthShortName[1]}
                </div>
                <div
                  className="p-1 monthCell"
                  onClick={() => this.updateMonth(2)}
                >
                  {this.monthShortName[2]}
                </div>
              </div>
              <div className="d-flex flex-row justify-content-around">
                <div
                  className="p-1 monthCell"
                  onClick={() => this.updateMonth(3)}
                >
                  {this.monthShortName[3]}
                </div>
                <div
                  className="p-1 monthCell"
                  onClick={() => this.updateMonth(4)}
                >
                  {this.monthShortName[4]}
                </div>
                <div
                  className="p-1 monthCell"
                  onClick={() => this.updateMonth(5)}
                >
                  {this.monthShortName[5]}
                </div>
              </div>
              <div className="d-flex flex-row justify-content-around">
                <div
                  className="p-1 monthCell"
                  onClick={() => this.updateMonth(6)}
                >
                  {this.monthShortName[6]}
                </div>
                <div
                  className="p-1 monthCell"
                  onClick={() => this.updateMonth(7)}
                >
                  {this.monthShortName[7]}
                </div>
                <div
                  className="p-1 monthCell"
                  onClick={() => this.updateMonth(8)}
                >
                  {this.monthShortName[8]}
                </div>
              </div>
              <div className="d-flex flex-row justify-content-around">
                <div
                  className="p-1 monthCell"
                  onClick={() => this.updateMonth(9)}
                >
                  {this.monthShortName[9]}
                </div>
                <div
                  className="p-1 monthCell"
                  onClick={() => this.updateMonth(10)}
                >
                  {this.monthShortName[10]}
                </div>
                <div
                  className="p-1 monthCell"
                  onClick={() => this.updateMonth(11)}
                >
                  {this.monthShortName[11]}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
export default MonthPicker;
