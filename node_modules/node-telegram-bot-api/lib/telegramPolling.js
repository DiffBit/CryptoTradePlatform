'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('node-telegram-bot-api');
var deprecate = require('depd')('node-telegram-bot-api');
var ANOTHER_WEB_HOOK_USED = 409;

var TelegramBotPolling = function () {
  /**
   * Handles polling against the Telegram servers.
   * @param  {TelegramBot} bot
   * @see https://core.telegram.org/bots/api#getting-updates
   */
  function TelegramBotPolling(bot) {
    _classCallCheck(this, TelegramBotPolling);

    this.bot = bot;
    this.options = typeof bot.options.polling === 'boolean' ? {} : bot.options.polling;
    this.options.interval = typeof this.options.interval === 'number' ? this.options.interval : 300;
    this.options.params = _typeof(this.options.params) === 'object' ? this.options.params : {};
    this.options.params.offset = typeof this.options.params.offset === 'number' ? this.options.params.offset : 0;
    this.options.params.timeout = typeof this.options.params.timeout === 'number' ? this.options.params.timeout : 10;
    if (typeof this.options.timeout === 'number') {
      deprecate('`options.polling.timeout` is deprecated. Use `options.polling.params` instead.');
      this.options.params.timeout = this.options.timeout;
    }
    this._lastUpdate = 0;
    this._lastRequest = null;
    this._abort = false;
    this._pollingTimeout = null;
  }

  /**
   * Start polling
   * @param  {Object} [options]
   * @param  {Object} [options.restart]
   * @return {Promise}
   */


  _createClass(TelegramBotPolling, [{
    key: 'start',
    value: function start() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this._lastRequest) {
        if (!options.restart) {
          return Promise.resolve();
        }
        return this.stop({
          cancel: true,
          reason: 'Polling restart'
        }).then(function () {
          return _this._polling();
        });
      }
      return this._polling();
    }

    /**
     * Stop polling
     * @param  {Object} [options]
     * @param  {Boolean} [options.cancel] Cancel current request
     * @param  {String} [options.reason] Reason for stopping polling
     * @return {Promise}
     */

  }, {
    key: 'stop',
    value: function stop() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!this._lastRequest) {
        return Promise.resolve();
      }
      var lastRequest = this._lastRequest;
      this._lastRequest = null;
      clearTimeout(this._pollingTimeout);
      if (options.cancel) {
        var reason = options.reason || 'Polling stop';
        lastRequest.cancel(reason);
        return Promise.resolve();
      }
      this._abort = true;
      return lastRequest.finally(function () {
        _this2._abort = false;
      });
    }

    /**
     * Return `true` if is polling. Otherwise, `false`.
     */

  }, {
    key: 'isPolling',
    value: function isPolling() {
      return !!this._lastRequest;
    }

    /**
     * Invokes polling (with recursion!)
     * @return {Promise} promise of the current request
     * @private
     */

  }, {
    key: '_polling',
    value: function _polling() {
      var _this3 = this;

      this._lastRequest = this._getUpdates().then(function (updates) {
        _this3._lastUpdate = Date.now();
        debug('polling data %j', updates);
        updates.forEach(function (update) {
          _this3.options.params.offset = update.update_id + 1;
          debug('updated offset: %s', _this3.options.params.offset);
          _this3.bot.processUpdate(update);
        });
        return null;
      }).catch(function (err) {
        debug('polling error: %s', err.message);
        if (_this3.bot.listeners('polling_error').length) {
          _this3.bot.emit('polling_error', err);
        } else {
          console.error(err); // eslint-disable-line no-console
        }
        return null;
      }).finally(function () {
        if (_this3._abort) {
          debug('Polling is aborted!');
        } else {
          debug('setTimeout for %s miliseconds', _this3.options.interval);
          _this3._pollingTimeout = setTimeout(function () {
            return _this3._polling();
          }, _this3.options.interval);
        }
      });
      return this._lastRequest;
    }

    /**
     * Unset current webhook. Used when we detect that a webhook has been set
     * and we are trying to poll. Polling and WebHook are mutually exclusive.
     * @see https://core.telegram.org/bots/api#getting-updates
     * @private
     */

  }, {
    key: '_unsetWebHook',
    value: function _unsetWebHook() {
      debug('unsetting webhook');
      return this.bot._request('setWebHook');
    }

    /**
     * Retrieve updates
     */

  }, {
    key: '_getUpdates',
    value: function _getUpdates() {
      var _this4 = this;

      debug('polling with options: %j', this.options.params);
      return this.bot.getUpdates(this.options.params).catch(function (err) {
        if (err.response && err.response.statusCode === ANOTHER_WEB_HOOK_USED) {
          return _this4._unsetWebHook().then(function () {
            return _this4.bot.getUpdates(_this4.options.params);
          });
        }
        throw err;
      });
    }
  }]);

  return TelegramBotPolling;
}();

module.exports = TelegramBotPolling;