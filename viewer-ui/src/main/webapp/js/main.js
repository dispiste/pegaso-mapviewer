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

var map; 
var mapPanel;
var tree; 

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
	
	
    map = new OpenLayers.Map(options);
	
	//
	// add layers to map 
	map.addLayers([
			new OpenLayers.Layer.WMS("Corine 90 100m",
                "http://pegasosdi.uab.es/cgi-bin/mapserv?", {
                    layers: "CORINE_CLC90_100m",
                    transparent: true,
                    format: "image/gif"
                }, {
                    isBaseLayer: false,
                    buffer: 0
                }
            ),
            new OpenLayers.Layer.WMS("Corine 2000 100m",
                "http://pegasosdi.uab.es/cgi-bin/mapserv?", {
                    layers: "CORINE_CLC00_100m",
                    transparent: true,
                    format: "image/gif"
                }, {
                    isBaseLayer: false,
                    buffer: 0
                }
            ),
            new OpenLayers.Layer.WMS("Corine 2006 100m",
                "http://pegasosdi.uab.es/cgi-bin/mapserv?", {
                    layers: "CORINE_CLC06_100m",
                    transparent: true,
                    format: "image/gif"
                }, {
                    isBaseLayer: false,
                    buffer: 0
                }
            ),
			new OpenLayers.Layer.WMS("Country Boundaries",
                "http://pegasosdi.uab.es/cgi-bin/mapserv?", {
                    layers: "CNTR_BN_03M_2006",
                    transparent: true,
                    format: "image/gif"
                }, {
                    isBaseLayer: false,
                    buffer: 0
                }
            )
	]); 
	
    var cardNav = function(compId){
    	var l = Ext.getCmp('west-tab-panel').getLayout();
    	l.setActiveItem(compId);
    };
    var extendMap = function(){
    	Ext.getCmp('west-tab-panel').collapse();
    };
	
	var LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());
	var treeConfig = [{
        nodeType: "gx_baselayercontainer",
		text: 'Base Layers', // override 'Base Layer' Label for tree layer
		expanded: true,
		iconCls: 'icono3',
		loader: {
			 baseAttrs: {
				iconCls: 'icono5'
			 }
		}
    }, {
        nodeType: "gx_overlaylayercontainer",
		text: 'Overlay Layers', // override 'OverLay' Label for tree layer
        expanded: true, // aparece expandido ese nodo
        // render the nodes inside this container with a radio button,
        // and assign them the group "foo".
		iconCls: 'icono3', 
        loader: {
            baseAttrs: {
                uiProvider: "layernodeui",
				iconCls: 'icono5' // parametro decisivo a la hora de cambiar el icono de los elementos hijos 
	       }
        }
    }
	];
	treeConfig = new OpenLayers.Format.JSON().write(treeConfig, true);
	tree = //new Ext.tree.TreePanel({
		{
        //border: true,
		xtype: 'treepanel',
		id: 'layersTab',
		autoScroll: true,
		enableDD: true, // POSIBILITAMOS QUE SE PUEDA HACER DRAG & DROP (EL SISTEMA AUTOMATICAMENTE COLOCA LOS LAYER SOBRE EL MAPA DE ACUERDO A LAS NUEVAS DISPOSICIONES)
		loader: new Ext.tree.TreeLoader({
            applyLoader: false
            , uiProviders: {
                "layernodeui": LayerNodeUI
            }
        }),
        root: {
		    children: Ext.decode(treeConfig)
	    },
		listeners: {
			 'click': function(node, event){
					console.log(node);
			}
		}, 
		rootVisible: false,
        lines: false
	}
    //});
	
    var tabPanel = {
    		id: "west-tab-panel",
    	    layout:'card',
    	    activeItem: 0,
    	    width: 200,
    	    region: 'west',
    	    bodyStyle: 'padding:15px',
    	    split: true,
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
    	    items: [tree,
				{
					id: 'legendTab',
					html: "<p>Hi. I'm the legend panel.</p>"
				}
			]
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
