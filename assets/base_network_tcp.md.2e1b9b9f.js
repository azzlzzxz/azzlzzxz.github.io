import{_ as a,o as e,c as t,Q as i}from"./chunks/framework.a5035e6c.js";const l="/assets/osi_seven.53d14636.png",p="/assets/tcp.99c74167.png",r="/assets/OSI.21264be7.png",o="/assets/tcp_3_4.439c3240.jpg",I=JSON.parse('{"title":"OSI & TCP","description":"","frontmatter":{},"headers":[],"relativePath":"base/network/tcp.md","lastUpdated":1697768968000}'),s={name:"base/network/tcp.md"},n=i('<h1 id="osi-tcp" tabindex="-1">OSI &amp; TCP <a class="header-anchor" href="#osi-tcp" aria-label="Permalink to &quot;OSI &amp; TCP&quot;">​</a></h1><p>OSI 分层：应用层、表示层、会话层、传输层、网络层、数据链路层、物理层。</p><p><img src="'+l+'" alt="osi_seven"></p><p>TCP/IP 模型：应用层、传输层、网络层、网络接口层。</p><p><img src="'+p+'" alt="tcp"></p><p>应用层协议(常用)：HTTP、RTSP、FTP。</p><p>传输层协议：TCP、UDP。</p><h2 id="osi-的七层模型具体是什么" tabindex="-1">OSI 的七层模型具体是什么 <a class="header-anchor" href="#osi-的七层模型具体是什么" aria-label="Permalink to &quot;OSI 的七层模型具体是什么&quot;">​</a></h2><p>ISO 于 1978 年开发的一套标准架构 ISO 模型，被引用来说明数据通信协议的结构和功能。</p><p>OSI 在功能上可以划分为两组：</p><ul><li>网络群组：物理层、数据链路层、网络层</li><li>使用者群组：传输层、会话层、表示层、应用层</li></ul><p><img src="'+r+'" alt="OSI"></p><p>其中高层（7、6、5、4 层）定义了应用程序的功能，下面三层（3、2、1 层）主要面向通过网络的端到端的数据流。</p><h2 id="tcp-ip" tabindex="-1">TCP / IP <a class="header-anchor" href="#tcp-ip" aria-label="Permalink to &quot;TCP / IP&quot;">​</a></h2><p>TCP/IP 传输协议，即传输控制/网络协议，也叫作网络通讯协议。 它是在网络的使用中的最基本的通信协议。 TCP/IP 传输协议对互联网中各部分进行通信的标准和方法进行了规定。 并且，TCP/IP 传输协议是保证网络数据信息及时、完整传输的两个重要的协议。</p><h3 id="tcp-ip-如何保证数据包传输的有序可靠" tabindex="-1">TCP/IP 如何保证数据包传输的有序可靠 <a class="header-anchor" href="#tcp-ip-如何保证数据包传输的有序可靠" aria-label="Permalink to &quot;TCP/IP 如何保证数据包传输的有序可靠&quot;">​</a></h3><p>对字节流分段并进行编号然后通过  ACK 回复和超时重发这两个机制来保证。</p><ol><li>为了保证数据包的可靠传递，发送方必须把已发送的数据包保留在缓冲区。</li><li>并为每个已发送的数据包启动一个超时定时器。</li><li>如在定时器超时之前收到了对方发来的应答信息（可能是对本包的应答，也可以是对本包后续包的应答），则释放该数据包占用的缓冲区。</li><li>否则，重传该数据包，直到收到应答或重传次数超过规定的最大次数为止。</li><li>接收方收到数据包后，先进行 CRC 校验，如果正确则把数据交给上层协议，然后给发送方发送一个累计应答包，表明该数据已收到，如果接收方正好也有数据要发给发送方，应答包也可方在数据包中捎带过去。</li></ol><h3 id="tcp-三次握手-四次挥手" tabindex="-1">TCP 三次握手&amp;四次挥手 <a class="header-anchor" href="#tcp-三次握手-四次挥手" aria-label="Permalink to &quot;TCP 三次握手&amp;四次挥手&quot;">​</a></h3><p><img src="'+o+'" alt="tcp_3_4"></p><h4 id="_3-次握手" tabindex="-1"><strong>3 次握手</strong> <a class="header-anchor" href="#_3-次握手" aria-label="Permalink to &quot;**3 次握手**&quot;">​</a></h4><ul><li><p>第一次握手：建立连接时，客户端发送 syn 包（syn=x）到服务器，并进入 SYN_SENT 状态，等待服务器确认；SYN：同步序列编号（Synchronize Sequence Numbers）。</p></li><li><p>第二次握手：服务器收到 syn 包并确认客户的 SYN（ack= x+1），同时也发送一个自己的 SYN 包（syn= y ），即 SYN+ACK 包，此时服务器进入 SYN_RECV 状态；</p></li><li><p>第三次握手：客户端收到服务器的 SYN+ACK 包，向服务器发送确认包 ACK(ack= y+1），此包发送完毕，客户端和服务器进入 ESTABLISHED（TCP 连接成功）状态，完成三次握手。</p></li></ul><h4 id="_4-次挥手" tabindex="-1"><strong>4 次挥手</strong> <a class="header-anchor" href="#_4-次挥手" aria-label="Permalink to &quot;**4 次挥手**&quot;">​</a></h4><ul><li><p>客户端进程发出连接释放报文，并且停止发送数据。释放数据报文首部，FIN=1，其序列号为 seq=u（等于前面已经传送过来的数据的最后一个字节的序号加 1），此时，客户端进入 FIN-WAIT-1（终止等待 1）状态。 TCP 规定，FIN 报文段即使不携带数据，也要消耗一个序号。</p></li><li><p>服务器收到连接释放报文，发出确认报文，ACK=1，ack=u+1，并且带上自己的序列号 seq=v，此时，服务端就进入了 CLOSE-WAIT（关闭等待）状态。TCP 服务器通知高层的应用进程，客户端向服务器的方向就释放了，这时候处于半关闭状态，即客户端已经没有数据要发送了，但是服务器若发送数据，客户端依然要接受。这个状态还要持续一段时间，也就是整个 CLOSE-WAIT 状态持续的时间。</p></li><li><p>客户端收到服务器的确认请求后，此时，客户端就进入 FIN-WAIT-2（终止等待 2）状态，等待服务器发送连接释放报文（在这之前还需要接受服务器发送的最 后的数据）。</p></li><li><p>服务器将最后的数据发送完毕后，就向客户端发送连接释放报文，FIN=1，ack=u+1，由于在半关闭状态，服务器很可能又发送了一些数据，假定此时的序列号为 seq=w，此时，服务器就进入了 LAST-ACK（最后确认）状态，等待客户端的确认。</p></li><li><p>客户端收到服务器的连接释放报文后，必须发出确认，ACK=1，ack=w+1，而自己的序列号是 seq=u+1，此时，客户端就进入了 TIME-WAIT（时间等待）状态。注意此时 TCP 连接还没有释放，必须经过 2∗∗MSL（最长报文段寿命）的时间后，当客户端撤销相应的 TCB 后，才进入 CLOSED 状态。</p></li><li><p>服务器只要收到了客户端发出的确认，立即进入 CLOSED 状态。同样，撤销 TCB 后，就结束了这次的 TCP 连接。</p></li><li><p>可以看到，服务器结束 TCP 连接的时间要比客户端早一些。</p></li></ul><h3 id="针对-3-次握手-4-次挥手常见面试题" tabindex="-1">针对 3 次握手，4 次挥手常见面试题 <a class="header-anchor" href="#针对-3-次握手-4-次挥手常见面试题" aria-label="Permalink to &quot;针对 3 次握手，4 次挥手常见面试题&quot;">​</a></h3><p>问题 🙋：</p><h4 id="为什么连接的时候是-3-次握手-关闭的时候却是-4-次挥手" tabindex="-1"><strong>为什么连接的时候是 3 次握手，关闭的时候却是 4 次挥手？</strong> <a class="header-anchor" href="#为什么连接的时候是-3-次握手-关闭的时候却是-4-次挥手" aria-label="Permalink to &quot;**为什么连接的时候是 3 次握手，关闭的时候却是 4 次挥手？**&quot;">​</a></h4><p>应为当服务端收到客户端的 SYN 连接请求报文后，可以直接发送 SYN+ACK 报文。其中 ACK 报文是用来应答的，SYN 报文是用来同步的。</p><p>但是关闭连接时，当服务端收到 FIN 报文时，很可能并不会立即关闭 SOCKET，所以只能先回复一个 ACK 报文，告诉客户端“你发的 FIN 报文我收到了”。</p><p>只有等到服务端所有的报文都发送完，客户短才能发送 FIN 报文，因此不能一起发送，所以需要 4 次挥手。</p><h4 id="为什么-time-wait-状态需要经过-2msl-最大报文短生存时间-才能返回到-close-状态" tabindex="-1"><strong>为什么 TIME_WAIT 状态需要经过 2MSL（最大报文短生存时间）才能返回到 CLOSE 状态？</strong> <a class="header-anchor" href="#为什么-time-wait-状态需要经过-2msl-最大报文短生存时间-才能返回到-close-状态" aria-label="Permalink to &quot;**为什么 TIME_WAIT 状态需要经过 2MSL（最大报文短生存时间）才能返回到 CLOSE 状态？**&quot;">​</a></h4><p>虽然按道理，四次报文都发送完毕，就可以直接进入 CLOSE 状态了，但是我们必须假象网络是不可靠的，有可能最后一个 ACK 丢失。所以 TIME_WAIT 状态就是用来重发可能丢失的 ACK 报文。</p><p>在客户端发送最后的 ACK 恢复，但 ACK 可能丢失。服务端如果没有收到 ACK，将不断重复发送 FIN 片段。所以客户端不能立即关闭，它必须确认服务端接收到了该 ACK。</p><p>客户端会在发送出 ACK 之后进入到 TIME_WAIT 状态。客户端会设置一个计时器，等待 2MSL 时间。如果在该时间内再次收到 FIN，那么客户端会重发 ACK 并在此等到 2MSL。</p><p>2MSL 是 2 倍的 MSL（Maximum Segment Lifetime）。MSL 指一个片段在网络中的最大存活时间，2MSL 就是一个发送和一个回复所需的最大时间。如果直到 2MSL，客户端都没有再次收到 FIN，那么客户端推断 ACK 已经被成功接收，则结束 TCP 连接。</p><h4 id="为什么不能用两次握手进行连接" tabindex="-1"><strong>为什么不能用两次握手进行连接？</strong> <a class="header-anchor" href="#为什么不能用两次握手进行连接" aria-label="Permalink to &quot;**为什么不能用两次握手进行连接？**&quot;">​</a></h4><p>3 次握手完成两个重要功能，既要双方做好发送数据的准备工作，也要允许双方就序列号进行协商，这个序列号在握手过程中被发送和确认。 主机 B 还不能确认主机 A 已经收到确认请求，也是说 B 认为建立好连接，开始发数据了，结果发出去的包一直 A 都没收到，那攻击 B 就很容易了，我专门发包不接收，服务器很容易就挂了。</p><h4 id="如果已经建立了连接-但是客户端突然出现故障了怎么办" tabindex="-1"><strong>如果已经建立了连接，但是客户端突然出现故障了怎么办？</strong> <a class="header-anchor" href="#如果已经建立了连接-但是客户端突然出现故障了怎么办" aria-label="Permalink to &quot;**如果已经建立了连接，但是客户端突然出现故障了怎么办？**&quot;">​</a></h4><p>TCP 还设有一个保活计时器，显然，客户端如果出现故障，服务器不能一直等下去，白白浪费资源。服务器每收到一次客户端的请求后都会重新复位这个计时器，时间通常设置为 2 小时，若 2 小时还没收到客户端的任何数据，服务器就会发送一个探测报文段，以后每隔 75 秒发送一次。若一连发送 10 个探测报文仍没反应，服务器就认为客户端出了故障，接着关闭连接。</p><h2 id="tcp-与-udp-的区别" tabindex="-1">TCP 与 UDP 的区别 <a class="header-anchor" href="#tcp-与-udp-的区别" aria-label="Permalink to &quot;TCP 与 UDP 的区别&quot;">​</a></h2><ul><li>TCP 是面向链接的，而 UDP 是面向无连接的。</li><li>TCP 仅支持单播传输，UDP 提供了单播，多播，广播的功能。</li><li>TCP 的三次握手保证了连接的可靠性; UDP 是无连接的、不可靠的一种数据传输协议，首先不可靠性体现在无连接上，通信都不需要建立连接，对接- 收到的数据也不发送确认信号，发送端不知道数据是否会正确接收。</li><li>UDP 的头部开销比 TCP 的更小，数据传输速率更高，实时性更好。</li></ul>',41),c=[n];function h(C,P,T,d,S,_){return e(),t("div",null,c)}const m=a(s,[["render",h]]);export{I as __pageData,m as default};
