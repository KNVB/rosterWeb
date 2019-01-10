<%@page contentType="text/html; charset=UTF-8"%>
<%@ page import="java.io.*"%>       
<%@ page import="java.util.*"%>    
<%//@ page import="com.Shift"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%!
	public class Shift
	{
		private String shift,itoId;
		private GregorianCalendar shiftDate;
		
		public Shift()
		{

		}
		public String getItoId() {
			return itoId;
		}
		public void setItoId(String ito_id) {
			this.itoId = ito_id;
		}
		public void setShift(String shift) {
			this.shift = shift;
		}
		public String getShift() {
			return shift;
		}
		public void setShiftDate(GregorianCalendar shiftDate) 
		{
			this.shiftDate = shiftDate;
		}
		public GregorianCalendar getShiftDate()
		{
			return this.shiftDate;
		}
	}
%> 
<%
	ObjectMapper objectMapper = new ObjectMapper();
	BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
	Shift shift=objectMapper.readValue(br.readLine(),Shift.class);
	out.println(shift.getShiftDate().get(Calendar.YEAR)+"/"+shift.getShiftDate().get(Calendar.MONTH)+"/"+shift.getShiftDate().get(Calendar.DAY_OF_MONTH));
%>	