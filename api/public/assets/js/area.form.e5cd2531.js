(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["area.form"],{"05d5":function(t,a,e){"use strict";var i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("v-card-text",{staticClass:"pt-0"},[e("v-select",{attrs:{items:t.items,"item-text":"label","item-value":"value",label:"Orientation",required:"",chips:t.multiple,multiple:t.multiple},on:{change:function(a){return t.$emit("input",t.model)}},model:{value:t.model,callback:function(a){t.model=a},expression:"model"}})],1)},n=[],r=(e("a9e3"),e("5d57")),s={props:{value:[Array,Number],multiple:Boolean},data:function(){return{model:null}},created:function(){this.model=this.value},computed:{items:function(){return r["a"].orientation.items}}},l=s,o=e("2877"),u=e("6544"),c=e.n(u),d=e("99d9"),h=e("b974"),m=Object(o["a"])(l,i,n,!1,null,null,null);a["a"]=m.exports;c()(m,{VCardText:d["c"],VSelect:h["a"]})},"33e9":function(t,a,e){},5963:function(t,a,e){"use strict";e("99af"),e("d81d"),e("a9e3");var i=e("2909"),n=e("ade3"),r=e("5530"),s=(e("33e9"),e("9a18")),l=e("80d2");a["a"]=s["a"].extend({name:"v-range-slider",props:{value:{type:Array,default:function(){return[0,0]}}},data:function(){return{activeThumb:null,lazyValue:this.value}},computed:{classes:function(){return Object(r["a"])({},s["a"].options.computed.classes.call(this),{"v-input--range-slider":!0})},internalValue:{get:function(){return this.lazyValue},set:function(t){var a=this,e=t.map((function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return a.roundValue(Math.min(Math.max(t,a.minValue),a.maxValue))}));if(e[0]>e[1]||e[1]<e[0]){if(null!==this.activeThumb){var i=1===this.activeThumb?0:1,n=this.$refs["thumb_".concat(i)];n.focus()}e=[e[1],e[0]]}this.lazyValue=e,Object(l["j"])(e,this.value)||this.$emit("input",e),this.validate()}},inputWidth:function(){var t=this;return this.internalValue.map((function(a){return(t.roundValue(a)-t.minValue)/(t.maxValue-t.minValue)*100}))},trackFillStyles:function(){var t=s["a"].options.computed.trackFillStyles.call(this),a=Math.abs(this.inputWidth[0]-this.inputWidth[1]),e=this.vertical?"height":"width",i=this.vertical?this.$vuetify.rtl?"top":"bottom":this.$vuetify.rtl?"right":"left";return t[e]="".concat(a,"%"),t[i]="".concat(this.inputWidth[0],"%"),t}},methods:{getTrackStyle:function(t,a){var e,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,s=this.vertical?this.$vuetify.rtl?"top":"bottom":this.$vuetify.rtl?"right":"left",l=this.vertical?"height":"width",o="calc(".concat(t,"% + ").concat(i,"px)"),u="calc(".concat(a,"% + ").concat(r,"px)");return e={transition:this.trackTransition},Object(n["a"])(e,s,o),Object(n["a"])(e,l,u),e},getIndexOfClosestValue:function(t,a){return Math.abs(t[0]-a)<Math.abs(t[1]-a)?0:1},genInput:function(){var t=this;return Object(l["h"])(2).map((function(a){var e=s["a"].options.methods.genInput.call(t);return e.data=e.data||{},e.data.attrs=e.data.attrs||{},e.data.attrs.value=t.internalValue[a],e.data.attrs.id="input-".concat(a?"max":"min","-").concat(t._uid),e}))},genTrackContainer:function(){var t=this,a=[];if(this.disabled){var e=10,n=[[0,this.inputWidth[0],0,-e],[this.inputWidth[0],Math.abs(this.inputWidth[1]-this.inputWidth[0]),e,-2*e],[this.inputWidth[1],Math.abs(100-this.inputWidth[1]),e,0]];this.$vuetify.rtl&&n.reverse(),a.push.apply(a,Object(i["a"])(n.map((function(a){return t.$createElement("div",t.setBackgroundColor(t.computedTrackColor,{staticClass:"v-slider__track-background",style:t.getTrackStyle.apply(t,Object(i["a"])(a))}))}))))}else a.push(this.$createElement("div",this.setBackgroundColor(this.computedTrackColor,{staticClass:"v-slider__track-background",style:this.getTrackStyle(0,100)})),this.$createElement("div",this.setBackgroundColor(this.computedColor,{staticClass:"v-slider__track-fill",style:this.trackFillStyles})));return this.$createElement("div",{staticClass:"v-slider__track-container",ref:"track"},a)},genChildren:function(){var t=this;return[this.genInput(),this.genTrackContainer(),this.genSteps(),Object(l["h"])(2).map((function(a){var e=t.internalValue[a],i=function(e){t.isActive=!0,t.activeThumb=a,t.onThumbMouseDown(e)},n=function(e){t.isFocused=!0,t.activeThumb=a,t.$emit("focus",e)},r=function(a){t.isFocused=!1,t.activeThumb=null,t.$emit("blur",a)},s=t.inputWidth[a],l=t.isActive&&t.activeThumb===a,o=t.isFocused&&t.activeThumb===a;return t.genThumbContainer(e,s,l,o,i,n,r,"thumb_".concat(a))}))]},onSliderClick:function(t){if(!this.isActive){if(this.noClick)return void(this.noClick=!1);var a=this.parseMouseMove(t),e=a.value,i=a.isInsideTrack;if(i){this.activeThumb=this.getIndexOfClosestValue(this.internalValue,e);var n="thumb_".concat(this.activeThumb),r=this.$refs[n];r.focus()}this.setInternalValue(e),this.$emit("change",this.internalValue)}},onMouseMove:function(t){var a=this.parseMouseMove(t),e=a.value,i=a.isInsideTrack;i&&null===this.activeThumb&&(this.activeThumb=this.getIndexOfClosestValue(this.internalValue,e)),this.setInternalValue(e)},onKeyDown:function(t){if(null!==this.activeThumb){var a=this.parseKeyDown(t,this.internalValue[this.activeThumb]);null!=a&&(this.setInternalValue(a),this.$emit("change",this.internalValue))}},setInternalValue:function(t){var a=this;this.internalValue=this.internalValue.map((function(e,i){return i===a.activeThumb?t:Number(e)}))}}})},"732e":function(t,a,e){"use strict";e.r(a);var i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("v-form",{ref:"form",model:{value:t.valid,callback:function(a){t.valid=a},expression:"valid"}},[e("v-card",{staticClass:"ma-2",attrs:{text:"",color:"transparent",flat:""}},[e("v-card-title",[t._v(" "+t._s(t.area?"Editing - "+t.area.name:"Adding area")+" ")]),e("v-card-text",[e("v-text-field",{attrs:{rules:t.nameRules,label:"Area name",required:""},model:{value:t.formData.name,callback:function(a){t.$set(t.formData,"name",a)},expression:"formData.name"}})],1),e("v-card-text",{staticClass:"pt-0"},[e("v-select",{attrs:{items:t.types,rules:t.typeRules,label:"Area type",required:""},model:{value:t.formData.type_id,callback:function(a){t.$set(t.formData,"type_id",a)},expression:"formData.type_id"}})],1),t.allowedOrientation?e("orientation",{model:{value:t.formData.orientation,callback:function(a){t.$set(t.formData,"orientation",a)},expression:"formData.orientation"}}):t._e(),e("v-subheader",[t._v("Minimum and maximum altitude in this area (m)")]),e("v-card-text",{staticClass:"pt-0"},[e("v-layout",{attrs:{row:""}},[e("v-flex",{staticStyle:{width:"50px"},attrs:{shrink:""}},[e("v-text-field",{staticClass:"mt-0",attrs:{"hide-details":"","single-line":"",type:"number"},model:{value:t.formData.altitude[0],callback:function(a){t.$set(t.formData.altitude,0,a)},expression:"formData.altitude[0]"}})],1),e("v-flex",{staticClass:"px-3"},[e("v-range-slider",{attrs:{max:t.altitudeLimits[1],min:t.altitudeLimits[0]},model:{value:t.formData.altitude,callback:function(a){t.$set(t.formData,"altitude",a)},expression:"formData.altitude"}})],1),e("v-flex",{staticStyle:{width:"50px"},attrs:{shrink:""}},[e("v-text-field",{staticClass:"mt-0",attrs:{"hide-details":"","single-line":"",type:"number"},model:{value:t.formData.altitude[1],callback:function(a){t.$set(t.formData.altitude,1,a)},expression:"formData.altitude[1]"}})],1)],1)],1),e("v-layout",{attrs:{"justify-center":""}},[e("v-card-actions",[e("v-btn",{attrs:{disabled:!t.valid,color:"success"},on:{click:t.submit}},[t._v("Submit")]),e("v-btn",{attrs:{color:"error"},on:{click:t.close}},[t._v("Cancel")])],1)],1)],1)],1)},n=[],r=(e("7db0"),e("4160"),e("159b"),e("5d57")),s=e("05d5"),l=e("842b"),o={props:["area","parent"],components:{Orientation:s["a"]},areaHierarchy:[[1,2,3,5,6],[1,2,3,5,6],[3,4,5,6],[4,5,6],[5,6,7],[6,7],[7]],data:function(){return{valid:!0,nameRules:[function(t){return!!t||"Name is required"}],typeRules:[function(t){return null!==t||"Must select an area type"}],formData:{}}},computed:{allowedOrientation:function(){var t=this;return r["a"].orientation.areaTypes.find((function(a){return a===t.formData.type_id}))},types:function(){if(!this.parent)return[{text:r["a"].area[0],value:0}];console.log(this.$options),console.log(this.$options.areaHierarchy),console.log(this.parent);var t=[];return this.$options.areaHierarchy[this.parent.type_id].forEach((function(a){t.push({text:r["a"].area[a],value:a})})),t},altitudeLimits:function(){var t,a;return[(null===(t=this.parent)||void 0===t?void 0:t.altitude[0])||0,(null===(a=this.parent)||void 0===a?void 0:a.altitude[1])||8848]}},created:function(){this.formDefaultValues(),this.area&&this.assignPropToFormData(this.area)},watch:{area:function(t){t&&this.assignPropToFormData(t)}},methods:{assignPropToFormData:function(t){for(var a in this.formDefaultValues(),this.formData)this.formData[a]=t[a]},formDefaultValues:function(){this.formData={name:"",type_id:null,altitude:this.altitudeLimits,orientation:null}},close:function(){this.$store.dispatch("form/close")},submit:function(){var t,a=this;this.area&&this.area.id?(this.$store.commit("snackbar/show","Updating area ... "),l["b"].put("area/"+this.area.id,this.formData).then((function(){a.formData.id=a.area.id,a.afterSubmit(a.formData)}))):(this.$store.commit("snackbar/show","Adding area ... "),this.formData.parent_id=(null===(t=this.parent)||void 0===t?void 0:t.id)||null,l["b"].post("area",this.formData).then((function(t){var e=t.data;a.formData.id=e.id,a.formData.map_tag=null,a.afterSubmit(a.formData),a.$store.commit("area/appendArea",{areaId:e.id,parentId:e.parent_id})})))},afterSubmit:function(t){this.$store.commit("area/add",t),this.$store.commit("snackbar/success","Changes stored!"),window.innerWidth<1264&&this.$store.commit("drawers/setRight",!1),this.$store.commit("drawers/setLeft",!0),this.close()}}},u=o,c=e("2877"),d=e("6544"),h=e.n(d),m=e("8336"),f=e("b0af"),v=e("99d9"),p=e("0e8f"),b=e("4bd4"),g=e("a722"),y=e("5963"),V=e("b974"),k=e("e0c7"),x=e("8654"),D=Object(c["a"])(u,i,n,!1,null,null,null);a["default"]=D.exports;h()(D,{VBtn:m["a"],VCard:f["a"],VCardActions:v["a"],VCardText:v["c"],VCardTitle:v["d"],VFlex:p["a"],VForm:b["a"],VLayout:g["a"],VRangeSlider:y["a"],VSelect:V["a"],VSubheader:k["a"],VTextField:x["a"]})},"9a18":function(t,a,e){"use strict";var i=e("ba0d");a["a"]=i["a"]}}]);