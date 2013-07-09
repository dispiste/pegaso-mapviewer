/**
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

var legendPanel1, legendPanel2;
var tree1, tree2;
//var treeSplit;
var tabPanel;
var activeTab;
//var tabPanelSplit; 

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
		if (activePanel==mapPanel1) {
			id = compId+"1";
		}
		else {
			id = compId+"2";
		}
		
		l.setActiveItem(id);
		activeTab = id;
	};
	var extendMap = function(){
		Ext.getCmp('west-tab-panel').collapse();
	};
	
	var LayerNodeUI = Ext.extend(UAB.tree.LayerNodeUI, GeoExt.tree.TreeNodeUIEventMixin());
	function getTreeConfig(panel) {
		var treeConfig = [{

			nodeType: "gx_overlaylayercontainer",
			text: 'Thematic information', // override 'OverLay' Label for tree layer
			expanded: true, // aparece expandido ese nodo
			layerStore: panel.layers,
			iconCls: 'icono3',
			loader: { baseAttrs: { uiProvider: LayerNodeUI,
					iconCls: 'icono5', // parametro decisivo a la hora de cambiar el icono de los elementos hijos
					actions:[{
						action : "delete",
						qtip : "delete"
					}]
				}
			}
			}, { nodeType: "gx_baselayercontainer",
				text: 'Background', // override 'Base Layer' Label for tree layer
				expanded: true,
				layerStore: panel.layers,
				iconCls: 'icono3',
				loader: { baseAttrs: { uiProvider: UAB.tree.LayerNodeUI,
						iconCls: 'icono5',
						// checkedGroup: necessary when having several layer trees on the same
						// application, otherwise the same checkedGroup is used for all the radiobuttons
						checkedGroup: panel.id
					}
				}
			}];
		return treeConfig;
	}

	function createTree(panel, id) {
		return new UAB.tree.CustomTreePanel({
			plugins : [{
				ptype : "gx_treenodeactions",
				listeners : {
					action : onAction
				}
			}],
			xtype : 'treepanel',
			id: id,
			autoScroll : true,
			enableDD : true, // POSIBILITAMOS QUE SE PUEDA HACER DRAG & DROP (EL SISTEMA AUTOMATICAMENTE COLOCA LOS LAYER SOBRE EL MAPA DE ACUERDO A LAS NUEVAS DISPOSICIONES)
			loader : new Ext.tree.TreeLoader({
				applyLoader : false,
				uiProviders : {
					"layernodeui" : LayerNodeUI
				}
			}),
			//root: layerList,
			root : {
				children : getTreeConfig(panel)
			},
			rootVisible : false,
			bodyStyle : "padding: 5px",
			lines : false,
			listeners: {
				'afterrender': function() {
					// select the top thematic layer (if existing)
					if(this.getRootNode() && this.getRootNode().childNodes.length > 0 && this.getRootNode().childNodes[0].childNodes.length > 0) {
						this.getSelectionModel().select(this.getRootNode().childNodes[0].childNodes[0])
					}
				}
			}
		});
	}

	tree1 = createTree(mapPanel1, 'layersTab1');
	activeTab='layersTab1';
	tree2 = createTree(mapPanel2, 'layersTab2');
	function createLegendPanel(panel, id) {
		return new GeoExt.LegendPanel({
			defaults : {
				labelCls : 'mylabel',
				style : "padding: 10px"
			},
			id: id,
			autoScroll : true,
			layerStore : panel.layers
		});
	}
	
	legendPanel1 = createLegendPanel(mapPanel1, 'legendTab1');
	legendPanel2 = createLegendPanel(mapPanel2, 'legendTab2');
	function activeMapUpdated(mapPanel, oldMapPanel) {
		compId = activeTab.substring(0, activeTab.length-1);
		cardNav(compId);
	}

	contMapPanel.addListener("activemappanelchanged", activeMapUpdated);
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
					tree1, tree2, legendPanel1, legendPanel2
			]
		};
	function onNodeClick(node, e) {
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
	}
	tree1.on("iconClick", onNodeClick);
	tree2.on("iconClick", onNodeClick);
}