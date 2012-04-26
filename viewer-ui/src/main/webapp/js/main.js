/**
 * Copyright (c) 2008-2011 UThe Open Source Geospatial Foundation
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

var map; 
var mapPanel ; 
var legendPanel;
var tree;
var closeButtonWindow;

var selectedNodeLayerTree;


NodeMouseoverPlugin = Ext.extend(Object, {
    init: function(tree) {
        if (!tree.rendered) {
            tree.on('render', function() {this.init(tree)}, this);
            return;
        }
        this.tree = tree;
        tree.body.on('mouseover', this.onTreeMouseover, this, {delegate: 'div.x-tree-node-leaf'});
    },
    onTreeMouseover: function(e, t) {
        var nodeEl = Ext.fly(t);
        if (nodeEl) {
            var nodeId = nodeEl.getAttributeNS('ext', 'tree-node-id');
            if (nodeId) {
                selectedNodeLayerTree = tree.getNodeById(nodeId);
                y = nodeEl.getTop();
                x = nodeEl.getLeft();
                //width = nodeEl.getWidth();
                //height = nodeEl.getHeight();
                if(!closeButtonWindow){
                    var closeButton = new Ext.Button({
                        iconCls: 'p-close-btn',
                        handler : function() {
                            if (selectedNodeLayerTree) {
                                map.removeLayer(selectedNodeLayerTree.layer);
                                closeButtonWindow.hide();
                            }
                        } 
                      });
                    
                    closeButtonWindow = new Ext.Window({
                        layout:'fit',
                        top: y,
                        left: x,
                        width: 22,
                        height: 22,
                        frame: false,
                        shadow: false,
                        border: true,
                        bodyBorder: false,
                        resizable: false,
                        draggable: false,
                        closable: false,
                        items: closeButton
                    });
                }
                else {
                    closeButtonWindow.setPosition(x, y);
                }
                
                closeButtonWindow.show(this);
            }
        }
    },
});

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

	
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	
	//
	// add layers to map 

    map.addLayers([
            new OpenLayers.Layer.WMS("Corine 1990 100m",
                "http://pegasosdi.uab.es/ogc/wms?", {
                    layers: "CORINE_CLC90_100m",
                    transparent: true,
                    format: "image/gif"
                }, {
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
	
	//treeConfig = new OpenLayers.Format.JSON().write(treeConfig, true); // take a config object and serializes to a JSON string 
	
	tree = 	//{
			new Ext.tree.TreePanel({
				plugins: new NodeMouseoverPlugin(),
				//xtype: 'treepanel',
				id: 'layersTab',
				autoScroll: true,
				enableDD: true, //  DRAG & DROP ENABLED
				loader: new Ext.tree.TreeLoader({
					applyLoader: false
					, uiProviders: {
						"layernodeui": LayerNodeUI
					}
				}),
				root: {
				//    children: Ext.decode(treeConfig) // in case we have json string as config inputs !
					  children: treeConfig
				},
				listeners: {
					 'click': function(node, event){
							console.log(node);
					}
				}, 
				rootVisible: false,
				lines: false
			//}
		});
   
	
	// mapPanel defined before viewport 
	
	mapPanel = new GeoExt.MapPanel({
					region: "center",
					id: "mappanel",
					xtype: "gx_mappanel",
					map: map,
					layers: [layer],
					extent: extent,
					split: true
			});
			
			
	// SET legendURl property to layers associated to Ext Object ( mapPanel.layers.getAt(X) )
	
	mapPanel.layers.getAt(1).set("legendURL", "http://pegasosdi.uab.es/ogc/wms?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=CORINE_CLC90_100m&format=image/png&STYLE=default");
	mapPanel.layers.getAt(2).set("legendURL", "http://pegasosdi.uab.es/ogc/wms?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=CORINE_CLC00_100m&format=image/png&STYLE=default");
	mapPanel.layers.getAt(3).set("legendURL", "http://pegasosdi.uab.es/ogc/wms?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=CORINE_CLC06_100m&format=image/png&STYLE=default");
	mapPanel.layers.getAt(4).set("legendURL", "http://pegasosdi.uab.es/ogc/wms?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=CNTR_BN_03M_2006&format=image/png&STYLE=default");
			
	
	//map.addControl(new OpenLayers.Control.LayerSwitcher());
	
	
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
	
    mapPanel = Ext.getCmp("mappanel");
    var onMapMouseover = function(e, t) {
        if(closeButtonWindow){
            closeButtonWindow.hide();
        }
    };
    mapPanel.body.on('mouseover', onMapMouseover);
    
    var northDiv = Ext.get("northDiv");
    var onNorthMouseover = function(e, t) {
        if(closeButtonWindow){
            closeButtonWindow.hide();
        }
    };
    northDiv.on('mouseover', onNorthMouseover);
});
