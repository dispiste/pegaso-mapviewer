Ext.namespace("UAB", "UAB.feat");

// add a layer to the map by clicking on the corresponding image (items) accordingly to server URL and layer name
	var addLayerToTree = function(serverURL,layerName){
		var addedLayer = new OpenLayers.Layer.WMS(layerName.replace(/_/g, " "),
											  serverURL, 
											  {
												layers: layerName,
												transparent: true,
												format: "image/png"
											  }, {
												isBaseLayer: false,
												buffer: 0,
												visibility: true
											  }
											);
		addedLayer.id = "OL_WMS_addedLayer_" + layerName;
		map.addLayer(addedLayer);
		Ext.Msg.alert('Featured Layers', 'You have added ' + layerName.replace(/_/g, " ") + ' layer successfully !');
	};
	
// remove a layer to the map by clicking on the corresponding image (items) accordingly to server URL and layer name
	var removeLayerToTree = function(layerObj){
		map.removeLayer(layerObj);
		Ext.Msg.alert('Featured Layers', 'You have removed ' + layerObj.name + ' layer successfully !');
	};	

/**
 * @class Uab.feat.FeaturedLayers.js
 * @extends Ext.Panel

 * <p>This component site images on a panel and make visible/invisible 
   another images on mouse over</p>
 */

