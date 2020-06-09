/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Control',"sap/ui/core/Core",'sap/ui/core/delegate/ItemNavigation','./IconTabBarDragAndDropUtil','./IconTabBarSelectListRenderer',"sap/ui/thirdparty/jquery"],function(l,C,a,I,b,c,q){"use strict";var d=C.extend("sap.m.IconTabBarSelectList",{metadata:{library:"sap.m",aggregations:{items:{type:"sap.m.IconTabFilter",multiple:true,singularName:"item",dnd:true}},events:{selectionChange:{parameters:{selectedItem:{type:"sap.m.IconTabFilter"}}}}}});d.prototype.init=function(){this._oItemNavigation=new I();this._oItemNavigation.setCycling(false);this.addEventDelegate(this._oItemNavigation);this._oItemNavigation.setPageSize(10);this._oIconTabHeader=null;this._oTabFilter=null;};d.prototype.exit=function(){this._oItemNavigation.destroy();this._oItemNavigation=null;this._oIconTabHeader=null;this._oTabFilter=null;};d.prototype.onBeforeRendering=function(){if(!this._oIconTabHeader){return;}this._setsDragAndConfiguration();};d.prototype.onAfterRendering=function(){this._initItemNavigation();};d.prototype._setsDragAndConfiguration=function(){if(!this._oIconTabHeader.getEnableTabReordering()&&this.getDragDropConfig().length){this.destroyDragDropConfig();}else if(this._oIconTabHeader.getEnableTabReordering()&&!this.getDragDropConfig().length){b.setDragDropAggregations(this,"Vertical");}};d.prototype._initItemNavigation=function(){var e=this.getItems(),D=[],p=this._oIconTabHeader.oSelectedItem,s=-1,o,i;for(i=0;i<e.length;i++){o=e[i];if(o.isA("sap.m.IconTabFilter")){var f=o._getAllSubFiltersDomRefs();D=D.concat(o.getDomRef(),f);}if(p&&this.getSelectedItem()&&this.getSelectedItem()._getRealTab()===p){s=i;}}if(p&&D.indexOf(p.getDomRef())!==-1){s=D.indexOf(p.getDomRef());}this._oItemNavigation.setRootDomRef(this.getDomRef()).setItemDomRefs(D).setSelectedIndex(s);};d.prototype.getVisibleItems=function(){return this.getItems().filter(function(i){return i.getVisible();});};d.prototype.setSelectedItem=function(i){this._selectedItem=i;};d.prototype.getSelectedItem=function(){return this._selectedItem;};d.prototype.ontap=function(e){var $=q(e.target);if(!$.hasClass("sapMITBSelectItem")){$=$.parent(".sapMITBSelectItem");}var f=a.byId($[0].id);if(!f||this._oIconTabHeader._isUnselectable(f)){return;}e.preventDefault();if(f!=this.getSelectedItem()){this.fireSelectionChange({selectedItem:f});}};d.prototype.onsapenter=d.prototype.ontap;d.prototype.onsapspace=d.prototype.ontap;d.prototype.checkIconOnly=function(){var i=this.getVisibleItems();this._bIconOnly=i.every(function(o){return!o.getText()&&!o.getCount();});return this._bIconOnly;};d.prototype._handleDragAndDrop=function(e){var D=e.getParameter("dropPosition"),o=e.getParameter("draggedControl"),f=e.getParameter("droppedControl");b.handleDrop(this._oIconTabHeader,D,o._getRealTab(),f._getRealTab(),true);this._oIconTabHeader._setItemsForStrip();this._oIconTabHeader._initItemNavigation();this._oTabFilter._setSelectListItems();this._initItemNavigation();o.$().focus();};d.prototype.ondragrearranging=function(e){if(!this._oIconTabHeader.getEnableTabReordering()){return;}var t=e.srcControl,k=e.keyCode;b.moveItem.call(this,t,k);this._initItemNavigation();t.$().focus();this._oIconTabHeader._moveTab(t._getRealTab(),k);};d.prototype.onsaphomemodifiers=d.prototype.ondragrearranging;d.prototype.onsapendmodifiers=d.prototype.ondragrearranging;d.prototype.onsapincreasemodifiers=d.prototype.ondragrearranging;d.prototype.onsapdecreasemodifiers=d.prototype.ondragrearranging;return d;});
