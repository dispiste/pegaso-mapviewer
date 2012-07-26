/**
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

var legendPanel;
var tree;
var tabPanel;

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

/**
 * Initializes the layerTree and the legend
 */
function initLeftTabs() {
	
	var cardNav = function(compId){
		var l = Ext.getCmp('west-tab-panel').getLayout();
		l.setActiveItem(compId);
	};
	var extendMap = function(){
		Ext.getCmp('west-tab-panel').collapse();
	};

	var LayerNodeUI = Ext.extend(UAB.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());
	
	var treeConfig = [{
		nodeType: "gx_overlaylayercontainer",
		text: 'Thematic information', // override 'OverLay' Label for tree layer
		expanded: true, // aparece expandido ese nodo
		layerStore: mapPanel.layers,
		iconCls: 'icono3', 
		loader: {
			baseAttrs: {
				uiProvider: LayerNodeUI,
				iconCls: 'icono5', // parametro decisivo a la hora de cambiar el icono de los elementos hijos
				actions: [{
					action: "delete",
					qtip: "delete"
				}]
			}
		}
	},{
		nodeType: "gx_baselayercontainer",
		text: 'Background', // override 'Base Layer' Label for tree layer
		expanded: true,
		layerStore: mapPanel.layers,
		iconCls: 'icono3',
		loader: {
			baseAttrs: {
				uiProvider: UAB.tree.LayerNodeUI,
				iconCls: 'icono5'
			}
		}
	}];

	tree = new UAB.tree.CustomTreePanel({
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
		rootVisible: false,
		bodyStyle: "padding: 5px",
		lines: false
	});

	//legendPanel 
	legendPanel = { 	
		xtype: 'gx_legendpanel', 
		id: 'legendTab',
		defaults: {
			labelCls: 'mylabel',
			style: "padding: 10px"
		},
		autoScroll: true
	}

	//tabPanel containing tree and legendPanel items
	tabPanel = {
			id: "west-tab-panel",
			layout:'card',
			activeItem: 0,
			width: 300,
			region: 'west',
			bodyStyle: 'padding: 0px',
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
	
	tree.on("iconClick", function(node, e) {
		var layer = node.layer;
		// create a unique ID for the window to avoid opening two identical windows if (e.g.) double clicked
		var id = "uab-wnd-" + layer.id;
		var window  = Ext.getCmp(id);
		if (!window) {
			window = new Ext.Window({
				id: id,
				title: node.text,
				bodyStyle: 'padding:10px',
				x: 60,
				y: e.xy[1],
				layout: 'fit',
				width: 230,
				height: 80,
				items: new Ext.Container({
					layout:'form',
					ctCls: 'uab-layer-window-body',
					items: [
					{
						xtype: "gx_opacityslider",
						layer: layer,
						aggressive: true,
						name: 'opacity',
						fieldLabel: 'Opacity'
					}]
				})
			});
		}
		window.show(node.getUI());
	});
}

function selectTopLayer() {
	// select the top thematic layer (if existing)
	if(tree.getRootNode() &&
		tree.getRootNode().childNodes.length > 0 &&
		tree.getRootNode().childNodes[0].childNodes.length > 0) {
			tree.getSelectionModel().select(tree.getRootNode().childNodes[0].childNodes[0])
	}
}