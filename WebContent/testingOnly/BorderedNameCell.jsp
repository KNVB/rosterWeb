<html>
	<head>
		<meta charset="UTF-8">
		<title>Bordered Name Cell</title>
		<script src="<%=request.getContextPath()%>/js/util/Css.js"></script>
		<script src="<%=request.getContextPath()%>/js/BorderCell.js"></script>
		<script src="<%=request.getContextPath()%>/js/DateCell.js"></script>
		<script src="<%=request.getContextPath()%>/js/NameCell.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/webjars/jquery/3.3.1/jquery.min.js"></script>
		<script>
			class BorderedNameCell extends NameCell
			{
				constructor()
				{
					super();
					$(this).addClass(Css.borderCellClassName);
				}
			}
			customElements.define('bordered-name-cell',
					BorderedNameCell, {
						extends: 'td'
					});
			$( document ).ready(function() {
				var table=document.createElement("table");
				var row=table.insertRow(table.rows.length);
				row.appendChild(new BorderedNameCell());
				document.body.appendChild(table);
			});
		</script>
	</head>
	<body>
	</body>	
</html>		