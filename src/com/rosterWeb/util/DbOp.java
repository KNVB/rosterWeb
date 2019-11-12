package com.rosterWeb.util;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.TreeMap;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.rosterWeb.ITO;
import com.rosterWeb.ITORoster;
import com.rosterWeb.Utility;

public class DbOp implements DataStore{
	private Connection dbConn = null;
	
	private String dbServerName=Utility.getParameterValue("dbServerName");
	private	String dbms=Utility.getParameterValue("dbms");
	private String dbName=Utility.getParameterValue("dbName");
	private String dbUserName=Utility.getParameterValue("dbUserName");
	private String dbUserPwd=Utility.getParameterValue("dbUserPwd");
	private String jdbcDriver =Utility.getParameterValue("jdbcDriver");
	private String jdbcURL = new String("jdbc:");
	private String sqlString;
	private String shiftDateFormat="yyyy-MM-dd";
	
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
	public TreeMap<String, ITO> getITOList(int year, int month) 
	{
		ITO ito=null;

		ResultSet rs = null;
		PreparedStatement stmt = null;
		ArrayList <String>blackListShiftPatternList=null;
		List<String>list;
		LocalDate joinDate,leaveDate;
		LocalDate theFirstDateOfTheMonth=LocalDate.of(year,month,1);
		TreeMap<String,ITO> result=new TreeMap<String,ITO>();

		String firstDateString=year+"-"+month+"-1";
		String endDateString=theFirstDateOfTheMonth.with(TemporalAdjusters.lastDayOfMonth()).format(DateTimeFormatter.ofPattern(shiftDateFormat));
		
		logger.debug("startDateString="+firstDateString);
		logger.debug("endDateString="+endDateString);
		
		sqlString ="SELECT join_date,leave_date,ito_info.ito_id,post_name,ito_name,available_shift,working_hour_per_day,black_list_pattern from ";
		sqlString+="ito_info inner join black_list_pattern ";
		sqlString+="on ito_info.ito_id=black_list_pattern.ito_id ";
		sqlString+="where join_date<=? and leave_date >=? ";
		sqlString+="order by ito_info.ito_id";
		try
		{
			stmt=dbConn.prepareStatement(sqlString);
			stmt.setString(1,endDateString);
			stmt.setString(2,firstDateString);
			
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
	public ITORoster[] getITORosterList(int year,int month,String[] itoIdList)
	{
		String temp;
		ResultSet rs = null;
		ITORoster itoRoster=null;
		PreparedStatement stmt = null;
		String [] shiftList;
		ITORoster [] resultArray=null;
		TreeMap <Integer,String>shiftMap=new TreeMap<Integer,String>();
		ArrayList<ITORoster> result=new ArrayList<ITORoster>();
		
		LocalDate theMonthShiftStartDate=LocalDate.of(year,month,1);
		String theMonthShiftStartDateString=theMonthShiftStartDate.format(DateTimeFormatter.ofPattern(shiftDateFormat));
		String theMonthShiftEndDateString=theMonthShiftStartDate.with(TemporalAdjusters.lastDayOfMonth()).format(DateTimeFormatter.ofPattern(shiftDateFormat));
		
		logger.debug("theMonthShiftStartDateString    ="+theMonthShiftStartDateString);
		logger.debug("theMonthShiftEndDateString      =|"+theMonthShiftEndDateString+"|");
		try
		{
			for (String itoId :itoIdList)
			{
				itoRoster=new ITORoster();
				sqlString ="select balance from last_month_balance where ito_Id=? and shift_month=?";
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setString(2,theMonthShiftStartDateString);
				rs=stmt.executeQuery();
				if (rs.next())
					itoRoster.setLastMonthBalance(rs.getFloat("balance"));
				else
					itoRoster.setLastMonthBalance(0);
				stmt.close();
				rs.close();
				sqlString ="select day(shift_date) as d,shift from shift_record where ito_Id=? and (shift_record.shift_date between ? and ?)";
				shiftMap=new TreeMap<Integer,String>();
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setString(2,theMonthShiftStartDateString);
				stmt.setString(3,theMonthShiftEndDateString);
				rs=stmt.executeQuery();
				while (rs.next())
				{	
					temp=rs.getString("shift");
					if (shiftMap.containsKey(rs.getInt("d")))
					{
						temp=shiftMap.get(rs.getInt("d"))+"+"+temp;
					}
					shiftMap.put(rs.getInt("d"), temp);
				}
				stmt.close();
				rs.close();
				logger.debug("itoId="+itoId+",shiftMap="+shiftMap);
				shiftList=new String[31];
				for (Integer date: shiftMap.keySet()) {
					shiftList[date-1]=shiftMap.get(date);
				}
				itoRoster.setShiftList(shiftList);
				
				sqlString ="SELECT working_hour_per_day,post_name,ito_name from ito_info where ito_id=?";
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				rs=stmt.executeQuery();
				while (rs.next())
				{
					itoRoster.setITOWorkingHourPerDay(rs.getFloat("working_hour_per_day"));
					itoRoster.setITOName(rs.getString("ito_name"));
					itoRoster.setItoId(itoId);
					itoRoster.setITOPostName(rs.getString("post_name"));
				}
				stmt.close();
				rs.close();
				result.add(itoRoster);
				resultArray=result.toArray(new ITORoster[0]);
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
		return resultArray;
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
