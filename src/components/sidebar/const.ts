import { reactive } from 'vue';

export interface Router {
  name: string;
  query?: { [key: string]: string };
  params?: { [key: string]: string };
  path?: string;
}

export interface SidebarRouter {
  id?: string;
  name: string;
  icon?: string;
  iconMobile?: string;
  permissions: string[];
  router?: Router;
  children?: SidebarRouter[];
  isOpen?: boolean;
  orderMobile?: number;
  isNew?: boolean;
}

const sidebar: SidebarRouter[] = reactive([
  {
    id: 'insight',
    name: 'Insights',
    icon: 'home-line',
    permissions: [],
    router: {
      name: 'home',
    },
    children: [
      {
        id: 'sale-report',
        name: 'Sales report',
        iconMobile: 'bar-line-chart',
        permissions: [],
        router: {
          name: 'sale-report',
        },
      },
      {
        id: 'fulfillment-report',
        name: 'Fulfillment report',
        iconMobile: 'bar-chart-square-01',
        permissions: [],
        router: {
          name: 'fulfillment-report',
        },
      },
    ],
    orderMobile: 1,
  },
  {
    id: 'orders',
    name: 'Orders',
    icon: 'presentation-chart-01',
    permissions: [],
    router: {
      name: 'orders',
    },
    orderMobile: 3,
  },
  {
    id: 'catalog',
    name: 'Catalog',
    icon: 'layers-three-01',
    permissions: [],
    router: {
      name: 'catalog',
    },
    orderMobile: 2,
  },
  {
    id: 'wallet',
    name: 'Wallet',
    icon: 'wallet-01',
    permissions: [],
    router: {
      name: 'wallet',
    },
    orderMobile: 4,
    isNew: true,
  },
  {
    id: 'claim',
    name: 'Claim',
    icon: 'check-done-01',
    permissions: [],
    router: {
      name: 'claim',
    },
  },
  {
    id: 'api',
    name: 'API',
    icon: 'dataflow-04',
    permissions: [],
    router: {
      name: 'api',
    },
  },
  {
    id: 'changelog',
    name: 'Changelog',
    icon: 'bell-01',
    permissions: [],
    router: {
      name: 'changelog',
    },
  },

  // {
  //   id: 'payment',
  //   name: 'Payment',
  //   icon: 'credit-card-02',
  //   permissions: [],
  //   router: {
  //     name: 'payment',
  //   },
  //   children: [
  //     {
  //       id: 'wallet',
  //       name: 'Wallet',
  //       permissions: [],
  //       router: {
  //         name: 'wallet',
  //       },
  //     },
  //     {
  //       id: 'receipts',
  //       name: 'Receipts',
  //       permissions: [],
  //       router: {
  //         name: 'receipts',
  //       },
  //     },
  //     {
  //       id: 'transactions',
  //       name: 'Transactions',
  //       permissions: [],
  //       router: {
  //         name: 'transactions',
  //       },
  //     },
  //   ],
  // },
]);

export default sidebar;
