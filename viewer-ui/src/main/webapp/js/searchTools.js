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
 
var mapPanel;  
var comboGeo; 
var geocoder; 

function initSearchTools() {
	
	// para utilizar la API Geocoding de Google, hay que incluir la ruta 
	// <script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>  
	// en el fichero principal
    geocoder = new google.maps.Geocoder();
    var locationLayer = new OpenLayers.Layer.Vector("Location", {
        styleMap: new OpenLayers.Style({	
			// look at: http://dev.openlayers.org/docs/files/OpenLayers/Symbolizer/Point-js.html
            externalGraphic: "http://openlayers.org/api/img/marker.png", // to render points 
            graphicYOffset: -25, 
            graphicHeight: 25,
            graphicTitle: "${formatted_address}"
        })
    });

	comboGeo = new GeoExt.form.GeocoderComboBox({
       map: mapPanel.map,
	  //id: 'caca',
       zoom: 8,
	   width: 400,
       renderTo: 'searchtool',
	   // vector layer is referred to one that contains marker to show wished location 
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
	
	
	mapPanel.map.addControl(new OpenLayers.Control.LayerSwitcher()); 
	
	
	/*
	
    mapPanel = new GeoExt.MapPanel({
        renderTo: "mappanelito",
        height: 400,
        width: 500,
        layers: [
            new OpenLayers.Layer.Google("Google", {numZoomLevels: 20}),
            locationLayer
        ],
        zoom: 1, 
        tbar: [{
			id: 'caca', 
            xtype: "gx_geocodercombo", // instanciamos un combo geocoder de GeoExt que nos permite usar la API  de Geocoding de Google !!!!
            width: 250,
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
        }]
    });
	
	*/	
}