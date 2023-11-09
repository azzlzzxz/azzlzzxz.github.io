import{_ as p,B as c,o as t,c as r,D as e,z as o,x as s,Q as a,a as n}from"./chunks/framework.a5035e6c.js";const i="/assets/Node_EventLoop.5567d011.jpg",d="/assets/diff.052d65d0.png",P=JSON.parse('{"title":"Node 的事件循环机制","description":"","frontmatter":{},"headers":[],"relativePath":"node/base/eventLoop.md","lastUpdated":1699496231000}'),y={name:"node/base/eventLoop.md"},F=a("",5),D=s("ul",null,[s("li",null,[s("code",null,"timers:"),n(" 执行 "),s("code",null,"setTimeout"),n(" 和 "),s("code",null,"setInterval"),n(" 中到期的 "),s("code",null,"callback"),n("。")]),s("li",null,[s("code",null,"pending callback:"),n(" 上一轮循环中少数的 "),s("code",null,"callback"),n(" 会放在这一阶段执行。")]),s("li",null,[s("code",null,"idle, prepare:"),n(" 仅在内部使用。")]),s("li",null,[s("code",null,"poll:"),n(" 最重要的阶段，执行 "),s("code",null,"pending"),n(),s("code",null,"callback"),n("，在适当的情况下会阻塞在这个阶段。")]),s("li",null,[s("code",null,"check:"),n(" 执行 "),s("code",null,"setImmediate"),n(" 的 "),s("code",null,"callback"),n("。")]),s("li",null,[s("code",null,"close callbacks:"),n(" 执行 close 事件的 "),s("code",null,"callback"),n("，例如 "),s("code",null,"socket.on(‘close’[,fn])"),n("或者 "),s("code",null,"http.server.on('close, fn)"),n("。")])],-1),m=a("",36),b=s("code",null,"I/O",-1),u=s("code",null,"setImmediate",-1),B=s("code",null,"I/O",-1),A=s("code",null,"poll",-1),E=s("code",null,"poll",-1),h=s("code",null,"check",-1),_=s("code",null,"setImmediate",-1),k=a("",9);function g(C,v,f,I,T,q){const l=c("font");return t(),r("div",null,[F,e(l,{color:"#5887ff"},{default:o(()=>[D]),_:1}),m,s("p",null,[s("strong",null,[e(l,{color:"#FF4444"},{default:o(()=>[n("但是，如果你把这两个函数放入一个 "),b,n(" 循环内调用，"),u,n(" 总是被优先调用：因为 "),B,n(" 操作是在 "),A,n(" 阶段进行的，"),E,n(" 阶段之后是 "),h,n("（也就是调用 "),_,n("）。")]),_:1})])]),k])}const N=p(y,[["render",g]]);export{P as __pageData,N as default};
