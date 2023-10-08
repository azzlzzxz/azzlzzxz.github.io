import{_ as r,B as i,o as T,c as s,x as t,D as a,z as o,a as e,Q as n}from"./chunks/framework.a5035e6c.js";const _="/assets/http2.2a937e09.png",c="/assets/header_zip.07c96157.png",B=JSON.parse('{"title":"Http 协议","description":"","frontmatter":{},"headers":[],"relativePath":"base/network/httpAgreement.md","lastUpdated":1696745801000}'),p={name:"base/network/httpAgreement.md"},h=n("",9),u=t("p",null,"线头阻塞：TCP 连接上只能发送一个请求，前面的请求未完成前，后续的请求都在排队等待。 针对队头阻塞,人们尝试过以下办法来解决：",-1),d=t("p",null,"精灵图，Spriting 合并多张小图为一张大图,再用 JavaScript 或者 CSS 将小图重新“切割”出来的技术。",-1),P=t("p",null,"拼接(Concatenation)将多个体积较小的 JavaScript 使用 webpack 等工具打包成 1 个体积更大的 JavaScript 文件,但如果其中 1 个文件的改动就会导致大量数据被重新下载多个文件。",-1),H=t("li",null,[t("p",null,"多个 TCP 连接")],-1),f=t("p",null,"虽然 HTTP/1.1 管线化可以支持请求并发，所以 1.1 版本请求并发依赖于多个 TCP 连接，建立 TCP 连接成本很高，还会存在慢启动的问题。",-1),m=t("ol",{start:"3"},[t("li",null,"头部冗余，采用文本格式")],-1),F={start:"4"},C=t("li",null,"客户端需要主动请求",-1),S=t("h2",{id:"http-2",tabindex:"-1"},[e("HTTP/2 "),t("a",{class:"header-anchor",href:"#http-2","aria-label":'Permalink to "HTTP/2"'},"​")],-1),g=t("p",null,"HTTP/2 由两个规范（Specification）组成：",-1),D=t("ul",null,[t("li",null,"Hypertext Transfer Protocol version 2 - RFC7540"),t("li",null,"HPACK - Header Compression for HTTP/2 - RFC7541")],-1),b=n("",9),x=n("",8),k=t("p",null,"这一特性，使性能有了极大提升：",-1);function A(q,E,V,v,N,I){const l=i("font");return T(),s("div",null,[h,t("ol",null,[t("li",null,[u,t("ul",null,[t("li",null,[a(l,{color:"FF9D00"},{default:o(()=>[e("同一页面的资源分散到不同域名下，提升连接上限。")]),_:1}),a(l,{color:"FF9D00"},{default:o(()=>[e("Chrome 有个机制，对于同一个域名，默认允许同时建立 6 个 TCP 持久连接")]),_:1}),e("，使用持久连接时，虽然能公用一个 TCP 管道，但是在一个管道中同一时刻只能处理一个请求，在当前的请求没有结束之前，其他的请求只能处于阻塞状态。另外如果在同一个域名下同时有 10 个请求发生，那么其中 4 个请求会进入排队等待状态，直至进行中的请求完成（chrome 放弃了）")]),t("li",null,[a(l,{color:"FF9D00"},{default:o(()=>[e("合并小文件减少资源数。")]),_:1}),d]),t("li",null,[a(l,{color:"FF9D00"},{default:o(()=>[e("内联(Inlining)资源是另外一种防止发送很多小图请求的技巧")]),_:1}),e("，将图片的原始数据嵌入在 CSS 文件里面的 URL 里，减少网络请求次数。")]),t("li",null,[a(l,{color:"FF9D00"},{default:o(()=>[e("减少请求数量。")]),_:1}),P])])]),H]),f,m,t("ul",null,[t("li",null,[a(l,{color:"FF9D00"},{default:o(()=>[e("HTTP/1.x 版本是采用文本格式，首部未压缩，")]),_:1}),e("而且每一个请求都会带上 cookie、user-agent 等完全相同的首部。")]),t("li",null,[a(l,{color:"FF9D00"},{default:o(()=>[e("无状态是指协议对于连接状态没有记忆能力。")]),_:1}),e("纯净的 HTTP 是没有 cookie 等机制的，每一个连接都是一个新的连接。")]),t("li",null,[e('由于报文 Header 一般会携带"User Agent"、"Cookie"、"Accept"、"Server"等许多固定的头字段，多达几百字节甚至上千字节，但 Body 却经常只有几十字节（比如 GET 请求、204/301/304 响应），成了不折不扣的“大头儿子”。'),a(l,{color:"FF9D00"},{default:o(()=>[e("Header 里携带的内容过大，在一定程度上增加了传输的成本。更要命的是，请求响应报文里有大量字段值都是重复的，非常浪费。")]),_:1})])]),t("ol",F,[C,t("li",null,[e("HTTP/1.1 在传输数据时，所有传输的"),a(l,{color:"FF9D00"},{default:o(()=>[e("内容都是明文")]),_:1}),e("内容都是明文，客户端和服务器端都无法验证对方的身份，这在一定程度上无法保证数据的安全性。")])]),S,t("p",null,[e("2015 年，HTTP/2 发布。HTTP/2 是现行 HTTP 协议（HTTP/1.x）的替代，但它不是重写，HTTP 方法/状态码/语义都与 HTTP/1.x 一样。 HTTP/2 基于 SPDY，专注于性能，最大的一个目标是在用户和网站间只用一个连接（connection） 。从目前的情况来看，国内外一些排名靠前的站点基本都实现了 HTTP/2 的部署，"),a(l,{color:"FF9D00"},{default:o(()=>[e("使用 HTTP/2 能带来 20%~60%的效率提升。")]),_:1})]),g,D,t("p",null,[t("strong",null,[a(l,{color:"FF4229"},{default:o(()=>[e("HTTP/2 传输数据量的大幅减少,主要有两个原因:以二进制方式传输和 Header 压缩。")]),_:1})])]),b,a(l,{color:"FF9D00"},{default:o(()=>[e("HTTP/2 为此采用 HPACK 压缩格式来压缩首部。头部压缩需要在浏览器和服务器端之间：")]),_:1}),x,t("ul",null,[t("li",null,[t("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[e("同域名下所有通信都在单个连接上完成。")]),_:1})])]),t("li",null,[t("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[e("单个连接可以承载任意数量的双向数据流。")]),_:1})])]),t("li",null,[t("strong",null,[a(l,{color:"FF9D00"},{default:o(()=>[e("数据流以消息的形式发送，而消息又由一个或多个帧组成，多个帧之间可以乱序发送，因为根据帧首部的流标识可以重新组装。")]),_:1})])])]),k])}const w=r(p,[["render",A]]);export{B as __pageData,w as default};
