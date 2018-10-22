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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  var eles = this;
  var cy = this.cy();

  // 1. Find all root node
  var rootNodes = eles.roots();

  // 2. Start with each root node and traverse all paths
  var allPaths = []; // [[node, edge, node, edge, ...], ...]
  rootNodes.forEach(function (rNode) {
    traversing(rNode, [rNode]);
  });

  function traversing(node, preNodes) {
    if (!node) {
      // It's the ending node
      allPaths.push(preNodes);
      return;
    }

    var nextEles = getOutgoers(node);
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

  function getOutgoers(node) {
    var outgoers = node.outgoers();
    var nextEles = []; // [[node, edge], ...]
    var eles = []; // [node, edge]
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
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(0);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('collection', 'cytoscapeAllPaths', impl); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ })
/******/ ]);
});