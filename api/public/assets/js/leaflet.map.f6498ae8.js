(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["leaflet.map"],{"5d41":function(t,a,o){var e=o("23e7"),n=o("861d"),i=o("825a"),r=o("c60d"),s=o("06cf"),l=o("e163");function c(t,a){var o,e,d=arguments.length<3?t:arguments[2];return i(t)===d?t[a]:(o=s.f(t,a),o?r(o)?o.value:void 0===o.get?void 0:o.get.call(d):n(e=l(t))?c(e,a,d):void 0)}e({target:"Reflect",stat:!0},{get:c})},"6f6b":function(t,a,o){"use strict";o.r(a);var e=function(){var t=this,a=t.$createElement,o=t._self._c||a;return o("div",{staticClass:"map"},[o("v-btn",{staticClass:"map-button",staticStyle:{position:"fixed"},attrs:{title:"My location","aria-label":"My location",fab:"",small:""},on:{click:function(a){return t.toggleTracking()}}},[t.trackingId?o("v-icon",[t._v("gps_off")]):o("v-icon",[t._v("gps_fixed")])],1),o("div",{staticClass:"map",attrs:{id:"leaflet-map"}}),o("v-overlay",{attrs:{absolute:!0,opacity:.5,"z-index":199,value:t.loading}},[o("v-progress-circular",{attrs:{indeterminate:"",size:64}})],1)],1)},n=[],i=(o("d81d"),o("b680"),o("e11e")),r=(o("4160"),o("b0c0"),o("0613")),s=o("d4ec"),l=o("bee2"),c=o("7e84");o("e439"),o("5d41");function d(t,a){while(!Object.prototype.hasOwnProperty.call(t,a))if(t=Object(c["a"])(t),null===t)break;return t}function p(t,a,o){return p="undefined"!==typeof Reflect&&Reflect.get?Reflect.get:function(t,a,o){var e=d(t,a);if(e){var n=Object.getOwnPropertyDescriptor(e,a);return n.get?n.get.call(o):n.value}},p(t,a,o||t)}var u=o("2caf"),h=o("262e"),m=o("5033"),f=function(t){Object(h["a"])(o,t);var a=Object(u["a"])(o);function o(){return Object(s["a"])(this,o),a.apply(this,arguments)}return Object(l["a"])(o,[{key:"createTile",value:function(t,a){var e=p(Object(c["a"])(o.prototype),"createTile",this).call(this,t,a);return m["a"].fetchImage("tile-"+t.x+"-"+t.y+"-"+t.z,e.src,"png").then((function(t){e.src=t})),e.src="",e}}]),o}(i["TileLayer"]),g={name:"Cartodb",url:"https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png"},y=[{name:"OpenCycleMap",url:"https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d"},{name:"Transport",url:"https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d"},{name:"Landscape",url:"https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d"},{name:"Outdoors",url:"https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d"},{name:"Transport Dark",url:"https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d"},{name:"Spinal Map",url:"https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d"},{name:"Pioneer",url:"https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d"},{name:"Mobile Atlas",url:"https://tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d"},{name:"Neighbourhood",url:"https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d"}],k=function(t){var a=i["control"].layers().addTo(t),o=new f(g.url,{crossOrigin:!0});t.addLayer(o),a.addBaseLayer(o,g.name),r["a"].state.online&&y.forEach((function(t){a.addBaseLayer(new i["TileLayer"](t.url),t.name)}))},b=o("b922"),v=o("a005"),$=o("7a36"),w=o("b005"),L={map:null,location:{marker:null,circle:null,trail:null},computed:{loading:function(){return this.$store.state.area.loading}},data:function(){return{trackingId:null}},mounted:function(){var t=this,a=new i["LatLngBounds"](new i["LatLng"](89,-179),new i["LatLng"](-89,179));this.$options.map=new i["Map"]("leaflet-map",{noWrap:!0,maxZoom:18,minZoom:2,zoom:2,maxBounds:a,maxBoundsViscosity:1,center:[0,0],zoomControl:!1,renderer:new i["Canvas"]({tolerance:5})}),k(this.$options.map),b["a"].map=this.$options.map,i["control"].zoom({position:"bottomright"}).addTo(this.$options.map),i["control"].scale().addTo(this.$options.map),this.$options.location.trail=new i["Polyline"]([]),this.$options.location.trail.addTo(this.$options.map),this.$options.map.on("moveend",(function(){w["a"].state.left||(b["a"].lastMapBounds=t.$options.map.getBounds())}))},methods:{toggleTracking:function(){this.trackingId?(this.$store.dispatch("snackbar/show","GPS location disabled."),$["a"].unregisterCallback(this.trackingId),this.trackingId=null,this.$options.location.marker.remove(),this.$options.location.circle.remove(),this.$options.location.trail.remove(),this.$options.location.trail=new i["Polyline"]([])):(this.$store.dispatch("snackbar/show","Getting location,<br>this may take some time ..."),this.trackingId=$["a"].registerCallback(this.moveMarker))},moveMarker:function(t){if(t){this.$options.location.marker&&this.$options.location.marker.remove(),this.$options.location.circle&&this.$options.location.circle.remove();var a=[t.latitude,t.longitude],o=t.accuracy;this.$options.location.marker=new i["Marker"](a,{title:"My Location"}).bindTooltip("My Location<br>Accuracy: "+o.toFixed(2)+"m"),v["a"].currentLocation.default(this.$options.location.marker),this.$options.location.marker.addTo(this.$options.map),o>10&&(this.$options.location.circle=new i["Circle"](a,{radius:o,stroke:!1}),this.$options.location.circle.addTo(this.$options.map)),o<100&&this.$options.location.trail.addLatLng(a),this.goToLocation()}},goToLocation:function(){this.$options.location.marker&&(this.$options.map.setView(this.$options.location.marker.getLatLng(),12),this.$options.location.marker.openTooltip())}},destroyed:function(){b["a"].map=null,this.$options.watchCallbackId&&$["a"].unregisterCallback(this.$options.watchCallbackId)}},x=L,T=o("2877"),z=o("6544"),O=o.n(z),C=o("8336"),M=o("132d"),I=o("a797"),j=o("490a"),B=Object(T["a"])(x,e,n,!1,null,null,null);a["default"]=B.exports;O()(B,{VBtn:C["a"],VIcon:M["a"],VOverlay:I["a"],VProgressCircular:j["a"]})},c60d:function(t,a,o){var e=o("5135");t.exports=function(t){return void 0!==t&&(e(t,"value")||e(t,"writable"))}}}]);