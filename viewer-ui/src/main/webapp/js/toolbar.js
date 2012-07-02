/**
 * Copyright (c) 2008-2011 The Open Source Geospatial Foundation
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */
 
function initToolbar() {
	// to show messages if tooltip is used in GeoExt.Action buttons
	Ext.QuickTips.init();
	
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
														window.open('print_good.html'); 
									}
	}); 


	// History Control
	var ctrlHist = new OpenLayers.Control.NavigationHistory();
	map.addControl(ctrlHist);


	// Navigation Control
	// Enable zoom by using mouse wheel 
	var ctrlWheel = new OpenLayers.Control.Navigation(
						{
							zoomWheelEnabled: true
						}
	); 
	map.addControl(ctrlWheel);
					
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
	
	
	
	
	var panelPermalink = new Ext.Panel({	
				//renderTo: Ext.getCmp("ventana"),
				height: 300,
				width: 300,
				title: "Permalink",
				frame: true,
				id: "permalinkPanel"
	});
	
	
	
	
	
	var btnPermalink = new GeoExt.Action({
						tooltip: "Link Map", 
						iconCls: "botonPermalink",
						handler: function() {
																
							Ext.getCmp("ventana").show();
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

	// ****  add dynamically controls to mapPanel ***** . 
	// Look at: http://www.sencha.com/forum/showthread.php?23082-How-to-dynamically-add-toolbar-to-panel&p=416663&viewfull=1#post416663		
	
	var mapToolbar = new Ext.Toolbar({ 
								items: [
								btnPan,
								btnZoomIn, 
								btnZoomOut,
								btnInfoExt,
								'-',
								btnPrev,
								btnPost,
								btnZoomFullExtent,
								//btnPrintServer, 
								btnPrintClient,
								'->',
								btnPermalink,
								botonFL
								] 
	});

	// As we do not have items in the mapPanel, so ...
	mapPanel.elements +=',tbar'; 
	
	mapPanel.add(mapToolbar); 
	
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
}