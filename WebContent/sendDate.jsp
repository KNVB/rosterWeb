<%@page contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF8">
<title>Insert title here</title>
<script type="text/javascript" src="<%=request.getContextPath() %>/webjars/jquery/3.3.1/jquery.min.js"></script>
</head>
<body>
<div id="clientSideDateValue">
Client side date value:
</div>

<div id="serverSideDateValue">
Server side date value:
</div>

<script>
var time=Date.UTC(2018,6,1);
var shiftDate=new Date(time);
$("#clientSideDateValue").html("Client side date value:"+shiftDate.getFullYear()+"/"+shiftDate.getMonth()+"/"+shiftDate.getDate());
itoRosterString="{\"itoId\":\"ITO1_1999-01-01\",";
itoRosterString+="\"shift\":\"b\",";
itoRosterString+="\"shiftDate\":"+time;
itoRosterString+="}";
jQuery.ajax({"url": "saveShift.jsp",
	 dataType: 'text',
	 data:itoRosterString,
	 method:"POST",
	 success:function(requestResult){
		 		$("#serverSideDateValue").html("Server side date value:"+requestResult);
	 		 },	
	 error:function(jqXHR, textStatus, errorThrown)
		{
			console.log(jqXHR,textStatus);
		}
});
</script>
</body>
</html>