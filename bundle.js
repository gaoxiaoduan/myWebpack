
        (
            function(modules){
                function require(id){
                    const [fn,mapping] = modules[id];

                    function local_require(relativePath){
                        return require(mapping[relativePath]);
                    };

                    const module = { exports : {} };

                    fn(local_require, module, module.exports);

                    return module.exports;
                };
                require(0);
            }
        )({0:[
        function(require, module, exports) {
            "use strict";

var _foo = require("./src/foo.js");

console.log(_foo.res); // foo outpu --> hello myWebpack
        },
        {"./src/foo.js":1},
    ],1:[
        function(require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.res = undefined;

var _const = require("./const.js");

function foo(cnt) {
  return "foo outpu --> " + cnt;
}

var res = exports.res = foo(_const.content);
        },
        {"./const.js":2},
    ],2:[
        function(require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var content = exports.content = "hello myWebpack";
        },
        {},
    ],})
    
