(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d230c96"],{ee88:function(n,e,o){"use strict";o.r(e),o.d(e,"GeolocationWeb",(function(){return t})),o.d(e,"Geolocation",(function(){return a}));var i=o("1547");class t extends i["b"]{async getCurrentPosition(n){return new Promise((e,o)=>{navigator.geolocation.getCurrentPosition(n=>{e(n)},n=>{o(n)},Object.assign({enableHighAccuracy:!1,timeout:1e4,maximumAge:0},n))})}async watchPosition(n,e){const o=navigator.geolocation.watchPosition(n=>{e(n)},n=>{e(null,n)},Object.assign({enableHighAccuracy:!1,timeout:1e4,maximumAge:0},n));return""+o}async clearWatch(n){window.navigator.geolocation.clearWatch(parseInt(n.id,10))}async checkPermissions(){if("undefined"===typeof navigator||!navigator.permissions)throw this.unavailable("Permissions API not available in this browser");const n=await window.navigator.permissions.query({name:"geolocation"});return{location:n.state}}async requestPermissions(){throw this.unimplemented("Not implemented on web.")}}const a=new t}}]);