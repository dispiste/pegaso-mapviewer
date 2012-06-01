/**
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

var map_print; 
var activeLayersForPrint; 
//var activelayersDiv; 
//var mapPanel_print;



// PROBLEMAS AL CLONAR CAPAS DE GOOGLE 
// http://trac.osgeo.org/openlayers/attachment/ticket/2473/2473.patch

 
function returnActiveLayersFromOpener() {
	
						var activ = []; 
						
						for (layername in opener.map.layers) {
									// if the layer isn't visible at this range, or is turned off, skip it
									var layer = opener.map.layers[layername];
											if (layer.visibility) {
													// clone() in order to have cloned layers and be passed to a opened window
													// if not, visible layer in Pegaso viewer could be dissapeared !!
													var layerc = layer.clone();
													//console.log(layer);
													activ.push(layerc); 
													//activ.push(layer);
											}
						}
							
						return activ;
};



activeLayersForPrint = returnActiveLayersFromOpener();
	



function addingLayerToPrintMap(mapVar,arrayLayers){

								var mapVar; 
								var arrayLayers; 
								
								/*
								for(i=1;arrayLayers.length-1;i++){
									arrayLayers[i].destroy();
								}
								// mapVar is the map variable to print
								// layerVars consist of 1 baselayers + some overlaylayers
								///////////////////////////////////////////////////////////////////////////////////
								// PROBLEMAS --> LAS CAPAS NO TIENEN REFERENCIA AL MAPA DEL QUE PROCEDEN
								// SOLUCION --> usar opener.activelayerssss
								///////////////////////////////////////////////////////////////////////////////////
								
								for (i=0;i<=layerVars.length-1;i++) {
											mapVar.addLayers(
											[
											new OpenLayers.Layer.Google(layerVars[0].name,
																			{
																			type: 'google.maps.MapTypeId.'+layerVars[0].type.toUpperCase(),
																			maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
																			}
											),
											new OpenLayers.Layer.WMS('layer_'+i,
																	"http://pegasosdi.uab.es/ogc/wms?", {
																		layers: layerVars[i].name,
																		transparent: true,
																		format: "image/gif"
																	}, {
																		isBaseLayer: false,
																		buffer: 0,
																		visibility: false
																	}
                                            )						
											]
											)
								}
								*/
								
								if(arrayLayers[0].name=="Google Satellite") {
									
									mapVar.addLayers(
											[
											new OpenLayers.Layer.Google("Google Satellite",
														{type: google.maps.MapTypeId.SATELLITE, 
														maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
														}
											),
											arrayLayers[1],
											arrayLayers[2]	
											]
											)
								} 
								
								if(arrayLayers[0].name=="Google Streets") {
									//alert('streets');
									mapVar.addLayers(
											[
											new OpenLayers.Layer.Google("Google Streets",
														{
														//maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
														}
											),
											arrayLayers[1],
											arrayLayers[2]	
											]
											)
								}
											
};



function initMapPanel_print() {


	var options = {
		sphericalMercator: true,
		projection: new OpenLayers.Projection("EPSG:900913"),
		units: "m", 
		maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281),
		maxResolution: 156543.0339, 
		controls: []
	};
	
	
	map_print = new OpenLayers.Map(options);
	
	
	///////////////////////////////////////////////////////////////////////////////////
			// PROBLEMAS --> LAS CAPAS NO TIENEN REFERENCIA AL MAPA DEL QUE PROCEDEN
			// SOLUCION --> usar opener.activelayerssss
	///////////////////////////////////////////////////////////////////////////////////
	
	
	//delete activeLayersForPrint[0];
	//activeLayersForPrint.unshift(opener.activelayerssss[0]);
	
	map_print.addLayers(activeLayersForPrint);
	
	
	
	
	
	
	
	
	
	
	/*
	function addingLayerToPrintMap(mapVar,arrayLayers){

								var mapVar; 
								var arrayLayers; 
								
								if(arrayLayers[0].name=="Google Satellite") {
									
									mapVar.addLayers(
											[
											new OpenLayers.Layer.Google("Google Satellite",
														{type: google.maps.MapTypeId.SATELLITE, 
														maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
														}
											),
											arrayLayers[1],
											arrayLayers[2]	
											]
											)
								} 
								
								if(arrayLayers[0].name=="Google Streets") {
									//alert('streets');
									mapVar.addLayers(
											[
											new OpenLayers.Layer.Google("Google Streets",
														{
														//maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
														}
											),
											arrayLayers[1],
											arrayLayers[2]	
											]
											)
								}
											
	};
	*/
		
	//addingLayerToPrintMap(map_print,opener.activelayerssss);
	
	
	
	/*
	function addingLayerToPrintMap() {

															
								if(opener.activelayerssss[0].name=="Google Satellite") {
									
									map_print.addLayers(
											[
											new OpenLayers.Layer.Google("Google Satellite",
														{type: google.maps.MapTypeId.SATELLITE, 
														maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
														}
											),
											opener.activelayerssss[1],
											opener.activelayerssss[2]	
											]
											)
								} 
								
								if(opener.activelayerssss[0].name=="Google Streets") {
									//alert('streets');
									map_print.addLayers(
											[
											new OpenLayers.Layer.Google("Google Streets",
														{
														//maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
														}
											),
											opener.activelayerssss[1],
											opener.activelayerssss[2]	
											]
											)
								}
											
	};
	
	
	
	addingLayerToPrintMap();
	
	*/
	
	
	//this.window.addEventListener('onclose', saludo, false); 
	
	
	
	/*
	var clonito = opener.map.layers[4].clone();
	map_print.addLayers(clonito);
	*/
	
	
	
	
	//map_print.addLayers(activelayersDiv);
	 
	//map_print.addLayers(opener.activelayerssss);
	
	
	
	
	
	//map_print.addLayers(opener.activelayerssss);	
	
	//map_print.addLayers(opener.activelayerssssWithout);
	
	
	/*
	map_print.addLayers(
						[
						new OpenLayers.Layer.Google("Google Satellite",
										{type: google.maps.MapTypeId.SATELLITE 
										//, numZoomLevels: 12
										, maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
										}
						)
						,new OpenLayers.Layer.WMS("Corine 1990 100m",
										"http://pegasosdi.uab.es/ogc/wms?", {
													layers: "CORINE_CLC90_100m",
													transparent: true,
													format: "image/gif"
												}, {
													isBaseLayer: false,
													buffer: 0
												}
						)
						]
						);
	*/

	
	/*
	function returnActivaLayers() {
	
						var activ = []; 
						
						for (layername in opener.map.layers) {
									// if the layer isn't visible at this range, or is turned off, skip it
									var layer = opener.map.layers[layername];
											if (layer.visibility) {
													//console.log(layer);
													activ.push(layer); 
											}
							}
							
						return activ;
		}
	
	
	activeLayersForPrint = returnActivaLayers(); 	 		

	
	map_print.addLayers(activeLayersForPrint); 
	
	
     
	*/

	
	
	/*
	// add layers to map_print 
	map_print.addLayers([
	
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
	*/
	
	
	
	
	
	
	//console.log(avtivelayers);	
	
	
	/*	
		
	mapPanel_print = new GeoExt.MapPanel({
							region: "center",
							id: "mappanel",
							map: map_print,
							layers: [],
							center: new OpenLayers.LonLat(18.89,38.58).transform(new OpenLayers.Projection('EPSG:4326'),new OpenLayers.Projection('EPSG:900913')),
							zoom: 4,
							split: true, 
							plugins:[] // importante para añadir dinámicamente plugins una vez instanciado un panel
						});
						
	*/
	
	
};
