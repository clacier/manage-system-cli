import { getList, add, edit, deleteNode } from '@/api/collectionNode/manage'
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
  tableConfig: {
    exportFileName: '导出文件',
    showBorder: true, //是否显示表格边框，默认显示
    //   表格宽度能否调整
    widthDrag: true,
    //   表格虚拟滚动配置
    virtualScrollOpen: true, //是否开启虚拟滚动渲染
    tableItemH: 130, // 每行高度
    tableItemNum: 4 // 展示行数
  },
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
      type: '', // 表单类型 (text,password,select,date,number,radio,checkbox,slot)
      required: true //是否必填
    },
    {
      label: '密码',
      placeholder: '请输入密码(6-10位包含数字和字母)',
      key: 'password', // 字段名称
      type: 'password',
      rules: {
        max: 10, //最大长度 Number
        min: 6,
        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/, // 正则校验
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
  columns: [
    {
      title: '序号',
      width: 100,
      key: 'num',
      align: 'center'
    },
    {
      title: '供应商名称',
      width: screen.availWidth * 0.1,
      key: 'supplierName',
      align: 'center'
    },
    {
      title: '供应商邮箱',
      width: screen.availWidth * 0.1,
      key: 'supplierEmail',
      align: 'center'
    },
    {
      title: '头像',
      width: screen.availWidth * 0.1,
      key: 'avatar',
      renderSlot: true,
      renderHtml: item => {
        console.log(item)
        return `<img  src='https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3361206748,3418038780&fm=26&gp=0.jpg'  style='width:100px '/>`
      },
      align: 'center'
    },
    {
      title: '头像',
      width: screen.availWidth * 0.1,
      key: 'supplierAolicenceImg',
      renderSlot: true,
      renderHtml: item => {
        console.log(item)
        return `<img  src=${item.supplierAolicenceImg}  style='width:100px '/>`
      },
      align: 'center'
    },

    {
      title: 'Md',
      width: 100,
      key: 'md',
      renderSlot: true,
      renderHtml: item => {
        let text
        if (item.num > 2) {
          text = item.num + '卡'
        } else {
          text = item.num + '阿'
        }
        console.log(text)
        return `<span >${text}<span>`
      },
      align: 'center'
    },
    {
      title: '操作',
      width: 300,
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
