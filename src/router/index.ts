// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { flatten } from 'ramda';
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

import http from '@/api/http';
import { useAuthStore } from '@/modules/auth/store';
import NotFound from '@/components/common/NotFound.vue';
import { LAST_ACTIVE_TIMEOUT } from '@/modules/auth/constant';
import { useToast } from '@/composables/useToast';

const toast = useToast();
const routes = import.meta.glob('@/modules/**/routes.ts', {
  eager: true,
});

const convertRoutes = flatten(
  Object.keys(routes).map((item) => routes[item].default),
).map((route) => {
  const routeMeta = route.meta || {};
  const layout = routeMeta.layout || '';
  if (!layout) {
    routeMeta.layout = 'default';
  }
  return {
    ...route,
    meta: routeMeta,
  } as RouteRecordRaw;
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...convertRoutes,
    {
      path: '/:pathMatch(.*)*', // This catches all undefined routes
      name: 'NotFound',
      component: NotFound,
    },
  ],
  scrollBehavior() {
    const element = document.getElementById('main');
    if (element?.scrollTop > 0) {
      element.scrollTop = 0;
    }
    return;
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!['login'].includes(to.name)) {
    if (!authStore.token) {
      return router.push({
        name: 'login',
      });
    } else {
      if (
        !authStore.lastActive ||
        Date.now() - authStore.lastActive >
          LAST_ACTIVE_TIMEOUT
      ) {
        toast.show({
          variant: 'primary',
          message: 'Session timeout, please login again',
        });
        return authStore.logout();
      }
    }
  } else {
    if (authStore.token) {
      try {
        // await authStore.me();
        next({
          name: 'home',
        });
      } catch (error) {
        next();
      }
    }
  }
  next();
});

export default router;
