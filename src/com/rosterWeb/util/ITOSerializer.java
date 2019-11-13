package com.rosterWeb.util;

import java.io.IOException;
import java.util.TreeMap;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.rosterWeb.ITO;
import com.rosterWeb.ITORoster;
import com.rosterWeb.Roster;

public class ITOSerializer extends StdSerializer<ITORoster> {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6984155114871137168L;
	public ITOSerializer() {
        this(null);
    }
	public ITOSerializer(Class<ITORoster> itoRoster) {
        super(itoRoster);
    }
	@Override
	public void serialize(ITORoster itoRoster, JsonGenerator gen, SerializerProvider provider) throws IOException {
		 String[] shiftList=itoRoster.getShiftList();
		 gen.writeStartObject();
		 gen.writeStringField("itoId", itoRoster.getITOId());
		 gen.writeStringField("itoName",itoRoster.getITOName());
		 gen.writeFieldName("shiftList");
		 gen.writeStartArray();
		 for (int i=0;i<31;i++) {
			 gen.writeString(shiftList[i]);
		 }
		 gen.writeEndArray();
		 gen.writeStringField("itoPostName", itoRoster.getITOPostName());
		 gen.writeNumberField("lastMonthBalance", itoRoster.getLastMonthBalance());
		 gen.writeNumberField("thisMonthBalance",itoRoster.getThisMonthBalance());
		 gen.writeNumberField("workingHourPerDay",itoRoster.getITOWorkingHourPerDay());
		 gen.writeEndObject();
	}
	public static void main(String[] args) {
		ITO ito=new ITO();
		ObjectMapper mapper = new ObjectMapper();
		SimpleModule module = new SimpleModule();
		module.addSerializer(ITORoster.class, new ITOSerializer());
		mapper.registerModule(module);
		try {
			int rosterYear=2019,rosterMonth=11;
			TreeMap<String,ITO> itoList=ito.getITOList(rosterYear,rosterMonth);
			Roster roster=new Roster();
			ITORoster[] itoRoster=roster.getRosterTable(rosterYear, rosterMonth);
			System.out.println(mapper.writeValueAsString(itoRoster));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
