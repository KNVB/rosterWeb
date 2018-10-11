package util;

import com.ITO;
import com.ITORoster;
import com.Roster;
import com.RosterRule;
import com.Utility;
import com.rosterStatistic.ITOYearlyStatistic;
import com.rosterStatistic.MonthlyStatistic;

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
import java.util.Set;

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
		String temp;
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
	public Hashtable<String, ITOYearlyStatistic> getYearlyRosterStatistic(int year, int month) 
	{
		int lastDay;
		ResultSet rs = null;
		PreparedStatement stmt = null;
		MonthlyStatistic monthlyStatistic =null;
		ITOYearlyStatistic iTOYearlyStatistic=null;
		GregorianCalendar theFirstDateOfTheMonth=new GregorianCalendar(year,month,1);
		lastDay=theFirstDateOfTheMonth.getActualMaximum(Calendar.DAY_OF_MONTH);
		String startDateString=theFirstDateOfTheMonth.get(Calendar.YEAR)+"-"+(theFirstDateOfTheMonth.get(Calendar.MONTH)+1)+"-1";
		String endDateString=theFirstDateOfTheMonth.get(Calendar.YEAR)+"-"+(theFirstDateOfTheMonth.get(Calendar.MONTH)+1)+"-"+lastDay;
		
		Hashtable<String,ITOYearlyStatistic> result=new  Hashtable<String, ITOYearlyStatistic>();
		logger.debug("startDateString="+startDateString);
		logger.debug("endDateString="+endDateString);
		logger.debug("year="+year);
		logger.debug("month="+(theFirstDateOfTheMonth.get(Calendar.MONTH)+1));
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
			stmt.setInt(4,(theFirstDateOfTheMonth.get(Calendar.MONTH)+1));
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
	public boolean updateRoster(int year,int month,Roster roster) 
	{
		boolean result=true;
		String[]temp;
		Hashtable<Integer,String> shiftList;
		PreparedStatement stmt=null;
		try
		{	
			GregorianCalendar calendarObj=new GregorianCalendar();
			GregorianCalendar balanceCalendar=new GregorianCalendar(year,month,1);
			Hashtable<String,ITORoster>iTORosterList=roster.getITORosterList();
			Hashtable<String,Hashtable<Integer,String>>iTOPreferredShiftList=roster.getITOPreferredShiftList();
			balanceCalendar.add(Calendar.MONTH, 1);
			dbConn.setAutoCommit(false);
			
			logger.info("Update roster data transaction start.");
			logger.debug("===============================");
			logger.debug("year="+year+",month="+month);
			for (String itoId:iTORosterList.keySet())
			{
				logger.debug("itoId="+itoId);
				logger.debug("balance="+iTORosterList.get(itoId).getBalance());
				logger.debug("Roster Month="+calendarObj.get(Calendar.YEAR)+"/"+calendarObj.get(Calendar.MONTH)+"/"+calendarObj.get(Calendar.DAY_OF_MONTH));
				logger.debug("===============================");
				
				
				sqlString="replace into last_month_balance (ito_id,shift_month,balance) values (?,?,?)";
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setDate(2,new java.sql.Date(balanceCalendar.getTime().getTime()));
				stmt.setFloat(3, iTORosterList.get(itoId).getBalance());
				stmt.executeUpdate();
				stmt.clearParameters();
				stmt.close();

				sqlString="delete from shift_record where ito_id=? and month(shift_date)=? and year(shift_date)=?";
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setInt(2,month+1);
				stmt.setInt(3,year);
				stmt.executeUpdate();
				stmt.close();
				
				logger.debug("Shift List:");
				sqlString="replace into shift_record (ito_id,shift_date,shift,state) values (?,?,?,?)";
				shiftList=iTORosterList.get(itoId).getShiftList();
				Set<Integer> dateList =shiftList.keySet();
				for (Integer date:dateList)
				{
					calendarObj.set(Calendar.YEAR, year);
					calendarObj.set(Calendar.MONTH,month);
					calendarObj.set(Calendar.DAY_OF_MONTH,date);
					
					if (!shiftList.get(date).equals(""))
					{
						logger.debug(itoId+","+date+","+shiftList.get(date));
						temp=shiftList.get(date).split("\\+");
						for (String shiftType : temp )
						{
							stmt=dbConn.prepareStatement(sqlString);
							stmt.setString(1,itoId);
							stmt.setDate(2,new java.sql.Date(calendarObj.getTime().getTime()));
							
							stmt.setString(3,shiftType);
							stmt.setString(4,"A");	
							stmt.executeUpdate();
							stmt.close();
						}
					}
				}
				
				calendarObj.set(Calendar.YEAR, year);
				calendarObj.set(Calendar.MONTH,month);
				calendarObj.set(Calendar.DAY_OF_MONTH,1);
				sqlString="delete from preferred_shift where ito_id=? and month(shift_date)=? and year(shift_date)=?";
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setInt(2,month+1);
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
					calendarObj.set(Calendar.YEAR, year);
					calendarObj.set(Calendar.MONTH,month);
					calendarObj.set(Calendar.DAY_OF_MONTH,date);
					
					if (!shiftList.get(date).equals(""))
					{
						logger.debug(itoId+","+date+","+shiftList.get(date));
						stmt=dbConn.prepareStatement(sqlString);
						stmt.setString(1,itoId);
						stmt.setString(2,shiftList.get(date));
						stmt.setDate(3,new java.sql.Date(calendarObj.getTime().getTime()));
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
	 * @throws Exception
	 */
	@Override
	public void close() throws Exception 
	{
		dbConn.close();
		dbConn = null;
	}

}
