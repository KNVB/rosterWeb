<%@ page trimDirectiveWhitespaces="true" %>
<%@ page contentType="applicaton/octet-stream" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.rosterWeb.Roster"%>
<%@ page import="com.rosterWeb.ITORoster"%>
<%@ page import="com.rosterWeb.Utility"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>  
<%@ page import="org.apache.poi.xssf.usermodel.XSSFWorkbook"%>  
<%
	int length = 0;
	byte[] buffer = new byte[1024];
	String inputFilePath,outputFilePath;
	ObjectMapper objectMapper = new ObjectMapper();
	
	ServletOutputStream so = response.getOutputStream();	
	ServletContext context = request.getServletContext();
	BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
	Roster roster=objectMapper.readValue(br.readLine(),Roster.class);
	inputFilePath=context.getRealPath("/template/template.xlsx");
	outputFilePath=context.getRealPath("/template/output.xlsx");
	roster.exportToExcel(inputFilePath,outputFilePath);
	File outputFile=new File(outputFilePath);
	BufferedInputStream bis=new BufferedInputStream(new FileInputStream(outputFile));
	response.setContentLengthLong(outputFile.length());
	response.setHeader("Content-Disposition", "attachment; filename="+((roster.getRosterYear()%100)*100+roster.getRosterMonth())+".xlsx");
	while ((bis!=null) && ((length=bis.read(buffer))!=-1))
	{
		so.write(buffer,0,length);
	}
	so.flush();
	so.close();
	bis.close();
%>	