<%@ page trimDirectiveWhitespaces="true" %>
<%@ page contentType="applicaton/octet-stream" %>
<%@ page import="com.Utility"%>
<%@ page import="java.io.File"%>
<%@ page import="java.io.FileInputStream"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFWorkbook"%>
<%
File outputFile=new File(Utility.getParameterValue("outputExcelFilePath"));
XSSFWorkbook workbook = new XSSFWorkbook(new FileInputStream(outputFile));
response.setHeader("Content-length", Long.toString(outputFile.length()));
response.setHeader("Content-Disposition", "attachment; filename=download.xlsx");
workbook.write(response.getOutputStream());
response.getOutputStream().flush();
response.getOutputStream().close();
workbook.close();
%>