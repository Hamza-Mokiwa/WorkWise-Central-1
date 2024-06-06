import { createRouter, createWebHistory } from 'vue-router'
import SplashView from '../views/SplashView.vue'

import RegisterCompanyModal from '../components/RegisterCompanyModal.vue'
import JoinCompanyModal from '../components/JoinCompanyModal.vue'
import ClientDetails from '../components/AddClient.vue'
import AddEmployee from '../components/AddEmployee.vue'
import JobDetailsModal from '../components/JobDetailsModal.vue'
import JobDetailsList from '../components/JobDetailsList.vue'
import Modals from '../views/Modals.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register-company',
      name: 'registercompany',
      component: RegisterCompanyModal
    },
    {
      path: '/join-company',
      name: 'joincompany',
      component: JoinCompanyModal
    },
    {
      path: '/add-client',
      name: 'addclient',
      component: ClientDetails
    },
    {
      path: '/add-employee',
      name: 'addemployee',
      component: AddEmployee
    },
    {
      path: '/add-job',
      name: 'addjob',
      component: JobDetailsList
    },
    {
      path: '/details-of-job',
      name: 'detailsofjob',
      component: JobDetailsModal
    },
    {
      path: '/',
      name: 'splash',
      component: SplashView
    },
    {
      path: '/modals',
      name: 'modals',
      component: Modals
    }
  ]
})

export default router
