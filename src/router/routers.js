import Main from '_c/main'
import Main1 from '_c/main1'
import Main2 from '_c/main2'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/login',
    component: Main1,
    meta: {
      hideInBread: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/home/homepage.vue')
      }
    ]
  },

  {
    path: '/status_monitoring',
    name: 'status_monitoring',
    meta: {
      icon: 'md-git-branch',
      title: '状态监测'
    },
    component: () => import('@/view/components/status-monitor/index.vue'),
    children: [
      {
        path: 'SM',
        name: 'SM',
        meta: {
          changeInfo:'SM',
          icon: 'md-git-branch',
          title: '状态监测'
        },
      },
      {
        path: 'FD',
        name: 'FD',
        meta: {
          changeInfo:'FD',
          icon: 'md-git-branch',
          title: '故障监测'
        },
      },
      {
        path: 'LP',
        name: 'LP',
        meta: {
          changeInfo:'LD',
          icon: 'md-git-branch',
          title: '寿命预测'
        },
      },
      {
        path: 'MD',
        name: 'MD',
        meta: {
          changeInfo:'MD',
          icon: 'md-git-branch',
          title: '维修决策'
        },
      }
    ]
  },

  {
    path: '/status_monitor_main',
    name: 'status_monitor_main',
    meta: {
      icon: 'md-git-branch',
      title: '状态监测主页'
    },
    component: () => import('@/view/components/status-monitor-main/index.vue')
  },
  {
    path: '/components',
    name: 'components3',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'fault_data',
        name: 'fault_data',
        meta: {
          icon: 'md-git-branch',
          title: '故障数据'
        },
        component: () => import('@/view/components/fault-data/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'life_data',
        name: 'life_data',
        meta: {
          icon: 'md-git-branch',
          title: '寿命数据'
        },
        component: () => import('@/view/components/life-data/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components5',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'mainten_decision',
        name: 'mainten_decision',
        meta: {
          icon: 'md-git-branch',
          title: '维修决策'
        },
        component: () => import('@/view/components/mainten-deci/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components2',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'log_manage',
        name: 'log_manage',
        meta: {
          icon: 'md-git-branch',
          title: '日志管理'
        },
        component: () => import('@/view/components/log-manage/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components6',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'spare_manage',
        name: 'spare_manage',
        meta: {
          icon: 'md-git-branch',
          title: '备件管理'
        },
        component: () => import('@/view/components/spare-manage/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components7',
    meta: {
      hideInBread: true
    },
    component: Main2,
    children: [
      {
        path: 'user_manage',
        name: 'user_manage',
        meta: {
          icon: 'md-git-branch',
          title: '用户管理'
        },
        component: () => import('@/view/components/user-manage/index.vue')
      }
    ]
  },

]
