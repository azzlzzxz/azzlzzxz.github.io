import{_ as e,B as c,o as t,c as r,x as s,D as l,z as p,Q as o,a as n}from"./chunks/framework.a5035e6c.js";const F="/assets/websocket_compatible.90415940.png",y="/assets/keep-alive.de53b69a.jpg",D="/assets/websocket.088bd810.jpg",i="/assets/websocket_status.db0ba036.png",b="/assets/websocket_msg.8f5bd82c.png",v=JSON.parse('{"title":"WebSocket","description":"","frontmatter":{},"headers":[],"relativePath":"base/network/webSocket.md","lastUpdated":1714374586000}'),d={name:"base/network/webSocket.md"},B=o("",10),A=s("code",null,"HTTP",-1),u=s("code",null,"CPU",-1),m=s("p",null,[s("code",null,"WebSocket"),n(" 的出现可以对应解决上述问题：")],-1),E=s("code",null,"WebSocket",-1),k=s("code",null,"2Bytes",-1),C=s("code",null,"WebSocket",-1),h=o("",33);function g(f,w,S,T,_,W){const a=c("font");return t(),r("div",null,[B,s("ol",null,[s("li",null,[s("strong",null,[l(a,{color:"FF9D00"},{default:p(()=>[A,n(" 请求一般包含的头部信息比较多，其中有效的数据可能只占很小的一部分，导致带宽浪费。")]),_:1})])]),s("li",null,[s("strong",null,[l(a,{color:"FF9D00"},{default:p(()=>[n("服务器被动接收浏览器的请求然后响应，数据没有更新时仍然要接收并处理请求，导致服务器 "),u,n(" 占用。")]),_:1})])])]),m,s("ol",null,[s("li",null,[s("strong",null,[l(a,{color:"FF9D00"},{default:p(()=>[E,n(" 的头部信息少，通常只有 "),k,n(" 左右，能节省带宽。")]),_:1})])]),s("li",null,[s("strong",null,[l(a,{color:"FF9D00"},{default:p(()=>[C,n(" 支持服务端主动推送消息，更好地支持实时通信。")]),_:1})])])]),h])}const q=e(d,[["render",g]]);export{v as __pageData,q as default};