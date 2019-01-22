<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Roster Admin. Login Page</title>
	</head>
	<body>
		<br><br>
		<div style="display:flex;align-items: center;justify-content: center;width:100%">
			<form method="post" action="login.jsp">
				<table border="0">
					<tr>
						<td colspan="2" style="text-align:center">Roster Scheduler Login page</td>
					</tr>	
					<tr>
						<td>Login Name:</td>
						<td><input type="text" name="loginName"></td>						
					</tr>
					<tr>
						<td>Password:</td>
						<td><input type="password" name="adminPwd"></td>						
					</tr>
					<tr>
						<td colspan="2" style="text-align:center"><input type="submit" value="login"></td>						
					</tr>
				</table>
			</form>
		</div>				
	</body>
</html>