UAB.feat.FeaturedLayers  = Ext.extend(Ext.Panel, {
	fixedWidth: 570,
	fixedHeight: 510,
	/**
	 * @cfg {Ext.Button} ownerButton
	 * A reference to the button creating this component. The component will be drown just bellow this
	 * button (required).
	 */	
	ownerButton: null,
	/**
	 * @cfg {Object} categories (required).
	 * A configuration object defining the categories to create, the layers and the images to include in each category
	 * and the URL-path pointing to server providing that layer. 
	 * This configuration object should be shaped as follows:
	 * <p>Usage:</p><pre><code>
	 categories: [{
						text: 'Layers Group I',
						imgPath: "imagesFL/FeaturedLayersCategory1.png",
						items: [{
							text: 'Corine Land Cover 1996',
							imgPath: "imagesFL/FeaturedLayers1.png",
							server: "http://pegasosdi.uab.es/ogc/wms?",
							layer: "CLC_EU_96"
						},
						{
							text: 'Corine Land Cover 2000',
							imgPath: "imagesFL/FeaturedLayers2.png",
							server: "http://pegasosdi.uab.es/ogc/wms?",
							layer: "CLC_EU_00"
						}]
				},
				{
						text: 'Pegaso Indicators',
						imgPath: "imagesFL/FeaturedLayersCategory2.png",
						items: []
				}]
	 * </code></pre>
	 */	
	 
	categories: null,
	/**
	 * A property to read an object configuration showing server URL and layer name for a container element. Read-only.
     * @type Object
     * @property elementItemsInfo  
	*/
	elementItemsInfo: null,	
	constructor: function(config) {
		config = config || {};
		config.ownerButton || console.log("The 'ownerButton' config parameter is required");
		config.frame = config.frame || false;
		config.border = config.border || false;
		config.width = config.width || this.fixedWidth;
		config.height = config.height || this.fixedHeight;
		config.bodyStyle = 'background:transparent;';
		UAB.feat.FeaturedLayers.superclass.constructor.call(this, config);
		this.buildUI();
	},
	buildUI: function() {
		var categories = this.categories;
		var rows = [];
		for (var i=0; i<categories.length; i++) {
			var category = categories[i];
			var items = []; // an array of Ext Containers corresponding to items defined in categories
			//var info = [];
			var elementItemsInfo = {};
			for (var j=0; j<category.items.length; j++) {
				var item = category.items[j];
				var element = this.getElement(item.text, item.imgPath); // returns an Ext Container
				element.elementItemsInfo = this.getElementItemsInfo(item.server,item.layer,item.activ);		
				items.push(element); 
			};
			var row = this.getRow(category.text, category.imgPath, items);
			rows.push(row);
		};
		var mainContainer = this.getMainContainer(rows);
		this.add(mainContainer);
	},
	// private:
	getMainContainer: function(rows) {
		var mainContainer = new Ext.Container({
			width: this.fixedWidth+10,            //required
			forceLayout: true,  // force to create layout for container
			hideMode: 'display',
			layoutConfig: {
				align: 'right',
				pack: 'start'
			},
			style: {
				'padding' : '10px'
			},
			items: rows		
		});
		return mainContainer;
	},
	// private:
	getRow: function(title, imgPath, items) {
		var row =	{
			xtype: 'container',
			layout: 'column',
			itemId: this.rowid(),
			items: 
			[
				// container for main IMAGE (at right position) 
				{
					xtype: 'container',
					itemId: 'layerMain',
					style: {
						'float': 'right'
					},
					items: [
						{ 
							xtype: 'container',
							listeners: {
								'afterrender' : function(comp){
									comp.el.on('mouseenter', function(evt, el, o){
										this.fadeOut({
											endOpacity: 0.6,
											duration: 0.05
										});
										var elementsContainer = Ext.getCmp(this.id).ownerCt.ownerCt.getComponent('layers');
										for (var i=0; i<elementsContainer.items.length; i++) {
											elementsContainer.getComponent(i).show();
										}
										elementsContainer.show();
										// for testing
										/*elementsContainer.on('beforehide', function(){
														return false; 
										});*/
									});	
								}
							},
							items: {
								xtype: 'box', 
								autoEl: {
										tag: 'img',
										src: imgPath
										}	
							}
						},
						{
							xtype: 'box',
							autoHeight: true,
							layout: 'fit', 
							// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
							autoEl: {
								tag: 'div',
								html: title
							}, 
							style: {
								'padding-left' : "25px",
								'background-color':  '#CCCCCC'
							}
						}
					]
				},
				// container for FOUR IMAGES (included at items property) 
				{ 
					xtype: 'container',
					itemId: 'layers',
					layout: 'column',
					style: {
						'float': 'right'
					},
					listeners: {
						'afterrender' : function(comp){
								Ext.getCmp(comp.id).ownerCt.el.on('mouseleave', function(evt, el, o){
										Ext.getCmp(comp.id).ownerCt.getComponent('layerMain').items.items[0].el.fadeOut({
																	endOpacity: 0.9,
																	duration: 0.05
										});
										var elementsContainer = Ext.getCmp(comp.id);
										elementsContainer.hide();
							});
						}
					},
					items: items
				}
				
			]
		};
		return row;
	},
	// private: creates a container including an icon and a title
	getElement: function(title, imgPath) {
		var element = {
			xtype: 'container',
			autoShow : true,
			width: 110,
			hidden: true,
			itemId: this.elementid(),
			items: [
				{
					xtype: 'box',
					//autoShow : true,
					autoEl: {
						tag: 'img',
						src: imgPath
					},
					style: {
						'padding' : '15px', 
						'border'  : '2px solid',
						'background-color' : '#F7F8E0'
					},
					autoWidth: true,
					listeners: {
						'afterrender' : function(comp){
							comp.el.on('mouseover', function(a,imageElement,obj){
								comp.ownerCt.items.items[0].el.setStyle('padding', '0px');
								comp.ownerCt.items.items[0].el.setWidth(110);
								comp.ownerCt.items.items[1].el.setWidth(110);	
							});
							comp.el.on('mouseout', function(a,imageElement,obj){
								comp.ownerCt.items.items[0].el.setWidth(100);
								comp.ownerCt.items.items[1].el.setWidth(100);
							});						
							comp.el.on('click', function(evt,target,obj){
									var elInfo = Ext.getCmp(target.id).ownerCt.elementItemsInfo;
									if(!elInfo.activ ){
										elInfo.activ = true;
										this.el.setOpacity(0.25); 
										//map.events.register('addlayer', map, function(){ console.log('added layer'); });
										addLayerToTree(elInfo.server,elInfo.layer);
									} else {
										elInfo.activ = false;
										this.el.setOpacity(1.); 
										//map.events.register('removelayer', map, function(){ console.log('deleted layer'); });
										var layerObject = map.getLayer("OL_WMS_addedLayer_" + elInfo.layer);
										removeLayerToTree(layerObject);
									}
							}, this, {delay: 1200});
						}
					}
				},
				{
					xtype: 'box',
					width: 100, 
					// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
					autoEl: {
						tag: 'div',
						html: '<B>' + title + '</B>'
					}, 
					style: {
						'padding-left' : "15px", 
						'border'  : '2px solid',
						'background-color': '#F7F8E0'
					}	
				}
			]
			};
		return element;
	},
	// private: extract info for clicked container: the server which is providing layers and the name of the layer corresponding to that element
	getElementItemsInfo: function(serverURL, layerName, activ){
		return {
				server: serverURL,
				layer: layerName, 
				activ: false  // parameter to control if layers is added (true) or not (false)
				};
	},
	// private
	onRender: function(ct, position){
		if (this.ownerButton) {
			UAB.feat.FeaturedLayers.superclass.onRender.call(this, ct, position);
			var x = this.ownerButton.el.getXY()[0]-this.fixedWidth+this.ownerButton.el.getWidth();
			var y = this.ownerButton.el.getXY()[1]+this.ownerButton.el.getHeight();
			this.getEl().setXY([x,y]); // just under position of "Featured Layers" button
		}
	},
	// private: counter to reference internal components
	compId: 0,
	// private
	elementid: function() {
		return "feat-ele"+this.compId++;
	},
	rowid: function() {
		return "feat-row"+this.compId++;
	}
});
