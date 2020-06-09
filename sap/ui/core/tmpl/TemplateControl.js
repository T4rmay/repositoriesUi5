/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/ui/core/DeclarativeSupport','sap/ui/core/library','sap/ui/core/UIArea','./DOMElement','./Template',"./TemplateControlRenderer","sap/base/strings/capitalize","sap/base/strings/hyphenate","sap/base/Log","sap/ui/thirdparty/jquery"],function(C,D,l,U,a,T,b,c,h,L,q){"use strict";var d=C.extend("sap.ui.core.tmpl.TemplateControl",{metadata:{library:"sap.ui.core",properties:{context:{type:"object",group:"Data",defaultValue:null}},aggregations:{controls:{type:"sap.ui.core.Control",multiple:true,singularName:"control",visibility:"hidden"}},associations:{template:{type:"sap.ui.core.tmpl.Template",multiple:false}},events:{afterRendering:{},beforeRendering:{}}}});d.prototype.init=function(){this._aBindingInfos=[];};d.prototype.isInline=function(){var i=false,p=this.getParent();if(p instanceof U&&q(p.getRootNode()).attr("id")===this.getId()){i=true;}return i;};d.prototype.placeAt=function(r,p){var i=this.isInline();var $=this.$(),u=this.getUIArea();C.prototype.placeAt.apply(this,arguments);if(i&&$.length===1){$.remove();u.destroyContent();}};d.prototype.getTemplateRenderer=function(){return this.fnRenderer;};d.prototype.setTemplateRenderer=function(r){this.fnRenderer=r;return this;};d.prototype._cleanup=function(){this.destroyAggregation("controls");this._aBindingInfos.forEach(function(B){var o=B.binding;if(o){o.detachChange(B.changeHandler);o.destroy();}});this._aBindingInfos=[];};d.prototype._compile=function(){var t=sap.ui.getCore().byId(this.getTemplate()),e=t&&t.getDeclarativeSupport();if(e){var f=this;setTimeout(function(){D.compile(f.getDomRef());});}};d.prototype.exit=function(){this._cleanup();};d.prototype.onBeforeRendering=function(){this.fireBeforeRendering();this._cleanup();};d.prototype.onAfterRendering=function(){this.fireAfterRendering();};d.prototype.clone=function(){var o=C.prototype.clone.apply(this,arguments);o.fnRenderer=this.fnRenderer;return o;};d.prototype.updateBindings=function(u,m){C.prototype.updateBindings.apply(this,arguments);if(this.getDomRef()){this.invalidate();}};d.prototype.bind=function(p,t){var P=T.parsePath(p),m=this.getModel(P.model),p=P.path,M=t?"bind"+c(t):"bindProperty",B=m&&m[M](p),o={binding:B,path:P.path,model:P.model};if(B){o.changeHandler=function(){L.debug("TemplateControl#"+this.getId()+": "+t+" binding changed for path \""+p+"\"");this.invalidate();}.bind(this);B.attachChange(o.changeHandler);}this._aBindingInfos.push(o);return B;};d.prototype.calculatePath=function(p,t){var B=this.getBindingContext(),s=B&&B.getPath();if(p&&s&&!p.startsWith("/")){if(!s.endsWith("/")){s+="/";}p=s+p;}return p;};d.prototype.bindProp=function(p){var B=this.bind(this.calculatePath(p),"property");return B&&B.getExternalValue();};d.prototype.bindList=function(p){var B=this.bind(this.calculatePath(p),"list"),m=B&&B.getModel(),p=B&&B.getPath();return B&&m.getProperty(p);};d.prototype.createDOMElement=function(s,p,e){var E=new a(s);if(p){E.bindObject(p);}if(!e){this.addAggregation("controls",E);}return E;};d.prototype.createControl=function(s,p,e,v){var H={};q.each(s,function(k,V){H["data-"+h(k)]=V;});var $=q("<div/>",H);var o=D._createControl($.get(0),v);if(p){o.bindObject(p);}if(!e){this.addAggregation("controls",o);}return o;};return d;});