<script setup lang="ts">
import { inject, Ref } from 'vue'

const DEV = inject('DEV') as Ref<boolean>
</script>

<template>
  <div class="copyright">
    <div>如有转载或 CV 的请标注本站原文地址</div>
    <div class="copy">
      <img
        v-if="!DEV"
        class="visitor"
        src="https://visitor-badge.laobi.icu/badge?page_id=azzlzzxz.azzlzzxz.github.io"
        onerror="this.style.display='none'"
      />
      Copyright © 2021-present azzlzzxz
    </div>
  </div>
</template>

<style scoped>
.copyright {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  border-top: 1px solid var(--vp-c-gutter);
  padding: 32px 24px;
  font-size: 14px;
  background-color: var(--vp-c-bg);
}

.copy {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.visitor {
  margin-right: 8px;
}

@media (max-width: 414px) {
  .visitor {
    display: none;
  }
}
</style>
