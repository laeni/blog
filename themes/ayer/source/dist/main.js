// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"css/style.styl":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"js/ayer.js":[function(require,module,exports) {
(function ($) {
  // Search
  var $searchWrap = $('.search-form-wrap'),
      isSearchAnim = false,
      searchAnimDuration = 200;

  var startSearchAnim = function startSearchAnim() {
    isSearchAnim = true;
  };

  var stopSearchAnim = function stopSearchAnim(callback) {
    setTimeout(function () {
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('.nav-item-search').click(function () {
    if (isSearchAnim) return;
    startSearchAnim();
    $searchWrap.addClass('on');
    stopSearchAnim(function () {
      $('.local-search-input').focus();
    });
  });
  $(document).mouseup(function (e) {
    var _con = $('.local-search');

    if (!_con.is(e.target) && _con.has(e.target).length === 0) {
      $searchWrap.removeClass('on');
    }
  }); // 建议在移动端不初始化，其实 /search.xml 文件还挺大的，

  if ($('.local-search').size()) {
    $.getScript('/js/search.js', function () {
      searchFunc("/search.xml", 'local-search-input', 'local-search-result');
    });
  } // Mobile Detect


  var isMobile = {
    Android: function Android() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function BlackBerry() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function iOS() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function Opera() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function Windows() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function any() {
      return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
    }
  }; // Share

  $('.share-outer').click(function () {
    return $('.share-wrap').fadeToggle();
  }); // Lazyload

  $("img.lazy").lazyload({
    effect: "fadeIn"
  }); // JustifiedGallery

  $('#gallery').justifiedGallery({
    rowHeight: 200,
    margins: 5
  }); // ScrollDown

  $(document).ready(function ($) {
    $('.anchor').click(function (e) {
      e.preventDefault();
      $('main').animate({
        scrollTop: $('.cover').height()
      }, 'smooth');
    });
  }); // To Top

  (function () {
    // When to show the scroll link
    // higher number = scroll link appears further down the page
    var upperLimit = 1000; // Our scroll link element

    var scrollElem = $('#totop'); // Scroll to top speed

    var scrollSpeed = 1000; // Show and hide the scroll to top link based on scroll position

    scrollElem.hide();
    $('.content').scroll(function () {
      var scrollTop = $('.content').scrollTop();

      if (scrollTop > upperLimit) {
        $(scrollElem).stop().fadeTo(200, .6); // fade back in
      } else {
        $(scrollElem).stop().fadeTo(200, 0); // fade out
      }
    }); // Scroll to top animation on click

    $(scrollElem).click(function () {
      $('.content').animate({
        scrollTop: 0
      }, scrollSpeed);
      return false;
    });
  })(); // Mobile Nav


  var $content = $('.content'),
      $sidebar = $('.sidebar');
  $('.navbar-toggle').on('click', function () {
    $('.content,.sidebar').addClass('anim');
    $content.toggleClass('on');
    $sidebar.toggleClass('on');
  }); // Reward

  $('#reward-btn').click(function () {
    $('#reward').fadeIn(150);
    $('#mask').fadeIn(150);
  });
  $('#reward .close, #mask').click(function () {
    $('#mask').fadeOut(100);
    $('#reward').fadeOut(100);
  }); // DarkMode

  if (sessionStorage.getItem('darkmode') === 1) {
    $('body').addClass('darkmode');
    $('#todark i').removeClass('ri-moon-line').addClass('ri-sun-line');
  } else {
    $('body').removeClass('darkmode');
    $('#todark i').removeClass('ri-sun-line').addClass('ri-moon-line');
  }

  $('#todark').click(function () {
    if (sessionStorage.getItem('darkmode') === 1) {
      $('body').removeClass('darkmode');
      $('#todark i').removeClass('ri-sun-line').addClass('ri-moon-line');
      sessionStorage.removeItem('darkmode');
    } else {
      $('body').addClass('darkmode');
      $('#todark i').removeClass('ri-moon-line').addClass('ri-sun-line');
      sessionStorage.setItem('darkmode', 1);
    }
  });
})(jQuery);
},{}],"js/share.js":[function(require,module,exports) {
function generate(url, opts) {
  var url = url.replace(/<%-sUrl%>/g, encodeURIComponent(opts.sUrl)).replace(/<%-sTitle%>/g, opts.sTitle).replace(/<%-sDesc%>/g, opts.sDesc).replace(/<%-sPic%>/g, encodeURIComponent(opts.sPic));
  window.open(url);
}

function showWX() {
  $('.wx-share-modal').addClass('in ready');
  $('#share-mask').show();
}

function hideWX() {
  $('.wx-share-modal').removeClass('in ready');
  $('#share-mask').hide();
}

function handleClick(type, opts) {
  if (type === 'weibo') {
    generate('http://service.weibo.com/share/share.php?url=<%-sUrl%>&title=<%-sTitle%>&pic=<%-sPic%>', opts);
  } else if (type === 'qq') {
    generate('http://connect.qq.com/widget/shareqq/index.html?url=<%-sUrl%>&title=<%-sTitle%>&source=<%-sDesc%>', opts);
  } else if (type === 'douban') {
    generate('https://www.douban.com/share/service?image=<%-sPic%>&href=<%-sUrl%>&name=<%-sTitle%>&text=<%-sDesc%>', opts);
  } else if (type === 'qzone') {
    generate('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=<%-sUrl%>&title=<%-sTitle%>&pics=<%-sPic%>&summary=<%-sDesc%>', opts);
  } else if (type === 'facebook') {
    generate('https://www.facebook.com/sharer/sharer.php?u=<%-sUrl%>', opts);
  } else if (type === 'twitter') {
    generate('https://twitter.com/intent/tweet?text=<%-sTitle%>&url=<%-sUrl%>&via=<%-config.url%>', opts);
  } else if (type === 'google') {
    generate('https://plus.google.com/share?url=<%-sUrl%>', opts);
  } else if (type === 'weixin') {
    showWX();
  }
}

var share_init = function share_init() {
  var $sns = document.querySelectorAll('.share-sns');
  if (!$sns || $sns.length === 0) return;
  var sUrl = window.location.href;
  var sTitle = document.querySelector('title').innerHTML;
  var $img = document.querySelectorAll('.article-entry img');
  var sPic = $img.length ? document.querySelector('.article-entry img').getAttribute('src') : '';

  if (sPic !== '' && !/^(http:|https:)?\/\//.test(sPic)) {
    sPic = window.location.origin + sPic;
  }

  $sns.forEach(function ($em) {
    $em.onclick = function (e) {
      var type = $em.getAttribute('data-type');
      handleClick(type, {
        sUrl: sUrl,
        sPic: sPic,
        sTitle: sTitle,
        sDesc: sTitle
      });
    };
  });
  document.querySelector('#mask').onclick = hideWX;
  document.querySelector('.modal-close').onclick = hideWX;
};

share_init();
},{}],"main.js":[function(require,module,exports) {
"use strict";

require("./css/style.styl");

require("./js/ayer");

require("./js/share");
},{"./css/style.styl":"css/style.styl","./js/ayer":"js/ayer.js","./js/share":"js/share.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49755" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.js.map