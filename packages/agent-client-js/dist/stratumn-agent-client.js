(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.AgentClient = global.AgentClient || {})));
}(this, (function (exports) { 'use strict';

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function deprecated(oldFunc, newFunc) {
  if (!newFunc) {
    console.warn("WARNING: " + oldFunc + " is deprecated.");
  } else {
    console.warn("WARNING: " + oldFunc + " is deprecated. Please use " + newFunc + " instead.");
  }
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/**
 * Makes a query string.
 * @param {object} obj - an object of keys
 * @returns {string} a query string
 */
function makeQueryString(obj) {
  var parts = Object.keys(obj).reduce(function (curr, key) {
    var val = Array.isArray(obj[key]) ? obj[key].join('+') : obj[key];
    curr.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    return curr;
  }, []);

  if (parts.length) {
    return '?' + parts.join('&');
  }

  return '';
}

function interopDefault(ex) {
	return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var jsonrequest = createCommonjsModule(function (module) {
'use strict';

module.exports = {
  processRequest: function(req) {
    var
      contentType = req.header('Content-Type'),
      hasJsonContentType = contentType &&
                           contentType.indexOf('application/json') !== -1;

    if (contentType != null && !hasJsonContentType) {
      return;
    }

    if (req.body) {
      if (!contentType) {
        req.header('Content-Type', 'application/json');
      }

      req.body = JSON.stringify(req.body);
    }
  }
};
});

var jsonrequest$1 = interopDefault(jsonrequest);
var processRequest$1 = jsonrequest.processRequest;

var require$$1 = Object.freeze({
  default: jsonrequest$1,
  processRequest: processRequest$1
});

var jsonresponse = createCommonjsModule(function (module) {
'use strict';

module.exports = {
  processRequest: function(req) {
    var accept = req.header('Accept');
    if (accept == null) {
      req.header('Accept', 'application/json');
    }
  },
  processResponse: function(res) {
    // Check to see if the contentype is "something/json" or
    // "something/somethingelse+json"
    if (res.contentType && /^.*\/(?:.*\+)?json(;|$)/i.test(res.contentType)) {
      var raw = typeof res.body === 'string' ? res.body : res.text;
      if (raw) {
        res.body = JSON.parse(raw);
      }
    }
  }
};
});

var jsonresponse$1 = interopDefault(jsonresponse);
var processRequest$2 = jsonresponse.processRequest;
var processResponse$1 = jsonresponse.processResponse;

var require$$0 = Object.freeze({
  default: jsonresponse$1,
  processRequest: processRequest$2,
  processResponse: processResponse$1
});

var json = createCommonjsModule(function (module) {
'use strict';

var jsonrequest = interopDefault(require$$1),
    jsonresponse = interopDefault(require$$0);

module.exports = {
  processRequest: function(req) {
    jsonrequest.processRequest.call(this, req);
    jsonresponse.processRequest.call(this, req);
  },
  processResponse: function(res) {
    jsonresponse.processResponse.call(this, res);
  }
};
});

var json$1 = interopDefault(json);

var cleanurl = createCommonjsModule(function (module) {
'use strict';

module.exports = {
  processRequest: function(req) {
    req.url = req.url.replace(/[^%]+/g, function(s) {
      return encodeURI(s);
    });
  }
};
});

var cleanurl$1 = interopDefault(cleanurl);
var processRequest$3 = cleanurl.processRequest;

var require$$7 = Object.freeze({
  default: cleanurl$1,
  processRequest: processRequest$3
});

var xhrBrowser = createCommonjsModule(function (module) {
module.exports = window.XMLHttpRequest;
});

var xhrBrowser$1 = interopDefault(xhrBrowser);


var require$$6 = Object.freeze({
	default: xhrBrowser$1
});

var delay = createCommonjsModule(function (module) {
'use strict';

// Wrap a function in a `setTimeout` call. This is used to guarantee async
// behavior, which can avoid unexpected errors.

module.exports = function(fn) {
  return function() {
    var
      args = Array.prototype.slice.call(arguments, 0),
      newFunc = function() {
        return fn.apply(null, args);
      };
    setTimeout(newFunc, 0);
  };
};
});

var delay$1 = interopDefault(delay);


var require$$5 = Object.freeze({
  default: delay$1
});

var request$1 = createCommonjsModule(function (module) {
'use strict';

function Request(optsOrUrl) {
  var opts = typeof optsOrUrl === 'string' ? {url: optsOrUrl} : optsOrUrl || {};
  this.method = opts.method ? opts.method.toUpperCase() : 'GET';
  this.url = opts.url;
  this.headers = opts.headers || {};
  this.body = opts.body;
  this.timeout = opts.timeout || 0;
  this.errorOn404 = opts.errorOn404 != null ? opts.errorOn404 : true;
  this.onload = opts.onload;
  this.onerror = opts.onerror;
}

Request.prototype.abort = function() {
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  return this;
};

Request.prototype.header = function(name, value) {
  var k;
  for (k in this.headers) {
    if (this.headers.hasOwnProperty(k)) {
      if (name.toLowerCase() === k.toLowerCase()) {
        if (arguments.length === 1) {
          return this.headers[k];
        }

        delete this.headers[k];
        break;
      }
    }
  }
  if (value != null) {
    this.headers[name] = value;
    return value;
  }
};


module.exports = Request;
});

var request$2 = interopDefault(request$1);


var require$$1$1 = Object.freeze({
  default: request$2
});

var index$1 = createCommonjsModule(function (module) {
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}
});

var index$2 = interopDefault(index$1);


var require$$0$2 = Object.freeze({
    default: index$2
});

var extractResponseProps = createCommonjsModule(function (module) {
'use strict';

var extend = interopDefault(require$$0$2);

module.exports = function(req) {
  var xhr = req.xhr;
  var props = {request: req, xhr: xhr};

  // Try to create the response from the request. If the request was aborted,
  // accesssing properties of the XHR may throw an error, so we wrap in a
  // try/catch.
  try {
    var lines, i, m, headers = {};
    if (xhr.getAllResponseHeaders) {
      lines = xhr.getAllResponseHeaders().split('\n');
      for (i = 0; i < lines.length; i++) {
        if ((m = lines[i].match(/\s*([^\s]+):\s+([^\s]+)/))) {
          headers[m[1]] = m[2];
        }
      }
    }

    props = extend(props, {
      status: xhr.status,
      contentType: xhr.contentType || (xhr.getResponseHeader && xhr.getResponseHeader('Content-Type')),
      headers: headers,
      text: xhr.responseText,
      body: xhr.response || xhr.responseText
    });
  } catch (err) {}

  return props;
};
});

var extractResponseProps$1 = interopDefault(extractResponseProps);


var require$$0$1 = Object.freeze({
  default: extractResponseProps$1
});

var response = createCommonjsModule(function (module) {
'use strict';

var Request = interopDefault(require$$1$1);
var extractResponseProps = interopDefault(require$$0$1);

function Response(props) {
  this.request = props.request;
  this.xhr = props.xhr;
  this.headers = props.headers || {};
  this.status = props.status || 0;
  this.text = props.text;
  this.body = props.body;
  this.contentType = props.contentType;
  this.isHttpError = props.status >= 400;
}

Response.prototype.header = Request.prototype.header;

Response.fromRequest = function(req) {
  return new Response(extractResponseProps(req));
};


module.exports = Response;
});

var response$1 = interopDefault(response);


var require$$2 = Object.freeze({
  default: response$1
});

var error = createCommonjsModule(function (module) {
'use strict';

var Response = interopDefault(require$$2);
var extractResponseProps = interopDefault(require$$0$1);
var extend = interopDefault(require$$0$2);

function RequestError(message, props) {
  var err = new Error(message);
  err.name = 'RequestError';
  this.name = err.name;
  this.message = err.message;
  if (err.stack) {
    this.stack = err.stack;
  }

  this.toString = function() {
    return this.message;
  };

  for (var k in props) {
    if (props.hasOwnProperty(k)) {
      this[k] = props[k];
    }
  }
}

RequestError.prototype = extend(Error.prototype);
RequestError.prototype.constructor = RequestError;

RequestError.create = function(message, req, props) {
  var err = new RequestError(message, props);
  Response.call(err, extractResponseProps(req));
  return err;
};

module.exports = RequestError;
});

var error$1 = interopDefault(error);


var require$$4 = Object.freeze({
  default: error$1
});

var once = createCommonjsModule(function (module) {
'use strict';

// A "once" utility.
module.exports = function(fn) {
  var result, called = false;
  return function() {
    if (!called) {
      called = true;
      result = fn.apply(this, arguments);
    }
    return result;
  };
};
});

var once$1 = interopDefault(once);


var require$$0$3 = Object.freeze({
  default: once$1
});

var index = createCommonjsModule(function (module) {
'use strict';

var
  cleanURL = interopDefault(require$$7),
  XHR = interopDefault(require$$6),
  delay = interopDefault(require$$5),
  RequestError = interopDefault(require$$4),
  Response = interopDefault(require$$2),
  Request = interopDefault(require$$1$1),
  extend = interopDefault(require$$0$2),
  once = interopDefault(require$$0$3);

var i,
    createError = RequestError.create;

function factory(defaults, plugins) {
  defaults = defaults || {};
  plugins = plugins || [];

  function http(req, cb) {
    var xhr, plugin, done, k, timeoutId, supportsLoadAndErrorEvents;

    req = new Request(extend(defaults, req));

    for (i = 0; i < plugins.length; i++) {
      plugin = plugins[i];
      if (plugin.processRequest) {
        plugin.processRequest(req);
      }
    }

    // Give the plugins a chance to create the XHR object
    for (i = 0; i < plugins.length; i++) {
      plugin = plugins[i];
      if (plugin.createXHR) {
        xhr = plugin.createXHR(req);
        break; // First come, first serve
      }
    }
    xhr = xhr || new XHR();

    req.xhr = xhr;

    // Use a single completion callback. This can be called with or without
    // an error. If no error is passed, the request will be examined to see
    // if it was successful.
    done = once(delay(function(rawError) {
      clearTimeout(timeoutId);
      xhr.onload = xhr.onerror = xhr.onabort = xhr.onreadystatechange = xhr.ontimeout = xhr.onprogress = null;

      var err = getError(req, rawError);

      var res = err || Response.fromRequest(req);
      for (i = 0; i < plugins.length; i++) {
        plugin = plugins[i];
        if (plugin.processResponse) {
          plugin.processResponse(res);
        }
      }

      // Invoke callbacks
      if (err && req.onerror) req.onerror(err);
      if (!err && req.onload) req.onload(res);
      if (cb) cb(err, err ? undefined : res);

    }));

    supportsLoadAndErrorEvents = ('onload' in xhr) && ('onerror' in xhr);
    xhr.onload = function() { done(); };
    xhr.onerror = done;
    xhr.onabort = function() { done(); };

    // We'd rather use `onload`, `onerror`, and `onabort` since they're the
    // only way to reliably detect successes and failures but, if they
    // aren't available, we fall back to using `onreadystatechange`.
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;

      if (req.aborted) return done();

      if (!supportsLoadAndErrorEvents) {
        // Assume a status of 0 is an error. This could be a false
        // positive, but there's no way to tell when using
        // `onreadystatechange` ):
        // See matthewwithanm/react-inlinesvg#10.

        // Some browsers don't like you reading XHR properties when the
        // XHR has been aborted. In case we've gotten here as a result
        // of that (either our calling `about()` in the timeout handler
        // or the user calling it directly even though they shouldn't),
        // be careful about accessing it.
        var status;
        try {
          status = xhr.status;
        } catch (err) {}
        var err = status === 0 ? new Error('Internal XHR Error') : null;
        return done(err);
      }
    };

    // IE sometimes fails if you don't specify every handler.
    // See http://social.msdn.microsoft.com/Forums/ie/en-US/30ef3add-767c-4436-b8a9-f1ca19b4812e/ie9-rtm-xdomainrequest-issued-requests-may-abort-if-all-event-handlers-not-specified?forum=iewebdevelopment
    xhr.ontimeout = function() { /* noop */ };
    xhr.onprogress = function() { /* noop */ };

    xhr.open(req.method, req.url);

    if (req.timeout) {
      // If we use the normal XHR timeout mechanism (`xhr.timeout` and
      // `xhr.ontimeout`), `onreadystatechange` will be triggered before
      // `ontimeout`. There's no way to recognize that it was triggered by
      // a timeout, and we'd be unable to dispatch the right error.
      timeoutId = setTimeout(function() {
        req.timedOut = true;
        done();
        try {
          xhr.abort();
        } catch (err) {}
      }, req.timeout);
    }

    for (k in req.headers) {
      if (req.headers.hasOwnProperty(k)) {
        xhr.setRequestHeader(k, req.headers[k]);
      }
    }

    xhr.send(req.body);

    return req;
  }

  var method,
    methods = ['get', 'post', 'put', 'head', 'patch', 'delete'],
    verb = function(method) {
      return function(req, cb) {
        req = new Request(req);
        req.method = method;
        return http(req, cb);
      };
    };
  for (i = 0; i < methods.length; i++) {
    method = methods[i];
    http[method] = verb(method);
  }

  http.plugins = function() {
    return plugins;
  };

  http.defaults = function(newValues) {
    if (newValues) {
      return factory(extend(defaults, newValues), plugins);
    }
    return defaults;
  };

  http.use = function() {
    var newPlugins = Array.prototype.slice.call(arguments, 0);
    return factory(defaults, plugins.concat(newPlugins));
  };

  http.bare = function() {
    return factory();
  };

  http.Request = Request;
  http.Response = Response;
  http.RequestError = RequestError;

  return http;
}

module.exports = factory({}, [cleanURL]);

/**
 * Analyze the request to see if it represents an error. If so, return it! An
 * original error object can be passed as a hint.
 */
function getError(req, err) {
  if (req.aborted) return createError('Request aborted', req, {name: 'Abort'});

  if (req.timedOut) return createError('Request timeout', req, {name: 'Timeout'});

  var xhr = req.xhr;
  var type = Math.floor(xhr.status / 100);

  var kind;
  switch (type) {
    case 0:
    case 2:
      // These don't represent errors unless the function was passed an
      // error object explicitly.
      if (!err) return;
      return createError(err.message, req);
    case 4:
      // Sometimes 4XX statuses aren't errors.
      if (xhr.status === 404 && !req.errorOn404) return;
      kind = 'Client';
      break;
    case 5:
      kind = 'Server';
      break;
    default:
      kind = 'HTTP';
  }
  var msg = kind + ' Error: ' +
        'The server returned a status of ' + xhr.status +
        ' for the request "' +
        req.method.toUpperCase() + ' ' + req.url + '"';
  return createError(msg, req);
}
});

var httpplease = interopDefault(index);

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

var request = httpplease.use(json$1);

function send(method, url, args) {
  return new Promise(function (resolve, reject) {
    request({ method: method, url: url, body: args }, function (err, res) {
      if (err) {
        var error = err && err.body && err.body.meta && err.body.meta.errorMessage ? new Error(err.body.meta.errorMessage) : err;
        error.status = err.status;
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}

function get(url) {
  return send('GET', url);
}

function post(url, args) {
  return send('POST', url, args);
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function findSegments(agent) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return get(agent.url + '/segments' + makeQueryString(opts)).then(function (res) {
        return res.body.map(function (obj) {
            return segmentify(agent, obj);
        });
    });
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function getBranches(agent, prevLinkHash) {
  var tags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  deprecated('Agent#getBranches(agent, prevLinkHash, tags = [])', 'Agent#findSegments(agent, filter)');

  return findSegments(agent, { prevLinkHash: prevLinkHash, tags: tags });
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function segmentify(agent, obj) {
  Object.keys(agent.agentInfo.actions).filter(function (key) {
    return ['init'].indexOf(key) < 0;
  }).forEach(function (key) {
    /*eslint-disable*/
    obj[key] = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return post(agent.url + '/segments/' + obj.meta.linkHash + '/' + key, args).then(function (res) {
        return segmentify(agent, res.body);
      });
    };
  });

  /*eslint-disable*/
  obj.getPrev = function () {
    /*eslint-enable*/
    if (obj.link.meta.prevLinkHash) {
      return agent.getSegment(obj.link.meta.prevLinkHash);
    }

    return Promise.resolve(null);
  };

  // Deprecated.
  /*eslint-disable*/
  obj.load = function () {
    /*eslint-enable*/
    deprecated('segment#load()');
    return Promise.resolve(segmentify(agent, {
      link: JSON.parse(JSON.stringify(obj.link)),
      meta: JSON.parse(JSON.stringify(obj.meta))
    }));
  };

  // Deprecated.
  /*eslint-disable*/
  obj.getBranches = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    /*eslint-enable*/
    return getBranches.apply(undefined, [agent, obj.meta.linkHash].concat(args));
  };

  return obj;
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function createMap(agent) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return post(agent.url + '/segments', args).then(function (res) {
        return segmentify(agent, res.body);
    });
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function getSegment(agent, linkHash) {
    return get(agent.url + '/segments/' + linkHash).then(function (res) {
        return segmentify(agent, res.body);
    });
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function getMapIds(agent) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return get(agent.url + '/maps' + makeQueryString(opts)).then(function (res) {
        return res.body;
    });
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function getLink(agent, hash) {
    deprecated('Agent#getLink(agent, hash)', 'Agent#getSegment(agent, hash)');

    return getSegment(agent, hash);
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function getMap(agent, mapId) {
    var tags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    deprecated('getMap(agent, mapId, tags = [])', 'findSegments(agent, filter)');

    return findSegments(agent, { mapId: mapId, tags: tags });
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

// Deprecated.
function getAgent(url) {
  return get(url).then(function (res) {
    var agent = res.body;

    agent.url = url;
    agent.createMap = createMap.bind(null, agent);
    agent.getSegment = getSegment.bind(null, agent);
    agent.findSegments = findSegments.bind(null, agent);
    agent.getMapIds = getMapIds.bind(null, agent);

    // Deprecated.
    agent.getBranches = getBranches.bind(null, agent);
    agent.getLink = getLink.bind(null, agent);
    agent.getMap = getMap.bind(null, agent);

    return agent;
  });
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function fromSegment(obj) {
  return getAgent(obj.meta.agentUrl || obj.meta.applicationLocation).then(function (agent) {
    var segment = segmentify(agent, obj);
    return { agent: agent, segment: segment };
  });
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

// Deprecated.
var config = {
    applicationUrl: 'https://%s.stratumn.rocks'
};

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function getApplication(name, url) {
    deprecated('getApplication(name, url)', 'getAgent(url)');

    return getAgent(url || config.applicationUrl.replace('%s', name));
}

/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function loadLink(obj) {
    deprecated('loadLink(obj)', 'fromSegment(obj)');

    return fromSegment(obj).then(function (_ref) {
        var segment = _ref.segment;
        return segment;
    });
}

exports.getAgent = getAgent;
exports.fromSegment = fromSegment;
exports.getApplication = getApplication;
exports.loadLink = loadLink;
exports.config = config;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=stratumn-agent-client.js.map
