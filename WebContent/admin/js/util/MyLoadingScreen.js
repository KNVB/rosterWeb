class MyLoadingScreen
{
	constructor(opts)
	{
		this.myModal=null;
		this.defaults={ 
					imgPath: "img/default.svg",
					showTitleBar:false,
					showButtonBar:false,
					contentText:false,
					backgroundColor:"white",
				};
		$.extend(this.defaults, opts);
		var image=document.createElement("img");
		image.src=this.defaults.imgPath;
		//image.style.width;
		this.defaults["contentDom"]=image;	
		this.defaults["modalWidth"]="auto";
	}
	show()
	{
		this.myModal=$.MyModal(this.defaults);
	}
	hide()
	{
		this.myModal.close();
	}
}
