package com_old.rosterWeb.rosterStatistic;

public class MonthlyStatistic 
{
	private int aShiftTotal,bxShiftTotal,cShiftTotal,dxShiftTotal,oShiftTotal,monthlyTotal;

	public int getAShiftTotal() {
		return aShiftTotal;
	}

	public void setAShiftTotal(int aShiftTotal) {
		this.aShiftTotal = aShiftTotal;
	}

	public int getBxShiftTotal() {
		return bxShiftTotal;
	}

	public void setBxShiftTotal(int bxShiftTotal) {
		this.bxShiftTotal = bxShiftTotal;
	}

	public int getCShiftTotal() {
		return cShiftTotal;
	}

	public void setCShiftTotal(int cShiftTotal) {
		this.cShiftTotal = cShiftTotal;
	}

	public int getDxShiftTotal() {
		return dxShiftTotal;
	}

	public void setDxShiftTotal(int dxShiftTotal) {
		this.dxShiftTotal = dxShiftTotal;
	}

	public int getOShiftTotal() {
		return oShiftTotal;
	}

	public void setOShiftTotal(int oShiftTotal) {
		this.oShiftTotal = oShiftTotal;
	}

	public int getMonthlyTotal() {
		monthlyTotal=aShiftTotal+bxShiftTotal+cShiftTotal+dxShiftTotal+oShiftTotal;
		return monthlyTotal;
	}	
}