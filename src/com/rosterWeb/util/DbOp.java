package com.rosterWeb.util;

import com.rosterWeb.ITO;
import com.rosterWeb.ITORoster;
import com.rosterWeb.Roster;
import com.rosterWeb.RosterRule;
import com.rosterWeb.Utility;
import com.rosterWeb.rosterStatistic.ITOYearlyStatistic;
import com.rosterWeb.rosterStatistic.MonthlyStatistic;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class DbOp implements DataStore {
	private Connection dbConn = null;
	
	private String dbServerName=Utility.getParameterValue("dbServerName");
	private	String dbms=Utility.getParameterValue("dbms");
	private String dbName=Utility.getParameterValue("dbName");
	private String dbUserName=Utility.getParameterValue("dbUserName");
	private String dbUserPwd=Utility.getParameterValue("dbUserPwd");
	private String jdbcDriver =Utility.getParameterValue("jdbcDriver");
	private String jdbcURL = new String("jdbc:");
	private String sqlString;
	
	private static final Logger logger = LogManager.getLogger(Class.class.getSimpleName());
	/**
	 * Database object,initialize db connection
	 * 
	 * @throws SQLException if a database access error occurs or the url is null
	 * @throws ClassNotFoundException the exception that was raised while loading the class
	 * @throws IllegalAccessException the exception that was raised while reflecting the class
	 * @throws InstantiationException the exception that was raised while instantiating the class
	 */	
	public DbOp() throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException
	{
		jdbcURL =jdbcURL +dbms+"://";
		jdbcURL =jdbcURL +dbServerName+"/"+dbName+"?useUnicode=true&characterEncoding=UTF-8";
		Class.forName(jdbcDriver);
		dbConn= DriverManager.getConnection(jdbcURL,dbUserName,dbUserPwd);
	}
	
	@Override
	public Map<String,ITO>getAllITOInfo(){
		ArrayList <String>blackListShiftPatternList=null;
		ITO ito=null;
		List<String>list;
		LocalDate joinDate,leaveDate;
		Map<String,ITO> result=new TreeMap<String,ITO>();
		PreparedStatement stmt = null;
		ResultSet rs = null;

		sqlString ="SELECT join_date,leave_date,ito_info.ito_id,post_name,ito_name,available_shift,working_hour_per_day,black_list_pattern from ";
		sqlString+="ito_info inner join black_list_pattern ";
		sqlString+="on ito_info.ito_id=black_list_pattern.ito_id ";
		sqlString+="order by ito_info.ito_id";
		
		try
		{
			stmt=dbConn.prepareStatement(sqlString);
			rs=stmt.executeQuery();
			while (rs.next())
			{
				if (result.containsKey(rs.getString("ito_id")))
				{	
					ito=result.get(rs.getString("ito_id"));
					blackListShiftPatternList=ito.getBlackListedShiftPatternList();
					blackListShiftPatternList.add(rs.getString("black_list_pattern"));
					ito.setBlackListedShiftPatternList(blackListShiftPatternList);
					result.replace(ito.getITOId(), ito);
//					logger.debug(rs.getString("ito_name")+","+ito.getJoinDate().get(Calendar.MONTH)+","+rs.getDate("join_date").getMonth());
				}
				else
				{
					ito=new ITO();
					ito.setITOId(rs.getString("ito_id"));
					ito.setPostName(rs.getString("post_name"));
					ito.setITOName(rs.getString("ito_name"));
					ito.setWorkingHourPerDay(rs.getFloat("working_hour_per_day"));
					joinDate=rs.getDate("join_date").toLocalDate();
					leaveDate=rs.getDate("leave_date").toLocalDate();
					
					ito.setJoinDate(joinDate);
					ito.setLeaveDate(leaveDate);
					list=Arrays.asList(rs.getString("available_shift").split(","));
					Collections.sort(list, String.CASE_INSENSITIVE_ORDER);
					ito.setAvailableShiftList(new ArrayList<String>(list));
					blackListShiftPatternList=new ArrayList<String>();
					blackListShiftPatternList.add(rs.getString("black_list_pattern"));
					ito.setBlackListedShiftPatternList(blackListShiftPatternList);
					result.put(ito.getITOId(), ito);
				}
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		} 
		finally 
		{
			releaseResource(rs, stmt);
		}
		return result;		

	}
	@Override
	public Map<String, ITO> getITOList(int year, int month) {
		ITO ito=null;
		int lastDay;
		ResultSet rs = null;
		
		PreparedStatement stmt = null;
		ArrayList <String>blackListShiftPatternList=null;
		List<String>list;
		LocalDate joinDate,leaveDate;
		LocalDate theFirstDateOfTheMonth=LocalDate.of(year,month,1);
		Map<String,ITO> result=new TreeMap<String,ITO>();
		lastDay=theFirstDateOfTheMonth.getMonth().length(theFirstDateOfTheMonth.isLeapYear());
		String firstDateString=theFirstDateOfTheMonth.getYear()+"-"+theFirstDateOfTheMonth.getMonthValue()+"-1";
		String endDateString=theFirstDateOfTheMonth.getYear()+"-"+theFirstDateOfTheMonth.getMonthValue()+"-"+lastDay;
	
		logger.debug("startDateString="+firstDateString);
		logger.debug("endDateString="+endDateString);
		
		sqlString ="SELECT join_date,leave_date,ito_info.ito_id,post_name,ito_name,available_shift,working_hour_per_day,black_list_pattern from ";
		sqlString+="ito_info inner join black_list_pattern ";
		sqlString+="on ito_info.ito_id=black_list_pattern.ito_id ";
		sqlString+="where join_date<? and leave_date >? ";
		sqlString+="order by ito_info.ito_id";
		try
		{
			stmt=dbConn.prepareStatement(sqlString);
			stmt.setString(1,firstDateString);
			stmt.setString(2,endDateString);
			rs=stmt.executeQuery();
			while (rs.next())
			{
				if (result.containsKey(rs.getString("ito_id")))
				{	
					ito=result.get(rs.getString("ito_id"));
					blackListShiftPatternList=ito.getBlackListedShiftPatternList();
					blackListShiftPatternList.add(rs.getString("black_list_pattern"));
					ito.setBlackListedShiftPatternList(blackListShiftPatternList);
					result.replace(ito.getITOId(), ito);
//					logger.debug(rs.getString("ito_name")+","+ito.getJoinDate().get(Calendar.MONTH)+","+rs.getDate("join_date").getMonth());
				}
				else
				{
					ito=new ITO();
					ito.setITOId(rs.getString("ito_id"));
					ito.setPostName(rs.getString("post_name"));
					ito.setITOName(rs.getString("ito_name"));
					ito.setWorkingHourPerDay(rs.getFloat("working_hour_per_day"));
					joinDate=rs.getDate("join_date").toLocalDate();
					leaveDate=rs.getDate("leave_date").toLocalDate();
					
					ito.setJoinDate(joinDate);
					ito.setLeaveDate(leaveDate);
					list=Arrays.asList(rs.getString("available_shift").split(","));
					Collections.sort(list, String.CASE_INSENSITIVE_ORDER);
					ito.setAvailableShiftList(new ArrayList<String>(list));
					blackListShiftPatternList=new ArrayList<String>();
					blackListShiftPatternList.add(rs.getString("black_list_pattern"));
					ito.setBlackListedShiftPatternList(blackListShiftPatternList);
					result.put(ito.getITOId(), ito);
				}
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		} 
		finally 
		{
			releaseResource(rs, stmt);
		}
		return result;		
	}
	@Override
	public Map<String, Map<Integer, String>> getPreferredShiftList(int year, int month, String[] itoIdList)
	{
		LocalDate theMonthShiftStartDate=LocalDate.of(year,month,1);
		Map<Integer,String>preferredShiftList;
		Map<String, Map<Integer, String>>result=new TreeMap<String, Map<Integer, String>>();
		int lastDayOfThisMonth;
		ResultSet rs = null;
		PreparedStatement stmt = null;
		lastDayOfThisMonth=theMonthShiftStartDate.getMonth().length(theMonthShiftStartDate.isLeapYear());
		String theMonthShiftEndDateString=year+"-"+month+"-"+lastDayOfThisMonth;
		String theMonthShiftStartDateString=year+"-"+month+"-1";
		try
		{
			for (String itoId :itoIdList)
			{
				preferredShiftList=new TreeMap<Integer,String>();
				sqlString="select day(shift_date) as d,preferred_shift from preferred_shift where ito_id=? and (preferred_shift.shift_date between ? and ?)";
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setString(2,theMonthShiftStartDateString);
				stmt.setString(3,theMonthShiftEndDateString);
				rs=stmt.executeQuery();
				while (rs.next())
				{
					preferredShiftList.put(rs.getInt(1), rs.getString("preferred_shift"));
				}
				stmt.close();
				rs.close();
				result.put(itoId, preferredShiftList);
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		} 
		finally 
		{
			releaseResource(rs, stmt);
		}	
		return result;
	}
	@Override
	public Map<String, ITORoster> getITORosterList(int year, int month, String[] itoIdList) {
		int lastDayOfThisMonth;
		String temp;
		ResultSet rs = null;
		ITORoster itoRoster=null;
		PreparedStatement stmt = null;
		
		Map <Integer,String>shiftList=new TreeMap<Integer,String>();
		Map<Integer,String> previousMonthShiftList=new TreeMap<Integer,String>();
		Map<String, ITORoster> result=new TreeMap<String, ITORoster>();
		
		LocalDate previousMonthShiftEndDate=LocalDate.of(year, month,1);
		LocalDate previousMonthShiftStartDate=LocalDate.of(year,month,1);
		LocalDate theMonthShiftStartDate=LocalDate.of(year,month,1);
		
		previousMonthShiftStartDate=previousMonthShiftStartDate.minusDays(RosterRule.getMaxConsecutiveWorkingDay());
		previousMonthShiftEndDate=previousMonthShiftEndDate.minusDays(1);
		
		lastDayOfThisMonth=theMonthShiftStartDate.getMonth().length(theMonthShiftStartDate.isLeapYear());
		
		String previousMonthShiftStartDateString=previousMonthShiftStartDate.getYear()+"-"+previousMonthShiftStartDate.getMonthValue()+"-"+previousMonthShiftStartDate.getDayOfMonth();
		String previousMonthShiftEndDateString=previousMonthShiftEndDate.getYear()+"-"+previousMonthShiftEndDate.getMonthValue()+"-"+previousMonthShiftEndDate.getDayOfMonth();
		
		String theMonthShiftStartDateString=theMonthShiftStartDate.getYear()+"-"+theMonthShiftStartDate.getMonthValue()+"-1";
		String theMonthShiftEndDateString=theMonthShiftStartDate.getYear()+"-"+theMonthShiftStartDate.getMonthValue()+"-"+lastDayOfThisMonth;
				
		logger.debug("previousMonthShiftStartDateString="+previousMonthShiftStartDateString);
		logger.debug("previousMonthShiftEndDateString  ="+previousMonthShiftEndDateString);
		logger.debug("theMonthShiftEndDateString      ="+theMonthShiftEndDateString);
		logger.debug("theMonthShiftStartDateString    ="+theMonthShiftStartDateString);

		try
		{
			int counter;
			for (String itoId :itoIdList)
			{
				itoRoster=new ITORoster();
				sqlString ="select balance from last_month_balance where ito_Id=? and shift_month=?";
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setString(2,theMonthShiftStartDateString);
				rs=stmt.executeQuery();
				if (rs.next())
					itoRoster.setBalance(rs.getFloat("balance"));
				else
					itoRoster.setBalance(0);
				stmt.close();
				rs.close();
				
				previousMonthShiftList=new TreeMap<Integer,String>();
				sqlString ="select day(shift_date) as d,shift from shift_record where ito_Id=? and (shift_record.shift_date between ? and ?)";
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setString(2,previousMonthShiftStartDateString);
				stmt.setString(3,previousMonthShiftEndDateString);
				rs=stmt.executeQuery();
				counter=1;
				while (rs.next())
				{	
					previousMonthShiftList.put(counter++, rs.getString("shift"));
				}
				stmt.close();
				rs.close();
				logger.debug("itoId="+itoId+",previousMonthShiftList.size()="+previousMonthShiftList.size());
				itoRoster.setPreviousMonthShiftList(previousMonthShiftList);
				
				sqlString ="select day(shift_date) as d,shift from shift_record where ito_Id=? and (shift_record.shift_date between ? and ?)";
				shiftList=new TreeMap<Integer,String>();
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setString(2,theMonthShiftStartDateString);
				stmt.setString(3,theMonthShiftEndDateString);
				rs=stmt.executeQuery();
				while (rs.next())
				{	
					temp=rs.getString("shift");
					if (shiftList.containsKey(rs.getInt("d")))
					{
						temp=shiftList.get(rs.getInt("d"))+"+"+temp;
					}
					shiftList.put(rs.getInt("d"), temp);
				}
				stmt.close();
				rs.close();
				itoRoster.setShiftList(shiftList);
				
				sqlString ="SELECT working_hour_per_day,post_name,ito_name from ito_info where ito_id=?";
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				rs=stmt.executeQuery();
				while (rs.next())
				{
					itoRoster.setITOWorkingHourPerDay(rs.getFloat("working_hour_per_day"));
					itoRoster.setITOName(rs.getString("ito_name"));
					itoRoster.setITOPostName(rs.getString("post_name"));
				}
				stmt.close();
				rs.close();
				result.put(itoId,itoRoster);
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		} 
		finally 
		{
			releaseResource(rs, stmt);
		}
		return result;
	}

	@Override
	public Map<String, ArrayList<String>> getRosterRule() {
		char escapChar=(char)27;
		ResultSet rs = null;
		
		String ruleType=new String();
		PreparedStatement stmt = null;
		ArrayList <String>keyValue=null;
		Map<String,ArrayList<String>> result=new TreeMap<String,ArrayList<String>>();
		sqlString ="select * from roster_rule order by rule_type,rule_key,rule_value";
		try
		{
			logger.debug(sqlString);
			stmt=dbConn.prepareStatement(sqlString);
			rs=stmt.executeQuery();
			while (rs.next())
			{
				if (rs.getString("rule_type").equals(ruleType))
				{
					keyValue.add(rs.getString("rule_key")+escapChar+rs.getString("rule_value"));
					
				}
				else
				{
					if (keyValue!=null)
					{
						result.put(ruleType,keyValue);
						ruleType=rs.getString("rule_type");
					}
					ruleType=rs.getString("rule_type");
					keyValue=new ArrayList<String>();
					keyValue.add(rs.getString("rule_key")+escapChar+rs.getString("rule_value"));
				}
			}
			if (keyValue!=null)
				result.put(ruleType, keyValue);
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		} 
		finally 
		{
			releaseResource(rs, stmt);
		}
		return result;
	}

	@Override
	public Map<String, ITOYearlyStatistic> getYearlyRosterStatistic(int year, int month) 
	{
		int lastDay;
		ResultSet rs = null;
		PreparedStatement stmt = null;
		MonthlyStatistic monthlyStatistic =null;
		ITOYearlyStatistic iTOYearlyStatistic=null;
		LocalDate theFirstDateOfTheMonth=LocalDate.of(year,month,1);
		lastDay=theFirstDateOfTheMonth.getMonth().length(theFirstDateOfTheMonth.isLeapYear());
		String startDateString=theFirstDateOfTheMonth.getYear()+"-"+theFirstDateOfTheMonth.getMonthValue()+"-1";
		String endDateString=theFirstDateOfTheMonth.getYear()+"-"+theFirstDateOfTheMonth.getMonthValue()+"-"+lastDay;
		
		Map<String,ITOYearlyStatistic> result=new TreeMap<String, ITOYearlyStatistic>();
		logger.debug("startDateString="+startDateString);
		logger.debug("endDateString="+endDateString);
		logger.debug("year="+year);
		logger.debug("month="+theFirstDateOfTheMonth.getMonthValue());
		sqlString="select a.ito_id,b.post_name,";
		sqlString=sqlString+"			sum(case when shift ='a' then 1 else 0 end) as a,";
		sqlString=sqlString+"			sum(case when shift ='b' or shift ='b1' then 1 else 0 end) as b,";
		sqlString=sqlString+"			sum(case when shift ='c' then 1 else 0 end) as c,";
		sqlString=sqlString+"			sum(case when shift ='d' or shift='d1' or shift='d2' or shift='d3' then 1 else 0 end) as d,";
		sqlString=sqlString+"			sum(case when shift ='O' then 1 else 0 end) as o,";
		sqlString=sqlString+"			year(shift_date) as y,";
		sqlString=sqlString+"			month(shift_date) m ";
		sqlString=sqlString+"from ";
		sqlString=sqlString+"shift_record a inner join ito_info b ";
		sqlString=sqlString+"on join_date<? and ";
		sqlString=sqlString+"   leave_date>? and ";
		sqlString=sqlString+"   year(shift_date)=? and ";
		sqlString=sqlString+"   month(shift_date) <=? and ";
		sqlString=sqlString+"   a.ITO_ID =b.ito_id ";
		sqlString=sqlString+"group by a.ito_id,year(shift_date),month(shift_date)";
		try
		{
			stmt=dbConn.prepareStatement(sqlString);
			stmt.setString(1,startDateString);
			stmt.setString(2,endDateString);
			stmt.setInt(3,year);
			stmt.setInt(4,theFirstDateOfTheMonth.getMonthValue());
			rs=stmt.executeQuery();
			while (rs.next())
			{
				if (result.containsKey(rs.getString("ito_id")))
				{
					iTOYearlyStatistic=result.remove(rs.getString("ito_id"));
				}
				else
				{
					iTOYearlyStatistic=new ITOYearlyStatistic();
					iTOYearlyStatistic.setItoPostName(rs.getString("post_name"));
				}
				monthlyStatistic =new MonthlyStatistic();
				monthlyStatistic.setAShiftTotal(rs.getInt("a"));
				monthlyStatistic.setBxShiftTotal(rs.getInt("b"));
				monthlyStatistic.setCShiftTotal(rs.getInt("c"));
				monthlyStatistic.setDxShiftTotal(rs.getInt("d"));
				monthlyStatistic.setOShiftTotal(rs.getInt("o"));
				iTOYearlyStatistic.addITOMonthlyStatistic(monthlyStatistic);
				result.put(rs.getString("ito_id"),iTOYearlyStatistic);
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		} 
		finally 
		{
			releaseResource(rs, stmt);
		}
		return result;
	}
	@Override
	public void updateITOInfo(ITO ito) 
	{
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		PreparedStatement stmt=null;
		String availableShiftList=new String();
		StringBuilder sb = new StringBuilder();
		for (String shiftType:ito.getAvailableShiftList())
		{
			sb.append(shiftType);
		    sb.append(",");
		}
		availableShiftList=sb.toString();
		availableShiftList=availableShiftList.substring(0, availableShiftList.length()-1);
		logger.debug(availableShiftList);		
		sqlString="replace into ito_info (ito_id,ito_name,post_name,join_date,leave_date,available_shift,working_hour_per_day) values (?,?,?,?,?,?,?)";
		
		try 
		{
			dbConn.setAutoCommit(false);
			stmt=dbConn.prepareStatement(sqlString);
			stmt.setString(1,ito.getITOId());
			stmt.setString(2,ito.getITOName());
			stmt.setString(3,ito.getPostName());
			stmt.setString(4, ito.getJoinDate().format(formatter));
			stmt.setString(5, ito.getLeaveDate().format(formatter));
			stmt.setString(6, availableShiftList);
			stmt.setFloat(7, ito.getWorkingHourPerDay());
			stmt.executeUpdate();
			stmt.close();
			
			sqlString="delete from black_list_pattern where ito_id=?";
			stmt=dbConn.prepareStatement(sqlString);
			stmt.setString(1,ito.getITOId());
			stmt.executeUpdate();
			stmt.close();
			
			sqlString="insert into black_list_pattern (ito_id,black_list_pattern) values(?,?)";
			for (String blackListPattern:ito.getBlackListedShiftPatternList())
			{
				logger.debug("itoId="+ito.getITOId()+",blackListPattern="+blackListPattern);
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,ito.getITOId());
				stmt.setString(2,blackListPattern);
				stmt.executeUpdate();
				stmt.close();
			}
			dbConn.commit();
		} 
		catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally 
		{
			releaseResource(null, stmt);
		}
	}
	@Override
	public boolean updateRoster(int year,int month,Roster roster) 
	{
		boolean result=true;
		String[]temp;
		Map<Integer,String> shiftList;
		PreparedStatement stmt=null;
		try
		{	
			LocalDate calendarObj=LocalDate.of(year,month,1);
			LocalDate balanceCalendar=LocalDate.of(year,month,1);
			
			balanceCalendar=balanceCalendar.plusMonths(1);
			Map<String,ITORoster>iTORosterList=roster.getITORosterList();
			Map<String,Map<Integer,String>>iTOPreferredShiftList=roster.getITOPreferredShiftList();
			balanceCalendar.plusMonths(1);
			dbConn.setAutoCommit(false);
			
			logger.info("Update roster data transaction start.");
			logger.debug("===============================");
			logger.debug("year="+year+",month="+month);
			for (String itoId:iTORosterList.keySet())
			{
				logger.debug("itoId="+itoId);
				logger.debug("balance="+iTORosterList.get(itoId).getBalance());
				logger.debug("Roster Month="+calendarObj.getYear()+"/"+calendarObj.getMonthValue()+"/"+calendarObj.getDayOfMonth());
				logger.debug("===============================");
				
				
				sqlString="replace into last_month_balance (ito_id,shift_month,balance) values (?,?,?)";
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setDate(2,java.sql.Date.valueOf(balanceCalendar));
				stmt.setFloat(3, iTORosterList.get(itoId).getBalance());
				stmt.executeUpdate();
				stmt.clearParameters();
				stmt.close();

				sqlString="delete from shift_record where ito_id=? and month(shift_date)=? and year(shift_date)=?";
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setInt(2,month);
				stmt.setInt(3,year);
				stmt.executeUpdate();
				stmt.close();
				
				logger.debug("Shift List:");
				sqlString="replace into shift_record (ito_id,shift_date,shift,state) values (?,?,?,?)";
				shiftList=iTORosterList.get(itoId).getShiftList();
				Set<Integer> dateList =shiftList.keySet();
				for (Integer date:dateList)
				{
					calendarObj=LocalDate.of(year,month,date);
					
					if (!shiftList.get(date).equals(""))
					{
						logger.debug(itoId+","+date+","+shiftList.get(date));
						temp=shiftList.get(date).split("\\+");
						for (String shiftType : temp )
						{
							stmt=dbConn.prepareStatement(sqlString);
							stmt.setString(1,itoId);
							stmt.setDate(2,java.sql.Date.valueOf(calendarObj));
							
							stmt.setString(3,shiftType);
							stmt.setString(4,"A");	
							stmt.executeUpdate();
							stmt.close();
						}
					}
				}
				calendarObj=LocalDate.of(year,month,1);
				sqlString="delete from preferred_shift where ito_id=? and month(shift_date)=? and year(shift_date)=?";
				stmt=dbConn.prepareStatement(sqlString);
				logger.debug("delete preferred shift data for:" + month+"/"+year);
				stmt.setString(1,itoId);
				stmt.setInt(2,month);
				stmt.setInt(3,year);
				stmt.executeUpdate();
				stmt.close();
				
				shiftList=iTOPreferredShiftList.get(itoId);
				dateList =shiftList.keySet();
				sqlString="replace into preferred_shift (ito_id,preferred_shift,shift_date) values (?,?,?)";
				logger.debug("===============================");
				logger.debug("Preferred Shift List:");
				for (Integer date:dateList)
				{
				
					calendarObj=LocalDate.of(year,month,date);
					if (!shiftList.get(date).equals(""))
					{
						logger.debug(itoId+","+date+","+shiftList.get(date));
						stmt=dbConn.prepareStatement(sqlString);
						stmt.setString(1,itoId);
						stmt.setString(2,shiftList.get(date));
						stmt.setDate(3,java.sql.Date.valueOf(calendarObj));
						stmt.executeUpdate();
						stmt.close();
					}
				}
				dbConn.commit();
				logger.debug("===============================");
				logger.info(itoId+" roster data update completed.");
			}
		}
		catch (SQLException e) 
		{
			try 
			{
				if (dbConn!=null)
				{	
					dbConn.rollback();
					logger.info("Update roster data transaction rollbacked");
				}
			}
			catch (SQLException e1) 
			{
				e1.printStackTrace();
			}
			result=false;
			e.printStackTrace();
		}
		finally 
		{
			releaseResource(null, stmt);
		}
		return result;
	}
	/**
	 * Release resource for 
	 * @param r ResultSet object
	 * @param s PreparedStatement object
	 */
	private void releaseResource(ResultSet r, PreparedStatement s) 
	{
		if (r != null) 
		{
			try 
			{
				r.close();
			} 
			catch (SQLException e) 
			{
				e.printStackTrace();
			}
		}
		if (s != null) 
		{
			try 
			{
				s.close();
			} 
			catch (SQLException e) 
			{
				e.printStackTrace();
			}
		}
		r = null;
		s = null;
	}
	/**
	 * Close db connection
	 * @throws Exception if a data store access error occurs
	 */
	@Override
	public void close() throws Exception 
	{
		dbConn.close();
		dbConn = null;
	}

}
