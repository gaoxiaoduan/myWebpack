// 1.确定入口文件
// 2.根据入口文件寻找其他依赖
// 3.根据入口文件的依赖，递归寻找其他依赖构建一个依赖图，描述文件的依赖关系
// 4.根据依赖图将所有文件打包成一个bundle📦

const fs = require("fs");
const path = require("path");
const babelPasrser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("babel-core");

let ID = 0;

/**
 * 根据文件，寻找依赖
 * @param {*} filename
 * @returns id,fillename,依赖文件
 */
function createAsset(filename) {
  const content = fs.readFileSync(filename, "utf8");

  const ast = babelPasrser.parse(content, { sourceType: "module" });

  // 依赖的路径
  const dependencies = [];
  traverse(ast, {
    // 根据inport关键字，找到依赖的路径
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  const id = ID++;

  // 获取原代码
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["env"],
  });

  return {
    id,
    filename,
    dependencies,
    code,
  };
}

/**
 *  根据入口文件，生成一个依赖图
 * @param {*} enty 入口文件
 * @returns 依赖图
 */
function createGraph(enty) {
  const mainAsset = createAsset(enty);
  const allAsset = [mainAsset];

  for (const asset of allAsset) {
    const dirName = path.dirname(asset.filename);

    asset.mapping = {};

    asset.dependencies.forEach((relativePath) => {
      // 拼接绝对路径
      const absolutePath = path.join(dirName, relativePath);

      const childAsset = createAsset(absolutePath);

      // 构建依赖图，依赖路径作为key，id作为value
      asset.mapping[relativePath] = childAsset.id;

      allAsset.push(childAsset);
    });
  }

  return allAsset;
}

/**
 * 根据依赖图，对依赖内容进行打包
 * @param {*} graph
 * @returns 输出一个bundle.js文件
 */
function bundle(graph) {
  let modules = "";
  graph.forEach((module) => {
    modules += `${module.id}:[
        function(require, module, exports) {
            ${module.code}
        },
        ${JSON.stringify(module.mapping)},
    ],`;
  });

  const result = `
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
        )({${modules}})
    `;

  return result;
}

const graph = createGraph("./index.js");
const result = bundle(graph);
console.log(result);
