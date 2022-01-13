/******/ (function(modules) { // webpackBootstrap
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main/js/index.js":
/*!******************************!*\
  !*** ./src/main/js/index.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nError: Cannot find module 'babel-preset-es2015'\nRequire stack:\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/config/files/plugins.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/config/files/index.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/index.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/babel-loader/lib/index.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/loader-runner/lib/loadLoader.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/loader-runner/lib/LoaderRunner.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/webpack/lib/NormalModule.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/webpack/lib/NormalModuleFactory.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/webpack/lib/Compiler.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/webpack/lib/webpack.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/webpack-cli/bin/utils/validate-options.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/webpack-cli/bin/utils/convert-argv.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/webpack-cli/bin/cli.js\n- /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/webpack/bin/webpack.js\n    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:965:15)\n    at resolve (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/v8-compile-cache/v8-compile-cache.js:164:23)\n    at resolveStandardizedName (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/config/files/plugins.js:111:7)\n    at resolvePreset (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/config/files/plugins.js:59:10)\n    at loadPreset (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/config/files/plugins.js:78:20)\n    at loadPreset.next (<anonymous>)\n    at createDescriptor (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/config/config-descriptors.js:187:16)\n    at createDescriptor.next (<anonymous>)\n    at evaluateSync (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/gensync/index.js:251:28)\n    at /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/gensync/index.js:31:34\n    at Array.map (<anonymous>)\n    at Function.sync (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/gensync/index.js:31:22)\n    at Function.all (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/gensync/index.js:210:24)\n    at Generator.next (<anonymous>)\n    at createDescriptors (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/config/config-descriptors.js:142:41)\n    at createDescriptors.next (<anonymous>)\n    at createPresetDescriptors (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/config/config-descriptors.js:134:17)\n    at createPresetDescriptors.next (<anonymous>)\n    at /Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/config/config-descriptors.js:86:32\n    at Generator.next (<anonymous>)\n    at Function.<anonymous> (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/gensync-utils/async.js:24:3)\n    at Generator.next (<anonymous>)\n    at evaluateSync (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/gensync/index.js:251:28)\n    at Function.sync (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/gensync/index.js:89:14)\n    at sync (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/gensync-utils/async.js:67:25)\n    at sync (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/gensync/index.js:182:19)\n    at onFirstPause (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/gensync/index.js:210:24)\n    at Generator.next (<anonymous>)\n    at cachedFunction (/Users/test/Desktop/Everything/college/Senior Year/Fall 2021/CSE 416/districting/node_modules/@babel/core/lib/config/caching.js:66:46)\n    at cachedFunction.next (<anonymous>)");

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map