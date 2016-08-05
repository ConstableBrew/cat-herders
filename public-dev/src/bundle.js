(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetPrototype = Object.getPrototypeOf;

/**
 * Gets the `[[Prototype]]` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {null|Object} Returns the `[[Prototype]]`.
 */
var getPrototype = overArg(nativeGetPrototype, Object);

module.exports = getPrototype;

},{"./_overArg":3}],2:[function(require,module,exports){
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;

},{}],3:[function(require,module,exports){
/**
 * Creates a function that invokes `func` with its first argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],4:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],5:[function(require,module,exports){
var getPrototype = require('./_getPrototype'),
    isHostObject = require('./_isHostObject'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object,
 *  else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;

},{"./_getPrototype":1,"./_isHostObject":2,"./isObjectLike":4}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports["default"] = applyMiddleware;

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, initialState, enhancer) {
      var store = createStore(reducer, initialState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2["default"].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
},{"./compose":9}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
},{}],8:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports["default"] = combineReducers;

var _createStore = require('./createStore');

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2["default"])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key);
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var sanityError;
  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (sanityError) {
      throw sanityError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
      if (warningMessage) {
        (0, _warning2["default"])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = finalReducers[key];
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
}).call(this,require('_process'))
},{"./createStore":10,"./utils/warning":12,"_process":21,"lodash/isPlainObject":5}],9:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  } else {
    var _ret = function () {
      var last = funcs[funcs.length - 1];
      var rest = funcs.slice(0, -1);
      return {
        v: function v() {
          return rest.reduceRight(function (composed, f) {
            return f(composed);
          }, last.apply(undefined, arguments));
        }
      };
    }();

    if (typeof _ret === "object") return _ret.v;
  }
}
},{}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.ActionTypes = undefined;
exports["default"] = createStore;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [initialState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, initialState, enhancer) {
  var _ref2;

  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState;
    initialState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, initialState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = initialState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2["default"])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */

      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2["default"]] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2["default"]] = observable, _ref2;
}
},{"lodash/isPlainObject":5,"symbol-observable":13}],11:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = require('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = require('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = require('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2["default"])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2["default"];
exports.combineReducers = _combineReducers2["default"];
exports.bindActionCreators = _bindActionCreators2["default"];
exports.applyMiddleware = _applyMiddleware2["default"];
exports.compose = _compose2["default"];
}).call(this,require('_process'))
},{"./applyMiddleware":6,"./bindActionCreators":7,"./combineReducers":8,"./compose":9,"./createStore":10,"./utils/warning":12,"_process":21}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
},{}],13:[function(require,module,exports){
(function (global){
/* global window */
'use strict';

module.exports = require('./ponyfill')(global || window || this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ponyfill":14}],14:[function(require,module,exports){
'use strict';

module.exports = function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Canvas = function () {
    function Canvas(opts) {
        _classCallCheck(this, Canvas);

        if (Canvas.instance) return Canvas.instance;
        if (!(this instanceof Canvas)) return new Canvas(opts);

        opts = _extends({
            canvasElementOrId: null,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: document.getElementsByTagName('body')[0],
            renderers: []
        }, opts);

        if (opts.canvasElementOrId) {
            this.cvs = opts.canvaselementOrId instanceof Element ? opts.canvasElementOrId : document.createElement('canvas');
        }
        if (!this.cvs) {
            this.cvs = document.createElement('canvas');
        }

        this.cvs.width = opts.width;
        this.cvs.height = opts.height;
        this.cvs.style.width = '100%';
        this.cvs.style.height = '100%';
        this.ctx = this.cvs.getContext('2d');
        this.renderers = [].concat(_toConsumableArray(opts.renderers));

        this.render();
        opts.parent.appendChild(this.cvs);

        Canvas.instance = this;
    }

    _createClass(Canvas, [{
        key: 'addRenderer',
        value: function addRenderer(renderer) {
            if (typeof renderer === 'function') this.renderers.push(renderer);
        }
    }, {
        key: 'render',
        value: function render(renderers) {
            var _this = this;

            this.ctx.fillStyle = 'rgba(0,0,0,0)';
            this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
            this.ctx.imageSmoothingEnabled = false;

            this.renderers.forEach(function (func) {
                return func(_this.ctx);
            });
            Array.isArray(renderers) && renderers.forEach(function (func) {
                return func(_this.ctx);
            });
        }
    }]);

    return Canvas;
}();

Canvas.instance = null;
exports.default = Canvas;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hex = require('./hex');

var _hex2 = _interopRequireDefault(_hex);

var _point = require('./point');

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sqrt3 = 1.7320508075688772;
var sqrt3_2 = sqrt3 / 2;
var sqrt3_3 = sqrt3 / 3;

var HexMap = function () {
    function HexMap(radius) {
        _classCallCheck(this, HexMap);

        // Build a hex-shaped map filled with Hex objects
        var counter = 0;
        for (var q = -radius; q <= radius; ++q) {
            for (var r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); ++r) {
                var hex = new _hex2.default(q, r);
                this[hex.coords()] = hex;
                counter++;
            }
        }
    }

    _createClass(HexMap, [{
        key: 'forEach',
        value: function forEach(func) {
            return HexMap.forEach(this, func);
        }
    }, {
        key: 'render',
        value: function render(center, size, ctx) {
            return HexMap.render(this, center, size, ctx);
        }
    }, {
        key: 'pixelToHex',
        value: function pixelToHex(center, size, x, y) {
            return this[HexMap.pixelToHex(center, size, x, y)];
        }
    }], [{
        key: 'forEach',
        value: function forEach(hexMap, func) {
            if (typeof func !== 'function') return;

            var hexes = Object.keys(hexMap);
            hexes.forEach(function (coords) {
                var hex = hexMap[coords];
                func(hex);
            });
        }
    }, {
        key: 'render',
        value: function render(hexMap, center, size, ctx) {
            hexMap.forEach(function (hex) {
                hex.render(center, size, ctx);
            });
        }
    }, {
        key: 'pixelToHex',
        value: function pixelToHex(center, size, x, y) {
            size = size / 2;

            // Flat top hexes
            var q = (x - center.x) * 0.6666666666666666 / size;
            var r = (-(x - center.x) / 3 + sqrt3_3 * (y - center.y)) / size;
            return _hex2.default.coords(Math.round(q, 0), Math.round(r, 0));
        }
    }]);

    return HexMap;
}();

exports.default = HexMap;

},{"./hex":17,"./point":19}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _point = require('./point');

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rad2deg = Math.PI / 180;
var sqrt3 = 1.7320508075688772;
var sqrt3_2 = sqrt3 / 2;

var Hex = function () {
    function Hex() {
        var q = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var r = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        _classCallCheck(this, Hex);

        if (q instanceof Hex) return new Hex(q.q, q.r); // Clone a given hex
        this.q = q;
        this.r = r;
    }

    /**
     * Returns the standardized coordinate string of the given hex or coordinates
     **/


    _createClass(Hex, [{
        key: 'coords',
        value: function coords() {
            return Hex.coords(this);
        }

        /**
         * Helper function to identify the cardinal directions of a hex
         **/

    }, {
        key: 'neighbor',
        value: function neighbor(direction) {
            return Hex.neighbor(this, direction);
        }

        /**
         * Returns coordinates of all neighboring hexes out to the given distance.
         **/

    }, {
        key: 'neighborhood',
        value: function neighborhood(distance) {
            return Hex.neighborhood(this, distance);
        }

        /**
         * Calculates the manhattan distance between two given hexes
         **/

    }, {
        key: 'distance',
        value: function distance(B) {
            return Hex.distance(this, B);
        }

        /**
         * Helper function to return the point of the given corner
         **/

    }, {
        key: 'render',
        value: function render(mapCenter, size, ctx) {
            return Hex.render(this, mapCenter, size, ctx);
        }
    }], [{
        key: 'coords',
        value: function coords(q, r) {
            if (q instanceof Hex) return q.q + ',' + q.r;
            return q + ',' + r;
        }
    }, {
        key: 'direction',
        value: function direction(_direction) {
            var directions = [{ q: +1, r: 0 }, { q: +1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: +1 }, { q: 0, r: +1 }];
            var dir = (_direction | 0) % 6;
            return directions[dir];
        }

        /**
         * Returns the neighboring (adjacent) hex in the given direction
         **/

    }, {
        key: 'neighbor',
        value: function neighbor(hex, direction) {
            hex = hex instanceof Object ? hex : {};

            var dir = Hex.direction(direction);
            return new Hex((hex.q | 0) + dir.q, (hex.r | 0) + dir.r);
        }
    }, {
        key: 'neighborhood',
        value: function neighborhood(hex, distance) {
            hex = hex instanceof Object ? hex : {};
            var q = hex.q | 0;
            var r = hex.r | 0;
            var d = distance | 0;
            var neighbors = [];

            for (var dq = -d; dq <= d; ++dq) {
                for (var dr = -d; dr <= d; ++dr) {
                    neighbors.push(new Hex(q + dq, r + dr));
                }
            }
            return neighbors;
        }
    }, {
        key: 'distance',
        value: function distance(A, B) {
            var a = A instanceof Hex ? A : new Hex();
            var b = B instanceof Hex ? B : new Hex();

            return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
        }
    }, {
        key: 'corner',
        value: function corner(center, size, i) {
            var flatTop = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

            var angleDeg = 60 * (i | 0) + (flatTop ? 0 : 30);
            var angleRad = rad2deg * angleDeg;
            return new _point2.default(center.x + size / 2 * Math.cos(angleRad), center.y + size / 2 * Math.sin(angleRad));
        }
    }, {
        key: 'render',
        value: function render(hex, mapCenter, size, ctx) {
            var hexCenter = new _point2.default(mapCenter.x + hex.q * size.horiz, mapCenter.y + hex.r * size.vert + size.vert / 2 * hex.q);
            var p = Hex.corner(hexCenter, size.size, 0);
            ctx.beginPath();
            ctx.fillStyle = hex.fillStyle || 'rgba(255,0,0,0.25)';
            ctx.strokeStyle = hex.strokeStyle || 'rgba(255,0,0,0.5)';
            ctx.lineWidth = hex.lineWidth || 0.025 * size.size;
            ctx.moveTo(p.x, p.y);
            for (var i = 1; i < 6; ++i) {
                p = Hex.corner(hexCenter, size.size, i);
                ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw cell label
            var text = hex.label;
            if (text) {
                var px = 20;
                ctx.fillStyle = '#eee';
                ctx.font = px + 'px serif';
                px = px * 0.60 * size.size / ctx.measureText(text).width;
                ctx.font = px + 'px serif';
                ctx.fillText(text, hexCenter.x - ctx.measureText(text).width / 2, hexCenter.y + 5);
            }
        }
    }, {
        key: 'getDimensions',
        value: function getDimensions(size) {
            var flatTop = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            var width, height, horiz, vert;

            if (flatTop) {
                width = size;
                height = width * sqrt3_2;
                horiz = width * 0.75;
                vert = height;
            } else {
                height = size;
                width = height * sqrt3_2;
                vert = height * 0.75;
                horiz = width;
            }

            return {
                size: size,
                width: width,
                height: height,
                horiz: horiz,
                vert: vert
            };
        }
    }]);

    return Hex;
}();

exports.default = Hex;

},{"./point":19}],18:[function(require,module,exports){
'use strict';

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = (0, _redux.createStore)(_reducer2.default);

store.dispatch({ type: 'init', mapSize: 5 });
store.subscribe(function () {
	return window.requestAnimationFrame(render);
});

document.body.addEventListener('mousemove', function (event) {
	store.dispatch({ type: 'touchmove', x: event.clientX, y: event.clientY });
});
document.body.addEventListener('mousedown', function (event) {
	store.dispatch({ type: 'touchstart', x: event.clientX, y: event.clientY });
});
document.body.addEventListener('mouseup', function (event) {
	store.dispatch({ type: 'touchend', x: event.clientX, y: event.clientY });
});
document.body.addEventListener('touchmove', function (event) {
	store.dispatch({ type: 'touchmove', x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY });
});
document.body.addEventListener('touchstart', function (event) {
	store.dispatch({ type: 'touchstart', x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY });
});
document.body.addEventListener('touchend', function (event) {
	store.dispatch({ type: 'touchend', x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY });
});
window.onresize = function (event) {
	store.dispatch({ type: 'resize' });
};

function render() {
	var state = store.getState();
	state.canvas.render();

	state.map.render(state.center, state.hexDimensions, state.canvas.ctx);
	if (state.touching) {
		var fillStyle = state.touching.fillStyle;
		var label = state.touching.label;

		state.touching.label = state.touching.coords();
		state.touching.fillStyle = 'rgba(255,0,0,0.25)';
		state.touching.render(state.center, state.hexDimensions, state.canvas.ctx);

		state.touching.label = label;
		state.touching.fillStyle = fillStyle;
	}
}

window.requestAnimationFrame(render);

},{"./reducer":20,"redux":11}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function () {
  function Point() {
    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    _classCallCheck(this, Point);

    if (x instanceof Point) return new Point(x.x, x.y); // Clone a given Point
    if (!(this instanceof Point)) return new Point(x, y);
    this.x = +x || 0;
    this.y = +y || 0;
  }

  /**
   * Calculates the Pythagorean distance between two given points
   **/


  _createClass(Point, [{
    key: "distance",
    value: function distance(B) {
      return Point.distance(this, B);
    }
  }], [{
    key: "distance",
    value: function distance(A, B) {
      var a = A instanceof Point ? A : new Point();
      var b = B instanceof Point ? B : new Point();

      var x = b.x - a.x;
      var y = b.y - a.y;
      return Math.sqrt(x * x + y * y);
    }
  }]);

  return Point;
}();

exports.default = Point;

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = reducer;

var _hex = require('./hex');

var _hex2 = _interopRequireDefault(_hex);

var _hexMap = require('./hex-map');

var _hexMap2 = _interopRequireDefault(_hexMap);

var _canvas = require('./canvas');

var _canvas2 = _interopRequireDefault(_canvas);

var _point = require('./point');

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	var _ret = function () {
		switch (action.type) {
			case 'init':
				var canvas = new _canvas2.default();
				var centerHex = new _hex2.default();
				var map = new _hexMap2.default(action.mapSize);
				map.forEach(function (hex) {
					if (hex.distance(centerHex) === action.mapSize) {
						hex.strokeStyle = '#aaa';
						hex.fillStyle = '#784315';
						hex.type = 'wall';
					} else {
						hex.strokeStyle = '#aaa';
						hex.fillStyle = '#6c9023';
						hex.type = 'grass';
					}
				});

				state.mapSize = action.mapSize;
				state.map = map;
				state.canvas = canvas;
				resize(state);
				initGame(state);
				return {
					v: state
				};

			case 'resize':
				resize(state);
				return {
					v: state
				};

			case 'touchmove':
			case 'touchstart':
			case 'touchend':
				state.touching = state.map.pixelToHex(state.center, state.pxPerHex, action.x, action.y);
				return {
					v: state
				};

			default:
				return {
					v: state
				};
		}
	}();

	if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
}

var sqrt3 = 1.7320508075688772;
var sqrt3_2 = sqrt3 / 2;

function resize(state) {
	state.canvas.cvs.width = window.innerWidth;
	state.canvas.cvs.height = window.innerHeight;
	state.center = new _point2.default(state.canvas.cvs.width / 2, state.canvas.cvs.height / 2);
	state.pxPerHex = Math.min(state.canvas.cvs.width, state.canvas.cvs.height) / state.mapSize / 2;
	state.hexDimensions = _hex2.default.getDimensions(state.pxPerHex);
}

function initGame(state) {
	var grass = [];
	state.cats = [];
	state.map.forEach(function (hex) {
		if (hex.type === 'grass') {
			// Randomize the grass
			var i = ~~(Math.random() * grass.length + 0.5);
			if (i === grass.length) {
				grass.push(hex);
			} else {
				grass.push(grass[i]);
				grass[i] = hex;
			}
		}
	});
	state.cats = grass.slice(0, 9);
	state.cats.forEach(function (hex) {
		hex.label = '>^.^<';
	});
	state.playerA = [];
	[[0, -1], [1, 0], [-1, 1]].forEach(function (startingPos) {
		var q = startingPos[0] * state.mapSize;
		var r = startingPos[1] * state.mapSize;
		state.playerA.push(state.map[_hex2.default.coords(q, r)]);
	});
	state.playerB = [];
	[[-1, 0], [1, -1], [0, 1]].forEach(function (startingPos) {
		var q = startingPos[0] * state.mapSize;
		var r = startingPos[1] * state.mapSize;
		state.playerB.push(state.map[_hex2.default.coords(q, r)]);
	});
	state.playerA.forEach(function (hex) {
		hex.label = '(ツ)';
	});
	state.playerB.forEach(function (hex) {
		hex.label = '(◔̯◔)';
	});
}

},{"./canvas":15,"./hex":17,"./hex-map":16,"./point":19}],21:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
    try {
        cachedSetTimeout = setTimeout;
    } catch (e) {
        cachedSetTimeout = function () {
            throw new Error('setTimeout is not defined');
        }
    }
    try {
        cachedClearTimeout = clearTimeout;
    } catch (e) {
        cachedClearTimeout = function () {
            throw new Error('clearTimeout is not defined');
        }
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
    } else {
        return cachedSetTimeout.call(null, fun, 0);
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        clearTimeout(marker);
    } else {
        cachedClearTimeout.call(null, marker);
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[18]);
