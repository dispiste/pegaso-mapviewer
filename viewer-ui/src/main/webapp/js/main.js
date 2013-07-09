/**
 * Copyright (c) 2008-2011 UThe Open Source Geospatial Foundation
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */



Ext.onReady(function() {
	// The proxy is necessary for WMSGetFeatureInfo or CSW queries to servers different than localhost (e.g. GetFeatureInfo for VLIZ layers)
	OpenLayers.ProxyHost = "/cgi-bin/olproxy.cgi?url=";
	
	setTimeout(function() {
		Ext.get('loading').fadeOut({
			remove : true
		});
	}, 500);

	initMeasureTools();
	initMapPanel();
	initLeftTabs();
	initSearchTools();


	new Ext.Viewport({
		id: 'viewp',
		layout: "border",
		defaults: {border: false},
		items: [{
				region: "north",
				contentEl: "northDiv",
				height: 80
			},
			contMapPanel,
			tabPanel
		]
	});
});
