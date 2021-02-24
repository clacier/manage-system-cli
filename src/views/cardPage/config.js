import { getList, add, edit, deleteNode } from '@/api/supplier/manage'
import { message } from 'ant-design-vue'
const config = {
  pageAction: [
    {
      type: 'add',
      btnText: '新建供应商'
    }
  ],
  api: {
    add: add,
    del: deleteNode,
    edit: edit,
    getList: getList
  },
  //   弹框标题
  modalTitleText: {
    add: '新建',
    edit: '修改',
    detail: '详情'
  },
  // 卡片样式配置
  cardStyleConfig: {
    width: '300px',
    height: '',
    margin: '',
    padding: '',
    color: '',
    fontSize: '',
    background: ''
  },
  // 是否分页
  showPagination: true,
  // 分页字段名
  pageInfo: {
    pageSize: 'pageSize',
    pageNum: 'pageNum',
    total: 'total'
  },
  // 弹窗宽度
  modalWidth: {
    edit: 800,
    detail: 800
  },
  addBtnText: '新建内容',
  editBtnText: '新建内容',
  // 页面顶部搜索配置项
  searchList: [
    {
      label: '供应商名称',
      placeholder: '请输入名称',
      key: 'name', // 字段名称
      type: '' // 表单类型 (text,password,select,date,number,radio,checkbox)
    },
    {
      placeholder: '请选择创建日期',
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
      key: 'name', // 字段名
      type: '', // 表单类型 (text,password,select,date,number,radio,checkbox,slot)
      required: true //是否必填
    },
    {
      label: '密码',
      placeholder: '请输入密码(6-10位)',
      key: 'password', // 字段名称
      type: 'password',
      rules: {
        max: 10, //最大长度 Number
        min: 6,
        // pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/, // 正则校验
        message: '请正确输入密码' //报错信息
      },
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
      label: '自定义',
      key: 'kaiguan',
      type: 'slot',
      slotName: 'aa',
      required: true //是否必填
    },

    {
      label: '类型',
      key: 'type',
      type: 'radio',
      initValue: 1,
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
  //  卡片操作配置项
  actionList: [
    {
      type: 'edit',
      fieldName: 'name',
      showCondition: item => {
        return item.name === 'name3'
      }
    },

    {
      type: 'detail'
      // showCondition: item => {
      //   console.log(item.name === 'name2')
      //   return item.name === 'name2'
      // }
    },
    {
      type: 'delete',
      fieldName: 'name',
      btnType: 'danger',
      //   showCondition: item => {
      //     return item.name === 'name2'
      //   },
      promptContent: '确定删除该供应商？'
    }
  ],
  //   新增弹窗中表单的参数(用于二次校验或者需要自定义参数) 使用此函数需要返回重新定义的表单参数，无返回会当做校验不成功
  submitFunc: (values, self) => {
    //values-表单数据   self当前页面本身 可以理解为组件中的this
    let data = values
    console.log(self)
    return data
  },
  delOkFunc: (item, self) => {
    //item 当前操作对象
    //用于删除时的二次校验  返回值为true || false
    console.log(item)
    // return true
  },
  // 查询参数
  searchFunc: (values, self) => {
    console.log(values)
    return values
  },
  //   格式化list
  formatList: (res, currtPage, pageSize) => {
    //res- 请求列表接口返回值
    return res.data.list || []
  }
}
export default config
