/**
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/*
 * Initializes measure tools: distance and areas by using corresponding handlers
 * (Path and Polygon) When distance-button belonging to the toolbar is
 * activated, click into map, begin to draw line by moving mouse and finish
 * sketched with double click. Click events draws vertices in the created
 * LineString geometry When area-button belonging to the toolbar is activated,
 * click into map, begin to draw line by moving mouse and finish sketched with
 * another click Click events draws vertices in the created MultiPolygon
 * geometry Pop-up gives information about distances and areas
 */

var lineMeasure, polygonMeasure; 
var lineMeasure2, polygonMeasure2; 


function initMeasureTools() {

	// Projections to transform Geometry points
	var proj3035 = new OpenLayers.Projection('EPSG:3035');
	var proj900913 = new OpenLayers.Projection('EPSG:900913');

	// DISTANCES
	var handleDistanceMeasurements = function(event){
		var units = event.units;
		var measure = event.measure;
		var vertex = event.geometry.getVertices();
		var vertex3035 = [];
		for (var i=0; i< vertex.length ; i++){
			var vertPart = vertex[i].transform(proj900913, proj3035);
			vertex3035.push(vertPart);
		}
		var linestring3035 = new OpenLayers.Geometry.LineString(vertex3035); 
		var measure3035 = linestring3035.getLength(); // string

		var out = "";
		if (units == 'm') {
			out = "Line length: " + measure3035.toFixed(2) + " " + units;
		}
		else { //km
			// convert to km as getLength returns values in meters for EPSG:3035
			var measure3035KM = measure3035*0.001;
			out = "Line length: " + measure3035KM.toFixed(4) + " " + units;
		}
		renderMeasureResult(out);
	};

	// AREAS
	var handleAreaMeasurements = function(event){
		var units = event.units;
		var measure = event.measure;
		var geometry = event.geometry; 

		var linearRg = event.geometry.components; // array
		var verticestmp = linearRg[0].components;
		var pts3035 = [];
		for (var i=0; i< verticestmp.length ; i++){
			var vertices = verticestmp[i].clone();
			var vertPart = vertices.transform(proj900913, proj3035);
			pts3035.push(vertPart);
		}
		var linearRing3035 = new OpenLayers.Geometry.LinearRing(pts3035);
		var polygon3035 = new OpenLayers.Geometry.Polygon(linearRing3035);
		var area3035 = this.getArea(polygon3035);

		var out = "";
		if (units == 'm') {
			out = "Area: " + area3035.toFixed(2) + " " + units + "<sup>2</sup>";
		}
		else {
			var area3035KM = area3035*0.000001;
			out = "Area: " + area3035KM.toFixed(4) + " " + units + "<sup>2</sup>";
		}
		renderMeasureResult(out);
	};

	var renderMeasureResult = function(resultHTML){
		window.measurePopup = new Ext.Window({
			id: 'renderMeasureResultWindow',
			title: 'Measure Tool',
			html: resultHTML,
			width: 250,
			plain: true
		});
		window.measurePopup.show();
	}; 

	var clearMeasureResult = function(){
		if (window.measurePopup && window.measurePopup.destroy) {
			window.measurePopup.destroy();
		}
	};
	
	function getMeasureOptions() {
		var measureOptions = {
			handlerOptions : {
				style : "default",
				layerOptions : {
					styleMap : new OpenLayers.StyleMap({
						'default' : new OpenLayers.Style({
							fillColor : '#646464',
							fillOpacity : 0.4,
							strokeColor : '#e00000',
							strokeOpacity : 0.7,
							strokeWidth : 3,
							strokeLinecap : 'square',
							strokeDashstyle : 'dashdot'
						})
					})
				},
				persist : true,
				// disable streaming Mode with SHIFT
				freehandToggle : null
			},
			geodesic : true
		};
		return measureOptions;
	}

	// OpenLayers Controls for map and map2, and attached with addControl
	// methods in the map.js file !!
	lineMeasure = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, getMeasureOptions());
	polygonMeasure = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, getMeasureOptions());
	lineMeasure2 = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, getMeasureOptions());
	polygonMeasure2 = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, getMeasureOptions());

	// Register events on respective controls
	lineMeasure.events.on({
		"measure": handleDistanceMeasurements,
		"measurepartial": clearMeasureResult,
		"activate": clearMeasureResult,
		"deactivate": clearMeasureResult
	});

	polygonMeasure.events.on({
		"measure": handleAreaMeasurements,
		"measurepartial": clearMeasureResult,
		"activate": clearMeasureResult,
		"deactivate": clearMeasureResult
	});

	// Register events on respective controls
	lineMeasure2.events.on({
		"measure": handleDistanceMeasurements,
		"measurepartial": clearMeasureResult,
		"activate": clearMeasureResult,
		"deactivate": clearMeasureResult
	});

	polygonMeasure2.events.on({
		"measure": handleAreaMeasurements,
		"measurepartial": clearMeasureResult,
		"activate": clearMeasureResult,
		"deactivate": clearMeasureResult
	});

} // end initMeasureTools
