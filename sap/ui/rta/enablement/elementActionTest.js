/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/UIComponent","sap/ui/core/ComponentContainer","sap/ui/core/mvc/XMLView","sap/ui/rta/command/CommandFactory","sap/ui/dt/DesignTime","sap/ui/dt/DesignTimeStatus","sap/ui/dt/OverlayRegistry","sap/ui/fl/ChangePersistence","sap/ui/model/Model","sap/ui/fl/registry/Settings","sap/ui/fl/write/api/PersistenceWriteAPI","sap/ui/fl/Cache","sap/ui/fl/Layer","sap/ui/thirdparty/sinon-4","sap/ui/fl/library"],function(U,C,X,a,D,b,O,c,M,S,P,d,L,s){"use strict";var e=function(m,o){if(e._only&&(m.indexOf(e._only)<0)){return;}if(typeof o.xmlView==="string"){o.xmlView={viewContent:o.xmlView};}var f=s.sandbox.create();o.before=o.before||function(){};o.after=o.after||function(){};QUnit.module(m,function(){QUnit.test("When using the 'controlEnablingCheck' function to test if your control is ready for UI adaptation at runtime",function(n){n.ok(o.afterAction,"then you implement a function to check if your action has been successful: See the afterAction parameter.");n.ok(o.afterUndo,"then you implement a function to check if the undo has been successful: See the afterUndo parameter.");n.ok(o.afterRedo,"then you implement a function to check if the redo has been successful: See the afterRedo parameter.");n.ok(o.xmlView,"then you provide an XML view to test on: See the.xmlView parameter.");var x=new DOMParser().parseFromString(o.xmlView.viewContent,"application/xml").documentElement;n.ok(x.tagName.match("View$"),"then you use the sap.ui.core.mvc View tag as the first tag in your view");n.ok(o.action,"then you provide an action: See the action parameter.");n.ok(o.action.name,"then you provide an action name: See the action.name parameter.");n.ok(o.action.controlId||o.action.control,"then you provide the control or control's id to operate the action on: See the action.controlId.");});});var g="sap.ui.rta.control.enabling.comp";var h=false;var A=true;var i=U.extend(g,{metadata:{manifest:{"sap.app":{id:g,type:"application"},getEntry:function(){return{type:"application"};}}},createContent:function(){var v=Object.assign({},o.xmlView);v.id=this.createId("view");if(v.async===undefined){v.async=this.getComponentData().async;}var V=new X(v);return V;}});function j(n){this.oUiComponent=new i({id:"comp",componentData:{async:n}});this.oUiComponentContainer=new C({component:this.oUiComponent,height:'100%'});this.oUiComponentContainer.placeAt(o.placeAt||"qunit-fixture");this.oView=this.oUiComponent.getRootControl();if(o.model instanceof M){this.oView.setModel(o.model);}sap.ui.getCore().applyChanges();return Promise.all([this.oView.loaded(),o.model&&o.model.getMetaModel()&&o.model.getMetaModel().loaded()]);}function k(n){return Promise.resolve().then(function(){var p;var E;if(typeof o.action.control==="function"){this.oControl=o.action.control(this.oView);}else{this.oControl=this.oView.byId(o.action.controlId);}var q=o.action.name;return this.oControl.getMetadata().loadDesignTime(this.oControl).then(function(){if(o.action.parameter){if(typeof o.action.parameter==="function"){p=o.action.parameter(this.oView);}else{p=o.action.parameter;}}else{p={};}sap.ui.getCore().applyChanges();this.oDesignTime=new D({rootElements:[this.oView]});return new Promise(function(r){this.oDesignTime.attachEventOnce("synced",function(){this.oControlOverlay=O.getOverlay(this.oControl);E=this.oControlOverlay.getDesignTimeMetadata();var R=E.getAction("getResponsibleElement",this.oControl);var t;if(o.action.name==="move"){var u=O.getOverlay(p.movedElements[0].element);var v=u.getRelevantContainer();this.oControl=v;E=u.getParentAggregationOverlay().getDesignTimeMetadata();}else if(o.action.name==="addODataProperty"){var w=E.getActionDataFromAggregations("addODataProperty",this.oControl);n.equal(w.length,1,"there should be only one aggregation with the possibility to do addODataProperty action");t=this.oControlOverlay.getAggregationOverlay(w[0].aggregation);E=t.getDesignTimeMetadata();}else if(Array.isArray(o.action.name)){var x=E.getActionDataFromAggregations(o.action.name[0],this.oControl,undefined,o.action.name[1]);n.equal(x.length,1,"there should be only one aggregation with the possibility to do an add "+o.action.name[1]+" action");t=this.oControlOverlay.getAggregationOverlay(x[0].aggregation);E=t.getDesignTimeMetadata();q="addODataProperty";}else if(R){if(o.action.name==="reveal"){this.oControl=o.action.revealedElement(this.oView);this.oControlOverlay=O.getOverlay(o.action.revealedElement(this.oView));E=this.oControlOverlay.getDesignTimeMetadata();}else{this.oControl=R;this.oControlOverlay=O.getOverlay(this.oControl);E=this.oControlOverlay.getDesignTimeMetadata();r(this.oControl.getMetadata().loadDesignTime(this.oControl));}}r();}.bind(this));}.bind(this));}.bind(this)).then(function(){var r=new a({flexSettings:{layer:o.layer||L.CUSTOMER}});return r.getCommandFor(this.oControl,q,p,E).then(function(t){this.oCommand=t;n.ok(t,"then the registration for action to change type, the registration for change and control type to change handler is available and "+o.action.name+" is a valid action");}.bind(this));}.bind(this));}.bind(this)).catch(function(p){throw new Error(p);});}function l(n){var p=n.getPreparedChange();if(n.getAppComponent){P.remove({change:p,selector:n.getAppComponent()});}}if(!o.jsOnly){QUnit.module(m+" on async views",{before:function(n){this.hookContext={};return o.before.call(this.hookContext,n);},after:function(n){return o.after.call(this.hookContext,n);},beforeEach:function(){f.stub(S,"getInstance").resolves({_oSettings:{}});},afterEach:function(){this.oUiComponentContainer.destroy();this.oDesignTime.destroy();this.oCommand.destroy();f.restore();}},function(){QUnit.test("When applying the change directly on the XMLView",function(n){var p=[];f.stub(c.prototype,"getChangesForComponent").resolves(p);f.stub(c.prototype,"getCacheKey").resolves("etag-123");return j.call(this,h).then(function(){return k.call(this,n);}.bind(this)).then(function(){var q=this.oCommand.getPreparedChange();p.push(q);this.oUiComponentContainer.destroy();return j.call(this,A);}.bind(this)).then(function(q){var v=q[0];return o.afterAction(this.oUiComponent,v,n);}.bind(this));});QUnit.test("When executing on XML and reverting the change in JS (e.g. variant switch)",function(n){var p=[];f.stub(c.prototype,"getChangesForComponent").resolves(p);f.stub(c.prototype,"getCacheKey").resolves("etag-123");return j.call(this,h).then(function(){return k.call(this,n);}.bind(this)).then(function(){var q=this.oCommand.getPreparedChange();p.push(q);this.oUiComponentContainer.destroy();return j.call(this,A);}.bind(this)).then(function(){return this.oCommand.undo();}.bind(this)).then(function(){return l(this.oCommand);}.bind(this)).then(function(){sap.ui.getCore().applyChanges();o.afterUndo(this.oUiComponent,this.oView,n);}.bind(this));});QUnit.test("When executing on XML, reverting the change in JS (e.g. variant switch) and applying again",function(n){var p=[];f.stub(c.prototype,"getChangesForComponent").resolves(p);f.stub(c.prototype,"getCacheKey").resolves("etag-123");return j.call(this,h).then(function(){return k.call(this,n);}.bind(this)).then(function(){var q=this.oCommand.getPreparedChange();p.push(q);this.oUiComponentContainer.destroy();return j.call(this,A);}.bind(this)).then(function(){return this.oCommand.undo();}.bind(this)).then(function(){return l(this.oCommand);}.bind(this)).then(function(){return this.oCommand.execute();}.bind(this)).then(function(){sap.ui.getCore().applyChanges();o.afterRedo(this.oUiComponent,this.oView,n);}.bind(this));});});}QUnit.module(m,{before:function(n){this.hookContext={};return o.before.call(this.hookContext,n);},after:function(n){return o.after.call(this.hookContext,n);},beforeEach:function(n){f.stub(c.prototype,"getChangesForComponent").returns(Promise.resolve([]));f.stub(c.prototype,"getCacheKey").returns(d.NOTAG);f.stub(S,"getInstance").returns(Promise.resolve({_oSettings:{}}));return j.call(this,h).then(function(){return k.call(this,n);}.bind(this));},afterEach:function(){this.oDesignTime.destroy();this.oUiComponentContainer.destroy();this.oCommand.destroy();f.restore();}},function(){QUnit.test("When executing the underlying command on the control at runtime",function(n){return this.oCommand.execute().then(function(){return this.oDesignTime.getStatus()!==b.SYNCED?(new Promise(function(r){this.oDesignTime.attachEventOnce("synced",r);}.bind(this))):Promise.resolve();}.bind(this)).then(function(){sap.ui.getCore().applyChanges();return o.afterAction(this.oUiComponent,this.oView,n);}.bind(this));});QUnit.test("When executing and undoing the command",function(n){return this.oCommand.execute().then(function(){return this.oDesignTime.getStatus()!==b.SYNCED?(new Promise(function(r){this.oDesignTime.attachEventOnce("synced",r);}.bind(this))):Promise.resolve();}.bind(this)).then(this.oCommand.undo.bind(this.oCommand)).then(function(){return l(this.oCommand);}.bind(this)).then(function(){sap.ui.getCore().applyChanges();return o.afterUndo(this.oUiComponent,this.oView,n);}.bind(this));});QUnit.test("When executing, undoing and redoing the command",function(n){return this.oCommand.execute().then(function(){return this.oDesignTime.getStatus()!==b.SYNCED?(new Promise(function(r){this.oDesignTime.attachEventOnce("synced",r);}.bind(this))):Promise.resolve();}.bind(this)).then(this.oCommand.undo.bind(this.oCommand)).then(function(){return l(this.oCommand);}.bind(this)).then(this.oCommand.execute.bind(this.oCommand)).then(function(){sap.ui.getCore().applyChanges();return o.afterRedo(this.oUiComponent,this.oView,n);}.bind(this));});});};e.skip=function(){};e.only=function(m){e._only=m;};return e;});