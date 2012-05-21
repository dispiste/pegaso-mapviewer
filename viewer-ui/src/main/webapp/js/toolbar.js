/**
 * Copyright (c) 2008-2011 UThe Open Source Geospatial Foundation
 * Copyright (c) 2012 Universitat Autonoma de Barcelona, Geography Department, SGR-Interfase Group.
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */
 
 
 
function initToolbar() {
	
	var btn_infobypoint = new GeoExt.Action({
									enableToggle: false,
									layout:'form',
									bodyStyle:'padding: 10px',
									tooltip: "Exportacion",
									iconCls: "btnInfoByPoint", 
									//control: info
									handler: function show() {
												Ext.Msg.alert('You clicked this!!');
									}
	});
	
	var toolbar = new Ext.Toolbar([btn_infobypoint]); 
	
	mapPanel.getTopToolbar(); 
	
	//mapPanel.tbar = [btn_infobypoint]; 
}