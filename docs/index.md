---
layout: home
layoutClass: 'm-home-layout'

hero:
  name: Steins Gate
  text: 前端记录
  tagline: 知识是进步的阶梯，争取每天都有知识点更新
  image:
    src: /logo.jpg
    alt: Steins Gate
  actions:
    - text: 前端知识
      link: /base/javaScript/dataType
    - text: 前端导航
      link: /nav
      theme: alt
features:
  - icon: 📖
    title: 常用知识
    details: 整理前端常用知识点<small>（面试八股文）</small><br />完整自己的前端生态知识
    link: /base/javaScript/dataType
    linkText: 前端常用知识
  - icon: 📘
    title: 源码阅读
    details: 了解各种库的实现原理<br />学习其中的设计思路和知识
    link: /react/source/fiber
    linkText: 源码阅读
  - icon: 💡
    title: Work
    details: 在工作中用到的一切<small>（常用工具等）</small><br />配合 CV 大法来加快你的开发😄
    link: /work/utility/ni
    linkText: 常用工具库
  # - icon: 🧰
  #   title: 提效工具
  #   details: 工欲善其事，必先利其器<br />记录开发和日常使用中所用到的软件、插件、扩展等
  #   link:
  #   linkText: 提效工具
  # - icon: 🐞
  #   title: 踩坑记录
  #   details: 那些年我们踩过的坑<br />总有一些让你意想不到的问题
  #   link:
  #   linkText: 踩坑记录
  - icon: 💯
    title: 记录、总结、深入。
    details: '<small class="bottom-small">不断学习、进步</small>'
    link:
---

<style>
/*爱的魔力转圈圈*/
.m-home-layout .image-src:hover {
  transform: translate(-50%, -50%) rotate(666turn);
  transition: transform 59s 1s cubic-bezier(0.3, 0, 0.8, 1);
}

.m-home-layout .details small {
  opacity: 0.8;
}

.m-home-layout .item:last-child .details {
  display: flex;
  justify-content: flex-end;
  align-items: end;
}
</style>
