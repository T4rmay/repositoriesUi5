/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ComboBoxTextField','./ComboBoxBase','./List','./library','sap/ui/Device','sap/ui/core/Item','./StandardListItem','./ComboBoxRenderer','sap/ui/base/ManagedObjectObserver',"sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","./Toolbar","sap/base/assert","sap/base/security/encodeXML","sap/ui/core/Core","sap/ui/dom/jquery/control"],function(C,a,L,l,D,I,S,b,M,c,K,T,d,e,f,q){"use strict";var g=l.ListType;var h=l.ListMode;var j=a.extend("sap.m.ComboBox",{metadata:{library:"sap.m",designtime:"sap/m/designtime/ComboBox.designtime",properties:{selectedKey:{type:"string",group:"Data",defaultValue:""},selectedItemId:{type:"string",group:"Misc",defaultValue:""},filterSecondaryValues:{type:"boolean",group:"Misc",defaultValue:false}},associations:{selectedItem:{type:"sap.ui.core.Item",multiple:false}},events:{change:{parameters:{value:{type:"string"},itemPressed:{type:"boolean"}}},selectionChange:{parameters:{selectedItem:{type:"sap.ui.core.Item"}}}},dnd:{draggable:false,droppable:true}}});function H(o,i){if(!i){return;}var m=o.getFocusDomRef(),n=o._getSelectionRange().start,t=m.value.substring(0,m.selectionStart),p=o._shouldResetSelectionStart(i),r=o.getSelectedItem(),G=i.isA("sap.ui.core.SeparatorItem"),u;o.setSelection(i);if(i!==r&&!G){o.updateDomValue(i.getText());o.fireSelectionChange({selectedItem:i});i=o.getSelectedItem();if(p){n=0;}o.selectText(n,m.value.length);o._bIsLastFocusedItemHeader=false;}if(G){o.setSelectedItem(null);o.fireSelectionChange({selectedItem:null});o.updateDomValue(t);o._bIsLastFocusedItemHeader=true;o._handleAriaActiveDescendant(i);o._getGroupHeaderInvisibleText().setText(o._oRb.getText("LIST_ITEM_GROUP_HEADER")+" "+i.getText());}u=this.getListItem(i);o.handleListItemsVisualFocus(u);if(o.isOpen()){o.removeStyleClass("sapMFocus");o._getList().addStyleClass("sapMListFocus");}else{o.addStyleClass("sapMFocus");}o.scrollToItem(i);}j.prototype.scrollToItem=function(i){var p=this.getPicker(),P=p.getDomRef("cont"),o=this.getListItem(i),m=i&&o&&o.getDomRef();if(!p||!P||!m){return;}var n=P.scrollTop,r=m.offsetTop,t=P.clientHeight,u=m.offsetHeight;if(n>r){P.scrollTop=r;}else if((r+u)>(n+t)){P.scrollTop=Math.ceil(r+u-t);}};j.prototype._createSuggestionsPopover=function(){var r=a.prototype._createSuggestionsPopover.call(this,arguments);r._bEnableHighlighting=false;return r;};function s(i,E){if(document.activeElement===this.getFocusDomRef()){this.selectText(i,E);}}function k(i){var o=this.getSelectedItem(),m=this.getListItem(o),n=o&&m&&m.getDomRef(),p=n&&n.offsetTop,r=n&&n.offsetHeight,P=this.getPicker(),t=P.getDomRef("cont"),u=t.clientHeight;if(o&&((p+r)>(u))){if(!i){this._getList().$().css("visibility","hidden");}else{t.scrollTop=p-r/2;this._getList().$().css("visibility","visible");}}}j.prototype._handleAriaActiveDescendant=function(i){var o=this.getFocusDomRef(),m=this.getListItem(i),A="aria-activedescendant";if(o){if(i&&m&&m.getDomRef()&&this.isOpen()){o.setAttribute(A,m.getId());}else{o.removeAttribute(A);}}};j.prototype._getSelectedItemText=function(i){i=i||this.getSelectedItem();if(!i){i=this.getDefaultSelectedItem();}if(i){return i.getText();}return"";};j.prototype._setItemVisibility=function(i,v){var o=i&&this.getListItem(i).$(),m="sapMSelectListItemBaseInvisible";if(v){i.bVisible=true;o.length&&o.removeClass(m);}else{i.bVisible=false;o.length&&o.addClass(m);}};j.prototype.setSelectedIndex=function(i,_){var o;_=_||this.getItems();i=(i>_.length-1)?_.length-1:Math.max(0,i);o=_[i];if(o){this.setSelection(o);}};j.prototype.revertSelection=function(){var p,P=this.getPickerTextField();this.setSelectedItem(this._oSelectedItemBeforeOpen);this.setValue(this._sValueBeforeOpen);if(this.getSelectedItem()===null){p=this._sValueBeforeOpen;}else{p=this._oSelectedItemBeforeOpen.getText();}P&&P.setValue(p);};j.prototype.filterItems=function(o){var i=this.getItems(),F=[],m=[],n=o.properties.indexOf("additionalText")>-1,p=this.fnFilter||a.DEFAULT_TEXT_FILTER,G=[],r=false;this._oFirstItemTextMatched=null;i.forEach(function(t){if(t.isA("sap.ui.core.SeparatorItem")){if(!t.getText()){this.getListItem(t).setVisible(false);return;}G.push({separator:t,show:false});r=true;this.getListItem(t).setVisible(false);return;}var u=p.call(this,o.value,t,"getText");var v=p.call(this,o.value,t,"getAdditionalText");if((u||v)&&r){G[G.length-1].show=true;r=false;}if(u){m.push(t);F.push(t);}else if(v&&n){F.push(t);}}.bind(this));i.forEach(function(t){if(t.isA("sap.ui.core.SeparatorItem")){return;}var u=F.indexOf(t)>-1;var v=m.indexOf(t)>-1;if(!this._oFirstItemTextMatched&&v){this._oFirstItemTextMatched=t;}this.getListItem(t).setVisible(u);},this);G.forEach(function(t){if(t.show){this.getListItem(t.separator).setVisible(true);}}.bind(this));return F;};j.prototype._filterStartsWithItems=function(i,m){var n=i.toLowerCase();var o=this.getItems(),F=o.filter(function(p){return p[m]&&p[m]().toLowerCase().startsWith(n);});return F;};j.prototype._getFilters=function(){return this.getFilterSecondaryValues()?["text","additionalText"]:["text"];};j.prototype._handleFTValueState=function(){var o=this.getPicker().getCustomHeader(),v=this.getValueStateLinks(),p=D.browser.msie?o.getFormattedText():o;if(!v.length){return;}if(!this._bMessageValueStateActive){this.getFocusDomRef().setAttribute("aria-activedescendant",o.getFormattedText().getId());}p.toggleStyleClass("sapMPseudoFocus",!this._bMessageValueStateActive);this._bMessageValueStateActive=!this._bMessageValueStateActive;};j.prototype.valueStateFormattedTextNav=function(A,i,m){if(this._bMessageValueStateActive&&!m){this.addStyleClass("sapMFocus");this._handleFTValueState();return;}else if(this._bMessageValueStateActive&&m){this._handleFTValueState();this._getList().addStyleClass("sapMListFocus");this.getListItem(i).addStyleClass("sapMLIBFocused");}if(!this._bMessageValueStateActive&&i===A[0]&&!m&&this.getValueStateLinks().length){this._handleFTValueState();this._getList().removeStyleClass("sapMListFocus");this.getListItem(i).removeStyleClass("sapMLIBFocused");}};j.prototype.getNextFocusableItem=function(i){var A=this.getSelectableItems(),m=this.getNonSeparatorSelectableItems(A),F=this.hasStyleClass("sapMFocus"),o=this.getSelectedItem()||this._getItemByListItem(this._oLastFocusedListItem),n;if(F&&this.isOpen()&&!i&&this.getValueStateLinks().length){return null;}if((F&&this.isOpen())||(i&&this._bMessageValueStateActive)){n=A[0];}else if(F&&!this.getValueStateLinks().length){n=m[m.indexOf(o)+(i?1:-1)];}else{n=A[A.indexOf(o)+(i?1:-1)];}this.valueStateFormattedTextNav(A,o,i);return n;};j.prototype.getNonSeparatorSelectableItems=function(i){return i.filter(function(o){return!o.isA("sap.ui.core.SeparatorItem");});};j.prototype._itemsTextStartsWithTypedValue=function(i,t){if(!i||typeof t!="string"||t==""){return false;}return i.getText().toLowerCase().startsWith(t.toLowerCase());};j.prototype._shouldResetSelectionStart=function(i){var o=this.getFocusDomRef(),m=this._getSelectionRange(),n=m.start!==m.end,t=o.value.substring(0,m.start),p=this._itemsTextStartsWithTypedValue(i,t);return!(p&&(n||this._bIsLastFocusedItemHeader));};j.prototype._getSelectionRange=function(){var o=this.getFocusDomRef(),v=this.getValue(),i=o.selectionStart,m=o.selectionEnd,r={start:i,end:m};if(!(D.browser.msie||D.browser.edge)){return r;}if(this._bIsLastFocusedItemHeader){r.start=v.length;r.end=v.length;}return r;};j.prototype.handleListItemsVisualFocus=function(o){if(this._oLastFocusedListItem){this._oLastFocusedListItem.removeStyleClass("sapMLIBFocused");this._oLastFocusedListItem=null;}if(o){this._oLastFocusedListItem=o;o.addStyleClass("sapMLIBFocused");}};j.prototype.setSelection=function(i){var o=this._getList(),m,n;this.setAssociation("selectedItem",i,true);this.setProperty("selectedItemId",(i instanceof I)?i.getId():i,true);if(typeof i==="string"){i=f.byId(i);}if(o){m=this.getListItem(i);if(m){o.setSelectedItem(m,true);}else{o.removeSelections(true);}}n=i?i.getKey():"";this.setProperty("selectedKey",n,true);this._handleAriaActiveDescendant(i);if(this._oSuggestionPopover){this._oSuggestionPopover._iPopupListSelectedIndex=this.getItems().indexOf(i);}};j.prototype.isSelectionSynchronized=function(){var i=this.getSelectedItem();return this.getSelectedKey()===(i&&i.getKey());};j.prototype.isFiltered=function(){var o=this._getList();return o&&(o.getVisibleItems().length!==this.getItems().length);};j.prototype.isItemVisible=function(i){return i&&(i.bVisible===undefined||i.bVisible);};j.prototype._mapItemToListItem=function(i){var o,m,n,A;var r=this.getRenderer();if(!i){return null;}A=(i.getAdditionalText&&this.getShowSecondaryValues())?i.getAdditionalText():"";m=r.CSS_CLASS_COMBOBOXBASE+"Item";n=(this.isItemSelected(i))?m+"Selected":"";if(i.isA("sap.ui.core.SeparatorItem")){o=this._mapSeparatorItemToGroupHeader(i,r);}else{o=new S({type:g.Active,info:A,visible:i.getEnabled()}).addStyleClass(m+" "+n);}o.setTitle(i.getText());this.setSelectable(i,i.getEnabled());o.setTooltip(i.getTooltip());i.data(r.CSS_CLASS_COMBOBOXBASE+"ListItem",o);i.getCustomData().forEach(function(p){o.addCustomData(p.clone());});this._oItemObserver.observe(i,{properties:["text","additionalText","enabled","tooltip"]});return o;};j.prototype._forwardItemProperties=function(p){var i=p.object,o=i.data(this.getRenderer().CSS_CLASS_COMBOBOXBASE+"ListItem"),m={text:"title",enabled:"visible",tooltip:"tooltip"},A,P,n;if(Object.keys(m).indexOf(p.name)>-1){P=m[p.name];n="set"+P.charAt(0).toUpperCase()+P.slice(1);o[n](p.current);}if(p.name==="additionalText"){A=this.getShowSecondaryValues()?p.current:"";o.setInfo(A);}};j.prototype.isItemSelected=function(i){return i&&(i.getId()===this.getAssociation("selectedItem"));};j.prototype.setAssociation=function(A,i,m){var o=this._getList();if(o&&(A==="selectedItem")){if(!(i instanceof I)){i=this.findItem("id",i);}o.setSelectedItem(this.getListItem(i),true);}return a.prototype.setAssociation.apply(this,arguments);};j.prototype.removeAllAssociation=function(A,i){var o=this._getList();if(o&&(A==="selectedItem")){L.prototype.removeAllAssociation.apply(o,arguments);}return a.prototype.removeAllAssociation.apply(this,arguments);};j.prototype.init=function(){this._oRb=f.getLibraryResourceBundle("sap.m");a.prototype.init.apply(this,arguments);this.bOpenValueStateMessage=true;this._sValueBeforeOpen="";this._sInputValueBeforeOpen="";this._oSelectedItemBeforeOpen=null;this._oFirstItemTextMatched=null;this.bIsFocused=false;if(D.system.phone){this.attachEvent("_change",this.onPropertyChange,this);}this._oLastFocusedListItem=null;this._bIsLastFocusedItemHeader=null;this._oItemObserver=new M(this._forwardItemProperties.bind(this));};j.prototype.onBeforeRendering=function(){a.prototype.onBeforeRendering.apply(this,arguments);this.synchronizeSelection();};j.prototype._fillList=function(){var o=this._getList(),m,n,p,i,r;if(!o){return;}if(this._oLastFocusedListItem){r=this._getItemByListItem(this._oLastFocusedListItem);}o.destroyItems();m=this.getItems();if(this._sInputValueBeforeOpen){m=this.filterItems({properties:this._getFilters(),value:this._sInputValueBeforeOpen});}for(i=0,p=m.length;i<p;i++){n=this._mapItemToListItem(m[i]);o.addAggregation("items",n,true);}if(r){this._oLastFocusedListItem=this.getListItem(r);}};j.prototype.exit=function(){a.prototype.exit.apply(this,arguments);this._oRb=null;this._oSelectedItemBeforeOpen=null;this._oFirstItemTextMatched=null;this._oLastFocusedListItem=null;if(this._oSuggestionPopover){if(this._oPickerCustomHeader){this._oPickerCustomHeader.destroy();this._oPickerCustomHeader=null;}this._oSuggestionPopover.destroy();this._oSuggestionPopover=null;}if(this._oItemObserver){this._oItemObserver.disconnect();this._oItemObserver=null;}};j.prototype.onBeforeRenderingPicker=function(){var o=this["onBeforeRendering"+this.getPickerType()];o&&o.call(this);};j.prototype.onBeforeRenderingDropdown=function(){var p=this.getPicker(),w=(this.$().outerWidth()/parseFloat(l.BaseFontSize))+"rem";if(p){p.setContentMinWidth(w);}};j.prototype.onBeforeRenderingList=function(){if(this.bProcessingLoadItemsEvent){var o=this._getList(),F=this.getFocusDomRef();if(o){o.setBusy(true);}if(F){F.setAttribute("aria-busy","true");}}};j.prototype.onAfterRenderingPicker=function(){var o=this["onAfterRendering"+this.getPickerType()];o&&o.call(this);k.call(this,false);};j.prototype.onAfterRenderingList=function(){var o=this.getSelectedItem(),i=this.getListItem(o);if(this.bProcessingLoadItemsEvent&&(this.getItems().length===0)){return;}var m=this._getList(),F=this.getFocusDomRef();this._highlightList(this._sInputValueBeforeOpen);if(o){m.setSelectedItem(i);this.handleListItemsVisualFocus(i);}if(m){m.setBusy(false);}if(F){F.removeAttribute("aria-busy");}};j.prototype.oninput=function(E){a.prototype.oninput.apply(this,arguments);this.syncPickerContent();if(E.isMarked("invalid")){return;}this.loadItems(function(){this.handleInputValidation(E,this.isComposingCharacter());},{name:"input",busyIndicator:false});if(this.bProcessingLoadItemsEvent&&(this.getPickerType()==="Dropdown")){this.open();}this.addStyleClass("sapMFocus");this._getList().removeStyleClass("sapMListFocus");if(this._getItemsShownWithFilter()){this.toggleIconPressedStyle(true);}};j.prototype.handleInputValidation=function(E,i){var o=this.getSelectedItem(),v=E.target.value,m=v==="",n=E.srcControl,V,t=(this.getPickerType()==="Dropdown");if(m&&!this.bOpenedByKeyboardOrButton&&!this.isPickerDialog()){V=this.getItems();}else{V=this.filterItems({properties:this._getFilters(),value:v});}var p=!!V.length;var F=V[0];var r=V.some(function(u){return u.getKey()===this.getSelectedKey();},this);if(p&&this.getSelectedKey()&&!r){this.setProperty('selectedKey',null,false);}if(!m&&F&&F.getEnabled()){this.handleTypeAhead(n,V,v,i);}if(m||!p||(!n._bDoTypeAhead&&(this._getSelectedItemText()!==v))){this.setSelection(null);if(o!==this.getSelectedItem()){this.fireSelectionChange({selectedItem:this.getSelectedItem()});}}this._sInputValueBeforeOpen=v;if(this.isOpen()){setTimeout(function(){this._highlightList(v);}.bind(this));}if(p){if(m&&!this.bOpenedByKeyboardOrButton){this.close();}else if(t){this.open();this.scrollToItem(this.getSelectedItem());}}else if(this.isOpen()){if(t&&!this.bOpenedByKeyboardOrButton){this.close();}}else{this.clearFilter();}};j.prototype.handleTypeAhead=function(i,m,v,n){var o=this.intersectItems(this._filterStartsWithItems(v,'getText'),m);var p=this.getFilterSecondaryValues();var r=D.system.desktop;var t=this.getSelectedItem();if(i._bDoTypeAhead){var u=this.intersectItems(this._filterStartsWithItems(v,'getAdditionalText'),m);if(p&&!o[0]&&u[0]){!n&&i.updateDomValue(u[0].getAdditionalText());this.setSelection(u[0]);}else if(o[0]){!n&&i.updateDomValue(o[0].getText());this.setSelection(o[0]);}}else{this.setSelection(o[0]);}if(t!==this.getSelectedItem()){this.fireSelectionChange({selectedItem:this.getSelectedItem()});}if(i._bDoTypeAhead){if(r){s.call(i,v.length,i.getValue().length);}else{setTimeout(s.bind(i,v.length,i.getValue().length),0);}}this.addStyleClass("sapMFocus");this._getList().removeStyleClass("sapMListFocus");};j.prototype.onSelectionChange=function(o){var i=this._getItemByListItem(o.getParameter("listItem")),p=this.getChangeEventParams(),m=(i!==this.getSelectedItem());this.updateDomValue(i.getText());this.setSelection(i);this.fireSelectionChange({selectedItem:this.getSelectedItem()});if(m){p.itemPressed=true;this.onChange(null,p);}};j.prototype.onItemPress=function(o){var i=o.getParameter("listItem"),t=i.getTitle(),p=this.getChangeEventParams(),m=(i!==this.getListItem(this.getSelectedItem()));if(i.isA("sap.m.GroupHeaderListItem")){return;}this.handleListItemsVisualFocus(i);this.updateDomValue(t);if(!m){p.itemPressed=true;this.onChange(null,p);}this.setProperty("value",t,true);if(this.getPickerType()==="Dropdown"&&!this.isPlatformTablet()){this.selectText.bind(this,this.getValue().length,this.getValue().length);}this.close();};j.prototype.onBeforeOpen=function(){a.prototype.onBeforeOpen.apply(this,arguments);var p=this["onBeforeOpen"+this.getPickerType()],o=this.getFocusDomRef();if(this.hasLoadItemsEventListeners()&&!this.bProcessingLoadItemsEvent){this.loadItems();}if(o){o.setAttribute("aria-controls",this.getPicker().getId());}this.addContent();p&&p.call(this);};j.prototype.onBeforeOpenDialog=function(){var p=this.getPickerTextField();this._oSelectedItemBeforeOpen=this.getSelectedItem();this._sValueBeforeOpen=this.getValue();if(this.getSelectedItem()){this.filterItems({properties:this._getFilters(),value:""});}p.setValue(this._sValueBeforeOpen);};j.prototype.onAfterOpen=function(){var o=this.getFocusDomRef(),i=this.getSelectedItem(),m=this.getListItem(i),n=this._getSelectionRange(),p=(this.isPlatformTablet()&&D.os.android);this.closeValueStateMessage();if(o){o.setAttribute("aria-expanded","true");m&&o.setAttribute("aria-activedescendant",m.getId());}k.call(this,true);if(!p&&i&&n.start===n.end&&n.start>1){setTimeout(function(){this.selectText(0,n.end);}.bind(this),0);}};j.prototype.onBeforeClose=function(){a.prototype.onBeforeClose.apply(this,arguments);var o=this.getFocusDomRef();if(o){o.removeAttribute("aria-controls");o.removeAttribute("aria-activedescendant");}this.toggleIconPressedStyle(false);};j.prototype.onAfterClose=function(){var o=this.getFocusDomRef();if(o){o.setAttribute("aria-expanded","false");}this.clearFilter();this._sInputValueBeforeOpen="";if(this.shouldValueStateMessageBeOpened()&&(document.activeElement===o)){this.openValueStateMessage();}};j.prototype.onItemChange=function(o){var i=this.getAssociation("selectedItem"),n=o.getParameter("newValue"),p=o.getParameter("name");if(i===o.getParameter("id")){switch(p){case"text":if(!this.isBound("value")){this.setValue(n);}break;case"key":if(!this.isBound("selectedKey")){this.setSelectedKey(n);}break;}}};j.prototype.onkeydown=function(E){var o=E.srcControl;a.prototype.onkeydown.apply(o,arguments);if(!o.getEnabled()||!o.getEditable()){return;}var m=K;o._bDoTypeAhead=!D.os.android&&(E.which!==m.BACKSPACE)&&(E.which!==m.DELETE);};j.prototype.oncut=function(E){var o=E.srcControl;a.prototype.oncut.apply(o,arguments);o._bDoTypeAhead=false;};j.prototype.onsapenter=function(E){var o=E.srcControl,i=o.getSelectedItem();if(i&&this.getFilterSecondaryValues()){o.updateDomValue(i.getText());}a.prototype.onsapenter.apply(o,arguments);if(!o.getEnabled()||!o.getEditable()){return;}if(o.isOpen()&&!this.isComposingCharacter()){o.close();}};j.prototype.onsaptabnext=function(E){if(!this.getPicker()||!this.isOpen()){a.prototype.onsaptabnext.apply(this);return;}var o=this.getPicker().getCustomHeader(),v=this.getValueStateLinks(),i=v.length?v[o.getFormattedText().getControls().length-1]:null;if(this._bMessageValueStateActive&&v.length&&document.activeElement.tagName!=="A"){E.preventDefault();o.getFormattedText().getControls()[0].focus();E.stopPropagation();o.getFormattedText().removeStyleClass("sapMPseudoFocus");i.addDelegate({onsaptabnext:function(){this.close();if(D.browser.msie){setTimeout(function(){this.closeValueStateMessage();}.bind(this),0);}else{this.closeValueStateMessage();}this._bMessageValueStateActive=false;}},this);}};j.prototype.onsapdown=function(E){var o=E.srcControl;if(!o.getEnabled()||!o.getEditable()){return;}this.syncPickerContent();E.setMarked();E.preventDefault();this.loadItems(function navigateToNextSelectableItem(){H.call(this,o,this.getNextFocusableItem(true));});};j.prototype.onsapup=function(E){var o=E.srcControl;if(!o.getEnabled()||!o.getEditable()){return;}this.syncPickerContent();E.setMarked();E.preventDefault();this.loadItems(function navigateToPrevSelectableItem(){H.call(this,o,this.getNextFocusableItem(false));});};j.prototype.onsaphome=function(E){var o=E.srcControl;if(!o.getEnabled()||!o.getEditable()){return;}this.syncPickerContent();E.setMarked();E.preventDefault();this.loadItems(function navigateToFirstSelectableItem(){var F=this.getSelectableItems()[0];H.call(this,o,F);});};j.prototype.onsapend=function(E){var o=E.srcControl;if(!o.getEnabled()||!o.getEditable()){return;}this.syncPickerContent();E.setMarked();E.preventDefault();this.loadItems(function navigateToLastSelectableItem(){var i=this.findLastEnabledItem(this.getSelectableItems());H.call(this,o,i);});};j.prototype.onsappagedown=function(E){var o=E.srcControl;if(!o.getEnabled()||!o.getEditable()){return;}this.syncPickerContent();E.setMarked();E.preventDefault();this.loadItems(function(){var i=this.getNonSeparatorSelectableItems(this.getSelectableItems()),m=i.indexOf(this.getSelectedItem())+10,n;m=(m>i.length-1)?i.length-1:Math.max(0,m);n=i[m];H.call(this,o,n);});};j.prototype.onsappageup=function(E){var o=E.srcControl;if(!o.getEnabled()||!o.getEditable()){return;}this.syncPickerContent();E.setMarked();E.preventDefault();this.loadItems(function(){var i=this.getNonSeparatorSelectableItems(this.getSelectableItems()),m=i.indexOf(this.getSelectedItem())-10,n;m=(m>i.length-1)?i.length-1:Math.max(0,m);n=i[m];H.call(this,o,n);});};j.prototype.onsapshow=function(E){var i,o,m=this.getEditable(),n;a.prototype.onsapshow.apply(this,arguments);this.syncPickerContent();if(!this.getValue()&&m){i=this.getSelectableItems();o=this.getNonSeparatorSelectableItems(i)[0];if(o){n=this.getListItem(o);this.setSelection(o);this.updateDomValue(o.getText());this.fireSelectionChange({selectedItem:o});setTimeout(function(){this.selectText(0,o.getText().length);}.bind(this),0);if(this.isOpen()){this.removeStyleClass("sapMFocus");this._getList().addStyleClass("sapMListFocus");this.handleListItemsVisualFocus(n);}else{this.addStyleClass("sapMFocus");}}}};j.prototype.onsaphide=j.prototype.onsapshow;j.prototype.onfocusin=function(E){var i=this.getPickerType()==="Dropdown";if(this._bIsBeingDestroyed){return;}if(E.target===this.getOpenArea()){this.bOpenValueStateMessage=false;if(i&&!this.isPlatformTablet()){this.focus();}}else{if(i){setTimeout(function(){if(document.activeElement===this.getFocusDomRef()&&!this.bIsFocused&&!this.bFocusoutDueRendering&&!this.getSelectedText()){this.selectText(0,this.getValue().length);}this.bIsFocused=true;}.bind(this),0);}if(!this.isOpen()&&this.bOpenValueStateMessage&&this.shouldValueStateMessageBeOpened()){this.openValueStateMessage();}this.bOpenValueStateMessage=true;}if(this.getEnabled()&&(!this.isOpen()||!this.getSelectedItem()||!this._getList().hasStyleClass("sapMListFocus"))){this.addStyleClass("sapMFocus");}};j.prototype.onsapfocusleave=function(E){this.bIsFocused=false;var t,p,r,F,i=this.getSelectedItem();if(i&&this.getFilterSecondaryValues()){this.updateDomValue(i.getText());}a.prototype.onsapfocusleave.apply(this,arguments);if(this.isPickerDialog()){return;}p=this.getPicker();if(!E.relatedControlId||!p){return;}t=this.isPlatformTablet();r=f.byId(E.relatedControlId);F=r&&r.getFocusDomRef();if(c(p.getFocusDomRef(),F)&&!t&&!this._bMessageValueStateActive){this.focus();}};j.prototype.synchronizeSelection=function(){if(this.isSelectionSynchronized()){return;}var i=this.getSelectedKey(),v=this.getItemByKey(""+i);if(v&&(i!=="")){this.setAssociation("selectedItem",v,true);this.setProperty("selectedItemId",v.getId(),true);if(this._sValue===this.getValue()){this.setValue(v.getText());this._sValue=this.getValue();}}};j.prototype.configPicker=function(p){var r=this.getRenderer(),i=r.CSS_CLASS_COMBOBOXBASE;p.setHorizontalScrolling(false).addStyleClass(i+"Picker").addStyleClass(i+"Picker-CTX").attachBeforeOpen(this.onBeforeOpen,this).attachAfterOpen(this.onAfterOpen,this).attachBeforeClose(this.onBeforeClose,this).attachAfterClose(this.onAfterClose,this).addEventDelegate({onBeforeRendering:this.onBeforeRenderingPicker,onAfterRendering:this.onAfterRenderingPicker},this);};j.prototype._configureList=function(o){var r=this.getRenderer();if(!o){return;}o.setMode(h.SingleSelectMaster).addStyleClass(r.CSS_CLASS_COMBOBOXBASE+"List").addStyleClass(r.CSS_CLASS_COMBOBOX+"List");o.attachSelectionChange(this.onSelectionChange,this).attachItemPress(this.onItemPress,this);o.addEventDelegate({onBeforeRendering:this.onBeforeRenderingList,onAfterRendering:this.onAfterRenderingList},this);};j.prototype.destroyItems=function(){this.destroyAggregation("items");if(this._getList()){this._getList().destroyItems();}return this;};j.prototype.getDefaultSelectedItem=function(){return null;};j.prototype.getChangeEventParams=function(){return{itemPressed:false};};j.prototype.clearSelection=function(){this.setSelection(null);};j.prototype.selectText=function(i,m){a.prototype.selectText.apply(this,arguments);this.textSelectionStart=i;this.textSelectionEnd=m;return this;};j.prototype.removeAllItems=function(){var i=a.prototype.removeAllItems.apply(this,arguments);this._fillList();return i;};j.prototype.clone=function(i){var o=a.prototype.clone.apply(this,arguments),m=this._getList();if(!this.isBound("items")&&m){o.syncPickerContent();o.setSelectedIndex(this.indexOfItem(this.getSelectedItem()));}return o;};j.prototype.open=function(){this.syncPickerContent();var o=this._getList();a.prototype.open.call(this);if(this.getSelectedItem()){o.addStyleClass("sapMListFocus");this.removeStyleClass("sapMFocus");}return this;};j.prototype.syncPickerContent=function(){var p,P=this.getPicker(),i=this.getInputForwardableProperties();if(!P){var m,G;P=this.createPicker(this.getPickerType());p=this.getPickerTextField();this._updateSuggestionsPopoverValueState();this._fillList();if(p){i.forEach(function(n){n=n.charAt(0).toUpperCase()+n.slice(1);m="set"+n;G="get"+n;if(p[m]){p[m](this[G]());}},this);}}this.synchronizeSelection();return P;};j.prototype.close=function(){var o=this._getList();a.prototype.close.call(this);this.addStyleClass("sapMFocus");o&&o.removeStyleClass("sapMListFocus");return this;};j.prototype.findAggregatedObjects=function(){var o=this._getList();if(o){return L.prototype.findAggregatedObjects.apply(o,arguments);}return[];};j.prototype.setSelectedItem=function(i){if(typeof i==="string"){this.setAssociation("selectedItem",i,true);i=f.byId(i);}if(!(i instanceof I)&&i!==null){return this;}if(!i){i=this.getDefaultSelectedItem();}this.setSelection(i);this.setValue(this._getSelectedItemText(i));return this;};j.prototype.setSelectedItemId=function(i){i=this.validateProperty("selectedItemId",i);if(!i){i=this.getDefaultSelectedItem();}this.setSelection(i);i=this.getSelectedItem();this.setValue(this._getSelectedItemText(i));return this;};j.prototype.setSelectedKey=function(i){i=this.validateProperty("selectedKey",i);var m=(i===""),n=this.isBound("selectedKey")&&this.isBound("value")&&this.getBindingInfo("selectedKey").skipModelUpdate;if(m){this.setSelection(null);if(!n){this.setValue("");}return this;}var o=this.getItemByKey(i);if(o){this.setSelection(o);if(!n){this.setValue(this._getSelectedItemText(o));}return this;}this._sValue=this.getValue();return this.setProperty("selectedKey",i);};j.prototype.getSelectedItem=function(){var v=this.getAssociation("selectedItem");return(v===null)?null:f.byId(v)||null;};j.prototype.updateItems=function(){var r,o=this.getSelectedItem(),r=a.prototype.updateItems.apply(this,arguments);clearTimeout(this._debounceItemsUpdate);this._debounceItemsUpdate=setTimeout(this["_syncItemsSelection"].bind(this,o),0);return r;};j.prototype._syncItemsSelection=function(o){var i,n,m=this.getSelectedKey();if(!o||o===this.getSelectedItem()){return;}n=this.getItems();i=n.some(function(p){return m===p.getKey();});this.setSelectedItem(i&&m?this.getItemByKey(m):null);};j.prototype.removeItem=function(i){i=a.prototype.removeItem.apply(this,arguments);var o;if(this._getList()){this._getList().removeItem(i&&this.getListItem(i));}if(this.isBound("items")&&!this.bItemsUpdated){return i;}var v=this.getValue();if(this.getItems().length===0){this.clearSelection();}else if(this.isItemSelected(i)){o=this.getDefaultSelectedItem();this.setSelection(o);this.setValue(v);}return i;};j.prototype._modifyPopupInput=function(i){a.prototype._modifyPopupInput.apply(this,arguments);i.addEventDelegate({onsapenter:function(){var t=i.getValue();this.updateDomValue(t);this.onChange();if(t){this.updateDomValue(t);this.onChange();this.close();}}},this);return i;};j.prototype.applyShowItemsFilters=function(){var p,P;this.syncPickerContent();p=this.getPicker();P=function(){p.detachBeforeOpen(P,this);p=null;this.filterItems({value:this.getValue()||"_",properties:this._getFilters()});};p.attachBeforeOpen(P,this);};return j;});
