(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["change-password.form"],{2864:function(t,r,a){"use strict";a.r(r);var s=function(){var t=this,r=t.$createElement,a=t._self._c||r;return a("v-form",{ref:"form",model:{value:t.valid,callback:function(r){t.valid=r},expression:"valid"}},[a("v-card",{attrs:{text:"",color:"transparent",flat:""}},[a("v-card-title",[t._v(" Password changer! ")]),a("v-card-text",[a("v-text-field",{attrs:{label:"Password","prepend-icon":"lock",type:"password",rules:t.passwordRules},model:{value:t.formData.password,callback:function(r){t.$set(t.formData,"password",r)},expression:"formData.password"}}),a("v-text-field",{attrs:{label:"Confirm password","prepend-icon":"lock",type:"password",rules:t.passwordRules},model:{value:t.formData.passwordConfirm,callback:function(r){t.$set(t.formData,"passwordConfirm",r)},expression:"formData.passwordConfirm"}})],1),a("v-layout",{attrs:{"justify-center":""}},[a("v-card-actions",[a("v-btn",{attrs:{disabled:!t.valid,color:"success"},on:{click:t.submit}},[t._v("Update")]),a("v-btn",{attrs:{color:"error"},on:{click:t.close}},[t._v("Cancel")])],1)],1)],1)],1)},e=[],i=a("842b"),n={data:function(){return{valid:!0,formData:{}}},computed:{passwordRules:function(){return[function(t){return!!t||"Password is required"},this.passwordConfirmationRule()]},passwordConfirmationRule:function(){var t=this;return function(){return!t.formData.passwordConfirm||t.formData.password===t.formData.passwordConfirm||"Passwords must match"}}},methods:{close:function(){this.$store.dispatch("form/close")},submit:function(){var t=this;i["b"].post("/change_password/",this.formData).then((function(){t.$store.dispatch("form/close"),t.$store.dispatch("snackbar/success","Password succesfully changed")}))}}},o=n,u=a("2877"),d=a("6544"),c=a.n(d),l=a("8336"),f=a("b0af"),h=a("99d9"),p=a("4bd4"),m=a("a722"),v=a("8654"),w=Object(u["a"])(o,s,e,!1,null,null,null);r["default"]=w.exports;c()(w,{VBtn:l["a"],VCard:f["a"],VCardActions:h["a"],VCardText:h["c"],VCardTitle:h["d"],VForm:p["a"],VLayout:m["a"],VTextField:v["a"]})},"4bd4":function(t,r,a){"use strict";a("4de4"),a("7db0"),a("4160"),a("caad"),a("07ac"),a("2532"),a("159b");var s=a("5530"),e=a("58df"),i=a("7e2b"),n=a("3206");r["a"]=Object(e["a"])(i["a"],Object(n["b"])("form")).extend({name:"v-form",provide:function(){return{form:this}},inheritAttrs:!1,props:{disabled:Boolean,lazyValidation:Boolean,readonly:Boolean,value:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(t){var r=Object.values(t).includes(!0);this.$emit("input",!r)},deep:!0,immediate:!0}},methods:{watchInput:function(t){var r=this,a=function(t){return t.$watch("hasError",(function(a){r.$set(r.errorBag,t._uid,a)}),{immediate:!0})},s={_uid:t._uid,valid:function(){},shouldValidate:function(){}};return this.lazyValidation?s.shouldValidate=t.$watch("shouldValidate",(function(e){e&&(r.errorBag.hasOwnProperty(t._uid)||(s.valid=a(t)))})):s.valid=a(t),s},validate:function(){return 0===this.inputs.filter((function(t){return!t.validate(!0)})).length},reset:function(){this.inputs.forEach((function(t){return t.reset()})),this.resetErrorBag()},resetErrorBag:function(){var t=this;this.lazyValidation&&setTimeout((function(){t.errorBag={}}),0)},resetValidation:function(){this.inputs.forEach((function(t){return t.resetValidation()})),this.resetErrorBag()},register:function(t){this.inputs.push(t),this.watchers.push(this.watchInput(t))},unregister:function(t){var r=this.inputs.find((function(r){return r._uid===t._uid}));if(r){var a=this.watchers.find((function(t){return t._uid===r._uid}));a&&(a.valid(),a.shouldValidate()),this.watchers=this.watchers.filter((function(t){return t._uid!==r._uid})),this.inputs=this.inputs.filter((function(t){return t._uid!==r._uid})),this.$delete(this.errorBag,r._uid)}}},render:function(t){var r=this;return t("form",{staticClass:"v-form",attrs:Object(s["a"])({novalidate:!0},this.attrs$),on:{submit:function(t){return r.$emit("submit",t)}}},this.$slots.default)}})}}]);