package util;
import com.ITO;
import com.ITORoster;

import java.util.ArrayList;
import java.util.Hashtable;



/**
 * @author SITO3
 * @version 1.0
 * @created 11-7-2018 09:32:32
 */
public interface DataStore {

	public void saveITOInfo();

	public void saveRoster();

	public void updateITOInfo();
	public Hashtable<String,ITO>getITOInfo(int year,int month);
	public Hashtable<String,ITORoster> getRoster(int year,int month);
	public void close()throws Exception;	

}