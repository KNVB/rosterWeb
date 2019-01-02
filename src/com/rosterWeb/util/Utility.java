package com.rosterWeb.util;

public class Utility 
{
	public static double roundTo(double value,int decPlace)
    {
    	double result;
    	result=value*Math.pow(10, decPlace);
    	result=Math.round(result);
    	result/=Math.pow(10, decPlace);
    	return result;
    }
}
