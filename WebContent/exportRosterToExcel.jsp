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
	ObjectMapper objectMapper = new ObjectMapper();
	BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
	Roster roster=objectMapper.readValue(br.readLine(),Roster.class);
	roster.exportToExcel();
	File outputFile=new File(Utility.getParameterValue("outputExcelFilePath"));
	XSSFWorkbook workbook = new XSSFWorkbook(new FileInputStream(outputFile));
	response.setContentLengthLong(outputFile.length());
	//response.setHeader("Content-length", Long.toString(outputFile.length()));
	response.setHeader("Content-Disposition", "attachment; filename="+(roster.getRosterYear()%100)*10+roster.getRosterMonth()+".xlsx");
	workbook.write(response.getOutputStream());
	response.getOutputStream().flush();
	response.getOutputStream().close();
	workbook.close();
%>	