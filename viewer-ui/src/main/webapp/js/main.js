/**
 * Copyright (c) 2008-2011 UThe Open Source Geospatial Foundation
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */



Ext.onReady(function() {

	
	initMapPanel();
	initSearchTools();
	initLeftTabs();
	//initToolbar();
	initInfoByPoint(); 
	
	
	
	
	new Ext.Viewport({
		layout: "border",
		defaults: {border: false},
		items: [{
			region: "north",
			contentEl: "northDiv",
			height: 80
		},
		mapPanel,
		tabPanel
		]
	});
});
