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
                "http://pegasosdi.uab.es/ogc/wms?",
                {layers: "NASA_BLUEMARBLE"},
                {isBaseLayer: true}
            );
    }

    var map = new OpenLayers.Map(options);
    var cardNav = function(compId){
    	var l = Ext.getCmp('west-tab-panel').getLayout();
    	l.setActiveItem(compId);
    };
    var extendMap = function(){
    	Ext.getCmp('west-tab-panel').collapse();
    };
    var tabPanel = {
    		id: "west-tab-panel",
    	    layout:'card',
    	    activeItem: 0,
    	    width: 200,
    	    region: 'west',
    	    bodyStyle: 'padding:15px',
    	    split: true,
    	    collipsible: true,
    	    collapseMode: 'mini',
    	    defaults: {border:false, plain:true},
    	    tbar: [{
    	        id: 'layersBtn',
    	        enableToggle: true,
    	        pressed: true,
    	        toggleGroup:'btns',
    	        text: 'Layers',
    	        handler: cardNav.createDelegate(this, ['layersTab'])
    	    },{
    	        id: 'legendBtn',
    	        text: 'Legend',
    	        enableToggle: true,
    	        toggleGroup:'btns',
    	        handler: cardNav.createDelegate(this, ['legendTab'])
    	    }, '->',{
    	        id: 'collapse',
    	        iconCls: 'p-collapse-button',
    	        handler: extendMap.createDelegate(this, [])
    	    }],
    	    items: [{
    	        id: "layersTab",
    	        html: "<p>Hi. I'm the layer tree panel.</p>"
    	    },{
    	        id: 'legendTab',
    	        html: "<p>Hi. I'm the legend panel.</p>"
    	    }]
    	};
    
    new Ext.Viewport({
        layout: "border",
        defaults: {border: false},
        items: [{
            region: "north",
            contentEl: "northDiv",
            height: 80
        }, {
            region: "center",
            id: "mappanel",
            xtype: "gx_mappanel",
            map: map,
            layers: [layer],
            extent: extent,
            split: true
        }, tabPanel
        ]
    });
    mapPanel = Ext.getCmp("mappanel");
});
