"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getUrl = void 0;
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var Dashboard_vue_1 = require("../views/Dashboard.vue");
var Overview_vue_1 = require("../components/Overview.vue");
var AreaDetails_vue_1 = require("../components/details/AreaDetails.vue");
var RouteDetails_vue_1 = require("../components/details/RouteDetails.vue");
var store_1 = require("../store");
vue_1["default"].use(vue_router_1["default"]);
var AdminPanel = function () { return Promise.resolve().then(function () { return require(/* webpackChunkName: "admin.panel" */ '../views/AdminPanel.vue'); }); };
var PrivacyPolicy = function () { return Promise.resolve().then(function () { return require(/* webpackChunkName: "privacy.policy" */ '../components/PrivacyPolicy.vue'); }); };
var AdminMenuList = function () { return Promise.resolve().then(function () { return require(/* webpackChunkName: "admin.panel" */ '../admin/components/lists/MenuList.vue'); }); };
var UsersPage = function () { return Promise.resolve().then(function () { return require(/* webpackChunkName: "admin.panel" */ '../admin/pages/UsersPage.vue'); }); };
var ActivityLogPage = function () { return Promise.resolve().then(function () { return require(/* webpackChunkName: "admin.panel" */ '../admin/pages/ActivityLogPage.vue'); }); };
var ImagesPage = function () { return Promise.resolve().then(function () { return require(/* webpackChunkName: "admin.panel" */ '../admin/pages/ImagesPage.vue'); }); };
var UserOverviewPage = function () { return Promise.resolve().then(function () { return require(/* webpackChunkName: "admin.panel" */ '../admin/pages/UserOverviewPage.vue'); }); };
var LeafletMap = function () { return Promise.resolve().then(function () { return require(/* webpackChunkName: "leaflet.map" */ '../components/map/LeafletMap.vue'); }); };
var ImageMap = function () { return Promise.resolve().then(function () { return require(/* webpackChunkName: "image.map" */ '../components/map/ImageMap.vue'); }); };
var routes = [
    {
        path: '/',
        component: Dashboard_vue_1["default"],
        children: [
            {
                path: '',
                components: {
                    "default": Overview_vue_1["default"],
                    map: LeafletMap
                }
            },
            {
                path: '/privacy',
                components: {
                    "default": PrivacyPolicy
                }
            },
            {
                path: 'image/:imageId',
                components: {
                    "default": Overview_vue_1["default"],
                    map: ImageMap
                }
            },
            {
                path: 'area/:areaId',
                components: {
                    "default": AreaDetails_vue_1["default"],
                    map: LeafletMap
                }
            },
            {
                // /a/croatia-paklenica-anica_kuk-trapez/123
                path: 'a/:path/:areaId',
                components: {
                    "default": AreaDetails_vue_1["default"],
                    map: LeafletMap
                }
            },
            {
                path: 'area/:areaId/image/:imageId',
                components: {
                    "default": AreaDetails_vue_1["default"],
                    map: ImageMap
                }
            },
            {
                // /a/croatia-paklenica-anica_kuk-trapez/123/image/1
                path: 'a/:path/:areaId/image/:imageId',
                components: {
                    "default": AreaDetails_vue_1["default"],
                    map: ImageMap
                }
            },
            {
                path: 'route/:routeId',
                components: {
                    "default": RouteDetails_vue_1["default"],
                    map: LeafletMap
                }
            },
            {
                // /r/croatia-paklenica-anica_kuk-trapez-mosoraski/123
                path: 'r/:path/:routeId',
                components: {
                    "default": RouteDetails_vue_1["default"],
                    map: LeafletMap
                }
            },
            {
                path: 'route/:routeId/image/:imageId',
                components: {
                    "default": RouteDetails_vue_1["default"],
                    map: ImageMap
                }
            },
            {
                // /r/croatia-paklenica-anica_kuk-trapez-mosoraski/123/image/1
                path: 'r/:path/:routeId/image/:imageId',
                components: {
                    "default": RouteDetails_vue_1["default"],
                    map: ImageMap
                }
            },
            // TODO: is this really needed
            {
                path: '/auth/:provide/callback',
                component: {
                    template: '<div class="auth-component"></div>'
                }
            }
        ]
    },
    // admin panel routes
    {
        path: '/admin',
        component: AdminPanel,
        // making sure only admin users get here
        beforeEnter: function (to, from, next) {
            store_1["default"].dispatch('auth/authorizeOnlyAdmin').then(function () {
                next();
            })["catch"](function () { });
        },
        children: [
            {
                path: '',
                components: {
                    "default": AdminMenuList,
                    content: UsersPage
                }
            },
            {
                path: 'users',
                components: {
                    "default": AdminMenuList,
                    content: UsersPage
                }
            },
            {
                path: 'user/:id',
                components: {
                    "default": AdminMenuList,
                    content: UserOverviewPage
                }
            },
            {
                path: 'images',
                components: {
                    "default": AdminMenuList,
                    content: ImagesPage
                }
            },
            {
                path: 'activities',
                components: {
                    "default": AdminMenuList,
                    content: ActivityLogPage
                }
            }
        ]
    }
];
var router = new vue_router_1["default"]({
    mode: 'history',
    routes: routes
});
// right now i don't see the point in this
// // listener for deep links
// App.addListener('appUrlOpen', function (event: URLOpenListenerEvent) {
//   // Example url: https://beerswift.app/tabs/tabs2
//   // slug = /tabs/tabs2
//   const slug = event.url.split('.net').pop()
//   console.log(slug)
//   // We only push to the route if there is a slug present
//   if (slug) {
//     router.push({
//       path: slug
//     })
//   }
// })
// solution on how to change one view and keep the other as is
// not a very good solution
function getUrl(type, id) {
    var newParams = __assign({}, router.currentRoute.params);
    var path = store_1["default"].getters.urlPath(type, id);
    if (!path) {
        path = newParams.path;
    }
    path += '/';
    if (type === 'image') {
        newParams.imageId = id;
    }
    else if (type === 'area') {
        delete newParams.routeId;
        newParams.areaId = id;
    }
    else {
        delete newParams.areaId;
        newParams.routeId = id;
    }
    var url = '';
    if (newParams.areaId) {
        url = '/a/' + path + newParams.areaId;
    }
    else if (newParams.routeId) {
        url = '/r/' + path + newParams.routeId;
    }
    if (newParams.imageId) {
        url += '/image/' + newParams.imageId;
    }
    return url === '' ? '/' : url;
}
exports.getUrl = getUrl;
exports["default"] = router;
