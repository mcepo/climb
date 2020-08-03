import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Overview from '../components/Overview.vue'
import AreaDetails from '../components/details/AreaDetails.vue'
import RouteDetails from '../components/details/RouteDetails.vue'
import LeafletMap from '../components/map/LeafletMap.vue'
import ImageMap from '../components/map/ImageMap.vue'

import store from '../store'

Vue.use(VueRouter)

const AdminPanel = () => import(/* webpackChunkName: "admin.panel" */'../views/AdminPanel.vue')
const AdminMenuList = () => import(/* webpackChunkName: "admin.panel" */'../admin/components/lists/MenuList.vue')
const UsersPage = () => import(/* webpackChunkName: "admin.panel" */'../admin/pages/UsersPage.vue')
const ActivityLogPage = () => import(/* webpackChunkName: "admin.panel" */'../admin/pages/ActivityLogPage.vue')
const ImagesPage = () => import(/* webpackChunkName: "admin.panel" */'../admin/pages/ImagesPage.vue')
const UserOverviewPage = () => import(/* webpackChunkName: "admin.panel" */'../admin/pages/UserOverviewPage.vue')

const routes = [
  {
    path: '/',
    component: Dashboard,
    children: [
      {
        path: '',
        components: {
          default: Overview,
          map: LeafletMap
        }
      },
      {
        path: 'image/:imageId',
        components: {
          default: Overview,
          map: ImageMap
        }
      },
      {
        path: 'area/:areaId',
        components: {
          default: AreaDetails,
          map: LeafletMap
        }
      },
      {
        path: 'area/:areaId/image/:imageId',
        components: {
          default: AreaDetails,
          map: ImageMap
        }
      },
      {
        path: 'route/:routeId',
        components: {
          default: RouteDetails,
          map: LeafletMap
        }
      },
      {
        path: 'route/:routeId/image/:imageId',
        components: {
          default: RouteDetails,
          map: ImageMap
        }
      },
      // TODO: is this really needed
      {
        path: '/auth/:provide/callback',
        component: {
          template: '<div class="auth-component"></div>'
        }
      }
    ]
  },
  // admin panel routes
  {
    path: '/admin',
    component: AdminPanel,
    // making sure only admin users get here
    beforeEnter: (to, from, next) => {
      const isLogged = store.getters['auth/check']

      if (isLogged) {
        const isAdmin = store.getters['auth/isAdmin']
        if (isAdmin) {
          next()
        } else {
          store.commit('snackbar/throwError', 403)
        }
      } else {
        store.dispatch('form/open', { component: 'login-form', params: null })
      }
    },
    children: [
      {
        path: '',
        components: {
          default: AdminMenuList,
          content: UsersPage
        }
      },
      {
        path: 'users',
        components: {
          default: AdminMenuList,
          content: UsersPage
        }
      },
      {
        path: 'user/:id',
        components: {
          default: AdminMenuList,
          content: UserOverviewPage
        }
      },
      {
        path: 'images',
        components: {
          default: AdminMenuList,
          content: ImagesPage
        }
      },
      {
        path: 'activities',
        components: {
          default: AdminMenuList,
          content: ActivityLogPage
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// solution on how to change one view and keep the other as is
// no a very good solution

export function getUrl (type: string, id: string) {
  const newParams = { ...router.currentRoute.params }

  if (type === 'image') {
    newParams.imageId = id
  } else if (type === 'area') {
    delete newParams.routeId
    newParams.areaId = id
  } else {
    delete newParams.areaId
    newParams.routeId = id
  }

  let url = ''

  if (newParams.areaId) {
    url = '/area/' + newParams.areaId
  } else if (newParams.routeId) {
    url = '/route/' + newParams.routeId
  }

  if (newParams.imageId) {
    url += '/image/' + newParams.imageId
  }

  return url === '' ? '/' : url
}

export default router
