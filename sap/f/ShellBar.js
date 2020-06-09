/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","./shellBar/Factory","./shellBar/AdditionalContentSupport","./shellBar/ResponsiveHandler","./shellBar/Accessibility","sap/m/BarInPageEnabler","./ShellBarRenderer"],function(C,F,A,R,a,B){"use strict";var S=C.extend("sap.f.ShellBar",{metadata:{library:"sap.f",interfaces:["sap.f.IShellBar","sap.m.IBar","sap.tnt.IToolHeader"],properties:{title:{type:"string",group:"Appearance",defaultValue:""},secondTitle:{type:"string",group:"Appearance",defaultValue:""},homeIcon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:""},homeIconTooltip:{type:"string",group:"Appearance",defaultValue:""},showMenuButton:{type:"boolean",group:"Appearance",defaultValue:false},showNavButton:{type:"boolean",group:"Appearance",defaultValue:false},showCopilot:{type:"boolean",group:"Appearance",defaultValue:false},showSearch:{type:"boolean",group:"Appearance",defaultValue:false},showNotifications:{type:"boolean",group:"Appearance",defaultValue:false},showProductSwitcher:{type:"boolean",group:"Appearance",defaultValue:false},notificationsNumber:{type:"string",group:"Appearance",defaultValue:""}},aggregations:{menu:{type:"sap.m.Menu",multiple:false,forwarding:{getter:"_getMenu",aggregation:"menu"}},searchManager:{type:"sap.f.SearchManager",multiple:false},profile:{type:"sap.f.Avatar",multiple:false,forwarding:{getter:"_getProfile",aggregation:"avatar"}},additionalContent:{type:"sap.f.IShellBar",multiple:true,singularName:"additionalContent"},_overflowToolbar:{type:"sap.m.OverflowToolbar",multiple:false,visibility:"hidden"}},events:{homeIconPressed:{parameters:{icon:{type:"sap.m.Image"}}},menuButtonPressed:{parameters:{button:{type:"sap.m.Button"}}},navButtonPressed:{parameters:{button:{type:"sap.m.Button"}}},copilotPressed:{parameters:{image:{type:"sap.m.Image"}}},searchButtonPressed:{parameters:{button:{type:"sap.m.Button"}}},notificationsPressed:{parameters:{button:{type:"sap.m.Button"}}},productSwitcherPressed:{parameters:{button:{type:"sap.m.Button"}}},avatarPressed:{parameters:{avatar:{type:"sap.f.Avatar"}}}}}});A.apply(S.prototype);S.prototype.init=function(){this._oFactory=new F(this);this._bOTBUpdateNeeded=true;this._oOverflowToolbar=this._oFactory.getOverflowToolbar();this.setAggregation("_overflowToolbar",this._oOverflowToolbar);this._oToolbarSpacer=this._oFactory.getToolbarSpacer();this._oControlSpacer=this._oFactory.getControlSpacer();this._oResponsiveHandler=new R(this);this._aOverflowControls=[];this._oAcc=new a(this);};S.prototype.onBeforeRendering=function(){var n=this.getNotificationsNumber();this._assignControlsToOverflowToolbar();if(this.getShowNotifications()&&n!==undefined){this._updateNotificationsIndicators(n);}};S.prototype.exit=function(){this._oResponsiveHandler.exit();this._oFactory.destroy();this._oAcc.exit();};S.prototype.setHomeIcon=function(s){if(s){if(!this._oHomeIcon){this._oHomeIcon=this._oFactory.getHomeIcon();}this._oHomeIcon.setSrc(s);}else{this._oHomeIcon=null;}this._bOTBUpdateNeeded=true;return this.setProperty("homeIcon",s);};S.prototype.setHomeIconTooltip=function(t){var d=this._oAcc.getEntityTooltip("LOGO");if(!this._oHomeIcon){this._oHomeIcon=this._oFactory.getHomeIcon();}if(t){this._oHomeIcon.setTooltip(t);}else{this._oHomeIcon.setTooltip(d);}this._bOTBUpdateNeeded=false;return this.setProperty("homeIconTooltip",t,true);};S.prototype.setTitle=function(t){this._sTitle=t;if(!t){this._oPrimaryTitle=null;this._oMegaMenu=null;}else{if(!this._oMegaMenu){this._oMegaMenu=this._oFactory.getMegaMenu();}this._oMegaMenu.setText(t);if(!this._oPrimaryTitle){this._oPrimaryTitle=this._oFactory.getPrimaryTitle();}this._oPrimaryTitle.setText(t);}this._bOTBUpdateNeeded=true;return this.setProperty("title",t);};S.prototype.setSecondTitle=function(t){if(t){if(!this._oSecondTitle){this._oSecondTitle=this._oFactory.getSecondTitle();}this._oSecondTitle.setText(t);}else{this._oSecondTitle=null;}this._bOTBUpdateNeeded=true;return this.setProperty("secondTitle",t);};S.prototype.setShowCopilot=function(s){if(s){if(!this._oCopilot){this._oCopilot=this._oFactory.getCopilot();}}else{this._oCopilot=null;}this._bOTBUpdateNeeded=true;return this.setProperty("showCopilot",s);};S.prototype.setShowSearch=function(s){if(s){if(!this._oSearch){this._oSearch=this._oFactory.getSearch();}}else{this._oSearch=null;}this._bOTBUpdateNeeded=true;return this.setProperty("showSearch",s);};S.prototype.setSearchManager=function(c){this.setAggregation("searchManager",c);if(c){if(!this._oManagedSearch){this._oManagedSearch=this._oFactory.getManagedSearch();}}else{this._oManagedSearch=null;}this._bOTBUpdateNeeded=true;return this;};S.prototype.setShowNotifications=function(s){if(s){if(!this._oNotifications){this._oNotifications=this._oFactory.getNotifications();}}else{this._oNotifications=null;}this._bOTBUpdateNeeded=true;return this.setProperty("showNotifications",s);};S.prototype.setShowProductSwitcher=function(s){if(s){if(!this._oProductSwitcher){this._oProductSwitcher=this._oFactory.getProductSwitcher();}}else{this._oProductSwitcher=null;}this._bOTBUpdateNeeded=true;return this.setProperty("showProductSwitcher",s);};S.prototype.setShowNavButton=function(s){if(s){if(!this._oNavButton){this._oNavButton=this._oFactory.getNavButton();}}else{this._oNavButton=null;}this._bOTBUpdateNeeded=true;return this.setProperty("showNavButton",s);};S.prototype.setShowMenuButton=function(s){if(s){if(!this._oMenuButton){this._oMenuButton=this._oFactory.getMenuButton();}}else{this._oMenuButton=null;}this._bOTBUpdateNeeded=true;return this.setProperty("showMenuButton",s);};S.prototype.setNotificationsNumber=function(n){if(this.getShowNotifications()&&n!==undefined){this._updateNotificationsIndicators(n);this._oAcc.updateNotificationsNumber(n);}return this.setProperty("notificationsNumber",n,true);};S.prototype._addOTContent=function(c){c.addStyleClass("sapFShellBarItem");this._oOverflowToolbar.addContent(c);};S.prototype._assignControlsToOverflowToolbar=function(){var b;if(!this._oOverflowToolbar){return;}if(!this._bOTBUpdateNeeded){return;}this._aOverflowControls=[];this._oOverflowToolbar.removeAllContent();if(this._oNavButton){this._addOTContent(this._oNavButton);}if(this._oMenuButton){this._addOTContent(this._oMenuButton);}if(this._oHomeIcon){this._addOTContent(this._oHomeIcon);}this._oTitleControl=null;if(this.getShowMenuButton()&&this._oPrimaryTitle){this._addOTContent(this._oPrimaryTitle);this._oTitleControl=this._oPrimaryTitle;}else if(this._oMegaMenu){this._addOTContent(this._oMegaMenu);this._oTitleControl=this._oMegaMenu;}if(this._oSecondTitle){this._addOTContent(this._oSecondTitle);}if(this._oControlSpacer){this._addOTContent(this._oControlSpacer);}if(this._oCopilot){this._addOTContent(this._oCopilot);}this._addOTContent(this._oToolbarSpacer);if(this._oManagedSearch){this._addOTContent(this._oManagedSearch);this._aOverflowControls.push(this._oManagedSearch);}if(this._oSearch){this._addOTContent(this._oSearch);this._aOverflowControls.push(this._oSearch);}if(this._oNotifications){this._addOTContent(this._oNotifications);this._aOverflowControls.push(this._oNotifications);}b=this.getAdditionalContent();if(b){b.forEach(function(c){this._addOTContent(c);this._aOverflowControls.push(c);}.bind(this));}if(this._oAvatarButton){this._addOTContent(this._oAvatarButton);}if(this._oProductSwitcher){this._addOTContent(this._oProductSwitcher);}this._bOTBUpdateNeeded=false;};S.prototype._updateNotificationsIndicators=function(n){this._oOverflowToolbar._getOverflowButton().data("notifications",n,true);this._oNotifications.data("notifications",n,true);};S.prototype._getProfile=function(){this._oAvatarButton=this._oFactory.getAvatarButton();return this._oAvatarButton;};S.prototype._getMenu=function(){if(!this._oMegaMenu){this._oMegaMenu=this._oFactory.getMegaMenu();}return this._oMegaMenu;};S.prototype.onThemeChanged=function(){this._oResponsiveHandler._initResize();this._oResponsiveHandler._handleResize();};S.prototype._getOverflowToolbar=function(){return this._oOverflowToolbar;};S.prototype.getContext=B.prototype.getContext;S.prototype.isContextSensitive=B.prototype.isContextSensitive;S.prototype.setHTMLTag=B.prototype.setHTMLTag;S.prototype.getHTMLTag=B.prototype.getHTMLTag;S.prototype.applyTagAndContextClassFor=B.prototype.applyTagAndContextClassFor;S.prototype._applyContextClassFor=B.prototype._applyContextClassFor;S.prototype._applyTag=B.prototype._applyTag;S.prototype._getContextOptions=B.prototype._getContextOptions;S.prototype._setRootAccessibilityRole=B.prototype._setRootAccessibilityRole;S.prototype._getRootAccessibilityRole=B.prototype._getRootAccessibilityRole;S.prototype._setRootAriaLevel=B.prototype._setRootAriaLevel;S.prototype._getRootAriaLevel=B.prototype._getRootAriaLevel;return S;});