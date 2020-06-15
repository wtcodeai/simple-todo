import Vue from 'vue'
import App from './App'
import { firestorePlugin } from 'vuefire'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false
Vue.config.devtools = true

Vue.use(firestorePlugin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
