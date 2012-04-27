/**
 * Copyright (c) 2008-2011 UThe Open Source Geospatial Foundation
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

var map; 
var mapPanel; 
var legendPanel;
var tree;

/**
 *  TreePanel actions
 */
function onAction(node, action, evt) {
    
    var layer = node.layer;
    switch(action) {
    case "delete":
        layer.destroy();
        break;
    }
};

Ext.onReady(function() {

    // if true a google layer is used, if false
    // the bluemarble WMS layer is used
    var google = false;

    var options = {
        //projection: new OpenLayers.Projection("EPSG:900913"),
        units: "m",
        //allOverlays: true,
        //maxExtent: new OpenLayers.Bounds(-20037508, -20037508,
        //        20037508, 20037508.34)
    };
    var layer;
    var extent = new OpenLayers.Bounds(-5, 35, 15, 55);
    /*
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

    }*/

    map = new OpenLayers.Map(options);

	map.addControl(new OpenLayers.Control.LayerSwitcher());

	// add layers to map 
    map.addLayers([
            new OpenLayers.Layer.WMS("Global Imagery",
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
                    buffer: 0
                }
            ),
            new OpenLayers.Layer.WMS("Corine 2000 100m",
                "http://pegasosdi.uab.es/ogc/wms?", {
                    layers: "CORINE_CLC00_100m",
                    transparent: true,
                    format: "image/png"
                }, {
                    isBaseLayer: false,
                    buffer: 0
                }
            ),
            new OpenLayers.Layer.WMS("Corine 2006 100m",
                "http://pegasosdi.uab.es/ogc/wms?", {
                    layers: "CORINE_CLC06_100m",
                    transparent: true,
                    format: "image/png"
                }, {
                    isBaseLayer: false,
                    buffer: 0
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

    var cardNav = function(compId){
        var l = Ext.getCmp('west-tab-panel').getLayout();
        l.setActiveItem(compId);
    };
    var extendMap = function(){
    	Ext.getCmp('west-tab-panel').collapse();
    };

    mapPanel = new GeoExt.MapPanel({
        region: "center",
        id: "mappanel",
        map: map,
        layers: [],
        extent: extent,
        split: true
    });
    
    var LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());

    var layerList = new GeoExt.tree.LayerContainer({
        layerStore: mapPanel.layers,
        expanded: true,
        loader: {
            baseAttrs: {
                uiProvider: "layernodeui",
                iconCls: 'icono5',
                actions: [{
                    action: "delete",
                    qtip: "delete"
                }]
            }
        }
    });
    
    var treeConfig = [{
        nodeType: "gx_baselayercontainer",
        text: 'Background', // override 'Base Layer' Label for tree layer
        expanded: true,
        layerStore: mapPanel.layers,
        iconCls: 'icono3',
        loader: {
            baseAttrs: {
                iconCls: 'icono5'
            }
        }
    }, {
        nodeType: "gx_overlaylayercontainer",
        text: 'Thematic information', // override 'OverLay' Label for tree layer
        expanded: true, // aparece expandido ese nodo
        layerStore: mapPanel.layers,
        iconCls: 'icono3', 
        loader: {
            baseAttrs: {
                uiProvider: "layernodeui",
                iconCls: 'icono5', // parametro decisivo a la hora de cambiar el icono de los elementos hijos
                actions: [{
                    action: "delete",
                    qtip: "delete"
                }]
            }
        }
    }];

    tree = new Ext.tree.TreePanel({
        plugins: [
                  {
                      ptype: "gx_treenodeactions",
                      listeners: {
                          action: onAction
                      }
                  }
        ],
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
        //root: layerList,
        root: {
            children: treeConfig
        },
        listeners: {
        }, 
        rootVisible: false,
        lines: false
    });
    
	// SET legendURl property to layers associated to Ext Object ( mapPanel.layers.getAt(X) )
	mapPanel.layers.getAt(1).set("legendURL", "http://pegasosdi.uab.es/ogc/wms?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=CORINE_CLC90_100m&format=image/png&STYLE=default");
	mapPanel.layers.getAt(2).set("legendURL", "http://pegasosdi.uab.es/ogc/wms?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=CORINE_CLC00_100m&format=image/png&STYLE=default");
	mapPanel.layers.getAt(3).set("legendURL", "http://pegasosdi.uab.es/ogc/wms?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=CORINE_CLC06_100m&format=image/png&STYLE=default");
	mapPanel.layers.getAt(4).set("legendURL", "http://pegasosdi.uab.es/ogc/wms?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=CNTR_BN_03M_2006&format=image/png&STYLE=default");
	
	//legendPanel 
	legendPanel = { 	
				xtype: 'gx_legendpanel', 
				id: 'legendTab',
				defaults: {
					labelCls: 'mylabel',
					style: 'padding:5px'
				},
				bodyStyle: 'padding:5px',
				width: 400,
				autoScroll: true,
				region: 'west'
				}
 
	//tabPanel containing tree and legendPanel items
    var tabPanel = {
            id: "west-tab-panel",
            layout:'card',
            activeItem: 0,
            width: 250,
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
            items: [
                    tree,
                    legendPanel
            ]
        };

	new Ext.Viewport({
        layout: "border",
        defaults: {border: false},
        items: [{
            region: "north",
            contentEl: "northDiv",
            height: 80
        },
		mapPanel,
		tabPanel
        ]
	});
});
