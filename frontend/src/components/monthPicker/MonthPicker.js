import React from "react";
import "./MonthPicker.css";
class MonthPicker extends React.Component {
  constructor(props) {
    super(props);
    this.calendarDate = this.initialDate;
    this.initialDate = this.props.initialDate || new Date();
    this.maxDate=this.props.maxDate||new Date(2021,5,30);
    this.minDate=this.props.minDate||new Date(2020,2,1);
    
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
//======================================================================================================================    
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
      if(!this.obj.current.contains(e.target)) {
        console.log(this.state.showCalendar);
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
    let theDate,monthCellList=[],monthRowList=[];
    let nextMonthBtn,nextYearBtn,prevMonthBtn,prevYearBtn;
    for (let i=0;i<12;i++){
      if ((i>0)&&((i %3)===0)){
        monthRowList.push(<div className="d-flex flex-row justify-content-around" key={"monthRow_"+(i/3)}>{monthCellList}</div>);
        monthCellList=[];
      }
      theDate=new Date(this.state.currentDate.getFullYear(),i,1);
      if ((theDate>=this.minDate) && (theDate<=this.maxDate)){
        monthCellList.push(<div className="p-1 monthCell" key={"monthCell_"+(i)} onClick={() => this.updateMonth(i)}>
          {this.monthShortName[i]}
        </div>);
      } else {
        monthCellList.push(<div className="p-1 disabledBtn" key={"monthCell_"+(i)}>
          {this.monthShortName[i]}
        </div>);
      }
    }
    monthRowList.push(<div className="d-flex flex-row justify-content-around" key={"monthRow_4"}>{monthCellList}</div>);
    //console.log("before="+this.state.currentDate);
    let nextMonthDate=new Date(this.state.currentDate.getFullYear(),this.state.currentDate.getMonth(),1);
    nextMonthDate.setMonth(nextMonthDate.getMonth()+1);
    nextMonthDate.setDate(1);
    if ((nextMonthDate>=this.minDate)&&(nextMonthDate<=this.maxDate)){
      nextMonthBtn=<div className="changeBtn p-1" onClick={this.addAMonth}>&gt;</div>
    } else {
      nextMonthBtn=<div className="disabledBtn">&gt;</div>
    }
    //console.log("after="+this.state.currentDate);
    let nextYearDate=new Date(this.state.currentDate.getFullYear()+1,0,1);
    //console.log(nextYearDate);
    if ((nextYearDate>=this.minDate)&& (nextYearDate<=this.maxDate)){
      nextYearBtn=<div className="changeBtn" onClick={this.addAYear}>&gt;</div>
    } else {
      nextYearBtn=<div className="disabledBtn">&gt;</div>
    }
    
    let prevMonthDate=new Date(this.state.currentDate.getFullYear(),this.state.currentDate.getMonth(),1);
    prevMonthDate.setMonth(prevMonthDate.getMonth()-1);
    if ((prevMonthDate>=this.minDate)&&(prevMonthDate<=this.maxDate)){
      prevMonthBtn=<div className="changeBtn p-1" onClick={this.minusAMonth}>&lt;</div>
    }else {
      prevMonthBtn=<div className="disabledBtn">&lt;</div>
    }
    let prevYearDate=new Date(this.state.currentDate.getFullYear()-1,0,1);    
    if ((prevYearDate>=this.minDate)&&(prevYearDate<=this.maxDate)){
      prevYearBtn=<div className="changeBtn" onClick={this.minusAYear}>&lt;</div>
    }else {
      prevYearBtn=<div className="disabledBtn">&lt;</div>
    }
    return (
      <div ref={this.obj}>
        <div className="align-items-center d-flex justify-content-center result">
          {prevMonthBtn}
          <div className="changeBtn p-1" onClick={this.toggleCalendar}>
            {this.resultDate}   
          </div>
          {nextMonthBtn}
        </div>
        {this.state.showCalendar ? (
          <div className="d-flex justify-content-center position-relative">
            <div className="popup">
              <div className="d-flex flex-row justify-content-around">
                {prevYearBtn}
                <div>{this.state.currentDate.getFullYear()}</div>
                {nextYearBtn}
              </div>
              {monthRowList}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
export default MonthPicker;
