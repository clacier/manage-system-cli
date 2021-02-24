import { PageView } from '@/layouts'
const exampleRouter = {
  path: '/Example',
  name: 'Example',
  component: PageView,
  redirect: '/Example/component',
  meta: {
    title: '示例',
    icon: 'menu'
  },
  children: [
    {
      path: '/Example/component',
      name: 'Example',
      component: () => import('@/views/Example/component'),
      meta: {
        title: '组件示例',
        keepAlive: false
      }
    },
    {
      path: '/Example/compontentExplain',
      name: 'compontentExplain',
      component: () => import('@/views/compontentExplain'),
      meta: {
        title: '组件说明',
        keepAlive: false
      }
    },
    {
      path: '/tablePage',
      name: 'tablePage',
      component: () => import('@/views/tablePage'),
      meta: {
        title: '配置化表格页示例',
        keepAlive: false
      }
    },
    {
      path: '/cardPage',
      name: 'cardPage',
      component: () => import('@/views/cardPage'),
      meta: {
        title: '配置化卡片页示例',
        keepAlive: false
      }
    },
    {
      path: '/multileveTablePage',
      name: 'multileveTablePage',
      component: () => import('@/views/multileveTablePage'),
      meta: {
        title: '配置化多级表头表格页示例',
        keepAlive: false
      }
    }
  ]
}
export default exampleRouter
