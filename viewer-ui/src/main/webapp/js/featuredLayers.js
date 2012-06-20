

var menuV
var sampleButton; 

	
function initFeaturedLayers() {
	
	
		
		menuV = new Ext.menu.Menu({
					id: 'mainMenuV',
					plain: true,
					layout: 'fit',   
					layoutConfig: {
						align: 'stretch',
						pack: 'start'
					},
					//forceLayout: true,
					items: 
					[
						 {
							xtype: 'container',
							id: 'cacakita',
							width: 100,            //required
							height: 200,
							autoHeight: true,
							layout: 'anchor',
							forceLayout: true,  // force to create layout for container
							hideMode: 'display',
							layoutConfig: {
										align: 'stretch',
										pack: 'start'
							},
							items: 
									
									[
										{
											xtype: 'box', 
											id: 'box_1',
											autoEl: {
													tag: 'img',
													src: "imagesFL/FeaturedLayers1.png"
													},
											autoWidth: true,
											//menu: menuH,
											handler: function(){
												return false;
											}
																						
										},
										{
											xtype: 'container',
											autoHeight: true,
											//height: 40,
											layoutConfig: {
														align: 'stretch',
														pack: 'start'
											},
											items: 
													[
														{
														html: '<center><b><i> Layers 1 </b></i></center>'
														}
													]
										},
										{
											xtype: 'box',
											autoEl: {
													tag: 'img',
													src: "imagesFL/FeaturedLayers2.png"
													},
											autoWidth: true,
											handler: function() {
														return false
											}
											
											
										},
										{
											xtype: 'container',
											autoHeight: true,
											autoEl: {
													tag: 'div',
													html: '<center><b><i> Layers 2 </b></i></center>'
													},
											autoWidth: true,
										},
										{
											xtype: 'box',
											id: 'box_3',
											//layout: 'anchor',
											autoEl: {
													id: 'box_el_3',
													tag: 'img',
													src: "imagesFL/FeaturedLayers3.png"
													}
											, autoWidth: true
											//, menu: menuH,
											//menuAlign: 'tl-bl',
											//flex: 1
										
										},
										{
											xtype: 'container',
											autoHeight: true,
											//border: false,
											//height: 40,
											autoEl: {
													tag: 'div',
													html: '<center><b><i> Layers 3 </b></i></center>'
													},
											autoWidth: true,
										},
										{
											xtype: 'box',
											autoEl: {
													tag: 'img',
													src: "imagesFL/FeaturedLayers4.png"
													}
											, autoWidth: true
										},
										{
											xtype: 'container',
											autoHeight: true,
											//border: false,
											//height: 40,
											autoEl: {
													tag: 'div',
													html: '<center><b><i> Layers 4 </b></i></center>'
													},
											autoWidth: true,
										}
									]
						}
					]
					
								
});


// defino el boton con el menu Vertical
	sampleButton = new Ext.Button({ 
				text: 'Featured Layers',
				id: 'botonillo',
				//renderTo: 'buttonFeaturedLayers2',
				//renderTo: document.body,
				//iconCls: 'bmenu',  // <-- icon
				menu: menuV  // assign menu by instance
				
    });
	
	
}