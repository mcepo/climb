import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Overview from '../components/Overview.vue'
import AreaDetails from '../components/details/AreaDetails.vue'
import RouteDetails from '../components/details/RouteDetails.vue'
import MapPlaceholder from '../components/map/MapPlaceholder.vue'

import store from '../store'

Vue.use(VueRouter)

const AdminPanel = () => import(/* webpackChunkName: "admin.panel" */'../views/AdminPanel.vue')
const PrivacyPolicy = () => import(/* webpackChunkName: "privacy.policy" */'../components/PrivacyPolicy.vue')
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
          sidebar: Overview,
          content: MapPlaceholder
        }
      },
      {
        path: '/privacy',
        components: {
          sidebar: Overview,
          content: PrivacyPolicy
        }
      },
      {
        path: 'image/:imageId',
        components: {
          sidebar: Overview,
          content: MapPlaceholder
        }
      },
      {
        // /a/croatia-paklenica-anica_kuk-trapez/123
        path: 'a/:path/:areaId',
        components: {
          sidebar: AreaDetails,
          content: MapPlaceholder
        }
      },
      {
        // /a/croatia-paklenica-anica_kuk-trapez/123/image/1
        path: 'a/:path/:areaId/image/:imageId',
        components: {
          sidebar: AreaDetails,
          content: MapPlaceholder
        }
      },
      {
        // /r/croatia-paklenica-anica_kuk-trapez-mosoraski/123
        path: 'r/:path/:routeId',
        components: {
          sidebar: RouteDetails,
          content: MapPlaceholder
        }
      },
      {
        // /r/croatia-paklenica-anica_kuk-trapez-mosoraski/123/image/1
        path: 'r/:path/:routeId/image/:imageId',
        components: {
          sidebar: RouteDetails,
          content: MapPlaceholder
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
      store.dispatch('auth/authorizeOnlyAdmin').then(() => {
        next()
      }).catch(() => { /* so the error won't get dumped in the console */ })
    },
    children: [
      {
        path: '',
        components: {
          sidebar: AdminMenuList,
          content: UsersPage
        }
      },
      {
        path: 'users',
        components: {
          sidebar: AdminMenuList,
          content: UsersPage
        }
      },
      {
        path: 'user/:id',
        components: {
          sidebar: AdminMenuList,
          content: UserOverviewPage
        }
      },
      {
        path: 'images',
        components: {
          sidebar: AdminMenuList,
          content: ImagesPage
        }
      },
      {
        path: 'activities',
        components: {
          sidebar: AdminMenuList,
          content: ActivityLogPage
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// solution on how to change one view and keep the other as is
// not a very good solution

export function getUrl (type: string, id: string) {
  const newParams = { ...router.currentRoute.params }

  let path: string = store.getters.urlPath(type, id)

  if (!path) {
    path = newParams.path
  }

  path += '/'

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
    url = '/a/' + path + newParams.areaId
  } else if (newParams.routeId) {
    url = '/r/' + path + newParams.routeId
  }

  if (newParams.imageId) {
    url += '/image/' + newParams.imageId
  }

  return url === '' ? '/' : url
}

export default router
