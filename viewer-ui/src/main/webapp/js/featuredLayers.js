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
											config = {
											//var config = {
												categories: [
												{
													text: 'Layers 1',
													imgPath: "img/featuredLayers/imagen_1.png",
													items: [{
														text: 'Corine 1990 100m',
														imgPath: "img/featuredLayers/Case_1.png",
														server: "http://pegasosdi.uab.es/ogc/wms?", 
														layer: "CORINE_CLC90_100m"
													},
													{
														text: 'Corine 2000 100m',
														imgPath: "img/featuredLayers/Case_2.png",
														server: "http://pegasosdi.uab.es/ogc/wms?", 
														layer: "CORINE_CLC00_100m"
													},
													{
														text: 'Corine 2006 100m',
														imgPath: "img/featuredLayers/Case_3.png",
														server: "http://pegasosdi.uab.es/ogc/wms?", 
														layer: "CORINE_CLC06_100m"
													},
													{
														text: 'NAME 4',
														imgPath: "img/featuredLayers/Case_4.png",
														server: "http://pegasosdi.uab.es/ogc/wms?", 
														layer: "CORINE_CLC06_250m"
													}
													]
												},
												{
													text: 'Indicators I',
													imgPath: "img/featuredLayers/imagen_2.png",
													items: [{
														text: 'NAME 5',
														imgPath: "img/featuredLayers/FeaturedLayers11_smaller.png",
														server: "http://www.creaf.uab.es/cgi-bin/MiraMon5_0.cgi?", 
														layer: "mcsc-catalunya"
													},
													{
														text: 'NAME 6',
														imgPath: "img/featuredLayers/FeaturedLayers12_smaller.png",
														server: "http://www.creaf.uab.es/cgi-bin/MiraMon5_0.cgi?", 
														layer: "mcsc1993-catalunya"
													},
													{
														text: 'NAME 7',
														imgPath: "img/featuredLayers/FeaturedLayers13_smaller.png",
														server: "http://www.creaf.uab.es/cgi-bin/MiraMon5_0.cgi?", 
														layer: "mca-catalunya"
													},
													{
														text: 'NAME 8',
														imgPath: "img/featuredLayers/FeaturedLayers14_smaller.png",
														server: "http://www.creaf.uab.es/cgi-bin/MiraMon5_0.cgi?", 
														layer: "iefc-catalunya"
													}
													]
												},
												{
													text: 'Indicators II',
													imgPath: "img/featuredLayers/imagen_3.png",
													items: [{
														text: 'NAME 9',
														imgPath: "img/featuredLayers/Europe.png", 
														server: "http://ogc.larioja.org/wms/request.php?",
														layer: "Acuiferos"
													},
													{
														text: 'NAME 10',
														imgPath: "img/featuredLayers/Europe.png",
														server: "http://ogc.larioja.org/wms/request.php?",
														layer: "Arboles_singulares"
													},
													{
														text: 'NAME 11',
														imgPath: "img/featuredLayers/Europe.png",
														server: "http://ogc.larioja.org/wms/request.php?",
														layer: "Areas_naturales_singulares"
													}]
												},
												{
													text: 'Indicators III',
													imgPath: "img/featuredLayers/imagen_4.png",
													items: [{
														text: 'NAME 13',
														imgPath: "img/featuredLayers/Categorie4_smaller.png"
													},
													{
														text: 'NAME 14',
														imgPath: "img/featuredLayers/Categorie4_smaller.png"
													}]
												}
												],
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