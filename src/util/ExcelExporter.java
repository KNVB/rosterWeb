package util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellCopyPolicy;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFConditionalFormatting;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFSheetConditionalFormatting;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.ITO;
import com.ITORoster;

import util.calendar.CalendarUtility;
import util.calendar.MonthlyCalendar;
import util.calendar.MyCalendar;

public class ExcelExporter 
{
	private MonthlyCalendar monthlyCalendar;
	private int rosterYear,rosterMonth;
	private CalendarUtility calendarUtility=new CalendarUtility();
    
	private String sampleExcelFilePath,tempOutputExcelFilePath;
	private Hashtable<String, ITO> itoList;
	private Hashtable<String, ITORoster> iTORosterList;
	private static final Logger logger = LogManager.getLogger("ExcelExporter");
	public ExcelExporter(int rosterYear, int rosterMonth) 
	{
		this.rosterYear = rosterYear;
		this.rosterMonth = rosterMonth;
		logger.debug("rosterYear="+this.rosterYear+",rosterMonth="+this.rosterMonth);
		this.monthlyCalendar=calendarUtility.getMonthlyCalendar(this.rosterYear, this.rosterMonth);
	}
	public void setSampleExcelFilePath(String inputFilePath) {
		// TODO Auto-generated method stub
		this.sampleExcelFilePath=inputFilePath;
	}
	public void setTempOutputExcelFilePath(String outputFilePath) {
		// TODO Auto-generated method stub
		this.tempOutputExcelFilePath=outputFilePath;
	}
	public void setITOList(Hashtable<String, ITO> itoList) {
		this.itoList=itoList;
	}	
	public void setITORosterList(Hashtable<String, ITORoster> iTORosterList) {
		this.iTORosterList=iTORosterList;		
	}
	public void export() throws IOException 
	{
		ITO ito;
		int startRow=6,endRow=6;
		String itoId,weekDayName;
		XSSFCell cell;
		File inputFile=new File(this.sampleExcelFilePath);
		File outputFile=new File(this.tempOutputExcelFilePath);
		
		Files.copy(inputFile.toPath(), outputFile.toPath(),StandardCopyOption.REPLACE_EXISTING);
		XSSFWorkbook workbook = new XSSFWorkbook(new FileInputStream(outputFile));
		XSSFSheet sheet1 = workbook.getSheet("sheet1");
		XSSFSheet sheet2 = workbook.getSheet("sheet2");
	    XSSFSheetConditionalFormatting sheet1cf = sheet1.getSheetConditionalFormatting(); 
        XSSFSheetConditionalFormatting sheet2cf = sheet2.getSheetConditionalFormatting();
        
        //Set the roster Month value
        XSSFCell rosterMonthCell=sheet1.getRow(1).getCell(1);
        String monthName=sheet2.getRow(this.rosterMonth).getCell(0).getStringCellValue()+" "+this.rosterYear;
        rosterMonthCell.setCellValue(monthName);
        
        //Create Style for Public Holiday
        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        
        font.setFontHeightInPoints((short) 12);
        font.setFontName("Times New Roman");
        font.setColor(HSSFColor.HSSFColorPredefined.RED.getIndex());
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFont(font);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        
        //Print the calendar for the specified roster month
        for (int i=1;i<=this.monthlyCalendar.length;i++)
		{
        	MyCalendar myCalendar=this.monthlyCalendar.getMonthlyCalendar().get(i);
        	weekDayName=calendarUtility.weekDayNames.get(myCalendar.getDayOfWeek());
        	logger.debug("i="+i+",is PH="+myCalendar.isPublicHoliday());
        	cell=sheet1.getRow(3).getCell(i);
        	
        	
        	if (myCalendar.isPublicHoliday())
        	{	
        		cell.setCellValue("PH");
        	}
        	cell=sheet1.getRow(4).getCell(i);
        	if (myCalendar.isPublicHoliday()||(weekDayName.equals("Su"))||(weekDayName.equals("S")))
        	{
        		cell.setCellStyle(style);
        	}
        	cell.setCellValue(weekDayName);
        	cell=sheet1.getRow(5).getCell(i);
        	cell.setCellValue(i);
		}
        
        //Prepare for copy rows from sheet2 to sheet1
        XSSFRow sourceRow=sheet2.getRow(12);
		List<XSSFRow> sourceRows=new ArrayList<XSSFRow>();
		CellCopyPolicy cellCopyPolicy=new CellCopyPolicy();
		sourceRows.add(sourceRow);        
        Enumeration<String> itoIds=this.itoList.keys();
        
    	sheet1.shiftRows(6, 6, 1);
    	sheet1.copyRows(sourceRows, 6,cellCopyPolicy);
    
		cell=sheet1.getRow(6).getCell(1);
		cell.setCellValue("0");
	
		sheet1.shiftRows(8, 8, 1);
    	sheet1.copyRows(sourceRows, 7,cellCopyPolicy);
    
		cell=sheet1.getRow(7).getCell(1);
		cell.setCellValue("1");
		
        workbook.write(new FileOutputStream(this.tempOutputExcelFilePath));
        workbook.close();
	}
}
