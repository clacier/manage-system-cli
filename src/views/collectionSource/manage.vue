<template>
  <div class="page-header-index-wide">
    <div class="collectionNode">
      <div class="page_top">
        <div class="search_box">
          <a-input v-model="searchText" placeholder="请输入采集源名称" />
          <a-button type="primary" icon="search" @click="getList">查询</a-button>
        </div>
        <div class="add_box" @click="handleAdd">
          <span>
            <a-icon type="plus" />
          </span>
          <span>新增采集源</span>
        </div>
      </div>

      <dragModal v-model="visible" :title="modalTitle" @ok="handleOK">
        <a-form :form="form">
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="服务名称：："
          >
            <a-input
              v-decorator="[
          'sourceName',
          {initialValue:sourceInfo.sourceName,
               rules: [{ required: true, message: '请输入服务名称' }] },
        ]"
              placeholder="请输入服务名称"
            />
          </a-form-item>
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="协  议："
          >
            <a-input
              v-decorator="[
          'sourceProtocol',
          { 
              initialValue:sourceInfo.sourceProtocol,rules: [{ required: true, message: '请输入协议' }] },
        ]"
              placeholder="请输入协议"
            />
          </a-form-item>
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="端  口："
          >
            <a-input
              v-decorator="[
          'sourcePort',
          { initialValue:sourceInfo.sourcePort,
               rules: [{ required: true, message: '请输入端口' }] },
        ]"
              placeholder="请输入端口"
            />
          </a-form-item>
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="地  址："
          >
            <a-input
              v-decorator="[
          'sourceAddr',
          {  initialValue:sourceInfo.sourceAddr,
              rules: [{ required: true, message: '请输入地址' }] },
        ]"
              placeholder="请输入地址"
            />
          </a-form-item>

          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="备注"
          >
            <a-input
              v-decorator="[
          'sourceRemark',
          {
            initialValue:sourceInfo.sourceRemark,
          }
        ]"
              placeholder="请输入备注"
            />
          </a-form-item>
        </a-form>
      </dragModal>
      <div class="list">
        <div class="list_item" v-for="item in list" :key="item.id">
          <div class="left">
            <div class="font_bold">{{item.sourceName}}</div>
            <div>协议：{{item.sourceProtocol}}</div>
            <div>端口：{{item.sourcePort}}</div>
            <div>地址：{{item.sourceAddr}}</div>
            <div>备注：{{item.sourceRemark}}</div>
          </div>

          <div class="right">
            <div>
              <a-icon type="delete" @click="handleDelte(item.sourceId)" />
            </div>
            <div>
              <a-icon type="edit" @click="handleEdit(item)" />
            </div>
            <!-- <div>
            <a-icon type="disconnect" />
            </div>-->
          </div>
        </div>
      </div>
      <div class="pagination_box" v-if="list.length>0">
        <a-pagination v-model="page" :total="total" show-less-items />
        <span style="margin-left:10px">共{{ Math.ceil(total/pageSize) }}页</span>
      </div>
      <div v-if="list.length==0&&!$store.state.loading" class="no_data">暂无采集源数据~</div>
    </div>
  </div>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 }
}
import { getList, add, edit, deleteNode } from '@/api/collectionSource/manage'
import { message, Modal } from 'ant-design-vue'
import dragModal from '@/my-components/Modal'
export default {
  name: 'TableListWrapper',
  components: { dragModal },
  data() {
    return {
      form: this.$form.createForm(this),
      list: [],

      modalTitle: '编辑采集源',
      searchText: '',
      sourceInfo: {},
      sourceId: '',
      type: 1, //1-新增 2-编辑
      formItemLayout,
      formTailLayout,
      visible: false,
      visible2: false,
      page: 1,
      total: 0,
      pageSize: 10
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleAdd() {
      this.form.resetFields()
      this.sourceInfo = ''
      this.type = 1
      this.modalTitle = '新增采集源'
      this.visible = true
    },
    handleEdit(item) {
      this.sourceInfo = item
      this.sourceId = item.sourceId
      this.type = 2
      this.modalTitle = '编辑采集源'
      this.visible = true
    },
    async getList() {
      const params = {
        searchText: this.searchText,
        pageSize: this.pageSize,
        pageNum: this.page - 1
      }
      const res = await getList(params)
      if (res.code == 2000) {
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
      if (res.code === 2000) {
        this.visible = false
        this.getList()
        message.success('添加成功')
      }
    },
    async edit(data) {
      const res = await edit(data)
      if (res.code === 2000) {
        this.visible = false
        this.getList()
        this.form.resetFields()
        message.success('修改成功')
      }
    },
    handleDelte(sourceId) {
      Modal.confirm({
        content: '是否删除该采集源？',
        onOk: () => {
          this.deleteNode(sourceId)
        }
      })
    },
    async deleteNode(sourceId) {
      const res = await deleteNode({ sourceId: sourceId })
      if (res.code === 2000) {
        this.visible = false
        this.getList()
        message.success('删除成功')
      }
    },
    handleOK() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.sourceServiceName = ' '
          values.sourceConnStr = ' '

          if (this.type == 1) {
            this.add(values)
          } else {
            values.sourceId = this.sourceId
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
    align-items: center;
    justify-content: space-between;
    .add_box {
      cursor: pointer;
      border: 1px solid #333333;
      padding: 10px 15px;
      border-radius: 3px;
    }
  }
  .search_box {
    width: 400px;
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
  }
  .pagination_box {
    position: absolute;
    right: 10px;
    bottom: 20px;
    display: flex;
    align-items: center;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .list_item {
      display: flex;
      background: #ffffff;
      border: 1px solid #999999;
      border-radius: 10px;
      padding: 10px;
      width: 300px;
      font-size: 16px;
      line-height: 30px;
      margin: 20px;
      justify-content: space-between;
      .left {
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
        font-size: 18px;
        i {
          cursor: pointer;
        }
      }
    }
    .list_item:hover {
      .right {
        opacity: 1;
      }
    }
  }
}
</style>
