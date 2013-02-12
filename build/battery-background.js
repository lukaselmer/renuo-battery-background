// Generated by CoffeeScript 1.4.0
(function() {
  var BatterSavingByBackgroundAdjustment, BatterSavingByTimeout, BatterySavingFacade, batteryBackground, batterySavingFacade, property, value;

  batteryBackground = {
    defaults: {
      backgroundSelector: "body"
    },
    backgroundSelector: function() {
      return this.config['backgroundSelector'];
    },
    init: function(config) {
      this.battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;
      if (!this.battery_api_availible()) {
        return false;
      }
      this.initConfig(config);
      this.registerBatteryListeners();
      return this;
    },
    initConfig: function(config) {
      var property, value, _results;
      this.config = this.defaults;
      if (config) {
        _results = [];
        for (property in config) {
          value = config[property];
          _results.push(this.config[property] = value);
        }
        return _results;
      }
    },
    battery_api_availible: function() {
      return !!this.battery;
    },
    registerBatteryListeners: function() {
      var battery, checkBatteryStatus, overlay, strategy;
      battery = this.battery;
      strategy = this.batterySavingStrategy;
      checkBatteryStatus = function() {
        if (battery.charging) {
          return strategy.charging(battery);
        } else {
          return strategy.discharging(battery);
        }
      };
      setInterval(checkBatteryStatus, 60000);
      battery.addEventListener("chargingchange", checkBatteryStatus, false);
      battery.addEventListener("levelchange", checkBatteryStatus, false);
      checkBatteryStatus();
      $(document).idleTimer(5000);
      overlay = $('<div class="ui-overlay"><div class="ui-widget-overlay"></div></div>').hide().appendTo('body');
      $(document).on("idle.idleTimer", function() {
        if (!battery.charging) {
          overlay.fadeIn();
        }
        return $(window).resize(function() {
          overlay.width($(document).width());
          return overlay.height($(document).height());
        });
      });
      return $(document).on("active.idleTimer", function() {
        return overlay.fadeOut();
      });
    }
  };

  this.batteryBackground || (this.batteryBackground = {});

  for (property in batteryBackground) {
    value = batteryBackground[property];
    this.batteryBackground[property] = value;
  }

  BatterSavingByTimeout = (function() {

    function BatterSavingByTimeout() {}

    BatterSavingByTimeout.prototype.discharging = function(battery) {
      return console.log("discharging" + battery.level);
    };

    BatterSavingByTimeout.prototype.charging = function(battery) {
      return console.log("charging" + battery.level);
    };

    return BatterSavingByTimeout;

  })();

  BatterSavingByBackgroundAdjustment = (function() {

    function BatterSavingByBackgroundAdjustment() {}

    BatterSavingByBackgroundAdjustment.prototype.discharging = function(battery) {
      return console.log("discharging" + battery.level);
    };

    BatterSavingByBackgroundAdjustment.prototype.charging = function(battery) {
      return console.log("charging" + battery.level);
    };

    return BatterSavingByBackgroundAdjustment;

  })();

  BatterySavingFacade = (function() {

    function BatterySavingFacade() {
      this.init();
    }

    BatterySavingFacade.prototype.init = function() {
      this.add(new BatterSavingByTimeout());
      return this.add(new BatterSavingByBackgroundAdjustment());
    };

    BatterySavingFacade.prototype.strategies = function() {
      this.batterySavingStrategies || (this.batterySavingStrategies = []);
      return this.batterySavingStrategies;
    };

    BatterySavingFacade.prototype.add = function(batterySavingStrategy) {
      return this.strategies().push(batterySavingStrategy);
    };

    BatterySavingFacade.prototype.removeAll = function() {
      return this.batterySavingStrategies = [];
    };

    BatterySavingFacade.prototype.discharging = function(battery) {
      var strategy, _i, _len, _ref, _results;
      _ref = this.strategies();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        strategy = _ref[_i];
        _results.push(strategy.discharging(battery));
      }
      return _results;
    };

    BatterySavingFacade.prototype.charging = function(battery) {
      var strategy, _i, _len, _ref, _results;
      _ref = this.strategies();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        strategy = _ref[_i];
        _results.push(strategy.charging(battery));
      }
      return _results;
    };

    BatterySavingFacade.prototype.count = function() {
      return this.strategies().length;
    };

    return BatterySavingFacade;

  })();

  batterySavingFacade = new BatterySavingFacade();

  this.batteryBackground || (this.batteryBackground = {});

  this.batteryBackground.batterySavingStrategy = batterySavingFacade;

}).call(this);
