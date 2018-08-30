package util;
import com.ITO;
import com.ITORoster;

import java.util.ArrayList;
import java.util.Hashtable;



/**
 * It is an interface for retrieving/saving all data.
 * @author SITO3
 * created on 11-7-2018 09:32:32
 * @version 1.0
 * 
 */
public interface DataStore {

	public void saveITOInfo();
	public void updateITOInfo();
	/**
	 * Get all ITO data for the specified month and year
	 * @param year
	 * @param month
	 * @return List of ITO object
	 */
	public Hashtable<String,ITO>getITOList(int year,int month);
	/**
	 * Get the roster data for the specified month and year
	 * @param year
	 * @param month
	 * @return roster data
	 */
	public Hashtable<String,ITORoster> getRoster(int year,int month);
	
	/**
	 * Reading roster rules from data store
	 * @return roster rules
	 */
	public Hashtable<String,ArrayList<String>> getRosterRule();
	
	/**
	 * Update roster data to data store
	 * @param year the roster year
	 * @param month the roster month
	 * @param iTORosterList the ITO to shift mapping
	 * @return if update success, it return true else return false
	 */
	public boolean updateRoster(int year,int month,Hashtable<String,ITORoster> iTORosterList);	
	
	public Hashtable<String,String>getRosterStatistic(int year,int month);
	/**
	 * Close the DataStore
	 * @throws Exception
	 */
	public void close()throws Exception;
}