(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeAllPaths"] = factory();
	else
		root["cytoscapeAllPaths"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
  allPaths: allPaths,
  allPathsTo: allPathsTo
};

function allPaths() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$maxPaths = _ref.maxPaths,
      maxPaths = _ref$maxPaths === void 0 ? -1 : _ref$maxPaths,
      _ref$rootIds = _ref.rootIds,
      rootIds = _ref$rootIds === void 0 ? [] : _ref$rootIds,
      _ref$directed = _ref.directed,
      directed = _ref$directed === void 0 ? false : _ref$directed,
      _ref$target = _ref.target,
      target = _ref$target === void 0 ? null : _ref$target;

  var eles = this;
  var cy = this.cy(); // 1. Find all root nodes

  var rootNodes = [];

  if (rootIds.length === 0) {
    rootNodes = eles.roots();
  } else {
    rootNodes = rootIds.map(function (id) {
      return cy.$id(id);
    }).filter(function (item) {
      return item.length > 0;
    });
  } // 2. Start with each root node and traverse all paths


  var allPaths = []; // [[node, edge, node, edge, ...], ...]

  rootNodes.forEach(function (rNode) {
    traversing(rNode, [rNode]);
  });

  function traversing(node, preNodes) {
    if (maxPaths >= 0 && allPaths.length >= maxPaths) return;

    if (!node) {
      // It's the ending node
      allPaths.push(preNodes);
      return;
    }

    if (directed && target !== null && target === node.id()) {
      // It's the ending node in directed graph
      allPaths.push(preNodes);
      return;
    }

    var nextEles;

    if (!directed) {
      nextEles = getOutgoers(node);
    } else {
      nextEles = getDirectedOutgoers(node, preNodes);
    }

    if (nextEles.length === 0) {
      // It's the ending node
      allPaths.push(preNodes);
    } else {
      nextEles.forEach(function (pairEles) {
        if (preNodes.find(function (item) {
          return item.id() === pairEles[1].id();
        })) {
          // Prevent circular dependence
          traversing(null, preNodes.concat(pairEles));
        } else {
          traversing(pairEles[1], preNodes.concat(pairEles));
        }
      });
    }
  }

  function getDirectedOutgoers(node, preNodes) {
    var outgoers = node.outgoers();
    var pos = -1;

    var _loop = function _loop(i) {
      // outgoers is node and node is already inside preNodes (visited)
      if (i % 2 !== 0 && preNodes.find(function (item) {
        return item.id() === outgoers[i].id();
      })) {
        // save the position
        pos = i;
        return "break";
      }
    };

    for (var i = 0; i < outgoers.length; i++) {
      var _ret = _loop(i);

      if (_ret === "break") break;
    } // delete edge and node


    if (pos > -1) outgoers.splice(pos - 1, 2);
    var nextEles = []; // [[edge, node], ...]

    var eles = []; // [edge, node]

    outgoers.forEach(function (oEle, idx) {
      if (idx % 2 == 0) {
        // even
        eles = [];
        eles.push(oEle);
      } else {
        // odd
        eles.push(oEle);
        nextEles.push(eles);
      }
    });
    return nextEles;
  }

  function getOutgoers(node) {
    var outgoers = node.outgoers();
    var nextEles = []; // [[edge, node], ...]

    var eles = []; // [edge, node]

    outgoers.forEach(function (oEle, idx) {
      if (idx % 2 == 0) {
        // even
        eles = [];
        eles.push(oEle);
      } else {
        // odd
        eles.push(oEle);
        nextEles.push(eles);
      }
    });
    return nextEles;
  }

  var allPathsCollection = [];
  allPaths.forEach(function (pathItem) {
    var pathCollection = cy.collection(pathItem);
    allPathsCollection.push(pathCollection);
  });
  return allPathsCollection; // chainability
}

;

function allPathsTo(target, _ref2) {
  var _ref2$maxPaths = _ref2.maxPaths,
      maxPaths = _ref2$maxPaths === void 0 ? -1 : _ref2$maxPaths,
      _ref2$rootIds = _ref2.rootIds,
      rootIds = _ref2$rootIds === void 0 ? [] : _ref2$rootIds;
  return allPaths.apply(this, [Object.assign({
    maxPaths: maxPaths,
    rootIds: rootIds
  }, {
    target: target,
    directed: true
  })]);
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var impl = __webpack_require__(0); // registers the extension on a cytoscape lib ref


var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified


  cytoscape('collection', 'cytoscapeAllPaths', impl.allPaths); // register with cytoscape.js

  cytoscape('collection', 'cytoscapeAllPathsTo', impl.allPathsTo);
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ })
/******/ ]);
});