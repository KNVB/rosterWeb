package com.rosterWeb;
import java.util.ArrayList;

import com.rosterWeb.util.DataStore;

public class Shift {
	
	private String shiftType=new String();
	private float shiftLength =0.0f;
	private boolean isEssential =false;
	private String cssClassName= new String();
	
	public Shift() {
		
	}
	public ArrayList<Shift> getActiveShiftList() throws Exception {
		DataStore dataStore=Utility.getDataStore();
		ArrayList<Shift> result=dataStore.getActiveShiftList();
		dataStore.close();
		dataStore=null;
		return result;
	}
	public String getShiftType() {
		return shiftType;
	}
	public void setShiftType(String shiftType) {
		this.shiftType = shiftType;
	}
	public float getShiftLength() {
		return shiftLength;
	}
	public void setShiftLength(float shiftLength) {
		this.shiftLength = shiftLength;
	}
	public boolean isEssential() {
		return isEssential;
	}
	public void setEssential(boolean isEssential) {
		this.isEssential = isEssential;
	}
	public String getCssClassName() {
		return cssClassName;
	}
	public void setCssClassName(String cssClassName) {
		this.cssClassName = cssClassName;
	}
}
