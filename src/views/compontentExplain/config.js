const config = [
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
        text: '表单提示，值为一个对象，例如:{text:`提示`}',
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
        text: '类型为select，radio，checkbox时表单配置 例：[{name:`选择名称`,value:`值`}]',
        type: 'Array',
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
        text: '绑定字段名类似v-modal',
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
