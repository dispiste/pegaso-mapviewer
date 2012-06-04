/**
 * Copyright (c) 2008-2011 UThe Open Source Geospatial Foundation
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

//var printProvider, printExtent; // saved in case of server printing
var msOutput; 
//var SALIDORRA, mas, menos; 
var myTmpl, myTmplNUTS, myTmplCLC, myTmplCNTR, myTmplNoResults; 
//var btnZoomIn, btnZoomOut, btnPan, btnInfo, tooglegroup; 
// Selected Layer from treePanel. Only info-by-point control for one layer 
// It returns a string 
//var selected_layer = Ext.getCmp('layersTab').selModel.selNode.layer.params.LAYERS; 
//var selected_layer = "CORINE_CLC90_100m";   
//var arrGFILayers; 


var arrayGFI; 

		
// Proxy para OpenLayers. It seems to be necessary
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
				

function initInfoByPoint() {
		

		
// This function will take as params an array resulting from getfeatureinfo request
// with results for several layers. And layer on which we wish to make a filter (one selected since treePanel)
// returns an array of elements only for layer named layerstr (string)

		
		
		
				function reductionArray(arrayGFI,layerstr){
								var array_red = []; 	
								if (!arrayGFI){	
										arrayGFI = []; 
								}
								for (i=0;i<=arrayGFI.length-1;i++){
									if(arrayGFI[i].type==layerstr){
										array_red.push(arrayGFI[i]); 
										}
									}
								return array_red; 
				}; 
				
				
				function assignTemplate(layerstr){
							switch (layerstr) {
							
									case "CNTR_BN_03M_2006":
											myTmpl = myTmplCNTR;
											break; 
									case "NUTS_BN_03M_2006":
											myTmpl = myTmplNUTS;
											break; 		
									case "CORINE_CLC90_100m":
									case "CORINE_CLC00_100m":
									case "CORINE_CLC06_100m":
											myTmpl = myTmplCLC;
											break; 
									case "":
											myTmpl = myTmplNoResults;
											break; 
									default: 
											myTmpl = myTmplNoResults; 
											break; 
											
									}
				};
			
		
				
				// OJO, if we do not click, msOutput is undefined 
				// and no results will be shown because arrGFILayers is also undefined
				
								
				if (!msOutput){
						msOutput = []; 
				} 
				
				/*
				if (typeof(selected_layer) == "undefined") {
					//alert('la variable selected_layer es ' + selected_layer); 
					selected_layer = ""; 
				}
				*/
				
								
				var ctrlInfo = new OpenLayers.Control.WMSGetFeatureInfo({
						url: 'http://pegasosdi.uab.es/ogc/wms?', 
						title: 'Identify features by clicking',
						queryVisible: true,
						infoFormat: 'application/vnd.ogc.gml', 
						maxFeatures: 3,
						eventListeners: {
							'getfeatureinfo': function(e) {
										// It shows the server response to a GetFeatureInfo WMS request
										// http://dev.openlayers.org/docs/files/OpenLayers/Control/WMSGetFeatureInfo-js.html#OpenLayers.Control.WMSGetFeatureInfo.events
										msGMLOutput = e.text; 
										// take a look at http://dev.openlayers.org/docs/files/OpenLayers/Format/WMSGetFeatureInfo-js.html#OpenLayers.Format.WMSGetFeatureInfo.read 
										var msParserFormat = new OpenLayers.Format.WMSGetFeatureInfo();
										// This is an array of ouput elements corresponding to a click on the map 
										var msOutput = msParserFormat.read(msGMLOutput);
										var arrGFILayers = reductionArray(msOutput, selected_layer); 			
										assignTemplate(selected_layer); 							
										/*if (arrGFILayers.length ==0){
											Ext.get('ventanita_id').createChild('<div>There is no result</div>');
										}*/
										myTmpl.overwrite(Ext.getCmp('ventanita_id').body, arrGFILayers); 	
										// console.log(e.xy);        // POINT in PIXELS
										// console.log(e.features);  // ARRAY
										// console.log(e);           // OBJETO
							}
						}
				});
				
				
				map.addControl(ctrlInfo);
				
				// control is activated by a pertinent button
				
				
				
				// we assign getfeatureinfo control to btnInfo with a GeoExt Action (button + control)
				// We wish that by clicking on the map, if btnInfo has been pressed. Info control is activated and window result shown
																
				
				var activateCtrlInfo = function(){
											//ctrlInfo.activate(); 
											Ext.getCmp('ventana_info').show();
				};
				
				
				


		
				
				// to show messages if tooltip is used in GeoExt.Action buttons
				Ext.QuickTips.init();
				
				
				// Instead of asssigning map control directly to a button with the control property,
				// we will assign with a handler, that is, it is registered with the click event on the map
				// that activates the info control and it shows a window with the template results 
				
											
				var btnInfo = new GeoExt.Action({
											//enableToggle: false,
											id: 'cacota',
											layout:'form',
											bodyStyle:'padding: 10px',
											tooltip: "Info by Point",
											iconCls: "btnInfoByPoint",
											control: ctrlInfo, 
											enableToggle: true, 
											activateOnEnable: true,
											//toggleGroup: 'groupToggleButtons', 
											handler: function(btn){ // we manage the "pressed" property for button element associated to action
														if (btn.pressed) {
															map.events.register("click", map , activateCtrlInfo);
														} else {
															map.events.unregister("click", map , activateCtrlInfo);
														}
											}
				});
				
			
				var btnPrintServer = new GeoExt.Action({
												enableToggle: false,
												layout:'form',
												bodyStyle:'padding: 10px',
												tooltip: "Print to PDF",
												iconCls: "btnPrintServerPDF"
				}); 
				
				
				var btnPrintClient = new GeoExt.Action({
												enableToggle: false,
												layout:'form',
												bodyStyle:'padding: 10px',
												tooltip: "Print Map",
												iconCls: "botonPrintClientPDF", 
												handler: function(){				
																	window.open('http://localhost/pegaso-mapviewer/viewer-ui/src/main/webapp/print_good.html'); 
												}
				}); 
		
		
				// History Control
				var ctrlHist = new OpenLayers.Control.NavigationHistory();
				map.addControl(ctrlHist);

						
				// PAN CONTROL //
				
				var btnPan = new GeoExt.Action({
									map: map,	
									// Navegation Control have more options to control drag and pan
									// http://dev.openlayers.org/docs/files/OpenLayers/Control/Navigation-js.html
									// http://dev.openlayers.org/docs/files/OpenLayers/Control/DragPan-js.html#OpenLayers.Control.DragPan
									control: new OpenLayers.Control.DragPan(),
									enableToggle: true,
									tooltip: "Pan",
									iconCls: "botonPan", 
									layout: 'form',
									toggleGroup: 'groupToggleButtons', 
									pressed : true,
									//enabled: true, 
									activateOnEnable: true, 
									deactivateOnDisable: true
				});
				
				
				// NAVIGATION PREVIOUS AND NEXT
				
				var btnPrev = new GeoExt.Action({
									map: map,	
									control: ctrlHist.previous, 
									//enableToggle: true,
									tooltip: "Previous Navigation",
									iconCls: "botonPrevious"
				});
				
				
				var btnPost = new GeoExt.Action({
									map: map,
									control: ctrlHist.next,
									tooltip: "Next Navigation", 
									iconCls: "botonNext"
				});
				
								
		
		
				var ctrlZoomIn = new OpenLayers.Control.ZoomBox();
				
						
				var btnZoomIn = new GeoExt.Action({
										control: ctrlZoomIn, 
										map: map,
										enableToggle: true,
										layout: 'form',
										tooltip: "ZoomIn",
										iconCls: "botonZoomIn", 
										toggleGroup: 'groupToggleButtons', 
										activateOnEnable: true, 
										deactivateOnDisable: true
				});
				
								
				
				var ctrlZoomOut = new OpenLayers.Control.ZoomBox({out: true});
				
				
				var btnZoomOut = new GeoExt.Action({
										control: ctrlZoomOut, 
										map: map,
										enableToggle: true,
										layout: 'form',
										tooltip: "ZoomOut",
										iconCls: "botonZoomOut", 
										toggleGroup: 'groupToggleButtons'
										//activateOnEnable: true, 
										//deactivateOnDisable: true
				});
				
				
				var btnZoomFullExtent = new GeoExt.Action({
												//control: control_zoomOut, 
												map: map,
												enableToggle: false,
												layout: 'form',
												tooltip: "Full Extent",
												iconCls: "botonFullExtent",
												handler: function() {
															// http://dev.openlayers.org/releases/OpenLayers-2.11/examples/setextent.html
															//var bounds = new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281);
															//map.zoomToExtent(bounds);
															//map.zoomToMaxExtent();
															var lonlat = new OpenLayers.LonLat(2102825.1807922, 4661687.4971957);
															map.setCenter(lonlat, 4);
															//alert("objeto mapa: " + map);
												}	
												
				});
				
				
				//////////////////////////
				// OVERVIEW MAP CONTROL //
				//////////////////////////
						
				var optionsOverviewMap = {
								id: 'overvMap',
								minRatio: 16, 
								maxRatio: 64, 
								maximized: true,
								mapOptions: {
								//			 See the effect by searching a location in search tab and take a look at red box in the overviewmap
											 numZoomLevels: 3}
								
							  };
							  
				map.addControl(new OpenLayers.Control.OverviewMap(optionsOverviewMap));
				
					
				
				//////////////////////////
				// SCALE BAR            // TAKE A LOOK AT: http://dev.openlayers.org/addins/scalebar/trunk/examples/scalebar.html
				////////////////////////// http://trac.osgeo.org/openlayers/attachment/ticket/24/scalebar.patch
				
				//var scaleLinea = new OpenLayers.Control.ScaleLine();
				
				var scaleBarr = new OpenLayers.Control.ScaleBar({
											abbreviateLabel: true, // kilometers to KM
											minWidth: 100, // default is 100 pixels
											maxWidth: 300 // default is 200 pixels); 
				}); 
				
				//map.addControl(scaleLinea); 
				map.addControl(scaleBarr); 
				
				var panPanelCtrl = new OpenLayers.Control.PanPanel();
				var zoomPanelCtrl = new OpenLayers.Control.PanZoom();
				
				map.addControls([panPanelCtrl,zoomPanelCtrl]);
				
				
				
				// ***********************************************			
				// TEMPLATES (only for some layers -> to be grown.
				// Control only by-default loaded layers
				// ***********************************************	

				
				myTmplCLC = new Ext.XTemplate(
								'<tpl for=".">',
									'<div style="background-color: #FFE9E9; margin: 10px; width:400px;">',
											'<b> Layer: </b> {type} <br />',
											'<tpl for="attributes">', 
													'<b> Coordinates X-Y: </b> {x}, {y} <br />', 
													'<b> Class: </b> {value_0} <br />', 
													'<b> Description: </b> {class} <br />', 
											'</tpl>', 
											'Take a look at <a href="http://sia.eionet.europa.eu/CLC2000/classes" target="_blank">Corine classes</a> for more details! <br />',
									'</div>',
								'</tpl>'														
				);
				
				
								
				myTmplCLC.compile();
				
				myTmplNUTS = new Ext.XTemplate(
								'<tpl for=".">',
									'<div style="background-color: #FFE9E9; margin: 10px; width: 300px;">',
											'<b> Layer: </b> {type} <br />',
											'<tpl for="attributes">',  
												'<b> ID: </b> {OBJECTID} <br />', 
												'<b> NUTSID: </b> {NUTS_BN_ID} <br />', 
											'</tpl>', 
									'</div>',
								'</tpl>'
				);
				
				myTmplNUTS.compile();
				
				
				myTmplCNTR = new Ext.XTemplate(
								'<tpl for=".">',
									'<div style="background-color: #CAE8EB; margin: 10px; width: 300px;">',
											'<b> Layer: </b> {type} <br />',
											'<tpl for="attributes">',  
												'<b> CNTR_ID: </b> {CNTR_BN_ID} <br />', 
												'<b> LENGTH: </b> {LEN} <br />', 
											'</tpl>', 
									'</div>',
								'</tpl>'
				);
				
				myTmplCNTR.compile();
				
				
				
				myTmplNoResults = new Ext.XTemplate(
										'<tpl>',
											'<div>',
												' There is no selected layer ',
											'</div>',
										'</tpl>'
				);
				
				myTmplNoResults.compile();
				
				
				// *****************************************
				// END TEMPLATES
				// *****************************************			
				 
				
				
				
				var panel_GFI = new Ext.Panel({
							id: 'ventanita_id',
							title: 'WMS GetFeatureInfo',
							width: 330,
							html: '<p><i>WMSGetFeatureInfo results</i></p>',	
							layout:  'fit', 
							closable: true
						});
				
								
				window_GFI = new Ext.Window({
									title: 'WMS GetFeatureInfo',
									id: 'ventana_info',
									width: 330,
									height: 300, 
									border: false,
									layout: 'fit',
									closeAction: "hide", // to avoid problems when closing windod!
									items: Ext.getCmp('ventanita_id')
				}); 
				
			
								
				
			

				// ****  add dynamically controls to mapPanel ***** . 
				// Look at: http://www.sencha.com/forum/showthread.php?23082-How-to-dynamically-add-toolbar-to-panel&p=416663&viewfull=1#post416663		
				
				var tb = new Ext.Toolbar({ 
											items: [
											btnInfo,
											'-',
											btnPan,
											btnZoomIn, 
											//toogleGroup,
											btnZoomOut,
											btnPrev,
											btnPost,
											btnZoomFullExtent,
											//btnPrintServer, 
											btnPrintClient
											] 
				});
			
				// As we do not have items in the mapPanel, so ...
				mapPanel.elements +=',tbar'; 
				
				mapPanel.add(tb); 
				
				mapPanel.doLayout(); 

		
		
				/*
				
				// SERVER PRINT: It works and, because of that, it is stored 
		
		
				// The printProvider that connects us to the print service
				var printProvider = new GeoExt.data.PrintProvider({
												method: "GET", // "POST" recommended for production use
												capabilities: printCapabilities, // from the info.json script in the html
												customParams: {
													mapTitle: "Printing Demo",
													comment: "This is a simple map printed from GeoExt."
												}
				});
				
				var printExtent = new GeoExt.plugins.PrintExtent({
											printProvider: printProvider
				});
		
		
				// *****  add dynamically a plugin to a panel ***** 
				// Look at: http://www.sencha.com/forum/showthread.php?124179-Dynamically-adding-plugins-to-grid
				
				printExtent.init(mapPanel); 

				// plugins: [] en la definición de mapPanel cuando se instancia
				mapPanel.plugins.push(printExtent);  
				
				// añadimos el handler una vez que hemos añadido el plugin de impresión
				btn_print_server.setHandler(function() {
						// the PrintExtent plugin is the mapPanel's 1st plugin
						mapPanel.plugins[0].print();
				}); 
				
				// añadir una pagina de color naranja para indicar la extensión de la impresión
				printExtent.addPage();
		
				*/
		
}	 // end initInfoByPoint
			
