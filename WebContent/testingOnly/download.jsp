<%@ page trimDirectiveWhitespaces="true" %>
<%@ page contentType="applicaton/octet-stream" %>
<%//@ page contentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"%>
<%@ page import="com.rosterWeb.Utility"%>
<%@ page import="java.io.BufferedInputStream"%>
<%@ page import="java.io.File"%>
<%@ page import="java.io.FileInputStream"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFWorkbook"%>
<%
int length = 0;
byte[] buffer = new byte[1024];
ServletOutputStream so = response.getOutputStream();
File outputFile=new File(Utility.getParameterValue("outputExcelFilePath"));
BufferedInputStream bis=new BufferedInputStream(new FileInputStream(outputFile)); 
response.setContentLength((int) outputFile.length( ));
response.setHeader("Content-length", Long.toString(outputFile.length()));
response.setHeader("Content-Disposition", "attachment; filename=download.xlsx");

while ((bis!=null) && ((length=bis.read(buffer))!=-1))
{
	so.write(buffer,0,length);
}
so.flush();
so.close();
bis.close();
%>