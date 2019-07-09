/***********************************************************************************
 *                                                                                 * 
 * It denote a loading screen						                               *
 * 																		           * 
 ***********************************************************************************/	
class LoadingScreen
{
	constructor(imgPath)
	{
		this.modalBackground=document.createElement("div");
		this.modalBackground.className="modalBackground";
		$(this.modalBackground).append("<img src=\""+imgPath+"\">");
	}
	show()
	{
		$("body").append(this.modalBackground);
	}
	hide()
	{
		$(this.modalBackground).remove();
	}
}