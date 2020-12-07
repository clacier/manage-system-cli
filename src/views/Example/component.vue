<template>
  <div class="component_example">
    <div class="title">弹窗组件</div>
    <a-button type="primary" @click="openModal">打开弹窗</a-button>
    <Modal v-model="visible" :width="600" title="弹窗" @ok="handleOK" @cancel="handleCancel">
      <div style="text-align: center">内容</div>
    </Modal>
    <div class="title">虚拟滚动组件</div>
    <div style="width: 60%" class="component_content">
      <VirtualScroll :itemNum="8" :oneLineItemNum="4" :itemH="55" v-model="list3" :sourceData="sourceData">
        <div class="flex_box3">
          <div
            v-for="item in list3"
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
    <a-button type="primary" @click="handleExport" style="margin:10px 0"> 导出 </a-button>
    <Table
      :dataList="sourceData"
      :columns="columns"
      :widthDrag="true"
      :virtualScroll="true"
      :itemNum="15"
      :itemH="40"
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
    <div class="title">格式化渲染组件</div>
    <FormatRender style="width: 50%" :data="formatData" :columns="formatColums" class="component_content">
      <div slot="action" slot-scope="{ data }">
        <a-button @click="handleSubmit" type="primary">提交</a-button>
      </div>
    </FormatRender>
    <div class="title">格式化表单组件</div>
    <FormList class="component_content" style="width: 50%" :columns="formList" :defautInfo="defautInfo" ref="Form">
      <template slot="aa">自定义23232</template>
    </FormList>
  </div>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}

import { getList, add, edit, deleteNode } from '@/api/collectionNode/manage'
import { message, Modal } from 'ant-design-vue'
import { VirtualScroll, FormatRender, FormList } from '@/my-components'

export default {
  name: 'TableListWrapper',
  components: { VirtualScroll, FormatRender, FormList },
  data() {
    return {
      form: this.$form.createForm(this),
      list: [],
      sourceData: [],

      formatColums: [
        {
          name: '名称',
          key: 'name',
          nameStyle: '',
          contentStyle: '',
          // renderSlot: true, //类型:Boolean
          // 自定义渲染优先使用renderSlot, 因为renderHtml是一个函数,最后通过v-html渲染返回的html文本，
          // 每当当组件更新时都会触发，会影响性能，对于更新不频繁的组件可使用此方式,
          // 渲染优先级 slot>renderHtml>默认

          width: '100%'
        },
        {
          name: '状态',
          nameStyle: '',
          contentStyle: '',
          renderHtml: data => {
            let fontStyle = {
              100: {
                text: '状态一',
                style: 'color:red;font-size:18px'
              },
              200: {
                text: '状态二',
                style: 'color:blue;font-size:20px'
              }
            }
            //类型：function
            return `<span style=${fontStyle[data.status].style}>${fontStyle[data.status].text}<span>`
          },
          width: '50%'
        },
        {
          name: '名称4',
          nameStyle: '',
          contentStyle: 'color:blue',
          key: 'name4',
          width: '50%'
        },
        {
          name: '操作',
          nameStyle: 'color:red;font-size:18px',
          contentStyle: '',
          renderSlot: true,
          key: 'action',
          width: '50%'
        }
      ],
      formatData: {
        name: '阿里',
        name2: '阿里2',
        status: 100,
        name4: '阿萨德大道'
      },
      defautInfo: {
        name: '陈浩南'
      },
      formList: [
        {
          label: '名称',
          placeholder: '请输入名称',
          key: 'name', // 字段名称
          type: '', // 表单类型 (text,select,date,number,radio,checkbox,slot)
          initValue: '333',
          required: true //是否必填
        },
        {
          label: '密码',
          placeholder: '请输入密码(6-10位包含数字和字母)',
          key: 'password', // 字段名称
          type: 'password',
          rules: {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/, // 正则校验
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
          required: false //是否必填
        },
        {
          label: '开关',
          key: 'kaiguan',
          type: 'switch',
          initValue: true,
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
              name: '中',
              value: 2
            },
            {
              name: '小',
              value: 3
            }
          ],
          required: true //是否必填
        },
        {
          label: '类型2',
          key: 'type2',
          placeholder: '请选择类型',
          type: 'checkbox',
          initValue: [2], // 复选框的值为一个数组
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
          mode: 'tags', //设置 Select 的模式为多选或标签 'default' | 'multiple' | 'tags' |
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
      columns: [
        {
          title: '名称',
          width: screen.availWidth * 0.1,
          key: 'name',
          align: 'center'
        },
        {
          title: 'Md',
          width: 200,
          key: 'name2',
          align: 'center',
          renderSlot: true,
          renderHtml: item => {
            console.log('更新')
            return `<span>${item.name}自定义</span>`
          }
        },
        {
          title: '操作',
          width: 200,
          key: 'action',
          renderSlot: true,
          align: 'center'
        }
      ],
      total: 0,
      left: '',
      top: '',
      visible: false,
      page: 1,
      list3: [],
      pageSize: 10
    }
  },
  created() {
    for (let i = 0; i < 10000; i++) {
      this.sourceData.push({
        name: `name${i + 1}`
      })
    }
  },
  mounted() {},
  methods: {
    openModal() {
      this.visible = true
    },
    handleExport() {
      this.$refs.table.handleExport()
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
    handleSubmit() {
      // 校验表单及获取表单数据 校验成功才会返回数据
      let values = this.$refs.Form.handleSubmit()
    }
  }
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
