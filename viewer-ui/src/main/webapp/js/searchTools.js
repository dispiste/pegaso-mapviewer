/**
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/*
 *  Initializes search tools: search for a location, load layer from catalog,
 *  featured layers, etc
 */
 
var comboGeo;
var geocoder;
var locationLayer; 

function initSearchTools() {
	
	// To make use of the Google Geocoding API, this URL path in the main file must be included: 
	// <script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>  
    geocoder = new google.maps.Geocoder();
    locationLayer = new OpenLayers.Layer.Vector("Location", {
        styleMap: new OpenLayers.Style({	
			// look at: http://dev.openlayers.org/docs/files/OpenLayers/Symbolizer/Point-js.html
            externalGraphic: "http://openlayers.org/api/img/marker.png", // to render points 
		  //  externalGraphic: "../img/marker.png", 
            graphicYOffset: -25, 
            graphicHeight: 25,
            graphicTitle: "${formatted_address}"
        })
    });

	//mapPanel.map.addLayer(locationLayer); 
	
	comboGeo = new GeoExt.form.GeocoderComboBox({
       map: mapPanel.map,
	  //id: 'caca',
       zoom: 8,
	   //width: 400,
       //renderTo: 'searchtool',
	   // vector layer is referred to one that contains marker showing our wished location 
	   layer: locationLayer,
       displayField: "formatted_address",
       store: new Ext.data.JsonStore({
                root: null,
                fields: [
                    "formatted_address",
                    {name: "lonlat", convert: function(v, rec) {
                        var latLng = rec.geometry.location;
                        return [latLng.lng(), latLng.lat()];
                    }},
                    {name: "bounds", convert: function(v, rec) {
                        var ne = rec.geometry.viewport.getNorthEast(),
                            sw = rec.geometry.viewport.getSouthWest();
                        return [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
                    }}
                ],
                proxy: new (Ext.extend(Ext.data.DataProxy, {
                    doRequest: function(action, rs, params, reader, callback, scope, options) {
                        // To restrict the search to a bounding box, change the
                        // 1st argument of the geocoder.geocode call below to
                        // something like
                        // {address: params.q, bounds: new google.maps.LatLngBounds(
                        //     new google.maps.LatLng(47, 15),
                        //     new google.maps.LatLng(49, 17)
                        // )}
                        geocoder.geocode({address: params.q}, function(results, status) {
                            var readerResult = reader.readRecords(results);
                            callback.call(scope, readerResult, options, !!readerResult);                        
                        });
                    }
                }))({api: {read: true}})
            })
    });

	var cswconfig = {
		map: mapPanel.map,
		queryUrl: "http://pegasosdi.uab.es/catalog/srv/en/csw"
	} 
	var loadLayers = new UAB.csw.CSWSearchField(cswconfig);
	// TODO: loadByProvider has not been implemented yet
	//var loadByProvider = new UAB.csw.CSWSearchField(cswconfig);
	
	var searchCatalog = new Ext.TabPanel({
	    id: 'searchPanel',
	    width: 400,
	    height: 60,
        autoTabs:true,
        activeTab:0,
        plain: true,
        layoutOnTabChange: true,
        //deferredRender:false,
        border:false,
        items: [{
        	title: "Search places",
        	items: comboGeo,
        	layout: 'fit',
        	xtype: 'panel'
        },
        {
        	title: "Load Layers",
        	xtype: 'panel', 
        	items: loadLayers,
        	layout: 'fit'
        }/*,
        {
        	title: "Load by provider",
        	items: loadByProvider,
        	layout: 'fit',
        	xtype: 'panel'
        }*/]
    });
	
	var northToolsPanel = new Ext.Container({
		renderTo: 'northTools',
		layout: 'hbox',
		items: [searchCatalog]
	});
}