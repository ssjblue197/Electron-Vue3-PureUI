import type { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/login',
    name: 'login',
    component: async () =>
      import('@/modules/auth/pages/Login.vue'),
    meta: {
      layout: 'default',
    },
  },
  {
    path: '/support-login',
    name: 'support-login',
    component: async () =>
      import('@/modules/auth/pages/Login.vue'),
    meta: {
      layout: 'default',
    },
  },
] as RouteRecordRaw[];
