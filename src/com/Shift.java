package com;

import java.util.GregorianCalendar;

/**
 * It denote a shift record
 * @author SITO3 created on 11-7-2018 09:32:32
 * @version 1.0
 */
public class Shift {

//	private String itoId;
	
	/**The assigned shift*/
	private String shift;
	
	/**The date of assigned shift*/
	private GregorianCalendar shiftDate;

	public Shift(){

	}		

	
/*	public String getItoId() {
		return itoId;
	}

	public void setItoId(String ito_id) {
		this.itoId = ito_id;
	}*/
	/**
	 * Get the assigned shift
	 * @return the assigned shift
	 */
	public String getShift() {
		return shift;
	}
	/**
	 * Set the assigned shift
	 * @param shift The assigned shift
	 */
	public void setShift(String shift) {
		this.shift = shift;
	}
	/**
	 * Get the date of assigned shift
	 * @return The date of assigned shift
	 */
	public GregorianCalendar getShiftDate() {
		return shiftDate;
	}
	/**
	 * Set the date of assigned shift
	 * @param shiftDate The date of assigned shift
	 */
	public void setShiftDate(GregorianCalendar shiftDate) {
		this.shiftDate = shiftDate;
	}
}