<template>
  <div class="component_example">
    <div class="title">弹窗组件</div>
    <a-button type="primary" @click="openModal">打开弹窗</a-button>
    <Modal v-model="visible" :width="600" title="" @ok="handleOK" @cancel="handleCancel">
      <!-- <div style="text-align: center">内容</div> -->
      <div class="flex_box" style="text-align: center; width: 100%; justify-content: center">内容。。。</div>
    </Modal>
    <div class="title">虚拟滚动组件</div>
    <div style="width: 60%" class="component_content">
      <VirtualScroll :itemNum="8" :oneLineItemNum="4" :itemH="55" v-model="list3" :sourceData="sourceData">
        <div class="flex_box3">
          <div
            v-for="(item, i) in list3"
            :key="i + 'p'"
            style="
              width: 22%;
              height: 40px;
              margin: 0 1%;
              margin-top: 15px;
              color: #ffffff;
              background: #f50;
              text-align: center;
              line-height: 40px;
            "
          >
            {{ item.name }}
          </div>
        </div>
      </VirtualScroll>
    </div>
    <div class="title">表格组件</div>
    <a-button type="primary" @click="handleExport" style="margin: 10px 0"> 导出 </a-button>
    <Table
      :dataList="sourceData"
      :columns="tableColumns"
      :widthDrag="true"
      :virtualScroll="true"
      :itemNum="15"
      :itemH="40"
      :checkExport="true"
      @checkChange="handleCheckChange"
      :rowCheck="true"
      ref="table"
    >
      <template slot="name2" slot-scope="{ item }">
        <div>{{ item.name }}</div>
      </template>
      <template slot="action">
        <a-button type="primary"> 操作 </a-button>
      </template>
    </Table>
    <div class="title">格式化表单组件</div>
    <FormList class="component_content" style="width: 50%" :columns="formList" :defaultInfo="defautInfo" ref="Form">
      <template slot="aa">自定义23232</template>
    </FormList>
    <div class="title">格式化渲染组件</div>
    <FormatRender style="width: 50%" :data="formatData" :columns="formatColums" class="component_content">
      <div slot="action">
        <a-button @click="handleSubmit" type="primary">提交</a-button>
      </div>
    </FormatRender>
    <div class="title">多级表头表格组件</div>
    <MultileveTable :columns="MTableColumns" :dataList="sourceData2" ref="MultileveTable">
      <template slot="action" slot-scope="{ item }">
        <a-button type="primary" @click="handleAction(item)"> 操作 </a-button>
      </template>
      <template slot="number" slot-scope="{ item }">
        <a-button type="primary" @click="handleAction(item)"> 操作 </a-button>
      </template>
    </MultileveTable>
  </div>
</template>

