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
 

/**
 *  TreePanel actions
 */
 

function initMapPanel() {

	
	
	Ext.onReady(function(){
	
	
	
	// set a permalink provider
    var permalinkProvider = new GeoExt.state.PermalinkProvider({encodeType: false});
    Ext.state.Manager.setProvider(permalinkProvider);
	
	
	var windowPermalink = new Ext.Window({
											title: 'URL Permalink',
											id: 'ventana',
											width: 500,
											autoHeight: true, 
											border: false,
											layout: 'fit',
											closeAction: "hide" // to avoid problems when closing windod!
											//,items: Ext.getCmp('ventanita_id')
				}); 
				
	//windowPermalink.show();
	
	
	
	
	 
	
	var options = {
		sphericalMercator: true,
		projection: new OpenLayers.Projection("EPSG:900913"),
		units: "m", 
		maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281),
		maxResolution: 156543.0339, 
		// controls: []
		controls: [new OpenLayers.Control.Permalink()]
	};
	
	map = new OpenLayers.Map(options);

	/*
	var permalink = new OpenLayers.Control.Permalink();
	map.addControl(permalink);
	*/
	
	// add layers to map 
	map.addLayers([
			new OpenLayers.Layer.Google("Google Satellite",
						{type: google.maps.MapTypeId.SATELLITE 
						//, numZoomLevels: 12
						, maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
						}
			),	
			new OpenLayers.Layer.Google("Google Streets",
						{
						//, numZoomLevels: 12
						 maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
						}
			),
			new OpenLayers.Layer.OSM("OpenStreetMap"),
			new OpenLayers.Layer.WMS("NASA Global Imagery",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "NASA_BLUEMARBLE"
				}, {
					isBaseLayer: true
				}
			),
			new OpenLayers.Layer.WMS("Corine 2006 100m",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "CORINE_CLC06_100m",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0
				}
			),
			new OpenLayers.Layer.WMS("ESA Globcorine 2005",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "GLOBCORINE_2005",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0,
					visibility: false
				}
			),
			new OpenLayers.Layer.WMS("ESA Globcorine 2009",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "GLOBCORINE_2009",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0,
					visibility: false
				}
			),
			new OpenLayers.Layer.WMS("Natura 2000",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "NATURA2000",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0, 
					visibility: false
				}
			),  
			new OpenLayers.Layer.WMS("USGS Elevation model GTopo30",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "EDM_USGS_W020N40,EDM_USGS_E020N40,EDM_USGS_W020N90,EDM_USGS_E020N90",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0,
					visibility: false
				}
			),
			/*
			new OpenLayers.Layer.WMS("Grid 1km ETRS89 LAEA",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "Mediterranean_and_Black_Seas",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0,
					visibility: false
				}
			),*/
			new OpenLayers.Layer.WMS("Country Boundaries 2006",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "CNTR_BN_03M_2006",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0
				}
			),
			new OpenLayers.Layer.WMS("Country Boundaries 2010",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "CNTR_RG_03M_2010",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0,
					visibility: false
				}
			)
			/*
			,
			new OpenLayers.Layer.WMS("Administrative Units 2010 Level 0",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "NUTS_RG_03M_2010_L0",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0
				}
			),*/
			/*
			new OpenLayers.Layer.WMS("Administrative Units 2010 Level 1",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "NUTS_RG_03M_2010_L1",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0
				}
			),
			new OpenLayers.Layer.WMS("Administrative Units 2010 Level 2",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "NUTS_RG_03M_2010_L2",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0
				}
			),
			
			new OpenLayers.Layer.WMS("Administrative Units 2010 Level3",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "NUTS_RG_03M_2010_L3",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0
				}
			)*/
			
	]); 
	
	
	// We defined an anonymous function that register 'removelayer' event for map 
	// By being executed it returns the deleted layer 
	(function(){
		map.events.register('removelayer', map, function(lay){ 
									var deletedLayerName = lay.layer.name; 
			 });
	})();
	
	
	var onStatechange = function(provider){
						if(windowPermalink.rendered == true){
								link = provider.getLink();
								Ext.getCmp("ventana").body.update("<a href=" + link + ">" + link + "</a>");
								//Ext.get("permalinkPanel").doLayout();
						}
				};
				
	permalinkProvider.on({statechange: onStatechange});
	
	
	
	
		
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
		plugins:[] // important in order to add dyncamically  plugins once a panel is instantiated
	});

	/*
	var permalink = new OpenLayers.Control.Permalink();
	map.addControl(permalink);
	*/
	
	/*
	// check that there is not a center and alert me!!
	if (!map.getCenter()){
		alert("di hola, que me voy");
	}
	*/
	
 }); // end of Ext.onReady
 
}; // end of initMapPanel() function

	
function returnActiveLayersWithClone() {
						var activ = []; 
						for (layername in map.layers) {
									// if the layer isn't visible at this range, or is turned off, skip it
									var layer = map.layers[layername];
											if (layer.visibility) {
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

