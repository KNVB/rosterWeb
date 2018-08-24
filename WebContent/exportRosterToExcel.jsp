<%@ page trimDirectiveWhitespaces="true" %>
<%@ page contentType="applicaton/octet-stream" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.Roster"%>
<%@ page import="com.ITORoster"%>
<%@ page import="com.Utility"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>  
<%@ page import="org.apache.poi.xssf.usermodel.XSSFWorkbook"%>  
<%
	int length = 0;
	byte[] buffer = new byte[1024];
	ObjectMapper objectMapper = new ObjectMapper();
	ServletOutputStream so = response.getOutputStream();	
	BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
	Roster roster=objectMapper.readValue(br.readLine(),Roster.class);
	roster.exportToExcel();
	File outputFile=new File(Utility.getParameterValue("outputExcelFilePath"));
	BufferedInputStream bis=new BufferedInputStream(new FileInputStream(outputFile));
	response.setContentLengthLong(outputFile.length());
	response.setHeader("Content-Disposition", "attachment; filename="+((roster.getRosterYear()%100)*100+roster.getRosterMonth()+1)+".xlsx");
	while ((bis!=null) && ((length=bis.read(buffer))!=-1))
	{
		so.write(buffer,0,length);
	}
	so.flush();
	so.close();
	bis.close();
%>	