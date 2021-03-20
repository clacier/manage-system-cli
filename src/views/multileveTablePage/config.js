import { getList, add, edit, deleteNode } from '@/api/supplier/manage'
import { message } from 'ant-design-vue'
const config = {
  //   页面全局操作
  pageAction: [
    {
      type: 'export',
      btnText: '导出'
    },
    {
      type: 'add',
      btnText: '新建内容'
    }
  ],
  //   接口函数
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
  showPagination: true,
  // 传给后台分页信息字段名
  pageInfo: {
    pageSize: 'pageSize',
    pageNum: 'pageNum',
    total: 'total'
  },
  //  弹窗标题
  modalWidth: {
    edit: 600,
    detail: 500
  },
  isSearch: false,
  tableConfig: {
    exportFileName: '导出文件',
    checkExport: false,
    showBorder: true, //是否显示表格边框，默认显示
    //   表格宽度能否调整
    widthDrag: true,
    //   表格虚拟滚动配置
    virtualScrollOpen: false, //是否开启虚拟滚动渲染
    //开启虚拟滚动时生效
    tableItemH: 100, // 每行高度
    tableItemNum: 2 // 展示行数
  },
  // 页面顶部搜索配置项
  searchList: [
    {
      placeholder: '请选开始时间',
      key: 'startDate',
      type: 'date',
      label: '开始时间',
      showTime: true,
      validator: (rule, value, callback) => {
        if (new Date(value).getTime() < new Date().getTime() && value) {
          callback('开始时间不能小于当前时间')
        }
        callback()
      }
    }
  ],
  //  新增表单配置项
  formList: [
    {
      label: '供应商名称',
      placeholder: '请输入供应商名称',
      key: 'supplierName', // 字段名称
      type: '', // 表单类型 (text,password,select,date,number,radio,checkbox,slot)
      required: true //是否必填
    },
    {
      label: '法人名称',
      placeholder: '请输入法人名称',
      key: 'supplierCorporationName', // 字段名称
      type: '',
      rules: [
        {
          min: 3,
          max5: 5,
          message: '请输入3-5位字符法人名称'
        }
      ],
      maxLength: 20,
      required: true //是否必填
    },
    {
      label: '法人电话',
      placeholder: '请输入法人电话',
      key: 'supplierCorporationPhone',
      type: 'number',
      required: true //是否必填
    },
    {
      label: '供应商编号',
      key: 'supplierNo',
      placeholder: '请输入供应商编号',
      type: '',
      required: true //是否必填
    },
    {
      label: '公司地址',
      key: 'supplierAddr',
      placeholder: '请输入公司地址',
      type: ''
    },
    {
      label: '电子邮箱',
      key: 'supplierEmail',
      placeholder: '请输入电子邮箱',
      type: '',
      rules: [
        {
          type: 'email',
          message: '请输入正确邮箱'
        }
      ]
    }
  ],
  //  表格配置项
  columns: [
    // {
    //   title: '序号',
    //   width: 100,
    //   sort: true,
    //   key: 'num',
    //   align: 'center'
    // },
    {
      title: '信息',
      children: [
        {
          title: '电话',
          key: 'phone',
          width: '10%'
        },
        {
          title: '银行信息',
          children: [
            {
              title: '银行账户',
              key: 'bank',
              width: '10%'
            },
            {
              title: '开户行名称',
              key: 'banKnum',
              renderSlot: true,
              width: '10%'
            }
          ]
        }
      ]
    },
    {
      title: '供应商邮箱',
      width: '10%',
      key: 'supplierEmail',
      align: 'center'
    },
    // 配置化表格页 操作项 key固定,renderSlot必须设为true
    // 删 改 查 功能由组件自行处理
    {
      title: '操作',
      width: '10%',
      key: 'action',
      renderSlot: true,
      actionList: [
        {
          type: 'delete', // delete detail edit
          fieldName: 'name',
          text: '删除',
          btnType: 'danger', //primary dashed danger
          //   showCondition: item => {
          //     return item.name === 'name2'
          //   },
          promptContent: '确定删除该项数据？'
        },
        {
          type: 'detail',
          text: '查看信息'
          //   showCondition: item => {
          //     return item.name === 'name2'
          //   }
        },
        {
          type: 'edit',
          text: '修改',
          fieldName: 'name',
          showCondition: item => {
            console.log(255)
            return item.name === 'name3'
          }
        },
        {
          type: 'slot',
          slotName: 'selfAction',
          showCondition: item => {
            return item.num === 1
          }
        }
      ],
      align: 'center'
    }
  ],
  //   新增弹窗中表单的参数(用于二次校验或者需要自定义参数) 使用此函数需要返回重新定义的表单参数，无返回会当做
  submitFunc: (values, self) => {
    //values-表单数据   self当前页面本身 可以理解为组件中的this
    let data = values
    return data
  },
  searchFunc: (values, self) => {
    console.log(values)
    return values
  },
  //用于删除时的二次校验  返回值为true || false
  delOkFunc: (data, self) => {
    //data 当前操作对象

    console.log(data)
    // return true
  },
  //   格式化列表
  formatList: (res, currtPage, pageSize) => {
    const list = res.data.list
    list.forEach((item, index) => {
      item.num = index + 1
    })
    return list
  }
}
export default config
