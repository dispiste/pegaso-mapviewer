/**
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

var map; 
var mapPanel;
var activeLayers; // activated layers controled from treePanel visibility
 

function initMapPanel() {
	
	var options = {
		sphericalMercator: true,
		projection: new OpenLayers.Projection("EPSG:900913"),
		units: "m",
		layers: App.config.layers,
		controls: []
	};
	
	map = new OpenLayers.Map(options);
	//map.addControl(new OpenLayers.Control.LayerSwitcher());
	
	// to show messages if tooltip is used in GeoExt.Action buttons
	Ext.QuickTips.init();
	var btnPrintServer = new GeoExt.Action({
									enableToggle: false,
									bodyStyle:'padding: 10px',
									tooltip: "Print to PDF",
									iconCls: "btnPrintServerPDF"
	}); 
	
	
	var btnPrintClient = new GeoExt.Action({
									enableToggle: false,
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
							tooltip: "Zoom In",
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
							tooltip: "Zoom Out",
							iconCls: "botonZoomOut", 
							toggleGroup: 'groupToggleButtons',
							activateOnEnable: true, 
							deactivateOnDisable: true
	});


	var btnZoomFullExtent = new GeoExt.Action({
		map : map,
		enableToggle : false,
		layout : 'form',
		tooltip : "Full Extent",
		iconCls : "botonFullExtent",
		handler : function() {
			// http://dev.openlayers.org/releases/OpenLayers-2.11/examples/setextent.html
			//var bounds = new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281);
			//map.zoomToExtent(bounds);
			//map.zoomToMaxExtent();
			var lonlat = new OpenLayers.LonLat(2102825.1807922, 4661687.4971957);
			map.setCenter(lonlat, 4);
		}
	});

	
	var btnInfo = new UAB.infotool.InfoAction({
		map: map,
		toggleGroup: 'groupToggleButtons',
		templatesConfig: App.config.featureInfo
	});

		// set a permalink provider
    var permalinkProvider = new GeoExt.state.PermalinkProvider({encodeType: false});
    Ext.state.Manager.setProvider(permalinkProvider);
	var windowPermalink = new Ext.Window({
		title : 'URL Permalink',
		id : 'permalinkWindow',
		width : 500,
		autoHeight : true,
		border : false,
		layout : 'fit',
		closeAction : "hide" // to avoid problems when closing window!
	});

	var btnPermalink = new GeoExt.Action({
		tooltip: "Link Map", 
		iconCls: "botonPermalink",
		handler: function(btn, event) {
			link = permalinkProvider.getLink();
			var window = Ext.getCmp("permalinkWindow");
			window.show();
			window.body.update("<a href=" + link + ">" + link + "</a>");
		}
	});
	
	//////////////////////////
	// OVERVIEW MAP CONTROL //
	//////////////////////////
			
	var optionsOverviewMap = {
		id: 'overvMap',
		minRatio: 16, 
		maxRatio: 64, 
		maximized: false,
		mapOptions: {
			// See the effect by searching a location in search tab and take a look at red box in the overviewmap
			 numZoomLevels: 3
		}
	};

	map.addControl(new OpenLayers.Control.OverviewMap(optionsOverviewMap));

	
	//////////////////////////
	// SCALE BAR            // TAKE A LOOK AT: http://dev.openlayers.org/addins/scalebar/trunk/examples/scalebar.html
	////////////////////////// http://trac.osgeo.org/openlayers/attachment/ticket/24/scalebar.patch
	
	//var scaleLinea = new OpenLayers.Control.ScaleLine();
	
	var scaleBar = new OpenLayers.Control.ScaleBar({
								abbreviateLabel: true, // kilometers to KM
								minWidth: 100, // default is 100 pixels
								maxWidth: 300 // default is 200 pixels); 
	}); 
	
	//map.addControl(scaleLinea); 
	map.addControl(scaleBar); 
	
	var panPanelCtrl = new OpenLayers.Control.PanPanel();
	var zoomPanelCtrl = new OpenLayers.Control.PanZoom();
	
	map.addControls([panPanelCtrl,zoomPanelCtrl]);


	var botonFL = new Ext.Button({
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
	
	mapPanel = new GeoExt.MapPanel({
		region: "center",
		id: "mappanel",
		map: map,
		layers: [],
		center: new OpenLayers.LonLat(18.89,38.58).transform(new OpenLayers.Projection('EPSG:4326'),new OpenLayers.Projection('EPSG:900913')),
		zoom: 4,
		stateId: "map", // to control the state of the Map so as to make permalinks properly
		prettyStateKeys: true,
		split: true,
		tbar: [
			btnPan,
			btnZoomIn, 
			btnZoomOut,
			btnInfo,
			'-',
			btnPrev,
			btnPost,
			btnZoomFullExtent, 
			btnPrintClient ,
			'->',
			//btnPermalink,
			botonFL
		],
		plugins:[] // important in order to add dyncamically  plugins once a panel is instantiated
	});

}; // end of initMapPanel() function

	
function returnActiveLayersWithClone() {
						var activ = []; 
						for (layername in map.layers) {
									// if the layer isn't visible at this range, or is turned off, skip it
									var layer = map.layers[layername];
											if (layer.visibility) {
													//console.log(layer);
													var layercl = layer.clone();
													var layerDiv_cl = layer.div.cloneNode(true);
													layercl.div = layerDiv_cl;
													activ.push(layercl); 
											}
											
							}	
						return activ;
};

// by executing returnActiveLayersII method, we obtain an array of activated layers called activeLayers; 

function returnActiveLayersII() {
		// register changelayer event, in which some property of the layers is changed: visibility, name, order, opacity
		map.events.register('changelayer', null, function(evt){
					if(evt.property === "visibility") {
								//alert(evt.layer.name + " layer visibility changed to " + evt.layer.visibility );
								activeLayers = returnActiveLayersWithClone();
					}
		});
		
};

