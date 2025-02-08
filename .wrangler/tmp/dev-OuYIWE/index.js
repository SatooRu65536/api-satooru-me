(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // node_modules/.pnpm/wrangler@3.107.3_@cloudflare+workers-types@4.20250204.0/node_modules/wrangler/templates/middleware/common.ts
  var __facade_middleware__ = [];
  function __facade_register__(...args) {
    __facade_middleware__.push(...args.flat());
  }
  __name(__facade_register__, "__facade_register__");
  function __facade_registerInternal__(...args) {
    __facade_middleware__.unshift(...args.flat());
  }
  __name(__facade_registerInternal__, "__facade_registerInternal__");
  function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
    const [head, ...tail] = middlewareChain;
    const middlewareCtx = {
      dispatch,
      next(newRequest, newEnv) {
        return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
      }
    };
    return head(request, env, ctx, middlewareCtx);
  }
  __name(__facade_invokeChain__, "__facade_invokeChain__");
  function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
    return __facade_invokeChain__(request, env, ctx, dispatch, [
      ...__facade_middleware__,
      finalMiddleware
    ]);
  }
  __name(__facade_invoke__, "__facade_invoke__");

  // node_modules/.pnpm/wrangler@3.107.3_@cloudflare+workers-types@4.20250204.0/node_modules/wrangler/templates/middleware/loader-sw.ts
  var __FACADE_EVENT_TARGET__;
  if (globalThis.MINIFLARE) {
    __FACADE_EVENT_TARGET__ = new (Object.getPrototypeOf(WorkerGlobalScope))();
  } else {
    __FACADE_EVENT_TARGET__ = new EventTarget();
  }
  function __facade_isSpecialEvent__(type) {
    return type === "fetch" || type === "scheduled";
  }
  __name(__facade_isSpecialEvent__, "__facade_isSpecialEvent__");
  var __facade__originalAddEventListener__ = globalThis.addEventListener;
  var __facade__originalRemoveEventListener__ = globalThis.removeEventListener;
  var __facade__originalDispatchEvent__ = globalThis.dispatchEvent;
  globalThis.addEventListener = function(type, listener, options) {
    if (__facade_isSpecialEvent__(type)) {
      __FACADE_EVENT_TARGET__.addEventListener(
        type,
        listener,
        options
      );
    } else {
      __facade__originalAddEventListener__(type, listener, options);
    }
  };
  globalThis.removeEventListener = function(type, listener, options) {
    if (__facade_isSpecialEvent__(type)) {
      __FACADE_EVENT_TARGET__.removeEventListener(
        type,
        listener,
        options
      );
    } else {
      __facade__originalRemoveEventListener__(type, listener, options);
    }
  };
  globalThis.dispatchEvent = function(event) {
    if (__facade_isSpecialEvent__(event.type)) {
      return __FACADE_EVENT_TARGET__.dispatchEvent(event);
    } else {
      return __facade__originalDispatchEvent__(event);
    }
  };
  globalThis.addMiddleware = __facade_register__;
  globalThis.addMiddlewareInternal = __facade_registerInternal__;
  var __facade_waitUntil__ = Symbol("__facade_waitUntil__");
  var __facade_response__ = Symbol("__facade_response__");
  var __facade_dispatched__ = Symbol("__facade_dispatched__");
  var __Facade_ExtendableEvent__ = class extends Event {
    [__facade_waitUntil__] = [];
    waitUntil(promise) {
      if (!(this instanceof __Facade_ExtendableEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this[__facade_waitUntil__].push(promise);
    }
  };
  __name(__Facade_ExtendableEvent__, "__Facade_ExtendableEvent__");
  var __Facade_FetchEvent__ = class extends __Facade_ExtendableEvent__ {
    #request;
    #passThroughOnException;
    [__facade_response__];
    [__facade_dispatched__] = false;
    constructor(type, init) {
      super(type);
      this.#request = init.request;
      this.#passThroughOnException = init.passThroughOnException;
    }
    get request() {
      return this.#request;
    }
    respondWith(response) {
      if (!(this instanceof __Facade_FetchEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      if (this[__facade_response__] !== void 0) {
        throw new DOMException(
          "FetchEvent.respondWith() has already been called; it can only be called once.",
          "InvalidStateError"
        );
      }
      if (this[__facade_dispatched__]) {
        throw new DOMException(
          "Too late to call FetchEvent.respondWith(). It must be called synchronously in the event handler.",
          "InvalidStateError"
        );
      }
      this.stopImmediatePropagation();
      this[__facade_response__] = response;
    }
    passThroughOnException() {
      if (!(this instanceof __Facade_FetchEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this.#passThroughOnException();
    }
  };
  __name(__Facade_FetchEvent__, "__Facade_FetchEvent__");
  var __Facade_ScheduledEvent__ = class extends __Facade_ExtendableEvent__ {
    #scheduledTime;
    #cron;
    #noRetry;
    constructor(type, init) {
      super(type);
      this.#scheduledTime = init.scheduledTime;
      this.#cron = init.cron;
      this.#noRetry = init.noRetry;
    }
    get scheduledTime() {
      return this.#scheduledTime;
    }
    get cron() {
      return this.#cron;
    }
    noRetry() {
      if (!(this instanceof __Facade_ScheduledEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this.#noRetry();
    }
  };
  __name(__Facade_ScheduledEvent__, "__Facade_ScheduledEvent__");
  __facade__originalAddEventListener__("fetch", (event) => {
    const ctx = {
      waitUntil: event.waitUntil.bind(event),
      passThroughOnException: event.passThroughOnException.bind(event)
    };
    const __facade_sw_dispatch__ = /* @__PURE__ */ __name(function(type, init) {
      if (type === "scheduled") {
        const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
          scheduledTime: Date.now(),
          cron: init.cron ?? "",
          noRetry() {
          }
        });
        __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
        event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      }
    }, "__facade_sw_dispatch__");
    const __facade_sw_fetch__ = /* @__PURE__ */ __name(function(request, _env, ctx2) {
      const facadeEvent = new __Facade_FetchEvent__("fetch", {
        request,
        passThroughOnException: ctx2.passThroughOnException
      });
      __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
      facadeEvent[__facade_dispatched__] = true;
      event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      const response = facadeEvent[__facade_response__];
      if (response === void 0) {
        throw new Error("No response!");
      }
      return response;
    }, "__facade_sw_fetch__");
    event.respondWith(
      __facade_invoke__(
        event.request,
        globalThis,
        ctx,
        __facade_sw_dispatch__,
        __facade_sw_fetch__
      )
    );
  });
  __facade__originalAddEventListener__("scheduled", (event) => {
    const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
      scheduledTime: event.scheduledTime,
      cron: event.cron,
      noRetry: event.noRetry.bind(event)
    });
    __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
    event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
  });

  // node_modules/.pnpm/wrangler@3.107.3_@cloudflare+workers-types@4.20250204.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
  var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
    try {
      return await middlewareCtx.next(request, env);
    } finally {
      try {
        if (request.body !== null && !request.bodyUsed) {
          const reader = request.body.getReader();
          while (!(await reader.read()).done) {
          }
        }
      } catch (e) {
        console.error("Failed to drain the unused request body.", e);
      }
    }
  }, "drainBody");
  var middleware_ensure_req_body_drained_default = drainBody;

  // node_modules/.pnpm/wrangler@3.107.3_@cloudflare+workers-types@4.20250204.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
  function reduceError(e) {
    return {
      name: e?.name,
      message: e?.message ?? String(e),
      stack: e?.stack,
      cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
    };
  }
  __name(reduceError, "reduceError");
  var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
    try {
      return await middlewareCtx.next(request, env);
    } catch (e) {
      const error = reduceError(e);
      return Response.json(error, {
        status: 500,
        headers: { "MF-Experimental-Error-Stack": "true" }
      });
    }
  }, "jsonError");
  var middleware_miniflare3_json_error_default = jsonError;

  // .wrangler/tmp/bundle-wv1ESV/middleware-insertion-facade.js
  __facade_registerInternal__([middleware_ensure_req_body_drained_default, middleware_miniflare3_json_error_default]);

  // .output/server/index.mjs
  globalThis._importMeta_ = { url: "file:///_entry.js", env: {} }, function() {
    "use strict";
    function createNotImplementedError(e2) {
      throw new Error(`[unenv] ${e2} is not implemented yet!`);
    }
    __name(createNotImplementedError, "createNotImplementedError");
    function notImplemented(e2) {
      return Object.assign(() => {
        throw createNotImplementedError(e2);
      }, { __unenv__: true });
    }
    __name(notImplemented, "notImplemented");
    const e = [], n = [], o = "undefined" == typeof Uint8Array ? Array : Uint8Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (let o2 = 0, i2 = 64; o2 < i2; ++o2)
      e[o2] = s[o2], n[s.charCodeAt(o2)] = o2;
    function toByteArray(e2) {
      let s2;
      const i2 = function(e3) {
        const n2 = e3.length;
        if (n2 % 4 > 0)
          throw new Error("Invalid string. Length must be a multiple of 4");
        let o2 = e3.indexOf("=");
        return -1 === o2 && (o2 = n2), [o2, o2 === n2 ? 0 : 4 - o2 % 4];
      }(e2), a2 = i2[0], c2 = i2[1], u2 = new o(function(e3, n2, o2) {
        return 3 * (n2 + o2) / 4 - o2;
      }(0, a2, c2));
      let f2 = 0;
      const p2 = c2 > 0 ? a2 - 4 : a2;
      let g2;
      for (g2 = 0; g2 < p2; g2 += 4)
        s2 = n[e2.charCodeAt(g2)] << 18 | n[e2.charCodeAt(g2 + 1)] << 12 | n[e2.charCodeAt(g2 + 2)] << 6 | n[e2.charCodeAt(g2 + 3)], u2[f2++] = s2 >> 16 & 255, u2[f2++] = s2 >> 8 & 255, u2[f2++] = 255 & s2;
      return 2 === c2 && (s2 = n[e2.charCodeAt(g2)] << 2 | n[e2.charCodeAt(g2 + 1)] >> 4, u2[f2++] = 255 & s2), 1 === c2 && (s2 = n[e2.charCodeAt(g2)] << 10 | n[e2.charCodeAt(g2 + 1)] << 4 | n[e2.charCodeAt(g2 + 2)] >> 2, u2[f2++] = s2 >> 8 & 255, u2[f2++] = 255 & s2), u2;
    }
    __name(toByteArray, "toByteArray");
    function encodeChunk(n2, o2, s2) {
      let i2;
      const a2 = [];
      for (let u2 = o2; u2 < s2; u2 += 3)
        i2 = (n2[u2] << 16 & 16711680) + (n2[u2 + 1] << 8 & 65280) + (255 & n2[u2 + 2]), a2.push(e[(c2 = i2) >> 18 & 63] + e[c2 >> 12 & 63] + e[c2 >> 6 & 63] + e[63 & c2]);
      var c2;
      return a2.join("");
    }
    __name(encodeChunk, "encodeChunk");
    function fromByteArray(n2) {
      let o2;
      const s2 = n2.length, i2 = s2 % 3, a2 = [], c2 = 16383;
      for (let e2 = 0, o3 = s2 - i2; e2 < o3; e2 += c2)
        a2.push(encodeChunk(n2, e2, e2 + c2 > o3 ? o3 : e2 + c2));
      return 1 === i2 ? (o2 = n2[s2 - 1], a2.push(e[o2 >> 2] + e[o2 << 4 & 63] + "==")) : 2 === i2 && (o2 = (n2[s2 - 2] << 8) + n2[s2 - 1], a2.push(e[o2 >> 10] + e[o2 >> 4 & 63] + e[o2 << 2 & 63] + "=")), a2.join("");
    }
    __name(fromByteArray, "fromByteArray");
    function read(e2, n2, o2, s2, i2) {
      let a2, c2;
      const u2 = 8 * i2 - s2 - 1, f2 = (1 << u2) - 1, p2 = f2 >> 1;
      let g2 = -7, w2 = o2 ? i2 - 1 : 0;
      const b2 = o2 ? -1 : 1;
      let v2 = e2[n2 + w2];
      for (w2 += b2, a2 = v2 & (1 << -g2) - 1, v2 >>= -g2, g2 += u2; g2 > 0; )
        a2 = 256 * a2 + e2[n2 + w2], w2 += b2, g2 -= 8;
      for (c2 = a2 & (1 << -g2) - 1, a2 >>= -g2, g2 += s2; g2 > 0; )
        c2 = 256 * c2 + e2[n2 + w2], w2 += b2, g2 -= 8;
      if (0 === a2)
        a2 = 1 - p2;
      else {
        if (a2 === f2)
          return c2 ? Number.NaN : (v2 ? -1 : 1) * Number.POSITIVE_INFINITY;
        c2 += Math.pow(2, s2), a2 -= p2;
      }
      return (v2 ? -1 : 1) * c2 * Math.pow(2, a2 - s2);
    }
    __name(read, "read");
    function write(e2, n2, o2, s2, i2, a2) {
      let c2, u2, f2, p2 = 8 * a2 - i2 - 1;
      const g2 = (1 << p2) - 1, w2 = g2 >> 1, b2 = 23 === i2 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      let v2 = s2 ? 0 : a2 - 1;
      const _2 = s2 ? 1 : -1, x2 = n2 < 0 || 0 === n2 && 1 / n2 < 0 ? 1 : 0;
      for (n2 = Math.abs(n2), Number.isNaN(n2) || n2 === Number.POSITIVE_INFINITY ? (u2 = Number.isNaN(n2) ? 1 : 0, c2 = g2) : (c2 = Math.floor(Math.log2(n2)), n2 * (f2 = Math.pow(2, -c2)) < 1 && (c2--, f2 *= 2), (n2 += c2 + w2 >= 1 ? b2 / f2 : b2 * Math.pow(2, 1 - w2)) * f2 >= 2 && (c2++, f2 /= 2), c2 + w2 >= g2 ? (u2 = 0, c2 = g2) : c2 + w2 >= 1 ? (u2 = (n2 * f2 - 1) * Math.pow(2, i2), c2 += w2) : (u2 = n2 * Math.pow(2, w2 - 1) * Math.pow(2, i2), c2 = 0)); i2 >= 8; )
        e2[o2 + v2] = 255 & u2, v2 += _2, u2 /= 256, i2 -= 8;
      for (c2 = c2 << i2 | u2, p2 += i2; p2 > 0; )
        e2[o2 + v2] = 255 & c2, v2 += _2, c2 /= 256, p2 -= 8;
      e2[o2 + v2 - _2] |= 128 * x2;
    }
    __name(write, "write");
    n["-".charCodeAt(0)] = 62, n["_".charCodeAt(0)] = 63;
    const i = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null, a = 2147483647;
    function createBuffer(e2) {
      if (e2 > a)
        throw new RangeError('The value "' + e2 + '" is invalid for option "size"');
      const n2 = new Uint8Array(e2);
      return Object.setPrototypeOf(n2, Buffer$1.prototype), n2;
    }
    __name(createBuffer, "createBuffer");
    function Buffer$1(e2, n2, o2) {
      if ("number" == typeof e2) {
        if ("string" == typeof n2)
          throw new TypeError('The "string" argument must be of type string. Received type number');
        return allocUnsafe(e2);
      }
      return from(e2, n2, o2);
    }
    __name(Buffer$1, "Buffer$1");
    function from(e2, n2, o2) {
      if ("string" == typeof e2)
        return function(e3, n3) {
          "string" == typeof n3 && "" !== n3 || (n3 = "utf8");
          if (!Buffer$1.isEncoding(n3))
            throw new TypeError("Unknown encoding: " + n3);
          const o3 = 0 | byteLength(e3, n3);
          let s3 = createBuffer(o3);
          const i3 = s3.write(e3, n3);
          i3 !== o3 && (s3 = s3.slice(0, i3));
          return s3;
        }(e2, n2);
      if (ArrayBuffer.isView(e2))
        return function(e3) {
          if (isInstance(e3, Uint8Array)) {
            const n3 = new Uint8Array(e3);
            return fromArrayBuffer(n3.buffer, n3.byteOffset, n3.byteLength);
          }
          return fromArrayLike(e3);
        }(e2);
      if (null == e2)
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e2);
      if (isInstance(e2, ArrayBuffer) || e2 && isInstance(e2.buffer, ArrayBuffer))
        return fromArrayBuffer(e2, n2, o2);
      if ("undefined" != typeof SharedArrayBuffer && (isInstance(e2, SharedArrayBuffer) || e2 && isInstance(e2.buffer, SharedArrayBuffer)))
        return fromArrayBuffer(e2, n2, o2);
      if ("number" == typeof e2)
        throw new TypeError('The "value" argument must not be of type number. Received type number');
      const s2 = e2.valueOf && e2.valueOf();
      if (null != s2 && s2 !== e2)
        return Buffer$1.from(s2, n2, o2);
      const i2 = function(e3) {
        if (Buffer$1.isBuffer(e3)) {
          const n3 = 0 | checked(e3.length), o3 = createBuffer(n3);
          return 0 === o3.length || e3.copy(o3, 0, 0, n3), o3;
        }
        if (void 0 !== e3.length)
          return "number" != typeof e3.length || numberIsNaN(e3.length) ? createBuffer(0) : fromArrayLike(e3);
        if ("Buffer" === e3.type && Array.isArray(e3.data))
          return fromArrayLike(e3.data);
      }(e2);
      if (i2)
        return i2;
      if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e2[Symbol.toPrimitive])
        return Buffer$1.from(e2[Symbol.toPrimitive]("string"), n2, o2);
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e2);
    }
    __name(from, "from");
    function assertSize(e2) {
      if ("number" != typeof e2)
        throw new TypeError('"size" argument must be of type number');
      if (e2 < 0)
        throw new RangeError('The value "' + e2 + '" is invalid for option "size"');
    }
    __name(assertSize, "assertSize");
    function allocUnsafe(e2) {
      return assertSize(e2), createBuffer(e2 < 0 ? 0 : 0 | checked(e2));
    }
    __name(allocUnsafe, "allocUnsafe");
    function fromArrayLike(e2) {
      const n2 = e2.length < 0 ? 0 : 0 | checked(e2.length), o2 = createBuffer(n2);
      for (let s2 = 0; s2 < n2; s2 += 1)
        o2[s2] = 255 & e2[s2];
      return o2;
    }
    __name(fromArrayLike, "fromArrayLike");
    function fromArrayBuffer(e2, n2, o2) {
      if (n2 < 0 || e2.byteLength < n2)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (e2.byteLength < n2 + (o2 || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      let s2;
      return s2 = void 0 === n2 && void 0 === o2 ? new Uint8Array(e2) : void 0 === o2 ? new Uint8Array(e2, n2) : new Uint8Array(e2, n2, o2), Object.setPrototypeOf(s2, Buffer$1.prototype), s2;
    }
    __name(fromArrayBuffer, "fromArrayBuffer");
    function checked(e2) {
      if (e2 >= a)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a.toString(16) + " bytes");
      return 0 | e2;
    }
    __name(checked, "checked");
    function byteLength(e2, n2) {
      if (Buffer$1.isBuffer(e2))
        return e2.length;
      if (ArrayBuffer.isView(e2) || isInstance(e2, ArrayBuffer))
        return e2.byteLength;
      if ("string" != typeof e2)
        throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e2);
      const o2 = e2.length, s2 = arguments.length > 2 && true === arguments[2];
      if (!s2 && 0 === o2)
        return 0;
      let i2 = false;
      for (; ; )
        switch (n2) {
          case "ascii":
          case "latin1":
          case "binary":
            return o2;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(e2).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return 2 * o2;
          case "hex":
            return o2 >>> 1;
          case "base64":
            return base64ToBytes(e2).length;
          default:
            if (i2)
              return s2 ? -1 : utf8ToBytes(e2).length;
            n2 = ("" + n2).toLowerCase(), i2 = true;
        }
    }
    __name(byteLength, "byteLength");
    function slowToString(e2, n2, o2) {
      let s2 = false;
      if ((void 0 === n2 || n2 < 0) && (n2 = 0), n2 > this.length)
        return "";
      if ((void 0 === o2 || o2 > this.length) && (o2 = this.length), o2 <= 0)
        return "";
      if ((o2 >>>= 0) <= (n2 >>>= 0))
        return "";
      for (e2 || (e2 = "utf8"); ; )
        switch (e2) {
          case "hex":
            return hexSlice(this, n2, o2);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, n2, o2);
          case "ascii":
            return asciiSlice(this, n2, o2);
          case "latin1":
          case "binary":
            return latin1Slice(this, n2, o2);
          case "base64":
            return base64Slice(this, n2, o2);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, n2, o2);
          default:
            if (s2)
              throw new TypeError("Unknown encoding: " + e2);
            e2 = (e2 + "").toLowerCase(), s2 = true;
        }
    }
    __name(slowToString, "slowToString");
    function swap(e2, n2, o2) {
      const s2 = e2[n2];
      e2[n2] = e2[o2], e2[o2] = s2;
    }
    __name(swap, "swap");
    function bidirectionalIndexOf(e2, n2, o2, s2, i2) {
      if (0 === e2.length)
        return -1;
      if ("string" == typeof o2 ? (s2 = o2, o2 = 0) : o2 > 2147483647 ? o2 = 2147483647 : o2 < -2147483648 && (o2 = -2147483648), numberIsNaN(o2 = +o2) && (o2 = i2 ? 0 : e2.length - 1), o2 < 0 && (o2 = e2.length + o2), o2 >= e2.length) {
        if (i2)
          return -1;
        o2 = e2.length - 1;
      } else if (o2 < 0) {
        if (!i2)
          return -1;
        o2 = 0;
      }
      if ("string" == typeof n2 && (n2 = Buffer$1.from(n2, s2)), Buffer$1.isBuffer(n2))
        return 0 === n2.length ? -1 : arrayIndexOf(e2, n2, o2, s2, i2);
      if ("number" == typeof n2)
        return n2 &= 255, "function" == typeof Uint8Array.prototype.indexOf ? i2 ? Uint8Array.prototype.indexOf.call(e2, n2, o2) : Uint8Array.prototype.lastIndexOf.call(e2, n2, o2) : arrayIndexOf(e2, [n2], o2, s2, i2);
      throw new TypeError("val must be string, number or Buffer");
    }
    __name(bidirectionalIndexOf, "bidirectionalIndexOf");
    function arrayIndexOf(e2, n2, o2, s2, i2) {
      let a2, c2 = 1, u2 = e2.length, f2 = n2.length;
      if (void 0 !== s2 && ("ucs2" === (s2 = String(s2).toLowerCase()) || "ucs-2" === s2 || "utf16le" === s2 || "utf-16le" === s2)) {
        if (e2.length < 2 || n2.length < 2)
          return -1;
        c2 = 2, u2 /= 2, f2 /= 2, o2 /= 2;
      }
      function read2(e3, n3) {
        return 1 === c2 ? e3[n3] : e3.readUInt16BE(n3 * c2);
      }
      __name(read2, "read");
      if (i2) {
        let s3 = -1;
        for (a2 = o2; a2 < u2; a2++)
          if (read2(e2, a2) === read2(n2, -1 === s3 ? 0 : a2 - s3)) {
            if (-1 === s3 && (s3 = a2), a2 - s3 + 1 === f2)
              return s3 * c2;
          } else
            -1 !== s3 && (a2 -= a2 - s3), s3 = -1;
      } else
        for (o2 + f2 > u2 && (o2 = u2 - f2), a2 = o2; a2 >= 0; a2--) {
          let o3 = true;
          for (let s3 = 0; s3 < f2; s3++)
            if (read2(e2, a2 + s3) !== read2(n2, s3)) {
              o3 = false;
              break;
            }
          if (o3)
            return a2;
        }
      return -1;
    }
    __name(arrayIndexOf, "arrayIndexOf");
    function hexWrite(e2, n2, o2, s2) {
      o2 = Number(o2) || 0;
      const i2 = e2.length - o2;
      s2 ? (s2 = Number(s2)) > i2 && (s2 = i2) : s2 = i2;
      const a2 = n2.length;
      let c2;
      for (s2 > a2 / 2 && (s2 = a2 / 2), c2 = 0; c2 < s2; ++c2) {
        const s3 = Number.parseInt(n2.slice(2 * c2, 2 * c2 + 2), 16);
        if (numberIsNaN(s3))
          return c2;
        e2[o2 + c2] = s3;
      }
      return c2;
    }
    __name(hexWrite, "hexWrite");
    function utf8Write(e2, n2, o2, s2) {
      return blitBuffer(utf8ToBytes(n2, e2.length - o2), e2, o2, s2);
    }
    __name(utf8Write, "utf8Write");
    function asciiWrite(e2, n2, o2, s2) {
      return blitBuffer(function(e3) {
        const n3 = [];
        for (let o3 = 0; o3 < e3.length; ++o3)
          n3.push(255 & e3.charCodeAt(o3));
        return n3;
      }(n2), e2, o2, s2);
    }
    __name(asciiWrite, "asciiWrite");
    function base64Write(e2, n2, o2, s2) {
      return blitBuffer(base64ToBytes(n2), e2, o2, s2);
    }
    __name(base64Write, "base64Write");
    function ucs2Write(e2, n2, o2, s2) {
      return blitBuffer(function(e3, n3) {
        let o3, s3, i2;
        const a2 = [];
        for (let c2 = 0; c2 < e3.length && !((n3 -= 2) < 0); ++c2)
          o3 = e3.charCodeAt(c2), s3 = o3 >> 8, i2 = o3 % 256, a2.push(i2, s3);
        return a2;
      }(n2, e2.length - o2), e2, o2, s2);
    }
    __name(ucs2Write, "ucs2Write");
    function base64Slice(e2, n2, o2) {
      return 0 === n2 && o2 === e2.length ? fromByteArray(e2) : fromByteArray(e2.slice(n2, o2));
    }
    __name(base64Slice, "base64Slice");
    function utf8Slice(e2, n2, o2) {
      o2 = Math.min(e2.length, o2);
      const s2 = [];
      let i2 = n2;
      for (; i2 < o2; ) {
        const n3 = e2[i2];
        let a2 = null, c2 = n3 > 239 ? 4 : n3 > 223 ? 3 : n3 > 191 ? 2 : 1;
        if (i2 + c2 <= o2) {
          let o3, s3, u2, f2;
          switch (c2) {
            case 1:
              n3 < 128 && (a2 = n3);
              break;
            case 2:
              o3 = e2[i2 + 1], 128 == (192 & o3) && (f2 = (31 & n3) << 6 | 63 & o3, f2 > 127 && (a2 = f2));
              break;
            case 3:
              o3 = e2[i2 + 1], s3 = e2[i2 + 2], 128 == (192 & o3) && 128 == (192 & s3) && (f2 = (15 & n3) << 12 | (63 & o3) << 6 | 63 & s3, f2 > 2047 && (f2 < 55296 || f2 > 57343) && (a2 = f2));
              break;
            case 4:
              o3 = e2[i2 + 1], s3 = e2[i2 + 2], u2 = e2[i2 + 3], 128 == (192 & o3) && 128 == (192 & s3) && 128 == (192 & u2) && (f2 = (15 & n3) << 18 | (63 & o3) << 12 | (63 & s3) << 6 | 63 & u2, f2 > 65535 && f2 < 1114112 && (a2 = f2));
          }
        }
        null === a2 ? (a2 = 65533, c2 = 1) : a2 > 65535 && (a2 -= 65536, s2.push(a2 >>> 10 & 1023 | 55296), a2 = 56320 | 1023 & a2), s2.push(a2), i2 += c2;
      }
      return function(e3) {
        const n3 = e3.length;
        if (n3 <= c)
          return String.fromCharCode.apply(String, e3);
        let o3 = "", s3 = 0;
        for (; s3 < n3; )
          o3 += String.fromCharCode.apply(String, e3.slice(s3, s3 += c));
        return o3;
      }(s2);
    }
    __name(utf8Slice, "utf8Slice");
    Buffer$1.TYPED_ARRAY_SUPPORT = function() {
      try {
        const e2 = new Uint8Array(1), n2 = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(n2, Uint8Array.prototype), Object.setPrototypeOf(e2, n2), 42 === e2.foo();
      } catch {
        return false;
      }
    }(), Buffer$1.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This environment lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(Buffer$1.prototype, "parent", { enumerable: true, get: function() {
      if (Buffer$1.isBuffer(this))
        return this.buffer;
    } }), Object.defineProperty(Buffer$1.prototype, "offset", { enumerable: true, get: function() {
      if (Buffer$1.isBuffer(this))
        return this.byteOffset;
    } }), Buffer$1.poolSize = 8192, Buffer$1.from = function(e2, n2, o2) {
      return from(e2, n2, o2);
    }, Object.setPrototypeOf(Buffer$1.prototype, Uint8Array.prototype), Object.setPrototypeOf(Buffer$1, Uint8Array), Buffer$1.alloc = function(e2, n2, o2) {
      return function(e3, n3, o3) {
        return assertSize(e3), e3 <= 0 ? createBuffer(e3) : void 0 !== n3 ? "string" == typeof o3 ? createBuffer(e3).fill(n3, o3) : createBuffer(e3).fill(n3) : createBuffer(e3);
      }(e2, n2, o2);
    }, Buffer$1.allocUnsafe = function(e2) {
      return allocUnsafe(e2);
    }, Buffer$1.allocUnsafeSlow = function(e2) {
      return allocUnsafe(e2);
    }, Buffer$1.isBuffer = function(e2) {
      return null != e2 && true === e2._isBuffer && e2 !== Buffer$1.prototype;
    }, Buffer$1.compare = function(e2, n2) {
      if (isInstance(e2, Uint8Array) && (e2 = Buffer$1.from(e2, e2.offset, e2.byteLength)), isInstance(n2, Uint8Array) && (n2 = Buffer$1.from(n2, n2.offset, n2.byteLength)), !Buffer$1.isBuffer(e2) || !Buffer$1.isBuffer(n2))
        throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
      if (e2 === n2)
        return 0;
      let o2 = e2.length, s2 = n2.length;
      for (let i2 = 0, a2 = Math.min(o2, s2); i2 < a2; ++i2)
        if (e2[i2] !== n2[i2]) {
          o2 = e2[i2], s2 = n2[i2];
          break;
        }
      return o2 < s2 ? -1 : s2 < o2 ? 1 : 0;
    }, Buffer$1.isEncoding = function(e2) {
      switch (String(e2).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    }, Buffer$1.concat = function(e2, n2) {
      if (!Array.isArray(e2))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (0 === e2.length)
        return Buffer$1.alloc(0);
      let o2;
      if (void 0 === n2)
        for (n2 = 0, o2 = 0; o2 < e2.length; ++o2)
          n2 += e2[o2].length;
      const s2 = Buffer$1.allocUnsafe(n2);
      let i2 = 0;
      for (o2 = 0; o2 < e2.length; ++o2) {
        let n3 = e2[o2];
        if (isInstance(n3, Uint8Array))
          i2 + n3.length > s2.length ? (Buffer$1.isBuffer(n3) || (n3 = Buffer$1.from(n3.buffer, n3.byteOffset, n3.byteLength)), n3.copy(s2, i2)) : Uint8Array.prototype.set.call(s2, n3, i2);
        else {
          if (!Buffer$1.isBuffer(n3))
            throw new TypeError('"list" argument must be an Array of Buffers');
          n3.copy(s2, i2);
        }
        i2 += n3.length;
      }
      return s2;
    }, Buffer$1.byteLength = byteLength, Buffer$1.prototype._isBuffer = true, Buffer$1.prototype.swap16 = function() {
      const e2 = this.length;
      if (e2 % 2 != 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let n2 = 0; n2 < e2; n2 += 2)
        swap(this, n2, n2 + 1);
      return this;
    }, Buffer$1.prototype.swap32 = function() {
      const e2 = this.length;
      if (e2 % 4 != 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let n2 = 0; n2 < e2; n2 += 4)
        swap(this, n2, n2 + 3), swap(this, n2 + 1, n2 + 2);
      return this;
    }, Buffer$1.prototype.swap64 = function() {
      const e2 = this.length;
      if (e2 % 8 != 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let n2 = 0; n2 < e2; n2 += 8)
        swap(this, n2, n2 + 7), swap(this, n2 + 1, n2 + 6), swap(this, n2 + 2, n2 + 5), swap(this, n2 + 3, n2 + 4);
      return this;
    }, Buffer$1.prototype.toString = function() {
      const e2 = this.length;
      return 0 === e2 ? "" : 0 === arguments.length ? utf8Slice(this, 0, e2) : Reflect.apply(slowToString, this, arguments);
    }, Buffer$1.prototype.toLocaleString = Buffer$1.prototype.toString, Buffer$1.prototype.equals = function(e2) {
      if (!Buffer$1.isBuffer(e2))
        throw new TypeError("Argument must be a Buffer");
      return this === e2 || 0 === Buffer$1.compare(this, e2);
    }, Buffer$1.prototype.inspect = function() {
      let e2 = "";
      return e2 = this.toString("hex", 0, 50).replace(/(.{2})/g, "$1 ").trim(), this.length > 50 && (e2 += " ... "), "<Buffer " + e2 + ">";
    }, i && (Buffer$1.prototype[i] = Buffer$1.prototype.inspect), Buffer$1.prototype.compare = function(e2, n2, o2, s2, i2) {
      if (isInstance(e2, Uint8Array) && (e2 = Buffer$1.from(e2, e2.offset, e2.byteLength)), !Buffer$1.isBuffer(e2))
        throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e2);
      if (void 0 === n2 && (n2 = 0), void 0 === o2 && (o2 = e2 ? e2.length : 0), void 0 === s2 && (s2 = 0), void 0 === i2 && (i2 = this.length), n2 < 0 || o2 > e2.length || s2 < 0 || i2 > this.length)
        throw new RangeError("out of range index");
      if (s2 >= i2 && n2 >= o2)
        return 0;
      if (s2 >= i2)
        return -1;
      if (n2 >= o2)
        return 1;
      if (this === e2)
        return 0;
      let a2 = (i2 >>>= 0) - (s2 >>>= 0), c2 = (o2 >>>= 0) - (n2 >>>= 0);
      const u2 = Math.min(a2, c2), f2 = this.slice(s2, i2), p2 = e2.slice(n2, o2);
      for (let e3 = 0; e3 < u2; ++e3)
        if (f2[e3] !== p2[e3]) {
          a2 = f2[e3], c2 = p2[e3];
          break;
        }
      return a2 < c2 ? -1 : c2 < a2 ? 1 : 0;
    }, Buffer$1.prototype.includes = function(e2, n2, o2) {
      return -1 !== this.indexOf(e2, n2, o2);
    }, Buffer$1.prototype.indexOf = function(e2, n2, o2) {
      return bidirectionalIndexOf(this, e2, n2, o2, true);
    }, Buffer$1.prototype.lastIndexOf = function(e2, n2, o2) {
      return bidirectionalIndexOf(this, e2, n2, o2, false);
    }, Buffer$1.prototype.write = function(e2, n2, o2, s2) {
      if (void 0 === n2)
        s2 = "utf8", o2 = this.length, n2 = 0;
      else if (void 0 === o2 && "string" == typeof n2)
        s2 = n2, o2 = this.length, n2 = 0;
      else {
        if (!Number.isFinite(n2))
          throw new TypeError("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        n2 >>>= 0, Number.isFinite(o2) ? (o2 >>>= 0, void 0 === s2 && (s2 = "utf8")) : (s2 = o2, o2 = void 0);
      }
      const i2 = this.length - n2;
      if ((void 0 === o2 || o2 > i2) && (o2 = i2), e2.length > 0 && (o2 < 0 || n2 < 0) || n2 > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      s2 || (s2 = "utf8");
      let a2 = false;
      for (; ; )
        switch (s2) {
          case "hex":
            return hexWrite(this, e2, n2, o2);
          case "utf8":
          case "utf-8":
            return utf8Write(this, e2, n2, o2);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, e2, n2, o2);
          case "base64":
            return base64Write(this, e2, n2, o2);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, e2, n2, o2);
          default:
            if (a2)
              throw new TypeError("Unknown encoding: " + s2);
            s2 = ("" + s2).toLowerCase(), a2 = true;
        }
    }, Buffer$1.prototype.toJSON = function() {
      return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
    };
    const c = 4096;
    function asciiSlice(e2, n2, o2) {
      let s2 = "";
      o2 = Math.min(e2.length, o2);
      for (let i2 = n2; i2 < o2; ++i2)
        s2 += String.fromCharCode(127 & e2[i2]);
      return s2;
    }
    __name(asciiSlice, "asciiSlice");
    function latin1Slice(e2, n2, o2) {
      let s2 = "";
      o2 = Math.min(e2.length, o2);
      for (let i2 = n2; i2 < o2; ++i2)
        s2 += String.fromCharCode(e2[i2]);
      return s2;
    }
    __name(latin1Slice, "latin1Slice");
    function hexSlice(e2, n2, o2) {
      const s2 = e2.length;
      (!n2 || n2 < 0) && (n2 = 0), (!o2 || o2 < 0 || o2 > s2) && (o2 = s2);
      let i2 = "";
      for (let s3 = n2; s3 < o2; ++s3)
        i2 += p[e2[s3]];
      return i2;
    }
    __name(hexSlice, "hexSlice");
    function utf16leSlice(e2, n2, o2) {
      const s2 = e2.slice(n2, o2);
      let i2 = "";
      for (let e3 = 0; e3 < s2.length - 1; e3 += 2)
        i2 += String.fromCharCode(s2[e3] + 256 * s2[e3 + 1]);
      return i2;
    }
    __name(utf16leSlice, "utf16leSlice");
    function checkOffset(e2, n2, o2) {
      if (e2 % 1 != 0 || e2 < 0)
        throw new RangeError("offset is not uint");
      if (e2 + n2 > o2)
        throw new RangeError("Trying to access beyond buffer length");
    }
    __name(checkOffset, "checkOffset");
    function checkInt(e2, n2, o2, s2, i2, a2) {
      if (!Buffer$1.isBuffer(e2))
        throw new TypeError('"buffer" argument must be a Buffer instance');
      if (n2 > i2 || n2 < a2)
        throw new RangeError('"value" argument is out of bounds');
      if (o2 + s2 > e2.length)
        throw new RangeError("Index out of range");
    }
    __name(checkInt, "checkInt");
    function wrtBigUInt64LE(e2, n2, o2, s2, i2) {
      checkIntBI(n2, s2, i2, e2, o2, 7);
      let a2 = Number(n2 & BigInt(4294967295));
      e2[o2++] = a2, a2 >>= 8, e2[o2++] = a2, a2 >>= 8, e2[o2++] = a2, a2 >>= 8, e2[o2++] = a2;
      let c2 = Number(n2 >> BigInt(32) & BigInt(4294967295));
      return e2[o2++] = c2, c2 >>= 8, e2[o2++] = c2, c2 >>= 8, e2[o2++] = c2, c2 >>= 8, e2[o2++] = c2, o2;
    }
    __name(wrtBigUInt64LE, "wrtBigUInt64LE");
    function wrtBigUInt64BE(e2, n2, o2, s2, i2) {
      checkIntBI(n2, s2, i2, e2, o2, 7);
      let a2 = Number(n2 & BigInt(4294967295));
      e2[o2 + 7] = a2, a2 >>= 8, e2[o2 + 6] = a2, a2 >>= 8, e2[o2 + 5] = a2, a2 >>= 8, e2[o2 + 4] = a2;
      let c2 = Number(n2 >> BigInt(32) & BigInt(4294967295));
      return e2[o2 + 3] = c2, c2 >>= 8, e2[o2 + 2] = c2, c2 >>= 8, e2[o2 + 1] = c2, c2 >>= 8, e2[o2] = c2, o2 + 8;
    }
    __name(wrtBigUInt64BE, "wrtBigUInt64BE");
    function checkIEEE754(e2, n2, o2, s2, i2, a2) {
      if (o2 + s2 > e2.length)
        throw new RangeError("Index out of range");
      if (o2 < 0)
        throw new RangeError("Index out of range");
    }
    __name(checkIEEE754, "checkIEEE754");
    function writeFloat(e2, n2, o2, s2, i2) {
      return n2 = +n2, o2 >>>= 0, i2 || checkIEEE754(e2, 0, o2, 4), write(e2, n2, o2, s2, 23, 4), o2 + 4;
    }
    __name(writeFloat, "writeFloat");
    function writeDouble(e2, n2, o2, s2, i2) {
      return n2 = +n2, o2 >>>= 0, i2 || checkIEEE754(e2, 0, o2, 8), write(e2, n2, o2, s2, 52, 8), o2 + 8;
    }
    __name(writeDouble, "writeDouble");
    Buffer$1.prototype.slice = function(e2, n2) {
      const o2 = this.length;
      (e2 = Math.trunc(e2)) < 0 ? (e2 += o2) < 0 && (e2 = 0) : e2 > o2 && (e2 = o2), (n2 = void 0 === n2 ? o2 : Math.trunc(n2)) < 0 ? (n2 += o2) < 0 && (n2 = 0) : n2 > o2 && (n2 = o2), n2 < e2 && (n2 = e2);
      const s2 = this.subarray(e2, n2);
      return Object.setPrototypeOf(s2, Buffer$1.prototype), s2;
    }, Buffer$1.prototype.readUintLE = Buffer$1.prototype.readUIntLE = function(e2, n2, o2) {
      e2 >>>= 0, n2 >>>= 0, o2 || checkOffset(e2, n2, this.length);
      let s2 = this[e2], i2 = 1, a2 = 0;
      for (; ++a2 < n2 && (i2 *= 256); )
        s2 += this[e2 + a2] * i2;
      return s2;
    }, Buffer$1.prototype.readUintBE = Buffer$1.prototype.readUIntBE = function(e2, n2, o2) {
      e2 >>>= 0, n2 >>>= 0, o2 || checkOffset(e2, n2, this.length);
      let s2 = this[e2 + --n2], i2 = 1;
      for (; n2 > 0 && (i2 *= 256); )
        s2 += this[e2 + --n2] * i2;
      return s2;
    }, Buffer$1.prototype.readUint8 = Buffer$1.prototype.readUInt8 = function(e2, n2) {
      return e2 >>>= 0, n2 || checkOffset(e2, 1, this.length), this[e2];
    }, Buffer$1.prototype.readUint16LE = Buffer$1.prototype.readUInt16LE = function(e2, n2) {
      return e2 >>>= 0, n2 || checkOffset(e2, 2, this.length), this[e2] | this[e2 + 1] << 8;
    }, Buffer$1.prototype.readUint16BE = Buffer$1.prototype.readUInt16BE = function(e2, n2) {
      return e2 >>>= 0, n2 || checkOffset(e2, 2, this.length), this[e2] << 8 | this[e2 + 1];
    }, Buffer$1.prototype.readUint32LE = Buffer$1.prototype.readUInt32LE = function(e2, n2) {
      return e2 >>>= 0, n2 || checkOffset(e2, 4, this.length), (this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16) + 16777216 * this[e2 + 3];
    }, Buffer$1.prototype.readUint32BE = Buffer$1.prototype.readUInt32BE = function(e2, n2) {
      return e2 >>>= 0, n2 || checkOffset(e2, 4, this.length), 16777216 * this[e2] + (this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3]);
    }, Buffer$1.prototype.readBigUInt64LE = defineBigIntMethod(function(e2) {
      validateNumber(e2 >>>= 0, "offset");
      const n2 = this[e2], o2 = this[e2 + 7];
      void 0 !== n2 && void 0 !== o2 || boundsError(e2, this.length - 8);
      const s2 = n2 + 256 * this[++e2] + 65536 * this[++e2] + this[++e2] * 2 ** 24, i2 = this[++e2] + 256 * this[++e2] + 65536 * this[++e2] + o2 * 2 ** 24;
      return BigInt(s2) + (BigInt(i2) << BigInt(32));
    }), Buffer$1.prototype.readBigUInt64BE = defineBigIntMethod(function(e2) {
      validateNumber(e2 >>>= 0, "offset");
      const n2 = this[e2], o2 = this[e2 + 7];
      void 0 !== n2 && void 0 !== o2 || boundsError(e2, this.length - 8);
      const s2 = n2 * 2 ** 24 + 65536 * this[++e2] + 256 * this[++e2] + this[++e2], i2 = this[++e2] * 2 ** 24 + 65536 * this[++e2] + 256 * this[++e2] + o2;
      return (BigInt(s2) << BigInt(32)) + BigInt(i2);
    }), Buffer$1.prototype.readIntLE = function(e2, n2, o2) {
      e2 >>>= 0, n2 >>>= 0, o2 || checkOffset(e2, n2, this.length);
      let s2 = this[e2], i2 = 1, a2 = 0;
      for (; ++a2 < n2 && (i2 *= 256); )
        s2 += this[e2 + a2] * i2;
      return i2 *= 128, s2 >= i2 && (s2 -= Math.pow(2, 8 * n2)), s2;
    }, Buffer$1.prototype.readIntBE = function(e2, n2, o2) {
      e2 >>>= 0, n2 >>>= 0, o2 || checkOffset(e2, n2, this.length);
      let s2 = n2, i2 = 1, a2 = this[e2 + --s2];
      for (; s2 > 0 && (i2 *= 256); )
        a2 += this[e2 + --s2] * i2;
      return i2 *= 128, a2 >= i2 && (a2 -= Math.pow(2, 8 * n2)), a2;
    }, Buffer$1.prototype.readInt8 = function(e2, n2) {
      return e2 >>>= 0, n2 || checkOffset(e2, 1, this.length), 128 & this[e2] ? -1 * (255 - this[e2] + 1) : this[e2];
    }, Buffer$1.prototype.readInt16LE = function(e2, n2) {
      e2 >>>= 0, n2 || checkOffset(e2, 2, this.length);
      const o2 = this[e2] | this[e2 + 1] << 8;
      return 32768 & o2 ? 4294901760 | o2 : o2;
    }, Buffer$1.prototype.readInt16BE = function(e2, n2) {
      e2 >>>= 0, n2 || checkOffset(e2, 2, this.length);
      const o2 = this[e2 + 1] | this[e2] << 8;
      return 32768 & o2 ? 4294901760 | o2 : o2;
    }, Buffer$1.prototype.readInt32LE = function(e2, n2) {
      return e2 >>>= 0, n2 || checkOffset(e2, 4, this.length), this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16 | this[e2 + 3] << 24;
    }, Buffer$1.prototype.readInt32BE = function(e2, n2) {
      return e2 >>>= 0, n2 || checkOffset(e2, 4, this.length), this[e2] << 24 | this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3];
    }, Buffer$1.prototype.readBigInt64LE = defineBigIntMethod(function(e2) {
      validateNumber(e2 >>>= 0, "offset");
      const n2 = this[e2], o2 = this[e2 + 7];
      void 0 !== n2 && void 0 !== o2 || boundsError(e2, this.length - 8);
      const s2 = this[e2 + 4] + 256 * this[e2 + 5] + 65536 * this[e2 + 6] + (o2 << 24);
      return (BigInt(s2) << BigInt(32)) + BigInt(n2 + 256 * this[++e2] + 65536 * this[++e2] + this[++e2] * 2 ** 24);
    }), Buffer$1.prototype.readBigInt64BE = defineBigIntMethod(function(e2) {
      validateNumber(e2 >>>= 0, "offset");
      const n2 = this[e2], o2 = this[e2 + 7];
      void 0 !== n2 && void 0 !== o2 || boundsError(e2, this.length - 8);
      const s2 = (n2 << 24) + 65536 * this[++e2] + 256 * this[++e2] + this[++e2];
      return (BigInt(s2) << BigInt(32)) + BigInt(this[++e2] * 2 ** 24 + 65536 * this[++e2] + 256 * this[++e2] + o2);
    }), Buffer$1.prototype.readFloatLE = function(e2, n2) {
      return e2 >>>= 0, n2 || checkOffset(e2, 4, this.length), read(this, e2, true, 23, 4);
    }, Buffer$1.prototype.readFloatBE = function(e2, n2) {
      return e2 >>>= 0, n2 || checkOffset(e2, 4, this.length), read(this, e2, false, 23, 4);
    }, Buffer$1.prototype.readDoubleLE = function(e2, n2) {
      return e2 >>>= 0, n2 || checkOffset(e2, 8, this.length), read(this, e2, true, 52, 8);
    }, Buffer$1.prototype.readDoubleBE = function(e2, n2) {
      return e2 >>>= 0, n2 || checkOffset(e2, 8, this.length), read(this, e2, false, 52, 8);
    }, Buffer$1.prototype.writeUintLE = Buffer$1.prototype.writeUIntLE = function(e2, n2, o2, s2) {
      if (e2 = +e2, n2 >>>= 0, o2 >>>= 0, !s2) {
        checkInt(this, e2, n2, o2, Math.pow(2, 8 * o2) - 1, 0);
      }
      let i2 = 1, a2 = 0;
      for (this[n2] = 255 & e2; ++a2 < o2 && (i2 *= 256); )
        this[n2 + a2] = e2 / i2 & 255;
      return n2 + o2;
    }, Buffer$1.prototype.writeUintBE = Buffer$1.prototype.writeUIntBE = function(e2, n2, o2, s2) {
      if (e2 = +e2, n2 >>>= 0, o2 >>>= 0, !s2) {
        checkInt(this, e2, n2, o2, Math.pow(2, 8 * o2) - 1, 0);
      }
      let i2 = o2 - 1, a2 = 1;
      for (this[n2 + i2] = 255 & e2; --i2 >= 0 && (a2 *= 256); )
        this[n2 + i2] = e2 / a2 & 255;
      return n2 + o2;
    }, Buffer$1.prototype.writeUint8 = Buffer$1.prototype.writeUInt8 = function(e2, n2, o2) {
      return e2 = +e2, n2 >>>= 0, o2 || checkInt(this, e2, n2, 1, 255, 0), this[n2] = 255 & e2, n2 + 1;
    }, Buffer$1.prototype.writeUint16LE = Buffer$1.prototype.writeUInt16LE = function(e2, n2, o2) {
      return e2 = +e2, n2 >>>= 0, o2 || checkInt(this, e2, n2, 2, 65535, 0), this[n2] = 255 & e2, this[n2 + 1] = e2 >>> 8, n2 + 2;
    }, Buffer$1.prototype.writeUint16BE = Buffer$1.prototype.writeUInt16BE = function(e2, n2, o2) {
      return e2 = +e2, n2 >>>= 0, o2 || checkInt(this, e2, n2, 2, 65535, 0), this[n2] = e2 >>> 8, this[n2 + 1] = 255 & e2, n2 + 2;
    }, Buffer$1.prototype.writeUint32LE = Buffer$1.prototype.writeUInt32LE = function(e2, n2, o2) {
      return e2 = +e2, n2 >>>= 0, o2 || checkInt(this, e2, n2, 4, 4294967295, 0), this[n2 + 3] = e2 >>> 24, this[n2 + 2] = e2 >>> 16, this[n2 + 1] = e2 >>> 8, this[n2] = 255 & e2, n2 + 4;
    }, Buffer$1.prototype.writeUint32BE = Buffer$1.prototype.writeUInt32BE = function(e2, n2, o2) {
      return e2 = +e2, n2 >>>= 0, o2 || checkInt(this, e2, n2, 4, 4294967295, 0), this[n2] = e2 >>> 24, this[n2 + 1] = e2 >>> 16, this[n2 + 2] = e2 >>> 8, this[n2 + 3] = 255 & e2, n2 + 4;
    }, Buffer$1.prototype.writeBigUInt64LE = defineBigIntMethod(function(e2, n2 = 0) {
      return wrtBigUInt64LE(this, e2, n2, BigInt(0), BigInt("0xffffffffffffffff"));
    }), Buffer$1.prototype.writeBigUInt64BE = defineBigIntMethod(function(e2, n2 = 0) {
      return wrtBigUInt64BE(this, e2, n2, BigInt(0), BigInt("0xffffffffffffffff"));
    }), Buffer$1.prototype.writeIntLE = function(e2, n2, o2, s2) {
      if (e2 = +e2, n2 >>>= 0, !s2) {
        const s3 = Math.pow(2, 8 * o2 - 1);
        checkInt(this, e2, n2, o2, s3 - 1, -s3);
      }
      let i2 = 0, a2 = 1, c2 = 0;
      for (this[n2] = 255 & e2; ++i2 < o2 && (a2 *= 256); )
        e2 < 0 && 0 === c2 && 0 !== this[n2 + i2 - 1] && (c2 = 1), this[n2 + i2] = Math.trunc(e2 / a2) - c2 & 255;
      return n2 + o2;
    }, Buffer$1.prototype.writeIntBE = function(e2, n2, o2, s2) {
      if (e2 = +e2, n2 >>>= 0, !s2) {
        const s3 = Math.pow(2, 8 * o2 - 1);
        checkInt(this, e2, n2, o2, s3 - 1, -s3);
      }
      let i2 = o2 - 1, a2 = 1, c2 = 0;
      for (this[n2 + i2] = 255 & e2; --i2 >= 0 && (a2 *= 256); )
        e2 < 0 && 0 === c2 && 0 !== this[n2 + i2 + 1] && (c2 = 1), this[n2 + i2] = Math.trunc(e2 / a2) - c2 & 255;
      return n2 + o2;
    }, Buffer$1.prototype.writeInt8 = function(e2, n2, o2) {
      return e2 = +e2, n2 >>>= 0, o2 || checkInt(this, e2, n2, 1, 127, -128), e2 < 0 && (e2 = 255 + e2 + 1), this[n2] = 255 & e2, n2 + 1;
    }, Buffer$1.prototype.writeInt16LE = function(e2, n2, o2) {
      return e2 = +e2, n2 >>>= 0, o2 || checkInt(this, e2, n2, 2, 32767, -32768), this[n2] = 255 & e2, this[n2 + 1] = e2 >>> 8, n2 + 2;
    }, Buffer$1.prototype.writeInt16BE = function(e2, n2, o2) {
      return e2 = +e2, n2 >>>= 0, o2 || checkInt(this, e2, n2, 2, 32767, -32768), this[n2] = e2 >>> 8, this[n2 + 1] = 255 & e2, n2 + 2;
    }, Buffer$1.prototype.writeInt32LE = function(e2, n2, o2) {
      return e2 = +e2, n2 >>>= 0, o2 || checkInt(this, e2, n2, 4, 2147483647, -2147483648), this[n2] = 255 & e2, this[n2 + 1] = e2 >>> 8, this[n2 + 2] = e2 >>> 16, this[n2 + 3] = e2 >>> 24, n2 + 4;
    }, Buffer$1.prototype.writeInt32BE = function(e2, n2, o2) {
      return e2 = +e2, n2 >>>= 0, o2 || checkInt(this, e2, n2, 4, 2147483647, -2147483648), e2 < 0 && (e2 = 4294967295 + e2 + 1), this[n2] = e2 >>> 24, this[n2 + 1] = e2 >>> 16, this[n2 + 2] = e2 >>> 8, this[n2 + 3] = 255 & e2, n2 + 4;
    }, Buffer$1.prototype.writeBigInt64LE = defineBigIntMethod(function(e2, n2 = 0) {
      return wrtBigUInt64LE(this, e2, n2, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), Buffer$1.prototype.writeBigInt64BE = defineBigIntMethod(function(e2, n2 = 0) {
      return wrtBigUInt64BE(this, e2, n2, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), Buffer$1.prototype.writeFloatLE = function(e2, n2, o2) {
      return writeFloat(this, e2, n2, true, o2);
    }, Buffer$1.prototype.writeFloatBE = function(e2, n2, o2) {
      return writeFloat(this, e2, n2, false, o2);
    }, Buffer$1.prototype.writeDoubleLE = function(e2, n2, o2) {
      return writeDouble(this, e2, n2, true, o2);
    }, Buffer$1.prototype.writeDoubleBE = function(e2, n2, o2) {
      return writeDouble(this, e2, n2, false, o2);
    }, Buffer$1.prototype.copy = function(e2, n2, o2, s2) {
      if (!Buffer$1.isBuffer(e2))
        throw new TypeError("argument should be a Buffer");
      if (o2 || (o2 = 0), s2 || 0 === s2 || (s2 = this.length), n2 >= e2.length && (n2 = e2.length), n2 || (n2 = 0), s2 > 0 && s2 < o2 && (s2 = o2), s2 === o2)
        return 0;
      if (0 === e2.length || 0 === this.length)
        return 0;
      if (n2 < 0)
        throw new RangeError("targetStart out of bounds");
      if (o2 < 0 || o2 >= this.length)
        throw new RangeError("Index out of range");
      if (s2 < 0)
        throw new RangeError("sourceEnd out of bounds");
      s2 > this.length && (s2 = this.length), e2.length - n2 < s2 - o2 && (s2 = e2.length - n2 + o2);
      const i2 = s2 - o2;
      return this === e2 && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(n2, o2, s2) : Uint8Array.prototype.set.call(e2, this.subarray(o2, s2), n2), i2;
    }, Buffer$1.prototype.fill = function(e2, n2, o2, s2) {
      if ("string" == typeof e2) {
        if ("string" == typeof n2 ? (s2 = n2, n2 = 0, o2 = this.length) : "string" == typeof o2 && (s2 = o2, o2 = this.length), void 0 !== s2 && "string" != typeof s2)
          throw new TypeError("encoding must be a string");
        if ("string" == typeof s2 && !Buffer$1.isEncoding(s2))
          throw new TypeError("Unknown encoding: " + s2);
        if (1 === e2.length) {
          const n3 = e2.charCodeAt(0);
          ("utf8" === s2 && n3 < 128 || "latin1" === s2) && (e2 = n3);
        }
      } else
        "number" == typeof e2 ? e2 &= 255 : "boolean" == typeof e2 && (e2 = Number(e2));
      if (n2 < 0 || this.length < n2 || this.length < o2)
        throw new RangeError("Out of range index");
      if (o2 <= n2)
        return this;
      let i2;
      if (n2 >>>= 0, o2 = void 0 === o2 ? this.length : o2 >>> 0, e2 || (e2 = 0), "number" == typeof e2)
        for (i2 = n2; i2 < o2; ++i2)
          this[i2] = e2;
      else {
        const a2 = Buffer$1.isBuffer(e2) ? e2 : Buffer$1.from(e2, s2), c2 = a2.length;
        if (0 === c2)
          throw new TypeError('The value "' + e2 + '" is invalid for argument "value"');
        for (i2 = 0; i2 < o2 - n2; ++i2)
          this[i2 + n2] = a2[i2 % c2];
      }
      return this;
    };
    const u = {};
    function E(e2, n2, o2) {
      u[e2] = class extends o2 {
        constructor() {
          super(), Object.defineProperty(this, "message", { value: Reflect.apply(n2, this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${e2}]`, this.stack, delete this.name;
        }
        get code() {
          return e2;
        }
        set code(e3) {
          Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: e3, writable: true });
        }
        toString() {
          return `${this.name} [${e2}]: ${this.message}`;
        }
      };
    }
    __name(E, "E");
    function addNumericalSeparator(e2) {
      let n2 = "", o2 = e2.length;
      const s2 = "-" === e2[0] ? 1 : 0;
      for (; o2 >= s2 + 4; o2 -= 3)
        n2 = `_${e2.slice(o2 - 3, o2)}${n2}`;
      return `${e2.slice(0, o2)}${n2}`;
    }
    __name(addNumericalSeparator, "addNumericalSeparator");
    function checkIntBI(e2, n2, o2, s2, i2, a2) {
      if (e2 > o2 || e2 < n2) {
        const o3 = "bigint" == typeof n2 ? "n" : "";
        let s3;
        throw s3 = 0 === n2 || n2 === BigInt(0) ? `>= 0${o3} and < 2${o3} ** ${8 * (a2 + 1)}${o3}` : `>= -(2${o3} ** ${8 * (a2 + 1) - 1}${o3}) and < 2 ** ${8 * (a2 + 1) - 1}${o3}`, new u.ERR_OUT_OF_RANGE("value", s3, e2);
      }
      !function(e3, n3, o3) {
        validateNumber(n3, "offset"), void 0 !== e3[n3] && void 0 !== e3[n3 + o3] || boundsError(n3, e3.length - (o3 + 1));
      }(s2, i2, a2);
    }
    __name(checkIntBI, "checkIntBI");
    function validateNumber(e2, n2) {
      if ("number" != typeof e2)
        throw new u.ERR_INVALID_ARG_TYPE(n2, "number", e2);
    }
    __name(validateNumber, "validateNumber");
    function boundsError(e2, n2, o2) {
      if (Math.floor(e2) !== e2)
        throw validateNumber(e2, o2), new u.ERR_OUT_OF_RANGE("offset", "an integer", e2);
      if (n2 < 0)
        throw new u.ERR_BUFFER_OUT_OF_BOUNDS();
      throw new u.ERR_OUT_OF_RANGE("offset", `>= 0 and <= ${n2}`, e2);
    }
    __name(boundsError, "boundsError");
    E("ERR_BUFFER_OUT_OF_BOUNDS", function(e2) {
      return e2 ? `${e2} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    }, RangeError), E("ERR_INVALID_ARG_TYPE", function(e2, n2) {
      return `The "${e2}" argument must be of type number. Received type ${typeof n2}`;
    }, TypeError), E("ERR_OUT_OF_RANGE", function(e2, n2, o2) {
      let s2 = `The value of "${e2}" is out of range.`, i2 = o2;
      return Number.isInteger(o2) && Math.abs(o2) > 2 ** 32 ? i2 = addNumericalSeparator(String(o2)) : "bigint" == typeof o2 && (i2 = String(o2), (o2 > BigInt(2) ** BigInt(32) || o2 < -(BigInt(2) ** BigInt(32))) && (i2 = addNumericalSeparator(i2)), i2 += "n"), s2 += ` It must be ${n2}. Received ${i2}`, s2;
    }, RangeError);
    const f = /[^\w+/-]/g;
    function utf8ToBytes(e2, n2) {
      let o2;
      n2 = n2 || Number.POSITIVE_INFINITY;
      const s2 = e2.length;
      let i2 = null;
      const a2 = [];
      for (let c2 = 0; c2 < s2; ++c2) {
        if (o2 = e2.charCodeAt(c2), o2 > 55295 && o2 < 57344) {
          if (!i2) {
            if (o2 > 56319) {
              (n2 -= 3) > -1 && a2.push(239, 191, 189);
              continue;
            }
            if (c2 + 1 === s2) {
              (n2 -= 3) > -1 && a2.push(239, 191, 189);
              continue;
            }
            i2 = o2;
            continue;
          }
          if (o2 < 56320) {
            (n2 -= 3) > -1 && a2.push(239, 191, 189), i2 = o2;
            continue;
          }
          o2 = 65536 + (i2 - 55296 << 10 | o2 - 56320);
        } else
          i2 && (n2 -= 3) > -1 && a2.push(239, 191, 189);
        if (i2 = null, o2 < 128) {
          if ((n2 -= 1) < 0)
            break;
          a2.push(o2);
        } else if (o2 < 2048) {
          if ((n2 -= 2) < 0)
            break;
          a2.push(o2 >> 6 | 192, 63 & o2 | 128);
        } else if (o2 < 65536) {
          if ((n2 -= 3) < 0)
            break;
          a2.push(o2 >> 12 | 224, o2 >> 6 & 63 | 128, 63 & o2 | 128);
        } else {
          if (!(o2 < 1114112))
            throw new Error("Invalid code point");
          if ((n2 -= 4) < 0)
            break;
          a2.push(o2 >> 18 | 240, o2 >> 12 & 63 | 128, o2 >> 6 & 63 | 128, 63 & o2 | 128);
        }
      }
      return a2;
    }
    __name(utf8ToBytes, "utf8ToBytes");
    function base64ToBytes(e2) {
      return toByteArray(function(e3) {
        if ((e3 = (e3 = e3.split("=")[0]).trim().replace(f, "")).length < 2)
          return "";
        for (; e3.length % 4 != 0; )
          e3 += "=";
        return e3;
      }(e2));
    }
    __name(base64ToBytes, "base64ToBytes");
    function blitBuffer(e2, n2, o2, s2) {
      let i2;
      for (i2 = 0; i2 < s2 && !(i2 + o2 >= n2.length || i2 >= e2.length); ++i2)
        n2[i2 + o2] = e2[i2];
      return i2;
    }
    __name(blitBuffer, "blitBuffer");
    function isInstance(e2, n2) {
      return e2 instanceof n2 || null != e2 && null != e2.constructor && null != e2.constructor.name && e2.constructor.name === n2.name;
    }
    __name(isInstance, "isInstance");
    function numberIsNaN(e2) {
      return e2 != e2;
    }
    __name(numberIsNaN, "numberIsNaN");
    const p = function() {
      const e2 = "0123456789abcdef", n2 = Array.from({ length: 256 });
      for (let o2 = 0; o2 < 16; ++o2) {
        const s2 = 16 * o2;
        for (let i2 = 0; i2 < 16; ++i2)
          n2[s2 + i2] = e2[o2] + e2[i2];
      }
      return n2;
    }();
    function defineBigIntMethod(e2) {
      return "undefined" == typeof BigInt ? BufferBigIntNotDefined : e2;
    }
    __name(defineBigIntMethod, "defineBigIntMethod");
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
    __name(BufferBigIntNotDefined, "BufferBigIntNotDefined");
    const g = globalThis.Buffer || Buffer$1;
    notImplemented("buffer.resolveObjectURL"), notImplemented("buffer.transcode"), notImplemented("buffer.isUtf8"), notImplemented("buffer.isAscii");
    const w = {};
    let b, v;
    function defaultSetTimeout() {
      throw new Error("setTimeout has not been defined");
    }
    __name(defaultSetTimeout, "defaultSetTimeout");
    function defaultClearTimeout() {
      throw new Error("clearTimeout has not been defined");
    }
    __name(defaultClearTimeout, "defaultClearTimeout");
    function runTimeout(e2) {
      if (b === setTimeout)
        return setTimeout(e2, 0);
      if ((b === defaultSetTimeout || !b) && setTimeout)
        return b = setTimeout, setTimeout(e2, 0);
      try {
        return b(e2, 0);
      } catch {
        try {
          return b.call(null, e2, 0);
        } catch {
          return b.call(this, e2, 0);
        }
      }
    }
    __name(runTimeout, "runTimeout");
    !function() {
      try {
        b = "function" == typeof setTimeout ? setTimeout : defaultSetTimeout;
      } catch {
        b = defaultSetTimeout;
      }
      try {
        v = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
      } catch {
        v = defaultClearTimeout;
      }
    }();
    let _, x = [], B = false, k = -1;
    function cleanUpNextTick() {
      B && _ && (B = false, _.length > 0 ? x = [..._, ...x] : k = -1, x.length > 0 && drainQueue());
    }
    __name(cleanUpNextTick, "cleanUpNextTick");
    function drainQueue() {
      if (B)
        return;
      const e2 = runTimeout(cleanUpNextTick);
      B = true;
      let n2 = x.length;
      for (; n2; ) {
        for (_ = x, x = []; ++k < n2; )
          _ && _[k].run();
        k = -1, n2 = x.length;
      }
      _ = null, B = false, function(e3) {
        if (v === clearTimeout)
          return clearTimeout(e3);
        if ((v === defaultClearTimeout || !v) && clearTimeout)
          return v = clearTimeout, clearTimeout(e3);
        try {
          return v(e3);
        } catch {
          try {
            return v.call(null, e3);
          } catch {
            return v.call(this, e3);
          }
        }
      }(e2);
    }
    __name(drainQueue, "drainQueue");
    function Item(e2, n2) {
      this.fun = e2, this.array = n2;
    }
    __name(Item, "Item");
    w.nextTick = function(e2) {
      const n2 = Array.from({ length: arguments.length - 1 });
      if (arguments.length > 1)
        for (let e3 = 1; e3 < arguments.length; e3++)
          n2[e3 - 1] = arguments[e3];
      x.push(new Item(e2, n2)), 1 !== x.length || B || runTimeout(drainQueue);
    }, Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    }, w.title = "unenv";
    const I = /* @__PURE__ */ Object.create(null), A = globalThis.process?.env, _getEnv = /* @__PURE__ */ __name((e2) => A || globalThis.__env__ || (e2 ? I : globalThis), "_getEnv");
    function noop$1() {
      return w;
    }
    __name(noop$1, "noop$1");
    w.env = new Proxy(I, { get: (e2, n2) => _getEnv()[n2] ?? I[n2], has: (e2, n2) => n2 in _getEnv() || n2 in I, set: (e2, n2, o2) => (_getEnv(true)[n2] = o2, true), deleteProperty(e2, n2) {
      delete _getEnv(true)[n2];
    }, ownKeys() {
      const e2 = _getEnv();
      return Object.keys(e2);
    } }), w.argv = [], w.version = "", w.versions = {}, w.on = noop$1, w.addListener = noop$1, w.once = noop$1, w.off = noop$1, w.removeListener = noop$1, w.removeAllListeners = noop$1, w.emit = noop$1, w.prependListener = noop$1, w.prependOnceListener = noop$1, w.listeners = function(e2) {
      return [];
    }, w.binding = function(e2) {
      throw new Error("[unenv] process.binding is not supported");
    };
    let R = "/";
    w.cwd = function() {
      return R;
    }, w.chdir = function(e2) {
      R = e2;
    }, w.umask = function() {
      return 0;
    };
    const T = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof global ? global : {};
    T.process = T.process || w;
    const C = T.process, j = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/, N = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/, L = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
    function jsonParseTransform(e2, n2) {
      if (!("__proto__" === e2 || "constructor" === e2 && n2 && "object" == typeof n2 && "prototype" in n2))
        return n2;
      !function(e3) {
        console.warn(`[destr] Dropping "${e3}" key to prevent prototype pollution.`);
      }(e2);
    }
    __name(jsonParseTransform, "jsonParseTransform");
    function destr(e2, n2 = {}) {
      if ("string" != typeof e2)
        return e2;
      const o2 = e2.trim();
      if ('"' === e2[0] && e2.endsWith('"') && !e2.includes("\\"))
        return o2.slice(1, -1);
      if (o2.length <= 9) {
        const e3 = o2.toLowerCase();
        if ("true" === e3)
          return true;
        if ("false" === e3)
          return false;
        if ("undefined" === e3)
          return;
        if ("null" === e3)
          return null;
        if ("nan" === e3)
          return Number.NaN;
        if ("infinity" === e3)
          return Number.POSITIVE_INFINITY;
        if ("-infinity" === e3)
          return Number.NEGATIVE_INFINITY;
      }
      if (!L.test(e2)) {
        if (n2.strict)
          throw new SyntaxError("[destr] Invalid JSON");
        return e2;
      }
      try {
        if (j.test(e2) || N.test(e2)) {
          if (n2.strict)
            throw new Error("[destr] Possible prototype pollution");
          return JSON.parse(e2, jsonParseTransform);
        }
        return JSON.parse(e2);
      } catch (o3) {
        if (n2.strict)
          throw o3;
        return e2;
      }
    }
    __name(destr, "destr");
    const U = /#/g, P = /&/g, H = /\//g, q = /=/g, z = /\+/g, W = /%5e/gi, F = /%60/gi, K = /%7c/gi, V = /%20/gi;
    function encodeQueryValue(e2) {
      return (n2 = "string" == typeof e2 ? e2 : JSON.stringify(e2), encodeURI("" + n2).replace(K, "|")).replace(z, "%2B").replace(V, "+").replace(U, "%23").replace(P, "%26").replace(F, "`").replace(W, "^").replace(H, "%2F");
      var n2;
    }
    __name(encodeQueryValue, "encodeQueryValue");
    function encodeQueryKey(e2) {
      return encodeQueryValue(e2).replace(q, "%3D");
    }
    __name(encodeQueryKey, "encodeQueryKey");
    function decode(e2 = "") {
      try {
        return decodeURIComponent("" + e2);
      } catch {
        return "" + e2;
      }
    }
    __name(decode, "decode");
    function decodeQueryValue(e2) {
      return decode(e2.replace(z, " "));
    }
    __name(decodeQueryValue, "decodeQueryValue");
    function parseQuery(e2 = "") {
      const n2 = {};
      "?" === e2[0] && (e2 = e2.slice(1));
      for (const o2 of e2.split("&")) {
        const e3 = o2.match(/([^=]+)=?(.*)/) || [];
        if (e3.length < 2)
          continue;
        const s2 = decode(e3[1].replace(z, " "));
        if ("__proto__" === s2 || "constructor" === s2)
          continue;
        const i2 = decodeQueryValue(e3[2] || "");
        void 0 === n2[s2] ? n2[s2] = i2 : Array.isArray(n2[s2]) ? n2[s2].push(i2) : n2[s2] = [n2[s2], i2];
      }
      return n2;
    }
    __name(parseQuery, "parseQuery");
    function stringifyQuery(e2) {
      return Object.keys(e2).filter((n2) => void 0 !== e2[n2]).map((n2) => {
        return o2 = n2, "number" != typeof (s2 = e2[n2]) && "boolean" != typeof s2 || (s2 = String(s2)), s2 ? Array.isArray(s2) ? s2.map((e3) => `${encodeQueryKey(o2)}=${encodeQueryValue(e3)}`).join("&") : `${encodeQueryKey(o2)}=${encodeQueryValue(s2)}` : encodeQueryKey(o2);
        var o2, s2;
      }).filter(Boolean).join("&");
    }
    __name(stringifyQuery, "stringifyQuery");
    const J = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/, Q = /^[\s\w\0+.-]{2,}:([/\\]{2})?/, Y = /^([/\\]\s*){2,}[^/\\]/, G = /^\.?\//;
    function hasProtocol(e2, n2 = {}) {
      return "boolean" == typeof n2 && (n2 = { acceptRelative: n2 }), n2.strict ? J.test(e2) : Q.test(e2) || !!n2.acceptRelative && Y.test(e2);
    }
    __name(hasProtocol, "hasProtocol");
    function withoutTrailingSlash(e2 = "", n2) {
      return (function(e3 = "") {
        return e3.endsWith("/");
      }(e2) ? e2.slice(0, -1) : e2) || "/";
    }
    __name(withoutTrailingSlash, "withoutTrailingSlash");
    function withTrailingSlash(e2 = "", n2) {
      return e2.endsWith("/") ? e2 : e2 + "/";
    }
    __name(withTrailingSlash, "withTrailingSlash");
    function withoutBase(e2, n2) {
      if (isEmptyURL(n2))
        return e2;
      const o2 = withoutTrailingSlash(n2);
      if (!e2.startsWith(o2))
        return e2;
      const s2 = e2.slice(o2.length);
      return "/" === s2[0] ? s2 : "/" + s2;
    }
    __name(withoutBase, "withoutBase");
    function withQuery(e2, n2) {
      const o2 = parseURL(e2), s2 = { ...parseQuery(o2.search), ...n2 };
      return o2.search = stringifyQuery(s2), function(e3) {
        const n3 = e3.pathname || "", o3 = e3.search ? (e3.search.startsWith("?") ? "" : "?") + e3.search : "", s3 = e3.hash || "", i2 = e3.auth ? e3.auth + "@" : "", a2 = e3.host || "", c2 = e3.protocol || e3[Z] ? (e3.protocol || "") + "//" : "";
        return c2 + i2 + a2 + n3 + o3 + s3;
      }(o2);
    }
    __name(withQuery, "withQuery");
    function getQuery(e2) {
      return parseQuery(parseURL(e2).search);
    }
    __name(getQuery, "getQuery");
    function isEmptyURL(e2) {
      return !e2 || "/" === e2;
    }
    __name(isEmptyURL, "isEmptyURL");
    function joinURL(e2, ...n2) {
      let o2 = e2 || "";
      for (const e3 of n2.filter((e4) => function(e5) {
        return e5 && "/" !== e5;
      }(e4)))
        if (o2) {
          const n3 = e3.replace(G, "");
          o2 = withTrailingSlash(o2) + n3;
        } else
          o2 = e3;
      return o2;
    }
    __name(joinURL, "joinURL");
    const Z = Symbol.for("ufo:protocolRelative");
    function parseURL(e2 = "", n2) {
      const o2 = e2.match(/^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i);
      if (o2) {
        const [, e3, n3 = ""] = o2;
        return { protocol: e3.toLowerCase(), pathname: n3, href: e3 + n3, auth: "", host: "", search: "", hash: "" };
      }
      if (!hasProtocol(e2, { acceptRelative: true }))
        return n2 ? parseURL(n2 + e2) : parsePath(e2);
      const [, s2 = "", i2, a2 = ""] = e2.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
      let [, c2 = "", u2 = ""] = a2.match(/([^#/?]*)(.*)?/) || [];
      "file:" === s2 && (u2 = u2.replace(/\/(?=[A-Za-z]:)/, ""));
      const { pathname: f2, search: p2, hash: g2 } = parsePath(u2);
      return { protocol: s2.toLowerCase(), auth: i2 ? i2.slice(0, Math.max(0, i2.length - 1)) : "", host: c2, pathname: f2, search: p2, hash: g2, [Z]: !s2 };
    }
    __name(parseURL, "parseURL");
    function parsePath(e2 = "") {
      const [n2 = "", o2 = "", s2 = ""] = (e2.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
      return { pathname: n2, search: o2, hash: s2 };
    }
    __name(parsePath, "parsePath");
    const X = Object.freeze({ ignoreUnknown: false, respectType: false, respectFunctionNames: false, respectFunctionProperties: false, unorderedObjects: true, unorderedArrays: false, unorderedSets: false, excludeKeys: void 0, excludeValues: void 0, replacer: void 0 });
    function objectHash(e2, n2) {
      const o2 = createHasher(n2 = n2 ? { ...X, ...n2 } : X);
      return o2.dispatch(e2), o2.toString();
    }
    __name(objectHash, "objectHash");
    const ee = Object.freeze(["prototype", "__proto__", "constructor"]);
    function createHasher(e2) {
      let n2 = "", o2 = /* @__PURE__ */ new Map();
      const write2 = /* @__PURE__ */ __name((e3) => {
        n2 += e3;
      }, "write");
      return { toString: () => n2, getContext: () => o2, dispatch(n3) {
        e2.replacer && (n3 = e2.replacer(n3));
        return this[null === n3 ? "null" : typeof n3](n3);
      }, object(n3) {
        if (n3 && "function" == typeof n3.toJSON)
          return this.object(n3.toJSON());
        const s2 = Object.prototype.toString.call(n3);
        let i2 = "";
        const a2 = s2.length;
        i2 = a2 < 10 ? "unknown:[" + s2 + "]" : s2.slice(8, a2 - 1), i2 = i2.toLowerCase();
        let c2 = null;
        if (void 0 !== (c2 = o2.get(n3)))
          return this.dispatch("[CIRCULAR:" + c2 + "]");
        if (o2.set(n3, o2.size), void 0 !== g && g.isBuffer && g.isBuffer(n3))
          return write2("buffer:"), write2(n3.toString("utf8"));
        if ("object" !== i2 && "function" !== i2 && "asyncfunction" !== i2)
          this[i2] ? this[i2](n3) : e2.ignoreUnknown || this.unkown(n3, i2);
        else {
          let o3 = Object.keys(n3);
          e2.unorderedObjects && (o3 = o3.sort());
          let s3 = [];
          false === e2.respectType || isNativeFunction(n3) || (s3 = ee), e2.excludeKeys && (o3 = o3.filter((n4) => !e2.excludeKeys(n4)), s3 = s3.filter((n4) => !e2.excludeKeys(n4))), write2("object:" + (o3.length + s3.length) + ":");
          const dispatchForKey = /* @__PURE__ */ __name((o4) => {
            this.dispatch(o4), write2(":"), e2.excludeValues || this.dispatch(n3[o4]), write2(",");
          }, "dispatchForKey");
          for (const e3 of o3)
            dispatchForKey(e3);
          for (const e3 of s3)
            dispatchForKey(e3);
        }
      }, array(n3, s2) {
        if (s2 = void 0 === s2 ? false !== e2.unorderedArrays : s2, write2("array:" + n3.length + ":"), !s2 || n3.length <= 1) {
          for (const e3 of n3)
            this.dispatch(e3);
          return;
        }
        const i2 = /* @__PURE__ */ new Map(), a2 = n3.map((n4) => {
          const o3 = createHasher(e2);
          o3.dispatch(n4);
          for (const [e3, n5] of o3.getContext())
            i2.set(e3, n5);
          return o3.toString();
        });
        return o2 = i2, a2.sort(), this.array(a2, false);
      }, date: (e3) => write2("date:" + e3.toJSON()), symbol: (e3) => write2("symbol:" + e3.toString()), unkown(e3, n3) {
        if (write2(n3), e3)
          return write2(":"), e3 && "function" == typeof e3.entries ? this.array(Array.from(e3.entries()), true) : void 0;
      }, error: (e3) => write2("error:" + e3.toString()), boolean: (e3) => write2("bool:" + e3), string(e3) {
        write2("string:" + e3.length + ":"), write2(e3);
      }, function(n3) {
        write2("fn:"), isNativeFunction(n3) ? this.dispatch("[native]") : this.dispatch(n3.toString()), false !== e2.respectFunctionNames && this.dispatch("function-name:" + String(n3.name)), e2.respectFunctionProperties && this.object(n3);
      }, number: (e3) => write2("number:" + e3), xml: (e3) => write2("xml:" + e3.toString()), null: () => write2("Null"), undefined: () => write2("Undefined"), regexp: (e3) => write2("regex:" + e3.toString()), uint8array(e3) {
        return write2("uint8array:"), this.dispatch(Array.prototype.slice.call(e3));
      }, uint8clampedarray(e3) {
        return write2("uint8clampedarray:"), this.dispatch(Array.prototype.slice.call(e3));
      }, int8array(e3) {
        return write2("int8array:"), this.dispatch(Array.prototype.slice.call(e3));
      }, uint16array(e3) {
        return write2("uint16array:"), this.dispatch(Array.prototype.slice.call(e3));
      }, int16array(e3) {
        return write2("int16array:"), this.dispatch(Array.prototype.slice.call(e3));
      }, uint32array(e3) {
        return write2("uint32array:"), this.dispatch(Array.prototype.slice.call(e3));
      }, int32array(e3) {
        return write2("int32array:"), this.dispatch(Array.prototype.slice.call(e3));
      }, float32array(e3) {
        return write2("float32array:"), this.dispatch(Array.prototype.slice.call(e3));
      }, float64array(e3) {
        return write2("float64array:"), this.dispatch(Array.prototype.slice.call(e3));
      }, arraybuffer(e3) {
        return write2("arraybuffer:"), this.dispatch(new Uint8Array(e3));
      }, url: (e3) => write2("url:" + e3.toString()), map(n3) {
        write2("map:");
        const o3 = [...n3];
        return this.array(o3, false !== e2.unorderedSets);
      }, set(n3) {
        write2("set:");
        const o3 = [...n3];
        return this.array(o3, false !== e2.unorderedSets);
      }, file(e3) {
        return write2("file:"), this.dispatch([e3.name, e3.size, e3.type, e3.lastModfied]);
      }, blob() {
        if (e2.ignoreUnknown)
          return write2("[blob]");
        throw new Error('Hashing Blob objects is currently not supported\nUse "options.replacer" or "options.ignoreUnknown"\n');
      }, domwindow: () => write2("domwindow"), bigint: (e3) => write2("bigint:" + e3.toString()), process: () => write2("process"), timer: () => write2("timer"), pipe: () => write2("pipe"), tcp: () => write2("tcp"), udp: () => write2("udp"), tty: () => write2("tty"), statwatcher: () => write2("statwatcher"), securecontext: () => write2("securecontext"), connection: () => write2("connection"), zlib: () => write2("zlib"), context: () => write2("context"), nodescript: () => write2("nodescript"), httpparser: () => write2("httpparser"), dataview: () => write2("dataview"), signal: () => write2("signal"), fsevent: () => write2("fsevent"), tlswrap: () => write2("tlswrap") };
    }
    __name(createHasher, "createHasher");
    const te = "[native code] }", re = te.length;
    function isNativeFunction(e2) {
      return "function" == typeof e2 && Function.prototype.toString.call(e2).slice(-re) === te;
    }
    __name(isNativeFunction, "isNativeFunction");
    var ne = Object.defineProperty, __publicField$1 = /* @__PURE__ */ __name((e2, n2, o2) => (((e3, n3, o3) => {
      n3 in e3 ? ne(e3, n3, { enumerable: true, configurable: true, writable: true, value: o3 }) : e3[n3] = o3;
    })(e2, "symbol" != typeof n2 ? n2 + "" : n2, o2), o2), "__publicField$1");
    class WordArray {
      constructor(e2, n2) {
        __publicField$1(this, "words"), __publicField$1(this, "sigBytes"), e2 = this.words = e2 || [], this.sigBytes = void 0 === n2 ? 4 * e2.length : n2;
      }
      toString(e2) {
        return (e2 || oe).stringify(this);
      }
      concat(e2) {
        if (this.clamp(), this.sigBytes % 4)
          for (let n2 = 0; n2 < e2.sigBytes; n2++) {
            const o2 = e2.words[n2 >>> 2] >>> 24 - n2 % 4 * 8 & 255;
            this.words[this.sigBytes + n2 >>> 2] |= o2 << 24 - (this.sigBytes + n2) % 4 * 8;
          }
        else
          for (let n2 = 0; n2 < e2.sigBytes; n2 += 4)
            this.words[this.sigBytes + n2 >>> 2] = e2.words[n2 >>> 2];
        return this.sigBytes += e2.sigBytes, this;
      }
      clamp() {
        this.words[this.sigBytes >>> 2] &= 4294967295 << 32 - this.sigBytes % 4 * 8, this.words.length = Math.ceil(this.sigBytes / 4);
      }
      clone() {
        return new WordArray([...this.words]);
      }
    }
    __name(WordArray, "WordArray");
    const oe = { stringify(e2) {
      const n2 = [];
      for (let o2 = 0; o2 < e2.sigBytes; o2++) {
        const s2 = e2.words[o2 >>> 2] >>> 24 - o2 % 4 * 8 & 255;
        n2.push((s2 >>> 4).toString(16), (15 & s2).toString(16));
      }
      return n2.join("");
    } }, se = { stringify(e2) {
      const n2 = [];
      for (let o2 = 0; o2 < e2.sigBytes; o2 += 3) {
        const s2 = (e2.words[o2 >>> 2] >>> 24 - o2 % 4 * 8 & 255) << 16 | (e2.words[o2 + 1 >>> 2] >>> 24 - (o2 + 1) % 4 * 8 & 255) << 8 | e2.words[o2 + 2 >>> 2] >>> 24 - (o2 + 2) % 4 * 8 & 255;
        for (let i2 = 0; i2 < 4 && 8 * o2 + 6 * i2 < 8 * e2.sigBytes; i2++)
          n2.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(s2 >>> 6 * (3 - i2) & 63));
      }
      return n2.join("");
    } }, ie = { parse(e2) {
      const n2 = e2.length, o2 = [];
      for (let s2 = 0; s2 < n2; s2++)
        o2[s2 >>> 2] |= (255 & e2.charCodeAt(s2)) << 24 - s2 % 4 * 8;
      return new WordArray(o2, n2);
    } }, ae = { parse: (e2) => ie.parse(unescape(encodeURIComponent(e2))) };
    class BufferedBlockAlgorithm {
      constructor() {
        __publicField$1(this, "_data", new WordArray()), __publicField$1(this, "_nDataBytes", 0), __publicField$1(this, "_minBufferSize", 0), __publicField$1(this, "blockSize", 16);
      }
      reset() {
        this._data = new WordArray(), this._nDataBytes = 0;
      }
      _append(e2) {
        "string" == typeof e2 && (e2 = ae.parse(e2)), this._data.concat(e2), this._nDataBytes += e2.sigBytes;
      }
      _doProcessBlock(e2, n2) {
      }
      _process(e2) {
        let n2, o2 = this._data.sigBytes / (4 * this.blockSize);
        o2 = e2 ? Math.ceil(o2) : Math.max((0 | o2) - this._minBufferSize, 0);
        const s2 = o2 * this.blockSize, i2 = Math.min(4 * s2, this._data.sigBytes);
        if (s2) {
          for (let e3 = 0; e3 < s2; e3 += this.blockSize)
            this._doProcessBlock(this._data.words, e3);
          n2 = this._data.words.splice(0, s2), this._data.sigBytes -= i2;
        }
        return new WordArray(n2, i2);
      }
    }
    __name(BufferedBlockAlgorithm, "BufferedBlockAlgorithm");
    class Hasher extends BufferedBlockAlgorithm {
      update(e2) {
        return this._append(e2), this._process(), this;
      }
      finalize(e2) {
        e2 && this._append(e2);
      }
    }
    __name(Hasher, "Hasher");
    var ce = Object.defineProperty, __publicField = /* @__PURE__ */ __name((e2, n2, o2) => (((e3, n3, o3) => {
      n3 in e3 ? ce(e3, n3, { enumerable: true, configurable: true, writable: true, value: o3 }) : e3[n3] = o3;
    })(e2, n2 + "", o2), o2), "__publicField");
    const ue = [1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225], le = [1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998], fe = [];
    class SHA256 extends Hasher {
      constructor() {
        super(...arguments), __publicField(this, "_hash", new WordArray([...ue]));
      }
      reset() {
        super.reset(), this._hash = new WordArray([...ue]);
      }
      _doProcessBlock(e2, n2) {
        const o2 = this._hash.words;
        let s2 = o2[0], i2 = o2[1], a2 = o2[2], c2 = o2[3], u2 = o2[4], f2 = o2[5], p2 = o2[6], g2 = o2[7];
        for (let o3 = 0; o3 < 64; o3++) {
          if (o3 < 16)
            fe[o3] = 0 | e2[n2 + o3];
          else {
            const e3 = fe[o3 - 15], n3 = (e3 << 25 | e3 >>> 7) ^ (e3 << 14 | e3 >>> 18) ^ e3 >>> 3, s3 = fe[o3 - 2], i3 = (s3 << 15 | s3 >>> 17) ^ (s3 << 13 | s3 >>> 19) ^ s3 >>> 10;
            fe[o3] = n3 + fe[o3 - 7] + i3 + fe[o3 - 16];
          }
          const w2 = s2 & i2 ^ s2 & a2 ^ i2 & a2, b2 = (s2 << 30 | s2 >>> 2) ^ (s2 << 19 | s2 >>> 13) ^ (s2 << 10 | s2 >>> 22), v2 = g2 + ((u2 << 26 | u2 >>> 6) ^ (u2 << 21 | u2 >>> 11) ^ (u2 << 7 | u2 >>> 25)) + (u2 & f2 ^ ~u2 & p2) + le[o3] + fe[o3];
          g2 = p2, p2 = f2, f2 = u2, u2 = c2 + v2 | 0, c2 = a2, a2 = i2, i2 = s2, s2 = v2 + (b2 + w2) | 0;
        }
        o2[0] = o2[0] + s2 | 0, o2[1] = o2[1] + i2 | 0, o2[2] = o2[2] + a2 | 0, o2[3] = o2[3] + c2 | 0, o2[4] = o2[4] + u2 | 0, o2[5] = o2[5] + f2 | 0, o2[6] = o2[6] + p2 | 0, o2[7] = o2[7] + g2 | 0;
      }
      finalize(e2) {
        super.finalize(e2);
        const n2 = 8 * this._nDataBytes, o2 = 8 * this._data.sigBytes;
        return this._data.words[o2 >>> 5] |= 128 << 24 - o2 % 32, this._data.words[14 + (o2 + 64 >>> 9 << 4)] = Math.floor(n2 / 4294967296), this._data.words[15 + (o2 + 64 >>> 9 << 4)] = n2, this._data.sigBytes = 4 * this._data.words.length, this._process(), this._hash;
      }
    }
    __name(SHA256, "SHA256");
    function hash(e2, n2 = {}) {
      const o2 = "string" == typeof e2 ? e2 : objectHash(e2, n2);
      return (s2 = o2, new SHA256().finalize(s2).toString(se)).slice(0, 10);
      var s2;
    }
    __name(hash, "hash");
    const de = 0, he = 1, pe = 2;
    function createRouter$1(e2 = {}) {
      const n2 = { options: e2, rootNode: createRadixNode(), staticRoutesMap: {} }, normalizeTrailingSlash = /* @__PURE__ */ __name((n3) => e2.strictTrailingSlash ? n3 : n3.replace(/\/$/, "") || "/", "normalizeTrailingSlash");
      if (e2.routes)
        for (const o2 in e2.routes)
          insert(n2, normalizeTrailingSlash(o2), e2.routes[o2]);
      return { ctx: n2, lookup: (e3) => function(e4, n3) {
        const o2 = e4.staticRoutesMap[n3];
        if (o2)
          return o2.data;
        const s2 = n3.split("/"), i2 = {};
        let a2 = false, c2 = null, u2 = e4.rootNode, f2 = null;
        for (let e5 = 0; e5 < s2.length; e5++) {
          const n4 = s2[e5];
          null !== u2.wildcardChildNode && (c2 = u2.wildcardChildNode, f2 = s2.slice(e5).join("/"));
          const o3 = u2.children.get(n4);
          if (void 0 === o3) {
            if (u2 && u2.placeholderChildren.length > 1) {
              const n5 = s2.length - e5;
              u2 = u2.placeholderChildren.find((e6) => e6.maxDepth === n5) || null;
            } else
              u2 = u2.placeholderChildren[0] || null;
            if (!u2)
              break;
            u2.paramName && (i2[u2.paramName] = n4), a2 = true;
          } else
            u2 = o3;
        }
        null !== u2 && null !== u2.data || null === c2 || (u2 = c2, i2[u2.paramName || "_"] = f2, a2 = true);
        if (!u2)
          return null;
        if (a2)
          return { ...u2.data, params: a2 ? i2 : void 0 };
        return u2.data;
      }(n2, normalizeTrailingSlash(e3)), insert: (e3, o2) => insert(n2, normalizeTrailingSlash(e3), o2), remove: (e3) => function(e4, n3) {
        let o2 = false;
        const s2 = n3.split("/");
        let i2 = e4.rootNode;
        for (const e5 of s2)
          if (i2 = i2.children.get(e5), !i2)
            return o2;
        if (i2.data) {
          const e5 = s2.at(-1) || "";
          i2.data = null, 0 === Object.keys(i2.children).length && i2.parent && (i2.parent.children.delete(e5), i2.parent.wildcardChildNode = null, i2.parent.placeholderChildren = []), o2 = true;
        }
        return o2;
      }(n2, normalizeTrailingSlash(e3)) };
    }
    __name(createRouter$1, "createRouter$1");
    function insert(e2, n2, o2) {
      let s2 = true;
      const i2 = n2.split("/");
      let a2 = e2.rootNode, c2 = 0;
      const u2 = [a2];
      for (const e3 of i2) {
        let n3;
        if (n3 = a2.children.get(e3))
          a2 = n3;
        else {
          const o3 = getNodeType(e3);
          n3 = createRadixNode({ type: o3, parent: a2 }), a2.children.set(e3, n3), o3 === pe ? (n3.paramName = "*" === e3 ? "_" + c2++ : e3.slice(1), a2.placeholderChildren.push(n3), s2 = false) : o3 === he && (a2.wildcardChildNode = n3, n3.paramName = e3.slice(3) || "_", s2 = false), u2.push(n3), a2 = n3;
        }
      }
      for (const [e3, n3] of u2.entries())
        n3.maxDepth = Math.max(u2.length - e3, n3.maxDepth || 0);
      return a2.data = o2, true === s2 && (e2.staticRoutesMap[n2] = a2), a2;
    }
    __name(insert, "insert");
    function createRadixNode(e2 = {}) {
      return { type: e2.type || de, maxDepth: 0, parent: e2.parent || null, children: /* @__PURE__ */ new Map(), data: e2.data || null, paramName: e2.paramName || null, wildcardChildNode: null, placeholderChildren: [] };
    }
    __name(createRadixNode, "createRadixNode");
    function getNodeType(e2) {
      return e2.startsWith("**") ? he : ":" === e2[0] || "*" === e2 ? pe : de;
    }
    __name(getNodeType, "getNodeType");
    function toRouteMatcher(e2) {
      return function(e3, n2) {
        return { ctx: { table: e3 }, matchAll: (o2) => _matchRoutes(o2, e3, n2) };
      }(_routerNodeToTable("", e2.ctx.rootNode), e2.ctx.options.strictTrailingSlash);
    }
    __name(toRouteMatcher, "toRouteMatcher");
    function _matchRoutes(e2, n2, o2) {
      true !== o2 && e2.endsWith("/") && (e2 = e2.slice(0, -1) || "/");
      const s2 = [];
      for (const [o3, i3] of _sortRoutesMap(n2.wildcard))
        (e2 === o3 || e2.startsWith(o3 + "/")) && s2.push(i3);
      for (const [o3, i3] of _sortRoutesMap(n2.dynamic))
        if (e2.startsWith(o3 + "/")) {
          const n3 = "/" + e2.slice(o3.length).split("/").splice(2).join("/");
          s2.push(..._matchRoutes(n3, i3));
        }
      const i2 = n2.static.get(e2);
      return i2 && s2.push(i2), s2.filter(Boolean);
    }
    __name(_matchRoutes, "_matchRoutes");
    function _sortRoutesMap(e2) {
      return [...e2.entries()].sort((e3, n2) => e3[0].length - n2[0].length);
    }
    __name(_sortRoutesMap, "_sortRoutesMap");
    function _routerNodeToTable(e2, n2) {
      const o2 = { static: /* @__PURE__ */ new Map(), wildcard: /* @__PURE__ */ new Map(), dynamic: /* @__PURE__ */ new Map() };
      return (/* @__PURE__ */ __name(function _addNode(e3, n3) {
        if (e3)
          if (n3.type !== de || e3.includes("*") || e3.includes(":")) {
            if (n3.type === he)
              o2.wildcard.set(e3.replace("/**", ""), n3.data);
            else if (n3.type === pe) {
              const s2 = _routerNodeToTable("", n3);
              return n3.data && s2.static.set("/", n3.data), void o2.dynamic.set(e3.replace(/\/\*|\/:\w+/, ""), s2);
            }
          } else
            n3.data && o2.static.set(e3, n3.data);
        for (const [o3, s2] of n3.children.entries())
          _addNode(`${e3}/${o3}`.replace("//", "/"), s2);
      }, "_addNode"))(e2, n2), o2;
    }
    __name(_routerNodeToTable, "_routerNodeToTable");
    function isPlainObject(e2) {
      if (null === e2 || "object" != typeof e2)
        return false;
      const n2 = Object.getPrototypeOf(e2);
      return (null === n2 || n2 === Object.prototype || null === Object.getPrototypeOf(n2)) && (!(Symbol.iterator in e2) && (!(Symbol.toStringTag in e2) || "[object Module]" === Object.prototype.toString.call(e2)));
    }
    __name(isPlainObject, "isPlainObject");
    function _defu(e2, n2, o2 = ".", s2) {
      if (!isPlainObject(n2))
        return _defu(e2, {}, o2, s2);
      const i2 = Object.assign({}, n2);
      for (const n3 in e2) {
        if ("__proto__" === n3 || "constructor" === n3)
          continue;
        const a2 = e2[n3];
        null != a2 && (s2 && s2(i2, n3, a2, o2) || (Array.isArray(a2) && Array.isArray(i2[n3]) ? i2[n3] = [...a2, ...i2[n3]] : isPlainObject(a2) && isPlainObject(i2[n3]) ? i2[n3] = _defu(a2, i2[n3], (o2 ? `${o2}.` : "") + n3.toString(), s2) : i2[n3] = a2));
      }
      return i2;
    }
    __name(_defu, "_defu");
    function createDefu(e2) {
      return (...n2) => n2.reduce((n3, o2) => _defu(n3, o2, "", e2), {});
    }
    __name(createDefu, "createDefu");
    const me = createDefu(), ge = createDefu((e2, n2, o2) => {
      if (void 0 !== e2[n2] && "function" == typeof o2)
        return e2[n2] = o2(e2[n2]), true;
    });
    function hasProp(e2, n2) {
      try {
        return n2 in e2;
      } catch {
        return false;
      }
    }
    __name(hasProp, "hasProp");
    class H3Error extends Error {
      static __h3_error__ = true;
      statusCode = 500;
      fatal = false;
      unhandled = false;
      statusMessage;
      data;
      cause;
      constructor(e2, n2 = {}) {
        super(e2, n2), n2.cause && !this.cause && (this.cause = n2.cause);
      }
      toJSON() {
        const e2 = { message: this.message, statusCode: sanitizeStatusCode(this.statusCode, 500) };
        return this.statusMessage && (e2.statusMessage = sanitizeStatusMessage(this.statusMessage)), void 0 !== this.data && (e2.data = this.data), e2;
      }
    }
    __name(H3Error, "H3Error");
    function createError$1(e2) {
      if ("string" == typeof e2)
        return new H3Error(e2);
      if (isError(e2))
        return e2;
      const n2 = new H3Error(e2.message ?? e2.statusMessage ?? "", { cause: e2.cause || e2 });
      if (hasProp(e2, "stack"))
        try {
          Object.defineProperty(n2, "stack", { get: () => e2.stack });
        } catch {
          try {
            n2.stack = e2.stack;
          } catch {
          }
        }
      if (e2.data && (n2.data = e2.data), e2.statusCode ? n2.statusCode = sanitizeStatusCode(e2.statusCode, n2.statusCode) : e2.status && (n2.statusCode = sanitizeStatusCode(e2.status, n2.statusCode)), e2.statusMessage ? n2.statusMessage = e2.statusMessage : e2.statusText && (n2.statusMessage = e2.statusText), n2.statusMessage) {
        const e3 = n2.statusMessage;
        sanitizeStatusMessage(n2.statusMessage) !== e3 && console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.");
      }
      return void 0 !== e2.fatal && (n2.fatal = e2.fatal), void 0 !== e2.unhandled && (n2.unhandled = e2.unhandled), n2;
    }
    __name(createError$1, "createError$1");
    function isError(e2) {
      return true === e2?.constructor?.__h3_error__;
    }
    __name(isError, "isError");
    function getRequestHeaders(e2) {
      const n2 = {};
      for (const o2 in e2.node.req.headers) {
        const s2 = e2.node.req.headers[o2];
        n2[o2] = Array.isArray(s2) ? s2.filter(Boolean).join(", ") : s2;
      }
      return n2;
    }
    __name(getRequestHeaders, "getRequestHeaders");
    const ye = Symbol.for("h3RawBody"), we = ["PATCH", "POST", "PUT", "DELETE"];
    function readRawBody(e2, n2 = "utf8") {
      !function(e3, n3) {
        if (!function(e4, n4) {
          if ("string" == typeof n4) {
            if (e4.method === n4)
              return true;
          } else if (n4.includes(e4.method))
            return true;
          return false;
        }(e3, n3))
          throw createError$1({ statusCode: 405, statusMessage: "HTTP method is not allowed." });
      }(e2, we);
      const o2 = e2._requestBody || e2.web?.request?.body || e2.node.req[ye] || e2.node.req.rawBody || e2.node.req.body;
      if (o2) {
        const e3 = Promise.resolve(o2).then((e4) => g.isBuffer(e4) ? e4 : "function" == typeof e4.pipeTo ? new Promise((n3, o3) => {
          const s3 = [];
          e4.pipeTo(new WritableStream({ write(e5) {
            s3.push(e5);
          }, close() {
            n3(g.concat(s3));
          }, abort(e5) {
            o3(e5);
          } })).catch(o3);
        }) : "function" == typeof e4.pipe ? new Promise((n3, o3) => {
          const s3 = [];
          e4.on("data", (e5) => {
            s3.push(e5);
          }).on("end", () => {
            n3(g.concat(s3));
          }).on("error", o3);
        }) : e4.constructor === Object ? g.from(JSON.stringify(e4)) : e4 instanceof URLSearchParams ? g.from(e4.toString()) : g.from(e4));
        return n2 ? e3.then((e4) => e4.toString(n2)) : e3;
      }
      if (!Number.parseInt(e2.node.req.headers["content-length"] || "") && !String(e2.node.req.headers["transfer-encoding"] ?? "").split(",").map((e3) => e3.trim()).filter(Boolean).includes("chunked"))
        return Promise.resolve(void 0);
      const s2 = e2.node.req[ye] = new Promise((n3, o3) => {
        const s3 = [];
        e2.node.req.on("error", (e3) => {
          o3(e3);
        }).on("data", (e3) => {
          s3.push(e3);
        }).on("end", () => {
          n3(g.concat(s3));
        });
      });
      return n2 ? s2.then((e3) => e3.toString(n2)) : s2;
    }
    __name(readRawBody, "readRawBody");
    function handleCacheHeaders(e2, n2) {
      const o2 = ["public", ...n2.cacheControls || []];
      let s2 = false;
      if (void 0 !== n2.maxAge && o2.push("max-age=" + +n2.maxAge, "s-maxage=" + +n2.maxAge), n2.modifiedTime) {
        const o3 = new Date(n2.modifiedTime), i2 = e2.node.req.headers["if-modified-since"];
        e2.node.res.setHeader("last-modified", o3.toUTCString()), i2 && new Date(i2) >= n2.modifiedTime && (s2 = true);
      }
      if (n2.etag) {
        e2.node.res.setHeader("etag", n2.etag);
        e2.node.req.headers["if-none-match"] === n2.etag && (s2 = true);
      }
      return e2.node.res.setHeader("cache-control", o2.join(", ")), !!s2 && (e2.node.res.statusCode = 304, e2.handled || e2.node.res.end(), true);
    }
    __name(handleCacheHeaders, "handleCacheHeaders");
    const be = { html: "text/html", json: "application/json" }, ve = /[^\u0009\u0020-\u007E]/g;
    function sanitizeStatusMessage(e2 = "") {
      return e2.replace(ve, "");
    }
    __name(sanitizeStatusMessage, "sanitizeStatusMessage");
    function sanitizeStatusCode(e2, n2 = 200) {
      return e2 ? ("string" == typeof e2 && (e2 = Number.parseInt(e2, 10)), e2 < 100 || e2 > 999 ? n2 : e2) : n2;
    }
    __name(sanitizeStatusCode, "sanitizeStatusCode");
    function splitCookiesString(e2) {
      if (Array.isArray(e2))
        return e2.flatMap((e3) => splitCookiesString(e3));
      if ("string" != typeof e2)
        return [];
      const n2 = [];
      let o2, s2, i2, a2, c2, u2 = 0;
      const skipWhitespace = /* @__PURE__ */ __name(() => {
        for (; u2 < e2.length && /\s/.test(e2.charAt(u2)); )
          u2 += 1;
        return u2 < e2.length;
      }, "skipWhitespace");
      for (; u2 < e2.length; ) {
        for (o2 = u2, c2 = false; skipWhitespace(); )
          if (s2 = e2.charAt(u2), "," === s2) {
            for (i2 = u2, u2 += 1, skipWhitespace(), a2 = u2; u2 < e2.length && (s2 = e2.charAt(u2), "=" !== s2 && ";" !== s2 && "," !== s2); )
              u2 += 1;
            u2 < e2.length && "=" === e2.charAt(u2) ? (c2 = true, u2 = a2, n2.push(e2.slice(o2, i2)), o2 = u2) : u2 = i2 + 1;
          } else
            u2 += 1;
        (!c2 || u2 >= e2.length) && n2.push(e2.slice(o2));
      }
      return n2;
    }
    __name(splitCookiesString, "splitCookiesString");
    const _e = "undefined" == typeof setImmediate ? (e2) => e2() : setImmediate;
    function send(e2, n2, o2) {
      return o2 && function(e3, n3) {
        n3 && 304 !== e3.node.res.statusCode && !e3.node.res.getHeader("content-type") && e3.node.res.setHeader("content-type", n3);
      }(e2, o2), new Promise((o3) => {
        _e(() => {
          e2.handled || e2.node.res.end(n2), o3();
        });
      });
    }
    __name(send, "send");
    function setResponseStatus(e2, n2, o2) {
      n2 && (e2.node.res.statusCode = sanitizeStatusCode(n2, e2.node.res.statusCode)), o2 && (e2.node.res.statusMessage = sanitizeStatusMessage(o2));
    }
    __name(setResponseStatus, "setResponseStatus");
    const setHeaders = /* @__PURE__ */ __name(function(e2, n2) {
      for (const [o2, s2] of Object.entries(n2))
        e2.node.res.setHeader(o2, s2);
    }, "setHeaders");
    function setResponseHeader(e2, n2, o2) {
      e2.node.res.setHeader(n2, o2);
    }
    __name(setResponseHeader, "setResponseHeader");
    function sendStream(e2, n2) {
      if (!n2 || "object" != typeof n2)
        throw new Error("[h3] Invalid stream provided.");
      if (e2.node.res._data = n2, !e2.node.res.socket)
        return e2._handled = true, Promise.resolve();
      if (hasProp(n2, "pipeTo") && "function" == typeof n2.pipeTo)
        return n2.pipeTo(new WritableStream({ write(n3) {
          e2.node.res.write(n3);
        } })).then(() => {
          e2.node.res.end();
        });
      if (hasProp(n2, "pipe") && "function" == typeof n2.pipe)
        return new Promise((o2, s2) => {
          n2.pipe(e2.node.res), n2.on && (n2.on("end", () => {
            e2.node.res.end(), o2();
          }), n2.on("error", (e3) => {
            s2(e3);
          })), e2.node.res.on("close", () => {
            n2.abort && n2.abort();
          });
        });
      throw new Error("[h3] Invalid or incompatible stream provided.");
    }
    __name(sendStream, "sendStream");
    function sendWebResponse(e2, n2) {
      for (const [o2, s2] of n2.headers)
        "set-cookie" === o2 ? e2.node.res.appendHeader(o2, splitCookiesString(s2)) : e2.node.res.setHeader(o2, s2);
      if (n2.status && (e2.node.res.statusCode = sanitizeStatusCode(n2.status, e2.node.res.statusCode)), n2.statusText && (e2.node.res.statusMessage = sanitizeStatusMessage(n2.statusText)), n2.redirected && e2.node.res.setHeader("location", n2.url), n2.body)
        return sendStream(e2, n2.body);
      e2.node.res.end();
    }
    __name(sendWebResponse, "sendWebResponse");
    const xe = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]), Ee = /* @__PURE__ */ new Set(["transfer-encoding", "accept-encoding", "connection", "keep-alive", "upgrade", "expect", "host", "accept"]);
    async function proxyRequest(e2, n2, o2 = {}) {
      let s2, i2;
      xe.has(e2.method) && (o2.streamRequest ? (s2 = function(e3) {
        if (!we.includes(e3.method))
          return;
        const n3 = e3.web?.request?.body || e3._requestBody;
        return n3 || (ye in e3.node.req || "rawBody" in e3.node.req || "body" in e3.node.req || "__unenv__" in e3.node.req ? new ReadableStream({ async start(n4) {
          const o3 = await readRawBody(e3, false);
          o3 && n4.enqueue(o3), n4.close();
        } }) : new ReadableStream({ start: (n4) => {
          e3.node.req.on("data", (e4) => {
            n4.enqueue(e4);
          }), e3.node.req.on("end", () => {
            n4.close();
          }), e3.node.req.on("error", (e4) => {
            n4.error(e4);
          });
        } }));
      }(e2), i2 = "half") : s2 = await readRawBody(e2, false).catch(() => {
      }));
      const a2 = o2.fetchOptions?.method || e2.method, c2 = function(e3, ...n3) {
        const o3 = n3.filter(Boolean);
        if (0 === o3.length)
          return e3;
        const s3 = new Headers(e3);
        for (const e4 of o3)
          for (const [n4, o4] of Object.entries(e4))
            void 0 !== o4 && s3.set(n4, o4);
        return s3;
      }(getProxyRequestHeaders(e2, { host: n2.startsWith("/") }), o2.fetchOptions?.headers, o2.headers);
      return async function(e3, n3, o3 = {}) {
        let s3;
        try {
          s3 = await _getFetch(o3.fetch)(n3, { headers: o3.headers, ignoreResponseError: true, ...o3.fetchOptions });
        } catch (e4) {
          throw createError$1({ status: 502, statusMessage: "Bad Gateway", cause: e4 });
        }
        e3.node.res.statusCode = sanitizeStatusCode(s3.status, e3.node.res.statusCode), e3.node.res.statusMessage = sanitizeStatusMessage(s3.statusText);
        const i3 = [];
        for (const [n4, o4] of s3.headers.entries())
          "content-encoding" !== n4 && "content-length" !== n4 && ("set-cookie" !== n4 ? e3.node.res.setHeader(n4, o4) : i3.push(...splitCookiesString(o4)));
        i3.length > 0 && e3.node.res.setHeader("set-cookie", i3.map((e4) => (o3.cookieDomainRewrite && (e4 = rewriteCookieProperty(e4, o3.cookieDomainRewrite, "domain")), o3.cookiePathRewrite && (e4 = rewriteCookieProperty(e4, o3.cookiePathRewrite, "path")), e4)));
        o3.onResponse && await o3.onResponse(e3, s3);
        if (void 0 !== s3._data)
          return s3._data;
        if (e3.handled)
          return;
        if (false === o3.sendStream) {
          const n4 = new Uint8Array(await s3.arrayBuffer());
          return e3.node.res.end(n4);
        }
        if (s3.body)
          for await (const n4 of s3.body)
            e3.node.res.write(n4);
        return e3.node.res.end();
      }(e2, n2, { ...o2, fetchOptions: { method: a2, body: s2, duplex: i2, ...o2.fetchOptions, headers: c2 } });
    }
    __name(proxyRequest, "proxyRequest");
    function getProxyRequestHeaders(e2, n2) {
      const o2 = /* @__PURE__ */ Object.create(null), s2 = getRequestHeaders(e2);
      for (const e3 in s2)
        (!Ee.has(e3) || "host" === e3 && n2?.host) && (o2[e3] = s2[e3]);
      return o2;
    }
    __name(getProxyRequestHeaders, "getProxyRequestHeaders");
    function fetchWithEvent(e2, n2, o2, s2) {
      return _getFetch(s2?.fetch)(n2, { ...o2, context: o2?.context || e2.context, headers: { ...getProxyRequestHeaders(e2, { host: "string" == typeof n2 && n2.startsWith("/") }), ...o2?.headers } });
    }
    __name(fetchWithEvent, "fetchWithEvent");
    function _getFetch(e2) {
      if (e2)
        return e2;
      if (globalThis.fetch)
        return globalThis.fetch;
      throw new Error("fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js.");
    }
    __name(_getFetch, "_getFetch");
    function rewriteCookieProperty(e2, n2, o2) {
      const s2 = "string" == typeof n2 ? { "*": n2 } : n2;
      return e2.replace(new RegExp(`(;\\s*${o2}=)([^;]+)`, "gi"), (e3, n3, o3) => {
        let i2;
        if (o3 in s2)
          i2 = s2[o3];
        else {
          if (!("*" in s2))
            return e3;
          i2 = s2["*"];
        }
        return i2 ? n3 + i2 : "";
      });
    }
    __name(rewriteCookieProperty, "rewriteCookieProperty");
    class H3Event {
      __is_event__ = true;
      node;
      web;
      context = {};
      _method;
      _path;
      _headers;
      _requestBody;
      _handled = false;
      _onBeforeResponseCalled;
      _onAfterResponseCalled;
      constructor(e2, n2) {
        this.node = { req: e2, res: n2 };
      }
      get method() {
        return this._method || (this._method = (this.node.req.method || "GET").toUpperCase()), this._method;
      }
      get path() {
        return this._path || this.node.req.url || "/";
      }
      get headers() {
        return this._headers || (this._headers = function(e2) {
          const n2 = new Headers();
          for (const [o2, s2] of Object.entries(e2))
            if (Array.isArray(s2))
              for (const e3 of s2)
                n2.append(o2, e3);
            else
              s2 && n2.set(o2, s2);
          return n2;
        }(this.node.req.headers)), this._headers;
      }
      get handled() {
        return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
      }
      respondWith(e2) {
        return Promise.resolve(e2).then((e3) => sendWebResponse(this, e3));
      }
      toString() {
        return `[${this.method}] ${this.path}`;
      }
      toJSON() {
        return this.toString();
      }
      get req() {
        return this.node.req;
      }
      get res() {
        return this.node.res;
      }
    }
    __name(H3Event, "H3Event");
    function isEvent(e2) {
      return hasProp(e2, "__is_event__");
    }
    __name(isEvent, "isEvent");
    function createEvent(e2, n2) {
      return new H3Event(e2, n2);
    }
    __name(createEvent, "createEvent");
    function defineEventHandler(e2) {
      if ("function" == typeof e2)
        return e2.__is_handler__ = true, e2;
      const n2 = { onRequest: _normalizeArray(e2.onRequest), onBeforeResponse: _normalizeArray(e2.onBeforeResponse) }, _handler = /* @__PURE__ */ __name((o2) => async function(e3, n3, o3) {
        if (o3.onRequest) {
          for (const n4 of o3.onRequest)
            if (await n4(e3), e3.handled)
              return;
        }
        const s2 = await n3(e3), i2 = { body: s2 };
        if (o3.onBeforeResponse)
          for (const n4 of o3.onBeforeResponse)
            await n4(e3, i2);
        return i2.body;
      }(o2, e2.handler, n2), "_handler");
      return _handler.__is_handler__ = true, _handler.__resolve__ = e2.handler.__resolve__, _handler.__websocket__ = e2.websocket, _handler;
    }
    __name(defineEventHandler, "defineEventHandler");
    function _normalizeArray(e2) {
      return e2 ? Array.isArray(e2) ? e2 : [e2] : void 0;
    }
    __name(_normalizeArray, "_normalizeArray");
    const Be = defineEventHandler;
    function isEventHandler(e2) {
      return hasProp(e2, "__is_handler__");
    }
    __name(isEventHandler, "isEventHandler");
    function toEventHandler(e2, n2, o2) {
      return isEventHandler(e2) || console.warn("[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.", o2 && "/" !== o2 ? `
     Route: ${o2}` : "", `
     Handler: ${e2}`), e2;
    }
    __name(toEventHandler, "toEventHandler");
    const lazyEventHandler = /* @__PURE__ */ __name(function(e2) {
      let n2, o2;
      const resolveHandler = /* @__PURE__ */ __name(() => o2 ? Promise.resolve(o2) : (n2 || (n2 = Promise.resolve(e2()).then((e3) => {
        const n3 = e3.default || e3;
        if ("function" != typeof n3)
          throw new TypeError("Invalid lazy handler result. It should be a function:", n3);
        return o2 = { handler: toEventHandler(e3.default || e3) }, o2;
      })), n2), "resolveHandler"), s2 = Be((e3) => o2 ? o2.handler(e3) : resolveHandler().then((n3) => n3.handler(e3)));
      return s2.__resolve__ = resolveHandler, s2;
    }, "lazyEventHandler");
    function createApp(e2 = {}) {
      const n2 = [], o2 = function(e3, n3) {
        const o3 = n3.debug ? 2 : void 0;
        return Be(async (s3) => {
          s3.node.req.originalUrl = s3.node.req.originalUrl || s3.node.req.url || "/";
          const i3 = s3._path || s3.node.req.url || "/";
          let a3;
          n3.onRequest && await n3.onRequest(s3);
          for (const c2 of e3) {
            if (c2.route.length > 1) {
              if (!i3.startsWith(c2.route))
                continue;
              a3 = i3.slice(c2.route.length) || "/";
            } else
              a3 = i3;
            if (c2.match && !c2.match(a3, s3))
              continue;
            s3._path = a3, s3.node.req.url = a3;
            const e4 = await c2.handler(s3), u2 = void 0 === e4 ? void 0 : await e4;
            if (void 0 !== u2) {
              const e5 = { body: u2 };
              return n3.onBeforeResponse && (s3._onBeforeResponseCalled = true, await n3.onBeforeResponse(s3, e5)), await handleHandlerResponse(s3, e5.body, o3), void (n3.onAfterResponse && (s3._onAfterResponseCalled = true, await n3.onAfterResponse(s3, e5)));
            }
            if (s3.handled)
              return void (n3.onAfterResponse && (s3._onAfterResponseCalled = true, await n3.onAfterResponse(s3, void 0)));
          }
          if (!s3.handled)
            throw createError$1({ statusCode: 404, statusMessage: `Cannot find any path matching ${s3.path || "/"}.` });
          n3.onAfterResponse && (s3._onAfterResponseCalled = true, await n3.onAfterResponse(s3, void 0));
        });
      }(n2, e2), s2 = function(e3) {
        return async (n3) => {
          let o3;
          for (const s3 of e3) {
            if ("/" === s3.route && !s3.handler.__resolve__)
              continue;
            if (!n3.startsWith(s3.route))
              continue;
            if (o3 = n3.slice(s3.route.length) || "/", s3.match && !s3.match(o3, void 0))
              continue;
            let e4 = { route: s3.route, handler: s3.handler };
            if (e4.handler.__resolve__) {
              const n4 = await e4.handler.__resolve__(o3);
              if (!n4)
                continue;
              e4 = { ...e4, ...n4, route: joinURL(e4.route || "/", n4.route || "/") };
            }
            return e4;
          }
        };
      }(n2);
      o2.__resolve__ = s2;
      const i2 = function(e3) {
        let n3;
        return () => (n3 || (n3 = e3()), n3);
      }(() => {
        return n3 = s2, { ...e2.websocket, async resolve(e3) {
          const o3 = e3.request?.url || e3.url || "/", { pathname: s3 } = "string" == typeof o3 ? parseURL(o3) : o3, i3 = await n3(s3);
          return i3?.handler?.__websocket__ || {};
        } };
        var n3;
      }), a2 = { use: (e3, n3, o3) => use(a2, e3, n3, o3), resolve: s2, handler: o2, stack: n2, options: e2, get websocket() {
        return i2();
      } };
      return a2;
    }
    __name(createApp, "createApp");
    function use(e2, n2, o2, s2) {
      if (Array.isArray(n2))
        for (const i2 of n2)
          use(e2, i2, o2, s2);
      else if (Array.isArray(o2))
        for (const i2 of o2)
          use(e2, n2, i2, s2);
      else
        "string" == typeof n2 ? e2.stack.push(normalizeLayer({ ...s2, route: n2, handler: o2 })) : "function" == typeof n2 ? e2.stack.push(normalizeLayer({ ...o2, handler: n2 })) : e2.stack.push(normalizeLayer({ ...n2 }));
      return e2;
    }
    __name(use, "use");
    function normalizeLayer(e2) {
      let n2 = e2.handler;
      return n2.handler && (n2 = n2.handler), e2.lazy ? n2 = lazyEventHandler(n2) : isEventHandler(n2) || (n2 = toEventHandler(n2, 0, e2.route)), { route: withoutTrailingSlash(e2.route), match: e2.match, handler: n2 };
    }
    __name(normalizeLayer, "normalizeLayer");
    function handleHandlerResponse(e2, n2, o2) {
      if (null === n2)
        return function(e3, n3) {
          if (e3.handled)
            return;
          n3 || 200 === e3.node.res.statusCode || (n3 = e3.node.res.statusCode);
          const o3 = sanitizeStatusCode(n3, 204);
          204 === o3 && e3.node.res.removeHeader("content-length"), e3.node.res.writeHead(o3), e3.node.res.end();
        }(e2);
      if (n2) {
        if (s2 = n2, "undefined" != typeof Response && s2 instanceof Response)
          return sendWebResponse(e2, n2);
        if (function(e3) {
          if (!e3 || "object" != typeof e3)
            return false;
          if ("function" == typeof e3.pipe) {
            if ("function" == typeof e3._read)
              return true;
            if ("function" == typeof e3.abort)
              return true;
          }
          return "function" == typeof e3.pipeTo;
        }(n2))
          return sendStream(e2, n2);
        if (n2.buffer)
          return send(e2, n2);
        if (n2.arrayBuffer && "function" == typeof n2.arrayBuffer)
          return n2.arrayBuffer().then((o3) => send(e2, g.from(o3), n2.type));
        if (n2 instanceof Error)
          throw createError$1(n2);
        if ("function" == typeof n2.end)
          return true;
      }
      var s2;
      const i2 = typeof n2;
      if ("string" === i2)
        return send(e2, n2, be.html);
      if ("object" === i2 || "boolean" === i2 || "number" === i2)
        return send(e2, JSON.stringify(n2, void 0, o2), be.json);
      if ("bigint" === i2)
        return send(e2, n2.toString(), be.json);
      throw createError$1({ statusCode: 500, statusMessage: `[h3] Cannot send ${i2} as response.` });
    }
    __name(handleHandlerResponse, "handleHandlerResponse");
    const $e = ["connect", "delete", "get", "head", "options", "post", "put", "trace", "patch"];
    function toNodeListener(e2) {
      return async function(n2, o2) {
        const s2 = createEvent(n2, o2);
        try {
          await e2.handler(s2);
        } catch (n3) {
          const o3 = createError$1(n3);
          if (isError(n3) || (o3.unhandled = true), setResponseStatus(s2, o3.statusCode, o3.statusMessage), e2.options.onError && await e2.options.onError(o3, s2), s2.handled)
            return;
          (o3.unhandled || o3.fatal) && console.error("[h3]", o3.fatal ? "[fatal]" : "[unhandled]", o3), e2.options.onBeforeResponse && !s2._onBeforeResponseCalled && await e2.options.onBeforeResponse(s2, { body: o3 }), await function(e3, n4, o4) {
            if (e3.handled)
              return;
            const s3 = isError(n4) ? n4 : createError$1(n4), i2 = { statusCode: s3.statusCode, statusMessage: s3.statusMessage, stack: [], data: s3.data };
            if (o4 && (i2.stack = (s3.stack || "").split("\n").map((e4) => e4.trim())), e3.handled)
              return;
            setResponseStatus(e3, Number.parseInt(s3.statusCode), s3.statusMessage), e3.node.res.setHeader("content-type", be.json), e3.node.res.end(JSON.stringify(i2, void 0, 2));
          }(s2, o3, !!e2.options.debug), e2.options.onAfterResponse && !s2._onAfterResponseCalled && await e2.options.onAfterResponse(s2, { body: o3 });
        }
      };
    }
    __name(toNodeListener, "toNodeListener");
    function flatHooks(e2, n2 = {}, o2) {
      for (const s2 in e2) {
        const i2 = e2[s2], a2 = o2 ? `${o2}:${s2}` : s2;
        "object" == typeof i2 && null !== i2 ? flatHooks(i2, n2, a2) : "function" == typeof i2 && (n2[a2] = i2);
      }
      return n2;
    }
    __name(flatHooks, "flatHooks");
    const ke = { run: (e2) => e2() }, Ie = void 0 !== console.createTask ? console.createTask : () => ke;
    function serialTaskCaller(e2, n2) {
      const o2 = n2.shift(), s2 = Ie(o2);
      return e2.reduce((e3, o3) => e3.then(() => s2.run(() => o3(...n2))), Promise.resolve());
    }
    __name(serialTaskCaller, "serialTaskCaller");
    function parallelTaskCaller(e2, n2) {
      const o2 = n2.shift(), s2 = Ie(o2);
      return Promise.all(e2.map((e3) => s2.run(() => e3(...n2))));
    }
    __name(parallelTaskCaller, "parallelTaskCaller");
    function callEachWith(e2, n2) {
      for (const o2 of [...e2])
        o2(n2);
    }
    __name(callEachWith, "callEachWith");
    class Hookable {
      constructor() {
        this._hooks = {}, this._before = void 0, this._after = void 0, this._deprecatedMessages = void 0, this._deprecatedHooks = {}, this.hook = this.hook.bind(this), this.callHook = this.callHook.bind(this), this.callHookWith = this.callHookWith.bind(this);
      }
      hook(e2, n2, o2 = {}) {
        if (!e2 || "function" != typeof n2)
          return () => {
          };
        const s2 = e2;
        let i2;
        for (; this._deprecatedHooks[e2]; )
          i2 = this._deprecatedHooks[e2], e2 = i2.to;
        if (i2 && !o2.allowDeprecated) {
          let e3 = i2.message;
          e3 || (e3 = `${s2} hook has been deprecated` + (i2.to ? `, please use ${i2.to}` : "")), this._deprecatedMessages || (this._deprecatedMessages = /* @__PURE__ */ new Set()), this._deprecatedMessages.has(e3) || (console.warn(e3), this._deprecatedMessages.add(e3));
        }
        if (!n2.name)
          try {
            Object.defineProperty(n2, "name", { get: () => "_" + e2.replace(/\W+/g, "_") + "_hook_cb", configurable: true });
          } catch {
          }
        return this._hooks[e2] = this._hooks[e2] || [], this._hooks[e2].push(n2), () => {
          n2 && (this.removeHook(e2, n2), n2 = void 0);
        };
      }
      hookOnce(e2, n2) {
        let o2, _function = /* @__PURE__ */ __name((...e3) => ("function" == typeof o2 && o2(), o2 = void 0, _function = void 0, n2(...e3)), "_function");
        return o2 = this.hook(e2, _function), o2;
      }
      removeHook(e2, n2) {
        if (this._hooks[e2]) {
          const o2 = this._hooks[e2].indexOf(n2);
          -1 !== o2 && this._hooks[e2].splice(o2, 1), 0 === this._hooks[e2].length && delete this._hooks[e2];
        }
      }
      deprecateHook(e2, n2) {
        this._deprecatedHooks[e2] = "string" == typeof n2 ? { to: n2 } : n2;
        const o2 = this._hooks[e2] || [];
        delete this._hooks[e2];
        for (const n3 of o2)
          this.hook(e2, n3);
      }
      deprecateHooks(e2) {
        Object.assign(this._deprecatedHooks, e2);
        for (const n2 in e2)
          this.deprecateHook(n2, e2[n2]);
      }
      addHooks(e2) {
        const n2 = flatHooks(e2), o2 = Object.keys(n2).map((e3) => this.hook(e3, n2[e3]));
        return () => {
          for (const e3 of o2.splice(0, o2.length))
            e3();
        };
      }
      removeHooks(e2) {
        const n2 = flatHooks(e2);
        for (const e3 in n2)
          this.removeHook(e3, n2[e3]);
      }
      removeAllHooks() {
        for (const e2 in this._hooks)
          delete this._hooks[e2];
      }
      callHook(e2, ...n2) {
        return n2.unshift(e2), this.callHookWith(serialTaskCaller, e2, ...n2);
      }
      callHookParallel(e2, ...n2) {
        return n2.unshift(e2), this.callHookWith(parallelTaskCaller, e2, ...n2);
      }
      callHookWith(e2, n2, ...o2) {
        const s2 = this._before || this._after ? { name: n2, args: o2, context: {} } : void 0;
        this._before && callEachWith(this._before, s2);
        const i2 = e2(n2 in this._hooks ? [...this._hooks[n2]] : [], o2);
        return i2 instanceof Promise ? i2.finally(() => {
          this._after && s2 && callEachWith(this._after, s2);
        }) : (this._after && s2 && callEachWith(this._after, s2), i2);
      }
      beforeEach(e2) {
        return this._before = this._before || [], this._before.push(e2), () => {
          if (void 0 !== this._before) {
            const n2 = this._before.indexOf(e2);
            -1 !== n2 && this._before.splice(n2, 1);
          }
        };
      }
      afterEach(e2) {
        return this._after = this._after || [], this._after.push(e2), () => {
          if (void 0 !== this._after) {
            const n2 = this._after.indexOf(e2);
            -1 !== n2 && this._after.splice(n2, 1);
          }
        };
      }
    }
    __name(Hookable, "Hookable");
    class FetchError extends Error {
      constructor(e2, n2) {
        super(e2, n2), this.name = "FetchError", n2?.cause && !this.cause && (this.cause = n2.cause);
      }
    }
    __name(FetchError, "FetchError");
    const Ae = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));
    function isPayloadMethod(e2 = "GET") {
      return Ae.has(e2.toUpperCase());
    }
    __name(isPayloadMethod, "isPayloadMethod");
    const Re = /* @__PURE__ */ new Set(["image/svg", "application/xml", "application/xhtml", "application/html"]), Te = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
    function resolveFetchOptions(e2, n2, o2, s2) {
      const i2 = function(e3, n3, o3) {
        if (!n3)
          return new o3(e3);
        const s3 = new o3(n3);
        if (e3)
          for (const [n4, i3] of Symbol.iterator in e3 || Array.isArray(e3) ? e3 : new o3(e3))
            s3.set(n4, i3);
        return s3;
      }(n2?.headers ?? e2?.headers, o2?.headers, s2);
      let a2;
      return (o2?.query || o2?.params || n2?.params || n2?.query) && (a2 = { ...o2?.params, ...o2?.query, ...n2?.params, ...n2?.query }), { ...o2, ...n2, query: a2, params: a2, headers: i2 };
    }
    __name(resolveFetchOptions, "resolveFetchOptions");
    async function callHooks(e2, n2) {
      if (n2)
        if (Array.isArray(n2))
          for (const o2 of n2)
            await o2(e2);
        else
          await n2(e2);
    }
    __name(callHooks, "callHooks");
    const Se = /* @__PURE__ */ new Set([408, 409, 425, 429, 500, 502, 503, 504]), Ce = /* @__PURE__ */ new Set([101, 204, 205, 304]);
    function createFetch$1(e2 = {}) {
      const { fetch: n2 = globalThis.fetch, Headers: o2 = globalThis.Headers, AbortController: s2 = globalThis.AbortController } = e2;
      async function onError(e3) {
        const n3 = e3.error && "AbortError" === e3.error.name && !e3.options.timeout || false;
        if (false !== e3.options.retry && !n3) {
          let n4;
          n4 = "number" == typeof e3.options.retry ? e3.options.retry : isPayloadMethod(e3.options.method) ? 0 : 1;
          const o4 = e3.response && e3.response.status || 500;
          if (n4 > 0 && (Array.isArray(e3.options.retryStatusCodes) ? e3.options.retryStatusCodes.includes(o4) : Se.has(o4))) {
            const o5 = "function" == typeof e3.options.retryDelay ? e3.options.retryDelay(e3) : e3.options.retryDelay || 0;
            return o5 > 0 && await new Promise((e4) => setTimeout(e4, o5)), $fetchRaw(e3.request, { ...e3.options, retry: n4 - 1 });
          }
        }
        const o3 = function(e4) {
          const n4 = e4.error?.message || e4.error?.toString() || "", o4 = e4.request?.method || e4.options?.method || "GET", s3 = e4.request?.url || String(e4.request) || "/", i2 = `[${o4}] ${JSON.stringify(s3)}`, a2 = e4.response ? `${e4.response.status} ${e4.response.statusText}` : "<no response>", c2 = new FetchError(`${i2}: ${a2}${n4 ? ` ${n4}` : ""}`, e4.error ? { cause: e4.error } : void 0);
          for (const n5 of ["request", "options", "response"])
            Object.defineProperty(c2, n5, { get: () => e4[n5] });
          for (const [n5, o5] of [["data", "_data"], ["status", "status"], ["statusCode", "status"], ["statusText", "statusText"], ["statusMessage", "statusText"]])
            Object.defineProperty(c2, n5, { get: () => e4.response && e4.response[o5] });
          return c2;
        }(e3);
        throw Error.captureStackTrace && Error.captureStackTrace(o3, $fetchRaw), o3;
      }
      __name(onError, "onError");
      const $fetchRaw = /* @__PURE__ */ __name(async function(i2, a2 = {}) {
        const c2 = { request: i2, options: resolveFetchOptions(i2, a2, e2.defaults, o2), response: void 0, error: void 0 };
        let u2;
        if (c2.options.method && (c2.options.method = c2.options.method.toUpperCase()), c2.options.onRequest && await callHooks(c2, c2.options.onRequest), "string" == typeof c2.request && (c2.options.baseURL && (c2.request = function(e3, n3) {
          if (isEmptyURL(n3) || hasProtocol(e3))
            return e3;
          const o3 = withoutTrailingSlash(n3);
          return e3.startsWith(o3) ? e3 : joinURL(o3, e3);
        }(c2.request, c2.options.baseURL)), c2.options.query && (c2.request = withQuery(c2.request, c2.options.query), delete c2.options.query), "query" in c2.options && delete c2.options.query, "params" in c2.options && delete c2.options.params), c2.options.body && isPayloadMethod(c2.options.method) && (!function(e3) {
          if (void 0 === e3)
            return false;
          const n3 = typeof e3;
          return "string" === n3 || "number" === n3 || "boolean" === n3 || null === n3 || "object" === n3 && (!!Array.isArray(e3) || !e3.buffer && (e3.constructor && "Object" === e3.constructor.name || "function" == typeof e3.toJSON));
        }(c2.options.body) ? ("pipeTo" in c2.options.body && "function" == typeof c2.options.body.pipeTo || "function" == typeof c2.options.body.pipe) && ("duplex" in c2.options || (c2.options.duplex = "half")) : (c2.options.body = "string" == typeof c2.options.body ? c2.options.body : JSON.stringify(c2.options.body), c2.options.headers = new o2(c2.options.headers || {}), c2.options.headers.has("content-type") || c2.options.headers.set("content-type", "application/json"), c2.options.headers.has("accept") || c2.options.headers.set("accept", "application/json"))), !c2.options.signal && c2.options.timeout) {
          const e3 = new s2();
          u2 = setTimeout(() => {
            const n3 = new Error("[TimeoutError]: The operation was aborted due to timeout");
            n3.name = "TimeoutError", n3.code = 23, e3.abort(n3);
          }, c2.options.timeout), c2.options.signal = e3.signal;
        }
        try {
          c2.response = await n2(c2.request, c2.options);
        } catch (e3) {
          return c2.error = e3, c2.options.onRequestError && await callHooks(c2, c2.options.onRequestError), await onError(c2);
        } finally {
          u2 && clearTimeout(u2);
        }
        if ((c2.response.body || c2.response._bodyInit) && !Ce.has(c2.response.status) && "HEAD" !== c2.options.method) {
          const e3 = (c2.options.parseResponse ? "json" : c2.options.responseType) || function(e4 = "") {
            if (!e4)
              return "json";
            const n3 = e4.split(";").shift() || "";
            return Te.test(n3) ? "json" : Re.has(n3) || n3.startsWith("text/") ? "text" : "blob";
          }(c2.response.headers.get("content-type") || "");
          switch (e3) {
            case "json": {
              const e4 = await c2.response.text(), n3 = c2.options.parseResponse || destr;
              c2.response._data = n3(e4);
              break;
            }
            case "stream":
              c2.response._data = c2.response.body || c2.response._bodyInit;
              break;
            default:
              c2.response._data = await c2.response[e3]();
          }
        }
        return c2.options.onResponse && await callHooks(c2, c2.options.onResponse), !c2.options.ignoreResponseError && c2.response.status >= 400 && c2.response.status < 600 ? (c2.options.onResponseError && await callHooks(c2, c2.options.onResponseError), await onError(c2)) : c2.response;
      }, "$fetchRaw"), $fetch = /* @__PURE__ */ __name(async function(e3, n3) {
        return (await $fetchRaw(e3, n3))._data;
      }, "$fetch");
      return $fetch.raw = $fetchRaw, $fetch.native = (...e3) => n2(...e3), $fetch.create = (n3 = {}, o3 = {}) => createFetch$1({ ...e2, ...o3, defaults: { ...e2.defaults, ...o3.defaults, ...n3 } }), $fetch;
    }
    __name(createFetch$1, "createFetch$1");
    const je = function() {
      if ("undefined" != typeof globalThis)
        return globalThis;
      if ("undefined" != typeof self)
        return self;
      if ("undefined" != typeof global)
        return global;
      throw new Error("unable to locate global object");
    }(), Oe = je.fetch ? (...e2) => je.fetch(...e2) : () => Promise.reject(new Error("[ofetch] global.fetch is not supported!")), Me = je.Headers, Ne = je.AbortController, Le = createFetch$1({ fetch: Oe, Headers: Me, AbortController: Ne });
    let Ue = 10, Pe = /* @__PURE__ */ __name(class {
      __unenv__ = true;
      _events = /* @__PURE__ */ Object.create(null);
      _maxListeners;
      static get defaultMaxListeners() {
        return Ue;
      }
      static set defaultMaxListeners(e2) {
        if ("number" != typeof e2 || e2 < 0 || Number.isNaN(e2))
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e2 + ".");
        Ue = e2;
      }
      setMaxListeners(e2) {
        if ("number" != typeof e2 || e2 < 0 || Number.isNaN(e2))
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e2 + ".");
        return this._maxListeners = e2, this;
      }
      getMaxListeners() {
        return _getMaxListeners(this);
      }
      emit(e2, ...n2) {
        if (!this._events[e2] || 0 === this._events[e2].length)
          return false;
        if ("error" === e2) {
          let e3;
          if (n2.length > 0 && (e3 = n2[0]), e3 instanceof Error)
            throw e3;
          const o2 = new Error("Unhandled error." + (e3 ? " (" + e3.message + ")" : ""));
          throw o2.context = e3, o2;
        }
        for (const o2 of this._events[e2])
          (o2.listener || o2).apply(this, n2);
        return true;
      }
      addListener(e2, n2) {
        return _addListener(this, e2, n2, false);
      }
      on(e2, n2) {
        return _addListener(this, e2, n2, false);
      }
      prependListener(e2, n2) {
        return _addListener(this, e2, n2, true);
      }
      once(e2, n2) {
        return this.on(e2, _wrapOnce(this, e2, n2));
      }
      prependOnceListener(e2, n2) {
        return this.prependListener(e2, _wrapOnce(this, e2, n2));
      }
      removeListener(e2, n2) {
        return function(e3, n3, o2) {
          if (_checkListener(o2), !e3._events[n3] || 0 === e3._events[n3].length)
            return e3;
          const s2 = e3._events[n3].length;
          if (e3._events[n3] = e3._events[n3].filter((e4) => e4 !== o2), s2 === e3._events[n3].length)
            return e3;
          e3._events.removeListener && e3.emit("removeListener", n3, o2.listener || o2);
          0 === e3._events[n3].length && delete e3._events[n3];
          return e3;
        }(this, e2, n2);
      }
      off(e2, n2) {
        return this.removeListener(e2, n2);
      }
      removeAllListeners(e2) {
        return function(e3, n2) {
          if (!e3._events[n2] || 0 === e3._events[n2].length)
            return e3;
          if (e3._events.removeListener)
            for (const o2 of e3._events[n2])
              e3.emit("removeListener", n2, o2.listener || o2);
          return delete e3._events[n2], e3;
        }(this, e2);
      }
      listeners(e2) {
        return _listeners(this, e2, true);
      }
      rawListeners(e2) {
        return _listeners(this, e2, false);
      }
      listenerCount(e2) {
        return this.rawListeners(e2).length;
      }
      eventNames() {
        return Object.keys(this._events);
      }
    }, "Pe");
    function _addListener(e2, n2, o2, s2) {
      _checkListener(o2), void 0 !== e2._events.newListener && e2.emit("newListener", n2, o2.listener || o2), e2._events[n2] || (e2._events[n2] = []), s2 ? e2._events[n2].unshift(o2) : e2._events[n2].push(o2);
      const i2 = _getMaxListeners(e2);
      if (i2 > 0 && e2._events[n2].length > i2 && !e2._events[n2].warned) {
        e2._events[n2].warned = true;
        const o3 = new Error(`[unenv] Possible EventEmitter memory leak detected. ${e2._events[n2].length} ${n2} listeners added. Use emitter.setMaxListeners() to increase limit`);
        o3.name = "MaxListenersExceededWarning", o3.emitter = e2, o3.type = n2, o3.count = e2._events[n2]?.length, console.warn(o3);
      }
      return e2;
    }
    __name(_addListener, "_addListener");
    function _wrapOnce(e2, n2, o2) {
      let s2 = false;
      const wrapper = /* @__PURE__ */ __name((...i2) => {
        if (!s2)
          return e2.removeListener(n2, wrapper), s2 = true, 0 === i2.length ? o2.call(e2) : o2.apply(e2, i2);
      }, "wrapper");
      return wrapper.listener = o2, wrapper;
    }
    __name(_wrapOnce, "_wrapOnce");
    function _getMaxListeners(e2) {
      return e2._maxListeners ?? Pe.defaultMaxListeners;
    }
    __name(_getMaxListeners, "_getMaxListeners");
    function _listeners(e2, n2, o2) {
      let s2 = e2._events[n2];
      return "function" == typeof s2 && (s2 = [s2]), o2 ? s2.map((e3) => e3.listener || e3) : s2;
    }
    __name(_listeners, "_listeners");
    function _checkListener(e2) {
      if ("function" != typeof e2)
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e2);
    }
    __name(_checkListener, "_checkListener");
    const He = globalThis.EventEmitter || Pe;
    class _Readable extends He {
      __unenv__ = true;
      readableEncoding = null;
      readableEnded = true;
      readableFlowing = false;
      readableHighWaterMark = 0;
      readableLength = 0;
      readableObjectMode = false;
      readableAborted = false;
      readableDidRead = false;
      closed = false;
      errored = null;
      readable = false;
      destroyed = false;
      static from(e2, n2) {
        return new _Readable(n2);
      }
      constructor(e2) {
        super();
      }
      _read(e2) {
      }
      read(e2) {
      }
      setEncoding(e2) {
        return this;
      }
      pause() {
        return this;
      }
      resume() {
        return this;
      }
      isPaused() {
        return true;
      }
      unpipe(e2) {
        return this;
      }
      unshift(e2, n2) {
      }
      wrap(e2) {
        return this;
      }
      push(e2, n2) {
        return false;
      }
      _destroy(e2, n2) {
        this.removeAllListeners();
      }
      destroy(e2) {
        return this.destroyed = true, this._destroy(e2), this;
      }
      pipe(e2, n2) {
        return {};
      }
      compose(e2, n2) {
        throw new Error("[unenv] Method not implemented.");
      }
      [Symbol.asyncDispose]() {
        return this.destroy(), Promise.resolve();
      }
      async *[Symbol.asyncIterator]() {
        throw createNotImplementedError("Readable.asyncIterator");
      }
      iterator(e2) {
        throw createNotImplementedError("Readable.iterator");
      }
      map(e2, n2) {
        throw createNotImplementedError("Readable.map");
      }
      filter(e2, n2) {
        throw createNotImplementedError("Readable.filter");
      }
      forEach(e2, n2) {
        throw createNotImplementedError("Readable.forEach");
      }
      reduce(e2, n2, o2) {
        throw createNotImplementedError("Readable.reduce");
      }
      find(e2, n2) {
        throw createNotImplementedError("Readable.find");
      }
      findIndex(e2, n2) {
        throw createNotImplementedError("Readable.findIndex");
      }
      some(e2, n2) {
        throw createNotImplementedError("Readable.some");
      }
      toArray(e2) {
        throw createNotImplementedError("Readable.toArray");
      }
      every(e2, n2) {
        throw createNotImplementedError("Readable.every");
      }
      flatMap(e2, n2) {
        throw createNotImplementedError("Readable.flatMap");
      }
      drop(e2, n2) {
        throw createNotImplementedError("Readable.drop");
      }
      take(e2, n2) {
        throw createNotImplementedError("Readable.take");
      }
      asIndexedPairs(e2) {
        throw createNotImplementedError("Readable.asIndexedPairs");
      }
    }
    __name(_Readable, "_Readable");
    const qe = globalThis.Readable || _Readable;
    const De = globalThis.Writable || class extends He {
      __unenv__ = true;
      writable = true;
      writableEnded = false;
      writableFinished = false;
      writableHighWaterMark = 0;
      writableLength = 0;
      writableObjectMode = false;
      writableCorked = 0;
      closed = false;
      errored = null;
      writableNeedDrain = false;
      destroyed = false;
      _data;
      _encoding = "utf-8";
      constructor(e2) {
        super();
      }
      pipe(e2, n2) {
        return {};
      }
      _write(e2, n2, o2) {
        if (this.writableEnded)
          o2 && o2();
        else {
          if (void 0 === this._data)
            this._data = e2;
          else {
            const o3 = "string" == typeof this._data ? g.from(this._data, this._encoding || n2 || "utf8") : this._data, s2 = "string" == typeof e2 ? g.from(e2, n2 || this._encoding || "utf8") : e2;
            this._data = g.concat([o3, s2]);
          }
          this._encoding = n2, o2 && o2();
        }
      }
      _writev(e2, n2) {
      }
      _destroy(e2, n2) {
      }
      _final(e2) {
      }
      write(e2, n2, o2) {
        const s2 = "string" == typeof n2 ? this._encoding : "utf-8", i2 = "function" == typeof n2 ? n2 : "function" == typeof o2 ? o2 : void 0;
        return this._write(e2, s2, i2), true;
      }
      setDefaultEncoding(e2) {
        return this;
      }
      end(e2, n2, o2) {
        const s2 = "function" == typeof e2 ? e2 : "function" == typeof n2 ? n2 : "function" == typeof o2 ? o2 : void 0;
        if (this.writableEnded)
          return s2 && s2(), this;
        const i2 = e2 === s2 ? void 0 : e2;
        if (i2) {
          const e3 = n2 === s2 ? void 0 : n2;
          this.write(i2, e3, s2);
        }
        return this.writableEnded = true, this.writableFinished = true, this.emit("close"), this.emit("finish"), this;
      }
      cork() {
      }
      uncork() {
      }
      destroy(e2) {
        return this.destroyed = true, delete this._data, this.removeAllListeners(), this;
      }
      compose(e2, n2) {
        throw new Error("[h3] Method not implemented.");
      }
    }, ze = /* @__PURE__ */ __name(class {
      allowHalfOpen = true;
      _destroy;
      constructor(e2 = new qe(), n2 = new De()) {
        Object.assign(this, e2), Object.assign(this, n2), this._destroy = function(...e3) {
          return function(...n3) {
            for (const o2 of e3)
              o2(...n3);
          };
        }(e2._destroy, n2._destroy);
      }
    }, "ze");
    function getDuplex() {
      return Object.assign(ze.prototype, qe.prototype), Object.assign(ze.prototype, De.prototype), ze;
    }
    __name(getDuplex, "getDuplex");
    const We = getDuplex(), Fe = globalThis.Duplex || We;
    class Socket extends Fe {
      __unenv__ = true;
      bufferSize = 0;
      bytesRead = 0;
      bytesWritten = 0;
      connecting = false;
      destroyed = false;
      pending = false;
      localAddress = "";
      localPort = 0;
      remoteAddress = "";
      remoteFamily = "";
      remotePort = 0;
      autoSelectFamilyAttemptedAddresses = [];
      readyState = "readOnly";
      constructor(e2) {
        super();
      }
      write(e2, n2, o2) {
        return false;
      }
      connect(e2, n2, o2) {
        return this;
      }
      end(e2, n2, o2) {
        return this;
      }
      setEncoding(e2) {
        return this;
      }
      pause() {
        return this;
      }
      resume() {
        return this;
      }
      setTimeout(e2, n2) {
        return this;
      }
      setNoDelay(e2) {
        return this;
      }
      setKeepAlive(e2, n2) {
        return this;
      }
      address() {
        return {};
      }
      unref() {
        return this;
      }
      ref() {
        return this;
      }
      destroySoon() {
        this.destroy();
      }
      resetAndDestroy() {
        const e2 = new Error("ERR_SOCKET_CLOSED");
        return e2.code = "ERR_SOCKET_CLOSED", this.destroy(e2), this;
      }
    }
    __name(Socket, "Socket");
    class IncomingMessage extends qe {
      __unenv__ = {};
      aborted = false;
      httpVersion = "1.1";
      httpVersionMajor = 1;
      httpVersionMinor = 1;
      complete = true;
      connection;
      socket;
      headers = {};
      trailers = {};
      method = "GET";
      url = "/";
      statusCode = 200;
      statusMessage = "";
      closed = false;
      errored = null;
      readable = false;
      constructor(e2) {
        super(), this.socket = this.connection = e2 || new Socket();
      }
      get rawHeaders() {
        return function(e2) {
          const n2 = [];
          for (const o2 in e2)
            if (Array.isArray(e2[o2]))
              for (const s2 of e2[o2])
                n2.push(o2, s2);
            else
              n2.push(o2, e2[o2]);
          return n2;
        }(this.headers);
      }
      get rawTrailers() {
        return [];
      }
      setTimeout(e2, n2) {
        return this;
      }
      get headersDistinct() {
        return _distinct(this.headers);
      }
      get trailersDistinct() {
        return _distinct(this.trailers);
      }
    }
    __name(IncomingMessage, "IncomingMessage");
    function _distinct(e2) {
      const n2 = {};
      for (const [o2, s2] of Object.entries(e2))
        o2 && (n2[o2] = (Array.isArray(s2) ? s2 : [s2]).filter(Boolean));
      return n2;
    }
    __name(_distinct, "_distinct");
    class ServerResponse extends De {
      __unenv__ = true;
      statusCode = 200;
      statusMessage = "";
      upgrading = false;
      chunkedEncoding = false;
      shouldKeepAlive = false;
      useChunkedEncodingByDefault = false;
      sendDate = false;
      finished = false;
      headersSent = false;
      strictContentLength = false;
      connection = null;
      socket = null;
      req;
      _headers = {};
      constructor(e2) {
        super(), this.req = e2;
      }
      assignSocket(e2) {
        e2._httpMessage = this, this.socket = e2, this.connection = e2, this.emit("socket", e2), this._flush();
      }
      _flush() {
        this.flushHeaders();
      }
      detachSocket(e2) {
      }
      writeContinue(e2) {
      }
      writeHead(e2, n2, o2) {
        e2 && (this.statusCode = e2), "string" == typeof n2 && (this.statusMessage = n2, n2 = void 0);
        const s2 = o2 || n2;
        if (s2)
          if (Array.isArray(s2))
            ;
          else
            for (const e3 in s2)
              this.setHeader(e3, s2[e3]);
        return this.headersSent = true, this;
      }
      writeProcessing() {
      }
      setTimeout(e2, n2) {
        return this;
      }
      appendHeader(e2, n2) {
        e2 = e2.toLowerCase();
        const o2 = this._headers[e2], s2 = [...Array.isArray(o2) ? o2 : [o2], ...Array.isArray(n2) ? n2 : [n2]].filter(Boolean);
        return this._headers[e2] = s2.length > 1 ? s2 : s2[0], this;
      }
      setHeader(e2, n2) {
        return this._headers[e2.toLowerCase()] = n2, this;
      }
      getHeader(e2) {
        return this._headers[e2.toLowerCase()];
      }
      getHeaders() {
        return this._headers;
      }
      getHeaderNames() {
        return Object.keys(this._headers);
      }
      hasHeader(e2) {
        return e2.toLowerCase() in this._headers;
      }
      removeHeader(e2) {
        delete this._headers[e2.toLowerCase()];
      }
      addTrailers(e2) {
      }
      flushHeaders() {
      }
      writeEarlyHints(e2, n2) {
        "function" == typeof n2 && n2();
      }
    }
    __name(ServerResponse, "ServerResponse");
    const Ke = /* @__PURE__ */ new Set([101, 204, 205, 304]);
    const Ve = /post|put|patch/i;
    function hasReqHeader(e2, n2, o2) {
      const s2 = function(e3, n3) {
        return getRequestHeaders(e3)[n3.toLowerCase()];
      }(e2, n2);
      return s2 && "string" == typeof s2 && s2.toLowerCase().includes(o2);
    }
    __name(hasReqHeader, "hasReqHeader");
    function joinHeaders(e2) {
      return Array.isArray(e2) ? e2.join(", ") : String(e2);
    }
    __name(joinHeaders, "joinHeaders");
    function normalizeCookieHeader(e2 = "") {
      return splitCookiesString(joinHeaders(e2));
    }
    __name(normalizeCookieHeader, "normalizeCookieHeader");
    function normalizeCookieHeaders(e2) {
      const n2 = new Headers();
      for (const [o2, s2] of e2)
        if ("set-cookie" === o2)
          for (const e3 of normalizeCookieHeader(s2))
            n2.append("set-cookie", e3);
        else
          n2.set(o2, joinHeaders(s2));
      return n2;
    }
    __name(normalizeCookieHeaders, "normalizeCookieHeaders");
    const errorHandler = /* @__PURE__ */ __name(function(e2, n2) {
      const { stack: o2, statusCode: s2, statusMessage: i2, message: a2 } = function(e3) {
        const n3 = "function" == typeof C.cwd ? C.cwd() : "/", o3 = e3.unhandled || e3.fatal ? [] : (e3.stack || "").split("\n").splice(1).filter((e4) => e4.includes("at ")).map((e4) => ({ text: e4.replace(n3 + "/", "./").replace("webpack:/", "").replace("file://", "").trim(), internal: e4.includes("node_modules") && !e4.includes(".cache") || e4.includes("internal") || e4.includes("new Promise") })), s3 = e3.statusCode || 500;
        return { stack: o3, statusCode: s3, statusMessage: e3.statusMessage ?? (404 === s3 ? "Not Found" : ""), message: e3.unhandled ? "internal server error" : e3.message || e3.toString() };
      }(e2), c2 = { url: n2.path || "", statusCode: s2, statusMessage: i2, message: a2, stack: void 0 };
      if (e2.unhandled || e2.fatal) {
        const n3 = ["[nitro]", "[request error]", e2.unhandled && "[unhandled]", e2.fatal && "[fatal]"].filter(Boolean).join(" ");
        console.error(n3, e2.message + "\n" + o2.map((e3) => "  " + e3.text).join("  \n"));
      }
      return 404 === s2 && setResponseHeader(n2, "Cache-Control", "no-cache"), setResponseStatus(n2, s2, i2), function(e3) {
        return !hasReqHeader(e3, "accept", "text/html") && (hasReqHeader(e3, "accept", "application/json") || hasReqHeader(e3, "user-agent", "curl/") || hasReqHeader(e3, "user-agent", "httpie/") || hasReqHeader(e3, "sec-fetch-mode", "cors") || e3.path.startsWith("/api/") || e3.path.endsWith(".json"));
      }(n2) ? (setResponseHeader(n2, "Content-Type", "application/json"), send(n2, JSON.stringify(c2))) : (setResponseHeader(n2, "Content-Type", "text/html"), send(n2, function(e3) {
        const n3 = e3.statusCode || 500, o3 = e3.statusMessage || "Request Error";
        return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${n3} ${o3}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico/css/pico.min.css">
  </head>
  <body>
    <main class="container">
      <dialog open>
        <article>
          <header>
            <h2>${n3} ${o3}</h2>
          </header>
          <code>
            ${e3.message}<br><br>
            ${"\n" + (e3.stack || []).map((e4) => `&nbsp;&nbsp;${e4}`).join("<br>")}
          </code>
          <footer>
            <a href="/" onclick="event.preventDefault();history.back();">Go Back</a>
          </footer>
        </article>
      </dialog>
    </main>
  </body>
</html>
`;
      }(c2)));
    }, "errorHandler");
    const Je = [], Qe = [{ route: "/", handler: () => Promise.resolve().then(function() {
      return kt;
    }), lazy: true, middleware: false, method: void 0 }, { route: "/projects", handler: () => Promise.resolve().then(function() {
      return Ct;
    }), lazy: true, middleware: false, method: void 0 }];
    function asyncCall(e2, ...n2) {
      try {
        return (o2 = e2(...n2)) && "function" == typeof o2.then ? o2 : Promise.resolve(o2);
      } catch (e3) {
        return Promise.reject(e3);
      }
      var o2;
    }
    __name(asyncCall, "asyncCall");
    function stringify(e2) {
      if (function(e3) {
        const n2 = typeof e3;
        return null === e3 || "object" !== n2 && "function" !== n2;
      }(e2))
        return String(e2);
      if (function(e3) {
        const n2 = Object.getPrototypeOf(e3);
        return !n2 || n2.isPrototypeOf(Object);
      }(e2) || Array.isArray(e2))
        return JSON.stringify(e2);
      if ("function" == typeof e2.toJSON)
        return stringify(e2.toJSON());
      throw new Error("[unstorage] Cannot stringify value!");
    }
    __name(stringify, "stringify");
    const Ye = "base64:";
    function serializeRaw(e2) {
      return "string" == typeof e2 ? e2 : Ye + function(e3) {
        if (globalThis.Buffer)
          return g.from(e3).toString("base64");
        return globalThis.btoa(String.fromCodePoint(...e3));
      }(e2);
    }
    __name(serializeRaw, "serializeRaw");
    function deserializeRaw(e2) {
      return "string" != typeof e2 ? e2 : e2.startsWith(Ye) ? function(e3) {
        if (globalThis.Buffer)
          return g.from(e3, "base64");
        return Uint8Array.from(globalThis.atob(e3), (e4) => e4.codePointAt(0));
      }(e2.slice(7)) : e2;
    }
    __name(deserializeRaw, "deserializeRaw");
    const Ge = ["hasItem", "getItem", "getItemRaw", "setItem", "setItemRaw", "removeItem", "getMeta", "setMeta", "removeMeta", "getKeys", "clear", "mount", "unmount"];
    function normalizeKey$2(e2) {
      return e2 && e2.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
    }
    __name(normalizeKey$2, "normalizeKey$2");
    function joinKeys$1(...e2) {
      return normalizeKey$2(e2.join(":"));
    }
    __name(joinKeys$1, "joinKeys$1");
    function normalizeBaseKey(e2) {
      return (e2 = normalizeKey$2(e2)) ? e2 + ":" : "";
    }
    __name(normalizeBaseKey, "normalizeBaseKey");
    const memory = /* @__PURE__ */ __name(() => {
      const e2 = /* @__PURE__ */ new Map();
      return { name: "memory", getInstance: () => e2, hasItem: (n2) => e2.has(n2), getItem: (n2) => e2.get(n2) ?? null, getItemRaw: (n2) => e2.get(n2) ?? null, setItem(n2, o2) {
        e2.set(n2, o2);
      }, setItemRaw(n2, o2) {
        e2.set(n2, o2);
      }, removeItem(n2) {
        e2.delete(n2);
      }, getKeys: () => [...e2.keys()], clear() {
        e2.clear();
      }, dispose() {
        e2.clear();
      } };
    }, "memory");
    function watch(e2, n2, o2) {
      return e2.watch ? e2.watch((e3, s2) => n2(e3, o2 + s2)) : () => {
      };
    }
    __name(watch, "watch");
    async function dispose(e2) {
      "function" == typeof e2.dispose && await asyncCall(e2.dispose);
    }
    __name(dispose, "dispose");
    const Ze = {}, normalizeKey$1 = /* @__PURE__ */ __name(function(e2) {
      return e2 && e2.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
    }, "normalizeKey$1"), Xe = { getKeys: () => Promise.resolve(Object.keys(Ze)), hasItem: (e2) => (e2 = normalizeKey$1(e2), Promise.resolve(e2 in Ze)), getItem: (e2) => (e2 = normalizeKey$1(e2), Promise.resolve(Ze[e2] ? Ze[e2].import() : null)), getMeta: (e2) => (e2 = normalizeKey$1(e2), Promise.resolve(Ze[e2] ? Ze[e2].meta : {})) };
    function createError(e2, n2, o2) {
      const s2 = new Error(`[unstorage] [${e2}] ${n2}`, o2);
      return Error.captureStackTrace && Error.captureStackTrace(s2, createError), s2;
    }
    __name(createError, "createError");
    function getKVBinding(e2 = "STORAGE") {
      return function(e3) {
        let n2 = "[binding]";
        if ("string" == typeof e3 && (n2 = e3, e3 = globalThis[n2] || globalThis.__env__?.[n2]), !e3)
          throw createError("cloudflare", `Invalid binding \`${n2}\`: \`${e3}\``);
        for (const o2 of ["get", "put", "delete"])
          if (!(o2 in e3))
            throw createError("cloudflare", `Invalid binding \`${n2}\`: \`${o2}\` key is missing`);
        return e3;
      }(e2);
    }
    __name(getKVBinding, "getKVBinding");
    const unstorage_47drivers_47cloudflare_45kv_45binding = /* @__PURE__ */ __name((e2) => {
      const r = /* @__PURE__ */ __name((n2 = "") => e2.base ? function(...e3) {
        return e3.map((e4) => function(e5, n3 = ":") {
          return e5 ? e5.replace(/[:/\\]/g, n3).replace(/^[:/\\]|[:/\\]$/g, "") : "";
        }(e4)).filter(Boolean).join(":");
      }(e2.base, n2) : n2, "r");
      async function getKeys(n2 = "") {
        n2 = r(n2);
        const o2 = getKVBinding(e2.binding), s2 = [];
        let i2;
        do {
          const e3 = await o2.list({ prefix: n2 || void 0, cursor: i2 });
          s2.push(...e3.keys), i2 = e3.list_complete ? void 0 : e3.cursor;
        } while (i2);
        return s2.map((e3) => e3.name);
      }
      __name(getKeys, "getKeys");
      return { name: "cloudflare-kv-binding", options: e2, getInstance: () => getKVBinding(e2.binding), async hasItem(n2) {
        n2 = r(n2);
        const o2 = getKVBinding(e2.binding);
        return null !== await o2.get(n2);
      }, getItem(n2) {
        n2 = r(n2);
        return getKVBinding(e2.binding).get(n2);
      }, setItem(n2, o2, s2) {
        n2 = r(n2);
        return getKVBinding(e2.binding).put(n2, o2, s2 ? { expirationTtl: s2?.ttl ? Math.max(s2.ttl, e2.minTTL ?? 60) : void 0, ...s2 } : void 0);
      }, removeItem(n2) {
        n2 = r(n2);
        return getKVBinding(e2.binding).delete(n2);
      }, getKeys: (n2) => getKeys(n2).then((n3) => n3.map((n4) => e2.base ? n4.slice(e2.base.length) : n4)), async clear(n2) {
        const o2 = getKVBinding(e2.binding), s2 = await getKeys(n2);
        await Promise.all(s2.map((e3) => o2.delete(e3)));
      } };
    }, "unstorage_47drivers_47cloudflare_45kv_45binding"), et = function(e2 = {}) {
      const n2 = { mounts: { "": e2.driver || memory() }, mountpoints: [""], watching: false, watchListeners: [], unwatch: {} }, getMount = /* @__PURE__ */ __name((e3) => {
        for (const o3 of n2.mountpoints)
          if (e3.startsWith(o3))
            return { base: o3, relativeKey: e3.slice(o3.length), driver: n2.mounts[o3] };
        return { base: "", relativeKey: e3, driver: n2.mounts[""] };
      }, "getMount"), getMounts = /* @__PURE__ */ __name((e3, o3) => n2.mountpoints.filter((n3) => n3.startsWith(e3) || o3 && e3.startsWith(n3)).map((o4) => ({ relativeBase: e3.length > o4.length ? e3.slice(o4.length) : void 0, mountpoint: o4, driver: n2.mounts[o4] })), "getMounts"), onChange = /* @__PURE__ */ __name((e3, o3) => {
        if (n2.watching) {
          o3 = normalizeKey$2(o3);
          for (const s2 of n2.watchListeners)
            s2(e3, o3);
        }
      }, "onChange"), stopWatch = /* @__PURE__ */ __name(async () => {
        if (n2.watching) {
          for (const e3 in n2.unwatch)
            await n2.unwatch[e3]();
          n2.unwatch = {}, n2.watching = false;
        }
      }, "stopWatch"), runBatch = /* @__PURE__ */ __name((e3, n3, o3) => {
        const s2 = /* @__PURE__ */ new Map(), getBatch = /* @__PURE__ */ __name((e4) => {
          let n4 = s2.get(e4.base);
          return n4 || (n4 = { driver: e4.driver, base: e4.base, items: [] }, s2.set(e4.base, n4)), n4;
        }, "getBatch");
        for (const o4 of e3) {
          const e4 = "string" == typeof o4, s3 = normalizeKey$2(e4 ? o4 : o4.key), i2 = e4 ? void 0 : o4.value, a2 = e4 || !o4.options ? n3 : { ...n3, ...o4.options }, c2 = getMount(s3);
          getBatch(c2).items.push({ key: s3, value: i2, relativeKey: c2.relativeKey, options: a2 });
        }
        return Promise.all([...s2.values()].map((e4) => o3(e4))).then((e4) => e4.flat());
      }, "runBatch"), o2 = { hasItem(e3, n3 = {}) {
        e3 = normalizeKey$2(e3);
        const { relativeKey: o3, driver: s2 } = getMount(e3);
        return asyncCall(s2.hasItem, o3, n3);
      }, getItem(e3, n3 = {}) {
        e3 = normalizeKey$2(e3);
        const { relativeKey: o3, driver: s2 } = getMount(e3);
        return asyncCall(s2.getItem, o3, n3).then((e4) => destr(e4));
      }, getItems: (e3, n3 = {}) => runBatch(e3, n3, (e4) => e4.driver.getItems ? asyncCall(e4.driver.getItems, e4.items.map((e5) => ({ key: e5.relativeKey, options: e5.options })), n3).then((n4) => n4.map((n5) => ({ key: joinKeys$1(e4.base, n5.key), value: destr(n5.value) }))) : Promise.all(e4.items.map((n4) => asyncCall(e4.driver.getItem, n4.relativeKey, n4.options).then((e5) => ({ key: n4.key, value: destr(e5) }))))), getItemRaw(e3, n3 = {}) {
        e3 = normalizeKey$2(e3);
        const { relativeKey: o3, driver: s2 } = getMount(e3);
        return s2.getItemRaw ? asyncCall(s2.getItemRaw, o3, n3) : asyncCall(s2.getItem, o3, n3).then((e4) => deserializeRaw(e4));
      }, async setItem(e3, n3, s2 = {}) {
        if (void 0 === n3)
          return o2.removeItem(e3);
        e3 = normalizeKey$2(e3);
        const { relativeKey: i2, driver: a2 } = getMount(e3);
        a2.setItem && (await asyncCall(a2.setItem, i2, stringify(n3), s2), a2.watch || onChange("update", e3));
      }, async setItems(e3, n3) {
        await runBatch(e3, n3, async (e4) => {
          if (e4.driver.setItems)
            return asyncCall(e4.driver.setItems, e4.items.map((e5) => ({ key: e5.relativeKey, value: stringify(e5.value), options: e5.options })), n3);
          e4.driver.setItem && await Promise.all(e4.items.map((n4) => asyncCall(e4.driver.setItem, n4.relativeKey, stringify(n4.value), n4.options)));
        });
      }, async setItemRaw(e3, n3, s2 = {}) {
        if (void 0 === n3)
          return o2.removeItem(e3, s2);
        e3 = normalizeKey$2(e3);
        const { relativeKey: i2, driver: a2 } = getMount(e3);
        if (a2.setItemRaw)
          await asyncCall(a2.setItemRaw, i2, n3, s2);
        else {
          if (!a2.setItem)
            return;
          await asyncCall(a2.setItem, i2, serializeRaw(n3), s2);
        }
        a2.watch || onChange("update", e3);
      }, async removeItem(e3, n3 = {}) {
        "boolean" == typeof n3 && (n3 = { removeMeta: n3 }), e3 = normalizeKey$2(e3);
        const { relativeKey: o3, driver: s2 } = getMount(e3);
        s2.removeItem && (await asyncCall(s2.removeItem, o3, n3), (n3.removeMeta || n3.removeMata) && await asyncCall(s2.removeItem, o3 + "$", n3), s2.watch || onChange("remove", e3));
      }, async getMeta(e3, n3 = {}) {
        "boolean" == typeof n3 && (n3 = { nativeOnly: n3 }), e3 = normalizeKey$2(e3);
        const { relativeKey: o3, driver: s2 } = getMount(e3), i2 = /* @__PURE__ */ Object.create(null);
        if (s2.getMeta && Object.assign(i2, await asyncCall(s2.getMeta, o3, n3)), !n3.nativeOnly) {
          const e4 = await asyncCall(s2.getItem, o3 + "$", n3).then((e5) => destr(e5));
          e4 && "object" == typeof e4 && ("string" == typeof e4.atime && (e4.atime = new Date(e4.atime)), "string" == typeof e4.mtime && (e4.mtime = new Date(e4.mtime)), Object.assign(i2, e4));
        }
        return i2;
      }, setMeta(e3, n3, o3 = {}) {
        return this.setItem(e3 + "$", n3, o3);
      }, removeMeta(e3, n3 = {}) {
        return this.removeItem(e3 + "$", n3);
      }, async getKeys(e3, n3 = {}) {
        e3 = normalizeBaseKey(e3);
        const o3 = getMounts(e3, true);
        let s2 = [];
        const i2 = [];
        for (const e4 of o3) {
          const o4 = await asyncCall(e4.driver.getKeys, e4.relativeBase, n3);
          for (const n4 of o4) {
            const o5 = e4.mountpoint + normalizeKey$2(n4);
            s2.some((e5) => o5.startsWith(e5)) || i2.push(o5);
          }
          s2 = [e4.mountpoint, ...s2.filter((n4) => !n4.startsWith(e4.mountpoint))];
        }
        return e3 ? i2.filter((n4) => n4.startsWith(e3) && "$" !== n4[n4.length - 1]) : i2.filter((e4) => "$" !== e4[e4.length - 1]);
      }, async clear(e3, n3 = {}) {
        e3 = normalizeBaseKey(e3), await Promise.all(getMounts(e3, false).map(async (e4) => {
          if (e4.driver.clear)
            return asyncCall(e4.driver.clear, e4.relativeBase, n3);
          if (e4.driver.removeItem) {
            const o3 = await e4.driver.getKeys(e4.relativeBase || "", n3);
            return Promise.all(o3.map((o4) => e4.driver.removeItem(o4, n3)));
          }
        }));
      }, async dispose() {
        await Promise.all(Object.values(n2.mounts).map((e3) => dispose(e3)));
      }, watch: async (e3) => (await (async () => {
        if (!n2.watching) {
          n2.watching = true;
          for (const e4 in n2.mounts)
            n2.unwatch[e4] = await watch(n2.mounts[e4], onChange, e4);
        }
      })(), n2.watchListeners.push(e3), async () => {
        n2.watchListeners = n2.watchListeners.filter((n3) => n3 !== e3), 0 === n2.watchListeners.length && await stopWatch();
      }), async unwatch() {
        n2.watchListeners = [], await stopWatch();
      }, mount(e3, s2) {
        if ((e3 = normalizeBaseKey(e3)) && n2.mounts[e3])
          throw new Error(`already mounted at ${e3}`);
        return e3 && (n2.mountpoints.push(e3), n2.mountpoints.sort((e4, n3) => n3.length - e4.length)), n2.mounts[e3] = s2, n2.watching && Promise.resolve(watch(s2, onChange, e3)).then((o3) => {
          n2.unwatch[e3] = o3;
        }).catch(console.error), o2;
      }, async unmount(e3, o3 = true) {
        (e3 = normalizeBaseKey(e3)) && n2.mounts[e3] && (n2.watching && e3 in n2.unwatch && (n2.unwatch[e3]?.(), delete n2.unwatch[e3]), o3 && await dispose(n2.mounts[e3]), n2.mountpoints = n2.mountpoints.filter((n3) => n3 !== e3), delete n2.mounts[e3]);
      }, getMount(e3 = "") {
        e3 = normalizeKey$2(e3) + ":";
        const n3 = getMount(e3);
        return { driver: n3.driver, base: n3.base };
      }, getMounts(e3 = "", n3 = {}) {
        e3 = normalizeKey$2(e3);
        return getMounts(e3, n3.parents).map((e4) => ({ driver: e4.driver, base: e4.mountpoint }));
      }, keys: (e3, n3 = {}) => o2.getKeys(e3, n3), get: (e3, n3 = {}) => o2.getItem(e3, n3), set: (e3, n3, s2 = {}) => o2.setItem(e3, n3, s2), has: (e3, n3 = {}) => o2.hasItem(e3, n3), del: (e3, n3 = {}) => o2.removeItem(e3, n3), remove: (e3, n3 = {}) => o2.removeItem(e3, n3) };
      return o2;
    }({});
    function useStorage(e2 = "") {
      return e2 ? function(e3, n2) {
        if (!(n2 = normalizeBaseKey(n2)))
          return e3;
        const o2 = { ...e3 };
        for (const s2 of Ge)
          o2[s2] = (o3 = "", ...i2) => e3[s2](n2 + o3, ...i2);
        return o2.getKeys = (o3 = "", ...s2) => e3.getKeys(n2 + o3, ...s2).then((e4) => e4.map((e5) => e5.slice(n2.length))), o2;
      }(et, e2) : et;
    }
    __name(useStorage, "useStorage");
    function defineCachedFunction(e2, n2 = {}) {
      n2 = { name: "_", base: "/cache", swr: true, maxAge: 1, ...n2 };
      const o2 = {}, s2 = n2.group || "nitro/functions", i2 = n2.name || e2.name || "_", a2 = n2.integrity || hash([e2, n2]), c2 = n2.validate || ((e3) => void 0 !== e3.value);
      return async (...u2) => {
        if (await n2.shouldBypassCache?.(...u2))
          return e2(...u2);
        const f2 = await (n2.getKey || getKey)(...u2), p2 = await n2.shouldInvalidateCache?.(...u2), g2 = await async function(e3, u3, f3, p3) {
          const g3 = [n2.base, s2, i2, e3 + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
          let w3 = await useStorage().getItem(g3).catch((e4) => {
            console.error("[nitro] [cache] Cache read error.", e4), useNitroApp().captureError(e4, { event: p3, tags: ["cache"] });
          }) || {};
          if ("object" != typeof w3) {
            w3 = {};
            const e4 = new Error("Malformed data read from cache.");
            console.error("[nitro] [cache]", e4), useNitroApp().captureError(e4, { event: p3, tags: ["cache"] });
          }
          const b2 = 1e3 * (n2.maxAge ?? 0);
          b2 && (w3.expires = Date.now() + b2);
          const v2 = f3 || w3.integrity !== a2 || b2 && Date.now() - (w3.mtime || 0) > b2 || false === c2(w3), _2 = v2 ? (async () => {
            const s3 = o2[e3];
            s3 || (void 0 !== w3.value && (n2.staleMaxAge || 0) >= 0 && false === n2.swr && (w3.value = void 0, w3.integrity = void 0, w3.mtime = void 0, w3.expires = void 0), o2[e3] = Promise.resolve(u3()));
            try {
              w3.value = await o2[e3];
            } catch (n3) {
              throw s3 || delete o2[e3], n3;
            }
            if (!s3 && (w3.mtime = Date.now(), w3.integrity = a2, delete o2[e3], false !== c2(w3))) {
              let e4;
              n2.maxAge && !n2.swr && (e4 = { ttl: n2.maxAge });
              const o3 = useStorage().setItem(g3, w3, e4).catch((e5) => {
                console.error("[nitro] [cache] Cache write error.", e5), useNitroApp().captureError(e5, { event: p3, tags: ["cache"] });
              });
              p3?.waitUntil && p3.waitUntil(o3);
            }
          })() : Promise.resolve();
          return void 0 === w3.value ? await _2 : v2 && p3 && p3.waitUntil && p3.waitUntil(_2), n2.swr && false !== c2(w3) ? (_2.catch((e4) => {
            console.error("[nitro] [cache] SWR handler error.", e4), useNitroApp().captureError(e4, { event: p3, tags: ["cache"] });
          }), w3) : _2.then(() => w3);
        }(f2, () => e2(...u2), p2, u2[0] && isEvent(u2[0]) ? u2[0] : void 0);
        let w2 = g2.value;
        return n2.transform && (w2 = await n2.transform(g2, ...u2) || w2), w2;
      };
    }
    __name(defineCachedFunction, "defineCachedFunction");
    function getKey(...e2) {
      return e2.length > 0 ? hash(e2, {}) : "";
    }
    __name(getKey, "getKey");
    function escapeKey(e2) {
      return String(e2).replace(/\W/g, "");
    }
    __name(escapeKey, "escapeKey");
    function cloneWithProxy(e2, n2) {
      return new Proxy(e2, { get: (e3, o2, s2) => o2 in n2 ? n2[o2] : Reflect.get(e3, o2, s2), set: (e3, o2, s2, i2) => o2 in n2 ? (n2[o2] = s2, true) : Reflect.set(e3, o2, s2, i2) });
    }
    __name(cloneWithProxy, "cloneWithProxy");
    et.mount("/assets", Xe), et.mount("kv", unstorage_47drivers_47cloudflare_45kv_45binding({ driver: "cloudflare-kv-binding", binding: "api_satooru_me" }));
    const cachedEventHandler = /* @__PURE__ */ __name(function(e2, n2 = { name: "_", base: "/cache", swr: true, maxAge: 1 }) {
      const o2 = (n2.varies || []).filter(Boolean).map((e3) => e3.toLowerCase()).sort(), s2 = { ...n2, getKey: async (e3) => {
        const s3 = await n2.getKey?.(e3);
        if (s3)
          return escapeKey(s3);
        const i3 = e3.node.req.originalUrl || e3.node.req.url || e3.path;
        let a2;
        try {
          a2 = escapeKey(decodeURI(parseURL(i3).pathname)).slice(0, 16) || "index";
        } catch {
          a2 = "-";
        }
        return [`${a2}.${hash(i3)}`, ...o2.map((n3) => [n3, e3.node.req.headers[n3]]).map(([e4, n3]) => `${escapeKey(e4)}.${hash(n3)}`)].join(":");
      }, validate: (e3) => !!e3.value && (!(e3.value.code >= 400) && (void 0 !== e3.value.body && ("undefined" !== e3.value.headers.etag && "undefined" !== e3.value.headers["last-modified"]))), group: n2.group || "nitro/handlers", integrity: n2.integrity || hash([e2, n2]) }, i2 = function(e3, n3 = {}) {
        return defineCachedFunction(e3, n3);
      }(async (i3) => {
        const a2 = {};
        for (const e3 of o2) {
          const n3 = i3.node.req.headers[e3];
          void 0 !== n3 && (a2[e3] = n3);
        }
        const c2 = cloneWithProxy(i3.node.req, { headers: a2 }), u2 = {};
        let f2;
        const p2 = createEvent(c2, cloneWithProxy(i3.node.res, { statusCode: 200, writableEnded: false, writableFinished: false, headersSent: false, closed: false, getHeader: (e3) => u2[e3], setHeader(e3, n3) {
          return u2[e3] = n3, this;
        }, getHeaderNames: () => Object.keys(u2), hasHeader: (e3) => e3 in u2, removeHeader(e3) {
          delete u2[e3];
        }, getHeaders: () => u2, end(e3, n3, o3) {
          return "string" == typeof e3 && (f2 = e3), "function" == typeof n3 && n3(), "function" == typeof o3 && o3(), this;
        }, write: (e3, n3, o3) => ("string" == typeof e3 && (f2 = e3), "function" == typeof n3 && n3(void 0), "function" == typeof o3 && o3(), true), writeHead(e3, n3) {
          if (this.statusCode = e3, n3) {
            if (Array.isArray(n3) || "string" == typeof n3)
              throw new TypeError("Raw headers  is not supported.");
            for (const e4 in n3) {
              const o3 = n3[e4];
              void 0 !== o3 && this.setHeader(e4, o3);
            }
          }
          return this;
        } }));
        p2.fetch = (e3, n3) => fetchWithEvent(p2, e3, n3, { fetch: useNitroApp().localFetch }), p2.$fetch = (e3, n3) => fetchWithEvent(p2, e3, n3, { fetch: globalThis.$fetch }), p2.context = i3.context, p2.context.cache = { options: s2 };
        const g2 = await e2(p2) || f2, w2 = p2.node.res.getHeaders();
        w2.etag = String(w2.Etag || w2.etag || `W/"${hash(g2)}"`), w2["last-modified"] = String(w2["Last-Modified"] || w2["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString());
        const b2 = [];
        n2.swr ? (n2.maxAge && b2.push(`s-maxage=${n2.maxAge}`), n2.staleMaxAge ? b2.push(`stale-while-revalidate=${n2.staleMaxAge}`) : b2.push("stale-while-revalidate")) : n2.maxAge && b2.push(`max-age=${n2.maxAge}`), b2.length > 0 && (w2["cache-control"] = b2.join(", "));
        return { code: p2.node.res.statusCode, headers: w2, body: g2 };
      }, s2);
      return defineEventHandler(async (o3) => {
        if (n2.headersOnly) {
          if (handleCacheHeaders(o3, { maxAge: n2.maxAge }))
            return;
          return e2(o3);
        }
        const s3 = await i2(o3);
        if (o3.node.res.headersSent || o3.node.res.writableEnded)
          return s3.body;
        if (!handleCacheHeaders(o3, { modifiedTime: new Date(s3.headers["last-modified"]), etag: s3.headers.etag, maxAge: n2.maxAge })) {
          o3.node.res.statusCode = s3.code;
          for (const e3 in s3.headers) {
            const n3 = s3.headers[e3];
            "set-cookie" === e3 ? o3.node.res.appendHeader(e3, splitCookiesString(n3)) : void 0 !== n3 && o3.node.res.setHeader(e3, n3);
          }
          return s3.body;
        }
      });
    }, "cachedEventHandler");
    function klona(e2) {
      if ("object" != typeof e2)
        return e2;
      var n2, o2, s2 = Object.prototype.toString.call(e2);
      if ("[object Object]" === s2) {
        if (e2.constructor !== Object && "function" == typeof e2.constructor)
          for (n2 in o2 = new e2.constructor(), e2)
            e2.hasOwnProperty(n2) && o2[n2] !== e2[n2] && (o2[n2] = klona(e2[n2]));
        else
          for (n2 in o2 = {}, e2)
            "__proto__" === n2 ? Object.defineProperty(o2, n2, { value: klona(e2[n2]), configurable: true, enumerable: true, writable: true }) : o2[n2] = klona(e2[n2]);
        return o2;
      }
      if ("[object Array]" === s2) {
        for (n2 = e2.length, o2 = Array(n2); n2--; )
          o2[n2] = klona(e2[n2]);
        return o2;
      }
      return "[object Set]" === s2 ? (o2 = /* @__PURE__ */ new Set(), e2.forEach(function(e3) {
        o2.add(klona(e3));
      }), o2) : "[object Map]" === s2 ? (o2 = /* @__PURE__ */ new Map(), e2.forEach(function(e3, n3) {
        o2.set(klona(n3), klona(e3));
      }), o2) : "[object Date]" === s2 ? /* @__PURE__ */ new Date(+e2) : "[object RegExp]" === s2 ? ((o2 = new RegExp(e2.source, e2.flags)).lastIndex = e2.lastIndex, o2) : "[object DataView]" === s2 ? new e2.constructor(klona(e2.buffer)) : "[object ArrayBuffer]" === s2 ? e2.slice(0) : "Array]" === s2.slice(-6) ? new e2.constructor(e2) : e2;
    }
    __name(klona, "klona");
    const tt = ge({}), rt = /\d/, nt = ["-", "_", "/", "."];
    function isUppercase(e2 = "") {
      if (!rt.test(e2))
        return e2 !== e2.toLowerCase();
    }
    __name(isUppercase, "isUppercase");
    function kebabCase(e2, n2) {
      return e2 ? (Array.isArray(e2) ? e2 : function(e3) {
        const n3 = nt, o2 = [];
        if (!e3 || "string" != typeof e3)
          return o2;
        let s2, i2, a2 = "";
        for (const c2 of e3) {
          const e4 = n3.includes(c2);
          if (true === e4) {
            o2.push(a2), a2 = "", s2 = void 0;
            continue;
          }
          const u2 = isUppercase(c2);
          if (false === i2) {
            if (false === s2 && true === u2) {
              o2.push(a2), a2 = c2, s2 = u2;
              continue;
            }
            if (true === s2 && false === u2 && a2.length > 1) {
              const e5 = a2.at(-1);
              o2.push(a2.slice(0, Math.max(0, a2.length - 1))), a2 = e5 + c2, s2 = u2;
              continue;
            }
          }
          a2 += c2, s2 = u2, i2 = e4;
        }
        return o2.push(a2), o2;
      }(e2)).map((e3) => e3.toLowerCase()).join(n2) : "";
    }
    __name(kebabCase, "kebabCase");
    function getEnv(e2, n2) {
      const o2 = (s2 = e2, kebabCase(s2 || "", "_")).toUpperCase();
      var s2;
      return destr(C.env[n2.prefix + o2] ?? C.env[n2.altPrefix + o2]);
    }
    __name(getEnv, "getEnv");
    function _isObject(e2) {
      return "object" == typeof e2 && !Array.isArray(e2);
    }
    __name(_isObject, "_isObject");
    const ot = /{{(.*?)}}/g;
    const st = { app: { baseURL: "/" }, nitro: { routeRules: {} } }, it = { prefix: "NITRO_", altPrefix: st.nitro.envPrefix ?? C.env.NITRO_ENV_PREFIX ?? "_", envExpansion: st.nitro.envExpansion ?? C.env.NITRO_ENV_EXPANSION ?? false }, at = _deepFreeze((/* @__PURE__ */ __name(function applyEnv(e2, n2, o2 = "") {
      for (const s2 in e2) {
        const i2 = o2 ? `${o2}_${s2}` : s2, a2 = getEnv(i2, n2);
        _isObject(e2[s2]) ? _isObject(a2) ? (e2[s2] = { ...e2[s2], ...a2 }, applyEnv(e2[s2], n2, i2)) : void 0 === a2 ? applyEnv(e2[s2], n2, i2) : e2[s2] = a2 ?? e2[s2] : e2[s2] = a2 ?? e2[s2], n2.envExpansion && "string" == typeof e2[s2] && (e2[s2] = e2[s2].replace(ot, (e3, n3) => C.env[n3] || e3));
      }
      return e2;
    }, "applyEnv"))(klona(st), it));
    function useRuntimeConfig(e2) {
      return at;
    }
    __name(useRuntimeConfig, "useRuntimeConfig");
    function _deepFreeze(e2) {
      const n2 = Object.getOwnPropertyNames(e2);
      for (const o2 of n2) {
        const n3 = e2[o2];
        n3 && "object" == typeof n3 && _deepFreeze(n3);
      }
      return Object.freeze(e2);
    }
    __name(_deepFreeze, "_deepFreeze");
    _deepFreeze(klona(tt)), new Proxy(/* @__PURE__ */ Object.create(null), { get: (e2, n2) => {
      console.warn("Please use `useRuntimeConfig()` instead of accessing config directly.");
      const o2 = useRuntimeConfig();
      if (n2 in o2)
        return o2[n2];
    } });
    const ct = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof global ? global : {}, ut = "__unctx__", lt = ct[ut] || (ct[ut] = function(e2 = {}) {
      const n2 = {};
      return { get: (o2, s2 = {}) => (n2[o2] || (n2[o2] = function(e3 = {}) {
        let n3, o3 = false;
        const checkConflict = /* @__PURE__ */ __name((e4) => {
          if (n3 && n3 !== e4)
            throw new Error("Context conflict");
        }, "checkConflict");
        let s3;
        if (e3.asyncContext) {
          const n4 = e3.AsyncLocalStorage || globalThis.AsyncLocalStorage;
          n4 ? s3 = new n4() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
        }
        const _getCurrentInstance = /* @__PURE__ */ __name(() => {
          if (s3) {
            const e4 = s3.getStore();
            if (void 0 !== e4)
              return e4;
          }
          return n3;
        }, "_getCurrentInstance");
        return { use: () => {
          const e4 = _getCurrentInstance();
          if (void 0 === e4)
            throw new Error("Context is not available");
          return e4;
        }, tryUse: () => _getCurrentInstance(), set: (e4, s4) => {
          s4 || checkConflict(e4), n3 = e4, o3 = true;
        }, unset: () => {
          n3 = void 0, o3 = false;
        }, call: (e4, i2) => {
          checkConflict(e4), n3 = e4;
          try {
            return s3 ? s3.run(e4, i2) : i2();
          } finally {
            o3 || (n3 = void 0);
          }
        }, async callAsync(e4, i2) {
          n3 = e4;
          const onRestore = /* @__PURE__ */ __name(() => {
            n3 = e4;
          }, "onRestore"), onLeave = /* @__PURE__ */ __name(() => n3 === e4 ? onRestore : void 0, "onLeave");
          dt.add(onLeave);
          try {
            const a2 = s3 ? s3.run(e4, i2) : i2();
            return o3 || (n3 = void 0), await a2;
          } finally {
            dt.delete(onLeave);
          }
        } };
      }({ ...e2, ...s2 })), n2[o2]) };
    }()), ft = "__unctx_async_handlers__", dt = ct[ft] || (ct[ft] = /* @__PURE__ */ new Set());
    ((e2, n2 = {}) => {
      lt.get(e2, n2);
    })("nitro-app", { asyncContext: void 0, AsyncLocalStorage: void 0 });
    const ht = toRouteMatcher(createRouter$1({ routes: useRuntimeConfig().nitro.routeRules }));
    function createRouteRulesHandler(e2) {
      return Be((n2) => {
        const o2 = function(e3) {
          e3.context._nitro = e3.context._nitro || {}, e3.context._nitro.routeRules || (e3.context._nitro.routeRules = getRouteRulesForPath(withoutBase(e3.path.split("?")[0], useRuntimeConfig().app.baseURL)));
          return e3.context._nitro.routeRules;
        }(n2);
        if (o2.headers && setHeaders(n2, o2.headers), o2.redirect) {
          let e3 = o2.redirect.to;
          if (e3.endsWith("/**")) {
            let s2 = n2.path;
            const i2 = o2.redirect._redirectStripBase;
            i2 && (s2 = withoutBase(s2, i2)), e3 = joinURL(e3.slice(0, -3), s2);
          } else if (n2.path.includes("?")) {
            e3 = withQuery(e3, getQuery(n2.path));
          }
          return function(e4, n3, o3 = 302) {
            return e4.node.res.statusCode = sanitizeStatusCode(o3, e4.node.res.statusCode), e4.node.res.setHeader("location", n3), send(e4, `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${n3.replace(/"/g, "%22")}"></head></html>`, be.html);
          }(n2, e3, o2.redirect.statusCode);
        }
        if (o2.proxy) {
          let s2 = o2.proxy.to;
          if (s2.endsWith("/**")) {
            let e3 = n2.path;
            const i2 = o2.proxy._proxyStripBase;
            i2 && (e3 = withoutBase(e3, i2)), s2 = joinURL(s2.slice(0, -3), e3);
          } else if (n2.path.includes("?")) {
            s2 = withQuery(s2, getQuery(n2.path));
          }
          return proxyRequest(n2, s2, { fetch: e2.localFetch, ...o2.proxy });
        }
      });
    }
    __name(createRouteRulesHandler, "createRouteRulesHandler");
    function getRouteRulesForPath(e2) {
      return me({}, ...ht.matchAll(e2).reverse());
    }
    __name(getRouteRulesForPath, "getRouteRulesForPath");
    const pt = function() {
      const e2 = useRuntimeConfig(), n2 = new Hookable(), captureError = /* @__PURE__ */ __name((e3, o3 = {}) => {
        const s3 = n2.callHookParallel("error", e3, o3).catch((e4) => {
          console.error("Error while capturing another error", e4);
        });
        if (o3.event && isEvent(o3.event)) {
          const n3 = o3.event.context.nitro?.errors;
          n3 && n3.push({ error: e3, context: o3 }), o3.event.waitUntil && o3.event.waitUntil(s3);
        }
      }, "captureError"), o2 = createApp({ debug: destr(false), onError: (e3, n3) => (captureError(e3, { event: n3, tags: ["request"] }), errorHandler(e3, n3)), onRequest: async (e3) => {
        await pt.hooks.callHook("request", e3).catch((n3) => {
          captureError(n3, { event: e3, tags: ["request"] });
        });
      }, onBeforeResponse: async (e3, n3) => {
        await pt.hooks.callHook("beforeResponse", e3, n3).catch((n4) => {
          captureError(n4, { event: e3, tags: ["request", "response"] });
        });
      }, onAfterResponse: async (e3, n3) => {
        await pt.hooks.callHook("afterResponse", e3, n3).catch((n4) => {
          captureError(n4, { event: e3, tags: ["request", "response"] });
        });
      } }), s2 = function(e3 = {}) {
        const n3 = createRouter$1({}), o3 = {};
        let s3;
        const i3 = {}, addRoute = /* @__PURE__ */ __name((e4, s4, a4) => {
          let c3 = o3[e4];
          if (c3 || (o3[e4] = c3 = { path: e4, handlers: {} }, n3.insert(e4, c3)), Array.isArray(a4))
            for (const n4 of a4)
              addRoute(e4, s4, n4);
          else
            c3.handlers[a4] = toEventHandler(s4, 0, e4);
          return i3;
        }, "addRoute");
        i3.use = i3.add = (e4, n4, o4) => addRoute(e4, n4, o4 || "all");
        for (const e4 of $e)
          i3[e4] = (n4, o4) => i3.add(n4, o4, e4);
        const matchHandler = /* @__PURE__ */ __name((e4 = "/", o4 = "get") => {
          const i4 = e4.indexOf("?");
          -1 !== i4 && (e4 = e4.slice(0, Math.max(0, i4)));
          const a4 = n3.lookup(e4);
          if (!a4 || !a4.handlers)
            return { error: createError$1({ statusCode: 404, name: "Not Found", statusMessage: `Cannot find any route matching ${e4 || "/"}.` }) };
          let c3 = a4.handlers[o4] || a4.handlers.all;
          if (!c3) {
            s3 || (s3 = toRouteMatcher(n3));
            const i5 = s3.matchAll(e4).reverse();
            for (const e5 of i5) {
              if (e5.handlers[o4]) {
                c3 = e5.handlers[o4], a4.handlers[o4] = a4.handlers[o4] || c3;
                break;
              }
              if (e5.handlers.all) {
                c3 = e5.handlers.all, a4.handlers.all = a4.handlers.all || c3;
                break;
              }
            }
          }
          return c3 ? { matched: a4, handler: c3 } : { error: createError$1({ statusCode: 405, name: "Method Not Allowed", statusMessage: `Method ${o4} is not allowed on this route.` }) };
        }, "matchHandler"), a3 = e3.preemptive || e3.preemtive;
        return i3.handler = Be((e4) => {
          const n4 = matchHandler(e4.path, e4.method.toLowerCase());
          if ("error" in n4) {
            if (a3)
              throw n4.error;
            return;
          }
          e4.context.matchedRoute = n4.matched;
          const o4 = n4.matched.params || {};
          return e4.context.params = o4, Promise.resolve(n4.handler(e4)).then((e5) => void 0 === e5 && a3 ? null : e5);
        }), i3.handler.__resolve__ = async (e4) => {
          e4 = function(e5 = "") {
            return function(e6 = "") {
              return e6.startsWith("/");
            }(e5) ? e5 : "/" + e5;
          }(e4);
          const n4 = matchHandler(e4);
          if ("error" in n4)
            return;
          let o4 = { route: n4.matched.path, handler: n4.handler };
          if (n4.handler.__resolve__) {
            const s4 = await n4.handler.__resolve__(e4);
            if (!s4)
              return;
            o4 = { ...o4, ...s4 };
          }
          return o4;
        }, i3;
      }({ preemptive: true }), i2 = (a2 = toNodeListener(o2), function(e3) {
        const n3 = new IncomingMessage(), o3 = new ServerResponse(n3);
        if (n3.url = e3.url || "/", n3.method = e3.method || "GET", n3.headers = {}, e3.headers) {
          const o4 = "function" == typeof e3.headers.entries ? e3.headers.entries() : Object.entries(e3.headers);
          for (const [e4, s3] of o4)
            s3 && (n3.headers[e4.toLowerCase()] = s3);
        }
        return n3.headers.host = n3.headers.host || e3.host || "localhost", n3.connection.encrypted = n3.connection.encrypted || "https" === e3.protocol, n3.body = e3.body || null, n3.__unenv__ = e3.context, a2(n3, o3).then(() => {
          let e4 = o3._data;
          (Ke.has(o3.statusCode) || "HEAD" === n3.method.toUpperCase()) && (e4 = null, delete o3._headers["content-length"]);
          const s3 = { body: e4, headers: o3._headers, status: o3.statusCode, statusText: o3.statusMessage };
          return n3.destroy(), o3.destroy(), s3;
        });
      });
      var a2;
      const c2 = function(e3, n3 = global.fetch) {
        return async function(o3, s3) {
          const i3 = o3.toString();
          if (!i3.startsWith("/"))
            return n3(i3, s3);
          try {
            const n4 = await e3({ url: i3, ...s3 });
            return new Response(n4.body, { status: n4.status, statusText: n4.statusText, headers: Object.fromEntries(Object.entries(n4.headers).map(([e4, n5]) => [e4, Array.isArray(n5) ? n5.join(",") : String(n5) || ""])) });
          } catch (e4) {
            return new Response(e4.toString(), { status: Number.parseInt(e4.statusCode || e4.code) || 500, statusText: e4.statusText });
          }
        };
      }(i2, globalThis.fetch), localFetch = /* @__PURE__ */ __name((e3, n3) => c2(e3, n3).then((e4) => function(e5) {
        return e5.headers.has("set-cookie") ? new Response(e5.body, { status: e5.status, statusText: e5.statusText, headers: normalizeCookieHeaders(e5.headers) }) : e5;
      }(e4)), "localFetch"), u2 = createFetch$1({ fetch: localFetch, Headers: Me, defaults: { baseURL: e2.app.baseURL } });
      globalThis.$fetch = u2, o2.use(createRouteRulesHandler({ localFetch })), o2.use(Be((e3) => {
        e3.context.nitro = e3.context.nitro || { errors: [] };
        const n3 = e3.node.req?.__unenv__;
        n3 && Object.assign(e3.context, n3), e3.fetch = (n4, o3) => fetchWithEvent(e3, n4, o3, { fetch: localFetch }), e3.$fetch = (n4, o3) => fetchWithEvent(e3, n4, o3, { fetch: u2 }), e3.waitUntil = (o3) => {
          e3.context.nitro._waitUntilPromises || (e3.context.nitro._waitUntilPromises = []), e3.context.nitro._waitUntilPromises.push(o3), n3?.waitUntil && n3.waitUntil(o3);
        }, e3.captureError = (n4, o3) => {
          captureError(n4, { event: e3, ...o3 });
        };
      }));
      for (const n3 of Qe) {
        let i3 = n3.lazy ? lazyEventHandler(n3.handler) : n3.handler;
        if (n3.middleware || !n3.route) {
          const s3 = (e2.app.baseURL + (n3.route || "/")).replace(/\/+/g, "/");
          o2.use(s3, i3);
        } else {
          const e3 = getRouteRulesForPath(n3.route.replace(/:\w+|\*\*/g, "_"));
          e3.cache && (i3 = cachedEventHandler(i3, { group: "nitro/routes", ...e3.cache })), s2.use(n3.route, i3, n3.method);
        }
      }
      return o2.use(e2.app.baseURL, s2.handler), { hooks: n2, h3App: o2, router: s2, localCall: i2, localFetch, captureError };
    }();
    function useNitroApp() {
      return pt;
    }
    __name(useNitroApp, "useNitroApp");
    !function(e2) {
      for (const n2 of Je)
        try {
          n2(e2);
        } catch (n3) {
          throw e2.captureError(n3, { tags: ["plugin"] }), n3;
        }
    }(pt);
    const mt = {};
    function getDefaultExportFromCjs(e2) {
      return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
    }
    __name(getDefaultExportFromCjs, "getDefaultExportFromCjs");
    var gt = {}, yt = { exports: {} };
    function Mime$1() {
      this._types = /* @__PURE__ */ Object.create(null), this._extensions = /* @__PURE__ */ Object.create(null);
      for (let e2 = 0; e2 < arguments.length; e2++)
        this.define(arguments[e2]);
      this.define = this.define.bind(this), this.getType = this.getType.bind(this), this.getExtension = this.getExtension.bind(this);
    }
    __name(Mime$1, "Mime$1");
    Mime$1.prototype.define = function(e2, n2) {
      for (let o2 in e2) {
        let s2 = e2[o2].map(function(e3) {
          return e3.toLowerCase();
        });
        o2 = o2.toLowerCase();
        for (let e3 = 0; e3 < s2.length; e3++) {
          const i2 = s2[e3];
          if ("*" !== i2[0]) {
            if (!n2 && i2 in this._types)
              throw new Error('Attempt to change mapping for "' + i2 + '" extension from "' + this._types[i2] + '" to "' + o2 + '". Pass `force=true` to allow this, otherwise remove "' + i2 + '" from the list of extensions for "' + o2 + '".');
            this._types[i2] = o2;
          }
        }
        if (n2 || !this._extensions[o2]) {
          const e3 = s2[0];
          this._extensions[o2] = "*" !== e3[0] ? e3 : e3.substr(1);
        }
      }
    }, Mime$1.prototype.getType = function(e2) {
      let n2 = (e2 = String(e2)).replace(/^.*[/\\]/, "").toLowerCase(), o2 = n2.replace(/^.*\./, "").toLowerCase(), s2 = n2.length < e2.length;
      return (o2.length < n2.length - 1 || !s2) && this._types[o2] || null;
    }, Mime$1.prototype.getExtension = function(e2) {
      return (e2 = /^\s*([^;\s]*)/.test(e2) && RegExp.$1) && this._extensions[e2.toLowerCase()] || null;
    };
    var wt, bt = new Mime$1({ "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomdeleted+xml": ["atomdeleted"], "application/atomsvc+xml": ["atomsvc"], "application/atsc-dwd+xml": ["dwd"], "application/atsc-held+xml": ["held"], "application/atsc-rsat+xml": ["rsat"], "application/bdoc": ["bdoc"], "application/calendar+xml": ["xcs"], "application/ccxml+xml": ["ccxml"], "application/cdfx+xml": ["cdfx"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["es", "ecma"], "application/emma+xml": ["emma"], "application/emotionml+xml": ["emotionml"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/express": ["exp"], "application/fdt+xml": ["fdt"], "application/font-tdpfr": ["pfr"], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hjson": ["hjson"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/its+xml": ["its"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lgr+xml": ["lgr"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mmt-aei+xml": ["maei"], "application/mmt-usd+xml": ["musd"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/n-quads": ["nq"], "application/n-triples": ["nt"], "application/node": ["cjs"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/p2p-overlay+xml": ["relo"], "application/patch-ops-error+xml": ["xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/provenance+xml": ["provx"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf", "owl"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/route-apd+xml": ["rapd"], "application/route-s-tsid+xml": ["sls"], "application/route-usd+xml": ["rusd"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/senml+xml": ["senmlx"], "application/sensml+xml": ["sensmlx"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/sieve": ["siv", "sieve"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/swid+xml": ["swidtag"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/toml": ["toml"], "application/trig": ["trig"], "application/ttml+xml": ["ttml"], "application/ubjson": ["ubj"], "application/urc-ressheet+xml": ["rsheet"], "application/urc-targetdesc+xml": ["td"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/xaml+xml": ["xaml"], "application/xcap-att+xml": ["xav"], "application/xcap-caps+xml": ["xca"], "application/xcap-diff+xml": ["xdf"], "application/xcap-el+xml": ["xel"], "application/xcap-ns+xml": ["xns"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xliff+xml": ["xlf"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["*xsl", "xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": ["*3gpp"], "audio/adpcm": ["adp"], "audio/amr": ["amr"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mobile-xmf": ["mxmf"], "audio/mp3": ["*mp3"], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx", "opus"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/wav": ["wav"], "audio/wave": ["*wav"], "audio/webm": ["weba"], "audio/xm": ["xm"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/aces": ["exr"], "image/apng": ["apng"], "image/avif": ["avif"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/dicom-rle": ["drle"], "image/emf": ["emf"], "image/fits": ["fits"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/heic": ["heic"], "image/heic-sequence": ["heics"], "image/heif": ["heif"], "image/heif-sequence": ["heifs"], "image/hej2k": ["hej2"], "image/hsj2": ["hsj2"], "image/ief": ["ief"], "image/jls": ["jls"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jph": ["jph"], "image/jphc": ["jhc"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/jxr": ["jxr"], "image/jxra": ["jxra"], "image/jxrs": ["jxrs"], "image/jxs": ["jxs"], "image/jxsc": ["jxsc"], "image/jxsi": ["jxsi"], "image/jxss": ["jxss"], "image/ktx": ["ktx"], "image/ktx2": ["ktx2"], "image/png": ["png"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/t38": ["t38"], "image/tiff": ["tif", "tiff"], "image/tiff-fx": ["tfx"], "image/webp": ["webp"], "image/wmf": ["wmf"], "message/disposition-notification": ["disposition-notification"], "message/global": ["u8msg"], "message/global-delivery-status": ["u8dsn"], "message/global-disposition-notification": ["u8mdn"], "message/global-headers": ["u8hdr"], "message/rfc822": ["eml", "mime"], "model/3mf": ["3mf"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/mtl": ["mtl"], "model/obj": ["obj"], "model/step+xml": ["stpx"], "model/step+zip": ["stpz"], "model/step-xml+zip": ["stpxz"], "model/stl": ["stl"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["*x3db", "x3dbz"], "model/x3d+fastinfoset": ["x3db"], "model/x3d+vrml": ["*x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "model/x3d-vrml": ["x3dv"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/mdx": ["mdx"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/richtext": ["rtx"], "text/rtf": ["*rtf"], "text/sgml": ["sgml", "sgm"], "text/shex": ["shex"], "text/slim": ["slim", "slm"], "text/spdx": ["spdx"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vtt": ["vtt"], "text/xml": ["*xml"], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/iso.segment": ["m4s"], "video/jpeg": ["jpgv"], "video/jpm": ["*jpm", "jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/webm": ["webm"] }), vt = yt.exports;
    Object.defineProperty(vt, "__esModule", { value: true });
    const _t = { ...((wt = bt) && wt.__esModule ? wt : { default: wt }).default };
    _t.lookup = _t.getType, _t.extension = _t.getExtension;
    const noop = /* @__PURE__ */ __name(() => {
    }, "noop");
    _t.define = noop, _t.load = noop, _t.default_type = "application/octet-stream", _t.charsets = { lookup: () => "UTF-8" }, yt.exports = _t;
    var xt = yt.exports, Et = {};
    Object.defineProperty(Et, "__esModule", { value: true }), Et.InternalError = Et.NotFoundError = Et.MethodNotAllowedError = Et.KVError = void 0;
    class KVError extends Error {
      constructor(e2, n2 = 500) {
        super(e2), Object.setPrototypeOf(this, new.target.prototype), this.name = KVError.name, this.status = n2;
      }
      status;
    }
    __name(KVError, "KVError");
    Et.KVError = KVError;
    Et.MethodNotAllowedError = class extends KVError {
      constructor(e2 = "Not a valid request method", n2 = 405) {
        super(e2, n2);
      }
    };
    Et.NotFoundError = class extends KVError {
      constructor(e2 = "Not Found", n2 = 404) {
        super(e2, n2);
      }
    };
    Et.InternalError = class extends KVError {
      constructor(e2 = "Internal Error in KV Asset Handler", n2 = 500) {
        super(e2, n2);
      }
    }, function(e2) {
      var n2 = gt && gt.__createBinding || (Object.create ? function(e3, n3, o3, s3) {
        void 0 === s3 && (s3 = o3);
        var i3 = Object.getOwnPropertyDescriptor(n3, o3);
        i3 && !("get" in i3 ? !n3.__esModule : i3.writable || i3.configurable) || (i3 = { enumerable: true, get: function() {
          return n3[o3];
        } }), Object.defineProperty(e3, s3, i3);
      } : function(e3, n3, o3, s3) {
        void 0 === s3 && (s3 = o3), e3[s3] = n3[o3];
      }), o2 = gt && gt.__setModuleDefault || (Object.create ? function(e3, n3) {
        Object.defineProperty(e3, "default", { enumerable: true, value: n3 });
      } : function(e3, n3) {
        e3.default = n3;
      }), s2 = gt && gt.__importStar || function(e3) {
        if (e3 && e3.__esModule)
          return e3;
        var s3 = {};
        if (null != e3)
          for (var i3 in e3)
            "default" !== i3 && Object.prototype.hasOwnProperty.call(e3, i3) && n2(s3, e3, i3);
        return o2(s3, e3), s3;
      };
      Object.defineProperty(e2, "__esModule", { value: true }), e2.InternalError = e2.NotFoundError = e2.MethodNotAllowedError = e2.serveSinglePageApp = e2.mapRequestToAsset = e2.getAssetFromKV = void 0;
      const i2 = s2(xt), a2 = Et;
      Object.defineProperty(e2, "InternalError", { enumerable: true, get: function() {
        return a2.InternalError;
      } }), Object.defineProperty(e2, "MethodNotAllowedError", { enumerable: true, get: function() {
        return a2.MethodNotAllowedError;
      } }), Object.defineProperty(e2, "NotFoundError", { enumerable: true, get: function() {
        return a2.NotFoundError;
      } });
      const c2 = { browserTTL: null, edgeTTL: 172800, bypassCache: false }, parseStringAsObject = /* @__PURE__ */ __name((e3) => "string" == typeof e3 ? JSON.parse(e3) : e3, "parseStringAsObject"), u2 = { ASSET_NAMESPACE: "undefined" != typeof __STATIC_CONTENT ? __STATIC_CONTENT : void 0, ASSET_MANIFEST: "undefined" != typeof __STATIC_CONTENT_MANIFEST ? parseStringAsObject(__STATIC_CONTENT_MANIFEST) : {}, cacheControl: c2, defaultMimeType: "text/plain", defaultDocument: "index.html", pathIsEncoded: false, defaultETag: "strong" };
      function assignOptions(e3) {
        return Object.assign({}, u2, e3);
      }
      __name(assignOptions, "assignOptions");
      const mapRequestToAsset = /* @__PURE__ */ __name((e3, n3) => {
        n3 = assignOptions(n3);
        const o3 = new URL(e3.url);
        let s3 = o3.pathname;
        return s3.endsWith("/") ? s3 = s3.concat(n3.defaultDocument) : i2.getType(s3) || (s3 = s3.concat("/" + n3.defaultDocument)), o3.pathname = s3, new Request(o3.toString(), e3);
      }, "mapRequestToAsset");
      e2.mapRequestToAsset = mapRequestToAsset, e2.serveSinglePageApp = function(e3, n3) {
        n3 = assignOptions(n3), e3 = mapRequestToAsset(e3, n3);
        const o3 = new URL(e3.url);
        return o3.pathname.endsWith(".html") ? new Request(`${o3.origin}/${n3.defaultDocument}`, e3) : e3;
      };
      e2.getAssetFromKV = async (e3, n3) => {
        n3 = assignOptions(n3);
        const o3 = e3.request, s3 = n3.ASSET_NAMESPACE, u3 = parseStringAsObject(n3.ASSET_MANIFEST);
        if (void 0 === s3)
          throw new a2.InternalError("there is no KV namespace bound to the script");
        const f2 = new URL(o3.url).pathname.replace(/^\/+/, "");
        let p2, g2 = n3.pathIsEncoded;
        if (n3.mapRequestToAsset)
          p2 = n3.mapRequestToAsset(o3);
        else if (u3[f2])
          p2 = o3;
        else if (u3[decodeURIComponent(f2)])
          g2 = true, p2 = o3;
        else {
          const e4 = mapRequestToAsset(o3), s4 = new URL(e4.url).pathname.replace(/^\/+/, "");
          u3[decodeURIComponent(s4)] ? (g2 = true, p2 = e4) : p2 = mapRequestToAsset(o3, n3);
        }
        if (!["GET", "HEAD"].includes(p2.method))
          throw new a2.MethodNotAllowedError(`${p2.method} is not a valid request method`);
        const w2 = new URL(p2.url);
        let b2 = (g2 ? decodeURIComponent(w2.pathname) : w2.pathname).replace(/^\/+/, "");
        const v2 = caches.default;
        let _2 = i2.getType(b2) || n3.defaultMimeType;
        (_2.startsWith("text") || "application/javascript" === _2) && (_2 += "; charset=utf-8");
        let x2 = false;
        void 0 !== u3 && u3[b2] && (b2 = u3[b2], x2 = true);
        const B2 = new Request(`${w2.origin}/${b2}`, o3), k2 = (() => {
          switch (typeof n3.cacheControl) {
            case "function":
              return n3.cacheControl(o3);
            case "object":
              return n3.cacheControl;
            default:
              return c2;
          }
        })(), formatETag = /* @__PURE__ */ __name((e4 = b2, o4 = n3.defaultETag) => {
          if (!e4)
            return "";
          switch (o4) {
            case "weak":
              return e4.startsWith("W/") ? e4 : e4.startsWith('"') && e4.endsWith('"') ? `W/${e4}` : `W/"${e4}"`;
            case "strong":
              return e4.startsWith('W/"') && (e4 = e4.replace("W/", "")), e4.endsWith('"') || (e4 = `"${e4}"`), e4;
            default:
              return "";
          }
        }, "formatETag");
        n3.cacheControl = Object.assign({}, c2, k2), (n3.cacheControl.bypassCache || null === n3.cacheControl.edgeTTL || "HEAD" == o3.method) && (x2 = false);
        const I2 = "number" == typeof n3.cacheControl.browserTTL;
        let A2 = null;
        if (x2 && (A2 = await v2.match(B2)), A2)
          if (A2.status > 300 && A2.status < 400)
            A2.body && "cancel" in Object.getPrototypeOf(A2.body) && A2.body.cancel(), A2 = new Response(null, A2);
          else {
            const e4 = { headers: new Headers(A2.headers), status: 0, statusText: "" };
            e4.headers.set("cf-cache-status", "HIT"), A2.status ? (e4.status = A2.status, e4.statusText = A2.statusText) : e4.headers.has("Content-Range") ? (e4.status = 206, e4.statusText = "Partial Content") : (e4.status = 200, e4.statusText = "OK"), A2 = new Response(A2.body, e4);
          }
        else {
          const o4 = await s3.get(b2, "arrayBuffer");
          if (null === o4)
            throw new a2.NotFoundError(`could not find ${b2} in your content namespace`);
          A2 = new Response(o4), x2 && (A2.headers.set("Accept-Ranges", "bytes"), A2.headers.set("Content-Length", String(o4.byteLength)), A2.headers.has("etag") || A2.headers.set("etag", formatETag(b2)), A2.headers.set("Cache-Control", `max-age=${n3.cacheControl.edgeTTL}`), e3.waitUntil(v2.put(B2, A2.clone())), A2.headers.set("CF-Cache-Status", "MISS"));
        }
        if (A2.headers.set("Content-Type", _2), 304 === A2.status) {
          const e4 = formatETag(A2.headers.get("etag")), n4 = B2.headers.get("if-none-match"), o4 = A2.headers.get("CF-Cache-Status");
          e4 && (n4 && n4 === e4 && "MISS" === o4 ? A2.headers.set("CF-Cache-Status", "EXPIRED") : A2.headers.set("CF-Cache-Status", "REVALIDATED"), A2.headers.set("etag", formatETag(e4, "weak")));
        }
        return I2 ? A2.headers.set("Cache-Control", `max-age=${n3.cacheControl.browserTTL}`) : A2.headers.delete("Cache-Control"), A2;
      };
    }(gt), addEventListener("fetch", (e2) => {
      e2.respondWith(async function(e3) {
        try {
          return await gt.getAssetFromKV(e3, { cacheControl: assetsCacheControl, mapRequestToAsset: baseURLModifier });
        } catch {
        }
        const n2 = new URL(e3.request.url);
        let o2;
        s2 = e3.request, Ve.test(s2.method) && (o2 = g.from(await e3.request.arrayBuffer()));
        var s2;
        return Bt.localFetch(n2.pathname + n2.search, { context: { cf: e3.request.cf, waitUntil: (n3) => e3.waitUntil(n3), cloudflare: { event: e3 } }, host: n2.hostname, protocol: n2.protocol, headers: e3.request.headers, method: e3.request.method, redirect: e3.request.redirect, body: o2 });
      }(e2));
    });
    const Bt = useNitroApp();
    function assetsCacheControl(e2) {
      const n2 = function(e3 = "") {
        for (const n3 in mt)
          if (e3.startsWith(n3))
            return mt[n3];
        return {};
      }(new URL(e2.url).pathname);
      return n2.maxAge ? { browserTTL: n2.maxAge, edgeTTL: n2.maxAge } : {};
    }
    __name(assetsCacheControl, "assetsCacheControl");
    const baseURLModifier = /* @__PURE__ */ __name((e2) => {
      const n2 = withoutBase(e2.url, useRuntimeConfig().app.baseURL);
      return gt.mapRequestToAsset(new Request(n2, e2));
    }, "baseURLModifier"), $t = defineEventHandler((e2) => "Welcome to the satooru.me!!"), kt = Object.freeze(Object.defineProperty({ __proto__: null, default: $t }, Symbol.toStringTag, { value: "Module" }));
    var It = { exports: {} };
    It.exports = function() {
      var e2 = 1e3, n2 = 6e4, o2 = 36e5, s2 = "millisecond", i2 = "second", a2 = "minute", c2 = "hour", u2 = "day", f2 = "week", p2 = "month", g2 = "quarter", w2 = "year", b2 = "date", v2 = "Invalid Date", _2 = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, x2 = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, B2 = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(e3) {
        var n3 = ["th", "st", "nd", "rd"], o3 = e3 % 100;
        return "[" + e3 + (n3[(o3 - 20) % 10] || n3[o3] || n3[0]) + "]";
      } }, m = /* @__PURE__ */ __name(function(e3, n3, o3) {
        var s3 = String(e3);
        return !s3 || s3.length >= n3 ? e3 : "" + Array(n3 + 1 - s3.length).join(o3) + e3;
      }, "m"), k2 = { s: m, z: function(e3) {
        var n3 = -e3.utcOffset(), o3 = Math.abs(n3), s3 = Math.floor(o3 / 60), i3 = o3 % 60;
        return (n3 <= 0 ? "+" : "-") + m(s3, 2, "0") + ":" + m(i3, 2, "0");
      }, m: /* @__PURE__ */ __name(function t(e3, n3) {
        if (e3.date() < n3.date())
          return -t(n3, e3);
        var o3 = 12 * (n3.year() - e3.year()) + (n3.month() - e3.month()), s3 = e3.clone().add(o3, p2), i3 = n3 - s3 < 0, a3 = e3.clone().add(o3 + (i3 ? -1 : 1), p2);
        return +(-(o3 + (n3 - s3) / (i3 ? s3 - a3 : a3 - s3)) || 0);
      }, "t"), a: function(e3) {
        return e3 < 0 ? Math.ceil(e3) || 0 : Math.floor(e3);
      }, p: function(e3) {
        return { M: p2, y: w2, w: f2, d: u2, D: b2, h: c2, m: a2, s: i2, ms: s2, Q: g2 }[e3] || String(e3 || "").toLowerCase().replace(/s$/, "");
      }, u: function(e3) {
        return void 0 === e3;
      } }, I2 = "en", A2 = {};
      A2[I2] = B2;
      var R2 = "$isDayjsObject", S = /* @__PURE__ */ __name(function(e3) {
        return e3 instanceof j2 || !(!e3 || !e3[R2]);
      }, "S"), T2 = /* @__PURE__ */ __name(function t(e3, n3, o3) {
        var s3;
        if (!e3)
          return I2;
        if ("string" == typeof e3) {
          var i3 = e3.toLowerCase();
          A2[i3] && (s3 = i3), n3 && (A2[i3] = n3, s3 = i3);
          var a3 = e3.split("-");
          if (!s3 && a3.length > 1)
            return t(a3[0]);
        } else {
          var c3 = e3.name;
          A2[c3] = e3, s3 = c3;
        }
        return !o3 && s3 && (I2 = s3), s3 || !o3 && I2;
      }, "t"), O = /* @__PURE__ */ __name(function(e3, n3) {
        if (S(e3))
          return e3.clone();
        var o3 = "object" == typeof n3 ? n3 : {};
        return o3.date = e3, o3.args = arguments, new j2(o3);
      }, "O"), C2 = k2;
      C2.l = T2, C2.i = S, C2.w = function(e3, n3) {
        return O(e3, { locale: n3.$L, utc: n3.$u, x: n3.$x, $offset: n3.$offset });
      };
      var j2 = function() {
        function M(e3) {
          this.$L = T2(e3.locale, null, true), this.parse(e3), this.$x = this.$x || e3.x || {}, this[R2] = true;
        }
        __name(M, "M");
        var B3 = M.prototype;
        return B3.parse = function(e3) {
          this.$d = function(e4) {
            var n3 = e4.date, o3 = e4.utc;
            if (null === n3)
              return /* @__PURE__ */ new Date(NaN);
            if (C2.u(n3))
              return /* @__PURE__ */ new Date();
            if (n3 instanceof Date)
              return new Date(n3);
            if ("string" == typeof n3 && !/Z$/i.test(n3)) {
              var s3 = n3.match(_2);
              if (s3) {
                var i3 = s3[2] - 1 || 0, a3 = (s3[7] || "0").substring(0, 3);
                return o3 ? new Date(Date.UTC(s3[1], i3, s3[3] || 1, s3[4] || 0, s3[5] || 0, s3[6] || 0, a3)) : new Date(s3[1], i3, s3[3] || 1, s3[4] || 0, s3[5] || 0, s3[6] || 0, a3);
              }
            }
            return new Date(n3);
          }(e3), this.init();
        }, B3.init = function() {
          var e3 = this.$d;
          this.$y = e3.getFullYear(), this.$M = e3.getMonth(), this.$D = e3.getDate(), this.$W = e3.getDay(), this.$H = e3.getHours(), this.$m = e3.getMinutes(), this.$s = e3.getSeconds(), this.$ms = e3.getMilliseconds();
        }, B3.$utils = function() {
          return C2;
        }, B3.isValid = function() {
          return !(this.$d.toString() === v2);
        }, B3.isSame = function(e3, n3) {
          var o3 = O(e3);
          return this.startOf(n3) <= o3 && o3 <= this.endOf(n3);
        }, B3.isAfter = function(e3, n3) {
          return O(e3) < this.startOf(n3);
        }, B3.isBefore = function(e3, n3) {
          return this.endOf(n3) < O(e3);
        }, B3.$g = function(e3, n3, o3) {
          return C2.u(e3) ? this[n3] : this.set(o3, e3);
        }, B3.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, B3.valueOf = function() {
          return this.$d.getTime();
        }, B3.startOf = function(e3, n3) {
          var o3 = this, s3 = !!C2.u(n3) || n3, g3 = C2.p(e3), l = /* @__PURE__ */ __name(function(e4, n4) {
            var i3 = C2.w(o3.$u ? Date.UTC(o3.$y, n4, e4) : new Date(o3.$y, n4, e4), o3);
            return s3 ? i3 : i3.endOf(u2);
          }, "l"), $ = /* @__PURE__ */ __name(function(e4, n4) {
            return C2.w(o3.toDate()[e4].apply(o3.toDate("s"), (s3 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(n4)), o3);
          }, "$"), v3 = this.$W, _3 = this.$M, x3 = this.$D, B4 = "set" + (this.$u ? "UTC" : "");
          switch (g3) {
            case w2:
              return s3 ? l(1, 0) : l(31, 11);
            case p2:
              return s3 ? l(1, _3) : l(0, _3 + 1);
            case f2:
              var k3 = this.$locale().weekStart || 0, I3 = (v3 < k3 ? v3 + 7 : v3) - k3;
              return l(s3 ? x3 - I3 : x3 + (6 - I3), _3);
            case u2:
            case b2:
              return $(B4 + "Hours", 0);
            case c2:
              return $(B4 + "Minutes", 1);
            case a2:
              return $(B4 + "Seconds", 2);
            case i2:
              return $(B4 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, B3.endOf = function(e3) {
          return this.startOf(e3, false);
        }, B3.$set = function(e3, n3) {
          var o3, f3 = C2.p(e3), g3 = "set" + (this.$u ? "UTC" : ""), v3 = (o3 = {}, o3[u2] = g3 + "Date", o3[b2] = g3 + "Date", o3[p2] = g3 + "Month", o3[w2] = g3 + "FullYear", o3[c2] = g3 + "Hours", o3[a2] = g3 + "Minutes", o3[i2] = g3 + "Seconds", o3[s2] = g3 + "Milliseconds", o3)[f3], _3 = f3 === u2 ? this.$D + (n3 - this.$W) : n3;
          if (f3 === p2 || f3 === w2) {
            var x3 = this.clone().set(b2, 1);
            x3.$d[v3](_3), x3.init(), this.$d = x3.set(b2, Math.min(this.$D, x3.daysInMonth())).$d;
          } else
            v3 && this.$d[v3](_3);
          return this.init(), this;
        }, B3.set = function(e3, n3) {
          return this.clone().$set(e3, n3);
        }, B3.get = function(e3) {
          return this[C2.p(e3)]();
        }, B3.add = function(s3, g3) {
          var b3, v3 = this;
          s3 = Number(s3);
          var _3 = C2.p(g3), y = /* @__PURE__ */ __name(function(e3) {
            var n3 = O(v3);
            return C2.w(n3.date(n3.date() + Math.round(e3 * s3)), v3);
          }, "y");
          if (_3 === p2)
            return this.set(p2, this.$M + s3);
          if (_3 === w2)
            return this.set(w2, this.$y + s3);
          if (_3 === u2)
            return y(1);
          if (_3 === f2)
            return y(7);
          var x3 = (b3 = {}, b3[a2] = n2, b3[c2] = o2, b3[i2] = e2, b3)[_3] || 1, B4 = this.$d.getTime() + s3 * x3;
          return C2.w(B4, this);
        }, B3.subtract = function(e3, n3) {
          return this.add(-1 * e3, n3);
        }, B3.format = function(e3) {
          var n3 = this, o3 = this.$locale();
          if (!this.isValid())
            return o3.invalidDate || v2;
          var s3 = e3 || "YYYY-MM-DDTHH:mm:ssZ", i3 = C2.z(this), a3 = this.$H, c3 = this.$m, u3 = this.$M, f3 = o3.weekdays, p3 = o3.months, g3 = o3.meridiem, h = /* @__PURE__ */ __name(function(e4, o4, i4, a4) {
            return e4 && (e4[o4] || e4(n3, s3)) || i4[o4].slice(0, a4);
          }, "h"), d = /* @__PURE__ */ __name(function(e4) {
            return C2.s(a3 % 12 || 12, e4, "0");
          }, "d"), w3 = g3 || function(e4, n4, o4) {
            var s4 = e4 < 12 ? "AM" : "PM";
            return o4 ? s4.toLowerCase() : s4;
          };
          return s3.replace(x2, function(e4, s4) {
            return s4 || function(e5) {
              switch (e5) {
                case "YY":
                  return String(n3.$y).slice(-2);
                case "YYYY":
                  return C2.s(n3.$y, 4, "0");
                case "M":
                  return u3 + 1;
                case "MM":
                  return C2.s(u3 + 1, 2, "0");
                case "MMM":
                  return h(o3.monthsShort, u3, p3, 3);
                case "MMMM":
                  return h(p3, u3);
                case "D":
                  return n3.$D;
                case "DD":
                  return C2.s(n3.$D, 2, "0");
                case "d":
                  return String(n3.$W);
                case "dd":
                  return h(o3.weekdaysMin, n3.$W, f3, 2);
                case "ddd":
                  return h(o3.weekdaysShort, n3.$W, f3, 3);
                case "dddd":
                  return f3[n3.$W];
                case "H":
                  return String(a3);
                case "HH":
                  return C2.s(a3, 2, "0");
                case "h":
                  return d(1);
                case "hh":
                  return d(2);
                case "a":
                  return w3(a3, c3, true);
                case "A":
                  return w3(a3, c3, false);
                case "m":
                  return String(c3);
                case "mm":
                  return C2.s(c3, 2, "0");
                case "s":
                  return String(n3.$s);
                case "ss":
                  return C2.s(n3.$s, 2, "0");
                case "SSS":
                  return C2.s(n3.$ms, 3, "0");
                case "Z":
                  return i3;
              }
              return null;
            }(e4) || i3.replace(":", "");
          });
        }, B3.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, B3.diff = function(s3, b3, v3) {
          var _3, x3 = this, B4 = C2.p(b3), k3 = O(s3), I3 = (k3.utcOffset() - this.utcOffset()) * n2, A3 = this - k3, D = /* @__PURE__ */ __name(function() {
            return C2.m(x3, k3);
          }, "D");
          switch (B4) {
            case w2:
              _3 = D() / 12;
              break;
            case p2:
              _3 = D();
              break;
            case g2:
              _3 = D() / 3;
              break;
            case f2:
              _3 = (A3 - I3) / 6048e5;
              break;
            case u2:
              _3 = (A3 - I3) / 864e5;
              break;
            case c2:
              _3 = A3 / o2;
              break;
            case a2:
              _3 = A3 / n2;
              break;
            case i2:
              _3 = A3 / e2;
              break;
            default:
              _3 = A3;
          }
          return v3 ? _3 : C2.a(_3);
        }, B3.daysInMonth = function() {
          return this.endOf(p2).$D;
        }, B3.$locale = function() {
          return A2[this.$L];
        }, B3.locale = function(e3, n3) {
          if (!e3)
            return this.$L;
          var o3 = this.clone(), s3 = T2(e3, n3, true);
          return s3 && (o3.$L = s3), o3;
        }, B3.clone = function() {
          return C2.w(this.$d, this);
        }, B3.toDate = function() {
          return new Date(this.valueOf());
        }, B3.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, B3.toISOString = function() {
          return this.$d.toISOString();
        }, B3.toString = function() {
          return this.$d.toUTCString();
        }, M;
      }(), N2 = j2.prototype;
      return O.prototype = N2, [["$ms", s2], ["$s", i2], ["$m", a2], ["$H", c2], ["$W", u2], ["$M", p2], ["$y", w2], ["$D", b2]].forEach(function(e3) {
        N2[e3[1]] = function(n3) {
          return this.$g(n3, e3[0], e3[1]);
        };
      }), O.extend = function(e3, n3) {
        return e3.$i || (e3(n3, j2, O), e3.$i = true), O;
      }, O.locale = T2, O.isDayjs = S, O.unix = function(e3) {
        return O(1e3 * e3);
      }, O.en = A2[I2], O.Ls = A2, O.p = {}, O;
    }();
    const At = getDefaultExportFromCjs(It.exports), Rt = ["WatchEvent"], Tt = "projects", St = defineEventHandler(async () => {
      const e2 = await CACHE_KV.get(Tt);
      if (e2)
        return JSON.parse(e2);
      const n2 = (await Le("https://api.github.com/users/SatooRu65536/events", { parseResponse: JSON.parse }).catch(() => [])).filter((e3) => !Rt.includes(e3.type) && At(e3.created_at).isAfter(At().subtract(2, "week"))).map((e3) => e3.repo.url), o2 = Array.from(new Set(n2)), s2 = (await Promise.all(o2.map((e3) => Le(e3, { parseResponse: JSON.parse }).then((e4) => {
        const n3 = e4.topics.map((e5) => e5.toLowerCase()), { name: o3 } = e4;
        return { name: o3, summary: e4.description, tags: n3, repository: e4.html_url, site: e4.homepage, updatedAt: e4.pushed_at };
      }).catch(() => {
      })))).filter((e3) => void 0 !== e3);
      return CACHE_KV.put(Tt, JSON.stringify(s2), { expirationTtl: 3600 }), s2;
    }), Ct = Object.freeze(Object.defineProperty({ __proto__: null, default: St }, Symbol.toStringTag, { value: "Module" }));
  }();
})();
//# sourceMappingURL=index.js.map
