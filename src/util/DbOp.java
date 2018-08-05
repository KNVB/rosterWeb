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

import com.ITO;
import com.ITORoster;
import com.RosterRule;
import com.Shift;
import com.Utility;

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
			for (String itoId:iTORosterList.keySet())
			{
				/*
				System.out.println("===============================");
				System.out.println("itoId="+itoId);
				System.out.println("balance="+iTORosterList.get(itoId).getBalance());
				System.out.println("Shift List:");
				System.out.println("===============================");
				*/
				sqlString="replace into shift_record (ito_id,shift_date,shift,state) values (?,?,?,?)";
				stmt=dbConn.prepareStatement(sqlString);
				for (Shift shift:iTORosterList.get(itoId).getShiftList())
				{
					stmt.setString(1,itoId);
					stmt.setDate(2,new java.sql.Date(shift.getShiftDate().getTime().getTime()));
					stmt.setString(3,shift.getShift());
					stmt.setString(4,"A");
					stmt.executeUpdate();
					stmt.clearParameters();
			//		System.out.println("shift date:"+shift.getShiftDate().get(Calendar.DAY_OF_MONTH)+"/"+shift.getShiftDate().get(Calendar.MONTH)+",shift:"+shift.getShift());
				}
				System.out.println("===============================");
				System.out.println("Preferred Shift List:");
				System.out.println("===============================");
				sqlString="replace into preferred_shift (ito_id,preferred_shift,shift_date) values (?,?,?)";
				stmt=dbConn.prepareStatement(sqlString);

				for (Shift shift:iTORosterList.get(itoId).getPreferredShiftList())
				{
					stmt.setString(1,itoId);
					stmt.setString(2,shift.getShift());
					stmt.setDate(3,new java.sql.Date(shift.getShiftDate().getTime().getTime()));
					stmt.executeUpdate();
					stmt.clearParameters();
					System.out.println("shift date:"+shift.getShiftDate().get(Calendar.DAY_OF_MONTH)+"/"+shift.getShiftDate().get(Calendar.MONTH)+",shift:"+shift.getShift());
				}
			}
		}
		catch (SQLException e) 
		{
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
	@Override
	public Hashtable<String, ITO> getITOList(int year, int month) {
		
		ITO ito=null;
		int lastDay;
		ResultSet rs = null;
		String itoId=new String();
		
		PreparedStatement stmt = null;
		ArrayList <String>blackListShiftPatternList=null;
		GregorianCalendar joinDate=new GregorianCalendar(),leaveDate=new GregorianCalendar();
		GregorianCalendar theFirstDateOfTheMonth=new GregorianCalendar(year,month,1);
		Hashtable<String,ITO> result=new Hashtable<String,ITO>();
		lastDay=theFirstDateOfTheMonth.getActualMaximum(Calendar.DAY_OF_MONTH);
		String firstDateString=theFirstDateOfTheMonth.get(Calendar.YEAR)+"-"+(theFirstDateOfTheMonth.get(Calendar.MONTH)+1)+"-1";
		String endDateString=theFirstDateOfTheMonth.get(Calendar.YEAR)+"-"+(theFirstDateOfTheMonth.get(Calendar.MONTH)+1)+"-"+lastDay;
		
		sqlString ="SELECT join_date,leave_date,ito_info.ito_id,post_name,ito_name,available_shift,working_hour_per_day,black_list_pattern from ";
		sqlString+="ito_info inner join black_list_pattern ";
		sqlString+="on ito_info.ito_id=black_list_pattern.ito_id ";
		sqlString+="where join_date<? and leave_date >? ";
		sqlString+="order by post_name";
		try
		{
			stmt=dbConn.prepareStatement(sqlString);
			stmt.setString(1,firstDateString);
			stmt.setString(2,endDateString);
			rs=stmt.executeQuery();
			while (rs.next())
			{
				if (rs.getString("ito_id").equals(itoId))
				{
					blackListShiftPatternList.add(rs.getString("black_list_pattern"));
				}
				else
				{
					if (blackListShiftPatternList!=null)
					{
						ito.setBlackListedShiftPatternList(blackListShiftPatternList);
						itoId=rs.getString("ito_id");
						result.put(ito.getPostName(), ito);
					}
					itoId=rs.getString("ito_id");
					blackListShiftPatternList=new ArrayList<String>();
					blackListShiftPatternList.add(rs.getString("black_list_pattern"));
					ito=new ITO();
					ito.setItoId(rs.getString("ito_id"));
					ito.setPostName(rs.getString("post_name"));
					ito.setItoName(rs.getString("ito_name"));
					ito.setWorkingHourPerDay(rs.getFloat("working_hour_per_day"));
					joinDate.setTime(rs.getDate("join_date"));
					leaveDate.setTime(rs.getDate("leave_date"));;
					ito.setJoinDate(joinDate);
					ito.setLeaveDate(leaveDate);
					ito.setAvailableShiftList(new ArrayList<String>(Arrays.asList(rs.getString("available_shift").split(","))));
					result.put(ito.getPostName(), ito);
				}
			}
			ito.setBlackListedShiftPatternList(blackListShiftPatternList);
			result.put(ito.getPostName(), ito);
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
		String itoId=new String();
		GregorianCalendar shiftDate;
		PreparedStatement stmt = null;
		ArrayList <Shift>shiftList=null;
		ArrayList<Shift> preferredShiftList=null;
		
		Hashtable<String, ITORoster> result=new  Hashtable<String, ITORoster>();
		GregorianCalendar theLast2DayOfPreviousMonth=new GregorianCalendar(year,month,1);
		GregorianCalendar theFirstDateOfTheMonth=new GregorianCalendar(year,month,1);
		theLast2DayOfPreviousMonth.add(Calendar.DAY_OF_MONTH, -RosterRule.getMaxConsecutiveWorkingDay());
	//	theLast2DayOfPreviousMonth.add(Calendar.DAY_OF_MONTH, -2);
		lastDay=theFirstDateOfTheMonth.getActualMaximum(Calendar.DAY_OF_MONTH);
		
		String shiftMonthString=theFirstDateOfTheMonth.get(Calendar.YEAR)+"-"+(theFirstDateOfTheMonth.get(Calendar.MONTH)+1)+"-1";
		String startDateString=theLast2DayOfPreviousMonth.get(Calendar.YEAR)+"-"+(theLast2DayOfPreviousMonth.get(Calendar.MONTH)+1)+"-"+theLast2DayOfPreviousMonth.get(Calendar.DATE);
		String endDateString=theFirstDateOfTheMonth.get(Calendar.YEAR)+"-"+(theFirstDateOfTheMonth.get(Calendar.MONTH)+1)+"-"+lastDay;
		
		/*
		System.out.println("startDateString="+startDateString);
		System.out.println("endDateString="+endDateString);
		System.out.println("shiftMonthString="+shiftMonthString);
		*/
		
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
				
				if (rs.getString("ito_id").equals(itoId))
				{
					shift=new Shift();
					shift.setItoId(itoId);
					shift.setShift(rs.getString("shift"));
					shiftDate.setTime(rs.getDate("shift_date"));
					shift.setShiftDate(shiftDate);
					shiftList.add(shift);
					if (rs.getString("preferred_shift")!=null)
					{
						shift=new Shift();
						shift.setItoId(itoId);
						shift.setShift(rs.getString("preferred_shift"));
						shiftDate.setTime(rs.getDate("shift_date"));
						shift.setShiftDate(shiftDate);
						preferredShiftList.add(shift);
					}
				}
				else
				{
					if (shiftList!=null)
					{
						itoRoster.setShiftList(shiftList);
						itoRoster.setPreferredShiftList(preferredShiftList);
						result.put(itoId,itoRoster);
						itoId=rs.getString("ito_id");
					}
					itoId=rs.getString("ito_id");
					itoRoster=new ITORoster();
					itoRoster.setBalance(rs.getFloat("balance"));
					shiftList=new ArrayList<Shift>();
					
					shift=new Shift();
					shift.setItoId(itoId);
					shift.setShift(rs.getString("shift"));
					shiftDate.setTime(rs.getDate("shift_date"));
					shift.setShiftDate(shiftDate);
					shiftList.add(shift);
					preferredShiftList=new ArrayList<Shift>();
					if (rs.getString("preferred_shift")!=null)
					{
						shift=new Shift();
						shift.setItoId(itoId);
						shift.setShift(rs.getString("preferred_shift"));
						shiftDate.setTime(rs.getDate("shift_date"));
						shift.setShiftDate(shiftDate);
						preferredShiftList.add(shift);
					}
				}
			}
			if (shiftList!=null)
			{	
				itoRoster.setShiftList(shiftList);
				itoRoster.setPreferredShiftList(preferredShiftList);
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
