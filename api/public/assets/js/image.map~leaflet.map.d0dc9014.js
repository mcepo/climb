(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["image.map~leaflet.map","image.service"],{"1f54":function(e,t,n){"use strict";var r=n("5f68"),a=n("e11e"),i=(n("6cc5"),{iconUrl:Object(r["a"])('<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M0 0h24v24H0z" fill="none"/>'),iconSize:[20,32],iconAnchor:[10,24],shadowUrl:Object(r["a"])("")});a["Icon"].Default.prototype.options=i,a["Marker"].prototype.options.icon=new a["Icon"](i)},5033:function(e,t,n){"use strict";n.r(t),n.d(t,"ImageService",(function(){return p}));n("d3b7"),n("96cf");var r=n("1da1"),a=n("3835"),i=n("d4ec"),u=n("bee2"),c=n("e11e"),s=n("0613"),o=n("842b"),h=n("17b6"),p=function(){function e(){Object(i["a"])(this,e)}return Object(u["a"])(e,[{key:"registerImageWatch",value:function(){var e=this;this._unWatchStore=s["a"].watch((function(e,t){return t["image/get"]}),(function(t,n){t&&t.id!==(null===n||void 0===n?void 0:n.id)&&e.open(t)}),{immediate:!0})}},{key:"getBoundsDepricated",value:function(e){var t=Object(a["a"])(e,2),n=t[0],r=t[1];return new c["LatLngBounds"](new c["LatLng"](0,0),new c["LatLng"](r/10,n/10))}},{key:"getBounds",value:function(e){var t=Object(a["a"])(e,2),n=t[0],r=t[1];return new c["LatLngBounds"](new c["LatLng"](-n,r),new c["LatLng"](n,-r))}},{key:"getMaxBounds",value:function(e){return e.pad(.3)}},{key:"open",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(t){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=t.boundary?this.getBounds(t.boundary):this.getBoundsDepricated(t.size),this._map.setMaxBounds(this.getMaxBounds(n)),this._map.fitBounds(n),this._imageOverlayThumbnail&&this._map.removeLayer(this._imageOverlayThumbnail),this._imageOverlay&&this._map.removeLayer(this._imageOverlay),e.t0=c["imageOverlay"],e.next=8,this.getImage(t.id,"thumbnail");case 8:return e.t1=e.sent,e.t2=n,this._imageOverlayThumbnail=(0,e.t0)(e.t1,e.t2),this._map.addLayer(this._imageOverlayThumbnail),e.t3=c["imageOverlay"],e.next=15,this.getImage(t.id);case 15:e.t4=e.sent,e.t5=n,e.t6={zIndex:2},this._imageOverlay=(0,e.t3)(e.t4,e.t5,e.t6),this._map.addLayer(this._imageOverlay);case 20:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"getImage",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(t){var n,r,a=arguments;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:null,r="image/"+t,n&&(r+="/"+n),n=null!==n&&void 0!==n?n:"full",e.next=6,this.fetchImage(n+"-"+t,r);case 6:return e.abrupt("return",e.sent);case 7:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"fetchImage",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(t,n){var r,a,i=arguments;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r=i.length>2&&void 0!==i[2]?i[2]:"jpeg",e.next=3,this.loadImageFromCache(t,r);case 3:if(e.t0=e.sent,e.t0){e.next=8;break}return e.next=7,this.getAndCacheImage(t,n);case 7:e.t0=e.sent;case 8:if(a=e.t0,!a){e.next=11;break}return e.abrupt("return",a);case 11:return e.abrupt("return",n);case 12:case"end":return e.stop()}}),e,this)})));function t(t,n){return e.apply(this,arguments)}return t}()},{key:"loadImageFromCache",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(t,n){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,h["b"].readFile({path:t,directory:h["a"].Cache});case 3:return r=e.sent,e.abrupt("return","data:image/"+n+";base64,"+r.data);case 7:return e.prev=7,e.t0=e["catch"](0),e.abrupt("return",null);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));function t(t,n){return e.apply(this,arguments)}return t}()},{key:"getAndCacheImage",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(t,n){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.getBase64Image(n);case 2:if(r=e.sent,r){e.next=5;break}return e.abrupt("return",null);case 5:return h["b"].writeFile({path:t,data:r,directory:h["a"].Cache}),e.abrupt("return",r);case 7:case"end":return e.stop()}}),e,this)})));function t(t,n){return e.apply(this,arguments)}return t}()},{key:"getBase64Image",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(t){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,o["a"].get(t,{responseType:"blob"});case 3:return n=e.sent,e.next=6,this.convertToBase64(n.data);case 6:return e.abrupt("return",e.sent);case 9:return e.prev=9,e.t0=e["catch"](0),e.abrupt("return",null);case 12:case"end":return e.stop()}}),e,this,[[0,9]])})));function t(t){return e.apply(this,arguments)}return t}()},{key:"convertToBase64",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){var r=new FileReader;r.onerror=n,r.onload=function(){e(r.result)},r.readAsDataURL(t)})));case 1:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"map",set:function(e){this._map=e,this._map?this.registerImageWatch():this._unWatchStore&&this._unWatchStore()}}]),e}(),l=new p;t["default"]=l},"6cc5":function(e,t,n){}}]);