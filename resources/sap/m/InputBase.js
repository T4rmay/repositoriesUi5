/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Control','sap/ui/core/EnabledPropagator','sap/ui/core/IconPool','./delegate/ValueStateMessage','sap/ui/core/message/MessageMixin','sap/ui/core/library','sap/ui/Device','./InputBaseRenderer','sap/base/Log',"sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/cursorPos","sap/ui/dom/jquery/getSelectedText","sap/ui/dom/jquery/selectText"],function(l,C,E,I,V,M,c,D,a,b,K,q){"use strict";var T=c.TextDirection;var d=c.TextAlign;var f=c.ValueState;var g=C.extend("sap.m.InputBase",{metadata:{interfaces:["sap.ui.core.IFormContent"],library:"sap.m",properties:{value:{type:"string",group:"Data",defaultValue:null,bindable:"bindable"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true},valueState:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:f.None},name:{type:"string",group:"Misc",defaultValue:null},placeholder:{type:"string",group:"Misc",defaultValue:null},editable:{type:"boolean",group:"Behavior",defaultValue:true},valueStateText:{type:"string",group:"Misc",defaultValue:null},showValueStateMessage:{type:"boolean",group:"Misc",defaultValue:true},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:d.Initial},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:T.Inherit},required:{type:"boolean",group:"Misc",defaultValue:false}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{value:{type:"string"}}}},aggregations:{formattedValueStateText:{type:"sap.m.FormattedText",multiple:false,defaultValue:null},_endIcon:{type:"sap.ui.core.Icon",multiple:true,visibility:"hidden"},_beginIcon:{type:"sap.ui.core.Icon",multiple:true,visibility:"hidden"}},designtime:"sap/m/designtime/InputBase.designtime"}});E.call(g.prototype);I.insertFontFaceStyle();M.call(g.prototype);g.ICON_PRESSED_CSS_CLASS="sapMInputBaseIconPressed";g.ICON_CSS_CLASS="sapMInputBaseIcon";g.prototype.bShowLabelAsPlaceholder=!D.support.input.placeholder;g.prototype.handleInput=function(e){if(this._bIgnoreNextInput||this._bIgnoreNextInputNonASCII){this._bIgnoreNextInput=false;this._bIgnoreNextInputNonASCII=false;e.setMarked("invalid");return;}this._bIgnoreNextInput=false;this._bIgnoreNextInputNonASCII=false;if(!this.getEditable()){e.setMarked("invalid");return;}if(document.activeElement!==e.target&&D.browser.msie&&this.getValue()===this._lastValue){e.setMarked("invalid");return;}this._bCheckDomValue=true;};g.prototype._getPlaceholder=function(){return this.getPlaceholder()||"";};g.prototype._getInputValue=function(v){v=(v===undefined)?this.$("inner").val()||"":v.toString();if(this.getMaxLength&&this.getMaxLength()>0){v=v.substring(0,this.getMaxLength());}return v;};g.prototype._getInputElementTagName=function(){if(!this._sInputTagElementName){this._sInputTagElementName=this._$input&&this._$input.get(0)&&this._$input.get(0).tagName;}return this._sInputTagElementName;};g.prototype.init=function(){this._lastValue="";this.bRenderingPhase=false;this._oValueStateMessage=new V(this);this._bIsComposingCharacter=false;};g.prototype.oncompositionstart=function(){this._bIsComposingCharacter=true;};g.prototype.oncompositionend=function(e){this._bIsComposingCharacter=false;if(!D.browser.edge&&!D.browser.firefox){this.handleInput(e);}};g.prototype.isComposingCharacter=function(){return this._bIsComposingCharacter;};g.prototype.onBeforeRendering=function(){if(D.browser.msie&&D.browser.version>9&&!/^[\x00-\x7F]*$/.test(this.getValue())){this._bIgnoreNextInputNonASCII=true;this._oDomRefBeforeRendering=this.getDomRef();}if(this._bCheckDomValue&&!this.bRenderingPhase){this._sDomValue=this._getInputValue();}this.bRenderingPhase=true;this._handleValueStateLinkPress();};g.prototype.onAfterRendering=function(){if(this._bCheckDomValue&&this._sDomValue!==this._getInputValue()){this.$("inner").val(this._sDomValue);}this._bIgnoreNextInputNonASCII=this._bIgnoreNextInputNonASCII&&this._oDomRefBeforeRendering!==this.getDomRef();this._bCheckDomValue=false;this.bRenderingPhase=false;};g.prototype.exit=function(){if(this._oValueStateMessage){this._oValueStateMessage.destroy();}this._oValueStateMessage=null;this._oDomRefBeforeRendering=null;};g.prototype.onsaptabnext=function(e){this.closeValueStateMessage();};g.prototype.ontouchstart=function(e){e.setMarked();};g.prototype.onfocusin=function(e){this._bIgnoreNextInput=!this.bShowLabelAsPlaceholder&&D.browser.msie&&D.browser.version>9&&!!this.getPlaceholder()&&!this._getInputValue()&&this._getInputElementTagName()==="INPUT";this.addStyleClass("sapMFocus");this.openValueStateMessage();};g.prototype.onfocusout=function(e){this.removeStyleClass("sapMFocus");if(!this._bClickOnValueStateLink(e)){this.closeValueStateMessage();}};g.prototype.onsapfocusleave=function(e){if(!this.preventChangeOnFocusLeave(e)){this.onChange(e);}};g.prototype.preventChangeOnFocusLeave=function(e){return this.bFocusoutDueRendering;};g.prototype.getChangeEventParams=function(){return{};};g.prototype.ontap=function(e){return;};g.prototype.onChange=function(e,p,n){p=p||this.getChangeEventParams();if(!this.getEditable()||!this.getEnabled()){return;}var v=this._getInputValue(n);if(v!==this._lastValue){this.setValue(v);v=this.getValue();this._lastValue=v;this.fireChangeEvent(v,p);return true;}else{this._bCheckDomValue=false;}};g.prototype.fireChangeEvent=function(v,p){var o=q.extend({value:v,newValue:v},p);this.fireChange(o);};g.prototype.onValueRevertedByEscape=function(v,p){this.fireEvent("liveChange",{value:v,escPressed:true,previousValue:p,newValue:v});};g.prototype.onsapenter=function(e){this.onChange(e);};g.prototype.onsapescape=function(e){var v=this._getInputValue();if(v!==this._lastValue){e.setMarked();e.preventDefault();this.updateDomValue(this._lastValue);this.onValueRevertedByEscape(this._lastValue,v);}};g.prototype.oninput=function(e){this.handleInput(e);};g.prototype.onkeydown=function(e){if(this.getDomRef("inner").getAttribute("readonly")&&e.keyCode==K.BACKSPACE){e.preventDefault();}};g.prototype.oncut=function(e){};g.prototype.selectText=function(s,S){this.$("inner").selectText(s,S);return this;};g.prototype.getSelectedText=function(){return this.$("inner").getSelectedText();};g.prototype.setProperty=function(p,v,s){if(p=="value"){this._bCheckDomValue=false;}return C.prototype.setProperty.apply(this,arguments);};g.prototype.getFocusInfo=function(){var F=C.prototype.getFocusInfo.call(this),o=this.getFocusDomRef();q.extend(F,{cursorPos:0,selectionStart:0,selectionEnd:0});if(o){F.cursorPos=q(o).cursorPos();try{F.selectionStart=o.selectionStart;F.selectionEnd=o.selectionEnd;}catch(e){}}return F;};g.prototype.applyFocusInfo=function(F){C.prototype.applyFocusInfo.call(this,F);this.$("inner").cursorPos(F.cursorPos);this.selectText(F.selectionStart,F.selectionEnd);return this;};g.prototype.bindToInputEvent=function(e){if(this._oInputEventDelegate){this.removeEventDelegate(this._oInputEventDelegate);}this._oInputEventDelegate={oninput:e};return this.addEventDelegate(this._oInputEventDelegate);};g.prototype.updateDomValue=function(v){var i=this.getFocusDomRef();if(!this.isActive()){return this;}v=this._getInputValue(v);if(this._getInputValue()===v){return this;}this._bCheckDomValue=true;if(this._bPreferUserInteraction){this.handleInputValueConcurrency(v);}else{i.value=v;}return this;};g.prototype._aValueStateLinks=function(){if(this.getFormattedValueStateText()&&this.getFormattedValueStateText().getHtmlText()&&this.getFormattedValueStateText().getControls().length){return this.getFormattedValueStateText().getControls();}else{return[];}};g.prototype._bClickOnValueStateLink=function(e){var v=this._aValueStateLinks();return v.some(function(L){return e.relatedTarget===L.getDomRef();});};g.prototype._handleValueStateLinkPress=function(){var F=this.getFormattedValueStateText();if(F&&F.getHtmlText()&&F.getControls()){F.getControls().forEach(function(L){L.attachPress(function(){this.closeValueStateMessage();},this);},this);}};g.prototype.handleInputValueConcurrency=function(v){var i=this.getFocusDomRef(),s=i&&this._getInputValue(),e=this.getProperty("value"),h=document.activeElement===i,B=this.isBound("value")&&this.getBindingInfo("value").skipModelUpdate;if(h&&B&&s&&(e!==s)){return this;}i.value=v;if(h&&B&&!s){i.select();}};g.prototype._setPreferUserInteraction=function(p){this._bPreferUserInteraction=p;};g.prototype.closeValueStateMessage=function(){if(this._oValueStateMessage){this._oValueStateMessage.close();}};g.prototype.getDomRefForValueStateMessage=function(){return this.getDomRef("content");};g.prototype.getPopupAnchorDomRef=function(){return this.getDomRef();};g.prototype.iOpenMessagePopupDuration=0;g.prototype.getValueStateMessageId=function(){return this.getId()+"-message";};g.prototype.getLabels=function(){var L=this.getAriaLabelledBy().map(function(s){return sap.ui.getCore().byId(s);});var o=sap.ui.require("sap/ui/core/LabelEnablement");if(o){L=L.concat(o.getReferencingLabels(this).map(function(s){return sap.ui.getCore().byId(s);}));}return L;};g.prototype.openValueStateMessage=function(){if(this._oValueStateMessage&&this.shouldValueStateMessageBeOpened()){if(D.browser.msie){setTimeout(function(){if(!this.bIsDestroyed){this._oValueStateMessage.open();}}.bind(this),0);}else{this._oValueStateMessage.open();}}};g.prototype.updateValueStateClasses=function(v,o){var $=this.$(),e=this.$("content"),m=f;if(o!==m.None){$.removeClass("sapMInputBaseState");e.removeClass("sapMInputBaseContentWrapperState sapMInputBaseContentWrapper"+o);}if(v!==m.None){$.addClass("sapMInputBaseState");e.addClass("sapMInputBaseContentWrapperState sapMInputBaseContentWrapper"+v);}};g.prototype.shouldValueStateMessageBeOpened=function(){return(this.getValueState()!==f.None)&&this.getEditable()&&this.getEnabled()&&this.getShowValueStateMessage();};g.prototype._calculateIconsSpace=function(){var e=this.getAggregation("_endIcon")||[],B=this.getAggregation("_beginIcon")||[],i=e.concat(B),h;return i.reduce(function(A,o){h=o&&o.getDomRef()?o.getDomRef().offsetWidth:0;return A+h;},0);};g.prototype.setValueState=function(v){var o=this.getValueState();this.setProperty("valueState",v,true);v=this.getValueState();if(v===o){return this;}var e=this.getDomRef();if(!e){return this;}var i=this.$("inner"),m=f;if(v===m.Error){i.attr("aria-invalid","true");}else{i.removeAttr("aria-invalid");}this.updateValueStateClasses(v,o);if(i[0]===document.activeElement){if(v===m.None){this.closeValueStateMessage();}else{this.openValueStateMessage();}}return this;};g.prototype.setValueStateText=function(t){this.setProperty("valueStateText",t,true);this.$("message").text(this.getValueStateText());return this;};g.prototype.setValue=function(v){v=this.validateProperty("value",v);v=this._getInputValue(v);this.updateDomValue(v);if(v!==this.getProperty("value")){this._lastValue=v;}this.setProperty("value",v,true);return this;};g.prototype.getFocusDomRef=function(){return this.getDomRef("inner");};g.prototype.getIdForLabel=function(){return this.getId()+"-inner";};g.prototype.getAccessibilityInfo=function(){var r=this.getRequired()?'Required':'',R=this.getRenderer();return{role:R.getAriaRole(this),type:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_INPUT"),description:[this.getValue()||"",R.getLabelledByAnnouncement(this),R.getDescribedByAnnouncement(this),r].join(" ").trim(),focusable:this.getEnabled(),enabled:this.getEnabled(),editable:this.getEnabled()&&this.getEditable()};};g.prototype._addIcon=function(i,o){if(["begin","end"].indexOf(i)===-1){b.error('icon position is not "begin", neither "end", please check again the passed setting');return null;}var e=I.createControlByURI(o).addStyleClass(g.ICON_CSS_CLASS);this.addAggregation("_"+i+"Icon",e);return e;};g.prototype.addBeginIcon=function(i){return this._addIcon("begin",i);};g.prototype.addEndIcon=function(i){return this._addIcon("end",i);};Object.defineProperty(g.prototype,"_$input",{get:function(){return this.$("inner");}});return g;});
