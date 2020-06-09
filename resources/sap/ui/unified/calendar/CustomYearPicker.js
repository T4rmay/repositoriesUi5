/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer","sap/ui/unified/Calendar","sap/ui/unified/CalendarRenderer","sap/ui/unified/calendar/Header","sap/ui/unified/DateRange"],function(R,C,a,H,D){"use strict";var b=R.extend(a);b.apiVersion=2;var c=C.extend("sap.ui.unified.internal.CustomYearPicker",{renderer:b});c.prototype._initializeHeader=function(){var h=new H(this.getId()+"--Head",{visibleButton1:false});h.attachEvent("pressPrevious",this._handlePrevious,this);h.attachEvent("pressNext",this._handleNext,this);h.attachEvent("pressButton2",this._handleButton2,this);this._afterHeaderRenderAdjustCSS=this._createOnAfterRenderingDelegate(h);h.addDelegate(this._afterHeaderRenderAdjustCSS);this.setAggregation("header",h);};c.prototype.onBeforeRendering=function(){var h=this.getAggregation("header");C.prototype.onBeforeRendering.call(this,arguments);h.setVisibleButton1(false);h.setVisibleButton2(true);};c.prototype.onAfterRendering=function(){C.prototype.onAfterRendering.apply(this,arguments);this._showYearPicker();};c.prototype.onThemeChanged=function(){C.prototype.onThemeChanged.apply(this,arguments);};c.prototype._selectYear=function(){var d=this.getSelectedDates()[0],y=this._getYearPicker();if(!d){d=new D();}if(!y.getIntervalSelection()){d.setStartDate(this._getYearPicker().getDate());this.addSelectedDate(d);}this.fireSelect();};c.prototype.onsapescape=function(e){this.fireCancel();};return c;});
