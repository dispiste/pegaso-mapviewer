Ext.namespace("UAB", "UAB.feat");

/**
 * @class Uab.feat.FeaturedLayers.js
 * @extends Ext.Panel

 var dummyConfig = {
	categories: [{
		text: 'Layers 1',
		items: [{
			text: 'NAME 1',
			imgPath: "imagesFL/FeaturedLayers1.png"
		},
		{
			text: 'Corine Land Cover',
			imgPath: "imagesFL/FeaturedLayers2.png"
		}]
	},
	{
		text: 'Pegaso Indicators',
		items: [];
	}
 };

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
	 * @cfg {Config object} categories (required).
	 * A configuration object defining the categories to create, the layers to include in each category
	 * and the images and texts to show in each category and layer. This configuration object should be
	 * shaped as follows:
	 <pre><code>
	 categories: [{
		text: 'Layers 1',
		imgPath: "imagesFL/FeaturedLayersCategory1.png",
		items: [{
			text: 'NAME 1',
			imgPath: "imagesFL/FeaturedLayers1.png"
		},
		{
			text: 'Corine Land Cover',
			imgPath: "imagesFL/FeaturedLayers2.png"
		}]
	},
	{
		text: 'Pegaso Indicators',
		imgPath: "imagesFL/FeaturedLayersCategory2.png",
		items: []
	}]
	</pre></code>
	 */	
	categories: null,
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
			var items = [];
			for (var j=0; j<category.items.length; j++) {
				var item = category.items[j];
				var element = this.getElement(item.text, item.imgPath);
				items.push(element);
			}
			var row = this.getRow(category.text, category.imgPath, items);
			rows.push(row);
		}
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
			// items incluye un array de dos contenedores: el de la cuarta imagen y las imagenes que se mostraran ante eventos de raton
			items: 
			[
				{ 
					xtype: 'container',
					itemId: 'layers',
					layout: 'column',
					listeners: {
						'afterrender' : function(comp){
							comp.el.on('mouseleave', function(evt, el, o){
								comp.el.fadeOut({
									endOpacity: 0.4,
									duration: 0.05
								});
								var elementsContainer = Ext.getCmp(comp.id);
								elementsContainer.hide();
							});
						}
					},
					items: items,
				},
				//
				// container para la imagen principal (cuarta) que aparece por defecto
				//
				{
					xtype: 'container',
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
											endOpacity: 0.4,
											duration: 0.05
										});
										var elementsContainer = Ext.getCmp(this.id).ownerCt.ownerCt.getComponent('layers');
										for (var i=0; i<elementsContainer.items.length; i++) {
											elementsContainer.getComponent(i).show();
										}
										elementsContainer.show();
									});
								}
							},
							items: {
								xtype: 'box', 
								autoEl: {
										tag: 'img',
										src: imgPath
										},		
								autoWidth: true	
							}
						},
						{
							xtype: 'box',
							autoHeight: true,
							layout: 'fit', 
							// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
							autoEl: {
								tag: 'div',
								html: title,
							}, 
							style: {
								'padding-left' : "10px",
								'background-color':  '#CCCCCC'
							}
						}
					]
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
			items: [
				{
					xtype: 'box',
					autoShow : true,
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
								Ext.getCmp('subcontainer_caja_4_1').items.items[0].el.setStyle('padding: 0px');
								Ext.getCmp('subcontainer_caja_4_1').items.items[0].el.setWidth(110);
							});
							comp.el.on('mouseout', function(a,imageElement,obj){
								Ext.getCmp('subcontainer_caja_4_1').items.items[0].el.setWidth(90);
							});
											
							comp.el.on('click', function(){
								this.highlight();
							});
						}
					}
				},
				{
					xtype: 'box',
					autoShow : true,
					autoHeight: true,
					layout: 'fit', 
					// http://www.sencha.com/forum/showthread.php?79107-Problem-removing-panel-border
					autoEl: {
						tag: 'div',
						html: title
					}, 
					style: {
						'padding-left' : "25px"
					}	
				}
			]
			};
		return element;
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
