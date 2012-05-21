/**
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

var map; 
var mapPanel;
<<<<<<< HEAD
var extent; 
//var comboGeo;

=======
var comboGeo;
>>>>>>> 899aec172d513fcb077889f0ef7be72bd7fdfdd5

/**
 *  TreePanel actions
 */
 
<<<<<<< HEAD
function initMapPanel() {	

	// if true a google layer is used, if false
	// the bluemarble WMS layer is used
	// var google = false;
	//var google = true; 

=======
function initMapPanel() {
>>>>>>> 899aec172d513fcb077889f0ef7be72bd7fdfdd5
	var options = {
		sphericalMercator: true,
		projection: new OpenLayers.Projection("EPSG:900913"),
		units: "m"
		, maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
		, maxResolution: 156543.0339
<<<<<<< HEAD
		, controls: []
=======
>>>>>>> 899aec172d513fcb077889f0ef7be72bd7fdfdd5
	};
	
	map = new OpenLayers.Map(options);

	// add layers to map 
	map.addLayers([
			new OpenLayers.Layer.OSM("OSM Base Map"),
			/*
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
			),*/
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
		//extent: extent,
		split: true, 
		plugins:[] // importante para a�adir din�micamente plugins una vez instanciado un panel
	});
<<<<<<< HEAD
	
	
=======
>>>>>>> 899aec172d513fcb077889f0ef7be72bd7fdfdd5
};
