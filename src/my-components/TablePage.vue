<template>
  <div class="TablePage">
    <slot name="pageHeader"> </slot>
    <div class="page_top">
      <div class="search_box">
        <FormList
          :columns="searchList"
          :defaultInfo="searchInfo"
          ref="searchForm"
          :isSearch="true"
          style="inline-hegiht: normal"
        >
        </FormList>
        <slot name="searchContent"> </slot>
        <a-button
          v-if="config.isSearch || config.isSearch === undefined"
          type="primary"
          class="search_btn"
          icon="search"
          @click="getList"
          >查询</a-button
        >
      </div>
      <div>
        <a-button
          type="primary"
          class="action_btn"
          @click="pageActionClick(actionItem)"
          v-for="(actionItem, i) in pageAction"
          :key="i + 'l'"
        >
          <span v-if="actionItem.type === 'add'">
            <a-icon type="plus" />
          </span>
          <span>{{ actionItem.btnText }}</span>
        </a-button>
      </div>
    </div>
    <Modal v-model="visible.edit" :width="modalWidth.edit" :title="modalTitle" @ok="handleOK">
      <div class="edit_modal_content">
        <slot name="editLeftContent"></slot>
        <FormList
          :columns="formList"
          :defaultInfo="detailInfo"
          ref="Form"
          style="width: 100%"
          :formItemLayout="formItemLayout"
        >
          <slot v-for="slotItem in slotFormList" :name="slotItem.slotName" :slot="slotItem.slotName"></slot>
        </FormList>
      </div>
    </Modal>
    <Modal
      v-model="visible.detail"
      :width="modalWidth.detail"
      :title="modalTitleText.detail"
      @ok="handleOK"
      :hideFooter="true"
    >
      <slot name="detailContent"></slot>
    </Modal>
    <Table
      :dataList="list"
      :columns="columns"
      :widthDrag="tableConfig.widthDrag"
      :virtualScroll="tableConfig.virtualScrollOpen"
      :itemNum="tableConfig.tableItemNum"
      :itemH="tableConfig.tableItemH"
      :checkExport="tableConfig.checkExport"
      :exportFileName="tableConfig.exportFileName"
      :showBorder="tableConfig.showBorder"
      ref="Table"
    >
      <template v-for="slotItem in tableSlotList" slot-scope="{ columnsItem, item }" :slot="slotItem.key">
        <slot :name="slotItem.key" :item="item" :columnsItem="columnsItem"> </slot>
      </template>
      <template slot="action" slot-scope="{ columnsItem, item }" class="flex_box">
        <div v-for="(actionItem, index) in columnsItem.actionList" :key="index + 'w'">
          <div v-if="actionItem.type === 'slot'">
            <slot
              v-if="actionItem.showCondition ? actionItem.showCondition(item) : true"
              :name="actionItem.slotName"
              :item="item"
            ></slot>
          </div>
          <div v-else>
            <a-button
              :type="actionItem.btnType ? actionItem.btnType : 'primary'"
              style="margin: 0 5px"
              v-if="actionItem.showCondition ? actionItem.showCondition(item) : true"
              @click="actionClick(item, actionItem)"
            >
              {{ actionItem.text }}
            </a-button>
          </div>
        </div>
      </template>
    </Table>
    <div class="pagination_box" v-if="list.length > 0 && showPagination">
      <a-pagination
        show-size-changer
        @change="onShowSizeChange"
        @showSizeChange="onShowSizeChange"
        show-quick-jumper
        v-model="page"
        :total="total"
        show-less-items
      />
      <span style="margin-left: 10px">共{{ Math.ceil(total / pageSize) }}页</span>
    </div>
    <slot name="pageContent"></slot>
  </div>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}
import { message, Modal } from 'ant-design-vue'
import { VirtualScroll, FormList } from '@/my-components'

