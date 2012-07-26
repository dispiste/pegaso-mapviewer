Ext.namespace("UAB", "UAB.feat");

/**
 * @class Uab.feat.FeaturedLayers.js
 * @extends Ext.Panel

 * <p>This component site images on a panel and make visible/invisible 
   another images on mouse over</p>
 */

UAB.feat.FeaturedLayers  = Ext.extend(Ext.Panel, {
	fixedWidth: 620,
	fixedHeight: 560,
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
							layers: "CLC_EU_96",
							type: "WMS"
						},
						{
							text: 'Corine Land Cover 2000',
							imgPath: "imagesFL/FeaturedLayers2.png",
							server: "http://pegasosdi.uab.es/ogc/wms?",
							layers: "CLC_EU_00"
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
	/**
	 * A property to read an OpenLayers object showing active layers (layers belonging to the Featured-Layer Panel and added to map by clicking on the corresponded image). 
	 * Read-only.
     * @type OpenLayers Object
     * @property activeLayers  
	*/
	activeLayers: {},
	constructor: function(config) {
		config = config || {};
		config.ownerButton || console.log("The 'ownerButton' config parameter is required");
		config.frame = config.frame || false;
		config.border = config.border || false;
		config.width = config.width || this.fixedWidth;
		config.height = config.height || this.fixedHeight;
		config.bodyStyle = 'background:transparent;';
		UAB.feat.FeaturedLayers.superclass.constructor.call(this, config);
		map.events.register('removelayer', this, this.onLayerRemove);
		this.buildUI();
	},
	buildUI: function() {
		var categories = this.categories;
		this.layerStatus = {};
		var rows = [];
		for (var i=0; i<categories.length; i++) {
			var category = categories[i];
			var items = []; // an array of Ext Containers corresponding to items defined in categories
			//var info = [];
			var elementItemsInfo = {};
			for (var j=0; j<category.items.length; j++) {
				var item = category.items[j];
				var element = this.getElement(item.text, item.imgPath); // returns an Ext Container
				element.elementItemsInfo = this.getElementItemsInfo(item.text, item.server,item.layers,item.active);		
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
							layout: 'fit', 
							// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
							autoEl: {
								tag: 'div',
								cls: 'uab-label-featuredLayers',
								html: title
							}
						}
					]
				},
				// container for FOUR IMAGES (included at items property) 
				{ 
					xtype: 'container',
					itemId: 'layers',
					layout: 'column',
					cls: 'uab-row-featured-layers',
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
			cls: 'uab-element-featured-layers',
			hidden: true,
			itemId: this.elementid(),
			items: [
				{
					xtype: 'box',
					//autoShow : true,
					autoEl: {
						tag: 'img',
						src: imgPath,
						cls: 'uab-icon-featuredLayers'
					},
					//autoWidth: true,
					listeners: {
						'afterrender' : {
							fn: function(comp){
								comp.el.on('mouseover', function(a,imageElement,obj){
									//comp.ownerCt.items.items[0].el.setStyle('padding', '0px');
									//comp.ownerCt.items.items[0].el.setWidth(110);
									//comp.ownerCt.items.items[1].el.setWidth(110);	
								}, this);
								comp.el.on('mouseout', function(a,imageElement,obj){
									//comp.ownerCt.items.items[0].el.setWidth(100);
									//comp.ownerCt.items.items[1].el.setWidth(100);
								}, this);						
								comp.el.on('click', function(evt,target, obj){
										var elInfo = Ext.getCmp(target.id).ownerCt.elementItemsInfo;
										var component = Ext.get(target.id);
										if(!elInfo.active ){
											elInfo.active = true;
											elInfo.el = component;
											component.setOpacity(0.5); 
											this.addLayerToTree(elInfo);
											this.activeLayers[elInfo.id] = elInfo;
										} else {
											elInfo.active = false;
											Ext.get(target.id).setOpacity(1.); 
											var layerObject = map.getLayer(elInfo.id);
											this.removeLayerFromFLPanel(layerObject);
											delete this.activeLayers[elInfo.id];
										}
								}, this)
							},
							scope: this
						}
					}
				},
				{
					xtype: 'box',
					// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
					autoEl: {
						tag: 'div',
						cls: 'uab-label-featuredLayers',
						html: title
					}
				}
			]
			};
		return element;
	},
	// private: extract info for clicked container: the server which is providing layers and the name of the layer corresponding to that element
	getElementItemsInfo: function(layerTitle, serverURL, layerName, active){
		return {
			title: layerTitle, 
			server: serverURL,
			layers: layerName, 
			active: false  // parameter to control if layers is added (true) or not (false)
		};
	},
	// private
	onRender: function(ct, position){
		UAB.feat.FeaturedLayers.superclass.onRender.call(this, ct, position);
		if (this.ownerButton) {
			this.reposition();
			
			// re-position our component whenever the panel containing the ownerButton is laid out (e.g. the window is resized, the container is changed, etc)
			this.ownerButton.ownerCt.on("afterlayout", function() {
				this.reposition();
			}, this);
		}
	},
	// private
	reposition: function() {
		var x = this.ownerButton.el.getXY()[0]-this.fixedWidth+this.ownerButton.el.getWidth();
		var y = this.ownerButton.el.getXY()[1]+this.ownerButton.el.getHeight();
		this.getEl().setXY([x,y]); // just under position of "Featured Layers" button
	},
	listeners: {
		'afterrender' : {
			fn: function(comp){
				// hide the component if the mouse gets out of the area
				comp.el.on('mouseleave', function(a, target, obj){
					this.ownerButton && this.ownerButton.toggle(false);
				}, comp);
				// hide the component if there is a click outside any button
				comp.el.on('click', function(evt, target, obj){
					// FIXME: probably we can find a more robust way to achieve this...
					if (target.id.substr(0,7)=="ext-gen" || target.id == this.id) {
						this.ownerButton && this.ownerButton.toggle(false);
					}
				}, comp)
			},
			scope: this
		}
	},
	// private: add a layer to the map by clicking on the corresponding image (items) accordingly to server URL and layer name
	addLayerToTree: function(elInfo){
		var addedLayer = new OpenLayers.Layer.WMS(elInfo.title, 
											  elInfo.server, 
											  {
												layers: elInfo.layers,
												transparent: true,
												format: "image/png"
											  }, {
												isBaseLayer: false,
												buffer: 0,
												visibility: true
											  }
											);
		elInfo.id = addedLayer.id;
		mapPanel.map.addLayer(addedLayer);
	}, 
	// private: remove a layer to the map by clicking on the corresponding image (items) accordingly to server URL and layer name
	removeLayerFromFLPanel : function(layerObj){
		map.removeLayer(layerObj);
	},	
	onLayerRemove: function(evt){
		var layerId = evt.layer.id;
		var elInfo = this.activeLayers[layerId];
		if (elInfo) {
			delete this.activeLayers[layerId];
			elInfo.active = false;
			elInfo.el.setOpacity(1.);
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
