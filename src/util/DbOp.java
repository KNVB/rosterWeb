package util;

import com.ITO;
import com.ITORoster;
import com.RosterRule;
import com.Utility;
import com.rosterStatistic.ITOYearlyStatistic;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Hashtable;

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
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 * @throws Exception
	 */	
	public DbOp() throws SQLException, InstantiationException, IllegalAccessException, ClassNotFoundException
	{
		jdbcURL =jdbcURL +dbms+"://";
		jdbcURL =jdbcURL +dbServerName+"/"+dbName+"?useUnicode=true&characterEncoding=UTF-8";
		Class.forName(jdbcDriver);
		dbConn= DriverManager.getConnection(jdbcURL,dbUserName,dbUserPwd);
	}
	@Override
	public void saveITOInfo() {
		// TODO Auto-generated method stub

	}

	@Override
	public void updateITOInfo() {
		// TODO Auto-generated method stub

	}

	@Override
	public Hashtable<String, ITO> getITOList(int year, int month) {
		ITO ito=null;
		int lastDay;
		ResultSet rs = null;
		
		PreparedStatement stmt = null;
		ArrayList <String>blackListShiftPatternList=null;
		GregorianCalendar joinDate,leaveDate;
		GregorianCalendar theFirstDateOfTheMonth=new GregorianCalendar(year,month,1);
		Hashtable<String,ITO> result=new Hashtable<String,ITO>();
		lastDay=theFirstDateOfTheMonth.getActualMaximum(Calendar.DAY_OF_MONTH);
		String firstDateString=theFirstDateOfTheMonth.get(Calendar.YEAR)+"-"+(theFirstDateOfTheMonth.get(Calendar.MONTH)+1)+"-1";
		String endDateString=theFirstDateOfTheMonth.get(Calendar.YEAR)+"-"+(theFirstDateOfTheMonth.get(Calendar.MONTH)+1)+"-"+lastDay;
	
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
					joinDate=new GregorianCalendar();
					leaveDate=new GregorianCalendar();
					joinDate.setTime(rs.getDate("join_date"));
					leaveDate.setTime(rs.getDate("leave_date"));
					
					ito.setJoinDate(joinDate);
					ito.setLeaveDate(leaveDate);
					ito.setAvailableShiftList(new ArrayList<String>(Arrays.asList(rs.getString("available_shift").split(","))));
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
	public Hashtable<String, Hashtable<Integer, String>> getPreferredShiftList(int year, int month, String[] itoIdList)
	{
		GregorianCalendar theMonthShiftStartDate=new GregorianCalendar(year,month,1);
		Hashtable<Integer,String>preferredShiftList;
		Hashtable<String, Hashtable<Integer, String>>result=new Hashtable<String, Hashtable<Integer, String>>();
		int lastDayOfThisMonth;
		ResultSet rs = null;
		PreparedStatement stmt = null;
		lastDayOfThisMonth=theMonthShiftStartDate.getActualMaximum(Calendar.DAY_OF_MONTH);
		String theMonthShiftEndDateString=theMonthShiftStartDate.get(Calendar.YEAR)+"-"+(theMonthShiftStartDate.get(Calendar.MONTH)+1)+"-"+lastDayOfThisMonth;
		String theMonthShiftStartDateString=theMonthShiftStartDate.get(Calendar.YEAR)+"-"+(theMonthShiftStartDate.get(Calendar.MONTH)+1)+"-1";
		try
		{
			for (String itoId :itoIdList)
			{
				preferredShiftList=new Hashtable<Integer,String>();
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
	public Hashtable<String, ITORoster> getRoster(int year, int month, String[] itoIdList) {
		int lastDayOfThisMonth;
		ResultSet rs = null;
		ITORoster itoRoster=null;
		PreparedStatement stmt = null;
		Hashtable <Integer,String>shiftList=new Hashtable<Integer,String>();
		Hashtable<Integer,String> previousMonthShiftList=new Hashtable<Integer,String>();
		Hashtable<String, ITORoster> result=new  Hashtable<String, ITORoster>();
		GregorianCalendar previousMonthShiftEndDate=new GregorianCalendar(year,month,1);
		GregorianCalendar previousMonthShiftStartDate=new GregorianCalendar(year,month,1);
		
		GregorianCalendar theMonthShiftStartDate=new GregorianCalendar(year,month,1);
		previousMonthShiftStartDate.add(Calendar.DAY_OF_MONTH, -RosterRule.getMaxConsecutiveWorkingDay());
		previousMonthShiftEndDate.add(Calendar.DAY_OF_MONTH, -1);
		
		lastDayOfThisMonth=theMonthShiftStartDate.getActualMaximum(Calendar.DAY_OF_MONTH);
		
		String previousMonthShiftStartDateString=previousMonthShiftStartDate.get(Calendar.YEAR)+"-"+(previousMonthShiftStartDate.get(Calendar.MONTH)+1)+"-"+previousMonthShiftStartDate.get(Calendar.DAY_OF_MONTH);
		String previousMonthShiftEndDateString=previousMonthShiftEndDate.get(Calendar.YEAR)+"-"+ (previousMonthShiftEndDate.get(Calendar.MONTH)+1)+"-"+previousMonthShiftEndDate.get(Calendar.DAY_OF_MONTH);
		String theMonthShiftEndDateString=theMonthShiftStartDate.get(Calendar.YEAR)+"-"+(theMonthShiftStartDate.get(Calendar.MONTH)+1)+"-"+lastDayOfThisMonth;
		String theMonthShiftStartDateString=theMonthShiftStartDate.get(Calendar.YEAR)+"-"+(theMonthShiftStartDate.get(Calendar.MONTH)+1)+"-1";
		
		logger.debug("previousMonthShiftStartDateString="+previousMonthShiftStartDateString);
		logger.debug("previousMonthShiftEndDateString  ="+previousMonthShiftEndDateString);
		logger.debug("thisMonthShiftEndDateString      ="+theMonthShiftEndDateString);
		logger.debug("thisMonthShiftStartDateString    ="+theMonthShiftStartDateString);

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
				
				previousMonthShiftList=new Hashtable<Integer,String>();
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
				shiftList=new Hashtable<Integer,String>();
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setString(2,theMonthShiftStartDateString);
				stmt.setString(3,theMonthShiftEndDateString);
				rs=stmt.executeQuery();
				while (rs.next())
				{	
					shiftList.put(rs.getInt(1), rs.getString("shift"));
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
	public Hashtable<String, ArrayList<String>> getRosterRule() {
		char escapChar=(char)27;
		ResultSet rs = null;
		
		String ruleType=new String();
		PreparedStatement stmt = null;
		ArrayList <String>keyValue=null;
		Hashtable<String,ArrayList<String>> result=new Hashtable<String,ArrayList<String>>();
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
	public Hashtable<String, ITOYearlyStatistic> getYearlyRosterStatistic(int year, int month) {
		// TODO Auto-generated method stub
		return null;
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
	 * @throws Exception
	 */
	@Override
	public void close() throws Exception 
	{
		dbConn.close();
		dbConn = null;
	}

}
