/**
 * Copyright (c) 2008-2011 UThe Open Source Geospatial Foundation
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

//var printProvider, printExtent; 
var Mapserver_output; 
var myTmpl, myTmplNUTS, myTmplCLC, myTmplCNTR, myTmplNoResults; 
// Selected Layer from treePanel. Only info-by-point control for one layer 
// It returns a string 
//var selected_layer = Ext.getCmp('layersTab').selModel.selNode.layer.params.LAYERS; 
//var selected_layer = "CORINE_CLC90_100m";   
//var Layer_GFI_array; 
var arrayGFI; 

		
// Proxy para OpenLayers. It seems to be necessary
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
				

function initInfoByPoint() {
		

		
// esta function tomará como parametros el array resultado del getfeatureinfo, 
// con resultado para varias capas, y la capa sobre la que queremos hacer el filtro (será la capa seleccionada desde un treePanel)
// devuelve un array de elementos solo para la capa layerstr (string)
// to iterate over arrays with ExtJS --> http://edspencer.net/2009/07/ext-js-iterator-functions.html
// https://developer.mozilla.org/en/JavaScript/Reference/Statements/for...in
// http://www.cssnewbie.com/emulate-a-foreach-loop-in-javascript/

		
		
		
				function reduction_array(arrayGFI,layerstr){
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
				
				
				function asigna_template(layerstr){
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
			
		
				
				// OJO, if we do not click, Mapserver_output is undefined and no results will be shown as Layer_GFI_array is also undefined
				
								
				if (!Mapserver_output){
						Mapserver_output = []; 
				} 
				
				/*
				if (typeof(selected_layer) == "undefined") {
					//alert('la variable selected_layer es ' + selected_layer); 
					selected_layer = ""; 
				}
				*/
				
								
				var info = new OpenLayers.Control.WMSGetFeatureInfo({
						url: 'http://pegasosdi.uab.es/ogc/wms?', 
						title: 'Identify features by clicking',
						queryVisible: true,
						infoFormat: 'application/vnd.ogc.gml', 
						maxFeatures: 3,
						eventListeners: {
							'getfeatureinfo': function(e) {
										// muestra la respuesta del servidor a la peticion GetFeatureInfo
										// http://dev.openlayers.org/docs/files/OpenLayers/Control/WMSGetFeatureInfo-js.html#OpenLayers.Control.WMSGetFeatureInfo.events
										msGMLOutput = e.text; 
										// take a look at http://dev.openlayers.org/docs/files/OpenLayers/Format/WMSGetFeatureInfo-js.html#OpenLayers.Format.WMSGetFeatureInfo.read 
										var parseador_MapServer_format = new OpenLayers.Format.WMSGetFeatureInfo();
										// This is an array of ouput elements corresponding to a click on the map 
										var Mapserver_output = parseador_MapServer_format.read(msGMLOutput);
										var Layer_GFI_array = reduction_array(Mapserver_output, selected_layer); 			
										asigna_template(selected_layer); 							
										/*if (Layer_GFI_array.length ==0){
											Ext.get('ventanita_id').createChild('<div>There is no result</div>');
										}*/
										myTmpl.overwrite(Ext.getCmp('ventanita_id').body, Layer_GFI_array); 	
										// console.log(e.xy);        // POINT in PIXELS
										// console.log(e.features);  // ARRAY
										// console.log(e);           // OBJETO
							}
						}
				});
				
				
				map.addControl(info);
				
				// control is activated by a pertinent button
				
				
				
				// we assign getfeatureinfo control to btn_infobypoint with a GeoExt Action (button + control)
				
				// We wish that by clicking on the map, if btn_infobypoint has been pressed. Info control is activated and window result shown
																
				
				var activate_GFI_control_and_show_Window = function(){
											//info.activate(); 
											Ext.getCmp('ventana_info').show();
				};
				
				
				


		
				
				// to show messages if tooltip is used in GeoExt.Action buttons
				Ext.QuickTips.init();
				
				
				// en lugar de asignarle el control al botón directamente con la propiedad control: info, 
				// se lo asignamos con el handler, que lo que hace es registrar en el evento clic sobre el mapa
				// que active el control info y que muestre la ventana con los resultados del template 
				
								
				var btn_infobypoint = new GeoExt.Action({
											//enableToggle: false,
											layout:'form',
											bodyStyle:'padding: 10px',
											tooltip: "Info by Point",
											iconCls: "btnInfoByPoint",
											control: info, 
											enableToggle: true, 
											activateOnEnable: true,
											handler: function activando() {
														map.events.register("click", map , activate_GFI_control_and_show_Window);
											}
				});
				

				var btn_print_server = new GeoExt.Action({
												enableToggle: false,
												layout:'form',
												bodyStyle:'padding: 10px',
												tooltip: "Print to PDF",
												iconCls: "btnPrintServerPDF"
				}); 
				
				
				var btn_print_client = new GeoExt.Action({
												enableToggle: false,
												layout:'form',
												bodyStyle:'padding: 10px',
												tooltip: "Print Map",
												iconCls: "botonPrintClientPDF", 
												handler: function(){
																alert('Dime que soy Prueba, please'); 
																}
				}); 
		
				// History Control
				var ctrlHist = new OpenLayers.Control.NavigationHistory();
				map.addControl(ctrlHist);

						
				// PAN CONTROL //
				
				var btn_pan = new GeoExt.Action({
									map: map,	
									// Navegation Control tiene más opciones para controlar el drag y el pan
									// http://dev.openlayers.org/docs/files/OpenLayers/Control/Navigation-js.html
									//http://dev.openlayers.org/docs/files/OpenLayers/Control/DragPan-js.html#OpenLayers.Control.DragPan
									control: new OpenLayers.Control.DragPan(),
									enableToggle: true,
									tooltip: "Pan",
									iconCls: "botonPan", 
									layout: 'form',
									//enabled: true, 
									activateOnEnable: true, 
									deactivateOnDisable: true
				});
				
				
				// NAVIGATION PREVIOUS AND NEXT
				
				var btn_prev = new GeoExt.Action({
									map: map,	
									control: ctrlHist.previous, 
									//enableToggle: true,
									tooltip: "Previous Navigation",
									iconCls: "botonPrevious"
				});
				
				
				var btn_post = new GeoExt.Action({
									map: map,
									control: ctrlHist.next,
									tooltip: "Next Navigation", 
									iconCls: "botonNext"
				});
				
								
		
		
				var control_zoomIn = new OpenLayers.Control.ZoomBox();
				
						
				btn_zoomIn = new GeoExt.Action({
										control: control_zoomIn, 
										map: map,
										enableToggle: true,
										layout: 'form',
										tooltip: "ZoomIn",
										iconCls: "botonZoomIn", 
										activateOnEnable: true, 
										deactivateOnDisable: true
				});
				
				
				var control_zoomOut = new OpenLayers.Control.ZoomBox({out: true});
				
				
				var btn_zoomOut = new GeoExt.Action({
										control: control_zoomOut, 
										map: map,
										enableToggle: true,
										layout: 'form',
										tooltip: "ZoomOut",
										iconCls: "botonZoomOut", 
										//activateOnEnable: true, 
										//deactivateOnDisable: true
				});
				
				
				
				//////////////////////////
				// OVERVIEW MAP CONTROL //
				//////////////////////////
						
				var options_overviewMap = {
								minRatio: 16, 
								maxRatio: 64, 
								maximized: true,
								mapOptions: {
								//			 See the effect by searching a location in search tab and take a look at red box in the overviewmap
											 numZoomLevels: 3}
								
							  };
							  
				map.addControl(new OpenLayers.Control.OverviewMap(options_overviewMap));
				
					
				
				
				
				
				
				
				
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
									closeAction: "hide", // to avoid problems when closing windod!
									items: Ext.getCmp('ventanita_id')
				}); 
				
			
								
				
			

				// ****  add dynamically controls to mapPanel ***** . 
				// Look at: http://www.sencha.com/forum/showthread.php?23082-How-to-dynamically-add-toolbar-to-panel&p=416663&viewfull=1#post416663		
				
				var tb = new Ext.Toolbar({ 
											items: [
											btn_infobypoint,
											'-',
											btn_pan,
											btn_zoomIn, 
											btn_zoomOut,
											btn_prev,
											btn_post,
											btn_print_server, 
											btn_print_client
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
			
