package util;

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

import com.ITO;
import com.ITORoster;
import com.RosterRule;
import com.Shift;
import com.Utility;
import com.rosterStatistic.ITOYearlyStatistic;
import com.rosterStatistic.MonthlyStatistic;
/**
 * It is an implementation class of DataStore interface
 * @author SITO3
 *
 */
public class DbOp implements DataStore 
{
	private Connection dbConn = null;
	
	private String dbServerName=Utility.getParameterValue("dbServerName");
	private	String dbms=Utility.getParameterValue("dbms");
	private String dbName=Utility.getParameterValue("dbName");
	private String dbUserName=Utility.getParameterValue("dbUserName");
	private String dbUserPwd=Utility.getParameterValue("dbUserPwd");
	private String jdbcDriver =Utility.getParameterValue("jdbcDriver");
	private String jdbcURL = new String("jdbc:");
	private String sqlString;
	
	private static final Logger logger = LogManager.getLogger("DbOp");

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
	public boolean updateRoster(int year,int month,Hashtable<String,ITORoster> iTORosterList) 
	{
		boolean result=true;
		PreparedStatement stmt=null;
		try
		{	
			GregorianCalendar rosterMonth=new GregorianCalendar(year,month,1);
			rosterMonth.add(Calendar.MONTH, 1);
			dbConn.setAutoCommit(false);
			logger.info("Update roster data transaction start.");
			logger.debug("===============================");
			for (String itoId:iTORosterList.keySet())
			{
				logger.debug("itoId="+itoId);
				logger.debug("balance="+iTORosterList.get(itoId).getBalance());
				logger.debug("Roster Month="+rosterMonth.get(Calendar.YEAR)+"/"+rosterMonth.get(Calendar.MONTH)+"/"+rosterMonth.get(Calendar.DAY_OF_MONTH));
				logger.debug("Shift List:");
				logger.debug("===============================");
				
				sqlString="replace into last_month_balance (ito_id,shift_month,balance) values (?,?,?)";
				stmt=dbConn.prepareStatement(sqlString);
				stmt.setString(1,itoId);
				stmt.setDate(2,new java.sql.Date(rosterMonth.getTime().getTime()));
				stmt.setFloat(3, iTORosterList.get(itoId).getBalance());
				stmt.executeUpdate();
				stmt.clearParameters();
				stmt.close();
				
				sqlString="replace into shift_record (ito_id,shift_date,shift,state) values (?,?,?,?)";
				stmt=dbConn.prepareStatement(sqlString);
/*				for (Shift shift:iTORosterList.get(itoId).getShiftList())
				{
					stmt.setString(1,itoId);
					stmt.setDate(2,new java.sql.Date(shift.getShiftDate().getTime().getTime()));
					stmt.setString(3,shift.getShift());
					stmt.setString(4,"A");
					stmt.executeUpdate();
					stmt.clearParameters();
					logger.debug("shift date:"+shift.getShiftDate().get(Calendar.DAY_OF_MONTH)+"/"+shift.getShiftDate().get(Calendar.MONTH)+",shift:"+shift.getShift());
				}
				stmt.close();
				logger.debug("===============================");
				logger.debug("Preferred Shift List:");
				logger.debug("===============================");
				for (Shift shift:iTORosterList.get(itoId).getPreferredShiftList())
				{
					if (shift.getShift().equals(""))
					{
						sqlString="delete from preferred_shift where ito_id=? and shift_date=?";
						stmt=dbConn.prepareStatement(sqlString);
						stmt.setString(1,itoId);
						stmt.setDate(2,new java.sql.Date(shift.getShiftDate().getTime().getTime()));
						stmt.executeUpdate();
						stmt.clearParameters();
						logger.debug("remove preferred shift ("+shift.getShift()+") on shift date:"+shift.getShiftDate().get(Calendar.DAY_OF_MONTH)+"/"+shift.getShiftDate().get(Calendar.MONTH));
					}
					else
					{
						sqlString="replace into preferred_shift (ito_id,preferred_shift,shift_date) values (?,?,?)";
						stmt=dbConn.prepareStatement(sqlString);
						stmt.setString(1,itoId);
						stmt.setString(2,shift.getShift());
						stmt.setDate(3,new java.sql.Date(shift.getShiftDate().getTime().getTime()));
						stmt.executeUpdate();
						stmt.clearParameters();
						logger.debug("shift date:"+shift.getShiftDate().get(Calendar.DAY_OF_MONTH)+"/"+shift.getShiftDate().get(Calendar.MONTH)+",shift:"+shift.getShift());
					}
				}
				logger.debug("===============================");
				dbConn.commit();
				logger.info(itoId+" roster data update completed.");*/
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

	@Override
	public void updateITOInfo() {
		// TODO Auto-generated method stub

	}
	/**
	 * Get a list of ITO object 
	 * @return itoId to ITO object mapping 
	 */
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
					result.replace(ito.getItoId(), ito);
//					logger.debug(rs.getString("ito_name")+","+ito.getJoinDate().get(Calendar.MONTH)+","+rs.getDate("join_date").getMonth());
				}
				else
				{
					ito=new ITO();
					ito.setItoId(rs.getString("ito_id"));
					ito.setPostName(rs.getString("post_name"));
					ito.setItoName(rs.getString("ito_name"));
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
					result.put(ito.getItoId(), ito);
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
	public Hashtable<String,ArrayList<String>> getRosterRule()
	{
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
	public Hashtable<String, ITORoster> getRoster(int year, int month) 
	{
		int lastDay;
		Shift shift=null;
		ResultSet rs = null;
		ITORoster itoRoster=null;
		GregorianCalendar shiftDate;
		PreparedStatement stmt = null;
		Hashtable <Integer,String>shiftList=null;
		Hashtable<Integer,String> preferredShiftList=null;
		ArrayList<Shift> previousMonthShiftList=null;
		Hashtable<String, ITORoster> result=new  Hashtable<String, ITORoster>();
		GregorianCalendar theLast2DayOfPreviousMonth=new GregorianCalendar(year,month,1);
		GregorianCalendar theFirstDateOfTheMonth=new GregorianCalendar(year,month,1);
		theLast2DayOfPreviousMonth.add(Calendar.DAY_OF_MONTH, -RosterRule.getMaxConsecutiveWorkingDay());
		lastDay=theFirstDateOfTheMonth.getActualMaximum(Calendar.DAY_OF_MONTH);
		
		String shiftMonthString=theFirstDateOfTheMonth.get(Calendar.YEAR)+"-"+(theFirstDateOfTheMonth.get(Calendar.MONTH)+1)+"-1";
		String startDateString=theLast2DayOfPreviousMonth.get(Calendar.YEAR)+"-"+(theLast2DayOfPreviousMonth.get(Calendar.MONTH)+1)+"-"+theLast2DayOfPreviousMonth.get(Calendar.DATE);
		String endDateString=theFirstDateOfTheMonth.get(Calendar.YEAR)+"-"+(theFirstDateOfTheMonth.get(Calendar.MONTH)+1)+"-"+lastDay;
		
		
		logger.debug("startDateString="+startDateString);
		logger.debug("endDateString="+endDateString);
		logger.debug("shiftMonthString="+shiftMonthString);
		
		
		sqlString ="select shift_record.ito_id,shift_record.shift_date,shift,balance,preferred_shift from shift_record ";
		sqlString+="inner join last_month_balance on shift_record.ito_id=last_month_balance.ito_id "; 

		sqlString+="left join preferred_shift on (preferred_shift.shift_date between ? and ?) and ";
		sqlString+="shift_record.ito_id=preferred_shift.ito_id and ";
		sqlString+="(shift_record.shift_date=preferred_shift.shift_date) ";
		
		sqlString+="where (shift_record.shift_date between ? and ?) and shift_month=? ";
		sqlString+="order by shift_record.ito_id,shift_record.shift_date";
		try
		{
			stmt=dbConn.prepareStatement(sqlString);
			stmt.setString(1,shiftMonthString);
			stmt.setString(2,endDateString);
			stmt.setString(3,startDateString);
			stmt.setString(4,endDateString);
			stmt.setString(5,shiftMonthString);
			
			rs=stmt.executeQuery();
			while (rs.next())
			{
				shiftDate=new GregorianCalendar();
				shiftDate.setTime(rs.getDate("shift_date"));
				shift=new Shift();
				shift.setShift(rs.getString("shift"));
				
				shift.setShiftDate(shiftDate);
				if (result.containsKey(rs.getString("ito_id")))
				{	
					itoRoster=result.get(rs.getString("ito_id"));
					shiftList=itoRoster.getShiftList();
					preferredShiftList=itoRoster.getPreferredShiftList();
					previousMonthShiftList=itoRoster.getPreviousMonthShiftList();
				}
				else
				{
					itoRoster=new ITORoster();
					itoRoster.setBalance(rs.getFloat("balance"));
					shiftList=new Hashtable<Integer,String>();
					preferredShiftList=new Hashtable<Integer,String>();
					previousMonthShiftList=new ArrayList<Shift>();
					result.put(rs.getString("ito_id"),itoRoster);
				}
				
				if (theFirstDateOfTheMonth.get(Calendar.MONTH)==shiftDate.get(Calendar.MONTH))
					shiftList.put(shiftDate.get(Calendar.DAY_OF_MONTH),rs.getString("shift"));
				else
					previousMonthShiftList.add(shift);
				
				if (rs.getString("preferred_shift")!=null)
				{
					shiftDate=new GregorianCalendar();
					shiftDate.setTime(rs.getDate("shift_date"));
					preferredShiftList.put(shiftDate.get(Calendar.DAY_OF_MONTH),rs.getString("preferred_shift"));
				}
				itoRoster.setPreviousMonthShiftList(previousMonthShiftList);
				itoRoster.setShiftList(shiftList);
				itoRoster.setPreferredShiftList(preferredShiftList);
				result.replace(rs.getString("ito_id"),itoRoster);
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
	public Hashtable<String,ITOYearlyStatistic>getYearlyRosterStatistic(int year, int month)
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
	public void close() throws Exception 
	{
		dbConn.close();
		dbConn = null;
	}

}
