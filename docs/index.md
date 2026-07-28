---
layout: home
layoutClass: 'm-home-layout'

hero:
  name: Steins Gate
  text: 知识记录
  tagline: Knowledge is power
  image:
    src: /logo.jpg
    alt: Steins Gate
  actions:
    - text: 知识
      link: /base/javaScript/dataType
    - text: 导航
      link: /nav
      theme: alt
features:
  - icon: 📖
    title: 常用知识
    details: 整理前端常用知识点<br />完整自己的前端生态知识
    link: /base/javaScript/dataType
    linkText: 前端常用知识
  - icon: 📘
    title: 源码阅读
    details: 了解各种库的实现原理<br />学习其中的设计思路和知识
    link: /rsource/react/file
    linkText: 源码阅读
  - icon: 💡
    title: Work
    details: 在工作中用到的一切<small>（常用工具/方法）</small><br />配合 CV 大法来加快你的开发😄
    link: /work/standard/code
    linkText: 常用工具库
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
