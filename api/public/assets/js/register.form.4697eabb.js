(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["register.form"],{f102:function(a,e,t){"use strict";t.r(e);var r=function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("v-form",{ref:"form",model:{value:a.valid,callback:function(e){a.valid=e},expression:"valid"}},[t("v-card-title",[a._v("Registration")]),t("v-card",{attrs:{text:"",color:"transparent",flat:""}},[t("v-card-text",[t("v-text-field",{attrs:{label:"Name","prepend-icon":"person",type:"text",rules:a.nameRules},model:{value:a.formData.name,callback:function(e){a.$set(a.formData,"name",e)},expression:"formData.name"}}),t("v-text-field",{attrs:{label:"Email","prepend-icon":"email",type:"text",rules:a.emailRules},model:{value:a.formData.email,callback:function(e){a.$set(a.formData,"email",e)},expression:"formData.email"}}),t("v-text-field",{attrs:{label:"Password","prepend-icon":"lock",type:"password",rules:a.passwordRules},model:{value:a.formData.password,callback:function(e){a.$set(a.formData,"password",e)},expression:"formData.password"}}),t("v-text-field",{attrs:{label:"Confirm password","prepend-icon":"lock",type:"password",rules:a.passwordRules},model:{value:a.formData.passwordConfirm,callback:function(e){a.$set(a.formData,"passwordConfirm",e)},expression:"formData.passwordConfirm"}})],1),t("v-layout",{attrs:{"justify-center":""}},[t("v-card-actions",[t("v-btn",{attrs:{disabled:!a.valid,color:"success"},on:{click:a.submit}},[a._v("Register")]),t("v-btn",{attrs:{color:"error"},on:{click:a.close}},[a._v("Cancel")])],1)],1)],1)],1)},o=[],s=t("842b"),n={data:function(){return{valid:!0,emailRules:[function(a){return!!a||"Email is required"}],nameRules:[function(a){return!!a||"Name is required"}],formData:{}}},computed:{passwordRules:function(){return[function(a){return!!a||"Password is required"},this.passwordConfirmationRule()]},passwordConfirmationRule:function(){var a=this;return function(){return!a.formData.passwordConfirm||a.formData.password===a.formData.passwordConfirm||"Passwords must match"}}},methods:{close:function(){this.$store.dispatch("form/close")},submit:function(){var a=this;s["b"].post("/register/",this.formData).then((function(){a.$store.dispatch("form/close"),a.$store.dispatch("snackbar/show","A link was send to your email account.<br>Please verify your email by <br> following the link.")}))}}},i=n,l=t("2877"),c=t("6544"),d=t.n(c),u=t("8336"),f=t("b0af"),m=t("99d9"),p=t("4bd4"),v=t("a722"),w=t("8654"),b=Object(l["a"])(i,r,o,!1,null,null,null);e["default"]=b.exports;d()(b,{VBtn:u["a"],VCard:f["a"],VCardActions:m["a"],VCardText:m["c"],VCardTitle:m["d"],VForm:p["a"],VLayout:v["a"],VTextField:w["a"]})}}]);