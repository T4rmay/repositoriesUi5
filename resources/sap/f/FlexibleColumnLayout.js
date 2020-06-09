/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/Device","sap/ui/core/ResizeHandler","sap/ui/core/Control","sap/m/library","sap/m/Button","sap/m/NavContainer","sap/ui/core/Configuration","sap/ui/core/theming/Parameters",'sap/ui/dom/units/Rem',"./FlexibleColumnLayoutRenderer","sap/base/assert"],function(q,l,D,R,C,m,B,N,a,P,b,F,c){"use strict";var L=l.LayoutType;var d=C.extend("sap.f.FlexibleColumnLayout",{metadata:{properties:{autoFocus:{type:"boolean",group:"Behavior",defaultValue:true},layout:{type:"sap.f.LayoutType",defaultValue:L.OneColumn},defaultTransitionNameBeginColumn:{type:"string",group:"Appearance",defaultValue:"slide"},defaultTransitionNameMidColumn:{type:"string",group:"Appearance",defaultValue:"slide"},defaultTransitionNameEndColumn:{type:"string",group:"Appearance",defaultValue:"slide"},backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:m.BackgroundDesign.Transparent},restoreFocusOnBackNavigation:{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{beginColumnPages:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getBeginColumn",aggregation:"pages"}},midColumnPages:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getMidColumn",aggregation:"pages"}},endColumnPages:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getEndColumn",aggregation:"pages"}},_beginColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_midColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_endColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_beginColumnBackArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_midColumnForwardArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_midColumnBackArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_endColumnForwardArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},associations:{initialBeginColumnPage:{type:"sap.ui.core.Control",multiple:false},initialMidColumnPage:{type:"sap.ui.core.Control",multiple:false},initialEndColumnPage:{type:"sap.ui.core.Control",multiple:false}},events:{stateChange:{parameters:{layout:{type:"sap.f.LayoutType"},maxColumnsCount:{type:"int"},isNavigationArrow:{type:"boolean"},isResize:{type:"boolean"}}},beginColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterBeginColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},midColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterMidColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},endColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterEndColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},columnResize:{parameters:{beginColumn:{type:"boolean"},midColumn:{type:"boolean"},endColumn:{type:"boolean"}}}}}});d.COLUMN_RESIZING_ANIMATION_DURATION=560;d.PINNED_COLUMN_CLASS_NAME="sapFFCLPinnedColumn";d.COLUMN_ORDER=["begin","mid","end"];d.prototype.init=function(){this._iWidth=0;this._oColumnFocusInfo={beginColumn:{},midColumn:{},endColumn:{}};this._initNavContainers();this._initButtons();this._oLayoutHistory=new e();this._oRenderedColumnPagesBoolMap={};this._iNavigationArrowWidth=b.toPx(P.get("_sap_f_FCL_navigation_arrow_width"));this._oColumnWidthInfo={beginColumn:0,midColumn:0,endColumn:0};};d.prototype._onNavContainerRendered=function(E){var o=E.srcControl,h=o.getPages().length>0,H=this._hasAnyColumnPagesRendered();this._setColumnPagesRendered(o.getId(),h);if(this._hasAnyColumnPagesRendered()!==H){this._hideShowArrows();}};d.prototype._createNavContainer=function(s){var f=s.charAt(0).toUpperCase()+s.slice(1);var n=new N(this.getId()+"-"+s+"ColumnNav",{autoFocus:this.getAutoFocus(),navigate:function(E){this._handleNavigationEvent(E,false,s);}.bind(this),afterNavigate:function(E){this._handleNavigationEvent(E,true,s);}.bind(this),defaultTransitionName:this["getDefaultTransitionName"+f+"Column"]()});n.addDelegate({"onAfterRendering":this._onNavContainerRendered},this);this["_"+s+'ColumnFocusOutDelegate']={onfocusout:function(E){this._oColumnFocusInfo[s+"Column"]=E.target;}};n.addEventDelegate(this["_"+s+'ColumnFocusOutDelegate'],this);return n;};d.prototype._handleNavigationEvent=function(E,A,s){var f,h;if(A){f="after"+(s.charAt(0).toUpperCase()+s.slice(1))+"ColumnNavigate";}else{f=s+"ColumnNavigate";}h=this.fireEvent(f,E.mParameters,true);if(!h){E.preventDefault();}};d.prototype._getColumnByStringName=function(s){if(s==='end'){return this._getEndColumn();}else if(s==='mid'){return this._getMidColumn();}else{return this._getBeginColumn();}};d.prototype._getBeginColumn=function(){return this.getAggregation("_beginColumnNav");};d.prototype._getMidColumn=function(){return this.getAggregation("_midColumnNav");};d.prototype._getEndColumn=function(){return this.getAggregation("_endColumnNav");};d.prototype._flushColumnContent=function(s){var o=this.getAggregation("_"+s+"ColumnNav"),r=sap.ui.getCore().createRenderManager();r.renderControl(o);r.flush(this._$columns[s].find(".sapFFCLColumnContent")[0],undefined,true);r.destroy();};d.prototype.setLayout=function(n){n=this.validateProperty("layout",n);var s=this.getLayout();if(s===n){return this;}var r=this.setProperty("layout",n,true);this._oLayoutHistory.addEntry(n);this._hideShowArrows();this._resizeColumns();return r;};d.prototype.setAutoFocus=function(n){n=this.validateProperty("autoFocus",n);var f=this.getAutoFocus();if(f===n){return this;}this._getNavContainers().forEach(function(o){o.setAutoFocus(n);});return this.setProperty("autoFocus",n,true);};d.prototype.onBeforeRendering=function(){this._deregisterResizeHandler();};d.prototype.onAfterRendering=function(){this._measureControlWidth();this._registerResizeHandler();this._cacheDOMElements();this._hideShowArrows();this._resizeColumns();this._flushColumnContent("begin");this._flushColumnContent("mid");this._flushColumnContent("end");this._fireStateChange(false,false);};d.prototype._restoreFocusToColumn=function(s){q(this._oColumnFocusInfo[s]).focus();};d.prototype._isFocusInSomeOfThePreviousColumns=function(){var i=d.COLUMN_ORDER.indexOf(this._sPreviuosLastVisibleColumn)-1,o;for(;i>=0;i--){o=this._getColumnByStringName(d.COLUMN_ORDER[i]);if(o&&o._isFocusInControl(o)){return true;}}return false;};d.prototype._getControlWidth=function(){if(this._iWidth===0){this._measureControlWidth();}return this._iWidth;};d.prototype._measureControlWidth=function(){if(this.$().is(":visible")){this._iWidth=this.$().width();}else{this._iWidth=0;}};d.prototype.exit=function(){this._removeNavContainersFocusOutDelegate();this._oRenderedColumnPagesBoolMap=null;this._oColumnFocusInfo=null;this._deregisterResizeHandler();this._handleEvent(q.Event("Destroy"));};d.prototype._removeNavContainersFocusOutDelegate=function(){d.COLUMN_ORDER.forEach(function(s){this._getColumnByStringName(s).removeEventDelegate(this["_"+s+"ColumnFocusOutDelegate"]);},this);};d.prototype._registerResizeHandler=function(){c(!this._iResizeHandlerId,"Resize handler already registered");this._iResizeHandlerId=R.register(this,this._onResize.bind(this));};d.prototype._deregisterResizeHandler=function(){if(this._iResizeHandlerId){R.deregister(this._iResizeHandlerId);this._iResizeHandlerId=null;}};d.prototype._initNavContainers=function(){this.setAggregation("_beginColumnNav",this._createNavContainer("begin"),true);this.setAggregation("_midColumnNav",this._createNavContainer("mid"),true);this.setAggregation("_endColumnNav",this._createNavContainer("end"),true);};d.prototype._getNavContainers=function(){return[this._getBeginColumn(),this._getMidColumn(),this._getEndColumn()];};d.prototype._initButtons=function(){var o=new B(this.getId()+"-beginBack",{icon:"sap-icon://slim-arrow-left",tooltip:d._getResourceBundle().getText("FCL_BEGIN_COLUMN_BACK_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"left")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonRight");this.setAggregation("_beginColumnBackArrow",o,true);var M=new B(this.getId()+"-midForward",{icon:"sap-icon://slim-arrow-right",tooltip:d._getResourceBundle().getText("FCL_MID_COLUMN_FORWARD_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"right")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonLeft");this.setAggregation("_midColumnForwardArrow",M,true);var f=new B(this.getId()+"-midBack",{icon:"sap-icon://slim-arrow-left",tooltip:d._getResourceBundle().getText("FCL_MID_COLUMN_BACK_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"left")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonRight");this.setAggregation("_midColumnBackArrow",f,true);var E=new B(this.getId()+"-endForward",{icon:"sap-icon://slim-arrow-right",tooltip:d._getResourceBundle().getText("FCL_END_COLUMN_FORWARD_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"right")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonLeft");this.setAggregation("_endColumnForwardArrow",E,true);};d.prototype._cacheDOMElements=function(){this._cacheColumns();if(!D.system.phone){this._cacheArrows();}};d.prototype._cacheColumns=function(){this._$columns={begin:this.$("beginColumn"),mid:this.$("midColumn"),end:this.$("endColumn")};};d.prototype._cacheArrows=function(){this._oColumnSeparatorArrows={beginBack:this.$("beginBack"),midForward:this.$("midForward"),midBack:this.$("midBack"),endForward:this.$("endForward")};};d.prototype._getVisibleColumnsCount=function(){return d.COLUMN_ORDER.filter(function(s){return this._getColumnSize(s)>0;},this).length;};d.prototype._getVisibleArrowsCount=function(){if(!this._oColumnSeparatorArrows){return 0;}return Object.keys(this._oColumnSeparatorArrows).filter(function(A){return this._oColumnSeparatorArrows[A].data("visible");},this).length;};d.prototype._getTotalColumnsWidth=function(h){var s=this._getVisibleArrowsCount();if(h){s++;}return this._getControlWidth()-s*this._iNavigationArrowWidth;};d.prototype._resizeColumns=function(){var p,A,f=d.COLUMN_ORDER.slice(),r=sap.ui.getCore().getConfiguration().getRTL(),s=sap.ui.getCore().getConfiguration().getAnimationMode(),h=s!==a.AnimationMode.none&&s!==a.AnimationMode.minimal,i,v,j,k,n,I,o;if(!this.isActive()){return;}v=this._getVisibleColumnsCount();if(v===0){return;}k=this.getLayout();j=this._getMaxColumnsCountForLayout(k,d.DESKTOP_BREAKPOINT);n=f[j-1];o=this.getRestoreFocusOnBackNavigation()&&this._isNavigatingBackward(n)&&!this._isFocusInSomeOfThePreviousColumns();I=(v===3)&&(k===L.ThreeColumnsEndExpanded);A=this._getTotalColumnsWidth(I);if(h){f.forEach(function(t){var S=this._shouldConcealColumn(j,t),u=this._shouldRevealColumn(j,t===n),w=this._$columns[t];w.toggleClass(d.PINNED_COLUMN_CLASS_NAME,S||u);},this);}f.forEach(function(t){var u=this._$columns[t],w,x,S,y;p=this._getColumnSize(t);S=h&&this._shouldConcealColumn(j,t);y=o&&(t===n);if(!S){u.toggleClass("sapFFCLColumnActive",p>0);}u.toggleClass("sapFFCLColumnInset",I&&(t==="mid"));u.removeClass("sapFFCLColumnHidden");u.removeClass("sapFFCLColumnOnlyActive");u.removeClass("sapFFCLColumnLastActive");u.removeClass("sapFFCLColumnFirstActive");w=Math.round(A*(p/100));if([100,0].indexOf(p)!==-1){x=p+"%";}else{x=w+"px";}if(h){var z=u.get(0);if(u._iResumeResizeHandlerTimeout){clearTimeout(u._iResumeResizeHandlerTimeout);}R.suspend(z);u._iResumeResizeHandlerTimeout=setTimeout(this._adjustColumnAfterAnimation.bind(this,S,x,w,u,z,y),d.COLUMN_RESIZING_ANIMATION_DURATION);}else{this._adjustColumnDisplay(u,w,y);}if(!S){u.width(x);}if(!D.system.phone){this._updateColumnContextualSettings(t,w);this._updateColumnCSSClasses(t,w);}},this);i=f.filter(function(t){return this._getColumnSize(t)>0;},this);if(r){f.reverse();}if(i.length===1){this._$columns[i[0]].addClass("sapFFCLColumnOnlyActive");}if(i.length>1){this._$columns[i[0]].addClass("sapFFCLColumnFirstActive");this._$columns[i[i.length-1]].addClass("sapFFCLColumnLastActive");}this._storePreviousResizingInfo(j,n);};d.prototype._adjustColumnAfterAnimation=function(s,n,i,o,f,S){if(s){o.width(n);o.toggleClass("sapFFCLColumnActive",false);}o.toggleClass(d.PINNED_COLUMN_CLASS_NAME,false);this._adjustColumnDisplay(o,i,S);this._resumeResizeHandler(o,f);};d.prototype._resumeResizeHandler=function(o,f){R.resume(f);o._iResumeResizeHandlerTimeout=null;};d.prototype._adjustColumnDisplay=function(o,n,s){var f={beginColumn:o.hasClass("sapFFCLColumnBegin"),midColumn:o.hasClass("sapFFCLColumnMid"),endColumn:o.hasClass("sapFFCLColumnEnd")},h=g(f);if(n===0){o.addClass("sapFFCLColumnHidden");}else{o.removeClass("sapFFCLColumnHidden");}if(this._oColumnWidthInfo[h]!==n){this.fireColumnResize(f);if(s){this._restoreFocusToColumn(h);}}this._oColumnWidthInfo[h]=n;};d.prototype._storePreviousResizingInfo=function(v,s){var o=this.getLayout();this._iPreviousVisibleColumnsCount=v;this._bWasFullScreen=o===L.MidColumnFullScreen||o===L.EndColumnFullScreen;this._sPreviuosLastVisibleColumn=s;};d.prototype._isNavigatingBackward=function(s){return this._bWasFullScreen||d.COLUMN_ORDER.indexOf(this._sPreviuosLastVisibleColumn)>d.COLUMN_ORDER.indexOf(s);};d.prototype._shouldRevealColumn=function(v,i){return(v>this._iPreviousVisibleColumnsCount)&&!this._bWasFullScreen&&i;};d.prototype._shouldConcealColumn=function(v,s){return(v<this._iPreviousVisibleColumnsCount&&s===this._sPreviuosLastVisibleColumn&&!this._bWasFullScreen&&this._getColumnSize(s)===0);};d.prototype._propagateContextualSettings=function(){};d.prototype._updateColumnContextualSettings=function(s,w){var o,f;o=this.getAggregation("_"+s+"ColumnNav");if(!o){return;}f=o._getContextualSettings();if(!f||f.contextualWidth!==w){o._applyContextualSettings({contextualWidth:w});}};d.prototype._updateColumnCSSClasses=function(s,w){var n="";this._$columns[s].removeClass("sapUiContainer-Narrow sapUiContainer-Medium sapUiContainer-Wide sapUiContainer-ExtraWide");if(w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[0]){n="Narrow";}else if(w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[1]){n="Medium";}else if(w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[2]){n="Wide";}else{n="ExtraWide";}this._$columns[s].addClass("sapUiContainer-"+n);};d.prototype._getColumnSize=function(s){var f=this.getLayout(),h=this._getColumnWidthDistributionForLayout(f),S=h.split("/"),M={begin:0,mid:1,end:2},i=S[M[s]];return parseInt(i);};d.prototype.getMaxColumnsCount=function(){return this._getMaxColumnsCountForWidth(this._getControlWidth());};d.prototype._getMaxColumnsCountForWidth=function(w){if(w>=d.DESKTOP_BREAKPOINT){return 3;}if(w>=d.TABLET_BREAKPOINT&&w<d.DESKTOP_BREAKPOINT){return 2;}if(w>0){return 1;}return 0;};d.prototype._getMaxColumnsCountForLayout=function(s,w){var i=this._getMaxColumnsCountForWidth(w),f=this._getColumnWidthDistributionForLayout(s,false,i),S=f.split("/"),M={begin:0,mid:1,end:2},h,j,k=0;Object.keys(M).forEach(function(n){h=S[M[n]];j=parseInt(h);if(j){k++;}});return k;};d.prototype._onResize=function(E){var o=E.oldSize.width,n=E.size.width,O,M;this._iWidth=n;if(n===0){return;}O=this._getMaxColumnsCountForWidth(o);M=this._getMaxColumnsCountForWidth(n);this._resizeColumns();if(M!==O){this._hideShowArrows();this._fireStateChange(false,true);}};d.prototype._setColumnPagesRendered=function(i,h){this._oRenderedColumnPagesBoolMap[i]=h;};d.prototype._hasAnyColumnPagesRendered=function(){return Object.keys(this._oRenderedColumnPagesBoolMap).some(function(k){return this._oRenderedColumnPagesBoolMap[k];},this);};d.prototype._onArrowClick=function(s){var f=this.getLayout(),i=typeof d.SHIFT_TARGETS[f]!=="undefined"&&typeof d.SHIFT_TARGETS[f][s]!=="undefined",n;c(i,"An invalid layout was used for determining arrow behavior");n=i?d.SHIFT_TARGETS[f][s]:L.OneColumn;this.setLayout(n);if(d.ARROWS_NAMES[n][s]!==d.ARROWS_NAMES[f][s]&&i){var o=s==='right'?'left':'right';this._oColumnSeparatorArrows[d.ARROWS_NAMES[n][o]].focus();}this._fireStateChange(true,false);};d.prototype._hideShowArrows=function(){var s=this.getLayout(),M={},n=[],i,I;if(!this.isActive()||D.system.phone){return;}i=this.getMaxColumnsCount();if(i>1){M[L.TwoColumnsBeginExpanded]=["beginBack"];M[L.TwoColumnsMidExpanded]=["midForward"];M[L.ThreeColumnsMidExpanded]=["midForward","midBack"];M[L.ThreeColumnsEndExpanded]=["endForward"];M[L.ThreeColumnsMidExpandedEndHidden]=["midForward","midBack"];M[L.ThreeColumnsBeginExpandedEndHidden]=["beginBack"];if(typeof M[s]==="object"){n=M[s];}}I=this._hasAnyColumnPagesRendered();Object.keys(this._oColumnSeparatorArrows).forEach(function(k){this._toggleButton(k,n.indexOf(k)!==-1,I);},this);};d.prototype._toggleButton=function(s,S,r){this._oColumnSeparatorArrows[s].toggle(S&&r);this._oColumnSeparatorArrows[s].data("visible",S);};d.prototype._fireStateChange=function(i,I){if(this._getControlWidth()===0){return;}this.fireStateChange({isNavigationArrow:i,isResize:I,layout:this.getLayout(),maxColumnsCount:this.getMaxColumnsCount()});};d.prototype.setInitialBeginColumnPage=function(p){this._getBeginColumn().setInitialPage(p);this.setAssociation('initialBeginColumnPage',p,true);return this;};d.prototype.setInitialMidColumnPage=function(p){this._getMidColumn().setInitialPage(p);this.setAssociation('initialMidColumnPage',p,true);return this;};d.prototype.setInitialEndColumnPage=function(p){this._getEndColumn().setInitialPage(p);this.setAssociation('initialEndColumnPage',p,true);return this;};d.prototype.to=function(p,t,o,T){if(this._getBeginColumn().getPage(p)){this._getBeginColumn().to(p,t,o,T);}else if(this._getMidColumn().getPage(p)){this._getMidColumn().to(p,t,o,T);}else{this._getEndColumn().to(p,t,o,T);}return this;};d.prototype.backToPage=function(p,o,t){if(this._getBeginColumn().getPage(p)){this._getBeginColumn().backToPage(p,o,t);}else if(this._getMidColumn().getPage(p)){this._getMidColumn().backToPage(p,o,t);}else{this._getEndColumn().backToPage(p,o,t);}return this;};d.prototype._safeBackToPage=function(p,t,f,T){if(this._getBeginColumn().getPage(p)){this._getBeginColumn()._safeBackToPage(p,t,f,T);}else if(this._getMidColumn().getPage(p)){this._getMidColumn()._safeBackToPage(p,t,f,T);}else{this._getEndColumn()._safeBackToPage(p,t,f,T);}};d.prototype.toBeginColumnPage=function(p,t,o,T){this._getBeginColumn().to(p,t,o,T);return this;};d.prototype.toMidColumnPage=function(p,t,o,T){this._getMidColumn().to(p,t,o,T);return this;};d.prototype.toEndColumnPage=function(p,t,o,T){this._getEndColumn().to(p,t,o,T);return this;};d.prototype.backBeginColumn=function(f,t){return this._getBeginColumn().back(f,t);};d.prototype.backMidColumn=function(f,t){return this._getMidColumn().back(f,t);};d.prototype.backEndColumn=function(f,t){return this._getEndColumn().back(f,t);};d.prototype.backBeginColumnToPage=function(p,f,t){return this._getBeginColumn().backToPage(p,f,t);};d.prototype.backMidColumnToPage=function(p,f,t){return this._getMidColumn().backToPage(p,f,t);};d.prototype.backEndColumnToPage=function(p,f,t){return this._getEndColumn().backToPage(p,f,t);};d.prototype.backToTopBeginColumn=function(o,t){this._getBeginColumn().backToTop(o,t);return this;};d.prototype.backToTopMidColumn=function(o,t){this._getMidColumn().backToTop(o,t);return this;};d.prototype.backToTopEndColumn=function(o,t){this._getEndColumn().backToTop(o,t);return this;};d.prototype.getCurrentBeginColumnPage=function(){return this._getBeginColumn().getCurrentPage();};d.prototype.getCurrentMidColumnPage=function(){return this._getMidColumn().getCurrentPage();};d.prototype.getCurrentEndColumnPage=function(){return this._getEndColumn().getCurrentPage();};d.prototype.setDefaultTransitionNameBeginColumn=function(t){this.setProperty("defaultTransitionNameBeginColumn",t,true);this._getBeginColumn().setDefaultTransitionName(t);return this;};d.prototype.setDefaultTransitionNameMidColumn=function(t){this.setProperty("defaultTransitionNameMidColumn",t,true);this._getMidColumn().setDefaultTransitionName(t);return this;};d.prototype.setDefaultTransitionNameEndColumn=function(t){this.setProperty("defaultTransitionNameEndColumn",t,true);this._getEndColumn().setDefaultTransitionName(t);return this;};d.prototype._getLayoutHistory=function(){return this._oLayoutHistory;};d.prototype._getColumnWidthDistributionForLayout=function(s,A,M){var o={},r;M||(M=this.getMaxColumnsCount());if(M===0){r="0/0/0";}else{o[L.OneColumn]="100/0/0";o[L.MidColumnFullScreen]="0/100/0";o[L.EndColumnFullScreen]="0/0/100";if(M===1){o[L.TwoColumnsBeginExpanded]="0/100/0";o[L.TwoColumnsMidExpanded]="0/100/0";o[L.ThreeColumnsMidExpanded]="0/0/100";o[L.ThreeColumnsEndExpanded]="0/0/100";o[L.ThreeColumnsMidExpandedEndHidden]="0/0/100";o[L.ThreeColumnsBeginExpandedEndHidden]="0/0/100";}else{o[L.TwoColumnsBeginExpanded]="67/33/0";o[L.TwoColumnsMidExpanded]="33/67/0";o[L.ThreeColumnsMidExpanded]=M===2?"0/67/33":"25/50/25";o[L.ThreeColumnsEndExpanded]=M===2?"0/33/67":"25/25/50";o[L.ThreeColumnsMidExpandedEndHidden]="33/67/0";o[L.ThreeColumnsBeginExpandedEndHidden]="67/33/0";}r=o[s];}if(A){r=r.split("/").map(function(f){return parseInt(f);});}return r;};d.DESKTOP_BREAKPOINT=1280;d.TABLET_BREAKPOINT=960;d.ARROWS_NAMES={TwoColumnsBeginExpanded:{"left":"beginBack"},TwoColumnsMidExpanded:{"right":"midForward"},ThreeColumnsMidExpanded:{"left":"midBack","right":"midForward"},ThreeColumnsEndExpanded:{"right":"endForward"},ThreeColumnsMidExpandedEndHidden:{"left":"midBack","right":"midForward"},ThreeColumnsBeginExpandedEndHidden:{"left":"beginBack"}};d._getResourceBundle=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.f");};d.SHIFT_TARGETS={TwoColumnsBeginExpanded:{"left":L.TwoColumnsMidExpanded},TwoColumnsMidExpanded:{"right":L.TwoColumnsBeginExpanded},ThreeColumnsMidExpanded:{"left":L.ThreeColumnsEndExpanded,"right":L.ThreeColumnsMidExpandedEndHidden},ThreeColumnsEndExpanded:{"right":L.ThreeColumnsMidExpanded},ThreeColumnsMidExpandedEndHidden:{"left":L.ThreeColumnsMidExpanded,"right":L.ThreeColumnsBeginExpandedEndHidden},ThreeColumnsBeginExpandedEndHidden:{"left":L.ThreeColumnsMidExpandedEndHidden}};function e(){this._aLayoutHistory=[];}function g(o){var s;for(var k in o){if(o[k]){s=k;break;}}return s;}e.prototype.addEntry=function(s){if(typeof s!=="undefined"){this._aLayoutHistory.push(s);}};e.prototype.getClosestEntryThatMatches=function(f){var i;for(i=this._aLayoutHistory.length-1;i>=0;i--){if(f.indexOf(this._aLayoutHistory[i])!==-1){return this._aLayoutHistory[i];}}};return d;});
