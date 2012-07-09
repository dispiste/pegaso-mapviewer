Ext.namespace("UAB.tree");

UAB.tree.CustomTreePanel = Ext.extend(Ext.tree.TreePanel, {
	initComponent : function(){
		UAB.tree.CustomTreePanel.superclass.initComponent.call(this);
		this.addEvents("iconClick");
	}
});

/** private: constructor
 *  .. class:: LayerNodeUI
 *
 *      Place in a separate file if this should be documented.
 */
UAB.tree.LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, {
    
    /** private: method[constructor]
     */
    constructor: function(config) {
    	UAB.tree.LayerNodeUI.superclass.constructor.apply(this, arguments);
    },
    /** private: method[render]
     *  :param bulkRender: ``Boolean``
     */
    render: function(bulkRender) {
        UAB.tree.LayerNodeUI.superclass.render.apply(this, arguments);
        var icon = this.getIconEl();
        var iconEl = new Ext.Element(icon);
        iconEl.on("click", this.onIconClick, this);
        this.fullText = this.textNode.innerHTML;
        if (this.fullText.length>40) {
        	this.textNode.innerHTML = this.fullText.substr(0, 37)+"...";
        }
    },
    onIconClick: function(event, el, obj) {
    	this.node.getOwnerTree().fireEvent("iconClick", this.node, event);
    }
});