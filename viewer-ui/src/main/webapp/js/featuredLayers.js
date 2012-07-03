



var botonFL;
var featuredLayersContainer;

// FUNCTION to be called in order to "fade" images on mouse movements 
function FadeOutComps(comp1,comp2, opacity) {
					
					g = Ext.get; 
					g(comp1).fadeOut({
										endOpacity: opacity,
										duration: 0.05
												});
						
					g(comp2).fadeOut({
										endOpacity: opacity,
										duration: 0.05
												});	
};
	

	
function initFeaturedLayers() {	
	// This button is added to the toolbar of the application, defined at infoByPoint.js file. When adding, it is consequently renderized
	// Ext.get('botonExtJS') returns null
	
	botonFL = new Ext.Button({
						id: 'botonExtJS',
						text: 'Featured Layers', 
						enableToggle: true,
						//renderTo: document.body,  // it has to belong to tbar
						toggleHandler: function(btn){	
						
									if (btn.pressed){
										if (!featuredLayersContainer) {
											var config = {
												categories: [
												{
													text: 'Layers 1',
													imgPath: "img/featuredLayers/imagen_1.png",
													items: [{
														text: 'NAME 1',
														imgPath: "img/featuredLayers/Case_1.png"
													},
													{
														text: 'Corine Land Cover',
														imgPath: "img/featuredLayers/Case_2.png"
													}]
												},
												{
													text: 'Indicators',
													imgPath: "img/featuredLayers/imagen_2.png",
													items: []
												}],
												ownerButton: btn
											};
											featuredLayersContainer = new UAB.feat.FeaturedLayers(config);
										}
										// we render to document body but we add a listener to be appeared (as DOM element) at some position on the screen 
										featuredLayersContainer.render(document.body); 
										featuredLayersContainer.doLayout();
										featuredLayersContainer.getEl().slideIn('t', {
											easing: 'easeBoth',
											duration: 0.5
										});
									} else {
											
										featuredLayersContainer.getEl().slideOut('t',{
											easing: 'easeBoth',
											duration: 0.5
										});	
									}
						}
	});
	
	
	
		
};