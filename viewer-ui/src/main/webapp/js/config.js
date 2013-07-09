Ext.namespace("App");

App.config = {};
App.config.csw = {
	queryUrl: document.location.protocol + "//pegasosdi.uab.es/catalog/srv/en/csw"
};

App.config.featureInfo = {};

App.config.featureInfo.templates = {
	// ***********************************************			
	// TEMPLATES (only for some layers -> to be grown.
	// Control only by-default loaded layers
	// ***********************************************	
	clc: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">', 
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle"><span style="border: 1px solid black; background: rgb({red},{green},{blue})">&nbsp;&nbsp;&nbsp;</span> {class}</p>',
								'<p>Class code: {value_0}</p>',
								'<p>Coordinates: {[fm.number(values.x, "0.00")]} m, {[fm.number(values.y, "0.00")]} m</p>',
							'</div>',
						'</tpl>', 
					'</div>',
				'</tpl>',
				'<div class="infoByPointResultFooter">',
					'<p>Take a look at <a href="http://sia.eionet.europa.eu/CLC2000/classes" target="_blank">Corine classes</a> for more details!</p>',
				'</div>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	natura2000: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">',
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle">{SITENAME} </p>',
								'<p> Code: {SITECODE} </p>',
								'<p> Type: {SITETYPE} </p>',
								'<p> Relase: {RELEASE_DA} </p>',
								//'<p> Coordinates X-Y: {parent.parent.lonlat.lon}, {parent.parent.lonlat.lat} </p>',
							'</div>',
						'</tpl>',
					'</div>',
				'</tpl>',
				'<div class="infoByPointResultFooter">',
					'<p> Showing registers near: {[fm.number(values.x, "0.00")]} m, {[fm.number(values.y, "0.00")]} m</p>',
				'</div>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	countries: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">',
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle">{NAME_ENGL} </p>',
								'<p>Capital: {CAPT} </p>',
								'<p>Code: {CNTR_ID} </p>', 
								'<p>Iso code: {ISO3_CODE} </p>',
							'</div>',
						'</tpl>',
					'</div>',
				'</tpl>',
				'<div class="infoByPointResultFooter">',
					'<p> Showing registers near: {[fm.number(values.x, "0.00")]} m, {[fm.number(values.y, "0.00")]} m</p>',
				'</div>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	cases: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">',
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle">{NAME_ENGL} </p>',
								'<p>Name: {NAMECASE} </p>', 
								'<p>Country: {COUNTRY} </p>',
							'</div>',
							'<div>',
								'<p>You can find more info about <a href={WEB} target="_blank">{NAMECASE} case</a> on Pegaso Wiki.</p>',
							'</div>',
						'</tpl>',
					'</div>',
				'</tpl>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	nuts: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">',
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle">{NAME_HTML} </p>',
								'<p>Code: {NUTS_ID} </p>',
								'<p>NUTS level: {STAT_LEVL_} </p>',
							'</div>',
						'</tpl>',
					'</div>',
				'</tpl>',
				'<div class="infoByPointResultFooter">',
					'<p> Showing registers near: {[fm.number(values.x, "0.00")]} m, {[fm.number(values.y, "0.00")]} m</p>',
				'</div>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	ecoregions: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">',
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle">{ecoregion} </p>',
								'<p>Place type: {placetype} </p>',
								'<p>Code: {eco_code} </p>',
								'<p>Coordinates (WGS84): Lat {[fm.number(values.lat, "0.0000")]} &#176;, Lon {[fm.number(values.long, "0.0000")]} &#176;</p>',
							'</div>',
						'</tpl>',
					'</div>',
				'</tpl>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	noSelected: new Ext.XTemplate(
		'<tpl>',
			'<div>',
				' There is no selected layer ',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	noResults: new Ext.XTemplate(
		'<tpl>',
			'<div style="width:300px, height: 100px;">',
				' NO RESULTS FOR SELECTED LAYER',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	generic: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointRegister infoByPointRegisterBg">',
						'<tpl for="data">',
							'<p>{.}</p>',
						'</tpl>',
					'</div>',
				'</tpl>',
				'<div class="infoByPointResultFooter">',
					'<p> Showing registers near: {[fm.number(values.x, "0.00")]} m, {[fm.number(values.y, "0.00")]} m</p>',
				'</div>',
			'</div>',
		'</tpl>',
		{compiled: true}
	),
	raster: new Ext.XTemplate(
		'<tpl>',
			'<div class="infoByPointResultFrame">',
				'<tpl for=".">',
					'<div class="infoByPointBody">',
						'<tpl for="attributes">', 
							'<div class="infoByPointRegister">',
								'<p class="infoByPointResultTitle"><span style="border: 1px solid black; background: rgb({red},{green},{blue})">&nbsp;&nbsp;&nbsp;</span> {class}</p>',
								'<p>Class code: {value_0}</p>',
								'<p>Coordinates: {[fm.number(values.x, "0.00")]} m, {[fm.number(values.y, "0.00")]} m</p>',
							'</div>',
						'</tpl>', 
					'</div>',
				'</tpl>',
			'</div>',
		'</tpl>',
		{compiled: true}
	)
};
App.config.featureInfo.servers = {
	"http://pegasosdi.uab.es/ogc/wms?": {
		"CORINE_CLC90_100m": App.config.featureInfo.templates.clc,
		"CORINE_CLC00_100m": App.config.featureInfo.templates.clc,
		"CORINE_CLC06_100m": App.config.featureInfo.templates.clc,
		"GLOBCORINE_2005": App.config.featureInfo.templates.globcorine,
		"GLOBCORINE_2009": App.config.featureInfo.templates.globcorine,
		"NATURA2000": App.config.featureInfo.templates.natura2000,
		"CNTR_RG_03M_2010": App.config.featureInfo.templates.countries,
		"NUTS_RG_03M_2010": App.config.featureInfo.templates.nuts,
		"NUTS_RG_03M_2010_L0": App.config.featureInfo.templates.nuts,
		"NUTS_RG_03M_2010_L1": App.config.featureInfo.templates.nuts,
		"NUTS_RG_03M_2010_L2": App.config.featureInfo.templates.nuts,
		"NUTS_RG_03M_2010_L3": App.config.featureInfo.templates.nuts,
		"PEGASO_CASES": App.config.featureInfo.templates.cases
	},
	"http://geo.vliz.be:80/geoserver/wms?SERVICE=WMS&": {
		"Ecoregions:ecoregions": App.config.featureInfo.templates.ecoregions,
	}
};

