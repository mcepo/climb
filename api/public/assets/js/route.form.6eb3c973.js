(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["route.form"],{"04c7":function(t,e,a){"use strict";var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:""}},[a("v-layout",{attrs:{column:""}},[a("v-subheader",[t._v("Grade")]),t._l(t.primaryGrades,(function(e,r){return a("v-flex",{key:e.id},[a("v-card",{staticClass:"pa-1",attrs:{text:"",flat:""}},[a("v-subheader",{staticClass:"pa-0 justify-center"},[t._v(t._s(e.grade.name))]),a("v-card-text",{staticClass:"pa-0"},[a("v-slider",{attrs:{max:e.maxGrades,"thumb-label":"always",ticks:"always","thumb-size":"34"},on:{change:function(e){return t.updateValue()}},scopedSlots:t._u([{key:"thumb-label",fn:function(r){return[a("span",[t._v(t._s(e.tickLabels[r.value]))])]}}],null,!0),model:{value:t.filters[r],callback:function(e){t.$set(t.filters,r,e)},expression:"filters[index]"}})],1)],1)],1)})),a("v-expansion-panels",{attrs:{flat:""}},[a("v-expansion-panel",[a("v-expansion-panel-header",[a("v-subheader",{staticClass:"pa-0"},[t._v(" More grades ... ")])],1),a("v-expansion-panel-content",t._l(t.moreGrades,(function(e,r){return a("v-flex",{key:e.id},[a("v-card",{staticClass:"pa-1",attrs:{text:"",flat:""}},[a("v-subheader",{staticClass:"pa-0 justify-center"},[t._v(t._s(e.grade.name))]),a("v-card-text",{staticClass:"pa-0"},[a("v-slider",{attrs:{max:e.maxGrades,"thumb-label":"always",ticks:"always","thumb-size":"34"},on:{change:function(e){return t.updateValue()}},scopedSlots:t._u([{key:"thumb-label",fn:function(r){return[a("span",[t._v(t._s(e.tickLabels[r.value]))])]}}],null,!0),model:{value:t.filters[r],callback:function(e){t.$set(t.filters,r,e)},expression:"filters[index]"}})],1)],1)],1)})),1)],1)],1)],2)],1)},s=[],i=(a("4160"),a("b0c0"),a("159b"),a("a96b")),n={props:["value","multipitch"],data:function(){return{filters:{}}},computed:{primaryGrades:function(){return i["a"].getGradesForSliders(this.multipitch,!0)},moreGrades:function(){return i["a"].getGradesForSliders(this.multipitch,!1)}},created:function(){for(var t=this,e=0;e<i["a"].types.length;e++)this.filters[e]=0;this.value&&this.value.forEach((function(e){t.filters[e[0]]=e[1]})),this.updateValue()},methods:{typeName:function(t){return i["a"].types[t].name},updateValue:function(){var t=[];for(var e in this.filters)0!==this.filters[e]&&t.push([parseInt(e),this.filters[e]]);this.$emit("input",t)}}},o=n,l=a("2877"),u=a("6544"),c=a.n(u),d=a("b0af"),f=a("99d9"),m=a("a523"),p=a("cd55"),h=a("49e2"),v=a("c865"),b=a("0393"),x=a("0e8f"),D=a("a722"),g=a("ba0d"),y=a("e0c7"),_=Object(l["a"])(o,r,s,!1,null,null,null);e["a"]=_.exports;c()(_,{VCard:d["a"],VCardText:f["c"],VContainer:m["a"],VExpansionPanel:p["a"],VExpansionPanelContent:h["a"],VExpansionPanelHeader:v["a"],VExpansionPanels:b["a"],VFlex:x["a"],VLayout:D["a"],VSlider:g["a"],VSubheader:y["a"]})},"05d5":function(t,e,a){"use strict";var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-card-text",{staticClass:"pt-0"},[a("v-select",{attrs:{items:t.items,"item-text":"label","item-value":"value",label:"Orientation",required:"",chips:t.multiple,multiple:t.multiple},on:{change:function(e){return t.$emit("input",t.model)}},model:{value:t.model,callback:function(e){t.model=e},expression:"model"}})],1)},s=[],i=(a("a9e3"),a("5d57")),n={props:{value:[Array,Number],multiple:Boolean},data:function(){return{model:null}},created:function(){this.model=this.value},computed:{items:function(){return i["d"].orientation.items}}},o=n,l=a("2877"),u=a("6544"),c=a.n(u),d=a("99d9"),f=a("b974"),m=Object(l["a"])(o,r,s,!1,null,null,null);e["a"]=m.exports;c()(m,{VCardText:d["c"],VSelect:f["a"]})},c886:function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-form",{ref:"form",model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[a("v-card",{attrs:{text:"",color:"transparent",flat:""}},[a("v-card-title",[t._v(" "+t._s(t.route?"Editing - "+t.route.name:"Adding route")+" ")]),a("v-card-text",[a("v-text-field",{attrs:{rules:t.nameRules,label:"Route name",required:""},model:{value:t.formData.name,callback:function(e){t.$set(t.formData,"name",e)},expression:"formData.name"}})],1),a("v-card-text",{staticClass:"pt-0"},[a("v-select",{attrs:{items:t.types,rules:t.typeRules,label:"Route type",required:""},model:{value:t.formData.type_id,callback:function(e){t.$set(t.formData,"type_id",e)},expression:"formData.type_id"}})],1),a("v-card-text",[a("v-select",{attrs:{items:t.routes,label:"Left to right place route before","item-value":"position","item-text":"name",required:""},model:{value:t.formData.position,callback:function(e){t.$set(t.formData,"position",e)},expression:"formData.position"}})],1),a("orientation",{model:{value:t.formData.orientation,callback:function(e){t.$set(t.formData,"orientation",e)},expression:"formData.orientation"}}),a("v-card-text",{staticClass:"pa-0"},[a("grade-input",{attrs:{multipitch:t.multipitch},model:{value:t.formData.grades,callback:function(e){t.$set(t.formData,"grades",e)},expression:"formData.grades"}})],1),a("v-subheader",[t._v("Length (m)")]),a("v-card-text",{staticClass:"pt-0"},[a("v-layout",{attrs:{row:""}},[a("v-flex",{staticClass:"px-3"},[a("v-slider",{attrs:{max:t.maxLength,min:"0"},model:{value:t.formData.length,callback:function(e){t.$set(t.formData,"length",e)},expression:"formData.length"}})],1),a("v-flex",{staticStyle:{width:"50px"},attrs:{shrink:""}},[a("v-text-field",{staticClass:"mt-0",attrs:{"hide-details":"","single-line":"",type:"number"},model:{value:t.formData.length,callback:function(e){t.$set(t.formData,"length",e)},expression:"formData.length"}})],1)],1)],1),a("v-layout",{attrs:{"justify-center":""}},[a("v-card-actions",[a("v-btn",{attrs:{disabled:!t.valid,color:"success"},on:{click:t.submit}},[t._v("Submit")]),a("v-btn",{attrs:{color:"error"},on:{click:t.close}},[t._v("Cancel")])],1)],1)],1)],1)},s=[],i=(a("4160"),a("b0c0"),a("159b"),a("5d57")),n=a("05d5"),o=a("842b"),l=a("04c7"),u=a("b005"),c={props:["route","area"],components:{GradeInput:l["a"],Orientation:n["a"]},data:function(){return{valid:!0,nameRules:[function(t){return!!t||"Name is required"}],typeRules:[function(t){return null!==t||"Must select an route type"}],formData:{}}},computed:{types:function(){return i["d"].getRouteTypes()},maxLength:function(){var t=this.area.altitude[0]||0,e=this.area.altitude[1]||1500,a=3*(e-t),r=i["d"].getMaxLength(this.formData.type_id);return r&&r<a?r:a},multipitch:function(){return this.formData.type_id===i["c"].Multipitch||this.formData.type_id===i["c"].Waterfall},routes:function(){var t=this,e=this.area.routes,a=[];return e.forEach((function(e){var r,s=t.$store.state.route.byIds[e];s&&(null===(r=t.route)||void 0===r?void 0:r.id)!==s.id&&a.push(s)})),a.push({position:e.length+1,name:"End of "+this.area.name}),a.forEach((function(t){console.log(t.id,t.position)})),a}},created:function(){this.formDefaultValues(),this.route&&this.assignPropToFormData(this.route)},setup:function(){return{drawers:u["a"]}},watch:{route:function(t){t&&this.assignPropToFormData(t)}},methods:{close:function(){this.$store.dispatch("form/close")},assignPropToFormData:function(t){for(var e in this.formData)this.formData[e]=t[e];this.formData.position=this.formData.position+1},formDefaultValues:function(){this.formData={name:"",length:0,grades:[],type_id:null,orientation:this.area.orientation,position:this.routes.length}},submit:function(){var t=this;this.route&&this.route.id?(this.$store.dispatch("snackbar/show","Updating route ... "),o["b"].put("route/"+this.route.id,this.formData).then((function(e){var a=e.data;t.formData.id=t.route.id,t.afterSubmit(t.formData,a.routes)}))):(this.$store.dispatch("snackbar/show","Adding route ... "),this.formData.area_id=this.area.id,o["b"].post("route",this.formData).then((function(e){var a=e.data;t.formData.id=a.id,t.formData.path=(null!=t.area.path?t.area.path+".":"")+t.area.id,t.afterSubmit(t.formData,a.routes)})))},afterSubmit:function(t,e){this.$store.commit("route/add",t),this.$store.dispatch("area/updateRoutePositions",{id:this.area.id,routes:e}),this.$store.dispatch("snackbar/success","Done!"),this.$vuetify.breakpoint.xs&&(this.drawers.right=!1),this.drawers.left=!0,this.close()}}},d=c,f=a("2877"),m=a("6544"),p=a.n(m),h=a("8336"),v=a("b0af"),b=a("99d9"),x=a("0e8f"),D=a("4bd4"),g=a("a722"),y=a("b974"),_=a("ba0d"),V=a("e0c7"),k=a("8654"),C=Object(f["a"])(d,r,s,!1,null,null,null);e["default"]=C.exports;p()(C,{VBtn:h["a"],VCard:v["a"],VCardActions:b["a"],VCardText:b["c"],VCardTitle:b["d"],VFlex:x["a"],VForm:D["a"],VLayout:g["a"],VSelect:y["a"],VSlider:_["a"],VSubheader:V["a"],VTextField:k["a"]})}}]);