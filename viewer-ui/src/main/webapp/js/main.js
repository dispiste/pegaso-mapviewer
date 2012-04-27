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
                x = nodeEl.getLeft()+nodeEl.getWidth()-2;
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
                        pageY: y,
                        pageX: x,
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

function onAction(node, action, evt) {
    // do nothing
    
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

    var options, layer;
    var extent = new OpenLayers.Bounds(-5, 35, 15, 55);
    
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
        layers: [layer],
        extent: extent,
        split: true
    });
    
    var LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());


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
                  new NodeMouseoverPlugin(),
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
        root: {
            children: treeConfig
        },
        listeners: {
            'click': function(node, event){
                //console.log(node);
            }
        }, 
        rootVisible: false,
        lines: false
    });

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
        }, mapPanel, tabPanel]
    });
    
    /*
     * Those are necessary to hide the "delete layer" window when the
     * cursor is out of the layer tree. We can't use on mouseout of
     * layertree because then it flickers when the mouse is on the
     * 'delete layer' window.
     */
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
