"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var layer_service_1 = require("./layer.service");
var store_1 = require("../store");
var api_1 = require("@/store/api");
var geolocation_service_1 = require("./geolocation.service");
var L = require("leaflet");
var drawingTypes = {
    map: {
        area: 'Marker',
        route: 'Marker',
        trail: 'Line',
        image: 'Marker'
    },
    image: {
        pitch: 'Line',
        route: 'Line'
    }
};
var DrawingService = /** @class */ (function () {
    function DrawingService() {
    }
    DrawingService.prototype.setMapAndType = function (type) {
        this._map = layer_service_1["default"].map;
        this._taggedType = type;
        if (store_1["default"].getters.imageOpen) {
            this._drawingType = drawingTypes.image[type] || drawingTypes.map[type];
        }
        else {
            this._drawingType = drawingTypes.map[type];
        }
        return this._map;
    };
    DrawingService.prototype.loadGeoman = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._map.pm) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require(/* webpackChunkName: "leaflet-geoman" */ '../plugins/geoman'); })];
                    case 1:
                        _a.sent();
                        L.PM.reInitLayer(this._map);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DrawingService.prototype.createTag = function (type, item) {
        var _this = this;
        // authorize this action, only checking if user is logged in
        store_1["default"].dispatch('auth/authorize').then(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // if there is no map stop drawing
                        if (!this.setMapAndType(type))
                            return [2 /*return*/];
                        return [4 /*yield*/, this.loadGeoman()];
                    case 1:
                        _a.sent();
                        store_1["default"].dispatch('snackbar/show', 'Adding tag for ' + ((item === null || item === void 0 ? void 0 : item.name) || type));
                        store_1["default"].commit('setDrawingMode', true);
                        this._layer = null;
                        this._item = item;
                        // register a listener for drawing on the map
                        this.registerListenerOnDraw();
                        // enable drawing on the map with a specific layer type (Marker or Polyline)
                        this.enableDrawing();
                        return [2 /*return*/];
                }
            });
        }); })["catch"](function (error) {
            console.log(error);
        });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DrawingService.prototype.editTag = function (type, item) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            var _this = this;
            return __generator(this, function (_a) {
                key = type + item.id;
                if (!layer_service_1["default"].hasTag(key)) {
                    store_1["default"].dispatch('snackbar/show', "Tag doesn't exist!");
                    return [2 /*return*/];
                }
                this._tag = layer_service_1["default"].getTag(key);
                store_1["default"]
                    .dispatch('auth/authorize', this._tag)
                    .then(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                layer_service_1["default"].hideTag(key);
                                // if there is no map stop drawing
                                if (!this.setMapAndType(type))
                                    return [2 /*return*/];
                                return [4 /*yield*/, this.loadGeoman()];
                            case 1:
                                _a.sent();
                                this._item = item;
                                store_1["default"].dispatch('snackbar/show', 'Editing tag for ' + (item.name || type));
                                store_1["default"].commit('setDrawingMode', true);
                                this.createDrawingLayer();
                                return [2 /*return*/];
                        }
                    });
                }); })["catch"](function () {
                    _this._tag = null;
                });
                return [2 /*return*/];
            });
        });
    };
    // TODO: add method for adding/editing map tag to the current location
    // of the user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DrawingService.prototype.setTagAtCurrentLocation = function (type, item) {
        var _this = this;
        store_1["default"].dispatch('snackbar/show', "Tagging '" + item.name + "' at your current location<br/>Depending on your device/browser, this may take some time ...");
        var key = type + item.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var tag;
        if (layer_service_1["default"].hasTag(key)) {
            tag = layer_service_1["default"].getTag(key);
        }
        else {
            tag = {
                // eslint-disable-next-line @typescript-eslint/camelcase
                tagged_type: type,
                // eslint-disable-next-line @typescript-eslint/camelcase
                tagged_id: item.id
            };
        }
        store_1["default"]
            .dispatch('auth/authorize', tag.id ? tag : null)
            .then(function () {
            geolocation_service_1["default"].getCurrentLocation(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function (position) {
                if (!position)
                    return;
                tag.geometry = {
                    type: 'Point',
                    coordinates: [position.coords.longitude, position.coords.latitude]
                };
                _this.storeTag(tag);
            });
        })["catch"](function () {
            /* so i dont get an error */
        });
    };
    DrawingService.prototype.createDrawingLayer = function () {
        this._layer = this._tag && layer_service_1["default"].createLayer(this._tag);
        this._layer.addTo(this._map);
        // a possible fix for marker not being draggable on mobile devices
        if (this._layer instanceof L.Marker) {
            this._layer.dragging && this._layer.dragging.enable();
        }
        else {
            this._layer.pm.enable();
        }
    };
    DrawingService.prototype.registerListenerOnDraw = function () {
        var _this = this;
        this._map.once('pm:create', function (e) {
            _this._map.pm.disableDraw(_this._drawingType);
            _this._layer = e.layer;
            _this._layer.pm.enable();
        });
        // added this so that i can save the layer without actually
        // finishing it
        // useful for mobile phone users
        this._map.once('pm:drawstart', function (_a) {
            var workingLayer = _a.workingLayer;
            workingLayer.on('pm:vertexadded', function (e) {
                _this._layer = e.workingLayer;
            });
        });
    };
    DrawingService.prototype.enableDrawing = function () {
        this._map.pm.enableDraw(this._drawingType, {
            snappable: true,
            snapDistance: 20,
            snapMiddle: true
        });
    };
    DrawingService.prototype.createRequest = function () {
        var _a, _b;
        return {
            id: ((_a = this._tag) === null || _a === void 0 ? void 0 : _a.id) || null,
            // eslint-disable-next-line @typescript-eslint/camelcase
            image_id: store_1["default"].getters.imageOpen || null,
            geometry: this._layer.toGeoJSON().geometry,
            // eslint-disable-next-line @typescript-eslint/camelcase
            tagged_type: this._taggedType,
            // eslint-disable-next-line @typescript-eslint/camelcase
            tagged_id: ((_b = this._item) === null || _b === void 0 ? void 0 : _b.id) || null
        };
    };
    DrawingService.prototype.storeTrailTag = function (request) {
        var _this = this;
        api_1["default"].post('trail', request).then(function (_a) {
            var data = _a.data;
            store_1["default"].commit('trail/add', data);
            store_1["default"].commit('area/appendTrail', { id: data.area_id, trailId: data.id });
            store_1["default"].dispatch('snackbar/success', 'Tag stored');
        })["catch"](function () {
            _this.discardLayer();
        })["finally"](function () {
            _this.afterDrawing();
        });
    };
    DrawingService.prototype.storeTag = function (tag) {
        var _this = this;
        store_1["default"].dispatch('snackbar/show', 'Storing tag');
        var request = tag || this.createRequest();
        if (request.tagged_type === 'trail' && request.id === null) {
            this.storeTrailTag(request);
            return;
        }
        var apiCall = request.id
            ? api_1["default"].put('tag/' + request.id, request)
            : api_1["default"].post('tag', request);
        apiCall
            .then(function (_a) {
            var data = _a.data;
            store_1["default"].dispatch('snackbar/success', 'Tag stored');
            if (data && request.id == null)
                request.id = data;
            if (store_1["default"].getters.imageOpen) {
                store_1["default"].commit('image/storeImageTag', request);
            }
            else {
                store_1["default"].commit(request.tagged_type + '/storeMapTag', request);
            }
        })["catch"](function () {
            _this.discardLayer();
        })["finally"](function () {
            _this.afterDrawing();
        });
    };
    DrawingService.prototype.afterDrawing = function () {
        this._layer && this._layer.remove();
        this._map && this._map.pm.disableDraw(this._drawingType);
        store_1["default"].commit('setDrawingMode', false);
        this._drawingType = '';
        this._tag = null;
        this._layer = null;
        this._item = null;
        this._map = null;
    };
    DrawingService.prototype.discardLayer = function () {
        this._tag && layer_service_1["default"].showTag(this._tag);
        this.afterDrawing();
        store_1["default"].commit('setDrawingMode', false);
        store_1["default"].dispatch('snackbar/error', 'Changes discarded!');
    };
    return DrawingService;
}());
var drawingService = new DrawingService();
exports["default"] = drawingService;
