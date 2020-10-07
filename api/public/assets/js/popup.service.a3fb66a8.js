(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["popup.service"],{"3b97":function(t,e,n){"use strict";n.r(e);n("fb6a");var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("popup",{attrs:{tag:t.tag,item:t.item,type:"area"},scopedSlots:t._u([{key:"header",fn:function(){return[n("v-card-subtitle",{staticClass:"pa-0"},[t._v(t._s(t.type))])]},proxy:!0},{key:"item",fn:function(){return[n("h2",[t._v(t._s(t.item.name))])]},proxy:!0},{key:"content",fn:function(){return[n("area-stats",{attrs:{item:t.item}})]},proxy:!0}])})},r=[],i=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-card",{staticClass:"popup-box",attrs:{flat:""}},[t._t("header"),n("a",{staticStyle:{"white-space":"nowrap"},on:{click:function(e){return t.openItem()}}},[t._t("item")],2),t._t("content"),n("v-divider"),n("v-card-actions",[n("tag-control",{attrs:{type:t.type,item:t.item}}),n("delete-button",{attrs:{type:"tag",item:t.tag}})],1)],2)},u=[],s=(n("9911"),n("b79f")),p=n("69c5"),c=n("0613"),l=n("0670"),m=n("afbc"),d=i["a"].extend({store:c["a"],vuetify:l["a"],router:m["a"],props:["tag","item","type","url"],components:{TagControl:p["a"],DeleteButton:s["a"]},computed:{link:function(){return this.url||Object(m["b"])(this.type,this.item.id)}},methods:{openItem:function(){this.$router.push(this.link),"image"!==this.type?this.$store.commit("drawers/setLeft",!0):this.$store.commit("drawers/setLeft",!1)}}}),f=d,h=n("2877"),g=n("6544"),y=n.n(g),v=n("b0af"),_=n("99d9"),b=n("ce7e"),x=Object(h["a"])(f,o,u,!1,null,null,null),k=x.exports;y()(x,{VCard:v["a"],VCardActions:_["a"],VDivider:b["a"]});var w=n("c6a6"),C=n("5d57"),S=i["a"].extend({props:["item","tag"],components:{Popup:k,AreaStats:w["a"]},computed:{type:function(){return C["c"].getTypeName(C["b"].Area,this.item.type_id)}}}),V=S,$=Object(h["a"])(V,a,r,!1,null,null,null),j=$.exports;y()($,{VCardSubtitle:_["b"]});var P=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("popup",{attrs:{tag:t.tag,item:t.item,type:"image"},scopedSlots:t._u([{key:"item",fn:function(){return[n("v-img",{attrs:{src:t.imageLink(t.item.id),onerror:"this.style.display='none'",width:"100%",contain:""},on:{load:function(e){t.loading=!1}}},[t.loading?n("v-skeleton-loader",{attrs:{type:"image",height:t.height}}):t._e(),t.loading?t._e():n("v-overlay",{attrs:{absolute:!0,value:!0}},[t._v(" Click me ")])],1)]},proxy:!0}])})},O=[],L=i["a"].extend({props:["item","tag"],components:{Popup:k},data:function(){return{loading:!0}},computed:{height:function(){var t=this.item.size[1]/this.item.size[0];return 200*t+"px"}},methods:{imageLink:function(t){return"/api/image/"+t+"/thumbnail"}}}),E=L,A=n("adda"),I=n("a797"),T=n("3129"),D=Object(h["a"])(E,P,O,!1,null,null,null),z=D.exports;y()(D,{VImg:A["a"],VOverlay:I["a"],VSkeletonLoader:T["a"]});var J=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("popup",{attrs:{tag:t.tag,item:t.item,type:"pitch",url:t.url},scopedSlots:t._u([{key:"header",fn:function(){return[n("v-card-subtitle",{staticClass:"pa-0"},[t._v("Pitch")])]},proxy:!0},{key:"item",fn:function(){return[n("h2",[t._v(t._s(t.route.name))])]},proxy:!0},{key:"content",fn:function(){return[n("v-layout",{attrs:{"justify-space-between":""}},[n("div",[t._v(t._s(t.grade))]),n("div",[t._v(t._s(t.length))])])]},proxy:!0}])})},N=[],R=n("a96b"),B=i["a"].extend({props:["item","tag"],components:{Popup:k},computed:{url:function(){return Object(m["b"])("route",this.item.route_id)},route:function(){return c["a"].state.route.byIds[this.item.route_id]},grade:function(){return this.item&&R["a"].forge(this.item.grades)},length:function(){return this.item.length?this.item.length+"m":""}}}),U=B,q=n("a722"),F=Object(h["a"])(U,J,N,!1,null,null,null),G=F.exports;y()(F,{VCardSubtitle:_["b"],VLayout:q["a"]});var H=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("popup",{attrs:{tag:t.tag,item:t.item,type:"route"},scopedSlots:t._u([{key:"header",fn:function(){return[n("v-card-subtitle",{staticClass:"pa-0"},[t._v(t._s(t.type))])]},proxy:!0},{key:"item",fn:function(){return[n("h2",[t._v(t._s(t.item.name))])]},proxy:!0},{key:"content",fn:function(){return[n("v-layout",{attrs:{"justify-space-between":""}},[n("div",[t._v(t._s(t.grade))]),n("div",[t._v(t._s(t.length))])])]},proxy:!0}])})},K=[],M=i["a"].extend({props:["item","tag"],components:{Popup:k},computed:{type:function(){return C["c"].getTypeName(C["b"].Route,this.item.type_id)},grade:function(){return this.item&&R["a"].forge(this.item.grades)},length:function(){return this.item.length?this.item.length+"m":""}}}),Q=M,W=Object(h["a"])(Q,H,K,!1,null,null,null),X=W.exports;y()(W,{VCardSubtitle:_["b"],VLayout:q["a"]});var Y=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("popup",{attrs:{tag:t.tag,item:t.item,type:"trail"},scopedSlots:t._u([{key:"header",fn:function(){return[n("v-card-subtitle",{staticClass:"pa-0"},[t._v("Trail")])]},proxy:!0},{key:"item",fn:function(){return[n("h2",[t._v(t._s(t.item.name))])]},proxy:!0},{key:"content",fn:function(){},proxy:!0}])})},Z=[],tt=i["a"].extend({props:["item","tag"],components:{Popup:k}}),et=tt,nt=Object(h["a"])(et,Y,Z,!1,null,null,null),at=nt.exports;y()(nt,{VCardSubtitle:_["b"]});var rt={Area:j,Image:z,Pitch:G,Route:X,Trail:at},it={createPopup:function(t,e){var n=t.tag.tagged_type.charAt(0).toUpperCase()+t.tag.tagged_type.slice(1),a=rt[n];t.layer.bindPopup(new a({propsData:{item:t.item,tag:t.tag}}).$mount().$el).openPopup(e)}};e["default"]=it}}]);