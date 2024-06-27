import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/HomeLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView
      }
    ]
  },
  {
    path: '/about',
    component: () => import('@/layouts/HomeLayout.vue'),
    children: [
      {
        path: '',
        name: 'about',
        component: () => import('@/views/AboutView.vue')
      }
    ]
  },
  {
    path: '/contract/:network/:address',
    redirect: { name: 'contract' },
    component: () => import('@/views/ContractView.vue'),
    props: true,
    children: [
      {
        path: 'contract',
        name: 'contract',
        component: () => import('@/components/Contract.vue')
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: () => import('@/components/TransactionList.vue')
      },
      {
        path: 'analysis',
        name: 'analysis',
        component: () => import('@/components/Analysis.vue')
      },
      {
        path: 'update',
        name: 'update',
        component: () => import('@/components/Update.vue')
      },
      {
        path: 'evolution',
        name: 'evolution',
        component: () => import('@/components/Evolution.vue')
      }
    ]
  },

  // otherwise redirect to home
  { path: '/:catchAll(.*)', redirect: '/' }
]

export { routes }
