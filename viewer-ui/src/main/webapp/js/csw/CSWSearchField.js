Ext.namespace("UAB", "UAB.csw");


/**
 * @class Uab.csw.CSWSearchField
 * @extends Ext.form.TriggerField
 * <p>Search field component prepared to query a CSW server, showing the results
 * in a window. Only CSW records containing WMS links on the online resource are
 * considered, and a button is provided the layers in the map.</p>
 */
UAB.csw.CSWSearchField  = Ext.extend(Ext.form.TriggerField, {
	constructor: function(config) {
		config = config || {};
		UAB.csw.CSWSearchField.superclass.constructor.call(this, config);
		this.map || console.log("The 'map' config parameter is required");
		// must be initialized at the constructor as we need the component id
		this.template = this.template || new Ext.XTemplate(
				'<div id="cswResultsPanel"><tpl for=".">',
				'<div class="cswRecord">',
				'<div class="cswResultTitle">{title}</div>',
				'<div class="cswResultSubject"><p>{abstract}</p></div>',
				'<div class="buttons cswButtons">',
				'<button type="button" class="regular" onclick="Ext.getCmp(\''+this.id+'\').loadLayer(\'{title}\',\'{wmsurl}\', \'{wmslayers}\');"><img src="img/drop-add.gif" alt="Pegaso Logo">Load this layer</button>',
				'</div><br></div>',
				'</tpl></div>',
				'<div class="x-clear"></div>'
		);
	},
	/**
	 * @cfg {OpenLayers.Map} map
	 * The map object in which layers will be loaded when requested by the user (Required).
	 */	
	map: null,
	/**
	 * @cfg {String} queryUrl
	 * The URL of the CSW server to query. Note that a local proxy is expected to be
	 * working and configured at localhost/cgi-bin/proxy.cgi, which should be able to forward queries
	 * to this queryUrl. (Optional. Default: "http://localhost:8080/catalog/srv/en/csw")
	 */
	queryUrl: "http://localhost:8080/catalog/srv/en/csw",
	/**
	 * @cfg {Ext.XTemplate} template
	 * An Ext.XTemplate object, which will be used to format the query results (Optional).
	 */
	template: null,
	fields: ['title', 'abstract', 'URI', 'wmsurl', 'wmslayers', 'identifier', 'source'],
    /**
     * Queries the configured CSW server and shows the results in a Window.
     *
     * @param searchString {string} The query will match any occurrence of this string on the CSW records.
     */
	cswSearch: function(searchString) {
		var query = this.getQueryObject(searchString);
		var resetScroll = function() {
			var dataView = Ext.getCmp('cswResultView');
			if (dataView && dataView.el) {
				dataView.el.dom.scrollTop = 0;
			}
		};
		
		if (this.resultWindow) {
			var dataView = this.resultWindow.items.items[0];
			var store = dataView.store;
			store.setBaseParam("Query", query);
			store.load();
			dataView.refresh();
			// LoadMask: to show the "Loading..." message while data is loading
			var myMask = new Ext.LoadMask('cswResultView', {msg:"Loading...", store: store});
			resetScroll();
			myMask.show();
			this.resultWindow.show(this);
			
		}
		else {
			var store = new Ext.data.Store({
				proxy: new GeoExt.data.ProtocolProxy({
					protocol: new OpenLayers.Protocol.CSW({
						url: this.queryUrl
					})
				}),
				reader: new UAB.csw.CustomCSWRecordsReader({
					format: new OpenLayers.Format.CSWGetRecords(),
					fields: this.fields,
					totalProperty: 'numberOfRecordsMatched'
				}),
				paramNames: {
					start: 'startPosition',
					limit: 'maxRecords'
				}
			});

			// this has to be provided as base params as the paging bar overrides the params passed on the load() method
			store.setBaseParam("resultType", "results");
			store.setBaseParam("Query", query);
			var pagingToolbar = new Ext.PagingToolbar({
				store: store,
				displayInfo: true,
				pageSize: 10,
				prependButtons: true,
				items: ['Total results']
			});
			
			store.load({callback: function() {
				console.log('store loaded');
			}});
			this.resultWindow = new Ext.Window({
				id: 'cswResultWindow',
				title: 'Search results',
				layout:'fit',
				width:600,
				height:400,
				closeAction:'hide',
				plain: true,
				bbar: pagingToolbar,
				items: new Ext.DataView({
					id: 'cswResultView',
					store: store,
					tpl: this.template,
					autoHeight:false,
					autoScroll: true,
					overClass:'x-view-over',
					//ctCls: 'cswResultsPanel',
					emptyText: 'No results'
				})
			});
			// necessary as paging does not reset scroll by default
			pagingToolbar.on("beforeChange", function(pagingToolbar){
				resetScroll();
			});

			this.resultWindow.show(this);
			// LoadMask: to show the "Loading..." message while data is loading
			var myMask = new Ext.LoadMask('cswResultView', {msg:"Loading...", store: store});
			myMask.show();
		}
	},
    /**
     * Loads a WMS layer in the configured map.
     *
     * @param name {string} The public name of the layer, which will be shown on the Layer Tree.
     * @param url {string}  The url of the WMS server
     * @param url {layers}  The internal name of the layer(s) on the WMS server
     */
	loadLayer: function(name, url, layers) {
		var wms = new OpenLayers.Layer.WMS(name,
				url,
				{
					layers: layers,
					transparent: true
				},
				{isBaseLayer: false}
		);
		this.map.addLayer(wms);
	},
	onTriggerClick: function(eventObject) {
		this.cswSearch(this.getValue());
	},
	getQueryObject:function(searchString) {
		if (searchString && searchString!= "") {
			searchString = "%"+searchString+"%";
		}
		else {
			searchString = "%";
		}
		var cswSearchStr = "AnyText like '"+searchString+"' And protocol like 'OGC:WMS%'";
		
		var query = {
			ElementSetName: {
				value: "full",
				typeNames: "csw:Record"
			},
			Constraint: {
				version: '1.1.0',
				CqlText: {
					value: cswSearchStr
				}
			}
		}
		return query;
	}

});