<script>
import { message, Modal } from 'ant-design-vue'
import { VirtualScroll, FormatRender, FormList, MultileveTable } from '@/my-components'
export default {
  name: 'TableListWrapper',
  components: { VirtualScroll, FormatRender, FormList, MultileveTable },
  data() {
    return {
      list: [],
      sourceData: [],
      //格式化渲染配置
      formatColums: [
        {
          name: '名称',
          key: 'name',
          nameStyle: '',
          nameClassName: '',
          contentClassName: '55',
          iconType: 'aliwangwang',
          ellipsis: true, //超出部门是否省略  设置为ture时contentStyle需要定义宽度，默认换行显示
          contentStyle: 'width:20px',
          // renderSlot: true, //类型:Boolean
          // 自定义渲染优先使用renderSlot, 因为renderHtml是一个函数
          // 每当组件数据更新时都会触发，如果数据频繁更新就会影响性能，对于更新不频繁的组件可使用此方式,
          // 渲染优先级 slot>renderHtml>默认

          width: '100%',
        },
        {
          name: '状态',
          nameStyle: '',
          renderHtml: (data) => {
            let fontStyle = {
              100: {
                text: '状态一',
                style: 'color:red;font-size:18px',
              },
              200: {
                text: '状态二',
                style: 'color:blue;font-size:20px',
              },
            }
            console.log(fontStyle)
            //类型：function
            return `<span style=${fontStyle[data.status].style}>${fontStyle[data.status].text}<span>`
          },
          width: '50%',
        },
        {
          name: '名称4',
          nameStyle: '',
          contentStyle: 'color:blue',
          key: 'name4',
          renderHtml: (data) => {
            //类型：function
            return `<span >555<span>`
          },
          width: '50%',
        },
        {
          name: '操作',
          nameStyle: 'color:red;font-size:18px',
          contentStyle: '',
          renderSlot: true,
          key: 'action',
          width: '50%',
        },
      ],
      formatData: {
        name: '能源管理',
        name2: '格式化组件',
        status: 100,
        name4: '阿萨德大道',
      },
      defautInfo: {
        // name: '陈浩南'
      },
      // 格式化表单配置
      formList: [
        {
          label: '名称',
          placeholder: '请输入名称',
          title: {
            text: '问号提示语',
          },
          prefix: {
            iconType: 'user',
          },
          key: 'name', // 字段名
          type: '', // 表单类型 (text,password,select,date,number,radio,checkbox,switch,textarea,slot) 默认text
          initValue: '333', // 缺省值
          maxLength: 10, // 字符串最大长度
          required: true, //是否必填
          // 校验规则  类型-数组
          rules: [
            {
              whitespace: true,
              message: '不能输入纯空格',
            },
          ],
        },
        {
          label: '数字',
          placeholder: '请输入数字',
          type: 'number',
          min: 10,
          max: 999,
          key: 'num', // 字段名
          required: false, //是否必填
        },
        {
          label: '密码',
          placeholder: '请输入密码(6-10位包含数字和字母)',
          prefix: {
            iconType: 'lock',
          },
          key: 'password', // 字段名称
          type: 'password',
          // 自定义校验- 这里的代码不能出错，否则所有表单校验失效
          validator: (rule, value, callback, form) => {
            // rule校验使用，可以不管，value-当前输入值；callback为一个函数，必须执行，传值表示校验不成功，值为报错信息
            // form 表单对象
            // form.getFieldValue(key) 获取表单某一项的值 key-字段名
            // form.setFieldsValue({key:value}) 设置表单某一项的值 key-字段名
            if (value === '666666c') {
              form.setFieldsValue({ name: 'aaa' })
              callback('不能等于666666c')
            } else {
              callback()
            }
          },
          // 其他校验
          rules: [
            {
              pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/, // 正则校验
              message: '请正确输入密码', //报错提示信息
            },
          ],
          required: false, //是否必填
        },
        {
          label: '开始时间',
          placeholder: '请选择开始时间',
          key: 'startTime',
          showTime: true,

          required: true,
          type: 'date',
          validator: (rule, value, callback, form) => {
            if (new Date(value).getTime() < new Date().getTime() && value) {
              callback('开始时间不能小于当前时间')
            } else {
              callback()
            }
          },
          rules: [],
        },
        {
          label: '结束时间',
          placeholder: '请选择结束时间',
          key: 'endTime',
          required: true,
          showTime: true,
          type: 'date',
          validator: (rule, value, callback, form) => {
            let startTimeValue, startTime
            if (form.getFieldValue('startTime')) {
              startTimeValue = form.getFieldValue('startTime') //日期的表单值是一个moment对象
              startTime = startTimeValue.format('YYYY-MM-DD HH:mm:ss')
              console.log(startTime)
              if (new Date(value).getTime() < new Date(startTime).getTime()) {
                callback('结束时间不能小于开始时间')
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
        },

        {
          label: '开关',
          title: {
            text: '开关',
          },
          key: 'kaiguan',
          type: 'switch',
          initValue: true,
          required: false, //是否必填
        },
        {
          label: '自定义',
          key: 'kaiguan',
          type: 'slot',
          slotName: 'aa',
          required: true, //是否必填
        },

        {
          label: '类型',
          key: 'type',
          type: 'radio',
          initValue: 1,
          option: [
            {
              name: '大',
              value: 1,
            },
            {
              name: '中',
              value: 2,
            },
            {
              name: '小',
              value: 3,
            },
          ],

          required: true, //是否必填
        },
        {
          label: '类型2',
          key: 'type2',
          placeholder: '请选择类型',
          type: 'checkbox',
          initValue: [1, 2], // 复选框的值为一个数组
          option: [
            {
              name: '大',
              value: 1,
            },
            {
              name: '小',
              value: 2,
            },
          ],
          required: false, //是否必填
        },
        {
          label: '选择菜单',
          placeholder: '请选择菜单',
          key: 'select',
          initValue: ['1', '3'],
          mode: 'multiple', //设置 Select 的模式为多选或标签 'default' | 'multiple' | 'tags' |
          option: [
            {
              name: '甲',
              value: '1',
            },
            {
              name: '乙',
              value: '2',
            },
            {
              name: '丙',
              value: '3',
            },
            {
              name: '丁',
              value: '4',
            },
          ],
          // 自定义校验
          validator: (rule, value, callback) => {
            console.log(value)
            if (value.includes('2') && value.includes('1')) {
              callback('不能同时选择甲乙')
            }
            callback()
          },
          type: 'select',
          required: true, //是否必填
        },
        {
          label: '备注',
          placeholder: '请输入备注',
          key: 'remark', // 字段名称
          type: 'textarea',
          required: false, //是否必填
        },
      ],
      // 表格配置
      MTableColumns: [
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
              width: '10%',
            },
            {
              title: '银行信息',
              children: [
                {
                  title: '银行账户',
                  key: 'bank',
                  width: '10%',
                },
                {
                  title: '开户行名称',
                  key: 'banKnum',
                  renderSlot: true,
                  width: '10%',
                },
              ],
            },
          ],
        },
        {
          title: '供应商邮箱',
          width: '10%',
          key: 'supplierEmail',
          align: 'center',
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
              promptContent: '确定删除该项数据？',
            },
            {
              type: 'detail',
              text: '查看信息',
              //   showCondition: item => {
              //     return item.name === 'name2'
              //   }
            },
            {
              type: 'edit',
              text: '修改',
              fieldName: 'name',
              showCondition: (item) => {
                console.log(255)
                return item.name === 'name3'
              },
            },
            {
              type: 'slot',
              slotName: 'selfAction',
              showCondition: (item) => {
                return item.num === 1
              },
            },
          ],
          align: 'center',
        },
      ],
      tableColumns: [
        {
          title: '序号',

          key: 'num', //字段名称- 非slot渲染时必须定义 也作为唯一标识，不能重复
          align: 'center', //left center right

          width: screen.availWidth * 0.1,
          sort: true,
        },
        {
          title: 'name',
          width: 200,
          key: 'name',
          align: 'center',
          ellipsis: true, // 超出自动省略
        },
        {
          title: 'Md',
          width: 500,
          key: 'name2',
          align: 'center',
          ellipsis: true, // 超出自动省略
          renderHtml: (item) => {
            return `<span>${item.name}自定义2</span>`
          },
        },
        {
          title: '操作',
          width: 200,
          key: 'action',
          renderSlot: true,
          align: 'center',
        },
      ],
      total: 0,
      left: '',
      top: '',
      visible: false,
      page: 1,
      list3: [],
      sourceData2: [],
      pageSize: 10,
    }
  },
  created() {
    for (let i = 0; i < 10000; i++) {
      this.sourceData.push({
        name: `name${i + 1}`,
        num: i + 1,
        num2: i * 10,
      })
    }

    for (let i = 0; i < 10; i++) {
      this.sourceData2.push({
        name: `name${i + 1}`,
        status: i,
        num: i + 1,
        num2: i * 10,
      })
    }
  },
  mounted() {},
  methods: {
    openModal() {
      this.visible = true
    },
    handleExport(type) {
      if (type == 2) {
        this.$refs.MultileveTable.handleExport()
      } else this.$refs.table.handleExport()
    },
    handleCheckChange(data) {
      console.log(data)
    },
    handleCancel() {
      console.log('取消')
    },
    handleOpen(data) {
      console.log(data)
    },
    handleOK() {
      console.log('确认')
    },
    handleAction(item) {
      console.log(item)
    },
    handleSubmit() {
      // 校验表单及获取表单数据 校验成功才会返回数据
      let form = this.$refs.Form
      let values = form.handleSubmit()
      if (values) {
        console.log(values)
      }
    },
  },
}
</script>
<style lang="less" scoped>
.component_example {
  .page_top {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .add_box {
      cursor: pointer;
      border-radius: 3px;
    }
  }
  .component_content {
    background: #ffffff;
    padding: 10px;
  }
  .title {
    color: #1890ff;
    margin: 10px 0;
  }
  .flex_box3 {
    display: flex;
    flex-wrap: wrap;
  }
  .pagination_box {
    position: absolute;
    right: 30px;
    bottom: -20px;
    display: flex;
    align-items: center;
  }
  .search_box {
    width: 400px;
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
  }
  .list {
    display: flex;
    margin-top: 10px;
    overflow-y: auto;
    flex-wrap: wrap;
    align-items: flex-start;
    .list_item {
      display: flex;
      background: #ffffff;
      border: 1px solid #999999;
      border-radius: 10px;
      padding: 10px;
      width: 250px;
      font-size: 16px;
      line-height: 30px;
      margin: 20px;
      justify-content: space-between;
      .left {
        width: 70%;
        div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .right {
        display: flex;
        opacity: 0;
        transition-duration: 1s;
        flex-direction: column;
        justify-content: space-around;
        font-size: 20px;
        i {
          cursor: pointer;
        }
      }
    }
    .list_item:hover {
      border-color: #333333;
      .right {
        opacity: 1;
      }
    }
  }
}
</style>
