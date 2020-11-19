<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
      <div class="loading_box" v-if="$store.state.loading">
        <a-spin tip="加载中..." style="width: 50vw">
          <div class="spin-content"></div>
        </a-spin>
      </div>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data() {
    return {
      locale: zhCN,
    }
  },
  computed: {
    // locale() {
    //   // 只是为了切换语言时，更新标题
    //   const { title } = this.$route.meta
    //   title && setDocumentTitle(`${i18nRender(title)} - ${domTitle}`)
    //   return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    // }
  },
}
</script>
<style lang="less" scoped>
.loading_box {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  .spin-content {
  }
}
</style>
