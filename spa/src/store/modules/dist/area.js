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
var api_1 = require("../api");
var normalization_1 = require("../utils/normalization");
var entityMutations_1 = require("./utils/entityMutations");
var namespaced = true;
var normalizationAtributes = ['ancestors', 'areas', 'images', 'trails', 'moderators'];
var area = {
    namespaced: namespaced,
    state: {
        byIds: {},
        allIds: [],
        loading: true,
        rootIds: []
    },
    mutations: __assign(__assign({}, entityMutations_1["default"]), { appendArea: function (state, _a) {
            var parentId = _a.parentId, areaId = _a.areaId;
            if (parentId) {
                state.byIds[parentId].areas.push(areaId);
            }
            else {
                state.rootIds.push(areaId);
            }
        },
        appendImage: function (state, payload) {
            state.byIds[payload.id].images.push(payload.imageId);
        },
        appendTrail: function (state, payload) {
            state.byIds[payload.id].trails.push(payload.trailId);
        },
        removeArea: function (state, _a) {
            var _b;
            var parentId = _a.parentId, areaId = _a.areaId;
            var item = state.byIds[parentId];
            var index = item && ((_b = item.areas) === null || _b === void 0 ? void 0 : _b.findIndex(function (id) { return id === areaId; }));
            index && item.areas.splice(index, 1);
        },
        addModerator: function (state, _a) {
            var area = _a.area, moderator = _a.moderator;
            var item = state.byIds[area.id];
            item.moderators.push(moderator.id);
        },
        removeModerator: function (state, _a) {
            var area = _a.area, moderator = _a.moderator;
            var item = state.byIds[area.id];
            var index = item.moderators.findIndex(function (id) { return id === moderator.id; });
            item.moderators.splice(index, 1);
        } }),
    actions: {
        storeRelation: function (_a, _b) {
            var commit = _a.commit;
            var items = _b.items, fun = _b.fun, _c = _b.root, root = _c === void 0 ? false : _c;
            for (var id in items) {
                commit(fun, items[id], { root: root });
            }
        },
        normalizeData: function (_a, area) {
            var commit = _a.commit, dispatch = _a.dispatch;
            area.routes && dispatch('storeRelation', { items: area.routes, fun: 'route/add', root: true });
            delete area.routes;
            commit('add', normalization_1.normalizeRelations(area, normalizationAtributes));
            area.areas && dispatch('storeRelation', { items: area.areas, fun: 'add' });
            area.ancestors && dispatch('storeRelation', { items: area.ancestors, fun: 'add' });
            area.trails && dispatch('storeRelation', { items: area.trails, fun: 'trail/add', root: true });
            area.images && dispatch('storeRelation', { items: area.images, fun: 'image/add', root: true });
            area.moderators && dispatch('storeRelation', { items: area.moderators, fun: 'user/add', root: true });
        },
        fetch: function (_a, id) {
            var _b;
            var state = _a.state, commit = _a.commit, dispatch = _a.dispatch, rootGetters = _a.rootGetters;
            if ((_b = state.byIds[id]) === null || _b === void 0 ? void 0 : _b.fullyLoaded) {
                setTimeout(function () { commit('drawers/setLeft', true, { root: true }); }, 1000);
                return;
            }
            commit('snackbar/show', 'Loading area...', { root: true });
            commit('loading', true);
            var params = rootGetters['route/filters'];
            api_1["default"]
                .get('area/' + id, {
                params: params
            })
                .then(function (_a) {
                var data = _a.data;
                data.fullyLoaded = true;
                dispatch('normalizeData', data);
                commit('snackbar/success', 'Done!', { root: true });
                commit('drawers/setLeft', true, { root: true });
            })["finally"](function () {
                commit('loading', false);
            });
        },
        fetchRootAreas: function (_a) {
            var state = _a.state, commit = _a.commit;
            if (state.rootIds.length !== 0) {
                return;
            }
            commit('loading', true);
            commit('snackbar/show', 'Loading countries!', { root: true });
            api_1["default"]
                .get('area')
                .then(function (_a) {
                var data = _a.data;
                data.areas.forEach(function (area) {
                    commit('add', area);
                    commit('appendArea', { areaId: area.id, parentId: null });
                });
                data.routes.forEach(function (route) {
                    commit('route/add', route, { root: true });
                });
                commit('snackbar/success', 'Done!', { root: true });
                commit('drawers/setLeft', true, { root: true });
            })["finally"](function () {
                commit('loading', false);
            });
        }
    },
    getters: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get: function (state, _, rootState, rootGetters) {
            var _a, _b;
            var areaId = ((_a = rootState.url) === null || _a === void 0 ? void 0 : _a.params.areaId) || ((_b = rootGetters['route/get']) === null || _b === void 0 ? void 0 : _b.area_id);
            return areaId && state.byIds[areaId];
        },
        find: function (state) { return function (id) {
            return state.byIds[id];
        }; },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tags: function (state, getters, rootState, rootGetters) {
            var area = getters.get;
            var tags = [];
            // if area isn't set then get root areas
            // that is areas where parent is null
            if (!area) {
                state.rootIds.forEach(function (id) {
                    var _a;
                    if ((_a = state.byIds[id]) === null || _a === void 0 ? void 0 : _a.map_tag) {
                        tags.push(state.byIds[id].map_tag);
                    }
                });
                return tags;
            }
            if (area.map_tag) {
                tags.push(area.map_tag);
            }
            else {
                area.ancestors && area.ancestors.slice()
                    .reverse()
                    .some(function (ancestorId) {
                    var _a;
                    if ((_a = state.byIds[ancestorId]) === null || _a === void 0 ? void 0 : _a.map_tag) {
                        tags.push(state.byIds[ancestorId].map_tag);
                        return true;
                    }
                    return false;
                });
            }
            area.areas && area.areas.forEach(function (id) {
                var _a;
                if ((_a = state.byIds[id]) === null || _a === void 0 ? void 0 : _a.map_tag) {
                    tags.push(state.byIds[id].map_tag);
                }
            });
            rootGetters['route/getFiltered'].forEach(function (route) {
                route.map_tag && tags.push(route.map_tag);
            });
            area.trails && area.trails.forEach(function (id) {
                var _a, _b;
                if ((_b = (_a = rootState.trail) === null || _a === void 0 ? void 0 : _a.byIds[id]) === null || _b === void 0 ? void 0 : _b.map_tag) {
                    tags.push(rootState.trail.byIds[id].map_tag);
                }
            });
            area.images && area.images.forEach(function (id) {
                var _a, _b;
                if ((_b = (_a = rootState.image) === null || _a === void 0 ? void 0 : _a.byIds[id]) === null || _b === void 0 ? void 0 : _b.map_tag) {
                    tags.push(rootState.image.byIds[id].map_tag);
                }
            });
            return tags;
        }
    }
};
exports["default"] = area;
