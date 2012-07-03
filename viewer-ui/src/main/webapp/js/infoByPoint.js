/**
 * Copyright (c) 2008-2011 The Open Source Geospatial Foundation
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

// set as global variable until a better way is defined to share it with toolbar
var btnInfoExt;

var configGetFeatureInfo = {};

configGetFeatureInfo.templates = {
	// ***********************************************			
	// TEMPLATES (only for some layers -> to be grown.
	// Control only by-default loaded layers
	// ***********************************************	
	clc: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">', 
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle"><span style="border: 1px solid black; background: rgb({red},{green},{blue})">&nbsp;&nbsp;&nbsp;</span> {class}</p>',
								'<p>Class code: {value_0}</p>',
								'<p>Coordinates: {[fm.number(values.x, "0.00")]} m, {[fm.number(values.y, "0.00")]} m</p>',
							'</div>',
						'</tpl>', 
					'</div>',
				'</tpl>',
				'<div class="infoByPointResultFooter">',
					'<p>Take a look at <a href="http://sia.eionet.europa.eu/CLC2000/classes" target="_blank">Corine classes</a> for more details!</p>',
				'</div>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	natura2000: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">',
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle">{SITENAME} </p>',
								'<p> Code: {SITECODE} </p>',
								'<p> Type: {SITETYPE} </p>',
								'<p> Relase: {RELEASE_DA} </p>',
								//'<p> Coordinates X-Y: {parent.parent.lonlat.lon}, {parent.parent.lonlat.lat} </p>',
							'</div>',
						'</tpl>',
					'</div>',
				'</tpl>',
				'<div class="infoByPointResultFooter">',
					'<p> Showing registers near: {[fm.number(values.x, "0.00")]} m, {[fm.number(values.y, "0.00")]} m</p>',
				'</div>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	countries: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">',
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle">{NAME_ENGL} </p>',
								'<p>Capital: {CAPT} </p>',
								'<p>Code: {CNTR_ID} </p>', 
								'<p>Iso code: {ISO3_CODE} </p>',
							'</div>',
						'</tpl>',
					'</div>',
				'</tpl>',
				'<div class="infoByPointResultFooter">',
					'<p> Showing registers near: {[fm.number(values.x, "0.00")]} m, {[fm.number(values.y, "0.00")]} m</p>',
				'</div>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	nuts: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">',
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle">{NAME_HTML} </p>',
								'<p>Code: {NUTS_ID} </p>',
								'<p>NUTS level: {STAT_LEVL_} </p>',
							'</div>',
						'</tpl>',
					'</div>',
				'</tpl>',
				'<div class="infoByPointResultFooter">',
					'<p> Showing registers near: {[fm.number(values.x, "0.00")]} m, {[fm.number(values.y, "0.00")]} m</p>',
				'</div>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	ecoregions: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">',
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle">{ecoregion} </p>',
								'<p>Place type: {placetype} </p>',
								'<p>Code: {eco_code} </p>',
								'<p>Coordinates (WGS84): Lat {[fm.number(values.lat, "0.0000")]} &#176;, Lon {[fm.number(values.long, "0.0000")]} &#176;</p>',
							'</div>',
						'</tpl>',
					'</div>',
				'</tpl>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	noSelected: new Ext.XTemplate(
		'<tpl>',
			'<div>',
				' There is no selected layer ',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	noResults: new Ext.XTemplate(
		'<tpl>',
			'<div style="width:300px, height: 100px;">',
				' NO RESULTS FOR SELECTED LAYER',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	generic: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointRegister infoByPointRegisterBg">',
						'<tpl for="data">',
							'<p>{.}</p>',
						'</tpl>',
					'</div>',
				'</tpl>',
				'<div class="infoByPointResultFooter">',
					'<p> Showing registers near: {[fm.number(values.x, "0.00")]} m, {[fm.number(values.y, "0.00")]} m</p>',
				'</div>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	raster: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">', 
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle"><span style="border: 1px solid black; background: rgb({red},{green},{blue})">&nbsp;&nbsp;&nbsp;</span> {class}</p>',
								'<p>Class code: {value_0}</p>',
								'<p>Coordinates: {[fm.number(values.x, "0.00")]} m, {[fm.number(values.y, "0.00")]} m</p>',
							'</div>',
						'</tpl>', 
					'</div>',
				'</tpl>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
};
configGetFeatureInfo.servers = {
		"http://pegasosdi.uab.es/ogc/wms?": {
			"CORINE_CLC90_100m": configGetFeatureInfo.templates.clc,
			"CORINE_CLC00_100m": configGetFeatureInfo.templates.clc,
			"CORINE_CLC06_100m": configGetFeatureInfo.templates.clc,
			"GLOBCORINE_2005": configGetFeatureInfo.templates.globcorine,
			"GLOBCORINE_2009": configGetFeatureInfo.templates.globcorine,
			"NATURA2000": configGetFeatureInfo.templates.natura2000,
			"CNTR_RG_03M_2010": configGetFeatureInfo.templates.countries,
			"NUTS_RG_03M_2010": configGetFeatureInfo.templates.nuts,
			"NUTS_RG_03M_2010_L0": configGetFeatureInfo.templates.nuts,
			"NUTS_RG_03M_2010_L1": configGetFeatureInfo.templates.nuts,
			"NUTS_RG_03M_2010_L2": configGetFeatureInfo.templates.nuts,
			"NUTS_RG_03M_2010_L3": configGetFeatureInfo.templates.nuts
		},
		"http://geo.vliz.be:80/geoserver/wms?SERVICE=WMS&": {
			"Ecoregions:ecoregions": configGetFeatureInfo.templates.ecoregions,
		}
}

// Proxy para OpenLayers. It seems to be necessary
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";

/**
 * Converts an array of objects on a plain array of strings.
 * The input array has the format:
 * <pre><code>
   [{id:register1, attributes{field1: value1, field2: value2, ..., fieldN: valueN}},
    {id:register2, attributes{field1: value1, field2: value2, ..., fieldN: value}},
    ...
    {id:registerN, attributes{field1: value1, field2: value2, ..., fieldN: value}}]
   </code></pre>
 * While the output array has the format:
 * <pre><code>
   [{data: [field1 + ':' + value1, field2 + ':' + value2, ..., fieldN + ':' + valueN]}, // this is register 1
    {data: [field1 + ':' + value1, field2 + ':' + value2, ..., fieldN + ':' + valueN]}, // this is register 2
    ...
    {data: [field1 + ':' + value1, field2 + ':' + value2, ..., fieldN + ':' + valueN]}] // this is register N
   </pre></code>
 * @param resultArray
 * @returns {Array}
 */
