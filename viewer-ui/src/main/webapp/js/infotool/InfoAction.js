Ext.namespace("UAB", "UAB.infotool");

/**
 * @class Uab.csw.CSWSearchField
 * @extends Ext.form.TriggerField
 * <p>Search field component prepared to query a CSW server, showing the results
 * in a window. Only CSW records containing WMS links on the online resource are
 * considered, and a button is provided the layers in the map.</p>
 */
UAB.infotool.InfoAction  = Ext.extend(GeoExt.Action, {
    /**
     * @cfg {String} templatesConfig A configuration object for templates
     * (defaults to <tt>null</tt>)
     */
	templatesConfig: null,
    /**
     * @cfg {OpenLayers.Map} map (Required) The map object this info action will be linked to.
     */
	map: null,
    /**
     * @cfg {String} tooltip Tooltip
     * (defaults to <tt>"Info by Point"</tt>)
     */
	tooltip: "Info by Point",
    /**
     * @cfg {String} tooltip iconCls
     * (defaults to <tt>'btnInfoByPoint'</tt>)
     */
	iconCls: "btnInfoByPoint",
	enableToggle: true, 
	toggleGroup: 'groupToggleButtons',
	activateOnEnable: true,
	deactivateOnDisable: true,
	constructor: function(config) {
		config.iconCls || (config.iconCls = this.iconCls);
		config.activateOnEnable || (config.activateOnEnable = this.activateOnEnable);
		config.deactivateOnDisable || (config.deactivateOnDisable = this.deactivateOnDisable);
		config.enableToggle || (config.enableToggle = this.enableToggle);
		config.toggleGroup || (config.toggleGroup = this.toggleGroup);
		this.map = config.map;
		this.templatesConfig = config.templatesConfig;
		UAB.infotool.InfoAction.superclass.constructor.call(this, config);
		this.buildUI();
	},
	buildUI: function() {
		// setting a custom WMSGetFeatureInfo as control for this action
		this.control = new OpenLayers.Control.WMSGetFeatureInfo({
			action: this,
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
							var lonlat = this.map.getLonLatFromPixel(e.xy);
							this.action.showResults(resultArray, e.object.url, e.object.layers, lonlat);
				},
				'beforegetfeatureinfo': function(e) {
					// Set the layer to query as the currently selected layer 
					var node = tree.getSelectionModel().getSelectedNode();
					if (node) {
						var selectedLayer = node.layer;
						e.object.layers = [selectedLayer];
						e.object.url = selectedLayer.url; 
					}
				}
			}
		});
		
		this.map.addControl(this.control);
		this.panelGFI = new Ext.Panel({
			autoHeight: true, // panel height is adjusted to contents
			html: '<p><i>WMSGetFeatureInfo results</i></p>',	
			layout:  'fit', 
			closable: true, 
			resizeable: false
		});
		
		this.windowGFI = new Ext.Window({
			title: 'Layer Information',
			width: 340,
			border: false,
			resizeable: false,
			layout: 'fit',
			closeAction: "hide", // to avoid problems when closing window!
			items: this.panelGFI
		}); 
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
		this.windowGFI.setTitle(resultArray.name);
		this.windowGFI.show();
		tmplt.overwrite(this.panelGFI.body, resultArray);
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
		var layers = mapPanel.map.layers;
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