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

	var options = {
		sphericalMercator: true,
		projection: new OpenLayers.Projection("EPSG:900913"),
		units: "m", 
		maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281),
		maxResolution: 156543.0339, 
		controls: []
	};
	
	map = new OpenLayers.Map(options);

	// add layers to map 
	map.addLayers([
			//new OpenLayers.Layer.OSM("OSM Base Map"),
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
			new OpenLayers.Layer.WMS("NASA Global Imagery",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "NASA_BLUEMARBLE"
				}, {
					isBaseLayer: true
				}
			),
			new OpenLayers.Layer.WMS("Corine 1990 100m",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "CORINE_CLC90_100m",
					transparent: true,
					format: "image/gif"
				}, {
					isBaseLayer: false,
					buffer: 0,
					visibility: false
				}
			),
			new OpenLayers.Layer.WMS("Corine 2000 100m",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "CORINE_CLC00_100m",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0,
					visibility: false
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
			new OpenLayers.Layer.WMS("Country Boundaries",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "CNTR_BN_03M_2006",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0
				}
			)
			
	]); 

	
	
		
		
	mapPanel = new GeoExt.MapPanel({
		region: "center",
		id: "mappanel",
		map: map,
		layers: [],
		center: new OpenLayers.LonLat(18.89,38.58).transform(new OpenLayers.Projection('EPSG:4326'),new OpenLayers.Projection('EPSG:900913')),
		zoom: 4,
		split: true, 
		plugins:[] // important in order to add dyncamically  plugins once a panel is instantiated
	});
	
	
};



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

