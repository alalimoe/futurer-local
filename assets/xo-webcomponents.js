var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.xobuildercomponents = {}));
})(this, function(exports2) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka, _la, _ma, _na, _oa, _pa, _qa, _ra, _sa, _ta, _ua;
  "use strict";
  /*! (c) Andrea Giammarchi @webreflection ISC */
  (function() {
    var attributesObserver = function(whenDefined2, MutationObserver2) {
      var attributeChanged = function attributeChanged2(records) {
        for (var i = 0, length = records.length; i < length; i++)
          dispatch(records[i]);
      };
      var dispatch = function dispatch2(_ref2) {
        var target = _ref2.target, attributeName = _ref2.attributeName, oldValue = _ref2.oldValue;
        target.attributeChangedCallback(attributeName, oldValue, target.getAttribute(attributeName));
      };
      return function(target, is2) {
        var attributeFilter = target.constructor.observedAttributes;
        if (attributeFilter) {
          whenDefined2(is2).then(function() {
            new MutationObserver2(attributeChanged).observe(target, {
              attributes: true,
              attributeOldValue: true,
              attributeFilter
            });
            for (var i = 0, length = attributeFilter.length; i < length; i++) {
              if (target.hasAttribute(attributeFilter[i]))
                dispatch({
                  target,
                  attributeName: attributeFilter[i],
                  oldValue: null
                });
            }
          });
        }
        return target;
      };
    };
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++)
        arr2[i] = arr[i];
      return arr2;
    }
    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it)
            o = it;
          var i = 0;
          var F = function() {
          };
          return {
            s: F,
            n: function() {
              if (i >= o.length)
                return {
                  done: true
                };
              return {
                done: false,
                value: o[i++]
              };
            },
            e: function(e) {
              throw e;
            },
            f: F
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      var normalCompletion = true, didErr = false, err;
      return {
        s: function() {
          it = it.call(o);
        },
        n: function() {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        },
        e: function(e) {
          didErr = true;
          err = e;
        },
        f: function() {
          try {
            if (!normalCompletion && it.return != null)
              it.return();
          } finally {
            if (didErr)
              throw err;
          }
        }
      };
    }
    /*! (c) Andrea Giammarchi - ISC */
    var TRUE = true, FALSE = false, QSA$1 = "querySelectorAll";
    var notify = function notify2(callback) {
      var root = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : document;
      var MO = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : MutationObserver;
      var query2 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ["*"];
      var loop = function loop2(nodes, selectors, added, removed, connected, pass) {
        var _iterator = _createForOfIteratorHelper(nodes), _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done; ) {
            var node = _step.value;
            if (pass || QSA$1 in node) {
              if (connected) {
                if (!added.has(node)) {
                  added.add(node);
                  removed["delete"](node);
                  callback(node, connected);
                }
              } else if (!removed.has(node)) {
                removed.add(node);
                added["delete"](node);
                callback(node, connected);
              }
              if (!pass)
                loop2(node[QSA$1](selectors), selectors, added, removed, connected, TRUE);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };
      var mo = new MO(function(records) {
        if (query2.length) {
          var selectors = query2.join(",");
          var added = /* @__PURE__ */ new Set(), removed = /* @__PURE__ */ new Set();
          var _iterator2 = _createForOfIteratorHelper(records), _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
              var _step2$value = _step2.value, addedNodes = _step2$value.addedNodes, removedNodes = _step2$value.removedNodes;
              loop(removedNodes, selectors, added, removed, FALSE, FALSE);
              loop(addedNodes, selectors, added, removed, TRUE, FALSE);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      });
      var observe = mo.observe;
      (mo.observe = function(node) {
        return observe.call(mo, node, {
          subtree: TRUE,
          childList: TRUE
        });
      })(root);
      return mo;
    };
    var QSA = "querySelectorAll";
    var _self$1 = self, document$2 = _self$1.document, Element$1 = _self$1.Element, MutationObserver$2 = _self$1.MutationObserver, Set$2 = _self$1.Set, WeakMap$1 = _self$1.WeakMap;
    var elements = function elements2(element) {
      return QSA in element;
    };
    var filter2 = [].filter;
    var qsaObserver = function(options) {
      var live = new WeakMap$1();
      var drop = function drop2(elements2) {
        for (var i = 0, length = elements2.length; i < length; i++)
          live["delete"](elements2[i]);
      };
      var flush = function flush2() {
        var records = observer2.takeRecords();
        for (var i = 0, length = records.length; i < length; i++) {
          parse2(filter2.call(records[i].removedNodes, elements), false);
          parse2(filter2.call(records[i].addedNodes, elements), true);
        }
      };
      var matches = function matches2(element) {
        return element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
      };
      var notifier = function notifier2(element, connected) {
        var selectors;
        if (connected) {
          for (var q, m = matches(element), i = 0, length = query2.length; i < length; i++) {
            if (m.call(element, q = query2[i])) {
              if (!live.has(element))
                live.set(element, new Set$2());
              selectors = live.get(element);
              if (!selectors.has(q)) {
                selectors.add(q);
                options.handle(element, connected, q);
              }
            }
          }
        } else if (live.has(element)) {
          selectors = live.get(element);
          live["delete"](element);
          selectors.forEach(function(q2) {
            options.handle(element, connected, q2);
          });
        }
      };
      var parse2 = function parse3(elements2) {
        var connected = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        for (var i = 0, length = elements2.length; i < length; i++)
          notifier(elements2[i], connected);
      };
      var query2 = options.query;
      var root = options.root || document$2;
      var observer2 = notify(notifier, root, MutationObserver$2, query2);
      var attachShadow2 = Element$1.prototype.attachShadow;
      if (attachShadow2)
        Element$1.prototype.attachShadow = function(init2) {
          var shadowRoot = attachShadow2.call(this, init2);
          observer2.observe(shadowRoot);
          return shadowRoot;
        };
      if (query2.length)
        parse2(root[QSA](query2));
      return {
        drop,
        flush,
        observer: observer2,
        parse: parse2
      };
    };
    var _self = self, document$1 = _self.document, Map2 = _self.Map, MutationObserver$1 = _self.MutationObserver, Object$1 = _self.Object, Set$1 = _self.Set, WeakMap2 = _self.WeakMap, Element = _self.Element, HTMLElement2 = _self.HTMLElement, Node = _self.Node, Error2 = _self.Error, TypeError$1 = _self.TypeError, Reflect2 = _self.Reflect;
    var defineProperty = Object$1.defineProperty, keys = Object$1.keys, getOwnPropertyNames = Object$1.getOwnPropertyNames, setPrototypeOf = Object$1.setPrototypeOf;
    var legacy = !self.customElements;
    var expando = function expando2(element) {
      var key = keys(element);
      var value = [];
      var ignore = new Set$1();
      var length = key.length;
      for (var i = 0; i < length; i++) {
        value[i] = element[key[i]];
        try {
          delete element[key[i]];
        } catch (SafariTP) {
          ignore.add(i);
        }
      }
      return function() {
        for (var _i2 = 0; _i2 < length; _i2++)
          ignore.has(_i2) || (element[key[_i2]] = value[_i2]);
      };
    };
    if (legacy) {
      var HTMLBuiltIn = function HTMLBuiltIn2() {
        var constructor = this.constructor;
        if (!classes.has(constructor))
          throw new TypeError$1("Illegal constructor");
        var is2 = classes.get(constructor);
        if (override)
          return augment(override, is2);
        var element = createElement.call(document$1, is2);
        return augment(setPrototypeOf(element, constructor.prototype), is2);
      };
      var createElement = document$1.createElement;
      var classes = new Map2();
      var defined = new Map2();
      var prototypes = new Map2();
      var registry = new Map2();
      var query = [];
      var handle = function handle2(element, connected, selector) {
        var proto = prototypes.get(selector);
        if (connected && !proto.isPrototypeOf(element)) {
          var redefine = expando(element);
          override = setPrototypeOf(element, proto);
          try {
            new proto.constructor();
          } finally {
            override = null;
            redefine();
          }
        }
        var method = "".concat(connected ? "" : "dis", "connectedCallback");
        if (method in proto)
          element[method]();
      };
      var _qsaObserver = qsaObserver({
        query,
        handle
      }), parse = _qsaObserver.parse;
      var override = null;
      var whenDefined = function whenDefined2(name) {
        if (!defined.has(name)) {
          var _, $ = new Promise(function($2) {
            _ = $2;
          });
          defined.set(name, {
            $,
            _
          });
        }
        return defined.get(name).$;
      };
      var augment = attributesObserver(whenDefined, MutationObserver$1);
      self.customElements = {
        define: function define3(is2, Class) {
          if (registry.has(is2))
            throw new Error2('the name "'.concat(is2, '" has already been used with this registry'));
          classes.set(Class, is2);
          prototypes.set(is2, Class.prototype);
          registry.set(is2, Class);
          query.push(is2);
          whenDefined(is2).then(function() {
            parse(document$1.querySelectorAll(is2));
          });
          defined.get(is2)._(Class);
        },
        get: function get2(is2) {
          return registry.get(is2);
        },
        whenDefined
      };
      defineProperty(HTMLBuiltIn.prototype = HTMLElement2.prototype, "constructor", {
        value: HTMLBuiltIn
      });
      self.HTMLElement = HTMLBuiltIn;
      document$1.createElement = function(name, options) {
        var is2 = options && options.is;
        var Class = is2 ? registry.get(is2) : registry.get(name);
        return Class ? new Class() : createElement.call(document$1, name);
      };
      if (!("isConnected" in Node.prototype))
        defineProperty(Node.prototype, "isConnected", {
          configurable: true,
          get: function get2() {
            return !(this.ownerDocument.compareDocumentPosition(this) & this.DOCUMENT_POSITION_DISCONNECTED);
          }
        });
    } else {
      legacy = !self.customElements.get("extends-br");
      if (legacy) {
        try {
          var BR = function BR2() {
            return self.Reflect.construct(HTMLBRElement, [], BR2);
          };
          BR.prototype = HTMLLIElement.prototype;
          var is = "extends-br";
          self.customElements.define("extends-br", BR, {
            "extends": "br"
          });
          legacy = document$1.createElement("br", {
            is
          }).outerHTML.indexOf(is) < 0;
          var _self$customElements = self.customElements, get = _self$customElements.get, _whenDefined = _self$customElements.whenDefined;
          self.customElements.whenDefined = function(is2) {
            var _this = this;
            return _whenDefined.call(this, is2).then(function(Class) {
              return Class || get.call(_this, is2);
            });
          };
        } catch (o_O) {
        }
      }
    }
    if (legacy) {
      var _parseShadow = function _parseShadow2(element) {
        var root = shadowRoots.get(element);
        _parse(root.querySelectorAll(this), element.isConnected);
      };
      var customElements2 = self.customElements;
      var _createElement = document$1.createElement;
      var define2 = customElements2.define, _get = customElements2.get, upgrade = customElements2.upgrade;
      var _ref = Reflect2 || {
        construct: function construct2(HTMLElement3) {
          return HTMLElement3.call(this);
        }
      }, construct = _ref.construct;
      var shadowRoots = new WeakMap2();
      var shadows = new Set$1();
      var _classes = new Map2();
      var _defined = new Map2();
      var _prototypes = new Map2();
      var _registry = new Map2();
      var shadowed = [];
      var _query = [];
      var getCE = function getCE2(is2) {
        return _registry.get(is2) || _get.call(customElements2, is2);
      };
      var _handle = function _handle2(element, connected, selector) {
        var proto = _prototypes.get(selector);
        if (connected && !proto.isPrototypeOf(element)) {
          var redefine = expando(element);
          _override = setPrototypeOf(element, proto);
          try {
            new proto.constructor();
          } finally {
            _override = null;
            redefine();
          }
        }
        var method = "".concat(connected ? "" : "dis", "connectedCallback");
        if (method in proto)
          element[method]();
      };
      var _qsaObserver2 = qsaObserver({
        query: _query,
        handle: _handle
      }), _parse = _qsaObserver2.parse;
      var _qsaObserver3 = qsaObserver({
        query: shadowed,
        handle: function handle2(element, connected) {
          if (shadowRoots.has(element)) {
            if (connected)
              shadows.add(element);
            else
              shadows["delete"](element);
            if (_query.length)
              _parseShadow.call(_query, element);
          }
        }
      }), parseShadowed = _qsaObserver3.parse;
      var attachShadow = Element.prototype.attachShadow;
      if (attachShadow)
        Element.prototype.attachShadow = function(init2) {
          var root = attachShadow.call(this, init2);
          shadowRoots.set(this, root);
          return root;
        };
      var _whenDefined2 = function _whenDefined22(name) {
        if (!_defined.has(name)) {
          var _, $ = new Promise(function($2) {
            _ = $2;
          });
          _defined.set(name, {
            $,
            _
          });
        }
        return _defined.get(name).$;
      };
      var _augment = attributesObserver(_whenDefined2, MutationObserver$1);
      var _override = null;
      getOwnPropertyNames(self).filter(function(k) {
        return /^HTML.*Element$/.test(k);
      }).forEach(function(k) {
        var HTMLElement3 = self[k];
        function HTMLBuiltIn2() {
          var constructor = this.constructor;
          if (!_classes.has(constructor))
            throw new TypeError$1("Illegal constructor");
          var _classes$get = _classes.get(constructor), is2 = _classes$get.is, tag = _classes$get.tag;
          if (is2) {
            if (_override)
              return _augment(_override, is2);
            var element = _createElement.call(document$1, tag);
            element.setAttribute("is", is2);
            return _augment(setPrototypeOf(element, constructor.prototype), is2);
          } else
            return construct.call(this, HTMLElement3, [], constructor);
        }
        defineProperty(HTMLBuiltIn2.prototype = HTMLElement3.prototype, "constructor", {
          value: HTMLBuiltIn2
        });
        defineProperty(self, k, {
          value: HTMLBuiltIn2
        });
      });
      document$1.createElement = function(name, options) {
        var is2 = options && options.is;
        if (is2) {
          var Class = _registry.get(is2);
          if (Class && _classes.get(Class).tag === name)
            return new Class();
        }
        var element = _createElement.call(document$1, name);
        if (is2)
          element.setAttribute("is", is2);
        return element;
      };
      customElements2.get = getCE;
      customElements2.whenDefined = _whenDefined2;
      customElements2.upgrade = function(element) {
        var is2 = element.getAttribute("is");
        if (is2) {
          var _constructor = _registry.get(is2);
          if (_constructor) {
            _augment(setPrototypeOf(element, _constructor.prototype), is2);
            return;
          }
        }
        upgrade.call(customElements2, element);
      };
      customElements2.define = function(is2, Class, options) {
        if (getCE(is2))
          throw new Error2("'".concat(is2, "' has already been defined as a custom element"));
        var selector;
        var tag = options && options["extends"];
        _classes.set(Class, tag ? {
          is: is2,
          tag
        } : {
          is: "",
          tag: is2
        });
        if (tag) {
          selector = "".concat(tag, '[is="').concat(is2, '"]');
          _prototypes.set(selector, Class.prototype);
          _registry.set(is2, Class);
          _query.push(selector);
        } else {
          define2.apply(customElements2, arguments);
          shadowed.push(selector = is2);
        }
        _whenDefined2(is2).then(function() {
          if (tag) {
            _parse(document$1.querySelectorAll(selector));
            shadows.forEach(_parseShadow, [selector]);
          } else
            parseShadowed(document$1.querySelectorAll(selector));
        });
        _defined.get(is2)._(Class);
      };
    }
  })();
  const utils = window.XotinyUtils;
  const attrBoolean = utils == null ? void 0 : utils.attrBoolean;
  const clamp = utils == null ? void 0 : utils.clamp;
  utils == null ? void 0 : utils.cloneDeep;
  const componentDefine = utils == null ? void 0 : utils.componentDefine;
  const createAnimate = utils == null ? void 0 : utils.createAnimate;
  const createCssInJs = utils == null ? void 0 : utils.createCssInJs;
  const appendStyle = utils == null ? void 0 : utils.appendStyle;
  const hash = utils == null ? void 0 : utils.hash;
  const createDebounce = utils == null ? void 0 : utils.createDebounce;
  const debounce = utils == null ? void 0 : utils.debounce;
  const delay = utils == null ? void 0 : utils.delay;
  const DOMLoaded = utils == null ? void 0 : utils.DOMLoaded;
  const easings = utils == null ? void 0 : utils.easings;
  const Emitter = utils == null ? void 0 : utils.Emitter;
  const equal = utils == null ? void 0 : utils.equal;
  const each = utils == null ? void 0 : utils.each;
  const filter = utils == null ? void 0 : utils.filter;
  const findIndex = utils == null ? void 0 : utils.findIndex;
  const map = utils == null ? void 0 : utils.map;
  const reduce = utils == null ? void 0 : utils.reduce;
  const frameManager = utils == null ? void 0 : utils.frameManager;
  utils == null ? void 0 : utils.FrameManager;
  const getAttrs = utils == null ? void 0 : utils.getAttrs;
  const imageUrl = utils == null ? void 0 : utils.imageUrl;
  const interpolate = utils == null ? void 0 : utils.interpolate;
  const isMobile = utils == null ? void 0 : utils.isMobile;
  const device = utils == null ? void 0 : utils.device;
  utils == null ? void 0 : utils.os;
  const namingConvention = utils == null ? void 0 : utils.namingConvention;
  const objectKeys = utils == null ? void 0 : utils.objectKeys;
  const objectParse = utils == null ? void 0 : utils.objectParse;
  const objectValues = utils == null ? void 0 : utils.objectValues;
  const offset = utils == null ? void 0 : utils.offset;
  const panGesture = utils == null ? void 0 : utils.panGesture;
  const popper = utils == null ? void 0 : utils.popper;
  const queryString = utils == null ? void 0 : utils.queryString;
  const rubberBandClamp = utils == null ? void 0 : utils.rubberBandClamp;
  const storage = utils == null ? void 0 : utils.storage;
  const throttle = utils == null ? void 0 : utils.throttle;
  const throwError = utils == null ? void 0 : utils.throwError;
  const typeOf = utils == null ? void 0 : utils.typeOf;
  const XOStore = utils == null ? void 0 : utils.XOStore;
  const getScrollbarWidth = utils == null ? void 0 : utils.getScrollbarWidth;
  const getBreakpointsOptions = utils == null ? void 0 : utils.getBreakpointsOptions;
  const resizeAxis = utils == null ? void 0 : utils.resizeAxis;
  const loadStyle = utils == null ? void 0 : utils.loadStyle;
  const loadScript = utils == null ? void 0 : utils.loadScript;
  const range = utils == null ? void 0 : utils.range;
  const SVGPath = utils == null ? void 0 : utils.SVGPath;
  const inViewport = utils == null ? void 0 : utils.inViewport;
  const wrapAroundRange = utils == null ? void 0 : utils.wrapAroundRange;
  const customElements$1 = utils == null ? void 0 : utils.customElements;
  const contextUpdate = utils == null ? void 0 : utils.contextUpdate;
  const stateUpdate = utils == null ? void 0 : utils.stateUpdate;
  const XoComponent = utils == null ? void 0 : utils.XoComponent;
  utils == null ? void 0 : utils.XoHTMLDivElement;
  const XoHTMLElement = utils == null ? void 0 : utils.XoHTMLElement;
  const imagesLoaded = utils == null ? void 0 : utils.imagesLoaded;
  const sectionXoBuiderObserver = utils == null ? void 0 : utils.sectionXoBuiderObserver;
  const isBot = utils == null ? void 0 : utils.isBot;
  const openPopover = utils == null ? void 0 : utils.openPopover;
  const closePopover = utils == null ? void 0 : utils.closePopover;
  const popoverSupported$1 = utils == null ? void 0 : utils.popoverSupported;
  const isVimeo = utils == null ? void 0 : utils.isVimeo;
  const isYoutube = utils == null ? void 0 : utils.isYoutube;
  const playVideo = utils == null ? void 0 : utils.playVideo;
  const pauseVideo = utils == null ? void 0 : utils.pauseVideo;
  const getShopifySectionId = utils == null ? void 0 : utils.getShopifySectionId;
  const getRootRoute = utils == null ? void 0 : utils.getRootRoute;
  const formatMoney = utils == null ? void 0 : utils.formatMoney;
  const requestIdleCallback$1 = utils == null ? void 0 : utils.requestIdleCallback;
  const cancelIdleCallback$1 = utils == null ? void 0 : utils.cancelIdleCallback;
  utils == null ? void 0 : utils.logger;
  utils == null ? void 0 : utils.random;
  utils == null ? void 0 : utils.damp;
  utils == null ? void 0 : utils.createDampedValue;
  const createCache = utils == null ? void 0 : utils.createCache;
  const WebComponent = {
    CircleBar: "xo-circle-bar",
    ScrollX: "xo-scroll-x",
    ScrollXInner: "xo-scroll-x-inner",
    ScrollXItem: "xo-scroll-x-item",
    ScrollY: "xo-scroll-y",
    ScrollYInner: "xo-scroll-y-inner",
    ScrollYItem: "xo-scroll-y-item",
    ScrollXYItem: "xo-scroll-xy-item",
    Toggle: "xo-toggle",
    ToggleTrigger: "xo-toggle-trigger",
    Modal: "xo-modal",
    ModalTrigger: "xo-modal-trigger",
    ModalInner: "xo-modal-inner",
    ModalContent: "xo-modal-content",
    ModalBackdrop: "xo-modal-backdrop",
    ModalPan: "xo-modal-pan",
    Toast: "xo-toast",
    ToastPortal: "xo-toast-portal",
    ToastContent: "xo-toast-content",
    ToastCloseButton: "xo-toast-close-button",
    Popover: "xo-popover",
    PopoverTrigger: "xo-popover-trigger",
    BuilderPopover: "xo-builder-popover",
    BuilderPopoverContent: "xo-builder-popover-content",
    Tooltip: "xo-tooltip",
    TooltipContent: "xo-tooltip-content",
    TooltipTrigger: "xo-tooltip-trigger",
    Sticky: "xo-sticky",
    StickyInner: "xo-sticky-inner",
    StickyContent: "xo-sticky-content",
    StickySpace: "xo-sticky-space",
    StickyHidden: "xo-sticky-hidden",
    Collapse: "xo-collapse",
    CollapseTrigger: "xo-collapse-trigger",
    CollapseProvider: "xo-collapse-provider",
    List: "xo-list",
    ListTrigger: "xo-list-trigger",
    ListPortal: "xo-list-portal",
    ListItem: "xo-list-item",
    Tabs: "xo-tabs",
    TabsPane: "xo-tabs-pane",
    TabsTrigger: "xo-tabs-trigger",
    TabsActive: "xo-tabs-active",
    Parallax: "xo-parallax",
    ParallaxScroll: "xo-parallax-scroll",
    ParallaxHover: "xo-parallax-hover",
    ParallaxHoverInner: "xo-parallax-hover-inner",
    Carousel: "xo-carousel",
    CarouselThumbnail: "xo-carousel-thumbnail",
    CarouselList: "xo-carousel-list",
    CarouselInner: "xo-carousel-inner",
    CarouselSlide: "xo-carousel-slide",
    CarouselNext: "xo-carousel-next",
    CarouselPrev: "xo-carousel-prev",
    CarouselPagination: "xo-carousel-pagination",
    CarouselBullet: "xo-carousel-bullet",
    CarouselSize: "xo-carousel-size",
    CarouselPage: "xo-carousel-page",
    CarouselTrigger: "xo-carousel-trigger",
    CarouselPaginationProgress: "xo-carousel-pagination-progress",
    CarouselDynamicBullets: "xo-carousel-dynamic-bullets",
    CarouselFilterEffect: "xo-carousel-filter-effect",
    ScrollCarousel: "xo-scroll-carousel",
    ScrollCarouselNext: "xo-scroll-carousel-next",
    ScrollCarouselPrev: "xo-scroll-carousel-prev",
    Range: "xo-range",
    RangePrice: "xo-range-price",
    RangeTrack: "xo-range-track",
    RangeThumb: "xo-range-thumb",
    RangeProgress: "xo-range-progress",
    Filters: "xo-filters",
    FiltersMobile: "xo-filters-mobile",
    FiltersField: "xo-filters-field",
    FiltersContent: "xo-filters-content",
    FiltersContentAnchor: "xo-filters-content-anchor",
    FiltersRefine: "xo-filters-refine",
    FiltersClear: "xo-filters-clear",
    FiltersFallback: "xo-filters-fallback",
    FiltersCount: "xo-filters-count",
    FiltersActiveSize: "xo-filters-active-size",
    FiltersPaginate: "xo-filters-paginate",
    FiltersLoadMore: "xo-filters-load-more",
    FiltersTop: "xo-filters-top",
    FiltersSortBySelected: "xo-filters-sort-by-selected",
    FiltersRefineClearIcon: "xo-filters-refine-clear-icon",
    FiltersForm: "xo-filters-form",
    FiltersFormField: "xo-filters-form-field",
    FiltersFormSelected: "xo-filters-form-selected",
    Gallery: "xo-gallery",
    GalleryItem: "xo-gallery-item",
    GalleryPortal: "xo-gallery-portal",
    GalleryNext: "xo-gallery-next",
    GalleryPrev: "xo-gallery-prev",
    GalleryCounter: "xo-gallery-counter",
    Cart: "xo-cart",
    CartMini: "xo-cart-mini",
    CartSize: "xo-cart-size",
    CartAdd: "xo-cart-add",
    CartFly: "xo-cart-fly",
    CartRemove: "xo-cart-remove",
    CartChangeFallback: "xo-cart-change-fallback",
    CartQuantity: "xo-cart-quantity",
    CartQuantityMinus: "xo-cart-quantity-minus",
    CartQuantityPlus: "xo-cart-quantity-plus",
    CartQuantityTrigger: "xo-cart-quantity-trigger",
    CartNote: "xo-cart-note",
    CartNoteSubmit: "xo-cart-note-submit",
    CartShippingRates: "xo-cart-shipping-rates",
    CartShippingRatesField: "xo-cart-shipping-rates-field",
    CartShippingRatesSubmit: "xo-cart-shipping-rates-submit",
    CartShippingRatesError: "xo-cart-shipping-rates-error",
    CartDiscount: "xo-cart-discount",
    CartDiscountSubmit: "xo-cart-discount-submit",
    CartDiscountItem: "xo-cart-discount-item",
    CartDiscountRemove: "xo-cart-discount-remove",
    CartScroll: "xo-cart-scroll",
    CartAddError: "xo-cart-add-error",
    CartAddErrorMessage: "xo-cart-add-error-message",
    CartWillChange: "xo-cart-will-change",
    Product: "xo-product",
    ProductWillChange: "xo-product-will-change",
    ProductVariant: "xo-product-variant",
    ProductVariants: "xo-product-variants",
    ProductVariantActive: "xo-product-variant-active",
    ProductProperties: "xo-product-properties",
    ProductProperty: "xo-product-property",
    ProductData: "xo-product-data",
    ProductPickupAvailability: "xo-product-pickup-availability",
    ProductPickupAvailabilityList: "xo-product-pickup-availability-list",
    ProductQuickView: "xo-product-quick-view",
    ProductQuickViewTrigger: "xo-product-quick-view-trigger",
    ProductQuickViewVariant: "xo-product-quick-view-variant",
    ProductQuickViewLiquidBinding: "xo-product-quick-view-liquid-binding",
    ProductLiquidStatic: "xo-product-liquid-static",
    ProductVariantSelected: "xo-product-variant-selected",
    ProductRecipientForm: "xo-product-recipient-form",
    ProductRecipientFormError: "xo-product-recipient-form-error",
    ProductRecommendations: "xo-product-recommendations",
    ProductMedia: "xo-product-media",
    ProductCompareAdd: "xo-product-compare-add",
    ProductCompareRemove: "xo-product-compare-remove",
    ProductCompareClear: "xo-product-compare-clear",
    ProductCompareSize: "xo-product-compare-size",
    BundleProvider: "xo-bundle-provider",
    BundleAdd: "xo-bundle-add",
    BundleRemove: "xo-bundle-remove",
    BundleContent: "xo-bundle-content",
    BundlePrice: "xo-bundle-price",
    BundleSize: "xo-bundle-size",
    BundlePlaceholder: "xo-bundle-placeholder",
    BundleProgress: "xo-bundle-progress",
    BundleStep: "xo-bundle-step",
    BundleProperties: "xo-bundle-properties",
    PriceReduced: "xo-price-reduced",
    MarqueeScrollTransform: "xo-marquee-scroll-transform",
    Marquee: "xo-marquee",
    MarqueeItem: "xo-marquee-item",
    SvgMarquee: "xo-svg-marquee",
    Group: "xo-group",
    GroupButton: "xo-group-button",
    Animate: "xo-animate",
    AnimateItem: "xo-animate-item",
    ImageZoom: "xo-image-zoom",
    ImageZoomInner: "xo-image-zoom-inner",
    ImageZoomItem: "xo-image-zoom-item",
    ImageZoomThumb: "xo-image-zoom-thumb",
    ImageZoomManual: "xo-image-zoom-manual",
    Countdown: "xo-countdown",
    CountdownDay: "xo-countdown-day",
    CountdownHour: "xo-countdown-hour",
    CountdownMinute: "xo-countdown-minute",
    CountdownSecond: "xo-countdown-second",
    Countto: "xo-countto",
    CounttoNumber: "xo-countto-number",
    VideoCover: "xo-video-cover",
    VideoCoverButton: "xo-video-cover-button",
    VideoCoverItem: "xo-video-cover-item",
    Ripple: "xo-ripple",
    RippleItem: "xo-ripple-item",
    Typing: "xo-typing",
    TypingInner: "xo-typing-inner",
    TypingContent: "xo-typing-content",
    ImageComparison: "xo-image-comparison",
    Instagram: "xo-instagram",
    InstagramTemplate: "xo-instagram-template",
    InstagramItem: "xo-instagram-item",
    InstagramNext: "xo-instagram-next",
    InstagramPrev: "xo-instagram-prev",
    DarkMode: "xo-dark-mode",
    MegaMenu: "xo-mega-menu",
    Masonry: "xo-masonry",
    MasonryItem: "xo-masonry-item",
    Lazyload: "xo-lazyload",
    Cursor: "xo-cursor",
    CursorItem: "xo-cursor-item",
    VirtualScroll: "xo-virtual-scroll",
    Drr: "xo-drr",
    Drr2: "xo-drr-2",
    DrrAction: "xo-drr-action",
    Magnetic: "xo-magnetic",
    MagneticContent: "xo-magnetic-content",
    ScrollScene: "xo-scroll-scene",
    ScrollSceneInner: "xo-scroll-scene-inner",
    ScrollSceneItem: "xo-scroll-scene-item",
    ScrollSceneItemFocus: "xo-scroll-scene-item-focus",
    CollectionTabs: "xo-collection-tabs",
    CollectionTabsTrigger: "xo-collection-tabs-trigger",
    CollectionTabsContent: "xo-collection-tabs-content",
    IntersectionVideo: "xo-intersection-video",
    ProductsFetcher: "xo-products-fetcher",
    ProductsFetcherAdd: "xo-products-fetcher-add",
    ProductsFetcherRemove: "xo-products-fetcher-remove",
    ProductsFetcherClear: "xo-products-fetcher-clear",
    ProductsFetcherSize: "xo-products-fetcher-size",
    ProductsFetcherPaginate: "xo-products-fetcher-paginate",
    Photoswipe: "xo-photoswipe",
    GlobalFunction: "xo-global-function",
    Item: "xo-item",
    TurboProgressBar: "xo-turbo-progress-bar",
    ColumnOptionsTrigger: "xo-column-options-trigger",
    ColumnOptionsProvider: "xo-column-options-provider"
  };
  const WIDTH_PARAM = "width";
  const DEFAULT_DEVICE_PIXEL_RATIO = window.devicePixelRatio > 1 ? 1.2 : 1;
  const MIN_DEVICE_PIXEL_RATIO = (_a = window == null ? void 0 : window.xoImgDevicePixelRatio) != null ? _a : DEFAULT_DEVICE_PIXEL_RATIO;
  const MAX_DEVICE_PIXEL_RATIO = (_b = window == null ? void 0 : window.xoImgDevicePixelRatio) != null ? _b : DEFAULT_DEVICE_PIXEL_RATIO;
  const MAX_WIDTH = 2e3;
  function getSrc(src, width, min, max) {
    const oldSrc = src;
    if (!oldSrc) {
      return "";
    }
    if (oldSrc.includes("data:")) {
      return oldSrc;
    }
    const oldSrcRemoveWidth = oldSrc.replace(/(\?|&)(w|width)=\d*/g, "").replace(new RegExp(`(\\?|&)${WIDTH_PARAM}=\\d*`, "g"), "");
    const devicePixelRatio = clamp(window.devicePixelRatio, MIN_DEVICE_PIXEL_RATIO, MAX_DEVICE_PIXEL_RATIO);
    const lastWidth = clamp(Math.min(Math.round(width * devicePixelRatio), MAX_WIDTH), min, max);
    if (lastWidth === 0) {
      return oldSrc;
    }
    const withParam = `${WIDTH_PARAM}=${lastWidth}`;
    if (oldSrcRemoveWidth.includes("?")) {
      return `${oldSrcRemoveWidth}&${withParam}`;
    }
    return `${oldSrcRemoveWidth}?${withParam}`;
  }
  function getIntrinsicSize(el) {
    const intrinsicWidth = Number(el.getAttribute("xo-intrinsic-width")) || Number(el.getAttribute("data-intrinsic-width")) || 0;
    const intrinsicHeight = Number(el.getAttribute("xo-intrinsic-height")) || Number(el.getAttribute("data-intrinsic-height")) || 0;
    return { intrinsicWidth, intrinsicHeight };
  }
  function getFallbackWidth(el) {
    return Number(el.getAttribute("xo-fallback-width")) || Number(el.getAttribute("data-fallback-width")) || 400;
  }
  function hasWidthRange(el) {
    return el.hasAttribute("xo-width-range") || el.hasAttribute("data-width-range");
  }
  function getWidthRange(el) {
    return objectParse(el.getAttribute("xo-width-range") || el.getAttribute("data-width-range") || "[200, 1920]");
  }
  function hasIntrinsic(size) {
    return size.intrinsicWidth > 0 && size.intrinsicHeight > 0;
  }
  function getWidth(el) {
    const intrinsicSize = getIntrinsicSize(el);
    const fallbackWidth = getFallbackWidth(el);
    const compareImageEl = el.closest(WebComponent.ImageComparison);
    const xoImageEl = el.closest(".xo-image");
    const { width } = (compareImageEl || xoImageEl || el).getBoundingClientRect();
    const coverEl = el.parentElement;
    const _width = hasWidthRange(el) ? width : Math.max(width, fallbackWidth);
    if (!coverEl) {
      return _width;
    }
    if (hasIntrinsic(intrinsicSize)) {
      return Math.round(_width);
    }
    return _width;
  }
  class Lazyload extends HTMLImageElement {
    constructor() {
      super(...arguments);
      __publicField(this, "timeId", -1);
      __publicField(this, "prevSrc", "");
      __publicField(this, "removeOverlay", async () => {
        var _a2;
        const overlayEl = (_a2 = this.parentElement) == null ? void 0 : _a2.querySelector(".xo-lazyload-overlay");
        overlayEl == null ? void 0 : overlayEl.remove();
        attrBoolean.set(this, "xo-loaded", true);
        attrBoolean.set(this, "xo-loading", false);
        this.style.removeProperty("--fallback");
      });
      __publicField(this, "handleLoad", () => {
        this.removeEventListener("load", this.handleLoad);
        this.removeOverlay();
      });
      __publicField(this, "handler", () => {
        var _a2;
        attrBoolean.set(this, "xo-loading", true);
        const src = this.getAttribute("xo-src") || this.getAttribute("data-src") || this.src;
        const [min, max] = getWidthRange(this);
        const width = getWidth(this);
        const nextSrc = getSrc(src, width, min, max);
        if (src) {
          this.prevSrc = src;
          this.src = nextSrc;
          if (this.loading === "lazy") {
            this.style.setProperty("--fallback", `url('${this.prevSrc}')`);
          }
        }
        this.srcset = nextSrc;
        if (this.complete) {
          this.removeOverlay();
        }
        this.addEventListener("load", this.handleLoad);
        if ((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode) {
          this.timeId = window.setTimeout(() => {
            this.removeOverlay();
          }, 2e3);
        }
      });
      __publicField(this, "init", async (isResize = false) => {
        await delay();
        if (this.loading === "eager") {
          const image = new Image();
          image.src = this.getAttribute("xo-src") || this.getAttribute("data-src") || this.src;
          image.onload = () => {
            this.handler();
          };
          return;
        }
        if (this.loading === "auto") {
          this.loading = "lazy";
        }
        const blocking = !!this.closest(`${WebComponent.Carousel}:not([xo-overflow="visible"]) ${WebComponent.CarouselList}, ${WebComponent.Popover}, ${WebComponent.Modal}:not([xo-active]), ${WebComponent.Toggle}:not([xo-active]), ${WebComponent.TabsPane}:not([xo-active]), [xo-ignore-lazyload]`) && !isResize;
        if (blocking) {
          return;
        }
        this.handler();
      });
      __publicField(this, "handleResize", debounce(() => this.init(true), 500));
    }
    static get observedAttributes() {
      return ["xo-src", "data-src"];
    }
    load() {
      this.handler();
    }
    update() {
      this.init();
    }
    connectedCallback() {
      var _a2;
      if (((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode) || device.safari()) {
        this.init();
      } else {
        frameManager.add(() => this.init());
      }
      window.addEventListener("resize", this.handleResize, false);
    }
    disconnectedCallback() {
      this.removeEventListener("load", this.handleLoad);
      window.removeEventListener("resize", this.handleResize, false);
      clearTimeout(this.timeId);
    }
    attributeChangedCallback(_, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.init();
      }
    }
  }
  function loadImages(container) {
    const imgEls = container.querySelectorAll(`img[is="${WebComponent.Lazyload}"]:not([xo-loaded])`);
    imgEls.forEach((el) => {
      frameManager.add(() => {
        var _a2;
        (_a2 = el == null ? void 0 : el.handler) == null ? void 0 : _a2.call(el);
      });
    });
  }
  function getImageFromBackground(src) {
    const result = src.replace(/url\(["']|["']\)/g, "");
    if (result === window.location.href.replace(/\?.*/g, "") || result === "none") {
      return "";
    }
    return result;
  }
  let intersectionObserver = null;
  function handleLazyload(els) {
    function handleImage(el) {
      const oldSrc = getImageFromBackground(window.getComputedStyle(el).backgroundImage) || el.getAttribute("xo-src") || el.getAttribute("data-src") || "";
      if (oldSrc) {
        const [min, max] = getWidthRange(el);
        const src = getSrc(oldSrc, getWidth(el), min, max);
        const overlayEl = el.querySelector(".xo-lazyload-overlay");
        if (el.tagName.toLowerCase() === WebComponent.ParallaxScroll) {
          el.addEventListener("xo:parallax-scroll:init", () => {
            el.style.backgroundImage = `url('${src}')`;
            overlayEl == null ? void 0 : overlayEl.remove();
          });
        }
        el.style.backgroundImage = `url('${src}')`;
        overlayEl == null ? void 0 : overlayEl.remove();
      }
    }
    if ("IntersectionObserver" in window) {
      intersectionObserver == null ? void 0 : intersectionObserver.disconnect();
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(async (entry) => {
          await delay(window.XO_DEV ? 1e3 : 50);
          if (entry.isIntersecting) {
            const el = entry.target;
            handleImage(el);
            intersectionObserver == null ? void 0 : intersectionObserver.unobserve(el);
          }
        });
      });
      els.forEach((el) => {
        intersectionObserver == null ? void 0 : intersectionObserver.observe(el);
      });
    } else {
      els.forEach(handleImage);
    }
  }
  function init(rootEl = document) {
    const els = Array.from(rootEl.querySelectorAll(".xo-background-lazyload"));
    handleLazyload(els);
  }
  DOMLoaded(init);
  document.addEventListener("shopify:section:load", (event) => init(event.target));
  document.addEventListener("shopify:section:reorder", (event) => init(event.target));
  window.addEventListener("resize", debounce(() => init(), 500));
  const megaMenuEls = Array.from(document.querySelectorAll(WebComponent.MegaMenu));
  const initialized = /* @__PURE__ */ new Map();
  each(megaMenuEls, (megaMenuEl) => {
    const liEl = megaMenuEl.closest("li");
    if (liEl) {
      liEl.addEventListener("mouseenter", () => {
        if (!initialized.get(liEl)) {
          init();
          initialized.set(liEl, true);
        }
      });
    }
  });
  const lazyload = "";
  if (!customElements.get(WebComponent.Lazyload)) {
    if (isBot() && device.mobile()) {
      const overlayEls = Array.from(document.querySelectorAll(`.xo-lazyload-overlay`));
      each(overlayEls, (overlayEl) => {
        overlayEl.remove();
      });
    } else {
      customElements.define(WebComponent.Lazyload, Lazyload, { extends: "img" });
    }
  }
  const win = window;
  const parallaxScroll = (_c = win.XotinyPlugins) == null ? void 0 : _c.parallaxScroll;
  (_d = win.XotinyPlugins) == null ? void 0 : _d.ParallaxScroll;
  const lerp = (_e = win.XotinyPlugins) == null ? void 0 : _e.lerp;
  (_f = win.XotinyPlugins) == null ? void 0 : _f.pageSpeed;
  const desktopSmoothScroll = (_g = win.XotinyPlugins) == null ? void 0 : _g.desktopSmoothScroll;
  const styles$w = "";
  function removeColorSchemeAddedAttr(el) {
    const attr = "xo-color-scheme-added";
    const els = Array.from(el.querySelectorAll(`[${attr}]`));
    each(els, (el2) => {
      el2.removeAttribute(attr);
    });
  }
  const CONSTANT = 14;
  const DEBOUNCE_DELAY = 400;
  const _Marquee = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "index", 0);
      __publicField(this, "frameId", 0);
      __publicField(this, "cancelDelay", () => {
      });
      __publicField(this, "_options");
      __publicField(this, "imageLoaded", false);
      __publicField(this, "parallax", null);
      __publicField(this, "intersectionObserver", null);
      __publicField(this, "disconnect", () => {
      });
      __publicField(this, "debounce", createDebounce());
      __publicField(this, "setOptions", () => {
        this.options = getAttrs(this, {
          pick: ["xoSpeed", "xoDirection", "xoPauseOnHover", "xoScrollEnabled", "xoScrollSpeed", "xoAutoRun", "xoVertical"],
          types: {
            xoSpeed: "number",
            xoDirection: "string",
            xoPauseOnHover: "boolean",
            xoScrollEnabled: "boolean",
            xoAutoRun: "boolean",
            xoScrollSpeed: "number",
            xoVertical: "boolean"
          }
        });
      });
      __publicField(this, "getChildSize", () => {
        const { xoVertical } = this.options;
        const childEls = Array.from(this.children);
        if (!childEls.length) {
          return 0;
        }
        if (childEls.length === 1) {
          return xoVertical ? childEls[0].clientHeight : childEls[0].clientWidth;
        }
        return (childEls.length - 1) * (xoVertical ? childEls[0].clientHeight : childEls[0].clientWidth);
      });
      __publicField(this, "setDuration", async () => {
        const imgEls = Array.from(this.querySelectorAll("img"));
        const urls = imgEls.map((imgEl) => imgEl.src);
        await imagesLoaded(urls);
        const { xoSpeed, xoDirection, xoAutoRun, xoVertical } = this.options;
        if (xoAutoRun) {
          const firstMarqueeItemEl = this.children[0];
          const size = xoVertical ? firstMarqueeItemEl.offsetHeight : firstMarqueeItemEl.offsetWidth;
          const duration = clamp(size * CONSTANT - (xoSpeed - 1) * size, size, Infinity);
          this.style.setProperty("--xo-marquee-from", xoDirection === "rtl" || xoDirection === "btt" ? "0" : "0");
          this.style.setProperty("--xo-marquee-to", xoDirection === "rtl" || xoDirection === "btt" ? "100%" : "-100%");
          this.style.setProperty("--xo-marquee-duration", `${duration}ms`);
        }
      });
      __publicField(this, "handleVideo", this.debounce(async () => {
        const videoEls = this.querySelectorAll("video");
        each(Array.from(videoEls), (videoEl) => {
          if (videoEl.autoplay) {
            videoEl.currentTime = 0;
            videoEl.pause();
          }
        });
        await delay();
        each(Array.from(videoEls), async (videoEl) => {
          if (videoEl.autoplay) {
            videoEl.play();
          }
        });
      }, DEBOUNCE_DELAY));
      __publicField(this, "handleClone", () => {
        const { xoScrollEnabled, xoScrollSpeed, xoVertical } = this.options;
        this.frameId = requestAnimationFrame(() => {
          const childEls = Array.from(this.children);
          const size = xoVertical ? this.offsetHeight : this.offsetWidth;
          if (this.getChildSize() === 0) {
            const cloneNode = childEls[this.index].cloneNode(true);
            removeColorSchemeAddedAttr(cloneNode);
            const cloneEl = this.appendChild(cloneNode);
            attrBoolean.set(cloneEl, "xo-cloned", true);
            this.setDuration();
            cancelAnimationFrame(this.frameId);
          } else if (this.getChildSize() <= size * (xoScrollEnabled ? 2 * Math.min(xoScrollSpeed, 3) : 1)) {
            const cloneNode = childEls[this.index].cloneNode(true);
            removeColorSchemeAddedAttr(cloneNode);
            const cloneEl = this.appendChild(cloneNode);
            attrBoolean.set(cloneEl, "xo-cloned", true);
            this.handleClone();
            if (this.index === childEls.length - 1) {
              this.index = 0;
            } else {
              this.index++;
            }
            if (childEls.length >= 200) {
              this.update();
            }
          } else {
            const cloneEl = this.appendChild(childEls[this.index].cloneNode(true));
            attrBoolean.set(cloneEl, "xo-cloned", true);
            this.setDuration();
            cancelAnimationFrame(this.frameId);
          }
        });
        this.handleVideo();
      });
      __publicField(this, "removeCloned", () => {
        const childEls = Array.from(this.querySelectorAll(`${WebComponent.MarqueeItem}[xo-cloned]`));
        each(childEls, (childEl2) => {
          childEl2.remove();
        });
        const childEl = this.querySelector(WebComponent.MarqueeItem);
        if (childEl) {
          const grandChildEls = Array.from(childEl.children);
          each(grandChildEls, (grandChildEl) => {
            this.appendChild(grandChildEl);
          });
          childEl.remove();
        }
      });
      __publicField(this, "handler", async () => {
        const { xoDirection } = this.options;
        const childEls = Array.from(this.children);
        this.setAttribute("xo-direction", xoDirection);
        if (!this.imageLoaded) {
          await delay(500);
          const imgEls = Array.from(this.querySelectorAll("img"));
          const urls = imgEls.map((imgEl) => imgEl.src);
          await imagesLoaded(urls);
          this.imageLoaded = true;
          this.style.opacity = "1";
        }
        if (childEls[0].tagName.toLowerCase() !== WebComponent.MarqueeItem) {
          const itemEl = document.createElement(WebComponent.MarqueeItem);
          each(childEls, (childEl) => {
            itemEl.appendChild(childEl);
          });
          this.appendChild(itemEl);
        }
        this.handleClone();
        requestAnimationFrame(() => {
          attrBoolean.set(this, "xo-ready", true);
        });
      });
      __publicField(this, "handleParallax", () => {
        var _a2;
        const { xoScrollEnabled, xoScrollSpeed, xoDirection } = this.options;
        if (!xoScrollEnabled) {
          return;
        }
        (_a2 = this.parallax) == null ? void 0 : _a2.destroy();
        this.parallax = parallaxScroll({
          lerpEase: 1,
          setStyles: ({ element, createValue, EMPTY }) => {
            const value = createValue("marqueeScroll");
            if (value !== EMPTY) {
              element.style.setProperty("--xo-marquee-scroll", `${Number(value) * xoScrollSpeed}px`);
            }
          }
        });
        const marqueeScrollTransformEl = this.closest(WebComponent.MarqueeScrollTransform);
        const from = () => {
          if (marqueeScrollTransformEl) {
            return offset(marqueeScrollTransformEl).top - window.innerHeight;
          }
          return offset(this).top - window.innerHeight;
        };
        const to = () => {
          if (marqueeScrollTransformEl) {
            return offset(marqueeScrollTransformEl).top + this.getBoundingClientRect().height;
          }
          return offset(this).top + this.getBoundingClientRect().height;
        };
        this.parallax.add(this, {
          from,
          to,
          keyframes: {
            "0%": {
              marqueeScroll: 0
            },
            "100%": {
              marqueeScroll: window.innerHeight * (xoDirection === "rtl" || xoDirection === "btt" ? 1 : -1)
            }
          }
        }).run();
      });
      __publicField(this, "destroy", () => {
        var _a2, _b2;
        (_a2 = this.parallax) == null ? void 0 : _a2.destroy();
        this.cancelDelay();
        cancelAnimationFrame(this.frameId);
        this.index = 0;
        (_b2 = this.intersectionObserver) == null ? void 0 : _b2.disconnect();
        document.removeEventListener("visibilitychange", this.handleVisibilityChange);
      });
      __publicField(this, "update", async () => {
        this.destroy();
        this.setOptions();
        this.removeCloned();
        await this.handler();
        this.handleParallax();
      });
      __publicField(this, "handlePause", () => {
        attrBoolean.set(this, "xo-paused", true);
      });
      __publicField(this, "handlePlay", () => {
        attrBoolean.set(this, "xo-paused", false);
      });
      __publicField(this, "handleVisibilityChange", () => {
        if (document.visibilityState === "visible") {
          this.handlePlay();
        } else {
          this.handlePause();
        }
      });
      __publicField(this, "sectionListenerForBuilder", () => {
        this.disconnect = sectionXoBuiderObserver(this, () => {
          this.update();
        });
      });
    }
    get options() {
      return {
        ..._Marquee.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    async onConnected() {
      var _a2;
      if ((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode) {
        await delay(100);
      }
      if (!this.querySelector("img")) {
        this.style.opacity = "1";
      }
      this.setOptions();
      this.removeCloned();
      await this.handler();
      this.handleParallax();
      this.sectionListenerForBuilder();
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.handlePlay();
          } else {
            this.handlePause();
          }
        });
      });
      this.intersectionObserver.observe(this);
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue != null && oldValue !== newValue && this.imageLoaded) {
        this.cancelDelay();
        this.cancelDelay = await delay(200);
        this.update();
      }
    }
    disconnectedCallback() {
      this.destroy();
      this.disconnect();
      this.debounce.cancel();
    }
  };
  let Marquee = _Marquee;
  __publicField(Marquee, "defaultOptions", {
    xoSpeed: 6,
    xoDirection: document.dir,
    xoPauseOnHover: false,
    xoAutoRun: true,
    xoScrollEnabled: false,
    xoScrollSpeed: 1,
    xoVertical: false
  });
  __publicField(Marquee, "observeOnMount", true);
  function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(metadataKey, metadataValue);
  }
  typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };
  const DEBOUNCE_TIME = 400;
  let SvgMarquee = (_h = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "state", {
        defaultText: "",
        duration: 0,
        ratio: 0,
        textPathData: []
      });
      __publicField(this, "resizeObserver", null);
      __publicField(this, "prevWidth", 0);
      __publicField(this, "pathId", `svg-path-${Math.random().toString(36).substring(2, 15)}`);
      __publicField(this, "debounce", createDebounce());
      __publicField(this, "getRepetitions", () => {
        const svgEl = this.querySelector("svg");
        const textEl = this.querySelector("text");
        const textWidth = textEl.getBBox().width;
        const svgWidth = svgEl.getBBox().width;
        const repetitions = Math.ceil(svgWidth / textWidth) + 1;
        return repetitions;
      });
      __publicField(this, "getDuration", (textWidth) => {
        const { xoSpeed } = this.props;
        const duration = clamp(textWidth * 14 - (xoSpeed - 1) * textWidth, textWidth, Infinity);
        return duration;
      });
      __publicField(this, "setSvgSize", () => {
        const pathEl = this.querySelector("path");
        const textEl = this.querySelector("text");
        const svgEl = this.querySelector("svg");
        const sizerEl = this.querySelector(`text.${WebComponent.SvgMarquee}-sizer`);
        const pathBox = pathEl.getBBox();
        const sizerBox = sizerEl.getBBox();
        const containerWidth = this.getBoundingClientRect().width;
        const height = pathBox.height + sizerBox.height + sizerBox.height / 3;
        const finalWidth = Math.min(pathBox.width, containerWidth);
        svgEl.setAttribute("viewBox", `0 0 ${finalWidth} ${height}`);
        textEl.style.transform = `translateY(${sizerBox.height / 3}px)`;
        sizerEl.remove();
      });
      __publicField(this, "setTextPathData", () => {
        const { xoRtl } = this.props;
        const { ratio } = this.state;
        const repetitions = this.getRepetitions();
        this.setState({
          textPathData: range(0, repetitions).map((_, index) => {
            let from = 0;
            let to = 0;
            if (xoRtl) {
              from = 100 - ratio * (index + 1);
              to = 100 - ratio * index;
            } else {
              from = ratio * index;
              to = ratio * (index - 1);
            }
            return {
              from,
              to
            };
          })
        });
      });
      __publicField(this, "getTextPathWidth", (textPath) => {
        const textNode = textPath.parentNode;
        let minX = Infinity;
        let maxX = -Infinity;
        for (let i = 0; i < textNode.getNumberOfChars(); i++) {
          const box = textNode.getExtentOfChar(i);
          minX = Math.min(minX, box.x);
          maxX = Math.max(maxX, box.x + box.width);
        }
        return maxX - minX;
      });
      __publicField(this, "setRatio", () => {
        const pathEl = this.querySelector("path");
        const textPathEl = this.querySelector("textPath");
        const parts = Math.round(textPathEl.getComputedTextLength() / pathEl.getBBox().width + 0.5);
        const ratioEl = this.querySelector(`text.${WebComponent.SvgMarquee}-ratio`);
        if (parts > 1) {
          ratioEl.innerHTML = range(0, parts).map((part) => {
            const start = Math.floor(this.state.defaultText.length / parts * part);
            const end = Math.floor(this.state.defaultText.length / parts * (part + 1));
            return `
            <textPath href="#${this.pathId}">
              ${this.state.defaultText.slice(start, end)}
            </textPath>
          `;
          }).join("");
        } else {
          ratioEl.innerHTML = `<textPath href="#${this.pathId}">${this.state.defaultText}</textPath>`;
        }
        const ratioTextPathEls = Array.from(ratioEl.querySelectorAll("textPath"));
        const textWidth = ratioTextPathEls.reduce((total, textPathEl2) => total + this.getTextPathWidth(textPathEl2), 0);
        const pathWidth = pathEl.getBBox().width;
        const ratio = textWidth / pathWidth * 100;
        this.setState({ ratio, duration: this.getDuration(textWidth) });
      });
      __publicField(this, "updateUI", () => {
        const { textPathData, duration } = this.state;
        const textPathEl = this.querySelector("textPath");
        each(textPathData, (item, index) => {
          var _a2;
          if (index > 0) {
            const textPathElCloned = textPathEl.cloneNode(true);
            (_a2 = this.querySelector("text")) == null ? void 0 : _a2.appendChild(textPathElCloned);
          }
          const animateEl = this.querySelectorAll("animate")[index];
          if (animateEl) {
            animateEl.setAttribute("from", `${item.from}%`);
            animateEl.setAttribute("to", `${item.to}%`);
            animateEl.setAttribute("dur", `${duration}ms`);
          }
        });
      });
      __publicField(this, "handleResize", this.debounce((entries) => {
        for (let entry of entries) {
          const currentWidth = entry.contentRect.width;
          if (currentWidth !== this.prevWidth) {
            this.innerHTML = this.render(this.state.defaultText);
            this.setRatio();
            this.setSvgSize();
            this.setTextPathData();
            this.prevWidth = currentWidth;
          }
        }
      }, DEBOUNCE_TIME));
      __publicField(this, "handlePause", () => {
        const svgEl = this.querySelector("svg");
        svgEl.pauseAnimations();
      });
      __publicField(this, "handlePlay", () => {
        const svgEl = this.querySelector("svg");
        svgEl == null ? void 0 : svgEl.unpauseAnimations();
      });
      __publicField(this, "visibilityChange", () => {
        if (document.visibilityState === "visible") {
          this.handlePlay();
        } else {
          this.handlePause();
        }
      });
    }
    render(text) {
      const { xoPath } = this.props;
      return `
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="100%" style="vertical-align: top;">
        <path id="${this.pathId}" fill="none" d="${xoPath}"></path>
        <text dominant-baseline="hanging">
          <textPath href="#${this.pathId}">
            <animate attributeName="startOffset" from="0" to="0" dur="0" repeatCount="indefinite" calcMode="linear" />
            ${text}
          </textPath>
        </text>
        <text class="${WebComponent.SvgMarquee}-ratio" style="opacity: 0">A</text>
        <text class="${WebComponent.SvgMarquee}-sizer" style="opacity: 0">A</text>
      </svg>
    `;
    }
    mount() {
      const defaultText = this.innerText.trim();
      this.setState({ defaultText });
      this.innerHTML = this.render(defaultText);
      this.setRatio();
      this.setSvgSize();
      this.setTextPathData();
      if (!this.resizeObserver) {
        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(this);
      }
      if (this.props.xoPauseOnHover) {
        this.addEventListener("mouseenter", this.handlePause);
        this.addEventListener("mouseleave", this.handlePlay);
      }
    }
    stateUpdate() {
      this.updateUI();
    }
    unmount() {
      var _a2;
      (_a2 = this.resizeObserver) == null ? void 0 : _a2.disconnect();
      this.resizeObserver = null;
      this.prevWidth = 0;
      this.removeEventListener("mouseenter", this.handlePause);
      this.removeEventListener("mouseleave", this.handlePlay);
      this.debounce.cancel();
    }
  }, __publicField(_h, "propTypes", {
    xoPath: "string",
    xoSpeed: "number",
    xoRtl: "boolean",
    xoPauseOnHover: "boolean"
  }), __publicField(_h, "defaultProps", {
    xoPath: "M0 109.753C222.233 105.798 231.626 0 469.504 0C715.916 0 721.456 110 961.467 110C1201.12 110 1205.66 3.21348 1432.51 0C1659.37 3.21348 1661.59 110 1908 110",
    xoSpeed: 10,
    xoRtl: document.dir === "rtl",
    xoPauseOnHover: false
  }), __publicField(_h, "observeOnMount", true), _h);
  SvgMarquee = __decorate([
    customElements$1(WebComponent.SvgMarquee)
  ], SvgMarquee);
  componentDefine({
    [WebComponent.Marquee]: Marquee
  });
  const none = (el, { value }) => {
    el.style.visibility = value === 0 ? "hidden" : "visible";
  };
  const zoom = (useOpacity = false) => {
    const animate2 = (el, { value, isOpen, usePan = false, easing }) => {
      if (usePan) {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
      } else {
        const inputRange = isOpen ? [0, 1] : [1, 0];
        const scale = interpolate({
          value,
          inputRange,
          easing,
          outputRange: isOpen ? [0.5, 1] : [1, 0.5]
        });
        if (useOpacity) {
          const opacity = interpolate({
            value,
            inputRange,
            easing: easings.ease,
            outputRange: isOpen ? [0, 1] : [1, 0]
          });
          el.style.opacity = `${opacity}`;
        }
        el.style.transform = `scale(${scale})`;
        el.style.visibility = value === 0 ? "hidden" : "visible";
      }
    };
    return animate2;
  };
  const move = ({ dx = 0, dy = 0, opacity = 0 } = {}) => {
    const animate2 = (el, { value, isOpen, usePan = false, easing }) => {
      if (usePan) {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
      } else {
        const inputRange = isOpen ? [0, 1] : [1, 0];
        const _opacity = interpolate({
          value,
          inputRange,
          easing: easings.ease,
          outputRange: isOpen ? [opacity, 1] : [1, opacity]
        });
        const getTranslate = (outputValue) => interpolate({
          value,
          inputRange,
          easing,
          outputRange: isOpen ? [outputValue, 0] : [0, outputValue]
        });
        el.style.transform = `translate3d(${getTranslate(typeof dx === "function" ? dx(el) : dx)}px, ${getTranslate(typeof dy === "function" ? dy(el) : dy)}px, 0)`;
        el.style.opacity = `${_opacity}`;
        el.style.visibility = value === 0 ? "hidden" : "visible";
      }
    };
    return animate2;
  };
  const animate$1 = {
    none,
    zoom,
    move
  };
  const xoStore = new XOStore({
    logger: false,
    loggerCollapsed: true,
    storagePrefix: ((_i = window.Shopify) == null ? void 0 : _i.shop) ? `@xo/${hash(window.Shopify.shop)}` : ""
  });
  window.xoStore = xoStore;
  class ToggleBaseMethods {
    constructor(stateName) {
      __publicField(this, "stateName");
      __publicField(this, "getTriggerElement", (name, triggerElement) => {
        return triggerElement != null ? triggerElement : document.querySelector(`${WebComponent.PopoverTrigger}[xo-name="${name}"]`);
      });
      __publicField(this, "toggle", (name, triggerElement) => {
        const finalTriggerElement = this.getTriggerElement(name, triggerElement);
        xoStore.set(this.stateName, (state) => {
          var _a2;
          return {
            ...state,
            trigger: {
              ...state.trigger,
              [this.stateName]: name
            },
            data: {
              ...state.data,
              [name]: {
                ...state.data[name],
                isOpen: !((_a2 = state.data[name]) == null ? void 0 : _a2.isOpen),
                ...finalTriggerElement != null ? {
                  triggerElement: finalTriggerElement
                } : {}
              }
            }
          };
        })(`${this.stateName}/toggle`);
      });
      __publicField(this, "open", (name, triggerElement) => {
        const finalTriggerElement = this.getTriggerElement(name, triggerElement);
        xoStore.set(this.stateName, (state) => {
          return {
            ...state,
            trigger: {
              ...state.trigger,
              [this.stateName]: name
            },
            data: {
              ...state.data,
              [name]: {
                ...state.data[name],
                isOpen: true,
                ...finalTriggerElement != null ? {
                  triggerElement: finalTriggerElement
                } : {}
              }
            }
          };
        })(`${this.stateName}/open`);
      });
      __publicField(this, "close", (name, triggerElement) => {
        const finalTriggerElement = triggerElement === "empty" ? triggerElement : this.getTriggerElement(name, triggerElement);
        xoStore.set(this.stateName, (state) => {
          return {
            ...state,
            trigger: {
              ...state.trigger,
              [this.stateName]: name
            },
            data: {
              ...state.data,
              [name]: {
                ...state.data[name],
                isOpen: false,
                ...finalTriggerElement != null ? {
                  triggerElement: finalTriggerElement === "empty" ? null : finalTriggerElement
                } : {}
              }
            }
          };
        })(`${this.stateName}/close`);
      });
      __publicField(this, "on", (eventType, name, callback) => {
        return xoStore.subscribe(this.stateName, ({ data }) => {
          if (data[name] != null) {
            if (eventType === "open" && data[name].isOpen) {
              callback();
            } else if (eventType === "close" && !data[name].isOpen) {
              callback();
            }
          }
        });
      });
      this.stateName = stateName;
    }
  }
  const A11Y_SELECTOR = `summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden], [type=radio]):enabled, input[type=radio]:checked, select:enabled, textarea:enabled, object, iframe, [role="button"]`;
  let a11yElsMap = /* @__PURE__ */ new WeakMap();
  const tabIndexs = /* @__PURE__ */ new WeakMap();
  function toggleA11y(el, disabled) {
    const a11yEls = Array.from(el.querySelectorAll(A11Y_SELECTOR));
    if (!a11yElsMap.has(el)) {
      a11yElsMap.set(el, a11yEls);
    }
    each(a11yElsMap.get(el), (el2) => {
      if (!tabIndexs.has(el2)) {
        tabIndexs.set(el2, el2.getAttribute("tabindex") || "0");
      }
      if (disabled) {
        el2.setAttribute("tabindex", "-1");
      } else if (tabIndexs.has(el2)) {
        el2.setAttribute("tabindex", tabIndexs.get(el2));
      }
    });
  }
  function bindingHelper(el, attr, value) {
    const binding = el.getAttribute(attr);
    const bindings = binding ? binding.split(",") : [];
    each(bindings, (item) => {
      if (!/\[|\]/g.test(item)) {
        return;
      }
      const selector = item.replace(/\[.*/g, "").trim();
      const attrBinding = item.replace(/.*\[|\]/g, "").trim();
      const els = selector ? Array.from(el.querySelectorAll(selector)) : [el];
      each(els, (el2) => {
        if (typeof value === "string") {
          el2.setAttribute(attrBinding, value);
        } else if (typeof value === "boolean") {
          attrBoolean.set(el2, attrBinding, value);
        } else if (typeof value === "number") {
          el2.setAttribute(attrBinding, value.toString());
        }
      });
    });
  }
  function escapeValue(value) {
    return value.replace(/("|')/g, "\\$1");
  }
  function getParent(element) {
    let parent = element.parentElement;
    while (parent) {
      const { position, transform } = window.getComputedStyle(parent);
      if (position !== "static" || transform !== "none") {
        return parent;
      }
      parent = parent.parentElement;
    }
    return document.body;
  }
  function setEffectLevel(el, level) {
    const effectAttr = "xo-effect-level";
    const effectEls = el.querySelectorAll("[xo-effect]");
    effectEls.forEach((el2) => {
      el2.setAttribute(effectAttr, `${level}`);
    });
  }
  function setHoverLevel(wrapper = document) {
    const levelAttr = "xo-hover-level";
    const selector = "[xo-hover]";
    if (!(wrapper == null ? void 0 : wrapper.querySelector(selector))) {
      return;
    }
    const allHoverEls = wrapper.querySelectorAll(`${selector}:not([${levelAttr}])`);
    allHoverEls.forEach((hoverEl) => {
      var _a2;
      const parentHover = (_a2 = hoverEl.parentElement) == null ? void 0 : _a2.closest(selector);
      if (!parentHover) {
        hoverEl.setAttribute(levelAttr, "1");
        setEffectLevel(hoverEl, 1);
      } else {
        const parentLevel = parseInt(parentHover.getAttribute(levelAttr) || "1", 10);
        const currentLevel = parentLevel + 1;
        if (currentLevel <= 3) {
          hoverEl.setAttribute(levelAttr, currentLevel.toString());
          setEffectLevel(hoverEl, currentLevel);
        }
      }
    });
  }
  function checkAttr(componentName, attrName, attrValue) {
    if (!attrValue) {
      throwError(`${componentName} must have a \`${attrName}\` attribute.`, `
<${componentName} ${attrName}="..."></${componentName}>
    `);
    }
  }
  function reduceMotion() {
    const shouldReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || navigator.deviceMemory && navigator.deviceMemory <= (isMobile.iOS ? 1 : 4) || navigator.connection && ["slow-2g", "2g", "3g"].includes(navigator.connection.effectiveType);
    return shouldReduce;
  }
  function hasParentNone(element) {
    const { display, visibility } = window.getComputedStyle(element);
    if (display == "none" || visibility == "hidden") {
      return true;
    }
    let parent = element.parentElement;
    while (parent) {
      const { display: display2, visibility: visibility2 } = window.getComputedStyle(parent);
      if (display2 == "none" || visibility2 == "hidden") {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }
  const css$2 = createCssInJs();
  let focusA11yEl = null;
  let prevFocusA11yEl = null;
  let triggerA11yEl = null;
  class ToggleBase extends XoHTMLElement {
    constructor() {
      super();
      __publicField(this, "unsubscribe", null);
      __publicField(this, "sectionEl", null);
      __publicField(this, "initialized", false);
      __publicField(this, "prevIsOpen", false);
      __publicField(this, "allA11yEls", []);
      __publicField(this, "a11yEls", []);
      __publicField(this, "a11yNestedEls", []);
      __publicField(this, "firstA11yEl", null);
      __publicField(this, "lastA11yEl", null);
      __publicField(this, "firstA11yIndex", null);
      __publicField(this, "lastA11yIndex", null);
      __publicField(this, "index", null);
      __publicField(this, "listener", async () => {
        const { isOpen } = this.state;
        if (this.initialized && isOpen !== this.prevIsOpen) {
          if (isOpen) {
            this.componentOpen();
            this.handleAutoFocus();
            await delay();
            attrBoolean.set(this, "xo-active", true);
            bindingHelper(this, "xo-active-binding", true);
            document.addEventListener("keydown", this.handleA11y);
            triggerA11yEl = focusA11yEl != null ? focusA11yEl : prevFocusA11yEl;
            loadImages(this);
          } else {
            attrBoolean.set(this, "xo-active", false);
            bindingHelper(this, "xo-active-binding", false);
            if (triggerA11yEl != null) {
              triggerA11yEl.focus();
              triggerA11yEl = null;
              focusA11yEl = null;
            }
            this.componentClose();
            document.removeEventListener("keydown", this.handleA11y);
          }
          this.prevIsOpen = isOpen;
        }
        if (this.initialized) {
          this.subscribe();
        }
      });
      __publicField(this, "setState", (state) => {
        return xoStore.set(this.stateName, (prevState) => {
          const _prevState = prevState;
          return {
            ...prevState,
            data: {
              ..._prevState.data,
              ...typeof state === "function" ? state(_prevState.data) : state
            }
          };
        });
      });
      __publicField(this, "setCssVariables", (breakpoint, options) => {
        const { xoName } = this.options;
        checkAttr(this.componentName, "xo-name", xoName);
        let value = "";
        const opts = options || this.options;
        for (const key in opts) {
          const val = opts[key];
          if (val != null && typeof val !== "object") {
            let newKey = namingConvention.camelToKebab(key);
            newKey = newKey.includes("xo-") ? newKey : `xo-${newKey}`;
            const important = breakpoint != null ? " !important" : "";
            value += `--${newKey}: ${val}${important};`;
          }
        }
        const { cssText } = css$2`
      ${this.componentName}[xo-name="${xoName}"] {
        ${value}
      }
    `;
        if (breakpoint == null) {
          appendStyle(cssText, document.head);
        } else {
          appendStyle(`@media (max-width: ${breakpoint}px) { ${cssText} }`, document.head);
        }
      });
      __publicField(this, "handleA11y", (event) => {
        var _a2;
        const { xoEscCloseDisabled } = this.options;
        const { isOpen } = this.state;
        this.allA11yEls = Array.from(document.querySelectorAll(A11Y_SELECTOR));
        this.a11yEls = Array.from(this.querySelectorAll(A11Y_SELECTOR));
        const modalEls = Array.from(this.querySelectorAll(WebComponent.Modal));
        const toggleEls = Array.from(this.querySelectorAll(WebComponent.Toggle));
        const popoverEls = Array.from(this.querySelectorAll(WebComponent.Popover));
        this.a11yNestedEls = [
          ...modalEls,
          ...toggleEls,
          ...popoverEls,
          ...Array.from(this.querySelectorAll(`${WebComponent.Modal}, ${WebComponent.Toggle}, ${WebComponent.Popover}`)).flatMap((el) => Array.from(el.querySelectorAll(A11Y_SELECTOR)))
        ];
        this.a11yEls = this.a11yEls.filter((el) => {
          var _a3;
          return !((_a3 = this.a11yNestedEls) == null ? void 0 : _a3.includes(el)) && !hasParentNone(el) && el.getAttribute("tabindex") !== "-1";
        });
        this.allA11yEls = this.allA11yEls.filter((el) => {
          var _a3;
          return !((_a3 = this.a11yNestedEls) == null ? void 0 : _a3.includes(el)) && !hasParentNone(el) && el.getAttribute("tabindex") !== "-1";
        });
        const isShift = event.shiftKey;
        const isTab = event.key === "Tab" && this.getAttribute("xo-focus-trap") !== "false";
        const isEscape = event.key === "Escape" && isOpen && !xoEscCloseDisabled;
        if (isEscape) {
          let { xoName } = this.options;
          if (this.componentName === WebComponent.Modal) {
            const modalEl = event.target.closest(WebComponent.Modal);
            if (modalEl && modalEl.getAttribute("xo-name")) {
              xoName = modalEl.getAttribute("xo-name");
            }
          }
          checkAttr(this.componentName, "xo-name", xoName);
          const toggleBaseMethods = new ToggleBaseMethods(this.stateName);
          toggleBaseMethods.close(xoName);
        }
        if (!this.a11yEls.length) {
          return;
        }
        this.firstA11yEl = this.a11yEls[0];
        this.lastA11yEl = this.a11yEls[this.a11yEls.length - 1];
        this.firstA11yIndex = this.allA11yEls.indexOf(this.firstA11yEl);
        this.lastA11yIndex = this.allA11yEls.indexOf(this.lastA11yEl);
        if (isTab) {
          event.preventDefault();
          const el = event.target;
          const target = el.shadowRoot && typeof event.composedPath === "function" ? event.composedPath()[0] : el;
          const index = this.allA11yEls.indexOf(target);
          if (index >= 0) {
            this.index = index;
          } else {
            this.index = this.index - 1;
          }
          if (isShift) {
            this.index--;
            if (this.index < this.firstA11yIndex) {
              this.index = this.lastA11yIndex;
            }
          } else {
            this.index++;
            if (this.index > this.lastA11yIndex) {
              this.index = this.firstA11yIndex;
            }
          }
          (_a2 = this.allA11yEls[this.index]) == null ? void 0 : _a2.focus();
        }
      });
      __publicField(this, "handleAutoFocus", async () => {
        var _a2;
        if (((_a2 = this.parentElement) == null ? void 0 : _a2.tagName.toLowerCase()) === WebComponent.GalleryPortal) {
          return;
        }
        const { xoAutofocus = false } = this.options;
        const isModal = this.componentName === WebComponent.Modal || this.componentName === WebComponent.Popover;
        if (isModal) {
          const duration = Number(this.getAttribute("xo-duration")) || 300;
          await delay(duration);
        }
        this.focus();
        if (xoAutofocus) {
          const inputEl = this.querySelector('input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="tel"], input[type="url"], input[type="search"], textarea');
          inputEl == null ? void 0 : inputEl.focus();
        }
      });
      __publicField(this, "handleShopifySectionSelect", () => {
        const { xoName } = this.options;
        const toggleBaseMethods = new ToggleBaseMethods(this.stateName);
        toggleBaseMethods.open(xoName);
      });
      __publicField(this, "handleShopifySectionDeselect", () => {
        const { xoName } = this.options;
        const toggleBaseMethods = new ToggleBaseMethods(this.stateName);
        toggleBaseMethods.close(xoName);
      });
      __publicField(this, "handleDesignMode", () => {
        var _a2, _b2, _c2;
        if (((_a2 = window.Shopify) == null ? void 0 : _a2.designMode) && !!attrBoolean.get(this, "xo-section-select")) {
          (_b2 = this.sectionEl) == null ? void 0 : _b2.addEventListener("shopify:section:select", this.handleShopifySectionSelect);
          (_c2 = this.sectionEl) == null ? void 0 : _c2.addEventListener("shopify:section:deselect", this.handleShopifySectionDeselect);
        }
      });
      __publicField(this, "handleFocusIn", (event) => {
        focusA11yEl = event.target.closest(A11Y_SELECTOR);
        prevFocusA11yEl = event.target.closest(A11Y_SELECTOR);
      });
      __publicField(this, "componentOpen", () => {
      });
      __publicField(this, "componentClose", () => {
      });
      __publicField(this, "componentMount", () => {
      });
      __publicField(this, "componentUnmount", () => {
      });
      __publicField(this, "subscribe", () => {
      });
      __publicField(this, "componentBeforeMount", () => {
      });
      this.sectionEl = this.closest(".shopify-section");
    }
    get options() {
      const options = getAttrs(this, {
        pick: ["xoName", "xoAutofocus", "xoSectionSelect", "xoEscCloseDisabled"],
        types: {
          xoName: "string",
          xoAutofocus: "boolean",
          xoSectionSelect: "boolean",
          xoEscCloseDisabled: "boolean"
        }
      });
      return options;
    }
    get state() {
      var _a2;
      const { xoName } = this.options;
      checkAttr(this.componentName, "xo-name", xoName);
      const stateObj = xoStore.get(this.stateName);
      const state = (_a2 = stateObj == null ? void 0 : stateObj.data) == null ? void 0 : _a2[xoName];
      if (typeof state !== "object" && state.isOpen == null) {
        return {};
      }
      return state;
    }
    onConnected() {
      var _a2;
      this.componentBeforeMount();
      const { xoName } = this.options;
      checkAttr(this.componentName, "xo-name", xoName);
      attrBoolean.set(this, "xo-content", true);
      if (this.getAttribute("tabindex") == null && ((_a2 = this.parentElement) == null ? void 0 : _a2.tagName.toLowerCase()) !== WebComponent.GalleryPortal) {
        this.tabIndex = 0;
      }
      document.addEventListener("focusin", this.handleFocusIn);
      xoStore.set(this.stateName, (prevState) => {
        const _prevState = prevState;
        return {
          ..._prevState,
          data: {
            ..._prevState.data,
            [xoName]: {
              ...{ isOpen: false },
              ..._prevState.data[xoName]
            }
          }
        };
      })(`${this.stateName}/mount`);
      this.unsubscribe = xoStore.subscribe(this.stateName, this.listener, (_, nextState) => {
        return xoName !== nextState.trigger[this.stateName];
      });
      (async () => {
        await delay(0);
        this.componentMount();
        this.handleDesignMode();
        this.initialized = true;
      })();
    }
    disconnectedCallback() {
      var _a2, _b2, _c2;
      (_a2 = this.unsubscribe) == null ? void 0 : _a2.call(this);
      this.componentUnmount();
      document.removeEventListener("keydown", this.handleA11y);
      document.removeEventListener("focusin", this.handleFocusIn);
      (_b2 = this.sectionEl) == null ? void 0 : _b2.removeEventListener("shopify:section:select", this.handleShopifySectionSelect);
      (_c2 = this.sectionEl) == null ? void 0 : _c2.removeEventListener("shopify:section:deselect", this.handleShopifySectionDeselect);
    }
  }
  class ToggleTriggerBase extends HTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", null);
      __publicField(this, "initialized", false);
      __publicField(this, "prevIsOpen", false);
      __publicField(this, "contentTarget", false);
      __publicField(this, "bindClick", () => {
        this.addEventListener("click", this.handleTrigger);
      });
      __publicField(this, "bindHover", () => {
        const { xoName } = this.options;
        const toggleEl = document.querySelector(`[xo-content][xo-name="${xoName}"]`);
        this.addEventListener("mouseenter", this.handleMouseEnter);
        this.addEventListener("mouseleave", this.handleMouseLeave);
        if (toggleEl) {
          toggleEl.addEventListener("mouseenter", this.handleMouseEnter);
          toggleEl.addEventListener("mouseleave", this.handleMouseLeave);
        }
      });
      __publicField(this, "handleMouseEnter", (event) => {
        if (!this.contains(event.target)) {
          this.contentTarget = !!event.target;
        }
        if (!this.state.isOpen) {
          this.handleToggle("open");
        }
      });
      __publicField(this, "handleMouseLeave", async () => {
        if (this.state.isOpen) {
          await delay(200);
          if (!this.contentTarget) {
            this.handleToggle("close");
          }
          this.contentTarget = false;
        }
      });
      __publicField(this, "handleTrigger", async () => {
        await delay();
        this.handleToggle(this.actionType);
      });
      __publicField(this, "handleToggle", (type) => {
        const { xoName } = this.options;
        checkAttr(this.componentName, "xo-name", xoName);
        const toggleBaseMethods = new ToggleBaseMethods(this.stateName);
        if (type !== "none") {
          toggleBaseMethods[type](xoName);
        }
        this.componentTrigger();
      });
      __publicField(this, "listener", () => {
        const { isOpen } = this.state;
        if (this.initialized && isOpen !== this.prevIsOpen) {
          if (isOpen) {
            attrBoolean.set(this, "xo-active", true);
            this.componentOpen();
          } else {
            attrBoolean.set(this, "xo-active", false);
            this.componentClose();
          }
          this.prevIsOpen = isOpen;
        }
      });
      __publicField(this, "setState", (state) => {
        return xoStore.set(this.stateName, (prevState) => {
          const _prevState = prevState;
          return {
            ...prevState,
            data: {
              ..._prevState.data,
              ...typeof state === "function" ? state(_prevState.data) : state
            }
          };
        });
      });
      __publicField(this, "componentOpen", () => {
      });
      __publicField(this, "componentClose", () => {
      });
      __publicField(this, "componentMount", () => {
      });
      __publicField(this, "componentUnmount", () => {
      });
      __publicField(this, "componentTrigger", () => {
      });
      __publicField(this, "componentBeforeMount", () => {
      });
    }
    async connectedCallback() {
      this.componentBeforeMount();
      const { xoName } = this.options;
      checkAttr(this.componentName, "xo-name", xoName);
      if (this.eventType === "click") {
        this.bindClick();
      } else if (this.eventType === "hover") {
        if (device.mobile()) {
          this.bindClick();
        } else {
          this.bindHover();
        }
      }
      this.unsubscribe = xoStore.subscribe(this.stateName, this.listener, (_, nextState) => {
        return xoName !== nextState.trigger[this.stateName];
      });
      await delay(0);
      this.componentMount();
      this.initialized = true;
    }
    disconnectedCallback() {
      var _a2;
      this.removeEventListener("click", this.handleTrigger);
      if (!device.mobile()) {
        this.removeEventListener("mouseenter", this.handleMouseEnter);
        this.removeEventListener("mouseleave", this.handleMouseLeave);
      }
      (_a2 = this.unsubscribe) == null ? void 0 : _a2.call(this);
      this.componentUnmount();
    }
    get actionType() {
      return "toggle";
    }
    get eventType() {
      return "click";
    }
    get state() {
      var _a2;
      const { xoName } = this.options;
      checkAttr(this.componentName, "xo-name", xoName);
      const stateObj = xoStore.get(this.stateName);
      const state = (_a2 = stateObj == null ? void 0 : stateObj.data) == null ? void 0 : _a2[xoName];
      if (typeof state !== "object" && (state == null ? void 0 : state.isOpen) == null) {
        return {};
      }
      return state;
    }
    get options() {
      const options = getAttrs(this, {
        pick: ["xoName"],
        types: {
          xoName: "string"
        }
      });
      const parentEl = this.closest("[xo-name]");
      if (parentEl) {
        const options2 = getAttrs(parentEl, {
          pick: ["xoName"],
          types: {
            xoName: "string"
          }
        });
        return {
          ...options2,
          ...options
        };
      }
      return options;
    }
  }
  window.xoAnimate = animate$1;
  const xoToggle$1 = new ToggleBaseMethods("xo-toggle");
  const _Toggle = class extends ToggleBase {
    constructor() {
      super(...arguments);
      __publicField(this, "_options");
      __publicField(this, "parentEl", null);
      __publicField(this, "setOptions", () => {
        var _a2;
        const options = getAttrs(this, {
          pick: ["xoName", "xoAutofocus", "xoOutsideClickEnabled", "xoSectionSelect", "xoPortal", "xoParentSelector", "xoBreakpoints"],
          types: {
            xoName: "string",
            xoAutofocus: "boolean",
            xoOutsideClickEnabled: "boolean",
            xoSectionSelect: "boolean",
            xoPortal: "boolean",
            xoParentSelector: "string",
            xoBreakpoints: "object"
          }
        });
        const breakpointOpts = getBreakpointsOptions((_a2 = options.xoBreakpoints) != null ? _a2 : {});
        this.options = {
          ...options,
          xoPortal: (breakpointOpts == null ? void 0 : breakpointOpts.portal) != null ? breakpointOpts.portal : options.xoPortal
        };
      });
      __publicField(this, "handleOutsideClick", (event) => {
        const { xoName, xoOutsideClickEnabled } = this.options;
        const { isOpen } = this.state;
        const target = event.target;
        const triggerElement = document.querySelector(`${WebComponent.ToggleTrigger}[xo-name="${xoName}"]`);
        if (isOpen && xoOutsideClickEnabled && !this.contains(target) && !(triggerElement == null ? void 0 : triggerElement.contains(target))) {
          if (xoName) {
            xoToggle$1.close(xoName);
          }
        }
      });
      __publicField(this, "handleTopSelector", async () => {
        const { xoPortal } = this.options;
        if (!xoPortal) {
          return;
        }
        if (this.parentEl) {
          const { width, height, top } = this.parentEl.getBoundingClientRect();
          const { left } = offset(this.parentEl);
          this.style.setProperty("--xo-top", `${top}px`);
          this.style.setProperty("--xo-left", `${left}px`);
          this.style.setProperty("--xo-width", `${width}px`);
          this.style.setProperty("--xo-height", `${height}px`);
          await delay(500);
          this.handleTopSelector();
        }
      });
      __publicField(this, "handleScroll", () => {
        this.handleTopSelector();
      });
      __publicField(this, "handleResize", debounce(resizeAxis("x", () => {
        this.setOptions();
        this.init();
      }), 500));
      __publicField(this, "componentBeforeMount", () => {
        this.setOptions();
      });
      __publicField(this, "componentOpen", async () => {
        await delay();
        const { xoParentSelector } = this.options;
        if (xoParentSelector) {
          this.parentEl = document.querySelector(xoParentSelector);
        }
        this.handleTopSelector();
      });
      __publicField(this, "init", () => {
        const { xoPortal, xoName, xoParentSelector } = this.options;
        if (xoParentSelector) {
          this.parentEl = document.querySelector(xoParentSelector);
        }
        if (xoPortal && xoName && xoParentSelector) {
          this.setAttribute("popover", "manual");
          this.style.setProperty("--xo-right", `${getScrollbarWidth()}px`);
          openPopover(this);
          this.handleTopSelector();
          window.addEventListener("scroll", this.handleScroll, { passive: true });
        }
        if (!xoPortal) {
          closePopover(this);
          this.removeAttribute("popover");
          this.style.removeProperty("--xo-top");
          this.style.removeProperty("--xo-left");
          this.style.removeProperty("--xo-right");
          this.style.removeProperty("--xo-width");
          this.style.removeProperty("--xo-height");
        }
        document.addEventListener("click", this.handleOutsideClick);
      });
      __publicField(this, "componentMount", () => {
        const { xoBreakpoints } = this.options;
        this.init();
        if (xoBreakpoints && objectKeys(xoBreakpoints).length > 0) {
          window.addEventListener("resize", this.handleResize);
        }
      });
      __publicField(this, "componentUnmount", () => {
        document.addEventListener("click", this.handleOutsideClick);
        window.removeEventListener("scroll", this.handleScroll);
        window.removeEventListener("resize", this.handleResize);
        closePopover(this);
      });
    }
    static get observedAttributes() {
      return ["xo-portal", "xo-breakpoints"];
    }
    get options() {
      return {
        ..._Toggle.defaultOptions,
        ...this._options
      };
    }
    get stateName() {
      return "xo-toggle";
    }
    get componentName() {
      return WebComponent.Toggle;
    }
    set options(value) {
      this._options = value;
    }
    async attributeChangedCallback(_, oldValue, newValue) {
      if (oldValue !== newValue) {
        await delay(100);
        this.setOptions();
        this.init();
      }
    }
  };
  let Toggle = _Toggle;
  __publicField(Toggle, "defaultOptions", {
    xoName: null,
    xoOutsideClickEnabled: false,
    xoPortal: false,
    xoParentSelector: ""
  });
  class ToggleTrigger extends ToggleTriggerBase {
    get stateName() {
      return "xo-toggle";
    }
    get componentName() {
      return WebComponent.ToggleTrigger;
    }
  }
  xoStore.create("xo-toggle", {
    initialState: {
      trigger: {},
      data: {}
    }
  });
  const styles$v = "";
  const xoToggle = new ToggleBaseMethods("xo-toggle");
  window.xoToggle = xoToggle;
  componentDefine({
    [WebComponent.Toggle]: Toggle,
    [WebComponent.ToggleTrigger]: ToggleTrigger
  });
  const smartZoom = (useOpacity = false) => {
    const smartZoom2 = (el, { value, isOpen, triggerEl, dy = 0, modalEl, easing }) => {
      if (!triggerEl) {
        return animate$1.zoom(useOpacity)(el, { value, isOpen, easing });
      }
      const imgEl = modalEl.querySelector("img[xo-cropped]");
      const triggerMeasure = triggerEl.getBoundingClientRect();
      const inputRange = isOpen ? [0, 1] : [1, 0];
      const scaleXMin = triggerMeasure.width / el.offsetWidth;
      const scaleYMin = triggerMeasure.height / el.offsetHeight;
      const xMin = triggerMeasure.left + triggerMeasure.width / 2 - modalEl.scrollWidth / 2;
      const height = el.offsetHeight > modalEl.offsetHeight ? el.offsetHeight : modalEl.offsetHeight;
      const yMin = triggerMeasure.top + triggerMeasure.height / 2 - height / 2 + modalEl.scrollTop;
      const scaleX = interpolate({
        value,
        inputRange,
        easing,
        outputRange: isOpen ? [scaleXMin, 1] : [1, scaleXMin]
      });
      const scaleY = interpolate({
        value,
        inputRange,
        easing,
        outputRange: isOpen ? [scaleYMin, 1] : [1, scaleYMin]
      });
      const x = interpolate({
        value,
        inputRange,
        easing,
        outputRange: isOpen ? [xMin, 0] : [0, xMin]
      });
      const y = interpolate({
        value,
        inputRange,
        easing,
        outputRange: isOpen ? [yMin, dy] : [dy, yMin]
      });
      if (useOpacity) {
        const opacity = interpolate({
          value,
          inputRange,
          easing: easings.ease,
          outputRange: isOpen ? [0, 1] : [1, 0]
        });
        el.style.opacity = `${opacity}`;
      }
      el.style.transform = `translateX(${x}px) translateY(${y}px) scaleX(${scaleX}) scaleY(${scaleY})`;
      el.style.visibility = value === 0 ? "hidden" : "visible";
      if (imgEl) {
        if (scaleX > scaleY) {
          imgEl.style.transform = `scaleY(${scaleX / scaleY})`;
        } else {
          imgEl.style.transform = `scaleX(${scaleY / scaleX})`;
        }
      }
    };
    return smartZoom2;
  };
  const setAnimate$1 = {
    none: animate$1.none,
    zoom: animate$1.zoom(true),
    "smart-zoom": smartZoom(),
    "smart-fade-zoom": smartZoom(true),
    fade: animate$1.move(),
    "fade-up": animate$1.move({ dy: 100 }),
    "fade-down": animate$1.move({ dy: -100 }),
    "fade-left": animate$1.move({ dx: 100 }),
    "fade-right": animate$1.move({ dx: -100 }),
    "slide-up": animate$1.move({
      dy: (modalEl) => {
        const { offsetTop } = modalEl;
        return window.innerHeight - offsetTop;
      },
      opacity: 1
    }),
    "slide-down": animate$1.move({
      dy: (modalEl) => {
        const { offsetTop, offsetHeight } = modalEl;
        return -1 * (offsetHeight + offsetTop);
      },
      opacity: 1
    }),
    "slide-left": animate$1.move({
      dx: (modalEl) => {
        const isRtl2 = document.documentElement.dir === "rtl";
        if (isRtl2) {
          return -1 * (modalEl.offsetWidth + modalEl.offsetLeft);
        }
        return window.innerWidth - modalEl.offsetLeft;
      },
      opacity: 1
    }),
    "slide-right": animate$1.move({
      dx: (modalEl) => {
        const isRtl2 = document.documentElement.dir === "rtl";
        if (isRtl2) {
          return window.innerWidth - modalEl.offsetLeft;
        }
        return -1 * (modalEl.offsetWidth + modalEl.offsetLeft);
      },
      opacity: 1
    })
  };
  const css$1 = createCssInJs();
  const createShadowStyles = (xoBackdropColor, xoBackdropBlur) => css$1`
  ${WebComponent.ModalBackdrop} {
    position: absolute;
    inset: 0;
    z-index: 1;
    background-color: ${xoBackdropColor ? xoBackdropColor : "var(--xo-backdrop-color, rgba(0, 0, 0, 0.5))"};
    backdrop-filter: blur(${xoBackdropBlur ? `${xoBackdropBlur}px` : "var(--xo-backdrop-blur, 0px)"});
    pointer-events: auto;
  }
  ${WebComponent.ModalInner} {
    position: relative;
    display: flex;
    min-height: 100%;
    overflow: hidden;
  }
  ${WebComponent.ModalInner}[xo-placement="center"] {
    align-items: center;
    justify-content: center;
  }
  ${WebComponent.ModalInner}[xo-placement="top-center"] {
    justify-content: center;
  }
  ${WebComponent.ModalInner}[xo-placement="top-right"] {
    justify-content: flex-end;
  }
  ${WebComponent.ModalInner}[xo-placement="bottom-left"] {
    align-items: flex-end;
  }
  ${WebComponent.ModalInner}[xo-placement="bottom-center"] {
    align-items: flex-end;
    justify-content: center;
  }
  ${WebComponent.ModalInner}[xo-placement="bottom-right"] {
    align-items: flex-end;
    justify-content: flex-end;
  }
  ${WebComponent.ModalContent} {
    position: relative;
    z-index: 9;
    display: block;
    visibility: hidden;
    width: fit-content;
    height: fit-content;
    pointer-events: none;
  }
`;
  const createContentStyles = () => css$1`
  ${WebComponent.ModalContent} * {
    pointer-events: auto;
  }
`;
  function scrollDisable() {
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.setProperty("--scroll-bar-width", `${scrollbarWidth}px`);
    document.body.classList.add("xo-modal-open");
  }
  function scrollEnable() {
    const { data } = xoStore.get("xo-modal");
    const isOpen = objectValues(data).some((item) => item.isOpen && item.options.xoScrollDisabled);
    if (!isOpen) {
      document.body.style.removeProperty("--scroll-bar-width");
      document.body.classList.remove("xo-modal-open");
    }
  }
  function getCursorTemplate() {
    const cursorTemplateEl = document.querySelector("template[xo-modal-backdrop-cursor]");
    if (cursorTemplateEl) {
      return cursorTemplateEl.innerHTML;
    }
    return "";
  }
  const _Modal = class extends ToggleBase {
    constructor() {
      super(...arguments);
      __publicField(this, "animated", createAnimate());
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "timeId1", -1);
      __publicField(this, "timeId2", -1);
      __publicField(this, "shadow", this.attachShadow({ mode: "open" }));
      __publicField(this, "dialog", document.createElement("div"));
      __publicField(this, "tabsEls", Array.from(this.querySelectorAll(WebComponent.Tabs)));
      __publicField(this, "currentZIndex", window.getComputedStyle(this).zIndex);
      __publicField(this, "_options");
      __publicField(this, "setOptions", () => {
        var _a2;
        const options = getAttrs(this, {
          pick: [
            "xoName",
            "xoDuration",
            "xoEasing",
            "xoAnimate",
            "xoBackdropColor",
            "xoBackdropBlur",
            "xoBackdropDisabled",
            "xoPortal",
            "xoPlacement",
            "xoDisabled",
            "xoBreakpoints",
            "xoAutofocus",
            "xoSectionSelect",
            "xoVideoAutoplay",
            "xoScrollDisabled",
            "xoEscCloseDisabled",
            "xoBackdropCloseDisabled"
          ],
          types: {
            xoName: "string",
            xoDuration: "number",
            xoEasing: "string",
            xoAnimate: "string",
            xoBackdropColor: "string",
            xoBackdropBlur: "number",
            xoBackdropDisabled: "boolean",
            xoPortal: "boolean",
            xoPlacement: "string",
            xoDisabled: "boolean",
            xoBreakpoints: "object",
            xoAutofocus: "boolean",
            xoSectionSelect: "boolean",
            xoVideoAutoplay: "boolean",
            xoScrollDisabled: "boolean",
            xoEscCloseDisabled: "boolean",
            xoBackdropCloseDisabled: "boolean"
          }
        });
        const breakpointOpts = getBreakpointsOptions((_a2 = options.xoBreakpoints) != null ? _a2 : {});
        let xoDuration = (breakpointOpts == null ? void 0 : breakpointOpts.duration) != null ? breakpointOpts.duration : options.xoDuration;
        if (device.mobile() && reduceMotion()) {
          xoDuration = 0;
        }
        this.options = JSON.parse(JSON.stringify({
          ...options,
          xoDisabled: (breakpointOpts == null ? void 0 : breakpointOpts.disabled) != null ? breakpointOpts.disabled : options.xoDisabled,
          xoDuration,
          xoEasing: (breakpointOpts == null ? void 0 : breakpointOpts.easing) != null ? breakpointOpts.easing : options.xoEasing,
          xoAnimate: (breakpointOpts == null ? void 0 : breakpointOpts.animate) != null ? breakpointOpts.animate : options.xoAnimate,
          xoBackdropColor: (breakpointOpts == null ? void 0 : breakpointOpts.backdropColor) != null ? breakpointOpts.backdropColor : options.xoBackdropColor,
          xoBackdropBlur: (breakpointOpts == null ? void 0 : breakpointOpts.backdropBlur) != null ? breakpointOpts.backdropBlur : options.xoBackdropBlur,
          xoBackdropDisabled: (breakpointOpts == null ? void 0 : breakpointOpts.backdropDisabled) != null ? breakpointOpts.backdropDisabled : options.xoBackdropDisabled,
          xoPlacement: (breakpointOpts == null ? void 0 : breakpointOpts.placement) != null ? breakpointOpts.placement : options.xoPlacement
        }));
      });
      __publicField(this, "componentOpen", () => {
        const { xoDuration: duration, xoVideoAutoplay, xoScrollDisabled } = this.options;
        openPopover(this);
        if (xoScrollDisabled) {
          scrollDisable();
        }
        this.cancel();
        this.cancel = this.animated({ from: 0, to: 1, duration });
        if (xoVideoAutoplay) {
          const videoEl = this.querySelector("video");
          videoEl == null ? void 0 : videoEl.play();
        }
        const imgEl = this.querySelector("img[xo-src]");
        imgEl == null ? void 0 : imgEl.setAttribute("src", imgEl.getAttribute("xo-src") || "");
        imgEl == null ? void 0 : imgEl.removeAttribute("xo-src");
        this.tabsEls.forEach((tabsEl) => {
          attrBoolean.set(tabsEl, "xo-ready", true);
        });
      });
      __publicField(this, "componentClose", () => {
        const { xoDuration: duration, xoVideoAutoplay } = this.options;
        scrollEnable();
        this.cancel();
        this.animated({
          from: 1,
          to: 0,
          duration,
          onEnd: () => {
            closePopover(this);
          }
        });
        if (xoVideoAutoplay) {
          const videoEl = this.querySelector("video");
          videoEl == null ? void 0 : videoEl.pause();
        }
        this.tabsEls.forEach((tabsEl) => {
          attrBoolean.set(tabsEl, "xo-ready", false);
        });
      });
      __publicField(this, "setStyles", (value) => {
        const { xoAnimate, xoEasing, xoBackdropDisabled } = this.options;
        const { isOpen, triggerElement, dy, usePan = false } = this.state;
        const contentEl = this.shadow.querySelector(WebComponent.ModalContent);
        const { cssText } = createContentStyles();
        const styleEl = this.shadow.querySelector("style");
        if (value === 0) {
          this.style.removeProperty("visibility");
          this.style.removeProperty("opacity");
        } else {
          if (!xoBackdropDisabled) {
            this.style.visibility = "visible";
          }
          this.style.opacity = "1";
        }
        if (value === 1) {
          this.style.removeProperty("pointer-events");
          if (styleEl && !styleEl.innerText.includes(cssText)) {
            styleEl.innerText = styleEl.innerText + cssText;
          }
          this.style.zIndex = this.currentZIndex;
        } else {
          this.style.pointerEvents = "none";
          this.style.zIndex = "-1";
          if (styleEl) {
            styleEl.innerText = styleEl.innerText.replace(cssText, "");
          }
        }
        clearTimeout(this.timeId1);
        clearTimeout(this.timeId2);
        if (value === 1 || value === 0) {
          this.timeId1 = window.setTimeout(() => {
            if (value === 1) {
              attrBoolean.set(this, "xo-ready", true);
            } else {
              attrBoolean.set(this, "xo-ready", false);
            }
          }, 200);
          this.timeId2 = window.setTimeout(() => {
            if (value === 1) {
              attrBoolean.set(this, "xo-animate-active", true);
            } else {
              attrBoolean.set(this, "xo-animate-active", false);
            }
          }, 300);
        }
        if (setAnimate$1[xoAnimate]) {
          setAnimate$1[xoAnimate](contentEl, {
            value,
            isOpen,
            triggerEl: triggerElement,
            dy,
            modalEl: this,
            usePan,
            easing: easings[xoEasing]
          });
        }
      });
      __publicField(this, "render", () => {
        const { xoName, xoBackdropColor, xoBackdropBlur, xoBackdropDisabled, xoPlacement, xoDisabled } = this.options;
        const { cssText } = createShadowStyles(xoBackdropColor, xoBackdropBlur);
        const backdrop = xoBackdropDisabled ? "" : `<${WebComponent.ModalBackdrop} part="backdrop" xo-name="${xoName}"><slot name="${xoName}-backdrop"></slot></${WebComponent.ModalBackdrop}>`;
        if (xoDisabled) {
          return `
        <${WebComponent.ModalInner} part="inner" xo-placement="${xoPlacement}">
          <${WebComponent.ModalContent} part="content">
            <slot name="${xoName}-inner"></slot>
          </${WebComponent.ModalContent}>
          ${backdrop}
        </${WebComponent.ModalInner}>
      `;
        }
        return `
      <style>${cssText}</style>
      <${WebComponent.ModalInner} part="inner" xo-placement="${xoPlacement}">
        <${WebComponent.ModalContent} part="content">
          <slot name="${xoName}-inner"></slot>
        </${WebComponent.ModalContent}>
        ${backdrop}
      </${WebComponent.ModalInner}>
    `;
      });
      __publicField(this, "addSlotName", (xoName) => {
        const modalChildEls = Array.from(this.querySelectorAll(WebComponent.Modal));
        const childEls = Array.from(this.children);
        each(childEls, (el) => {
          if (!modalChildEls.includes(el)) {
            el.setAttribute("slot", `${xoName}-inner`);
          }
        });
      });
      __publicField(this, "setOptionsState", (xoName) => {
        this.setState((prevState) => {
          return {
            ...prevState,
            [xoName]: {
              ...prevState[xoName],
              options: this.options
            }
          };
        });
      });
      __publicField(this, "checkSmartAnimateSupport", () => {
        const { xoAnimate, xoPlacement } = this.options;
        if (xoAnimate.includes("smart-") && xoPlacement !== "center") {
          throwError(`[${WebComponent.Modal}] xo-placement="${xoPlacement}" is not supported with xo-animate="${xoAnimate}"`);
        }
      });
      __publicField(this, "handleImageCropped", () => {
        const imgEl = this.querySelector("img[xo-cropped]");
        if (imgEl) {
          const ratio = imgEl.naturalWidth / imgEl.naturalHeight;
          const windowRatio = window.innerWidth / window.innerHeight;
          const isWide = ratio > windowRatio;
          imgEl.style.objectFit = "contain";
          if (isWide) {
            imgEl.style.width = "100vw";
            imgEl.style.height = "auto";
          } else {
            imgEl.style.width = "100%";
            imgEl.style.height = "100vh";
            imgEl.style.maxWidth = "none";
          }
        }
      });
      __publicField(this, "componentBeforeMount", () => {
        this.setOptions();
        this.style.pointerEvents = "none";
        this.style.zIndex = "-1";
      });
      __publicField(this, "handleResize", debounce(resizeAxis("x", () => {
        const { xoName } = this.options;
        this.setOptions();
        this.animated.off();
        xoModal.close(xoName);
        this.mounted();
      }), 500));
      __publicField(this, "setCurrentDisabled", () => {
        const { xoDisabled } = this.options;
        attrBoolean.set(this, "xo-current-disabled", xoDisabled);
      });
      __publicField(this, "handleDialogCancel", (event) => {
        event.preventDefault();
      });
      __publicField(this, "appendCursor", () => {
        const { xoName } = this.options;
        const cursorTemplate = getCursorTemplate();
        const cursorHtml = cursorTemplate ? `<div slot="${xoName}-backdrop" is="xo-cursor" xo-backdrop-cursor xo-absolute xo-lerp-ease="0.2"><xo-cursor-item>${cursorTemplate}</xo-cursor-item></div>` : "";
        this.insertAdjacentHTML("beforeend", cursorHtml);
      });
      __publicField(this, "mounted", () => {
        const { xoName, xoDisabled, xoBreakpoints, xoPortal } = this.options;
        checkAttr(this.componentName, "xo-name", xoName);
        this.addSlotName(xoName);
        this.setCurrentDisabled();
        if (xoPortal && popoverSupported$1()) {
          this.setAttribute("popover", "manual");
        }
        this.shadow.innerHTML = this.render();
        this.setCssVariables();
        this.appendCursor();
        if (xoBreakpoints && objectKeys(xoBreakpoints).length > 0) {
          each(objectKeys(xoBreakpoints).sort(), (key) => {
            const val = xoBreakpoints[key];
            this.setCssVariables(Number(key), val);
          });
        }
        if (!xoDisabled) {
          this.setOptionsState(xoName);
          this.checkSmartAnimateSupport();
          this.animated.onUpdate(this.setStyles);
          this.handleImageCropped();
        }
      });
      __publicField(this, "componentMount", () => {
        const { xoBreakpoints } = this.options;
        this.mounted();
        if (xoBreakpoints && objectKeys(xoBreakpoints).length > 0) {
          window.addEventListener("resize", this.handleResize);
        }
      });
      __publicField(this, "componentUnmount", () => {
        this.animated.off();
        clearTimeout(this.timeId1);
        clearTimeout(this.timeId2);
        window.removeEventListener("resize", this.handleResize);
        this.dialog.removeEventListener("cancel", this.handleDialogCancel);
      });
      __publicField(this, "handleClose", () => {
        const { xoName } = this.options;
        checkAttr(this.componentName, "xo-name", xoName);
        this.setState((prevState) => {
          return {
            ...prevState,
            [xoName]: {
              ...prevState[xoName],
              triggerElement: prevState[xoName].triggerElement,
              usePan: false,
              isOpen: false
            }
          };
        });
      });
    }
    get stateName() {
      return "xo-modal";
    }
    get componentName() {
      return WebComponent.Modal;
    }
    get options() {
      var _a2, _b2, _c2, _d2;
      const { xoPlacement } = this._options;
      const drawerDefaultOptions = !xoPlacement || xoPlacement === "center" ? {} : {
        xoDuration: (_b2 = (_a2 = window.settings) == null ? void 0 : _a2.drawer_duration) != null ? _b2 : 300,
        xoEasing: (_d2 = (_c2 = window.settings) == null ? void 0 : _c2.drawer_easing) != null ? _d2 : "decay",
        xoAnimate: "smart-fade-zoom"
      };
      const result = {
        ..._Modal.defaultOptions,
        ...drawerDefaultOptions,
        ...this._options
      };
      return {
        ...result,
        xoDuration: result.xoAnimate === "none" ? 0 : result.xoDuration
      };
    }
    set options(value) {
      this._options = value;
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    getShadow() {
      return this.shadow;
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue != null && oldValue !== newValue) {
        await delay(100);
        this.setOptions();
        this.componentUnmount();
        this.componentMount();
        this.handleClose();
        const triggerEls = Array.from(document.querySelectorAll(`${WebComponent.ModalTrigger}[xo-name="${this.options.xoName}"]`));
        each(triggerEls, (triggerEl) => {
          triggerEl.setAttribute("xo-observed", newValue);
        });
      }
    }
  };
  let Modal = _Modal;
  __publicField(Modal, "defaultOptions", {
    xoName: null,
    xoDuration: (_k = (_j = window.settings) == null ? void 0 : _j.modal_duration) != null ? _k : 300,
    xoEasing: (_m = (_l = window.settings) == null ? void 0 : _l.modal_easing) != null ? _m : "decay",
    xoAnimate: (_o = (_n = window.settings) == null ? void 0 : _n.modal_animate) != null ? _o : "smart-fade-zoom",
    xoBackdropDisabled: false,
    xoPortal: popoverSupported$1(),
    xoPlacement: "center",
    xoDisabled: false,
    xoBreakpoints: {},
    xoScrollDisabled: true,
    xoAutofocus: false,
    xoVideoAutoplay: false
  });
  const DELTA_FPS = 1e3 / 60;
  const _ModalTrigger = class extends ToggleTriggerBase {
    constructor() {
      super(...arguments);
      __publicField(this, "timeId", -1);
      __publicField(this, "timeId2", -1);
      __publicField(this, "_options");
      __publicField(this, "setOptions", () => {
        this.options = getAttrs(this, {
          pick: ["xoName", "xoSync"],
          types: {
            xoName: "string",
            xoSync: "boolean"
          }
        });
      });
      __publicField(this, "setTriggerElement", () => {
        const { xoName } = this.options;
        const { isOpen } = this.state;
        checkAttr(this.componentName, "xo-name", xoName);
        this.setState((prevState) => {
          var _a2;
          return {
            ...prevState,
            [xoName]: {
              ...prevState[xoName],
              triggerElement: isOpen ? this : (_a2 = prevState[xoName]) == null ? void 0 : _a2.triggerElement,
              usePan: false
            }
          };
        });
      });
      __publicField(this, "componentTrigger", () => {
        const { isOpen } = this.state;
        const { xoSync } = this.options;
        this.setTriggerElement();
        if (xoSync && isOpen) {
          this.timeId2 = window.setTimeout(() => {
            this.style.visibility = "hidden";
          }, DELTA_FPS);
        }
      });
      __publicField(this, "componentBeforeMount", () => {
        this.setOptions();
      });
      __publicField(this, "componentMount", () => {
        this.setTriggerElement();
      });
      __publicField(this, "componentUnmount", () => {
        clearTimeout(this.timeId);
        clearTimeout(this.timeId2);
      });
      __publicField(this, "componentClose", () => {
        const { xoSync } = this.options;
        if (xoSync) {
          const { options } = this.state;
          const { xoDuration } = options;
          this.timeId = window.setTimeout(() => {
            this.style.visibility = "visible";
          }, xoDuration - DELTA_FPS);
        }
      });
    }
    get stateName() {
      return "xo-modal";
    }
    get componentName() {
      return WebComponent.ModalTrigger;
    }
    get options() {
      const parentEl = this.closest("[xo-name]");
      if (parentEl) {
        const options2 = getAttrs(parentEl, {
          pick: ["xoName"],
          types: {
            xoName: "string"
          }
        });
        return {
          ..._ModalTrigger.defaultOptions,
          ...options2,
          ...this._options
        };
      }
      return {
        ..._ModalTrigger.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue != null && oldValue !== newValue) {
        await delay(100);
        this.setOptions();
      }
    }
  };
  let ModalTrigger = _ModalTrigger;
  __publicField(ModalTrigger, "defaultOptions", {
    xoName: null,
    xoSync: false
  });
  class ModalBackdrop extends ToggleTriggerBase {
    constructor() {
      super(...arguments);
      __publicField(this, "animated", createAnimate());
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "componentOpen", () => {
        const { options } = this.state;
        const { xoDuration: duration } = options;
        this.cancel();
        this.cancel = this.animated({
          from: 0,
          to: 1,
          duration,
          easing: easings.decay
        });
      });
      __publicField(this, "componentClose", () => {
        const { options, opacity = 1, usePan = false } = this.state;
        const { xoDuration } = options;
        this.cancel();
        this.cancel = this.animated({
          from: opacity,
          to: 0,
          duration: usePan ? 0 : xoDuration,
          easing: easings.decay
        });
      });
      __publicField(this, "componentMount", () => {
        const { options } = this.state;
        const { xoAnimate } = options;
        this.style.visibility = "hidden";
        this.animated.onUpdate((value) => {
          if (xoAnimate !== "none") {
            this.style.opacity = `${value}`;
          }
          if (value === 0) {
            this.style.visibility = "hidden";
          } else {
            this.style.visibility = "visible";
          }
        });
      });
      __publicField(this, "componentUnmount", () => {
        this.animated.off();
      });
    }
    get stateName() {
      return "xo-modal";
    }
    get componentName() {
      return WebComponent.ModalBackdrop;
    }
    get actionType() {
      const { options } = this.state;
      const { xoBackdropCloseDisabled } = options;
      if (xoBackdropCloseDisabled) {
        return "none";
      }
      return "close";
    }
  }
  const Axis$2 = {
    Idle: "idle",
    Target: "target",
    Lock: "lock"
  };
  const _ModalPan = class extends ToggleTriggerBase {
    constructor() {
      super(...arguments);
      __publicField(this, "animated", createAnimate());
      __publicField(this, "panAnimated", createAnimate());
      __publicField(this, "panCloseAnimated", createAnimate());
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "modalEl", null);
      __publicField(this, "backdropEl", null);
      __publicField(this, "contentEl", null);
      __publicField(this, "distance", 0);
      __publicField(this, "opacity", 1);
      __publicField(this, "timeId", -1);
      __publicField(this, "pan", null);
      __publicField(this, "axis", Axis$2.Idle);
      __publicField(this, "componentOpen", () => {
        const { options } = this.state;
        const { xoDuration: duration } = options;
        this.cancel();
        this.cancel = this.animated({
          from: 0,
          to: 1,
          duration
        });
      });
      __publicField(this, "componentClose", () => {
        const { options } = this.state;
        const { xoDuration: duration } = options;
        this.cancel();
        this.cancel = this.animated({
          from: 1,
          to: 0,
          duration
        });
      });
      __publicField(this, "componentUnmount", () => {
        clearTimeout(this.timeId);
        if (this.pan) {
          this.pan.destroy();
        }
        this.animated.off();
        this.panAnimated.off();
        this.panCloseAnimated.off();
      });
      __publicField(this, "resetModalMeasure", () => {
        const { xoName } = this.options;
        checkAttr(this.componentName, "xo-name", xoName);
        this.setState((prevState) => {
          return {
            ...prevState,
            [xoName]: {
              ...prevState[xoName],
              dy: 0,
              opacity: 1
            }
          };
        })(`${this.stateName}/resetModalContentMeasure`);
      });
      __publicField(this, "componentMount", () => {
        const { xoName, xoVertical, xoThreshold, xoIntentionalAxis } = this.options;
        const { options } = this.state;
        const { xoEasing, xoAnimate } = options;
        const methods = new ToggleBaseMethods(this.stateName);
        checkAttr(this.componentName, "xo-name", xoName);
        this.pan = panGesture({
          element: this,
          onMove: ({ dx, dy }) => {
            var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
            const zoomEl = this.querySelector(WebComponent.ImageZoomItem);
            if (Number((_a2 = zoomEl == null ? void 0 : zoomEl.getAttribute("xo-zoom")) != null ? _a2 : "1") > 1) {
              return;
            }
            this.modalEl = this.closest(WebComponent.Modal);
            this.backdropEl = (_d2 = (_c2 = (_b2 = this.modalEl) == null ? void 0 : _b2.shadowRoot) == null ? void 0 : _c2.querySelector) == null ? void 0 : _d2.call(_c2, WebComponent.ModalBackdrop);
            this.contentEl = (_g2 = (_f2 = (_e2 = this.modalEl) == null ? void 0 : _e2.shadowRoot) == null ? void 0 : _f2.querySelector) == null ? void 0 : _g2.call(_f2, WebComponent.ModalContent);
            if (this.axis === Axis$2.Idle) {
              if (Math.abs(xoVertical ? dx : dy) / xoThreshold >= Math.abs(xoVertical ? dy : dx)) {
                this.axis = Axis$2.Target;
              } else {
                this.axis = Axis$2.Lock;
              }
            }
            if (this.axis === Axis$2.Target || !xoIntentionalAxis) {
              this.style.touchAction = "none";
              const spaceY = (xoVertical ? window.innerWidth - this.offsetWidth : window.innerHeight - this.offsetHeight) / 2;
              const threadholdY = (xoVertical ? this.offsetWidth : this.offsetHeight) + spaceY;
              if (this.backdropEl) {
                this.opacity = interpolate({
                  value: xoVertical ? dx : dy,
                  inputRange: [-threadholdY, 0, threadholdY],
                  outputRange: [0, 1, 0]
                });
                this.backdropEl.style.opacity = `${this.opacity}`;
              }
              if (this.contentEl) {
                if (xoAnimate.includes("smart-")) {
                  if (xoVertical) {
                    this.contentEl.style.transform = `translateX(${dx}px)`;
                  } else {
                    this.contentEl.style.transform = `translateY(${dy}px)`;
                  }
                } else if (xoVertical) {
                  this.contentEl.style.transform = `translateX(${dx}px)`;
                } else {
                  this.contentEl.style.transform = `translateY(${dy}px)`;
                }
              }
            } else if (this.pan) {
              this.pan.setValue({ dx: 0, dy: 0 });
            }
          },
          onEnd: ({ dx, dy, vx, vy }) => {
            var _a2;
            const zoomEl = this.querySelector(WebComponent.ImageZoomItem);
            if (Number((_a2 = zoomEl == null ? void 0 : zoomEl.getAttribute("xo-zoom")) != null ? _a2 : "1") > 1) {
              return;
            }
            const { options: options2 } = this.state;
            const { xoDuration, xoAnimate: xoAnimate2 } = options2;
            if (this.axis === Axis$2.Target || !xoIntentionalAxis) {
              this.style.pointerEvents = "none";
              this.distance = xoVertical ? dx : dy;
              if (this.contentEl) {
                let threadholdY = (xoVertical ? window.innerWidth : window.innerHeight) / 3;
                if (xoIntentionalAxis) {
                  threadholdY = (xoVertical ? this.contentEl.offsetWidth : this.contentEl.offsetHeight) / 2;
                }
                const hide = Math.abs(this.distance) > threadholdY || (xoVertical ? Math.abs(vx) : Math.abs(vy)) > 8;
                this.setState((prevState) => {
                  return {
                    ...prevState,
                    [xoName]: {
                      ...prevState[xoName],
                      dy,
                      opacity: this.opacity
                    }
                  };
                })(`${this.stateName}/setModalContentMeasure`);
                if (hide) {
                  if (xoAnimate2.includes("smart-")) {
                    methods.close(xoName);
                  } else {
                    this.panCloseAnimated({
                      from: 0,
                      to: 1,
                      duration: 300
                    });
                  }
                } else {
                  this.panAnimated({
                    from: 0,
                    to: 1,
                    duration: 300
                  });
                }
                if (this.pan) {
                  this.pan.setValue({ dx: 0, dy: 0 });
                }
                this.timeId = window.setTimeout(() => {
                  this.resetModalMeasure();
                  clearTimeout(this.timeId);
                  this.style.removeProperty("pointer-events");
                }, xoDuration);
              }
            }
            this.style.removeProperty("touch-action");
            this.axis = Axis$2.Idle;
          }
        });
        this.panAnimated.onUpdate((value) => {
          if (this.backdropEl) {
            const opacity = interpolate({
              value,
              inputRange: [0, 1],
              outputRange: [this.opacity, 1]
            });
            this.backdropEl.style.opacity = `${opacity}`;
          }
          if (this.contentEl) {
            const y = interpolate({
              value,
              inputRange: [0, 1],
              outputRange: [this.distance, 0],
              easing: easings[xoEasing]
            });
            if (xoVertical) {
              this.contentEl.style.transform = `translateX(${y}px) translateY(0px) scale(1)`;
            } else {
              this.contentEl.style.transform = `translateX(0px) translateY(${y}px) scale(1)`;
            }
          }
        });
        this.panCloseAnimated.onUpdate((value) => {
          if (this.backdropEl) {
            const opacity = interpolate({
              value,
              inputRange: [0, 1],
              outputRange: [this.opacity, 0]
            });
            this.backdropEl.style.opacity = `${opacity}`;
          }
          if (this.contentEl) {
            const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = this.contentEl;
            let range2 = -1 * (xoVertical ? offsetWidth + offsetLeft : offsetHeight + offsetTop);
            if (this.distance >= 0) {
              range2 = xoVertical ? window.innerWidth - offsetLeft : window.innerHeight - offsetTop;
            }
            const translate = interpolate({
              value,
              inputRange: [0, 1],
              outputRange: [this.distance, range2],
              easing: easings[xoEasing]
            });
            if (xoVertical) {
              this.contentEl.style.transform = `translateX(${translate}px) translateY(0px) scale(1)`;
            } else {
              this.contentEl.style.transform = `translateX(0px) translateY(${translate}px) scale(1)`;
            }
          }
        });
        this.panCloseAnimated.onEnd(() => {
          this.setState((prevState) => {
            return {
              ...prevState,
              [xoName]: {
                ...prevState[xoName],
                usePan: true
              }
            };
          });
          methods.close(xoName);
        });
      });
    }
    get stateName() {
      return "xo-modal";
    }
    get componentName() {
      return WebComponent.ModalPan;
    }
    get actionType() {
      return "none";
    }
    get options() {
      const options = getAttrs(this, {
        pick: ["xoName", "xoVertical", "xoThreshold", "xoIntentionalAxis"],
        types: {
          xoName: "string",
          xoVertical: "boolean",
          xoThreshold: "number",
          xoIntentionalAxis: "boolean"
        }
      });
      const parentEl = this.closest("[xo-name]");
      if (parentEl) {
        const options2 = getAttrs(parentEl, {
          pick: ["xoName"],
          types: {
            xoName: "string"
          }
        });
        return {
          ..._ModalPan.defaultOptions,
          ...options2,
          ...options
        };
      }
      return {
        ..._ModalPan.defaultOptions,
        ...options
      };
    }
  };
  let ModalPan = _ModalPan;
  __publicField(ModalPan, "defaultOptions", {
    xoName: null,
    xoVertical: false,
    xoThreshold: 1.5,
    xoIntentionalAxis: false
  });
  xoStore.create("xo-modal", {
    initialState: {
      trigger: {},
      data: {}
    }
  });
  const styles$u = "";
  const xoModal = new ToggleBaseMethods("xo-modal");
  window.xoModal = xoModal;
  componentDefine({
    [WebComponent.Modal]: Modal,
    [WebComponent.ModalTrigger]: ModalTrigger,
    [WebComponent.ModalBackdrop]: ModalBackdrop,
    [WebComponent.ModalPan]: ModalPan
  });
  class ScrollX extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "shadow", this.attachShadow({ mode: "open" }));
      __publicField(this, "instance", parallaxScroll({
        setStyles({ element, createValue }) {
          const width = createValue("width");
          element.style.width = `${width}`;
        }
      }));
      __publicField(this, "elementStyle", (screen) => {
        this.style.height = `${screen * 110}vh`;
        this.shadow.innerHTML = `
      <${WebComponent.ScrollXInner} part="inner"><slot></slot></${WebComponent.ScrollXInner}>
    `;
      });
      __publicField(this, "handleFocusIn", (event) => {
        const target = event.target;
        const scrollItemEl = target.closest(WebComponent.ScrollXItem);
        const scrollItemEls = Array.from(this.querySelectorAll(WebComponent.ScrollXItem));
        const index = scrollItemEls.indexOf(scrollItemEl);
        if (scrollItemEl && index >= 0) {
          const offsetTop = offset(this).top;
          window.scrollTo({
            top: offsetTop + window.innerHeight * index,
            behavior: "smooth"
          });
        }
      });
      __publicField(this, "handleChild", (child, index) => {
        if ((child.tagName.toLowerCase() === WebComponent.ScrollXItem || child.tagName.toLowerCase() === WebComponent.ScrollXYItem) && index > 0) {
          attrBoolean.set(child, WebComponent.ScrollXItem, true);
          this.instance.add(child, {
            from: () => {
              const offsetTop = offset(this).top;
              return offsetTop - window.innerHeight * 2 + window.innerHeight * (index + 1);
            },
            to: () => {
              const offsetTop = offset(this).top;
              return offsetTop - window.innerHeight + window.innerHeight * (index + 1);
            },
            keyframes: {
              "20%": { width: "0%" },
              "100%": { width: "100%" }
            }
          });
        }
      });
    }
    onConnected() {
      const childEls = Array.from(this.children);
      this.elementStyle(childEls.length);
      each(childEls, this.handleChild);
      this.instance.run();
      document.addEventListener("focusin", this.handleFocusIn);
    }
    disconnectedCallback() {
      this.instance.destroy();
      document.removeEventListener("focusin", this.handleFocusIn);
    }
  }
  const styles$t = "";
  componentDefine({
    [WebComponent.ScrollX]: ScrollX
  });
  class ScrollY extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "shadow", this.attachShadow({ mode: "open" }));
      __publicField(this, "instance", parallaxScroll({
        setStyles({ element, createValue }) {
          const y = createValue("yy");
          element.style.top = `${y}`;
        }
      }));
      __publicField(this, "elementStyle", (screen) => {
        this.style.height = `${screen * 110}vh`;
        this.shadow.innerHTML = `
      <${WebComponent.ScrollYInner} part="inner"><slot></slot></${WebComponent.ScrollYInner}>
    `;
      });
      __publicField(this, "handleFocusIn", (event) => {
        const target = event.target;
        const scrollItemEl = target.closest(WebComponent.ScrollYItem);
        const scrollItemEls = Array.from(this.querySelectorAll(WebComponent.ScrollYItem));
        const index = scrollItemEls.indexOf(scrollItemEl);
        if (scrollItemEl && index >= 0) {
          const offsetTop = offset(this).top;
          window.scrollTo({
            top: offsetTop + window.innerHeight * index,
            behavior: "smooth"
          });
        }
      });
      __publicField(this, "handleChild", (child, index) => {
        if ((child.tagName.toLowerCase() === WebComponent.ScrollYItem || child.tagName.toLowerCase() === WebComponent.ScrollXYItem) && index > 0) {
          attrBoolean.set(child, WebComponent.ScrollYItem, true);
          this.instance.add(child, {
            from: () => {
              const offsetTop = offset(this).top;
              return offsetTop - window.innerHeight * 2 + window.innerHeight * (index + 1);
            },
            to: () => {
              const offsetTop = offset(this).top;
              return offsetTop - window.innerHeight + window.innerHeight * (index + 1);
            },
            keyframes: {
              "20%": { yy: "100%" },
              "100%": { yy: "0%" }
            }
          });
        }
      });
    }
    onConnected() {
      const childEls = Array.from(this.children);
      this.elementStyle(childEls.length);
      each(childEls, this.handleChild);
      this.instance.run();
      document.addEventListener("focusin", this.handleFocusIn);
    }
    disconnectedCallback() {
      this.instance.destroy();
      document.removeEventListener("focusin", this.handleFocusIn);
    }
  }
  const styles$s = "";
  componentDefine({
    [WebComponent.ScrollY]: ScrollY
  });
  const xoCircleBar = {
    set(xoName, value) {
      xoStore.set("xo-circle-bar", (prevState) => {
        return {
          ...prevState,
          [xoName]: value
        };
      });
    },
    animate(xoName, { value, duration = 1e3, easing }) {
      const animated = createAnimate();
      animated({
        from: 0,
        to: value,
        duration,
        easing: easing ? easings[easing] : void 0,
        onUpdate(value2) {
          xoStore.set("xo-circle-bar", (prevState) => {
            return {
              ...prevState,
              [xoName]: value2
            };
          });
        }
      });
      return animated.off;
    }
  };
  const offs = {};
  const observer$1 = new IntersectionObserver((entries) => {
    frameManager.add(() => {
      entries.forEach(async (entry) => {
        const element = entry.target;
        const { xoDuration, xoName, xoEasing, xoValue } = element.getOptions();
        if (entry.isIntersecting && xoName && xoValue) {
          const prevOff = offs[xoName];
          prevOff == null ? void 0 : prevOff();
          const off = xoCircleBar.animate(xoName, { value: xoValue, duration: xoDuration, easing: xoEasing });
          offs[xoName] = off;
          observer$1.unobserve(element);
        }
      });
    });
  }, {
    rootMargin: "0px 0px -50px 0px"
  });
  const _CircleBar = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", null);
      __publicField(this, "getOptions", () => {
        const options = getAttrs(this, {
          pick: ["xoName", "xoFill", "xoStrokeWidth", "xoSize", "xoTrackColor", "xoThumbColor", "xoStrokeLinecap", "xoAnimateOnScroll", "xoEasing", "xoValue", "xoDuration"],
          types: {
            xoName: "string",
            xoFill: "string",
            xoStrokeWidth: "number",
            xoSize: "number",
            xoTrackColor: "string",
            xoThumbColor: "string",
            xoStrokeLinecap: "string",
            xoAnimateOnScroll: "boolean",
            xoEasing: "string",
            xoValue: "number",
            xoDuration: "number"
          }
        });
        return {
          ..._CircleBar.defaultOptions,
          ...options
        };
      });
      __publicField(this, "listener", () => {
        var _a2;
        const { xoName, xoSize, xoStrokeWidth } = this.getOptions();
        const carouselEl = this.closest(WebComponent.Carousel);
        if (!carouselEl) {
          checkAttr(WebComponent.CircleBar, "xo-name", xoName);
        }
        const thumbEl = this.querySelector(".circle-bar-thumb");
        const value = (_a2 = xoStore.get("xo-circle-bar")) == null ? void 0 : _a2[xoName];
        if (value != null) {
          const offset2 = interpolate({
            value,
            inputRange: [0, 100],
            outputRange: [xoSize * Math.PI, xoStrokeWidth * Math.PI]
          });
          thumbEl.style.strokeDashoffset = `${offset2}`;
        }
      });
      __publicField(this, "render", () => {
        const { xoSize, xoStrokeWidth, xoTrackColor, xoThumbColor, xoStrokeLinecap, xoFill } = this.getOptions();
        return `
      <svg width="${xoSize}" height="${xoSize}" viewport="0 0 ${xoSize} ${xoSize}" version="1.1" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle">
        <circle
          fill="${xoFill}"
          stroke-width="${xoStrokeWidth}"
          r="${(xoSize - xoStrokeWidth) / 2}"
          cx="${xoSize / 2}"
          cy="${xoSize / 2}"
          stroke="${xoTrackColor}"
        >
        </circle>
        <circle
          class="circle-bar-thumb"
          stroke-width="${xoStrokeWidth}"
          r="${(xoSize - xoStrokeWidth) / 2}"
          cx="${xoSize / 2}"
          cy="${xoSize / 2}"
          stroke="${xoThumbColor}"
          stroke-linecap="${xoStrokeLinecap}"
          stroke-dashoffset="${xoSize * Math.PI}"
          stroke-dasharray="${xoSize * Math.PI}"
          fill="transparent"
          transform="rotate(-90)"
          transform-origin="50% 50%"
        >
        </circle>
      </svg>
    `;
      });
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    onConnected() {
      const options = this.getOptions();
      this.innerHTML = this.render();
      this.style.display = "block";
      if (options.xoAnimateOnScroll) {
        observer$1.observe(this);
      }
      this.unsubscribe = xoStore.subscribe("xo-circle-bar", this.listener);
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue !== newValue) {
        await delay(100);
        this.disconnectedCallback();
        this.onConnected();
      }
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this.unsubscribe) == null ? void 0 : _a2.call(this);
      observer$1.unobserve(this);
    }
  };
  let CircleBar = _CircleBar;
  __publicField(CircleBar, "defaultOptions", {
    xoName: null,
    xoFill: "transparent",
    xoSize: 100,
    xoStrokeWidth: 2,
    xoTrackColor: "#ebebeb",
    xoThumbColor: "#ea5b5b",
    xoStrokeLinecap: "round",
    xoAnimateOnScroll: false,
    xoEasing: "ease",
    xoValue: 0,
    xoDuration: 1e3
  });
  __publicField(CircleBar, "observeOnMount", true);
  xoStore.create("xo-circle-bar", {
    initialState: {}
  });
  window.xoCircleBar = xoCircleBar;
  componentDefine({
    [WebComponent.CircleBar]: CircleBar
  });
  const toastEvents = new Emitter();
  const _ToastAction = class {
    constructor() {
      __publicField(this, "placements", ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"]);
      __publicField(this, "frames", {});
      __publicField(this, "elements", {});
      __publicField(this, "getOptions", (options) => {
        if (typeof options === "string") {
          return {
            ..._ToastAction.defaultOptions,
            content: options
          };
        }
        return {
          ..._ToastAction.defaultOptions,
          ...options
        };
      });
      __publicField(this, "handleFrame", (placement) => {
        var _a2;
        const el = this.elements[placement];
        if ((el == null ? void 0 : el.innerHTML.trim()) === "") {
          el.removeAttribute("popover");
          closePopover(el);
          (_a2 = this.frames[placement]) == null ? void 0 : _a2.remove(this.handleFrames[placement]);
          el.remove();
        }
      });
      __publicField(this, "handleFrames", {
        "top-left": () => {
          this.handleFrame("top-left");
        },
        "top-center": () => {
          this.handleFrame("top-center");
        },
        "top-right": () => {
          this.handleFrame("top-right");
        },
        "bottom-left": () => {
          this.handleFrame("bottom-left");
        },
        "bottom-center": () => {
          this.handleFrame("bottom-center");
        },
        "bottom-right": () => {
          this.handleFrame("bottom-right");
        }
      });
      __publicField(this, "createToastRoot", (placement) => {
        this.elements[placement] = document.querySelector(`${WebComponent.ToastPortal}[xo-placement="${placement}"]`);
        if (!this.elements[placement]) {
          this.elements[placement] = document.createElement(WebComponent.ToastPortal);
          this.elements[placement].setAttribute("xo-placement", placement);
          this.elements[placement].setAttribute("popover", "manual");
          document.body.appendChild(this.elements[placement]);
          openPopover(this.elements[placement]);
          this.frames[placement] = frameManager.add(this.handleFrames[placement], true);
        }
      });
      __publicField(this, "push", (options) => {
        const opts = this.getOptions(options);
        for (const placement of this.placements) {
          this.createToastRoot(placement);
        }
        toastEvents.emit("toast:push", opts);
      });
      __publicField(this, "remove", (name) => {
        toastEvents.emit("toast:remove", name);
      });
    }
  };
  let ToastAction = _ToastAction;
  __publicField(ToastAction, "defaultOptions", {
    name: "",
    content: "",
    duration: 200,
    delay: 2e3,
    className: "",
    style: {},
    placement: "bottom-center",
    easing: "decay",
    closeButtonDisabled: false,
    closeButtonClassName: "",
    closeButtonPlacement: "top-right",
    onShow() {
    },
    onHide() {
    }
  });
  const toastAction = new ToastAction();
  function xoToastPrivate(options) {
    return toastAction.push(options);
  }
  const xoToast = Object.assign(xoToastPrivate, {
    push: toastAction.push,
    remove: toastAction.remove
  });
  class ToastPortal extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "offId", -1);
      __publicField(this, "renderCloseButton", (message) => {
        return `
      <${WebComponent.ToastCloseButton} class="${message.closeButtonClassName}" xo-placement="${message.closeButtonPlacement}"><svg viewBox="0 0 20 20" focusable="false" aria-hidden="true"><path d="M6.707 5.293a1 1 0 0 0-1.414 1.414l3.293 3.293-3.293 3.293a1 1 0 1 0 1.414 1.414l3.293-3.293 3.293 3.293a1 1 0 0 0 1.414-1.414l-3.293-3.293 3.293-3.293a1 1 0 0 0-1.414-1.414l-3.293 3.293-3.293-3.293Z"></path></svg></${WebComponent.ToastCloseButton}>
    `;
      });
      __publicField(this, "listener", (message) => {
        if (message.name) {
          const messageEl = document.querySelector(`${WebComponent.Toast}[xo-name="${message.name}"]`);
          if (messageEl && messageEl.parentNode !== this) {
            const messageAttr = getAttrs(messageEl, {
              pick: ["xoDuration", "xoClassName", "xoDelay", "xoEasing", "xoPlacement", "xoCloseButtonClassName", "xoCloseButtonDisabled", "xoCloseButtonPlacement"],
              types: {
                xoDuration: "number",
                xoClassName: "string",
                xoDelay: "number",
                xoEasing: "string",
                xoPlacement: "string",
                xoCloseButtonClassName: "string",
                xoCloseButtonDisabled: "boolean",
                xoCloseButtonPlacement: "string"
              },
              propTransformer: (prop) => namingConvention.pascalToCamel(prop.replace(/^xo/, ""))
            });
            const messageMerge = { ...message, ...messageAttr };
            const messageEls = Array.from(this.querySelectorAll(`${WebComponent.Toast}[xo-name="${message.name}"]`));
            const hasMessage = messageEls.some((el) => {
              var _a2;
              return ((_a2 = el.message) == null ? void 0 : _a2.name) === messageMerge.name;
            });
            if (messageMerge.placement === this.getAttribute("xo-placement") && !hasMessage) {
              if (!messageMerge.closeButtonDisabled && !messageEl.querySelector(WebComponent.ToastCloseButton)) {
                messageEl.insertAdjacentHTML("beforeend", this.renderCloseButton(messageMerge));
              }
              const messageElClone = messageEl == null ? void 0 : messageEl.cloneNode(true);
              messageEl.message = messageMerge;
              messageElClone.message = messageMerge;
              attrBoolean.set(messageElClone, "xo-cloned", true);
              if (messageMerge.placement.includes("top-")) {
                this.insertAdjacentElement("beforeend", messageElClone);
              } else {
                this.insertAdjacentElement("afterbegin", messageElClone);
              }
            }
          }
        } else if (message.placement === this.getAttribute("xo-placement")) {
          const messageEl = document.createElement(WebComponent.Toast);
          if (!message.closeButtonDisabled) {
            messageEl.innerHTML = message.content + this.renderCloseButton(message);
          } else {
            messageEl.innerHTML = message.content;
          }
          messageEl.message = message;
          if (message.placement.includes("top-")) {
            this.insertAdjacentElement("beforeend", messageEl);
          } else {
            this.insertAdjacentElement("afterbegin", messageEl);
          }
        }
      });
    }
    onConnected() {
      this.offId = toastEvents.on("toast:push", this.listener);
    }
    disconnectedCallback() {
      toastEvents.off(this.offId);
    }
  }
  const OFFSET = 20;
  class Toast extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "timeId", -1);
      __publicField(this, "animatedIn", createAnimate());
      __publicField(this, "animatedOut", createAnimate());
      __publicField(this, "message", null);
      __publicField(this, "prevTimestamp", null);
      __publicField(this, "delayFromMouseEnter", 0);
      __publicField(this, "closeEl", null);
      __publicField(this, "unmounted", false);
      __publicField(this, "offId", -1);
      __publicField(this, "initialized", false);
      __publicField(this, "cleanup", () => {
        const name = this.getAttribute("xo-name");
        const els = Array.from(document.querySelectorAll(`${WebComponent.Toast}[xo-name="${name}"]`));
        each(els, (el) => {
          el.remove();
        });
      });
      __publicField(this, "destroy", () => {
        clearTimeout(this.timeId);
        this.animatedIn.off();
        this.animatedOut.off();
        this.removeEventListener("mouseenter", this.handleMouseEnter);
        this.removeEventListener("mouseleave", this.handleMouseLeave);
        if (this.closeEl) {
          this.closeEl.removeEventListener("click", this.handleCloseClick);
        }
        toastEvents.off(this.offId);
      });
      __publicField(this, "getHeight", () => {
        var _a2, _b2;
        const { placement } = this.message;
        const { marginTop, marginBottom } = window.getComputedStyle(this);
        const marginTopNumber = (_a2 = parseInt(marginTop)) != null ? _a2 : 0;
        const marginBottomNumber = (_b2 = parseInt(marginBottom)) != null ? _b2 : 0;
        if (placement.includes("top-")) {
          return this.offsetHeight + marginBottomNumber;
        }
        return this.offsetHeight + marginTopNumber;
      });
      __publicField(this, "getValueY", (value) => {
        const { placement } = this.message;
        const f = placement.includes("top-") ? -1 : 1;
        return f * (value + OFFSET);
      });
      __publicField(this, "handleMouseEnter", () => {
        this.delayFromMouseEnter = Math.max(0, this.delayFromMouseEnter - (Date.now() - this.prevTimestamp));
        clearTimeout(this.timeId);
      });
      __publicField(this, "handleMouseLeave", () => {
        if (this.delayFromMouseEnter !== Infinity) {
          this.timeId = window.setTimeout(() => {
            this.unmount();
          }, this.delayFromMouseEnter);
        }
        this.prevTimestamp = Date.now();
      });
      __publicField(this, "handleCloseClick", () => {
        this.unmount();
      });
      __publicField(this, "setStyles", () => {
        var _a2, _b2;
        const { closeButtonPlacement } = this.message;
        const { className, style } = this.message;
        if (className) {
          this.className = className;
        }
        Object.assign(this.style, style);
        if (this.closeEl) {
          const closeWidth = this.closeEl.offsetWidth + ((_a2 = parseInt(window.getComputedStyle(this.closeEl).marginRight)) != null ? _a2 : 0) + ((_b2 = parseInt(window.getComputedStyle(this.closeEl).marginLeft)) != null ? _b2 : 0);
          if (closeButtonPlacement.includes("left")) {
            this.style.paddingLeft = `${closeWidth}px`;
          } else {
            this.style.paddingRight = `${closeWidth}px`;
          }
        }
      });
      __publicField(this, "setCssVariables", () => {
        for (const key in this.message) {
          const val = this.message[key];
          if (val != null && !/onShow|onHide|className|closeButtonClassName|style|content/g.test(key)) {
            this.style.setProperty(`--xo-${namingConvention.camelToKebab(key)}`, ` ${JSON.stringify(val)}`);
          }
        }
      });
      __publicField(this, "mount", () => {
        const { duration, onShow, easing } = this.message;
        const height = this.getHeight();
        const from = this.getValueY(height);
        this.closeEl = this.querySelector(WebComponent.ToastCloseButton);
        this.prevTimestamp = Date.now();
        onShow(this);
        this.setStyles();
        this.setCssVariables();
        if (this.closeEl) {
          this.closeEl.addEventListener("click", this.handleCloseClick);
        }
        this.addEventListener("mouseenter", this.handleMouseEnter);
        this.addEventListener("mouseleave", this.handleMouseLeave);
        this.animatedIn({
          from,
          to: 0,
          duration,
          easing: easings[easing],
          onUpdate: (value) => {
            this.style.transform = `translateY(${value}px)`;
          }
        });
        this.unmounted = false;
      });
      __publicField(this, "unmount", () => {
        const { duration, placement, onHide, easing, name } = this.message;
        const height = this.getHeight();
        if (!this.unmounted) {
          this.unmounted = true;
          this.style.pointerEvents = "none";
          this.animatedOut({
            from: 0,
            to: 1,
            duration,
            onUpdate: (value) => {
              const margin = interpolate({
                value,
                inputRange: [0, 1],
                outputRange: [0, -height],
                easing: easings[easing]
              });
              const offset2 = interpolate({
                value,
                inputRange: [0, 1],
                outputRange: [0, OFFSET],
                easing: easings[easing]
              });
              if (placement.includes("top-")) {
                this.style.marginTop = `${margin}px`;
                this.style.transform = `translateY(-${offset2}px)`;
              } else {
                this.style.marginBottom = `${margin}px`;
                this.style.transform = `translateY(${offset2}px)`;
              }
            },
            onEnd: () => {
              this.style.removeProperty("pointer-events");
              if (name) {
                this.destroy();
                const portalEl = this.closest(WebComponent.ToastPortal);
                if (portalEl) {
                  this.remove();
                }
              } else {
                this.remove();
              }
              onHide(this);
            }
          });
        }
      });
    }
    onConnected() {
      const portalEl = this.closest(WebComponent.ToastPortal);
      if (!portalEl) {
        return;
      }
      if (this.message) {
        const { delay: delay2 } = this.message;
        this.initialized = true;
        this.delayFromMouseEnter = delay2;
        this.mount();
        if (delay2 !== Infinity) {
          this.timeId = window.setTimeout(() => {
            this.unmount();
          }, delay2);
        }
        this.offId = toastEvents.on("toast:remove", () => {
          this.unmount();
        });
      }
    }
    disconnectedCallback() {
      if (!attrBoolean.get(this, "xo-cloned")) {
        this.cleanup();
        return;
      }
      if (this.initialized) {
        this.destroy();
        this.unmount();
      }
    }
  }
  const styles$r = "";
  window.xoToast = xoToast;
  componentDefine({
    [WebComponent.ToastPortal]: ToastPortal,
    [WebComponent.Toast]: Toast
  });
  const xoPopover = new ToggleBaseMethods("xo-popover");
  const setAnimate = {
    none: animate$1.none,
    zoom: animate$1.zoom(true),
    fade: animate$1.move(),
    "fade-up": animate$1.move({ dy: 50 }),
    "fade-down": animate$1.move({ dy: -50 }),
    "fade-left": animate$1.move({ dx: 50 }),
    "fade-right": animate$1.move({ dx: -50 })
  };
  function popoverSupported(el) {
    const modalEl = el.closest(WebComponent.Modal);
    const stickyEl = el.closest(WebComponent.Sticky);
    return typeof HTMLDialogElement === "function" && !modalEl && !stickyEl;
  }
  const _Popover = class extends ToggleBase {
    constructor() {
      super(...arguments);
      __publicField(this, "animated", createAnimate());
      __publicField(this, "canClose", false);
      __publicField(this, "_options");
      __publicField(this, "setOptions", () => {
        var _a2;
        const options = getAttrs(this, {
          pick: [
            "xoName",
            "xoAnimate",
            "xoEasing",
            "xoDuration",
            "xoPlacement",
            "xoPortal",
            "xoDisabled",
            "xoBreakpoints",
            "xoAutofocus",
            "xoSectionSelect",
            "xoModalScrollSelector",
            "xoOffset",
            "xoAbsolute"
          ],
          types: {
            xoName: "string",
            xoAnimate: "string",
            xoEasing: "string",
            xoDuration: "number",
            xoPlacement: "string",
            xoPortal: "boolean",
            xoDisabled: "boolean",
            xoBreakpoints: "object",
            xoAutofocus: "boolean",
            xoSectionSelect: "boolean",
            xoModalScrollSelector: "string",
            xoOffset: "number",
            xoAbsolute: "boolean"
          }
        });
        const breakpointOpts = getBreakpointsOptions((_a2 = options.xoBreakpoints) != null ? _a2 : {});
        this.options = JSON.parse(JSON.stringify({
          ...options,
          xoPortal: options.xoAbsolute ? false : options.xoPortal,
          xoDisabled: (breakpointOpts == null ? void 0 : breakpointOpts.disabled) != null ? breakpointOpts.disabled : options.xoDisabled,
          xoDuration: (breakpointOpts == null ? void 0 : breakpointOpts.duration) != null ? breakpointOpts.duration : options.xoDuration,
          xoEasing: (breakpointOpts == null ? void 0 : breakpointOpts.easing) != null ? breakpointOpts.easing : options.xoEasing,
          xoAnimate: (breakpointOpts == null ? void 0 : breakpointOpts.animate) != null ? breakpointOpts.animate : options.xoAnimate,
          xoPlacement: (breakpointOpts == null ? void 0 : breakpointOpts.placement) != null ? breakpointOpts.placement : options.xoPlacement,
          xoOffset: (breakpointOpts == null ? void 0 : breakpointOpts.offset) != null ? breakpointOpts.offset : options.xoOffset
        }));
      });
      __publicField(this, "handleCalTopLeft", () => {
        var _a2, _b2, _c2;
        const { xoPlacement, xoOffset, xoModalScrollSelector, xoAbsolute } = this.options;
        const { triggerElement, isOpen } = this.state;
        if (!isOpen) {
          return;
        }
        if (triggerElement) {
          const measure2 = popper(triggerElement, {
            placement: xoPlacement,
            offset: xoOffset,
            element: this
          });
          const modalEl = this.closest(WebComponent.Modal);
          const stickyEl = this.closest(`${WebComponent.Sticky}:not([xo-disabled])`);
          if (modalEl) {
            const modalContentEl = (_a2 = modalEl.shadowRoot) == null ? void 0 : _a2.querySelector(WebComponent.ModalContent);
            const scrollEl = xoModalScrollSelector ? modalEl.querySelector(xoModalScrollSelector) : null;
            if (scrollEl && window.getComputedStyle(scrollEl).position === "static") {
              scrollEl.style.position = "relative";
            }
            const contentEl = scrollEl || modalContentEl;
            const { left: modalLeft, top: modalTop } = offset(contentEl);
            const { x, y } = this.getValueWithBoundary(measure2.left - modalLeft, measure2.top - modalTop + ((scrollEl == null ? void 0 : scrollEl.scrollTop) || 0));
            this.style.top = `${y}px`;
            this.style.left = `${x}px`;
          } else if (stickyEl) {
            const parentEl = (_c2 = getParent(this)) != null ? _c2 : (_b2 = stickyEl.shadowRoot) == null ? void 0 : _b2.querySelector(WebComponent.StickyContent);
            const { left: stickyLeft, top: stickyTop } = offset(parentEl);
            const { x, y } = this.getValueWithBoundary(measure2.left - stickyLeft, measure2.top - stickyTop);
            this.style.top = `${y}px`;
            this.style.left = `${x}px`;
          } else if (xoAbsolute) {
            const parentEl = getParent(this);
            const { left: stickyLeft, top: stickyTop } = offset(parentEl);
            const { x, y } = this.getValueWithBoundary(measure2.left - stickyLeft, measure2.top - stickyTop);
            this.style.top = `${y}px`;
            this.style.left = `${x}px`;
          } else {
            const { x, y } = this.getValueWithBoundary(measure2.left, measure2.top - window.scrollY);
            this.style.top = `${y}px`;
            this.style.left = `${x}px`;
          }
          this.style.setProperty("--xo-popover-trigger-width", `${triggerElement.offsetWidth}px`);
        }
      });
      __publicField(this, "handleScroll", () => {
        const { isOpen } = this.state;
        if (!isOpen) {
          return;
        }
        frameManager.add(() => {
          this.handleCalTopLeft();
        });
      });
      __publicField(this, "subscribe", () => {
        const { xoDuration, xoDisabled } = this.options;
        const { triggerElement, isOpen } = this.state;
        if (!xoDisabled) {
          this.handleCalTopLeft();
          if (triggerElement) {
            this.animated({
              from: isOpen ? 0 : 1,
              to: isOpen ? 1 : 0,
              duration: xoDuration
            });
          }
        }
      });
      __publicField(this, "handleClose", () => {
        const { xoDuration, xoName } = this.options;
        this.animated({
          from: 1,
          to: 0,
          duration: xoDuration
        });
        if (xoName) {
          xoPopover.close(xoName, "empty");
        }
      });
      __publicField(this, "handleOutsideClick", (event) => {
        const { xoDisabled } = this.options;
        const { isOpen, triggerElement } = this.state;
        const target = event.target;
        if (this.canClose && isOpen && !xoDisabled && !this.contains(target) && !(triggerElement == null ? void 0 : triggerElement.contains(target))) {
          this.handleClose();
        }
      });
      __publicField(this, "resetStyles", () => {
        const { xoDisabled } = this.options;
        if (xoDisabled) {
          this.style.removeProperty("top");
          this.style.removeProperty("left");
          this.style.removeProperty("opacity");
          this.style.removeProperty("visibility");
          this.style.removeProperty("transform");
        }
      });
      __publicField(this, "handleResize", debounce(() => {
        this.setOptions();
        this.resetStyles();
        this.handleCalTopLeft();
        this.componentUnmount();
        this.componentMount();
      }, 500));
      __publicField(this, "setCurrentDisabled", () => {
        const { xoDisabled } = this.options;
        attrBoolean.set(this, "xo-current-disabled", xoDisabled);
      });
      __publicField(this, "componentOpen", async () => {
        const { xoPortal } = this.options;
        if (xoPortal && popoverSupported(this)) {
          openPopover(this);
          if (device.safari() && this.style.position === "fixed") {
            this.style.position = "relative";
            await delay();
            this.style.position = "fixed";
          }
        }
      });
      __publicField(this, "componentClose", () => {
        const { xoDuration } = this.options;
        if (this.animated.getValue() > 0 && this.animated.getValue() < 1) {
          this.animated({
            from: 1,
            to: 0,
            duration: xoDuration
          });
          this.style.removeProperty("pointer-events");
        }
      });
      __publicField(this, "componentBeforeMount", () => {
        this.setOptions();
      });
      __publicField(this, "componentMount", async () => {
        const { xoName, xoAnimate, xoEasing, xoPortal, xoBreakpoints, xoModalScrollSelector, xoAbsolute } = this.options;
        checkAttr(this.componentName, "xo-name", xoName);
        if (xoPortal && popoverSupported(this)) {
          this.setAttribute("popover", "manual");
        }
        this.setCurrentDisabled();
        this.setCssVariables();
        if (xoBreakpoints) {
          each(objectKeys(xoBreakpoints).sort(), (key) => {
            const val = xoBreakpoints[key];
            this.setCssVariables(Number(key), val);
          });
        }
        const modalEl = this.closest(WebComponent.Modal);
        const stickyEl = this.closest(`${WebComponent.Sticky}:not([xo-disabled])`);
        if (modalEl || stickyEl || xoAbsolute) {
          this.style.position = "absolute";
        } else {
          this.style.position = "fixed";
        }
        document.addEventListener("click", this.handleOutsideClick);
        this.animated.onUpdate((value) => {
          const { isOpen } = this.state;
          const cond = isOpen ? value === 1 : value === 0;
          if (cond) {
            this.style.removeProperty("pointer-events");
          } else {
            this.style.pointerEvents = "none";
          }
          if (setAnimate[xoAnimate]) {
            setAnimate[xoAnimate](this, { isOpen, easing: easings[xoEasing], value });
          }
          this.canClose = value === 1;
        });
        this.animated.onEnd(() => {
          const { isOpen } = this.state;
          if (!isOpen && xoPortal && popoverSupported(this)) {
            closePopover(this);
          }
        });
        window.addEventListener("resize", this.handleResize);
        if (modalEl) {
          const scrollEl = xoModalScrollSelector ? modalEl.querySelector(xoModalScrollSelector) || window : window;
          scrollEl.addEventListener("scroll", this.handleScroll, { passive: true });
        } else {
          window.addEventListener("scroll", this.handleScroll, { passive: true });
        }
      });
      __publicField(this, "componentUnmount", () => {
        const { xoModalScrollSelector } = this.options;
        this.animated.off();
        document.removeEventListener("click", this.handleOutsideClick);
        window.removeEventListener("resize", this.handleResize);
        const modalEl = this.closest(WebComponent.Modal);
        if (modalEl) {
          const scrollEl = xoModalScrollSelector ? modalEl.querySelector(xoModalScrollSelector) || window : window;
          scrollEl.removeEventListener("scroll", this.handleScroll);
        } else {
          window.removeEventListener("scroll", this.handleScroll);
        }
      });
    }
    static get observedAttributes() {
      return ["xo-placement", "xo-offset", "xo-breakpoints"];
    }
    get stateName() {
      return "xo-popover";
    }
    get componentName() {
      return WebComponent.Popover;
    }
    get options() {
      return {
        ..._Popover.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    getValueWithBoundary(x, y) {
      const boundaryEl = this.closest("[xo-popover-boundary]");
      if (boundaryEl) {
        const { left: boundaryLeft, top: boundaryTop } = boundaryEl.getBoundingClientRect();
        return {
          x: clamp(x, boundaryLeft, boundaryLeft + boundaryEl.offsetWidth - this.offsetWidth),
          y: clamp(y, boundaryTop, boundaryTop + boundaryEl.offsetHeight - this.offsetHeight)
        };
      }
      return { x, y };
    }
    async attributeChangedCallback(_, oldValue, newValue) {
      if (oldValue !== newValue) {
        await delay(100);
        this.setOptions();
        this.resetStyles();
        this.handleCalTopLeft();
      }
    }
  };
  let Popover = _Popover;
  __publicField(Popover, "defaultOptions", {
    xoName: null,
    xoAnimate: "fade-up",
    xoEasing: "decay",
    xoDuration: 300,
    xoPlacement: "bottom-center",
    xoPortal: false,
    xoOffset: 10,
    xoDisabled: false,
    xoBreakpoints: {},
    xoAutofocus: false
  });
  const _PopoverTrigger = class extends ToggleTriggerBase {
    constructor() {
      super(...arguments);
      __publicField(this, "componentTrigger", () => {
        const { xoName, xoType } = this.options;
        const { isOpen } = this.state;
        checkAttr(this.componentName, "xo-name", xoName);
        this.setState((prevState) => {
          return {
            ...prevState,
            [xoName]: {
              ...prevState[xoName],
              triggerElement: isOpen ? this : prevState[xoName].triggerElement,
              eventType: xoType
            }
          };
        })(`${this.componentName}/setTriggerElement`);
      });
    }
    get stateName() {
      return "xo-popover";
    }
    get componentName() {
      return WebComponent.PopoverTrigger;
    }
    get eventType() {
      return this.options.xoType;
    }
    get actionType() {
      return "toggle";
    }
    get options() {
      const options = getAttrs(this, {
        pick: ["xoName", "xoType"],
        types: {
          xoName: "string",
          xoType: "string"
        }
      });
      const parentEl = this.closest("[xo-name]");
      if (parentEl) {
        const options2 = getAttrs(parentEl, {
          pick: ["xoName"],
          types: {
            xoName: "string"
          }
        });
        return {
          ..._PopoverTrigger.defaultOptions,
          ...options2,
          ...options
        };
      }
      return {
        ..._PopoverTrigger.defaultOptions,
        ...options
      };
    }
  };
  let PopoverTrigger = _PopoverTrigger;
  __publicField(PopoverTrigger, "defaultOptions", {
    xoName: null,
    xoType: "click"
  });
  xoStore.create("xo-popover", {
    initialState: {
      trigger: {},
      data: {}
    }
  });
  const styles$q = "";
  let BuilderPopover = (_p = class extends XoComponent {
    constructor() {
      super();
      __publicField(this, "handleToggle", (event) => {
        const target = event.target;
        if (!target.closest(WebComponent.BuilderPopoverContent)) {
          this.setState({ isOpen: !this.state.isOpen });
        }
      });
      __publicField(this, "handleDocumentClick", (event) => {
        const target = event.target;
        if (!this.contains(target)) {
          this.setState({ isOpen: false });
        }
      });
      __publicField(this, "bindEvent", () => {
        const { xoType } = this.props;
        if (xoType === "click") {
          this.addEventListener("click", this.handleToggle);
          document.addEventListener("click", this.handleDocumentClick);
        }
      });
      __publicField(this, "addCssVars", () => {
        const { xoDuration } = this.props;
        this.style.setProperty("--xo-popover-duration", `${xoDuration}ms`);
      });
      this.state = {
        isOpen: false
      };
    }
    mount() {
      this.addCssVars();
      this.bindEvent();
    }
    unmount() {
      this.removeEventListener("click", this.handleToggle);
    }
    stateUpdate(prevState) {
      if (prevState.isOpen !== this.state.isOpen) {
        const contentEl = this.querySelector(WebComponent.BuilderPopoverContent);
        attrBoolean.set(this, "xo-open", this.state.isOpen);
        if (contentEl) {
          attrBoolean.set(contentEl, "xo-open", this.state.isOpen);
        }
      }
    }
    propUpdate({ name, prevProp, nextProp }) {
      if (name === "xoDuration" && prevProp !== nextProp) {
        this.addCssVars();
      }
      if (name === "xoType" && prevProp !== nextProp) {
        this.removeEventListener("click", this.handleToggle);
        this.bindEvent();
      }
    }
  }, __publicField(_p, "propTypes", {
    xoAnimate: "string",
    xoDuration: "number",
    xoPlacement: "string",
    xoType: "string"
  }), __publicField(_p, "defaultProps", {
    xoType: "click",
    xoPlacement: "bottom-center",
    xoAnimate: "fade-up",
    xoDuration: 300
  }), __publicField(_p, "observedProps", ["xoType", "xoDuration"]), _p);
  BuilderPopover = __decorate([
    customElements$1(WebComponent.BuilderPopover),
    __metadata("design:paramtypes", [])
  ], BuilderPopover);
  const builderPopover = "";
  window.xoPopover = xoPopover;
  componentDefine({
    [WebComponent.Popover]: Popover,
    [WebComponent.PopoverTrigger]: PopoverTrigger
  });
  const _Tooltip = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "contentEl", null);
      __publicField(this, "_options");
      __publicField(this, "intervalId", -1);
      __publicField(this, "isShowing", false);
      __publicField(this, "setOptions", () => {
        this.options = getAttrs(this, {
          pick: ["xoTitle", "xoAnimate", "xoDuration", "xoPlacement", "xoPortalClass", "xoMobileDisabled"],
          types: {
            xoTitle: "string",
            xoAnimate: "string",
            xoDuration: "number",
            xoPlacement: "string",
            xoPortalClass: "string",
            xoMobileDisabled: "boolean"
          }
        });
      });
      __publicField(this, "handleShow", async (event) => {
        var _a2;
        if (event) {
          this.isShowing = true;
        }
        window.removeEventListener("scroll", this.handleHide);
        window.addEventListener("scroll", this.handleHide, { passive: true });
        const parentEl = (_a2 = this.closest(`${WebComponent.Popover}, ${WebComponent.Modal}`)) != null ? _a2 : document.body;
        if (!this.contentEl) {
          this.contentEl = this.createPortal();
          parentEl.appendChild(this.contentEl);
        }
        const { xoPlacement, xoAnimate, xoDuration, xoOffset, xoTitle, xoPortalClass } = this.options;
        this.contentEl.innerHTML = xoTitle;
        this.contentEl.style.removeProperty("transition-duration");
        this.contentEl.setAttribute("xo-placement", xoPlacement);
        this.contentEl.setAttribute("xo-animate", xoAnimate);
        if (xoPortalClass) {
          this.contentEl.classList.add(xoPortalClass);
        }
        if (parentEl.tagName.toLowerCase() === WebComponent.Modal) {
          this.contentEl.setAttribute("slot", `${parentEl.getAttribute("xo-name")}-inner`);
        }
        const measure2 = popper(this, {
          placement: xoPlacement,
          offset: xoOffset,
          element: this.contentEl
        });
        let top = `${measure2.top}px`;
        let left = `${measure2.left}px`;
        if ([WebComponent.Modal, WebComponent.Popover].includes(parentEl.tagName.toLowerCase())) {
          if (parentEl.tagName.toLowerCase() === WebComponent.Modal) {
            const modalContentEl = parentEl.getShadow().querySelector(WebComponent.ModalContent);
            const { left: parentLeft, top: parentTop } = offset(modalContentEl);
            top = `${measure2.top - parentTop}px`;
            left = `${measure2.left - parentLeft}px`;
          } else {
            const { left: parentLeft, top: parentTop } = offset(parentEl);
            top = `${measure2.top - parentTop}px`;
            left = `${measure2.left - parentLeft}px`;
          }
        }
        if (this.contentEl.style.top !== top) {
          this.contentEl.style.top = top;
        }
        if (this.contentEl.style.left !== left) {
          this.contentEl.style.left = left;
        }
        await delay(0);
        this.contentEl.style.transitionDuration = `${xoAnimate ? xoDuration : 0}ms`;
        attrBoolean.set(this.contentEl, "xo-active", true);
        this.intervalId = window.setInterval(() => {
          if (window.getComputedStyle(this).display === "none") {
            this.handleHide();
            clearInterval(this.intervalId);
          }
        }, 1e3);
      });
      __publicField(this, "handleHide", async () => {
        if (this.contentEl) {
          attrBoolean.set(this.contentEl, "xo-active", false);
          clearInterval(this.intervalId);
        }
      });
      __publicField(this, "handleTooltip", (event) => {
        if (!this.contains(event.target) && this.isShowing) {
          this.handleHide();
          this.isShowing = false;
        }
      });
      __publicField(this, "handleClick", (event) => {
        this.isShowing = true;
        this.handleTooltip(event);
      });
      __publicField(this, "createPortal", () => {
        const el = document.createElement(WebComponent.TooltipContent);
        return el;
      });
      __publicField(this, "show", () => {
        this.handleShow();
      });
      __publicField(this, "hide", () => {
        this.handleHide();
      });
    }
    get options() {
      return {
        ..._Tooltip.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    onConnected() {
      this.setOptions();
      const { xoMobileDisabled } = this.options;
      if (device.mobile() && xoMobileDisabled) {
        return;
      }
      this.addEventListener("mouseenter", this.handleShow, false);
      window.addEventListener("mousemove", this.handleTooltip, false);
      window.addEventListener("click", this.handleClick, false);
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this.contentEl) == null ? void 0 : _a2.remove();
      clearInterval(this.intervalId);
      window.removeEventListener("mousemove", this.handleTooltip);
      window.removeEventListener("scroll", this.handleHide);
      this.removeEventListener("mouseenter", this.handleShow);
      window.removeEventListener("click", this.handleClick);
    }
  };
  let Tooltip = _Tooltip;
  __publicField(Tooltip, "defaultOptions", {
    xoTitle: "",
    xoAnimate: "fade-down",
    xoDuration: 400,
    xoPlacement: "top-center",
    xoPortalClass: "",
    xoOffset: 10,
    xoMobileDisabled: false
  });
  const styles$p = "";
  componentDefine({
    [WebComponent.Tooltip]: Tooltip
  });
  class CollapseMethods {
    constructor() {
      __publicField(this, "stateName", "xo-collapse");
      __publicField(this, "toggle", (name) => {
        xoStore.set(this.stateName, (state) => {
          return {
            ...state,
            [name]: {
              ...state[name],
              isOpen: !state[name].isOpen
            }
          };
        })(`${this.stateName}/toggle`);
      });
      __publicField(this, "open", (name) => {
        xoStore.set(this.stateName, (state) => {
          return {
            ...state,
            [name]: {
              ...state[name],
              isOpen: true
            }
          };
        })(`${this.stateName}/open`);
      });
      __publicField(this, "close", (name) => {
        xoStore.set(this.stateName, (state) => {
          return {
            ...state,
            [name]: {
              ...state[name],
              isOpen: false
            }
          };
        })(`${this.stateName}/close`);
      });
    }
  }
  const xoCollapse = new CollapseMethods();
  function hasProvider$1(providerEl) {
    return providerEl && providerEl.tagName.toLowerCase() === WebComponent.CollapseProvider;
  }
  function hasCollapseTrigger(collapseTriggerEl) {
    return collapseTriggerEl && collapseTriggerEl.tagName.toLowerCase() === WebComponent.CollapseTrigger;
  }
  const _Collapse = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "animated", createAnimate());
      __publicField(this, "unsubscribe", null);
      __publicField(this, "frameId", -1);
      __publicField(this, "clear", () => {
      });
      __publicField(this, "initialized", false);
      __publicField(this, "prevIsOpen", false);
      __publicField(this, "_options");
      __publicField(this, "componentOpen", () => {
        const { xoDuration, xoEasing } = this.options;
        const height = this.scrollHeight;
        this.animated({
          from: 0,
          to: height,
          duration: xoDuration,
          easing: easings[xoEasing],
          onUpdate: (value) => {
            if (height === 0) {
              this.style.height = "auto";
            } else {
              this.style.height = `${value}px`;
            }
          },
          onEnd: () => {
            this.style.height = "auto";
          }
        });
      });
      __publicField(this, "componentClose", () => {
        const { xoDuration, xoEasing } = this.options;
        const height = this.scrollHeight;
        this.animated({
          from: height,
          to: 0,
          duration: xoDuration,
          easing: easings[xoEasing],
          onUpdate: (value) => {
            this.style.height = `${value}px`;
          }
        });
      });
      __publicField(this, "listener", (state) => {
        const { xoName } = this.options;
        checkAttr(this.componentName, "xo-name", xoName);
        if (state[xoName]) {
          const { isOpen } = state[xoName];
          toggleA11y(this, !isOpen);
          if (this.initialized && isOpen !== this.prevIsOpen) {
            if (isOpen) {
              attrBoolean.set(this, "xo-active", true);
              this.componentOpen();
            } else {
              attrBoolean.set(this, "xo-active", false);
              this.componentClose();
            }
            this.prevIsOpen = isOpen;
          }
        }
      });
      __publicField(this, "setOptions", () => {
        const options = getAttrs(this, {
          pick: ["xoName", "xoDuration", "xoEasing"],
          types: {
            xoName: "string",
            xoDuration: "number",
            xoEasing: "string"
          }
        });
        if (hasProvider$1(this.providerElement) && hasCollapseTrigger(this.triggerElement)) {
          const autoOptions = {
            xoName: this.triggerElement.xoNameProp,
            xoDuration: Number(this.providerElement.getAttribute("xo-duration") || 300)
          };
          this.options = {
            ..._Collapse.defaultOptions,
            ...autoOptions,
            ...options
          };
        } else {
          this.options = {
            ..._Collapse.defaultOptions,
            ...options
          };
        }
      });
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    get componentName() {
      return WebComponent.Collapse;
    }
    get options() {
      return {
        ..._Collapse.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    get providerElement() {
      return this.closest(WebComponent.CollapseProvider);
    }
    get triggerElement() {
      return this.previousElementSibling;
    }
    async onConnected() {
      var _a2;
      this.setOptions();
      const { xoName } = this.options;
      checkAttr(this.componentName, "xo-name", xoName);
      this.initialized = true;
      if (((_a2 = { "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true }) == null ? void 0 : _a2.VITE_BUILD_MODE) === "xoSections") {
        this.clear = await delay(200);
        if (attrBoolean.get(this, "xo-active")) {
          xoCollapse.open(xoName);
        }
      } else {
        if (attrBoolean.get(this, "xo-active")) {
          await delay();
          xoCollapse.open(xoName);
        }
      }
      this.unsubscribe = xoStore.subscribe("xo-collapse", this.listener);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue !== newValue) {
        this.setOptions();
        const isOpen = attrBoolean.get(this, "xo-active");
        if (isOpen) {
          this.style.height = "auto";
        } else {
          this.style.removeProperty("height");
        }
        const { xoName } = this.options;
        checkAttr(this.componentName, "xo-name", xoName);
        xoStore.set("xo-collapse", (prevState) => {
          return {
            ...prevState,
            [xoName]: {
              ...prevState == null ? void 0 : prevState[xoName],
              isOpen
            }
          };
        });
      }
    }
    disconnectedCallback() {
      var _a2;
      this.animated.off();
      (_a2 = this.unsubscribe) == null ? void 0 : _a2.call(this);
      this.clear();
      cancelAnimationFrame(this.frameId);
    }
  };
  let Collapse = _Collapse;
  __publicField(Collapse, "defaultOptions", {
    xoName: null,
    xoDuration: 300,
    xoEasing: "decay"
  });
  let last$1 = 0;
  const _CollapseTrigger = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "xoNameProp", "");
      __publicField(this, "_options");
      __publicField(this, "handleCollapseHasProvider", () => {
        const { xoName } = this.options;
        if (!hasProvider$1(this.providerElement)) {
          checkAttr(this.componentName, "xo-name", xoName);
        }
        const triggerEls = Array.from(this.providerElement.querySelectorAll(WebComponent.CollapseTrigger));
        each(triggerEls, (triggerEl) => {
          const name = triggerEl.getAttribute("xo-name") || triggerEl.xoNameProp;
          if (this !== triggerEl || this.hasAttribute("xo-active")) {
            attrBoolean.set(triggerEl, "xo-active", false);
            bindingHelper(triggerEl, "xo-active-binding", false);
          } else {
            attrBoolean.set(triggerEl, "xo-active", true);
            bindingHelper(triggerEl, "xo-active-binding", true);
          }
          if (name) {
            xoStore.set("xo-collapse", (prevState) => {
              var _a2;
              return {
                ...prevState,
                [name]: {
                  ...prevState == null ? void 0 : prevState[name],
                  isOpen: this === triggerEl ? !((_a2 = prevState == null ? void 0 : prevState[name]) == null ? void 0 : _a2.isOpen) : false
                }
              };
            });
          }
        });
      });
      __publicField(this, "handleCollapse", () => {
        const { xoName } = this.options;
        if (!hasProvider$1(this.providerElement)) {
          checkAttr(this.componentName, "xo-name", xoName);
        }
        if (attrBoolean.get(this, "xo-active")) {
          attrBoolean.set(this, "xo-active", false);
          bindingHelper(this, "xo-active-binding", false);
        } else {
          attrBoolean.set(this, "xo-active", true);
          bindingHelper(this, "xo-active-binding", true);
        }
        xoCollapse.toggle(xoName);
      });
      __publicField(this, "handleClick", () => {
        var _a2, _b2;
        const { xoName } = this.options;
        const duration = Number((_a2 = this.providerElement) == null ? void 0 : _a2.getAttribute("xo-duration")) || Number((_b2 = document.querySelector(`${WebComponent.Collapse}[xo-name="${xoName}"]`)) == null ? void 0 : _b2.getAttribute("xo-duration")) || 300;
        const delay2 = duration;
        const now = Date.now();
        if (now - last$1 < delay2) {
          return;
        }
        last$1 = now;
        if (hasProvider$1(this.providerElement)) {
          this.handleCollapseHasProvider();
        } else {
          this.handleCollapse();
        }
      });
    }
    get componentName() {
      return WebComponent.CollapseTrigger;
    }
    get options() {
      return {
        ..._CollapseTrigger.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    setOptions() {
      const options = getAttrs(this, {
        pick: ["xoName"],
        types: {
          xoName: "string"
        }
      });
      if (hasProvider$1(this.providerElement)) {
        const id2 = Array.from(this.providerElement.querySelectorAll(WebComponent.CollapseTrigger)).indexOf(this);
        const autoOptions = {
          xoName: `${this.providerElement.xoName}-${id2}`
        };
        this.options = {
          ..._CollapseTrigger.defaultOptions,
          ...autoOptions,
          ...options
        };
      } else {
        this.options = {
          ..._CollapseTrigger.defaultOptions,
          ...options
        };
      }
    }
    get providerElement() {
      return this.closest(WebComponent.CollapseProvider);
    }
    onConnected() {
      var _a2;
      this.setOptions();
      if ((_a2 = this.providerElement) == null ? void 0 : _a2.xoName) {
        const id2 = Array.from(this.providerElement.querySelectorAll(WebComponent.CollapseTrigger)).indexOf(this);
        this.xoNameProp = `${this.providerElement.xoName}-${id2}`;
      }
      const { xoName } = this.options;
      checkAttr(this.componentName, "xo-name", xoName);
      xoStore.set("xo-collapse", (prevState) => {
        var _a3, _b2;
        return {
          ...prevState,
          [xoName]: {
            ...prevState == null ? void 0 : prevState[xoName],
            isOpen: (_b2 = (_a3 = prevState == null ? void 0 : prevState[xoName]) == null ? void 0 : _a3.isOpen) != null ? _b2 : false
          }
        };
      });
      this.addEventListener("click", this.handleClick);
    }
    disconnectedCallback() {
      this.removeEventListener("click", this.handleClick);
    }
  };
  let CollapseTrigger = _CollapseTrigger;
  __publicField(CollapseTrigger, "defaultOptions", {
    xoName: null
  });
  let id$3 = 0;
  class CollapseProvider extends XoHTMLElement {
    constructor() {
      super();
      __publicField(this, "xoName");
      id$3++;
      this.xoName = `collapse-${id$3}`;
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue !== newValue) {
        const triggerEls = Array.from(this.querySelectorAll(WebComponent.CollapseTrigger));
        const contentEls = Array.from(this.querySelectorAll(WebComponent.Collapse));
        each([...triggerEls, ...contentEls], (el) => {
          el.setAttribute("xo-observed", newValue);
        });
      }
    }
  }
  xoStore.create("xo-collapse", {
    initialState: {}
  });
  const styles$o = "";
  window.xoCollapse = xoCollapse;
  componentDefine({
    [WebComponent.CollapseProvider]: CollapseProvider,
    [WebComponent.CollapseTrigger]: CollapseTrigger,
    [WebComponent.Collapse]: Collapse
  });
  function hasProvider(providerEl) {
    return providerEl && providerEl.tagName.toLowerCase() === WebComponent.Tabs;
  }
  const _TabsPane = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", null);
      __publicField(this, "listener", (state) => {
        const { xoName } = this.options;
        checkAttr(this.componentName, "xo-name", xoName);
        if (state[this.providerElement.xoName]) {
          const { name: nameActive } = state[this.providerElement.xoName];
          toggleA11y(this, nameActive !== xoName);
          attrBoolean.set(this, "xo-active", nameActive === xoName);
          if (nameActive === xoName) {
            loadImages(this);
          }
        }
      });
    }
    get componentName() {
      return WebComponent.TabsPane;
    }
    get providerElement() {
      return this.closest(WebComponent.Tabs);
    }
    get options() {
      const options = getAttrs(this, {
        pick: ["xoName"],
        types: {
          xoName: "string"
        }
      });
      return {
        ..._TabsPane.defaultOptions,
        ...options
      };
    }
    onConnected() {
      const { xoName } = this.options;
      checkAttr(this.componentName, "xo-name", xoName);
      if (!hasProvider(this.providerElement)) {
        throwError(`The ${this.componentName} component must be a child of the ${WebComponent.Tabs} component`);
      }
      this.unsubscribe = xoStore.subscribe("xo-tabs", this.listener);
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this.unsubscribe) == null ? void 0 : _a2.call(this);
    }
  };
  let TabsPane = _TabsPane;
  __publicField(TabsPane, "defaultOptions", {
    xoName: null
  });
  function createState$5() {
    xoStore.create("xo-tabs", {
      initialState: {}
    });
  }
  function setActive(providerName, { name, width = 0, left, triggerElement }) {
    xoStore.set("xo-tabs", (state) => {
      var _a2, _b2, _c2, _d2;
      return {
        ...state,
        [providerName]: {
          ...state[providerName],
          name,
          width: width == null ? (_b2 = (_a2 = state[providerName]) == null ? void 0 : _a2.width) != null ? _b2 : 0 : width,
          left: left == null ? (_d2 = (_c2 = state[providerName]) == null ? void 0 : _c2.left) != null ? _d2 : 0 : left,
          triggerElement
        }
      };
    });
  }
  const xoTabs = {
    active: setActive
  };
  const _TabsTrigger = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", null);
      __publicField(this, "unsubscribe2", null);
      __publicField(this, "providerName", null);
      __publicField(this, "_options");
      __publicField(this, "setOptions", () => {
        this.options = getAttrs(this, {
          pick: ["xoName", "xoTrigger", "xoActive"],
          types: {
            xoName: "string",
            xoTrigger: "string",
            xoActive: "boolean"
          }
        });
      });
      __publicField(this, "listener", (state) => {
        const { xoName } = this.options;
        checkAttr(this.componentName, "xo-name", xoName);
        if (this.providerName && state[this.providerName]) {
          const { name: nameActive } = state[this.providerName];
          attrBoolean.set(this, "xo-active", nameActive === xoName);
          bindingHelper(this, "xo-active-binding", nameActive === xoName);
        }
      });
      __publicField(this, "modalListener", ({ data }) => {
        var _a2;
        const modalName = (_a2 = this.closest(WebComponent.Modal)) == null ? void 0 : _a2.options.xoName;
        if (modalName && data[modalName]) {
          const { isOpen } = data[modalName];
          if (isOpen && attrBoolean.get(this, "xo-active")) {
            this.handleActive();
          }
        }
      });
      __publicField(this, "handleActive", async (event) => {
        const { xoName } = this.options;
        checkAttr(this.componentName, "xo-name", xoName);
        await delay(0);
        if (this.providerName) {
          if (this.providerElement) {
            const tabsActiveEl = this.providerElement.querySelector(WebComponent.TabsActive);
            const wrapperTabsActiveEl = tabsActiveEl == null ? void 0 : tabsActiveEl.parentElement;
            const left = wrapperTabsActiveEl ? offset(this).left - offset(wrapperTabsActiveEl).left : 0;
            if (wrapperTabsActiveEl && window.getComputedStyle(wrapperTabsActiveEl).position === "static") {
              wrapperTabsActiveEl.style.position = "relative";
            }
            setActive(this.providerName, {
              name: xoName,
              left,
              width: this.offsetWidth,
              triggerElement: this
            });
          } else {
            const listPortalEls = Array.from(document.querySelectorAll(WebComponent.ListPortal));
            each(listPortalEls, (listPortalEl) => {
              if (event && event.target instanceof HTMLElement && listPortalEl.contains(event.target)) {
                const targetEl = event.currentTarget;
                const id2 = setTimeout(() => {
                  if (this.providerName) {
                    setActive(this.providerName, {
                      name: xoName,
                      width: targetEl.offsetWidth,
                      left: targetEl.offsetLeft,
                      triggerElement: this
                    });
                  }
                  clearTimeout(id2);
                }, 0);
              }
            });
          }
        }
      });
      __publicField(this, "addTrigger", () => {
        if (this.options.xoTrigger === "hover" && !device.mobile()) {
          this.addEventListener("mouseenter", this.handleActive);
        } else {
          this.addEventListener("click", this.handleActive);
        }
      });
      __publicField(this, "removeTrigger", () => {
        this.removeEventListener("mouseenter", this.handleActive);
        this.removeEventListener("click", this.handleActive);
      });
    }
    get componentName() {
      return WebComponent.TabsTrigger;
    }
    get providerElement() {
      return this.closest(WebComponent.Tabs);
    }
    get options() {
      return {
        ..._TabsTrigger.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    onConnected() {
      var _a2;
      this.setOptions();
      if ((_a2 = this.providerElement) == null ? void 0 : _a2.xoName) {
        this.providerName = this.providerElement.xoName;
      }
      if (attrBoolean.get(this, "xo-active")) {
        this.handleActive();
      }
      this.unsubscribe = xoStore.subscribe("xo-tabs", this.listener);
      this.unsubscribe2 = xoStore.subscribe("xo-modal", this.modalListener);
      this.addTrigger();
    }
    disconnectedCallback() {
      var _a2, _b2;
      this.removeTrigger();
      (_a2 = this.unsubscribe) == null ? void 0 : _a2.call(this);
      (_b2 = this.unsubscribe2) == null ? void 0 : _b2.call(this);
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      var _a2;
      if (name === "xo-observed" && oldValue !== newValue) {
        await delay(100);
        this.setOptions();
        if ((_a2 = this.providerElement) == null ? void 0 : _a2.xoName) {
          this.providerName = this.providerElement.xoName;
        }
        if (attrBoolean.get(this, "xo-active")) {
          this.handleActive();
        }
        this.removeTrigger();
        this.addTrigger();
        this.listener(xoStore.get("xo-tabs"));
      }
    }
  };
  let TabsTrigger = _TabsTrigger;
  __publicField(TabsTrigger, "defaultOptions", {
    xoName: null,
    xoTrigger: "click"
  });
  let id$2 = 0;
  class Tabs extends XoHTMLElement {
    constructor() {
      super();
      __publicField(this, "xoName");
      __publicField(this, "unsubscribe", () => {
      });
      id$2++;
      this.xoName = `tabs-${id$2}`;
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    onConnected() {
      const modalEl = this.closest(WebComponent.Modal);
      if (!modalEl) {
        attrBoolean.set(this, "xo-ready", true);
      }
    }
    disconnectedCallback() {
      this.unsubscribe();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue != null && oldValue !== newValue) {
        const tabsActiveEls = Array.from(this.querySelectorAll(WebComponent.TabsActive));
        const tabsTriggerEls = Array.from(this.querySelectorAll(WebComponent.TabsTrigger));
        const tabsPaneEls = Array.from(this.querySelectorAll(WebComponent.TabsPane));
        each([...tabsActiveEls, ...tabsTriggerEls, ...tabsPaneEls], (el) => {
          el.setAttribute("xo-observed", newValue);
        });
      }
    }
  }
  const _TabsActive = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "animated", createAnimate());
      __publicField(this, "prevLeft", 0);
      __publicField(this, "prevWidth", 0);
      __publicField(this, "initialized", false);
      __publicField(this, "_options");
      __publicField(this, "setOptions", () => {
        this.options = getAttrs(this, {
          pick: ["xoDuration", "xoEasing"],
          types: {
            xoDuration: "number",
            xoEasing: "string"
          }
        });
      });
      __publicField(this, "listener", (state) => {
        const { xoDuration, xoEasing } = this.options;
        if (hasProvider(this.providerElement) && state[this.providerElement.xoName]) {
          const { width = 0, left = 0 } = state[this.providerElement.xoName];
          if (!this.initialized) {
            this.style.width = `${width}px`;
            this.style.transform = `translateX(${left}px)`;
            this.prevLeft = left;
            this.prevWidth = width;
          } else {
            const threshold = 100;
            const _left = left + threshold;
            this.animated.off();
            this.animated({
              from: this.prevLeft,
              to: _left,
              duration: xoDuration,
              onUpdate: (value) => {
                const widthAnimated = interpolate({
                  value,
                  inputRange: [this.prevLeft, _left],
                  outputRange: [this.prevWidth, width],
                  reverseEasing: this.prevLeft > left,
                  easing: easings[xoEasing]
                });
                const xAnimated = interpolate({
                  value,
                  inputRange: [this.prevLeft, _left],
                  outputRange: [this.prevLeft, left],
                  reverseEasing: this.prevLeft > left,
                  easing: easings[xoEasing]
                });
                this.style.width = `${widthAnimated}px`;
                this.style.transform = `translateX(${xAnimated}px)`;
              },
              onEnd: () => {
                this.prevLeft = left;
                this.prevWidth = width;
              }
            });
          }
          this.initialized = true;
        }
      });
    }
    get options() {
      return {
        ..._TabsActive.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    get providerElement() {
      return this.closest(WebComponent.Tabs);
    }
    onConnected() {
      this.setOptions();
      this.unsubscribe = xoStore.subscribe("xo-tabs", this.listener);
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.animated.off();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue !== newValue) {
        this.setOptions();
        this.initialized = false;
        this.listener(xoStore.get("xo-tabs") || {});
      }
    }
  };
  let TabsActive = _TabsActive;
  __publicField(TabsActive, "defaultOptions", {
    xoDuration: 200,
    xoEasing: "ease"
  });
  const styles$n = "";
  createState$5();
  window.xoTabs = xoTabs;
  componentDefine({
    [WebComponent.Tabs]: Tabs,
    [WebComponent.TabsActive]: TabsActive,
    [WebComponent.TabsTrigger]: TabsTrigger,
    [WebComponent.TabsPane]: TabsPane
  });
  const _ParallaxScroll = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "keyframes", {});
      __publicField(this, "parallax", null);
      __publicField(this, "setStyleCallback", null);
      __publicField(this, "from", 0);
      __publicField(this, "to", 0);
      __publicField(this, "compiledExpressions", /* @__PURE__ */ new Map());
      __publicField(this, "customEffects", (callback) => {
        this.setStyleCallback = callback;
      });
      __publicField(this, "evaluate", (code, containerEl) => {
        if (_ParallaxScroll.BLOCKED_PATTERNS.test(code)) {
          console.error(`[xo-parallax-scroll] Blocked unsafe expression: "${code}"`);
          return 0;
        }
        if (!this.compiledExpressions.has(code)) {
          const fn2 = new Function("window", "document", "container", "offset", `return ${code}`);
          this.compiledExpressions.set(code, fn2);
        }
        const fn = this.compiledExpressions.get(code);
        const result = fn.call(this, window, document, containerEl, offset);
        return result;
      });
      __publicField(this, "getStart", (containerEl) => {
        const { xoStart } = this.getOptions();
        if (!xoStart) {
          return offset(containerEl).top - window.innerHeight;
        }
        return this.evaluate(xoStart, containerEl);
      });
      __publicField(this, "getEnd", (containerEl) => {
        const { xoEnd } = this.getOptions();
        if (!xoEnd) {
          return offset(containerEl).top + containerEl.offsetHeight;
        }
        return this.evaluate(xoEnd, containerEl) - window.innerHeight;
      });
      __publicField(this, "handleParallaxEnd", () => {
        const containerEl = this.closest(`${WebComponent.Parallax}, [${WebComponent.Parallax}]`);
        if (containerEl) {
          frameManager.add(() => {
            this.from = this.getStart(containerEl);
          });
          frameManager.add(() => {
            this.to = this.getEnd(containerEl);
          });
        }
      });
      __publicField(this, "init", async () => {
        const containerEl = this.closest(`${WebComponent.Parallax}, [${WebComponent.Parallax}]`);
        if (!this.getAttribute("xo-keyframes")) {
          throwError(`The ${WebComponent.ParallaxScroll} component must have the "xo-keyframes" attribute`);
        }
        if (containerEl && (containerEl.localName === WebComponent.Parallax || containerEl.hasAttribute(WebComponent.Parallax))) {
          const { xoLerpEase = 0.08, xoBackfaceVisibility = "hidden", xoFitContent, xoStepMode } = this.getOptions();
          if (xoBackfaceVisibility === "hidden") {
            this.style.backfaceVisibility = "hidden";
          }
          if (xoFitContent == null) {
            attrBoolean.set(this, "xo-fit-content", true);
          }
          this.addEventListener("xo:parallax:end", this.handleParallaxEnd);
          this.dispatchEvent(new CustomEvent("xo:parallax-scroll:init", { bubbles: true }));
          await delay(50);
          this.setKeyframes();
          this.parallax = parallaxScroll({
            root: containerEl,
            lerpEase: device.mobile() ? 1 : xoLerpEase,
            stepMode: xoStepMode,
            setStyles: ({ element, createValue, EMPTY }) => {
              var _a2;
              (_a2 = this.setStyleCallback) == null ? void 0 : _a2.call(this, { element, createValue, EMPTY });
            }
          });
          frameManager.add(() => {
            this.from = this.getStart(containerEl);
          });
          frameManager.add(() => {
            this.to = this.getEnd(containerEl);
          });
          this.parallax.add(this, {
            from: () => this.from,
            to: () => this.to,
            keyframes: this.keyframes
          }).run();
        }
      });
      __publicField(this, "handleResize", debounce(resizeAxis("x", () => {
        var _a2;
        (_a2 = this.parallax) == null ? void 0 : _a2.destroy();
        this.init();
      }), 500));
    }
    static get observedAttributes() {
      return ["xo-observed", "xo-keyframes", "xo-breakpoints", "xo-lerp-ease", "xo-backface-visibility", "xo-fit-content"];
    }
    getOptions() {
      const options = getAttrs(this, {
        pick: ["xoKeyframes", "xoBreakpoints", "xoLerpEase", "xoBackfaceVisibility", "xoFitContent", "xoStart", "xoEnd", "xoStepMode", "xoMobileDisabled"],
        types: {
          xoKeyframes: "object",
          xoBreakpoints: "object",
          xoLerpEase: "number",
          xoBackfaceVisibility: "string",
          xoFitContent: "boolean",
          xoStart: "string",
          xoEnd: "string",
          xoStepMode: "boolean",
          xoMobileDisabled: "boolean"
        }
      });
      return options;
    }
    setKeyframes() {
      var _a2;
      const { xoKeyframes, xoBreakpoints } = this.getOptions();
      this.keyframes = (_a2 = getBreakpointsOptions(xoBreakpoints)) != null ? _a2 : xoKeyframes;
    }
    onConnected() {
      const { xoMobileDisabled } = this.getOptions();
      if (xoMobileDisabled && device.mobile()) {
        return;
      }
      if (device.mobile() && reduceMotion()) {
        return;
      }
      this.init();
      this.dispatchEvent(new CustomEvent("xo:parallax-scroll:init", { bubbles: true }));
      window.addEventListener("resize", this.handleResize);
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this.parallax) == null ? void 0 : _a2.destroy();
      window.removeEventListener("resize", this.handleResize);
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if ((name === "xo-observed" || name === "xo-keyframes" || name === "xo-breakpoints" || name === "xo-lerp-ease" || name === "xo-backface-visibility") && oldValue != null && oldValue !== newValue) {
        await delay(100);
        this.disconnectedCallback();
        this.onConnected();
      }
    }
  };
  let ParallaxScroll = _ParallaxScroll;
  __publicField(ParallaxScroll, "BLOCKED_PATTERNS", /\b(fetch|XMLHttpRequest|eval|Function|import|document\.cookie|localStorage|sessionStorage|window\.location|indexedDB|WebSocket|EventSource|navigator\.sendBeacon)\b/);
  const DEFAULT_FPS$2 = 60;
  const DT_FPS$2 = 1e3 / DEFAULT_FPS$2;
  const _ParallaxHover = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "shadow", this.attachShadow({ mode: "open" }));
      __publicField(this, "providerEl", null);
      __publicField(this, "targetValueX", 0);
      __publicField(this, "targetValueY", 0);
      __publicField(this, "currentValueX", 0);
      __publicField(this, "currentValueY", 0);
      __publicField(this, "handleFrameUpdate", ({ delta }) => {
        var _a2;
        const diffX = Math.abs(this.targetValueX - this.currentValueX);
        const diffY = Math.abs(this.targetValueY - this.currentValueY);
        if (diffX < 1e-3 && diffY < 1e-3) {
          frameManager.remove(this.handleFrameUpdate).remove(this.handleFrameRender);
          return;
        }
        let slowDown = delta / DT_FPS$2;
        const slowDownRounded = Math.round(slowDown);
        if (slowDownRounded >= 1) {
          slowDown = slowDownRounded;
        }
        const lerpEase = Number(((_a2 = this.providerEl) == null ? void 0 : _a2.getAttribute("xo-lerp-ease")) || "0.08");
        const valueX = lerp(this.currentValueX, this.targetValueX, lerpEase * slowDown);
        const valueY = lerp(this.currentValueY, this.targetValueY, lerpEase * slowDown);
        this.currentValueX = valueX;
        this.currentValueY = valueY;
      });
      __publicField(this, "handleFrameRender", () => {
        const { xoStrength, xo3d } = this.getOptions();
        const innerEl = this.shadow.querySelector(WebComponent.ParallaxHoverInner);
        if (xo3d) {
          const constant = 4;
          innerEl.style.transformStyle = "preserve-3d";
          innerEl.style.transform = `perspective(2000px) rotateX(${-this.currentValueY / constant * xoStrength}deg) rotateY(${this.currentValueX / constant * xoStrength}deg)`;
        } else {
          innerEl.style.transform = `translate3d(${this.currentValueX * xoStrength}px, ${this.currentValueY * xoStrength}px, 0)`;
        }
      });
      __publicField(this, "setTargetValue", (event, left, top, width, height) => {
        const centerX = offset(this).left + this.offsetWidth / 2;
        const centerY = offset(this).top + this.offsetHeight / 2;
        this.targetValueX = interpolate({
          value: event.pageX - left,
          inputRange: [0, centerX - left, width],
          outputRange: [-1, 0, 1]
        });
        this.targetValueY = interpolate({
          value: event.pageY - top,
          inputRange: [0, centerY - top, height],
          outputRange: [-1, 0, 1]
        });
      });
      __publicField(this, "handleMouseMove", (event) => {
        const providerLeft = offset(this.providerEl).left;
        const providerTop = offset(this.providerEl).top;
        const providerWidth = this.providerEl.offsetWidth;
        const providerHeight = this.providerEl.offsetHeight;
        this.setTargetValue(event, providerLeft, providerTop, providerWidth, providerHeight);
        if (!frameManager.has(this.handleFrameUpdate)) {
          frameManager.add(this.handleFrameUpdate, true);
        }
        if (!frameManager.has(this.handleFrameRender)) {
          frameManager.add(this.handleFrameRender, true);
        }
      });
      __publicField(this, "handleMouseLeave", () => {
        const { xoResetPosition } = this.getOptions();
        if (xoResetPosition) {
          this.targetValueX = 0;
          this.targetValueY = 0;
        }
      });
    }
    static get observedAttributes() {
      return ["xo-observed", "xo-strength", "xo-reset-position", "xo-3d", "xo-inner-width"];
    }
    getOptions() {
      const options = getAttrs(this, {
        pick: ["xoStrength", "xoResetPosition", "xo3d", "xoInnerWidth"],
        types: {
          xoStrength: "number",
          xoResetPosition: "boolean",
          xo3d: "boolean",
          xoInnerWidth: "string"
        }
      });
      return {
        ..._ParallaxHover.defaultOptions,
        ...options
      };
    }
    onConnected() {
      if (device.mobile() && reduceMotion()) {
        return;
      }
      this.providerEl = this.closest(`${WebComponent.Parallax}, [${WebComponent.Parallax}]`);
      if (!this.providerEl) {
        throw new Error(`The ${WebComponent.ParallaxHover} component must be a child of ${WebComponent.Parallax}`);
      }
      if (!this.shadow.innerHTML) {
        const { xoInnerWidth } = this.getOptions();
        this.shadow.innerHTML = `<${WebComponent.ParallaxHoverInner} part="inner" style="display: block; width: ${xoInnerWidth}"><slot></slot></${WebComponent.ParallaxHoverInner}>`;
      }
      this.providerEl.addEventListener("mousemove", this.handleMouseMove);
      this.providerEl.addEventListener("mouseleave", this.handleMouseLeave);
    }
    disconnectedCallback() {
      var _a2, _b2;
      frameManager.remove(this.handleFrameUpdate).remove(this.handleFrameRender);
      (_a2 = this.providerEl) == null ? void 0 : _a2.removeEventListener("mousemove", this.handleMouseMove);
      (_b2 = this.providerEl) == null ? void 0 : _b2.removeEventListener("mouseleave", this.handleMouseLeave);
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if ((name === "xo-observed" || name === "xo-strength" || name === "xo-reset-position" || name === "xo-3d" || name === "xo-inner-width") && oldValue !== newValue) {
        await delay(100);
        this.disconnectedCallback();
        this.onConnected();
      }
    }
  };
  let ParallaxHover = _ParallaxHover;
  __publicField(ParallaxHover, "defaultOptions", {
    xoStrength: 100,
    xoResetPosition: true,
    xo3d: false,
    xoInnerWidth: "fit-content"
  });
  const styles$m = "";
  componentDefine({
    [WebComponent.ParallaxScroll]: ParallaxScroll,
    [WebComponent.ParallaxHover]: ParallaxHover
  });
  function createState$4() {
    xoStore.create("xo-carousel", {
      initialState: {},
      useDeepEqual: true
    });
  }
  function setOptions(name, options) {
    xoStore.set("xo-carousel", (prevState) => {
      return {
        ...prevState,
        [name]: {
          ...prevState[name],
          options
        }
      };
    });
  }
  function setThumbnailOptions(name, thumbnailOptions) {
    xoStore.set("xo-carousel", (prevState) => {
      return {
        ...prevState,
        [name]: {
          ...prevState[name],
          thumbnailOptions
        }
      };
    });
  }
  function setContainerSize(name, width, height) {
    xoStore.set("xo-carousel", (prevState) => {
      return {
        ...prevState,
        [name]: {
          ...prevState[name],
          containerWidth: width,
          containerHeight: height
        }
      };
    });
  }
  function setSlideLength(name, slideLength) {
    xoStore.set("xo-carousel", (prevState) => {
      return {
        ...prevState,
        [name]: {
          ...prevState[name],
          slideLength
        }
      };
    });
  }
  function nextSlide(names, next2) {
    each(names, (name) => {
      xoStore.set("xo-carousel", (prevState) => {
        var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l2, _m2, _n2, _o2, _p2, _q2;
        const slideLength = (_b2 = (_a2 = prevState[name]) == null ? void 0 : _a2.slideLength) != null ? _b2 : 0;
        const perView = (_e2 = (_d2 = (_c2 = prevState[name]) == null ? void 0 : _c2.options) == null ? void 0 : _d2.xoPerView) != null ? _e2 : 0;
        const rewind = (_h2 = (_g2 = (_f2 = prevState[name]) == null ? void 0 : _f2.options) == null ? void 0 : _g2.xoRewind) != null ? _h2 : false;
        const loopFade = ((_k2 = (_j2 = (_i2 = prevState[name]) == null ? void 0 : _i2.options) == null ? void 0 : _j2.xoLoop) != null ? _k2 : false) && ((_m2 = (_l2 = prevState[name]) == null ? void 0 : _l2.options) == null ? void 0 : _m2.xoType) !== "slide";
        const prevActiveIndex = (_o2 = (_n2 = prevState[name]) == null ? void 0 : _n2.activeIndex) != null ? _o2 : 0;
        const prevThumbnailActiveIndex = (_q2 = (_p2 = prevState[name]) == null ? void 0 : _p2.thumbnailActiveIndex) != null ? _q2 : 0;
        let activeIndex = loopFade ? wrapAroundRange(prevActiveIndex + next2, 0, slideLength - perView) : clamp(prevActiveIndex + next2, 0, slideLength - perView);
        let thumbnailActiveIndex = clamp(prevThumbnailActiveIndex + next2, 0, slideLength - 1);
        if (rewind && prevActiveIndex === slideLength - perView) {
          activeIndex = 0;
        }
        if (rewind && prevThumbnailActiveIndex === slideLength - 1) {
          thumbnailActiveIndex = 0;
        }
        return {
          ...prevState,
          [name]: {
            ...prevState[name],
            activeIndex,
            thumbnailActiveIndex,
            useAnimated: true,
            timestamp: Date.now()
          }
        };
      })("xo-carousel/nextSlide");
    });
  }
  function prevSlide(names, prev2) {
    each(names, (name) => {
      xoStore.set("xo-carousel", (prevState) => {
        var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l2, _m2, _n2, _o2;
        const perView = (_c2 = (_b2 = (_a2 = prevState[name]) == null ? void 0 : _a2.options) == null ? void 0 : _b2.xoPerView) != null ? _c2 : 0;
        const slideLength = (_e2 = (_d2 = prevState[name]) == null ? void 0 : _d2.slideLength) != null ? _e2 : perView;
        const prevActiveIndex = (_g2 = (_f2 = prevState[name]) == null ? void 0 : _f2.activeIndex) != null ? _g2 : 0;
        const rewind = (_j2 = (_i2 = (_h2 = prevState[name]) == null ? void 0 : _h2.options) == null ? void 0 : _i2.xoRewind) != null ? _j2 : false;
        const loopFade = ((_m2 = (_l2 = (_k2 = prevState[name]) == null ? void 0 : _k2.options) == null ? void 0 : _l2.xoLoop) != null ? _m2 : false) && ((_o2 = (_n2 = prevState[name]) == null ? void 0 : _n2.options) == null ? void 0 : _o2.xoType) !== "slide";
        let activeIndex = loopFade ? wrapAroundRange(prevActiveIndex - prev2, 0, slideLength - perView) : Math.max(prevActiveIndex - prev2, 0);
        if (rewind && prevActiveIndex === 0) {
          activeIndex = slideLength - perView;
        }
        return {
          ...prevState,
          [name]: {
            ...prevState[name],
            activeIndex,
            thumbnailActiveIndex: activeIndex,
            useAnimated: true,
            timestamp: Date.now()
          }
        };
      })("xo-carousel/prevSlide");
    });
  }
  function goToSlide(names, index, useAnimated) {
    each(names, (name) => {
      xoStore.set("xo-carousel", (prevState) => {
        var _a2, _b2, _c2, _d2, _e2;
        const perView = (_c2 = (_b2 = (_a2 = prevState[name]) == null ? void 0 : _a2.options) == null ? void 0 : _b2.xoPerView) != null ? _c2 : 0;
        const slideLength = (_e2 = (_d2 = prevState[name]) == null ? void 0 : _d2.slideLength) != null ? _e2 : perView;
        let activeIndex = clamp(index, 0, slideLength - perView);
        let thumbnailActiveIndex = clamp(index, 0, slideLength - 1);
        return {
          ...prevState,
          [name]: {
            ...prevState[name],
            activeIndex,
            thumbnailActiveIndex,
            useAnimated,
            timestamp: Date.now()
          }
        };
      })("xo-carousel/goToSlide");
    });
  }
  function getState$3(name) {
    var _a2;
    return {
      ...{ activeIndex: 0, thumbnailActiveIndex: 0 },
      ...(_a2 = xoStore.get("xo-carousel")) == null ? void 0 : _a2[name]
    };
  }
  function subscribe$4(name, listener, equalParam) {
    return xoStore.subscribe("xo-carousel", (state) => listener(state[name]), (prevState, nextState) => {
      if (equalParam) {
        return equalParam(prevState, nextState);
      }
      return equal(prevState == null ? void 0 : prevState[name], nextState == null ? void 0 : nextState[name]);
    });
  }
  const publicMethod = {
    next: (name, next2) => nextSlide([name], next2),
    prev: (name, next2) => prevSlide([name], next2),
    goTo: (name, index) => {
      const { options } = getState$3(name);
      let activeIndex = index;
      if (options.xoLoop) {
        activeIndex = index + options.xoPerView * 2;
      }
      goToSlide([name], activeIndex, true);
    }
  };
  const publicEvent = {
    init: (el, options) => {
      el.dispatchEvent(new CustomEvent("xo:carousel:init", { bubbles: false, detail: options }));
    },
    change: (el, activeIndex) => {
      el.dispatchEvent(new CustomEvent("xo:carousel:change", { bubbles: false, detail: { activeIndex } }));
    },
    destroy: (el) => {
      el.dispatchEvent(new CustomEvent("xo:carousel:destroy", { bubbles: false }));
    },
    resize: (el, width, height) => {
      el.dispatchEvent(new CustomEvent("xo:carousel:resize", { bubbles: false, detail: { width, height } }));
    }
  };
  const RESIZE_DELAY$2 = window.navigator.hardwareConcurrency === 4 ? 1e3 : 500;
  const displayCache = /* @__PURE__ */ new Map();
  function getOuterHeight(el) {
    var _a2;
    if (!displayCache.has(el)) {
      displayCache.set(el, window.getComputedStyle(el).display);
    }
    const height = displayCache.get(el) === "contents" ? (_a2 = el.children[0]) == null ? void 0 : _a2.scrollHeight : el.offsetHeight;
    const style = getComputedStyle(el);
    const marginTop = parseInt(style.marginTop || "0", 10);
    const marginBottom = parseInt(style.marginBottom || "0", 10);
    const { boxShadow } = window.getComputedStyle(el);
    const [_, one, two] = boxShadow.split(" ").reverse();
    const boxShadowNum = parseInt(one || "0", 10) + parseInt(two || "0", 10);
    return height + marginTop + marginBottom + boxShadowNum;
  }
  function fixPopoverClone(el) {
    const popoverEls = Array.from(el.querySelectorAll(`${WebComponent.Popover}, ${WebComponent.PopoverTrigger}`));
    each(popoverEls, (popoverEl) => {
      const name = popoverEl.getAttribute("xo-name");
      popoverEl.setAttribute("xo-name", `${name}-${Date.now()}`);
    });
  }
  function cloneSlides(el, xoPerView) {
    const slideEls = Array.from(el.children);
    const fistSlideEls = [...slideEls.slice(0, xoPerView * 2), ...slideEls.slice(0, xoPerView * 2)];
    const lastSlideEls = [...slideEls.slice(-xoPerView * 2), ...slideEls.slice(-xoPerView * 2)];
    each(fistSlideEls, (slideEl, index) => {
      const isSlide = slideEl.tagName.toLowerCase() === WebComponent.CarouselSlide || slideEl.hasAttribute(WebComponent.CarouselSlide);
      if (index < xoPerView * 2 && isSlide) {
        const cloneEl = slideEl.cloneNode(true);
        cloneEl.removeAttribute("xo-active");
        cloneEl.removeAttribute("xo-center");
        cloneEl.removeAttribute("xo-next");
        cloneEl.removeAttribute("xo-prev");
        removeColorSchemeAddedAttr(cloneEl);
        attrBoolean.set(cloneEl, "xo-cloned", true);
        fixPopoverClone(cloneEl);
        el.appendChild(cloneEl);
      }
    });
    each(lastSlideEls, (slideEl, index) => {
      const isSlide = slideEl.tagName.toLowerCase() === WebComponent.CarouselSlide || slideEl.hasAttribute(WebComponent.CarouselSlide);
      if (index >= lastSlideEls.length - xoPerView * 2 && isSlide) {
        const cloneEl = slideEl.cloneNode(true);
        cloneEl.removeAttribute("xo-active");
        cloneEl.removeAttribute("xo-visible");
        removeColorSchemeAddedAttr(cloneEl);
        attrBoolean.set(cloneEl, "xo-cloned", true);
        fixPopoverClone(cloneEl);
        el.insertBefore(cloneEl, slideEls[0]);
      }
    });
  }
  let navLast = 0;
  function setNavLast(now) {
    navLast = now;
  }
  function getNavLast() {
    return navLast;
  }
  function getNames(el) {
    if (el.options.xoSyncId) {
      const els = Array.from(document.querySelectorAll(`${WebComponent.Carousel}[xo-sync-id="${el.options.xoSyncId}"]`));
      return els.map((el2) => el2.xoName);
    }
    return [el.xoName];
  }
  function getProviderElement(el) {
    var _a2;
    const carousel = el.closest(WebComponent.Carousel);
    if (!carousel) {
      const sectionId = ((_a2 = el.closest("[xo-section-id]")) == null ? void 0 : _a2.getAttribute("xo-section-id")) || getShopifySectionId(el);
      if (sectionId) {
        const carousel2 = document.querySelector(`${WebComponent.Carousel}[xo-name=${sectionId}]`);
        return carousel2;
      }
      return null;
    }
    return carousel;
  }
  function getShaderSvg() {
    return `
    <svg id="xo-carousel-filter" class="xo-hidden">
      <filter id="xo-carousel-filter-wind" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
        <feDisplacementMap in="SourceGraphic" in2="blurred" scale="50" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  `;
  }
  const masks = {
    nature: "https://raw.githubusercontent.com/long-hp/storage/main/nature-sprite.png",
    water: "https://raw.githubusercontent.com/long-hp/storage/main/nature-sprite-2.png",
    urban: "https://raw.githubusercontent.com/long-hp/storage/main/urban-sprite.png"
  };
  let id$1 = 0;
  const _Carousel = class extends XoHTMLElement {
    constructor() {
      super();
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "xoName");
      __publicField(this, "_options");
      __publicField(this, "prevActiveIndex", -1);
      __publicField(this, "animated", createAnimate());
      __publicField(this, "resizeObserver", null);
      __publicField(this, "intersectionObserver", null);
      __publicField(this, "prevWidth", 0);
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "timeId1", -1);
      __publicField(this, "timeId2", -1);
      __publicField(this, "debounce", createDebounce());
      __publicField(this, "setOptions", () => {
        var _a2;
        this.options = getAttrs(this, {
          pick: [
            "xoName",
            "xoActiveIndex",
            "xoPerView",
            "xoPerMove",
            "xoGap",
            "xoSpeed",
            "xoEasing",
            "xoOverflow",
            "xoVertical",
            "xoAutoplay",
            "xoHoverPause",
            "xoRewind",
            "xoRtl",
            "xoBreakpoints",
            "xoRenderBullet",
            "xoAutoheight",
            "xoType",
            "xoLoop",
            "xoColumnWidth",
            "xoStopAutoplayOnInteraction",
            "xoProgress",
            "xoSyncId",
            "xoDragable"
          ],
          types: {
            xoName: "string",
            xoActiveIndex: "number",
            xoPerView: "number",
            xoPerMove: "number",
            xoGap: "number",
            xoSpeed: "number",
            xoEasing: "string",
            xoOverflow: "string",
            xoVertical: "boolean",
            xoAutoplay: "number",
            xoHoverPause: "boolean",
            xoRewind: "boolean",
            xoRtl: "boolean",
            xoBreakpoints: "object",
            xoRenderBullet: "string",
            xoAutoheight: "boolean",
            xoType: "string",
            xoLoop: "boolean",
            xoColumnWidth: "number",
            xoStopAutoplayOnInteraction: "boolean",
            xoProgress: "boolean",
            xoSyncId: "string",
            xoDragable: "boolean"
          }
        });
        if (((_a2 = { "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true }) == null ? void 0 : _a2.VITE_BUILD_MODE) === "xoSections") {
          this.options = { ...this.options, xoAutoplay: 0, xoLoop: false };
        }
      });
      __publicField(this, "setOptionsForStore", () => {
        var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
        const { xoBreakpoints, xoPerView, xoPerMove, xoGap, xoOverflow, xoType, xoColumnWidth, xoVertical, xoActiveIndex, xoAutoplay } = this.options;
        const breakpointOptions = getBreakpointsOptions(xoBreakpoints);
        const isSlide = xoType === "slide";
        const hasThumbnail = !!this.querySelector(WebComponent.CarouselThumbnail);
        const innerEl = this.querySelector(WebComponent.CarouselInner);
        const defaultAutoheight = this.closest(WebComponent.ProductMedia) ? false : true;
        let options = {
          ...this.options,
          xoPerView: isSlide ? (_a2 = breakpointOptions == null ? void 0 : breakpointOptions.perView) != null ? _a2 : xoPerView : 1,
          xoPerMove: isSlide ? (_b2 = breakpointOptions == null ? void 0 : breakpointOptions.perMove) != null ? _b2 : Math.min(xoPerMove, xoPerView) : 1,
          xoGap: isSlide ? (_c2 = breakpointOptions == null ? void 0 : breakpointOptions.gap) != null ? _c2 : xoGap : 0,
          xoAutoheight: isSlide ? this.options.xoAutoheight : defaultAutoheight,
          xoOverflow: (_d2 = breakpointOptions == null ? void 0 : breakpointOptions.overflow) != null ? _d2 : xoOverflow,
          xoVertical: (_e2 = breakpointOptions == null ? void 0 : breakpointOptions.vertical) != null ? _e2 : xoVertical,
          xoActiveIndex: (_f2 = breakpointOptions == null ? void 0 : breakpointOptions.activeIndex) != null ? _f2 : xoActiveIndex,
          xoAutoplay: (_g2 = breakpointOptions == null ? void 0 : breakpointOptions.autoplay) != null ? _g2 : xoAutoplay,
          xoRewind: this.options.xoRewind,
          xoLoop: hasThumbnail ? false : this.options.xoLoop
        };
        if (options.xoPerView && options.xoLoop && innerEl) {
          const slideLength = Array.from(innerEl.querySelector(WebComponent.CarouselList).children).length;
          if (slideLength <= options.xoPerView) {
            options = {
              ...options,
              xoLoop: false
            };
          }
        }
        if (!!xoColumnWidth) {
          const hasPerview = this.hasAttribute("xo-per-view");
          const temp = Math.floor((this.offsetWidth + xoGap) / (xoColumnWidth + xoGap));
          const perView = hasPerview ? Math.min(xoPerView, temp) : temp;
          options = {
            ...options,
            xoPerView: perView,
            xoPerMove: Math.min(perView, xoPerMove)
          };
        }
        setOptions(this.xoName, options);
        this.style.setProperty("--xo-per-view", `${options.xoPerView}`);
        this.style.setProperty("--xo-gap", `${options.xoGap}px`);
        this.style.setProperty("--xo-speed", `${options.xoSpeed}ms`);
        let loopLength = 0;
        if (options.xoLoop && options.xoType === "slide") {
          loopLength = options.xoPerView * 4;
        }
        if (innerEl) {
          setSlideLength(this.xoName, Array.from(innerEl.querySelector(WebComponent.CarouselList).children).filter((el) => !el.hasAttribute("xo-cloned")).length + loopLength);
          if (options.xoOverflow === "visible") {
            innerEl.style.overflow = "visible";
          } else {
            innerEl.style.overflow = "hidden";
          }
        }
        goToSlide(getNames(this), options.xoActiveIndex + (options.xoLoop && options.xoType === "slide" ? xoPerView * 2 : 0), true);
      });
      __publicField(this, "beautyBreakpoints", () => {
        const breakpointsAttr = this.getAttribute("xo-breakpoints");
        if (breakpointsAttr) {
          this.setAttribute("xo-breakpoints", breakpointsAttr.replace(/\s+/g, " ").trim());
        }
      });
      __publicField(this, "handleShader", async (isNext) => {
        const el = this.querySelector(WebComponent.CarouselFilterEffect);
        if (el) {
          const { xoSpeed } = this.options;
          clearTimeout(this.timeId1);
          clearTimeout(this.timeId2);
          el.removeAttribute("xo-effect");
          this.timeId1 = window.setTimeout(() => {
            el.setAttribute("xo-effect", isNext ? "next" : "prev");
            this.timeId2 = window.setTimeout(() => {
              el.removeAttribute("xo-effect");
            }, xoSpeed);
          }, 0);
        }
      });
      __publicField(this, "addShaderSvg", () => {
        const { xoType } = this.options;
        const innerEl = this.querySelector(WebComponent.CarouselInner);
        const isShader = /wind/g.test(xoType);
        if (isShader && !(innerEl == null ? void 0 : innerEl.querySelector(WebComponent.CarouselFilterEffect))) {
          const filterEl = document.createElement(WebComponent.CarouselFilterEffect);
          filterEl.style.setProperty("backdrop-filter", `url('#xo-carousel-filter-${xoType}')`);
          filterEl.setAttribute("xo-type", xoType);
          innerEl == null ? void 0 : innerEl.appendChild(filterEl);
        }
        if (isShader && !document.querySelector("#xo-carousel-filter")) {
          document.body.insertAdjacentHTML("beforeend", getShaderSvg());
        }
      });
      __publicField(this, "handleIntersection", (entries) => {
        for (let entry of entries) {
          if (entry.isIntersecting) {
            const { xoType } = this.options;
            if (["nature", "water", "urban"].includes(xoType)) {
              attrBoolean.set(this, "xo-mask-initialized", true);
              this.style.setProperty("--xo-mask", `url('${masks[xoType]}')`);
            }
          }
        }
      });
      __publicField(this, "init", () => {
        this.setOptionsForStore();
        frameManager.add(() => {
          this.addShaderSvg();
        });
        publicEvent.init(this, this.options);
      });
      __publicField(this, "handleResize", this.debounce((entries) => {
        for (let entry of entries) {
          const currentWidth = entry.contentRect.width;
          const currentHeight = entry.contentRect.height;
          if (currentWidth !== this.prevWidth) {
            this.init();
            this.prevWidth = currentWidth;
            publicEvent.resize(this, currentWidth, currentHeight);
          }
        }
      }, RESIZE_DELAY$2));
      __publicField(this, "renderNavigation", () => {
        var _a2, _b2, _c2;
        const sectionId = ((_a2 = this.closest("[xo-section-id]")) == null ? void 0 : _a2.getAttribute("xo-section-id")) || getShopifySectionId(this);
        if (this.getAttribute("xo-name") === sectionId) {
          const sectionEl = this.closest(".shopify-section");
          const prevHtml = (_b2 = sectionEl == null ? void 0 : sectionEl.querySelector(`template[${WebComponent.CarouselPrev}]`)) == null ? void 0 : _b2.innerHTML;
          const nextHtml = (_c2 = sectionEl == null ? void 0 : sectionEl.querySelector(`template[${WebComponent.CarouselNext}]`)) == null ? void 0 : _c2.innerHTML;
          const oldPrevEl = this.querySelector(WebComponent.CarouselPrev);
          const oldNextEl = this.querySelector(WebComponent.CarouselNext);
          oldPrevEl == null ? void 0 : oldPrevEl.remove();
          oldNextEl == null ? void 0 : oldNextEl.remove();
          if (prevHtml) {
            this.insertAdjacentHTML("beforeend", prevHtml);
          }
          if (nextHtml) {
            this.insertAdjacentHTML("beforeend", nextHtml);
          }
        }
      });
      id$1++;
      this.setOptions();
      if (this.options.xoName) {
        this.xoName = this.options.xoName;
      } else {
        this.xoName = `carousel-${id$1}`;
      }
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    get options() {
      return {
        ..._Carousel.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    onConnected() {
      var _a2;
      this.setOptions();
      if (((_a2 = { "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true }) == null ? void 0 : _a2.VITE_BUILD_MODE) === "xoSections") {
        if (this.options.xoName) {
          this.xoName = this.options.xoName;
        }
      }
      this.init();
      frameManager.add(() => {
        this.renderNavigation();
      });
      this.beautyBreakpoints();
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(this);
      this.intersectionObserver = new IntersectionObserver(this.handleIntersection, { rootMargin: "0px 0px -50px 0px" });
      this.intersectionObserver.observe(this);
      this.unsubscribe = subscribe$4(this.xoName, ({ options, slideLength, activeIndex }) => {
        if (this.prevActiveIndex !== activeIndex) {
          const realSlideLength = options.xoLoop && options.xoType === "slide" ? slideLength - options.xoPerView * 4 : slideLength;
          const _activeIndex = options.xoLoop && options.xoType === "slide" ? Math.min(Math.max(activeIndex - options.xoPerView * 2, 0), realSlideLength - options.xoPerView) : activeIndex;
          const paginationProgress = interpolate({
            value: _activeIndex,
            inputRange: [0, realSlideLength - options.xoPerView],
            outputRange: [0, 100]
          });
          const progressEls = [
            ...Array.from(document.querySelectorAll(`${WebComponent.CarouselPaginationProgress}[xo-name="${this.xoName}"]`)),
            ...Array.from(this.querySelectorAll(WebComponent.CarouselPaginationProgress))
          ];
          each(progressEls, (progressEl) => {
            progressEl.style.setProperty("--xo-pagination-progress", `${paginationProgress}%`);
          });
          this.style.setProperty("--xo-pagination-progress", `${paginationProgress}%`);
          if (options.xoAutoplay && options.xoProgress) {
            this.animated.off();
            this.animated({
              from: 0,
              to: 100,
              duration: options.xoAutoplay,
              onUpdate: (value) => {
                this.style.setProperty("--xo-autoplay-progress", `${value}%`);
              }
            });
          }
          this.handleShader(activeIndex > this.prevActiveIndex);
          this.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { activeIndex: _activeIndex } }));
          this.prevActiveIndex = activeIndex;
        }
      });
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue !== newValue) {
        if (window.xbEditor) {
          this.cancel = await delay(50);
        }
        this.setOptions();
        this.setOptionsForStore();
        const listEls = Array.from(this.querySelectorAll(WebComponent.CarouselList));
        each(listEls, (listEl) => {
          if (!listEl.closest(WebComponent.CarouselThumbnail)) {
            listEl.setAttribute("xo-observed", newValue);
          }
        });
      }
    }
    disconnectedCallback() {
      var _a2, _b2;
      this.unsubscribe();
      this.animated.off();
      (_a2 = this.resizeObserver) == null ? void 0 : _a2.disconnect();
      (_b2 = this.intersectionObserver) == null ? void 0 : _b2.disconnect();
      publicEvent.destroy(this);
      this.cancel();
      clearTimeout(this.timeId1);
      clearTimeout(this.timeId2);
      this.debounce.cancel();
    }
  };
  let Carousel = _Carousel;
  __publicField(Carousel, "defaultOptions", {
    xoName: "",
    xoActiveIndex: 0,
    xoPerView: 1,
    xoPerMove: 1,
    xoGap: 20,
    xoSpeed: 200,
    xoEasing: "easeOutQuad",
    xoOverflow: "hidden",
    xoVertical: false,
    xoAutoplay: 0,
    xoHoverPause: true,
    xoRewind: false,
    xoRtl: document.dir === "rtl",
    xoRenderBullet: "<span></span>",
    xoBreakpoints: {},
    xoAutoheight: false,
    xoType: "slide",
    xoLoop: false,
    xoColumnWidth: 0,
    xoStopAutoplayOnInteraction: false,
    xoProgress: false,
    xoSyncId: "",
    xoDragable: true
  });
  const _CarouselThumbnail = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "_options");
      __publicField(this, "resizeObserver", null);
      __publicField(this, "prevWidth", 0);
      __publicField(this, "debounce", createDebounce());
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "setOptions", () => {
        this.options = getAttrs(this, {
          pick: ["xoPerView", "xoPerMove", "xoGap", "xoBreakpoints", "xoVertical"],
          types: {
            xoPerView: "number",
            xoPerMove: "number",
            xoGap: "number",
            xoBreakpoints: "object",
            xoVertical: "boolean"
          }
        });
      });
      __publicField(this, "setOptionsForStore", async () => {
        var _a2, _b2, _c2, _d2;
        const { xoBreakpoints, xoPerView, xoPerMove, xoGap, xoVertical } = this.options;
        const breakpointOptions = getBreakpointsOptions(xoBreakpoints);
        const options = {
          ...this.options,
          xoPerView: (_a2 = breakpointOptions == null ? void 0 : breakpointOptions.perView) != null ? _a2 : xoPerView,
          xoPerMove: (_b2 = breakpointOptions == null ? void 0 : breakpointOptions.perMove) != null ? _b2 : Math.min(xoPerMove, xoPerView),
          xoGap: (_c2 = breakpointOptions == null ? void 0 : breakpointOptions.gap) != null ? _c2 : xoGap,
          xoVertical: (_d2 = breakpointOptions == null ? void 0 : breakpointOptions.vertical) != null ? _d2 : xoVertical
        };
        this.style.setProperty("--xo-per-view", `${options.xoPerView}`);
        this.style.setProperty("--xo-gap", `${options.xoGap}px`);
        await delay(50);
        const carouselEl = this.getProviderElement();
        if (carouselEl) {
          const { xoName } = carouselEl;
          setThumbnailOptions(xoName, options);
        }
      });
      __publicField(this, "handleResize", this.debounce((entries) => {
        for (let entry of entries) {
          const currentWidth = entry.contentRect.width;
          if (currentWidth !== this.prevWidth) {
            this.setOptionsForStore();
            this.prevWidth = currentWidth;
          }
        }
      }, RESIZE_DELAY$2));
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    getProviderElement() {
      return this.closest(WebComponent.Carousel);
    }
    get options() {
      return {
        ..._CarouselThumbnail.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    async onConnected() {
      this.setOptions();
      this.setOptionsForStore();
      this.cancel = await delay(50);
      const providerElement = this.getProviderElement();
      if (!providerElement) {
        return;
      }
      this.prevWidth = providerElement.clientWidth;
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(providerElement);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue !== newValue) {
        this.setOptions();
        this.setOptionsForStore();
      }
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this.resizeObserver) == null ? void 0 : _a2.disconnect();
      this.cancel();
      this.debounce.cancel();
    }
  };
  let CarouselThumbnail = _CarouselThumbnail;
  __publicField(CarouselThumbnail, "defaultOptions", {
    xoPerView: 5,
    xoPerMove: 1,
    xoGap: 10,
    xoBreakpoints: {},
    xoVertical: false
  });
  const Axis$1 = {
    Idle: "idle",
    Target: "target",
    Lock: "lock"
  };
  class CarouselList extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "isThumbMoving", false);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "animated", createAnimate());
      __publicField(this, "thumbAnimated", createAnimate());
      __publicField(this, "prevTranslate", 0);
      __publicField(this, "prevThumbTranslate", 0);
      __publicField(this, "axis", Axis$1.Idle);
      __publicField(this, "pan", null);
      __publicField(this, "thumbPan", null);
      __publicField(this, "dEnd", 0);
      __publicField(this, "prevDx", null);
      __publicField(this, "prevDy", null);
      __publicField(this, "prevThumbDx", null);
      __publicField(this, "prevThumbDy", null);
      __publicField(this, "isMove", false);
      __publicField(this, "timeoutId", -1);
      __publicField(this, "anchorEls", []);
      __publicField(this, "_options");
      __publicField(this, "initialized", false);
      __publicField(this, "prevScrollY", -1);
      __publicField(this, "resizeObserver", null);
      __publicField(this, "intersectionObserver", null);
      __publicField(this, "providerIntersectionObserver", null);
      __publicField(this, "prevWidth", ((_q = this.providerElement) == null ? void 0 : _q.offsetWidth) || 0);
      __publicField(this, "wheelEndTimeId", -1);
      __publicField(this, "wheelStarting", false);
      __publicField(this, "isHorizontalSwipeState");
      __publicField(this, "prevActiveIndex", null);
      __publicField(this, "debounce", createDebounce());
      __publicField(this, "debounce2", createDebounce());
      __publicField(this, "intervalId", -1);
      __publicField(this, "autoplayReady", false);
      __publicField(this, "isProductMedia", this.closest(WebComponent.ProductMedia));
      __publicField(this, "slideSizeCache", createCache(this.isProductMedia ? 1e5 : 0));
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "setOptions", () => {
        const { options, thumbnailOptions } = getState$3(this.providerElement.xoName);
        if (this.isThumbnail) {
          this.options = {
            ...options,
            ...thumbnailOptions
          };
        } else {
          this.options = options;
        }
      });
      __publicField(this, "withRtl", (value) => {
        return this.options.xoRtl ? value * -1 : value;
      });
      __publicField(this, "setTranslate", (value) => {
        if (this.providerElement && !isNaN(value)) {
          const { xoType, xoVertical } = this.options;
          if (xoType === "slide") {
            if (xoVertical) {
              this.style.transform = `translate3d(0, ${value}px, 0)`;
            } else {
              this.style.transform = `translate3d(${this.withRtl(value)}px, 0, 0)`;
            }
          }
        }
      });
      __publicField(this, "handleSlide", (speed) => {
        if (!this.providerElement) {
          return;
        }
        const { options, activeIndex } = this;
        const { slideLength } = getState$3(this.providerElement.xoName);
        const lastIndex = this.isThumbnail ? slideLength : slideLength - options.xoPerView;
        const extra = this.isThumbnail ? Math.floor(options.xoPerView / 2) : 0;
        const remaining = this.isThumbnail ? options.xoPerView - extra : 0;
        const activeIndexClamp = this.isThumbnail ? clamp(activeIndex, extra, lastIndex - remaining) : activeIndex;
        const cond = activeIndexClamp <= lastIndex - remaining;
        if (cond) {
          const index = this.isThumbnail ? clamp(activeIndexClamp - extra, 0, lastIndex) : activeIndex;
          const translate = slideLength > options.xoPerView ? -index * this.slideSize : 0;
          if (options.xoType === "slide") {
            this.animated({
              from: this.isThumbnail ? this.prevThumbTranslate : this.prevTranslate,
              to: translate,
              duration: speed,
              easing: easings[options.xoEasing],
              onUpdate: this.setTranslate,
              onEnd: (value) => {
                attrBoolean.set(this, "xo-dragging", false);
                if (this.pan) {
                  if (options.xoVertical) {
                    this.pan.setValue({ dy: value });
                  } else {
                    this.pan.setValue({ dx: this.withRtl(value) });
                  }
                }
                if (this.thumbPan) {
                  if (options.xoVertical) {
                    this.thumbPan.setValue({ dy: value });
                  } else {
                    this.thumbPan.setValue({ dx: this.withRtl(value) });
                  }
                }
                if (this.isThumbnail) {
                  this.prevThumbTranslate = value;
                } else {
                  this.prevTranslate = value;
                }
                if (options.xoLoop) {
                  const indexLoop = index - options.xoPerView * 2;
                  const names = getNames(this.providerElement);
                  if (indexLoop <= options.xoPerView * -1) {
                    const nextIndex = lastIndex - (options.xoPerView * 2 + options.xoPerView * -1 - indexLoop);
                    goToSlide(names, nextIndex, false);
                  } else if (indexLoop >= lastIndex - options.xoPerView * 3) {
                    const nextIndex = options.xoPerView * 2 + indexLoop - (lastIndex - options.xoPerView * 3);
                    goToSlide(names, nextIndex, false);
                  }
                }
              }
            });
          } else {
            attrBoolean.set(this, "xo-dragging", false);
          }
          this.handleActiveSlide(index);
        }
      });
      __publicField(this, "listener", () => {
        if (this.initialized) {
          const { xoSpeed, xoPerView, xoLoop, xoType } = this.options;
          const { useAnimated, slideLength } = getState$3(this.providerElement.xoName);
          frameManager.add(() => {
            this.handleSlide(useAnimated ? xoSpeed : 0);
            if (this.providerElement) {
              const activeIndex = xoLoop && xoType === "slide" ? clamp(this.activeIndex - xoPerView * 2, 0, slideLength - xoPerView * 4 - 1) : this.activeIndex;
              if (this.prevActiveIndex != null && activeIndex !== this.prevActiveIndex) {
                publicEvent.change(this.providerElement, activeIndex);
              }
              this.prevActiveIndex = activeIndex;
            }
          });
        }
      });
      __publicField(this, "rubberBandClamp", (d) => {
        const { slideLength } = getState$3(this.providerElement.xoName);
        const listSize = this.slideSize * slideLength;
        return rubberBandClamp(this.getContainerSize() - listSize, 0, d, 0.2);
      });
      __publicField(this, "lockScroll", (isHorizontalSwipe) => {
        if (this.isHorizontalSwipeState == null) {
          this.isHorizontalSwipeState = isHorizontalSwipe;
        }
        const nextIsHorizontalSwipeState = device.mobile() ? this.isHorizontalSwipeState : true;
        return nextIsHorizontalSwipeState;
      });
      __publicField(this, "panMove", ({ dx, dy, vx, vy, isHorizontalSwipe }, event) => {
        const modelViewerEl = event.target.closest("model-viewer");
        if (modelViewerEl) {
          return;
        }
        const { options } = this;
        if (!options.xoVertical) {
          if (!this.lockScroll(isHorizontalSwipe)) {
            return;
          }
          event.preventDefault();
        }
        this.isMove = true;
        if (this.prevDx == null) {
          this.prevDx = -this.slideSize * this.activeIndex;
        }
        if (this.prevDy == null) {
          this.prevDy = 0;
        }
        if (options.xoVertical) {
          this.axis = Axis$1.Target;
        } else if (device.mobile()) {
          if (this.axis === Axis$1.Idle) {
            if (isHorizontalSwipe) {
              this.axis = Axis$1.Target;
            } else {
              this.axis = Axis$1.Lock;
            }
          }
        } else {
          this.axis = Axis$1.Target;
        }
        if (this.axis === Axis$1.Target) {
          if (device.mobile()) {
            if (window.scrollY !== this.prevScrollY && this.prevScrollY !== -1) {
              this.panEnd({ dx, dy, vx, vy });
            }
          }
          const d = options.xoVertical ? dy : this.withRtl(dx);
          const translate = this.rubberBandClamp(d);
          this.setTranslate(translate);
          this.prevTranslate = translate;
        } else {
          if (device.mobile()) {
            this.style.removeProperty("touch-action");
          }
        }
      });
      __publicField(this, "magnet", (value, min, max, constant, condition) => {
        return clamp(Math.round(value + (condition ? constant : -constant)), min, max);
      });
      __publicField(this, "panEnd", (gestureState) => {
        if (!this.providerElement) {
          return;
        }
        const { options } = this;
        const { d, v } = this.getDxy(gestureState);
        const { slideLength, activeIndex } = getState$3(this.providerElement.xoName);
        const listSize = this.slideSize * slideLength;
        const lastIndex = slideLength - options.xoPerView;
        const threshold = options.xoPerView > 2 ? options.xoPerView : 1;
        const newD = v === 0 ? d : this.dEnd > d ? d - v * threshold : d + v * threshold;
        const isNext = (options.xoVertical ? gestureState.vy : gestureState.vx) < 0;
        const getIndex = () => {
          if (options.xoType === "slide") {
            return this.magnet(interpolate({
              value: newD,
              inputRange: [0, -listSize],
              outputRange: [0, slideLength]
            }), 0, lastIndex, 0.4, this.dEnd > d);
          }
          if (options.xoLoop) {
            return wrapAroundRange(isNext ? activeIndex + 1 : activeIndex - 1, 0, lastIndex);
          }
          return clamp(isNext ? activeIndex + 1 : activeIndex - 1, 0, lastIndex);
        };
        const index = getIndex();
        if (this.axis === Axis$1.Target) {
          const names = getNames(this.providerElement);
          goToSlide(names, index, true);
        }
        if (index > 0 && index <= lastIndex) {
          if (this.pan) {
            if (this.axis === Axis$1.Target) {
              if (options.xoVertical) {
                const d2 = -index * this.slideSize;
                this.pan.setValue({ dx: 0, dy: d2 });
                this.dEnd = d2;
                this.prevDx = 0;
                this.prevDy = d2;
              } else {
                const d2 = -index * this.slideSize;
                this.pan.setValue({ dx: d2, dy: 0 });
                this.dEnd = d2;
                this.prevDx = d2;
                this.prevDy = 0;
              }
              this.handleAutoPlay();
            } else {
              this.pan.setValue({ dx: this.prevDx, dy: this.prevDy });
            }
          }
        } else if (index === 0) {
          if (this.pan) {
            this.pan.setValue({ dx: 0, dy: 0 });
            this.dEnd = 0;
            this.prevDx = 0;
            this.prevDy = 0;
            this.handleAutoPlay();
          }
        } else {
          this.animated({
            from: this.prevTranslate,
            to: -(slideLength - options.xoPerView) * this.slideSize,
            duration: options.xoSpeed,
            easing: easings[options.xoEasing],
            onUpdate: (value) => {
              this.handlePause();
              this.setTranslate(value);
            },
            onEnd: (value) => {
              if (this.pan) {
                if (options.xoVertical) {
                  this.pan.setValue({ dx: 0, dy: value });
                  this.dEnd = value;
                  this.prevDx = 0;
                  this.prevDy = value;
                } else {
                  this.pan.setValue({ dx: this.withRtl(value), dy: 0 });
                  this.dEnd = value;
                  this.prevDx = value;
                  this.prevDy = 0;
                }
                this.handleAutoPlay();
              }
              this.prevTranslate = value;
            }
          });
        }
        this.axis = Axis$1.Idle;
        clearTimeout(this.timeoutId);
        this.timeoutId = window.setTimeout(() => {
          this.style.removeProperty("touch-action");
        }, 300);
        this.prevScrollY = window.scrollY;
      });
      __publicField(this, "thumbPanMove", ({ dx, dy, vx, vy, isHorizontalSwipe }, event) => {
        var _a2, _b2;
        const { options } = this;
        if (!options.xoVertical) {
          if (!this.lockScroll(isHorizontalSwipe)) {
            return;
          }
          event.preventDefault();
        }
        const { slideLength } = getState$3(this.providerElement.xoName);
        if (this.prevThumbDx == null) {
          this.prevThumbDx = this.withRtl(-this.slideSize * this.activeIndex);
        }
        if (this.prevThumbDy == null) {
          this.prevThumbDy = 0;
        }
        if (options.xoVertical) {
          this.axis = Axis$1.Target;
        } else if (device.mobile()) {
          if (this.axis === Axis$1.Idle) {
            if (isHorizontalSwipe) {
              this.axis = Axis$1.Target;
            } else {
              this.axis = Axis$1.Lock;
            }
          }
        } else {
          this.axis = Axis$1.Target;
        }
        if (this.axis === Axis$1.Target) {
          this.isThumbMoving = true;
          if (device.mobile()) {
            if (window.scrollY !== this.prevScrollY) {
              this.thumbPanEnd({ dx, dy, vx, vy });
            }
          }
          const d = options.xoVertical ? dy : this.withRtl(dx);
          const translate = clamp(d, -this.slideSize * (slideLength - options.xoPerView), 0);
          this.setTranslate(translate);
          if (options.xoVertical) {
            (_a2 = this.thumbPan) == null ? void 0 : _a2.setValue({ dx: 0, dy: translate });
          } else {
            (_b2 = this.thumbPan) == null ? void 0 : _b2.setValue({ dx: this.withRtl(translate), dy: 0 });
          }
          this.prevThumbTranslate = translate;
        }
      });
      __publicField(this, "thumbPanEnd", ({ vx, vy }) => {
        const { options } = this;
        const { slideLength } = getState$3(this.providerElement.xoName);
        const v = options.xoVertical ? vy : this.withRtl(vx);
        this.thumbAnimated({
          from: this.prevThumbTranslate,
          to: this.prevThumbTranslate + v * 10,
          duration: options.xoSpeed,
          easing: easings.easeOutQuad,
          onUpdate: (value) => {
            if (this.isThumbMoving) {
              const translate = clamp(value, -this.slideSize * (slideLength - options.xoPerView), 0);
              this.setTranslate(translate);
            }
          },
          onEnd: (value) => {
            const translate = clamp(value, -this.slideSize * (slideLength - options.xoPerView), 0);
            if (this.thumbPan && this.isThumbMoving) {
              if (options.xoVertical) {
                this.thumbPan.setValue({ dx: 0, dy: translate });
                this.prevThumbDx = 0;
                this.prevThumbDy = translate;
              } else {
                this.thumbPan.setValue({ dx: this.withRtl(translate), dy: 0 });
                this.prevThumbDx = this.withRtl(translate);
                this.prevThumbDy = 0;
              }
            }
            this.axis = Axis$1.Idle;
            clearTimeout(this.timeoutId);
            this.timeoutId = window.setTimeout(() => {
              this.style.removeProperty("touch-action");
            }, 300);
            if (this.isThumbMoving) {
              this.prevThumbTranslate = translate;
              loadImages(this);
            }
            this.isThumbMoving = false;
            this.prevScrollY = window.scrollY;
          }
        });
        this.isHorizontalSwipeState = void 0;
      });
      __publicField(this, "handlePause", () => {
        window.clearInterval(this.intervalId);
        this.autoplayReady = false;
        this.intervalId = -1;
      });
      __publicField(this, "handlePauseHover", () => {
        const { options } = this;
        if (options.xoHoverPause) {
          this.handlePause();
        }
      });
      __publicField(this, "handleAutoPlay", () => {
        if (this.providerElement && !this.isThumbnail && !this.autoplayReady && this.intervalId === -1) {
          const names = getNames(this.providerElement);
          const { options } = this;
          if (options.xoAutoplay <= 0) {
            window.clearInterval(this.intervalId);
            this.intervalId = -1;
            return;
          }
          this.intervalId = window.setInterval(() => {
            nextSlide(names, options.xoPerMove);
          }, options.xoAutoplay);
          this.autoplayReady = true;
        }
      });
      __publicField(this, "handleKeyDown", (event) => {
        const { xoPerMove } = this.options;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          prevSlide(getNames(this.providerElement), xoPerMove);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          nextSlide(getNames(this.providerElement), xoPerMove);
        }
      });
      __publicField(this, "handleVideoCover", (el, visible) => {
        const videoCoverEls = el.querySelectorAll(WebComponent.VideoCover);
        videoCoverEls.forEach((videoCoverEl) => {
          if (visible) {
            videoCoverEl.run();
          } else {
            videoCoverEl.pause();
          }
        });
      });
      __publicField(this, "handleActiveSlide", (indexForVisibleAttrr) => {
        let index = -1;
        let slideHeight = 0;
        const { options, activeIndex } = this;
        const { slideLength } = getState$3(this.providerElement.xoName);
        const _activeIndex = options.xoLoop && options.xoType === "slide" ? activeIndex - options.xoPerView * 2 : activeIndex;
        const visibleIndex = this.isThumbnail ? indexForVisibleAttrr != null ? indexForVisibleAttrr : _activeIndex : _activeIndex;
        const prevIndex = visibleIndex - 1;
        const nextIndex = visibleIndex + options.xoPerView;
        const slideEls = Array.from(this.querySelectorAll(`:scope > ${WebComponent.CarouselSlide}:not([xo-cloned]), :scope > [${WebComponent.CarouselSlide}]:not([xo-cloned])`));
        each(slideEls, async (childEl) => {
          index++;
          childEl.index = index;
          childEl.setAttribute("aria-label", `${index + 1} / ${options.xoLoop && options.xoType === "slide" ? slideLength - options.xoPerView * 4 : slideLength}`);
          childEl.setAttribute("role", "tabpanel");
          if (_activeIndex === index) {
            attrBoolean.set(childEl, "xo-active", true);
            bindingHelper(childEl, "xo-active-binding", true);
          } else {
            attrBoolean.set(childEl, "xo-active", false);
            bindingHelper(childEl, "xo-active-binding", false);
          }
          if (index === prevIndex) {
            attrBoolean.set(childEl, "xo-prev", true);
          } else {
            attrBoolean.set(childEl, "xo-prev", false);
          }
          if (index === nextIndex) {
            attrBoolean.set(childEl, "xo-next", true);
          } else {
            attrBoolean.set(childEl, "xo-next", false);
          }
          if (options.xoPerView % 2 === 1) {
            if (index >= visibleIndex + Math.floor(options.xoPerView / 2) && index < visibleIndex + Math.floor(options.xoPerView / 2) + 1) {
              attrBoolean.set(childEl, "xo-center", true);
            } else {
              attrBoolean.set(childEl, "xo-center", false);
            }
          }
          if (index >= visibleIndex && index < visibleIndex + options.xoPerView) {
            attrBoolean.set(childEl, "xo-visible", true);
            loadImages(childEl);
            this.handleVideoCover(childEl, true);
            if (options.xoAutoheight) {
              if (childEl.children[0] instanceof HTMLElement) {
                if (!indexForVisibleAttrr) {
                  await delay(500);
                }
                const childHeight = getOuterHeight(childEl.children[0]);
                if (slideHeight < childHeight) {
                  slideHeight = childHeight;
                  const innerEl = this.closest(WebComponent.CarouselInner);
                  const thumbInnerEl = innerEl == null ? void 0 : innerEl.closest(WebComponent.CarouselThumbnail);
                  if (innerEl && !thumbInnerEl) {
                    innerEl.style.height = `${slideHeight}px`;
                    innerEl.style.transition = `height ${options.xoSpeed}ms`;
                  }
                }
              }
            } else {
              const innerEl = this.closest(WebComponent.CarouselInner);
              if (innerEl && !options.xoVertical) {
                innerEl.style.removeProperty("height");
              }
            }
          } else {
            attrBoolean.set(childEl, "xo-visible", false);
            this.handleVideoCover(childEl, false);
          }
        });
      });
      __publicField(this, "setContainerSize", () => {
        if (this.parentElement) {
          setContainerSize(this.providerElement.xoName, this.parentElement.offsetWidth, this.parentElement.offsetHeight);
        }
      });
      __publicField(this, "handleResize", this.debounce((entries) => {
        for (let entry of entries) {
          const currentWidth = entry.contentRect.width;
          if (currentWidth !== this.prevWidth) {
            this.disconnectedCallback();
            this.onConnected();
            this.prevWidth = currentWidth;
          }
        }
      }, RESIZE_DELAY$2));
      __publicField(this, "handleWindowResize", this.debounce2(resizeAxis("x", () => {
        const names = getNames(this.providerElement);
        goToSlide(names, 0, false);
      }), RESIZE_DELAY$2));
      __publicField(this, "handleIntersection", (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.handleActiveSlide();
          }
        }
      });
      __publicField(this, "handleProviderIntersection", (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.handleAutoPlay();
          } else {
            this.handlePause();
          }
        }
      });
      __publicField(this, "handleAnchor", (event) => {
        if (this.isMove) {
          event.preventDefault();
        }
      });
      __publicField(this, "bindAnchor", () => {
        this.anchorEls = Array.from(this.querySelectorAll("a"));
        each(this.anchorEls, (anchorEl) => {
          anchorEl.addEventListener("click", this.handleAnchor);
        });
      });
      __publicField(this, "handleLoop", () => {
        const { xoPerView, xoLoop, xoType } = this.options;
        if (!xoLoop) {
          return;
        }
        if (xoType !== "slide") {
          return;
        }
        cloneSlides(this, xoPerView);
      });
      __publicField(this, "removeSlideCloned", () => {
        each(Array.from(this.children), (slideEl) => {
          const isSlide = slideEl.localName === WebComponent.CarouselSlide || slideEl.hasAttribute(WebComponent.CarouselSlide);
          if (isSlide) {
            if (attrBoolean.get(slideEl, "xo-cloned")) {
              this.removeChild(slideEl);
            }
          }
        });
      });
      __publicField(this, "handleSlideClick", () => {
        if (this.options.xoStopAutoplayOnInteraction) {
          this.handlePause();
        }
      });
      __publicField(this, "handleWheel", (event) => {
        const { xoPerView, xoVertical } = this.options;
        if (xoVertical) {
          return;
        }
        if (!this.wheelStarting && Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
          const names = getNames(this.providerElement);
          if (event.deltaX > 0) {
            nextSlide(names, xoPerView);
          } else {
            prevSlide(names, xoPerView);
          }
        }
        this.wheelStarting = true;
        clearTimeout(this.wheelEndTimeId);
        this.wheelEndTimeId = window.setTimeout(() => {
          this.wheelStarting = false;
        }, 50);
      });
      __publicField(this, "reset", () => {
        var _a2, _b2, _c2, _d2, _e2;
        this.unsubscribe();
        this.handlePause();
        this.removeSlideCloned();
        (_a2 = this.pan) == null ? void 0 : _a2.destroy();
        (_b2 = this.thumbPan) == null ? void 0 : _b2.destroy();
        this.cancel();
        clearTimeout(this.timeoutId);
        clearTimeout(this.wheelEndTimeId);
        this.animated.off();
        (_c2 = this.resizeObserver) == null ? void 0 : _c2.disconnect();
        (_d2 = this.intersectionObserver) == null ? void 0 : _d2.disconnect();
        (_e2 = this.providerIntersectionObserver) == null ? void 0 : _e2.disconnect();
        if (this.providerElement) {
          this.providerElement.removeEventListener("click", this.handleSlideClick);
          this.providerElement.removeEventListener("mouseenter", this.handlePauseHover);
          this.providerElement.removeEventListener("mouseleave", this.handleAutoPlay);
          this.providerElement.removeEventListener("keydown", this.handleKeyDown);
          this.providerElement.removeEventListener("touchstart", this.handlePauseHover);
          this.providerElement.removeEventListener("touchend", this.handleAutoPlay);
          this.providerElement.removeEventListener("wheel", this.handleWheel);
        }
        each(this.anchorEls, (anchorEl) => {
          anchorEl.removeEventListener("click", this.handleAnchor);
        });
        if (!device.mobile()) {
          window.removeEventListener("resize", this.handleWindowResize);
        }
        this.debounce.cancel();
        this.debounce2.cancel();
        window.clearInterval(this.intervalId);
        this.intervalId = -1;
        const slideEls = Array.from(this.querySelectorAll(`:scope > ${WebComponent.CarouselSlide}:not([xo-cloned]), :scope > ${WebComponent.Item}:not([xo-cloned])`));
        each(slideEls, (slideEl) => {
          slideEl.removeAttribute("xo-active");
          slideEl.removeAttribute("xo-center");
          slideEl.removeAttribute("xo-next");
          slideEl.removeAttribute("xo-prev");
          slideEl.removeAttribute("xo-visible");
        });
      });
    }
    get providerElement() {
      return this.closest(WebComponent.Carousel);
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    get slideSize() {
      const { slideLength } = getState$3(this.providerElement.xoName);
      if (this.options.xoVertical) {
        return this.slideSizeCache.set(() => this.scrollHeight / slideLength);
      }
      return this.slideSizeCache.set(() => this.scrollWidth / slideLength);
    }
    getContainerSize() {
      const { containerWidth, containerHeight } = getState$3(this.providerElement.xoName);
      if (this.options.xoVertical) {
        return containerHeight;
      }
      return containerWidth;
    }
    get isThumbnail() {
      const thumbnailEl = this.closest(WebComponent.CarouselThumbnail);
      return !!thumbnailEl;
    }
    get options() {
      return this._options;
    }
    set options(value) {
      this._options = value;
    }
    get activeIndex() {
      const { activeIndex, thumbnailActiveIndex } = getState$3(this.providerElement.xoName);
      if (this.isThumbnail) {
        return thumbnailActiveIndex;
      }
      return activeIndex;
    }
    getDxy({ dx, dy, vx, vy }) {
      if (this.options.xoVertical) {
        return { d: dy, v: Math.abs(vy) };
      }
      return { d: this.withRtl(dx), v: Math.abs(vx) };
    }
    play() {
      this.handleAutoPlay();
    }
    pause() {
      this.handlePause();
    }
    async onConnected() {
      this.cancel = await delay(100);
      if (!this.providerElement) {
        return;
      }
      this.reset();
      this.setOptions();
      this.handleLoop();
      this.setContainerSize();
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(this.providerElement);
      if (!device.mobile()) {
        window.addEventListener("resize", this.handleWindowResize);
      }
      this.providerElement.addEventListener("click", this.handleSlideClick);
      const { options } = this;
      if (options.xoAutoheight) {
        this.intersectionObserver = new IntersectionObserver(this.handleIntersection);
        this.intersectionObserver.observe(this);
      }
      if (options.xoAutoplay && !this.isThumbnail) {
        this.providerIntersectionObserver = new IntersectionObserver(this.handleProviderIntersection);
        this.providerIntersectionObserver.observe(this.providerElement);
      }
      this.handleSlide(0);
      if (this.isThumbnail) {
        this.thumbPan = panGesture({
          element: this,
          onStart: () => {
            this.style.touchAction = "none";
          },
          onMove: this.thumbPanMove,
          onEnd: this.thumbPanEnd
        });
      } else {
        const { slideLength } = getState$3(this.providerElement.xoName);
        if (slideLength <= options.xoPerView && !this.isThumbnail) {
          return;
        }
        this.pan = panGesture({
          element: this,
          onStart: (event) => {
            const modelViewerEl = event.target.closest("model-viewer");
            if (modelViewerEl) {
              return;
            }
            this.isMove = false;
            this.style.touchAction = "none";
            this.style.outline = "none";
            attrBoolean.set(this, "xo-dragging", true);
          },
          onMove: this.panMove,
          onEnd: (gestureState, event) => {
            const nextEl = event.target.closest(WebComponent.CarouselNext);
            const prevEl = event.target.closest(WebComponent.CarouselPrev);
            if (nextEl || prevEl) {
              return;
            }
            const modelViewerEl = event.target.closest("model-viewer");
            if (modelViewerEl) {
              return;
            }
            this.panEnd(gestureState);
            this.isHorizontalSwipeState = void 0;
            if (this.axis !== Axis$1.Target && device.mobile()) {
              clearTimeout(this.timeoutId);
              this.timeoutId = window.setTimeout(() => {
                this.style.removeProperty("touch-action");
                this.style.outline = "1px solid transparent";
              }, 300);
            }
          }
        });
      }
      this.handleActiveSlide();
      this.bindAnchor();
      this.unsubscribe = subscribe$4(this.providerElement.xoName, this.listener);
      this.providerElement.addEventListener("mouseenter", this.handlePauseHover, { passive: false });
      this.providerElement.addEventListener("mouseleave", this.handleAutoPlay, { passive: false });
      this.providerElement.addEventListener("keydown", this.handleKeyDown, { passive: false });
      if (device.mobile()) {
        this.providerElement.addEventListener("touchstart", this.handlePauseHover, { passive: false });
        this.providerElement.addEventListener("touchend", this.handleAutoPlay, { passive: false });
      }
      if (options.xoPerView !== 1 || !this.isThumbnail) {
        this.providerElement.addEventListener("wheel", this.handleWheel, { passive: false });
      }
      attrBoolean.set(this.providerElement, "xo-initialized", true);
      this.initialized = true;
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue !== newValue) {
        await delay(100);
        this.onConnected();
      }
    }
    disconnectedCallback() {
      this.reset();
    }
  }
  class CarouselItem {
    constructor(el) {
      __publicField(this, "el");
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "intersectionObserver", null);
      __publicField(this, "handleClick", () => {
        const { index } = this.el;
        const carouselListElement = this.el.closest(WebComponent.CarouselList);
        if (!(carouselListElement == null ? void 0 : carouselListElement.isThumbMoving)) {
          goToSlide(getNames(this.providerElement), index, true);
        }
      });
      __publicField(this, "handleFocus", () => {
        loadImages(this.el);
      });
      __publicField(this, "handleIntersection", (entries) => {
        for (const entry of entries) {
          const a11yEls = Array.from(entry.target.querySelectorAll(A11Y_SELECTOR));
          each(a11yEls, (a11yEl) => {
            if (entry.isIntersecting) {
              a11yEl.setAttribute("aria-hidden", "false");
              a11yEl.tabIndex = 0;
            } else {
              a11yEl.setAttribute("aria-hidden", "true");
              a11yEl.tabIndex = -1;
            }
          });
        }
      });
      this.el = el;
    }
    get providerElement() {
      return this.el.closest(WebComponent.Carousel);
    }
    get isThumbnail() {
      const thumbnailEl = this.el.closest(WebComponent.CarouselThumbnail);
      return !!thumbnailEl;
    }
    mount() {
      var _a2;
      if (!this.providerElement) {
        return;
      }
      if (((_a2 = this.el.parentElement) == null ? void 0 : _a2.tagName.toLowerCase()) !== WebComponent.CarouselList) {
        return;
      }
      attrBoolean.set(this.el, "xo-carousel-slide", true);
      this.el.addEventListener("focusin", this.handleFocus);
      if (this.isThumbnail) {
        if (this.el.tabIndex === -1) {
          this.el.tabIndex = 0;
        }
        if (device.mobile()) {
          this.el.addEventListener("touchend", this.handleClick);
        } else {
          this.el.addEventListener("click", this.handleClick);
        }
      }
      this.intersectionObserver = new IntersectionObserver(this.handleIntersection, {
        root: this.providerElement
      });
      this.intersectionObserver.observe(this.el.children[0]);
    }
    unmount() {
      var _a2;
      if (!this.providerElement) {
        return;
      }
      this.unsubscribe();
      this.el.removeEventListener("focusin", this.handleFocus);
      if (this.isThumbnail) {
        if (device.mobile()) {
          this.el.removeEventListener("touchend", this.handleClick);
        } else {
          this.el.removeEventListener("click", this.handleClick);
        }
      }
      (_a2 = this.intersectionObserver) == null ? void 0 : _a2.disconnect();
    }
  }
  class CarouselSlide extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "carouselItem", null);
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "index", 0);
    }
    async onConnected() {
      this.cancel = await delay(100);
      this.carouselItem = new CarouselItem(this);
      this.carouselItem.mount();
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this.carouselItem) == null ? void 0 : _a2.unmount();
      this.cancel();
    }
  }
  class CarouselNext extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "setAttrDisabled", ({ options, activeIndex, slideLength }) => {
        if (!options.xoLoop) {
          if (!options.xoRewind && activeIndex === slideLength - options.xoPerView) {
            attrBoolean.set(this, "xo-disabled", true);
          } else {
            attrBoolean.set(this, "xo-disabled", false);
          }
        }
        if (slideLength <= options.xoPerView) {
          attrBoolean.set(this, "xo-hide", true);
        } else {
          attrBoolean.set(this, "xo-hide", false);
        }
      });
      __publicField(this, "listener", (state) => {
        this.setAttrDisabled(state);
      });
      __publicField(this, "nextSlide", (event) => {
        if (!this.providerElement) {
          return;
        }
        if (this.closest("a")) {
          event.preventDefault();
        }
        const { options } = getState$3(this.providerElement.xoName);
        const now = Date.now();
        if (now - getNavLast() < options.xoSpeed + 100) {
          return;
        }
        setNavLast(now);
        nextSlide(getNames(this.providerElement), options.xoPerMove);
      });
    }
    get providerElement() {
      return getProviderElement(this);
    }
    async onConnected() {
      var _a2;
      if ((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode) {
        this.cancel = await delay(100);
      }
      if (!this.providerElement) {
        return;
      }
      frameManager.add(() => {
        const state = getState$3(this.providerElement.xoName);
        this.setAttrDisabled(state);
      });
      this.addEventListener("click", this.nextSlide);
      this.unsubscribe = subscribe$4(this.providerElement.xoName, this.listener);
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.removeEventListener("click", this.nextSlide);
      this.cancel();
    }
  }
  class CarouselPrev extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "setAttrDisabled", ({ options, activeIndex, slideLength }) => {
        if (!options.xoLoop) {
          if (!options.xoRewind && activeIndex === 0) {
            attrBoolean.set(this, "xo-disabled", true);
          } else {
            attrBoolean.set(this, "xo-disabled", false);
          }
        }
        if (slideLength <= options.xoPerView) {
          attrBoolean.set(this, "xo-hide", true);
        } else {
          attrBoolean.set(this, "xo-hide", false);
        }
      });
      __publicField(this, "listener", (state) => {
        this.setAttrDisabled(state);
      });
      __publicField(this, "prevSlide", (event) => {
        if (!this.providerElement) {
          return;
        }
        if (this.closest("a")) {
          event.preventDefault();
        }
        const { options } = getState$3(this.providerElement.xoName);
        const now = Date.now();
        if (now - getNavLast() < options.xoSpeed + 100) {
          return;
        }
        setNavLast(now);
        prevSlide(getNames(this.providerElement), options.xoPerMove);
      });
    }
    get providerElement() {
      return getProviderElement(this);
    }
    async onConnected() {
      var _a2;
      if ((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode) {
        this.cancel = await delay(100);
      }
      if (!this.providerElement) {
        return;
      }
      frameManager.add(() => {
        const state = getState$3(this.providerElement.xoName);
        this.setAttrDisabled(state);
      });
      this.addEventListener("click", this.prevSlide);
      this.unsubscribe = subscribe$4(this.providerElement.xoName, this.listener);
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.removeEventListener("click", this.prevSlide);
      this.cancel();
    }
  }
  class CarouselPagination extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "bullet", "");
      __publicField(this, "listener", (state) => {
        this.renderBullet(state.slideLength, state.options);
      });
      __publicField(this, "renderBullet", (slideLength, options) => {
        var _a2;
        const _slideLength = options.xoLoop && options.xoType === "slide" ? slideLength - options.xoPerView * 4 : slideLength;
        const pages = (_a2 = Array(Math.ceil(_slideLength / options.xoPerView))) == null ? void 0 : _a2.fill(0);
        if (_slideLength <= options.xoPerView) {
          this.innerHTML = "";
          return;
        }
        if (!(pages == null ? void 0 : pages.length)) {
          return;
        }
        this.innerHTML = map(pages, (_, index) => {
          return `
        <${WebComponent.CarouselBullet} xo-index="${index}" xo-page="${index + 1}" role="button" tabindex="0" aria-label="Bullet ${index + 1}">
          ${this.bullet || options.xoRenderBullet}
        </${WebComponent.CarouselBullet}>
      `;
        }).join("");
      });
    }
    get providerElement() {
      return getProviderElement(this);
    }
    async onConnected() {
      this.cancel = await delay(100);
      if (!this.providerElement) {
        return;
      }
      if (!this.bullet) {
        const templateEl = this.children[0];
        if (templateEl) {
          this.bullet = templateEl.innerHTML.trim();
        }
      }
      const state = getState$3(this.providerElement.xoName);
      this.renderBullet(state.slideLength, state.options);
      this.unsubscribe = subscribe$4(this.providerElement.xoName, this.listener, (prevState, nextState) => {
        var _a2, _b2;
        return equal((_a2 = prevState[this.providerElement.xoName]) == null ? void 0 : _a2.options, (_b2 = nextState[this.providerElement.xoName]) == null ? void 0 : _b2.options);
      });
      this.dispatchEvent(new CustomEvent("xo:carousel:pagination:connected", { bubbles: true }));
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.cancel();
    }
  }
  let last = 0;
  class CarouselBullet extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "circleEl", null);
      __publicField(this, "listener", (state) => {
        this.handler(state);
      });
      __publicField(this, "handler", async ({ activeIndex, options, slideLength }) => {
        var _a2;
        const pageIndex = Number((_a2 = this.getAttribute("xo-index")) != null ? _a2 : 0);
        const realSlideLength = options.xoLoop && options.xoType === "slide" ? slideLength - options.xoPerView * 4 : slideLength;
        const _activeIndex = options.xoLoop && options.xoType === "slide" ? Math.min(activeIndex - options.xoPerView * 2, realSlideLength - options.xoPerView) : activeIndex;
        const pageIndexActive = Math.ceil(_activeIndex / options.xoPerView);
        await delay(0);
        if (pageIndex === pageIndexActive) {
          attrBoolean.set(this, "xo-active", true);
          if (this.closest(WebComponent.ProductMedia)) {
            attrBoolean.set(this, "xo-active-in-product-media", true);
          }
          bindingHelper(this, "xo-active-binding", true);
          xoCircleBar.animate(this.getCircleBarName(), {
            duration: options.xoAutoplay,
            value: 100
          });
        } else {
          attrBoolean.set(this, "xo-active", false);
          attrBoolean.set(this, "xo-active-in-product-media", false);
          bindingHelper(this, "xo-active-binding", false);
          xoCircleBar.animate(this.getCircleBarName(), {
            duration: options.xoAutoplay,
            value: 0
          });
        }
      });
      __publicField(this, "handleClick", () => {
        var _a2;
        const providerEl = this.getProviderElement();
        const { options } = getState$3(providerEl.xoName);
        const now = Date.now();
        if (now - last < options.xoSpeed + 200) {
          return;
        }
        last = now;
        const minIndex = options.xoLoop && options.xoType === "slide" ? options.xoPerView * 2 : 0;
        const pageIndex = Number((_a2 = this.getAttribute("xo-index")) != null ? _a2 : 0) * options.xoPerView + minIndex;
        goToSlide(getNames(providerEl), pageIndex, true);
      });
      __publicField(this, "getCircleBarName", () => {
        if (this.getProviderElement()) {
          return `${this.getProviderElement().xoName}-${this.getAttribute("xo-index")}`;
        }
        return "";
      });
      __publicField(this, "handleCircleBar", () => {
        this.circleEl = this.querySelector(WebComponent.CircleBar);
        if (this.circleEl) {
          this.circleEl.setAttribute("xo-name", this.getCircleBarName());
        }
      });
    }
    getProviderElement() {
      return getProviderElement(this);
    }
    onConnected() {
      const providerEl = this.getProviderElement();
      if (!providerEl) {
        return;
      }
      const state = getState$3(providerEl.xoName);
      this.handler(state);
      this.handleCircleBar();
      this.addEventListener("click", this.handleClick);
      this.unsubscribe = subscribe$4(providerEl.xoName, this.listener);
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.removeEventListener("click", this.handleClick);
    }
  }
  class CarouselSize extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "listener", ({ options, slideLength }) => {
        if (options.xoLoop && options.xoType === "slide") {
          this.innerText = `${slideLength - options.xoPerView * 4}`;
        } else {
          this.innerText = `${slideLength}`;
        }
      });
    }
    get providerElement() {
      return getProviderElement(this);
    }
    onConnected() {
      if (!this.providerElement) {
        return;
      }
      this.unsubscribe = subscribe$4(this.providerElement.xoName, this.listener);
    }
    disconnectedCallback() {
      this.unsubscribe();
    }
  }
  class CarouselPage extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "listener", ({ options, activeIndex, slideLength }) => {
        const realSlideLength = options.xoLoop && options.xoType === "slide" ? slideLength - options.xoPerView * 4 : slideLength;
        const _activeIndex = options.xoLoop && options.xoType === "slide" ? Math.min(activeIndex - options.xoPerView * 2, realSlideLength - options.xoPerView) : activeIndex;
        const pageIndexActive = Math.ceil(_activeIndex / options.xoPerView);
        this.innerText = `${pageIndexActive + 1}`;
      });
    }
    get providerElement() {
      return getProviderElement(this);
    }
    onConnected() {
      if (!this.providerElement) {
        return;
      }
      this.unsubscribe = subscribe$4(this.providerElement.xoName, this.listener);
    }
    disconnectedCallback() {
      this.unsubscribe();
    }
  }
  let currentMouseenterEvent = null;
  let isScrolling = false;
  let timeId = -1;
  function handleScroll() {
    isScrolling = true;
    clearTimeout(timeId);
    timeId = window.setTimeout(() => {
      isScrolling = false;
      if ((currentMouseenterEvent == null ? void 0 : currentMouseenterEvent.target) instanceof CarouselTrigger) {
        currentMouseenterEvent.target.handleChange(currentMouseenterEvent);
      }
    }, 150);
  }
  DOMLoaded(() => {
    const carouselTriggerEl = document.querySelector(WebComponent.CarouselTrigger);
    if (carouselTriggerEl) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
  });
  class CarouselTrigger extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "carouselEls", []);
      __publicField(this, "handleCarouselChange", (event) => {
        var _a2;
        const { xoIndex } = this.props;
        const activeIndex = (_a2 = event.detail.activeIndex) != null ? _a2 : event.detail.xoActiveIndex;
        this.setProps({ xoActive: xoIndex === activeIndex });
        bindingHelper(this, "xo-active-binding", xoIndex === activeIndex);
      });
      __publicField(this, "handleChange", (event) => {
        currentMouseenterEvent = event;
        if (isScrolling) {
          return;
        }
        const { xoType } = this.props;
        if (!device.mobile() && xoType === "click") {
          event.preventDefault();
        }
        each(this.carouselEls, (carouselEl) => {
          goToSlide([carouselEl.xoName], this.props.xoIndex, true);
        });
      });
      __publicField(this, "getEventType", () => {
        const { xoType } = this.props;
        if (device.mobile()) {
          return "click";
        }
        if (xoType === "hover") {
          return "mouseover";
        }
        return "click";
      });
    }
    mount() {
      var _a2;
      const { xoCarouselSelector } = this.props;
      const containerEl = (_a2 = this.closest(".shopify-section")) != null ? _a2 : document;
      this.carouselEls = Array.from(containerEl.querySelectorAll(xoCarouselSelector));
      this.addEventListener(this.getEventType(), this.handleChange);
      each(this.carouselEls, (carouselEl) => {
        carouselEl.addEventListener("xo:carousel:init", this.handleCarouselChange);
        carouselEl.addEventListener("xo:carousel:change", this.handleCarouselChange);
      });
    }
    unmount() {
      this.removeEventListener(this.getEventType(), this.handleChange);
      each(this.carouselEls, (carouselEl) => {
        carouselEl.removeEventListener("xo:carousel:init", this.handleCarouselChange);
        carouselEl.removeEventListener("xo:carousel:change", this.handleCarouselChange);
      });
    }
  }
  __publicField(CarouselTrigger, "propTypes", {
    xoIndex: "number",
    xoType: "string",
    xoCarouselSelector: "string",
    xoActive: "boolean"
  });
  __publicField(CarouselTrigger, "defaultProps", {
    xoIndex: 0,
    xoType: "click",
    xoCarouselSelector: "xo-carousel",
    xoActive: false
  });
  const CSS_VAR_SIZE = "--xo-size";
  class CarouselDynamicBullets extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "paginationEl", this.querySelector(WebComponent.CarouselPagination));
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "handlePaginationConnected", () => {
        const { xoPerView } = this.props;
        const perView = Math.min(xoPerView, 5);
        const bulletEl = this.querySelector(WebComponent.CarouselBullet);
        if (!bulletEl) {
          return;
        }
        const size = bulletEl.offsetWidth * perView;
        this.style.width = `${size}px`;
      });
      __publicField(this, "listener", async (state) => {
        const { xoPerView } = this.props;
        const { xoSpeed } = this.providerElement.options;
        const currentBulletEl = this.querySelector(`${WebComponent.CarouselBullet}[xo-index="${state.activeIndex}"]`);
        if (!currentBulletEl) {
          return;
        }
        const perView = Math.min(xoPerView, 5);
        const threshold = perView % 2 === 1 ? perView - 1 : perView;
        const firstTranslate = currentBulletEl.offsetWidth * threshold / 2;
        const isStart = state.activeIndex >= Math.floor(perView / 2);
        const isEnd = state.activeIndex <= state.slideLength - Math.round(perView / 2);
        if (isStart && isEnd) {
          this.paginationEl.style.transition = `transform ${xoSpeed}ms`;
          this.paginationEl.style.transform = `translateX(${firstTranslate - (currentBulletEl == null ? void 0 : currentBulletEl.offsetLeft)}px)`;
        }
        const bulletIndexs = range(state.activeIndex - threshold, state.activeIndex + perView);
        const sizes = range(-threshold, perView).map((item) => {
          item = Math.sign(item) === -1 ? item : -item;
          return Math.trunc((item / perView + 1) * 100) / 100;
        });
        const allBulletEls = Array.from(this.querySelectorAll(WebComponent.CarouselBullet));
        each(allBulletEls, (el) => {
          el.style.removeProperty(CSS_VAR_SIZE);
        });
        each(bulletIndexs, (bulletIndex) => {
          var _a2;
          const bulletEl = this.querySelector(`${WebComponent.CarouselBullet}[xo-index="${bulletIndex}"]`);
          const size = interpolate({
            value: bulletIndex,
            inputRange: bulletIndexs,
            outputRange: sizes
          });
          (_a2 = bulletEl == null ? void 0 : bulletEl.style) == null ? void 0 : _a2.setProperty(CSS_VAR_SIZE, `${size}`);
        });
      });
    }
    get providerElement() {
      return getProviderElement(this);
    }
    async mount() {
      if (!this.paginationEl) {
        return;
      }
      if (!this.providerElement) {
        return;
      }
      this.style.opacity = "1";
      await delay();
      this.style.removeProperty("opacity");
      this.paginationEl.addEventListener("xo:carousel:pagination:connected", this.handlePaginationConnected);
      this.listener(getState$3(this.providerElement.xoName));
      this.unsubscribe = subscribe$4(this.providerElement.xoName, this.listener);
    }
    unmount() {
      var _a2;
      (_a2 = this.paginationEl) == null ? void 0 : _a2.removeEventListener("xo:carousel:pagination:connected", this.handlePaginationConnected);
      this.unsubscribe();
    }
  }
  __publicField(CarouselDynamicBullets, "propTypes", {
    xoPerView: "number"
  });
  __publicField(CarouselDynamicBullets, "defaultProps", {
    xoPerView: 5
  });
  const styles$l = "";
  createState$4();
  window.xoCarousel = publicMethod;
  const xoCarousel = publicMethod;
  componentDefine({
    [WebComponent.Carousel]: Carousel,
    [WebComponent.CarouselThumbnail]: CarouselThumbnail,
    [WebComponent.CarouselSlide]: CarouselSlide,
    [WebComponent.CarouselNext]: CarouselNext,
    [WebComponent.CarouselPrev]: CarouselPrev,
    [WebComponent.CarouselList]: CarouselList,
    [WebComponent.CarouselPagination]: CarouselPagination,
    [WebComponent.CarouselBullet]: CarouselBullet,
    [WebComponent.CarouselSize]: CarouselSize,
    [WebComponent.CarouselPage]: CarouselPage
  });
  customElements$1(WebComponent.CarouselTrigger)(CarouselTrigger);
  customElements$1(WebComponent.CarouselDynamicBullets)(CarouselDynamicBullets);
  function createState$3() {
    xoStore.create("xo-filters", {
      initialState: {
        fieldInfo: {},
        formData: new FormData(),
        refine: [],
        status: "idle",
        html: "",
        prevHtml: "",
        priceMax: 0,
        priceMin: 0,
        sectionId: ""
      }
    });
  }
  function setPriceMinMax(min, max) {
    xoStore.set("xo-filters", (prevState) => ({
      ...prevState,
      priceMin: min,
      priceMax: max
    }))("xo-filters/setPriceMinMax");
  }
  function setSectionId(sectionId) {
    xoStore.set("xo-filters", (prevState) => ({
      ...prevState,
      sectionId
    }))("xo-filters/setSectionId");
  }
  function setDefaultFormData() {
    const url = new URL(window.location.href);
    const params = queryString.parse(url.search);
    const formData = new FormData();
    each(params, ([name, value]) => {
      formData.append(name, value);
    });
    xoStore.set("xo-filters", (prevState) => {
      if (Number(formData.get("filter.v.price.gte")) === prevState.priceMin && Number(formData.get("filter.v.price.lte")) === prevState.priceMax) {
        formData.delete("filter.v.price.gte");
        formData.delete("filter.v.price.lte");
      }
      return {
        ...prevState,
        formData: formDataPriceJoin(formData)
      };
    })("xo-filters/setDefaultFormData");
  }
  function setRefine() {
    xoStore.set("xo-filters", (prevState) => {
      const { formData } = prevState;
      const data = Array.from(formDataPriceJoin(formData));
      const refine = reduce(Array.from(data), (arr, [name, value]) => {
        if (value === "" || value == null) {
          return arr;
        }
        return [
          ...arr,
          {
            name,
            value
          }
        ];
      }, []);
      return {
        ...prevState,
        refine
      };
    })("xo-filters/setRefine");
  }
  function setFormData(formElement) {
    const formData = formElement instanceof FormData ? formElement : new FormData(formElement);
    xoStore.set("xo-filters", (prevState) => {
      if (Number(formData.get("filter.v.price.gte")) === prevState.priceMin && Number(formData.get("filter.v.price.lte")) === prevState.priceMax) {
        formData.delete("filter.v.price.gte");
        formData.delete("filter.v.price.lte");
      }
      return {
        ...prevState,
        formData: formDataPriceJoin(formData)
      };
    })("xo-filters/setFormData");
  }
  function pushFormDataItem(name, value) {
    xoStore.set("xo-filters", (prevState) => {
      const { formData } = prevState;
      formData.append(name, value);
      return {
        ...prevState,
        formData
      };
    })("xo-filters/pushFormDataItem");
  }
  function updateFormDataItem(name, value, isPaginate) {
    xoStore.set("xo-filters", (prevState) => {
      const { formData } = prevState;
      formData.set(name, value);
      if (!isPaginate) {
        formData.delete("page");
      }
      return {
        ...prevState,
        formData
      };
    })("xo-filters/updateFormDataItem");
  }
  function removeFormDataItem(name, value) {
    const hasValue = value != null;
    xoStore.set("xo-filters", (prevState) => {
      const { formData } = prevState;
      formData.delete("page");
      const data = Array.from(formDataPriceJoin(formData));
      const newFormData = reduce(data, (formData2, [key, val]) => {
        if (hasValue) {
          if (key === name && val === value) {
            return formData2;
          }
        } else if (key === name) {
          return formData2;
        }
        formData2.append(key, val);
        return formData2;
      }, new FormData());
      return {
        ...prevState,
        formData: newFormData
      };
    })("xo-filters/removeFormDataItem");
  }
  function removeRefineItem(name, value) {
    const hasValue = value != null;
    xoStore.set("xo-filters", (prevState) => {
      return {
        ...prevState,
        refine: filter(prevState.refine, (item) => {
          if (hasValue) {
            return !(item.name === name && item.value === value);
          }
          return item.name !== name;
        })
      };
    })("xo-filters/removeRefineItem");
  }
  function removeAllRefineAndFormData() {
    xoStore.set("xo-filters", (prevState) => {
      const { formData } = prevState;
      const q = formData.get("q");
      const newFormData = new FormData();
      if (q) {
        newFormData.append("q", q);
      }
      return {
        ...prevState,
        refine: [],
        formData: newFormData
      };
    })("xo-filters/removeAllRefineAndFormData");
  }
  const cache = /* @__PURE__ */ new Map();
  async function getHtml(url) {
    if (cache.size > 10) {
      const val = cache.keys().next().value;
      if (val != null) {
        cache.delete(val);
      }
    }
    try {
      xoStore.set("xo-filters", (prevState) => {
        return {
          ...prevState,
          status: "request"
        };
      })("xo-filters/getHtml/request");
      if (cache.has(url)) {
        await delay(10);
        xoStore.set("xo-filters", (prevState) => {
          return {
            ...prevState,
            status: "success",
            html: cache.get(url),
            prevHtml: prevState.html
          };
        })("xo-filters/getHtml/success");
      } else {
        const response = await fetch(url);
        const html = await response.text();
        cache.set(url, html);
        xoStore.set("xo-filters", (prevState) => {
          return {
            ...prevState,
            status: "success",
            html,
            prevHtml: prevState.html
          };
        })("xo-filters/getHtml/success");
      }
    } catch {
      xoStore.set("xo-filters", (prevState) => {
        return {
          ...prevState,
          status: "failure"
        };
      })("xo-filters/getHtml/failure");
    }
  }
  function resetStatus() {
    xoStore.set("xo-filters", (prevState) => {
      return {
        ...prevState,
        status: "idle"
      };
    })("xo-filters/resetStatus");
  }
  function getState$2() {
    return xoStore.get("xo-filters");
  }
  function subscribe$3(listener, equal2) {
    return xoStore.subscribe("xo-filters", listener, equal2);
  }
  const sfn = {
    sort: "sort_by",
    page: "page",
    price: "['filter.v.price.gte', 'filter.v.price.lte']"
  };
  function isField(el, type) {
    if (!el)
      return false;
    const tagName = el.tagName.toLowerCase();
    if (tagName === "input") {
      return el.getAttribute("type") === type;
    }
    return tagName === type;
  }
  function checkField(el) {
    if (el.children.length !== 1 && !/input|select|xo-range/g.test(el.children[0].tagName.toLowerCase())) {
      throw new Error(`${WebComponent.FiltersField}: field must have one child and it must be an input, select or ${WebComponent.Range}`);
    }
  }
  function formDataPriceJoin(formData) {
    var _a2, _b2;
    if (!formData.get("filter.v.price.gte")) {
      return formData;
    }
    const priceMin = (_a2 = Number(formData.get("filter.v.price.gte"))) != null ? _a2 : 0;
    const priceMax = (_b2 = Number(formData.get("filter.v.price.lte"))) != null ? _b2 : 0;
    formData.delete("filter.v.price.gte");
    formData.delete("filter.v.price.lte");
    formData.set(sfn.price, `[${priceMin}, ${priceMax}]`);
    return formData;
  }
  function formDataPriceSplit(formData) {
    if (!formData.get(sfn.price)) {
      return formData;
    }
    const price = formData.get(sfn.price);
    formData.delete(sfn.price);
    const [priceMin, priceMax] = objectParse(price);
    formData.set("filter.v.price.gte", String(priceMin));
    formData.set("filter.v.price.lte", String(priceMax));
    return formData;
  }
  function pushHistory() {
    const { formData } = getState$2();
    const url = new URL(window.location.href.replace(window.location.search, ""));
    url.search = queryString.stringify(formDataPriceSplit(formData));
    if (url.href !== window.location.href) {
      window.history.pushState(null, "", url.href);
    }
  }
  async function navigate() {
    const { formData, sectionId } = getState$2();
    const url = new URL(window.location.href.replace(window.location.search, ""));
    url.search = queryString.stringify(formDataPriceSplit(formData));
    await getHtml(sectionId ? url.href.includes("?") ? `${url.href}&section_id=${sectionId}` : `${url.href}?section_id=${sectionId}` : url.href);
    if (url.href !== window.location.href) {
      window.history.pushState(null, "", url.href);
    }
  }
  function setQueue(callback) {
    let id2 = -1;
    if ("requestIdleCallback" in window && "cancelIdleCallback" in window) {
      id2 = requestIdleCallback(() => {
        callback();
        cancelIdleCallback(id2);
      });
    } else {
      id2 = setTimeout(() => {
        callback();
        clearTimeout(id2);
      }, 0);
    }
    return id2;
  }
  function clearQueue(id2) {
    if ("cancelIdleCallback" in window) {
      cancelIdleCallback(id2);
    } else {
      clearTimeout(id2);
    }
  }
  function handleDesktopMobile() {
    let prevWidth = 0;
    const handler = () => {
      var _a2;
      const suffix = "::disabled";
      const desktopFilterEl = document.querySelector(WebComponent.Filters);
      const mobileFilterEl = document.querySelector(WebComponent.FiltersMobile);
      if (desktopFilterEl && mobileFilterEl) {
        const radioMobileEls = Array.from(mobileFilterEl.querySelectorAll(`${WebComponent.FiltersField} input[type="radio"]`));
        const radioDesktopEls = Array.from(desktopFilterEl.querySelectorAll(`${WebComponent.FiltersField} input[type="radio"]`)).filter((el) => !el.closest(WebComponent.FiltersMobile));
        const options = getAttrs(mobileFilterEl, {
          pick: ["xoMobileMaxWidth"],
          types: {
            xoMobileMaxWidth: "number"
          }
        });
        const mobileMaxWidth = (_a2 = options.xoMobileMaxWidth) != null ? _a2 : 767;
        const isMobileDevice = window.innerWidth <= mobileMaxWidth || device.mobile();
        if (isMobileDevice) {
          each(radioDesktopEls, (radioEl) => {
            const name = radioEl.getAttribute("name");
            if (name && !name.includes(suffix)) {
              radioEl.checked = false;
              radioEl.setAttribute("name", name + suffix);
            }
          });
          each(radioMobileEls, (radioEl) => {
            const name = radioEl.getAttribute("name");
            if (name) {
              if (radioEl.hasAttribute("checked")) {
                radioEl.checked = true;
              }
              radioEl.setAttribute("name", name.replace(suffix, ""));
            }
          });
        } else {
          each(radioMobileEls, (radioEl) => {
            const name = radioEl.getAttribute("name");
            if (name && !name.includes(suffix)) {
              radioEl.checked = false;
              radioEl.setAttribute("name", name + suffix);
            }
          });
          each(radioDesktopEls, (radioEl) => {
            const name = radioEl.getAttribute("name");
            if (name) {
              if (radioEl.hasAttribute("checked")) {
                radioEl.checked = true;
              }
              radioEl.setAttribute("name", name.replace(suffix, ""));
            }
          });
        }
      }
    };
    const handleResize = debounce((entries) => {
      for (let entry of entries) {
        const currentWidth = entry.contentRect.width;
        if (currentWidth !== prevWidth) {
          handler();
          prevWidth = currentWidth;
        }
      }
    }, 300);
    handler();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.body);
  }
  function withMoneyFormat(el, value) {
    var _a2, _b2, _c2;
    const rootFormat = document.documentElement.getAttribute("xo-money-format");
    const format = (_c2 = (_b2 = (_a2 = el.closest(WebComponent.Filters)) == null ? void 0 : _a2.getAttribute("xo-money-format")) != null ? _b2 : el.getAttribute("xo-money-format")) != null ? _c2 : "";
    if (rootFormat) {
      return rootFormat.replace(/\{\{\s*(\w+)\s*\}\}/g, `${value}`);
    }
    return format.replace(/{.*}|(\d+(,|\.)?)+/g, `${value}`);
  }
  const _Range = class extends XoHTMLElement {
    constructor() {
      super();
      __publicField(this, "inputEl1", null);
      __publicField(this, "inputEl2", null);
      __publicField(this, "trackEl", null);
      __publicField(this, "thumbEl1", null);
      __publicField(this, "thumbEl2", null);
      __publicField(this, "progressEl", null);
      __publicField(this, "priceEls", []);
      __publicField(this, "valueEls", []);
      __publicField(this, "initialized", false);
      __publicField(this, "resizeObserver", null);
      __publicField(this, "prevWidth", 0);
      __publicField(this, "_value", [0, 100]);
      __publicField(this, "min", 0);
      __publicField(this, "max", 100);
      __publicField(this, "createChildComponent", (tagName) => {
        const element = document.createElement(tagName);
        return element;
      });
      __publicField(this, "createRange", (index, label) => {
        const { xoName, xoMin, xoMax, xoStep, xoValue } = this.options;
        const element = document.createElement("input");
        element.type = "range";
        element.name = `${xoName}`;
        element.min = `${xoMin}`;
        element.max = `${xoMax}`;
        element.step = `${xoStep}`;
        element.value = `${xoValue[index]}`;
        element.setAttribute("aria-label", label);
        element.addEventListener("input", this.handleInput);
        element.addEventListener("click", this.handleInput);
        element.addEventListener("mouseup", this.handleChangeEnd);
        element.addEventListener("touchend", this.handleChangeEnd);
        return element;
      });
      __publicField(this, "handleInput", (event) => {
        var _a2, _b2, _c2, _d2;
        const value1 = (_b2 = Number((_a2 = this.inputEl1) == null ? void 0 : _a2.value)) != null ? _b2 : 0;
        const value2 = (_d2 = Number((_c2 = this.inputEl2) == null ? void 0 : _c2.value)) != null ? _d2 : 0;
        if (this.inputEl1 && event.target === this.inputEl1 && value1 >= value2) {
          this.inputEl1.value = `${value2}`;
          return;
        }
        if (this.inputEl2 && event.target === this.inputEl2 && value2 <= value1) {
          this.inputEl2.value = `${value1}`;
          return;
        }
        this.setAttribute("xo-value", `[${value1}, ${value2}]`);
        this.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value: [value1, value2] } }));
      });
      __publicField(this, "handler", ([value1, value2]) => {
        if (!this.inputEl1 || !this.inputEl2 || !this.thumbEl1 || !this.thumbEl2 || !this.progressEl) {
          return;
        }
        const { xoMin, xoMax, xoName, xoComponentName } = this.options;
        this.inputEl1.setAttribute("value", `${value1}`);
        this.inputEl1.value = `${value1}`;
        this.inputEl2.setAttribute("value", `${value2}`);
        this.inputEl2.value = `${value2}`;
        this.inputEl1.setAttribute("name", `${xoName[0]}`);
        this.inputEl2.setAttribute("name", `${xoName[1]}`);
        each(this.priceEls, (el) => {
          if (el.getAttribute("xo-component-name") === xoComponentName) {
            if (el.getAttribute("xo-type") === "min") {
              el.innerHTML = withMoneyFormat(el, value1);
            } else if (el.getAttribute("xo-type") === "max") {
              el.innerHTML = withMoneyFormat(el, value2);
            }
          }
        });
        each(this.valueEls, (el) => {
          if (el.getAttribute("xo-component-name") === xoComponentName) {
            if (el.getAttribute("xo-type") === "min") {
              el.setAttribute("value", `${value1}`);
              el.value = `${value1}`;
            } else if (el.getAttribute("xo-type") === "max") {
              el.setAttribute("value", `${value2}`);
              el.value = `${value2}`;
            }
          }
        });
        const x1 = interpolate({
          value: Math.min(value1, this.value[1]),
          inputRange: [xoMin, xoMax],
          outputRange: [0, this.offsetWidth - this.thumbEl1.offsetWidth]
        });
        const x2 = interpolate({
          value: Math.max(value2, this.value[0]),
          inputRange: [xoMin, xoMax],
          outputRange: [0, this.offsetWidth - this.thumbEl2.offsetWidth]
        });
        this.thumbEl1.style.transform = `translateX(${x1}px)`;
        this.thumbEl2.style.transform = `translateX(${x2}px)`;
        this.progressEl.style.transform = `translateX(${x1}px)`;
        this.progressEl.style.width = `${x2 - x1}px`;
      });
      __publicField(this, "handleValueInput", (event) => {
        const el = event.currentTarget;
        const valNum = Number(el.value);
        const { xoMin, xoMax } = this.options;
        if (valNum !== null && !isNaN(valNum)) {
          if (el.getAttribute("xo-type") === "min") {
            const val = el.value ? Math.max(valNum, xoMin) : xoMin;
            this.value = [val, this.value[1]];
          } else if (el.getAttribute("xo-type") === "max") {
            const val = el.value ? Math.min(valNum, xoMax) : xoMax;
            this.value = [this.value[0], val];
          }
          this.handleChangeEnd();
        }
      });
      __publicField(this, "handleChangeEnd", () => {
        this.dispatchEvent(new CustomEvent("changed", { bubbles: true, detail: { value: this.value } }));
      });
      __publicField(this, "setSize", () => {
        this.style.setProperty("--size", `${this.thumbEl1.offsetHeight}`);
      });
      this.innerHTML = "";
    }
    get options() {
      const options = getAttrs(this, {
        pick: ["xoComponentName", "xoName", "xoMin", "xoMax", "xoStep", "xoValue"],
        types: {
          xoComponentName: "string",
          xoName: "array",
          xoMin: "number",
          xoMax: "number",
          xoStep: "number",
          xoValue: "array"
        }
      });
      return { ..._Range.defaultOptions, ...options };
    }
    get value() {
      return this._value;
    }
    set value(value) {
      this._value = value;
      this.setAttribute("xo-value", `[${value[0]}, ${value[1]}]`);
    }
    static get observedAttributes() {
      return ["xo-value", "xo-observed"];
    }
    onConnected() {
      const { xoValue, xoMin, xoMax, xoComponentName } = this.options;
      this.innerHTML = "";
      this.inputEl1 = this.appendChild(this.createRange(0, "Min"));
      this.inputEl2 = this.appendChild(this.createRange(1, "Max"));
      this.trackEl = this.appendChild(this.createChildComponent(WebComponent.RangeTrack));
      this.thumbEl1 = this.appendChild(this.createChildComponent(WebComponent.RangeThumb));
      this.thumbEl2 = this.appendChild(this.createChildComponent(WebComponent.RangeThumb));
      this.progressEl = this.trackEl.appendChild(this.createChildComponent(WebComponent.RangeProgress));
      (async () => {
        await delay(0);
        this.thumbEl1.setAttribute("xo-index", "0");
        this.thumbEl2.setAttribute("xo-index", "1");
        this.value = xoValue;
        this.setSize();
        this.min = xoMin;
        this.max = xoMax;
        this.priceEls = Array.from(document.querySelectorAll(`${WebComponent.RangePrice}[xo-component-name=${xoComponentName}]`));
        this.valueEls = Array.from(document.querySelectorAll(`input[xo-component-name=${xoComponentName}]`));
        this.handler(this.value);
        each(this.valueEls, (el) => {
          if (el.getAttribute("xo-component-name") === xoComponentName) {
            el.addEventListener("input", this.handleValueInput);
          }
        });
        this.resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            const currentWidth = entry.contentRect.width;
            if (currentWidth !== this.prevWidth) {
              this.setSize();
              this.handler(this.value);
              this.prevWidth = currentWidth;
            }
          }
        });
        this.resizeObserver.observe(this);
      })();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if ((oldValue != null && newValue != null || name === "xo-observed") && oldValue !== newValue) {
        const value = objectParse(newValue);
        this.value = value;
        this.handler(value);
        if (this.initialized) {
          this.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value } }));
        }
        this.initialized = true;
      }
    }
    disconnectedCallback() {
      var _a2;
      if (!this.inputEl1 || !this.inputEl2) {
        return;
      }
      this.inputEl1.removeEventListener("input", this.handleInput);
      this.inputEl2.removeEventListener("input", this.handleInput);
      this.inputEl1.removeEventListener("mouseup", this.handleChangeEnd);
      this.inputEl2.removeEventListener("mouseup", this.handleChangeEnd);
      this.inputEl1.removeEventListener("touchend", this.handleChangeEnd);
      this.inputEl2.removeEventListener("touchend", this.handleChangeEnd);
      this.inputEl1.removeEventListener("click", this.handleInput);
      this.inputEl2.removeEventListener("click", this.handleInput);
      each(this.valueEls, (el) => {
        el.removeEventListener("input", this.handleValueInput);
      });
      (_a2 = this.resizeObserver) == null ? void 0 : _a2.disconnect();
    }
  };
  let Range = _Range;
  __publicField(Range, "defaultOptions", {
    xoComponentName: "xo-range",
    xoName: ["", ""],
    xoMin: 0,
    xoMax: 100,
    xoStep: 1,
    xoValue: [0, 100]
  });
  const styles$k = "";
  componentDefine({
    [WebComponent.Range]: Range
  });
  const css = createCssInJs();
  const shadowStyles = css`
  ${WebComponent.StickyInner} {
    position: relative;
    will-change: transform;
  }
  ${WebComponent.StickyInner}[xo-is-sticky] {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: all 0.3s;
    backface-visibility: hidden;
  }
  ${WebComponent.StickyInner}[xo-lock] {
    transform: translateY(0) !important;
  }
  ${WebComponent.StickyContent} {
    display: block;
  }
  ${WebComponent.StickyInner}[xo-hidden] {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
`;
  function createState$2() {
    xoStore.create("xo-sticky", {
      initialState: {
        topNodes: [],
        bottomNodes: []
      }
    });
  }
  function getNodes(placement) {
    const state = xoStore.get("xo-sticky");
    return placement === "top" ? state.topNodes : state.bottomNodes;
  }
  function getKey(placement) {
    return placement === "top" ? "topNodes" : "bottomNodes";
  }
  function addNode(el, direction, placement) {
    xoStore.set("xo-sticky", (prevState) => {
      const nodes = getNodes(placement);
      const hasNode = nodes.find((n) => n.element === el);
      const node = {
        element: el,
        height: el.offsetHeight,
        isSticky: false,
        direction,
        directionDownHide: false
      };
      const newNodes = hasNode ? nodes : placement === "top" ? [...nodes, node] : [node, ...nodes];
      return {
        ...prevState,
        [getKey(placement)]: newNodes
      };
    });
  }
  function changeHeight(el, placement, height) {
    xoStore.set("xo-sticky", (prevState) => {
      const nodes = getNodes(placement);
      return {
        ...prevState,
        [getKey(placement)]: map(nodes, (node) => {
          if (node.element === el) {
            return {
              ...node,
              height
            };
          }
          return node;
        })
      };
    });
  }
  function removeNode(el, placement) {
    xoStore.set("xo-sticky", (prevState) => {
      const nodes = getNodes(placement);
      const newNodes = filter(nodes, (n) => n.element !== el);
      return {
        ...prevState,
        [getKey(placement)]: newNodes
      };
    });
  }
  function setIsSticky(el, value, placement) {
    xoStore.set("xo-sticky", (prevState) => {
      const nodes = getNodes(placement);
      return {
        ...prevState,
        [getKey(placement)]: map(nodes, (node) => {
          if (node.element === el) {
            return {
              ...node,
              isSticky: value
            };
          }
          return node;
        })
      };
    });
  }
  function setDirectionDownHide(el, value, placement) {
    xoStore.set("xo-sticky", (prevState) => {
      const nodes = getNodes(placement);
      return {
        ...prevState,
        [getKey(placement)]: map(nodes, (node) => {
          if (node.element === el) {
            return {
              ...node,
              directionDownHide: value
            };
          }
          return node;
        })
      };
    });
  }
  const offsets = /* @__PURE__ */ new Map();
  function getOffset(el, placement) {
    var _a2;
    const nodes = getNodes(placement);
    const i = findIndex(nodes, (n) => n.element === el);
    const nodesFilter = filter(nodes, (node, index) => {
      return index < i && node.isSticky;
    });
    const offset2 = reduce(nodesFilter, (a, b) => a + b.height, 0);
    offsets.set(el, offset2);
    return (_a2 = offsets.get(el)) != null ? _a2 : 0;
  }
  function getHeightDirectionUp(el, placement) {
    const nodes = getNodes(placement);
    const i = findIndex(nodes, (n) => n.element === el);
    return reduce(nodes, (acc, node, index) => {
      const cond = index < i && node.direction === "up" && node.isSticky;
      return cond ? acc + node.height : acc;
    }, 0);
  }
  function getStickyHeight(placement) {
    const nodes = getNodes(placement);
    const totalHeight = reduce(nodes, (acc, node) => {
      if (node.directionDownHide) {
        return acc;
      }
      if (node.isSticky) {
        return acc + node.height;
      }
      return acc;
    }, 0);
    return totalHeight;
  }
  function subscribe$2(listener, equal2) {
    return xoStore.subscribe("xo-sticky", listener, equal2);
  }
  const _Sticky = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "shadow", null);
      __publicField(this, "innerEl");
      __publicField(this, "contentEl");
      __publicField(this, "prevScrollY", 0);
      __publicField(this, "contentHeightCache", createCache(5e3));
      __publicField(this, "ticking", false);
      __publicField(this, "_options");
      __publicField(this, "setOptions", () => {
        this.options = getAttrs(this, {
          pick: ["xoDirection", "xoPlacement", "xoDisabled", "xoName", "xoHeaderTransparent"],
          types: {
            xoDirection: "string",
            xoPlacement: "string",
            xoDisabled: "boolean",
            xoName: "string",
            xoHeaderTransparent: "boolean"
          }
        });
      });
      __publicField(this, "addSticky", (placement, offset2) => {
        attrBoolean.set(this.innerEl, "xo-is-sticky", true);
        if (placement === "top") {
          this.innerEl.style.top = `${offset2}px`;
        } else {
          this.innerEl.style.bottom = `${offset2}px`;
        }
      });
      __publicField(this, "removeStick", () => {
        const { xoPlacement } = this.options;
        attrBoolean.set(this.innerEl, "xo-is-sticky", false);
        if (xoPlacement === "top") {
          this.innerEl.style.removeProperty("top");
        } else {
          this.innerEl.style.removeProperty("bottom");
        }
      });
      __publicField(this, "handleStickyTop", (height, top) => {
        const { xoDirection } = this.options;
        const offset2 = getOffset(this.contentEl, "top");
        const heightDirectionUp = getHeightDirectionUp(this.contentEl, "top");
        const up = window.scrollY < this.prevScrollY;
        if (window.scrollY === this.prevScrollY) {
          return;
        }
        if (xoDirection === "up") {
          if (up) {
            if (top < offset2 - height) {
              this.addSticky("top", offset2);
              setIsSticky(this.contentEl, true, "top");
              setDirectionDownHide(this.contentEl, false, "top");
              attrBoolean.set(this, "xo-is-sticky", true);
            } else if (top >= offset2) {
              this.removeStick();
              setIsSticky(this.contentEl, false, "top");
              setDirectionDownHide(this.contentEl, true, "top");
              attrBoolean.set(this, "xo-is-sticky", false);
            }
            this.innerEl.style.transform = "translate3d(0, 0, 0)";
          } else {
            if (top < offset2 - height) {
              this.innerEl.style.transform = `translate3d(0, -${height + offset2}px, 0)`;
            }
            setDirectionDownHide(this.contentEl, true, "top");
          }
        } else {
          if (top < offset2 - heightDirectionUp) {
            this.addSticky("top", offset2);
            setIsSticky(this.contentEl, true, "top");
            attrBoolean.set(this, "xo-is-sticky", true);
          } else if (top >= offset2) {
            this.removeStick();
            setIsSticky(this.contentEl, false, "top");
            attrBoolean.set(this, "xo-is-sticky", false);
          }
          if (up) {
            this.innerEl.style.transform = "translate3d(0, 0, 0)";
          } else {
            this.innerEl.style.transform = `translate3d(0, -${heightDirectionUp}px, 0)`;
          }
        }
      });
      __publicField(this, "handleStickyBottom", (height, top) => {
        const { xoDirection } = this.options;
        const offset2 = getOffset(this.contentEl, "bottom");
        const heightDirectionUp = getHeightDirectionUp(this.contentEl, "bottom");
        const up = window.scrollY < this.prevScrollY;
        const bottom = top - window.innerHeight + height;
        if (window.scrollY === this.prevScrollY) {
          return;
        }
        if (xoDirection === "up") {
          if (bottom < offset2 - heightDirectionUp + height) {
            this.addSticky("bottom", offset2);
            setIsSticky(this.contentEl, true, "bottom");
            setDirectionDownHide(this.contentEl, false, "bottom");
            this.innerEl.style.transform = "translate3d(0, 0, 0)";
            if (up) {
              attrBoolean.set(this, "xo-is-sticky", true);
            }
          } else if (bottom >= offset2 + height) {
            setIsSticky(this.contentEl, false, "bottom");
            setDirectionDownHide(this.contentEl, true, "bottom");
            this.innerEl.style.transform = `translate3d(0, ${height + offset2}px, 0)`;
            attrBoolean.set(this, "xo-is-sticky", false);
          }
          if (!up) {
            this.innerEl.style.transform = `translate3d(0, ${height + offset2}px, 0)`;
            setDirectionDownHide(this.contentEl, true, "bottom");
          }
        } else {
          if (bottom < offset2 - heightDirectionUp) {
            this.addSticky("bottom", offset2);
            setIsSticky(this.contentEl, true, "bottom");
            attrBoolean.set(this, "xo-is-sticky", true);
          } else if (bottom >= offset2) {
            this.removeStick();
            setIsSticky(this.contentEl, false, "bottom");
            attrBoolean.set(this, "xo-is-sticky", false);
          }
          if (up) {
            this.innerEl.style.transform = "translate3d(0, 0, 0)";
          } else {
            this.innerEl.style.transform = `translate3d(0, ${heightDirectionUp}px, 0)`;
          }
        }
      });
      __publicField(this, "handleHidden", () => {
        const { xoName } = this.options;
        const hiddenEl = document.querySelector(`${WebComponent.StickyHidden}[xo-name="${xoName}"]`);
        if (hiddenEl) {
          const { top: hiddenTop } = hiddenEl.getBoundingClientRect();
          attrBoolean.set(this.innerEl, "xo-hidden", hiddenTop < window.innerHeight);
        }
      });
      __publicField(this, "setHeaderHeightVariable", (height) => {
        const { xoHeaderTransparent } = this.options;
        if (xoHeaderTransparent) {
          document.body.style.setProperty("--header-sticky-height", `${height}px`);
        }
      });
      __publicField(this, "handler", () => {
        if (this.ticking) {
          return;
        }
        this.ticking = true;
        const { xoPlacement } = this.options;
        const height = this.contentHeightCache.set(() => this.contentEl.offsetHeight);
        const { top } = this.getBoundingClientRect();
        requestAnimationFrame(() => {
          this.contentEl.style.height = `${height}px`;
          this.innerEl.style.height = `${height}px`;
          this.setHeaderHeightVariable(height);
          if (xoPlacement === "top") {
            this.handleStickyTop(height, top);
          } else {
            this.handleStickyBottom(height, top);
            this.handleHidden();
          }
          this.ticking = false;
          this.prevScrollY = window.scrollY;
        });
      });
      __publicField(this, "render", () => {
        const { cssText } = shadowStyles;
        return `
      <style>${cssText}</style>
      <${WebComponent.StickyInner} part="inner">
        <${WebComponent.StickyContent} part="content"><slot></slot></${WebComponent.StickyContent}>
      </${WebComponent.StickyInner}>
    `;
      });
      __publicField(this, "init", async () => {
        const { xoDirection, xoPlacement } = this.options;
        this.shadow = this.shadow || this.attachShadow({ mode: "open" });
        if (!this.shadow.innerHTML) {
          this.shadow.innerHTML = this.render();
        }
        this.innerEl = this.shadow.querySelector(WebComponent.StickyInner);
        this.contentEl = this.shadow.querySelector(WebComponent.StickyContent);
        await delay(100);
        addNode(this.contentEl, xoDirection, xoPlacement);
        if (xoPlacement === "top") {
          this.style.height = `${this.contentEl.offsetHeight}px`;
          this.setHeaderHeightVariable(this.contentEl.offsetHeight);
        }
        this.handler();
        window.addEventListener("scroll", this.handler, { passive: true });
        window.addEventListener("resize", this.handler, { passive: true });
      });
      __publicField(this, "setHeight", (placement, height) => {
        this.contentEl.style.height = `${height}px`;
        this.innerEl.style.height = `${height}px`;
        this.setHeaderHeightVariable(height);
        changeHeight(this.contentEl, placement, height);
      });
    }
    get options() {
      return {
        ..._Sticky.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    static get observedAttributes() {
      return ["xo-observed", "xo-direction", "xo-placement", "xo-header-transparent"];
    }
    onConnected() {
      this.setOptions();
      const { xoDisabled } = this.options;
      if (xoDisabled) {
        return;
      }
      this.init();
    }
    disconnectedCallback() {
      const { xoPlacement } = this.options;
      if (this.innerEl) {
        this.innerEl.style.removeProperty("height");
        this.innerEl.style.removeProperty("transform");
        this.innerEl.style.removeProperty("top");
        this.innerEl.style.removeProperty("bottom");
      }
      if (this.contentEl) {
        this.contentEl.style.removeProperty("height");
      }
      this.style.removeProperty("height");
      attrBoolean.set(this, "xo-is-sticky", false);
      if (this.innerEl) {
        attrBoolean.set(this.innerEl, "xo-is-sticky", false);
      }
      window.removeEventListener("scroll", this.handler);
      window.removeEventListener("resize", this.handler);
      if (this.contentEl) {
        removeNode(this.contentEl, xoPlacement);
      }
      this.unsubscribe();
    }
    async attributeChangedCallback(_, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.disconnectedCallback();
        await delay(100);
        this.onConnected();
      }
    }
  };
  let Sticky = _Sticky;
  __publicField(Sticky, "defaultOptions", {
    xoDirection: "up",
    xoPlacement: "top",
    xoDisabled: false,
    xoName: ""
  });
  const _StickySpace = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", null);
      __publicField(this, "prevStickyHeight", 0);
    }
    get options() {
      const options = getAttrs(this, {
        pick: ["xoPlacement"],
        types: {
          xoPlacement: "string"
        }
      });
      return {
        ..._StickySpace.defaultOptions,
        ...options
      };
    }
    onConnected() {
      const { xoPlacement } = this.options;
      this.unsubscribe = subscribe$2(() => {
        const stickyHeight = getStickyHeight(xoPlacement);
        if (this.prevStickyHeight !== stickyHeight) {
          this.style.height = `${stickyHeight}px`;
          this.prevStickyHeight = stickyHeight;
        }
      });
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this.unsubscribe) == null ? void 0 : _a2.call(this);
    }
  };
  let StickySpace = _StickySpace;
  __publicField(StickySpace, "defaultOptions", {
    xoPlacement: "top"
  });
  const styles$j = "";
  createState$2();
  const xoSticky = { subscribe: subscribe$2, getStickyHeight, getNodes };
  window.xoSticky = xoSticky;
  componentDefine({
    [WebComponent.Sticky]: Sticky,
    [WebComponent.StickySpace]: StickySpace
  });
  const _Filters = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "unsubscribe2", () => {
      });
      __publicField(this, "timeId", -1);
      __publicField(this, "_options");
      __publicField(this, "setOptions", () => {
        this.options = getAttrs(this, {
          pick: ["xoScrollTop", "xoSectionId"],
          types: {
            xoScrollTop: "boolean",
            xoSectionId: "string"
          }
        });
      });
      __publicField(this, "getStickyHeight", () => {
        const nodes = xoSticky.getNodes("top");
        const totalHeight = reduce(nodes, (acc, node) => {
          return acc + node.height;
        }, 0);
        return totalHeight;
      });
      __publicField(this, "listener", async () => {
        const { xoScrollTop } = this.options;
        await delay(100);
        if (xoScrollTop) {
          const topEl = document.querySelector(WebComponent.FiltersTop);
          if (topEl) {
            if (window.scrollY > offset(topEl).top) {
              window.scrollTo({
                top: offset(topEl).top - this.getStickyHeight(),
                behavior: "smooth"
              });
            }
          } else {
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }
        }
      });
      __publicField(this, "listener2", () => {
        const { status } = getState$2();
        if (status === "request") {
          const loadmoreBtnEl = this.querySelector(WebComponent.FiltersLoadMore);
          attrBoolean.set(this, "xo-loading", loadmoreBtnEl ? attrBoolean.get(loadmoreBtnEl, "xo-loading") ? false : true : true);
        } else if (status === "success") {
          attrBoolean.set(this, "xo-loading", false);
        }
      });
      __publicField(this, "handlePopState", async (event) => {
        event.preventDefault();
        const { search } = window.location;
        const params = queryString.parse(search);
        const formData = new FormData();
        each(params, ([key, value]) => {
          formData.append(key, value);
        });
        setFormData(formData);
        await getHtml(window.location.href);
        setRefine();
      });
      __publicField(this, "setDefaultFieldsFromParams", () => {
        const { search } = window.location;
        const params = queryString.parse(search);
        const formData = new FormData();
        each(params, ([key, value]) => {
          formData.append(key, value);
        });
        const newFormData = formDataPriceJoin(formData);
        const newParams = queryString.parse(newFormData);
        each(newParams, ([name, value]) => {
          const fieldEls = Array.from(this.querySelectorAll(`${WebComponent.FiltersField} [name="${name}"], ${WebComponent.FiltersField} xo-range[xo-name="${sfn.price}"]`));
          each(fieldEls, (fieldEl) => {
            if (fieldEl) {
              if ((isField(fieldEl, "checkbox") || isField(fieldEl, "radio")) && name === fieldEl.getAttribute("name")) {
                const fieldEl2 = this.querySelector(`[name='${name}'][value='${value}']`);
                fieldEl2.checked = true;
                if (isField(fieldEl2, "radio")) {
                  const sortBySelectedEls = Array.from(this.querySelectorAll(WebComponent.FiltersSortBySelected));
                  each(sortBySelectedEls, (sortBySelectedEl) => {
                    var _a2;
                    if (fieldEl2.name === sfn.sort) {
                      sortBySelectedEl.textContent = (_a2 = fieldEl2.getAttribute("xo-label")) != null ? _a2 : value;
                    }
                  });
                }
              } else if (isField(fieldEl, "xo-range") && name === fieldEl.getAttribute("xo-name")) {
                const [val1, val2] = objectParse(value);
                fieldEl.setAttribute("xo-value", `[${val1}, ${val2}]`);
                fieldEl.value = [val1, val2];
              } else if (fieldEl instanceof HTMLSelectElement) {
                fieldEl.value = value;
              }
            }
          });
        });
      });
    }
    get options() {
      return {
        ..._Filters.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    async onConnected() {
      this.setOptions();
      this.timeId = window.setTimeout(() => {
        setDefaultFormData();
        this.setDefaultFieldsFromParams();
        setRefine();
        pushHistory();
        setSectionId(this.options.xoSectionId);
        clearTimeout(this.timeId);
      }, 50);
      window.addEventListener("popstate", this.handlePopState);
      if (!this.querySelector(WebComponent.FiltersLoadMore)) {
        this.unsubscribe = subscribe$3(this.listener, (prevState, nextState) => {
          return !(prevState != null && (prevState == null ? void 0 : prevState.html) !== (nextState == null ? void 0 : nextState.html) && prevState != null || prevState != null && !equal(prevState == null ? void 0 : prevState.refine, nextState == null ? void 0 : nextState.refine));
        });
      }
      this.unsubscribe2 = subscribe$3(this.listener2, (prevState, nextState) => {
        return (prevState == null ? void 0 : prevState.status) === (nextState == null ? void 0 : nextState.status);
      });
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue !== newValue) {
        this.setOptions();
      }
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.unsubscribe2();
      window.removeEventListener("popstate", this.handlePopState);
      clearTimeout(this.timeId);
    }
  };
  let Filters = _Filters;
  __publicField(Filters, "defaultOptions", {
    xoScrollTop: true,
    xoSectionId: ""
  });
  class FiltersField extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "handleInput", async (event) => {
        var _a2, _b2;
        const fieldEl = event.target;
        if (fieldEl instanceof HTMLInputElement && fieldEl.type !== "range") {
          if (isField(fieldEl, "checkbox")) {
            if (fieldEl.checked) {
              pushFormDataItem(fieldEl.name, fieldEl.value);
            } else {
              removeFormDataItem(fieldEl.name, fieldEl.value);
            }
          } else {
            const filtersEl = document.querySelector(WebComponent.Filters);
            if (filtersEl && isField(fieldEl, "radio")) {
              const popoverEl = fieldEl.closest(WebComponent.Popover);
              const popoverName = popoverEl == null ? void 0 : popoverEl.getAttribute("xo-name");
              const popoverTriggerEl = document.querySelector(`${WebComponent.PopoverTrigger}[xo-name="${popoverName}"]`);
              const sortBySelectedEls = Array.from((popoverTriggerEl != null ? popoverTriggerEl : filtersEl).querySelectorAll(WebComponent.FiltersSortBySelected));
              each(sortBySelectedEls, (sortBySelectedEl) => {
                var _a3;
                if (fieldEl.name === sfn.sort) {
                  sortBySelectedEl.textContent = (_a3 = fieldEl.getAttribute("xo-label")) != null ? _a3 : fieldEl.value;
                }
              });
              if (fieldEl.name === sfn.sort) {
                if (popoverEl && popoverName) {
                  xoPopover.close(popoverName);
                }
              }
            }
            updateFormDataItem(fieldEl.name, fieldEl.value);
          }
        } else if (fieldEl instanceof HTMLSelectElement) {
          updateFormDataItem(fieldEl.name, fieldEl.value);
        } else if (isField(fieldEl, "xo-range")) {
          const [val1, val2] = fieldEl.value;
          const min = (_a2 = Number(fieldEl.getAttribute("xo-min"))) != null ? _a2 : 0;
          const max = (_b2 = Number(fieldEl.getAttribute("xo-max"))) != null ? _b2 : 0;
          if (val1 === min && val2 === max) {
            removeFormDataItem(sfn.price);
          } else {
            updateFormDataItem(sfn.price, `[${val1}, ${val2}]`);
          }
        }
        const query = queryString.parse(window.location.search, true);
        if (query.page) {
          updateFormDataItem("page", query.page);
        }
        navigate();
        setRefine();
      });
      __publicField(this, "handleRange", debounce(this.handleInput));
      __publicField(this, "handler", (fieldEl) => {
        var _a2, _b2;
        if (!fieldEl)
          return;
        if (isField(fieldEl, "xo-range")) {
          setPriceMinMax((_a2 = Number(fieldEl.getAttribute("xo-min"))) != null ? _a2 : 0, (_b2 = Number(fieldEl.getAttribute("xo-max"))) != null ? _b2 : 0);
          fieldEl.addEventListener("changed", this.handleRange);
        } else {
          fieldEl.addEventListener("change", this.handleInput);
        }
      });
    }
    onConnected() {
      checkField(this);
      const fieldEls = Array.from(this.querySelectorAll("input, select, xo-range"));
      each(fieldEls, this.handler);
    }
    disconnectedCallback() {
      const fieldEl = Array.from(this.querySelectorAll("input, select, xo-range"));
      each(fieldEl, (fieldEl2) => {
        if (isField(fieldEl2, "xo-range")) {
          fieldEl2.removeEventListener("change", this.handleRange);
        } else {
          fieldEl2.removeEventListener("change", this.handleInput);
        }
      });
    }
  }
  const _FiltersClear = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "listener", () => {
        const { refine, priceMin, priceMax } = getState$2();
        const { xoName, xoClearAll } = this.options;
        if (xoClearAll) {
          const isVisible = !!filter(refine, (item) => /filter./g.test(item.name)).length;
          attrBoolean.set(this, "xo-visible", isVisible);
        } else {
          attrBoolean.set(this, "xo-visible", false);
        }
        each(refine, (item) => {
          if (!item.name.includes("filter.v.price.") && item.name === xoName) {
            attrBoolean.set(this, "xo-visible", true);
          } else if (item.name.includes("filter.v.price.") && xoName.includes("filter.v.price.")) {
            const [val0, val1] = objectParse(item.value);
            if (val0 !== priceMin || val1 !== priceMax) {
              attrBoolean.set(this, "xo-visible", true);
            }
          }
        });
      });
      __publicField(this, "resetFields", () => {
        const { xoName, xoValue, xoClearAll } = this.options;
        let fieldEls = Array.from(document.querySelectorAll(`${WebComponent.FiltersField} input[type="radio"][name="${xoName}"]${xoValue ? `[value="${escapeValue(xoValue)}"]` : ""}, ${WebComponent.FiltersField} input[type="checkbox"][name="${xoName}"]${xoValue ? `[value="${escapeValue(xoValue)}"]` : ""}, ${WebComponent.FiltersField} xo-range[xo-name="${xoName}"], ${WebComponent.FiltersField} select[name="${xoName}"]`));
        if (xoClearAll) {
          fieldEls = Array.from(document.querySelectorAll(`${WebComponent.FiltersField} input[type="radio"], ${WebComponent.FiltersField} input[type="checkbox"], ${WebComponent.FiltersField} xo-range, ${WebComponent.FiltersField} select`));
        }
        each(fieldEls, (el) => {
          if (el && isField(el, "checkbox") || isField(el, "radio")) {
            el.removeAttribute("checked");
            el.checked = false;
          } else if (isField(el, "xo-range")) {
            el.value = [el.min, el.max];
          } else if (isField(el, "select")) {
            const optionEl = el.querySelector("option");
            el.value = (optionEl == null ? void 0 : optionEl.value) || "";
          }
        });
      });
      __publicField(this, "handleClick", async () => {
        const { xoName, xoValue, xoClearAll } = this.options;
        if (xoClearAll) {
          removeAllRefineAndFormData();
        } else {
          removeRefineItem(xoName, xoValue);
          removeFormDataItem(xoName, xoValue);
          if (xoName.includes("filter.v.price.")) {
            removeRefineItem(sfn.price);
            removeFormDataItem(sfn.price);
          }
        }
        await navigate();
        this.resetFields();
      });
    }
    get options() {
      const options = getAttrs(this, {
        pick: ["xoName", "xoValue", "xoClearAll"],
        types: {
          xoName: "string",
          xoValue: "string",
          xoClearAll: "boolean"
        }
      });
      return {
        ..._FiltersClear.defaultOptions,
        ...options
      };
    }
    onConnected() {
      this.addEventListener("click", this.handleClick);
      this.unsubscribe = subscribe$3(this.listener);
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.removeEventListener("click", this.handleClick);
    }
  };
  let FiltersClear = _FiltersClear;
  __publicField(FiltersClear, "defaultOptions", {
    xoName: "",
    xoClearAll: false
  });
  class FiltersRefine extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "childEls", []);
      __publicField(this, "setEmpty", () => {
        const { refine } = getState$2();
        const isEmpty = !filter(refine, (item) => /filter./g.test(item.name)).length;
        attrBoolean.set(this, "xo-empty", isEmpty);
      });
      __publicField(this, "render", () => {
        const { refine } = getState$2();
        return map(refine, (item) => {
          var _a2, _b2, _c2;
          if (!/filter./g.test(item.name)) {
            return "";
          }
          const fieldEl = document.querySelector(`${WebComponent.FiltersField} input[type="radio"][name="${item.name}"][value="${escapeValue(item.value)}"], ${WebComponent.FiltersField} input[type="checkbox"][name="${item.name}"][value="${escapeValue(item.value)}"], ${WebComponent.FiltersField} xo-range[xo-name="${item.name}"]`);
          const label = item.name.includes("filter.v.price.") ? map(objectParse(item.value), (item2) => withMoneyFormat(this, item2)).join(" - ") : (_a2 = fieldEl == null ? void 0 : fieldEl.getAttribute("xo-label")) != null ? _a2 : "";
          const clearIcon = (_c2 = (_b2 = this.querySelector(WebComponent.FiltersRefineClearIcon)) == null ? void 0 : _b2.innerHTML) != null ? _c2 : "<span>&times;</span>";
          return `
        <${WebComponent.FiltersClear} xo-name="${item.name}" xo-value='${item.value}' role="button" tabindex="0">
          ${label} ${clearIcon}
        </${WebComponent.FiltersClear}>
      `;
        });
      });
      __publicField(this, "listener", () => {
        this.setEmpty();
        this.innerHTML = this.render().join("");
        each(this.childEls, (el) => {
          this.appendChild(el);
        });
      });
    }
    onConnected() {
      if (this.childEls.length === 0) {
        this.childEls = Array.from(this.childNodes);
      }
      this.setEmpty();
      this.unsubscribe = subscribe$3(this.listener);
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this.unsubscribe) == null ? void 0 : _a2.call(this);
    }
  }
  const xoFilters = new Emitter();
  class FiltersContent extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "callback", null);
      __publicField(this, "timeId", -1);
      __publicField(this, "loadMoreEl", (_r = this.closest(WebComponent.Filters)) == null ? void 0 : _r.querySelector(WebComponent.FiltersLoadMore));
      __publicField(this, "isReady", false);
      __publicField(this, "handleContent", (callback) => {
        this.callback = callback;
      });
      __publicField(this, "listener", async () => {
        if (!this.isReady) {
          return;
        }
        const { html, prevHtml, status } = getState$2();
        const currentIndex = Array.from(this.closest(WebComponent.Filters).querySelectorAll(WebComponent.FiltersContent)).indexOf(this);
        cancelIdleCallback$1(this.timeId);
        await delay();
        this.timeId = requestIdleCallback$1(() => {
          var _a2, _b2, _c2, _d2, _e2, _f2;
          if (status === "success") {
            if (html !== prevHtml) {
              const domParser = new DOMParser();
              const doc = domParser.parseFromString(html, "text/html");
              setHoverLevel(doc);
              const contentEls = Array.from(doc.querySelectorAll(WebComponent.FiltersContent));
              const contentEl = contentEls[currentIndex];
              if (contentEl) {
                const contentClone = contentEl.cloneNode(true);
                const animateEls = Array.from(contentClone.querySelectorAll('[xo-animate="scroll"]'));
                each(animateEls, (animateEl) => {
                  animateEl.setAttribute("xo-animate", "none");
                });
                const currentEl = document.querySelectorAll(WebComponent.FiltersContent)[currentIndex];
                const anchorEl = currentEl.querySelector(WebComponent.FiltersContentAnchor);
                const isLoadMore = this.loadMoreEl && !((_a2 = this.loadMoreEl) == null ? void 0 : _a2.state.UIUpdated);
                if (this.callback) {
                  if (contentEl.querySelector(WebComponent.Product)) {
                    if (isLoadMore && anchorEl) {
                      const domParser2 = new DOMParser();
                      const doc2 = domParser2.parseFromString(this.callback(contentClone.outerHTML), "text/html");
                      const nextAnchorEl = doc2.querySelector(WebComponent.FiltersContentAnchor);
                      const wrapEl = nextAnchorEl == null ? void 0 : nextAnchorEl.parentElement;
                      nextAnchorEl == null ? void 0 : nextAnchorEl.remove();
                      if (wrapEl) {
                        anchorEl.insertAdjacentHTML("beforebegin", wrapEl.innerHTML);
                        (_b2 = this.loadMoreEl) == null ? void 0 : _b2.UIUpdated();
                      } else {
                        (_c2 = this.loadMoreEl) == null ? void 0 : _c2.remove();
                      }
                    } else {
                      this.innerHTML = this.callback(contentClone.innerHTML);
                      const attrs = Array.from(contentClone.attributes);
                      each(attrs, (attr) => {
                        this.setAttribute(attr.name, attr.value);
                      });
                    }
                  } else if (!isLoadMore) {
                    this.innerHTML = contentClone.innerHTML;
                    const attrs = Array.from(contentClone.attributes);
                    each(attrs, (attr) => {
                      this.setAttribute(attr.name, attr.value);
                    });
                  } else {
                    (_d2 = this.loadMoreEl) == null ? void 0 : _d2.remove();
                  }
                } else {
                  if (isLoadMore && anchorEl) {
                    const nextAnchorEl = contentClone.querySelector(WebComponent.FiltersContentAnchor);
                    const wrapEl = nextAnchorEl == null ? void 0 : nextAnchorEl.parentElement;
                    nextAnchorEl == null ? void 0 : nextAnchorEl.remove();
                    if (wrapEl) {
                      anchorEl.insertAdjacentHTML("beforebegin", wrapEl.innerHTML);
                      (_e2 = this.loadMoreEl) == null ? void 0 : _e2.UIUpdated();
                    } else {
                      (_f2 = this.loadMoreEl) == null ? void 0 : _f2.remove();
                    }
                  } else {
                    this.outerHTML = contentClone.outerHTML;
                  }
                }
                xoFilters.emit("done", void 0);
                resetStatus();
              }
            }
          }
        });
      });
    }
    onConnected() {
      this.unsubscribe = subscribe$3(this.listener);
      this.isReady = true;
    }
    disconnectedCallback() {
      this.unsubscribe();
      cancelIdleCallback$1(this.timeId);
    }
  }
  class FiltersFallback extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "listener", () => {
        const { status } = getState$2();
        if (status === "request") {
          attrBoolean.set(this, "xo-visible", true);
        } else if (status === "success") {
          attrBoolean.set(this, "xo-visible", false);
        }
      });
    }
    onConnected() {
      this.unsubscribe = subscribe$3(this.listener, (prevState, nextState) => {
        return (prevState == null ? void 0 : prevState.status) === (nextState == null ? void 0 : nextState.status);
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
    }
  }
  const _FiltersCount = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "queueId", -1);
      __publicField(this, "listener", () => {
        clearQueue(this.queueId);
        this.queueId = setQueue(() => {
          var _a2;
          const { xoUniqueId } = this.options;
          const { html } = getState$2();
          const domParser = new DOMParser();
          const doc = domParser.parseFromString(html, "text/html");
          const newCountEl = doc.querySelector(`${WebComponent.FiltersCount}[xo-unique-id="${escapeValue(xoUniqueId)}"]`);
          if (newCountEl && newCountEl.textContent && this.textContent !== newCountEl.textContent) {
            setHoverLevel(newCountEl);
            const count2 = (_a2 = Number(newCountEl.textContent.trim().replace(/\D*/g, ""))) != null ? _a2 : 0;
            this.textContent = newCountEl.textContent;
            const fieldEl = this.closest(WebComponent.FiltersField);
            if (fieldEl) {
              attrBoolean.set(fieldEl, "xo-disabled", count2 === 0);
            }
          }
        });
      });
    }
    get options() {
      const options = getAttrs(this, {
        pick: ["xoUniqueId"],
        types: {
          xoUniqueId: "string"
        }
      });
      return {
        ..._FiltersCount.defaultOptions,
        ...options
      };
    }
    onConnected() {
      const { xoUniqueId } = this.options;
      const fieldEl = this.closest(WebComponent.FiltersField);
      if (!xoUniqueId) {
        throw new Error(`${WebComponent.FiltersCount}: Attribute xo-unique-id is required (Note: xo-unique-id is unique)`);
      }
      if (!fieldEl) {
        throw new Error(`${WebComponent.FiltersCount} must be inside ${WebComponent.FiltersField}`);
      }
      this.unsubscribe = subscribe$3(this.listener);
    }
    disconnectedCallback() {
      this.unsubscribe();
    }
  };
  let FiltersCount = _FiltersCount;
  __publicField(FiltersCount, "defaultOptions", {
    xoUniqueId: ""
  });
  const _FiltersActiveSize = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "listener", () => {
        const { xoUniqueId } = this.options;
        const { html } = getState$2();
        const domParser = new DOMParser();
        const doc = domParser.parseFromString(html, "text/html");
        const newEl = doc.querySelector(`${WebComponent.FiltersActiveSize}[xo-unique-id="${escapeValue(xoUniqueId)}"]`);
        setHoverLevel(newEl);
        if (newEl && newEl.textContent) {
          this.textContent = newEl.textContent;
        }
      });
    }
    get options() {
      const options = getAttrs(this, {
        pick: ["xoUniqueId"],
        types: {
          xoUniqueId: "string"
        }
      });
      return {
        ..._FiltersActiveSize.defaultOptions,
        ...options
      };
    }
    onConnected() {
      const { xoUniqueId } = this.options;
      if (!xoUniqueId) {
        throw new Error(`${WebComponent.FiltersActiveSize}: Attribute xo-unique-id is required (Note: xo-unique-id is unique)`);
      }
      this.unsubscribe = subscribe$3(this.listener);
    }
    disconnectedCallback() {
      this.unsubscribe();
    }
  };
  let FiltersActiveSize = _FiltersActiveSize;
  __publicField(FiltersActiveSize, "defaultOptions", {
    xoUniqueId: ""
  });
  class FiltersPaginate extends XoHTMLElement {
    constructor() {
      super();
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "anchorEls");
      __publicField(this, "observer");
      __publicField(this, "handleClick", (event) => {
        event.preventDefault();
        const url = new URL(event.currentTarget.href);
        const query = queryString.parse(url.search, true);
        updateFormDataItem("page", query.page, true);
        navigate();
        setRefine();
      });
      __publicField(this, "listener", () => {
        const { html } = getState$2();
        const domParser = new DOMParser();
        const doc = domParser.parseFromString(html, "text/html");
        const newEl = doc.querySelector(WebComponent.FiltersPaginate);
        if (newEl && newEl.innerHTML) {
          setHoverLevel(newEl);
          this.innerHTML = newEl.innerHTML;
        }
      });
      this.anchorEls = Array.from(this.querySelectorAll("a"));
      this.observer = new MutationObserver(() => {
        this.anchorEls = Array.from(this.querySelectorAll("a"));
        each(this.anchorEls, (el) => {
          el.removeEventListener("click", this.handleClick);
          el.addEventListener("click", this.handleClick);
        });
      });
      this.observer.observe(this, { childList: true });
    }
    onConnected() {
      this.unsubscribe = subscribe$3(this.listener);
      each(this.anchorEls, (el) => {
        el.removeEventListener("click", this.handleClick);
        el.addEventListener("click", this.handleClick);
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.observer.disconnect();
      each(this.anchorEls, (el) => {
        el.removeEventListener("click", this.handleClick);
      });
    }
  }
  let FiltersLoadMore = (_s = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "getCurrentPage", () => {
        const pageParam = new URL(window.location.href).searchParams.get("page");
        let page = Number(pageParam);
        if (isNaN(page) || page < 1) {
          page = 1;
        }
        return page;
      });
      __publicField(this, "state", {
        page: this.getCurrentPage(),
        loading: false,
        UIUpdated: true
      });
      __publicField(this, "buttonEl", this.querySelector("button"));
      __publicField(this, "setPage", () => {
        const { xoPages } = this.props;
        const { page } = this.state;
        if (page < xoPages) {
          this.setState({
            page: page + 1,
            UIUpdated: false
          });
        }
      });
      __publicField(this, "UIUpdated", async () => {
        this.setState({ UIUpdated: true });
        if (!this.buttonEl) {
          await delay();
          window.dispatchEvent(new CustomEvent("scroll"));
        }
      });
      __publicField(this, "handleClick", (event) => {
        const { UIUpdated } = this.state;
        event.preventDefault();
        if (!UIUpdated) {
          return;
        }
        this.setPage();
      });
      __publicField(this, "handleScroll", () => {
        const { xoPages } = this.props;
        const { UIUpdated, page } = this.state;
        if (!UIUpdated) {
          return;
        }
        if (!inViewport(this, { offsetTop: 200 })) {
          return;
        }
        this.setPage();
        if (page >= xoPages) {
          this.remove();
        }
      });
    }
    mount() {
      var _a2;
      this.getCurrentPage();
      (_a2 = this.buttonEl) == null ? void 0 : _a2.addEventListener("click", this.handleClick);
      if (!this.buttonEl) {
        window.addEventListener("scroll", this.handleScroll);
      }
    }
    async stateUpdate(prevState) {
      const { xoPages } = this.props;
      const { page } = this.state;
      if (prevState.page !== page) {
        const url = new URL(window.location.href);
        url.searchParams.set("page", page.toString());
        this.setProps({ xoLoading: true });
        this.setState({ loading: true });
        await getHtml(url.href);
        this.setProps({ xoLoading: false });
        this.setState({ loading: false });
        if (this.buttonEl && page >= xoPages) {
          this.remove();
        }
      }
    }
    unmount() {
      var _a2;
      (_a2 = this.buttonEl) == null ? void 0 : _a2.removeEventListener("click", this.handleClick);
      if (!this.buttonEl) {
        window.removeEventListener("scroll", this.handleScroll);
      }
    }
  }, __publicField(_s, "propTypes", {
    xoPages: "number",
    xoLoading: "boolean"
  }), __publicField(_s, "defaultProps", {}), _s);
  FiltersLoadMore = __decorate([
    customElements$1(WebComponent.FiltersLoadMore)
  ], FiltersLoadMore);
  const propTypes$1 = {
    xoLoading: Boolean
  };
  const COLLECTIONS_KEY = "collections";
  const formCache = /* @__PURE__ */ new Map();
  let FiltersForm = (_t = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "formEl", this.querySelector("form"));
      __publicField(this, "fieldEls", Array.from(this.querySelectorAll(WebComponent.FiltersFormField)));
      __publicField(this, "prevFieldEls", this.fieldEls.map((fieldEl) => fieldEl.cloneNode(true)));
      __publicField(this, "buttonSubmitEl", this.querySelector('button[type="submit"]'));
      __publicField(this, "inputEls", Array.from(this.querySelectorAll('input[type="radio"]')));
      __publicField(this, "searchEls", Array.from(this.querySelectorAll('input[type="search"]')));
      __publicField(this, "controller", new AbortController());
      __publicField(this, "state", {
        path: "",
        query: ""
      });
      __publicField(this, "getCollectionFieldEls", () => Array.from(this.querySelectorAll(`[name="${COLLECTIONS_KEY}"]`)));
      __publicField(this, "getQuery", () => {
        if (!this.formEl) {
          return "";
        }
        const formData = new FormData(this.formEl);
        formData.delete(COLLECTIONS_KEY);
        const query = queryString.stringify(formData);
        return query;
      });
      __publicField(this, "handleSubmit", (event) => {
        event.preventDefault();
        if (!this.formEl) {
          return;
        }
        const formData = new FormData(this.formEl);
        formData.delete(COLLECTIONS_KEY);
        const { path } = this.state;
        const query = this.getQuery();
        const url = query ? `${path}?${query}` : path;
        window.location.href = url;
      });
      __publicField(this, "handleCollectionChange", (event) => {
        const targetEl = event.target;
        const value = targetEl.value;
        this.setState({ path: value.startsWith(`/${COLLECTIONS_KEY}/`) ? value : `/${COLLECTIONS_KEY}/${value}` });
      });
      __publicField(this, "formRequest", async () => {
        const { path, query } = this.state;
        const url = query ? `${path}?${query}` : path;
        if (formCache.has(url)) {
          await delay(400);
          return formCache.get(url);
        }
        const res = await fetch(url);
        const data = await res.text();
        const doc = new DOMParser().parseFromString(data, "text/html");
        const templateEl = doc.querySelector(`template[${WebComponent.FiltersForm}]`);
        if (templateEl) {
          const nextFieldEls = Array.from(templateEl.content.querySelectorAll(WebComponent.FiltersFormField));
          formCache.set(url, nextFieldEls);
          return nextFieldEls;
        }
        return null;
      });
      __publicField(this, "handleInputChange", (event) => {
        const el = event.target;
        const query = this.getQuery();
        this.setState({ query });
        this.handleSelected(el);
      });
      __publicField(this, "handleSelected", (inputEl) => {
        var _a2;
        const popoverEl = inputEl.closest(WebComponent.Popover);
        const popoverName = popoverEl == null ? void 0 : popoverEl.getAttribute("xo-name");
        if (popoverEl && popoverName) {
          if (attrBoolean.get(popoverEl, "xo-active")) {
            xoPopover.close(popoverName, inputEl);
          }
          const selectedEl = this.querySelector(`${WebComponent.PopoverTrigger}[xo-name="${popoverName}"] ${WebComponent.FiltersFormSelected}`);
          const label = (_a2 = inputEl.closest("[xo-label]")) == null ? void 0 : _a2.getAttribute("xo-label");
          if (selectedEl && label) {
            selectedEl.innerHTML = label;
          }
        }
      });
      __publicField(this, "updateForm", async () => {
        try {
          const { path, query } = this.state;
          this.setProps({ xoLoading: true });
          if (this.buttonSubmitEl)
            attrBoolean.set(this.buttonSubmitEl, "disabled", true);
          const nextFieldEls = await this.formRequest();
          if (nextFieldEls && this.fieldEls.length) {
            each(this.fieldEls, (fieldEl, index) => {
              var _a2;
              const label = fieldEl.getAttribute("xo-label");
              const fieldContent = ((_a2 = nextFieldEls.find((el) => el.getAttribute("xo-label") === label)) == null ? void 0 : _a2.innerHTML) || this.prevFieldEls[index].innerHTML;
              fieldEl.innerHTML = fieldContent;
            });
            this.searchEls = Array.from(this.querySelectorAll('input[type="search"]'));
            this.inputEls = Array.from(this.querySelectorAll('input[type="radio"]'));
            each(this.getCollectionFieldEls(), (el) => {
              if (el.localName === "select") {
                el.value = path.replace(`/${COLLECTIONS_KEY}/`, "");
              } else if (el.localName === "input" && el.getAttribute("type") === "radio") {
                el.checked = el.value === path.replace(`/${COLLECTIONS_KEY}/`, "");
              }
            });
            const queryObj = queryString.parse(query, true);
            each(this.inputEls, (el) => {
              if (el.name === COLLECTIONS_KEY) {
                return;
              }
              if (!queryObj[el.name]) {
                return;
              }
              if (el.localName === "select") {
                el.value = queryObj[el.name];
              } else if (el.localName === "input" && el.getAttribute("type") === "radio") {
                el.checked = el.value === queryObj[el.name];
              }
            });
            this.setProps({ xoLoading: false });
            if (this.buttonSubmitEl)
              attrBoolean.set(this.buttonSubmitEl, "disabled", false);
            this.radioAndSearchRemoveListener();
            this.radioAndSearchAddListener();
          }
        } catch (err) {
          console.error(err);
        }
      });
      __publicField(this, "handleSearch", (event) => {
        const value = event.target.value;
        each(this.inputEls, (inputEl) => {
          const wrapEl = inputEl.closest("[xo-label]");
          if (wrapEl) {
            const label = wrapEl.getAttribute("xo-label");
            wrapEl.style.display = (label == null ? void 0 : label.toLowerCase().includes(value.toLowerCase())) ? "block" : "none";
          }
        });
      });
      __publicField(this, "setDefaultState", () => {
        var _a2;
        const path = ((_a2 = this.getCollectionFieldEls().find((collectionFieldEl) => {
          if (collectionFieldEl.localName === "select") {
            return collectionFieldEl.value;
          } else if (collectionFieldEl.localName === "input" && collectionFieldEl.getAttribute("type") === "radio") {
            return collectionFieldEl.checked ? collectionFieldEl.value : "/collections/all";
          }
          return "/collections/all";
        })) == null ? void 0 : _a2.value) || "/collections/all";
        if (path) {
          this.setState({
            path: path.startsWith(`/${COLLECTIONS_KEY}/`) ? path : `/${COLLECTIONS_KEY}/${path}`
          });
        }
      });
      __publicField(this, "radioAndSearchAddListener", () => {
        each(this.inputEls, (inputEl) => {
          if (inputEl.checked) {
            this.handleSelected(inputEl);
          }
          inputEl.addEventListener("change", this.handleInputChange);
        });
        each(this.searchEls, (searchEl) => {
          searchEl.addEventListener("input", this.handleSearch);
        });
      });
      __publicField(this, "radioAndSearchRemoveListener", () => {
        each(this.inputEls, (inputEl) => {
          if (inputEl.checked) {
            this.handleSelected(inputEl);
          }
          inputEl.removeEventListener("change", this.handleInputChange);
        });
        each(this.searchEls, (searchEl) => {
          searchEl.removeEventListener("input", this.handleSearch);
        });
      });
    }
    mount() {
      var _a2;
      this.setDefaultState();
      (_a2 = this.formEl) == null ? void 0 : _a2.addEventListener("submit", this.handleSubmit, this.controller);
      each(this.getCollectionFieldEls(), (collectionFieldEl) => {
        collectionFieldEl.addEventListener("change", this.handleCollectionChange, this.controller);
      });
      this.radioAndSearchAddListener();
    }
    unmount() {
      this.controller.abort();
      this.radioAndSearchRemoveListener();
    }
  }, __publicField(_t, "propTypes", propTypes$1), _t);
  __decorate([
    stateUpdate(["path", "query"]),
    __metadata("design:type", Object)
  ], FiltersForm.prototype, "updateForm", void 0);
  FiltersForm = __decorate([
    customElements$1(WebComponent.FiltersForm)
  ], FiltersForm);
  const styles$i = "";
  handleDesktopMobile();
  createState$3();
  window.xoFilters = xoFilters;
  componentDefine({
    [WebComponent.Filters]: Filters,
    [WebComponent.FiltersField]: FiltersField,
    [WebComponent.FiltersClear]: FiltersClear,
    [WebComponent.FiltersRefine]: FiltersRefine,
    [WebComponent.FiltersContent]: FiltersContent,
    [WebComponent.FiltersFallback]: FiltersFallback,
    [WebComponent.FiltersCount]: FiltersCount,
    [WebComponent.FiltersActiveSize]: FiltersActiveSize,
    [WebComponent.FiltersPaginate]: FiltersPaginate
  });
  const icons = {
    arrow: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#fff" x="0px" y="0px" width="18" viewBox="0 0 263.7 473.1" xml:space="preserve">
  <path d="M244.5,473.1c-4.9,0-9.8-1.9-13.6-5.6L0,236.5L230.9,5.6c7.5-7.5,19.7-7.5,27.2,0c7.5,7.5,7.5,19.7,0,27.2L54.3,236.5 l203.7,203.7c7.5,7.5,7.5,19.7,0,27.2C254.3,471.2,249.4,473.1,244.5,473.1z"/>
</svg>`,
    close: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#fff"  width="18" x="0px" y="0px" viewBox="0 0 56.213 55.962" xml:space="preserve">
  <path d="M48.82,53.907,27.483,32.572,6.146,53.907a3.6,3.6,0,0,1-5.091-5.09L22.393,27.481,1.055,6.145a3.6,3.6,0,0,1,5.09-5.09L27.483,22.391,48.82,1.055a3.6,3.6,0,0,1,5.09,5.09L32.573,27.482,53.911,48.818a3.6,3.6,0,1,1-5.09,5.09Z" transform="translate(0.747 0.5)"/>
</svg>`
  };
  let id = 0;
  const _Gallery = class extends XoHTMLElement {
    constructor() {
      super();
      __publicField(this, "itemEls", []);
      __publicField(this, "portalEl", null);
      __publicField(this, "portalContent");
      __publicField(this, "_options");
      __publicField(this, "queueId", -1);
      __publicField(this, "setOptions", () => {
        this.options = {
          ...getAttrs(this, {
            pick: ["xoPortalType", "xoAnimate", "xoDuration", "xoEasing", "xoBackdropColor", "xoSync", "xoPortalClass"],
            types: {
              xoPortalType: "string",
              xoAnimate: "string",
              xoDuration: "number",
              xoEasing: "string",
              xoBackdropColor: "string",
              xoSync: "boolean",
              xoPortalClass: "string"
            }
          })
        };
      });
      __publicField(this, "renderPortal", (itemEl, index) => {
        const { xoAnimate, xoDuration, xoEasing, xoBackdropColor, xoPortalType } = this.options;
        const name = this.getAttribute("xo-name");
        itemEl.setAttribute("xo-name", `${name}`);
        itemEl.setAttribute("xo-index", `${index}`);
        const width = itemEl.getAttribute("xo-intrinsic-width");
        const src = itemEl.getAttribute("xo-src");
        const videoPattern = /\.(mp4|webm|ogg)$/i;
        const isVideo = videoPattern.test(src);
        const srcZoom = width ? imageUrl(src, { width }) : src;
        const image = xoPortalType === "carousel" ? `<${WebComponent.ImageZoom} xo-zoom="1" xo-zoom-src="${srcZoom}" xo-zoom-full><img xo-cropped xo-src="${src}" src="" alt="" width="1000" height="1000" loading="lazy"></${WebComponent.ImageZoom}>` : `<img xo-src="${src}" src="" alt="" width="1000" height="1000" loading="lazy">`;
        const content = isVideo ? `<video src="${src}" controls title="Video" />` : image;
        return `
      <${WebComponent.Modal} xo-video-autoplay="false" xo-portal="false" xo-name="${name}" xo-duration="${xoDuration}" xo-animate="${xoPortalType === "scroll" ? xoAnimate.includes("smart") ? "zoom" : xoAnimate : xoAnimate}" xo-easing="${xoEasing}" xo-backdrop-color="${xoBackdropColor}" xo-backdrop-disabled>
        ${xoPortalType === "carousel" ? `
          <${WebComponent.ModalPan} xo-intentional-axis>
            ${content}
          </${WebComponent.ModalPan}>
        ` : content}
      </${WebComponent.Modal}>
    `;
      });
      __publicField(this, "renderContent", () => {
        const { xoPortalType } = this.options;
        const name = this.getAttribute("xo-name");
        return `
      ${this.portalContent}
      ${xoPortalType === "carousel" ? `
            <${WebComponent.GalleryPrev}>
                ${icons.arrow}
              </${WebComponent.GalleryPrev}>
              <${WebComponent.GalleryNext}>
                ${icons.arrow}
              </${WebComponent.GalleryNext}>
            <${WebComponent.GalleryCounter} xo-name="${name}"></${WebComponent.GalleryCounter}>
            ` : ""}
      <${WebComponent.ModalTrigger} xo-name="${name}">
        ${icons.close}
      </${WebComponent.ModalTrigger}>
    `;
      });
      __publicField(this, "handlePortal", () => {
        const { xoPortalClass, xoPortalType, xoBackdropColor } = this.options;
        const name = this.getAttribute("xo-name");
        const prevPortalEl = document.querySelector(`${WebComponent.GalleryPortal}[xo-name="${name}"]`);
        if (prevPortalEl) {
          prevPortalEl.remove();
        }
        this.itemEls = Array.from(this.querySelectorAll(WebComponent.GalleryItem));
        this.portalContent = map(this.itemEls, this.renderPortal).join("");
        this.portalEl = document.createElement(WebComponent.GalleryPortal);
        this.portalEl.className = xoPortalClass;
        this.portalEl.setAttribute("xo-type", xoPortalType);
        this.portalEl.style.setProperty("--xo-backdrop-color", xoBackdropColor);
        this.portalEl.setAttribute("xo-name", `${name}`);
        this.portalEl.innerHTML = this.renderContent();
        document.body.appendChild(this.portalEl);
      });
      __publicField(this, "init", () => {
        this.setOptions();
        this.handlePortal();
      });
      id++;
    }
    get options() {
      return {
        ..._Gallery.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    onConnected() {
      this.setAttribute("xo-name", `${id}`);
      this.queueId = window.requestAnimationFrame(() => {
        this.init();
        window == null ? void 0 : window.cancelAnimationFrame(this.queueId);
      });
    }
    disconnectedCallback() {
      var _a2;
      this.itemEls = [];
      (_a2 = this.portalEl) == null ? void 0 : _a2.remove();
      window.cancelAnimationFrame(this.queueId);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue !== newValue) {
        this.setAttribute("xo-name", `${id}`);
        this.setOptions();
        this.handlePortal();
        const itemEls = Array.from(this.querySelectorAll(WebComponent.GalleryItem));
        each(itemEls, (itemEl) => {
          itemEl.setAttribute("xo-observed", newValue);
        });
      }
    }
  };
  let Gallery = _Gallery;
  __publicField(Gallery, "defaultOptions", {
    xoPortalType: "carousel",
    xoAnimate: "smart-zoom",
    xoDuration: 300,
    xoEasing: "decay",
    xoBackdropColor: "rgba(0, 0, 0, 0.5)",
    xoSync: true,
    xoPortalClass: ""
  });
  function createState$1() {
    xoStore.create("xo-gallery", {
      initialState: {
        indexes: {},
        galleryName: ""
      }
    });
  }
  function setIndex(galleryName, index) {
    xoStore.set("xo-gallery", (state) => ({
      ...state,
      indexes: {
        ...state.indexes,
        [galleryName]: index
      }
    }));
  }
  function setGalleryName(galleryName) {
    xoStore.set("xo-gallery", (state) => ({
      ...state,
      galleryName
    }));
  }
  function next(galleryName) {
    const { indexes } = getState$1();
    const index = indexes[galleryName] || 0;
    const nextIndex = index + 1;
    setIndex(galleryName, nextIndex);
  }
  function prev(galleryName) {
    const { indexes } = getState$1();
    const index = indexes[galleryName] || 0;
    const nextIndex = index - 1;
    setIndex(galleryName, nextIndex);
  }
  function getState$1() {
    return xoStore.get("xo-gallery");
  }
  function subscribe$1(callback) {
    return xoStore.subscribe("xo-gallery", callback);
  }
  const GAP = 20;
  function isRtl() {
    return document.dir === "rtl";
  }
  class GalleryItem extends XoHTMLElement {
    constructor() {
      super();
      __publicField(this, "triggerEl");
      __publicField(this, "queueId", -1);
      __publicField(this, "shadow", this.attachShadow({ mode: "open" }));
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "listener", () => {
        const { indexes, galleryName } = getState$1();
        const index = indexes[galleryName];
        const name = this.getAttribute("xo-name");
        this.triggerEl.style.visibility = "visible";
        if (name === galleryName && index === this.getIndex() && this.triggerEl.getAttribute("xo-sync") != null) {
          this.triggerEl.style.visibility = "hidden";
        }
      });
      __publicField(this, "handleClick", (event) => {
        const targetEl = event.target;
        const targetItemEl = targetEl.closest(WebComponent.GalleryItem);
        const index = Number(targetItemEl.getAttribute("xo-index"));
        const name = targetItemEl.getAttribute("xo-name");
        const portalEl = document.querySelector(`${WebComponent.GalleryPortal}[xo-name="${name}"]`);
        if (portalEl) {
          if (portalEl.getAttribute("xo-type") === "scroll") {
            const { offsetTop } = portalEl.children[index];
            portalEl.scrollTo({
              top: offsetTop
            });
          } else {
            portalEl.scrollTo({
              left: index * portalEl.offsetWidth * (isRtl() ? -1 : 1)
            });
          }
        }
        setGalleryName(name);
        setIndex(name, index);
      });
      __publicField(this, "init", () => {
        this.triggerEl = this.querySelector(WebComponent.ModalTrigger);
        const galleryEl = this.closest(WebComponent.Gallery);
        if (galleryEl) {
          if (this.getSrc()) {
            const triggerEl = this.querySelector(WebComponent.ModalTrigger);
            if (triggerEl) {
              triggerEl.remove();
            }
            if (!this.querySelector('[slot="content"]')) {
              this.insertAdjacentHTML("afterbegin", `<img slot="content" src="${this.getSrc()}" loading="lazy" alt="" width="500" height="500">`);
            }
          } else {
            if (this.children.length > 1) {
              throw new Error(`${WebComponent.GalleryItem} should have only one child.`);
            }
            const mediaEl = this.children[0];
            mediaEl.setAttribute("slot", "content");
          }
          this.triggerEl = this.shadow.querySelector(WebComponent.ModalTrigger);
          this.triggerEl.addEventListener("click", this.handleClick);
          this.unsubscribe = subscribe$1(this.listener);
        }
      });
      __publicField(this, "renderShadow", () => {
        const galleryEl = this.closest(WebComponent.Gallery);
        if (!galleryEl) {
          return "";
        }
        const { xoSync, xoPortalType } = galleryEl.options;
        const sync = xoPortalType === "carousel" ? xoSync : false;
        return `
      <${WebComponent.ModalTrigger} xo-name="${this.getName()}" ${sync && galleryEl.options.xoAnimate === "smart-zoom" ? "xo-sync" : ""}>
        <slot name="content" style="display: block; width: 100%; height: 100%"></slot>
      </${WebComponent.ModalTrigger}>
    `;
      });
      this.triggerEl = this.querySelector(WebComponent.ModalTrigger);
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    getSrc() {
      return this.getAttribute("xo-thumb-src") || "";
    }
    getName() {
      return this.getAttribute("xo-name") || "";
    }
    getIndex() {
      return Number(this.getAttribute("xo-index"));
    }
    async onConnected() {
      this.queueId = window.requestAnimationFrame(() => {
        this.shadow.innerHTML = this.renderShadow();
        this.init();
        window == null ? void 0 : window.cancelAnimationFrame(this.queueId);
      });
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this.triggerEl) == null ? void 0 : _a2.removeEventListener("click", this.handleClick);
      this.unsubscribe();
      window.cancelAnimationFrame(this.queueId);
      this.removeEventListener("mouseenter", this.init);
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue !== newValue) {
        await delay(100);
        const { galleryName } = getState$1();
        setIndex(galleryName, -1);
        this.disconnectedCallback();
        this.onConnected();
      }
    }
  }
  class GalleryPortal extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "unsubscribe2", () => {
      });
      __publicField(this, "listener", () => {
        const { indexes, galleryName } = getState$1();
        const index = indexes[galleryName];
        const galleryEl = document.querySelector(`${WebComponent.Gallery}[xo-name="${galleryName}"]`);
        if ((galleryEl == null ? void 0 : galleryEl.getAttribute("xo-portal-type")) === "carousel") {
          const videoEls = Array.from(this.querySelectorAll(`${WebComponent.Modal} video`));
          each(videoEls, (videoEl, i) => {
            if (i === index) {
              videoEl.play();
            } else {
              videoEl.pause();
            }
          });
        }
        if (index >= 0) {
          xoStore.set("xo-modal", (prevState) => {
            var _a2, _b2;
            return {
              ...prevState,
              data: {
                ...prevState.data,
                [this.getName()]: {
                  ...prevState.data[this.getName()],
                  triggerElement: (_b2 = (_a2 = galleryEl == null ? void 0 : galleryEl.querySelectorAll(WebComponent.GalleryItem)[index].shadowRoot) == null ? void 0 : _a2.querySelector(WebComponent.ModalTrigger)) != null ? _b2 : null
                }
              }
            };
          });
        }
      });
      __publicField(this, "handleScroll", () => {
        const { indexes, galleryName } = getState$1();
        const index = indexes[galleryName];
        const { scrollLeft } = this;
        const nextIndex = Math.abs(Math.round(scrollLeft / this.offsetWidth));
        if (index !== nextIndex) {
          setIndex(galleryName, nextIndex);
        }
      });
    }
    getName() {
      return this.getAttribute("xo-name") || "";
    }
    onConnected() {
      this.addEventListener("scroll", this.handleScroll);
      this.unsubscribe = xoStore.subscribe("xo-modal", (state) => {
        var _a2, _b2;
        const isOpen = (_b2 = (_a2 = state.data) == null ? void 0 : _a2[this.getName()]) == null ? void 0 : _b2.isOpen;
        attrBoolean.set(this, "xo-active", isOpen);
        if (isOpen) {
          this.setAttribute("popover", "manual");
          openPopover(this);
          document.body.style.overflow = "hidden";
        } else {
          this.removeAttribute("popover");
          closePopover(this);
          document.body.style.removeProperty("overflow");
          const videoEls = Array.from(this.querySelectorAll(`${WebComponent.Modal} video`));
          each(videoEls, (videoEl) => {
            videoEl.pause();
          });
        }
      });
      this.unsubscribe2 = subscribe$1(this.listener);
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.unsubscribe2();
      this.removeEventListener("scroll", this.handleScroll);
    }
  }
  class GalleryPrev extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "handleClick", () => {
        const portalEl = this.closest(WebComponent.GalleryPortal);
        const name = portalEl.getAttribute("xo-name") || "";
        if (isRtl()) {
          if (portalEl.scrollLeft - portalEl.offsetWidth < -portalEl.offsetWidth) {
            portalEl.scrollTo(portalEl.scrollLeft + portalEl.offsetWidth, 0);
            prev(name);
          } else {
            portalEl.scrollTo(portalEl.offsetWidth - portalEl.scrollWidth, 0);
            const index = Math.round((portalEl.offsetWidth - portalEl.scrollWidth) / portalEl.offsetWidth);
            setIndex(name, index);
          }
          return;
        }
        if (portalEl.scrollLeft - portalEl.offsetWidth - GAP >= 0) {
          portalEl.scrollTo(portalEl.scrollLeft - portalEl.offsetWidth, 0);
          prev(name);
        } else {
          portalEl.scrollTo(portalEl.scrollWidth - portalEl.offsetWidth, 0);
          const index = Math.round((portalEl.scrollWidth - portalEl.offsetWidth) / portalEl.offsetWidth);
          setIndex(name, index);
        }
      });
    }
    onConnected() {
      this.addEventListener("click", this.handleClick);
    }
    disconnectedCallback() {
      this.removeEventListener("click", this.handleClick);
    }
  }
  class GalleryNext extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "handleClick", () => {
        const portalEl = this.closest(WebComponent.GalleryPortal);
        const name = portalEl.getAttribute("xo-name") || "";
        if (isRtl()) {
          if (portalEl.scrollLeft - portalEl.offsetWidth - GAP >= portalEl.offsetWidth - portalEl.scrollWidth) {
            portalEl.scrollTo(portalEl.scrollLeft - portalEl.offsetWidth, 0);
            next(name);
          } else {
            portalEl.scrollTo(0, 0);
            setIndex(name, 0);
          }
          return;
        }
        if (portalEl.scrollLeft + portalEl.offsetWidth < portalEl.scrollWidth - portalEl.offsetWidth) {
          portalEl.scrollTo(portalEl.scrollLeft + portalEl.offsetWidth, 0);
          next(name);
        } else {
          portalEl.scrollTo(0, 0);
          setIndex(name, 0);
        }
      });
    }
    onConnected() {
      this.addEventListener("click", this.handleClick);
    }
    disconnectedCallback() {
      this.removeEventListener("click", this.handleClick);
    }
  }
  class GalleryCounter extends XoHTMLElement {
    constructor() {
      super();
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "listener", () => {
        const { indexes } = getState$1();
        const index = indexes[this.name];
        const galleryEl = document.querySelector(`${WebComponent.Gallery}[xo-name="${this.name}"]`);
        if (galleryEl) {
          this.innerText = `${index + 1} / ${galleryEl.querySelectorAll(WebComponent.GalleryItem).length}`;
        }
      });
      this.unsubscribe = subscribe$1(this.listener);
    }
    get name() {
      return this.getAttribute("xo-name") || "";
    }
    disconnectedCallback() {
      this.unsubscribe();
    }
  }
  const styles$h = "";
  createState$1();
  componentDefine({
    [WebComponent.Gallery]: Gallery,
    [WebComponent.GalleryItem]: GalleryItem,
    [WebComponent.GalleryPortal]: GalleryPortal,
    [WebComponent.GalleryPrev]: GalleryPrev,
    [WebComponent.GalleryNext]: GalleryNext,
    [WebComponent.GalleryCounter]: GalleryCounter
  });
  const QUANTITY_NAME = "quantity";
  const QUICKVIEW_SIGNAL = "quickview_field";
  const STICKY_SIGNAL = "sticky_field";
  const QUICKVIEW_NAME = "quickview";
  const BUNDLE_CARD_ITEM_ATTR = "xo-bundle-item";
  const BUNDLE_CARD_PRICE_ATTR = "xo-bundle-price";
  const BINDING_ATTR = "xo-binding";
  const BUNDLE_PROP_ATTR = "xo-bundle-property";
  const CART_ADD_URL = "/cart/add";
  const FORM_CART_ADD_SELECTOR = `form[action*="${CART_ADD_URL}"]`;
  const FORM_CART_ADD_SELECTOR_2 = `form[action*="${CART_ADD_URL}"]:not([xo-buy-ignore])`;
  const MAX_PERCENT = 100;
  async function addCart$1(el, variantId, quantity, productId, recipientState, variantSelected, sellingRadio, sellingPlan, productPropsArr) {
    const formData = new FormData();
    formData.append("form_type", "product");
    formData.append("utf8", "\u2713");
    formData.append("id", variantId);
    formData.append("quantity", `${quantity}`);
    formData.append("product-id", productId);
    if (sellingRadio != null) {
      formData.append("selling_radio", sellingRadio);
    }
    if (sellingPlan != null) {
      formData.append("selling_plan", sellingPlan);
    }
    const recipientEnableName = "properties[__shopify_send_gift_card_to_recipient]";
    if (recipientState == null ? void 0 : recipientState[recipientEnableName]) {
      for (const name in recipientState) {
        const value = recipientState[name];
        formData.append(name, value);
      }
    }
    if (productPropsArr == null ? void 0 : productPropsArr.length) {
      each(Object.entries(productPropsArr[0]), ([prop, value]) => {
        if (!formData.get(prop)) {
          formData.append(prop, value);
        }
      });
    }
    formData.append("sections", getServiceSections());
    formData.append("section_url", window.location.pathname);
    if (variantSelected) {
      for (const name in variantSelected) {
        const value = variantSelected[name];
        formData.append(name, value);
      }
    }
    const formEl = el.closest(FORM_CART_ADD_SELECTOR);
    const formDataFromEl = new FormData(formEl || void 0);
    formDataFromEl.forEach((value, key) => {
      formData.append(key, value);
    });
    const res = await fetch(`${window.Shopify.routes.root}cart/add`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/javascript",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    if (window.XO_DEV) {
      await delay(400);
    }
    if (res.status === 404) {
      return Promise.reject(new Error(res.statusText));
    }
    if (res.status === 422) {
      const data2 = await res.json();
      if (typeof (data2 == null ? void 0 : data2.description) === "string") {
        return Promise.reject(new Error(data2.description));
      }
      return Promise.reject(new Error(data2.message));
    }
    const data = await res.json();
    if (data.status) {
      return Promise.reject(data);
    }
    return data;
  }
  async function addCartMulti(variantIds, quantities, productPropsArr) {
    const items = map(variantIds, (variantId, index) => {
      var _a2;
      return {
        id: variantId,
        quantity: quantities.length === 1 ? quantities[0] : (_a2 = quantities[index]) != null ? _a2 : 1,
        ...productPropsArr ? { properties: Object.fromEntries(Object.entries(productPropsArr[index]).map(([key, value]) => [key.replace(/properties\[|\]/g, ""), value])) } : {}
      };
    });
    const bodyObj = {
      items,
      sections: getServiceSections(),
      section_url: window.location.pathname
    };
    const res = await fetch(`${window.Shopify.routes.root}cart/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyObj)
    });
    if (window.XO_DEV) {
      await delay(400);
    }
    if (res.status === 404) {
      return Promise.reject(new Error(res.statusText));
    }
    const data = await res.json();
    if (data.errors) {
      return Promise.reject(data);
    }
    return data;
  }
  async function changeCart$1(line, quantity) {
    const res = await fetch(`${window.Shopify.routes.root}cart/change`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        line,
        quantity,
        sections: getServiceSections(),
        section_url: window.location.pathname
      })
    });
    if (window.XO_DEV) {
      await delay(400);
    }
    if (res.status === 404) {
      return Promise.reject(new Error(res.statusText));
    }
    const data = await res.json();
    if (data.errors) {
      return Promise.reject(data);
    }
    return data;
  }
  async function changeCartByVariantId(id2, quantity) {
    const res = await fetch(`${window.Shopify.routes.root}cart/change`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id2,
        quantity,
        sections: getServiceSections(),
        section_url: window.location.pathname
      })
    });
    if (window.XO_DEV) {
      await delay(400);
    }
    if (res.status === 404) {
      return Promise.reject(new Error(res.statusText));
    }
    const data = await res.json();
    if (data.errors) {
      return Promise.reject(data);
    }
    return data;
  }
  async function postCartNote$1(note) {
    const res = await fetch(`${window.Shopify.routes.root}cart/update`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        note
      })
    });
    if (window.XO_DEV) {
      await delay(400);
    }
    if (res.status !== 200 && res.status !== 201) {
      return Promise.reject(res.statusText);
    }
    const data = await res.json();
    return data;
  }
  async function postCartDiscount$1(discountCodeValue, sectionId, currentDiscountCode, isAdd) {
    const res = await fetch(`${window.Shopify.routes.root}cart/update`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        discount: discountCodeValue,
        sections: getServiceSections()
      })
    });
    if (window.XO_DEV) {
      await delay(400);
    }
    if (res.status !== 200 && res.status !== 201) {
      return Promise.reject(res.statusText);
    }
    const data = await res.json();
    if (data.discount_codes.find((discount) => {
      return discount.code === discountCodeValue && discount.applicable === false;
    })) {
      return Promise.reject(new Error("discount_code"));
    }
    const newHtml = data.sections[sectionId];
    const parsedHtml = new DOMParser().parseFromString(newHtml, "text/html");
    const sectionEl = parsedHtml.querySelector(`${WebComponent.Cart}#${sectionId}, ${WebComponent.CartMini}#${sectionId}`);
    const discountItemEls = Array.from((sectionEl == null ? void 0 : sectionEl.querySelectorAll(WebComponent.CartDiscountItem)) || []);
    if (sectionEl && isAdd) {
      const existingSectionEl = document.querySelector(`${WebComponent.Cart}#${sectionId}, ${WebComponent.CartMini}#${sectionId}`);
      const existingDiscountItemEls = Array.from((existingSectionEl == null ? void 0 : existingSectionEl.querySelectorAll(WebComponent.CartDiscountItem)) || []);
      const existingDiscounts = existingDiscountItemEls.map((element) => element.getAttribute("xo-discount-code") || "").filter(Boolean);
      const codes = discountItemEls.map((element) => element.getAttribute("xo-discount-code") || "").filter(Boolean);
      if (codes.length === existingDiscounts.length && codes.every((code) => existingDiscounts.includes(code)) && data.discount_codes.find((discount) => {
        return discount.code === currentDiscountCode && discount.applicable === true;
      })) {
        return Promise.reject(new Error("shipping"));
      }
    }
    return data;
  }
  async function getShippingRates(zip, country, province) {
    const res = await fetch(`${window.Shopify.routes.root}cart/shipping_rates.json?shipping_address[zip]=${zip}&shipping_address[country]=${country}&shipping_address[province]=${province}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    if (window.XO_DEV) {
      await delay(400);
    }
    if (res.status === 404) {
      return Promise.reject(new Error(res.statusText));
    }
    const data = await res.json();
    if (!data.shipping_rates) {
      return Promise.reject(objectValues(data).flatMap((item) => item));
    }
    return data;
  }
  async function getProductHtml$1(url) {
    const res = await fetch(url, {
      method: "GET"
    });
    if (window.XO_DEV) {
      await delay(400);
    }
    if (res.status !== 200 && res.status !== 201) {
      return Promise.reject(res.statusText);
    }
    const data = await res.text();
    return data;
  }
  async function getPickupAvailability(variantId) {
    const res = await fetch(`${window.Shopify.routes.root}variants/${variantId}/?section_id=pickup-availability`, {
      method: "GET"
    });
    if (res.status !== 200 && res.status !== 201) {
      return Promise.reject(res.statusText);
    }
    const data = await res.text();
    return data;
  }
  const services = {
    addCart: addCart$1,
    addCartMulti,
    changeCart: changeCart$1,
    changeCartByVariantId,
    getProductHtml: getProductHtml$1,
    postCartNote: postCartNote$1,
    postCartDiscount: postCartDiscount$1,
    getShippingRates,
    getPickupAvailability
  };
  const initialState = {
    "properties[__shopify_send_gift_card_to_recipient]": "",
    "properties[Message]": "",
    "properties[Recipient email]": "",
    "properties[Recipient name]": "",
    "properties[Send on]": ""
  };
  function createRecipientState() {
    xoStore.create("xo-recipient", {
      initialState
    });
  }
  function setRecipientState(name, value) {
    xoStore.set("xo-recipient", (prevState) => ({
      ...prevState,
      [name]: value
    }))("xo-cart/setRecipientState");
  }
  function resetRecipientState() {
    xoStore.set("xo-recipient", initialState)("xo-cart/resetRecipientState");
  }
  function getRecipientState() {
    return xoStore.get("xo-recipient");
  }
  function recipientSubscribe(listener, equal2) {
    return xoStore.subscribe("xo-recipient", listener, equal2);
  }
  function createCartState() {
    xoStore.create("xo-cart", {
      initialState: {
        addIdLoading: "",
        isAdded: false,
        variantId: "",
        changeLineLoading: -1,
        addErrorMessage: "",
        changeErrorMessage: "",
        size: 0,
        sections: {
          [WebComponent.Cart]: ""
        }
      }
    });
  }
  function setCartSize(size) {
    xoStore.set("xo-cart", (prevState) => ({
      ...prevState,
      size
    }))("xo-cart/setCartSize");
  }
  function addCartRequest(sectionId, productId) {
    const id2 = getId(sectionId, productId);
    xoStore.set("xo-cart", (prevState) => ({
      ...prevState,
      addIdLoading: id2,
      addErrorMessage: "",
      isAdded: false,
      variantId: "",
      productIdsForCartNotification: void 0
    }))("xo-cart/addCartRequest");
  }
  async function addCartSuccess(el, sectionId, productId, variantIdParam, hasCartError, quantity, sellingRadio, sellingPlan, productProps) {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
    const id2 = getId(sectionId, productId);
    try {
      let variantId = productId;
      const productVariants = (_a2 = getProductData(sectionId, productId)) == null ? void 0 : _a2.variants;
      if ((_b2 = productVariants == null ? void 0 : productVariants[0]) == null ? void 0 : _b2.id) {
        variantId = (_c2 = productVariants == null ? void 0 : productVariants[0]) == null ? void 0 : _c2.id;
      }
      const variantSelected = (_e2 = (_d2 = getCartFormState()) == null ? void 0 : _d2[id2]) == null ? void 0 : _e2.variantSelected;
      if (variantIdParam) {
        variantId = variantIdParam;
      } else {
        variantId = getVariantId(sectionId, productId) || variantId;
      }
      const recipientState = getRecipientState();
      const data = await services.addCart(el, variantId, quantity, productId, recipientState, variantSelected, sellingRadio, sellingPlan, productProps);
      xoStore.set("xo-cart", (prevState) => {
        return {
          ...prevState,
          size: prevState.size + quantity,
          sections: data.sections,
          item: data,
          addIdLoading: "",
          isAdded: true,
          variantId,
          productIdsForCartNotification: [`${data.product_id}`]
        };
      })("xo-cart/addCartSuccess");
    } catch (err) {
      const cartError = err;
      const errorMsg = (_g2 = (_f2 = cartError == null ? void 0 : cartError.description) != null ? _f2 : cartError == null ? void 0 : cartError.message) != null ? _g2 : cartError == null ? void 0 : cartError.errors;
      addCartFailure(errorMsg);
      if (errorMsg && !hasCartError && !((_h2 = window.xbEditor) == null ? void 0 : _h2.designMode)) {
        xoToast.push({
          content: errorMsg,
          className: "xo-cart-add-error",
          placement: "top-center",
          delay: 4e3
        });
      }
    }
  }
  async function addCartMultiSuccess(sectionId, productIds, variantIdsParam, hasCartError, isBundle, quantitiesParam, productProps) {
    var _a2, _b2, _c2;
    try {
      let variantIds = productIds;
      let quantities = [];
      if (variantIdsParam.length) {
        variantIds = variantIdsParam;
      } else if (!isBundle) {
        variantIds = productIds.reduce((acc, productId) => {
          var _a3, _b3, _c3;
          const variantId = getVariantId(sectionId, productId);
          const unavailable = !variantId;
          if (unavailable) {
            return acc;
          }
          if (quantitiesParam.length === 1 && quantitiesParam[0] === 1) {
            const id2 = getId(sectionId, productId);
            quantities = [...quantities, (_c3 = (_b3 = (_a3 = getCartFormState()) == null ? void 0 : _a3[id2]) == null ? void 0 : _b3.quantity) != null ? _c3 : 1];
          }
          return [...acc, variantId];
        }, []);
      }
      if (isBundle) {
        quantities = quantitiesParam;
      }
      const data = await services.addCartMulti(variantIds, quantities, productProps);
      xoStore.set("xo-cart", (prevState) => {
        return {
          ...prevState,
          size: data.items.reduce((acc, item) => acc + item.quantity, 0),
          sections: data.sections,
          items: data.items,
          addIdLoading: "",
          isAdded: true,
          productIdsForCartNotification: productIds
        };
      })("xo-cart/addCartSuccess");
    } catch (err) {
      const cartError = err;
      const errorMsg = (_b2 = (_a2 = cartError == null ? void 0 : cartError.description) != null ? _a2 : cartError == null ? void 0 : cartError.message) != null ? _b2 : cartError == null ? void 0 : cartError.errors;
      addCartFailure(errorMsg);
      if (errorMsg && !hasCartError && !((_c2 = window.xbEditor) == null ? void 0 : _c2.designMode)) {
        xoToast.push({
          content: errorMsg,
          className: "xo-cart-add-error",
          placement: "top-center",
          delay: 4e3
        });
      }
    }
  }
  function addCartFailure(addErrorMessage) {
    xoStore.set("xo-cart", (prevState) => ({
      ...prevState,
      addIdLoading: "",
      addErrorMessage,
      isAdded: false,
      variantId: ""
    }))("xo-cart/addCartFailure");
  }
  async function addCart(el, sectionId, productId, variantId, quantity, hasCartError, checkoutRedirection = false, cartRedirection = false, quantities, sellingRadio, sellingPlan, productProps, isBundle = false) {
    addCartRequest(sectionId, productId);
    if (/^\[|\]$/g.test(productId) || /^\[|\]$/g.test(variantId)) {
      const productIds = productId ? objectParse(productId) : [];
      const variantIds = variantId ? objectParse(variantId) : [];
      await addCartMultiSuccess(sectionId, productIds, variantIds, hasCartError, isBundle, quantities ? quantities : [quantity], productProps);
    } else {
      await addCartSuccess(el, sectionId, productId, variantId, hasCartError, quantity, sellingRadio, sellingPlan, productProps);
    }
    if (checkoutRedirection) {
      window.location.href = `${window.Shopify.routes.root}checkout`;
    }
    if (cartRedirection) {
      window.location.href = `${window.Shopify.routes.root}cart`;
    }
  }
  function changeCartRequest(line) {
    xoStore.set("xo-cart", (prevState) => ({
      ...prevState,
      changeLineLoading: line,
      changeErrorMessage: ""
    }))("xo-cart/changeCartRequest");
  }
  async function changeCartSuccess(line, quantity) {
    var _a2, _b2;
    try {
      const data = await services.changeCart(line, quantity);
      xoStore.set("xo-cart", (prevState) => {
        return {
          ...prevState,
          size: data.item_count,
          sections: data.sections,
          changeLineLoading: -1
        };
      })("xo-cart/changeCartSuccess");
    } catch (err) {
      const cartError = err;
      const errorMsg = (_a2 = cartError == null ? void 0 : cartError.errors) != null ? _a2 : err == null ? void 0 : err.message;
      changeCartFailure(errorMsg);
      if (errorMsg && !((_b2 = window.xbEditor) == null ? void 0 : _b2.designMode)) {
        xoToast.push({
          content: errorMsg,
          className: "xo-cart-change-error",
          placement: "top-center",
          delay: 4e3
        });
      }
    }
  }
  function changeCartFailure(changeErrorMessage) {
    xoStore.set("xo-cart", (prevState) => ({
      ...prevState,
      changeLineLoading: -1,
      changeErrorMessage
    }))("xo-cart/changeCartFailure");
  }
  async function changeCart(line, quantity) {
    changeCartRequest(line);
    await changeCartSuccess(line, quantity);
  }
  function updateCartSections(sections) {
    xoStore.set("xo-cart", (prevState) => ({
      ...prevState,
      sections
    }))("xo-cart/updateCartSections");
  }
  function getCartState() {
    return xoStore.get("xo-cart");
  }
  function cartSubscribe(listener, equal2) {
    return xoStore.subscribe("xo-cart", listener, equal2);
  }
  function createCartDiscountState() {
    xoStore.create("xo-cart-discount", {
      initialState: {
        status: "idle",
        currentDiscountCode: "",
        discountCodes: [],
        errorMessage: "",
        shippingErrorMessage: ""
      }
    });
  }
  function setCartDiscountMessages(errorMessage, shippingErrorMessage) {
    xoStore.set("xo-cart-discount", (prevState) => ({
      ...prevState,
      errorMessage,
      shippingErrorMessage
    }))("xo-cart/setCartDiscountMessages");
  }
  function setCartDiscountCodes(discountCodes) {
    xoStore.set("xo-cart-discount", (prevState) => ({
      ...prevState,
      discountCodes
    }))("xo-cart/setCartDiscountCodes");
  }
  function appendCartDiscountCode(discountCode) {
    const codes = discountCode.replace(/\s/g, "").split(",");
    xoStore.set("xo-cart-discount", (prevState) => ({
      ...prevState,
      currentDiscountCode: discountCode,
      discountCodes: [.../* @__PURE__ */ new Set([...prevState.discountCodes, ...codes])]
    }))("xo-cart/appendCartDiscountCode");
  }
  function removeCartDiscountCode(discountCode) {
    xoStore.set("xo-cart-discount", (prevState) => ({
      ...prevState,
      discountCodes: prevState.discountCodes.filter((code) => code !== discountCode)
    }))("xo-cart/removeCartDiscountCode");
  }
  function postCartDiscountRequest() {
    xoStore.set("xo-cart-discount", (prevState) => ({
      ...prevState,
      status: "loading"
    }));
  }
  async function postCartDiscountSuccess(sectionId, isAdd) {
    try {
      const { discountCodes, currentDiscountCode } = xoStore.get("xo-cart-discount");
      const discount = discountCodes.join(",").replace(/\s/g, "");
      const data = await services.postCartDiscount(discount, sectionId, currentDiscountCode, isAdd);
      xoStore.set("xo-cart-discount", (prevState) => {
        return {
          ...prevState,
          status: "success",
          discountCodes: [],
          currentDiscountCode: ""
        };
      })("xo-cart/postCartDiscountSuccess");
      updateCartSections(data.sections);
    } catch (err) {
      if (err instanceof Error) {
        postCartDiscountFailure(err.message);
      } else {
        postCartDiscountFailure("Error");
      }
    }
  }
  function postCartDiscountFailure(type) {
    xoStore.set("xo-cart-discount", (prevState) => ({
      ...prevState,
      status: "error",
      discountCodes: [],
      currentDiscountCode: ""
    }))("xo-cart/postCartDiscountFailure");
    xoToast.push({
      content: xoStore.get("xo-cart-discount")[type === "discount_code" ? "errorMessage" : "shippingErrorMessage"] || "Discount code cannot be applied to your cart.",
      className: "xo-cart-discount-error",
      placement: "top-center",
      delay: 4e3
    });
  }
  async function postCartDiscount(sectionId, isAdd = false) {
    postCartDiscountRequest();
    await postCartDiscountSuccess(sectionId, isAdd);
  }
  async function deleteCartDiscount(sectionId, discountCode) {
    removeCartDiscountCode(discountCode);
    await postCartDiscount(sectionId);
  }
  function getCartDiscountState() {
    return xoStore.get("xo-cart-discount");
  }
  function cartDiscountSubscribe(listener, equal2) {
    return xoStore.subscribe("xo-cart-discount", listener, equal2);
  }
  class CreateSignal {
    constructor() {
      __publicField(this, "hasFieldSignal", (value) => {
        return /\{|\}/g.test(value);
      });
      __publicField(this, "addFieldSignal", (value, signal) => {
        if (this.hasFieldSignal(value)) {
          return value;
        }
        return `{${signal}}${value}`;
      });
      __publicField(this, "removeFieldSignal", (value) => {
        return value.replace(/^\{.*\}/g, "");
      });
    }
  }
  const fieldSignal = new CreateSignal();
  function quantityChangeCart(el, line, quantity) {
    const cartEl = el.closest(WebComponent.Cart) || el.closest(WebComponent.CartMini);
    if (cartEl) {
      changeCart(line, quantity);
    }
  }
  function getId(sectionId, productId, suffix) {
    if (!productId) {
      if (suffix != null) {
        return `${sectionId}/${suffix}`;
      }
      return sectionId;
    }
    if (suffix != null) {
      return `${sectionId}/${productId}/${suffix}`;
    }
    return `${sectionId}/${productId}`;
  }
  function removeProductForCartNotification(doc, productIdsForCartNotification) {
    const productEls = Array.from(doc.querySelectorAll(`${WebComponent.Product}[xo-product-id]`));
    if (productIdsForCartNotification) {
      each(productEls, (productEl) => {
        const productId = productEl.getAttribute("xo-product-id");
        if (!productIdsForCartNotification.includes(productId)) {
          productEl.remove();
        }
      });
    }
  }
  function getSectionHTML(type, html, productIdsForCartNotification) {
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(html, "text/html");
    setHoverLevel(doc);
    const shopifySectionEl = doc.querySelector(".shopify-section");
    removeProductForCartNotification(doc, productIdsForCartNotification);
    const cartEl = shopifySectionEl.querySelector(WebComponent.Cart);
    if (cartEl) {
      return type === "inner" ? cartEl.innerHTML : cartEl.outerHTML;
    }
    const cartMiniEl = shopifySectionEl.querySelector(WebComponent.CartMini);
    if (cartMiniEl) {
      return type === "inner" ? cartMiniEl.innerHTML : cartMiniEl.outerHTML;
    }
    return type === "inner" ? shopifySectionEl.innerHTML : shopifySectionEl.outerHTML;
  }
  function getVariantId(sectionId, productId) {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
    const id2 = getId(sectionId, productId);
    const productEl = document.querySelector(`${WebComponent.Product}[xo-product-id="${productId}"][xo-section-id="${sectionId}"]`);
    if (productEl == null ? void 0 : productEl.getOptions().xoSelectedOrFirstAvailableVariantId) {
      return ((_b2 = (_a2 = getCartFormState()) == null ? void 0 : _a2[id2]) == null ? void 0 : _b2.variantId) || "";
    }
    let variantId = "";
    const variantSelected = (_d2 = (_c2 = getCartFormState()) == null ? void 0 : _c2[id2]) == null ? void 0 : _d2.variantSelected;
    const productVariants = (_e2 = getProductData(sectionId, productId)) == null ? void 0 : _e2.variants;
    if ((productVariants == null ? void 0 : productVariants.length) === 1) {
      return productVariants[0].id;
    }
    if (productVariants) {
      if (variantSelected) {
        const optionsSelected = objectValues(variantSelected);
        variantId = (_g2 = (_f2 = productVariants.find((variant) => {
          if (variant.options.length === optionsSelected.length) {
            return equal(variant.options.sort(), optionsSelected.sort());
          } else {
            return variant.options.sort().toString().includes(optionsSelected.sort().toString());
          }
        })) == null ? void 0 : _f2.id) != null ? _g2 : "";
      } else {
        variantId = productVariants[0].id;
      }
    }
    return variantId;
  }
  function toggleParentModal(el, open = true) {
    var _a2;
    const modalEl = el.closest(WebComponent.Modal) || el.closest(WebComponent.Popover);
    if (modalEl && (modalEl.getAttribute("xo-for-cart-mini") === null || el.localName === WebComponent.CartMini)) {
      const modalName = (_a2 = modalEl.getAttribute("xo-name")) != null ? _a2 : "";
      if (modalEl.localName === WebComponent.Modal) {
        xoModal[open ? "open" : "close"](modalName);
      } else {
        xoPopover[open ? "open" : "close"](modalName);
      }
    }
  }
  function getCartLine(productEl) {
    const cartEl = productEl.closest(WebComponent.Cart) || productEl.closest(WebComponent.CartMini);
    if (!cartEl) {
      return;
    }
    const lineAttr = productEl.getAttribute("xo-line");
    if (lineAttr) {
      return Number(lineAttr);
    }
    const currentProductHtml = productEl.outerHTML;
    const productEls = Array.from(cartEl.querySelectorAll(`${WebComponent.CartWillChange} ${WebComponent.Product}`));
    const productHtmls = reduce(productEls, (acc, productEl2) => {
      const productHtml = productEl2.outerHTML;
      if (acc.includes(productHtml)) {
        return acc;
      }
      return [...acc, productHtml];
    }, []);
    const index = productHtmls.indexOf(currentProductHtml);
    const cartLine = index + 1;
    return cartLine;
  }
  function getServiceSections() {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2;
    if (window.Xotiny) {
      const cartId = (_b2 = (_a2 = document.querySelector(WebComponent.Cart)) == null ? void 0 : _a2.id) != null ? _b2 : "";
      const cartMiniId = (_d2 = (_c2 = document.querySelector(WebComponent.CartMini)) == null ? void 0 : _c2.id) != null ? _d2 : "";
      return window.location.pathname.includes("/cart") ? [cartId, cartMiniId] : [cartMiniId];
    }
    const cartNotificationEl = document.querySelector("cart-notification");
    const cartItemSectionId = (_g2 = (_f2 = (_e2 = document.querySelector('.shopify-section[id^="shopify-section-template--"][id$="__cart-items"]')) == null ? void 0 : _e2.id) == null ? void 0 : _f2.replace(/^shopify-section-/g, "")) != null ? _g2 : "";
    const cartFooterSectionId = (_j2 = (_i2 = (_h2 = document.querySelector('.shopify-section[id^="shopify-section-template--"][id$="__cart-footer"]')) == null ? void 0 : _h2.id) == null ? void 0 : _i2.replace(/^shopify-section-/g, "")) != null ? _j2 : "";
    if (cartNotificationEl) {
      return window.location.pathname.includes("/cart") ? [cartItemSectionId, cartFooterSectionId, "cart-icon-bubble", "cart-live-region-text"].filter(Boolean) : ["cart-notification-product", "cart-notification-button", "cart-icon-bubble"];
    }
    return window.location.pathname.includes("/cart") ? [cartItemSectionId, cartFooterSectionId, "cart-icon-bubble", "cart-live-region-text"].filter(Boolean) : ["cart-drawer", "cart-icon-bubble"];
  }
  function getSellingPlan(el = document) {
    var _a2, _b2;
    const sellingRadioEls = Array.from(el.querySelectorAll('input[name="selling_radio"]'));
    const sellingPlanEl = el.querySelector('input[name="selling_plan"]');
    const sellingRadio = (_a2 = sellingRadioEls.find((el2) => el2.checked)) == null ? void 0 : _a2.value;
    const sellingPlan = sellingPlanEl ? (_b2 = sellingPlanEl == null ? void 0 : sellingPlanEl.value) != null ? _b2 : "" : void 0;
    return { sellingRadio, sellingPlan };
  }
  function getProductProperties(productEl) {
    if (!productEl) {
      return void 0;
    }
    let result = void 0;
    const inputTextEls = Array.from(productEl.querySelectorAll('input[type="text"][name^="properties["], input[type="number"][name^="properties["], input[type="hidden"][name^="properties["], textarea[name^="properties["]'));
    const inputRadioEls = Array.from(productEl.querySelectorAll('input[type="radio"][name^="properties["], input[type="checkbox"][name^="properties["]'));
    const selectEls = Array.from(productEl.querySelectorAll('select[name^="properties["]'));
    each(inputTextEls, (el) => {
      if (el.value) {
        result = { ...result, [fieldSignal.removeFieldSignal(el.name)]: el.value };
      }
    });
    each(inputRadioEls, (el) => {
      if (el.checked) {
        result = { ...result, [fieldSignal.removeFieldSignal(el.name)]: el.value };
      }
    });
    each(selectEls, (el) => {
      if (el.value) {
        result = { ...result, [fieldSignal.removeFieldSignal(el.name)]: el.value };
      }
    });
    return result;
  }
  function getCompareAtPrice(price, percentValue) {
    const compareAtPrice = Math.round(price - price * percentValue / MAX_PERCENT + 0.4);
    return compareAtPrice;
  }
  function setCartDiscountCodesAction(el) {
    const discountItemEls = Array.from(el.querySelectorAll(WebComponent.CartDiscountItem));
    const codes = discountItemEls.map((element) => element.getAttribute("xo-discount-code") || "").filter(Boolean);
    setCartDiscountCodes(codes);
  }
  function getCartSize(doc = document) {
    const cartMiniEl = doc.querySelector(WebComponent.CartMini);
    const quantityEls = Array.from((cartMiniEl == null ? void 0 : cartMiniEl.querySelectorAll(`${WebComponent.Product}[xo-line]`)) || []).map((el) => el.querySelector('input[name="quantity"]'));
    return quantityEls.reduce((acc, el) => acc + Number(el == null ? void 0 : el.value) || 0, 0) || 0;
  }
  function getProductType(productEl) {
    const { xoProductInformation, xoFeaturedProduct } = productEl.getOptions();
    if (xoFeaturedProduct) {
      return "featured";
    }
    const quickViewEl = productEl.closest(WebComponent.ProductQuickView);
    if (xoProductInformation && quickViewEl) {
      return "quickview";
    }
    if (xoProductInformation) {
      return "information";
    }
    return "default";
  }
  function getFieldEls(el) {
    return Array.from(el.querySelectorAll('input[type="radio"], select'));
  }
  function stickyCartPropertySignal(el = document.body) {
    const inputEls = Array.from(el.querySelectorAll(`${WebComponent.Sticky} input[name^="properties["]`));
    each(inputEls, (inputEl) => {
      inputEl.name = fieldSignal.addFieldSignal(inputEl.name, STICKY_SIGNAL);
    });
  }
  function uid() {
    return Math.random().toString(36).substring(2, 9);
  }
  function combileBundle(bundle) {
    return Object.values(bundle.reduce((acc, item) => {
      if (acc[item.variantId]) {
        return {
          ...acc,
          [item.variantId]: {
            ...item,
            quantity: acc[item.variantId].quantity + item.quantity
          }
        };
      }
      return {
        ...acc,
        [item.variantId]: item
      };
    }, {}));
  }
  function invalid() {
    return Array.from(document.forms).some((formEl) => {
      const productEl = formEl.closest(`${WebComponent.Product}[xo-product-information]`);
      if (!productEl) {
        return false;
      }
      if (!formEl.action.includes(CART_ADD_URL)) {
        return false;
      }
      return !formEl.reportValidity();
    });
  }
  function getProductData(sectionId, productId) {
    var _a2;
    const productDataEl = document.querySelector(`.shopify-section[id^="shopify-section-template--${sectionId}"] ${WebComponent.Product}[xo-product-id="${productId}"] ${WebComponent.ProductData}`);
    if (!productDataEl) {
      return null;
    }
    const textContent = ((_a2 = productDataEl.querySelector("template")) == null ? void 0 : _a2.content.textContent) || productDataEl.textContent;
    const data = objectParse(textContent);
    return data;
  }
  function createCartFormState() {
    xoStore.create("xo-cart-form", {
      initialState: {}
    });
  }
  function setFormQuantity(sectionId, productId, line, callback) {
    const id2 = getId(sectionId, productId, line);
    xoStore.set("xo-cart-form", (prevState) => {
      var _a2, _b2;
      const prevQuantity = (_b2 = (_a2 = prevState == null ? void 0 : prevState[id2]) == null ? void 0 : _a2[QUANTITY_NAME]) != null ? _b2 : 1;
      return {
        ...prevState,
        [id2]: {
          ...prevState == null ? void 0 : prevState[id2],
          [QUANTITY_NAME]: Math.max(1, callback(prevQuantity))
        }
      };
    })("xo-cart-form/setFormQuantity");
  }
  function setFormVariant(sectionId, productId, name, value) {
    const id2 = getId(sectionId, productId);
    xoStore.set("xo-cart-form", (prevState) => {
      var _a2;
      return {
        ...prevState,
        [id2]: {
          ...prevState == null ? void 0 : prevState[id2],
          variantSelected: {
            ...(_a2 = prevState == null ? void 0 : prevState[id2]) == null ? void 0 : _a2.variantSelected,
            [name]: value
          }
        }
      };
    })("xo-cart-form/setFormVariant");
  }
  function setVariantId(sectionId, productId, variantId) {
    const id2 = getId(sectionId, productId);
    xoStore.set("xo-cart-form", (prevState) => {
      return {
        ...prevState,
        [id2]: {
          ...prevState == null ? void 0 : prevState[id2],
          variantId
        }
      };
    })("xo-cart-form/setVariantId");
  }
  function getCartFormState() {
    return xoStore.get("xo-cart-form");
  }
  function cartFormSubscribe(listener, equal2) {
    return xoStore.subscribe("xo-cart-form", listener, equal2);
  }
  const htmlCache = /* @__PURE__ */ new Map();
  const pickupHtmlCache = /* @__PURE__ */ new Map();
  function createProductState() {
    xoStore.create("xo-product", {
      initialState: {
        status: "idle",
        observed: 1,
        productHtml: "",
        pickupAvailabilityHtml: "",
        quickviewProductHtml: {},
        quickviewTriggerEl: void 0,
        featuredProductHtmls: {},
        productData: {},
        isCombineListing: false
      }
    });
  }
  function setIsCombineListing(value) {
    xoStore.set("xo-product", (prevState) => {
      return {
        ...prevState,
        observed: prevState.observed + 1,
        isCombineListing: value
      };
    })("xo-product/setIsCombineListing");
  }
  async function getProductHtml(url, featured = false) {
    const newUrl = new URL(url);
    newUrl.search = "";
    const productUrl = newUrl.href.replace(/\?.*/g, "");
    const featuredKey = new URL(url).searchParams.get("section_id") || "";
    try {
      xoStore.set("xo-product", (prevState) => {
        return {
          ...prevState,
          status: "loading",
          observed: prevState.observed + 1
        };
      })("xo-product/getProductHtml/request");
      let productHtml = "";
      if (htmlCache.has(url)) {
        productHtml = htmlCache.get(url);
      } else {
        productHtml = await services.getProductHtml(url);
        htmlCache.set(url, productHtml);
      }
      xoStore.set("xo-product", (prevState) => {
        return {
          ...prevState,
          status: "success",
          observed: prevState.observed + 1,
          productHtml: featured ? prevState.productHtml : productHtml,
          featuredProductHtmls: featured ? {
            ...prevState.featuredProductHtmls,
            [featuredKey]: productHtml
          } : prevState.featuredProductHtmls,
          productUrl
        };
      })("xo-product/getProductHtml/success");
    } catch {
      xoStore.set("xo-product", (prevState) => {
        return {
          ...prevState,
          observed: prevState.observed + 1,
          status: "error"
        };
      })("xo-product/getProductHtml/failure");
    }
  }
  async function getQuickviewProductHtml(name, url, quickviewTriggerEl) {
    const newUrl = new URL(url);
    newUrl.search = "";
    const productUrl = newUrl.href;
    try {
      xoStore.set("xo-product", (prevState) => {
        return {
          ...prevState,
          observed: prevState.observed + 1,
          quickviewTriggerEl,
          status: "loading"
        };
      })("xo-product/getQuickviewProductHtml/request");
      let productHtml = "";
      if (htmlCache.has(url)) {
        productHtml = htmlCache.get(url);
      } else {
        productHtml = await services.getProductHtml(url);
        htmlCache.set(url, productHtml);
      }
      xoStore.set("xo-product", (prevState) => {
        return {
          ...prevState,
          status: "success",
          observed: prevState.observed + 1,
          quickviewProductHtml: {
            ...prevState.quickviewProductHtml,
            [name]: productHtml
          },
          productUrl
        };
      })("xo-product/getQuickviewProductHtml/success");
    } catch {
      xoStore.set("xo-product", (prevState) => {
        return {
          ...prevState,
          observed: prevState.observed + 1,
          status: "error"
        };
      })("xo-product/getQuickviewProductHtml/failure");
    }
  }
  async function getPickupAvailabilityHtml(sectionId, productId) {
    try {
      const variantId = getVariantId(sectionId, productId);
      let pickupAvailabilityHtml = "";
      if (pickupHtmlCache.has(variantId)) {
        pickupAvailabilityHtml = pickupHtmlCache.get(variantId);
      } else {
        pickupAvailabilityHtml = await services.getPickupAvailability(variantId);
        pickupHtmlCache.set(variantId, pickupAvailabilityHtml);
      }
      xoStore.set("xo-product", (prevState) => {
        return {
          ...prevState,
          observed: prevState.observed + 1,
          pickupAvailabilityHtml
        };
      })("xo-product/getPickupAvailabilityHtml");
    } catch (error) {
      console.log(error);
    }
  }
  function updateObserved() {
    xoStore.set("xo-product", (prevState) => {
      return {
        ...prevState,
        observed: prevState.observed + 1
      };
    })("xo-product/updateObserved");
  }
  function getProductState() {
    return xoStore.get("xo-product");
  }
  function productSubscribe(listener) {
    return xoStore.subscribe("xo-product", listener, (prev2, next2) => {
      return (prev2 == null ? void 0 : prev2.observed) === (next2 == null ? void 0 : next2.observed);
    });
  }
  function createCartNoteState() {
    xoStore.create("xo-cart-note", {
      initialState: {
        status: "idle",
        note: "",
        noteDraft: ""
      }
    });
  }
  function setCartNoteDraft(note) {
    xoStore.set("xo-cart-note", (prevState) => ({
      ...prevState,
      noteDraft: note
    }))("xo-cart/setCartNoteDraft");
  }
  function postCartNoteRequest() {
    xoStore.set("xo-cart-note", (prevState) => ({
      ...prevState,
      status: "loading"
    }));
  }
  async function postCartNoteSuccess(note) {
    try {
      const data = await services.postCartNote(note);
      xoStore.set("xo-cart-note", (prevState) => {
        return {
          ...prevState,
          status: "success",
          note: data.note
        };
      })("xo-cart/postCartNoteSuccess");
    } catch {
      postCartNoteFailure();
    }
  }
  function postCartNoteFailure() {
    xoStore.set("xo-cart-note", (prevState) => ({
      ...prevState,
      status: "error"
    }))("xo-cart/postCartNoteFailure");
  }
  async function postCartNote(note) {
    postCartNoteRequest();
    await postCartNoteSuccess(note);
  }
  function getCartNoteState() {
    return xoStore.get("xo-cart-note");
  }
  function cartNoteSubscribe(listener, equal2) {
    return xoStore.subscribe("xo-cart-note", listener, equal2);
  }
  function createCartShippingRatesState() {
    xoStore.create("xo-cart-shipping-rates", {
      initialState: {
        status: "idle",
        shippingRates: [],
        errorMessages: []
      }
    });
  }
  function getCartShippingRatesRequest() {
    xoStore.set("xo-cart-shipping-rates", (prevState) => ({
      ...prevState,
      status: "loading"
    }));
  }
  async function getCartShippingRatesSuccess(zip, country, province) {
    try {
      const data = await services.getShippingRates(zip, country, province);
      xoStore.set("xo-cart-shipping-rates", (prevState) => {
        return {
          ...prevState,
          status: "success",
          shippingRates: data.shipping_rates
        };
      })("xo-cart/getCartShippingRatesSuccess");
    } catch (err) {
      if (Array.isArray(err)) {
        const error = err;
        getCartShippingRatesFailure(error);
      } else {
        getCartShippingRatesFailure([err.message]);
      }
    }
  }
  function getCartShippingRatesFailure(error) {
    xoStore.set("xo-cart-shipping-rates", (prevState) => ({
      ...prevState,
      status: "error",
      errorMessages: error
    }))("xo-cart/getCartShippingRatesFailure");
  }
  async function getCartShippingRates(zip, country, province) {
    getCartShippingRatesRequest();
    await getCartShippingRatesSuccess(zip, country, province);
  }
  function getCartShippingRatesState() {
    return xoStore.get("xo-cart-shipping-rates");
  }
  function cartShippingRatesSubscribe(listener, equal2) {
    return xoStore.subscribe("xo-cart-shipping-rates", listener, equal2);
  }
  function createCartShippingRatesFormState() {
    xoStore.create("xo-cart-shipping-rates-form", {
      initialState: {
        zip: "",
        country: "",
        province: "",
        provinces: []
      }
    });
  }
  function setCartShippingRatesField(name, value) {
    xoStore.set("xo-cart-shipping-rates-form", (prevState) => ({
      ...prevState,
      [name]: value
    }))("xo-cart-shipping-rates-form/setCartShippingRatesField");
  }
  function setProvinces(provinces) {
    xoStore.set("xo-cart-shipping-rates-form", (prevState) => ({
      ...prevState,
      provinces
    }))("xo-cart-shipping-rates-form/setProvinces");
  }
  function getCartShippingRatesFormState() {
    return xoStore.get("xo-cart-shipping-rates-form");
  }
  function cartShippingRatesFormSubscribe(listener, equal2) {
    return xoStore.subscribe("xo-cart-shipping-rates-form", listener, equal2);
  }
  function createBundleState() {
    xoStore.create("xo-bundle", {
      initialState: {
        observed: 1,
        bundles: {}
      }
    });
  }
  function addBundleItem(name, combineByQuantity, item) {
    xoStore.set("xo-bundle", (prevState) => {
      var _a2, _b2;
      const prevItems = (_b2 = (_a2 = prevState.bundles) == null ? void 0 : _a2[name]) != null ? _b2 : [];
      if (combineByQuantity && prevItems.some((prevItem) => prevItem.productId === item.productId && prevItem.variantId === item.variantId)) {
        return {
          ...prevState,
          observed: prevState.observed + 1,
          bundles: {
            ...prevState.bundles,
            [name]: prevItems.map((prevItem) => {
              if (prevItem.productId === item.productId && prevItem.variantId === item.variantId) {
                return {
                  ...prevItem,
                  quantity: prevItem.quantity + 1
                };
              }
              return prevItem;
            })
          }
        };
      }
      return {
        ...prevState,
        observed: prevState.observed + 1,
        bundles: {
          ...prevState.bundles,
          [name]: [...prevItems, item]
        }
      };
    })("xo-bundle/addBundleItem");
  }
  function removeBundleItem(name, id2) {
    xoStore.set("xo-bundle", (prevState) => {
      return {
        ...prevState,
        observed: prevState.observed + 1,
        bundles: {
          ...prevState.bundles,
          [name]: prevState.bundles[name].filter((item) => item.id !== id2)
        }
      };
    })("xo-bundle/removeBundleItem");
  }
  function removeBundleAllItem(name) {
    xoStore.set("xo-bundle", (prevState) => {
      return {
        ...prevState,
        observed: prevState.observed + 1,
        bundles: {
          ...prevState.bundles,
          [name]: []
        }
      };
    })("xo-bundle/removeBundleAllItem");
  }
  function updateBundleQuantity(name, variantId, quantity) {
    xoStore.set("xo-bundle", (prevState) => {
      return {
        ...prevState,
        bundles: {
          ...prevState.bundles,
          [name]: prevState.bundles[name].map((item) => {
            if (item.variantId !== variantId) {
              return item;
            }
            return {
              ...item,
              quantity: Math.max(1, quantity)
            };
          })
        }
      };
    })("xo-bundle/updateQuantity");
  }
  function updateBundleQuantityByType(name, variantId, type) {
    xoStore.set("xo-bundle", (prevState) => {
      return {
        ...prevState,
        bundles: {
          ...prevState.bundles,
          [name]: prevState.bundles[name].map((item) => {
            if (item.variantId !== variantId) {
              return item;
            }
            return {
              ...item,
              quantity: Math.max(1, item.quantity + (type === "inc" ? 1 : -1))
            };
          })
        }
      };
    })("xo-bundle/updateBundleQuantityByType");
  }
  function clearBundle(name) {
    xoStore.set("xo-bundle", (prevState) => {
      return {
        ...prevState,
        observed: prevState.observed + 1,
        bundles: {
          ...prevState.bundles,
          [name]: []
        }
      };
    })("xo-bundle/clearBundle");
  }
  function getBundleState() {
    return xoStore.get("xo-bundle");
  }
  function bundleSubscribe(listener, equal2) {
    return xoStore.subscribe("xo-bundle", listener, equal2);
  }
  function createState() {
    createCartState();
    createCartFormState();
    createProductState();
    createCartNoteState();
    createCartDiscountState();
    createCartShippingRatesState();
    createCartShippingRatesFormState();
    createRecipientState();
    createBundleState();
  }
  const getState = {
    cart: getCartState,
    cartForm: getCartFormState,
    product: getProductState,
    cartNote: getCartNoteState,
    cartDiscount: getCartDiscountState,
    cartShippingRates: getCartShippingRatesState,
    cartShippingRatesForm: getCartShippingRatesFormState,
    recipient: getRecipientState,
    bundle: getBundleState
  };
  const subscribe = {
    cart: cartSubscribe,
    cartForm: cartFormSubscribe,
    product: productSubscribe,
    cartNote: cartNoteSubscribe,
    cartDiscount: cartDiscountSubscribe,
    cartShippingRates: cartShippingRatesSubscribe,
    cartShippingRatesForm: cartShippingRatesFormSubscribe,
    recipient: recipientSubscribe,
    bundle: bundleSubscribe
  };
  class Cart extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
    }
    onConnected() {
      if (!this.id) {
        throw new Error(`The ${WebComponent.Cart} component must have the id="{{ section.id }}" attribute`);
      }
      this.unsubscribe = subscribe.cart((state) => {
        const newContent = state.sections[this.id];
        const isLoading = state.changeLineLoading !== -1;
        if (newContent && this.innerHTML !== newContent && !isLoading) {
          const willChangeEls = Array.from(this.querySelectorAll(WebComponent.CartWillChange));
          if (willChangeEls.length) {
            const domParser = new DOMParser();
            const doc = domParser.parseFromString(newContent, "text/html");
            setHoverLevel(doc);
            const newCartWillChangeEls = doc.querySelectorAll(`${WebComponent.Cart} ${WebComponent.CartWillChange}`);
            if (!newCartWillChangeEls.length) {
              return;
            }
            each(willChangeEls, (willChangeEl, index) => {
              const uid2 = willChangeEl.getAttribute("xo-unique-id");
              let newCartWillChangeEl = null;
              if (uid2) {
                newCartWillChangeEl = doc.querySelector(`${WebComponent.CartWillChange}[xo-unique-id="${escapeValue(uid2)}"]`);
              } else {
                newCartWillChangeEl = newCartWillChangeEls[index];
              }
              if (newCartWillChangeEl && willChangeEl.outerHTML !== (newCartWillChangeEl == null ? void 0 : newCartWillChangeEl.outerHTML)) {
                willChangeEl.innerHTML = newCartWillChangeEl.innerHTML;
                const attrs = Array.from(newCartWillChangeEl.attributes);
                each(attrs, (attr) => {
                  willChangeEl.setAttribute(attr.name, attr.value);
                });
              }
            });
          } else {
            this.innerHTML = getSectionHTML("outer", newContent);
          }
        }
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
    }
  }
  class CartAdd extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "bundleUnsubscribe", () => {
      });
      __publicField(this, "bundleProviderEl", this.closest(WebComponent.BundleProvider));
      __publicField(this, "variantsEl", this.closest(WebComponent.ProductVariants));
      __publicField(this, "controller", new AbortController());
      __publicField(this, "getSectionId", () => {
        var _a2;
        const xoSectionId = (_a2 = this.getProductOptions()) == null ? void 0 : _a2.xoSectionId;
        return xoSectionId || getShopifySectionId(this);
      });
      __publicField(this, "getQuantityFromProductVariant", () => {
        var _a2;
        const quantityEl = (_a2 = this.closest(WebComponent.ProductVariant)) == null ? void 0 : _a2.querySelector(`${WebComponent.CartQuantity} input`);
        const value = quantityEl == null ? void 0 : quantityEl.value;
        if (value) {
          return Number(value);
        }
      });
      __publicField(this, "getQuantitiesFromProductVariant", () => {
        var _a2, _b2;
        const quantityEls = Array.from((_b2 = (_a2 = this.closest(WebComponent.ProductVariants)) == null ? void 0 : _a2.querySelectorAll(`${WebComponent.ProductVariant}[xo-variant-id] ${WebComponent.CartQuantity} input`)) != null ? _b2 : []);
        return quantityEls.reduce((acc, el) => {
          const value = Number(el.value);
          if (!value || isNaN(value)) {
            return acc;
          }
          return [...acc, value];
        }, []);
      });
      __publicField(this, "getVariantIdFromProductVariant", () => {
        var _a2, _b2;
        const quantityEls = Array.from((_b2 = (_a2 = this.closest(WebComponent.ProductVariants)) == null ? void 0 : _a2.querySelectorAll(`${WebComponent.ProductVariant}[xo-variant-id] ${WebComponent.CartQuantity} input`)) != null ? _b2 : []);
        return quantityEls.reduce((acc, el) => {
          const quantity = Number(el.value);
          if (!quantity || isNaN(quantity)) {
            return acc;
          }
          const productVariantEl = el.closest(WebComponent.ProductVariant);
          return [...acc, productVariantEl.getAttribute("xo-variant-id")];
        }, []);
      });
      __publicField(this, "handleAddToCart", async (event) => {
        var _a2, _b2, _c2, _d2;
        if (invalid()) {
          event.preventDefault();
          return;
        }
        try {
          event.preventDefault();
          const cart = getState.cart();
          const { xoProductId, xoProductQuantity, xoCartOpened = true, xoCheckoutRedirection = false, xoCartRedirection = false, xoProductQuantities, xoTestFly, xoForBundle, xoVariantId = "", xoDisabled, xoSectionId } = this.getOptions();
          if (xoDisabled) {
            return;
          }
          const hasCartError = !!((_a2 = this.closest(WebComponent.Product)) == null ? void 0 : _a2.querySelector(WebComponent.CartAddError));
          const properties = getProductProperties(this.closest(WebComponent.Product));
          let propertiesArr = properties ? [properties] : void 0;
          if (!xoProductId) {
            return;
          }
          const quickviewEl = this.closest(WebComponent.ProductQuickView);
          const sectionId = this.getSectionId();
          if (this.productEl) {
            const id2 = getId(sectionId, xoProductId);
            let quantity = (_d2 = (_c2 = (_b2 = getState.cartForm()) == null ? void 0 : _b2[id2]) == null ? void 0 : _c2.quantity) != null ? _d2 : 1;
            let quantities = xoProductQuantities;
            let variantId = xoVariantId;
            if (xoVariantId) {
              const quantityFromProductVariant = this.getQuantityFromProductVariant();
              if (quantityFromProductVariant) {
                quantity = quantityFromProductVariant;
              }
            }
            if (this.variantsEl) {
              quantities = this.getQuantitiesFromProductVariant();
              const variantIds = this.getVariantIdFromProductVariant();
              if (!variantIds.length) {
                return;
              }
              variantId = JSON.stringify(variantIds);
            }
            if (cart.addIdLoading !== id2 && xoProductId) {
              const { sellingRadio, sellingPlan } = getSellingPlan(this.productEl);
              await addCart(this, sectionId, xoProductId, variantId, xoProductQuantity != null ? xoProductQuantity : quantity, hasCartError, xoCheckoutRedirection, xoCartRedirection, quantities, sellingRadio, sellingPlan, propertiesArr);
              if (quickviewEl) {
                toggleParentModal(this, false);
              }
            }
          } else {
            const id2 = getId(xoSectionId, xoProductId);
            if (cart.addIdLoading !== id2 && xoProductId) {
              let quantity = xoProductQuantity != null ? xoProductQuantity : 1;
              if (xoVariantId) {
                const quantityFromProductVariant = this.getQuantityFromProductVariant();
                if (quantityFromProductVariant) {
                  quantity = quantityFromProductVariant;
                }
              }
              if (xoForBundle) {
                propertiesArr = this.getAttribute("xo-product-props") ? JSON.parse(this.getAttribute("xo-product-props")) : void 0;
              }
              await addCart(this, xoSectionId, xoProductId, xoVariantId, quantity, hasCartError, xoCheckoutRedirection, xoCartRedirection, xoProductQuantities, void 0, void 0, propertiesArr, xoForBundle);
              if (this.bundleProviderEl) {
                const { xoName } = this.bundleProviderEl.props;
                clearBundle(xoName);
              }
            }
          }
          const nextCart = getState.cart();
          if (xoCartOpened && nextCart.addErrorMessage === "") {
            const cartMiniEl = document.querySelector(WebComponent.CartMini);
            if (cartMiniEl) {
              await delay(quickviewEl ? 300 : 0);
              toggleParentModal(cartMiniEl);
            }
          }
          if (nextCart.addErrorMessage === "" || xoTestFly) {
            this.handleCartFly();
          }
        } catch {
        }
      });
      __publicField(this, "handleCartFly", () => {
        const cartFlyEl = document.querySelector(WebComponent.CartFly);
        cartFlyEl == null ? void 0 : cartFlyEl.handle(this);
      });
      __publicField(this, "handleBundle", () => {
        const { xoForBundle } = this.getOptions();
        if (xoForBundle && this.bundleProviderEl) {
          const { xoName, xoCombineByQuantity } = this.bundleProviderEl.props;
          this.bundleUnsubscribe = subscribe.bundle(({ bundles }) => {
            var _a2;
            const bundle = (_a2 = bundles == null ? void 0 : bundles[xoName || this.getSectionId()]) != null ? _a2 : [];
            if (bundle.length === 0) {
              this.removeAttribute("xo-product-quantities");
              this.removeAttribute("xo-product-id");
              this.removeAttribute("xo-product-props");
              attrBoolean.set(this, "xo-disabled", true);
            } else {
              if (xoCombineByQuantity) {
                this.setAttribute("xo-product-quantities", `[${bundle.map((item) => item.quantity).join(",")}]`);
                this.setAttribute("xo-product-id", `[${bundle.map((item) => item.variantId).join(",")}]`);
              } else {
                const bundleCombined = combileBundle(bundle);
                this.setAttribute("xo-product-quantities", `[${bundleCombined.map((item) => item.quantity).join(",")}]`);
                this.setAttribute("xo-product-id", `[${bundleCombined.map((item) => item.variantId).join(",")}]`);
              }
              const properties = bundle.map((item) => item.properties).filter((item) => item);
              if (properties.length) {
                this.setAttribute("xo-product-props", JSON.stringify(properties));
              }
              attrBoolean.set(this, "xo-disabled", false);
            }
          });
        }
      });
    }
    getOptions() {
      var _a2, _b2, _c2;
      const options = getAttrs(this, {
        pick: [
          "xoProductId",
          "xoSectionId",
          "xoProductQuantity",
          "xoCartOpened",
          "xoDisabled",
          "xoCheckoutRedirection",
          "xoCartRedirection",
          "xoProductQuantities",
          "xoTestFly",
          "xoForBundle",
          "xoVariantId"
        ],
        types: {
          xoProductId: "string",
          xoSectionId: "string",
          xoProductQuantity: "number",
          xoCartOpened: "boolean",
          xoDisabled: "boolean",
          xoCheckoutRedirection: "boolean",
          xoCartRedirection: "boolean",
          xoProductQuantities: "array",
          xoForBundle: "boolean",
          xoTestFly: "boolean",
          xoVariantId: "string"
        }
      });
      if (this.productEl) {
        return {
          ...options,
          xoProductId: (_b2 = options.xoProductId) != null ? _b2 : (_a2 = this.getProductOptions()) == null ? void 0 : _a2.xoProductId
        };
      } else {
        return {
          ...options,
          xoSectionId: (_c2 = options.xoSectionId) != null ? _c2 : "single"
        };
      }
    }
    static get observedAttributes() {
      return ["xo-product-id", "xo-product-quantity", "xo-disabled"];
    }
    get productEl() {
      return this.closest(WebComponent.Product);
    }
    getProductOptions() {
      var _a2;
      return (_a2 = this.productEl) == null ? void 0 : _a2.getOptions();
    }
    onConnected() {
      this.handleBundle();
      const { xoProductId, xoDisabled = false, xoForBundle } = this.getOptions();
      if (!xoForBundle && (xoDisabled || !xoProductId)) {
        return;
      }
      const buttonEl = this.querySelector("button");
      if (buttonEl) {
        buttonEl.addEventListener("click", this.handleAddToCart, { signal: this.controller.signal });
      } else {
        this.addEventListener("click", this.handleAddToCart, { signal: this.controller.signal });
      }
      this.unsubscribe = subscribe.cart(({ addIdLoading }) => {
        const { xoProductId: xoProductId2, xoSectionId } = this.getOptions();
        if (xoProductId2) {
          let id2 = "";
          if (this.productEl) {
            const sectionId = this.getSectionId();
            id2 = getId(sectionId, xoProductId2);
          } else {
            id2 = getId(xoSectionId, xoProductId2);
          }
          attrBoolean.set(this, "xo-loading", addIdLoading === id2);
          bindingHelper(this, "xo-loading-binding", addIdLoading === id2);
        }
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.bundleUnsubscribe();
      this.controller.abort();
    }
  }
  class CartRemove extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "handleClick", async (event) => {
        event.preventDefault();
        const cartLine = getCartLine(this.productEl);
        if (cartLine) {
          await changeCart(cartLine, 0);
        }
      });
    }
    get productEl() {
      return this.closest(WebComponent.Product);
    }
    onConnected() {
      if (!this.productEl) {
        throw new Error(`${WebComponent.CartRemove} must be inside ${WebComponent.Product}`);
      }
      this.addEventListener("click", this.handleClick);
    }
    disconnectedCallback() {
      this.removeEventListener("click", this.handleClick);
    }
  }
  let defaultCartSizeFromServer = null;
  class CartSize extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "prevSize", 0);
      __publicField(this, "timeId", -1);
      __publicField(this, "unsubscribe", () => {
      });
    }
    onConnected() {
      if (defaultCartSizeFromServer === null) {
        defaultCartSizeFromServer = Number(this.innerText);
      }
      const defaultSize = defaultCartSizeFromServer || getCartSize();
      this.prevSize = defaultSize;
      setCartSize(defaultSize);
      this.unsubscribe = subscribe.cart(async (state) => {
        this.innerText = `${state.size}`;
        if ((this.prevSize !== state.size || attrBoolean.get(this, "xo-test-fly")) && !state.addIdLoading) {
          const cartFlyEndEl = document.querySelector("[xo-cart-fly-end]");
          if (cartFlyEndEl) {
            clearTimeout(this.timeId);
            attrBoolean.set(cartFlyEndEl, "xo-cart-fly-end-animated", false);
            await delay();
            attrBoolean.set(cartFlyEndEl, "xo-cart-fly-end-animated", true);
            const animationDuration = Number(window.getComputedStyle(cartFlyEndEl).animationDuration.replace("s", "")) * 1e3;
            const animationDelay = Number(window.getComputedStyle(cartFlyEndEl).animationDelay.replace("s", "")) * 1e3;
            this.timeId = window.setTimeout(() => {
              attrBoolean.set(cartFlyEndEl, "xo-cart-fly-end-animated", false);
            }, animationDuration + animationDelay);
          }
        }
        this.prevSize = state.size;
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
      clearTimeout(this.timeId);
    }
  }
  class CartMini extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "cartScrollEl", null);
      __publicField(this, "scScrollTop", 0);
      __publicField(this, "handleScroll", () => {
        var _a2, _b2;
        this.scScrollTop = (_b2 = (_a2 = this.cartScrollEl) == null ? void 0 : _a2.scrollTop) != null ? _b2 : this.scScrollTop;
      });
    }
    onConnected() {
      var _a2;
      if (!this.id) {
        throw new Error(`The ${WebComponent.CartMini} component must have the id="{{ section.id }}" attribute`);
      }
      const modalEl = this.closest(WebComponent.Modal);
      this.cartScrollEl = this.querySelector(WebComponent.CartScroll);
      if (modalEl) {
        attrBoolean.set(modalEl, "xo-for-cart-mini", true);
      }
      (_a2 = this.cartScrollEl) == null ? void 0 : _a2.addEventListener("scroll", this.handleScroll);
      this.unsubscribe = subscribe.cart((state) => {
        var _a3, _b2;
        const newContent = state.sections[this.id];
        if (newContent) {
          const isLoading = state.changeLineLoading !== -1;
          if (isLoading) {
            this.scScrollTop = (_b2 = (_a3 = this.cartScrollEl) == null ? void 0 : _a3.scrollTop) != null ? _b2 : this.scScrollTop;
          } else {
            const isNotification = attrBoolean.get(this, "xo-notification");
            if (this.innerHTML !== newContent) {
              const willChangeEls = Array.from(this.querySelectorAll(WebComponent.CartWillChange));
              if (willChangeEls.length) {
                const domParser = new DOMParser();
                const doc = domParser.parseFromString(newContent, "text/html");
                setHoverLevel(doc);
                if (isNotification) {
                  removeProductForCartNotification(doc, state.productIdsForCartNotification);
                }
                const newCartWillChangeEls = doc.querySelectorAll(`${WebComponent.CartMini} ${WebComponent.CartWillChange}`);
                if (!newCartWillChangeEls.length) {
                  return;
                }
                each(willChangeEls, (willChangeEl, index) => {
                  const uid2 = willChangeEl.getAttribute("xo-unique-id");
                  let newCartWillChangeEl = null;
                  if (uid2) {
                    newCartWillChangeEl = doc.querySelector(`${WebComponent.CartWillChange}[xo-unique-id="${escapeValue(uid2)}"]`);
                  } else {
                    newCartWillChangeEl = newCartWillChangeEls[index];
                  }
                  if (newCartWillChangeEl && willChangeEl.outerHTML !== (newCartWillChangeEl == null ? void 0 : newCartWillChangeEl.outerHTML)) {
                    willChangeEl.innerHTML = newCartWillChangeEl.innerHTML;
                    const attrs = Array.from(newCartWillChangeEl.attributes);
                    each(attrs, (attr) => {
                      willChangeEl.setAttribute(attr.name, attr.value);
                    });
                  }
                });
              } else {
                this.innerHTML = getSectionHTML("inner", newContent, isNotification ? state.productIdsForCartNotification : void 0);
              }
              this.cartScrollEl = this.querySelector(WebComponent.CartScroll);
              if (this.cartScrollEl) {
                this.cartScrollEl.scrollTop = this.scScrollTop;
              }
            }
          }
        }
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
      if (this.cartScrollEl) {
        this.cartScrollEl.removeEventListener("scroll", this.handleScroll);
      }
    }
  }
  class CartChangeFallback extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
    }
    get productEl() {
      return this.closest(WebComponent.Product);
    }
    onConnected() {
      if (!this.productEl) {
        throw new Error(`${WebComponent.CartChangeFallback} must be inside ${WebComponent.Product}.`);
      }
      this.unsubscribe = subscribe.cart(({ changeLineLoading }) => {
        const cartLine = getCartLine(this.productEl);
        if (cartLine) {
          attrBoolean.set(this, "xo-visible", cartLine === changeLineLoading);
          bindingHelper(this, "xo-visible-binding", cartLine === changeLineLoading);
        }
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
    }
  }
  class CartQuantity extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "inputEl", null);
      __publicField(this, "prevValue", "-1");
      __publicField(this, "bundleProviderEl", this.closest(WebComponent.BundleProvider));
      __publicField(this, "controller", new AbortController());
      __publicField(this, "handleInput", (event) => {
        var _a2;
        const targetEl = event.target;
        const value = (_a2 = Number(targetEl.value)) != null ? _a2 : 1;
        if (value < 1) {
          targetEl.value = "1";
        }
        const { xoSectionId, xoProductId, xoLine } = this.productOptions;
        setFormQuantity(xoSectionId, xoProductId, xoLine, () => Number(targetEl.value));
      });
      __publicField(this, "handleInputForBundle", (event) => {
        var _a2;
        const { xoName } = this.bundleProviderEl.props;
        const targetEl = event.target;
        const value = (_a2 = Number(targetEl.value)) != null ? _a2 : 1;
        if (value < 1) {
          targetEl.value = "1";
        }
        const variantId = this.getAttribute("xo-variant-id");
        if (variantId) {
          updateBundleQuantity(xoName, variantId, Number(targetEl.value));
        }
      });
      __publicField(this, "handleFocus", (event) => {
        const targetEl = event.target;
        this.prevValue = targetEl.value;
      });
      __publicField(this, "handleBlur", (event) => {
        const { xoCartExclude = false } = this.productOptions;
        const targetEl = event.target;
        const cartLine = getCartLine(this.getProductEl());
        if (cartLine && !xoCartExclude && this.prevValue !== targetEl.value) {
          quantityChangeCart(this, cartLine, Number(targetEl.value));
        }
      });
    }
    getProductEl() {
      return this.closest(WebComponent.Product);
    }
    getBundleContentEl() {
      return this.closest(WebComponent.BundleContent);
    }
    get productOptions() {
      return this.getProductEl().getOptions();
    }
    onConnected() {
      var _a2, _b2, _c2;
      if ((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode) {
        return;
      }
      const forBundle = this.getBundleContentEl();
      this.inputEl = this.querySelector("input");
      if (!this.inputEl) {
        throw new Error(`${WebComponent.CartQuantity} must have an input number element`);
      }
      this.inputEl.name = QUANTITY_NAME;
      if (this.inputEl.value == null || this.inputEl.value === "") {
        this.inputEl.value = (_b2 = this.getAttribute("xo-min")) != null ? _b2 : "1";
      }
      this.inputEl.min = (_c2 = this.getAttribute("xo-min")) != null ? _c2 : "1";
      const productVariantEl = this.closest(`${WebComponent.ProductVariant}, ${WebComponent.ProductVariants}`);
      if (productVariantEl) {
        return;
      }
      if (forBundle && this.bundleProviderEl) {
        const { xoName } = this.bundleProviderEl.props;
        this.inputEl.addEventListener("input", this.handleInputForBundle, this.controller);
        const variantId = this.getAttribute("xo-variant-id");
        if (variantId) {
          this.unsubscribe = subscribe.bundle(({ bundles }) => {
            var _a3;
            const bundle = ((_a3 = bundles == null ? void 0 : bundles[xoName]) != null ? _a3 : []).find((item) => item.variantId === variantId);
            const quantity = bundle == null ? void 0 : bundle.quantity;
            if (quantity != null) {
              this.inputEl.value = `${quantity}`;
            }
          });
        }
      } else {
        const { xoSectionId, xoProductId, xoLine } = this.productOptions;
        setFormQuantity(xoSectionId, xoProductId, xoLine, () => {
          var _a3, _b3;
          return Number((_b3 = (_a3 = this.inputEl) == null ? void 0 : _a3.value) != null ? _b3 : 1);
        });
        this.inputEl.addEventListener("input", this.handleInput, this.controller);
        this.inputEl.addEventListener("focus", this.handleFocus, this.controller);
        this.inputEl.addEventListener("blur", this.handleBlur, this.controller);
        this.unsubscribe = subscribe.cartForm((state) => {
          var _a3;
          const quantity = (_a3 = state == null ? void 0 : state[getId(xoSectionId, xoProductId, xoLine)]) == null ? void 0 : _a3.quantity;
          if (quantity != null) {
            this.inputEl.value = `${quantity}`;
            const minusEl = this.querySelector(WebComponent.CartQuantityMinus);
            if (minusEl) {
              attrBoolean.set(minusEl, "xo-disabled", quantity === 1);
            }
          }
        });
      }
    }
    disconnectedCallback() {
      var _a2;
      if ((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode) {
        return;
      }
      this.unsubscribe();
      this.controller.abort();
    }
  }
  class CartQuantityMinus extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "quantityEl", null);
      __publicField(this, "bundleProviderEl", this.closest(WebComponent.BundleProvider));
      __publicField(this, "handleDecrement", () => {
        var _a2, _b2;
        const { xoSectionId, xoProductId, xoLine, xoCartExclude = false } = this.productOptions;
        this.getOptions();
        const step = Number(this.getQuantityEl().getAttribute("xo-step") || "1");
        const min = Number(this.getQuantityEl().getAttribute("xo-min") || "1");
        const max = Number(this.getQuantityEl().getAttribute("xo-max") || Infinity);
        setFormQuantity(xoSectionId, xoProductId, xoLine, (value) => clamp(value - step, min, max));
        const quantity = (_b2 = (_a2 = getState.cartForm()) == null ? void 0 : _a2[getId(xoSectionId, xoProductId, xoLine)]) == null ? void 0 : _b2.quantity;
        const cartLine = getCartLine(this.getProductEl());
        if (cartLine && !xoCartExclude) {
          quantityChangeCart(this, cartLine, quantity);
        }
      });
      __publicField(this, "handleDecrementForBundle", () => {
        if (!this.bundleProviderEl) {
          return;
        }
        const { xoName } = this.bundleProviderEl.props;
        const variantId = this.getQuantityEl().getAttribute("xo-variant-id");
        if (variantId) {
          updateBundleQuantityByType(xoName, variantId, "dec");
        }
      });
      __publicField(this, "handleDecrementForProductVariant", () => {
        var _a2;
        const inputEl = this.quantityEl.querySelector("input");
        const minStr = (_a2 = this.quantityEl) == null ? void 0 : _a2.getAttribute("xo-min");
        const min = minStr != null ? Number(minStr) : 1;
        inputEl.value = `${clamp(Number(inputEl.value) - 1, min, Infinity)}`;
      });
    }
    getProductEl() {
      return this.closest(WebComponent.Product);
    }
    getQuantityEl() {
      return this.closest(WebComponent.CartQuantity);
    }
    getBundleContentEl() {
      return this.closest(WebComponent.BundleContent);
    }
    get productOptions() {
      return this.getProductEl().getOptions();
    }
    getOptions() {
      const options = getAttrs(this, {
        pick: ["xoAutoUpdateCart"],
        types: {
          xoAutoUpdateCart: "boolean"
        }
      });
      return options;
    }
    onConnected() {
      this.quantityEl = this.closest(WebComponent.CartQuantity);
      if (!this.quantityEl) {
        throw new Error(`${WebComponent.CartQuantityMinus} must be inside ${WebComponent.CartQuantity}`);
      }
      const forBundle = this.getBundleContentEl();
      const productVariantEl = this.closest(WebComponent.ProductVariant);
      if (productVariantEl) {
        this.addEventListener("click", this.handleDecrementForProductVariant);
      } else if (forBundle) {
        this.addEventListener("click", this.handleDecrementForBundle);
      } else {
        this.addEventListener("click", this.handleDecrement);
      }
    }
    disconnectedCallback() {
      this.removeEventListener("click", this.handleDecrement);
      this.removeEventListener("click", this.handleDecrementForBundle);
      this.removeEventListener("click", this.handleDecrementForProductVariant);
    }
  }
  class CartQuantityPlus extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "quantityEl", null);
      __publicField(this, "bundleProviderEl", this.closest(WebComponent.BundleProvider));
      __publicField(this, "handleIncrement", () => {
        var _a2, _b2;
        const { xoSectionId, xoProductId, xoLine, xoCartExclude = false } = this.productOptions;
        this.getOptions();
        const step = Number(this.getQuantityEl().getAttribute("xo-step") || "1");
        const min = Number(this.getQuantityEl().getAttribute("xo-min") || "1");
        const max = Number(this.getQuantityEl().getAttribute("xo-max") || Infinity);
        setFormQuantity(xoSectionId, xoProductId, xoLine, (value) => clamp(value + step, min, max));
        const quantity = (_b2 = (_a2 = getState.cartForm()) == null ? void 0 : _a2[getId(xoSectionId, xoProductId, xoLine)]) == null ? void 0 : _b2.quantity;
        const cartLine = getCartLine(this.getProductEl());
        if (cartLine && !xoCartExclude) {
          quantityChangeCart(this, cartLine, quantity);
        }
      });
      __publicField(this, "handleIncrementForBundle", () => {
        if (!this.bundleProviderEl) {
          return;
        }
        const { xoName } = this.bundleProviderEl.props;
        const variantId = this.getQuantityEl().getAttribute("xo-variant-id");
        if (variantId) {
          updateBundleQuantityByType(xoName, variantId, "inc");
        }
      });
      __publicField(this, "handleIncrementForProductVariant", () => {
        var _a2;
        const inputEl = this.quantityEl.querySelector("input");
        const minStr = (_a2 = this.quantityEl) == null ? void 0 : _a2.getAttribute("xo-min");
        const min = minStr != null ? Number(minStr) : 1;
        inputEl.value = `${clamp(Number(inputEl.value) + 1, min, Infinity)}`;
      });
    }
    getProductEl() {
      return this.closest(WebComponent.Product);
    }
    getQuantityEl() {
      return this.closest(WebComponent.CartQuantity);
    }
    getBundleContentEl() {
      return this.closest(WebComponent.BundleContent);
    }
    get productOptions() {
      return this.getProductEl().getOptions();
    }
    getOptions() {
      const options = getAttrs(this, {
        pick: ["xoAutoUpdateCart"],
        types: {
          xoAutoUpdateCart: "boolean"
        }
      });
      return options;
    }
    onConnected() {
      this.quantityEl = this.closest(WebComponent.CartQuantity);
      if (!this.quantityEl) {
        throw new Error(`${WebComponent.CartQuantityPlus} must be inside ${WebComponent.CartQuantity}`);
      }
      const forBundle = this.getBundleContentEl();
      const productVariantEl = this.closest(WebComponent.ProductVariant);
      if (productVariantEl) {
        this.addEventListener("click", this.handleIncrementForProductVariant);
      } else if (forBundle) {
        this.addEventListener("click", this.handleIncrementForBundle);
      } else {
        this.addEventListener("click", this.handleIncrement);
      }
    }
    disconnectedCallback() {
      this.removeEventListener("click", this.handleIncrement);
      this.removeEventListener("click", this.handleIncrementForBundle);
      this.removeEventListener("click", this.handleIncrementForProductVariant);
    }
  }
  class CartNote extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "textareaEl", null);
      __publicField(this, "buttonEl", null);
      __publicField(this, "handleInput", (event) => {
        const textareaEl = event.target;
        setCartNoteDraft(textareaEl.value);
      });
      __publicField(this, "handleInputDebounced", debounce((event) => {
        const textareaEl = event.target;
        setCartNoteDraft(textareaEl.value);
        postCartNote(textareaEl.value);
      }, 600));
    }
    onConnected() {
      this.textareaEl = this.querySelector('textarea[name="note"]');
      if (!this.textareaEl) {
        throw new Error(`${WebComponent.CartNote} must have a textarea element with name="note"`);
      }
      this.buttonEl = this.querySelector(WebComponent.CartNoteSubmit);
      if (this.buttonEl) {
        this.textareaEl.addEventListener("input", this.handleInput);
      } else {
        this.textareaEl.addEventListener("input", this.handleInputDebounced);
      }
      this.unsubscribe = subscribe.cartNote(({ status }) => {
        attrBoolean.set(this, "xo-loading", status === "loading");
        bindingHelper(this, "xo-loading-binding", status === "loading");
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
      if (this.textareaEl) {
        if (this.buttonEl) {
          this.textareaEl.removeEventListener("input", this.handleInput);
        } else {
          this.textareaEl.removeEventListener("input", this.handleInputDebounced);
        }
      }
    }
  }
  class CartNoteSubmit extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "cartNoteEl", null);
      __publicField(this, "handleClick", async (event) => {
        event.preventDefault();
        const { noteDraft } = getState.cartNote();
        await postCartNote(noteDraft);
        toggleParentModal(this, false);
      });
    }
    onConnected() {
      this.cartNoteEl = this.closest(WebComponent.CartNote);
      if (!this.cartNoteEl) {
        throw new Error(`${WebComponent.CartNoteSubmit} must be inside ${WebComponent.CartNote}`);
      }
      this.addEventListener("click", this.handleClick);
      this.unsubscribe = subscribe.cartNote(({ status }) => {
        attrBoolean.set(this, "xo-loading", status === "loading");
        bindingHelper(this, "xo-loading-binding", status === "loading");
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.removeEventListener("click", this.handleClick);
    }
  }
  class CartShippingRatesField extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "fieldEl", null);
      __publicField(this, "handleChange", (event) => {
        const targetEl = event.target;
        this.setState(targetEl.name, targetEl.value);
      });
    }
    setState(name, value) {
      var _a2;
      const name_ = name.replace(/address\[|\]/g, "");
      setCartShippingRatesField(name_, value);
      if (name_ === "country") {
        const optionEl = this.fieldEl.querySelector(`option[value="${this.fieldEl.value}"]`);
        setProvinces(objectParse((_a2 = optionEl.getAttribute("data-provinces")) != null ? _a2 : "[]"));
      }
    }
    onConnected() {
      this.fieldEl = this.querySelector('select, input[type="text"]');
      if (!this.fieldEl) {
        throw new Error(`${WebComponent.CartShippingRatesField} must have a select or input element`);
      }
      const eventType = this.fieldEl instanceof HTMLInputElement ? "input" : "change";
      this.setState(this.fieldEl.name, this.fieldEl.value);
      this.fieldEl.addEventListener(eventType, this.handleChange);
      const name = this.fieldEl.name.replace(/address\[|\]/g, "");
      if (name === "province") {
        attrBoolean.set(this, "xo-disabled", getState.cartShippingRatesForm().provinces.length === 0);
      }
      this.unsubscribe = subscribe.cartShippingRatesForm(({ provinces }) => {
        if (name === "province") {
          this.fieldEl.innerHTML = provinces.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
          const firstOptionEl = this.fieldEl.querySelector("option");
          if (firstOptionEl) {
            this.setState(this.fieldEl.name, firstOptionEl.value);
          }
          attrBoolean.set(this, "xo-disabled", provinces.length === 0);
        }
      }, (prevState, nextState) => {
        return equal(prevState == null ? void 0 : prevState.provinces, nextState.provinces);
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
      if (this.fieldEl) {
        const eventType = this.fieldEl instanceof HTMLInputElement ? "input" : "change";
        this.fieldEl.removeEventListener(eventType, this.handleChange);
      }
    }
  }
  class CartShippingRatesSubmit extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "handleClick", async (event) => {
        event.preventDefault();
        const { zip, country, province } = getState.cartShippingRatesForm();
        await getCartShippingRates(zip, country, province);
      });
    }
    onConnected() {
      this.addEventListener("click", this.handleClick);
      this.unsubscribe = subscribe.cartShippingRates(({ status }) => {
        attrBoolean.set(this, "xo-loading", status === "loading");
        bindingHelper(this, "xo-loading-binding", status === "loading");
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.removeEventListener("click", this.handleClick);
    }
  }
  class CartShippingRatesError extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
    }
    onConnected() {
      this.unsubscribe = subscribe.cartShippingRates(({ status, errorMessages }) => {
        if (status === "error") {
          this.innerHTML = errorMessages.join(", ");
        }
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
    }
  }
  class CartAddError extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "animated", createAnimate());
    }
    onConnected() {
      var _a2;
      const contentEl = (_a2 = this.querySelector(WebComponent.CartAddErrorMessage)) != null ? _a2 : this;
      this.unsubscribe = subscribe.cart(async ({ addErrorMessage }) => {
        if (!!addErrorMessage) {
          this.style.visibility = "visible";
          this.style.height = "auto";
          contentEl.innerHTML = addErrorMessage;
          await delay(4e3);
          this.animated({
            from: this.offsetHeight,
            to: 0,
            duration: 300,
            onUpdate: (value) => {
              this.style.height = `${value}px`;
            },
            onEnd: () => {
              contentEl.innerHTML = "";
              this.style.removeProperty("visibility");
            }
          });
        } else {
          contentEl.innerHTML = "";
        }
      });
    }
    disconnectedCallback() {
      this.animated.off();
      this.unsubscribe();
    }
  }
  class ProductPickupAvailability extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
    }
    onConnected() {
      this.unsubscribe = subscribe.product(({ pickupAvailabilityHtml }) => {
        if (pickupAvailabilityHtml) {
          const doc = new DOMParser().parseFromString(pickupAvailabilityHtml, "text/html");
          const newEl = doc.querySelector(`${WebComponent.ProductPickupAvailability}`);
          setHoverLevel(newEl);
          if (newEl) {
            if (this.innerHTML !== newEl.innerHTML) {
              this.innerHTML = newEl.innerHTML;
            }
          } else {
            this.innerHTML = "";
          }
        }
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
    }
  }
  class ProductPickupAvailabilityList extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
    }
    onConnected() {
      this.unsubscribe = subscribe.product(({ pickupAvailabilityHtml }) => {
        if (pickupAvailabilityHtml) {
          const doc = new DOMParser().parseFromString(pickupAvailabilityHtml, "text/html");
          const newEl = doc.querySelector(WebComponent.ProductPickupAvailabilityList);
          setHoverLevel(newEl);
          if (newEl) {
            if (this.innerHTML !== newEl.innerHTML) {
              this.innerHTML = newEl.innerHTML;
            }
          } else {
            this.innerHTML = "";
          }
        }
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
    }
  }
  class ProductQuickView extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "controller", new AbortController());
      __publicField(this, "triggerProductEl", null);
      __publicField(this, "bundleProviderEl", null);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "handleBundle", (quickviewTriggerEl) => {
        const bundleProviderEl = quickviewTriggerEl == null ? void 0 : quickviewTriggerEl.closest(WebComponent.BundleProvider);
        if (bundleProviderEl) {
          const bundleAddEl = this.querySelector(WebComponent.BundleAdd);
          const triggerProductEl = quickviewTriggerEl == null ? void 0 : quickviewTriggerEl.closest(WebComponent.Product);
          this.setAttribute("xo-bundle-name", bundleProviderEl.props.xoName);
          if (triggerProductEl) {
            this.triggerProductEl = triggerProductEl;
            this.bundleProviderEl = bundleProviderEl;
            bundleAddEl == null ? void 0 : bundleAddEl.setTriggerProductEl(triggerProductEl);
            bundleAddEl == null ? void 0 : bundleAddEl.setProviderEl(bundleProviderEl);
          }
        }
      });
    }
    onConnected() {
      var _a2;
      const xoName = (_a2 = this.getAttribute("xo-name")) != null ? _a2 : QUICKVIEW_NAME;
      this.unsubscribe = subscribe.product(({ status, quickviewProductHtml, quickviewTriggerEl }) => {
        var _a3, _b2;
        const productTriggerEl = quickviewTriggerEl == null ? void 0 : quickviewTriggerEl.closest(WebComponent.Product);
        const productHtml = (_a3 = quickviewProductHtml[xoName]) != null ? _a3 : "";
        const newProductHtml = productHtml.replace(new RegExp(`${WebComponent.ProductVariant}(?=(\\s|>))`, "g"), WebComponent.ProductQuickViewVariant);
        const domParser = new DOMParser();
        const doc = domParser.parseFromString(newProductHtml, "text/html");
        const templateEl = doc.querySelector("template[xo-quick-view-content]");
        const productEl = doc.querySelector(`${WebComponent.Product}[xo-product-information]:not([xo-product-information="false"])`);
        if (productTriggerEl) {
          productEl == null ? void 0 : productEl.setAttribute("xo-section-id", productTriggerEl.getAttribute("xo-section-id") || "");
        }
        const clone = templateEl == null ? void 0 : templateEl.content.cloneNode(true);
        if ((clone == null ? void 0 : clone.children.length) && (clone == null ? void 0 : clone.children.length) > 1) {
          throw new Error(`The <template xo-quick-view-content> element must have only one child node.`);
        }
        const contentEl = (clone == null ? void 0 : clone.children[0]) || productEl;
        if (contentEl && this.innerHTML === "" && status === "success") {
          setHoverLevel(contentEl);
          const fieldEls = Array.from(contentEl.querySelectorAll(`${WebComponent.ProductQuickViewVariant} input[type="radio"], ${WebComponent.ProductQuickViewVariant} select`));
          each(fieldEls, (fieldEl) => {
            const id2 = fieldEl.id;
            const labelEl = doc.querySelector(`label[for="${id2}"]`);
            fieldEl.name = fieldSignal.addFieldSignal(fieldEl.name, QUICKVIEW_SIGNAL);
            if (id2) {
              fieldEl.id = fieldSignal.addFieldSignal(id2, QUICKVIEW_SIGNAL);
            }
            if (labelEl) {
              labelEl.setAttribute("for", fieldSignal.addFieldSignal(id2, QUICKVIEW_SIGNAL));
            }
            attrBoolean.set(fieldEl, "xo-for-quick-view", true);
          });
          const xoNameEls = Array.from(contentEl.querySelectorAll(`[xo-name]:not(${WebComponent.ProductVariantSelected}):not(${WebComponent.ModalTrigger})`));
          each(xoNameEls, (xoNameEl) => {
            xoNameEl.setAttribute("xo-name", fieldSignal.addFieldSignal(xoNameEl.getAttribute("xo-name"), QUICKVIEW_SIGNAL));
          });
          if (this.innerHTML !== contentEl.outerHTML) {
            this.innerHTML = contentEl.outerHTML;
            (_b2 = window.Shopify.PaymentButton) == null ? void 0 : _b2.init();
            loadImages(this);
            this.handleBundle(quickviewTriggerEl);
          }
        }
      });
    }
    disconnectedCallback() {
      this.unsubscribe();
      this.controller.abort();
    }
  }
  class ProductQuickViewTrigger extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "getProductUrl", () => {
        const { xoProductUrl } = this.options;
        const productEl = this.closest(WebComponent.Product);
        if (!productEl) {
          return xoProductUrl;
        }
        const { xoSectionId, xoProductId } = productEl.getOptions();
        const currentVariantId = getVariantId(xoSectionId, xoProductId);
        if (xoProductUrl.includes("?")) {
          return `${xoProductUrl}&variant=${currentVariantId}`;
        }
        return `${xoProductUrl}?variant=${currentVariantId}`;
      });
      __publicField(this, "loadingAndModal", () => {
        const { xoModalName, xoToggleName } = this.options;
        attrBoolean.set(this, "xo-loading", false);
        bindingHelper(this, "xo-loading-binding", false);
        if (xoModalName) {
          xoModal.open(xoModalName);
        }
        if (xoToggleName) {
          xoToggle$1.open(xoToggleName);
        }
      });
      __publicField(this, "handleClick", async () => {
        const { xoName = QUICKVIEW_NAME } = this.options;
        const productQuickViewEl = document.querySelector(WebComponent.ProductQuickView);
        if (productQuickViewEl) {
          productQuickViewEl.innerHTML = "";
        }
        attrBoolean.set(this, "xo-loading", true);
        bindingHelper(this, "xo-loading-binding", true);
        await getQuickviewProductHtml(xoName, this.getProductUrl(), this);
        if ("requestIdleCallback" in window) {
          requestIdleCallback(() => {
            this.loadingAndModal();
          });
        } else {
          this.loadingAndModal();
        }
      });
    }
    getOptions() {
      return getAttrs(this, {
        pick: ["xoName", "xoProductUrl", "xoModalName", "xoToggleName"],
        types: {
          xoName: "string",
          xoProductUrl: "string",
          xoModalName: "string",
          xoToggleName: "string"
        }
      });
    }
    get options() {
      return this.getOptions();
    }
    onConnected() {
      const { xoProductUrl } = this.options;
      if (!xoProductUrl) {
        throw new Error(`${WebComponent.ProductQuickViewTrigger} must have a xo-product-url attribute`);
      }
      this.addEventListener("click", this.handleClick);
    }
    disconnectedCallback() {
      this.removeEventListener("click", this.handleClick);
    }
  }
  const locationEvent = new Emitter();
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;
  window.history.pushState = function(data, title, url) {
    originalPushState.call(window.history, data, title, url);
    locationEvent.emit("change", void 0);
  };
  window.history.replaceState = function(data, title, url) {
    originalReplaceState.call(window.history, data, title, url);
    locationEvent.emit("change", void 0);
  };
  window.addEventListener("popstate", () => {
    locationEvent.emit("change", void 0);
  });
  function handleSticky(productVariantEl) {
    if (!window.location.href.includes("/products/")) {
      return;
    }
    const stickyEl = productVariantEl.closest(WebComponent.Sticky);
    if (stickyEl) {
      const fieldEls = Array.from(stickyEl.querySelectorAll(`input[type="radio"], select`));
      each(fieldEls, async (fieldEl) => {
        await delay();
        const id2 = fieldEl.id;
        const labelEl = document.querySelector(`label[for="${id2}"]`);
        fieldEl.name = fieldSignal.addFieldSignal(fieldEl.name, STICKY_SIGNAL);
        if (id2) {
          fieldEl.id = fieldSignal.addFieldSignal(id2, STICKY_SIGNAL);
        }
        if (labelEl) {
          labelEl.setAttribute("for", fieldSignal.addFieldSignal(id2, STICKY_SIGNAL));
        }
      });
    }
  }
  let eventId$2 = -1;
  let productVariantIndex = -1;
  const prevVariantSelectedMap = /* @__PURE__ */ new Map();
  function isProductPage() {
    if (window.XO_DEV) {
      return true;
    }
    return window.location.pathname.includes("/products/");
  }
  function checkInstockAndAvailable(sectionId, productId, name, value) {
    var _a2, _b2, _c2;
    const id2 = getId(sectionId, productId);
    const variantSelected = (_b2 = (_a2 = getCartFormState()) == null ? void 0 : _a2[id2]) == null ? void 0 : _b2.variantSelected;
    const productVariants = (_c2 = getProductData(sectionId, productId)) == null ? void 0 : _c2.variants;
    if (variantSelected && productVariants) {
      const optionsSelected = objectValues({ ...variantSelected, [name]: value }).filter(Boolean);
      return productVariants.some((variant) => {
        if (variant.options.length !== optionsSelected.length) {
          return true;
        }
        return equal(variant.options.sort(), optionsSelected.sort()) && variant.available;
      });
    }
    return true;
  }
  function checkAvailable(sectionId, productId, name, value) {
    var _a2, _b2, _c2;
    const id2 = getId(sectionId, productId);
    const variantSelected = (_b2 = (_a2 = getCartFormState()) == null ? void 0 : _a2[id2]) == null ? void 0 : _b2.variantSelected;
    const productVariants = (_c2 = getProductData(sectionId, productId)) == null ? void 0 : _c2.variants;
    if (variantSelected && productVariants) {
      const optionsSelected = objectValues({ ...variantSelected, [name]: value }).filter(Boolean);
      return productVariants.some((variant) => {
        if (variant.options.length !== optionsSelected.length) {
          return true;
        }
        return variant.options.every((option) => optionsSelected.includes(option));
      });
    }
    return true;
  }
  function reselectAvailableVariants(el, productEl, fieldSelector) {
    var _a2, _b2, _c2;
    let clicked = false;
    const fieldEls = Array.from((_b2 = (_a2 = productEl.querySelector(`${WebComponent.ProductVariant}[xo-primary]`)) == null ? void 0 : _a2.querySelectorAll(fieldSelector)) != null ? _b2 : []);
    if (!fieldEls.length) {
      return;
    }
    const { xoProductId, xoSectionId } = productEl.getOptions();
    const variantId = getVariantId(xoSectionId, xoProductId);
    const currentFieldEl = fieldEls.find((fieldEl) => fieldEl.checked);
    if (currentFieldEl && !variantId && !clicked) {
      const productVariants = (_c2 = getProductData(xoSectionId, xoProductId)) == null ? void 0 : _c2.variants;
      const availableVariant = productVariants == null ? void 0 : productVariants.find((productVariant) => {
        return productVariant.available && productVariant.options.includes(currentFieldEl.value);
      });
      if (availableVariant) {
        const { options } = availableVariant;
        each(options, (option) => {
          const fieldEl = el.querySelector(`input[value="${option}"]`);
          if (fieldEl && !fieldEl.checked) {
            fieldEl.click();
            clicked = true;
          }
        });
      }
    }
  }
  class ProductVariant extends XoHTMLElement {
    constructor(productEl, selector = 'input[type="radio"]:not([xo-for-quick-view]), select:not([xo-for-quick-view])', isProductQuickViewVariant = false) {
      super();
      __publicField(this, "fieldEls", []);
      __publicField(this, "productEl", this.closest(WebComponent.Product));
      __publicField(this, "fieldSelector");
      __publicField(this, "isProductQuickViewVariant");
      __publicField(this, "queueId", -1);
      __publicField(this, "controller", new AbortController());
      __publicField(this, "debounce", createDebounce());
      __publicField(this, "debounce2", createDebounce());
      __publicField(this, "productUnsubscribe", () => {
      });
      __publicField(this, "cartFormUnsubscribe", () => {
      });
      __publicField(this, "getBindingElements", (el, value) => {
        var _a2;
        if (value.includes(":")) {
          const values = value.split(":");
          if (values.length === 1) {
            return [el];
          }
          const selector = (_a2 = values == null ? void 0 : values[1]) == null ? void 0 : _a2.replace(/(\w|\])(\[)(.*)/g, "$1");
          if (!selector) {
            return [el];
          }
          return Array.from(el.querySelectorAll(selector));
        }
        return [el];
      });
      __publicField(this, "getBindingType", (value) => {
        const bindingType = value.replace(/.*:/g, "").includes("[") ? value.replace(/.*\[/g, "").replace(/\]/g, "").trim() : "children";
        return bindingType;
      });
      __publicField(this, "handleBindingAttr", () => {
        var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
        const { xoSectionId, xoProductId } = this.productEl.getOptions();
        const variantId = getVariantId(xoSectionId, xoProductId);
        const textContent = ((_c2 = (_b2 = (_a2 = this.productEl) == null ? void 0 : _a2.querySelector(`${WebComponent.ProductLiquidStatic} template`)) == null ? void 0 : _b2.content) == null ? void 0 : _c2.textContent) || ((_e2 = (_d2 = this.productEl) == null ? void 0 : _d2.querySelector(WebComponent.ProductLiquidStatic)) == null ? void 0 : _e2.textContent) || "{}";
        const liquidStatics = objectParse(textContent);
        const liquidStatic = liquidStatics == null ? void 0 : liquidStatics[variantId];
        const contentBindEls = [
          ...Array.from(this.productEl.querySelectorAll(`[${BINDING_ATTR}]`)),
          ...Array.from((_h2 = (_g2 = (_f2 = this.productEl.querySelector(`template[${BUNDLE_CARD_ITEM_ATTR}]`)) == null ? void 0 : _f2.content) == null ? void 0 : _g2.querySelectorAll(`[${BINDING_ATTR}]`)) != null ? _h2 : [])
        ];
        each(contentBindEls, (contentBindEl) => {
          const bindings = contentBindEl.getAttribute(BINDING_ATTR).split(",");
          each(bindings, (binding) => {
            const key = binding.replace(/(:|\[).*/g, "").trim();
            const elements = this.getBindingElements(contentBindEl, binding);
            const bindingType = this.getBindingType(binding);
            if (typeOf(liquidStatic) === "object") {
              const newValue = liquidStatic[key];
              if (newValue != null) {
                each(elements, (element) => {
                  if (bindingType === "children") {
                    element.innerHTML = newValue;
                  } else {
                    element.setAttribute(bindingType, newValue);
                  }
                });
              }
            }
          });
        });
      });
      __publicField(this, "handleChange", (event) => {
        var _a2;
        const targetEl = event.target;
        const { value } = targetEl;
        const { name } = targetEl;
        const { xoSectionId, xoProductId, xoFeaturedProduct, xoProductUrl } = this.productEl.getOptions();
        const { productUrl } = getState.product();
        const newName = fieldSignal.removeFieldSignal(name);
        setFormVariant(xoSectionId, xoProductId, newName, value);
        this.closePopover();
        if (this.condChangeVariantAndRequest()) {
          this.handleFinalProductInformation();
        } else if (xoFeaturedProduct) {
          const variantId = getVariantId(xoSectionId, xoProductId);
          if (variantId) {
            const params = queryString.stringify({ section_id: xoSectionId, variant: variantId });
            const url = `${xoProductUrl}?${params}`;
            getProductHtml(url, true);
          }
          this.bindAvailable();
        } else if (productUrl != null) {
          const variantId = getVariantId(xoSectionId, xoProductId);
          if (variantId) {
            const params = queryString.stringify({ section_id: xoSectionId, variant: variantId });
            const url = `${productUrl}?${params}`;
            getProductHtml(url);
          }
          this.bindAvailable();
        } else {
          this.handleBindingAttr();
          this.bindAvailable();
          if (this.getAttribute("xo-add-to-bundle") != null) {
            const variantId = getVariantId(xoSectionId, xoProductId);
            const bundleAddEl = (_a2 = this.productEl) == null ? void 0 : _a2.querySelector(WebComponent.BundleAdd);
            if (bundleAddEl && variantId) {
              bundleAddEl.toggle = true;
              bundleAddEl.click();
            }
          }
        }
        this.handleUnavailable();
      });
      __publicField(this, "setFormVariantAfterLocationChange", this.debounce2(() => {
        var _a2;
        const { xoSectionId, xoProductId } = this.productEl.getOptions();
        const productVariants = (_a2 = getProductData(xoSectionId, xoProductId)) == null ? void 0 : _a2.variants;
        const currentVariantId = queryString.parse(window.location.search, true).variant;
        const variantInputEls = Array.from(document.querySelectorAll(`${FORM_CART_ADD_SELECTOR} input[name="id"]`));
        each(variantInputEls, (variantInputEl) => {
          variantInputEl.value = currentVariantId;
        });
        const currentVariant = productVariants == null ? void 0 : productVariants.find((variant) => variant.id == currentVariantId);
        if (currentVariant) {
          const fieldEls = currentVariant.options.reduce((acc, value) => {
            var _a3;
            return [
              ...acc,
              ...Array.from(this.querySelectorAll(`input[type="radio"]:not([xo-for-quick-view])[value="${escapeValue(value)}"]`)),
              ...Array.from((_a3 = this.querySelector(`select:not([xo-for-quick-view])[value="${escapeValue(value)}"]`)) != null ? _a3 : [])
            ];
          }, []);
          each(fieldEls, (fieldEl) => {
            if (fieldEl) {
              const name = fieldSignal.removeFieldSignal(fieldEl.name);
              setFormVariant(xoSectionId, xoProductId, name, fieldEl.value);
            }
          });
          this.bindAvailable();
        }
      }, 0));
      __publicField(this, "handleLocationChange", () => {
        var _a2;
        const { xoSectionId, xoProductId } = this.productEl.getOptions();
        if (this.condChangeVariantAndRequest()) {
          const { href } = window.location;
          const url = href.includes("?") ? `${href}&section_id=${xoSectionId}` : `${href}?section_id=${xoSectionId}`;
          if (url.includes("variant=")) {
            getProductHtml(url);
          } else {
            updateObserved();
          }
          this.setFormVariantAfterLocationChange();
          const pickupEl = (_a2 = this.productEl) == null ? void 0 : _a2.querySelector(WebComponent.ProductPickupAvailability);
          if (pickupEl) {
            getPickupAvailabilityHtml(xoSectionId, xoProductId);
          }
          window.cancelAnimationFrame(this.queueId);
        }
      });
      __publicField(this, "handleProductVariantSelected", (fieldEl) => {
        const name = fieldSignal.removeFieldSignal(fieldEl.name);
        const productVariantSelectedEls = Array.from(this.productEl.querySelectorAll(`${WebComponent.ProductVariantSelected}[xo-name="${name}"]`));
        each(productVariantSelectedEls, (productVariantSelectedEl) => {
          if (productVariantSelectedEl) {
            productVariantSelectedEl.innerHTML = fieldEl.value;
          }
        });
      });
      __publicField(this, "closePopover", () => {
        const popoverEl = this.closest(WebComponent.Popover);
        const productEl = popoverEl == null ? void 0 : popoverEl.querySelector(WebComponent.Product);
        if (popoverEl && !productEl) {
          const popoverName = popoverEl.getAttribute("xo-name");
          xoPopover.close(popoverName);
        }
      });
      __publicField(this, "unavailable", () => {
        const { xoSectionId, xoProductId } = this.productEl.getOptions();
        const variantId = getVariantId(xoSectionId, xoProductId);
        if (this.children.length === 0) {
          return false;
        }
        return !variantId;
      });
      __publicField(this, "handleUnavailable", () => {
        attrBoolean.set(this.productEl, "xo-unavailable", this.unavailable());
        bindingHelper(this.productEl, "xo-unavailable-binding", this.unavailable());
      });
      __publicField(this, "handleAvailable", (fieldEl, _index) => {
        if (fieldEl instanceof HTMLInputElement) {
          const { xoSectionId, xoProductId } = this.productEl.getOptions();
          const name = fieldSignal.removeFieldSignal(fieldEl.name);
          const instockAndAvailableEnable = checkInstockAndAvailable(xoSectionId, xoProductId, name, fieldEl.value);
          const availableEnable = checkAvailable(xoSectionId, xoProductId, name, fieldEl.value);
          attrBoolean.set(fieldEl, "xo-disabled", !instockAndAvailableEnable);
          attrBoolean.set(fieldEl, "xo-unavailable", !availableEnable);
          bindingHelper(fieldEl, "xo-disabled-binding", !instockAndAvailableEnable);
          bindingHelper(fieldEl, "xo-unavailable-binding", !availableEnable);
        }
      });
      __publicField(this, "bindAvailable", this.debounce(() => {
        const allFieldEls = Array.from(this.productEl.querySelectorAll(this.fieldSelector));
        each(allFieldEls, this.handleAvailable);
        this.handleUnavailable();
        reselectAvailableVariants(this, this.productEl, this.fieldSelector);
      }, 0));
      __publicField(this, "cartFormListener", () => {
        var _a2, _b2;
        const { xoSectionId, xoProductId } = this.productEl.getOptions();
        const id2 = getId(xoSectionId, xoProductId);
        const variantSelected = (_b2 = (_a2 = getCartFormState()) == null ? void 0 : _a2[id2]) == null ? void 0 : _b2.variantSelected;
        if (variantSelected && !equal(prevVariantSelectedMap.get(id2), variantSelected)) {
          each(objectKeys(variantSelected), (name) => {
            const value = variantSelected[name];
            this.handleSyncFields(name, value);
          });
        }
        prevVariantSelectedMap.set(id2, variantSelected);
      });
      this.fieldSelector = selector;
      this.isProductQuickViewVariant = isProductQuickViewVariant;
      this.productEl = productEl != null ? productEl : this.closest(WebComponent.Product);
      productVariantIndex++;
      handleSticky(this);
    }
    condChangeVariantAndRequest() {
      const { xoProductInformation } = this.productEl.getOptions();
      const quickViewEl = this.closest(WebComponent.ProductQuickView);
      return isProductPage() && xoProductInformation && !quickViewEl;
    }
    async handleProductInformation() {
      const { xoSectionId, xoProductId } = this.productEl.getOptions();
      const variantId = getVariantId(xoSectionId, xoProductId);
      const newUrl = `${window.location.pathname}${variantId ? `?variant=${variantId}` : ""}`;
      if (window.location.href !== newUrl) {
        window.history.replaceState({}, "", newUrl);
      }
    }
    handleFinalProductInformation() {
      this.queueId = window.requestAnimationFrame(() => {
        this.handleProductInformation();
        window == null ? void 0 : window.cancelAnimationFrame(this.queueId);
      });
    }
    handleSyncFields(name, value) {
      var _a2, _b2;
      const { xoProductInformation } = this.productEl.getOptions();
      const currentFieldEls = Array.from((_b2 = (_a2 = this.productEl) == null ? void 0 : _a2.querySelectorAll(`input[type="radio"][name="${name}"][value="${escapeValue(value)}"], input[type="radio"][name$="${name}"][value="${escapeValue(value)}"], select[name="${name}"], select[name$="${name}"]`)) != null ? _b2 : []);
      if (xoProductInformation) {
        each(currentFieldEls, (currentFieldEl) => {
          const productRecommendationsEl = currentFieldEl.closest(WebComponent.ProductRecommendations);
          if (productRecommendationsEl || currentFieldEl.getAttribute("xo-for-quick-view")) {
            return;
          }
          if (currentFieldEl instanceof HTMLSelectElement) {
            const optionEls = Array.from(currentFieldEl.querySelectorAll("option"));
            each(optionEls, (optionEl) => {
              optionEl.selected = optionEl.value === value;
            });
          } else if (currentFieldEl instanceof HTMLInputElement) {
            currentFieldEl.checked = true;
          }
        });
      }
      each(currentFieldEls, (currentFieldEl) => {
        if (currentFieldEl instanceof HTMLInputElement) {
          this.handleProductVariantSelected(currentFieldEl);
        }
      });
    }
    handleFirstVariant(fieldEl) {
      const { xoSectionId, xoProductId } = this.productEl.getOptions();
      const name = fieldSignal.removeFieldSignal(fieldEl.name);
      if (fieldEl instanceof HTMLInputElement) {
        if (fieldEl.checked || fieldEl.hasAttribute("checked") && fieldEl.getAttribute("checked") !== "false") {
          fieldEl.checked = true;
          setFormVariant(xoSectionId, xoProductId, name, fieldEl.value);
          this.handleProductVariantSelected(fieldEl);
        }
      } else if (fieldEl instanceof HTMLSelectElement) {
        const optionEls = Array.from(fieldEl.querySelectorAll("option"));
        each(optionEls, (optionEl) => {
          if (optionEl.selected || optionEl.hasAttribute("selected") && optionEl.getAttribute("selected") !== "false") {
            optionEl.selected = true;
            setFormVariant(xoSectionId, xoProductId, name, fieldEl.value);
          }
        });
      }
    }
    onConnected() {
      var _a2;
      if ((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode) {
        return;
      }
      const { xoProductId, xoProductInformation } = this.productEl.getOptions();
      this.fieldEls = Array.from(this.querySelectorAll(this.fieldSelector));
      if (!this.isProductQuickViewVariant && xoProductInformation) {
        locationEvent.off(eventId$2);
        eventId$2 = locationEvent.on("change", this.handleLocationChange);
      }
      each(this.fieldEls, (fieldEl) => {
        fieldEl.name = fieldSignal.addFieldSignal(fieldEl.name, `SIGNAL_${xoProductId}_${productVariantIndex}`);
        this.handleFirstVariant(fieldEl);
        fieldEl.addEventListener("change", this.handleChange, { signal: this.controller.signal });
      });
      this.bindAvailable();
      this.cartFormUnsubscribe = subscribe.cartForm(this.cartFormListener, equal);
      this.productUnsubscribe = subscribe.product(this.bindAvailable);
    }
    disconnectedCallback() {
      var _a2;
      if ((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode) {
        return;
      }
      const { xoProductInformation } = this.productEl.getOptions();
      this.controller.abort();
      if (!this.isProductQuickViewVariant && xoProductInformation) {
        locationEvent.off(eventId$2);
      }
      this.cartFormUnsubscribe();
      this.productUnsubscribe();
      window.cancelAnimationFrame(this.queueId);
      this.debounce.cancel();
      this.debounce2.cancel();
    }
  }
  class ProductQuickViewVariant extends ProductVariant {
    constructor() {
      const productEl = document.querySelector(`${WebComponent.ProductQuickView} ${WebComponent.Product}`);
      super(productEl, 'input[type="radio"][xo-for-quick-view], select[xo-for-quick-view]', true);
    }
  }
  class ProductLiquidStatic extends XoHTMLElement {
    onConnected() {
      const productEl = this.closest(WebComponent.Product);
      if (!productEl) {
        throw new Error(`${WebComponent.ProductLiquidStatic} must be a child of ${WebComponent.Product}}`);
      }
    }
  }
  let eventId$1 = -1;
  class ProductRecipientForm extends XoHTMLElement {
    constructor() {
      super();
      __publicField(this, "recipientFieldsLiveRegion");
      __publicField(this, "checkboxInput", this.querySelector('input[type="checkbox"][name="properties[__shopify_send_gift_card_to_recipient]"]'));
      __publicField(this, "hiddenControlField", this.querySelector('input[type="hidden"][name="properties[__shopify_send_gift_card_to_recipient]"]'));
      __publicField(this, "emailInput", this.querySelector('input[name="properties[Recipient email]"]'));
      __publicField(this, "nameInput", this.querySelector('input[name="properties[Recipient name]"]'));
      __publicField(this, "messageInput", this.querySelector('textarea[name="properties[Message]"]'));
      __publicField(this, "sendonInput", this.querySelector('input[name="properties[Send on]"]'));
      __publicField(this, "offsetProperty", this.querySelector('input[name="properties[__shopify_offset]"]'));
      __publicField(this, "currentProductVariantId", "");
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "handleChange", () => {
        var _a2;
        if ((_a2 = this.checkboxInput) == null ? void 0 : _a2.checked) {
          setRecipientState(this.checkboxInput.name, "on");
          this.enableInputFields();
          attrBoolean.set(this, "xo-active", true);
          if (this.recipientFieldsLiveRegion && window.accessibilityStrings.recipientFormExpanded) {
            this.recipientFieldsLiveRegion.innerText = window.accessibilityStrings.recipientFormExpanded;
          }
        } else {
          this.clearInputFields();
          this.disableInputFields();
          resetRecipientState();
          attrBoolean.set(this, "xo-active", false);
          if (this.recipientFieldsLiveRegion && window.accessibilityStrings.recipientFormCollapsed) {
            this.recipientFieldsLiveRegion.innerText = window.accessibilityStrings.recipientFormCollapsed;
          }
        }
      });
      __publicField(this, "clearInputFields", () => {
        each(this.inputFields, (field) => {
          if (field) {
            field.value = "";
          }
        });
      });
      __publicField(this, "enableInputFields", () => {
        each(this.disableableFields, (field) => {
          if (field) {
            field.disabled = false;
          }
        });
      });
      __publicField(this, "disableInputFields", () => {
        each(this.disableableFields, (field) => {
          if (field) {
            field.disabled = true;
          }
        });
      });
      __publicField(this, "resetRecipientForm", () => {
        var _a2;
        if ((_a2 = this.checkboxInput) == null ? void 0 : _a2.checked) {
          this.checkboxInput.checked = false;
          this.handleChange();
          attrBoolean.set(this, "xo-error", false);
        }
      });
      __publicField(this, "setCurrentVariantId", () => {
        const { xoSectionId, xoProductId } = this.productEl.getOptions();
        const variantId = getVariantId(xoSectionId, xoProductId);
        this.currentProductVariantId = variantId;
      });
      __publicField(this, "handleFieldsChange", (event) => {
        const currentField = event.target;
        const { name, value } = currentField;
        setRecipientState(name, value);
      });
      __publicField(this, "bindFieldChange", () => {
        each(this.inputFields, (field) => {
          if (field) {
            field.addEventListener("input", this.handleFieldsChange);
          }
        });
      });
      this.recipientFieldsLiveRegion = this.querySelector(`#Recipient-fields-live-region-${this.dataset.sectionId}`);
      if (this.checkboxInput) {
        this.checkboxInput.disabled = false;
      }
      if (this.hiddenControlField) {
        this.hiddenControlField.disabled = true;
      }
      if (this.offsetProperty) {
        this.offsetProperty.value = new Date().getTimezoneOffset().toString();
      }
    }
    get productEl() {
      return this.closest(WebComponent.Product);
    }
    get inputFields() {
      return [this.emailInput, this.nameInput, this.messageInput, this.sendonInput];
    }
    get disableableFields() {
      return [...this.inputFields, this.offsetProperty];
    }
    onConnected() {
      if (!this.productEl) {
        throw new Error(`${WebComponent.ProductRecipientForm} must be in ${WebComponent.Product}`);
      }
      this.bindFieldChange();
      this.handleChange();
      this.addEventListener("change", this.handleChange);
      this.setCurrentVariantId();
      locationEvent.off(eventId$1);
      eventId$1 = locationEvent.on("change", this.setCurrentVariantId);
      this.unsubscribe = subscribe.cart(({ isAdded, variantId, addErrorMessage }) => {
        if (addErrorMessage) {
          const errorEl = this.querySelector(WebComponent.ProductRecipientFormError);
          if (errorEl) {
            errorEl.innerText = addErrorMessage;
            attrBoolean.set(this, "xo-error", true);
          }
        }
        if (isAdded && variantId === this.currentProductVariantId) {
          this.resetRecipientForm();
        }
      });
    }
    disconnectedCallback() {
      this.removeEventListener("change", this.handleChange);
      locationEvent.off(eventId$1);
      this.unsubscribe();
    }
  }
  const RELATED = "intent=related";
  class ProductRecommendations extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "handleIntersection", async (entries, observer2) => {
        var _a2;
        try {
          if (!entries[0].isIntersecting) {
            return;
          }
          observer2.unobserve(this);
          const { xoUrl } = this.options;
          const res = await fetch(xoUrl);
          const text = await res.text();
          const html = document.createElement("div");
          html.innerHTML = text;
          const recommendations = html.querySelector(WebComponent.ProductRecommendations);
          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;
            const productsCountEls = (_a2 = this.closest('[id^="shopify-section-template--"]')) == null ? void 0 : _a2.querySelectorAll("[xo-products-count]");
            productsCountEls == null ? void 0 : productsCountEls.forEach((productsCountEl, index) => {
              const nextProductsCountEl = html.querySelectorAll("[xo-products-count]")[index];
              productsCountEl.setAttribute("xo-products-count", `${nextProductsCountEl.getAttribute("xo-products-count")}`);
            });
            const animateEls = Array.from(this.querySelectorAll('[xo-animate="scroll"]'));
            each(animateEls, (animateEl) => {
              attrBoolean.set(animateEl, "xo-visible", true);
            });
            setHoverLevel(this);
          } else {
            if (window.Xotiny) {
              if (xoUrl.endsWith(RELATED)) {
                const sectionEl = this.closest('[id^="shopify-section-template--"]');
                sectionEl == null ? void 0 : sectionEl.remove();
              }
            } else {
              const sectionEl = this.closest("[data-xb-section-id]");
              sectionEl == null ? void 0 : sectionEl.remove();
            }
          }
        } catch (e) {
          console.error(e);
        }
      });
    }
    get options() {
      const options = getAttrs(this, {
        pick: ["xoUrl"],
        types: {
          xoUrl: "string"
        }
      });
      return options;
    }
    onConnected() {
      var _a2;
      if ((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode) {
        return;
      }
      new IntersectionObserver(this.handleIntersection, { rootMargin: "0px 0px 800px 0px" }).observe(this);
    }
  }
  let Product = (_u = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "debounce", createDebounce());
      __publicField(this, "prevStatus", "idle");
      __publicField(this, "prevNewProductHtml", "");
      __publicField(this, "controller", new AbortController());
      __publicField(this, "handleChange", this.debounce((status, productHtml, url) => {
        const { isCombineListing } = getState.product();
        const domParser = new DOMParser();
        if (isCombineListing && this.querySelector("[xo-connected-product-url]")) {
          const doc2 = domParser.parseFromString(productHtml, "text/html");
          setHoverLevel(doc2);
          const newProductEl = doc2.querySelector(`${WebComponent.Product}[xo-product-information], ${WebComponent.Product}[xo-featured-product]`);
          if (newProductEl) {
            if (this.prevNewProductHtml !== newProductEl.innerHTML) {
              this.innerHTML = newProductEl.innerHTML;
              this.prevNewProductHtml = newProductEl.innerHTML;
              queueMicrotask(() => {
                const productVariantsEl = this.querySelector(WebComponent.ProductVariants);
                if (productVariantsEl) {
                  productVariantsEl.setProductStatus();
                }
              });
            }
            this.setAttribute("xo-selected-or-first-available-variant-id", newProductEl.getAttribute("xo-selected-or-first-available-variant-id"));
          }
          return;
        }
        const willChangeEls = Array.from(this.querySelectorAll(WebComponent.ProductWillChange));
        const doc = domParser.parseFromString(productHtml, "text/html");
        setHoverLevel(doc);
        const nextWillChangeEls = Array.from(doc.querySelectorAll(url ? `${WebComponent.Product}[xo-featured-product][xo-product-url="${url}"] ${WebComponent.ProductWillChange}` : `${WebComponent.Product}[xo-product-information] ${WebComponent.ProductWillChange}`));
        if (!nextWillChangeEls.length) {
          return;
        }
        const featured = !!url;
        each(willChangeEls, (willChangeEl, index) => {
          var _a2, _b2;
          const uid2 = willChangeEl.getAttribute("xo-unique-id");
          let newProductWillChangeEl = null;
          if (featured) {
            if (uid2) {
              newProductWillChangeEl = doc.querySelector(`${WebComponent.Product}[xo-featured-product][xo-product-url="${url}"] ${WebComponent.ProductWillChange}[xo-unique-id="${escapeValue(uid2)}"]`);
            } else {
              newProductWillChangeEl = doc.querySelectorAll(`${WebComponent.Product}[xo-featured-product][xo-product-url="${url}"] ${WebComponent.ProductWillChange}`)[index];
            }
          } else {
            if (uid2) {
              newProductWillChangeEl = doc.querySelector(`${WebComponent.ProductWillChange}[xo-unique-id="${escapeValue(uid2)}"]`);
            } else {
              newProductWillChangeEl = doc.querySelectorAll(`${WebComponent.ProductWillChange}`)[index];
            }
          }
          const { xoProductUrl, xoSectionId } = this.props;
          const xoNewProductUrl = (_a2 = newProductWillChangeEl == null ? void 0 : newProductWillChangeEl.closest(WebComponent.Product)) == null ? void 0 : _a2.getAttribute("xo-product-url");
          const xoNewProductSectionId = (_b2 = newProductWillChangeEl == null ? void 0 : newProductWillChangeEl.closest(WebComponent.Product)) == null ? void 0 : _b2.getAttribute("xo-section-id");
          let cond = newProductWillChangeEl && willChangeEl.innerHTML !== newProductWillChangeEl.innerHTML && status === "success";
          if (featured) {
            cond = cond && xoProductUrl === xoNewProductUrl && xoSectionId === xoNewProductSectionId;
          }
          if (cond) {
            const buyItNowEl = willChangeEl.querySelector('[data-shopify="payment-button"]');
            const disabled = attrBoolean.get(newProductWillChangeEl, "xo-disabled");
            attrBoolean.set(willChangeEl, "xo-disabled", disabled);
            if (disabled) {
              buyItNowEl == null ? void 0 : buyItNowEl.addEventListener("click", (event) => {
                event.preventDefault();
              }, { signal: this.controller.signal });
              return;
            }
            if (!buyItNowEl) {
              const selector = willChangeEl.getAttribute("xo-morph-selector");
              if (selector) {
                const els = willChangeEl.querySelectorAll(selector);
                const newEls = newProductWillChangeEl.querySelectorAll(selector);
                els.forEach((el, index2) => {
                  var _a3;
                  const newEl = newEls[index2];
                  const newHTML = (_a3 = newEl == null ? void 0 : newEl.innerHTML) != null ? _a3 : "";
                  if (el.innerHTML !== newHTML) {
                    el.innerHTML = newHTML;
                  }
                });
              } else {
                willChangeEl.innerHTML = newProductWillChangeEl.innerHTML;
              }
            }
          }
        });
      }, 0));
    }
    getOptions() {
      return this.getProps();
    }
    mount() {
      var _a2, _b2;
      const { xoProductId, xoSectionId, xoSelectedOrFirstAvailableVariantId } = this.props;
      if (!xoProductId) {
        throw new Error(`${WebComponent.Product}: Attribute xo-product-id is required.`);
      }
      if (!xoSectionId) {
        throw new Error(`${WebComponent.Product}: Attribute xo-section-id is required.`);
      }
      const id2 = getId(xoSectionId, xoProductId);
      if (xoSelectedOrFirstAvailableVariantId && !((_b2 = (_a2 = getState.cartForm()) == null ? void 0 : _a2[id2]) == null ? void 0 : _b2.variantId)) {
        setVariantId(xoSectionId, xoProductId, xoSelectedOrFirstAvailableVariantId);
      }
      this.unsubscribe = subscribe.product(({ status, productHtml, featuredProductHtmls, quickviewProductHtml, quickviewTriggerEl }) => {
        var _a3, _b3;
        const { xoProductUrl } = this.props;
        if (status !== "success" && this.prevStatus === status) {
          return;
        }
        const productType = getProductType(this);
        if (productType === "default") {
          return;
        }
        switch (productType) {
          case "featured": {
            const featuredProductHtml = featuredProductHtmls[xoSectionId];
            this.handleChange(status, featuredProductHtml, xoProductUrl);
            break;
          }
          case "quickview": {
            const productTriggerEl = quickviewTriggerEl == null ? void 0 : quickviewTriggerEl.closest(WebComponent.Product);
            const xoName = (_a3 = productTriggerEl == null ? void 0 : productTriggerEl.getAttribute("xo-name")) != null ? _a3 : QUICKVIEW_NAME;
            const finalProductHtml = (_b3 = quickviewProductHtml[xoName]) != null ? _b3 : "";
            this.handleChange(status, finalProductHtml);
            break;
          }
          case "information": {
            this.handleChange(status, productHtml);
            break;
          }
        }
        this.prevStatus = status;
      });
    }
    unmount() {
      this.unsubscribe();
      this.controller.abort();
      this.debounce.cancel();
    }
  }, __publicField(_u, "propTypes", {
    xoProductId: "string",
    xoSectionId: "string",
    xoSelectedOrFirstAvailableVariantId: "string",
    xoProductInformation: "boolean",
    xoFeaturedProduct: "boolean",
    xoProductUrl: "string",
    xoCartExclude: "boolean",
    xoLine: "number"
  }), _u);
  Product = __decorate([
    customElements$1(WebComponent.Product)
  ], Product);
  const ANIMATE_DURATION = 300;
  const MOVE_THROTTLE = 50;
  let ProductMedia = (_v = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "state", {
        isHover: false,
        carouselNextContent: "",
        carouselPrevContent: ""
      });
      __publicField(this, "productEl", this.closest(WebComponent.Product));
      __publicField(this, "lastMoveTime", 0);
      __publicField(this, "intersectionObserver", null);
      __publicField(this, "contentEl", null);
      __publicField(this, "media");
      __publicField(this, "delayCancel", () => {
      });
      __publicField(this, "cancel2", () => {
      });
      __publicField(this, "renderCarousel", () => {
        if (!this.media) {
          return "";
        }
        const { xoCarouselAutoplay, xoCarouselType, xoImageLazyloadOverlayContent, xoCarouselPaginationEnabled, xoCarouselBulletContent, xoCarouselActiveIndex, xoCarouselDynamicBulletsEnabled, xoCarouselDynamicBulletsPerView } = this.props;
        const { carouselNextContent, carouselPrevContent } = this.state;
        const hasNavigation = carouselNextContent && carouselPrevContent;
        const images = this.media.filter((media) => media.media_type === "image");
        if (images.length <= 1) {
          return "";
        }
        return `
      <xo-carousel xo-product-media-content xo-type="${xoCarouselType}" xo-active-index="${xoCarouselActiveIndex}" xo-rewind xo-speed="600" xo-autoplay="${xoCarouselAutoplay}" xo-render-bullet="${xoCarouselBulletContent}" xo-dragable="false">
        <xo-carousel-inner style="height: 100%">
          <xo-carousel-list>
            ${images.map((image) => {
          var _a2;
          return `
                <xo-carousel-slide xo-active-binding="[xo-product-media-slide-active]">
                  <div style="position: relative"><img is="xo-lazyload" src="${imageUrl(image.src, { width: 100 })}" alt="${(_a2 = image.alt) != null ? _a2 : ""}" /><div class="xo-lazyload-overlay">${xoImageLazyloadOverlayContent}</div></div>
                </xo-carousel-slide>
              `;
        }).join("")}
          </xo-carousel-list>
        </xo-carousel-inner>
        ${hasNavigation ? `<xo-carousel-prev style="opacity: 0">${carouselPrevContent}</xo-carousel-prev><xo-carousel-next style="opacity: 0">${carouselNextContent}</xo-carousel-next>` : ""}
        ${xoCarouselPaginationEnabled ? xoCarouselDynamicBulletsEnabled ? `<xo-carousel-dynamic-bullets xo-per-view="${xoCarouselDynamicBulletsPerView}"><xo-carousel-pagination></xo-carousel-pagination></xo-carousel-dynamic-bullets>` : `<xo-carousel-pagination></xo-carousel-pagination>` : ""}
      </xo-carousel>
    `;
      });
      __publicField(this, "renderVideo", () => {
        var _a2;
        if (!this.media) {
          return "";
        }
        if (this.contentEl) {
          return "";
        }
        const videoMedia = (_a2 = this.media.filter((media) => media.media_type === "video")) == null ? void 0 : _a2[0];
        const videoMp4Arr = videoMedia.sources.filter((source) => source.format === "mp4");
        const video = videoMp4Arr.reduce((acc, source) => {
          if (source.width > acc.maxWidth) {
            return {
              url: source.url,
              maxWidth: source.width
            };
          }
          return acc;
        }, { url: "", maxWidth: 0 }).url;
        if (!video) {
          return "";
        }
        return `
      <xo-video-cover xo-product-media-content xo-src="${video}" style="opacity: 0"></xo-video-cover>
    `;
      });
      __publicField(this, "handleNextElementHide", async () => {
        const { xoCarouselAutoplay } = this.props;
        this.delayCancel = await delay(xoCarouselAutoplay + 100 || ANIMATE_DURATION);
        const { isHover } = this.state;
        if (isHover) {
          const nextEls = Array.from(this.querySelectorAll("[xo-product-media-content] ~ *"));
          each(nextEls, (nextEl) => {
            attrBoolean.set(nextEl, "xo-hidden", true);
          });
        }
      });
      __publicField(this, "handleNextElementShow", () => {
        const nextEls = Array.from(this.querySelectorAll("[xo-product-media-content] ~ *"));
        each(nextEls, (el) => {
          attrBoolean.set(el, "xo-hidden", false);
        });
      });
      __publicField(this, "getType", () => {
        var _a2;
        const { xoType } = this.props;
        if (xoType === "carousel") {
          return "carousel";
        } else if (xoType === "video") {
          return "video";
        } else {
          const hasVideoMedia = !!((_a2 = this.media) == null ? void 0 : _a2.some((media) => media.media_type === "video"));
          if (hasVideoMedia) {
            return "video";
          }
          return "carousel";
        }
      });
      __publicField(this, "handleMouseMove", async () => {
        var _a2, _b2, _c2, _d2, _e2, _f2;
        const now = performance.now();
        if (now - this.lastMoveTime < MOVE_THROTTLE) {
          return;
        }
        this.lastMoveTime = now;
        if (this.state.isHover) {
          return;
        }
        const draggingEl = this.closest(`[xo-dragging]`);
        if (draggingEl) {
          return;
        }
        const type = this.getType();
        this.setState({ isHover: true });
        if (type === "carousel") {
          this.delayCancel();
          if (!this.contentEl) {
            const carousel = this.renderCarousel();
            this.insertAdjacentHTML("afterbegin", carousel);
            this.contentEl = this.querySelector("[xo-product-media-content]");
            (_a2 = this.contentEl) == null ? void 0 : _a2.addEventListener("xo:carousel:init", this.handleNextElementHide);
          }
          (_b2 = this.contentEl) == null ? void 0 : _b2.style.setProperty("opacity", "1");
          await delay(ANIMATE_DURATION);
          (_c2 = this.getCarouselListEl()) == null ? void 0 : _c2.play();
          const nextEl = (_d2 = this.contentEl) == null ? void 0 : _d2.querySelector(WebComponent.CarouselNext);
          const prevEl = (_e2 = this.contentEl) == null ? void 0 : _e2.querySelector(WebComponent.CarouselPrev);
          if (nextEl && prevEl) {
            nextEl.style.opacity = "1";
            prevEl.style.opacity = "1";
          }
        } else {
          if (!this.contentEl) {
            this.insertAdjacentHTML("afterbegin", this.renderVideo());
            this.contentEl = this.querySelector("[xo-product-media-content]");
          }
          (_f2 = this.contentEl) == null ? void 0 : _f2.style.setProperty("opacity", "1");
          const videoEl = this.contentEl.querySelector("video");
          if (videoEl) {
            videoEl.autoplay = true;
            videoEl.play();
          }
        }
      });
      __publicField(this, "getCarouselListEl", () => {
        var _a2;
        return (_a2 = this.contentEl) == null ? void 0 : _a2.querySelector(WebComponent.CarouselList);
      });
      __publicField(this, "handleMouseLeave", () => {
        var _a2, _b2;
        this.setState({ isHover: false });
        this.handleNextElementShow();
        this.delayCancel();
        this.cancel2();
        if (this.contentEl) {
          this.contentEl.removeEventListener("xo:carousel:init", this.handleNextElementHide);
          (_a2 = this.contentEl) == null ? void 0 : _a2.style.setProperty("opacity", "0");
          (_b2 = this.getCarouselListEl()) == null ? void 0 : _b2.pause();
          const videoEl = this.contentEl.querySelector("video");
          if (videoEl) {
            videoEl.autoplay = false;
            videoEl.pause();
          }
        }
      });
      __publicField(this, "setMedia", () => {
        var _a2;
        if (!this.productEl) {
          return;
        }
        const textContent = ((_a2 = this.productEl.querySelector("template")) == null ? void 0 : _a2.content.textContent) || this.textContent;
        const data = objectParse(textContent);
        if (data.media) {
          this.media = data.media;
        }
      });
    }
    async mount() {
      var _a2, _b2;
      const { xoMobileEnabled } = this.props;
      if (device.mobile() && !xoMobileEnabled) {
        return;
      }
      this.cancel2 = await delay();
      if (!this.productEl) {
        throw new Error(`${WebComponent.ProductMedia} must be in ${WebComponent.Product}`);
      }
      const { xoTargetSelector } = this.props;
      this.setMedia();
      const targetEl = xoTargetSelector ? this.querySelector(xoTargetSelector) : this;
      const finalTargetEl = targetEl != null ? targetEl : this;
      if (device.mobile()) {
        if (!xoMobileEnabled) {
          return;
        }
        this.intersectionObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.handleMouseMove();
            } else {
              this.handleMouseLeave();
            }
          });
        });
        this.intersectionObserver.observe(this);
      } else {
        finalTargetEl.addEventListener("mousemove", this.handleMouseMove);
        finalTargetEl.addEventListener("mouseleave", this.handleMouseLeave);
      }
      this.setState({
        carouselNextContent: (_a2 = this.props.xoCarouselNextContent) != null ? _a2 : "",
        carouselPrevContent: (_b2 = this.props.xoCarouselPrevContent) != null ? _b2 : ""
      });
      this.setProps({
        xoCarouselNextContent: void 0,
        xoCarouselPrevContent: void 0
      });
    }
    unmount() {
      var _a2, _b2;
      const { xoTargetSelector } = this.props;
      const targetEl = xoTargetSelector ? this.querySelector(xoTargetSelector) : this;
      const finalTargetEl = targetEl != null ? targetEl : this;
      this.handleNextElementShow();
      this.delayCancel();
      this.cancel2();
      finalTargetEl.removeEventListener("mousemove", this.handleMouseMove);
      finalTargetEl.removeEventListener("mouseleave", this.handleMouseLeave);
      (_a2 = this.contentEl) == null ? void 0 : _a2.removeEventListener("xo:carousel:init", this.handleNextElementHide);
      (_b2 = this.intersectionObserver) == null ? void 0 : _b2.disconnect();
      this.intersectionObserver = null;
    }
  }, __publicField(_v, "propTypes", {
    xoType: "string",
    xoTargetSelector: "string",
    xoCarouselAutoplay: "number",
    xoCarouselPrevContent: "string",
    xoCarouselNextContent: "string",
    xoCarouselType: "string",
    xoCarouselPaginationEnabled: "boolean",
    xoCarouselBulletContent: "string",
    xoCarouselActiveIndex: "number",
    xoCarouselDynamicBulletsEnabled: "boolean",
    xoCarouselDynamicBulletsPerView: "number",
    xoRtl: "boolean",
    xoImageLazyloadOverlayContent: "string",
    xoMobileEnabled: "boolean"
  }), __publicField(_v, "defaultProps", {
    xoType: "carousel",
    xoTargetSelector: "",
    xoCarouselAutoplay: 1500,
    xoCarouselPrevContent: "",
    xoCarouselNextContent: "",
    xoCarouselType: "fade",
    xoCarouselPaginationEnabled: false,
    xoCarouselBulletContent: "<span></span>",
    xoCarouselActiveIndex: 1,
    xoCarouselDynamicBulletsEnabled: false,
    xoCarouselDynamicBulletsPerView: 3,
    xoRtl: document.dir === "rtl",
    xoImageLazyloadOverlayContent: "",
    xoMobileEnabled: true
  }), _v);
  ProductMedia = __decorate([
    customElements$1(WebComponent.ProductMedia)
  ], ProductMedia);
  const FROM = 0;
  const TO = 100;
  let CartFly = (_w = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "animated", createAnimate());
      __publicField(this, "handleAnimate", (target, cartFlyEndEl) => (value) => {
        const { top: targetTop, left: targetLeft } = offset(target);
        const { width: targetWidth, height: targetHeight } = target.getBoundingClientRect();
        const { top, left } = offset(cartFlyEndEl);
        const { width, height } = cartFlyEndEl.getBoundingClientRect();
        const finalTop = interpolate({
          inputRange: [FROM, TO],
          outputRange: [targetTop, top],
          easing: (t) => {
            const c1 = -3;
            const c3 = c1 + 1;
            return c3 * t * t * t - c1 * t * t;
          },
          value
        });
        const finalLeft = interpolate({
          inputRange: [FROM, TO],
          outputRange: [targetLeft, left],
          value
        });
        const finalWidth = interpolate({
          inputRange: [FROM, TO],
          outputRange: [targetWidth, width],
          value
        });
        const finalHeight = interpolate({
          inputRange: [FROM, TO],
          outputRange: [targetHeight, height],
          value
        });
        this.style.top = `${finalTop}px`;
        this.style.left = `${finalLeft}px`;
        this.style.width = `${finalWidth}px`;
        this.style.height = `${finalHeight}px`;
      });
      __publicField(this, "handle", (target) => {
        const { xoSpeed, xoEasing } = this.props;
        const cartFlyEndEl = document.querySelector("[xo-cart-fly-end]");
        if (cartFlyEndEl) {
          this.style.display = "block";
          this.animated({
            from: FROM,
            to: TO,
            duration: xoSpeed,
            easing: easings[xoEasing],
            onUpdate: this.handleAnimate(target, cartFlyEndEl),
            onEnd: () => {
              this.style.removeProperty("display");
            }
          });
        }
      });
    }
    mount() {
      this.unsubscribe = subscribe.cart((state) => {
        var _a2, _b2;
        let src = "";
        if (state.item) {
          src = (_a2 = state.item) == null ? void 0 : _a2.featured_image.src;
        } else if (state.items && state.items.length > 0) {
          src = (_b2 = state.items[0]) == null ? void 0 : _b2.featured_image.src;
        }
        if (src) {
          this.style.setProperty("--product-featured-image", `url('${imageUrl(src, { width: 300 })}')`);
        }
      });
    }
    unmount() {
      this.unsubscribe();
    }
  }, __publicField(_w, "propTypes", {
    xoSpeed: "number",
    xoEasing: "string"
  }), __publicField(_w, "defaultProps", {
    xoSpeed: 1e3,
    xoEasing: "ease"
  }), _w);
  CartFly = __decorate([
    customElements$1(WebComponent.CartFly)
  ], CartFly);
  let BundleProvider = (_x = class extends XoComponent {
  }, __publicField(_x, "propTypes", {
    xoName: "string",
    xoDiscounts: "array",
    xoCombineByQuantity: "boolean"
  }), __publicField(_x, "defaultProps", {
    xoDiscounts: [],
    xoCombineByQuantity: true
  }), _x);
  BundleProvider = __decorate([
    customElements$1(WebComponent.BundleProvider)
  ], BundleProvider);
  let BundleContent = (_y = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "providerEl", this.closest(WebComponent.BundleProvider));
      __publicField(this, "unsubscribe", () => {
      });
    }
    mount() {
      if (!this.providerEl) {
        throw new Error(`${WebComponent.BundleContent} must be a child of ${WebComponent.BundleProvider}}`);
      }
      const { xoName } = this.providerEl.props;
      const { xoGroup: xoGroup2 } = this.props;
      this.unsubscribe = subscribe.bundle(({ bundles }) => {
        var _a2, _b2;
        const bundle = (_b2 = xoGroup2 ? (_a2 = bundles[xoName]) == null ? void 0 : _a2.filter((item) => item.group === xoGroup2) : bundles[xoName]) != null ? _b2 : [];
        this.setState({ bundle });
        this.setProps({ xoEmpty: bundle.length === 0 });
      }, (prev2, next2) => {
        return (prev2 == null ? void 0 : prev2.observed) === (next2 == null ? void 0 : next2.observed);
      });
    }
    stateUpdate() {
      const { bundle } = this.state;
      this.innerHTML = bundle.map((item) => item.html).join("");
    }
    unmount() {
      this.unsubscribe();
    }
  }, __publicField(_y, "propTypes", {
    xoGroup: "string",
    xoEmpty: "boolean"
  }), _y);
  BundleContent = __decorate([
    customElements$1(WebComponent.BundleContent)
  ], BundleContent);
  let BundleAdd = (_z = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "state", {
        prevVariantId: ""
      });
      __publicField(this, "toggle", false);
      __publicField(this, "triggerProductEl", null);
      __publicField(this, "productEl", this.closest(WebComponent.Product));
      __publicField(this, "providerEl", this.closest(WebComponent.BundleProvider));
      __publicField(this, "quickViewEl", this.closest(WebComponent.ProductQuickView));
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "getBundleTemplateEl", () => {
        return (this.triggerProductEl || this.productEl).querySelector(`template[${BUNDLE_CARD_ITEM_ATTR}]`);
      });
      __publicField(this, "getBundlePropTemplateEl", () => {
        return this.providerEl.querySelector(`template[${BUNDLE_PROP_ATTR}]`);
      });
      __publicField(this, "addBundleItem", (bundleUI, variantId, priceFinal, properties, quantity) => {
        var _a2, _b2, _c2, _d2;
        const xoName = ((_a2 = this.providerEl) == null ? void 0 : _a2.props.xoName) || ((_b2 = this.quickViewEl) == null ? void 0 : _b2.getAttribute("xo-bundle-name"));
        if (!xoName) {
          return;
        }
        const xoCombineByQuantity = (_d2 = (_c2 = this.providerEl) == null ? void 0 : _c2.props.xoCombineByQuantity) != null ? _d2 : true;
        const { xoGroup: xoGroup2 } = this.props;
        const { xoProductId } = this.productEl.getOptions();
        const id2 = uid();
        const doc = new DOMParser().parseFromString(bundleUI, "text/html");
        const bundleRemoveEl = doc.querySelector(WebComponent.BundleRemove);
        if (bundleRemoveEl) {
          bundleRemoveEl.setAttribute("xo-id", id2);
        }
        if (!xoCombineByQuantity) {
          const cartQuantityEl = doc.querySelector(WebComponent.CartQuantity);
          cartQuantityEl == null ? void 0 : cartQuantityEl.remove();
        }
        addBundleItem(xoName, xoCombineByQuantity, {
          id: id2,
          group: xoGroup2,
          variantId,
          html: doc.body.innerHTML,
          productId: xoProductId,
          productPrice: priceFinal,
          quantity,
          trigger: this,
          properties
        });
      });
      __publicField(this, "handleClick", (event) => {
        var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
        const xoName = ((_a2 = this.providerEl) == null ? void 0 : _a2.props.xoName) || ((_b2 = this.quickViewEl) == null ? void 0 : _b2.getAttribute("xo-bundle-name"));
        const xoCombineByQuantity = (_d2 = (_c2 = this.providerEl) == null ? void 0 : _c2.props.xoCombineByQuantity) != null ? _d2 : true;
        if (!xoName) {
          return;
        }
        if (this.quickViewEl) {
          this.providerEl = this.quickViewEl.bundleProviderEl;
          this.triggerProductEl = this.quickViewEl.triggerProductEl;
        }
        const { xoVariantId } = this.props;
        const { xoProductId, xoSectionId } = this.productEl.getOptions();
        const variantId = xoVariantId || getVariantId(xoSectionId, xoProductId).toString();
        const properties = getProductProperties(this.closest(WebComponent.Product));
        const templateEl = this.getBundleTemplateEl();
        const bundlePropTemplateEl = this.getBundlePropTemplateEl();
        const price = templateEl == null ? void 0 : templateEl.getAttribute(BUNDLE_CARD_PRICE_ATTR);
        const quantityEl = templateEl == null ? void 0 : templateEl.content.querySelector(WebComponent.CartQuantity);
        const removeEl = templateEl == null ? void 0 : templateEl.content.querySelector(WebComponent.BundleRemove);
        const propertiesEl = templateEl == null ? void 0 : templateEl.content.querySelector(WebComponent.BundleProperties);
        quantityEl == null ? void 0 : quantityEl.setAttribute("xo-variant-id", variantId);
        removeEl == null ? void 0 : removeEl.setAttribute("xo-variant-id", variantId);
        if (properties && bundlePropTemplateEl && propertiesEl) {
          propertiesEl.innerHTML = "";
          each(Object.entries(properties), ([key, value]) => {
            const label = key.replace(/properties\[|\]/g, "");
            const content = bundlePropTemplateEl.innerHTML.replace(/{\s*label\s*}/g, label).replace(/{\s*value\s*}/g, value);
            propertiesEl.insertAdjacentHTML("beforeend", content);
          });
        }
        const bundleUI = (_e2 = templateEl == null ? void 0 : templateEl.innerHTML) != null ? _e2 : "";
        if (price) {
          const priceFinal = Number(price);
          const quantity = Number((_g2 = (_f2 = this.productEl.querySelector(`${WebComponent.CartQuantity} input`)) == null ? void 0 : _f2.value) != null ? _g2 : "1");
          if (this.toggle && this.state.prevVariantId) {
            removeBundleItem(xoName, this.state.prevVariantId);
          }
          if (quantity > 1 && !xoCombineByQuantity) {
            range(0, quantity).forEach(() => {
              this.addBundleItem(bundleUI, variantId, priceFinal, properties, 1);
            });
          } else {
            this.addBundleItem(bundleUI, variantId, priceFinal, properties, quantity);
          }
          this.setState({ prevVariantId: variantId });
          if (!((_h2 = event.target) == null ? void 0 : _h2.closest(WebComponent.ModalTrigger))) {
            const modalEl = this.closest(WebComponent.Modal);
            const name = modalEl == null ? void 0 : modalEl.getAttribute("xo-name");
            if (name) {
              xoModal.close(name);
            }
          }
        }
      });
    }
    setTriggerProductEl(productEl) {
      this.triggerProductEl = productEl;
    }
    setProviderEl(providerEl) {
      this.providerEl = providerEl;
    }
    mount() {
      this.addEventListener("click", this.handleClick);
      this.unsubscribe = subscribe.bundle(async ({ bundles }) => {
        var _a2, _b2;
        if (this.quickViewEl) {
          await delay();
        }
        const xoName = ((_a2 = this.providerEl) == null ? void 0 : _a2.props.xoName) || ((_b2 = this.quickViewEl) == null ? void 0 : _b2.getAttribute("xo-bundle-name"));
        if (!xoName) {
          return;
        }
        const bundle = bundles[xoName];
        if (bundle) {
          const productEls = Array.from(this.providerEl.querySelectorAll(WebComponent.Product));
          each(productEls, (productEl) => {
            attrBoolean.set(productEl, "xo-bundle-added", false);
          });
          each(bundle, (bundleItem) => {
            var _a3;
            const productEl = (_a3 = bundleItem.trigger) == null ? void 0 : _a3.closest(WebComponent.Product);
            if (productEl) {
              attrBoolean.set(productEl, "xo-bundle-added", true);
            }
          });
        }
      });
    }
    unmount() {
      this.removeEventListener("click", this.handleClick);
      this.unsubscribe();
    }
  }, __publicField(_z, "propTypes", {
    xoGroup: "string",
    xoVariantId: "string"
  }), __publicField(_z, "defaultProps", {}), _z);
  BundleAdd = __decorate([
    customElements$1(WebComponent.BundleAdd)
  ], BundleAdd);
  let BundleRemove = (_A = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "state", {
        currentId: ""
      });
      __publicField(this, "productEl", this.closest(WebComponent.Product));
      __publicField(this, "providerEl", this.closest(WebComponent.BundleProvider));
      __publicField(this, "handleProductVariant", (productVariantEls) => {
        if (productVariantEls.length) {
          each(productVariantEls, (productVariantEl) => {
            const { xoSectionId, xoProductId } = productVariantEl.closest(WebComponent.Product).getOptions();
            const fieldEls = Array.from(productVariantEl.querySelectorAll('input[type="radio"], select'));
            productVariantEl == null ? void 0 : productVariantEl.bindAvailable();
            each(fieldEls, (fieldEl) => {
              const newName = fieldSignal.removeFieldSignal(fieldEl.name);
              setFormVariant(xoSectionId, xoProductId, newName, "");
              if (fieldEl instanceof HTMLInputElement) {
                fieldEl.checked = false;
              } else if (fieldEl instanceof HTMLSelectElement) {
                const optionEls = Array.from(fieldEl.querySelectorAll("option"));
                each(optionEls, (optionEl) => {
                  optionEl.selected = false;
                });
              }
            });
          });
        }
      });
      __publicField(this, "handleClick", () => {
        var _a2, _b2, _c2, _d2;
        const { xoName } = this.providerEl.props;
        const { xoAll } = this.props;
        const { currentId } = this.state;
        if (xoAll) {
          removeBundleAllItem(xoName);
          const productVariantEls = Array.from((_b2 = (_a2 = this.providerEl) == null ? void 0 : _a2.querySelectorAll(`${WebComponent.ProductVariant}[xo-add-to-bundle], ${WebComponent.ProductVariants}[xo-add-to-bundle]`)) != null ? _b2 : []);
          this.handleProductVariant(productVariantEls);
        } else {
          removeBundleItem(xoName, currentId);
          const productVariantEls = Array.from((_d2 = (_c2 = this.productEl) == null ? void 0 : _c2.querySelectorAll(`${WebComponent.ProductVariant}[xo-add-to-bundle], ${WebComponent.ProductVariants}[xo-add-to-bundle]`)) != null ? _d2 : []);
          this.handleProductVariant(productVariantEls);
        }
      });
    }
    mount() {
      if (!this.providerEl) {
        throw new Error(`${WebComponent.BundleRemove} must be a child of ${WebComponent.BundleProvider}}`);
      }
      const { xoId } = this.props;
      this.setState({ currentId: xoId });
      this.addEventListener("click", this.handleClick);
    }
    propUpdate({ name, nextProp }) {
      if (name === "xoId" && nextProp && typeof nextProp === "string") {
        this.setState({ currentId: nextProp });
      }
    }
    unmount() {
      this.removeEventListener("click", this.handleClick);
    }
  }, __publicField(_A, "propTypes", {
    xoVariantId: "string",
    xoId: "string",
    xoAll: "boolean"
  }), __publicField(_A, "observedProps", ["xoVariantId"]), _A);
  BundleRemove = __decorate([
    customElements$1(WebComponent.BundleRemove)
  ], BundleRemove);
  let BundlePrice = (_B = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "providerEl", this.closest(WebComponent.BundleProvider));
      __publicField(this, "unsubscribe", () => {
      });
    }
    mount() {
      if (!this.providerEl) {
        throw new Error(`${WebComponent.BundlePrice} must be a child of ${WebComponent.BundleProvider}}`);
      }
      const { xoCompareAtPrice } = this.props;
      const { xoDiscounts, xoName } = this.providerEl.props;
      const format = document.documentElement.getAttribute("xo-money-format");
      if (!format) {
        throw new Error('xo-money-format="{{ shop.money_format }}" attribute of <html> is required');
      }
      this.unsubscribe = subscribe.bundle(({ bundles }) => {
        var _a2;
        const bundle = combileBundle((_a2 = bundles[xoName]) != null ? _a2 : []);
        const totalPrice = bundle.reduce((total, item) => total + item.productPrice * item.quantity, 0);
        const quantity = bundle.reduce((total, item) => total + item.quantity, 0);
        const minQuantity = Math.min(...xoDiscounts.map(({ minQuantity: minQuantity2 }) => minQuantity2));
        if (xoCompareAtPrice) {
          if (quantity >= minQuantity) {
            const price = formatMoney(totalPrice, format);
            this.innerHTML = price;
            this.setProps({ xoHidden: false });
          } else {
            this.innerHTML = "";
            this.setProps({ xoHidden: true });
          }
        } else if (xoDiscounts.length) {
          if (quantity >= minQuantity) {
            const prices = xoDiscounts.map(({ type, value, minQuantity: minQuantity2 }) => {
              if (type === "percentage") {
                const percent = value;
                const compareAtPrice2 = bundle.reduce((total, item) => {
                  const result = total + getCompareAtPrice(item.productPrice, percent) * item.quantity;
                  return result;
                }, 0);
                const price3 = formatMoney(compareAtPrice2, format);
                return {
                  compare: compareAtPrice2,
                  minQuantity: minQuantity2,
                  price: price3
                };
              }
              const compareAtPrice = totalPrice - value * Number(window.Shopify.currency.rate);
              const price2 = formatMoney(compareAtPrice, format);
              return {
                compare: compareAtPrice,
                minQuantity: minQuantity2,
                price: price2
              };
            });
            const { price } = prices.filter((item) => quantity >= item.minQuantity).sort((a, b) => a.compare - b.compare)[0];
            this.innerHTML = price;
          } else {
            const price = formatMoney(totalPrice, format);
            this.innerHTML = price;
          }
        }
      });
    }
    unmount() {
      this.unsubscribe();
    }
  }, __publicField(_B, "propTypes", {
    xoCompareAtPrice: "boolean",
    xoHidden: "boolean"
  }), __publicField(_B, "defaultProps", {
    xoCompareAtPrice: false
  }), _B);
  BundlePrice = __decorate([
    customElements$1(WebComponent.BundlePrice)
  ], BundlePrice);
  let BundleSize = (_C = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "providerEl", this.closest(WebComponent.BundleProvider));
      __publicField(this, "unsubscribe", () => {
      });
    }
    mount() {
      if (!this.providerEl) {
        throw new Error(`${WebComponent.BundleSize} must be a child of ${WebComponent.BundleProvider}}`);
      }
      const { xoDiscounts, xoName } = this.providerEl.props;
      this.unsubscribe = subscribe.bundle(({ bundles }) => {
        var _a2;
        const bundle = (_a2 = bundles[xoName]) != null ? _a2 : [];
        const quantity = bundle.reduce((total, item) => total + item.quantity, 0);
        const minQuantity = Math.min(...xoDiscounts.map(({ minQuantity: minQuantity2 }) => minQuantity2));
        this.style.setProperty("--xo-size", `${quantity}`);
        this.setProps({ xoSize: quantity, xoQualified: quantity >= minQuantity });
      });
    }
    unmount() {
      this.unsubscribe();
    }
  }, __publicField(_C, "propTypes", {
    xoSize: "number",
    xoQualified: "boolean"
  }), __publicField(_C, "defaultProps", {
    xoSize: 0
  }), _C);
  BundleSize = __decorate([
    customElements$1(WebComponent.BundleSize)
  ], BundleSize);
  let BundlePlaceholder = (_D = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "providerEl", this.closest(WebComponent.BundleProvider));
      __publicField(this, "unsubscribe", () => {
      });
    }
    mount() {
      if (!this.providerEl) {
        throw new Error(`${WebComponent.BundlePlaceholder} must be a child of ${WebComponent.BundleProvider}}`);
      }
      const { xoDiscounts, xoName } = this.providerEl.props;
      const maxQuantity = Math.max(...xoDiscounts.map(({ minQuantity }) => minQuantity));
      const template = this.innerHTML;
      this.unsubscribe = subscribe.bundle(({ bundles }) => {
        var _a2;
        const bundle = (_a2 = bundles[xoName]) != null ? _a2 : [];
        this.innerHTML = range(0, maxQuantity - bundle.length).map(() => {
          return template;
        }).join("");
      });
    }
    unmount() {
      this.unsubscribe();
    }
  }, __publicField(_D, "propTypes", {}), __publicField(_D, "defaultProps", {}), _D);
  BundlePlaceholder = __decorate([
    customElements$1(WebComponent.BundlePlaceholder)
  ], BundlePlaceholder);
  let BundleProgress = (_E = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "providerEl", this.closest(WebComponent.BundleProvider));
      __publicField(this, "unsubscribe", () => {
      });
    }
    mount() {
      if (!this.providerEl) {
        throw new Error(`${WebComponent.BundleProgress} must be a child of ${WebComponent.BundleProvider}}`);
      }
      const { xoDiscounts, xoName } = this.providerEl.props;
      const minQuantity = Math.min(...xoDiscounts.map(({ minQuantity: minQuantity2 }) => minQuantity2));
      this.unsubscribe = subscribe.bundle(({ bundles }) => {
        var _a2;
        const bundle = (_a2 = bundles[xoName]) != null ? _a2 : [];
        const quantity = bundle.reduce((total, item) => total + item.quantity, 0);
        this.style.setProperty("--xo-x", `${Math.min(0, 100 * (quantity / minQuantity) - 100)}%`);
        this.setProps({ xoQualified: quantity >= minQuantity });
      });
    }
    unmount() {
      this.unsubscribe();
    }
  }, __publicField(_E, "propTypes", {
    xoQualified: "boolean"
  }), __publicField(_E, "defaultProps", {}), _E);
  BundleProgress = __decorate([
    customElements$1(WebComponent.BundleProgress)
  ], BundleProgress);
  let BundleStep = (_F = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "providerEl", this.closest(WebComponent.BundleProvider));
      __publicField(this, "unsubscribe", () => {
      });
    }
    mount() {
      if (!this.providerEl) {
        throw new Error(`${WebComponent.BundleStep} must be a child of ${WebComponent.BundleProvider}}`);
      }
      const { xoDiscounts, xoName } = this.providerEl.props;
      const { xoMinQuantity } = this.props;
      this.unsubscribe = subscribe.bundle(({ bundles }) => {
        var _a2, _b2, _c2;
        const bundle = (_a2 = bundles[xoName]) != null ? _a2 : [];
        const totalPrice = bundle.reduce((total, item) => total + item.productPrice * item.quantity, 0);
        const quantity = bundle.reduce((total, item) => total + item.quantity, 0);
        if (quantity > 0) {
          const temp = xoDiscounts.map(({ type, value, minQuantity }) => {
            if (type === "percentage") {
              const percent = value;
              const compareAtPrice2 = totalPrice - Math.floor(totalPrice * percent / 100);
              return {
                compare: compareAtPrice2,
                minQuantity
              };
            }
            const compareAtPrice = totalPrice - value;
            return {
              compare: compareAtPrice,
              minQuantity
            };
          });
          if (temp) {
            const minQuantity = (_c2 = (_b2 = temp.filter((item) => quantity >= item.minQuantity).sort((a, b) => a.compare - b.compare)) == null ? void 0 : _b2[0]) == null ? void 0 : _c2.minQuantity;
            this.setProps({ xoQualified: minQuantity === xoMinQuantity });
          }
        } else {
          this.setProps({ xoQualified: false });
        }
      });
    }
    unmount() {
      this.unsubscribe();
    }
  }, __publicField(_F, "propTypes", {
    xoMinQuantity: "number",
    xoQualified: "boolean"
  }), __publicField(_F, "defaultProps", {}), _F);
  BundleStep = __decorate([
    customElements$1(WebComponent.BundleStep)
  ], BundleStep);
  let CartQuantityTrigger = (_G = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "handleQuantity", () => {
        const { xoValue, xoChecked } = this.props;
        const { xoSectionId, xoProductId, xoLine } = this.productOptions;
        if (xoValue) {
          const valueToggle = xoChecked ? 1 : xoValue;
          setFormQuantity(xoSectionId, xoProductId, xoLine, () => valueToggle);
        }
      });
    }
    getProductEl() {
      return this.closest(WebComponent.Product);
    }
    get productOptions() {
      return this.getProductEl().getOptions();
    }
    async mount() {
      await delay();
      if (!this.getProductEl()) {
        console.error(`${WebComponent.CartQuantityTrigger} must be a child of ${WebComponent.Product}}`);
      }
      const { xoValue, xoChecked } = this.props;
      const { xoSectionId, xoProductId, xoLine } = this.productOptions;
      this.addEventListener("click", this.handleQuantity);
      this.unsubscribe = subscribe.cartForm((state) => {
        var _a2;
        const quantity = (_a2 = state == null ? void 0 : state[getId(xoSectionId, xoProductId, xoLine)]) == null ? void 0 : _a2.quantity;
        this.setProps({ xoChecked: quantity === xoValue });
      });
      if (xoChecked) {
        this.handleQuantity();
      }
    }
    unmount() {
      this.removeEventListener("click", this.handleQuantity);
      this.unsubscribe();
    }
  }, __publicField(_G, "propTypes", {
    xoValue: "number",
    xoDiscount: "object",
    xoChecked: "boolean"
  }), __publicField(_G, "defaultProps", {
    xoValue: 0,
    xoChecked: false
  }), _G);
  CartQuantityTrigger = __decorate([
    customElements$1(WebComponent.CartQuantityTrigger)
  ], CartQuantityTrigger);
  let PriceReduced = (_H = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "cartQuantityTriggerEl", this.closest(WebComponent.CartQuantityTrigger));
    }
    mount() {
      var _a2;
      const { xoPrice, xoQuantity, xoDiscount } = this.props;
      const triggerProps = (_a2 = this.cartQuantityTriggerEl) == null ? void 0 : _a2.props;
      const discount = xoDiscount != null ? xoDiscount : triggerProps == null ? void 0 : triggerProps.xoDiscount;
      const quantity = xoQuantity != null ? xoQuantity : triggerProps == null ? void 0 : triggerProps.xoValue;
      if (!discount || !quantity) {
        return;
      }
      const format = document.documentElement.getAttribute("xo-money-format");
      if (!format) {
        throw new Error('xo-money-format="{{ shop.money_format }}" attribute of <html> is required');
      }
      if (discount.type === "percentage") {
        const compareAtPrice = getCompareAtPrice(xoPrice / quantity, discount.value) * quantity;
        const price = formatMoney(compareAtPrice, format);
        this.innerHTML = price;
      } else {
        const compareAtPrice = xoPrice - discount.value * Number(window.Shopify.currency.rate);
        const price = formatMoney(compareAtPrice, format);
        this.innerHTML = price;
      }
    }
  }, __publicField(_H, "propTypes", {
    xoPrice: "number",
    xoQuantity: "number",
    xoDiscount: "object"
  }), _H);
  PriceReduced = __decorate([
    customElements$1(WebComponent.PriceReduced)
  ], PriceReduced);
  let ProductProperties = (_I = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "productEl", this.closest(WebComponent.Product));
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "handler", async () => {
        const { xoUrl } = this.props;
        if (!xoUrl) {
          return;
        }
        const productHtml = await services.getProductHtml(xoUrl);
        const doc = new DOMParser().parseFromString(productHtml, "text/html");
        const proprertyEls = Array.from(doc.querySelectorAll(WebComponent.ProductProperty));
        this.innerHTML = "";
        each(proprertyEls, (proprertyEl) => {
          this.appendChild(proprertyEl);
        });
      });
    }
    mount() {
      if (!this.productEl) {
        throw new Error(`${WebComponent.ProductProperty} must be in ${WebComponent.Product}`);
      }
      const toggleEl = this.closest(WebComponent.Toggle);
      const modalEl = this.closest(WebComponent.Modal);
      if (toggleEl) {
        const { xoName } = toggleEl.options;
        if (!xoName) {
          return;
        }
        this.unsubscribe = xoStore.subscribe("xo-toggle", ({ data }) => {
          var _a2;
          const isOpen = (_a2 = data[xoName]) == null ? void 0 : _a2.isOpen;
          if (isOpen) {
            this.handler();
          }
        });
      }
      if (modalEl) {
        const { xoName } = modalEl.options;
        if (!xoName) {
          return;
        }
        this.unsubscribe = xoStore.subscribe("xo-modal", ({ data }) => {
          var _a2;
          const isOpen = (_a2 = data[xoName]) == null ? void 0 : _a2.isOpen;
          if (isOpen) {
            this.handler();
          }
        });
      }
    }
    unmount() {
      this.unsubscribe();
    }
  }, __publicField(_I, "propTypes", {
    xoUrl: "string"
  }), _I);
  ProductProperties = __decorate([
    customElements$1(WebComponent.ProductProperties)
  ], ProductProperties);
  let ProductProperty = (_J = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "mutationObserver", null);
    }
    mount() {
      const fieldEls = Array.from(this.querySelectorAll(`input, select`));
      const productEl = this.closest(WebComponent.Product);
      if (!productEl) {
        throw new Error(`${WebComponent.ProductProperty} must be in ${WebComponent.Product}`);
      }
      this.mutationObserver = new MutationObserver(() => {
        stickyCartPropertySignal(this);
      });
      this.mutationObserver.observe(this, {
        childList: true,
        subtree: true
      });
      const formEl = productEl.querySelector(FORM_CART_ADD_SELECTOR_2);
      const formId = formEl == null ? void 0 : formEl.getAttribute("id");
      if (!formId) {
        return;
      }
      each(fieldEls, (fieldEl) => {
        fieldEl.setAttribute("form", formId);
      });
    }
    unmount() {
      var _a2;
      (_a2 = this.mutationObserver) == null ? void 0 : _a2.disconnect();
      this.mutationObserver = null;
    }
  }, __publicField(_J, "propTypes", {}), _J);
  ProductProperty = __decorate([
    customElements$1(WebComponent.ProductProperty)
  ], ProductProperty);
  let CartDiscount = (_K = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "setDiscountCodes", () => {
        const { xoDiscountErrorMessage, xoShippingErrorMessage } = this.props;
        setCartDiscountCodesAction(this);
        setCartDiscountMessages(xoDiscountErrorMessage, xoShippingErrorMessage);
      });
    }
    mount() {
      const inputEl = this.querySelector('input[type="text"][name="discount"]');
      if (!inputEl) {
        throw new Error(`${WebComponent.CartDiscount} must have a input element with name="discount"`);
      }
      this.setDiscountCodes();
    }
  }, __publicField(_K, "propTypes", {
    xoDiscountErrorMessage: "string",
    xoShippingErrorMessage: "string"
  }), _K);
  CartDiscount = __decorate([
    customElements$1(WebComponent.CartDiscount)
  ], CartDiscount);
  let CartDiscountSubmit = (_L = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "cartDiscountEl", null);
      __publicField(this, "handleClick", async (event) => {
        var _a2;
        event.preventDefault();
        const inputEl = this.cartDiscountEl.querySelector('input[type="text"][name="discount"]');
        const sectionId = (_a2 = this.closest(`${WebComponent.Cart}, ${WebComponent.CartMini}`)) == null ? void 0 : _a2.id;
        if (sectionId) {
          this.setProps({ xoLoading: true });
          appendCartDiscountCode(inputEl.value);
          await postCartDiscount(sectionId, true);
          this.setProps({ xoLoading: false });
          inputEl.value = "";
        }
      });
    }
    mount() {
      this.cartDiscountEl = this.closest(WebComponent.CartDiscount);
      if (!this.cartDiscountEl) {
        throw new Error(`${WebComponent.CartDiscountSubmit} must be inside ${WebComponent.CartDiscount}`);
      }
      this.addEventListener("click", this.handleClick);
    }
    unmount() {
      this.removeEventListener("click", this.handleClick);
    }
  }, __publicField(_L, "propTypes", {
    xoLoading: "boolean"
  }), _L);
  CartDiscountSubmit = __decorate([
    customElements$1(WebComponent.CartDiscountSubmit)
  ], CartDiscountSubmit);
  let CartDiscountRemove = (_M = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "cartDiscountEl", null);
      __publicField(this, "cartDiscountItemEl", null);
      __publicField(this, "handleClick", async () => {
        var _a2, _b2;
        const code = (_a2 = this.cartDiscountItemEl) == null ? void 0 : _a2.getAttribute("xo-discount-code");
        const sectionId = (_b2 = this.closest(`${WebComponent.Cart}, ${WebComponent.CartMini}`)) == null ? void 0 : _b2.id;
        if (code && sectionId && this.cartDiscountEl) {
          try {
            this.setProps({ xoLoading: true });
            setCartDiscountCodesAction(this.cartDiscountEl);
            await deleteCartDiscount(sectionId, code);
            this.setProps({ xoLoading: false });
          } catch {
            this.setProps({ xoLoading: false });
          }
        }
      });
    }
    mount() {
      this.cartDiscountEl = this.closest(WebComponent.CartDiscount);
      this.cartDiscountItemEl = this.closest(WebComponent.CartDiscountItem);
      if (!this.cartDiscountEl) {
        throw new Error(`${WebComponent.CartDiscountSubmit} must be inside ${WebComponent.CartDiscount}`);
      }
      if (!this.cartDiscountItemEl) {
        throw new Error(`${WebComponent.CartDiscountSubmit} must be inside ${WebComponent.CartDiscountItem}`);
      }
      this.addEventListener("click", this.handleClick);
    }
    unmount() {
      this.removeEventListener("click", this.handleClick);
    }
  }, __publicField(_M, "propTypes", {
    xoLoading: "boolean"
  }), _M);
  CartDiscountRemove = __decorate([
    customElements$1(WebComponent.CartDiscountRemove)
  ], CartDiscountRemove);
  let eventId = -1;
  let ProductVariants = (_N = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "state", {
        variantClicked: false
      });
      __publicField(this, "productEl", this.closest(WebComponent.Product));
      __publicField(this, "productWillChangeEl", this.querySelector(WebComponent.ProductWillChange));
      __publicField(this, "sectionEl", this.closest(".shopify-section"));
      __publicField(this, "controller", new AbortController());
      __publicField(this, "prevStatus", "idle");
      __publicField(this, "currentOptionValueId", "");
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "getBindingElements", (el, value) => {
        var _a2;
        if (value.includes(":")) {
          const values = value.split(":");
          if (values.length === 1) {
            return [el];
          }
          const selector = (_a2 = values == null ? void 0 : values[1]) == null ? void 0 : _a2.replace(/(\w|\])(\[)(.*)/g, "$1");
          if (!selector) {
            return [el];
          }
          return Array.from(el.querySelectorAll(selector));
        }
        return [el];
      });
      __publicField(this, "getBindingType", (value) => {
        const bindingType = value.replace(/.*:/g, "").includes("[") ? value.replace(/.*\[/g, "").replace(/\]/g, "").trim() : "children";
        return bindingType;
      });
      __publicField(this, "handleBindingAttr", () => {
        var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
        const quickviewTriggerEl = getState.product().quickviewTriggerEl;
        const outerProductEl = quickviewTriggerEl == null ? void 0 : quickviewTriggerEl.closest(WebComponent.Product);
        if (!outerProductEl) {
          return;
        }
        const textContent = (_e2 = (_d2 = (_b2 = (_a2 = this.productEl.querySelector(`${WebComponent.ProductQuickViewLiquidBinding} template`)) == null ? void 0 : _a2.content) == null ? void 0 : _b2.textContent) != null ? _d2 : (_c2 = this.productEl.querySelector(WebComponent.ProductQuickViewLiquidBinding)) == null ? void 0 : _c2.textContent) != null ? _e2 : "{}";
        const liquidBindingData = objectParse(textContent);
        const contentBindEls = [
          ...Array.from(outerProductEl.querySelectorAll(`[${BINDING_ATTR}]`)),
          ...Array.from((_h2 = (_g2 = (_f2 = outerProductEl.querySelector(`template[${BUNDLE_CARD_ITEM_ATTR}]`)) == null ? void 0 : _f2.content) == null ? void 0 : _g2.querySelectorAll(`[${BINDING_ATTR}]`)) != null ? _h2 : [])
        ];
        each(contentBindEls, (contentBindEl) => {
          const bindings = contentBindEl.getAttribute(BINDING_ATTR).split(",");
          each(bindings, (binding) => {
            const key = binding.replace(/(:|\[).*/g, "").trim();
            const elements = this.getBindingElements(contentBindEl, binding);
            const bindingType = this.getBindingType(binding);
            if (typeOf(liquidBindingData) === "object") {
              const newValue = liquidBindingData[key];
              if (newValue != null && newValue.trim() !== "") {
                each(elements, async (element) => {
                  if (bindingType === "children") {
                    element.innerHTML = newValue;
                    await delay(100);
                    loadImages(element);
                  } else {
                    element.setAttribute(bindingType, newValue);
                  }
                });
              }
            }
          });
        });
      });
      __publicField(this, "closePopover", (fieldEl) => {
        const popoverEl = fieldEl.closest(WebComponent.Popover);
        const productEl = popoverEl == null ? void 0 : popoverEl.querySelector(WebComponent.Product);
        if (popoverEl && !productEl) {
          const popoverName = popoverEl.getAttribute("xo-name");
          xoPopover.close(popoverName);
        }
      });
      __publicField(this, "getOptionValueIds", (productVariantEl) => {
        return getFieldEls(productVariantEl).reduce((acc, el) => {
          if (el instanceof HTMLInputElement) {
            if (el.checked) {
              const optionValueId = el.getAttribute("xo-option-value-id");
              return optionValueId ? [...acc, optionValueId] : acc;
            }
          } else if (el instanceof HTMLSelectElement) {
            const optionSelectedEl = el.querySelector("option:checked");
            if (optionSelectedEl) {
              const optionValueId = optionSelectedEl.getAttribute("xo-option-value-id");
              return optionValueId ? [...acc, optionValueId] : acc;
            }
          }
          return acc;
        }, []);
      });
      __publicField(this, "getVariantStatus", () => {
        let result = "available";
        for (const el of getFieldEls(this)) {
          if (el instanceof HTMLInputElement) {
            const unavailable = el.hasAttribute("xo-unavailable");
            if (el.checked && unavailable) {
              result = "unavailable";
              break;
            }
            const outOfStock = el.hasAttribute("xo-disabled");
            if (el.checked && outOfStock) {
              result = "out-of-stock";
              break;
            }
          } else if (el instanceof HTMLSelectElement) {
            const optionSelectedEl = el.querySelector("option:checked");
            const unavailable = optionSelectedEl == null ? void 0 : optionSelectedEl.hasAttribute("xo-unavailable");
            if (unavailable) {
              result = "unavailable";
              break;
            }
            const outOfStock = optionSelectedEl == null ? void 0 : optionSelectedEl.hasAttribute("xo-disabled");
            if (outOfStock) {
              result = "out-of-stock";
              break;
            }
          }
        }
        return result;
      });
      __publicField(this, "setProductStatus", () => {
        switch (this.getVariantStatus()) {
          case "unavailable":
            attrBoolean.set(this.productEl, "xo-unavailable", true);
            attrBoolean.set(this.productEl, "xo-disabled", false);
            break;
          case "out-of-stock":
            attrBoolean.set(this.productEl, "xo-disabled", true);
            attrBoolean.set(this.productEl, "xo-unavailable", false);
            break;
          case "available":
            attrBoolean.set(this.productEl, "xo-disabled", false);
            attrBoolean.set(this.productEl, "xo-unavailable", false);
            break;
        }
      });
      __publicField(this, "inputVariantIdChange", (variantId) => {
        const variantInputEls = Array.from(document.querySelectorAll(`${FORM_CART_ADD_SELECTOR} input[name="id"]`));
        each(variantInputEls, (variantInputEl) => {
          variantInputEl.value = variantId;
        });
      });
      __publicField(this, "getUrl", (url, isQuickview = false) => {
        const { xoSectionId } = this.productEl.getOptions();
        const optionValueIds = this.getOptionValueIds(this);
        const nextUrl = new URL(url);
        nextUrl.search = queryString.stringify({
          option_values: optionValueIds.join(","),
          section_id: isQuickview ? queryString.parse(nextUrl.search, true).section_id : xoSectionId
        });
        return nextUrl.href;
      });
      __publicField(this, "handleFeatured", (connectedProductUrl) => {
        const { xoProductUrl } = this.productEl.getOptions();
        const { search } = new URL(xoProductUrl);
        getProductHtml(this.getUrl(connectedProductUrl ? connectedProductUrl + search : xoProductUrl), true);
      });
      __publicField(this, "handleProductInformation", (variantId, connectedProductUrl) => {
        const pathName = connectedProductUrl ? new URL(connectedProductUrl).pathname : window.location.pathname;
        const newUrl = `${pathName}${variantId ? `?variant=${variantId}` : ""}`;
        if (window.location.href !== newUrl) {
          window.history.replaceState({}, "", newUrl);
        }
      });
      __publicField(this, "handleQuickView", (connectedProductUrl) => {
        var _a2, _b2;
        const xoName = (_b2 = (_a2 = this.closest(WebComponent.ProductQuickView)) == null ? void 0 : _a2.getAttribute("xo-name")) != null ? _b2 : QUICKVIEW_NAME;
        const quickviewTriggerEl = getState.product().quickviewTriggerEl;
        if (!quickviewTriggerEl) {
          return;
        }
        const { xoProductUrl } = quickviewTriggerEl.getOptions();
        const { search } = new URL(xoProductUrl);
        const url = this.getUrl(connectedProductUrl ? connectedProductUrl + search : xoProductUrl, true);
        quickviewTriggerEl.setAttribute("xo-product-url", url);
        getQuickviewProductHtml(xoName, url, quickviewTriggerEl);
      });
      __publicField(this, "handleLocationChange", () => {
        var _a2;
        const { xoSectionId, xoProductId } = this.productEl.getOptions();
        getProductHtml(this.getUrl(window.location.href));
        const pickupEl = (_a2 = this.productEl) == null ? void 0 : _a2.querySelector(WebComponent.ProductPickupAvailability);
        if (pickupEl) {
          getPickupAvailabilityHtml(xoSectionId, xoProductId);
        }
      });
      __publicField(this, "addFieldSignals", (productVariantsEl) => {
        const { xoProductId } = this.productEl.getOptions();
        each(getFieldEls(productVariantsEl), (fieldEl) => {
          const id2 = fieldEl.id;
          let signal = `product_${xoProductId}`;
          if (getProductType(this.productEl) === "quickview") {
            signal = QUICKVIEW_SIGNAL;
            const xoNameEls = Array.from(this.productEl.querySelectorAll(`[xo-name]:not(${WebComponent.ProductVariantSelected}):not(${WebComponent.ModalTrigger})`));
            each(xoNameEls, (xoNameEl) => {
              xoNameEl.setAttribute("xo-name", fieldSignal.addFieldSignal(xoNameEl.getAttribute("xo-name"), QUICKVIEW_SIGNAL));
            });
          }
          if (fieldEl.closest(WebComponent.Sticky)) {
            signal = STICKY_SIGNAL;
          }
          const labelEl = document.querySelector(`label[for="${id2}"]`);
          fieldEl.name = fieldSignal.addFieldSignal(fieldEl.name, signal);
          if (id2) {
            fieldEl.id = fieldSignal.addFieldSignal(id2, signal);
          }
          if (labelEl) {
            labelEl.setAttribute("for", fieldSignal.addFieldSignal(id2, signal));
          }
        });
        stickyCartPropertySignal(productVariantsEl);
      });
      __publicField(this, "getVariantId", (fieldEl) => {
        let variantId = fieldEl.getAttribute("xo-variant-id") || "";
        if (fieldEl instanceof HTMLSelectElement) {
          const optionSelectedEl = fieldEl.querySelector("option:checked");
          if (optionSelectedEl) {
            variantId = optionSelectedEl.getAttribute("xo-variant-id") || variantId;
          }
        }
        return variantId;
      });
      __publicField(this, "syncVariants", (productVariantEl) => {
        const optionValueIds = this.getOptionValueIds(productVariantEl);
        const productVariantEls = Array.from(document.querySelectorAll(WebComponent.ProductVariants));
        each(productVariantEls, (el) => {
          if (el !== productVariantEl) {
            const selectors = optionValueIds.map((id2) => `[xo-option-value-id="${id2}"]`).join(",");
            const fieldEls = Array.from(el.querySelectorAll(selectors));
            each(fieldEls, (fieldEl) => {
              if (fieldEl instanceof HTMLInputElement) {
                fieldEl.checked = true;
              } else if (fieldEl instanceof HTMLOptionElement) {
                fieldEl.selected = true;
                const selectEl = fieldEl.closest("select");
                if (selectEl) {
                  selectEl.value = fieldEl.value;
                }
              }
            });
          }
        });
      });
      __publicField(this, "handler", (event) => {
        var _a2;
        const { xoSectionId, xoProductId } = this.productEl.getOptions();
        const target = event.target;
        let variantId = this.getVariantId(target);
        const connectedProductUrl = target.getAttribute("xo-connected-product-url");
        this.inputVariantIdChange(variantId);
        setVariantId(xoSectionId, xoProductId, variantId);
        this.closePopover(target);
        this.setState({ variantClicked: true });
        setIsCombineListing(!!connectedProductUrl);
        this.currentOptionValueId = (_a2 = target.getAttribute("xo-option-value-id")) != null ? _a2 : "";
        switch (getProductType(this.productEl)) {
          case "featured": {
            return this.handleFeatured(connectedProductUrl);
          }
          case "quickview": {
            return this.handleQuickView(connectedProductUrl);
          }
          case "information": {
            this.syncVariants(target.closest(WebComponent.ProductVariants));
            return this.handleProductInformation(variantId, connectedProductUrl);
          }
        }
      });
      __publicField(this, "morph", (productHtml, isQuickview = false) => {
        const domParser = new DOMParser();
        const doc = domParser.parseFromString(productHtml, "text/html");
        setHoverLevel(doc);
        const productVariantEls = Array.from(doc.querySelectorAll(WebComponent.ProductVariants));
        each(productVariantEls, (productVariantEl, index) => {
          var _a2, _b2;
          this.addFieldSignals(productVariantEl);
          const currentProductVariantEl = (_a2 = this.sectionEl) == null ? void 0 : _a2.querySelectorAll(WebComponent.ProductVariants)[index];
          if (currentProductVariantEl && productVariantEl.innerHTML !== currentProductVariantEl.innerHTML) {
            currentProductVariantEl.innerHTML = productVariantEl.innerHTML;
            const currentVariantEl = (_b2 = currentProductVariantEl.querySelector(`[xo-option-value-id="${this.currentOptionValueId}"]`)) == null ? void 0 : _b2.closest("[tabindex]");
            if (currentVariantEl) {
              currentVariantEl.focus();
              this.currentOptionValueId = "";
            }
          }
          const currentProductEl = currentProductVariantEl == null ? void 0 : currentProductVariantEl.closest(WebComponent.Product);
          const nextProductEl = productVariantEl.closest(WebComponent.Product);
          currentProductEl == null ? void 0 : currentProductEl.setAttribute("xo-selected-or-first-available-variant-id", nextProductEl == null ? void 0 : nextProductEl.getAttribute("xo-selected-or-first-available-variant-id"));
        });
        const bindingEls = Array.from(doc.querySelectorAll(WebComponent.ProductQuickViewLiquidBinding));
        each(bindingEls, (bindingEl, index) => {
          var _a2;
          const currentbindingEl = (_a2 = this.sectionEl) == null ? void 0 : _a2.querySelectorAll(WebComponent.ProductQuickViewLiquidBinding)[index];
          if (currentbindingEl && bindingEl.innerHTML !== currentbindingEl.innerHTML) {
            currentbindingEl.innerHTML = bindingEl.innerHTML;
            if (isQuickview && this.state.variantClicked) {
              this.handleBindingAttr();
            }
          }
        });
      });
      __publicField(this, "listener", async () => {
        frameManager.add(() => {
          var _a2, _b2, _c2;
          const { xoSectionId } = this.productEl.getOptions();
          const { status, quickviewProductHtml, featuredProductHtmls, productHtml, quickviewTriggerEl, isCombineListing } = getState.product();
          if (!isCombineListing) {
            if (status === "loading") {
              this.style.opacity = "0.7";
              this.style.pointerEvents = "none";
            } else {
              this.style.removeProperty("opacity");
              this.style.removeProperty("pointer-events");
            }
            if (status !== "success" && this.prevStatus === status) {
              return;
            }
            const productTriggerEl = quickviewTriggerEl == null ? void 0 : quickviewTriggerEl.closest(WebComponent.Product);
            let finalProductHtml = "";
            const type = getProductType(this.productEl);
            switch (type) {
              case "featured": {
                finalProductHtml = (_a2 = featuredProductHtmls[xoSectionId != null ? xoSectionId : ""]) != null ? _a2 : "";
                break;
              }
              case "quickview": {
                const xoName = (_b2 = productTriggerEl == null ? void 0 : productTriggerEl.getAttribute("xo-name")) != null ? _b2 : QUICKVIEW_NAME;
                finalProductHtml = (_c2 = quickviewProductHtml[xoName]) != null ? _c2 : "";
                break;
              }
              case "information": {
                finalProductHtml = productHtml;
                break;
              }
            }
            this.morph(finalProductHtml, type === "quickview");
            this.prevStatus = status;
            this.setProductStatus();
            loadImages(this);
            if (status === "success") {
              this.setState({ variantClicked: false });
            }
          }
          queueMicrotask(() => {
            each(getFieldEls(this), (el) => {
              el.addEventListener("input", this.handler, this.controller);
            });
          });
        });
      });
      __publicField(this, "fixFirstVariants", () => {
        each(getFieldEls(this), (fieldEl) => {
          if (fieldEl instanceof HTMLInputElement) {
            if (fieldEl.checked || fieldEl.hasAttribute("checked") && fieldEl.getAttribute("checked") !== "false") {
              fieldEl.checked = true;
            }
          } else if (fieldEl instanceof HTMLSelectElement) {
            const optionEls = Array.from(fieldEl.querySelectorAll("option"));
            each(optionEls, (optionEl) => {
              if (optionEl.selected || optionEl.hasAttribute("selected") && optionEl.getAttribute("selected") !== "false") {
                optionEl.selected = true;
              }
            });
          }
        });
      });
    }
    async mount() {
      if (!this.productEl) {
        throw new Error(`${WebComponent.ProductVariants} must be used within a ${WebComponent.Product} component`);
      }
      if (this.productWillChangeEl) {
        throw new Error(`You cannot use ${WebComponent.ProductWillChange} inside ${WebComponent.ProductVariants}`);
      }
      await delay();
      const type = getProductType(this.productEl);
      this.addFieldSignals(this);
      this.fixFirstVariants();
      each(getFieldEls(this), (el) => {
        el.addEventListener("input", this.handler, this.controller);
      });
      if (type === "information") {
        locationEvent.off(eventId);
        eventId = locationEvent.on("change", this.handleLocationChange);
      }
      this.unsubscribe = subscribe.product(this.listener);
    }
    unmount() {
      this.prevStatus = "idle";
      locationEvent.off(eventId);
      this.controller.abort();
      this.unsubscribe();
    }
  }, __publicField(_N, "propTypes", {}), __publicField(_N, "defaultProps", {}), _N);
  ProductVariants = __decorate([
    customElements$1(WebComponent.ProductVariants)
  ], ProductVariants);
  const styles$g = "";
  createState();
  const xoProductQuickView = {
    on(eventStatus, listener) {
      const unsubscribe = subscribe.product(({ status, productHtml }) => {
        if (status === eventStatus) {
          listener(productHtml);
        }
      });
      return unsubscribe;
    }
  };
  window.xoProductQuickView = xoProductQuickView;
  window.cartFormSubscribe = cartFormSubscribe;
  window.cartSubscribe = cartSubscribe;
  window.getCartFormState = getCartFormState;
  window.productSubscribe = productSubscribe;
  componentDefine({
    [WebComponent.Cart]: Cart,
    [WebComponent.CartMini]: CartMini,
    [WebComponent.CartAdd]: CartAdd,
    [WebComponent.CartAddError]: CartAddError,
    [WebComponent.CartRemove]: CartRemove,
    [WebComponent.CartSize]: CartSize,
    [WebComponent.CartChangeFallback]: CartChangeFallback,
    [WebComponent.CartQuantity]: CartQuantity,
    [WebComponent.CartQuantityMinus]: CartQuantityMinus,
    [WebComponent.CartQuantityPlus]: CartQuantityPlus,
    [WebComponent.CartNote]: CartNote,
    [WebComponent.CartNoteSubmit]: CartNoteSubmit,
    [WebComponent.CartShippingRatesField]: CartShippingRatesField,
    [WebComponent.CartShippingRatesSubmit]: CartShippingRatesSubmit,
    [WebComponent.CartShippingRatesError]: CartShippingRatesError,
    [WebComponent.ProductPickupAvailability]: ProductPickupAvailability,
    [WebComponent.ProductPickupAvailabilityList]: ProductPickupAvailabilityList,
    [WebComponent.ProductQuickView]: ProductQuickView,
    [WebComponent.ProductQuickViewTrigger]: ProductQuickViewTrigger,
    [WebComponent.ProductQuickViewVariant]: ProductQuickViewVariant,
    [WebComponent.ProductLiquidStatic]: ProductLiquidStatic,
    [WebComponent.ProductRecipientForm]: ProductRecipientForm,
    [WebComponent.ProductRecommendations]: ProductRecommendations
  });
  const groupEvent = new Emitter();
  class Group extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "buttonEls", []);
      __publicField(this, "handleClick", (event) => {
        event.preventDefault();
        const currentEl = event.currentTarget;
        attrBoolean.set(currentEl, "xo-active", true);
        each(this.buttonEls, (buttonEl) => {
          if (buttonEl !== currentEl) {
            attrBoolean.set(buttonEl, "xo-active", false);
          }
        });
        groupEvent.emit("change", { element: currentEl, index: this.buttonEls.indexOf(currentEl) });
      });
    }
    onConnected() {
      this.buttonEls = Array.from(this.querySelectorAll(WebComponent.GroupButton));
      each(this.buttonEls, (buttonEl) => {
        buttonEl.addEventListener("click", this.handleClick);
      });
    }
    disconnectedCallback() {
      each(this.buttonEls, (buttonEl) => {
        buttonEl.removeEventListener("click", this.handleClick);
      });
    }
  }
  const xoGroup = {
    on: groupEvent.on.bind(groupEvent)
  };
  window.xoGroup = xoGroup;
  componentDefine({
    [WebComponent.Group]: Group
  });
  const cssEasing = {
    easeLight: "cubic-bezier(0, 0, 0.3, 1)",
    easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    easeOut: "cubic-bezier(0.165, 0.84, 0.44, 1)",
    easeIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    easeInBack: "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
    easeOutBack: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    easeInOutBack: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    easeInCirc: "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
    easeOutCirc: "cubic-bezier(0.075, 0.82, 0.165, 1)",
    easeInOutCirc: "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
    easeInCubic: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    easeOutCubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    easeInExpo: "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
    easeOutExpo: "cubic-bezier(0.19, 1, 0.22, 1)",
    easeInOutExpo: "cubic-bezier(1, 0, 0, 1)",
    easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
    easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
    easeInQuart: "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
    easeOutQuart: "cubic-bezier(0.165, 0.84, 0.44, 1)",
    easeInOutQuart: "cubic-bezier(0.77, 0, 0.175, 1)",
    easeInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
    easeOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",
    easeInOutQuint: "cubic-bezier(0.86, 0, 0.07, 1)",
    easeInSine: "cubic-bezier(0.47, 0, 0.745, 0.715)",
    easeOutSine: "cubic-bezier(0.39, 0.575, 0.565, 1)",
    easeInOutSine: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
    easeInBounce: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
    easeOutBounce: "cubic-bezier(0.23, 1, 0.32, 1)",
    linear: "cubic-bezier(0, 0, 1, 1)",
    spring: "cubic-bezier(.27,.79,.45,1.24)"
  };
  function getWrapEl(el) {
    const wrapEl = el.closest(`${WebComponent.Carousel}:not([xo-per-view]):not([xo-column-width])`) || el.closest(`${WebComponent.Carousel}[xo-per-view="1"]:not([xo-column-width])`) || el.closest(WebComponent.Toggle) || el.closest(WebComponent.Modal) || el.closest(WebComponent.Popover) || el.closest(WebComponent.TabsPane);
    return wrapEl;
  }
  const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
  function renderSvgFilters() {
    if (isReduced) {
      return;
    }
    const svg = `
    <svg class="xo-hidden">
      <defs>
        <filter id="xo-goo-1">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur"></feGaussianBlur>
          <feColorMatrix in="blur" mode="matrix" values="	1 0 0 0 0
              0 1 0 0 0
              1 0 1 0 0
              0 0 0 13 -6" result="goo"></feColorMatrix>
          <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
        </filter>
        <filter id="xo-goo-2">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur"></feGaussianBlur>
          <feColorMatrix in="blur" mode="matrix" values="	1 0 0 0 0
              0 1 0 0 0
              1 0 1 0 0
              0 0 0 12 -4" result="goo"></feColorMatrix>
          <feTurbulence type="turbulence" baseFrequency="1" numOctaves="1" seed="2" result="noise"></feTurbulence>
          <feDisplacementMap in="goo" in2="noise" scale="0" result="displacement"></feDisplacementMap>
          <feComposite in="SourceGraphic" in2="displacement" operator="atop"></feComposite>
        </filter>
        <filter id="xo-goo-3">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur"></feGaussianBlur>
          <feColorMatrix in="blur" mode="matrix" values="	1 0 0 0 0
              0 1 0 0 0
              1 0 1 0 0
              0 0 0 15 -8" result="goo"></feColorMatrix>
          <feTurbulence type="fractalNoise" baseFrequency="0.1 0.5" numOctaves="5" seed="2" result="noise"></feTurbulence>
          <feDisplacementMap in="goo" in2="noise" scale="0" result="displacement"></feDisplacementMap>
          <feComposite in="SourceGraphic" in2="displacement" operator="atop"></feComposite>
        </filter>
        <filter id="xo-goo-4">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur"></feGaussianBlur>
          <feColorMatrix in="blur" mode="matrix" values="	1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 18 -8" result="goo"></feColorMatrix>
          <feTurbulence type="fractalNoise" baseFrequency="1 0.01" numOctaves="1" seed="1" result="noise"></feTurbulence>
          <feDisplacementMap in="goo" in2="noise" scale="0" result="displacement"></feDisplacementMap>
          <feComposite in="SourceGraphic" in2="displacement" operator="atop"></feComposite>
        </filter>
        <filter id="xo-goo-5">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur"></feGaussianBlur>
          <feColorMatrix in="blur" mode="matrix" values="	1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 14 -1" result="goo"></feColorMatrix>
          <feTurbulence type="fractalNoise" baseFrequency="0.009 1" numOctaves="1" seed="1" result="noise"></feTurbulence>
          <feDisplacementMap in="goo" in2="noise" scale="0" result="displacement"></feDisplacementMap>
          <feComposite in="SourceGraphic" in2="displacement" operator="atop"></feComposite>
        </filter>
        <filter id="xo-goo-6">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur"></feGaussianBlur>
          <feColorMatrix in="blur" mode="matrix" values="	1 0 0 0 0
              0 1 0 0 0
              1 0 1 0 0
              0 0 0 12 -8" result="goo"></feColorMatrix>
          <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="1" seed="1" result="noise"></feTurbulence>
          <feDisplacementMap in="goo" in2="noise" scale="0" result="displacement"></feDisplacementMap>
          <feComposite in="SourceGraphic" in2="displacement" operator="atop"></feComposite>
        </filter>
        <filter id="xo-goo-7">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur"></feGaussianBlur>
          <feColorMatrix in="blur" mode="matrix" values="	1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 18 -5" result="goo"></feColorMatrix>
          <feTurbulence type="fractalNoise" baseFrequency="0.07 0.3" numOctaves="1" seed="1" result="noise"></feTurbulence>
          <feDisplacementMap in="goo" in2="noise" scale="0" result="displacement"></feDisplacementMap>
          <feComposite in="SourceGraphic" in2="displacement" operator="atop"></feComposite>
        </filter>
      </defs>
    </svg>
  `;
    document.body.insertAdjacentHTML("beforeend", svg);
  }
  const attrMapping = {
    "xo-goo-1": {
      stdDeviation: { start: 50, end: 0 }
    },
    "xo-goo-2": {
      stdDeviation: { start: 20, end: 0 },
      scale: { start: 100, end: 0 },
      baseFrequency: { start: 0.1, end: 0.05 }
    },
    "xo-goo-3": {
      stdDeviation: { start: 40, end: 0 },
      scale: { start: 150, end: 0 }
    },
    "xo-goo-4": {
      stdDeviation: { start: 70, end: 0 },
      scale: { start: 200, end: 0 }
    },
    "xo-goo-5": {
      stdDeviation: { start: 40, end: 0 },
      scale: { start: 100, end: 0 }
    },
    "xo-goo-6": {
      stdDeviation: { start: 90, end: 0 },
      scale: { start: 300, end: 0 },
      baseFrequency: { start: 0.1, end: 0.01 }
    },
    "xo-goo-7": {
      stdDeviation: { start: 35, end: 0 },
      scale: { start: 250, end: 0 }
    }
  };
  function runSvgFilterAnimate(text, duration, _delay) {
    const filterId = text.getAttribute("xo-type");
    if (!(filterId == null ? void 0 : filterId.startsWith("goo-"))) {
      return;
    }
    const finalFilterId = `xo-${filterId}`;
    const feBlur = document.querySelector(`#${finalFilterId} feGaussianBlur`);
    const feTurbulence = document.querySelector(`#${finalFilterId} feTurbulence`);
    const feDisplacementMap = document.querySelector(`#${finalFilterId} feDisplacementMap`);
    text.style.filter = `url(#${finalFilterId})`;
    text.style.opacity = "0";
    const animated = createAnimate();
    animated({
      from: 0,
      to: 1,
      duration: duration + 1200,
      easing: easings.easeOutExpo,
      onUpdate: (value) => {
        const inputRange = [0, 1];
        const stdDeviationObj = attrMapping[finalFilterId].stdDeviation;
        const scaleOutputObj = attrMapping[finalFilterId].scale;
        const baseFrequencyObj = attrMapping[finalFilterId].baseFrequency;
        const stdDeviation = stdDeviationObj != null ? interpolate({
          value,
          inputRange,
          outputRange: [stdDeviationObj.start, stdDeviationObj.end]
        }) : null;
        const scale = scaleOutputObj != null ? interpolate({
          value,
          inputRange,
          outputRange: [scaleOutputObj.start, scaleOutputObj.end]
        }) : null;
        const baseFrequency = baseFrequencyObj != null ? interpolate({
          value,
          inputRange,
          outputRange: [baseFrequencyObj.start, baseFrequencyObj.end]
        }) : null;
        if (stdDeviation) {
          feBlur == null ? void 0 : feBlur.setAttribute("stdDeviation", stdDeviation.toString());
        }
        if (scale) {
          feDisplacementMap == null ? void 0 : feDisplacementMap.setAttribute("scale", scale.toString());
        }
        if (baseFrequency) {
          feTurbulence == null ? void 0 : feTurbulence.setAttribute("baseFrequency", baseFrequency.toString());
        }
        text.style.opacity = value.toString();
      }
    });
  }
  function addPrevAttrForSvg(element) {
    const els = Array.from(element.querySelectorAll("[xo-next-stroke-dasharray], [xo-next-stroke-dashoffset]"));
    each(els, (pathEl) => {
      const d = pathEl.getAttribute("d");
      const nextD = pathEl.getAttribute("xo-next-d");
      const hasPrevD = pathEl.hasAttribute("xo-prev-d");
      const dasharray = pathEl.getAttribute("stroke-dasharray");
      const nextDasharray = pathEl.getAttribute("xo-next-stroke-dasharray");
      const hasPrevDasharray = pathEl.hasAttribute("xo-prev-stroke-dasharray");
      const dashoffset = pathEl.getAttribute("stroke-dashoffset");
      const nextDashoffset = pathEl.getAttribute("xo-next-stroke-dashoffset");
      const hasPrevDashoffset = pathEl.hasAttribute("xo-prev-stroke-dashoffset");
      if (d && nextD && !hasPrevD) {
        pathEl.setAttribute("xo-prev-d", d);
      }
      if (dasharray && nextDasharray && !hasPrevDasharray) {
        pathEl.setAttribute("xo-prev-stroke-dasharray", dasharray);
      }
      if (dashoffset && nextDashoffset && !hasPrevDashoffset) {
        pathEl.setAttribute("xo-prev-stroke-dashoffset", dashoffset);
      }
    });
  }
  async function handleSVG(element, options, animateDisabled = false) {
    if (!element.querySelector("[xo-next-d], [xo-next-stroke-dasharray], [xo-next-stroke-dashoffset]")) {
      return;
    }
    const { xoDuration, xoOrder, xoConstant, xoDisabled } = options;
    const els = Array.from(element.querySelectorAll("[xo-next-d], [xo-next-stroke-dasharray], [xo-next-stroke-dashoffset]")).filter((el) => {
      const parentEl = el.closest(WebComponent.Animate);
      return !(parentEl && parentEl !== element);
    });
    if (els.length === 0) {
      return;
    }
    if (!xoDisabled) {
      await delay(xoOrder * xoConstant);
    }
    each(els, (pathEl) => {
      const animated = createAnimate();
      const d = pathEl.getAttribute("d");
      const nextD = pathEl.getAttribute("xo-next-d");
      const dasharray = pathEl.getAttribute("stroke-dasharray");
      const nextDasharray = pathEl.getAttribute("xo-next-stroke-dasharray");
      const dashoffset = pathEl.getAttribute("stroke-dashoffset");
      const nextDashoffset = pathEl.getAttribute("xo-next-stroke-dashoffset");
      if (d && nextD) {
        const dArr = SVGPath.toArray(d);
        const nextDArr = SVGPath.toArray(nextD);
        animated({
          from: 0,
          to: 1,
          duration: animateDisabled || isReduced || xoDisabled ? 0 : xoDuration,
          easing: easings.linear,
          onUpdate: (value) => {
            const newArr = map(dArr, (dItem, index) => {
              const nextDItem = nextDArr[index];
              if (dItem.type === (nextDItem == null ? void 0 : nextDItem.type)) {
                const values = map(dItem.values, (valueItem, valueIndex) => {
                  const nextValueItem = nextDItem.values[valueIndex];
                  const newValueItem = interpolate({
                    value,
                    inputRange: [0, 1],
                    outputRange: [valueItem, nextValueItem]
                  });
                  return newValueItem;
                }).filter(Boolean);
                return {
                  ...dItem,
                  values
                };
              }
              return dItem;
            });
            pathEl.setAttribute("d", SVGPath.toString(newArr));
          }
        });
      }
      if (dasharray && nextDasharray) {
        const dasharrayArr = dasharray.replace(/\s+/g, " ").split(" ");
        const nextDasharrayArr = nextDasharray.replace(/\s+/g, " ").split(" ");
        animated({
          from: 0,
          to: 1,
          duration: animateDisabled || isReduced || xoDisabled ? 0 : xoDuration,
          easing: easings.linear,
          onUpdate: (value) => {
            const newArr = map(dasharrayArr, (dasharrayItem, index) => {
              var _a2, _b2;
              const nextDasharrayItem = nextDasharrayArr[index];
              const newValueItem = interpolate({
                value,
                inputRange: [0, 1],
                outputRange: [Number(((_a2 = dasharrayItem.match(/[\d.]*/g)) == null ? void 0 : _a2[0]) || 0), Number(((_b2 = nextDasharrayItem.match(/[\d.]*/g)) == null ? void 0 : _b2[0]) || 0)]
              });
              return newValueItem;
            });
            pathEl.setAttribute("stroke-dasharray", newArr.join(" "));
          }
        });
      }
      if (dashoffset && nextDashoffset) {
        const dashoffsetArr = dashoffset.replace(/\s+/g, " ").split(" ");
        const nextDashoffsetArr = nextDashoffset.replace(/\s+/g, " ").split(" ");
        animated({
          from: 0,
          to: 1,
          duration: animateDisabled || isReduced || xoDisabled ? 0 : xoDuration,
          easing: easings.linear,
          onUpdate: (value) => {
            const newArr = map(dashoffsetArr, (dashoffsetItem, index) => {
              var _a2, _b2;
              const nextDashoffsetItem = nextDashoffsetArr[index];
              const newValueItem = interpolate({
                value,
                inputRange: [0, 1],
                outputRange: [Number(((_a2 = dashoffsetItem.match(/[\d.]*/g)) == null ? void 0 : _a2[0]) || 0), Number(((_b2 = nextDashoffsetItem.match(/[\d.]*/g)) == null ? void 0 : _b2[0]) || 0)]
              });
              return newValueItem;
            });
            pathEl.setAttribute("stroke-dashoffset", newArr.join(" "));
          }
        });
      }
    });
  }
  function revertSVG(element) {
    const els = Array.from(element.querySelectorAll("[xo-prev-d], [xo-prev-stroke-dasharray], [xo-prev-stroke-dashoffset]"));
    each(els, (pathEl) => {
      const d = pathEl.getAttribute("d");
      const prevD = pathEl.getAttribute("xo-prev-d");
      const dasharray = pathEl.getAttribute("stroke-dasharray");
      const prevDasharray = pathEl.getAttribute("xo-prev-stroke-dasharray");
      const dashoffset = pathEl.getAttribute("stroke-dashoffset");
      const prevDashoffset = pathEl.getAttribute("xo-prev-stroke-dashoffset");
      if (prevD && d) {
        pathEl.setAttribute("d", prevD);
      }
      if (prevDasharray && dasharray) {
        pathEl.setAttribute("stroke-dasharray", prevDasharray);
      }
      if (prevDashoffset && dashoffset) {
        pathEl.setAttribute("stroke-dashoffset", prevDashoffset);
      }
    });
  }
  function handleInfiniteSVG(element) {
    const els = Array.from(element.querySelectorAll("[xo-next-stroke-dasharray], [xo-next-stroke-dashoffset]"));
    each(els, (pathEl) => {
      const d = pathEl.getAttribute("d");
      const nextD = pathEl.getAttribute("xo-next-d");
      const dasharray = pathEl.getAttribute("stroke-dasharray");
      const nextDasharray = pathEl.getAttribute("xo-next-stroke-dasharray");
      const dashoffset = pathEl.getAttribute("stroke-dashoffset");
      const nextDashoffset = pathEl.getAttribute("xo-next-stroke-dashoffset");
      if (d && nextD) {
        pathEl.style.setProperty("--xo-d", d);
        pathEl.style.setProperty("--xo-next-d", nextD);
      }
      if (dasharray && nextDasharray) {
        pathEl.style.setProperty("--xo-stroke-dasharray", dasharray);
        pathEl.style.setProperty("--xo-next-stroke-dasharray", nextDasharray);
      }
      if (dashoffset && nextDashoffset) {
        pathEl.style.setProperty("--xo-stroke-dashoffset", dashoffset);
        pathEl.style.setProperty("--xo-next-stroke-dashoffset", nextDashoffset);
      }
    });
  }
  const loadedSet = /* @__PURE__ */ new WeakSet();
  const observer = new IntersectionObserver((entries) => {
    frameManager.add(() => {
      let order = -1;
      entries.forEach(async (entry) => {
        const element = entry.target;
        const { xoCascade, xoDuration, xoConstant, xoItemUsed, xoOrder } = element.options;
        if (!entry.isIntersecting) {
          return;
        }
        if (loadedSet.has(element)) {
          return;
        }
        loadedSet.add(element);
        attrBoolean.set(element, "xo-visible", true);
        bindingHelper(element, "xo-visible-binding", true);
        element.removeAttribute("aria-disabled");
        element.handleWidthIncrement();
        handleSVG(element, element.options);
        if (xoCascade) {
          order++;
          element.style.setProperty("--xo-order", `${order}`);
        } else if (xoOrder) {
          order = xoOrder;
        }
        const wrapEl = getWrapEl(element);
        if (!wrapEl) {
          runSvgFilterAnimate(element, xoDuration);
        }
        observer.unobserve(element);
        await delay(xoDuration + Math.max(1, order + 1) * xoConstant + 200);
        if (xoItemUsed) {
          element.getItemEls().forEach((itemEl) => {
            itemEl.style.opacity = "1";
          });
        } else {
          element.style.animation = "none";
          element.style.opacity = "1";
        }
      });
    });
  }, {
    rootMargin: "0px 0px -50px 0px"
  });
  const _Animate = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "timeId", -1);
      __publicField(this, "cssId", "");
      __publicField(this, "_options");
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "getItemEls", () => {
        return Array.from(this.querySelectorAll(WebComponent.AnimateItem));
      });
      __publicField(this, "handleWidthIncrement", () => {
        const { xoType, xoDuration } = this.options;
        if (xoType === "width-increment") {
          const childEls = Array.from(this.children);
          each(childEls, (childEl) => {
            childEl.style.width = `var(--xo-width)`;
            childEl.style.maxWidth = "none";
          });
          this.style.width = `var(--xo-width)`;
          clearTimeout(this.timeId);
          this.timeId = window.setTimeout(() => {
            each(childEls, (childEl) => {
              childEl.style.removeProperty("width");
              childEl.style.removeProperty("max-width");
            });
            this.style.removeProperty("width");
            clearTimeout(this.timeId);
          }, xoDuration);
        }
      });
      __publicField(this, "setOptions", () => {
        this.options = getAttrs(this, {
          pick: ["xoDuration", "xoConstant", "xoOrder", "xoType", "xoEasing", "xoStrength", "xoCascade", "xoDisabled", "xoItemUsed", "xoScrollForced"],
          types: {
            xoDuration: "number",
            xoConstant: "number",
            xoOrder: "number",
            xoType: "string",
            xoEasing: "string",
            xoStrength: "number",
            xoCascade: "boolean",
            xoDisabled: "boolean",
            xoItemUsed: "boolean",
            xoScrollForced: "boolean"
          }
        });
      });
    }
    static get observedAttributes() {
      return ["xo-observed", "xo-duration", "xo-type", "xo-easing", "xo-strength", "xo-cascade", "xo-order", "xo-constant", "xo-disabled", "xo-visible"];
    }
    get options() {
      return {
        ..._Animate.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    onConnected() {
      var _a2;
      if (device.mobile() && reduceMotion() || attrBoolean.get(document.documentElement, "xo-animate-disabled")) {
        attrBoolean.set(this, "xo-disabled", true);
        handleSVG(this, this.options, true);
        return;
      }
      this.setOptions();
      const { xoConstant, xoOrder, xoDuration, xoEasing, xoStrength, xoType, xoCascade, xoDisabled, xoItemUsed, xoScrollForced } = this.options;
      if (xoDisabled || isReduced || xoType === "none") {
        attrBoolean.set(this, "xo-visible", false);
        bindingHelper(this, "xo-visible-binding", false);
        this.style.removeProperty("animation");
        this.style.removeProperty("--xo-order");
        this.style.removeProperty("--xo-strength");
        this.style.removeProperty("--xo-constant");
        this.style.removeProperty("--xo-duration");
        this.style.removeProperty("--xo-easing");
        return;
      }
      const wrapEl = xoScrollForced ? null : getWrapEl(this);
      if (!attrBoolean.get(this, "xo-visible") && !wrapEl) {
        if (xoItemUsed) {
          this.getItemEls().forEach((itemEl) => {
            itemEl.style.opacity = "0";
            itemEl.setAttribute("aria-disabled", "true");
            itemEl.setAttribute("xo-type", `${xoType}`);
          });
        } else {
          this.style.opacity = "0";
          this.setAttribute("aria-disabled", "true");
        }
      }
      this.setAttribute("xo-type", `${xoType}`);
      this.style.setProperty("--xo-order", `${xoOrder}`);
      this.style.setProperty("--xo-strength", `${xoStrength}`);
      this.style.setProperty("--xo-constant", `${xoConstant}`);
      this.style.setProperty("--xo-duration", `${xoDuration}`);
      this.style.setProperty("--xo-easing", (_a2 = cssEasing[xoEasing]) != null ? _a2 : xoEasing);
      if (xoType === "width-increment" && this.offsetWidth > 0) {
        this.style.setProperty("--xo-width", `${this.offsetWidth}px`);
        this.style.width = "0px";
      }
      (async () => {
        var _a3, _b2;
        await delay(0);
        if (wrapEl) {
          this.style.transition = `all ${xoDuration}ms ${(_a3 = cssEasing[xoEasing]) != null ? _a3 : xoEasing} calc(((var(--xo-order) * var(--xo-constant)) + var(--xo-wrap-duration, 0)) * 1ms)`;
          if (xoCascade) {
            const duration = (_b2 = wrapEl.getAttribute("xo-duration")) != null ? _b2 : "300";
            const animateEls = Array.from(wrapEl.querySelectorAll(`${WebComponent.Animate}, [is^="${WebComponent.Animate}"]`)).filter((animateEl) => getWrapEl(animateEl) === wrapEl);
            each(animateEls, (animateEl, index) => {
              if (this === animateEl) {
                this.style.setProperty("--xo-order", `${index}`);
                this.style.setProperty("--xo-wrap-duration", `${Number(duration) / 3}`);
              }
            });
          }
        } else {
          observer.observe(this);
        }
      })();
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      var _a2, _b2;
      if (name === "xo-visible") {
        each(this.getItemEls(), (itemEl) => {
          attrBoolean.set(itemEl, "xo-visible", newValue != null && newValue !== "false");
          bindingHelper(this, "xo-visible-binding", newValue != null && newValue !== "false");
        });
      }
      if ((name === "xo-observed" || name === "xo-type" || name === "xo-duration" || name === "xo-easing" || name === "xo-cascade" || name === "xo-strength" || name === "xo-order" || name === "xo-disabled" || name === "xo-constant") && oldValue !== newValue) {
        if (((_a2 = window.Shopify) == null ? void 0 : _a2.designMode) || ((_b2 = window.xbEditor) == null ? void 0 : _b2.designMode)) {
          const wrapEl = getWrapEl(this);
          if (!wrapEl) {
            attrBoolean.set(this, "xo-visible", false);
            bindingHelper(this, "xo-visible-binding", false);
            this.style.removeProperty("animation");
            observer.unobserve(this);
            observer.observe(this);
          }
          this.onConnected();
        }
      }
    }
    disconnectedCallback() {
      clearTimeout(this.timeId);
      observer.unobserve(this);
      this.cancel();
    }
  };
  let Animate = _Animate;
  __publicField(Animate, "defaultOptions", {
    xoDuration: (_P = (_O = window.settings) == null ? void 0 : _O.animate_duration) != null ? _P : 500,
    xoType: (_R = (_Q = window.settings) == null ? void 0 : _Q.animate_effect) != null ? _R : "fade-up",
    xoConstant: 75,
    xoOrder: 0,
    xoStrength: (_T = (_S = window.settings) == null ? void 0 : _S.animate_strength) != null ? _T : 1,
    xoEasing: "easeLight",
    xoCascade: false,
    xoDisabled: false,
    xoItemUsed: false,
    xoScrollForced: false
  });
  const _AnimateScroll = class {
    constructor() {
      __publicField(this, "observer");
      __publicField(this, "mutation");
      __publicField(this, "updateMutation");
      __publicField(this, "timeIds", /* @__PURE__ */ new WeakMap());
      __publicField(this, "handleWidthIncrement", async (el) => {
        await delay(10);
        const { xoType, xoDuration } = this.getOptions(el);
        if (xoType === "width-increment") {
          const childEls = Array.from(el.children);
          each(childEls, (childEl) => {
            childEl.style.width = `var(--xo-width)`;
            childEl.style.maxWidth = "none";
          });
          el.style.width = `var(--xo-width)`;
          clearTimeout(this.timeIds.get(el));
          this.timeIds.delete(el);
          const timeId2 = window.setTimeout(() => {
            each(childEls, (childEl) => {
              childEl.style.removeProperty("width");
              childEl.style.removeProperty("max-width");
            });
            el.style.removeProperty("width");
            clearTimeout(this.timeIds.get(el));
            this.timeIds.delete(el);
          }, xoDuration);
          this.timeIds.set(el, timeId2);
        }
      });
      __publicField(this, "handleIntersection", (entries, observer2) => {
        let count2 = -1;
        entries.forEach((entry, index) => {
          var _a2, _b2, _c2;
          const el = entry.target;
          const { xoAnimate, xoType, xoCascade, xoOrder, xoStrength, xoDuration, xoConstant, xoEasing } = this.getOptions(el);
          el.setAttribute("xo-type", `${xoType}`);
          el.style.setProperty("--xo-strength", `${xoStrength}`);
          el.style.setProperty("--xo-constant", `${xoConstant}`);
          el.style.setProperty("--xo-duration", `${xoDuration}`);
          el.style.setProperty("--xo-easing", (_a2 = cssEasing[xoEasing]) != null ? _a2 : xoEasing);
          if (xoType === "width-increment" && el.offsetWidth > 0) {
            el.style.setProperty("--xo-width", `${el.offsetWidth}px`);
            el.style.width = "0px";
          }
          if (entry.isIntersecting) {
            if (xoAnimate === "scroll") {
              count2++;
              let order = -1;
              if ((_b2 = window.xbEditor) == null ? void 0 : _b2.designMode) {
                order = xoCascade ? count2 : xoOrder;
              } else {
                order = xoCascade ? index : xoOrder;
              }
              el.style.setProperty("--xo-order", `${order}`);
              attrBoolean.set(el, "xo-visible", true);
              attrBoolean.set(el, "xo-opacity", false);
              el.removeAttribute("aria-disabled");
              if (el.querySelector("svg")) {
                handleSVG(el, this.getOptions(el));
              }
              if ((_c2 = el.getAttribute("xo-type")) == null ? void 0 : _c2.startsWith("goo-")) {
                runSvgFilterAnimate(el, xoDuration);
              }
              this.handleWidthIncrement(el);
              observer2.unobserve(el);
            }
          } else {
            attrBoolean.set(el, "xo-visible", false);
          }
        });
      });
      __publicField(this, "handleMutation", (mutations) => {
        mutations.forEach(async (mutation) => {
          var _a2;
          const el = mutation.target;
          if (mutation.attributeName === "xo-observed" || mutation.attributeName === "xo-animate" || mutation.attributeName === "xo-type" || mutation.attributeName === "xo-duration") {
            const { xoAnimate, xoDuration } = this.getOptions(el);
            if (xoAnimate === "scroll") {
              attrBoolean.set(el, "xo-visible", true);
              if (el.querySelector("svg")) {
                revertSVG(el);
                handleSVG(el, this.getOptions(el));
              }
              if ((_a2 = el.getAttribute("xo-type")) == null ? void 0 : _a2.startsWith("xo-goo-")) {
                runSvgFilterAnimate(el, xoDuration);
              }
              this.handleWidthIncrement(el);
            } else if (xoAnimate === "svg-infinite") {
              this.handleSingleSVG(el);
            } else {
              attrBoolean.set(el, "xo-visible", false);
            }
          }
        });
      });
      __publicField(this, "getEls", () => {
        var _a2;
        return document.querySelectorAll(((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode) ? '[xo-animate="none"], [xo-animate="scroll"], [xo-animate="infinite"], [xo-animate="svg-infinite"]' : '[xo-animate="scroll"]');
      });
      __publicField(this, "handleSingleSVG", async (el) => {
        var _a2;
        const { xoDuration, xoEasing } = this.getOptions(el);
        if (el.querySelector("svg")) {
          revertSVG(el);
          el.style.setProperty("--xo-duration", `${xoDuration}`);
          el.style.setProperty("--xo-easing", (_a2 = cssEasing[xoEasing]) != null ? _a2 : xoEasing);
          el.classList.add("xo-animate-svg-none");
          handleInfiniteSVG(el);
          await delay(50);
          el.classList.remove("xo-animate-svg-none");
        }
      });
      __publicField(this, "svgInfinite", () => {
        const els = document.querySelectorAll('[xo-animate="svg-infinite"]');
        els.forEach(this.handleSingleSVG);
      });
      __publicField(this, "handleAllSvg", () => {
        const els = document.querySelectorAll('[xo-animate="scroll"], [xo-animate="svg-infinite"]');
        els.forEach((el) => {
          if (el.querySelector("svg")) {
            addPrevAttrForSvg(el);
          }
        });
      });
      __publicField(this, "initIntersection", () => {
        const els = this.getEls();
        els.forEach((el) => {
          this.observer.observe(el);
        });
      });
      __publicField(this, "first", () => {
        const els = this.getEls();
        els.forEach((el) => {
          const { xoAnimate } = this.getOptions(el);
          if (!attrBoolean.get(el, "xo-visible") && xoAnimate === "scroll") {
            attrBoolean.set(el, "xo-opacity", true);
            el.setAttribute("aria-disabled", "true");
          }
        });
      });
      __publicField(this, "initMutation", () => {
        const els = this.getEls();
        els.forEach((el) => {
          this.mutation.observe(el, {
            attributes: true,
            attributeFilter: ["xo-observed", "xo-animate", "xo-type", "xo-duration"]
          });
        });
      });
      __publicField(this, "update", async () => {
        await delay();
        this.init();
      });
      this.observer = new IntersectionObserver(this.handleIntersection, {
        rootMargin: "0px 0px -50px 0px"
      });
      this.mutation = new MutationObserver(this.handleMutation);
      this.updateMutation = new MutationObserver(this.update);
      this.updateMutation.observe(document.body, { attributes: true, attributeFilter: ["xo-animate-observed"] });
    }
    getOptions(el) {
      const options = getAttrs(el, {
        pick: ["xoAnimate", "xoDuration", "xoConstant", "xoOrder", "xoType", "xoEasing", "xoStrength", "xoCascade", "xoDisabled", "xoInfinite"],
        types: {
          xoAnimate: "string",
          xoDuration: "number",
          xoConstant: "number",
          xoOrder: "number",
          xoType: "string",
          xoEasing: "string",
          xoStrength: "number",
          xoCascade: "boolean",
          xoDisabled: "boolean",
          xoInfinite: "boolean"
        }
      });
      return {
        ..._AnimateScroll.defaultOptions,
        ...options
      };
    }
    init() {
      var _a2;
      this.observer.disconnect();
      this.mutation.disconnect();
      this.first();
      this.handleAllSvg();
      this.svgInfinite();
      this.initIntersection();
      if ((_a2 = window == null ? void 0 : window.xbEditor) == null ? void 0 : _a2.designMode) {
        this.initMutation();
      }
    }
  };
  let AnimateScroll = _AnimateScroll;
  __publicField(AnimateScroll, "defaultOptions", {
    xoAnimate: "none",
    xoDuration: (_V = (_U = window.settings) == null ? void 0 : _U.animate_duration) != null ? _V : 500,
    xoType: (_X = (_W = window.settings) == null ? void 0 : _W.animate_effect) != null ? _X : "fade-up",
    xoConstant: 75,
    xoOrder: 0,
    xoStrength: (_Z = (_Y = window.settings) == null ? void 0 : _Y.animate_strength) != null ? _Z : 1,
    xoEasing: "easeLight",
    xoCascade: false,
    xoDisabled: false,
    xoInfinite: false
  });
  const animate = new AnimateScroll();
  let elementAdded = false;
  if ((__ = window == null ? void 0 : window.xbEditor) == null ? void 0 : __.designMode) {
    animate.init();
    DOMLoaded(async () => {
      if (!elementAdded) {
        await delay(500);
        animate.init();
      }
    });
    document.addEventListener("xb:element:load", () => {
      elementAdded = true;
      animate.init();
    });
  } else {
    DOMLoaded(() => {
      animate.init();
    });
    if ((_$ = window.Shopify) == null ? void 0 : _$.designMode) {
      document.addEventListener("shopify:section:load", () => animate.init());
      document.addEventListener("shopify:section:reorder", () => animate.init());
    }
  }
  const styles$f = "";
  if (!isBot()) {
    requestIdleCallback$1(() => {
      renderSvgFilters();
    });
  }
  componentDefine({
    [WebComponent.Animate]: Animate
  });
  function getTouchDistance(touch1, touch2) {
    if (!touch2) {
      return Math.hypot(touch1.clientX, touch1.clientY);
    }
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.hypot(dx, dy);
  }
  const styles$e = "";
  const _ImageZoom = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "imageZoomItemEl", null);
      __publicField(this, "innerEl", null);
      __publicField(this, "thumbEl", null);
      __publicField(this, "zoomState", 4);
      __publicField(this, "zooming", false);
      __publicField(this, "touchOffsetX", 0);
      __publicField(this, "touchOffsetY", 0);
      __publicField(this, "clientX", 0);
      __publicField(this, "clientY", 0);
      __publicField(this, "pan", null);
      __publicField(this, "scale", 1);
      __publicField(this, "initialDistance", 0);
      __publicField(this, "mutationObserver", null);
      __publicField(this, "imageLoaded", false);
      __publicField(this, "hovered", false);
      __publicField(this, "_options");
      __publicField(this, "setOptions", () => {
        this.options = getAttrs(this, {
          pick: ["xoName", "xoZoom", "xoZoomSrc", "xoPlacement", "xoZoomFull", "xoUseWheel"],
          types: {
            xoName: "string",
            xoZoom: "number",
            xoZoomSrc: "string",
            xoPlacement: "string",
            xoZoomFull: "boolean",
            xoUseWheel: "boolean"
          }
        });
      });
      __publicField(this, "handleThumb", (x, y) => {
        const thumbEl = this.thumbEl;
        const { offsetWidth, offsetHeight } = this;
        const thumbWidth = offsetWidth / this.zoomState;
        const thumbHeight = offsetHeight / this.zoomState;
        const thumbTop = clamp(y - thumbEl.offsetHeight / 2, 0, offsetHeight - thumbEl.offsetHeight);
        const thumbLeft = clamp(x - thumbEl.offsetWidth / 2, 0, offsetWidth - thumbEl.offsetWidth);
        thumbEl.style.width = `${thumbWidth}px`;
        thumbEl.style.height = `${thumbHeight}px`;
        thumbEl.style.top = `${thumbTop}px`;
        thumbEl.style.left = `${thumbLeft}px`;
      });
      __publicField(this, "handleZoomImage", (translateX, translateY) => {
        const { xoZoomSrc, xoZoomFull } = this.options;
        const imageZoomItemEl = this.imageZoomItemEl;
        if (xoZoomFull) {
          attrBoolean.set(this, "xo-active", this.zoomState > 1);
        } else {
          attrBoolean.set(this, "xo-active", true);
        }
        const imgEl = this.querySelector("img");
        imageZoomItemEl.setAttribute("xo-zoom", `${this.zoomState}`);
        if (imgEl) {
          if (this.imageLoaded) {
            imageZoomItemEl.style.backgroundImage = `url('${xoZoomSrc}')`;
          } else {
            imageZoomItemEl.style.backgroundImage = `url('${imgEl.src}')`;
          }
        }
        imageZoomItemEl.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${this.zoomState})`;
        if (!this.imageLoaded) {
          const image = new Image();
          image.src = xoZoomSrc;
          image.onload = () => {
            imageZoomItemEl.style.backgroundImage = `url('${xoZoomSrc}')`;
            this.imageLoaded = true;
          };
        }
      });
      __publicField(this, "resetTransform", () => {
        const imageZoomItemEl = this.imageZoomItemEl;
        imageZoomItemEl.style.transform = `translate3d(0, 0, 0) scale(1)`;
        imageZoomItemEl.removeAttribute("xo-zoom");
      });
      __publicField(this, "handler", (event) => {
        var _a2;
        const { xoPlacement, xoUseWheel } = this.options;
        let offsetX = 0;
        let offsetY = 0;
        if (event.type === "touchmove") {
          offsetX = this.touchOffsetX;
          offsetY = this.touchOffsetY;
        } else {
          offsetX = event.offsetX;
          offsetY = event.offsetY;
        }
        const { offsetWidth, offsetHeight } = this;
        const isCenter = xoPlacement === "center";
        const thumbWidth = offsetWidth / this.zoomState;
        const thumbHeight = offsetHeight / this.zoomState;
        const halfWidth = isCenter ? 0 : thumbWidth / 2;
        const halfHeight = isCenter ? 0 : thumbHeight / 2;
        const translateX = interpolate({
          value: offsetX,
          inputRange: [halfWidth, offsetWidth - halfWidth],
          outputRange: [0, -(offsetWidth * (this.zoomState - 1))]
        });
        const translateY = interpolate({
          value: offsetY,
          inputRange: [halfHeight, offsetHeight - halfHeight],
          outputRange: [0, -(offsetHeight * (this.zoomState - 1))]
        });
        (_a2 = this.pan) == null ? void 0 : _a2.setValue({ dx: translateX, dy: translateY });
        this.handleZoomImage(translateX, translateY);
        this.handleThumb(offsetX, offsetY);
        if (!device.mobile() && xoUseWheel && !this.hovered) {
          this.addEventListener("wheel", this.handleWheel);
        }
        this.hovered = true;
      });
      __publicField(this, "handleMouseLeave", () => {
        const { xoZoom, xoZoomFull } = this.options;
        if (!xoZoomFull) {
          attrBoolean.set(this, "xo-active", false);
          this.zoomState = xoZoom;
        }
        this.removeEventListener("wheel", this.handleWheel);
        this.hovered = false;
      });
      __publicField(this, "handleWheel", (event) => {
        event.preventDefault();
        const { deltaY } = event;
        this.zoomState = clamp(this.zoomState + deltaY / 60, 1, 10);
        this.handler(event);
      });
      __publicField(this, "handleWindowClick", (event) => {
        if (!this.contains(event.target)) {
          attrBoolean.set(this, "xo-active", false);
          this.resetTransform();
          this.zoomState = this.options.xoZoom;
        }
      });
      __publicField(this, "handleTouchMove", (event) => {
        if (event.targetTouches[0] && event.targetTouches[1]) {
          event.preventDefault();
          const currentDistance = getTouchDistance(event.targetTouches[0], event.targetTouches[1]);
          const zoomFactor = currentDistance / this.initialDistance;
          this.zoomState = this.scale * zoomFactor;
          if (this.zoomState > 1) {
            this.zooming = true;
          } else {
            this.zooming = false;
          }
          this.handler(event);
        }
      });
      __publicField(this, "handleTouchEnd", (event) => {
        if (event.touches.length === 0) {
          const transform = window.getComputedStyle(this.imageZoomItemEl).transform;
          if (transform !== "none") {
            const matrix = new WebKitCSSMatrix(transform);
            this.scale = matrix.a;
          }
          document.removeEventListener("touchmove", this.handleTouchMove);
          document.removeEventListener("touchend", this.handleTouchEnd);
        }
      });
      __publicField(this, "handleTouchStart", (event) => {
        if (event.targetTouches[0] && event.targetTouches[1]) {
          this.initialDistance = getTouchDistance(event.targetTouches[0], event.targetTouches[1]);
          const rect = event.target.getBoundingClientRect();
          const clientX1 = event.targetTouches[0].clientX;
          const clientY1 = event.targetTouches[0].clientY;
          const clientX2 = event.targetTouches[1].clientX;
          const clientY2 = event.targetTouches[1].clientY;
          this.clientX = (clientX1 + clientX2) / 2;
          this.clientY = (clientY1 + clientY2) / 2;
          this.touchOffsetX = (this.clientX - rect.left) / this.scale;
          this.touchOffsetY = (this.clientY - rect.top) / this.scale;
          document.addEventListener("touchmove", this.handleTouchMove, { passive: false });
          document.addEventListener("touchend", this.handleTouchEnd);
        }
      });
      __publicField(this, "handleMutation", () => {
        const galleryPortalEl = this.closest(WebComponent.GalleryPortal);
        if (!attrBoolean.get(galleryPortalEl, "xo-active")) {
          this.scale = 1;
          this.initialDistance = 0;
        }
      });
    }
    get options() {
      return {
        ..._ImageZoom.defaultOptions,
        ...this._options
      };
    }
    set options(value) {
      this._options = value;
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    createChild() {
      const { xoPlacement, xoName } = this.options;
      this.thumbEl = document.createElement(WebComponent.ImageZoomThumb);
      this.imageZoomItemEl = document.createElement(WebComponent.ImageZoomItem);
      if (xoPlacement === "manual") {
        this.innerEl = document.querySelector(`${WebComponent.ImageZoomManual}[xo-name="${xoName}"]`);
      } else {
        this.innerEl = document.createElement(WebComponent.ImageZoomInner);
      }
      this.innerEl.appendChild(this.imageZoomItemEl);
      this.appendChild(this.innerEl);
      if (xoPlacement !== "center") {
        this.appendChild(this.thumbEl);
      }
    }
    onConnected() {
      this.setOptions();
      const { xoPlacement, xoZoom, xoZoomFull } = this.options;
      this.zoomState = xoZoom;
      this.setAttribute("xo-placement", xoPlacement);
      this.createChild();
      if (device.mobile()) {
        if (xoZoomFull) {
          this.addEventListener("touchstart", this.handleTouchStart);
          this.pan = panGesture({
            element: this,
            onStart: (event) => {
              if (this.zooming) {
                event.preventDefault();
              }
            },
            onMove: (gestureState) => {
              if (this.zooming) {
                this.handleZoomImage(gestureState.dx, gestureState.dy);
              }
            }
          });
        }
      } else {
        this.addEventListener("mousemove", this.handler);
        this.addEventListener("mouseleave", this.handleMouseLeave);
      }
      window.addEventListener("click", this.handleWindowClick);
      const galleryPortalEl = this.closest(WebComponent.GalleryPortal);
      if (galleryPortalEl) {
        this.mutationObserver = new MutationObserver(this.handleMutation);
        this.mutationObserver.observe(galleryPortalEl, { attributes: true, attributeFilter: ["xo-active"] });
      }
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue !== newValue) {
        this.setOptions();
        this.zoomState = this.options.xoZoom;
      }
    }
    disconnectedCallback() {
      var _a2;
      this.removeEventListener("mousemove", this.handler);
      this.removeEventListener("mouseleave", this.handleMouseLeave);
      this.removeEventListener("wheel", this.handleWheel);
      window.removeEventListener("click", this.handleWindowClick);
      this.removeEventListener("touchstart", this.handleTouchStart);
      document.removeEventListener("touchmove", this.handleTouchMove);
      document.removeEventListener("touchend", this.handleTouchEnd);
      (_a2 = this.pan) == null ? void 0 : _a2.destroy();
    }
  };
  let ImageZoom = _ImageZoom;
  __publicField(ImageZoom, "defaultOptions", {
    xoName: "",
    xoZoom: 4,
    xoZoomSrc: "",
    xoPlacement: "center",
    xoZoomFull: false,
    xoUseWheel: true
  });
  __publicField(ImageZoom, "observeOnMount", true);
  componentDefine({
    [WebComponent.ImageZoom]: ImageZoom
  });
  const styles$d = "";
  class Countdown extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "daysEl", null);
      __publicField(this, "hoursEl", null);
      __publicField(this, "minutesEl", null);
      __publicField(this, "secondsEl", null);
      __publicField(this, "setDefaultText", () => {
        if (this.daysEl) {
          this.daysEl.innerText = this.setZeroPad("0");
        }
        if (this.hoursEl) {
          this.hoursEl.innerText = this.setZeroPad("0");
        }
        if (this.minutesEl) {
          this.minutesEl.innerText = this.setZeroPad("0");
        }
        if (this.secondsEl) {
          this.secondsEl.innerText = this.setZeroPad("0");
        }
      });
      __publicField(this, "handleCountdown", () => {
        const timestamp = this.getAttribute("xo-timestamp");
        if (!timestamp) {
          throw new Error(`${WebComponent.Countdown}: Attribute xo-timestamp is required.`);
        }
        const deadline = Number(timestamp);
        const distance2 = deadline - Date.now();
        if (!this.daysEl) {
          this.daysEl = this.querySelector(WebComponent.CountdownDay);
        }
        if (!this.hoursEl) {
          this.hoursEl = this.querySelector(WebComponent.CountdownHour);
        }
        if (!this.minutesEl) {
          this.minutesEl = this.querySelector(WebComponent.CountdownMinute);
        }
        if (!this.secondsEl) {
          this.secondsEl = this.querySelector(WebComponent.CountdownSecond);
        }
        if (distance2 > 0) {
          const days = this.getDays(distance2);
          const hours = this.getHours(distance2);
          const minutes = this.getMinutes(distance2);
          const seconds = this.getSeconds(distance2);
          if (this.daysEl && Number(this.daysEl.innerText) !== days) {
            if (days < 1) {
              this.daysEl.innerText = this.setZeroPad("0");
            } else {
              this.daysEl.innerText = this.setZeroPad(`${days}`);
            }
          }
          if (this.hoursEl && Number(this.hoursEl.innerText) !== hours) {
            this.hoursEl.innerText = this.setZeroPad(`${hours}`);
          }
          if (this.minutesEl && Number(this.minutesEl.innerText) !== minutes) {
            this.minutesEl.innerText = this.setZeroPad(`${minutes}`);
          }
          if (this.secondsEl && Number(this.secondsEl.innerText) !== seconds) {
            this.secondsEl.innerText = this.setZeroPad(`${seconds}`);
          }
          attrBoolean.set(this, "xo-expired", false);
        } else {
          frameManager.remove(this.handleCountdown);
          attrBoolean.set(this, "xo-expired", true);
          this.setDefaultText();
        }
      });
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    getDays(distance2) {
      return Math.floor(distance2 / (1e3 * 60 * 60 * 24));
    }
    getHours(distance2) {
      return Math.floor(distance2 % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
    }
    getMinutes(distance2) {
      return Math.floor(distance2 % (1e3 * 60 * 60) / (1e3 * 60));
    }
    getSeconds(distance2) {
      return Math.floor(distance2 % (1e3 * 60) / 1e3);
    }
    setZeroPad(value) {
      const zeroPad = Number(this.getAttribute("xo-zero-pad")) || 1;
      return value.padStart(zeroPad, "0");
    }
    onConnected() {
      frameManager.add(this.handleCountdown, true);
      this.daysEl = this.querySelector(WebComponent.CountdownDay);
      this.hoursEl = this.querySelector(WebComponent.CountdownHour);
      this.minutesEl = this.querySelector(WebComponent.CountdownMinute);
      this.secondsEl = this.querySelector(WebComponent.CountdownSecond);
      this.setDefaultText();
    }
    disconnectedCallback() {
      frameManager.remove(this.handleCountdown);
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if (name === "xo-observed" && oldValue !== newValue) {
        await delay(100);
        this.disconnectedCallback();
        this.onConnected();
      }
    }
  }
  __publicField(Countdown, "observeOnMount", true);
  componentDefine({
    [WebComponent.Countdown]: Countdown
  });
  let Countto = (_aa = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "observer", null);
      __publicField(this, "animated", createAnimate());
      __publicField(this, "attrAnimated", createAnimate());
      __publicField(this, "timeId", -1);
      __publicField(this, "handleCountto", async () => {
        const { xoFrom, xoTo, xoDuration, xoDelay, xoEasing } = this.props;
        const numberEl = this.querySelector(WebComponent.CounttoNumber);
        this.timeId = window.setTimeout(() => {
          this.animated({
            from: xoFrom,
            to: xoTo,
            duration: xoDuration,
            onUpdate: (value) => {
              var _a2;
              const fractionDigits = ((_a2 = xoTo.toString().split(".")[1]) == null ? void 0 : _a2.length) || 0;
              const num = value.toFixed(fractionDigits);
              if (numberEl) {
                numberEl.textContent = `${num}`;
              } else {
                this.textContent = `${num}`;
              }
            }
          });
          this.attrAnimated({
            from: xoFrom,
            to: xoTo,
            duration: xoDuration,
            easing: easings[xoEasing],
            onUpdate: (value) => {
              this.style.setProperty("--xo-value", `${value}`);
            }
          });
        }, xoDelay);
      });
    }
    mount() {
      if (device.mobile() && reduceMotion()) {
        this.setProps({ xoDuration: 0, xoDelay: 0 });
        this.handleCountto();
        return;
      }
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          var _a2;
          if (entry.isIntersecting) {
            this.handleCountto();
            (_a2 = this.observer) == null ? void 0 : _a2.unobserve(this);
          }
        });
      }, {
        rootMargin: "0px 0px -50px 0px"
      });
      this.observer.observe(this);
    }
    propUpdate({ name, prevProp, nextProp }) {
      if (name === "xoObserved" && prevProp != null && prevProp !== nextProp) {
        clearTimeout(this.timeId);
        this.animated.off();
        this.attrAnimated.off();
        this.handleCountto();
      }
    }
    unmount() {
      var _a2;
      (_a2 = this.observer) == null ? void 0 : _a2.unobserve(this);
      this.animated.off();
      this.attrAnimated.off();
    }
  }, __publicField(_aa, "propTypes", {
    xoFrom: "number",
    xoTo: "number",
    xoDuration: "number",
    xoDelay: "number",
    xoEasing: "string"
  }), __publicField(_aa, "defaultProps", {
    xoFrom: 0,
    xoTo: 100,
    xoDuration: 2e3,
    xoDelay: 0,
    xoEasing: "ease"
  }), __publicField(_aa, "observedProps", ["xoObserved"]), _aa);
  Countto = __decorate([
    customElements$1(WebComponent.Countto)
  ], Countto);
  function changeUrlVimeo(url, autoplay = true) {
    const id2 = url.replace(/(^.*(video|vimeo\.com)\/)(\w*)(.*$)/g, "$3");
    return `https://player.vimeo.com/video/${id2}?autoplay=${autoplay ? "1" : "0"}&autopause=0&loop=1&background=1&muted=1`;
  }
  function changeUrlYoutube(url, autoplay = true) {
    const id2 = url.replace(/(^.*(embed\/|(\?|&)v=))(\w*)(.*$)/g, "$4");
    return `https://www.youtube.com/embed/${id2}?autoplay=${autoplay ? "1" : "0"}&loop=1&mute=1&controls=0&iv_load_policy=1&disablekb=1&playlist=${id2}&modestbranding=1&playsinline=1&enablejsapi=1`;
  }
  function changeUrl(url, autoplay) {
    if (isVimeo(url)) {
      return changeUrlVimeo(url, autoplay);
    }
    if (isYoutube(url)) {
      return changeUrlYoutube(url, autoplay);
    }
    return url;
  }
  async function getYoutubeAspectRatio(url) {
    const res = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
    const data = await res.json();
    return data.width / data.height;
  }
  class VideoCover extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "_options");
      __publicField(this, "videoRatio", 16 / 9);
      __publicField(this, "itemEl", null);
      __publicField(this, "videoEl", null);
      __publicField(this, "getAutoplay", () => {
        const { xoAutoplay = true } = this.options;
        return xoAutoplay ? "autoplay" : "";
      });
      __publicField(this, "renderVimeo", (url) => {
        return `<${WebComponent.VideoCoverItem}>
      <iframe
        src="${url}"
        title="Vimeo video"
        frameborder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; allowsInlineMediaPlayback; ${this.getAutoplay()}"
        allowfullscreen
        loading="lazy"
      ></iframe>
    </${WebComponent.VideoCoverItem}>`;
      });
      __publicField(this, "renderYoutube", (url) => {
        return `<${WebComponent.VideoCoverItem}>
      <iframe
        src="${url}"
        title="YouTube video"
        frameborder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; allowsInlineMediaPlayback; ${this.getAutoplay()}"
        allowfullscreen
        allowsInlineMediaPlayback
        loading="lazy"
      ></iframe>
    </${WebComponent.VideoCoverItem}>`;
      });
      __publicField(this, "renderVideo", (url) => {
        return `<${WebComponent.VideoCoverItem}>
      <video
        src="${url}"
        title="Video"
        ${this.getAutoplay()}
        muted
        loop
        playsinline
        preload="metadata"
        loading="lazy"
      ></video>
    </${WebComponent.VideoCoverItem}>`;
      });
      __publicField(this, "setVideoSize", () => {
        if (!!this.itemEl) {
          const containerRatio = this.offsetWidth / this.offsetHeight;
          if (this.videoRatio > containerRatio) {
            this.itemEl.style.height = `${this.offsetHeight}px`;
            this.itemEl.style.width = `${this.offsetHeight * this.videoRatio}px`;
          } else {
            this.itemEl.style.width = `${this.offsetWidth + 1}px`;
            this.itemEl.style.height = `${this.offsetWidth / this.videoRatio}px`;
          }
        }
      });
      __publicField(this, "handleVideoRatio", () => {
        if (!!this.videoEl) {
          this.videoRatio = this.videoEl.videoWidth / this.videoEl.videoHeight;
          this.setVideoSize();
        }
      });
      __publicField(this, "handleYoutubeRatio", async () => {
        try {
          this.videoRatio = await getYoutubeAspectRatio(this.options.xoSrc);
          this.setVideoSize();
        } catch {
          console.log("error");
        }
      });
      __publicField(this, "handleVideo", () => {
        if (this.videoEl instanceof HTMLVideoElement) {
          if (this.videoEl.readyState >= 2) {
            this.handleVideoRatio();
          } else {
            this.videoEl.addEventListener("loadedmetadata", this.handleVideoRatio);
          }
        }
      });
      __publicField(this, "assignEl", () => {
        var _a2;
        this.itemEl = this.querySelector(WebComponent.VideoCoverItem);
        this.videoEl = (_a2 = this.itemEl) == null ? void 0 : _a2.querySelector("iframe, video");
      });
      __publicField(this, "init", () => {
        this.setOptions();
        const { xoSrc, xoAutoplay = true } = this.options;
        const videoUrl = changeUrl(xoSrc, xoAutoplay);
        if (isVimeo(xoSrc)) {
          this.insertAdjacentHTML("beforeend", this.renderVimeo(videoUrl));
          this.assignEl();
          this.setVideoSize();
        } else if (isYoutube(xoSrc)) {
          this.insertAdjacentHTML("beforeend", this.renderYoutube(videoUrl));
          this.assignEl();
          this.handleYoutubeRatio();
        } else {
          this.insertAdjacentHTML("beforeend", this.renderVideo(videoUrl));
          this.assignEl();
          this.handleVideo();
        }
      });
      __publicField(this, "destroy", () => {
        const itemEls = Array.from(this.querySelectorAll(WebComponent.VideoCoverItem));
        itemEls.forEach((itemEl) => itemEl.remove());
        if (this.videoEl instanceof HTMLVideoElement) {
          this.videoEl.removeEventListener("loadedmetadata", this.handleVideo);
        }
      });
      __publicField(this, "handleResize", debounce(resizeAxis("x", () => {
        this.destroy();
        this.init();
      }), 400));
    }
    static get observedAttributes() {
      return ["xo-observed", "xo-src", "xo-breakpoints", "xo-autoplay"];
    }
    get options() {
      return this._options;
    }
    set options(value) {
      this._options = value;
    }
    setOptions() {
      var _a2;
      const options = getAttrs(this, {
        pick: ["xoSrc", "xoBreakpoints", "xoAutoplay"],
        types: {
          xoSrc: "string",
          xoBreakpoints: "object",
          xoAutoplay: "boolean"
        }
      });
      const breakpointOptions = getBreakpointsOptions(options.xoBreakpoints);
      this.options = options;
      if (breakpointOptions) {
        this.options = {
          ...options,
          xoSrc: (_a2 = breakpointOptions == null ? void 0 : breakpointOptions.src) != null ? _a2 : options.xoSrc
        };
      }
    }
    run() {
      if (this.querySelector("video, iframe")) {
        return;
      }
      this.init();
      attrBoolean.set(this, "xo-playing", true);
      attrBoolean.set(this, "xo-paused", false);
      this.dispatchEvent(new CustomEvent("xo-video-cover:init"));
      window.addEventListener("resize", this.handleResize);
    }
    pause() {
      attrBoolean.set(this, "xo-paused", true);
      attrBoolean.set(this, "xo-playing", false);
    }
    onConnected() {
      if (this.closest(WebComponent.CarouselInner)) {
        return;
      }
      this.init();
      this.dispatchEvent(new CustomEvent("xo-video-cover:init"));
      window.addEventListener("resize", this.handleResize);
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if ((name === "xo-observed" || name === "xo-src" || name === "xo-breakpoints") && oldValue != null && oldValue !== newValue) {
        await delay(0);
        this.destroy();
        this.init();
      }
    }
    disconnectedCallback() {
      window.removeEventListener("resize", this.handleResize);
      this.destroy();
    }
  }
  __publicField(VideoCover, "observeOnMount", true);
  let VideoCoverButton = class VideoCoverButton2 extends XoComponent {
    constructor() {
      super();
      __publicField(this, "wcVideoEl", null);
      __publicField(this, "handleClick", () => {
        this.setState((prevState) => ({
          isPlaying: !prevState.isPlaying
        }));
      });
      __publicField(this, "handleVideoInit", () => {
        var _a2;
        const autoplayAttr = (_a2 = this.wcVideoEl) == null ? void 0 : _a2.getAttribute("xo-autoplay");
        this.setState({
          isPlaying: autoplayAttr ? autoplayAttr == "true" : true
        });
      });
      this.state = {
        isPlaying: void 0
      };
    }
    mount() {
      var _a2;
      this.wcVideoEl = this.closest(WebComponent.VideoCover);
      (_a2 = this.wcVideoEl) == null ? void 0 : _a2.addEventListener("xo-video-cover:init", this.handleVideoInit);
      this.addEventListener("click", this.handleClick);
    }
    unmount() {
      var _a2;
      (_a2 = this.wcVideoEl) == null ? void 0 : _a2.removeEventListener("xo-video-cover:init", this.handleVideoInit);
      this.removeEventListener("click", this.handleClick);
    }
    stateUpdate(prevState) {
      const { isPlaying } = this.state;
      if (prevState.isPlaying !== isPlaying) {
        const wcVideoEl = this.closest(WebComponent.VideoCover);
        const videoEl = wcVideoEl == null ? void 0 : wcVideoEl.querySelector("video, iframe");
        if (videoEl && wcVideoEl) {
          if (isPlaying) {
            playVideo(videoEl);
            attrBoolean.set(wcVideoEl, "xo-playing", true);
            attrBoolean.set(wcVideoEl, "xo-paused", false);
          } else {
            pauseVideo(videoEl);
            attrBoolean.set(wcVideoEl, "xo-paused", true);
            attrBoolean.set(wcVideoEl, "xo-playing", false);
          }
        }
      }
    }
  };
  VideoCoverButton = __decorate([
    customElements$1(WebComponent.VideoCoverButton),
    __metadata("design:paramtypes", [])
  ], VideoCoverButton);
  const styles$c = "";
  componentDefine({
    [WebComponent.VideoCover]: VideoCover
  });
  function renderGoo() {
    const goo = `
    <svg class="xo-hidden">
    <defs>
      <filter id="xo-typing-goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur"></feGaussianBlur>
        <feColorMatrix in="blur" mode="matrix" values="	1 0 0 0 0
                  0 1 0 0 0
                  1 0 1 0 0
                  0 0 0 18 -8" result="goo"></feColorMatrix>
        <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
    </filter>
    </defs>
  </svg>
  `;
    document.body.insertAdjacentHTML("beforeend", goo);
  }
  const DEFAULT_FPS$1 = 60;
  const DT_FPS$1 = 1e3 / DEFAULT_FPS$1;
  const _Goo = class {
    constructor(el, options) {
      __publicField(this, "el");
      __publicField(this, "options");
      __publicField(this, "line", 0);
      __publicField(this, "start", Date.now());
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "animated", createAnimate());
      __publicField(this, "typingContent", null);
      __publicField(this, "init", () => {
        const { xoDuration, xoDelay } = this.options;
        const content = `<${WebComponent.TypingInner} style="--xo-duration: ${xoDuration}; --xo-delay: ${xoDelay}"><${WebComponent.TypingContent}></${WebComponent.TypingContent}></${WebComponent.TypingInner}>`;
        this.el.innerHTML = content;
        this.typingContent = this.el.querySelector(WebComponent.TypingContent);
        this.el.style.filter = "url(#xo-typing-goo)";
      });
      __publicField(this, "handleGoo", (type) => {
        const { xoDuration } = this.options;
        const feBlur = document.querySelector(`#xo-typing-goo feGaussianBlur`);
        this.animated({
          from: type === "inc" ? 0 : 8,
          to: type === "inc" ? 8 : 0,
          duration: xoDuration,
          onUpdate(value) {
            feBlur == null ? void 0 : feBlur.setAttribute("stdDeviation", value.toString());
          }
        });
      });
      __publicField(this, "handleFrame", async () => {
        const { xoContent, xoDuration, xoDelay } = this.options;
        const ellapsed = Date.now() - this.start;
        if (ellapsed > xoDelay) {
          attrBoolean.set(this.el, "xo-goo", true);
          this.handleGoo("inc");
          this.start = Date.now();
          this.animated.off();
          this.handleGoo("dec");
          this.cancel = await delay(xoDuration - DT_FPS$1);
          attrBoolean.set(this.el, "xo-goo", false);
          this.line = (this.line + 1) % xoContent.length;
        }
        const text = xoContent[this.line];
        const nextLine = (this.line + 1) % xoContent.length;
        const nextText = xoContent[nextLine];
        const content = `<span>${text}</span><span>${nextText}</span>`;
        const spanEls = Array.from(this.el.querySelectorAll("span"));
        each(spanEls, (spanEl, index) => {
          const width = spanEl.offsetWidth;
          this.el.style.setProperty(`--xo-width-${index}`, `${width}px`);
        });
        if (this.typingContent && this.typingContent.innerHTML !== content) {
          this.typingContent.innerHTML = content;
        }
      });
      __publicField(this, "destroy", () => {
        frameManager.remove(this.handleFrame);
        this.cancel();
        this.animated.off();
      });
      this.el = el;
      this.options = options;
      this.el = el;
      this.options = {
        ..._Goo.defaultOptions,
        ...options
      };
      frameManager.add(this.handleFrame, true);
      this.init();
    }
  };
  let Goo = _Goo;
  __publicField(Goo, "defaultOptions", {
    xoContent: [],
    xoDuration: 1e3,
    xoDelay: 2e3,
    xoEffect: "typing"
  });
  const _Slide = class {
    constructor(el, options) {
      __publicField(this, "el");
      __publicField(this, "options");
      __publicField(this, "line", 0);
      __publicField(this, "start", Date.now());
      __publicField(this, "cancel", () => {
      });
      __publicField(this, "typingContent", null);
      __publicField(this, "init", () => {
        const { xoDuration, xoDelay } = this.options;
        const content = `<${WebComponent.TypingInner} style="--xo-duration: ${xoDuration}; --xo-delay: ${xoDelay}"><${WebComponent.TypingContent}></${WebComponent.TypingContent}></${WebComponent.TypingInner}>`;
        this.el.innerHTML = content;
        this.typingContent = this.el.querySelector(WebComponent.TypingContent);
      });
      __publicField(this, "handleFrame", async () => {
        const { xoContent, xoDuration, xoDelay } = this.options;
        const ellapsed = Date.now() - this.start;
        if (ellapsed > xoDelay) {
          attrBoolean.set(this.el, "xo-slide", true);
          this.start = Date.now();
          this.cancel = await delay(xoDuration - DT_FPS$1);
          attrBoolean.set(this.el, "xo-slide", false);
          this.line = (this.line + 1) % xoContent.length;
        }
        const text = xoContent[this.line];
        const nextLine = (this.line + 1) % xoContent.length;
        const nextText = xoContent[nextLine];
        const content = `<span>${text}</span><span>${nextText}</span>`;
        const spanEls = Array.from(this.el.querySelectorAll("span"));
        each(spanEls, (spanEl, index) => {
          const width = spanEl.offsetWidth;
          this.el.style.setProperty(`--xo-width-${index}`, `${width}px`);
        });
        if (this.typingContent && this.typingContent.innerHTML !== content) {
          this.typingContent.innerHTML = content;
        }
      });
      __publicField(this, "destroy", () => {
        frameManager.remove(this.handleFrame);
        this.cancel();
      });
      this.el = el;
      this.options = options;
      this.el = el;
      this.options = {
        ..._Slide.defaultOptions,
        ...options
      };
      frameManager.add(this.handleFrame, true);
      this.init();
    }
  };
  let Slide = _Slide;
  __publicField(Slide, "defaultOptions", {
    xoContent: [],
    xoDuration: 300,
    xoDelay: 2e3,
    xoEffect: "typing"
  });
  const _Typing = class {
    constructor(el, options) {
      __publicField(this, "el");
      __publicField(this, "options");
      __publicField(this, "type", "");
      __publicField(this, "line", -1);
      __publicField(this, "minIndex", -1);
      __publicField(this, "sameText", "");
      __publicField(this, "index", -1);
      __publicField(this, "start", Date.now());
      __publicField(this, "start2", Date.now());
      __publicField(this, "start3", Date.now());
      __publicField(this, "increasing", true);
      __publicField(this, "handleFrame", () => {
        const { xoContent, xoDuration, xoDelay, xoCursorChar } = this.options;
        if (this.index === this.minIndex) {
          this.line = (this.line + 1) % xoContent.length;
          this.increasing = true;
          this.sameText = "";
          this.minIndex = -1;
        }
        const deleteDuration = 30;
        const text = xoContent[this.line];
        const delay2 = xoDelay + (xoDuration + deleteDuration) * text.length;
        if (xoContent.length > 1) {
          const nextLine = (this.line + 1) % xoContent.length;
          const nextText = xoContent[nextLine];
          if (!this.increasing) {
            for (let i = 0; i < text.length; i++) {
              const char = text[i];
              if (new RegExp(`^${this.sameText}`, "g").test(nextText)) {
                this.minIndex = this.sameText.length - 1;
                this.sameText += char;
              } else {
                break;
              }
            }
          }
        }
        const ellapsed = Date.now() - this.start;
        if (ellapsed > xoDuration) {
          if (this.increasing && this.index < text.length - 1) {
            this.index = (this.index + 1) % text.length;
            this.start = Date.now();
          }
        }
        if (this.index === text.length - 1) {
          const ellapsed2 = Date.now() - this.start2;
          if (ellapsed2 > delay2) {
            this.increasing = false;
            this.start2 = Date.now();
          }
        }
        const ellapsed3 = Date.now() - this.start3;
        if (!this.increasing && ellapsed3 > deleteDuration) {
          this.index = this.index - 1;
          this.start3 = Date.now();
        }
        this.type = text.substring(0, Math.min(this.index + 1, text.length));
        if (this.el.innerHTML !== this.type) {
          this.el.innerHTML = this.type;
        }
        const height = this.el.offsetHeight;
        const width = this.el.offsetWidth;
        if (height > 0) {
          this.el.style.setProperty("--xo-height", `${height}px`);
        }
        this.el.style.setProperty("--xo-width", `${width}px`);
        this.el.setAttribute("xo-cursor-char", `${xoCursorChar}`);
      });
      __publicField(this, "destroy", () => {
        frameManager.remove(this.handleFrame);
      });
      this.el = el;
      this.options = options;
      this.el = el;
      this.options = {
        ..._Typing.defaultOptions,
        ...options
      };
      frameManager.add(this.handleFrame, true);
    }
  };
  let Typing = _Typing;
  __publicField(Typing, "defaultOptions", {
    xoContent: [],
    xoDuration: 100,
    xoDelay: 2e3,
    xoEffect: "typing",
    xoCursorChar: "|"
  });
  let TypingFactory = (_ba = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "typing", null);
      __publicField(this, "slide", null);
      __publicField(this, "goo", null);
      __publicField(this, "isReady", false);
      __publicField(this, "init", () => {
        if (this.isReady) {
          return;
        }
        this.isReady = true;
        const { xoEffect } = this.props;
        switch (xoEffect) {
          case "slide":
            this.slide = new Slide(this, this.props);
            break;
          case "goo":
            this.goo = new Goo(this, this.props);
            break;
          case "typing":
          default:
            this.typing = new Typing(this, this.props);
            break;
        }
      });
      __publicField(this, "destroy", () => {
        var _a2, _b2, _c2;
        (_a2 = this.typing) == null ? void 0 : _a2.destroy();
        (_b2 = this.slide) == null ? void 0 : _b2.destroy();
        (_c2 = this.goo) == null ? void 0 : _c2.destroy();
        this.isReady = false;
      });
      __publicField(this, "propUpdate", async ({ name, prevProp, nextProp }) => {
        if ((name === "xoDuration" || name === "xoContent" || name === "xoDelay" || name === "xoEffect" || name === "xoCursorChar") && prevProp !== nextProp) {
          await delay(100);
          this.destroy();
          this.init();
        }
      });
    }
    mount() {
      this.init();
    }
    unmount() {
      this.destroy();
    }
  }, __publicField(_ba, "propTypes", {
    xoContent: "array",
    xoDuration: "number",
    xoDelay: "number",
    xoEffect: "string",
    xoCursorChar: "string"
  }), __publicField(_ba, "observedProps", ["xoEffect", "xoContent", "xoCursorChar", "xoDelay", "xoDuration"]), _ba);
  TypingFactory = __decorate([
    customElements$1(WebComponent.Typing)
  ], TypingFactory);
  const styles$b = "";
  if (!isBot()) {
    renderGoo();
  }
  const Axis = {
    Idle: "idle",
    Target: "target",
    Lock: "lock"
  };
  const THRESHOLD = 6;
  const _ImageComparison = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "handleEl");
      __publicField(this, "pan", null);
      __publicField(this, "animated", createAnimate());
      __publicField(this, "prevDx", 0);
      __publicField(this, "keyboardDx", 0);
      __publicField(this, "axis", Axis.Idle);
      __publicField(this, "intersectionObserver", null);
      __publicField(this, "setVariables", (value) => {
        this.style.setProperty("--xo-value", `${value}`);
        this.setAttribute("xo-value", `${value}`);
      });
      __publicField(this, "handleDefaultAnimate", () => {
        const { xoDefaultPercent, xoAnimate } = this.getOptions();
        const isReduced2 = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
        if (isReduced2) {
          this.setVariables(xoDefaultPercent);
          return;
        }
        if (!xoAnimate) {
          this.setVariables(xoDefaultPercent);
          return;
        }
        this.intersectionObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            var _a2;
            if (entry.isIntersecting) {
              (_a2 = this.intersectionObserver) == null ? void 0 : _a2.unobserve(this);
              this.animated({
                from: 0,
                to: xoDefaultPercent,
                duration: 2e3,
                easing: easings.spring,
                onUpdate: this.animateUpdate
              });
            }
          });
        }, { rootMargin: "0px 0px -200px 0px" });
        this.intersectionObserver.observe(this);
      });
      __publicField(this, "updateUI", (dx) => {
        const { width } = this.getBoundingClientRect();
        this.style.touchAction = "none";
        this.style.cursor = "ew-resize";
        const val = interpolate({
          value: dx,
          inputRange: [0, width],
          outputRange: [0, 100],
          extrapolate: "clamp"
        });
        this.setVariables(val);
        this.prevDx = dx;
      });
      __publicField(this, "handleKeydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          this.keyboardDx = Math.max(0, this.keyboardDx - THRESHOLD);
          this.updateUI(this.keyboardDx);
          this.prevDx = this.keyboardDx;
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          this.keyboardDx = Math.min(this.getBoundingClientRect().width, this.keyboardDx + THRESHOLD);
          this.updateUI(this.keyboardDx);
          this.prevDx = this.keyboardDx;
        }
      });
      __publicField(this, "handleArrowKeyboard", () => {
        this.keyboardDx = this.prevDx;
        this.addEventListener("keydown", this.handleKeydown);
      });
      __publicField(this, "handler", () => {
        const { xoDefaultPercent } = this.getOptions();
        this.handleDefaultAnimate();
        this.handleEl = this.querySelector(`${WebComponent.ImageComparison}-handle`);
        const { width } = this.getBoundingClientRect();
        const threshold = 1.5;
        this.prevDx = width * (xoDefaultPercent / 100);
        this.handleArrowKeyboard();
        this.pan = panGesture({
          element: this,
          dx: width * (xoDefaultPercent / 100),
          onMove: ({ dx, dy }) => {
            if (this.axis === Axis.Idle) {
              if (Math.abs(dx - this.prevDx) / threshold >= Math.abs(dy)) {
                this.axis = Axis.Target;
              } else {
                this.axis = Axis.Lock;
              }
            }
            if (this.axis === Axis.Target) {
              this.updateUI(dx);
            }
          },
          onEnd: () => {
            var _a2;
            this.axis = Axis.Idle;
            (_a2 = this.pan) == null ? void 0 : _a2.setValue({ dx: this.prevDx, dy: 0 });
            this.style.removeProperty("cursor");
            this.style.removeProperty("touch-action");
          }
        });
      });
      __publicField(this, "animateUpdate", (value) => {
        var _a2;
        const { width } = this.getBoundingClientRect();
        this.setVariables(value);
        (_a2 = this.pan) == null ? void 0 : _a2.setValue({ dx: width * (value / 100) });
      });
      __publicField(this, "handleClick", (event) => {
        if (!this.handleEl.contains(event.target)) {
          const { width } = this.getBoundingClientRect();
          const { offsetX } = event;
          const afterWidth = interpolate({
            value: offsetX,
            inputRange: [0, width],
            outputRange: [0, 100]
          });
          this.animated({
            from: Number(this.style.getPropertyValue("--xo-value")),
            to: afterWidth,
            duration: 100,
            easing: easings.decay,
            onUpdate: this.animateUpdate
          });
        }
      });
      __publicField(this, "init", () => {
        queueMicrotask(() => {
          this.handler();
          if (!device.mobile()) {
            this.addEventListener("mousedown", this.handleClick);
          }
        });
      });
      __publicField(this, "destroy", () => {
        var _a2, _b2;
        (_a2 = this.pan) == null ? void 0 : _a2.destroy();
        this.animated.off();
        if (!device.mobile()) {
          this.removeEventListener("mousedown", this.handleClick);
        }
        (_b2 = this.intersectionObserver) == null ? void 0 : _b2.disconnect();
        this.removeEventListener("keydown", this.handleKeydown);
      });
    }
    static get observedAttributes() {
      return ["xo-observed", "xo-value", "xo-default-percent", "xo-animate"];
    }
    getOptions() {
      const options = getAttrs(this, {
        pick: ["xoDefaultPercent", "xoAnimate"],
        types: {
          xoDefaultPercent: "number",
          xoAnimate: "boolean"
        }
      });
      return {
        ..._ImageComparison.defaultOptions,
        ...options
      };
    }
    onConnected() {
      this.init();
    }
    disconnectedCallback() {
      this.destroy();
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if ((name === "xo-observed" || name === "xo-default-percent") && oldValue !== newValue) {
        await delay(100);
        this.destroy();
        this.init();
      }
    }
  };
  let ImageComparison = _ImageComparison;
  __publicField(ImageComparison, "defaultOptions", {
    xoDefaultPercent: 50,
    xoAnimate: false
  });
  __publicField(ImageComparison, "observeOnMount", true);
  const styles$a = "";
  componentDefine({
    [WebComponent.ImageComparison]: ImageComparison
  });
  const getMegaMenuFileName = (sectionId) => {
    const shortenSectionId = sectionId.toString().slice(-8);
    return `xb-menu-${shortenSectionId}`;
  };
  async function getMegaMenu(id2) {
    const sectionId = getMegaMenuFileName(id2);
    const res = await fetch(`/?section_id=${sectionId}`);
    if (!res.ok) {
      throw new Error(`[xo-mega-menu] Failed to fetch mega menu: HTTP ${res.status}`);
    }
    const data = await res.text();
    return data;
  }
  const _MegaMenu = class extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "linkEl", null);
      __publicField(this, "prevIndex", null);
      __publicField(this, "builderMegaMenuHtml", "");
      __publicField(this, "controller", new AbortController());
      __publicField(this, "handleLinkClick", (event) => {
        const targetEl = event.target;
        const currentEl = targetEl.closest("a");
        const modalName = currentEl == null ? void 0 : currentEl.getAttribute("xo-modal-name");
        if (modalName) {
          event.preventDefault();
          xoModal.open(modalName);
        }
      });
      __publicField(this, "handleMenuHamburger", async () => {
        await delay(1e3);
        const modalEl = this.closest(WebComponent.Modal);
        const hasContent = !_MegaMenu.isEmpty(this);
        if (modalEl && hasContent) {
          this.linkEl = modalEl.previousElementSibling;
          if (this.linkEl) {
            this.linkEl.setAttribute("xo-modal-name", modalEl.getAttribute("xo-name"));
            this.linkEl.addEventListener("click", this.handleLinkClick, { signal: this.controller.signal });
          }
        }
      });
      __publicField(this, "renderForTheme", () => {
        const { xoIndex, xoName } = this.getOptions();
        const selector = `template[xo-mega-menu-name='${xoName}'][xo-mega-menu-index="${xoIndex}"]`;
        const megamenuContentEl = document.querySelector(selector);
        if (megamenuContentEl && _MegaMenu.isEmpty(this)) {
          const sectionId = getShopifySectionId(megamenuContentEl);
          this.setAttribute("xo-section-id", sectionId);
          this.appendChild(megamenuContentEl.content.cloneNode(true));
        }
        _MegaMenu.setPositionStatic(this);
      });
      __publicField(this, "renderForBuilder", async () => {
        try {
          const { xoName, xoPreviewMode } = this.getOptions();
          if (xoPreviewMode) {
            const selector = `template[xo-mega-menu-name='${xoName}']`;
            const megamenuContentEl = document.querySelector(selector);
            if (megamenuContentEl && _MegaMenu.isEmpty(this)) {
              this.appendChild(megamenuContentEl.content.cloneNode(true));
            }
          } else {
            if (!this.builderMegaMenuHtml) {
              this.builderMegaMenuHtml = await getMegaMenu(xoName);
            }
            const regexp = new RegExp(`(<template.*xo-mega-menu-name=['"]${xoName}['"]>|<\\/template>)`, "g");
            const megaMenuHtml = `<xo-fragment>${this.builderMegaMenuHtml.replace(regexp, "")}</xo-fragment>`;
            const doc = new DOMParser().parseFromString(megaMenuHtml, "text/html");
            const scriptEls = Array.from(doc.querySelectorAll("script")).filter((el) => el.type === "" || el.type === "text/javascript");
            if (megaMenuHtml && _MegaMenu.isEmpty(this)) {
              each(scriptEls, (scriptEl) => {
                scriptEl.remove();
              });
              const xoFragmentEl = doc.body.querySelector("xo-fragment");
              each(Array.from(xoFragmentEl.children), (el) => {
                this.appendChild(el);
              });
              each(scriptEls, (scriptEl) => {
                if (scriptEl.src) {
                  loadScript({ id: scriptEl.id || `id-${hash(scriptEl.src)}`, file: scriptEl.src });
                } else if (scriptEl.textContent) {
                  loadScript({ id: scriptEl.id || `id-${hash(scriptEl.textContent)}`, content: scriptEl.textContent });
                }
              });
            }
          }
          loadImages(this);
        } catch (e) {
          console.error("[xo-mega-menu] renderForBuilder error:", e);
        }
      });
      __publicField(this, "render", () => {
        var _a2;
        const { xoBuilder } = this.getOptions();
        if (xoBuilder) {
          this.renderForBuilder();
          return;
        }
        if (!device.mobile()) {
          const sectionEl = this.closest(".shopify-section");
          if ((_a2 = window.Shopify) == null ? void 0 : _a2.designMode) {
            this.renderForTheme();
          } else {
            sectionEl == null ? void 0 : sectionEl.addEventListener("mouseenter", this.renderForTheme, this.controller);
            requestIdleCallback$1(() => {
              this.renderForTheme();
            }, { timeout: 1e3 });
          }
          return;
        }
        this.renderForTheme();
      });
      __publicField(this, "sectionLoad", async (event) => {
        const options = this.getOptions();
        const { xoName, xoIndex } = options;
        const selector = `template[xo-mega-menu-name='${xoName}'][xo-mega-menu-index="${xoIndex}"]`;
        const megamenuContentEl = document.querySelector(selector);
        const xoSectionId = options.xoSectionId || (megamenuContentEl ? getShopifySectionId(megamenuContentEl) : void 0);
        this.setAttribute("xo-section-id", xoSectionId || "");
        const { sectionId } = event.detail;
        if (xoName && sectionId && sectionId === xoSectionId) {
          await delay(100);
          const megaMenuEls2 = Array.from(document.querySelectorAll(WebComponent.MegaMenu));
          each(megaMenuEls2, async (el) => {
            var _a2;
            const { xoIndex: xoIndex2, xoName: xoName2 } = el.getOptions();
            const templateEl = document.querySelector(`template[xo-mega-menu-name="${xoName2}"][xo-mega-menu-index="${xoIndex2}"]`);
            if (!templateEl) {
              el.innerHTML = "";
              return;
            }
            const shopifySectionId = getShopifySectionId(templateEl);
            const res = await fetch(`/?section_id=${shopifySectionId}`);
            if (!res.ok) {
              console.error(`[xo-mega-menu] Failed to fetch section: HTTP ${res.status}`);
              return;
            }
            const data = await res.text();
            const doc = new DOMParser().parseFromString(data, "text/html");
            const newContent = ((_a2 = doc.querySelector(`template[xo-mega-menu-name]`)) == null ? void 0 : _a2.innerHTML) || "";
            attrBoolean.set(el, "xo-selected", shopifySectionId === sectionId);
            if (el.innerHTML !== newContent) {
              el.innerHTML = newContent;
              _MegaMenu.setPositionStatic(el);
              setHoverLevel(el);
            }
          });
        }
      });
      __publicField(this, "sectionUnload", (event) => {
        const { xoSectionId } = this.getOptions();
        if (xoSectionId === event.detail.sectionId) {
          this.innerHTML = "";
        }
      });
      __publicField(this, "sectionSelect", (event) => {
        const { xoSectionId } = this.getOptions();
        const { sectionId } = event.detail;
        attrBoolean.set(this, "xo-selected", sectionId === xoSectionId);
        const templateEl = document.querySelector(`#shopify-section-${sectionId} template[xo-mega-menu-name]`);
        const index = templateEl == null ? void 0 : templateEl.getAttribute("xo-mega-menu-index");
        if (this.prevIndex == null) {
          this.prevIndex = index;
        }
      });
      __publicField(this, "selectDeselect", () => {
        this.prevIndex = null;
      });
      __publicField(this, "handleMouseLeave", () => {
        const focusableEls = Array.from(this.querySelectorAll(A11Y_SELECTOR));
        each(focusableEls, (el) => {
          el.blur();
        });
      });
    }
    static get observedAttributes() {
      return ["xo-name"];
    }
    getOptions() {
      const options = getAttrs(this, {
        pick: ["xoIndex", "xoName", "xoSectionId", "xoSelected", "xoBuilder", "xoPreviewMode"],
        types: {
          xoIndex: "number",
          xoName: "string",
          xoSectionId: "string",
          xoSelected: "boolean",
          xoBuilder: "boolean",
          xoPreviewMode: "boolean"
        }
      });
      return options;
    }
    onConnected() {
      var _a2, _b2;
      if ((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode) {
        return;
      }
      this.render();
      this.handleMenuHamburger();
      this.addEventListener("mouseleave", this.handleMouseLeave, this.controller);
      if ((_b2 = window.Shopify) == null ? void 0 : _b2.designMode) {
        document.addEventListener("shopify:section:load", this.sectionLoad, this.controller);
        document.addEventListener("shopify:section:unload", this.sectionUnload, this.controller);
        document.addEventListener("shopify:section:select", this.sectionSelect, this.controller);
        document.addEventListener("shopify:section:deselect", this.selectDeselect, this.controller);
      }
    }
    disconnectedCallback() {
      this.controller.abort();
    }
  };
  let MegaMenu = _MegaMenu;
  __publicField(MegaMenu, "isEmpty", (el) => {
    return el.innerHTML.trim() === "";
  });
  __publicField(MegaMenu, "setPositionStatic", (megaMenuEl) => {
    const hasContent = !_MegaMenu.isEmpty(megaMenuEl);
    if (hasContent) {
      const parentEl = megaMenuEl.parentElement;
      if (parentEl.localName !== WebComponent.Toggle) {
        parentEl.style.position = "static";
      } else {
        parentEl.style.removeProperty("position");
      }
    }
  });
  componentDefine({
    [WebComponent.MegaMenu]: MegaMenu
  });
  const COLOR_SCHEME_ADDED = "xo-color-scheme-added";
  class DarkMode extends XoHTMLElement {
    constructor() {
      super();
      __publicField(this, "colorSchemeIds", ((_ca = window.settings) == null ? void 0 : _ca.color_scheme_ids) || []);
      __publicField(this, "darkModeMapping", (_da = window.settings) == null ? void 0 : _da.dark_mode_mapping);
      __publicField(this, "colorSchemeMapping");
      __publicField(this, "prevIds", /* @__PURE__ */ new Map());
      __publicField(this, "nextIds", /* @__PURE__ */ new Map());
      __publicField(this, "rootPrevId", "");
      __publicField(this, "rootNextId", "");
      __publicField(this, "handleToggles", []);
      __publicField(this, "pushIds", []);
      __publicField(this, "colorEls", []);
      __publicField(this, "controller", new AbortController());
      __publicField(this, "getIndexFromKey", (colorSchemeKey) => {
        const prevIndex = Number(colorSchemeKey.replace(/Scheme\s/g, "")) - 1;
        const nextIndex = Number(this.colorSchemeMapping[colorSchemeKey].replace(/Scheme\s/g, "")) - 1;
        return { prevIndex, nextIndex };
      });
      __publicField(this, "getIdFromKey", (colorSchemeKey) => {
        const { prevIndex, nextIndex } = this.getIndexFromKey(colorSchemeKey);
        const prevId = this.colorSchemeIds[prevIndex];
        const nextId = this.colorSchemeIds[nextIndex];
        return { prevId, nextId };
      });
      __publicField(this, "setIds", (els, colorSchemeKey) => {
        const { prevId, nextId } = this.getIdFromKey(colorSchemeKey);
        each(els, (colorEl) => {
          this.prevIds.set(colorEl, prevId);
          this.nextIds.set(colorEl, nextId);
          attrBoolean.set(colorEl, COLOR_SCHEME_ADDED, true);
        });
      });
      __publicField(this, "setRootIds", (colorSchemeKey) => {
        const { prevIndex } = this.getIndexFromKey(colorSchemeKey);
        const { prevId, nextId } = this.getIdFromKey(colorSchemeKey);
        if (prevIndex === 0) {
          this.rootPrevId = prevId;
          this.rootNextId = nextId;
        }
      });
      __publicField(this, "handleColor", (prevIds, isDark) => {
        prevIds.forEach((value, colorEl) => {
          if (isDark) {
            const prevClassName = `color-${value}`;
            const nextClassname = `color-${this.nextIds.get(colorEl)}`;
            if (colorEl.classList.contains(prevClassName)) {
              colorEl.classList.remove(prevClassName);
              colorEl.classList.add(nextClassname);
            }
          } else {
            const nextClassname = `color-${this.nextIds.get(colorEl)}`;
            const prevClassName = `color-${value}`;
            if (colorEl.classList.contains(nextClassname)) {
              colorEl.classList.remove(nextClassname);
              colorEl.classList.add(prevClassName);
            }
          }
        });
      });
      __publicField(this, "handleStorage", (prevId, isDark) => {
        const storageValue = {
          ...objectParse(storage.getItem("@xo/darkMode") || "{}"),
          [prevId]: isDark ? "dark" : "light"
        };
        let prevIds = [];
        for (let key in this.colorSchemeMapping) {
          const { prevId: prevId2 } = this.getIdFromKey(key);
          prevIds.push(prevId2);
        }
        if (!equal(prevIds, objectKeys(storageValue))) {
          each(objectKeys(storageValue), (key) => {
            storageValue[key] = objectValues(storageValue)[0];
            if (!prevIds.includes(key)) {
              delete storageValue[key];
            }
          });
        }
        storage.setItem("@xo/darkMode", JSON.stringify(storageValue));
      });
      if (this.darkModeMapping) {
        try {
          this.colorSchemeMapping = this.darkModeMapping.trim().split(String.fromCharCode(10)).reduce((acc, item) => {
            const [key, value] = item.replace(/:\s+/g, ":").split(":");
            return {
              ...acc,
              [key]: value
            };
          }, {});
        } catch {
          this.colorSchemeMapping = {};
        }
      } else {
        this.colorSchemeMapping = {};
      }
    }
    onConnected() {
      var _a2;
      const defaultMode = this.getAttribute("xo-mode");
      for (let key in this.colorSchemeMapping) {
        const prevIndex = Number(key.replace(/Scheme\s/g, "")) - 1;
        const { prevId } = this.getIdFromKey(key);
        this.colorEls = Array.from(document.querySelectorAll(`.color-${prevId}:not([${COLOR_SCHEME_ADDED}])`));
        this.setIds(this.colorEls, key);
        this.setRootIds(key);
        let isDark = ((_a2 = objectParse(storage.getItem("@xo/darkMode") || "{}")) == null ? void 0 : _a2[prevId]) === "dark";
        const pushIds = () => {
          const newColorEls = Array.from(document.querySelectorAll(`.color-${prevId}:not([${COLOR_SCHEME_ADDED}])`));
          this.setIds(newColorEls, key);
          const prevIds = /* @__PURE__ */ new Map();
          each(newColorEls, (el) => {
            prevIds.set(el, prevId);
          });
          this.handleColor(prevIds, isDark);
        };
        const handleChange = () => {
          attrBoolean.set(this, "xo-loading", true);
          const handler = () => {
            if (this.prevIds.size) {
              this.setAttribute("xo-mode", isDark ? "dark" : "light");
              attrBoolean.set(document.documentElement, "xo-dark-mode", isDark);
              this.handleColor(this.prevIds, isDark);
            }
            if (prevIndex === 0) {
              if (isDark) {
                const prevClassName = `color-${this.rootPrevId}`;
                const nextClassname = `color-${this.rootNextId}`;
                document.documentElement.classList.remove(prevClassName);
                document.documentElement.classList.add(nextClassname);
              } else {
                const nextClassname = `color-${this.rootNextId}`;
                const prevClassName = `color-${this.rootPrevId}`;
                document.documentElement.classList.remove(nextClassname);
                document.documentElement.classList.add(prevClassName);
              }
            }
            attrBoolean.set(this, "xo-loading", false);
          };
          requestIdleCallback$1(() => {
            handler();
          });
        };
        const handleToggle = () => {
          isDark = !isDark;
          this.handleStorage(prevId, isDark);
          handleChange();
        };
        if (storage.getItem("@xo/darkMode")) {
          this.handleStorage(prevId, isDark);
          handleChange();
        } else if (defaultMode === "dark") {
          isDark = true;
          handleChange();
        }
        this.addEventListener("click", handleToggle, this.controller);
        document.addEventListener("scroll", pushIds, this.controller);
        document.addEventListener("mouseover", pushIds, this.controller);
        document.addEventListener("touchstart", pushIds, this.controller);
        this.handleToggles.push(handleToggle);
        this.pushIds.push(pushIds);
      }
    }
    disconnectedCallback() {
      this.controller.abort();
    }
  }
  __publicField(DarkMode, "observeOnMount", true);
  DOMLoaded(async () => {
    await delay(0);
    componentDefine({
      [WebComponent.DarkMode]: DarkMode
    });
  });
  const RESIZE_DELAY$1 = 300;
  const _Masonry = class extends XoHTMLElement {
    constructor() {
      super();
      __publicField(this, "heights", []);
      __publicField(this, "resized", false);
      __publicField(this, "debounceId", -1);
      __publicField(this, "timeId", -1);
      __publicField(this, "resizeObserver", null);
      __publicField(this, "prevWidth", 0);
      __publicField(this, "_options");
      __publicField(this, "setOptions", () => {
        var _a2, _b2, _c2, _d2;
        const options = getAttrs(this, {
          pick: ["xoGap", "xoColumn", "xoBreakpoints"],
          types: {
            xoGap: "number",
            xoColumn: "number",
            xoBreakpoints: "object"
          }
        });
        const breakpointOptions = getBreakpointsOptions(options.xoBreakpoints);
        this.options = {
          ...options,
          xoGap: (_b2 = (_a2 = breakpointOptions == null ? void 0 : breakpointOptions.gap) != null ? _a2 : options.xoGap) != null ? _b2 : _Masonry.defaultOptions.xoGap,
          xoColumn: (_d2 = (_c2 = breakpointOptions == null ? void 0 : breakpointOptions.column) != null ? _c2 : options.xoColumn) != null ? _d2 : _Masonry.defaultOptions.xoColumn
        };
      });
      __publicField(this, "setItemStyles", (columnEl) => {
        const { xoGap } = this.options;
        const { xoColumn } = this.options;
        columnEl.style.position = "absolute";
        columnEl.style.width = `${100 / xoColumn}%`;
        columnEl.style.left = `${100 / xoColumn * this.indexSelected}%`;
        columnEl.style.top = `${this.minHeight}px`;
        columnEl.style.padding = `${xoGap / 2}px`;
        if (this.resized) {
          columnEl.style.transition = "all 0.4s ease";
        }
      });
      __publicField(this, "handleMasonryElement", () => {
        const { xoGap } = this.options;
        const itemEls = Array.from(this.querySelectorAll(`${WebComponent.MasonryItem}, [${WebComponent.MasonryItem}]`));
        each(itemEls, (columnEl) => {
          this.setItemStyles(columnEl);
          this.heights[this.indexSelected] += columnEl.offsetHeight;
        });
        this.style.height = `${this.maxHeight}px`;
        this.style.margin = `-${xoGap / 2}`;
        if (this.debounceId) {
          clearTimeout(this.debounceId);
        }
        this.debounceId = window.setTimeout(() => {
          itemEls.forEach((columnElement) => {
            columnElement.style.removeProperty("transition");
          });
          this.resized = false;
        }, 500);
      });
      __publicField(this, "setDefaultHeights", () => {
        const { xoColumn } = this.options;
        this.heights = Array(xoColumn).fill(0);
      });
      __publicField(this, "setContainerGap", () => {
        const { xoGap } = this.options;
        this.style.margin = `-${xoGap / 2}px`;
      });
      __publicField(this, "update", () => {
        this.setOptions();
        this.setDefaultHeights();
        this.handleMasonryElement();
        this.setContainerGap();
        window.clearTimeout(this.timeId);
        this.timeId = window.setTimeout(() => {
          this.style.opacity = "1";
        }, 100);
      });
      __publicField(this, "handleResize", debounce((entries) => {
        for (let entry of entries) {
          const currentWidth = entry.contentRect.width;
          if (currentWidth !== this.prevWidth) {
            this.resized = true;
            this.update();
            this.prevWidth = currentWidth;
          }
        }
      }, RESIZE_DELAY$1));
    }
    static get observedAttributes() {
      return ["xo-observed"];
    }
    get options() {
      return this._options;
    }
    set options(value) {
      this._options = value;
    }
    get minHeight() {
      return Math.min(...this.heights);
    }
    get maxHeight() {
      return Math.max(...this.heights);
    }
    get indexSelected() {
      return findIndex(this.heights, (item) => item === this.minHeight);
    }
    onConnected() {
      this.update();
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(this);
    }
    disconnectedCallback() {
      var _a2;
      clearTimeout(this.debounceId);
      (_a2 = this.resizeObserver) == null ? void 0 : _a2.disconnect();
      this.update();
      window.clearTimeout(this.timeId);
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      var _a2;
      if (name === "xo-observed" && oldValue !== newValue) {
        await delay(100);
        clearTimeout(this.debounceId);
        (_a2 = this.resizeObserver) == null ? void 0 : _a2.disconnect();
        this.update();
      }
    }
  };
  let Masonry = _Masonry;
  __publicField(Masonry, "defaultOptions", {
    xoGap: 30,
    xoColumn: 4,
    xoBreakpoints: {}
  });
  __publicField(Masonry, "observeOnMount", true);
  const DELAY = 300;
  class MasonryItemBase {
    constructor(el) {
      __publicField(this, "el");
      __publicField(this, "resizeObserver", null);
      __publicField(this, "prevWidth", 0);
      __publicField(this, "prevHeight", 0);
      __publicField(this, "masonryEl", null);
      __publicField(this, "handleResize", debounce((entries) => {
        var _a2;
        for (const entry of entries) {
          const currentWidth = entry.contentRect.width;
          const currentHeight = entry.contentRect.height;
          if (currentWidth !== this.prevWidth || currentHeight !== this.prevHeight) {
            (_a2 = this.masonryEl) == null ? void 0 : _a2.update();
            this.prevWidth = currentWidth;
            this.prevHeight = currentHeight;
          }
        }
      }, DELAY));
      this.el = el;
    }
    mount() {
      var _a2;
      this.masonryEl = this.el.parentElement;
      if (this.masonryEl.tagName.toLowerCase() !== WebComponent.Masonry) {
        return;
      }
      attrBoolean.set(this.el, "xo-masonry-item", true);
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(this.el);
      (_a2 = this.masonryEl) == null ? void 0 : _a2.update();
    }
    unmount() {
      var _a2, _b2;
      clearTimeout((_a2 = this.masonryEl) == null ? void 0 : _a2.debounceId);
      (_b2 = this.resizeObserver) == null ? void 0 : _b2.disconnect();
    }
  }
  class MasonryItem extends XoHTMLElement {
    constructor() {
      super(...arguments);
      __publicField(this, "masonryItemBase", null);
    }
    onConnected() {
      this.masonryItemBase = new MasonryItemBase(this);
      this.masonryItemBase.mount();
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this.masonryItemBase) == null ? void 0 : _a2.unmount();
    }
  }
  const styles$9 = "";
  componentDefine({
    [WebComponent.Masonry]: Masonry,
    [WebComponent.MasonryItem]: MasonryItem
  });
  function distance(x1, x2, y1, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.hypot(a, b);
  }
  const DEFAULT_FPS = 60;
  const DT_FPS = 1e3 / DEFAULT_FPS;
  const _Cursor = class extends HTMLDivElement {
    constructor() {
      super(...arguments);
      __publicField(this, "targetValueX", 0);
      __publicField(this, "targetValueY", 0);
      __publicField(this, "currentValueX", 0);
      __publicField(this, "currentValueY", 0);
      __publicField(this, "displacementX", 0);
      __publicField(this, "displacementY", 0);
      __publicField(this, "isHover", false);
      __publicField(this, "itemEl", null);
      __publicField(this, "isStart", false);
      __publicField(this, "handleFrameSyncUpdate", ({ delta }) => {
        if (this.itemEl) {
          const diffX = Math.abs(this.targetValueX - this.currentValueX);
          const diffY = Math.abs(this.targetValueY - this.currentValueY);
          if (diffX < 1e-3 && diffY < 1e-3) {
            return;
          }
          let slowDown = delta / DT_FPS;
          const slowDownRounded = Math.round(slowDown);
          if (slowDownRounded >= 1) {
            slowDown = slowDownRounded;
          }
          const { xoLerpEase } = this.options;
          const valueX = lerp(this.currentValueX, this.targetValueX, (this.isHover ? xoLerpEase : 1) * slowDown);
          const valueY = lerp(this.currentValueY, this.targetValueY, (this.isHover ? xoLerpEase : 1) * slowDown);
          this.itemEl.style.top = `${valueY}px`;
          this.itemEl.style.left = `${valueX}px`;
          this.currentValueX = valueX;
          this.currentValueY = valueY;
          this.isHover = true;
          this.handleDistortion(slowDown);
        }
      });
      __publicField(this, "handleDistortion", (slowDown) => {
        var _a2, _b2, _c2, _d2;
        const version = (_d2 = (_c2 = (_b2 = (_a2 = navigator.userAgent.match(/Version\/[0-9.]*/)) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.replace("Version/", "")) == null ? void 0 : _c2.replace(/\..*/g, "")) == null ? void 0 : _d2.trim();
        if (device.safari() && Number(version) <= 19) {
          return;
        }
        const { xoLerpEase, xoDistortion } = this.options;
        if (xoDistortion === "none") {
          return;
        }
        this.itemEl.style.filter = `url(#xo-cursor-${xoDistortion})`;
        this.displacementX = lerp(this.displacementX, this.targetValueX, xoLerpEase * slowDown);
        this.displacementY = lerp(this.displacementY, this.targetValueY, xoLerpEase * slowDown);
        const mouseDistance = distance(this.displacementX, this.targetValueX, this.displacementY, this.targetValueY);
        const feDisplacementMapEl = document.querySelector(`#xo-cursor-${xoDistortion} feDisplacementMap`);
        if (!feDisplacementMapEl) {
          return;
        }
        feDisplacementMapEl.scale.baseVal = mouseDistance;
      });
      __publicField(this, "setHoverButton", (event) => {
        const isButton = !!event.target.closest("a") || !!event.target.closest("button") || !!event.target.closest('[role="button"]');
        if (this.itemEl) {
          attrBoolean.set(this.itemEl, "xo-is-hovering-button", isButton);
        }
      });
      __publicField(this, "handleMouseMove", (event) => {
        const { xoAbsolute } = this.options;
        if (!this.isStart) {
          this.isStart = true;
          frameManager.add(this.handleFrameSyncUpdate, true);
        }
        this.setItemLeftRightEl(event);
        each(this.itemEls, (itemEl) => {
          attrBoolean.set(itemEl, "xo-active", false);
        });
        if (this.itemEl && !attrBoolean.get(this.itemEl, "xo-active")) {
          attrBoolean.set(this.itemEl, "xo-active", true);
        }
        const { scrollX, scrollY } = this.getScrollXY();
        if (xoAbsolute) {
          const { top, left } = offset(this);
          this.targetValueX = event.pageX - left;
          this.targetValueY = event.pageY - top;
        } else {
          this.targetValueX = event.pageX - scrollX;
          this.targetValueY = event.pageY - scrollY;
        }
        this.setHoverButton(event);
        this.handleDisabled(event);
      });
      __publicField(this, "handleDisabled", (event) => {
        var _a2;
        const cursorDisabledEl = (_a2 = event.target) == null ? void 0 : _a2.closest("[xo-cursor-disabled]");
        if (!this.itemEl) {
          return;
        }
        if (cursorDisabledEl) {
          this.handleMouseLeave(event);
        } else {
          frameManager.add(this.handleFrameSyncUpdate, true);
        }
      });
      __publicField(this, "handleMouseLeave", (event) => {
        event.stopPropagation();
        if (this.itemEl) {
          attrBoolean.set(this.itemEl, "xo-active", false);
          this.isHover = false;
          frameManager.remove(this.handleFrameSyncUpdate);
        }
      });
      __publicField(this, "setItemLeftRightEl", (event) => {
        const { xoName } = this.options;
        if (xoName.startsWith("[") && xoName.endsWith("]")) {
          const [prevName, nextName] = objectParse(xoName);
          const isNext = offset(this).left + this.offsetWidth / 2 < event.pageX;
          if (isNext) {
            this.itemEl = this.querySelector(`${WebComponent.CursorItem}[xo-name="${nextName}"]`);
          } else {
            this.itemEl = this.querySelector(`${WebComponent.CursorItem}[xo-name="${prevName}"]`);
          }
        }
      });
      __publicField(this, "handleMouseEnter", (event) => {
        event.stopPropagation();
        this.setItemLeftRightEl(event);
        if (this.itemEl) {
          this.setHoverButton(event);
          frameManager.add(this.handleFrameSyncUpdate, true);
        }
      });
    }
    get options() {
      const options = getAttrs(this, {
        pick: ["xoName", "xoLerpEase", "xoDistortion", "xoAbsolute", "xoMobileDisabled"],
        types: {
          xoName: "string",
          xoLerpEase: "number",
          xoDistortion: "string",
          xoAbsolute: "boolean",
          xoMobileDisabled: "boolean"
        }
      });
      return {
        ..._Cursor.defaultOptions,
        ...options
      };
    }
    setItemEl() {
      const { xoName } = this.options;
      if (xoName.startsWith("[") && xoName.endsWith("]")) {
        this.itemEl = null;
      }
      if (xoName) {
        this.itemEl = this.querySelector(`${WebComponent.CursorItem}[xo-name="${xoName}"]`);
      }
      this.itemEl = this.querySelector(WebComponent.CursorItem);
    }
    get itemEls() {
      return Array.from(document.querySelectorAll(WebComponent.CursorItem));
    }
    getScrollXY() {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      return {
        scrollX,
        scrollY
      };
    }
    connectedCallback() {
      if (device.mobile() && this.options.xoMobileDisabled) {
        return;
      }
      const { top, left } = offset(this);
      const { scrollX, scrollY } = this.getScrollXY();
      this.targetValueX = left + this.offsetWidth / 2 - scrollX;
      this.targetValueY = top + this.offsetHeight / 2 - scrollY;
      this.currentValueX = this.targetValueX;
      this.currentValueY = this.targetValueY;
      this.setItemEl();
      this.addEventListener("mouseenter", this.handleMouseEnter, false);
      this.addEventListener("mousemove", this.handleMouseMove, false);
      this.addEventListener("mouseleave", this.handleMouseLeave, false);
    }
    disconnectedCallback() {
      this.removeEventListener("mouseenter", this.handleMouseEnter, false);
      this.removeEventListener("mousemove", this.handleMouseMove, false);
      this.removeEventListener("mouseleave", this.handleMouseLeave, false);
      frameManager.remove(this.handleFrameSyncUpdate);
    }
  };
  let Cursor = _Cursor;
  __publicField(Cursor, "defaultOptions", {
    xoName: "",
    xoLerpEase: 0.1,
    xoDistortion: "none",
    xoAbsolute: false,
    xoMobileDisabled: false
  });
  function renderCursorFilter() {
    const filter2 = `
    <svg class="xo-hidden">
      <filter id="xo-cursor-distortion-1">
        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.003" numOctaves="5" seed="2" stitchTiles="noStitch" x="0%" y="0%" width="100%" height="100%" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="B" x="0%" y="0%" width="100%" height="100%" filterUnits="userSpaceOnUse" />
      </filter>
      <filter id="xo-cursor-distortion-2">
        <feTurbulence type="turbulence" baseFrequency="0.07 0.01" numOctaves="5" seed="2" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="B" x="0%" y="0%" width="100%" height="100%" filterUnits="userSpaceOnUse" />
      </filter>
      <filter id="xo-cursor-distortion-3">
        <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="5" seed="2" stitchTiles="noStitch" x="0%" y="0%" width="100%" height="100%" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="B" x="0%" y="0%" width="100%" height="100%" filterUnits="userSpaceOnUse" />
      </filter>
      <filter id="xo-cursor-distortion-4">
        <feTurbulence type="fractalNoise" baseFrequency="0 0.04" numOctaves="5" seed="2" stitchTiles="noStitch" x="0%" y="0%" width="100%" height="100%" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="B" x="0%" y="0%" width="100%" height="100%" filterUnits="userSpaceOnUse" />
      </filter>
      <filter id="xo-cursor-distortion-5">
        <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="5" seed="2" stitchTiles="noStitch" x="0%" y="0%" width="100%" height="100%" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" x="0%" y="0%" width="100%" height="100%" filterUnits="userSpaceOnUse" />
      </filter>
    </svg>
  `;
    document.body.insertAdjacentHTML("beforeend", filter2);
  }
  const styles$8 = "";
  renderCursorFilter();
  if (!customElements.get(WebComponent.Cursor)) {
    if (!isBot()) {
      customElements.define(WebComponent.Cursor, Cursor, { extends: "div" });
    }
  }
  function scrollTo() {
    var _a2;
    if (!((_a2 = window.xbEditor) == null ? void 0 : _a2.designMode)) {
      let getOptions = function(el) {
        const defaultOptions = {
          xoOffset: 0,
          xoDuration: 500,
          xoEasing: "easeInOutCubic"
        };
        const options = getAttrs(el, {
          pick: ["xoOffset", "xoDuration", "xoEasing"],
          types: {
            xoOffset: "number",
            xoDuration: "number",
            xoEasing: "string"
          }
        });
        return {
          ...defaultOptions,
          ...options
        };
      };
      const animated = createAnimate();
      window.addEventListener("click", (event) => {
        var _a3, _b2;
        const targetEl = event.target;
        const el = targetEl.closest("[xo-scroll-to]");
        const href = (_b2 = (_a3 = el == null ? void 0 : el.getAttribute("href")) != null ? _a3 : el == null ? void 0 : el.getAttribute("xb-href")) != null ? _b2 : el == null ? void 0 : el.getAttribute("xo-href");
        if (el && href) {
          event.preventDefault();
          const { xoOffset, xoDuration, xoEasing } = getOptions(el);
          if (href === "#top") {
            animated({
              from: window.scrollY,
              to: 0 + xoOffset,
              duration: xoDuration,
              easing: easings[xoEasing],
              onUpdate: (value) => {
                window.scrollTo({ top: value });
              }
            });
          } else {
            const el2 = document.querySelector(href);
            if (el2 != null) {
              const from = window.scrollY;
              const to = el2.getBoundingClientRect().top + window.scrollY + xoOffset;
              animated({
                from,
                to,
                duration: xoDuration,
                easing: easings[xoEasing],
                onUpdate: (value) => {
                  const stickyHeight = getStickyHeight("top");
                  const stickyHeightInterpolation = interpolate({
                    inputRange: [from, to],
                    outputRange: [0, stickyHeight],
                    value
                  });
                  window.scrollTo({ top: value - stickyHeightInterpolation });
                }
              });
            }
          }
        }
      });
    }
  }
  scrollTo();
  const DURATION = 1200;
  const VX_OFFSET = 30;
  const CLAMP_THRESHOLD = 0.3;
  const THROTTLE = 400;
  let ScrollCarousel = (_ea = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "innerEl", this.children[0]);
      __publicField(this, "animated", createAnimate());
      __publicField(this, "pan", null);
      __publicField(this, "nextEl", this.querySelector(WebComponent.ScrollCarouselNext));
      __publicField(this, "prevEl", this.querySelector(WebComponent.ScrollCarouselPrev));
      __publicField(this, "anchorEls", this.querySelectorAll("a"));
      __publicField(this, "isPanMove", false);
      __publicField(this, "stopAnimated", () => {
      });
      __publicField(this, "state", {
        isDragging: false,
        x: 0,
        navTarget: false
      });
      __publicField(this, "getDirConstant", () => {
        const { xoRtl } = this.props;
        return xoRtl ? -1 : 1;
      });
      __publicField(this, "endX", () => {
        const { xoGap } = this.props;
        return (this.offsetWidth - this.innerEl.scrollWidth + xoGap) * this.getDirConstant();
      });
      __publicField(this, "getValue", (x, useRuberBand = true) => {
        const { xoRtl } = this.props;
        const min = xoRtl ? 0 : this.endX();
        const max = xoRtl ? this.endX() : 0;
        if (useRuberBand) {
          return rubberBandClamp(min, max, x, CLAMP_THRESHOLD);
        }
        return clamp(x, min, max);
      });
      __publicField(this, "handlePanStart", (event) => {
        var _a2, _b2;
        if (((_a2 = this.nextEl) == null ? void 0 : _a2.contains(event.target)) || ((_b2 = this.prevEl) == null ? void 0 : _b2.contains(event.target))) {
          this.setState({ navTarget: true });
        }
        this.isPanMove = false;
        this.stopAnimated();
      });
      __publicField(this, "handlePanMove", ({ dx, isHorizontalSwipe }, event) => {
        const { isHorizontalSwipeState } = this.state;
        if (isHorizontalSwipeState == null) {
          this.setState({ isHorizontalSwipeState: isHorizontalSwipe });
        }
        const nextIsHorizontalSwipeState = device.mobile() ? this.state.isHorizontalSwipeState : true;
        if (nextIsHorizontalSwipeState) {
          event.preventDefault();
          this.isPanMove = true;
          const x = this.getValue(dx);
          this.setState({ x, isDragging: true });
        }
      });
      __publicField(this, "handlePanEnd", ({ dx, vx }) => {
        const { isDragging, navTarget } = this.state;
        if (isDragging) {
          if (!navTarget) {
            this.setState({ isDragging: false });
          }
          this.stopAnimated = this.animated({
            from: dx,
            to: this.getValue(dx + vx * VX_OFFSET, false),
            duration: DURATION,
            easing: easings.easeOutExpo,
            onUpdate: (value) => {
              var _a2;
              const x = this.getValue(value);
              this.setState({ x });
              (_a2 = this.pan) == null ? void 0 : _a2.setValue({ dx: x });
            }
          });
        }
        this.setState({ isHorizontalSwipeState: void 0, navTarget: false });
      });
      __publicField(this, "handleWheel", (event) => {
        var _a2;
        const { deltaX, deltaY } = event;
        if (deltaY) {
          return;
        }
        event.preventDefault();
        const { x } = this.state;
        const nextX = Math.round(this.getValue(x - deltaX + (deltaX > 0 ? 1 : -1)));
        this.stopAnimated();
        this.setState({ x: nextX });
        (_a2 = this.pan) == null ? void 0 : _a2.setValue({ dx: nextX });
      });
      __publicField(this, "getFirstLastEls", () => {
        const itemEls = Array.from(this.innerEl.children);
        const containerOffset = offset(this);
        let inViewportEls = itemEls.filter((el) => {
          const { left } = offset(el);
          const right = left + el.offsetWidth;
          return left >= containerOffset.left && right < containerOffset.left + this.offsetWidth;
        });
        if (inViewportEls.length === 0) {
          inViewportEls = itemEls.filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.left + rect.width >= containerOffset.left && rect.left <= containerOffset.left + this.offsetWidth;
          });
        }
        return {
          firstEl: inViewportEls.length === 1 ? inViewportEls[0].previousElementSibling || inViewportEls[0] : inViewportEls[0],
          lastEl: inViewportEls[inViewportEls.length - 1]
        };
      });
      __publicField(this, "handleGo", (value) => {
        const { xoSpeed, xoEasing } = this.props;
        const { x } = this.state;
        this.stopAnimated();
        this.stopAnimated = this.animated({
          from: x,
          to: this.getValue(value, false),
          duration: xoSpeed,
          easing: easings[xoEasing],
          onUpdate: (value2) => {
            var _a2;
            const x2 = this.getValue(value2);
            this.setState({ x: x2, navTarget: false });
            (_a2 = this.pan) == null ? void 0 : _a2.setValue({ dx: x2 });
          }
        });
        this.setState({ isHorizontalSwipeState: void 0 });
      });
      __publicField(this, "handleNext", throttle((event) => {
        event.preventDefault();
        const { xoRtl } = this.props;
        const { x, isDragging } = this.state;
        this.setState({ isDragging: false });
        if (isDragging) {
          return;
        }
        const { lastEl } = this.getFirstLastEls();
        const rtlNextX = this.offsetWidth - lastEl.offsetLeft;
        const ltrNextX = -(lastEl.offsetLeft + lastEl.offsetWidth);
        const nextX = xoRtl ? rtlNextX : ltrNextX;
        if (x !== this.endX()) {
          if (nextX === x) {
            this.handleGo(x - this.offsetWidth * this.getDirConstant());
          } else {
            this.handleGo(nextX);
          }
        }
      }, THROTTLE));
      __publicField(this, "handlePrev", throttle((event) => {
        event.preventDefault();
        const { xoGap, xoRtl } = this.props;
        const { x, isDragging } = this.state;
        this.setState({ isDragging: false });
        if (isDragging) {
          return;
        }
        const { firstEl } = this.getFirstLastEls();
        const rtlNextX = (firstEl.offsetLeft + xoGap) * -1;
        const ltrNextX = (firstEl.offsetLeft + firstEl.offsetWidth - this.offsetWidth - xoGap) * -1;
        const nextX = xoRtl ? rtlNextX : ltrNextX;
        if (x !== 0) {
          if (nextX === x) {
            this.handleGo(x + this.offsetWidth * this.getDirConstant());
          } else {
            this.handleGo(nextX);
          }
        }
      }, THROTTLE));
      __publicField(this, "handleAnchor", (event) => {
        if (this.isPanMove) {
          event.preventDefault();
        }
      });
      __publicField(this, "bindAnchor", () => {
        this.anchorEls.forEach((anchorEl) => {
          anchorEl.addEventListener("click", this.handleAnchor);
        });
      });
      __publicField(this, "unbindAnchor", () => {
        this.anchorEls.forEach((anchorEl) => {
          anchorEl.removeEventListener("click", this.handleAnchor);
        });
      });
      __publicField(this, "updateUI", () => {
        const { x } = this.state;
        this.innerEl.style.transform = `translate3d(${x}px, 0, 0)`;
        if (this.nextEl) {
          attrBoolean.set(this.nextEl, "xo-disabled", x >= 0);
        }
        if (this.prevEl) {
          attrBoolean.set(this.prevEl, "xo-disabled", x <= this.endX());
        }
      });
    }
    mount() {
      var _a2, _b2;
      const { xoGap } = this.props;
      if (!this.innerEl) {
        return;
      }
      this.updateUI();
      this.innerEl.style.setProperty("--xo-gap", `${xoGap}px`);
      this.bindAnchor();
      this.pan = panGesture({
        element: this,
        onStart: this.handlePanStart,
        onMove: this.handlePanMove,
        onEnd: this.handlePanEnd
      });
      this.addEventListener("wheel", this.handleWheel, { passive: false });
      (_a2 = this.nextEl) == null ? void 0 : _a2.addEventListener("click", this.handleNext, { passive: false });
      (_b2 = this.prevEl) == null ? void 0 : _b2.addEventListener("click", this.handlePrev, { passive: false });
    }
    unmount() {
      var _a2, _b2, _c2;
      (_a2 = this.pan) == null ? void 0 : _a2.destroy();
      this.stopAnimated();
      this.unbindAnchor();
      this.removeEventListener("wheel", this.handleWheel);
      (_b2 = this.nextEl) == null ? void 0 : _b2.removeEventListener("click", this.handleNext);
      (_c2 = this.prevEl) == null ? void 0 : _c2.removeEventListener("click", this.handlePrev);
    }
  }, __publicField(_ea, "propTypes", {
    xoSpeed: Number,
    xoGap: Number,
    xoEasing: String,
    xoRtl: Boolean
  }), __publicField(_ea, "defaultProps", {
    xoSpeed: 200,
    xoEasing: "ease",
    xoGap: 30,
    xoRtl: document.dir === "rtl"
  }), _ea);
  __decorate([
    stateUpdate(),
    __metadata("design:type", Object)
  ], ScrollCarousel.prototype, "updateUI", void 0);
  ScrollCarousel = __decorate([
    customElements$1(WebComponent.ScrollCarousel)
  ], ScrollCarousel);
  const styles$7 = "";
  const EASING = "cubic-bezier(.29,.99,.53,.88)";
  let Magnetic = (_fa = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "handleMouseMove", (event) => {
        const { xoDuration, xoRadius, xoRadiusMove } = this.props;
        const childEl = this.querySelector(WebComponent.MagneticContent);
        const { top, left, width, height } = this.getBoundingClientRect();
        const cx = left + width / 2;
        const cy = top + height / 2;
        const lx = Math.max(cx - event.clientX, 0);
        const rx = Math.max(event.clientX - cx, 0);
        const ty = Math.max(cy - event.clientY, 0);
        const by = Math.max(event.clientY - cy, 0);
        const r = xoRadius;
        const c = 1.3;
        const radiusMove = xoRadiusMove || r;
        if (!childEl) {
          return;
        }
        if (this.checkCircle(event.clientX, event.clientY, cx, cy, r)) {
          const x = Math.abs(event.clientX) - cx;
          const y = Math.abs(event.clientY) - cy;
          const d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
          let translateX = 0;
          let translateY = 0;
          if (lx > 0) {
            translateX = lx / -c;
          } else if (rx > 0) {
            translateX = rx / c;
          }
          if (ty > 0) {
            translateY = ty / -c;
          } else if (by > 0) {
            translateY = by / c;
          }
          translateX = translateX / (d / r * (r / radiusMove) + 0.5);
          translateY = translateY / (d / r * (r / radiusMove) + 0.5);
          attrBoolean.set(this, "xo-active", true);
          childEl.style.transition = `${xoDuration}ms ${EASING}`;
          childEl.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
        } else {
          attrBoolean.set(this, "xo-active", false);
          childEl.style.transform = "translate3d(0, 0, 0)";
        }
      });
      __publicField(this, "handleMouseLeave", () => {
        const childEl = this.querySelector(WebComponent.MagneticContent);
        attrBoolean.set(this, "xo-active", false);
        if (childEl) {
          childEl.style.transform = "translate3d(0, 0, 0)";
        }
      });
      __publicField(this, "getContainerEl", () => {
        var _a2;
        const { xoTarget } = this.props;
        const dfContainerEl = this.closest(".shopify-section") || document.body;
        return xoTarget ? (_a2 = this.closest(xoTarget)) != null ? _a2 : dfContainerEl : dfContainerEl;
      });
    }
    checkCircle(x, y, cx, cy, r) {
      return Math.pow(x - cx, 2) + Math.pow(y - cy, 2) <= Math.pow(r, 2);
    }
    mount() {
      const container = this.getContainerEl();
      container.addEventListener("mousemove", this.handleMouseMove);
      container.addEventListener("mouseleave", this.handleMouseLeave);
    }
    unmount() {
      const container = this.getContainerEl();
      container.removeEventListener("mousemove", this.handleMouseMove);
      container.removeEventListener("mouseleave", this.handleMouseLeave);
    }
  }, __publicField(_fa, "propTypes", {
    xoDuration: "number",
    xoRadius: "number",
    xoRadiusMove: "number",
    xoTarget: "string"
  }), __publicField(_fa, "defaultProps", {
    xoDuration: 600,
    xoRadius: 100
  }), _fa);
  Magnetic = __decorate([
    customElements$1(WebComponent.Magnetic)
  ], Magnetic);
  const styles$6 = "";
  let ScrollScene = (_ga = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "timeId", -1);
      __publicField(this, "resizeObserver", null);
      __publicField(this, "prevWidth", 0);
      __publicField(this, "prevScrollY", 0);
      __publicField(this, "itemEls", Array.from(this.querySelectorAll(`:scope > ${WebComponent.ScrollSceneInner} > ${WebComponent.ScrollSceneItem}`)));
      __publicField(this, "state", {
        activeIndex: 0
      });
      __publicField(this, "getThreshold", () => {
        const { xoThreshold } = this.props;
        const isMac = /Mac/.test(navigator.userAgent);
        if (isMac) {
          return xoThreshold + 0.3;
        }
        return xoThreshold;
      });
      __publicField(this, "handleScroll", () => {
        const threshold = this.getThreshold();
        const { top } = this.getBoundingClientRect();
        const index = Math.trunc(top * -1 / (window.innerHeight * threshold));
        const activeIndex = clamp(index, 0, this.itemEls.length - 1);
        this.setState({ activeIndex });
        this.setProps({ xoDirection: window.scrollY > this.prevScrollY ? "down" : "up" });
        this.prevScrollY = window.scrollY;
      });
      __publicField(this, "updateUI", () => {
        var _a2, _b2;
        const { activeIndex } = this.state;
        const itemEl = this.itemEls[activeIndex];
        const itemPrevEl = (_a2 = this.itemEls) == null ? void 0 : _a2[activeIndex - 1];
        const itemNextEl = (_b2 = this.itemEls) == null ? void 0 : _b2[activeIndex + 1];
        each(this.itemEls, (itemEl2) => {
          attrBoolean.set(itemEl2, "xo-active", false);
          attrBoolean.set(itemEl2, "xo-prev", false);
          attrBoolean.set(itemEl2, "xo-next", false);
        });
        if (itemEl) {
          attrBoolean.set(itemEl, "xo-active", true);
        }
        if (itemPrevEl) {
          attrBoolean.set(itemPrevEl, "xo-prev", true);
        }
        if (itemNextEl) {
          attrBoolean.set(itemNextEl, "xo-next", true);
        }
      });
      __publicField(this, "handleResize", debounce((entries) => {
        for (let entry of entries) {
          const currentWidth = entry.contentRect.width;
          if (currentWidth !== this.prevWidth) {
            const { xoMobileDisabled, xoMobileBreakpoint } = this.props;
            const isMobile2 = xoMobileDisabled && window.innerWidth < xoMobileBreakpoint;
            if (isMobile2) {
              window.removeEventListener("scroll", this.handleScroll);
              this.style.removeProperty("height");
              this.setProps({ xoReady: false });
              each(this.itemEls, (itemEl) => {
                attrBoolean.set(itemEl, "xo-prev", false);
                attrBoolean.set(itemEl, "xo-next", false);
              });
            } else {
              const threshold = this.getThreshold();
              window.removeEventListener("scroll", this.handleScroll);
              window.addEventListener("scroll", this.handleScroll, { passive: true });
              this.style.height = `${100 * (this.itemEls.length + 1 / threshold) * threshold}vh`;
              this.setProps({ xoReady: true });
              this.updateUI();
            }
            this.prevWidth = currentWidth;
          }
        }
      }, 400));
      __publicField(this, "handleFocusIn", (event) => {
        const target = event.target;
        const scrollSceneItemEl = target.closest(WebComponent.ScrollSceneItem);
        const index = this.itemEls.indexOf(scrollSceneItemEl);
        if (scrollSceneItemEl && index >= 0) {
          const offsetTop = offset(this).top;
          window.scrollTo({
            top: offsetTop + window.innerHeight * index
          });
        }
      });
    }
    setActive(index) {
      this.setState({ activeIndex: index });
    }
    mount() {
      if (this.itemEls.length <= 1) {
        return;
      }
      const { xoMobileDisabled, xoMobileBreakpoint } = this.props;
      const isMobile2 = xoMobileDisabled && window.innerWidth < xoMobileBreakpoint;
      if (isMobile2 && !window.Shopify.designMode) {
        return;
      }
      this.updateUI();
      const threshold = this.getThreshold();
      window.addEventListener("scroll", this.handleScroll, { passive: true });
      this.style.height = `${100 * (this.itemEls.length + 1 / threshold) * threshold}vh`;
      this.setProps({ xoReady: true });
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(this);
      each(this.itemEls, (itemEl) => {
        itemEl.insertAdjacentHTML("afterbegin", `<${WebComponent.ScrollSceneItemFocus} tabindex="0"></${WebComponent.ScrollSceneItemFocus}>`);
      });
      if (!isMobile2) {
        document.addEventListener("focusin", this.handleFocusIn);
      }
    }
    stateUpdate(prevState) {
      const { activeIndex } = this.state;
      if (prevState.activeIndex !== activeIndex) {
        this.updateUI();
        this.emit("xo:scroll-scene:change", { bubbles: true, detail: { activeIndex } });
      }
    }
    unmount() {
      var _a2;
      clearTimeout(this.timeId);
      window.removeEventListener("scroll", this.handleScroll);
      document.removeEventListener("focusin", this.handleFocusIn);
      (_a2 = this.resizeObserver) == null ? void 0 : _a2.disconnect();
    }
  }, __publicField(_ga, "propTypes", {
    xoThreshold: "number",
    xoMobileDisabled: "boolean",
    xoMobileBreakpoint: "number"
  }), __publicField(_ga, "defaultProps", {
    xoThreshold: 0.5,
    xoMobileDisabled: false,
    xoMobileBreakpoint: 0
  }), _ga);
  ScrollScene = __decorate([
    customElements$1(WebComponent.ScrollScene)
  ], ScrollScene);
  const styles$5 = "";
  async function getCollectionContents(handle, sectionId) {
    const res = await fetch(`/collections/${handle}?section_id=${sectionId}`);
    const data = await res.text();
    const doc = new DOMParser().parseFromString(data, "text/html");
    setHoverLevel(doc);
    const templateMegaMenuEl = doc.querySelector("template[xo-mega-menu-name]");
    if (templateMegaMenuEl) {
      const tabContentEls2 = Array.from(templateMegaMenuEl.content.querySelectorAll(WebComponent.CollectionTabsContent));
      return tabContentEls2.map((tabContentEl) => {
        var _a2;
        return (_a2 = tabContentEl == null ? void 0 : tabContentEl.innerHTML.trim()) != null ? _a2 : "";
      });
    }
    const tabContentEls = Array.from(doc.querySelectorAll(WebComponent.CollectionTabsContent));
    return tabContentEls.map((tabContentEl) => {
      var _a2;
      return (_a2 = tabContentEl == null ? void 0 : tabContentEl.innerHTML.trim()) != null ? _a2 : "";
    });
  }
  let CollectionTabs = (_ha = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "intersectionObserver", null);
      __publicField(this, "cache", /* @__PURE__ */ new Map());
      __publicField(this, "state", {
        isLoading: false,
        contents: []
      });
      __publicField(this, "handleRequest", async (handle) => {
        if (this.cache.has(handle)) {
          await delay();
          this.setState({ contents: this.cache.get(handle) });
          this.emit("change", { bubbles: true, detail: { handle } });
          return;
        }
        try {
          const { xoSectionId } = this.props;
          this.setState({ isLoading: true });
          const contents = await getCollectionContents(handle, xoSectionId);
          this.setState({ contents });
          this.emit("change", { bubbles: true, detail: { handle } });
          if (contents) {
            this.cache.set(handle, contents);
          }
        } catch (err) {
          console.error(err);
        } finally {
          this.setState({ isLoading: false });
        }
      });
      __publicField(this, "handleClick", (event) => {
        const { xoSectionId } = this.props;
        const target = event.target;
        const currentTriggerEl = target.closest(`${WebComponent.CollectionTabs}[xo-section-id="${xoSectionId}"] ${WebComponent.CollectionTabsTrigger}`);
        const triggerEls = Array.from(this.querySelectorAll(WebComponent.CollectionTabsTrigger));
        if (currentTriggerEl) {
          const handle = currentTriggerEl.getAttribute("xo-handle");
          if (handle) {
            each(triggerEls, (triggerEl) => {
              attrBoolean.set(triggerEl, "xo-active", false);
              bindingHelper(triggerEl, "xo-active-binding", false);
            });
            attrBoolean.set(currentTriggerEl, "xo-active", true);
            bindingHelper(currentTriggerEl, "xo-active-binding", true);
            this.handleRequest(handle);
          }
        }
      });
      __publicField(this, "handleInit", async () => {
        var _a2;
        const triggerEls = Array.from(this.querySelectorAll(WebComponent.CollectionTabsTrigger));
        const handle = (_a2 = triggerEls.find((triggerEl) => attrBoolean.get(triggerEl, "xo-active"))) == null ? void 0 : _a2.getAttribute("xo-handle");
        const tabContentEls = Array.from(this.querySelectorAll(WebComponent.CollectionTabsContent));
        const contents = tabContentEls.map((tabContentEl) => {
          var _a3;
          return (_a3 = tabContentEl == null ? void 0 : tabContentEl.innerHTML.trim()) != null ? _a3 : "";
        });
        if (handle && contents) {
          this.cache.set(handle, contents);
        }
      });
      __publicField(this, "handleIntersection", async (entries, observer2) => {
        try {
          if (!entries[0].isIntersecting) {
            return;
          }
          observer2.unobserve(this);
          const { xoSectionId } = this.props;
          const triggerEls = Array.from(this.querySelectorAll(WebComponent.CollectionTabsTrigger));
          each(triggerEls, async (triggerEl, index) => {
            if (index >= 10) {
              return;
            }
            const handle = triggerEl.getAttribute("xo-handle");
            const active = attrBoolean.get(triggerEl, "xo-active");
            if (handle && !active && !this.cache.has(handle)) {
              const contents = await getCollectionContents(handle, xoSectionId);
              this.cache.set(handle, contents);
            }
          });
        } catch (err) {
          console.error(err);
        }
      });
    }
    mount() {
      this.handleInit();
      if (!window.Shopify.designMode) {
        this.intersectionObserver = new IntersectionObserver(this.handleIntersection, { rootMargin: "0px 0px 400px 0px" });
        this.intersectionObserver.observe(this);
      }
      document.addEventListener("click", this.handleClick);
    }
    stateUpdate(prevState) {
      const { isLoading, contents } = this.state;
      this.setProps({ xoLoading: isLoading });
      const tabContentEls = Array.from(this.querySelectorAll(WebComponent.CollectionTabsContent));
      each(tabContentEls, (tabContentEl, index) => {
        var _a2;
        const content = contents[index];
        const prevContent = (_a2 = prevState.contents) == null ? void 0 : _a2[index];
        if (prevContent !== content && (tabContentEl == null ? void 0 : tabContentEl.innerHTML) !== content) {
          tabContentEl.innerHTML = content;
        }
      });
    }
    unmount() {
      var _a2;
      (_a2 = this.intersectionObserver) == null ? void 0 : _a2.disconnect();
      document.removeEventListener("click", this.handleClick);
    }
  }, __publicField(_ha, "propTypes", {
    xoSectionId: "string"
  }), __publicField(_ha, "defaultProps", {}), __publicField(_ha, "observeOnMount", true), _ha);
  CollectionTabs = __decorate([
    customElements$1(WebComponent.CollectionTabs)
  ], CollectionTabs);
  const styles$4 = "";
  const styles$3 = "";
  const callbacks = {};
  let iframeId = 0;
  const subscribed = {};
  function addYoutubeEventListener(iframe, callback) {
    if (iframeId === 0) {
      window.addEventListener("message", (e) => {
        if (e.origin !== "https://www.youtube.com" || !e.data) {
          return;
        }
        try {
          const data = JSON.parse(e.data);
          subscribed[data.id] = true;
          if (data.event !== "onStateChange")
            return;
          const cb = callbacks[data.id];
          cb == null ? void 0 : cb(data);
        } catch (error) {
          console.error("Failed to parse message data", error);
        }
      }, true);
    }
    iframeId++;
    callbacks[iframeId] = callback;
    subscribed[iframeId] = false;
    const currentFrameId = iframeId;
    const doSubscribe = () => {
      const messages = [
        {
          event: "listening",
          id: currentFrameId,
          channel: "widget"
        },
        {
          event: "command",
          func: "addEventListener",
          args: ["onStateChange"],
          id: currentFrameId,
          channel: "widget"
        }
      ];
      messages.forEach((message) => {
        var _a2;
        (_a2 = iframe.contentWindow) == null ? void 0 : _a2.postMessage(JSON.stringify(message), "https://www.youtube.com");
      });
    };
    function handler() {
      let tries = 0;
      const checkSubscribed = () => {
        if (!subscribed[currentFrameId]) {
          tries++;
          if (tries < 100) {
            doSubscribe();
          } else {
            console.warn(`Unable to subscribe ${currentFrameId}`);
          }
        }
      };
      doSubscribe();
      setTimeout(checkSubscribed, 100);
    }
    if (iframe.contentWindow) {
      handler();
    }
    iframe.addEventListener("load", handler);
    return () => {
      delete callbacks[currentFrameId];
      delete subscribed[currentFrameId];
    };
  }
  function addVimeoEventListener(iframe, callback) {
    var _a2;
    (_a2 = iframe.contentWindow) == null ? void 0 : _a2.postMessage({ method: "addEventListener", value: "play" }, "https://player.vimeo.com");
    iframe.addEventListener("load", () => {
      var _a3;
      (_a3 = iframe.contentWindow) == null ? void 0 : _a3.postMessage({ method: "addEventListener", value: "play" }, "https://player.vimeo.com");
    });
    window.addEventListener("message", (event) => {
      var _a3;
      if (event.origin !== "https://player.vimeo.com" || iframe.contentWindow !== event.source) {
        return;
      }
      if (typeof event.data === "string" && event.data.includes("ready")) {
        (_a3 = iframe.contentWindow) == null ? void 0 : _a3.postMessage({ method: "addEventListener", value: "play" }, "https://player.vimeo.com");
      }
      if (event.data.event === "play") {
        callback();
      }
    });
  }
  let IntersectionVideo = (_ia = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "state", {
        start: false
      });
      __publicField(this, "controller", new AbortController());
      __publicField(this, "intersectionObserver", null);
      __publicField(this, "getAutoplay", (el) => {
        if (!el) {
          return false;
        }
        if (el.localName === "video") {
          return el.autoplay;
        }
        if (el.localName === "iframe") {
          return el.src.includes("autoplay=1");
        }
        return false;
      });
      __publicField(this, "handleIntersection", (entries) => {
        const { xoThreshold } = this.props;
        entries.forEach((entry) => {
          if (!entry.target.localName.includes(WebComponent.IntersectionVideo)) {
            return;
          }
          const videoEl = entry.target.querySelector("video, iframe");
          if (entry.isIntersecting && entry.intersectionRatio >= xoThreshold) {
            if (this.getAutoplay(videoEl) || this.state.start) {
              playVideo(videoEl);
              this.handleVideoCover("play", videoEl);
            }
          } else {
            pauseVideo(videoEl);
            this.handleVideoCover("pause", videoEl);
          }
        });
      });
      __publicField(this, "handleVideoCover", (type, videoEl) => {
        const wcVideoEl = videoEl == null ? void 0 : videoEl.closest(WebComponent.VideoCover);
        if (wcVideoEl) {
          if (type === "pause") {
            attrBoolean.set(wcVideoEl, "xo-paused", true);
            attrBoolean.set(wcVideoEl, "xo-playing", false);
          } else {
            attrBoolean.set(wcVideoEl, "xo-playing", true);
            attrBoolean.set(wcVideoEl, "xo-paused", false);
          }
        }
      });
      __publicField(this, "handlePauseAll", () => {
        const currentVideoEl = this.querySelector("video, iframe");
        const videoEls = Array.from(document.querySelectorAll(`${WebComponent.IntersectionVideo} video, ${WebComponent.IntersectionVideo} iframe`));
        each(videoEls, (videoEl) => {
          if (videoEl !== currentVideoEl) {
            pauseVideo(videoEl);
            this.handleVideoCover("pause", videoEl);
          }
        });
      });
      __publicField(this, "handleVideoCoverButton", (event) => {
        var _a2;
        const wcVideoEl = (_a2 = event.currentTarget) == null ? void 0 : _a2.closest(WebComponent.VideoCover);
        const isPlaying = !!(wcVideoEl == null ? void 0 : wcVideoEl.hasAttribute("xo-playing"));
        this.setState({ start: isPlaying });
      });
    }
    mount() {
      const { xoThreshold } = this.props;
      (async () => {
        await delay(1e3);
        this.intersectionObserver = new IntersectionObserver(this.handleIntersection, {
          threshold: xoThreshold
        });
        this.intersectionObserver.observe(this);
        const videoEl = this.querySelector("video, iframe");
        if (isYoutube(videoEl.src)) {
          addYoutubeEventListener(videoEl, (data) => {
            const isPlay = data.info === 1;
            if (isPlay) {
              this.handlePauseAll();
            }
          });
        } else if (isVimeo(videoEl.src)) {
          addVimeoEventListener(videoEl, () => {
            this.handlePauseAll();
          });
        } else {
          videoEl == null ? void 0 : videoEl.addEventListener("play", () => {
            this.handlePauseAll();
          });
        }
        const buttonEl = this.querySelector(WebComponent.VideoCoverButton);
        buttonEl == null ? void 0 : buttonEl.addEventListener("click", this.handleVideoCoverButton, { signal: this.controller.signal });
      })();
    }
    unmount() {
      var _a2;
      (_a2 = this.intersectionObserver) == null ? void 0 : _a2.disconnect();
      this.controller.abort();
    }
  }, __publicField(_ia, "propTypes", {
    xoThreshold: "number"
  }), __publicField(_ia, "defaultProps", {
    xoThreshold: 0.75
  }), _ia);
  IntersectionVideo = __decorate([
    customElements$1(WebComponent.IntersectionVideo)
  ], IntersectionVideo);
  function createStore() {
    xoStore.create("xo-viewed-products", {
      initialState: [],
      useStorage: true
    });
    xoStore.create("xo-compare-products", {
      initialState: [],
      useStorage: true
    });
    xoStore.create("xo-wishlist-products", {
      initialState: [],
      useStorage: true
    });
    xoStore.create("xo-viewed-products-limit", {
      initialState: 50
    });
    xoStore.create("xo-compare-products-limit", {
      initialState: 4
    });
    xoStore.create("xo-wishlist-products-limit", {
      initialState: Infinity
    });
  }
  function addProduct(type, id2) {
    if (type === "viewed") {
      xoStore.set("xo-viewed-products", (prevState) => {
        const limit = xoStore.get("xo-viewed-products-limit");
        const limited = prevState.length >= limit;
        if (prevState.includes(id2)) {
          return prevState;
        }
        return [id2, ...limited ? prevState.filter((_, index) => index < prevState.length - 1) : prevState];
      });
    } else {
      xoStore.set(`xo-${type}-products`, (prevState) => {
        if (prevState.includes(id2)) {
          return prevState.filter((itemId) => itemId !== id2);
        }
        const limit = xoStore.get(`xo-${type}-products-limit`);
        const limited = prevState.length >= limit;
        if (!limited) {
          return [...prevState, id2];
        }
        return prevState;
      });
    }
  }
  function removeProduct(type, id2) {
    xoStore.set(`xo-${type}-products`, (prevState) => {
      return prevState.filter((itemId) => itemId !== id2);
    });
  }
  function clearProducts(type) {
    xoStore.set(`xo-${type}-products`, []);
  }
  function setProductsLimit(type, limit) {
    xoStore.set(`xo-${type}-products-limit`, limit);
  }
  function getCurrentIds(ids, page, pageLimit) {
    if (pageLimit === Infinity) {
      return ids;
    }
    const start = (page - 1) * pageLimit;
    const end = start + pageLimit;
    return ids.slice(start, end);
  }
  function getPage() {
    var _a2, _b2;
    const page = (_b2 = (_a2 = queryString.parse(window.location.search, true)) == null ? void 0 : _a2.page) != null ? _b2 : 1;
    return page;
  }
  async function readContent(sectionId, ids, pageLimit) {
    let page = 1;
    const pageParam = getPage();
    if (pageLimit === Infinity) {
      page = pageParam;
    }
    const fetchParams = getCurrentIds(ids, pageParam, pageLimit).reduce((acc, id2, index) => {
      return acc + `${index === 0 ? "" : " OR "}id:${id2}`;
    }, `section_id=${sectionId}&page=${page}&type=product&q=`);
    const res = await fetch(`/search?${fetchParams}`);
    const data = await res.text();
    return data;
  }
  async function readPaginate(sectionId, ids) {
    return readContent(sectionId, ids, Infinity);
  }
  const ORDER_ATTR = WebComponent.ProductsFetcher + "-order";
  const SCROLL_ATTR = WebComponent.ProductsFetcher + "-scroll";
  let ProductsFetcher = (_ja = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "state", {
        ids: [],
        ready: false
      });
      __publicField(this, "intersectionObserver", null);
      __publicField(this, "scrollEl", this.querySelector(`[${SCROLL_ATTR}]`));
      __publicField(this, "st", 0);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "removeAnimate", (doc) => {
        const animateAttrEls = Array.from(doc.querySelectorAll('[xo-animate="scroll"]'));
        const animateEls = Array.from(doc.querySelectorAll(WebComponent.Animate));
        each(animateAttrEls, (animateEl) => {
          animateEl.setAttribute("xo-animate", "none");
        });
        each(animateEls, (animateEl) => {
          attrBoolean.set(animateEl, "xo-disabled", true);
        });
        return doc;
      });
      __publicField(this, "renderContent", async () => {
        var _a2, _b2;
        try {
          const { xoType, xoName, xoPageLimit } = this.props;
          const sectionId = getShopifySectionId(this);
          const { ids } = this.state;
          const content = await readContent(sectionId, ids, xoPageLimit);
          let doc = new DOMParser().parseFromString(content, "text/html");
          doc = this.removeAnimate(doc);
          const newHtml = (_b2 = (_a2 = doc.querySelector(`${WebComponent.ProductsFetcher}[xo-type="${xoType}"]${xoName ? `[xo-name="${xoName}"]` : ""}`)) == null ? void 0 : _a2.innerHTML.trim()) != null ? _b2 : "";
          if (this.innerHTML !== newHtml) {
            this.innerHTML = newHtml;
            this.handleOrder();
            if (this.scrollEl) {
              this.scrollEl.scrollTop = this.st;
            }
          }
          this.setProps({ xoLoading: false });
        } catch {
          this.setProps({ xoLoading: false });
        }
      });
      __publicField(this, "handleIntersection", (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !this.state.ready) {
          this.setState({ ready: true });
        }
      });
      __publicField(this, "handleOrder", () => {
        const { ids } = this.state;
        each(ids, (id2, index) => {
          var _a2;
          const orderEl = this.querySelector(`[${ORDER_ATTR}="${id2}"]`);
          (_a2 = orderEl == null ? void 0 : orderEl.style) == null ? void 0 : _a2.setProperty("order", `${index + 1}`);
        });
      });
      __publicField(this, "handleScroll", () => {
        var _a2, _b2;
        this.st = (_b2 = (_a2 = this.scrollEl) == null ? void 0 : _a2.scrollTop) != null ? _b2 : this.st;
      });
      __publicField(this, "autoPrev", () => {
        const page = getPage();
        if (page > 1) {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set("page", `${page - 1}`);
          window.location.href = newUrl.href;
        }
      });
      __publicField(this, "removeRedundant", () => {
        const { xoPageLimit, xoType } = this.props;
        const { ids } = this.state;
        const page = getPage();
        const currentIds = getCurrentIds(ids, page, xoPageLimit);
        const hasRealId = !!this.querySelector(`[${ORDER_ATTR}]`);
        if (!hasRealId) {
          return;
        }
        const realIds = Array.from(this.querySelectorAll(`[${ORDER_ATTR}]`)).map((el) => el.getAttribute(ORDER_ATTR));
        const redundantIds = currentIds.filter((item) => !realIds.includes(item));
        if (redundantIds.length > 0) {
          each(redundantIds, (id2) => {
            removeProduct.call(this, xoType, id2);
          });
        }
      });
    }
    mount() {
      var _a2, _b2;
      const { xoType, xoLimit } = this.props;
      const sectionId = getShopifySectionId(this);
      if (!sectionId) {
        return;
      }
      if (xoLimit != null) {
        setProductsLimit.call(this, xoType, xoLimit);
      }
      if (!xoType) {
        return;
      }
      this.setProps({ xoLoading: true });
      this.intersectionObserver = new IntersectionObserver(this.handleIntersection, { rootMargin: "0px 0px 400px 0px" });
      this.intersectionObserver.observe((_a2 = this.closest('[id^="shopify-section-template--"]')) != null ? _a2 : this);
      this.unsubscribe = xoStore.subscribe(`xo-${xoType}-products`, (ids) => {
        this.setState({ ids });
      });
      (_b2 = this.scrollEl) == null ? void 0 : _b2.addEventListener("scroll", this.handleScroll);
    }
    async stateUpdate() {
      const { xoModalName, xoPageLimit } = this.props;
      const { ids, ready } = this.state;
      if (!ready) {
        return;
      }
      const page = getPage();
      if (getCurrentIds(ids, page, xoPageLimit).length === 0) {
        this.autoPrev();
        this.setProps({ xoEmpty: true });
        if (xoModalName) {
          xoModal.close(xoModalName);
        }
      } else {
        this.setProps({ xoEmpty: false });
        if (xoModalName) {
          xoModal.open(xoModalName);
        }
      }
      await this.renderContent();
      this.removeRedundant();
    }
    unmount() {
      var _a2, _b2;
      this.unsubscribe();
      (_a2 = this.intersectionObserver) == null ? void 0 : _a2.disconnect();
      (_b2 = this.scrollEl) == null ? void 0 : _b2.removeEventListener("scroll", this.handleScroll);
    }
  }, __publicField(_ja, "propTypes", {
    xoType: "string",
    xoEmpty: "boolean",
    xoLoading: "boolean",
    xoName: "string",
    xoModalName: "string",
    xoLimit: "number",
    xoPageLimit: "number"
  }), __publicField(_ja, "defaultProps", {
    xoEmpty: false,
    xoLoading: false,
    xoPageLimit: Infinity
  }), _ja);
  ProductsFetcher = __decorate([
    customElements$1(WebComponent.ProductsFetcher)
  ], ProductsFetcher);
  let ProductsFetcherAdd = (_ka = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "state", {
        active: false,
        limit: 0,
        size: 0
      });
      __publicField(this, "productEl", this.closest(WebComponent.Product));
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "unsubscribe2", () => {
      });
      __publicField(this, "handleClick", () => {
        const { xoProductId } = this.productEl.getOptions();
        const { xoType } = this.props;
        addProduct.call(this, xoType, xoProductId);
      });
    }
    mount() {
      if (!this.productEl) {
        throw new Error(`${WebComponent.ProductsFetcherAdd} must be in ${WebComponent.Product}`);
      }
      const { xoType } = this.props;
      if (!xoType) {
        return;
      }
      const { xoProductId } = this.productEl.getOptions();
      this.addEventListener("click", this.handleClick);
      this.unsubscribe = xoStore.subscribe(`xo-${xoType}-products`, (ids) => {
        this.setState({ active: ids.includes(xoProductId), size: ids.length });
      });
      this.unsubscribe2 = xoStore.subscribe(`xo-${xoType}-products-limit`, (limit) => {
        this.setState({ limit });
      });
    }
    stateUpdate(prevState) {
      const { active, limit, size } = this.state;
      if (prevState.active !== active) {
        this.setProps({ xoAdded: active });
      }
      this.setProps({ xoLimited: size >= limit });
    }
    unmount() {
      this.removeEventListener("click", this.handleClick);
      this.unsubscribe();
      this.unsubscribe2();
    }
  }, __publicField(_ka, "propTypes", {
    xoType: "string",
    xoAdded: "boolean",
    xoLimited: "boolean"
  }), __publicField(_ka, "defaultProps", {
    xoAdded: false,
    xoLimited: false
  }), _ka);
  ProductsFetcherAdd = __decorate([
    customElements$1(WebComponent.ProductsFetcherAdd)
  ], ProductsFetcherAdd);
  let ProductsFetcherRemove = (_la = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "productEl", this.closest(WebComponent.Product));
      __publicField(this, "handleClick", () => {
        const { xoType } = this.props;
        const { xoProductId } = this.productEl.getOptions();
        this.setProps({ xoLoading: true });
        removeProduct.call(this, xoType, xoProductId);
      });
    }
    mount() {
      if (!this.productEl) {
        throw new Error(`${WebComponent.ProductsFetcherRemove} must be in ${WebComponent.Product}`);
      }
      const { xoType } = this.props;
      if (!xoType) {
        return;
      }
      this.addEventListener("click", this.handleClick);
    }
    unmount() {
      this.removeEventListener("click", this.handleClick);
    }
  }, __publicField(_la, "propTypes", {
    xoType: "string",
    xoLoading: "boolean"
  }), __publicField(_la, "defaultProps", {}), _la);
  ProductsFetcherRemove = __decorate([
    customElements$1(WebComponent.ProductsFetcherRemove)
  ], ProductsFetcherRemove);
  let ProductsFetcherClear = (_ma = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "handleClick", () => {
        const { xoType } = this.props;
        clearProducts.call(this, xoType);
      });
    }
    mount() {
      const { xoType } = this.props;
      if (!xoType) {
        return;
      }
      this.addEventListener("click", this.handleClick);
      this.unsubscribe = xoStore.subscribe(`xo-${xoType}-products`, (ids) => {
        this.setProps({ xoEmpty: ids.length === 0 });
      });
    }
    unmount() {
      this.removeEventListener("click", this.handleClick);
      this.unsubscribe();
    }
  }, __publicField(_ma, "propTypes", {
    xoType: "string",
    xoEmpty: "boolean"
  }), __publicField(_ma, "defaultProps", {
    xoEmpty: false
  }), _ma);
  ProductsFetcherClear = __decorate([
    customElements$1(WebComponent.ProductsFetcherClear)
  ], ProductsFetcherClear);
  let ProductsFetcherSize = (_na = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "unsubscribe", () => {
      });
    }
    mount() {
      const { xoType } = this.props;
      if (!xoType) {
        return;
      }
      this.unsubscribe = xoStore.subscribe(`xo-${xoType}-products`, (ids) => {
        this.innerHTML = `${ids.length}`;
        this.setProps({ xoEmpty: ids.length === 0 });
      });
    }
    unmount() {
      this.unsubscribe();
    }
  }, __publicField(_na, "propTypes", {
    xoType: "string",
    xoEmpty: "boolean"
  }), __publicField(_na, "defaultProps", {
    xoEmpty: false
  }), _na);
  ProductsFetcherSize = __decorate([
    customElements$1(WebComponent.ProductsFetcherSize)
  ], ProductsFetcherSize);
  let ProductsFetcherPaginate = (_oa = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "state", {
        ids: []
      });
      __publicField(this, "unsubscribe", () => {
      });
      __publicField(this, "renderContent", async () => {
        var _a2, _b2;
        try {
          const sectionId = getShopifySectionId(this);
          const { ids } = this.state;
          const content = await readPaginate(sectionId, ids);
          const doc = new DOMParser().parseFromString(content, "text/html");
          setHoverLevel(doc);
          const newHtml = (_b2 = (_a2 = doc.querySelector(WebComponent.ProductsFetcherPaginate)) == null ? void 0 : _a2.innerHTML) != null ? _b2 : "";
          if (this.innerHTML !== newHtml) {
            this.innerHTML = newHtml;
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
    mount() {
      const { xoType } = this.props;
      this.unsubscribe = xoStore.subscribe(`xo-${xoType}-products`, (ids) => {
        this.setState({ ids });
      });
    }
    stateUpdate() {
      this.renderContent();
    }
    unmount() {
      this.unsubscribe();
    }
  }, __publicField(_oa, "propTypes", {
    xoType: "string"
  }), __publicField(_oa, "defaultProps", {}), _oa);
  ProductsFetcherPaginate = __decorate([
    customElements$1(WebComponent.ProductsFetcherPaginate)
  ], ProductsFetcherPaginate);
  createStore();
  let count = 0;
  let PhotoSwipe = (_pa = class extends XoComponent {
    constructor() {
      super();
      __publicField(this, "cssId", `${WebComponent.Photoswipe}-css`);
      __publicField(this, "jsLightboxId", `${WebComponent.Photoswipe}-lightbox-js`);
      __publicField(this, "jsId", `${WebComponent.Photoswipe}-js`);
      __publicField(this, "cssFile", "https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.4/photoswipe.min.css");
      __publicField(this, "jsFile", "https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.4/umd/photoswipe.umd.min.js");
      __publicField(this, "jsLightboxFile", "https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.4/umd/photoswipe-lightbox.umd.min.js");
      __publicField(this, "photoswipeId", "");
      __publicField(this, "lightbox", null);
      __publicField(this, "handlePhotoswipe", () => {
        this.lightbox = new window.PhotoSwipeLightbox({
          children: "a",
          ...this.props.xoOptions,
          gallery: `#${this.photoswipeId}`,
          pswpModule: window.PhotoSwipe
        });
        this.lightbox.init();
      });
      __publicField(this, "handler", async () => {
        if (!document.querySelector(`#${this.cssId}`)) {
          loadStyle({ id: this.cssId, file: this.cssFile });
          await Promise.all([loadScript({ id: this.jsId, file: this.jsFile }), loadScript({ id: this.jsLightboxId, file: this.jsLightboxFile })]);
        }
        this.handlePhotoswipe();
      });
      count++;
      this.photoswipeId = `xo-photoswipe-${count}`;
    }
    mount() {
      this.id = this.photoswipeId;
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {
          this.handler();
        }, { timeout: 3e3 });
      } else {
        setTimeout(() => {
          this.handler();
        }, 4e3);
      }
    }
    unmount() {
      var _a2;
      (_a2 = this.lightbox) == null ? void 0 : _a2.destroy();
      this.lightbox = null;
    }
  }, __publicField(_pa, "propTypes", {
    xoOptions: "object"
  }), __publicField(_pa, "defaultProps", {
    xoOptions: {}
  }), __publicField(_pa, "observeOnMount", true), _pa);
  PhotoSwipe = __decorate([
    customElements$1(WebComponent.Photoswipe),
    __metadata("design:paramtypes", [])
  ], PhotoSwipe);
  let Item = class Item2 extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "carouselItem", null);
      __publicField(this, "masonryItemBase", null);
    }
    mount() {
      this.carouselItem = new CarouselItem(this);
      this.carouselItem.mount();
      this.masonryItemBase = new MasonryItemBase(this);
      this.masonryItemBase.mount();
    }
    unmount() {
      var _a2, _b2;
      (_a2 = this.carouselItem) == null ? void 0 : _a2.unmount();
      (_b2 = this.masonryItemBase) == null ? void 0 : _b2.unmount();
    }
  };
  Item = __decorate([
    customElements$1(WebComponent.Item)
  ], Item);
  const styles$2 = "";
  const styles$1 = "";
  var TurboProgressBar_1;
  let TurboProgressBar = TurboProgressBar_1 = (_qa = class extends XoComponent {
    mount() {
      if (TurboProgressBar_1.progressBar) {
        return;
      }
      TurboProgressBar_1.progressBar = this;
    }
    static async run() {
      if (!TurboProgressBar_1.progressBar) {
        return;
      }
      if (TurboProgressBar_1.running) {
        return;
      }
      if (popoverSupported$1()) {
        TurboProgressBar_1.progressBar.setAttribute("popover", "manual");
      }
      openPopover(TurboProgressBar_1.progressBar);
      TurboProgressBar_1.running = true;
      TurboProgressBar_1.completed = false;
      TurboProgressBar_1.progressBar.setProps({ xoRunning: true });
      TurboProgressBar_1.progressBar.style.setProperty("width", "0");
      TurboProgressBar_1.progressBar.style.removeProperty("opacity");
    }
    static async complete() {
      if (!TurboProgressBar_1.progressBar) {
        return;
      }
      if (!TurboProgressBar_1.running) {
        return;
      }
      if (TurboProgressBar_1.completed) {
        return;
      }
      await delay(0);
      cancelIdleCallback$1(TurboProgressBar_1.rid);
      TurboProgressBar_1.rid = requestIdleCallback$1(async () => {
        TurboProgressBar_1.completed = true;
        TurboProgressBar_1.progressBar.style.setProperty("width", `${TurboProgressBar_1.progressBar.offsetWidth}px`, "important");
        TurboProgressBar_1.progressBar.setProps({ xoRunning: false });
        await delay(100);
        TurboProgressBar_1.progressBar.style.setProperty("width", "100%", "important");
        await delay(300);
        TurboProgressBar_1.progressBar.style.opacity = "0";
        TurboProgressBar_1.running = false;
        closePopover(TurboProgressBar_1.progressBar);
        TurboProgressBar_1.progressBar.removeAttribute("popover");
      }, { timeout: 100 });
    }
  }, __publicField(_qa, "propTypes", {
    xoRunning: "boolean"
  }), __publicField(_qa, "progressBar"), __publicField(_qa, "running", false), __publicField(_qa, "completed", false), __publicField(_qa, "rid", -1), _qa);
  TurboProgressBar = TurboProgressBar_1 = __decorate([
    customElements$1(WebComponent.TurboProgressBar)
  ], TurboProgressBar);
  function setupFetchInterceptor() {
    if (!document.querySelector(WebComponent.TurboProgressBar)) {
      return;
    }
    const currentFetch = window.fetch;
    window.fetch = async function(...args) {
      TurboProgressBar.run();
      try {
        const response = await currentFetch.apply(this, args);
        TurboProgressBar.complete();
        return response;
      } catch (error) {
        TurboProgressBar.complete();
        throw error;
      }
    };
  }
  setupFetchInterceptor();
  const defaultBreakpoints = {
    sm: 575,
    md: 767,
    lg: 991,
    xl: 1199
  };
  const RESIZE_DELAY = 400;
  function viewTransition(fn) {
    return function(...params) {
      const context = this;
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          fn.apply(context, params);
        });
      } else {
        fn.apply(context, params);
      }
    };
  }
  function getGridEl(providerEl) {
    return providerEl.querySelector("[xo-column-options-target]");
  }
  function getColumn(column, columns) {
    var _a2, _b2;
    if (columns) {
      const breakpointKeys = objectKeys(columns || {});
      const result = breakpointKeys.sort((a, b) => Number(a) - Number(b)).reduce((acc, key, index) => {
        var _a3, _b3;
        const maxStr = key.toString();
        const minStr = ((_b3 = (_a3 = breakpointKeys[index - 1]) == null ? void 0 : _a3.toString) == null ? void 0 : _b3.call(_a3)) || "0";
        const max = parseInt(maxStr) || 0;
        const min = parseInt(minStr) || 0;
        if (window.innerWidth > min && window.innerWidth <= max) {
          return columns[key].toString();
        }
        return acc;
      }, (_a2 = column == null ? void 0 : column.toString()) != null ? _a2 : "1");
      return result;
    }
    return (_b2 = column == null ? void 0 : column.toString()) != null ? _b2 : "1";
  }
  function getColumnFromEl(el) {
    const column = el.getAttribute("xo-column");
    const columns = el.getAttribute("xo-columns");
    if (column) {
      return getColumn(column, columns ? objectParse(columns) : void 0);
    }
    return "1";
  }
  function updateGrid(providerEl, column, columns) {
    const gridEl = getGridEl(providerEl);
    const xsEl = providerEl.querySelector(`${WebComponent.ColumnOptionsTrigger}[xo-device="xs"]`);
    const smEl = providerEl.querySelector(`${WebComponent.ColumnOptionsTrigger}[xo-device="sm"]`);
    const mdEl = providerEl.querySelector(`${WebComponent.ColumnOptionsTrigger}[xo-device="md"]`);
    const lgEl = providerEl.querySelector(`${WebComponent.ColumnOptionsTrigger}[xo-device="lg"]`);
    if (!gridEl) {
      return;
    }
    if (!column) {
      return;
    }
    const colCalculated = getColumn(column, columns);
    const xsCol = xsEl ? Math.min(Number(getColumnFromEl(xsEl)), Number(colCalculated)).toString() : colCalculated;
    const smCol = smEl ? Math.min(Number(getColumnFromEl(smEl)), Number(colCalculated)).toString() : colCalculated;
    const mdCol = mdEl ? Math.min(Number(getColumnFromEl(mdEl)), Number(colCalculated)).toString() : colCalculated;
    const lgCol = lgEl ? Math.min(Number(getColumnFromEl(lgEl)), Number(colCalculated)).toString() : colCalculated;
    if (gridEl.localName === "xo-grid") {
      if (window.innerWidth <= defaultBreakpoints.sm) {
        gridEl.style.setProperty(`--xs`, xsCol);
        gridEl.style.setProperty(`--sm`, xsCol);
        gridEl.style.setProperty(`--md`, xsCol);
        gridEl.style.setProperty(`--lg`, xsCol);
      } else if (window.innerWidth > defaultBreakpoints.sm && window.innerWidth <= defaultBreakpoints.md) {
        gridEl.style.setProperty(`--xs`, xsCol);
        gridEl.style.setProperty(`--sm`, smCol);
        gridEl.style.setProperty(`--md`, smCol);
        gridEl.style.setProperty(`--lg`, smCol);
      } else if (window.innerWidth > defaultBreakpoints.md && window.innerWidth <= defaultBreakpoints.lg) {
        gridEl.style.setProperty(`--xs`, xsCol);
        gridEl.style.setProperty(`--sm`, smCol);
        gridEl.style.setProperty(`--md`, mdCol);
        gridEl.style.setProperty(`--lg`, mdCol);
      } else if (window.innerWidth > defaultBreakpoints.lg) {
        gridEl.style.setProperty(`--xs`, xsCol);
        gridEl.style.setProperty(`--sm`, smCol);
        gridEl.style.setProperty(`--md`, mdCol);
        gridEl.style.setProperty(`--lg`, lgCol);
      }
    } else if (gridEl.classList.contains("xo-grid-block")) {
      if (window.innerWidth <= defaultBreakpoints.sm) {
        gridEl.style.setProperty(`--xo-col-mobile`, xsCol);
        gridEl.style.setProperty(`--xo-col-tablet`, xsCol);
        gridEl.style.setProperty(`--xo-col-desktop`, xsCol);
      } else if (window.innerWidth > defaultBreakpoints.sm && window.innerWidth <= defaultBreakpoints.md) {
        gridEl.style.setProperty(`--xo-col-mobile`, smCol);
        gridEl.style.setProperty(`--xo-col-tablet`, smCol);
        gridEl.style.setProperty(`--xo-col-desktop`, smCol);
      } else if (window.innerWidth > defaultBreakpoints.md && window.innerWidth <= defaultBreakpoints.lg) {
        gridEl.style.setProperty(`--xo-col-mobile`, smCol);
        gridEl.style.setProperty(`--xo-col-tablet`, mdCol);
        gridEl.style.setProperty(`--xo-col-desktop`, mdCol);
      } else if (window.innerWidth > defaultBreakpoints.lg) {
        gridEl.style.setProperty(`--xo-col-mobile`, smCol);
        gridEl.style.setProperty(`--xo-col-tablet`, mdCol);
        gridEl.style.setProperty(`--xo-col-desktop`, lgCol);
      }
    } else if (gridEl.localName === WebComponent.Masonry) {
      if (window.innerWidth <= defaultBreakpoints.sm) {
        const breakpoints = {
          xs: xsCol,
          sm: xsCol,
          md: xsCol
        };
        gridEl.setAttribute("xo-breakpoints", JSON.stringify(breakpoints));
        gridEl.setAttribute("xo-column", xsCol);
      } else if (window.innerWidth > defaultBreakpoints.sm && window.innerWidth <= defaultBreakpoints.md) {
        const breakpoints = {
          xs: xsCol,
          sm: smCol,
          md: smCol
        };
        gridEl.setAttribute("xo-breakpoints", JSON.stringify(breakpoints));
        gridEl.setAttribute("xo-column", smCol);
      } else if (window.innerWidth > defaultBreakpoints.md && window.innerWidth <= defaultBreakpoints.lg) {
        const breakpoints = {
          xs: xsCol,
          sm: smCol,
          md: mdCol
        };
        gridEl.setAttribute("xo-breakpoints", JSON.stringify(breakpoints));
        gridEl.setAttribute("xo-column", mdCol);
      } else if (window.innerWidth > defaultBreakpoints.lg) {
        const breakpoints = {
          xs: xsCol,
          sm: smCol,
          md: mdCol
        };
        gridEl.setAttribute("xo-breakpoints", JSON.stringify(breakpoints));
        gridEl.setAttribute("xo-column", lgCol);
      }
      gridEl.setAttribute("xo-observed", Date.now().toString());
    }
  }
  let ColumnOptionsProvider = (_ra = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "resizeObserver", null);
      __publicField(this, "debounce", createDebounce());
      __publicField(this, "prevWidth", this.getBoundingClientRect().width);
      __publicField(this, "state", {});
      __publicField(this, "handleResize", this.debounce((entries) => {
        for (let entry of entries) {
          const currentWidth = entry.contentRect.width;
          if (currentWidth !== this.prevWidth) {
            this.setState({ updatedAt: Date.now() });
            this.prevWidth = currentWidth;
          }
        }
      }, RESIZE_DELAY));
    }
    stateUpdate() {
      storage.setItem("@columnOptions", JSON.stringify(this.state));
      updateGrid(this, this.state.currentColumn, this.state.currentColumns);
    }
    mount() {
      var _a2;
      const columnOptions = storage.getItem("@columnOptions");
      if (columnOptions) {
        this.setState(JSON.parse(columnOptions));
      }
      const colEls = Array.from(((_a2 = getGridEl(this)) == null ? void 0 : _a2.children) || []);
      const sectionEl = this.closest(".shopify-section");
      if (document.startViewTransition) {
        each(colEls, (colEl, index) => {
          colEl.style.viewTransitionName = `${sectionEl.id}-xo-item-${index + 1}`;
        });
      }
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(document.body);
    }
    unmount() {
      var _a2;
      (_a2 = this.resizeObserver) == null ? void 0 : _a2.disconnect();
    }
  }, __publicField(_ra, "propTypes", {}), _ra);
  ColumnOptionsProvider = __decorate([
    customElements$1(WebComponent.ColumnOptionsProvider, { isProvider: true })
  ], ColumnOptionsProvider);
  const propTypes = {
    xoColumns: Object,
    xoColumn: Number,
    xoDevice: String,
    xoActive: XoComponent.Optional.Boolean
  };
  let ColumnOptionsTrigger = (_ua = class extends XoComponent {
    constructor() {
      super(...arguments);
      __publicField(this, "context", this.queryContext(WebComponent.ColumnOptionsProvider));
      __publicField(this, "sectionEl", this.closest(".shopify-section"));
      __publicField(this, "columnOptionsEl", (_sa = this.sectionEl) == null ? void 0 : _sa.querySelector(WebComponent.ColumnOptionsProvider));
      __publicField(this, "controller", new AbortController());
      __publicField(this, "resizeObserver", null);
      __publicField(this, "debounce", createDebounce());
      __publicField(this, "prevWidth", (_ta = this.context) == null ? void 0 : _ta.getBoundingClientRect().width);
      __publicField(this, "setCurrentColumn", () => {
        const { xoColumn, xoColumns } = this.props;
        this.context.setState({ currentColumn: xoColumn, currentColumns: xoColumns, updatedAt: Date.now() });
      });
      __publicField(this, "handleInferActive", () => {
        const activeEls = Array.from(this.context.querySelectorAll(`${WebComponent.ColumnOptionsTrigger}[xo-active]`));
        each(activeEls, (el) => {
          el.setProps({ xoActive: false });
        });
        this.setProps({ xoActive: true });
        updateGrid(this.context, this.props.xoColumn, this.props.xoColumns);
      });
      __publicField(this, "updateColumn", () => {
        const { xoDevice } = this.props;
        const { currentColumn } = this.context.state;
        const cond = currentColumn ? currentColumn >= this.props.xoColumn : true;
        if (window.innerWidth <= defaultBreakpoints.sm && xoDevice === "xs" && cond) {
          this.handleInferActive();
        } else if (window.innerWidth > defaultBreakpoints.sm && window.innerWidth <= defaultBreakpoints.md && xoDevice === "sm" && cond) {
          this.handleInferActive();
        } else if (window.innerWidth > defaultBreakpoints.md && window.innerWidth <= defaultBreakpoints.lg && xoDevice === "md" && cond) {
          this.handleInferActive();
        } else if (window.innerWidth > defaultBreakpoints.lg && xoDevice === "lg" && cond) {
          this.handleInferActive();
        }
      });
      __publicField(this, "handleResize", this.debounce((entries) => {
        for (let entry of entries) {
          const currentWidth = entry.contentRect.width;
          if (currentWidth !== this.prevWidth) {
            this.updateColumn();
            this.prevWidth = currentWidth;
          }
        }
      }, RESIZE_DELAY));
    }
    handleActive() {
      const { xoColumn } = this.props;
      const { currentColumn } = this.context.state;
      this.setProps({ xoActive: currentColumn === xoColumn });
    }
    mount() {
      if (!this.columnOptionsEl) {
        return;
      }
      if (!this.context) {
        throw new Error(`${WebComponent.ColumnOptionsTrigger} must be used within a ${WebComponent.ColumnOptionsProvider}`);
      }
      (async () => {
        await delay();
        this.updateColumn();
      })();
      this.addEventListener("click", viewTransition(this.setCurrentColumn), this.controller);
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(document.body);
    }
    unmount() {
      var _a2;
      this.controller.abort();
      (_a2 = this.resizeObserver) == null ? void 0 : _a2.disconnect();
    }
  }, __publicField(_ua, "propTypes", propTypes), _ua);
  __decorate([
    contextUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
  ], ColumnOptionsTrigger.prototype, "handleActive", null);
  ColumnOptionsTrigger = __decorate([
    customElements$1(WebComponent.ColumnOptionsTrigger)
  ], ColumnOptionsTrigger);
  const styles = "";
  window.XoComponent = XoComponent;
  window.xoCustomElements = customElements$1;
  function handleRoleButton() {
    document.addEventListener("keydown", async (event) => {
      const isEnter = event.key === "Enter" || event.key === " ";
      const element = event.target;
      if (element) {
        const isButton = attrBoolean.get(element, "xo-button") || attrBoolean.get(element, "data-button") || element.getAttribute("role") === "button";
        const isCarouselThumb = element.tagName.toLowerCase() === WebComponent.CarouselSlide && element.closest(WebComponent.CarouselThumbnail);
        if (isButton && isEnter) {
          await delay();
          element.click();
        }
        if (isCarouselThumb) {
          element.click();
        }
        const link = element.getAttribute("xb-href");
        if (link && isEnter) {
          if (event.ctrlKey || event.metaKey) {
            window.open(link, "_blank", "noopener,noreferrer");
          } else {
            window.location.href = link;
          }
        }
      }
    });
  }
  function handleAnchor() {
    const anchorEls = document.querySelectorAll("a");
    anchorEls.forEach((el) => {
      const href = el.getAttribute("href");
      if (href) {
        el.setAttribute("href", getRootRoute(href));
      }
    });
  }
  async function viewedProducts() {
    var _a2, _b2;
    if (location.pathname.startsWith("/products/")) {
      if ((_b2 = (_a2 = window.meta) == null ? void 0 : _a2.product) == null ? void 0 : _b2.id) {
        addProduct("viewed", window.meta.product.id.toString());
      } else {
        const productInformationEl = document.querySelector(`${WebComponent.Product}[xo-product-information]`);
        const productId = productInformationEl == null ? void 0 : productInformationEl.getAttribute("xo-product-id");
        if (productId) {
          addProduct("viewed", productId);
        }
      }
    }
  }
  function measure() {
    function handler(currentTarget) {
      const parentSelector = currentTarget.getAttribute("xo-measure-parent-selector");
      const parentEl = parentSelector ? currentTarget.closest(parentSelector) : null;
      const currentOffset = offset(currentTarget);
      const parentOffset = parentEl ? offset(parentEl) : { top: 0, left: 0 };
      const top = currentOffset.top - parentOffset.top;
      const left = currentOffset.left - parentOffset.left;
      const { width, height } = currentTarget.getBoundingClientRect();
      currentTarget.style.setProperty("--xo-top", top.toString());
      currentTarget.style.setProperty("--xo-left", left.toString());
      currentTarget.style.setProperty("--xo-width", width.toString());
      currentTarget.style.setProperty("--xo-height", height.toString());
      currentTarget.style.setProperty("--xo-current-left", currentOffset.left.toString());
    }
    function handleEvent(event) {
      const target = event.target;
      const currentTarget = target.closest("[xo-measure]");
      if (currentTarget) {
        handler(currentTarget);
      }
    }
    setTimeout(() => {
      const els = Array.from(document.querySelectorAll("[xo-measure]"));
      each(els, (el) => {
        handler(el);
        el.addEventListener("mouseenter", handleEvent);
      });
    }, 500);
    window.addEventListener("click", handleEvent);
  }
  function handleYtbSrc() {
    const ytbVideoEls = document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');
    ytbVideoEls.forEach((ytbVideoEl) => {
      if (!ytbVideoEl.src.includes("enablejsapi=")) {
        if (ytbVideoEl.src.includes("?")) {
          ytbVideoEl.src += "&enablejsapi=1";
        } else {
          ytbVideoEl.src += "?enablejsapi=1";
        }
      }
    });
  }
  function handleSmoothScroll() {
    if (attrBoolean.get(document.documentElement, "xo-desktop-smooth-scroll")) {
      const lerp2 = Number(attrBoolean.get(document.documentElement, "xo-desktop-smooth-scroll-lerp") || "0.1");
      const speed = Number(attrBoolean.get(document.documentElement, "xo-desktop-smooth-scroll-speed") || "1");
      desktopSmoothScroll({
        platform: attrBoolean.get(document.documentElement, "xo-desktop-smooth-scroll"),
        lerp: isNaN(lerp2) ? 0.1 : lerp2,
        speed: isNaN(speed) ? 1 : speed
      });
    }
  }
  function handleScrollbarWidth() {
    if (isBot()) {
      return;
    }
    requestAnimationFrame(() => {
      const scrollBarWidth = getScrollbarWidth();
      document.body.style.setProperty("--xo-root-scrollbar-width", scrollBarWidth.toString());
    });
  }
  DOMLoaded(() => {
    if (isBot()) {
      const animateEls = Array.from(document.querySelectorAll(WebComponent.Animate));
      each(animateEls, (animateEl) => {
        attrBoolean.set(animateEl, "xo-disabled", true);
      });
      return;
    }
    handleYtbSrc();
    handleRoleButton();
    handleAnchor();
    setHoverLevel();
    viewedProducts();
    measure();
    stickyCartPropertySignal();
    handleSmoothScroll();
    handleScrollbarWidth();
  });
  const base = "";
  console.log("WC V1.9.17");
  exports2.CircleBar = CircleBar;
  exports2.cartFormSubscribe = cartFormSubscribe;
  exports2.cartSubscribe = cartSubscribe;
  exports2.fieldSignal = fieldSignal;
  exports2.getCartFormState = getCartFormState;
  exports2.getCartState = getCartState;
  exports2.xoCarousel = xoCarousel;
  exports2.xoCircleBar = xoCircleBar;
  exports2.xoCollapse = xoCollapse;
  exports2.xoFilters = xoFilters;
  exports2.xoGroup = xoGroup;
  exports2.xoModal = xoModal;
  exports2.xoPopover = xoPopover;
  exports2.xoProductQuickView = xoProductQuickView;
  exports2.xoSticky = xoSticky;
  exports2.xoStore = xoStore;
  exports2.xoTabs = xoTabs;
  exports2.xoToast = xoToast;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
