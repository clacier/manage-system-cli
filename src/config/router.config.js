// eslint-disable-next-line
import {
  UserLayout,
  BasicLayout,
  RouteView,
  PageView
} from '@/layouts'
// import {
//   bxAnaalyse
// } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '数据采集',
      hiddenHeaderContent: false
    },
    redirect: '/collectionNode',
    children: [{
        path: '/collectionNode',
        name: 'collectionNode',
        component: PageView,
        redirect: '/collectionNode/manage',
        meta: {
          title: '采集点',
          icon: 'check-circle-o',
        },
        children: [{
            path: '/collectionNode/manage',
            name: 'collectionNodeManage',
            component: () => import('@/views/collectionNode/manage'),
            meta: {
              title: '站点管理',
              keepAlive: false,

            }
          },
          {
            path: '/collectionNode/taskManage',
            name: 'collectionNodeTaskManage',
            component: () => import('@/views/collectionNode/taskManage'),
            meta: {
              title: '站点任务',
              keepAlive: false,
            }
          },
          {
            path: '/collectionNode/register',
            name: 'collectionNodeRegister',
            component: () => import('@/views/collectionNode/create'),
            meta: {
              title: '站点注册',
              keepAlive: false,
            }
          },
        ]
      },
      {
        path: '/collectionSource',
        name: 'collectionSource',
        component: PageView,

        redirect: '/collectionSource/manage',
        meta: {
          title: '采集源',
          icon: 'check-circle-o',
        },
        children: [{
          path: '/collectionSource/manage',
          name: 'collectionSourceManage',
          component: () => import('@/views/collectionSource/manage'),
          meta: {
            title: '采集源管理',
            keepAlive: false,
            // hiddenHeaderContent: true,
          }
        }]
      },


      // result
      {
        path: '/result',
        name: 'result',
        component: RouteView,
        redirect: '/result/success',
        meta: {
          title: '结果页',
          icon: 'check-circle-o',
          permission: ['result']
        },
        children: [{
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import('@/views/result/Success'),
            meta: {
              title: '成功',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['result']
            }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import('@/views/result/Error'),
            meta: {
              title: '失败',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['result']
            }
          }
        ]
      },
      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: {
          title: '异常页',
          icon: 'warning',
          permission: ['exception']
        },
        children: [{
            path: '/exception/403',
            name: 'Exception403',
            component: () => import('@/views/exception/403'),
            meta: {
              title: '403',
              permission: ['exception']
            }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import('@/views/exception/404'),
            meta: {
              title: '404',
              permission: ['exception']
            }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import('@/views/exception/500'),
            meta: {
              title: '500',
              permission: ['exception']
            }
          }
        ]
      },
      // other
      /*
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }
      */
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [{
        path: 'login',
        name: 'login',
        component: () => import('@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import('@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/exception/404')
  }
]