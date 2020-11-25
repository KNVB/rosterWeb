<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
	<head>
		<meta charset="UTF-8">
		<script type="text/javascript" src="<%=request.getContextPath() %>/webjars/jquery/3.3.1/jquery.min.js"></script>
		<script>
			function download()
			{
				$.ajax({
					  method:"POST",
					  dataType: 'binary',
					  url: "download.jsp",
					  xhrFields: {
					    responseType: 'blob'
					  },
					  success: function(blob, status, request){
						  var fileName=(request.getResponseHeader("Content-Disposition"));
						  fileName=fileName.substr(fileName.indexOf("=")+1);
						  console.log(fileName);
					      console.log(blob);
					      var link=document.createElement('a');
					      link.href=window.URL.createObjectURL(blob);
					      link.download="1809.xlsx";
					      link.click();
					  }
				});
						  	  
			}
		</script>
	</head>
	<body>
		<button onclick="download()">Download</button>
	</body>
</html>		