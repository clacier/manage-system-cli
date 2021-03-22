const config = [
  {
    title: '弹窗组件props说明',
    data: [
      {
        parmas: 'v-model',
        text: '绑定控制显示的变量'
      },

      {
        parmas: 'width',
        text: '弹窗宽度',
        type: 'number',
        default: '520'
      },
      {
        parmas: 'title',
        text: '弹窗标题',
        type: 'string'
      },
      {
        parmas: '@ok',
        text: '点击确定触发的事件',
        type: 'function'
      },
      {
        parmas: '@cancel',
        text: '点击曲取消触发的事件，默认会关闭弹窗',
        type: 'function'
      },
      {
        parmas: 'hideFooter',
        text: '是否隐藏弹窗底部',
        type: 'boolean',
        default: 'false'
      }
    ]
  },
  {
    title: '局部性虚拟滚动组件props说明',
    data: [
      {
        parmas: 'itemNum',
        text: '显示的行数',
        type: 'number'
      },

      {
        parmas: 'itemH',
        text: '每行高度',
        type: 'number'
      },
      {
        parmas: 'oneLineItemNum',
        text: '每行元素显示的元素个数',
        type: 'number'
      },
      {
        parmas: 'sourceData',
        text: '数据源',
        type: 'array'
      },
      {
        parmas: 'v-model',
        text: '绑定用于展示的数组'
      }
    ]
  },
  {
    title: '表格组件props说明',
    data: [
      {
        parmas: 'columns',
        text: '表格列配置项',
        type: 'Aarry',
        default: '[]'
      },

      {
        parmas: 'dataList',
        text: '表格数据',
        type: 'Aarry',
        default: '[]'
      },
      {
        parmas: 'widthDrag',
        text: '表格列是否拖拽设置宽度',
        type: 'boolean',
        default: 'false'
      },
      {
        parmas: 'virtualScroll',
        text: '是否开启虚拟滚动',
        type: 'boolean',
        default: 'false'
      },
      {
        parmas: 'itemNum',
        text: '显示的表格行数（开启虚拟滚动时生效）',
        type: 'number',
        default: '5'
      },
      {
        parmas: 'itemH',
        text: '表格行高（开启虚拟滚动时生效）',
        type: 'number',
        default: '40'
      },
      {
        parmas: 'checkExport',
        text: '导出表格是否选择列',
        type: 'boolean',
        default: 'false'
      },
      {
        parmas: 'rowCheck',
        text: '表格是否可选',
        type: 'boolean',
        default: 'false'
      },
      {
        parmas: 'checkChange',
        text: '选择时改变事件，会返回已选择的数组',
        type: 'function',
        default: '-'
      }
    ]
  },
  {
    title: 'columns说明',
    data: [
      {
        parmas: 'title',
        text: '表头名称',
        type: 'string',
        default: '-'
      },

      {
        parmas: 'width',
        text: '表格列宽度',
        type: 'number',
        default: '-'
      },
      {
        parmas: 'key',
        text: '渲染字段名',
        type: 'string',
        default: '-'
      },
      {
        parmas: 'renderHtml',
        text: '自定义渲染html',
        type: 'function',
        default: '-',
        example: '`(item,i)=>{return <div>${item.name}</div> }`'
      },
      {
        parmas: 'renderSlot',
        text: '是否自定义渲染，当你的元素需要绑定事件时，需要采用插槽的方式，slot名为key值',
        type: 'boolean',
        default: 'false'
      },
      {
        parmas: 'align',
        text: '文本对齐方式',
        type: 'string',
        default: 'left',
        val: 'left,center,right'
      },
      {
        parmas: 'ellipsis',
        text: '是否自动省略',
        type: 'boolean',
        default: 'false'
      }
    ]
  },
  {
    title: '表单组件props说明',
    data: [
      {
        parmas: 'columns',
        text: '表单配置',
        type: 'Array',
        default: '[]'
      },
      {
        parmas: 'defautInfo',
        text: '表单数据',
        type: 'object',
        default: '-'
      }
    ]
  },
  {
    title: '表单columns说明',
    data: [
      {
        parmas: 'label',
        text: '表单名称',
        type: 'string',
        default: '-'
      },
      {
        parmas: 'placeholder',
        text: '输入框提示语',
        type: 'string',
        default: '-'
      },
      {
        parmas: 'title',
        text: '表单提示，值为一个对象',
        example: '{text:`提示`,style:`color:red`}',
        type: 'object',
        default: '-'
      },
      {
        parmas: 'type',
        text: '表单类型',
        type: 'string',
        default: 'text',
        val: 'text,password,select,date,number,radio,checkbox,switch,textarea,slot (slot为自定义)'
      },
      {
        parmas: 'option',
        text: '类型为select，radio，checkbox时表单配置 ',
        type: 'Array',
        example: '例：[{name:`选择名称`,value:`值`}]',
        default: '-'
      },

      {
        parmas: 'slotName',
        text: '使用自定义表单时slot名',
        type: 'string',
        default: '-'
      },
      {
        parmas: 'key',
        text: '绑定字段名',
        type: 'string',
        default: '-'
      },
      {
        parmas: 'initValue',
        text: '缺省值',
        type: 'any'
      },
      {
        parmas: 'required',
        text: '是否必填',
        type: 'boolean',
        default: 'false'
      }
    ]
  }
]
export default config