export default {
  name: 'TablePage',
  components: { VirtualScroll, FormList },
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    searchParams: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      ...this.$props.config,
      form: this.$form.createForm(this),
      list: [],
      tableSlotList: [],
      exportFileName: '',
      visible: {
        edit: false,
        detail: false,
      },
      searchInfo: {},
      total: 100,
      editFieldName: '',
      left: '',
      top: '',
      modalTitle: '',
      searchText: '',
      detailInfo: {},
      isDrag: false,
      siteId: '',
      type: 1, //1-新增 2-编辑
      formItemLayout,
      page: 1,
      list3: [],
      tableAction: [],
      pageSize: 10,
    }
  },
  created() {
    // for (let i = 0; i < 100; i++) {
    //   this.list.push({
    //     name: `name${i + 1}`,
    //     num: i + 1,
    //     type: 1,
    //     kaiguan: true,
    //     date: '2017-06-07'
    //   })
    // }
    this.slotFormList = this.formList.filter((item) => item.type === 'slot')
    this.tableSlotList = this.columns.filter((item) => item.renderSlot)
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleAdd() {
      if (this.openAdd) {
        this.openAdd(this.$parent)
      }
      this.$emit('openAdd')
      this.$refs.Form.form.resetFields()
      this.detailInfo = ''
      this.type = 1
      this.modalTitle = this.modalTitleText.add
      this.visible.edit = true
    },
    pageActionClick(actionItem) {
      switch (actionItem.type) {
        case 'add':
          this.handleAdd()
          break

        case 'export':
          this.$refs.Table.handleExport()
          break
        case 'self':
          this.$parent[actionItem.funcName]()
        default:
          break
      }
    },
    onShowSizeChange(page, pageSize) {
      console.log(pageSize)
      this.page = page
      this.pageSize = pageSize
      this.getList()
    },
    actionClick(item, actionItem) {
      console.log(actionItem.type)
      this.actItem = item
      if (actionItem.type === 'delete') {
        Modal.confirm({
          content: actionItem.promptContent ? actionItem.promptContent : '是否删除该数据？',
          onOk: () => {
            this.deleteOk(item, actionItem.fieldName)
          },
        })
      } else if (actionItem.type === 'edit') {
        this.handleEdit(item, actionItem.fieldName)
      } else if (actionItem.type === 'detail') {
        this.visible.detail = true
        this.$emit('openDetail', this.actItem)
      }
    },
    handleCloseModal(type) {
      this.visible[type] = false
    },
    handleEdit(item, editFieldName) {
      this.$emit('openEdit')
      this.form.resetFields()
      this.detailInfo = item
      this.actItem = item
      this.editFieldName = editFieldName
      console.log(this.detailInfo)
      this.type = 2
      this.modalTitle = this.modalTitleText.edit
      this.visible.edit = true
    },
    async getList() {
      this.searchInfo = this.$refs.searchForm.handleSubmit()
      let params = {
        ...this.searchInfo,
        ...this.searchParams,
      }
      params[this.pageInfo.pageNum] = this.page
      params[this.pageInfo.pageSize] = this.pageSize
      let dateFormArr = this.searchList.filter((item) => item.type === 'date' || item.type === 'dateTime')
      dateFormArr.forEach((item) => {
        params[item.key] = params[item.key] ? params[item.key].format('YYYY-MM-DD HH:mm:ss') : ''
      })
      if (this.searchFunc) {
        params = this.searchFunc(params, this.$parent)
        if (!params) {
          return
        }
      }

      const { getList } = this.api
      const res = await getList(params)
      if (res) {
        if (res.data) {
          if (this.showPagination) {
            this.total = res.data[this.pageInfo.total]
          }
          this.list = this.formatList(res, this.page, this.pageSize, this.$parent) || []
        }
      }
      console.log(res)
    },
    refGetActItem() {
      return this.actItem
    },
    refGetListData() {
      return this.list
    },
    async add(data) {
      const { add } = this.api
      const res = await add(data)
      if (res) {
        this.visible.edit = false
        this.getList()
        message.success('添加成功')
      }
    },
    async edit(data) {
      const { edit } = this.api
      const res = await edit(data)
      if (res.code === 2000) {
        this.getList()
        this.visible.edit = false
        this.form.resetFields()
        message.success('修改成功')
      }
    },
    async deleteOk(item, fieldName) {
      let params = {}
      params[fieldName] = item[fieldName]
      let falg = true
      if (this.delOkFunc instanceof Function) {
        falg = this.delOkFunc(item)
      }
      if (falg) {
        const { del } = this.api
        const res = await del(params)
        if (res.code === 2000) {
          this.getList()
          message.success('删除成功')
        }
      }
    },
    handleOK() {
      let values = this.$refs.Form.handleSubmit()
      if (values) {
        if (this.type == 1) {
          //新增
          if (this.submitFunc) {
            let data = this.submitFunc(values, this.$parent)
            if (data) {
              this.add(data)
            }
          } else {
            this.add(values)
          }
        } else {
          //   修改
          values[this.editFieldName] = this.actItem[this.editFieldName]
          if (this.submitFunc) {
            let data = this.submitFunc(values, this.$parent)
            if (data) {
              this.edit(values)
            }
          } else {
            this.edit(values)
          }
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
.TablePage {
  .page_top {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .action_btn {
      cursor: pointer;
      border-radius: 3px;
      margin: 0 10px;
    }
    margin-bottom: 20px;
  }
  .edit_modal_content {
    display: flex;
    width: 100%;
  }
  .flex_box3 {
    display: flex;
    flex-wrap: wrap;
  }
  .pagination_box {
    position: absolute;
    right: 30px;
    bottom: -30px;
    display: flex;
    align-items: center;
  }
  .search_box {
    display: flex;
    align-items: center;
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
