/*
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/SelectionModel','./SelectionPlugin',"../utils/TableUtils",'../library'],function(S,a,T,l){"use strict";var b=l.SelectionMode;var c=a.extend("sap.ui.table.plugins.SelectionModelSelection",{metadata:{library:"sap.ui.table",events:{selectionChange:{parameters:{indices:{type:"int[]"},selectAll:{type:"boolean"}}}}}});c.prototype.init=function(){a.prototype.init.apply(this,arguments);this.oSelectionModel=new S(this._getSelectionMode);};c.prototype.exit=function(){a.prototype.exit.apply(this,arguments);if(this.oSelectionModel){this.oSelectionModel.destroy();this.oSelectionModel=null;}};c.prototype.onActivate=function(){a.prototype.onActivate.apply(this,arguments);this.oSelectionModel.attachSelectionChanged(this._onSelectionChange,this);};c.prototype.onDeactivate=function(){a.prototype.onDeactivate.apply(this,arguments);this.oSelectionModel.detachSelectionChanged(this._onSelectionChange,this);this.oSelectionModel.clearSelection();e(this,this.getTableBinding());};c.prototype.getRenderConfig=function(){return{headerSelector:{type:"toggle",visible:T.hasSelectAll(this.getTable())}};};c.prototype.onHeaderSelectorPress=function(){if(this.getRenderConfig().headerSelector.visible){this.getTable()._toggleSelectAll();}};c.prototype.onKeyboardShortcut=function(t){if(t==="toggle"){this.getTable()._toggleSelectAll();}else if(t==="clear"){this.clearSelection();}};c.prototype.addSelectionInterval=function(i,I){if(!this.oSelectionModel||this._getSelectionMode()===b.None){return;}this.oSelectionModel.addSelectionInterval(i,I);};c.prototype.clearSelection=function(){if(this.oSelectionModel){this.oSelectionModel.clearSelection();}};c.prototype.getSelectedIndex=function(){if(this.oSelectionModel){return this.oSelectionModel.getLeadSelectedIndex();}return-1;};c.prototype.getSelectedIndices=function(){if(this.oSelectionModel){return this.oSelectionModel.getSelectedIndices();}return[];};c.prototype.getSelectableCount=function(){var B=this.getTableBinding();return B?B.getLength():0;};c.prototype.getSelectedCount=function(){return this.getSelectedIndices().length;};c.prototype.isIndexSelectable=function(i){return i>=0&&i<=this._getHighestSelectableIndex();};c.prototype.isIndexSelected=function(i){return this.getSelectedIndices().indexOf(i)!==-1;};c.prototype.removeSelectionInterval=function(i,I){if(this.oSelectionModel){this.oSelectionModel.removeSelectionInterval(i,I);}};c.prototype.selectAll=function(){if(!this.oSelectionModel||this._getSelectionMode()===b.None){return;}this.oSelectionModel.selectAll(this._getHighestSelectableIndex());};c.prototype.setSelectedIndex=function(i){if(this._getSelectionMode()===b.None){return;}if(i===-1){this.clearSelection();}else{this.setSelectionInterval(i,i);}};c.prototype.setSelectionInterval=function(i,I){if(!this.oSelectionModel||this._getSelectionMode()===b.None){return;}this.oSelectionModel.setSelectionInterval(i,I);};c.prototype.setSelectionMode=function(s){var o=this._getSelectionMode();a.prototype._setSelectionMode.apply(this,arguments);if(this._getSelectionMode()!==o){this.clearSelection();}if(this.oSelectionModel){var i=(s===b.MultiToggle?S.MULTI_SELECTION:S.SINGLE_SELECTION);this.oSelectionModel.setSelectionMode(i);}return this;};c.prototype._getHighestSelectableIndex=function(){var B=this.getTableBinding();return B?B.getLength()-1:-1;};c.prototype._onSelectionChange=function(E){var r=E.getParameter("rowIndices");var s=E.getParameter("selectAll");this.fireSelectionChange({rowIndices:r,selectAll:s});};c.prototype.onTableRowsBound=function(B){a.prototype.onTableRowsBound.apply(this,arguments);d(this,B);};c.prototype.onTableUnbindRows=function(){a.prototype.onTableUnbindRows.apply(this,arguments);this._suspend();this.clearSelection();this._resume();};function d(p,B){if(B){B.attachChange(p._onBindingChange,p);}}function e(p,B){if(B){B.detachChange(p._onBindingChange,p);}}c.prototype._onBindingChange=function(E){var r=typeof(E)==="object"?E.getParameter("reason"):E;if(r==="sort"||r==="filter"){this.clearSelection();}};return c;});