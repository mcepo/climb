"use strict";
exports.__esModule = true;
var layer_service_1 = require("./layer.service");
var store_1 = require("../store");
var api_1 = require("@/store/api");
require("@geoman-io/leaflet-geoman-free");
require("@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css");
var geolocation_service_1 = require("./geolocation.service");
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
        if (store_1["default"].getters.openImage) {
            this._drawingType = drawingTypes.image[type] || drawingTypes.map[type];
        }
        else {
            this._drawingType = drawingTypes.map[type];
        }
        return this._map;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DrawingService.prototype.createTag = function (type, item) {
        var _this = this;
        // authorize this action, only checking if user is logged in
        store_1["default"].dispatch('auth/authorize').then(function () {
            // if there is no map stop drawing
            if (!_this.setMapAndType(type))
                return;
            store_1["default"].commit('snackbar/show', 'Adding tag for ' + ((item === null || item === void 0 ? void 0 : item.name) || type));
            store_1["default"].commit('setDrawingMode', true);
            _this._layer = null;
            _this._item = item;
            // register a listener for drawing on the map
            _this.registerListenerOnDraw();
            // enable drawing on the map with a specific layer type (Marker or Polyline)
            _this.enableDrawing();
        })["catch"](function (error) {
            console.log(error);
        });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DrawingService.prototype.editTag = function (type, item) {
        var _this = this;
        var key = type + item.id;
        if (!layer_service_1["default"].hasTag(key)) {
            store_1["default"].commit('snackbar/show', "Tag doesn't exist!");
            return;
        }
        this._tag = layer_service_1["default"].getTag(key);
        store_1["default"]
            .dispatch('auth/authorize', this._tag)
            .then(function () {
            layer_service_1["default"].hideTag(key);
            // if there is no map stop drawing
            if (!_this.setMapAndType(type))
                return;
            _this._item = item;
            store_1["default"].commit('snackbar/show', 'Editing tag for ' + (item.name || type));
            store_1["default"].commit('setDrawingMode', true);
            _this.createDrawingLayer();
        })["catch"](function () {
            _this._tag = null;
        });
    };
    // TODO: add method for adding/editing map tag to the current location
    // of the user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DrawingService.prototype.setTagAtCurrentLocation = function (type, item) {
        var _this = this;
        store_1["default"].commit('snackbar/show', "Tagging '" + item.name + "' at your current location<br/>Depending on your device/browser, this may take some time ...");
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
            geolocation_service_1["default"].getCurrentLocation(function (position) {
                if (!position)
                    return;
                if (position.coords.accuracy > 100) {
                    store_1["default"].commit('snackbar/error', 'Location accuracy too low (' + position.coords.accuracy + ' m)');
                    return;
                }
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
        this._layer.pm.enable();
    };
    DrawingService.prototype.registerListenerOnDraw = function () {
        var _this = this;
        this._map.once('pm:create', function (e) {
            _this._map.pm.disableDraw(_this._drawingType);
            _this._layer = e.layer;
            _this._layer.pm.enable();
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
            image_id: store_1["default"].getters.openImage || null,
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
            store_1["default"].commit('snackbar/success', 'Tag stored');
        })["catch"](function () {
            _this.discardLayer();
        })["finally"](function () {
            _this.afterDrawing();
        });
    };
    DrawingService.prototype.storeTag = function (tag) {
        var _this = this;
        store_1["default"].commit('snackbar/show', 'Storing tag');
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
            store_1["default"].commit('snackbar/success', 'Tag stored');
            if (data && request.id == null)
                request.id = data;
            if (store_1["default"].getters.openImage) {
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
        store_1["default"].commit('snackbar/error', 'Changes discarded!');
    };
    return DrawingService;
}());
var drawingService = new DrawingService();
exports["default"] = drawingService;
