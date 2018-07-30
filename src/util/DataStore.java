package util;
import com.ITO;
import com.ITORoster;

import java.util.Hashtable;



/**
 * @author SITO3
 * created on 11-7-2018 09:32:32
 * @version 1.0
 * 
 */
public interface DataStore {

	public void saveITOInfo();
	public void updateITOInfo();
	public Hashtable<String,ITO>getITOList(int year,int month);
	public Hashtable<String,ITORoster> getRoster(int year,int month);
	public void close()throws Exception;

	public void updateRoster(int year,int month,Hashtable<String,ITORoster> iTORosterList);	

}