function resultToArray(resultArray) {
	var result = [];
	for (var i=0; i<resultArray.length; i++) {
		result[i] = {};
		result[i].data = [];
		for (var key in resultArray[i].attributes) {
			var text = "<b>"+ key + ":</b> " + resultArray[i].attributes[key];
			result[i].data.push(text);
		}
	}
	return result;
}

/**
 * Assumes all the results correspond to a single queried layer
 * 
 * @param resultArray
 * @returns
 */
function getLayerIDsOnServer(layers) {
	if (layers.length > 0) {
		return layers[0].params.LAYERS;
	}
}

function checkRasterFields(resultArray) {
	if (resultArray.length > 0
			&& resultArray[0].attributes
			&& resultArray[0].attributes.value_0
			&& resultArray[0].attributes['class']
			&& resultArray[0].attributes.red
			&& resultArray[0].attributes.green
			&& resultArray[0].attributes.blue
			&& resultArray[0].attributes.x
			&& resultArray[0].attributes.y) {
		 return true;
	}
	return false;
}

function getLayerName(layerIDsOnServer) {
	var layers = mapPanel.map.layers;
	for (var i=0; i<layers.length; i++){
		var layer = layers[i];
		if (layer.params && layer.params.LAYERS==layerIDsOnServer) {
			return layer.name;
		}
	}
	return null;
}

