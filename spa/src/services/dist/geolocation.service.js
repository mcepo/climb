"use strict";
exports.__esModule = true;
var store_1 = require("../store");
var geolocation_1 = require("@capacitor/geolocation");
var GeolocationService = /** @class */ (function () {
    function GeolocationService() {
        this.positionOptions = {
            enableHighAccuracy: true,
            timeout: 40000,
            maximumAge: 10000
        };
        this.watchCallbacks = [];
    }
    GeolocationService.prototype.registerWatch = function (callback) {
        this.watchCallbacks.push(callback);
        this._initWatch();
    };
    GeolocationService.prototype.getCurrentLocation = function (callback) {
        var _this = this;
        var accuratePosition = null;
        while (!accuratePosition) {
            geolocation_1.Geolocation.getCurrentPosition(this.positionOptions)
                .then(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function (position) {
                if (position.coords.accuracy < 30) {
                    accuratePosition = position;
                }
            }, function () {
                _this._errorMessage();
                callback();
            });
        }
        callback(accuratePosition);
    };
    GeolocationService.prototype._initWatch = function () {
        var _this = this;
        geolocation_1.Geolocation.watchPosition(this.positionOptions, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function (position, err) {
            if (err) {
                _this._errorMessage();
                return;
            }
            if (position) {
                if (position.coords.accuracy < 50) {
                    _this.watchCallbacks.forEach(function (callback) {
                        callback(position);
                    });
                }
            }
            else {
                store_1["default"].dispatch('snackbar/show', 'Waiting for location...');
            }
        });
    };
    GeolocationService.prototype.unregisterWatch = function (callback) {
        this.watchCallbacks = this.watchCallbacks.filter(function (c) {
            return c !== callback;
        });
    };
    GeolocationService.prototype._errorMessage = function () {
        store_1["default"].dispatch('snackbar/show', 'Make sure that GPS is on and application has permission to use it. ');
    };
    return GeolocationService;
}());
var geolocationService = new GeolocationService();
exports["default"] = geolocationService;
