import { createApp } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCalendarAlt, faHardHat, faChalkboardTeacher, faUsersCog, faHandHoldingWater, faLuggageCart, faHouseUser, faSearch, faShieldAlt, faChevronRight, faChevronDown} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './assets/sass/main.scss'

library.add(faCalendarAlt)
library.add(faHardHat)
library.add(faChalkboardTeacher)
library.add(faUsersCog)
library.add(faHandHoldingWater)
library.add(faLuggageCart)
library.add(faHouseUser)
library.add(faSearch)
library.add(faShieldAlt)
library.add(faChevronRight)
library.add(faChevronDown)

//App.component('font-awesome-icon', FontAwesomeIcon)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')