import React from "react";
import "./MonthPicker.css";
class MonthPicker extends React.Component {
  constructor(props) {
    super(props);
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
//======================================================================================================================    
    this.nextMonth=()=>{
      let newDate=this.state.currentDate;
      let newMonth=newDate.getMonth()+1;
      newDate.setMonth(newMonth);
      this.resultDate= this.monthFullName[newDate.getMonth()]+" "+newDate.getFullYear();
      this.setState({ currentDate: newDate});
      if (this.props.onSelect){
        this.props.onSelect(newDate.getFullYear(),newDate.getMonth());
      }
    };
    this.nextYear=()=>{
      let newDate=this.state.currentDate;
      let newYear=newDate.getFullYear()+1;
      newDate.setFullYear(newYear);
      this.setState({"currentDate": newDate});
    };    
    
    this.prevMonth=()=>{
      let newDate=this.state.currentDate;
      let newMonth=newDate.getMonth()-1;
      newDate.setMonth(newMonth);
      this.resultDate= this.monthFullName[newDate.getMonth()]+" "+newDate.getFullYear();
      this.setState({ currentDate: newDate});
      if (this.props.onSelect){
        this.props.onSelect(newDate.getFullYear(),newDate.getMonth());
      }
    }
    this.prevYear=()=>{
      let newDate=this.state.currentDate;
      let newYear=newDate.getFullYear()-1;
      newDate.setFullYear(newYear);
      this.setState({"currentDate": newDate});
    };
    this.handleClick = e => {
      if(this.state.showCalendar && (!this.obj.current.contains(e.target))) {
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
    
    /*****************************************************************
     * if the first day of the next month does not within the range, *
     * the next month button should be disabled.                     *
     *****************************************************************/  
    let nextMonthDate=new Date(this.state.currentDate.getFullYear(),this.state.currentDate.getMonth(),1);
    nextMonthDate.setMonth(nextMonthDate.getMonth()+1);
    if ((nextMonthDate>=this.minDate)&&(nextMonthDate<=this.maxDate)){
      nextMonthBtn=<div className="changeBtn p-1" onClick={this.nextMonth} title="Next Month">&gt;</div>
    } else {
      nextMonthBtn=<div className="disabledBtn" title="Next Month">&gt;</div>
    }
    
    /****************************************************************
     * if the first day of the next year does not within the range, *
     * the next year button should be disabled.                     *
     ****************************************************************/
    let nextYearDate=new Date(this.state.currentDate.getFullYear()+1,0,1);
    if ((nextYearDate>=this.minDate)&& (nextYearDate<=this.maxDate)){
      nextYearBtn=<div className="changeBtn" onClick={this.nextYear} title="Next Year">&gt;</div>
    } else {
      nextYearBtn=<div className="disabledBtn" title="Next Year">&gt;</div>
    }

    /*******************************************************************
     * if the last day of the previous month does not within the range, *
     * the previous month button should be disabled.                    *
     *******************************************************************/    
    let prevMonthDate=new Date(this.state.currentDate.getFullYear(),this.state.currentDate.getMonth(),1);
    prevMonthDate.setDate(prevMonthDate.getDate()-1);
    if ((prevMonthDate>=this.minDate)&&(prevMonthDate<=this.maxDate)){
      prevMonthBtn=<div className="changeBtn p-1" onClick={this.prevMonth} title="Previous Month">&lt;</div>
    }else {
      prevMonthBtn=<div className="disabledBtn" title="Previous Month">&lt;</div>
    }

    /*******************************************************************
     * if the last day of the previous year does not within the range, *
     * the previous year button should be disabled.                    *
     *******************************************************************/
    let prevYearDate=new Date(this.state.currentDate.getFullYear()-1,11,31);    
    if ((prevYearDate>=this.minDate)&&(prevYearDate<=this.maxDate)){
      prevYearBtn=<div className="changeBtn" onClick={this.prevYear} title="Previous Year">&lt;</div>
    }else {
      prevYearBtn=<div className="disabledBtn" title="Previous Year">&lt;</div>
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
