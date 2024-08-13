# 了解 TypeScript

TypeScript，简称 ts，是微软开发的一种静态的编程语言，它是 JavaScript 的超集。 那么它有什么特别之处呢?

- 简单来说，js 有的 ts 都有，所有 js 代码都可以在 ts 里面运行。
- ts 支持类型支持，ts = type +JavaScript
  ![image](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/ts.png)
- tsconfig.json 配置

```json
{
  "compilerOptions": {
    "target": "es5", // 目标
    "module": "commonjs", // 现在的模块用什么写的
    "moduleResolution": "node"
    // moduleResolution:node是根据node的模块查找规则，先找当前目录的node_modules，再找父目录的node_modules
    // 路径是c:a/b/c.js，但是import(d)
    // moduleResolution:classic --> c:/a/b/d -> c:/a/d -> c:/d ->找不到就报错
    "jsx": "preserve" // 保留不转译
    // jsx:'react' 会把jsx -> React.createElement
    "resolveJsonModule": true, // 支持json模块
    "strictNullChecks": true,// 严格空检查，建议打开
    "noImplicitAny": true, // 不允许隐含any类型
    // esnext 最新版的es
    "lib": ["ESNext", "dom"], // 支持那些库
    "experimentalDecorators": true, // 让ts支持装饰器
    "downlevelIteration": true,
    "strictFunctionTypes": true,
    "esModuleInterop": true, // 转换es6模块（支持模块之间的转换 ）
    "declaration": true, // 在编译的时候自动生成一份类型声明文件
    // 找类型声明文件
    "baseUrl": "./",
    "paths": { // 映射路径
      "*":["types/*"]
    }
  },
  // * 匹配任意字符但不包括路径分隔符，**匹配任意字符也包括路径分隔符
  "include": [// 编译那些目录下的文件
    // glob 模式（文件匹配模式）
    "typings/**/*",
    "src/**/*.ts" // 找src目录下所有的ts
  ]
}
```
