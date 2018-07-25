package com;

import util.DataStore;
import java.util.Hashtable;
//import java.util.GregorianCalendar;


/**
 * @author SITO3
 * @version 1.0
 * @created 11-7-2018 09:32:32
 */
public class Roster {
//	private GregorianCalendar rosterDate;
	private DataStore dataStore;
	private int rosterYear,rosterMonth;

	private Hashtable<String,ITORoster> iTORosterList;
	public Roster()
	{
		
	}
	/*public Roster(int rosterYear,int rosterMonth) throws Exception
	{
		dataStore=Utility.getDataStore();
		this.rosterYear=rosterYear;
		this.rosterMonth=rosterMonth;
//		this.rosterDate=new GregorianCalendar (this.rosterYear,this.rosterMonth,1);
		//iTORosterList=dataStore.getRoster(this.rosterYear, this.rosterMonth) ;
		iTORosterList=dataStore.getRoster(this.rosterYear, this.rosterMonth) ;
		dataStore.close();
	}*/
	public void load() throws Exception
	{
		dataStore=Utility.getDataStore();
		iTORosterList=dataStore.getRoster(this.rosterYear, this.rosterMonth) ;
		dataStore.close();
		dataStore=null;
	}
	public int getRosterYear() {
		return rosterYear;
	}
	public int getRosterMonth() {
		return rosterMonth;
	}
	public void setRosterYear(int rosterYear) {
		this.rosterYear = rosterYear;
	}
	public void setRosterMonth(int rosterMonth) {
		this.rosterMonth = rosterMonth;
	}


	public Hashtable<String,ITORoster>getITORosterList()
	{
		return iTORosterList;
	}
	public void setITORosterList(Hashtable<String,ITORoster>iTORosterList)
	{
		this.iTORosterList=iTORosterList;
	}
/*	public GregorianCalendar getRosterDate() 
	{
		return rosterDate;
	}	*/
	public void export()
	{

	}

	public void update() throws Exception
	{
		dataStore=Utility.getDataStore();
		dataStore.updateRoster(this.rosterYear, this.rosterMonth,this.iTORosterList) ;
		dataStore.close();
		dataStore=null;
	}

}