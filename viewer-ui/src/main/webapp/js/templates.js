				// ***********************************************			
				// TEMPLATES (only for some layers -> to be bigger

				// ***********************************************	
				
var myTmplNUTS;
var myTmplCLC; 
var myTmplCNTR; 
var myTmplNoResults;
var  myTmpl; 


Ext.onReady(function(){		
		
				myTmplCLC = new Ext.XTemplate(
								'<tpl for=".">',
									'<div style="background-color: #FFE9E9; margin: 10px; width:400px;">',
											'<b> Layer: </b> {type} <br />',
											'<tpl for="attributes">', 
													'<b> Coordinates X-Y: </b> {x}, {y} <br />', 
													'<b> Class: </b> {value_0} <br />', 
													'<b> Description: </b> {class} <br />', 
											'</tpl>', 
											'Take a look at <a href="http://sia.eionet.europa.eu/CLC2000/classes" target="_blank">Corine classes</a> for more details! <br />',
									'</div>',
								'</tpl>'														
				);
				
				
								
				myTmplCLC.compile();
				
				
				myTmplNUTS = new Ext.XTemplate(
								'<tpl for=".">',
									'<div style="background-color: #FFE9E9; margin: 10px; width: 300px;">',
											'<b> Layer: </b> {type} <br />',
											'<tpl for="attributes">',  
												'<b> ID: </b> {OBJECTID} <br />', 
												'<b> NUTSID: </b> {NUTS_BN_ID} <br />', 
											'</tpl>', 
									'</div>',
								'</tpl>'
				);
				
				myTmplNUTS.compile();
				
				
				myTmplCNTR = new Ext.XTemplate(
								'<tpl for=".">',
									'<div style="background-color: #CAE8EB; margin: 10px; width: 300px;">',
											'<b> Layer: </b> {type} <br />',
											'<tpl for="attributes">',  
												'<b> CNTR_ID: </b> {CNTR_BN_ID} <br />', 
												'<b> LENGTH: </b> {LEN} <br />', 
											'</tpl>', 
									'</div>',
								'</tpl>'
				);
				
				myTmplCNTR.compile();
				
				
				
				myTmplNoResults = new Ext.XTemplate(
										'<tpl>',
											'<div>',
												' There is no selected layer ',
											'</div>',
										'</tpl>'
				);
				
				myTmplNoResults.compile();
				
				
				// *****************************************
				// END TEMPLATES
				// *****************************************	
}; 