App.config.featureInfo.defautLayers = {
	"http://pegasosdi.uab.es/ogc/wms?": [
		"CNTR_RG_03M_2010",
		"PEGASO_CASES"
	],
	"http://geo.vliz.be:80/geoserver/wms?SERVICE=WMS&": [
		"MarineRegions:eez"
	]
};

/***********************************************			
* Layers to be loaded by default
************************************************/
App.config.layers = [
	new OpenLayers.Layer.Google(
		"Google Satellite",
		{
			type : google.maps.MapTypeId.SATELLITE,
			numZoomLevels : 22
			//, maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
		}
	),
	new OpenLayers.Layer.Google("Google Streets", {
		numZoomLevels : 22
		// maxExtent: new OpenLayers.Bounds(-19567879.238281,-19567879.068281,19567879.238281,19567879.408281)
	}),
	new OpenLayers.Layer.OSM("OpenStreetMap"),
	new OpenLayers.Layer.WMS("NASA Global Imagery",
		"http://pegasosdi.uab.es/ogc/wms?",
		{
			layers : "NASA_BLUEMARBLE"
		},
		{
			isBaseLayer : true
		}
	),
	new OpenLayers.Layer.WMS("Corine 2006 100m",
		"http://pegasosdi.uab.es/ogc/wms?",
		{
			layers : "CORINE_CLC06_100m",
			transparent : true,
			format : "image/png"
		},
		{
			isBaseLayer : false,
			buffer : 0
		}
	),
	new OpenLayers.Layer.WMS("ESA Globcorine 2005",
		"http://pegasosdi.uab.es/ogc/wms?",
		{
			layers : "GLOBCORINE_2005",
			transparent : true,
			format : "image/png"
		},
		{
			isBaseLayer : false,
			buffer : 0,
			visibility : false
		}
	),
	new OpenLayers.Layer.WMS("ESA Globcorine 2009",
		"http://pegasosdi.uab.es/ogc/wms?",
		{
			layers : "GLOBCORINE_2009",
			transparent : true,
			format : "image/png"
		}, {
			isBaseLayer : false,
			buffer : 0,
			visibility : false
		}
	),
	new OpenLayers.Layer.WMS("Natura 2000",
		"http://pegasosdi.uab.es/ogc/wms?",
		{
			layers : "NATURA2000",
			transparent : true,
			format : "image/png"
		}, {
			isBaseLayer : false,
			buffer : 0,
			visibility : false
		}
	),
	new OpenLayers.Layer.WMS("USGS Elevation model GTopo30",
		"http://pegasosdi.uab.es/ogc/wms?",
		{
			layers : "EDM_USGS_W020N40,EDM_USGS_E020N40,EDM_USGS_W020N90,EDM_USGS_E020N90",
			transparent : true,
			format : "image/png"
		}, {
			isBaseLayer : false,
			buffer : 0,
			visibility : false
		}
	),
	new OpenLayers.Layer.WMS("Country Boundaries 2010",
		"http://pegasosdi.uab.es/ogc/wms?",
		{
			layers : "CNTR_RG_03M_2010",
			transparent : true,
			format : "image/png"
		}, {
			isBaseLayer : false,
			buffer : 0,
			visibility : true
		}
	),
	new OpenLayers.Layer.WMS("Pegaso CASES",
		"http://pegasosdi.uab.es/ogc/wms?",
		{
			layers : "PEGASO_CASES",
			transparent : true,
			format : "image/png"
		}, {
			isBaseLayer : false,
			buffer : 0,
			visibility : true
		}
	)
];


