/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/dt/Plugin","sap/ui/fl/registry/ChangeRegistry","sap/ui/dt/OverlayRegistry","sap/ui/dt/OverlayUtil","sap/ui/fl/changeHandler/JsControlTreeModifier","sap/ui/rta/util/hasStableId"],function(P,C,O,a,J,h){"use strict";function _(p,c,s){var r=s;if(typeof this.getActionName()==="string"){if(this.isResponsibleElementActionAvailable(s)){r=this.getResponsibleElementOverlay(s);}}var e=r.getElement()&&r.getDesignTimeMetadata()&&!r.getDesignTimeMetadata().markedAsNotAdaptable()&&this._isEditable(r,Object.assign({sourceElementOverlay:s},p));if(e&&typeof e.then==="function"){e.then(function(E){this._handleModifyPluginList(s,E);}.bind(this));c.push(e);}else{this._handleModifyPluginList(s,e);}return c;}var B=P.extend("sap.ui.rta.plugin.Plugin",{metadata:{"abstract":true,library:"sap.ui.rta",properties:{commandFactory:{type:"object",multiple:false}},events:{elementModified:{command:{type:"sap.ui.rta.command.BaseCommand"}}}}});B.prototype._isEditable=function(){};B.prototype.executeWhenVisible=function(e,c){var g=function(E){if(E.getSource().getGeometry()&&E.getSource().getGeometry().visible){e.detachEvent("geometryChanged",g,this);c();}};var o=e.getGeometry();if(e.getElementVisibility()&&(!o||!o.visible)){e.attachEvent("geometryChanged",g,this);}else{c();}};var b=function(e){var p=e.getParameters();var r;var o=e.getSource();if(p.type==="propertyChanged"&&p.name==="visible"){r=this._getRelevantOverlays(o);if(p.value===true){this.executeWhenVisible(o,function(){this.evaluateEditable(r,{onRegistration:false});}.bind(this));}else{this.evaluateEditable(r,{onRegistration:false});}}else if(p.type==="afterRendering"){if(this.getDesignTime().getStatus()==="synced"){this.evaluateEditable([o],{onRegistration:false});}else{this.getDesignTime().attachEventOnce("synced",function(){this.evaluateEditable([o],{onRegistration:false});},this);}}else if(p.type==="insertAggregation"||p.type==="removeAggregation"){r=this._getRelevantOverlays(o,p.name);this.evaluateEditable(r,{onRegistration:false});}else if(p.type==="addOrSetAggregation"){if(this.getDesignTime().getStatus()==="synced"){r=this._getRelevantOverlays(o,p.name);this.evaluateEditable(r,{onRegistration:false});}else{this.getDesignTime().attachEventOnce("synced",function(){r=this._getRelevantOverlays(o,p.name);this.evaluateEditable(r,{onRegistration:false});},this);}}};B.prototype._getRelevantOverlays=function(o,A){var c=o.getRelevantOverlays();if(c.length===0){var r=a.findAllOverlaysInContainer(o);if(A){var d=o.getAggregationOverlay(A);var e=d?d.getChildren():[];e=e.filter(function(f){return r.indexOf(f)===-1;});r=r.concat(e);}o.setRelevantOverlays(r);return r;}return c;};B.prototype.evaluateEditable=function(o,p){if(!p.onRegistration&&this.getDesignTime()&&this.getDesignTime().getBusyPlugins().length){return;}this.setProcessingStatus(true);var c=o.reduce(_.bind(this,p),[]);if(c.length){Promise.all(c).then(function(){this.setProcessingStatus(false);}.bind(this)).catch(function(){this.setProcessingStatus(false);}.bind(this));}else{this.setProcessingStatus(false);}};B.prototype._handleModifyPluginList=function(o,e){if(e!==undefined&&e!==null){if(typeof e==="boolean"){this._modifyPluginList(o,e);}else{this._modifyPluginList(o,e.asChild,false);this._modifyPluginList(o,e.asSibling,true);}}};B.prototype._modifyPluginList=function(o,i,c){if(i){this.addToPluginsList(o,c);}else{this.removeFromPluginsList(o,c);}};B.prototype._retrievePluginName=function(s){var n=this.getMetadata().getName();if(s!==undefined){n+=s?".asSibling":".asChild";}return n;};B.prototype._isEditableByPlugin=function(o,s){var p=this._retrievePluginName(s);var c=o.getEditableByPlugins();return c.indexOf(p)>-1;};B.prototype.registerElementOverlay=function(o){this.executeWhenVisible(o,function(){this.evaluateEditable([o],{onRegistration:true});o.attachElementModified(b,this);}.bind(this));};B.prototype.deregisterElementOverlay=function(o){this.removeFromPluginsList(o);this.removeFromPluginsList(o,true);this.removeFromPluginsList(o,false);o.detachElementModified(b,this);};B.prototype.hasStableId=function(o){return h(o);};B.prototype.getVariantManagementReference=function(o){var v;if(o.getVariantManagement){v=o.getVariantManagement();}return v;};B.prototype.checkAggregationsOnSelf=function(o,A,p){var d=o.getDesignTimeMetadata();var e=o.getElement();var c=d.getActionDataFromAggregations(A,o.getElement());var f=c.filter(function(i){if(i&&p){return i.aggregation===p;}return true;})[0];var s=f?f.changeType:null;var g=f&&f.changeOnRelevantContainer;if(g){e=o.getRelevantContainer();var r=O.getOverlay(e);if(!this.hasStableId(r)){return Promise.resolve(false);}}if(s){return this.hasChangeHandler(s,e);}return Promise.resolve(false);};B.prototype.removeFromPluginsList=function(o,s){var n=this._retrievePluginName(s);o.removeEditableByPlugin(n);if(!o.getEditableByPlugins().length){o.setEditable(false);}};B.prototype.addToPluginsList=function(o,s){var n=this._retrievePluginName(s);var p=o.getEditableByPlugins();if(p.indexOf(n)===-1){o.addEditableByPlugin(n);o.setEditable(true);}};B.prototype.hasChangeHandler=function(c,e,s){s=s||e.getMetadata().getName();var l=this.getCommandFactory().getFlexSettings().layer;return C.getInstance().getChangeHandler(c,s,e,J,l).then(function(){return true;}).catch(function(){return false;});};B.prototype.isAvailable=function(e){return e.every(function(E){return this._isEditableByPlugin(E);},this);};B.prototype._checkRelevantContainerStableID=function(A,e){if(A.changeOnRelevantContainer){var r=e.getRelevantContainer();var R=O.getOverlay(r);if(!this.hasStableId(R)){return false;}}return true;};return B;});
