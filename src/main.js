// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import { pagination, empty } from 'ant-design-vue'
import { Table, Modal } from '@/my-components'
// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'
import bootstrap from './core/bootstrap'
import './core/lazy_use'
// import './permission' // permission control
import './utils/filter' // global filter
import './global.less'
Vue.component(Table.name, Table)
Vue.component(Modal.name, Modal)
Vue.config.productionTip = false
// mount axios to `Vue.$http` and `this.$http`
Vue.use(pagination)
Vue.use(empty)
Vue.use(VueAxios)
Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)
window.umi_plugin_ant_themeVar = themePluginConfig.theme
if (process.env.NODE_ENV === 'development') {
  window.BASE_URL = 'http://192.168.0.150:9922/' + 'cloudstore-server-dev/api'
} else {
}
new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
