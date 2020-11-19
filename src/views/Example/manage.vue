<template>
  <div class="collectionNode">
    <div class="title">虚拟滚动组件</div>
    <VirtualScroll :itemNum="5" :lineItemNum="4" :itemH="55" v-model="list3" :sourceData="list2">
      <div class="flex_box3">
        <div
          v-for="item in list3"
          style="width: 20%; height: 40px; margin: 0 1%; margin-top: 15px; color: #ffffff; background: red"
        >
          {{ item.name }}
        </div>
      </div>
    </VirtualScroll>
    <Modal v-model="visible" :title="modalTitle" @ok="handleOK">
      <a-form :form="form">
        <a-form-item
          v-for="item in formList"
          :key="item.key"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          :label="item.label"
        >
          <a-input
            v-decorator="[
              item.key,
              { initialValue: nodeInfo.siteName, rules: [{ required: item.required, message: item.placeholder }] }
            ]"
            :placeholder="item.placeholder"
          />
        </a-form-item>
      </a-form>
    </Modal>
    <div class="title">表格组件</div>
    <Table
      :dataList="list2"
      :cloums="cloums"
      :widthDrag="true"
      :virtualScroll="true"
      :itemNum="5"
      :itemH="40"
      :rowCheck="true"
    >
      <div slot="action">
        <a-button type="primary"> 操作 </a-button>
      </div>
    </Table>
    <div class="title">格式化渲染组件</div>
    <FormatRender style="width:50%" :data="formatData" :cloums="formatColums" />
    <div class="pagination_box" v-if="list.length > 0">
      <a-pagination @change="onShowSizeChange" :pageSize="pageSize" v-model="page" :total="total" show-less-items />
      <span style="margin-left: 10px">共{{ Math.ceil(total / pageSize) }}页</span>
    </div>
  </div>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}

import { getList, add, edit, deleteNode } from '@/api/collectionNode/manage'
import { message, Modal } from 'ant-design-vue'
import { VirtualScroll, FormatRender } from '@/my-components'

export default {
  name: 'TableListWrapper',
  components: { VirtualScroll, FormatRender },
  data() {
    return {
      form: this.$form.createForm(this),
      list: [],
      list2: [],
      formatColums: [
        {
          name: '名称',
          key: 'name',
          width: '50%'
        },
        {
          name: '名称2',
          key: 'name2',
          renderContent: data => {
            return `<span>${data.name2}22222<span>`
          },
          width: '50%'
        },
        {
          name: '名称3',
          key: 'name3',
          width: '50%'
        },
        {
          name: '名称4',
          key: 'name4',
          width: '100%'
        }
      ],
      formatData: {
        name: '阿里',
        name2: '阿里2'
      },
      formList: [
        {
          label: '名称',
          placeholder: '请输入名称',
          key: 'name', // 字段名称
          type: '', // 表单类型 (text,select,date,dateTime,number)
          required: true //是否必填
        }
      ],
      cloums: [
        {
          title: 'Mi',
          width: 500,
          key: 'name',
          align: 'center'
        },
        {
          title: 'Md',
          width: 200,
          key: 'name2',
          align: 'center'
        },
        {
          title: '操作',
          width: 200,
          key: 'action',
          scopedSlots: 'action',
          align: 'center'
        }
      ],
      total: 0,
      left: '',
      top: '',
      modalTitle: '编辑站点',
      searchText: '',
      nodeInfo: {},
      isDrag: false,
      siteId: '',
      type: 1, //1-新增 2-编辑
      formItemLayout,
      visible: false,
      page: 1,
      list3: [],
      pageSize: 10
    }
  },
  created() {
    for (let i = 0; i < 1000; i++) {
      this.list2.push({
        name: `name${i + 1}`
      })
    }
    this.getList()
  },
  mounted() {},
  methods: {
    handleAdd() {
      //   this.list2 = this.list2.slice(0, 500)
      //   return false
      this.form.resetFields()
      this.nodeInfo = ''
      this.type = 1
      this.modalTitle = '新增站点'
      this.visible = true
    },
    handleMouseUp(e) {
      this.isDrag = false
    },
    onShowSizeChange(page, pageSize) {
      this.page = page
      this.getList()
    },
    handleEdit(item) {
      item.activeStatus == 1 ? (item.activeStatusSwitch = true) : (item.activeStatusSwitch = false)
      this.nodeInfo = item
      this.siteId = item.siteId
      console.log(this.nodeInfo)
      this.type = 2
      this.modalTitle = '编辑站点'
      this.visible = true
    },
    async getList() {
      const params = {
        searchText: this.searchText,
        pageSize: this.pageSize,
        pageNum: this.page - 1
      }
      const res = await getList(params)
      if (res.code === 2000) {
        if (res.data) {
          this.total = res.data.total
          this.list = res.data.list
        } else {
          this.list = []
        }
      }
      console.log(res)
    },
    async add(data) {
      const res = await add(data)
      if (res) {
        this.visible = false
        this.getList()
        message.success('添加成功')
      }
    },
    async edit(data) {
      const res = await edit(data)
      if (res.code === 2000) {
        this.getList()
        this.visible = false
        this.form.resetFields()
        message.success('修改成功')
      }
    },
    handleDelete(siteId) {
      Modal.confirm({
        content: '是否删除该站点？',
        onOk: () => {
          this.deleteNode(siteId)
        }
      })
    },
    async deleteNode(siteId) {
      const res = await deleteNode({ siteId: siteId })
      if (res.code === 2000) {
        this.getList()
        message.success('删除成功')
      }
    },
    handleOK() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          values.activeStatus == 1 ? (values.activeStatus = 1) : (values.activeStatus = 0)
          console.log(values)
          if (this.type == 1) {
            this.add(values)
          } else {
            values.siteId = this.siteId
            this.edit(values)
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.collectionNode {
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
