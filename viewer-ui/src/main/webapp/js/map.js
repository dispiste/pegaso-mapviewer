/**
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */


var map; 
var mapPanel;

/**
 *  TreePanel actions
 */
function initMapPanel() {

	// if true a google layer is used, if false
	// the bluemarble WMS layer is used
	var google = false;

	var options = {
		//projection: new OpenLayers.Projection("EPSG:900913"),
		units: "m",
		//allOverlays: true,
		//maxExtent: new OpenLayers.Bounds(-20037508, -20037508,
		//		20037508, 20037508.34)
	};
	var layer;
	var extent = new OpenLayers.Bounds(-5, 35, 15, 55);
	/*
	if (google) {
		options = {
			projection: new OpenLayers.Projection("EPSG:900913"),
			units: "m",
			numZoomLevels: 18,
			maxResolution: 156543.0339,
			maxExtent: new OpenLayers.Bounds(-20037508, -20037508,
											 20037508, 20037508.34)
		};

		layer = new OpenLayers.Layer.Google(
			"Google Satellite",
			{type: G_SATELLITE_MAP, sphericalMercator: true}
		);

		extent.transform(
			new OpenLayers.Projection("EPSG:4326"), options.projection
		);

	}*/

	map = new OpenLayers.Map(options);

	// add layers to map 
	map.addLayers([
			new OpenLayers.Layer.WMS("Global Imagery",
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
					buffer: 0
				}
			),
			new OpenLayers.Layer.WMS("Corine 2000 100m",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "CORINE_CLC00_100m",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0
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
					buffer: 0
				}
			),
			new OpenLayers.Layer.WMS("ESA Globcorine 2009",
				"http://pegasosdi.uab.es/ogc/wms?", {
					layers: "GLOBCORINE_2009",
					transparent: true,
					format: "image/png"
				}, {
					isBaseLayer: false,
					buffer: 0
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
		extent: extent,
		split: true
	});


};
