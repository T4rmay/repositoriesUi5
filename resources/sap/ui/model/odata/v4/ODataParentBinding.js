/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ODataBinding","./SubmitMode","./lib/_Helper","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/model/ChangeReason"],function(a,S,_,L,b,C){"use strict";function O(){a.call(this);this.mAggregatedQueryOptions={};this.bAggregatedQueryOptionsInitial=true;this.aChildCanUseCachePromises=[];this.iPatchCounter=0;this.bPatchSuccess=true;this.oReadGroupLock=undefined;this.oRefreshPromise=null;this.oResumePromise=undefined;}a(O.prototype);var c="sap.ui.model.odata.v4.ODataParentBinding";O.prototype.attachPatchCompleted=function(f,l){this.attachEvent("patchCompleted",f,l);};O.prototype.detachPatchCompleted=function(f,l){this.detachEvent("patchCompleted",f,l);};O.prototype.firePatchCompleted=function(s){if(this.iPatchCounter===0){throw new Error("Completed more PATCH requests than sent");}this.iPatchCounter-=1;this.bPatchSuccess=this.bPatchSuccess&&s;if(this.iPatchCounter===0){this.fireEvent("patchCompleted",{success:this.bPatchSuccess});this.bPatchSuccess=true;}};O.prototype.attachPatchSent=function(f,l){this.attachEvent("patchSent",f,l);};O.prototype.detachPatchSent=function(f,l){this.detachEvent("patchSent",f,l);};O.prototype.firePatchSent=function(){this.iPatchCounter+=1;if(this.iPatchCounter===1){this.fireEvent("patchSent");}};O.prototype._findEmptyPathParentContext=function(o){if(this.sPath===""&&this.oContext.getBinding){return this.oContext.getBinding()._findEmptyPathParentContext(this.oContext);}return o;};O.prototype.aggregateQueryOptions=function(q,B,e){var A=_.merge({},this.mAggregatedQueryOptions,this.mLateQueryOptions),f=false,t=this;function m(g,Q,M,i,h){function j(E){var l=!g.$expand[E],s=M+"/"+E;if(l){g.$expand[E]={};if(e&&t.oModel.getMetaModel().fetchObject(s).getResult().$isCollection){return false;}f=true;}return m(g.$expand[E],Q.$expand[E],s,true,l);}function k(s){if(g.$select.indexOf(s)<0){f=true;g.$select.push(s);}return true;}return(!i||Object.keys(g).every(function(n){return n in Q||n==="$count"||n==="$expand"||n==="$select";}))&&Object.keys(Q).every(function(n){switch(n){case"$count":if(Q.$count){g.$count=true;}return true;case"$expand":g.$expand=g.$expand||{};return Object.keys(Q.$expand).every(j);case"$select":g.$select=g.$select||[];return Q.$select.every(k);default:if(h){g[n]=Q[n];return true;}return Q[n]===g[n];}});}if(m(A,q,B)){if(!e){this.mAggregatedQueryOptions=A;}else if(f){this.mLateQueryOptions=A;}return true;}return false;};O.prototype.changeParameters=function(p){var B=Object.assign({},this.mParameters),s,k,t=this;function e(n){if(t.oModel.bAutoExpandSelect&&n in p){throw new Error("Cannot change $expand or $select parameter in "+"auto-$expand/$select mode: "+n+"="+JSON.stringify(p[n]));}}function u(n){if(n==="$filter"||n==="$search"){s=C.Filter;}else if(n==="$orderby"&&s!==C.Filter){s=C.Sort;}else if(!s){s=C.Change;}}if(!p){throw new Error("Missing map of binding parameters");}e("$expand");e("$select");if(this.hasPendingChanges()){throw new Error("Cannot change parameters due to pending changes");}for(k in p){if(k.indexOf("$$")===0){throw new Error("Unsupported parameter: "+k);}if(p[k]===undefined&&B[k]!==undefined){u(k);delete B[k];}else if(B[k]!==p[k]){u(k);if(typeof p[k]==="object"){B[k]=_.clone(p[k]);}else{B[k]=p[k];}}}if(s){this.applyParameters(B,s);}};O.prototype.checkUpdateInternal=function(f){var t=this;function u(){return b.all(t.getDependentBindings().map(function(D){return D.checkUpdateInternal();}));}if(f!==undefined){throw new Error("Unsupported operation: "+c+"#checkUpdateInternal must not"+" be called with parameters");}return this.oCachePromise.then(function(o){if(o&&t.bRelative){return t.fetchResourcePath(t.oContext).then(function(r){if(o.$resourcePath===r){return u();}return t.refreshInternal("");});}return u();});};O.prototype.createInCache=function(u,v,p,t,i,e,s){var f=this;return this.oCachePromise.then(function(o){if(o){return o.create(u,v,p,t,i,e,s).then(function(g){if(o.$resourcePath){delete f.mCacheByResourcePath[o.$resourcePath];}return g;});}return f.oContext.getBinding().createInCache(u,v,_.buildPath(f.oContext.iIndex,f.sPath,p),t,i,e,s);});};O.prototype.createReadGroupLock=function(g,l,i){var G,t=this;function e(){sap.ui.getCore().addPrerenderingTask(function(){i-=1;if(i>0){Promise.resolve().then(e);}else if(t.oReadGroupLock===G){L.debug("Timeout: unlocked "+G,null,c);t.removeReadGroupLock();}});}this.removeReadGroupLock();this.oReadGroupLock=G=this.lockGroup(g,l);if(l){i=2+(i||0);e();}};O.prototype.createRefreshPromise=function(){var p,r;p=new Promise(function(e){r=e;});p.$resolve=r;this.oRefreshPromise=p;return p;};O.prototype.deleteFromCache=function(g,e,p,E,f){var G;if(this.oCache===undefined){throw new Error("DELETE request not allowed");}if(this.oCache){G=g.getGroupId();if(!this.oModel.isAutoGroup(G)&&!this.oModel.isDirectGroup(G)){throw new Error("Illegal update group ID: "+G);}return this.oCache._delete(g,e,p,E,f);}return this.oContext.getBinding().deleteFromCache(g,e,_.buildPath(this.oContext.iIndex,this.sPath,p),E,f);};O.prototype.destroy=function(){this.aChildCanUseCachePromises=[];this.removeReadGroupLock();this.oResumePromise=undefined;a.prototype.destroy.call(this);};O.prototype.fetchIfChildCanUseCache=function(o,s,e){var B=this.getBaseForPathReduction(),f,g,h,F,i=s[0]==="#",m=this.oModel.getMetaModel(),p,r=this.oModel.resolve(s,o),R=o.iReturnValueContextId?o.getPath():this.oModel.resolve(this.sPath,this.oContext),D=R.indexOf("(...)")>=0,t=this;function j(){if(i){return m.fetchObject(F.slice(0,F.lastIndexOf("/")+1));}return _.fetchPropertyAndType(t.oModel.oInterface.fetchMetadata,F);}if(D&&!r.includes("/$Parameter/")||this.getRootBinding().isSuspended()){return b.resolve(r);}g=this.oCachePromise.isRejected()||this.oCache===null||this.oCache&&this.oCache.bSentRequest;f=m.getMetaPath(o.getPath());F=m.getMetaPath(r);p=[this.doFetchQueryOptions(this.oContext),j(),e];h=b.all(p).then(function(k){var l,n=k[2],w,q=k[0],P=k[1],u=m.getReducedPath(r,B);if(s==="$count"||s.slice(-7)==="/$count"||s[0]==="@"){return b.resolve(u);}if(_.getRelativePath(u,R)===undefined){return t.oContext.getBinding().fetchIfChildCanUseCache(t.oContext,_.getRelativePath(r,t.oContext.getPath()),e);}if(D){return b.resolve(u);}l=_.getRelativePath(_.getMetaPath(u),f);if(t.bAggregatedQueryOptionsInitial){t.selectKeyProperties(q,f);t.mAggregatedQueryOptions=_.clone(q);t.bAggregatedQueryOptionsInitial=false;}if(i){w={"$select":[l.slice(1)]};return t.aggregateQueryOptions(w,f,g)?u:undefined;}if(l===""||P&&(P.$kind==="Property"||P.$kind==="NavigationProperty")){w=_.wrapChildQueryOptions(f,l,n,t.oModel.oInterface.fetchMetadata);if(w){return t.aggregateQueryOptions(w,f,g)?u:undefined;}return undefined;}if(l==="value"){return t.aggregateQueryOptions(n,f,g)?u:undefined;}L.error("Failed to enhance query options for auto-$expand/$select as the path '"+F+"' does not point to a property",JSON.stringify(P),c);return undefined;}).then(function(k){if(t.mLateQueryOptions){if(t.oCache){t.oCache.setLateQueryOptions(t.mLateQueryOptions);}else{return t.oContext.getBinding().fetchIfChildCanUseCache(t.oContext,t.sPath,b.resolve(t.mLateQueryOptions)).then(function(P){return P&&k;});}}return k;});this.aChildCanUseCachePromises.push(h);this.oCachePromise=b.all([this.oCachePromise,h]).then(function(k){var l=k[0];if(l&&!l.bSentRequest&&!t.oOperation){l.setQueryOptions(_.merge({},t.oModel.mUriParameters,t.mAggregatedQueryOptions));}return l;});this.oCachePromise.catch(function(E){t.oModel.reportError(t+": Failed to enhance query options for "+"auto-$expand/$select for child "+s,c,E);});return h;};O.prototype.fetchResolvedQueryOptions=function(o){var f,m,M,e=this.oModel,q=this.getQueryOptionsFromParameters();if(!(e.bAutoExpandSelect&&q.$select)){return b.resolve(q);}f=e.oInterface.fetchMetadata;M=_.getMetaPath(e.resolve(this.sPath,o));m=Object.assign({},q,{$select:[]});return b.all(q.$select.map(function(s){return _.fetchPropertyAndType(f,M+"/"+s).then(function(){var w=_.wrapChildQueryOptions(M,s,{},f);if(w){_.aggregateQueryOptions(m,w);}else{_.addToSelect(m,[s]);}});})).then(function(){return m;});};O.prototype.getBaseForPathReduction=function(){var p,P;if(!this.isRoot()){p=this.oContext.getBinding();P=p.getUpdateGroupId();if(P===this.getUpdateGroupId()||this.oModel.getGroupProperty(P,"submit")!==S.API){return p.getBaseForPathReduction();}}return this.oModel.resolve(this.sPath,this.oContext);};O.prototype.getCacheQueryOptions=function(){return this.mCacheQueryOptions||_.getQueryOptionsForPath(this.oContext.getBinding().getCacheQueryOptions(),this.sPath);};O.prototype.getQueryOptionsForPath=function(p,o){if(Object.keys(this.mParameters).length){return _.getQueryOptionsForPath(this.getQueryOptionsFromParameters(),p);}o=o||this.oContext;if(!this.bRelative||!o.getQueryOptionsForPath){return{};}return o.getQueryOptionsForPath(_.buildPath(this.sPath,p));};O.prototype.getResumePromise=function(){return this.oResumePromise;};O.prototype.hasPendingChangesInDependents=function(){var D=this.getDependentBindings();return D.some(function(o){var e=o.oCache,h;if(e!==undefined){if(e&&e.hasPendingChangesForPath("")){return true;}}else if(o.hasPendingChangesForPath("")){return true;}if(o.mCacheByResourcePath){h=Object.keys(o.mCacheByResourcePath).some(function(p){return o.mCacheByResourcePath[p].hasPendingChangesForPath("");});if(h){return true;}}return o.hasPendingChangesInDependents();})||this.oModel.withUnresolvedBindings("hasPendingChangesInCaches",this.oModel.resolve(this.sPath,this.oContext).slice(1));};O.prototype.isPatchWithoutSideEffects=function(){return this.mParameters.$$patchWithoutSideEffects||!this.isRoot()&&this.oContext&&this.oContext.getBinding().isPatchWithoutSideEffects();};O.prototype.isMeta=function(){return false;};O.prototype.refreshDependentBindings=function(r,g,e,k){return b.all(this.getDependentBindings().map(function(D){return D.refreshInternal(r,g,e,k);}));};O.prototype.removeReadGroupLock=function(){if(this.oReadGroupLock){this.oReadGroupLock.unlock(true);this.oReadGroupLock=undefined;}};O.prototype.refreshSuspended=function(g){if(g&&g!==this.getGroupId()){throw new Error(this+": Cannot refresh a suspended binding with group ID '"+g+"' (own group ID is '"+this.getGroupId()+"')");}this.setResumeChangeReason(C.Refresh);};O.prototype.resetChangesInDependents=function(p){this.getDependentBindings().forEach(function(D){p.push(D.oCachePromise.then(function(o){if(o){o.resetChangesForPath("");}D.resetInvalidDataState();}).unwrap());if(D.mCacheByResourcePath){Object.keys(D.mCacheByResourcePath).forEach(function(P){D.mCacheByResourcePath[P].resetChangesForPath("");});}D.resetChangesInDependents(p);});};O.prototype.resolveRefreshPromise=function(r){if(this.oRefreshPromise){this.oRefreshPromise.$resolve(r);this.oRefreshPromise=null;}return r;};O.prototype._resume=function(A){var t=this;function e(){t.bSuspended=false;if(t.oResumePromise){t.resumeInternal(true);t.oResumePromise.$resolve();t.oResumePromise=undefined;}}if(this.oOperation){throw new Error("Cannot resume an operation binding: "+this);}if(this.bRelative&&(!this.oContext||this.oContext.fetchValue)){throw new Error("Cannot resume a relative binding: "+this);}if(!this.bSuspended){throw new Error("Cannot resume a not suspended binding: "+this);}if(A){this.createReadGroupLock(this.getGroupId(),true,1);sap.ui.getCore().addPrerenderingTask(e);}else{this.createReadGroupLock(this.getGroupId(),true);e();}};O.prototype.resume=function(){this._resume(false);};O.prototype.resumeAsync=function(){this._resume(true);return Promise.resolve(this.oResumePromise);};O.prototype.selectKeyProperties=function(q,m){_.selectKeyProperties(q,this.oModel.getMetaModel().getObject(m+"/"));};O.prototype.suspend=function(){var r;if(this.oOperation){throw new Error("Cannot suspend an operation binding: "+this);}if(this.bRelative&&(!this.oContext||this.oContext.fetchValue)){throw new Error("Cannot suspend a relative binding: "+this);}if(this.bSuspended){throw new Error("Cannot suspend a suspended binding: "+this);}if(this.hasPendingChanges()){throw new Error("Cannot suspend a binding with pending changes: "+this);}this.bSuspended=true;this.oResumePromise=new b(function(e,f){r=e;});this.oResumePromise.$resolve=r;this.removeReadGroupLock();};O.prototype.updateAggregatedQueryOptions=function(n){var A=Object.keys(n),t=this;if(this.mAggregatedQueryOptions){A=A.concat(Object.keys(this.mAggregatedQueryOptions));A.forEach(function(N){if(N==="$select"||N==="$expand"){return;}if(n[N]===undefined){delete t.mAggregatedQueryOptions[N];}else{t.mAggregatedQueryOptions[N]=n[N];}});}};O.prototype.visitSideEffects=function(g,p,o,n,P,s){var D=o?this.oModel.getDependentBindings(o):this.getDependentBindings();D.forEach(function(e){var f=_.buildPath(s,_.getMetaPath(e.getPath())),h;if(e.oCache){h=_.stripPathPrefix(f,p);if(h.length){P.push(e.requestSideEffects(g,h));}}else if(n[f]){P.push(e.refreshInternal("",g));}else{e.visitSideEffects(g,p,null,n,P,f);}});};function d(p){if(this){O.apply(this,arguments);}else{Object.assign(p,O.prototype);}}d.prototype.doDeregisterChangeListener=O.prototype.doDeregisterChangeListener;d.prototype.doSetProperty=O.prototype.doSetProperty;d.prototype.destroy=O.prototype.destroy;d.prototype.hasPendingChangesForPath=O.prototype.hasPendingChangesForPath;return d;},false);
