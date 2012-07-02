



var botonFL; 

// FUNCTION to be called in order to "fade" images on mouse movements 
function FadeOutComps(comp1,comp2, opacity) {
					
					g = Ext.get; 
					g(comp1).fadeOut({
										endOpacity: opacity,
										duration: 0.05
												});
						
					g(comp2).fadeOut({
										endOpacity: opacity,
										duration: 0.05
												});	
};
	

	
function initFeaturedLayers() {
					
	
	
	// panel that contains the main container named "contenedor" 
	var globalContainer = new Ext.Panel({
									//title: 'Featured Layers Container for Pegaso',
									id: 'feat',
									width: 570,
									height: 510,
									// To show a panel with transparent body and no frames and so on
									frame: false,
									border: false,
									bodyStyle: 'background:transparent;',
									//
									//renderTo: document.body,
									items: [], 
									listeners: {
									
											// before rendering, it must be in memory as an ExtJS component, but not as DOM element
											'beforerender' : function(comp){
											
															//alert(comp);// returns Object
															//alert(comp.getEl());// returns "undefined"
											},
											
											// when is renderized, we want to show at some concret position on the screen. 
											// setXY() method (Element). Coordinates for DOM element relative to document
											'render': function(comp){
															var x = botonFL.el.getXY()[0]-570+botonFL.el.getWidth();
															var y = botonFL.el.getXY()[1]+botonFL.el.getHeight();
															//var xy = botonFL.el.getXY();
															// alert(comp.getEl()); // returns Object
															//comp.getEl().setXY([300,510]); // just under position of "Featured Layers" button
															comp.getEl().setXY([x,y]); // just under position of "Featured Layers" button
											
											},
											
											'afterrender' : function(comp){
											
															//alert(comp);// returns Object
															//alert(comp.getEl());// ALSO returns Object, NO "undefined"
															//alert(comp.getEl().getXY()); // return [1110,110]
														
											}, 
									}
	});								
	
	
	// This button is added to the toolbar of the application, defined at infoByPoint.js file. When adding, it is consequently renderized
	// Ext.get('botonExtJS') returns null
	
	botonFL = new Ext.Button({
						id: 'botonExtJS',
						text: 'Featured Layers', 
						enableToggle: true,
						//renderTo: document.body,  // it has to belong to tbar
						toggleHandler: function(btn){	
						
									if (btn.pressed){
												
												// we render to document body but we add a listener to be appeared (as DOM element) at some position on the screen 
												Ext.getCmp('feat').render(document.body); 
												Ext.getCmp('feat').add(contenedor);
												Ext.getCmp('feat').doLayout();
												Ext.get('feat').slideIn('t', {
																		easing: 'easeBoth',
																		duration: 0.5
												});
									} else {
											
												Ext.get('feat').slideOut('t',{
																		easing: 'easeBoth',
																		duration: 0.5
												});	
									}
						}
	});
	
	
	//
	//
	// Container for all our images (sited at img/featuredLayers/ directory and necessary to stablish src)	
	// It is a nested container, with several children components fortunately well-renderized 
	// Too many "semantic" calls (Ext.get(' XXXXXXX ')); TO AVOID IN THE FUTURE
	//
	//
	
	var contenedor = new Ext.Container({
							id: 'cont_id',
							width: 580,            //required
							forceLayout: true,  // force to create layout for container
							hideMode: 'display',
							layoutConfig: {
										align: 'right',
										pack: 'start'
							},
							style: {
								'padding' : '10px'
							},
							// items embraces an array of containers 
							items: 
									[
										
										//*
										// CONTAINER for the whole images in the first row
										//*
										
										{
											xtype: 'container',
											id: 'contenedor_1',
											layout: 'column',
											autoWidth: true, 
											// items embraces an array of TWO containers: one ("container_caja_1_more") for the four first images
											// and another one ("container_caja_1") for main image (sited at right) 
											// four images will be shown under mouse events on this main image 
											items: [
												   { 
														xtype: 'container', 
														id: 'container_caja_1_more',
														layout: 'column', 
														listeners: {
												// this event is fired when user presses the button from the toolbar 
												// parent panel named "globalContainer" is charged to a 'render' calling
												// listeners to this event make hidden elements when user "mouseleave" the main image from "container_caja_1" container  
															'afterrender' : function(comp){
																	
																	console.log(Ext.get('container_caja_1_more'));
																	console.log(Ext.get('contenedor_1'));
																	
																	//console.log(Ext.get('container_caja_1')); // este aun no esta definido (es null)!!!!
																								//habrá de estar en el listener 'afterrender' pero de "container_caja_1"
																	
																	Ext.get('contenedor_1').on('mouseleave', function(){
																						
																						// when mouseleaves main image, fadeOut main image (at "box_elemento_1" container)
																						FadeOutComps('box_elemento_1','label1', 0.9);
																						
																						// when mouseleves main image, hide images of "container_caja_1_more" container
																						Ext.getCmp('box_elemento_1_1').hide();
																						Ext.getCmp('box_elemento_1_2').hide();
																						Ext.getCmp('box_elemento_1_3').hide();
																						Ext.getCmp('box_elemento_1_4').hide();
																						Ext.getCmp('contTxt_1_1').hide();
																						Ext.getCmp('contTxt_1_2').hide();
																						Ext.getCmp('contTxt_1_3').hide();
																						Ext.getCmp('contTxt_1_4').hide();												
																								
																								
																								
																	});
															}
														
														},
														// array for four images (ExtJS elements of Box componets: "box_elemento_1_X" X=1,2,3,4) and their labels
														// for each one of those four images. 
														// Containers: "subcontainer_caja_1_X" X=1,2,3,4
														items: [
																	// imagen + label inside container "subcontainer_caja_1_1"
																	{
																		xtype: 'container',
																		id: 'subcontainer_caja_1_1',
																		width: 110,
																		items: [
																				{
																					xtype: 'box', 
																					id: 'box_elemento_1_1',
																					autoEl: {
																							tag: 'img',
																							src: "img/featuredLayers/Case_1.png"
																							},
																					style: {
																						'padding' : '15px', 
																						'border'  : '2px solid',
																						'background-color' : '#F7F8E0'
																					},
																					hidden: true,
																					listeners: {
																							
																							'afterrender' : function(comp){
																						
																							comp.el.on('mouseover', function(a,imageElement,obj){
																																
																							// imageElement.id = "box_elemento_1_1"
																							// alert(imageElement.getFrameWidth());
																							//alert(imageElement.style);
																							Ext.getCmp('subcontainer_caja_1_1').items.items[0].el.setStyle('padding: 0px');
																							Ext.getCmp('subcontainer_caja_1_1').items.items[0].el.setWidth(110);
																						   // Ext.getCmp('subcontainer_caja_1_1').items.items[0].el.setStyle("border", "1px dashed");
																							
																							});
																									
																							comp.el.on('mouseout', function(a,imageElement,obj){
																									
																							Ext.getCmp('subcontainer_caja_1_1').items.items[0].el.setWidth(100);
																									
																							});
																								
																							comp.el.on('click', function(){
																												
																											this.highlight();
																							});
																									
																							}
																					}
																				},
																				{
																						xtype: 'box',
																						id: 'contTxt_1_1',
																						autoHeight: true,
																						hidden: true, 
																						layout: 'fit', 
																						// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
																						autoEl: {
																								tag: 'div',
																								html: '<B> Case 1 </B>',
																						}, 
																						style: {
																							'padding-left' : "25px"
																						}	
																				}
																				]
																	},
																	// imagen + label inside container "subcontainer_caja_1_2"
																	{
																		xtype: 'container',
																		id: 'subcontainer_caja_1_2',
																		width: 110,
																		items: [
																				{
																					xtype: 'box', 
																					id: 'box_elemento_1_2',
																					autoEl: {
																							tag: 'img',
																							src: "img/featuredLayers/Case_2.png"
																							},
																					style: {
																						'padding' : '15px', 
																						'border'  : '2px solid',
																						'background-color' : '#F7F8E0'
																					},		
																					hidden: true,
																					listeners: {
																							
																							'afterrender' : function(comp){
																							
																								comp.el.on('mouseover', function(a,imageElement,obj){
																															

																								Ext.getCmp('subcontainer_caja_1_2').items.items[0].el.setStyle('padding: 0px');
																								Ext.getCmp('subcontainer_caja_1_2').items.items[0].el.setWidth(110); 
																								
																							
																							}); 
																							
																								comp.el.on('mouseout', function(a,imageElement,obj){
																									
																									Ext.getCmp('subcontainer_caja_1_2').items.items[0].el.setWidth(100);
																									
																								});
																								
																								comp.el.on('click', function(){
																												
																												this.highlight();
																								});
																									
																							}
																					}				
																				},
																				
																				{
																						xtype: 'box',
																						id: 'contTxt_1_2',
																						autoHeight: true,
																						hidden: true, 
																						layout: 'fit', 
																						autoEl: {
																								tag: 'div',
																								html: '<B> Case 2 </B>',
																						}, 
																						style: {
																							'padding-left' : "25px"
																						}	
																				}
																		]
																	},	
																	// imagen + label inside container "subcontainer_caja_1_3"
																	{
																		xtype: 'container',
																		id: 'subcontainer_caja_1_3',
																		width: 110,
																		items: [
																				{
																					xtype: 'box', 
																					id: 'box_elemento_1_3',
																					autoEl: {
																							tag: 'img',
																							src: "img/featuredLayers/Case_3.png"
																							},
																					style: {
																						'padding' : '15px', 
																						'border'  : '2px solid',
																						'background-color' : '#F7F8E0'
																					},
																					hidden: true,
																					listeners: {
																							
																						'afterrender' : function(comp){
																							
																							comp.el.on('mouseover', function(a,imageElement,obj){
																														
																							Ext.getCmp('subcontainer_caja_1_3').items.items[0].el.setStyle('padding: 0px');																							   Ext.getCmp('subcontainer_caja_1_3').items.items[0].el.setWidth(110);																															
																							});
																								
																							comp.el.on('mouseout', function(a,imageElement,obj){
																									
																									Ext.getCmp('subcontainer_caja_1_3').items.items[0].el.setWidth(100);
																									
																								});
																								
																							comp.el.on('click', function(){
																												
																												this.highlight();
																							});
																									
																							}
																					}			
																				},
																				{
																						xtype: 'box',
																						id: 'contTxt_1_3',
																						autoHeight: true,
																						hidden: true, 
																						layout: 'fit', 
																						// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
																						autoEl: {
																								tag: 'div',
																								html: '<B> Case 3 </B>',
																						}, 
																						style: {
																							'padding-left' : "25px"
																						}	
																				}
																		]
																	},
																	// imagen + label inside container "subcontainer_caja_1_4"
																	{
																		xtype: 'container',
																		id: 'subcontainer_caja_1_4',
																		width: 110,
																		items: [
																				{
																					xtype: 'box', 
																					id: 'box_elemento_1_4',
																					//width: 90,
																					autoEl: {
																							tag: 'img',
																							src: "img/featuredLayers/Case_4.png"
																							},
																					style: {
																						'padding' : '15px',
																						'border'  : '2px solid',
																						'background-color' : '#F7F8E0'
																					},
																					hidden: true,
																					listeners: {
																							
																							'afterrender' : function(comp){
																							
																								comp.el.on('mouseover', function(a,imageElement,obj){
																														
																							Ext.getCmp('subcontainer_caja_1_4').items.items[0].el.setStyle('padding: 0px');																							   Ext.getCmp('subcontainer_caja_1_4').items.items[0].el.setWidth(110);																															
																								});
																									
																								comp.el.on('mouseout', function(a,imageElement,obj){
																									
																									Ext.getCmp('subcontainer_caja_1_4').items.items[0].el.setWidth(100);
																									
																								});
																								
																								comp.el.on('click', function(){
																												
																												this.highlight();
																								});
																									
																							}
																					}		
																				},
																				
																				{
																						xtype: 'box',
																						id: 'contTxt_1_4',
																						autoHeight: true,
																						hidden: true, 
																						layout: 'fit', 
																						autoEl: {
																								tag: 'div',
																								html: '<B> Case 4 </B>',
																						}, 
																						style: {
																							'padding-left' : "25px"
																						}	
																				}
																		]
																	}
														]
													},
													//
													// container for the main image (sited at right) that appears by default when panel is rendered
													//
													{
														xtype: 'container',
														id: 'kaka1',
														// by using this, we avoid element is positioned to left when four images are hidden
														style: {
															'float': 'right'
														},
														items: [
																{ 
																	xtype: 'container', 
																	id: 'container_caja_1',
																	listeners: {
													// listeners to this event make shown elements when user "mouseenter" the main image from "container_caja_1" container  
																				'afterrender' : function(comp){
																	
																						
																						
																						console.log(Ext.get('container_caja_1'));;
																						console.log(Ext.get('contenedor_1'));
																						 											
																						
																						Ext.get('container_caja_1').on('mouseenter', function(){
											
																											FadeOutComps('box_elemento_1','label1', 0.6);
																											
																											Ext.getCmp('box_elemento_1_1').show();
																											Ext.getCmp('box_elemento_1_2').show();
																											Ext.getCmp('box_elemento_1_3').show();
																											Ext.getCmp('box_elemento_1_4').show();
																											Ext.getCmp('contTxt_1_1').show();
																											Ext.getCmp('contTxt_1_2').show();
																											Ext.getCmp('contTxt_1_3').show();
																											Ext.getCmp('contTxt_1_4').show();
																					
																						});	
																		
																				}
																	},
																	items: {
																							xtype: 'box', 
																							id: 'box_elemento_1',
																							autoEl: {
																									tag: 'img',
																									src: "img/featuredLayers/imagen_1.png"
																									},		
																							autoWidth: true				
																	
																			}
																			
																},
																{
																	xtype: 'box',
																	id: 'label1',
																	autoHeight: true,
																	layout: 'fit', 
																	// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
																	autoEl: {
																					tag: 'div',
																					html: '<B><I> Cases </I></B>',
																	}, 
																	style: {
																					'padding-left' : "30px",
																					'background-color':  '#CCCCCC'
																	}	
																}																
																]
													}
													
												]
										},
										
										//**
										//*
										// CONTAINER for the whole images in the second row
										//*
										//**
										{
											xtype: 'container',
											id: 'contenedor_2',
											layout: 'column',
											autoWidth: true, 
											items: 
													[
													//
													// container para las cuatro imagenes que apareceran ante eventos sobre imagen anterior
													//
													{ 
														xtype: 'container', 
														id: 'container_caja_2_more',
														layout: 'column', 
														listeners: {
														
															'afterrender' : function(comp){
																	
																	console.log(Ext.get('container_caja_2_more'));
																	console.log(Ext.get('contenedor_2'));
																	
																	Ext.get('contenedor_2').on('mouseleave', function(){
											
																						FadeOutComps('box_elemento_2','label2', 0.9);
																						
																						Ext.getCmp('box_elemento_2_1').hide();
																						Ext.getCmp('box_elemento_2_2').hide();
																						Ext.getCmp('box_elemento_2_3').hide();
																						Ext.getCmp('box_elemento_2_4').hide();
																						Ext.getCmp('contTxt_2_1').hide();
																						Ext.getCmp('contTxt_2_2').hide();
																						Ext.getCmp('contTxt_2_3').hide();
																						Ext.getCmp('contTxt_2_4').hide();												
																								
																								
																								
																	});
							
															}
															
														},
														// array para cuatro elementos de Ext tipo Box Components para cada una de las cuatro imagenes
														items: [
																	{
																		xtype: 'container',
																		id: 'subcontainer_caja_2_1',
																		width: 110,
																		items: [
																				{
																					xtype: 'box', 
																					id: 'box_elemento_2_1',
																					autoEl: {
																							tag: 'img',
																							src: "img/featuredLayers/FeaturedLayers11_smaller.png"
																							},
																					style: {
																						'padding' : '15px' ,
																						'border'  : '2px solid',
																						'background-color' : '#F7F8E0'
																					},
																					hidden: true,
																					autoWidth: true,
																					listeners: {
																							
																							'afterrender' : function(comp){
																							
																								comp.el.on('mouseover', function(a,imageElement,obj){
																														
																							Ext.getCmp('subcontainer_caja_2_1').items.items[0].el.setStyle('padding: 0px');																							   Ext.getCmp('subcontainer_caja_2_1').items.items[0].el.setWidth(110);
																							
																								});
																									
																								comp.el.on('mouseout', function(a,imageElement,obj){
																									
																							Ext.getCmp('subcontainer_caja_2_1').items.items[0].el.setWidth(100);
																									
																								});
																								
																								comp.el.on('click', function(){
																												
																												this.highlight();
																								});
																									
																							}
																					}
																				},
																				
																				{
																						xtype: 'box',
																						id: 'contTxt_2_1',
																						autoHeight: true,
																						hidden: true, 
																						layout: 'fit', 
																						autoEl: {
																								tag: 'div',
																								html: '<B> Pegaso 1 </B>',
																						}, 
																						style: {
																							'padding-left' : "25px"
																						}	
																				}
																				]
																	},
																	{
																		xtype: 'container',
																		id: 'subcontainer_caja_2_2',
																		width: 110,
																		items: [
																				{
																					xtype: 'box', 
																					id: 'box_elemento_2_2',
																					autoEl: {
																							tag: 'img',
																							src: "img/featuredLayers/FeaturedLayers12_smaller.png"
																							},
																					style: {
																						'padding' : '15px',
																						'border'  : '2px solid',
																						'background-color' : '#F7F8E0'
																					},		
																					hidden: true,
																					autoWidth: true,
																					listeners: {
																							
																							'afterrender' : function(comp){
																							
																								comp.el.on('mouseover', function(a,imageElement,obj){
																														
																							Ext.getCmp('subcontainer_caja_2_2').items.items[0].el.setStyle('padding: 0px');																							   Ext.getCmp('subcontainer_caja_2_2').items.items[0].el.setWidth(110);																															
																								});
																									
																								comp.el.on('mouseout', function(a,imageElement,obj){
																									
																									Ext.getCmp('subcontainer_caja_2_2').items.items[0].el.setWidth(100);
																									
																								});
																								
																								comp.el.on('click', function(){
																												
																												this.highlight();
																								});
																									
																							}
																					}				
																				},
																				
																				{
																						xtype: 'box',
																						id: 'contTxt_2_2',
																						autoHeight: true,
																						hidden: true, 
																						layout: 'fit', 
																						// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
																						autoEl: {
																								tag: 'div',
																								html: '<B> Pegaso 2 </B>',
																						}, 
																						style: {
																							'padding-left' : "25px"
																						}	
																				}
																		]
																	},	
																	{
																		xtype: 'container',
																		id: 'subcontainer_caja_2_3',
																		width: 110,
																		items: [
																				{
																					xtype: 'box', 
																					id: 'box_elemento_2_3',
																					autoEl: {
																							tag: 'img',
																							src: "img/featuredLayers/FeaturedLayers13_smaller.png"
																							},
																					style: {
																						'padding' : '15px',
																						'border'  : '2px solid',
																						'background-color' : '#F7F8E0'
																					},
																					hidden: true,
																					autoWidth: true,
																					listeners: {
																							
																							'afterrender' : function(comp){
																							
																								comp.el.on('mouseover', function(a,imageElement,obj){
																														
																							Ext.getCmp('subcontainer_caja_2_3').items.items[0].el.setStyle('padding: 0px');																							   Ext.getCmp('subcontainer_caja_2_3').items.items[0].el.setWidth(110);																															
																								});
																									
																								comp.el.on('mouseout', function(a,imageElement,obj){
																									
																									Ext.getCmp('subcontainer_caja_2_3').items.items[0].el.setWidth(100);
																									
																								});
																								
																								comp.el.on('click', function(){
																												
																												this.highlight();
																								});
																									
																							}
																					}			
																				},
																				
																				{
																						xtype: 'box',
																						id: 'contTxt_2_3',
																						autoHeight: true,
																						hidden: true, 
																						layout: 'fit', 
																						// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
																						autoEl: {
																								tag: 'div',
																								html: '<B> Pegaso 3 </B>',
																						}, 
																						style: {
																							'padding-left' : "25px"
																						}	
																				}
																		]
																	},
																	{
																		xtype: 'container',
																		id: 'subcontainer_caja_2_4',
																		width: 110,
																		items: [
																				{
																					xtype: 'box', 
																					id: 'box_elemento_2_4',
																					//width: 90,
																					autoEl: {
																							tag: 'img',
																							src: "img/featuredLayers/FeaturedLayers14_smaller.png"
																							},
																					style: {
																						'padding' : '15px',
																						'border'  : '2px solid',
																						'background-color' : '#F7F8E0'
																					},
																					hidden: true,
																					autoWidth: true,
																					listeners: {
																							
																							'afterrender' : function(comp){
																							
																								comp.el.on('mouseover', function(a,imageElement,obj){
																														
																							Ext.getCmp('subcontainer_caja_2_4').items.items[0].el.setStyle('padding: 0px');																							   Ext.getCmp('subcontainer_caja_2_4').items.items[0].el.setWidth(110);																															
																								});
																									
																								comp.el.on('mouseout', function(a,imageElement,obj){
																									
																									Ext.getCmp('subcontainer_caja_2_4').items.items[0].el.setWidth(100);
																									
																								});
																								
																								comp.el.on('click', function(){
																												
																												this.highlight();
																								});
																									
																							}
																					}		
																				},
																				
																				{
																						xtype: 'box',
																						id: 'contTxt_2_4',
																						autoHeight: true,
																						hidden: true, 
																						layout: 'fit', 
																						// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
																						autoEl: {
																								tag: 'div',
																								html: '<B> Pegaso 4 </B>',
																						}, 
																						style: {
																							'padding-left' : "25px"
																						}	
																				}
																		]
																	}
														]
														
													},
													
													//
													// container para la imagen principal (segunda) que aparece por defecto
													//
													{
														xtype: 'container',
														id: 'kaka2',
														style: {
															'float': 'right'
														},
														items: [
																{ 
																	xtype: 'container', 
																	id: 'container_caja_2',
																	listeners: {
																				'afterrender' : function(comp){
																	
																				
																						console.log(Ext.get('container_caja_2')); 
																						console.log(Ext.get('contenedor_2'));
																						
																						
																						Ext.get('container_caja_2').on('mouseenter', function(){
											
																											FadeOutComps('box_elemento_2','label2', 0.6);
																											
																											Ext.getCmp('box_elemento_2_1').show();
																											Ext.getCmp('box_elemento_2_2').show();
																											Ext.getCmp('box_elemento_2_3').show();
																											Ext.getCmp('box_elemento_2_4').show();
																											Ext.getCmp('contTxt_2_1').show();
																											Ext.getCmp('contTxt_2_2').show();
																											Ext.getCmp('contTxt_2_3').show();
																											Ext.getCmp('contTxt_2_4').show();
																												
																											
																																																
																						});	
																																						
																		
																				}
										
																	},
																	items: {
																							xtype: 'box', 
																							id: 'box_elemento_2',
																							autoEl: {
																									tag: 'img',
																									src: "img/featuredLayers/imagen_2.png"
																									},		
																							autoWidth: true				
																	
																			}
																			
																},
																{
																	xtype: 'box',
																	id: 'label2',
																	autoHeight: true,
																	layout: 'fit', 
																	// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
																	autoEl: {
																					tag: 'div',
																					html: '<B><I> Pegaso </I></B>',
																	}, 
																	style: {
																					'padding-left' : "30px",
																					'background-color':  '#CCCCCC'
																	}	
																}																
																]
													}
													
												]
										},
										
										//**
										//*
										// CONTAINER PARA EL CONJUNTO DE IMAGENES DE LA TERCERA FILA
										//*
										//**
										
										{
											xtype: 'container',
											id: 'contenedor_3',
											layout: 'column',
											items: 
													[
													//
													// container para las cuatro imagenes que apareceran ante eventos sobre imagen anterior
													// 
													{ 
														xtype: 'container', 
														id: 'container_caja_3_more',
														layout: 'column', 
														listeners: {
															'afterrender' : function(comp){
																	
																	console.log(Ext.get('container_caja_3_more')); 
																	console.log(Ext.get('contenedor_3'));
																	
																	Ext.get('contenedor_3').on('mouseleave', function(){
											
																						FadeOutComps('box_elemento_3','label3', 0.9);
																						
																						Ext.getCmp('box_elemento_3_1').hide();
																						Ext.getCmp('box_elemento_3_2').hide();
																						Ext.getCmp('box_elemento_3_3').hide();
																						Ext.getCmp('box_elemento_3_4').hide();
																						Ext.getCmp('contTxt_3_1').hide();
																						Ext.getCmp('contTxt_3_2').hide();
																						Ext.getCmp('contTxt_3_3').hide();
																						Ext.getCmp('contTxt_3_4').hide();												
																								
																								
																								
																	});
						
																	
																	
																		
															}
														
														},
														// we will add items in a different way:  from an array named items_gr3
														items: []
														
													},
													//
													// container para la imagen principal (tercera) que aparece por defecto
													//
													{
														xtype: 'container',
														id: 'kaka3',
														style: {
															'float': 'right'
														},
														items: [
																{ 
																	xtype: 'container', 
																	id: 'container_caja_3',
																	listeners: {
																				'afterrender' : function(comp){
																	
																				
																						console.log(Ext.get('container_caja_3')); 
																						console.log(Ext.get('contenedor_3')); 
																						
																						Ext.get('container_caja_3').on('mouseenter', function(){
											
																											FadeOutComps('box_elemento_3','label3', 0.6);
																											
																											Ext.getCmp('box_elemento_3_1').show();
																											Ext.getCmp('box_elemento_3_2').show();
																											Ext.getCmp('box_elemento_3_3').show();
																											Ext.getCmp('box_elemento_3_4').show();
																											Ext.getCmp('contTxt_3_1').show();
																											Ext.getCmp('contTxt_3_2').show();
																											Ext.getCmp('contTxt_3_3').show();
																											Ext.getCmp('contTxt_3_4').show();
																												
																											
																																																
																						});	
																																						
																		
																				}
										
																	},
																	items: {

																							xtype: 'box', 
																							id: 'box_elemento_3',
																							autoEl: {
																									tag: 'img',
																									src: "img/featuredLayers/imagen_3.png"
																									},		
																							autoWidth: true				
																	
																			}
																			
																},
																{
																	xtype: 'box',
																	id: 'label3',
																	autoHeight: true,
																	layout: 'fit', 
																	// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
																	autoEl: {
																					tag: 'div',
																					html: '<B><I> Categories 3  </I></B>',
																	}, 
																	style: {
																					'padding-left' : "10px",
																					'background-color':  '#CCCCCC'
																	}	
																}																
																]
													}
												]
										},
										
										//**
										//*
										// CONTAINER PARA EL CONJUNTO DE IMAGENES DE LA CUARTA FILA
										//*
										//**
										{
											xtype: 'container',
											id: 'contenedor_4',
											layout: 'column',
											// items incluye un array de dos contenedores: el de la cuarta imagen y las imagenes que se mostraran ante eventos de raton
											items: 
													[
													
													{ 
														
														xtype: 'container', 
														id: 'container_caja_4_more',
														layout: 'column', 
														listeners: {
														
															'afterrender' : function(comp){
																	
																	
																	
																	Ext.get('contenedor_4').on('mouseleave', function(){
											
																						FadeOutComps('box_elemento_4','label4', 0.9);
																						
																						Ext.getCmp('box_elemento_4_1').hide();
																						Ext.getCmp('box_elemento_4_2').hide();
																						Ext.getCmp('box_elemento_4_3').hide();
																						Ext.getCmp('box_elemento_4_4').hide();
																						Ext.getCmp('contTxt_4_1').hide();
																						Ext.getCmp('contTxt_4_2').hide();
																						Ext.getCmp('contTxt_4_3').hide();
																						Ext.getCmp('contTxt_4_4').hide();												
																								
																								
																								
																	});
						
																	
																	
																		
															}
															
														},
														items: [],
																								
													},
													//
													// container para la imagen principal (cuarta) que aparece por defecto
													//
													
													{
														xtype: 'container',
														id: 'kaka4',
														style: {
															'float': 'right'
														},
														items: [
																{ 
																	xtype: 'container', 
																	id: 'container_caja_4',
																	listeners: {
																				'afterrender' : function(comp){
																	
																				
																						console.log(Ext.get('container_caja_4')); 	
																						console.log(Ext.get('contenedor_4')); 
																				
																						
																						Ext.get('container_caja_4').on('mouseenter', function(){
											
																											FadeOutComps('box_elemento_4','label4', 0.6);
																											
																											Ext.getCmp('box_elemento_4_1').show();
																											Ext.getCmp('box_elemento_4_2').show();
																											Ext.getCmp('box_elemento_4_3').show();
																											Ext.getCmp('box_elemento_4_4').show();
																											Ext.getCmp('contTxt_4_1').show();
																											Ext.getCmp('contTxt_4_2').show();
																											Ext.getCmp('contTxt_4_3').show();
																											Ext.getCmp('contTxt_4_4').show();
																												
																											
																																																
																						});	
																																						
																		
																				}
										
																	},
																	items: {
																							xtype: 'box', 
																							id: 'box_elemento_4',
																							autoEl: {
																									tag: 'img',
																									src: "img/featuredLayers/imagen_4.png"
																									},		
																							autoWidth: true				
																	
																			}
																			
																},
																{
																	xtype: 'box',
																	id: 'label4',
																	autoHeight: true,
																	layout: 'fit', 
																	// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
																	autoEl: {
																					tag: 'div',
																					html: '<B><I> Categories 4 </I></B>',
																	}, 
																	style: {
																					'padding-left' : "10px",
																					'background-color':  '#CCCCCC'
																	}	
																}																
																]
													}
												]
										},
										
									]
						
						});
						
						
						
						var items_gr3 = [
							
											{
												xtype: 'container',
												id: 'subcontainer_caja_3_1',
												width: 110,
												items: [
														{
															xtype: 'box', 
															id: 'box_elemento_3_1',
															autoEl: {
																	tag: 'img',
																	src: "img/featuredLayers/Europe.png"
																	},
															//cls: 'padding: 10px',
															style: {
																'padding' : '15px', 
																'border'  : '2px solid',
																'background-color' : '#F7F8E0'
															},
															hidden: true,
															autoWidth: true,
															listeners: {
																																		
																	'afterrender' : function(comp){
																	
																		comp.el.on('mouseover', function(a,imageElement,obj){
																								
																	Ext.getCmp('subcontainer_caja_3_1').items.items[0].el.setStyle('padding: 0px');																	   Ext.getCmp('subcontainer_caja_3_1').items.items[0].el.setWidth(110);
																	
																		});
																			
																		comp.el.on('mouseout', function(a,imageElement,obj){
																			
																	Ext.getCmp('subcontainer_caja_3_1').items.items[0].el.setWidth(90);
																			
																		});
																		
																		comp.el.on('click', function(){
																												
																									this.highlight();
																								
																									map.addLayer(new OpenLayers.Layer.WMS("Corine 1990 250m",
																															"http://pegasosdi.uab.es/ogc/wms?", {
																																layers: "CORINE_CLC90_250m",
																																transparent: true,
																																format: "image/png"
																															}, {
																																isBaseLayer: false,
																																buffer: 0,
																																visibility: true
																															}
																									));
																										
																									Ext.Msg.alert('Featured Layers', 
																											   'You are added "Corine 1990 250m" layer successfully !');
																		
																		
																		});
																			
																	}
															}
														},
														
														{
																xtype: 'box',
																id: 'contTxt_3_1',
																autoHeight: true,
																hidden: true, 
																layout: 'fit', 
																// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
																autoEl: {
																		tag: 'div',
																		html: '<B> Corine 1 </B>',
																}, 
																style: {
																	'padding-left' : "25px"
																}	
														}
														]
											},
											{
												xtype: 'container',
												id: 'subcontainer_caja_3_2',
												width: 110,
												items: [
														{
															xtype: 'box', 
															id: 'box_elemento_3_2',
															//width: 90,
															autoEl: {
																	tag: 'img',
																	src: "img/featuredLayers/Europe.png"
																	},
															style: {
																'padding' : '15px', 
																'border'  : '2px solid',
																'background-color' : '#F7F8E0'
															},
															hidden: true,
															autoWidth: true,
															listeners: {
																	
																	'afterrender' : function(comp){
																	
																		comp.el.on('mouseover', function(a,imageElement,obj){
																								
																	Ext.getCmp('subcontainer_caja_3_2').items.items[0].el.setStyle('padding: 0px');																							   Ext.getCmp('subcontainer_caja_3_2').items.items[0].el.setWidth(110);																															
																		});
																			
																		comp.el.on('mouseout', function(a,imageElement,obj){
																			
																			Ext.getCmp('subcontainer_caja_3_2').items.items[0].el.setWidth(90);
																			
																		});
																		
																		comp.el.on('click', function(){
																												
																								this.highlight();
																								
																								map.addLayer(new OpenLayers.Layer.WMS("Corine 2000 250m",
																															"http://pegasosdi.uab.es/ogc/wms?", {
																																layers: "CORINE_CLC00_250m",
																																transparent: true,
																																format: "image/png"
																															}, {
																																isBaseLayer: false,
																																buffer: 0,
																																visibility: true
																															}
																								));
																										
																								Ext.Msg.alert('Featured Layers', 
																												'You are added "Corine 2000 250m" layer successfully !');			
																												
																		});
																																				
																	}
															}				
														},
														{
																xtype: 'box',
																id: 'contTxt_3_2',
																autoHeight: true,
																hidden: true, 
																layout: 'fit', 
																// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
																autoEl: {
																		tag: 'div',
																		html: '<B> Corine 2 </B>',
																}, 
																style: {
																	'padding-left' : "25px"
																}	
														}
														
												]
											},	
											{
												xtype: 'container',
												id: 'subcontainer_caja_3_3',
												width: 110,
												items: [
														{
															xtype: 'box', 
															id: 'box_elemento_3_3',
															autoEl: {
																	tag: 'img',
																	src: "img/featuredLayers/Europe.png"
																	},
															style: {
																'padding' : '15px', 
																'border'  : '2px solid',
																'background-color' : '#F7F8E0'
															},
															hidden: true,
															autoWidth: true,
															listeners: {
																	
																	'afterrender' : function(comp){
																	
																		comp.el.on('mouseover', function(a,imageElement,obj){
																								
																	Ext.getCmp('subcontainer_caja_3_3').items.items[0].el.setStyle('padding: 0px');																							   Ext.getCmp('subcontainer_caja_3_3').items.items[0].el.setWidth(110);																															
																		});
																			
																		comp.el.on('mouseout', function(a,imageElement,obj){
																			
																			Ext.getCmp('subcontainer_caja_3_3').items.items[0].el.setWidth(90);
																			
																		});
																		
																		comp.el.on('click', function(){
																						
																						this.highlight();
																						
																						map.addLayer(new OpenLayers.Layer.WMS("Corine 2006 250m",
																															"http://pegasosdi.uab.es/ogc/wms?", {
																																layers: "CORINE_CLC06_250m",
																																transparent: true,
																																format: "image/png"
																															}, {
																																isBaseLayer: false,
																																buffer: 0,
																																visibility: true
																															}
																						));
																										
																						Ext.Msg.alert('Featured Layers', 
																											   'You are added "Corine 2006 250m" layer successfully !');
																		});
																			
																	}
															}			
														},
														{
																xtype: 'box',
																id: 'contTxt_3_3',
																autoHeight: true,
																hidden: true, 
																layout: 'fit', 
																autoEl: {
																		tag: 'div',
																		html: '<B> Corine 3 </B>',
																}, 
																style: {
																	'padding-left' : "25px"
																}	
														}
												]
											},
											{
												xtype: 'container',
												id: 'subcontainer_caja_3_4',
												width: 110,
												items: [
														{
															xtype: 'box', 
															id: 'box_elemento_3_4',
															//width: 90,
															autoEl: {
																	tag: 'img',
																	src: "img/featuredLayers/Europe.png"
																	},
															style: {
																'padding' : '15px', 
																'border'  : '2px solid',
																'background-color' : '#F7F8E0'
															},
															hidden: true,
															autoWidth: true,
															listeners: {
																	
																	'afterrender' : function(comp){
																	
																		comp.el.on('mouseover', function(a,imageElement,obj){
																								
																	Ext.getCmp('subcontainer_caja_3_4').items.items[0].el.setStyle('padding: 0px');																							   Ext.getCmp('subcontainer_caja_3_4').items.items[0].el.setWidth(110);																															
																		});
																			
																		comp.el.on('mouseout', function(a,imageElement,obj){
																			
																			Ext.getCmp('subcontainer_caja_3_4').items.items[0].el.setWidth(90);
																			
																		});
																		
																		comp.el.on('click', function(){
																												
																												this.highlight();
																		});
																			
																	}
															}		
														},
														{
																xtype: 'box',
																id: 'contTxt_3_4',
																autoHeight: true,
																hidden: true, 
																layout: 'fit', 
																autoEl: {
																		tag: 'div',
																		html: '<B> Corine 4 </B>',
																}, 
																style: {
																	'padding-left' : "25px"
																}	
														}
												]
											}												
										];
						
						
						// array de cuatro elementos correspondientes a las imagenes que irán dentro del contenedor "container_caja_4_more"
						var items_gr4 = [
										
										// primer elemento 
										{
												xtype: 'container',
									     		id: 'subcontainer_caja_4_1',
												width: 110,
										    	items: [
														{
															xtype: 'box', 
															id: 'box_elemento_4_1',
															autoEl: {
													      			tag: 'img',
																	src: "img/featuredLayers/Categorie4_smaller.png"
																	},
															style: {
																	'padding' : '15px', 
																	'border'  : '2px solid',
																	'background-color' : '#F7F8E0'
															},
															hidden: true,
															autoWidth: true,
															listeners: {
																		'afterrender' : function(comp){
																			
																			comp.el.on('mouseover', function(a,imageElement,obj){
																																
																			Ext.getCmp('subcontainer_caja_4_1').items.items[0].el.setStyle('padding: 0px');																	   		   Ext.getCmp('subcontainer_caja_4_1').items.items[0].el.setWidth(110);
																			
																				});
																									
																				comp.el.on('mouseout', function(a,imageElement,obj){
																									
																			Ext.getCmp('subcontainer_caja_4_1').items.items[0].el.setWidth(90);
																									
																				});
																				
																				comp.el.on('click', function(){
																												
																												this.highlight();
																				});
																									
																		}
																		}
														},
														{
															xtype: 'box',
															id: 'contTxt_4_1',
															autoHeight: true,
															hidden: true, 
															layout: 'fit', 
															// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
															autoEl: {
																	tag: 'div',
																	html: '<B> NAME 1 </B>',
															}, 
															style: {
																'padding-left' : "25px"
															}	
														}
														]
										},
										// segundo elemento 
										{
											xtype: 'container',
											id: 'subcontainer_caja_4_2',
											width: 110,
											items: [
													{
														xtype: 'box', 
														id: 'box_elemento_4_2',
														autoEl: {
																tag: 'img',
																src: "img/featuredLayers/Categorie4_smaller.png"
																},
														style: {
															'padding' : '15px', 
															'border'  : '2px solid',
															'background-color' : '#F7F8E0'
														},
														hidden: true,
														autoWidth: true,
														listeners: {
																
																	'afterrender' : function(comp){
																	
																		comp.el.on('mouseover', function(a,imageElement,obj){
																								
																				Ext.getCmp('subcontainer_caja_4_2').items.items[0].el.setStyle('padding: 0px');																				   Ext.getCmp('subcontainer_caja_4_2').items.items[0].el.setWidth(110);																															
																		});
																			
																		comp.el.on('mouseout', function(a,imageElement,obj){
																			
																				Ext.getCmp('subcontainer_caja_4_2').items.items[0].el.setWidth(90);
																			
																		});
																		
																		comp.el.on('click', function(){
																												
																												this.highlight();
																		});
																			
																	}
																	}				
													},
													{
															xtype: 'box',
															id: 'contTxt_4_2',
															autoHeight: true,
															hidden: true, 
															layout: 'fit', 
															autoEl: {
																	tag: 'div',
																	html: '<B> NAME 2 </B>',
															}, 
															style: {
																'padding-left' : "25px"
															}	
													}
													]
										},
										// tercer elemento 										
										{
											xtype: 'container',
											id: 'subcontainer_caja_4_3',
											width: 110,
											items: [
													{
														xtype: 'box', 
														id: 'box_elemento_4_3',
														autoEl: {
																tag: 'img',
																src: "img/featuredLayers/Categorie4_smaller.png"
																},
														style: {
															'padding' : '15px', 
															'border'  : '2px solid',
															'background-color' : '#F7F8E0'
														},
														hidden: true,
														autoWidth: true,
														listeners: {
																							
																	'afterrender' : function(comp){
																	
																			comp.el.on('mouseover', function(a,imageElement,obj){
																								
																					Ext.getCmp('subcontainer_caja_4_3').items.items[0].el.setStyle('padding: 0px');																					   Ext.getCmp('subcontainer_caja_4_3').items.items[0].el.setWidth(110);																															
																			});
																			
																			comp.el.on('mouseout', function(a,imageElement,obj){
																			
																					Ext.getCmp('subcontainer_caja_4_3').items.items[0].el.setWidth(90);
																			
																			});
																		
																			comp.el.on('click', function(){
																						
																						this.highlight();
																			});
																									
																						}
																	}			
														},
														{
																xtype: 'box',
																id: 'contTxt_4_3',
																autoHeight: true,
																hidden: true, 
																layout: 'fit', 
																autoEl: {
																		tag: 'div',
																		html: '<B> NAME 3 </B>',
																}, 
																style: {
																	'padding-left' : "25px"
																}	
														}
													]
										},
										// cuarto elemento 
										{
											xtype: 'container',
											id: 'subcontainer_caja_4_4',
											width: 110,
											items: [
													{
														xtype: 'box', 
														id: 'box_elemento_4_4',
														autoEl: {
																tag: 'img',
																src: "img/featuredLayers/Categorie4_smaller.png"
																},
														style: {
															'padding' : '15px', 
															'border'  : '2px solid',
															'background-color' : '#F7F8E0'
														},
														hidden: true,
														autoWidth: true,
														listeners: {
																							
																	'afterrender' : function(comp){
																	
																			comp.el.on('mouseover', function(a,imageElement,obj){
																								
																							Ext.getCmp('subcontainer_caja_4_4').items.items[0].el.setStyle('padding: 0px');																							   Ext.getCmp('subcontainer_caja_4_4').items.items[0].el.setWidth(110);																															
																			});
																			
																			comp.el.on('mouseout', function(a,imageElement,obj){
																			
																							Ext.getCmp('subcontainer_caja_4_4').items.items[0].el.setWidth(90);
																			
																			});
																			
																			comp.el.on('click', function(){
																												
																												this.highlight();
																			});
																			
																					}
																	}		
													},
													{
															xtype: 'box',
															id: 'contTxt_4_4',
															autoHeight: true,
															hidden: true, 
															layout: 'fit', 
															autoEl: {
																	tag: 'div',
																	html: '<B> NAME 4 </B>',
															}, 
															style: {
																'padding-left' : "25px"
															}	
													}
												]
										}						
									];
						
						
						
						Ext.getCmp('container_caja_3_more').add(items_gr3); 
						Ext.getCmp('container_caja_3_more').doLayout();
						
						Ext.getCmp('container_caja_4_more').add(items_gr4); 
						Ext.getCmp('container_caja_4_more').doLayout();				  
			
						
											
						
						
										

	
	
		
};