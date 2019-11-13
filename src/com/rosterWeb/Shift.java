package com.rosterWeb;

public class Shift {
	private String shiftType="";
	private float shiftDuration=0.0f;
	private boolean isEssential=false;
	private String cssClassName="";
	private boolean isActive=false;
	private String timeSlot="";
	public Shift() {
		
	}
	public String getShiftType() {
		return shiftType;
	}
	public void setShiftType(String shiftType) {
		this.shiftType = shiftType;
	}
	public float getShiftDuration() {
		return shiftDuration;
	}
	public void setShiftDuration(float shiftDuration) {
		this.shiftDuration = shiftDuration;
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
	public boolean isActive() {
		return isActive;
	}
	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}
	public String getTimeSlot() {
		return timeSlot;
	}
	public void setTimeSlot(String timeSlot) {
		this.timeSlot = timeSlot;
	}
}
