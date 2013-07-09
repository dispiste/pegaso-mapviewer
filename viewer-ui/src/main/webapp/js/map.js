/**
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

var map1, map2; 
var mapPanel1, mapPanel2;
var activeLayers; // activated layers controlled from treePanel visibility
var contMapPanel; 
var btnPan, btnPrev, btnPost, btnDistanceMeasure;
var activeMap;
var activePanel;
var ctrlHist, ctrlHist2;
var infoWin1, infoWin2;
var lineMeasure, lineMeasure2;
var polygonMeasure, polygonMeasure2;

var updateMap2 = function(event) {
	// DO NOT USE zoomToExtent like this: map2.zoomToExtent(map.getExtent()), extent seems not be caught properly
	map2.setCenter(map1.getCenter(), map1.getZoom(), false, false);
}
var updateMap1 = function(event) {
	map1.setCenter(map2.getCenter(), map2.getZoom(), false, false);
}

function syncMaps() {
	if(activePanel == mapPanel1) {
		updateMap2();
	} 
	if(activePanel == mapPanel2) {
		updateMap1();
	}
	map1.events.register('moveend', map1, updateMap2);
	map2.events.register('moveend', map2, updateMap1);
}
function unsyncMaps() {
	map1.events.unregister('moveend', map1, updateMap2);
	map2.events.unregister('moveend', map2, updateMap1);
}

function selectTopLayer(tree) {
	if(tree.getRootNode() && tree.getRootNode().childNodes.length > 0 && tree.getRootNode().childNodes[0].childNodes.length > 0) {
		tree.getSelectionModel().select(tree.getRootNode().childNodes[0].childNodes[0])
	}
}

function splitMap() {
	// show button to synchronize maps
	Ext.getCmp('btnSync').show();
	copyLayers(map1, map2);
	selectTopLayer(tree2);
	// Show Panel for second map
	Ext.getCmp('mappanel2').show();
	setActiveMapPanel(mapPanel1);
	// refresh container panel to adapt new mapPanel
	Ext.getCmp('idContenedorMapPanel').doLayout();
	updateMap2();
	// TO GET WORK PROPERLY, DEACTIVATE MEASURE BUTTONS WHEN SPLIT FUNCIONALITY IS ON
	var btnMeasureLine = Ext.getCmp('buttonDST'); 
	if (btnMeasureLine.pressed) {
		btnMeasureLine.toggle(false);
		btnMeasureLine.toggle(true);
	}
	var btnMeasureArea = Ext.getCmp('buttonAREA');
	if (Ext.getCmp('buttonAREA').pressed) {
		btnMeasureArea.toggle(false);
		btnMeasureArea.toggle(true);
	}
}

function unsplitMap() {
	Ext.getCmp('btnSync').hide();
	Ext.getCmp('mappanel2').hide();
	setActiveMapPanel(mapPanel1);
	Ext.getCmp('idContenedorMapPanel').doLayout();
}

function copyLayers(fromMap, toMap) {
	var numLayers = toMap.getNumLayers();
	for(var i = numLayers - 1; i >= 0; i--) {
		toMap.layers[i].destroy();
	}
	var layers = [];
	numLayers = fromMap.getNumLayers();
	for (var i=numLayers-1; i>=0; i--) {
		if (fromMap.layers[i].name!= "OpenLayers.Handler.Path" &&
				fromMap.layers[i].name!= "OpenLayers.Handler.Polygon") { // don't copy tmp layers for measure control, etc.
			var clonedLayer = fromMap.layers[i].clone();
			layers[i] = clonedLayer;
		}
	}
	toMap.addLayers(layers);
}

function setColorInPanel(panel) {
	panel.el.applyStyles({
		'borderColor' : '#ff0000',
		'borderStyle' : 'solid',
		'borderWidth' : '1px'
	});
}

function unsetColorInPanel(panel) {
	panel.el.applyStyles({
		'borderColor' : '',
		'borderStyle' : '',
		'borderWidth' : '0px'
	});
}

function zoomToFullExtent(theMap) {
	var lonlat = new OpenLayers.LonLat(2102825.1807922, 4661687.4971957);
	activePanel.map.setCenter(lonlat, 4);
}

// this function is called when map extent inside mapPanel is clicked
// and listen to active map
function settingHandlerToAction() {
	if(activePanel == mapPanel1) {
		ctrlHist.activate();
		ctrlHist2.deactivate();
		btnPrev.control = ctrlHist.previous;
		btnPost.control = ctrlHist.next;
	} else {
		ctrlHist2.activate();
		ctrlHist.deactivate();
		btnPrev.control = ctrlHist2.previous;
		btnPost.control = ctrlHist2.next;
	}
}

function setActiveMapPanel(mapPanel) {
	var oldActivePanel = activePanel;
	activePanel = mapPanel;
	if(oldActivePanel != mapPanel) {
		if(!mapPanel2.hidden) {
			// call to setColorInPanel function to remark the border of mapPanel's layout
			setColorInPanel(mapPanel);
			// unremark the border of mapPanel2's layout
			unsetColorInPanel(oldActivePanel);
		} else {
			unsetColorInPanel(mapPanel);
		}
		contMapPanel.fireEvent('activemappanelchanged', mapPanel, oldActivePanel);
		settingHandlerToAction();
		// we enable Search Combo sited in the top of the interface to show search query result zoomed at corresponding map
		comboGeo.setMap(mapPanel.map);
		// we enable Loadlayers Combo sited in the top of the interface to load layers from catalog in the corresponding map
		loadLayers.setMap(mapPanel.map);
	} else {// no changes but we still need to hightlight selected panel
		if(!mapPanel2.hidden) {
			// call to setColorInPanel function to remark the border of mapPanel's layout
			setColorInPanel(mapPanel);
		}
	}
}

function initMapPanel() {
	var options = {
		sphericalMercator: true,
		projection: new OpenLayers.Projection("EPSG:900913"),
		units: "m",
		layers: App.config.layers,
		controls: []
	};
	
	map1 = new OpenLayers.Map(options);
	activeMap = map1;

	// to show messages if tooltip is used in GeoExt.Action buttons
	Ext.QuickTips.init();

	// History Control
	ctrlHist = new OpenLayers.Control.NavigationHistory({
		autoActivate : true
	});
	map1.addControl(ctrlHist);

	// Navigation Control
	// Enable zoom by using mouse wheel
	var ctrlWheel = new OpenLayers.Control.Navigation({
		zoomWheelEnabled : true
	});
	map1.addControl(ctrlWheel);

	// PAN CONTROL //
	var panCtrl = new OpenLayers.Control.DragPan({
		autoActivate : true
	});

	btnPan = new GeoExt.Action({
						map: map1,	
						// Navegation Control have more options to control drag and pan
						// http://dev.openlayers.org/docs/files/OpenLayers/Control/Navigation-js.html
						// http://dev.openlayers.org/docs/files/OpenLayers/Control/DragPan-js.html#OpenLayers.Control.DragPan
						//control: new OpenLayers.Control.DragPan(),
						control: panCtrl, 
						enableToggle: true,
						tooltip: "Pan",
						iconCls: "botonPan",
						toggleGroup: 'groupToggleButtons', 
						pressed : true,
						//enabled: true, 
						activateOnEnable: true, 
						deactivateOnDisable: true
	});

	panCtrl.events.on({
		'activate' : function() {
			ctrlPan2.activate();
		},
		'deactivate' : function() {
			ctrlPan2.deactivate();

		},
		scope : this
	});


	// NAVIGATION PREVIOUS AND NEXT
	
	btnPrev = new GeoExt.Action({
						//map: map1,	
						control: ctrlHist.previous,
						tooltip: "Previous Navigation",
						iconCls: "botonPrevious"
				    });

	
	
	
	btnPost = new GeoExt.Action({
						//map: map1,
						control: ctrlHist.next,
						tooltip: "Next Navigation", 
						iconCls: "botonNext"
	});

	
	var ctrlZoomIn = new OpenLayers.Control.ZoomBox();

	var btnZoomIn = new GeoExt.Action({
							control: ctrlZoomIn, 
							map: map1,
							enableToggle: true,
							tooltip: "Zoom In",
							iconCls: "botonZoomIn",
							toggleGroup: 'groupToggleButtons',
							activateOnEnable: true, 
							deactivateOnDisable: true
	});

	// activate/deactivate the zoomIn control for second map (ctrlZoomIn2)
	// when zoomIn control for first map is activated/deactivated
	ctrlZoomIn.events.on({
		'activate' : function() {
			ctrlZoomIn2.activate();
		},
		'deactivate' : function() {
			ctrlZoomIn2.deactivate();

		},
		scope : this
	});


	var ctrlZoomOut = new OpenLayers.Control.ZoomBox({out: true});
	var btnZoomOut = new GeoExt.Action({
							control: ctrlZoomOut, 
							map: map1,
							enableToggle: true,
							tooltip: "Zoom Out",
							iconCls: "botonZoomOut", 
							toggleGroup: 'groupToggleButtons',
							activateOnEnable: true, 
							deactivateOnDisable: true
	});
	// activate/deactivate the zoomOut control for second map (ctrlZoomOut2)
	// when zoomOut control for first map is activated/deactivated
	ctrlZoomOut.events.on({
		'activate' : function() {
			ctrlZoomOut2.activate();
		},
		'deactivate' : function() {
			ctrlZoomOut2.deactivate();
		},
		scope : this
	});
	
	var btnZoomFullExtent = new GeoExt.Action({
		id: 'btnZoomFullExtent',
		enableToggle : false,
		layout : 'form',
		tooltip : "Full Extent",
		iconCls : "botonFullExtent",
		handler: zoomToFullExtent
	});
	
	infoWin1 = new UAB.infotool.InfoWindow({
		templatesConfig: App.config.featureInfo,
		map: map1,
		title: 'Layer Information',
		width: 340,
		border: false,
		resizeable: false,
		layout: 'fit',
		closeAction: 'hide',
		bodyCssClass: 'winFeatInfoBody'
	});
	var btnInfo = new GeoExt.Action({
		map: map1,
		toggleGroup: 'groupToggleButtons',
		control: infoWin1.getControl(),
		tooltip: "Info by Point",
		iconCls: "btnInfoByPoint",
		enableToggle: true,
		activateOnEnable: true,
		deactivateOnDisable: true
	});
	
	//////////////////////////
	// OVERVIEW MAP CONTROL //
	//////////////////////////
	// TO IMPROVE: It seems that maximized: false gives bad extension for overviewmap
	
	var lyrOverview1 = map1.layers[1].clone();	
	var lyrOverview2 = map1.layers[9].clone();
	
	var optionsOverviewMap = {
		id: 'overvMap',
		minRatio: 16, 
		maxRatio: 64, 
		maximized: false,
		maximizeTitle: 'Show the overview map',
		minimizeTitle: 'Hide the overview map',
		mapOptions: {
			// See the effect by searching a location in search tab and take a look at red box in the overviewmap
			numZoomLevels: 6, 
			layers: [lyrOverview1,lyrOverview2],
			maxResolution: "auto"
		}
	};
	
	map1.addControl(new OpenLayers.Control.OverviewMap(optionsOverviewMap));

	var scaleBar = new OpenLayers.Control.ScaleBar({
		abbreviateLabel : true, // kilometers to KM
		minWidth : 100, // default is 100 pixels
		maxWidth : 250, // default is 200 pixels);
	});

	map1.addControl(scaleBar); 
	
	//
	// LOADING PROGRESSIVE BAR
	// to show a progress bar when loading a layer 
	//
	map1.addControl(new OpenLayers.Control.LoadingPanel({}));
	
	var panPanelCtrl = new OpenLayers.Control.PanPanel();
	var zoomPanelCtrl = new OpenLayers.Control.PanZoom();
	
	map1.addControls([panPanelCtrl,zoomPanelCtrl]);


	
	// DISTANCE AND AREA MEASURE TOOLS
	
	map1.addControl(lineMeasure);
	map1.addControl(polygonMeasure);

	btnDistanceMeasure = new GeoExt.Action({
		id : 'buttonDST',
		map : map1,
		enableToggle : true,
		control : lineMeasure,
		layout : 'form',
		tooltip : "Measure distances on map",
		iconCls : "btnDistanceMeasure",
		toggleGroup : 'groupToggleButtons',
		activateOnEnable : true,
		deactivateOnDisable : true
	});

	// activate/deactivate the distance/area measure control for second map (lineMeasure2)
	// when zoomOut control for first map is activated/deactivated
	lineMeasure.events.on({
		'activate' : function() {
			lineMeasure2.activate();
		},
		'deactivate' : function() {
			lineMeasure2.deactivate();
		},
		scope : this
	});

	var btnAreaMeasure = new GeoExt.Action({
		id : 'buttonAREA',
		map : map1,
		enableToggle : true,
		control : polygonMeasure,
		layout : 'form',
		tooltip : "Measure areas on map",
		iconCls : "btnAreaMeasure",
		toggleGroup : 'groupToggleButtons',
		activateOnEnable : true,
		deactivateOnDisable : true
	});

	polygonMeasure.events.on({
		'activate' : function() {
			polygonMeasure2.activate();
		},
		'deactivate' : function() {
			polygonMeasure2.deactivate();
		},
		scope : this
	});

	var buttonFL = new Ext.Button({
		id: 'botonExtJS',
		text: 'Featured Layers', 
		enableToggle: true,
		//renderTo: document.body,  // it has to belong to tbar
		toggleHandler: function(btn){	
			if (btn.pressed){
				if (!btn.featuredLayersContainer) {
					var config = {
						categories: App.config.featuredLayers,
						ownerButton: btn
					};
					btn.featuredLayersContainer = new UAB.feat.FeaturedLayers(config);
				}
				// we render to document body but we add a listener to be appeared (as DOM element) at some position on the screen 
				btn.featuredLayersContainer.render(document.body);
				btn.featuredLayersContainer.doLayout();
				btn.featuredLayersContainer.getEl().slideIn('t', {
					easing: 'easeBoth',
					duration: 0.5
				});
			} else {
					
				btn.featuredLayersContainer.getEl().slideOut('t',{
					easing: 'easeBoth',
					duration: 0.5
				});	
			}
		}
	});

	// mapPanel will be added as item in a Panel-Ext Container
	// mapPanel is the panel shown by default, mapPanel2 is initially hidden and is shown when Split button is clicked
	mapPanel1 = new GeoExt.MapPanel({
		//region: "center",
		id : "mappanel",
		map : map1,
		layout : 'fit',
		flex : 1,
		layers : [],
		center : new OpenLayers.LonLat(18.89, 38.58).transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913')),
		zoom : 4,
		stateId : "map", // to control the state of the Map so as to make permalinks properly
		prettyStateKeys : true,
		split : true,
		plugins : [], // important in order to add dyncamically  plugins once a panel is instantiated
		listeners : {
			// afterrender event --> we want to listen browser-based mouseup event, that is fired when user make click with his mouse in the extent of DOM element
			'afterrender' : function(panel) {
				panel.el.on("mouseup", function() {
					setActiveMapPanel(mapPanel1);
				});
			}
		}
	});
	activePanel = mapPanel1;

	var splitBtnDef = {
		text : "Split Map",
		enableToggle : true,
		tooltip : "Split map view",
		iconCls : 'btnSplitViewMap',
		toggleHandler : function(button, state) {
			if(this.pressed) {
				splitMap();
			} else {
				unsplitMap();
			}
		}
	};

	var syncBtnDef = {
		id : 'btnSync',
		enableToggle : true,
		hidden : true,
		disabled : false,
		tooltip : "Sinchronize your maps",
		iconCls : 'btnSincronizarMap',
		enableToggle : true,
		toggleHandler : function(button, state) {
			if(this.pressed) {
				syncMaps();
			} else {
				unsyncMaps();
			}
		}
	};

	var toolBar = new Ext.Toolbar({
		id : 'tbarInContMapPanel',
		hideBorders : true,
		items : [btnPan,
			btnZoomIn,
			btnZoomOut,
			btnInfo,
			'-',
			btnPrev,
			btnPost,
			btnZoomFullExtent,
			'-',
			btnDistanceMeasure,
			btnAreaMeasure,
			'-',
			splitBtnDef,
			syncBtnDef,
			{
				xtype : 'tbfill'
			},
			buttonFL]
	});

	var options2 = {
		sphericalMercator: true,
		projection: new OpenLayers.Projection("EPSG:900913"),
		units: "m",
		layers: [],
		controls: []
	};

	map2 = new OpenLayers.Map(options2);
	copyLayers(map1, map2);

	// Enable zoom by using mouse wheel 
	map2.addControl(new OpenLayers.Control.Navigation({
		zoomWheelEnabled : true
	}));
	var ctrlPan2 = new OpenLayers.Control.DragPan();
	map2.addControl(ctrlPan2);
	
	var ctrlZoomIn2 = new OpenLayers.Control.ZoomBox();
	map2.addControl(ctrlZoomIn2);
	
	var ctrlZoomOut2 = new OpenLayers.Control.ZoomBox({out: true});
	map2.addControl(ctrlZoomOut2);
	

	ctrlHist2 = new OpenLayers.Control.NavigationHistory({
		autoActivate : false
	});
	map2.addControl(ctrlHist2);
	
	// Measure controls for second map 
	map2.addControl(lineMeasure2);
	map2.addControl(polygonMeasure2);
	//create an extra WMSinfo window for the second map
	infoWin2 = new UAB.infotool.InfoWindow({
		templatesConfig: App.config.featureInfo,
		map: map2,
		title: 'Layer Information',
		width: 340,
		border: false,
		resizeable: false,
		layout: 'fit',
		closeAction: 'hide',
		bodyCssClass: 'winFeatInfoBody'
	});
	map2.addControl(infoWin2.getControl());
	infoWin1.getControl().events.on({
		'activate' : function() {
			infoWin2.getControl().activate();
		},
		'deactivate' : function() {
			infoWin2.getControl().deactivate();
		},
		scope : this
	});

	mapPanel2 = new GeoExt.MapPanel({
		id : "mappanel2",
		map : map2,
		hidden : true,
		layout : 'fit',
		flex : 1,
		layers : [],
		center : map1.getCenter(),
		zoom : map1.getZoom(),
		split : true,
		plugins : [], // important in order to add dyncamically  plugins once a panel is instantiated
		listeners : {
			'afterrender' : function(panel) {
				panel.el.on("mouseup", function() {
					setActiveMapPanel(mapPanel2);
				});
			}
		}
	});

	// Container: This panel stores two child mapPanels
	// It is rendered in the center region of the viewport
	contMapPanel = new Ext.Panel({
		id : 'idContenedorMapPanel',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		region : "center",
		tbar : toolBar,
		items : [mapPanel1, mapPanel2]
	});
	
	contMapPanel.addEvents('activemappanelchanged');
}; // end of initMapPanel() function
