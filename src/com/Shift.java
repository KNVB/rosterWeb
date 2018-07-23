package com;

import java.util.GregorianCalendar;

/**
 * @author SITO3
 * @version 1.0
 * @created 11-7-2018 09:32:32
 */
public class Shift {

	private String ito_id;
	private String shift;
	private GregorianCalendar shift_date;

	public Shift(){

	}		

	
	public String getItoId() {
		return ito_id;
	}

	public void setItoId(String ito_id) {
		this.ito_id = ito_id;
	}

	public String getShift() {
		return shift;
	}

	public void setShift(String shift) {
		this.shift = shift;
	}

	public GregorianCalendar getShiftDate() {
		return shift_date;
	}

	public void setShiftDate(GregorianCalendar shift_date) {
		this.shift_date = shift_date;
	}
}