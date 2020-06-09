/*
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Delegate',"sap/base/util/deepEqual","sap/base/security/encodeXML","sap/ui/thirdparty/jquery"],function(D,d,e,q){"use strict";var X=D.extend("sap.ui.core.util.serializer.delegate.XML",{constructor:function(s,g,G,m){D.apply(this);this._sDefaultNamespace=s;this._fnGetControlId=g;this._fnMemorizePackage=m;this._fnGetEventHandlerName=G;}});X.prototype.startAggregation=function(c,a){return'<'+this._createAggregationName(c,a)+'>';};X.prototype.endAggregation=function(c,a){return'</'+this._createAggregationName(c,a)+'>';};X.prototype.start=function(c,a,i){return"<"+this._createTagName(c);};X.prototype.end=function(c,a,i){return"</"+this._createTagName(c)+">";};X.prototype.middle=function(c,a,b){var x=[];var I=(this._fnGetControlId)?this._fnGetControlId(c):c.getId();if(I.indexOf("__")!==0){x.push(this._createAttribute("id",I));}if(c.aCustomStyleClasses){var C=c.aCustomStyleClasses;var f=[];for(var i=0;i<C.length;i++){var s=C[i];if(!s.startsWith("sapM")&&!s.startsWith("sapUi")){f.push(s);}}if(f.length>0){x.push(this._createAttribute("class",f.join(" ")));}}if(this._fnGetEventHandlerName){var E=c.getMetadata().getAllEvents();for(var g in E){if(c.hasListeners(g)){var h=c.mEventRegistry[g];for(var i=0;i<h.length;i++){var H=this._fnGetEventHandlerName(h[i]);if(H){x.push(this._createAttribute(g,H));break;}}}}}var A=c.getMetadata().getAllAssociations();this._createAttributes(x,c,A,function(n,v){if(A[n].multiple){return v.join(" ");}return v;},function(n,v){return(v!==null&&typeof v!==undefined&&v!=="");});var p=c.getMetadata().getAllProperties();var o=c.getMetadata().getPropertyDefaults();this._createAttributes(x,c,p,null,function(n,v){return!d(v,o[n]);});var j=c.getMetadata().getAllAggregations();this._createAttributes(x,c,j,null,function(n,v){if(!c.getBindingInfo(n)&&(!v||(typeof v!=="string"))){return false;}return true;});x.push('>');return x.join('');};X.prototype._createAttributes=function(x,c,o,g,v){for(var n in o){var p=o[n];var G=p._sGetter;if(c[G]){var V=c[G]();V=g?g(n,V):V;if(!c.getBindingInfo(n)){if(!v||v(n,V)){x.push(this._createAttribute(n,V));}}else{x.push(this._createDataBindingAttribute(c,n,V));}}}};X.prototype._createDataBindingAttribute=function(c,n,v){var b=c.getBindingInfo(n);var B=null;var p=v;if(!b.bindingString){if(b.binding){var C=b.binding.getMetadata().getName();if(C==="sap.ui.model.PropertyBinding"||C==="sap.ui.model.resource.ResourcePropertyBinding"){B=b.binding.getValue();}}if(b.parts){b=b.parts[0];}var m=b.model;if(B===v||B===null){p="{"+(m?(m+">"+b.path):b.path)+"}";}}else{p=b.bindingString;}return this._createAttribute(n,p);};X.prototype._createAttribute=function(a,v){var E=q.type(v)==="string"?e(v):v;return' '+a+'="'+E+'"';};X.prototype._createTagName=function(c){var C=c.getMetadata()._sClassName;var l=C.lastIndexOf(".");var s=(l===-1)?C:C.substring(l+1);var p=(l===-1)?C:C.substring(0,l);if(this._fnMemorizePackage){this._fnMemorizePackage(c,p);}return this._createNamespace(p,s);};X.prototype._createAggregationName=function(c,a){var C=c.getMetadata()._sClassName;var l=C.lastIndexOf(".");var p=(l===-1)?C:C.substring(0,l);return this._createNamespace(p,a);};X.prototype._createNamespace=function(n,N){if(this._sDefaultNamespace&&this._sDefaultNamespace===n){return N;}else{return n+":"+N;}};return X;});
