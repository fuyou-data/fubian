const limitRouters = [
  {
    path: 'organ',
    name: '部门管理',
    meta: {
      role: 'admin_org'
    },
    component: resolve => require(['../views/organ/index.vue'], resolve)
  },
  {
    path: 'overview',
    name: '数据概览',
    meta: {
      role: 'admin_org'
    },
    component: resolve => require(['../views/overview/index.vue'], resolve)
  },
  {
    path: 'members',
    name: '成员管理',
    meta: {
      role: 'admin_org'
    },
    component: resolve => require(['../views/members/list.vue'], resolve)
  },
  {
    path: 'batch',
    name: '批次管理',
    component: resolve => require(['../views/batch/list.vue'], resolve),
    meta: {
      keepAlive: true,
      role: 'admin_org'
    }
  },
  {
    path: 'batch/add',
    name: '添加批次',
    meta: { type: 'add', role: 'admin_org' },
    component: resolve => require(['../views/batch/info.vue'], resolve)
  },
  {
    path: 'batch/edit',
    name: '编辑批次',
    meta: { type: 'edit', role: 'admin_org' },
    component: resolve => require(['../views/batch/info.vue'], resolve)
  },
  {
    path: 'batch/statistic',
    name: '批次数据统计',
    meta: {
      role: 'admin_org'
    },
    component: resolve => require(['../views/batch/statistic.vue'], resolve)
  },
  {
    path: 'batch/detail',
    name: '批次详情',
    meta: {
      role: 'admin_org'
    },
    component: resolve => require(['../views/batch/detail.vue'], resolve)
  },
  {
    path: '/operate/list',
    name: 'list',
    component: resolve => require(['../views/operate/list.vue'], resolve),
    meta: {
      keepAlive: true,
      role: 'admin_table'
    }
  },
  {
    path: '/operate/classList',
    name: '自评分类',
    meta: {
      role: 'admin_table'
    },
    component: resolve => require(['../views/operate/class-list.vue'], resolve)
  },
  {
    path: '/setting',
    name: '参数配置',
    component: resolve => require(['../views/operate/operation-set/setting.vue'], resolve),
    meta: {
      role: 'admin_table'
    },
    redirect: '/setting/info',
    children: [
      {
        path: '/setting/info',
        name: '量表信息编辑',
        meta: { step: 1 },
        component: resolve => require(['../views/operate/operation-set/set-items/info.vue'], resolve)
      },
      {
        path: '/setting/content',
        name: '量表内容编辑',
        meta: { step: 2 },
        component: resolve => require(['../views/operate/operation-set/set-items/content/content.vue'], resolve)
      },
      {
        path: '/setting/set',
        name: '分数设置编辑',
        meta: { step: 3 },
        component: resolve => require(['../views/operate/operation-set/set-items/set/set.vue'], resolve)
      },
      {
        path: '/setting/show',
        name: '报告展示编辑',
        meta: { step: 4 },
        component: resolve => require(['../views/operate/operation-set/set-items/show.vue'], resolve)
      }
    ]
  },
  {
    path: '/read',
    name: '参数配置read',
    meta: {
      role: 'admin_table'
    },
    component: resolve => require(['../views/operate/operation-set/read.vue'], resolve),
    redirect: '/read/info',
    children: [
      {
        path: '/read/info',
        name: '量表信息',
        component: resolve => require(['../views/operate/operation-set/read-items/info.vue'], resolve)
      },
      {
        path: '/read/content',
        name: '量表内容',
        component: resolve => require(['../views/operate/operation-set/read-items/content.vue'], resolve)
      },
      {
        path: '/read/set',
        name: '分数设置',
        component: resolve => require(['../views/operate/operation-set/read-items/set.vue'], resolve)
      },
      {
        path: '/read/show',
        name: '报告展示',
        component: resolve => require(['../views/operate/operation-set/read-items/show.vue'], resolve)
      }
    ]
  },
  {
    path: 'tasks-manage',
    name: '任务管理',
    meta: {
      role: 'admin_org'
    },
    component: resolve => require(['../views/task/task.vue'], resolve)
  }
]
export default limitRouters
