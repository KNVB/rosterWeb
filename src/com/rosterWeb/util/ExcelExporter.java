package com.rosterWeb.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;

import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellCopyPolicy;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ComparisonOperator;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFConditionalFormattingRule;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFPatternFormatting;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFSheetConditionalFormatting;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.rosterWeb.ITO;
import com.rosterWeb.ITORoster;
import com.rosterWeb.util.calendar.CalendarElement;
import com.rosterWeb.util.calendar.CalendarUtility;


public class ExcelExporter 
{
	private CalendarElement[] calendarElementList;
	private int rosterYear,rosterMonth;
	private ArrayList<String> vacantShiftData;
	private CalendarUtility myCalendarUtility=new CalendarUtility();
    
	private String sampleExcelFilePath,tempOutputExcelFilePath;
	private Map<String, ITO> itoList;
	private Map<String, ITORoster> iTORosterList;
	private Map<Integer,String> shiftList;
	private static final Logger logger = LogManager.getLogger("ExcelExporter");
	public ExcelExporter(int rosterYear, int rosterMonth) 
	{
		this.rosterYear = rosterYear;
		this.rosterMonth = rosterMonth;
		logger.debug("rosterYear="+this.rosterYear+",rosterMonth="+this.rosterMonth);
		this.calendarElementList=myCalendarUtility.getMonthlyCalendar(this.rosterYear, this.rosterMonth);
	}
	public void setSampleExcelFilePath(String inputFilePath) {
		this.sampleExcelFilePath=inputFilePath;
	}
	public void setTempOutputExcelFilePath(String outputFilePath) {
		
		this.tempOutputExcelFilePath=outputFilePath;
	}
	public void setITOList(Map<String, ITO> itoList) {
		this.itoList=itoList;
	}	
	public void setITORosterList(Map<String, ITORoster> iTORosterList) {
		this.iTORosterList=iTORosterList;		
	}
	public void setVacantShiftData(ArrayList<String>vacantShiftData)
	{
		this.vacantShiftData=vacantShiftData;
	}
	public void export() throws IOException 
	{
		ITO ito;
		int i,startRowNum=6,noOfWorkingDay=0;
		short destRowHeight;
		String itoId,weekDayName,rangeString;
			
		XSSFCell cell,preCell=null;
		XSSFColor bgColor;
		XSSFPatternFormatting fillPattern;
		
		File inputFile=new File(this.sampleExcelFilePath);
		File outputFile=new File(this.tempOutputExcelFilePath);
		Files.copy(inputFile.toPath(), outputFile.toPath(),StandardCopyOption.REPLACE_EXISTING);
		
		XSSFWorkbook workbook = new XSSFWorkbook(new FileInputStream(outputFile));
		XSSFSheet sheet1 = workbook.getSheet("sheet1");
		XSSFSheet sheet2 = workbook.getSheet("sheet2");
        
        //Set the roster Month value
        XSSFCell rosterMonthCell=sheet1.getRow(1).getCell(1);
        String monthName=sheet2.getRow(this.rosterMonth-1).getCell(0).getStringCellValue()+" "+this.rosterYear;
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
        for (i=0;i<this.calendarElementList.length;i++) {
        	noOfWorkingDay++;
        	CalendarElement calendarElement=this.calendarElementList[i];
        	weekDayName=calendarElement.getDayOfWeek();
        	logger.debug("i="+i+",is PH="+calendarElement.isPublicHoliday());
        	cell=sheet1.getRow(3).getCell(i+1);
        	if (calendarElement.isPublicHoliday())
        	{	
        		cell.setCellValue("PH");
        	}
        	cell=sheet1.getRow(4).getCell(i+1);
        	if (weekDayName.equals("S")||weekDayName.equals("Su")||calendarElement.isPublicHoliday())
        	{
        		cell.setCellStyle(style);
        	}
        	if (weekDayName.equals("S")||weekDayName.equals("Su")||calendarElement.isPublicHoliday())
        	{
        		noOfWorkingDay--;
        	}
        	cell.setCellValue(weekDayName);
        	cell=sheet1.getRow(5).getCell(i+1);
        	cell.setCellValue(i+1);
        }
        
        
        //Prepare for copy rows from sheet2 to sheet1
		String[] itoIdList = this.itoList.keySet().toArray(new String[0]);
		
		
        XSSFRow sourceRow=sheet2.getRow(12),destRow,vancancyShiftRow;
		List<XSSFRow> sourceRows=new ArrayList<XSSFRow>();
		CellCopyPolicy cellCopyPolicy=new CellCopyPolicy();
		sourceRows.add(sourceRow);        
        destRowHeight=sheet1.getRow(startRowNum-1).getHeight();
        
		for (i=0;i<itoIdList.length;i++)
		{
			itoId=itoIdList[i];
			ito=this.itoList.get(itoId);		
			sheet1.shiftRows(startRowNum+i, sheet1.getLastRowNum(), 1);
			sheet1.copyRows(sourceRows, startRowNum+i,cellCopyPolicy);
			destRow=sheet1.getRow(startRowNum+i);
			destRow.setHeight(destRowHeight);
			cell=destRow.getCell(0);
			cell.setCellValue(ito.getITOName()+"\n"+ito.getPostName()+" Extn. 2458");
			shiftList=iTORosterList.get(itoId).getShiftList();
			for (int j=1;j<=this.calendarElementList.length;j++)
			{
				cell=destRow.getCell(j);
				cell.setCellValue(shiftList.get(j));
			}
			cell=destRow.getCell(32);
			cell.setCellValue(ito.getWorkingHourPerDay()*noOfWorkingDay);
			cell=destRow.getCell(34);
			cell.setCellValue(iTORosterList.get(itoId).getLastMonthBalance());
		}
		vancancyShiftRow=sheet1.getRow(startRowNum+i);
		for (int j=0;j<this.vacantShiftData.size();j++)
		{
			cell=vancancyShiftRow.getCell(j+1);
			if (cell==null)
			{	
				cell=vancancyShiftRow.createCell(j+1);
				cell.setCellStyle(preCell.getCellStyle());
			}
			else
			{
				preCell=cell;
			}
			logger.debug("j="+j+",counter="+this.vacantShiftData.size()+",cell="+(cell==null)+","+vancancyShiftRow.getCell(j+1));
			cell.setCellValue(this.vacantShiftData.get(j));
		}
		rangeString="b"+(startRowNum+1)+":af"+(startRowNum+i);
		XSSFSheetConditionalFormatting sheet1cf = sheet1.getSheetConditionalFormatting(); 
		CellRangeAddress[] sheet1Range = {CellRangeAddress.valueOf(rangeString)};
		XSSFConditionalFormattingRule aShiftRule = sheet1cf.createConditionalFormattingRule(ComparisonOperator.EQUAL,"\"a\"");
		XSSFConditionalFormattingRule cShiftRule = sheet1cf.createConditionalFormattingRule(ComparisonOperator.EQUAL,"\"c\"");
		XSSFConditionalFormattingRule oShiftRule = sheet1cf.createConditionalFormattingRule(ComparisonOperator.EQUAL,"\"O\"");
		
		XSSFConditionalFormattingRule bxShiftRule = sheet1cf.createConditionalFormattingRule("SEARCH(\"b\","+rangeString+")");
		XSSFConditionalFormattingRule dxShiftRule = sheet1cf.createConditionalFormattingRule("SEARCH(\"d\","+rangeString+")");

		fillPattern = aShiftRule.createPatternFormatting();
		bgColor = new XSSFColor(new java.awt.Color(255, 153, 204));
		fillPattern.setFillBackgroundColor(bgColor);
		sheet1cf.addConditionalFormatting(sheet1Range, aShiftRule);

		fillPattern = bxShiftRule.createPatternFormatting();
		bgColor = new XSSFColor(new java.awt.Color(255, 255, 204));
		fillPattern.setFillBackgroundColor(bgColor);
		sheet1cf.addConditionalFormatting(sheet1Range, bxShiftRule);
		
		bgColor = new XSSFColor(new java.awt.Color(204,255,204)); 
		fillPattern = cShiftRule.createPatternFormatting();
		fillPattern.setFillBackgroundColor(bgColor);
		sheet1cf.addConditionalFormatting(sheet1Range, cShiftRule);
		
		bgColor = new XSSFColor(new java.awt.Color(204,255,255));
		fillPattern = dxShiftRule.createPatternFormatting();
		fillPattern.setFillBackgroundColor(bgColor);
		sheet1cf.addConditionalFormatting(sheet1Range, dxShiftRule);
		
		bgColor = new XSSFColor(new java.awt.Color(255,255,255));
		fillPattern =oShiftRule.createPatternFormatting();
		fillPattern.setFillBackgroundColor(bgColor);
		sheet1cf.addConditionalFormatting(sheet1Range, oShiftRule);
		
        workbook.write(new FileOutputStream(this.tempOutputExcelFilePath));
        workbook.close();
	}
}
