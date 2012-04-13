/**
 * Copyright (c) 2008-2011 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/** api: example[mappanel-viewport]
 *  Map Panel (in a Viewport)
 *  -------------------------
 *  Render a map panel in a viewport.
 */

var mapPanel;

Ext.onReady(function() {

    // if true a google layer is used, if false
    // the bluemarble WMS layer is used
    var google = false;

    var options, layer;
    var extent = new OpenLayers.Bounds(-5, 35, 15, 55);
    var test = new OpenLayers.Bounds(3,2,2,2);
    
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

    } else {
        layer = new OpenLayers.Layer.WMS(
            "Global Imagery",
            "http://maps.opengeo.org/geowebcache/service/wms",
            {layers: "bluemarble"},
            {isBaseLayer: true}
        );
    }

    var map = new OpenLayers.Map(options);

    new Ext.Viewport({
        layout: "border",
        items: [{
            region: "north",
            contentEl: "northDiv",
            height: 100
        }, {
            region: "center",
            id: "mappanel",
            xtype: "gx_mappanel",
            map: map,
            layers: [layer],
            extent: extent,
            split: true
        }, {
            region: "west",
            contentEl: "westDiv",
            width: 200,
            split: true
        }]
    });

    var tabs = new Ext.TabPanel({
        renderTo: 'westTabPanel',
        width: 200,
        activeTab: 0,
        frame:true,
        defaults:{autoHeight: true},
        items:[
            {contentEl:'layerTreeTab', title: 'Layers'},
            {contentEl:'legendTab', title: 'Legend'}
        ]
    });

    mapPanel = Ext.getCmp("mappanel");
});
