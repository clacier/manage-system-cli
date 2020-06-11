<template>
  <div class="collectionNode">
    <div v-if="renderA"></div>
    <div class="page_top">
      <div class="flex_box">
        <a-select
          show-search
          v-model="siteId"
          placeholder="请输入站点任务名称"
          style="width: 300px"
          :default-active-first-option="false"
          @change="handleChange"
        >
          <a-select-option
            v-for="item in nodeList"
            :value="item.siteId"
            :key="item.siteId"
          >{{ item.siteName }}</a-select-option>
        </a-select>
        <div class="search_box">
          <a-input v-model="searchText" placeholder="请输入站点任务名称" />
          <a-button type="primary" icon="search" @click="getList">查询</a-button>
        </div>
      </div>

      <div class="add_box" @click="handleAdd">
        <span>
          <a-icon type="plus" />
        </span>
        <span>新增站点任务</span>
      </div>
    </div>
    <dragModal
      width="700"
      v-model="visible"
      :title="modalTitle"
      @ok="handleOK"
      @cancel="modalCancel"
    >
      <a-form :form="form">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="任 务 名 称："
        >
          <a-input
            style="width: 380px"
            v-decorator="[
          'taskName',
          { initialValue:detailInfo.taskName,
          rules: [{ required: true, message: '请输入任务名称', }] },
        ]"
            placeholder="请输入任务名称"
          />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="选 择 站 点："
        >
          <a-select
            style="width: 380px"
            v-decorator="[
          'siteId',
          { initialValue:detailInfo.siteId,
            rules: [{ required: true, message: '请选择站点', }] },
        ]"
            :default-active-first-option="false"
          >
            <a-select-option
              v-for="item in selectNodeList"
              :value="item.siteId"
              :key="item.siteId"
            >{{ item.siteName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="选 择 采 集 源："
        >
          <a-select
            style="width: 380px"
            @change="selectSource"
            v-decorator="[
          'sourceId',
          { initialValue:detailInfo.sourceId,
            rules: [{ required: true, message: '请选择采集源', }] },
        ]"
            :default-active-first-option="false"
          >
            <a-select-option
              v-for="item in selectSourceList"
              :value="item.sourceId"
              :key="item.sourceId"
            >{{ item.sourceName }}</a-select-option>
          </a-select>
          <a-button
            style="margin-left:10px"
            :disabled="!$store.state.isGetSensor"
            type="primary"
          >读取传感器</a-button>
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="选 择 传 感 器："
        >
          <div class="sensor_box">
            <div
              class="sensor_item"
              :class="{act_sensor_item:item.isCheck}"
              v-for="(item,index) in sensorList"
              :key="item.id"
              @click="handleCheckSensor(item,index)"
            >{{item.sensorName}}</div>
          </div>
          <div v-if="sensorList.length==0" class="font_ash">请选择采集源或读取传感器</div>
        </a-form-item>

        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="备注"
        >
          <a-input
            style="width: 380px"
            v-decorator="[
          'remark',
        ]"
            placeholder="请输入备注"
          />
        </a-form-item>
      </a-form>
    </dragModal>
    <div class="list">
      <div class="list_item" v-for="item in list" :key="item.taskId">
        <div class="left">
          <div class="font_bold">
            <!-- <span>任务名称：</span> -->
            <span :title="item.taskName">{{item.taskName}}</span>
          </div>
          <div>
            <span>状 态：</span>
            <span v-if="item.taskStatus==1" style="color:#0CAE99">正常</span>
            <span v-else style="color:#E92828">未发送</span>
          </div>
          <div>
            <span>站 点：</span>
            <span :title="item.sitedName">{{item.sitedName}}</span>
          </div>
          <div>
            <span>采 集 源：</span>
            <span :title="item.sourceName">{{item.sourceName}}</span>
          </div>
          <div>
            <span>备 注：</span>
            <span :title="item.remark">{{item.remark}}</span>
          </div>
        </div>
        <div class="right">
          <div>
            <a-icon type="delete" @click="handleDelete(item.taskId)" />
          </div>
          <div v-if="item.taskStatus==0">
            <a-icon type="edit" @click="handleEdit(item)" />
          </div>
          <div v-if="item.taskStatus==0">
            <a-icon type="to-top" title="发送" @click="handleSend(item.taskId)" />
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
import { getList, add, edit, deleteNode, sendOne, send, getConnectSensor } from '@/api/collectionNode/taskManage'
import { getList as getNodeList } from '@/api/collectionNode/manage'
import { getList as getSourceList } from '@/api/collectionSource/manage'
import { sourceNoGetList } from '@/api/sensor'
import { message, Modal } from 'ant-design-vue'
import dragModal from '@/my-components/Modal'
export default {
  name: 'TableListWrapper',
  components: { dragModal },
  data() {
    return {
      form: this.$form.createForm(this),
      list: [],
      nodeList: [],
      selectNodeList: [],
      selectSourceList: [],
      sensorList: [
        {
          sensorName: '1'
        }
      ],
      checkSensorList: [],
      renderA: false,
      total: 0,
      sourceNo: '',
      left: '',
      top: '',
      modalTitle: '编辑站点任务',
      searchText: '',
      detailInfo: {},
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
    this.getNodeList()
    this.getSourceList()
    for (let i = 0; i < 10; i++) {
      this.sensorList.push({
        sensorName: i
      })
    }
    // this.getList()
  },
  beforeDestroy() {
    this.$store.commit('set_GetSensor', false)
  },
  mounted() {},
  methods: {
    handleAdd() {
      this.$store.commit('set_GetSensor', true)
      this.form.resetFields()
      this.checkSensorList = []
      // this.sensorList = []
      this.detailInfo = ''
      this.type = 1
      this.modalTitle = '新增站点任务'
      this.visible = true
    },
    modalCancel() {
      this.$store.commit('set_GetSensor', false)
    },
    handleSearch(val) {},
    handleChange(val) {
      console.log(val)
      this.getList()
    },
    handleSend(taskId) {
      Modal.confirm({
        content: '请确认发送该任务,发送后不可编辑？',
        onOk: () => {
          this.sendOne(taskId)
        }
      })
    },
    async sendOne(id) {
      const data = {
        taskId: id,
        taskStatus: 1
      }
      const res = await sendOne(data)
      if (res.code === 2000) {
        this.$store.commit('set_GetSensor', true)
        message.success('正在发送中，请耐心等候')
        this.send(data)
      }
    },
    async send(data) {
      let data2 = data
      const res = await send(data2)
      if (res.code === 200 || res.code === 2000) {
        message.success('发送成功')
        this.getList()
      } else if (res.code === 2001 && this.$store.state.isGetSensor) {
        this.send(data2)
      }
    },
    handleCheckSensor(item, index) {
      this.renderA = !this.renderA
      item.isCheck = !item.isCheck
    },
    selectSource(val) {
      this.sourceNo = this.selectSourceList.filter(item => item.sourceId === val)[0].sourceNo
      // this.sourceNoGetSensor()
    },

    async sourceNoGetSensor() {
      const params = {
        sourceNo: this.sourceNo
      }
      const res = await sourceNoGetList(params)
      if (res.code === 2000) {
        if (res.data) {
          this.sensorList = res.data.list
        } else {
          this.sensorList = []
        }
      }
    },
    async getSensor() {
      const res = await getSensor()
      if (res.code === 2000) {
      }
      // 2001递归
      else if (res.code === 2001 && this.$store.state.isGetSensor) {
        this.getSensor()
      }
    },
    handleMouseUp(e) {
      this.isDrag = false
    },
    onShowSizeChange(page, pageSize) {},
    async getConnectSensor(id) {
      const res = await getConnectSensor({
        sourceNo: '',
        taskId: id
      })
      if (res.code === 2000) {
        console.log(res)
        this.sensorList = res.data.allSensorName
        let checkList = res.data.relationSensorName
        this.sensorList.forEach(item => (item.isCheck = checkList.includes(item) ? true : false))
      }
    },
    handleEdit(item) {
      this.$store.commit('set_GetSensor', true)
      item.taskStatus == 1 ? (item.taskStatusSwitch = true) : (item.taskStatusSwitch = false)
      this.sourceNo = this.selectSourceList.filter(i => i.sourceId === item.sourceId)[0].sourceNo
      this.detailInfo = item
      this.getConnectSensor(item.taskId)
      this.taskId = item.taskId
      this.type = 2
      this.modalTitle = '编辑站点任务'
      this.visible = true
    },
    async getNodeList() {
      const res = await getNodeList()
      if (res.code === 2000) {
        if (res.data) {
          this.selectNodeList = res.data.list
          this.nodeList = res.data.list
          this.siteId = this.nodeList[0].siteId
          this.getList()
        } else {
        }
      }
    },
    async getSourceList() {
      const res = await getSourceList()
      if (res.code === 2000) {
        if (res.data) {
          this.selectSourceList = res.data.list
        } else {
        }
      }
    },

    async getList() {
      const params = {
        taskName: this.searchText,
        pageSize: this.pageSize,
        siteId: this.siteId,
        pageNum: this.page - 1
      }
      const res = await getList(params)
      if (res.code === 2000) {
        console.log(res)
        if (res.data) {
          this.total = res.data.total
          this.list = res.data.list
        } else {
          this.list = []
        }
      }
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

        message.success('修改成功')
      }
    },
    handleDelete(taskId) {
      Modal.confirm({
        content: '是否删除该任务？',
        onOk: () => {
          this.deleteNode(taskId)
        }
      })
    },
    async deleteNode(taskId) {
      const res = await deleteNode({ taskId: taskId })
      if (res.code === 2000) {
        this.getList()
        message.success('删除成功')
      }
    },
    handleOK() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          let checkList = []
          this.sensorList.forEach(item => {
            if (item.isCheck) {
              checkList.push(item.sensorName)
            }
          })
          if (checkList.length == 0) {
            message.error('请选择传感器！')
            return false
          }
          values.sensorNames = checkList
          values.taskStatus == 1 ? (values.taskStatus = 1) : (values.taskStatus = 0)
          if (this.type == 1) {
            this.add(values)
          } else {
            values.taskId = this.taskId
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
  .pagination_box {
    position: absolute;
    right: 30px;
    bottom: -20px;
    display: flex;
    align-items: center;
  }
  .search_box {
    margin-left: 20px;
    width: 380px;
    display: flex;
    justify-content: space-between;
  }
  .sensor_box {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .sensor_item {
    background: #e6e6e6;
    width: 100px;
    cursor: pointer;
    padding: 1px 0;
    margin: 10px;
    text-align: center;
    border-radius: 5px;
  }
  .act_sensor_item {
    color: #ffffff;
    background: #1890ff;
  }
  .send {
    color: #185555;
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
        width: 200px;
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
