<template>
  <div class="collectionNode">
    <div class="page_top">
      <div class="search_box">
        <a-input v-model="searchText" placeholder="请输入编号/IP/MAC" />
        <a-button type="primary" icon="search" @click="getList">查询</a-button>
      </div>
      <!-- <div class="add_box" @click="handleAdd">
        <span>
          <a-icon type="plus" />
        </span>
        <span>新增站点</span>
      </div>-->
    </div>
    <dragModal v-model="visible" title="通过审批" @ok="handleOK"></dragModal>
    <div class="list">
      <div class="list_item" v-for="item in list" :key="item.id">
        <div class="left">
          <div class="font_bold">{{item.siteName}}</div>
          <div>
            站点编号：
            <span :title="item.siteNo">{{item.siteNo}}</span>
          </div>
          <div>
            时间：
            <span :title="item.siteToken">{{item.siteToken}}</span>
          </div>
          <div>
            IP：
            <span :title="item.siteName">{{item.siteName}}</span>
          </div>
          <div>MAC：</div>
          <div>
            <span v-if="item.activeStatus==1">已通过</span>
            <div v-else @click="handleEdit(item)">通过审批</div>
          </div>
        </div>

        <div class="right">
          <div>
            <a-icon type="delete" @click="handleDelete(item.siteId)" />
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
      <a-pagination
        @change="onShowSizeChange"
        :pageSize="pageSize"
        v-model="page"
        :total="total"
        show-less-items
      />
      <span style="margin-left:10px">共{{ Math.ceil(total/pageSize) }}页</span>
    </div>

    <div v-if="list.length==0&&!$store.state.loading" class="no_data">暂无采集点数据~</div>
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
import { getList, add, edit, deleteNode } from '@/api/collectionNode/manage'
import { message, Modal } from 'ant-design-vue'
import dragModal from '@/my-components/Modal'
export default {
  name: 'TableListWrapper',
  components: { dragModal },
  data() {
    return {
      form: this.$form.createForm(this),
      list: [],
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
      formTailLayout,
      visible: false,
      page: 1,
      pageSize: 10
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    handleAdd() {
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
      console.log(page)
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
      border: 1px solid #333333;
      padding: 10px 15px;
      border-radius: 3px;
    }
  }

  .pagination_box {
    position: absolute;
    right: 30px;
    bottom: 0px;
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
    align-items: center;
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
      .right {
        opacity: 1;
      }
    }
  }
}
</style>
