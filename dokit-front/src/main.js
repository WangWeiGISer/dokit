import Vue from 'vue'

// 滚动条插件的包
import PerfectScrollbar from 'perfect-scrollbar'
// 滚动条插件对应的css
import 'perfect-scrollbar/css/perfect-scrollbar.css'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 数据字典
import dict from './components/Dict'

import './utils/error-log' // error log

// 权限指令
import permission from './components/Permission'
import './assets/styles/element-variables.scss'
// global css
import './assets/styles/index.scss'

// 代码高亮
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import App from './App'
import store from './store'
import router from './router/routers'

import './assets/icons' // icon
import './router/index' // permission control

const elScrollBar = (el) => {
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update()
  } else {
    el._ps_ = new PerfectScrollbar(el, { suppressScrollX: true })
  }
}

Vue.directive('scrollBar', {
  inserted(el, binding, vnode) {
    const rules = ['fixed', 'absolute', 'relative']
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join('、')}`)
    }
    elScrollBar(el)
  },
  componentUpdated(el, binding, vnode, oldVnode) {
    try {
      vnode.context.$nextTick(
        () => {
          elScrollBar(el)
        }
      )
    } catch (error) {
      console.error(error)
      elScrollBar(el)
    }
  }
})

Vue.use(VueHighlightJS)
Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(dict)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