/***********************************************			
* Featured layers config
************************************************/

App.config.featuredLayers = [
	{
		text: 'Administrative Boundaries',
		imgPath: 'img/featuredLayers/australia.png',
		items: [{
			text: "NUTS 2010 1:3M",
			imgPath: 'img/featuredLayers/europe4.png',
			server: 'http://pegasosdi.uab.es/ogc/wms?',
			layers: 'NUTS2010gr'
		},
		{
			text: "Marbound EEZs, version 7",
			imgPath: 'img/featuredLayers/boat.png',
			server: 'http://geo.vliz.be/geoserver/wms?',
			layers: 'MarineRegions:eez'
		},
		{
			text: "Maritime boundaries, v7",
			imgPath: 'img/featuredLayers/sailboat.png',
			server: 'http://geo.vliz.be/geoserver/wms?',
			layers: 'MarineRegions:boundaries'
		},
		{
			text: "IHO Sea Areas",
			imgPath: 'img/featuredLayers/johnny_automatic_whale_icon.png',
			server: 'http://geo.vliz.be/geoserver/wms?',
			layers: 'MarineRegions:iho'
		}]
	},
	{
		text: 'Protected Areas',
		imgPath: "img/featuredLayers/tree.png",
		items: [{
			text: 'NATURA 2000 areas',
			imgPath: "img/featuredLayers/nature-sunflower.png",
			type: 'WMS',
			server: 'http://pegasosdi.uab.es/ogc/wms?',
			layers: 'NATURA2000'
		},
		{
			text: 'Ramsar Wetlands',
			imgPath: "img/featuredLayers/bluebird.png",
			type: 'WMS',
			server: 'http://pegasosdi.uab.es/ogc/wms?',
			layers: 'Wetlands_Boundaries,Wetlands_points'
		}]
	},
	{
		text: 'Land Cover',
		imgPath: "img/featuredLayers/sicilia.png",
		items: [{
			text: 'Corine Land Cover 2006',
			imgPath: "img/featuredLayers/eaa_clc06.png",
			type: 'WMS',
			server: 'http://pegasosdi.uab.es/ogc/wms?',
			layers: 'CORINE_CLC06_100m'
		},
		{
			text: 'Corine Land Cover 2000',
			imgPath: "img/featuredLayers/eaa_clc00.png",
			type: 'WMS',
			server: 'http://pegasosdi.uab.es/ogc/wms?',
			layers: 'CORINE_CLC00_100m'
		},
		{
			text: 'Corine Land Cover 1990',
			imgPath: "img/featuredLayers/eaa_clc90.png",
			type: 'WMS',
			server: 'http://pegasosdi.uab.es/ogc/wms?',
			layers: 'CORINE_CLC90_100m'
		},
		{
			text: 'GlobCorine 2009',
			imgPath: "img/featuredLayers/esa_globcorine2009.png",
			type: 'WMS',
			server: 'http://pegasosdi.uab.es/ogc/wms?',
			layers: 'GLOBCORINE_2009'
		},
		{
			text: 'GlobCorine 2005',
			imgPath: "img/featuredLayers/esa_globcorine2005.png",
			type: 'WMS',
			server: 'http://pegasosdi.uab.es/ogc/wms?',
			layers: 'GLOBCORINE_2005'
		}]
		
	},
	{
		text: 'Indicators',
		imgPath: "img/featuredLayers/pegaso-round.png",
		items: []
	}
	
];
