(function ( $ ) 
	{
		$.MyModal=function(opts)
				{
					var self=this;
					var modal=document.createElement("div");
					var modalBackground=document.createElement("div");
					var modalTitleBar=document.createElement("div");
					var modalButtonBar=document.createElement("div");
					var modalTitleWrapper=document.createElement("div");
					var modalMessageWrapper=document.createElement("div");
					var modalMessageContainer=document.createElement("div");
					var modalCloseButtonWrapper=document.createElement("div");

					var defaults = 
						{
							attachedTo:document.body,
							backgroundColor:"black",
							closeOnEsc:true,
							titleDom:null,
							titleText:"Title",
							closeButtonText:"X",
							closeButtonDom:null,
													
							contentDom:null,
							contentText:"Content",
							
							isRoundCorner:true,
							showTitleBar:true,
							showButtonBar:true,
							showCloseButton:true,
							
							modalWidth:null,
							modalHeight:null,
							
							modalClassName:"modal",
							modalTitleBarClassName:"modalTitleBar padding",
							modalButtonBarClassName:"modalButtonBar padding",
							modalBackgroundClassName:"modalBackground",
							modalTitleWrapperClassName:"modalTitleWrapper",
							modalMessageWrapperClassName:"modalMessageWrapper padding",
							modalMessageContainerClassName:"modalMessageContainer",
							modalCloseButtonWrapperClassName:"modalCloseButtonWrapper",
							
							buttons:[{focus:true,class:"","text":"Ok"}],
						};
					if (opts!=null)	
						defaults=consolidOpts(defaults,opts);
					
					modal.className=defaults.modalClassName;
					if (defaults.modalWidth!=null)
						modal.style.setProperty("width",defaults.modalWidth,"important");
					if (defaults.modalHeight!=null)
						modal.style.setProperty("height",defaults.modalHeight,"important");
					modalTitleBar.className=defaults.modalTitleBarClassName;
					modalButtonBar.className=defaults.modalButtonBarClassName;
					modalBackground.className=defaults.modalBackgroundClassName;
					modalTitleWrapper.className=defaults.modalTitleWrapperClassName;
					modalMessageWrapper.className=defaults.modalMessageWrapperClassName;
					modalMessageContainer.className=defaults.modalMessageContainerClassName;
					modalCloseButtonWrapper.className=defaults.modalCloseButtonWrapperClassName;
					
					if (defaults.isRoundCorner)
					{
						modal.className+=" modalRoundCorner";
						modalTitleBar.className+=" modalTitleBarRoundCorner";
					}					
					
					
					if (defaults.showTitleBar)
					{
						if (defaults.titleText!=false)
							$(modalTitleWrapper).html(defaults.titleText);
						else
							modalTitleWrapper.appendChild(defaults.titleDom);
						modalTitleBar.appendChild(modalTitleWrapper);	
						if (defaults.showCloseButton)
						{	
							modalCloseButtonWrapper.onclick=function(){close();};
							if (defaults.closeButtonText!=false)
								modalCloseButtonWrapper.textContent=defaults.closeButtonText;
							else
								modalCloseButtonWrapper.appendChild(defaults.closeButtonDom);	
							modalTitleBar.appendChild(modalCloseButtonWrapper);	
						}
						modal.appendChild(modalTitleBar);	
					}
					
					
					if (defaults.contentText==false)
						modalMessageWrapper.appendChild(defaults.contentDom);
					else
						$(modalMessageWrapper).html(defaults.contentText);
					
					modalMessageContainer.appendChild(modalMessageWrapper);
					modal.style.opacity = "1";
					modal.appendChild(modalMessageContainer);
					
					modalBackground.id="modalBackground";
					
					switch (defaults.backgroundColor)
					{
						case "black":modalBackground.style.backgroundColor="rgba(0, 0, 0, .5)";
									break;
						case "white":modalBackground.style.backgroundColor="rgba(255, 255, 255, .5)";
									break;
						default:			
								console.log('MyModal Config Error: MyModal accept black or white background color only.');
								return false;
					}
					
					modalBackground.appendChild(modal);
					//document.body.appendChild(modalBackground);
					defaults.attachedTo.appendChild(modalBackground);
					
					if (defaults.showButtonBar)
					{
						modal.appendChild(modalButtonBar);
						addButtons(defaults.buttons,modalButtonBar);
					}
					if (defaults.closeOnEsc)
					{
						modalBackground.click();
						$(document.body).keydown(function(event)
												{
													if (event.which==27)
													{
														$(modalBackground).remove();
													}
												});
					}
					function consolidOpts(defaults,opts)
					{
						var result=new Array();
						for (var key in defaults)
						{
							result[key]=defaults[key];
							if (typeof opts[key]!="undefined")
							{
								if (key.indexOf("ClassName")>-1)
									result[key]+=" "+opts[key];
								else
									result[key]=opts[key];	
							}
						}
						return result;
					}
					function addButtons(buttonList,buttonBar)
					{
						
						buttonList.map(function (item)
										{
											var buttonObj,buttonWrapper;
											buttonWrapper=document.createElement("div");
											if (item.text==false)
											{
												buttonObj=item.domObj;
											}
											else
											{
												buttonObj=document.createElement("button");
												buttonObj.textContent=item.text;
											}
											if ((item.class!=null) &&($.trim(item.class)!=""))
												buttonObj.className+=" "+item.class;
											if(typeof item.handler==="function")
											{	
												buttonObj.onclick=function()
																	{
																		item.handler();
																		self.close();
																	};
											}
											else
											{
												buttonObj.onclick=function()
																	{
																		self.close();
																	};
											}
											buttonWrapper.appendChild(buttonObj);
											if (buttonList.length>1)
												buttonWrapper.className+="modalButtonRight";
											else
												buttonWrapper.className+="modalButtonCenter";
											buttonBar.appendChild(buttonWrapper);
											if ((item.focus)||(buttonList.length==1))
												buttonObj.focus();	
												
										});
					}					
					this.close=function()
					{
						$("#modalBackground").remove();
					}
					return this;	
				};
	}( jQuery ));	