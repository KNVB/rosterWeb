package com;

import java.util.GregorianCalendar;

/**
 * @author SITO3 created on 11-7-2018 09:32:32
 * @version 1.0
 */
public class Shift {

	private String itoId;
	private String shift;
	private GregorianCalendar shiftDate;

	public Shift(){

	}		

	
	public String getItoId() {
		return itoId;
	}

	public void setItoId(String ito_id) {
		this.itoId = ito_id;
	}

	public String getShift() {
		return shift;
	}

	public void setShift(String shift) {
		this.shift = shift;
	}

	public GregorianCalendar getShiftDate() {
		return shiftDate;
	}

	public void setShiftDate(GregorianCalendar shift_date) {
		this.shiftDate = shift_date;
	}
}