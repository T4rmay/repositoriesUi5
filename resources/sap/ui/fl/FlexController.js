/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/registry/ChangeRegistry","sap/ui/fl/Utils","sap/ui/fl/LayerUtils","sap/ui/fl/Change","sap/ui/fl/Variant","sap/ui/fl/ChangePersistenceFactory","sap/ui/fl/write/_internal/Versions","sap/ui/fl/apply/_internal/changes/Applier","sap/ui/fl/apply/_internal/changes/Reverter","sap/ui/fl/apply/_internal/controlVariants/URLHandler","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/core/util/reflection/XmlTreeModifier","sap/ui/core/Component","sap/base/Log"],function(C,U,L,a,V,b,c,A,R,d,J,X,e,f){"use strict";var F=function(s,i){this._oChangePersistence=undefined;this._sComponentName=s||"";this._sAppVersion=i||U.DEFAULT_APP_VERSION;if(this._sComponentName&&this._sAppVersion){this._createChangePersistence();}};F.prototype.getComponentName=function(){return this._sComponentName;};F.prototype.getAppVersion=function(){return this._sAppVersion;};F.prototype.setVariantSwitchPromise=function(p){this._oVariantSwitchPromise=p;};F.prototype.waitForVariantSwitch=function(){if(!this._oVariantSwitchPromise){this._oVariantSwitchPromise=Promise.resolve();}return this._oVariantSwitchPromise;};F.prototype.createBaseChange=function(o,i){var j;var k;if(!i){throw new Error("No application component found. To offer flexibility a valid relation to its owning component must be present.");}o.reference=this.getComponentName();o.packageName="$TMP";o.validAppVersions=U.getValidAppVersions({appVersion:this.getAppVersion(),developerMode:o.developerMode,scenario:o.scenario});j=a.createInitialFileContent(o);k=new a(j);if(o.variantReference){k.setVariantReference(o.variantReference);}return k;};F.prototype._createChange=function(o,i,j){var s=j&&(j.controlType||U.getControlType(j));var k=this.createBaseChange(o,i);return this._getChangeHandler(k,s,j,J).then(function(l){if(l){l.completeChangeContent(k,o,{modifier:J,appComponent:i});}else{throw new Error("Change handler could not be retrieved for change "+JSON.stringify(o)+".");}return k;}).catch(function(E){return Promise.reject(E);});};F.prototype.createChangeWithExtensionPointSelector=function(o,E){return Promise.resolve().then(function(){if(!E){throw new Error("A flexibility change on extension point cannot be created without a valid extension point reference.");}var v=E.view;var i=U.getAppComponentForControl(v);o.selector={name:E.name,viewSelector:J.getSelector(v.getId(),i)};return i;}).then(function(i){return this._createChange(o,i);}.bind(this));};F.prototype.createChangeWithControlSelector=function(o,i){var j;return new U.FakePromise().then(function(){if(!i){throw new Error("A flexibility change cannot be created without a targeted control.");}var s=i.id||i.getId();if(!o.selector){o.selector={};}j=i.appComponent||U.getAppComponentForControl(i);if(!j){throw new Error("No application component found. To offer flexibility, the control with the ID '"+s+"' has to have a valid relation to its owning application component.");}Object.assign(o.selector,J.getSelector(s,j));return j;}).then(function(j){return this._createChange(o,j,i);}.bind(this));};F.prototype.createVariant=function(v,o){var i;var j;if(!o){throw new Error("No Application Component found - to offer flexibility the variant has to have a valid relation to its owning application component.");}if(v.content.variantManagementReference){var k=J.checkControlId(v.content.variantManagementReference,o);if(!k){throw new Error("Generated ID attribute found - to offer flexibility a stable VariantManagement ID is needed to assign the changes to, but for this VariantManagement control the ID was generated by SAPUI5 "+v.content.variantManagementReference);}}v.content.reference=this.getComponentName();v.content.packageName="$TMP";v.content.validAppVersions=U.getValidAppVersions(this.getAppVersion(),v.developerMode,v.scenario);j=V.createInitialFileContent(v);i=new V(j);return i;};F.prototype.addChange=function(o,i){return this.createChangeWithControlSelector(o,i).then(function(j){var k=U.getAppComponentForControl(i);j._ignoreOnce=true;this.addPreparedChange(j,k);return j;}.bind(this));};F.prototype.addPreparedChange=function(o,i){if(o.getVariantReference()){var m=i.getModel(U.VARIANT_MODEL_NAME);m.addChange(o);}this._oChangePersistence.addChange(o,i);return o;};F.prototype.deleteChange=function(o,i){this._oChangePersistence.deleteChange(o);if(o.getVariantReference()){i.getModel(U.VARIANT_MODEL_NAME).removeChange(o);}};F.prototype.createAndApplyChange=function(o,i){var j;return this.addChange(o,i).then(function(k){j=k;var p={modifier:J,appComponent:U.getAppComponentForControl(i),view:U.getViewForControl(i)};j.setQueuedForApply();return A.applyChangeOnControl(j,i,p);}).then(function(r){if(!r.success){var E=r.error||new Error("The change could not be applied.");this._oChangePersistence.deleteChange(j,true);throw E;}return j;}.bind(this));};function g(o,D,m,j,r){var k=h(o,j);if(!k){return[];}r.push(o);var s=o.getId();var l=D[s]&&D[s].dependencies||[];for(var i=0,n=l.length;i<n;i++){var p=U.getChangeFromChangesMap(m,l[i]);k=g(p,D,m,j,r);if(k.length===0){r=[];break;}delete D[s];}return r;}function h(o,i){var s=o.getDependentControlSelectorList();s.push(o.getSelector());return!s.some(function(S){return!J.bySelector(S,i);});}F.prototype.waitForChangesToBeApplied=function(s){var S;if(Array.isArray(s)){S=s;}else{S=[s];}var p=S.map(function(v){return this._waitForChangesToBeApplied(v);}.bind(this));return Promise.all(p).then(function(){return undefined;});};F.prototype._waitForChangesToBeApplied=function(s){var o=s.id&&sap.ui.getCore().byId(s.id)||s;var m=this._oChangePersistence.getChangesMapForComponent();var p=[];var D=Object.assign({},m.mDependencies);var i=m.mChanges;var j=i[o.getId()]||[];var n=j.filter(function(l){return!l.isCurrentProcessFinished();},this);var k=s.appComponent||U.getAppComponentForControl(o);var r=[];n.forEach(function(l){var q=g(l,D,m.mChanges,k,[]);q.forEach(function(t){if(r.indexOf(t)===-1){r.push(t);}});});r.forEach(function(l){p=p.concat(l.addChangeProcessingPromises());},this);p.push(this.waitForVariantSwitch());return Promise.all(p);};F.prototype.saveAll=function(s,D){return this._oChangePersistence.saveDirtyChanges(s,undefined,D).then(function(r){if(D&&r&&r.response){var v=r.response;if(Array.isArray(v)){v=v[0];}c.ensureDraftVersionExists({reference:v.reference,layer:v.layer});}return r;});};F.prototype.processXmlView=function(v,p){var o=e.get(p.componentId);var i=U.getAppComponentForControl(o);p.appComponent=i;p.modifier=X;p.view=v;return this._oChangePersistence.getChangesForView(p).then(A.applyAllChangesForXMLView.bind(A,p)).catch(this._handlePromiseChainError.bind(this,p.view));};F.prototype._handlePromiseChainError=function(v,E){f.error("Error processing view "+E+".");return v;};F.prototype._getChangeHandler=function(o,s,i,m){var j=o.getChangeType();var l=o.getLayer();return this._getChangeRegistry().getChangeHandler(j,s,i,m,l);};F.prototype._getChangeRegistry=function(){var i=C.getInstance();i.initSettings();return i;};F.prototype.getComponentChanges=function(p,i){return this._oChangePersistence.getChangesForComponent(p,i);};F.prototype.checkForOpenDependenciesForControl=function(s,o){return this._oChangePersistence.checkForOpenDependenciesForControl(s,o);};F.prototype.hasHigherLayerChanges=function(p){p=p||{};var s=p.upToLayer||L.getCurrentLayer(false);p.includeVariants=true;p.includeCtrlVariants=true;return this.getComponentChanges(p).then(function(v){var H=v===this._oChangePersistence.HIGHER_LAYER_CHANGES_EXIST||v.some(function(o){return L.compareAgainstCurrentLayer(o.getLayer(),s)>0;});return!!H;}.bind(this));};F.prototype._createChangePersistence=function(){this._oChangePersistence=b.getChangePersistenceForComponent(this.getComponentName(),this.getAppVersion());return this._oChangePersistence;};F.prototype.resetChanges=function(l,G,o,s,i){return this._oChangePersistence.resetChanges(l,G,s,i).then(function(j){if(j.length!==0){return R.revertMultipleChanges(j,{appComponent:o,modifier:J,flexController:this});}}.bind(this)).then(function(){if(o){var m=o.getModel(U.VARIANT_MODEL_NAME);if(m){d.update({parameters:[],updateURL:true,updateHashEntry:true,model:m});}}});};F.prototype.discardChanges=function(i,D){var s=L.getCurrentLayer(!!D);var I=0;var l;var o;l=i.length;while(I<i.length){o=i[I];if(o&&o.getLayer&&o.getLayer()===s){this._oChangePersistence.deleteChange(o);}if(l===i.length){I++;}else{l=i.length;}}return this._oChangePersistence.saveDirtyChanges();};F.prototype.applyVariantChanges=function(i,o){var j;return i.reduce(function(p,k){return p.then(function(){var P={modifier:J,appComponent:o};this._oChangePersistence._addRunTimeCreatedChangeAndUpdateDependencies(o,k);j=P.modifier.bySelector(k.getSelector(),o);if(j){return A.applyChangeOnControl(k,j,P);}f.error("A flexibility change tries to change a nonexistent control.");}.bind(this));}.bind(this),new U.FakePromise());};F.prototype.saveSequenceOfDirtyChanges=function(D){return this._oChangePersistence.saveDirtyChanges(false,D);};F.prototype.getResetAndPublishInfo=function(p){p.reference=this._sComponentName;p.appVersion=this._sAppVersion;return this._oChangePersistence.getResetAndPublishInfo(p);};return F;},true);