function getTemplate(url, layerStr, templatesConfig) {
	if (templatesConfig.servers[url]
		&& templatesConfig.servers[url][layerStr]) {
		return templatesConfig.servers[url][layerStr];
	}
	else {
		return templatesConfig.templates.generic;
	}
}

function initInfoByPoint() {

	var ctrlInfo = new OpenLayers.Control.WMSGetFeatureInfo({
			url: 'http://pegasosdi.uab.es/ogc/wms?',
			title: 'Identify features by clicking',
			queryVisible: false,
			infoFormat: 'application/vnd.ogc.gml', 
			maxFeatures: 3,
			eventListeners: {
				'getfeatureinfo': function(e) {
							// It shows the server response to a GetFeatureInfo WMS request
							// http://dev.openlayers.org/docs/files/OpenLayers/Control/WMSGetFeatureInfo-js.html#OpenLayers.Control.WMSGetFeatureInfo.events
							var msGMLOutput = e.text; 
							// take a look at http://dev.openlayers.org/docs/files/OpenLayers/Format/WMSGetFeatureInfo-js.html#OpenLayers.Format.WMSGetFeatureInfo.read 
							var msParserFormat = new OpenLayers.Format.WMSGetFeatureInfo();
							// This is an array of ouput elements corresponding to a click on the map 
							var resultArray = msParserFormat.read(msGMLOutput);
							var tmplt = null;
							if (e.object.layers==null) { // no selected layer
								tmplt = configGetFeatureInfo.templates.noSelected;
							}
							else if (resultArray.length ==0){
								tmplt=configGetFeatureInfo.templates.noResults;
							}
							else {
								var layerIDsonServer = getLayerIDsOnServer(e.object.layers);
								var url = e.object.url;
								if (url && configGetFeatureInfo.servers[url]
									&& configGetFeatureInfo.servers[url][layerIDsonServer]) {
									tmplt = configGetFeatureInfo.servers[url][layerIDsonServer];
								}
								else {// no specific template exists: using generic templates
									if (checkRasterFields(resultArray)) {
										// use nicer, specific raster template
										tmplt = configGetFeatureInfo.templates.raster;
									}
									else { // using the simpler generic template
										tmplt = configGetFeatureInfo.templates.generic;
										// we need to transform the fields and values from an array of objects to a plain array
										resultArray = resultToArray(resultArray);
									}
								}
								resultArray.type = layerIDsonServer;
								resultArray.name = getLayerName(layerIDsonServer);
								var lonlat = map.getLonLatFromPixel(e.xy);
								resultArray.x = lonlat.lon;
								resultArray.y = lonlat.lat;
							}
							window_GFI.setTitle(resultArray.name);
							window_GFI.show();
							tmplt.overwrite(Ext.getCmp('getFeatureInfoPanel').body, resultArray);
				},
				'beforegetfeatureinfo': function(e) {
					// Set the layer to query as the currently selected layer 
					var node = tree.getSelectionModel().getSelectedNode();
					if (node) {
						var selectedLayer = node.layer;
						e.object.layers = [selectedLayer];
						e.object.url = selectedLayer.url;
						return true;; 
					}
					return true;
				}
			}
	});
	btnInfoExt = new GeoExt.Action({
		control: ctrlInfo,
		map: map,
		bodyStyle:'padding: 10px',
		tooltip: "Info by Point",
		iconCls: "btnInfoByPoint",
		enableToggle: true, 
		toggleGroup: 'groupToggleButtons',
		activateOnEnable: true,
		deactivateOnDisable: true
	});
	map.addControl(ctrlInfo);
	
	var panel_GFI = new Ext.Panel({
		id: 'getFeatureInfoPanel',
		autoHeight: true, // panel height is adjusted to contents
		html: '<p><i>WMSGetFeatureInfo results</i></p>',	
		layout:  'fit', 
		closable: true, 
		resizeable: false
	});
	
	window_GFI = new Ext.Window({
		title: 'Layer Information',
		id: 'getFeatureInfoWindow',
		width: 340,
		border: false,
		resizeable: false,
		layout: 'fit',
		closeAction: "hide", // to avoid problems when closing window!
		items: panel_GFI
	}); 
}  // end initInfoByPoint
