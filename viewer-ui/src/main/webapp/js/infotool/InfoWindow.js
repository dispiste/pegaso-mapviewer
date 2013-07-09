Ext.namespace("UAB", "UAB.infotool");

/**
 * @class UAB.infotool.InfoWindow
 * @extends Ext.Window
 * <p>Window component prepared to display results of WMSGetFeatureInfo queries.</p>
 */
UAB.infotool.InfoWindow  = Ext.extend(Ext.Window, {
    /**
     * @cfg {String} templatesConfig A configuration object for templates
     * (defaults to <tt>null</tt>)
     */
	templatesConfig: null,
    /**
     * @cfg {OpenLayers.Map} The map this window is associated with
     * (required)
     */
	map: null,
	constructor: function(config) {
		config.items || (config.items=this.createPanel());
		this.map = config.map;
		this.control = this.createWMSControl();
		this.templatesConfig = config.templatesConfig;
		UAB.infotool.InfoWindow.superclass.constructor.call(this, config);
		this.addControlListeners();
	},
	//private
	createPanel: function() {
		this.panelGFI = new Ext.Panel({
			autoHeight: true, // panel height is adjusted to contents
			html: '<p><i>WMSGetFeatureInfo results</i></p>',	
			layout:  'fit', 
			closable: true, 
			resizeable: false,
			bodyCssClass: 'panelFeatInfoBody'
		});
		return this.panelGFI;
	},
    /**
     * {OpenLayers.Control} Gets the WMSGetFeatureInfo control this window is associated with
     */
	getControl: function() {
		return this.control;
	},
	//private
	createWMSControl: function() {
		// setting a custom WMSGetFeatureInfo as control for this action
		return new OpenLayers.Control.WMSGetFeatureInfo({
			action : this,
			url : 'http://pegasosdi.uab.es/ogc/wms?',
			title : 'Identify features by clicking',
			queryVisible : false,
			infoFormat : 'application/vnd.ogc.gml',
			maxFeatures : 3
		});
	},
	//private
	addControlListeners: function() {
		this.control.events.on({
		'getfeatureinfo' : function(e) {
			// It shows the server response to a
			// GetFeatureInfo WMS request
			// http://dev.openlayers.org/docs/files/OpenLayers/Control/WMSGetFeatureInfo-js.html#OpenLayers.Control.WMSGetFeatureInfo.events
			var msGMLOutput = e.text;
			// take a look at
			// http://dev.openlayers.org/docs/files/OpenLayers/Format/WMSGetFeatureInfo-js.html#OpenLayers.Format.WMSGetFeatureInfo.read
			var msParserFormat = new OpenLayers.Format.WMSGetFeatureInfo();
			// This is an array of ouput elements
			// corresponding to a click on the map
			var resultArray = msParserFormat.read(msGMLOutput);
			var lonlat = e.object.map.getLonLatFromPixel(e.xy);
			this.showResults(resultArray, e.object.url, e.object.layers, lonlat);
			this.setPositionNextTo(e.xy);
		},
		'beforegetfeatureinfo' : function(e) {
			this.hide();
			var tree;
			// Set the layer to query as the currently selected layer
			if(e.object.map == map1) {
				tree = tree1;
			} else {
				tree = tree2;
			}
			var node = tree.getSelectionModel().getSelectedNode();
			if(node) {
				var selectedLayer = node.layer;
				e.object.layers = [selectedLayer];
				e.object.url = selectedLayer.url;
			}
		},
		scope: this});
	},
	/**
	 * Shows the info results on an Ext.Window. Override this method in order to
	 * use a different output behaviour.
	 */
	showResults: function(resultArray, url, layers, lonlat) {
		var tmplt = null;
		if (layers==null) { // no selected layer
			tmplt = this.templatesConfig.templates.noSelected;
		}
		else if (resultArray.length ==0){
			tmplt=this.templatesConfig.templates.noResults;
		}
		else {
			var layerIDsonServer = this.getLayerIDsOnServer(layers);
			if (url && this.templatesConfig.servers[url]
				&& this.templatesConfig.servers[url][layerIDsonServer]) {
				tmplt = this.templatesConfig.servers[url][layerIDsonServer];
			}
			else {// no specific template exists: using generic templates
				if (this.checkRasterFields(resultArray)) {
					// use nicer, specific raster template
					tmplt = this.templatesConfig.templates.raster;
				}
				else { // using the simpler generic template
					tmplt = this.templatesConfig.templates.generic;
					// we need to transform the fields and values from an array of objects to a plain array
					resultArray = this.resultToArray(resultArray);
				}
			}
			resultArray.type = layerIDsonServer;
			resultArray.name = this.getLayerName(layerIDsonServer);
			resultArray.x = lonlat.lon;
			resultArray.y = lonlat.lat;
		}
		this.setTitle(resultArray.name);
		if (this.rendered) {
			this.show();
			tmplt.overwrite(this.panelGFI.body, resultArray);
			//this.syncSize();
			
		}
		else {
			this.show();
			tmplt.overwrite(this.panelGFI.body, resultArray);
		}
	},
	setPositionNextTo: function(screenxy) {
		// get map position as screenxy coordinates are relative to the map
		var mapLeft = Ext.get(this.control.map.div).getLeft();
		var mapTop = Ext.get(this.control.map.div).getTop();
		var mapHeight = Ext.get(this.control.map.div).getHeight();
		var browserWinSize = Ext.getBody().getViewSize();
		var left, top;
		if (mapLeft+screenxy.x + 20 + this.getWidth()> browserWinSize.width) {
			left = browserWinSize.width - this.getWidth();
		}
		else {
			left = mapLeft+screenxy.x + 20;
		}
		if (this.getHeight()> browserWinSize.height) {
			top = 0;
		}
		else if (mapTop + screenxy.y + this.getHeight()>mapHeight){
			top = mapTop + mapHeight - this.getHeight();
		}
		else {
			top = mapTop + screenxy.y;
		}
		this.setPosition(left, top);
	},
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
	resultToArray: function(resultArray) {
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
	},
	/**
	 * Assumes all the results correspond to a single queried layer
	 * 
	 * @param resultArray
	 * @returns
	 */
	getLayerIDsOnServer: function(layers) {
		if (layers.length > 0) {
			return layers[0].params.LAYERS;
		}
	},
	checkRasterFields: function(resultArray) {
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
	},
	getLayerName: function(layerIDsOnServer) {
		var layers = this.control.map.layers;
		for (var i=0; i<layers.length; i++){
			var layer = layers[i];
			if (layer.params && layer.params.LAYERS==layerIDsOnServer) {
				return layer.name;
			}
		}
		return null;
	},
	getTemplate: function(url, layerStr, templatesConfig) {
		if (templatesConfig.servers[url]
			&& templatesConfig.servers[url][layerStr]) {
			return templatesConfig.servers[url][layerStr];
		}
		else {
			return templatesConfig.templates.generic;
		}
	}
});

