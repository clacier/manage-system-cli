import { getList, add, edit, deleteNode } from '@/api/collectionNode/manage'

const config = {
  pageAction: [
    {
      type: 'add',
      text: '新建内容'
    }
  ],
  api: {
    add: add,
    del: deleteNode,
    edit: edit,
    getList: getList
  },
  modalWidth: 600,
  addBtnText: '新建内容',
  editText: '修改内容',
  // 页面顶部搜索配置项
  searchList: [
    {
      placeholder: '请输入名称',
      key: 'searchText',
      type: 'text'
    },
    {
      placeholder: '请选择日期',
      key: 'startDate',
      type: 'date',
      showTime: true
    }
  ],
  //  新增表单配置项
  formList: [
    {
      label: '名称',
      placeholder: '请输入名称',
      key: 'name', // 字段名称
      type: '', // 表单类型 (text,select,date,dateTime,number,radio,checkbox)
      required: true //是否必填
    },
    {
      label: '日期',
      placeholder: '请选择日期',
      key: 'date',
      showTime: true,
      type: 'date',
      required: true //是否必填
    },
    {
      label: '开关',
      key: 'kaiguan',
      type: 'switch',
      required: false //是否必填
    },

    {
      label: '类型',
      key: 'type',
      type: 'radio',
      option: [
        {
          name: '大',
          value: 1
        },
        {
          name: '小',
          value: 2
        }
      ],
      required: true //是否必填
    },
    {
      label: '类型2',
      key: 'type2',
      placeholder: '请选择类型',
      type: 'checkbox',
      option: [
        {
          name: '大',
          value: 1
        },
        {
          name: '小',
          value: 2
        }
      ],
      required: false //是否必填
    },
    {
      label: '选择菜单',
      placeholder: '请选择菜单',
      key: 'select',
      option: [
        {
          name: '甲',
          value: '1'
        },
        {
          name: '乙',
          value: '2'
        },
        {
          name: '丙',
          value: '3'
        },
        {
          name: '丁',
          value: '4'
        }
      ],
      type: 'select',
      required: false //是否必填
    },
    {
      label: '备注',
      placeholder: '请输入备注',
      key: 'remark', // 字段名称
      type: 'textarea', // 表单类型 (text,select,date,dateTime,number,radio)
      required: false //是否必填
    }
  ],
  //  表格配置项
  cloums: [
    {
      title: 'Mi',
      width: screen.availWidth * 0.2,
      key: 'name',
      align: 'center'
    },
    {
      title: '头像',
      width: screen.availWidth * 0.2,
      key: 'avatar',
      scopedSlots: 'name2',
      renderContent: item => {
        return `<img  src='https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3361206748,3418038780&fm=26&gp=0.jpg'  style='width:100px '/>`
      },
      align: 'center'
    },
    {
      title: 'Md',
      width: screen.availWidth * 0.2,
      key: 'md',
      scopedSlots: 'name2',
      renderContent: item => {
        return `<span  style=display:${item.name === 'name2' ? 'block' : 'none'} >${item.name}222<span>`
      },
      align: 'center'
    },
    {
      title: '操作',
      width: 200,
      key: 'action',
      scopedSlots: 'action',
      actionList: [
        {
          type: 'delete',
          fieldName: 'name',
          text: '删除',
          btnType: 'danger',
          showCondition: item => {
            return item.name === 'name2'
          },
          promptContent: '确定删除该项数据？'
        },
        {
          type: 'edit',
          text: '修改',
          fieldName: 'name',
          showCondition: item => {
            return item.name === 'name3'
          }
        }
      ],
      align: 'center'
    }
  ],
  formatList: res => {
    return res.data.list || []
  },
  virtualScrollOpen: true, //是否开启虚拟滚动渲染
  tableItemH: 100, // 每行高度
  tableItemNum: 4 // 展示行数
}
export default config
