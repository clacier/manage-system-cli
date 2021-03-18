<template>
  <div class="cardListPage">
    <slot name="pageHeader"> </slot>
    <div class="page_top">
      <div class="search_box">
        <FormList
          :columns="searchList"
          :defaultInfo="searchInfo"
          ref="searchForm"
          :isSearch="true"
          style="inline-hegiht:normal"
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
        <FormList :columns="formList" :defaultInfo="detailInfo" ref="Form" style="width:100%">
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
    <div class="cardList">
      <a-card class="card_item" v-for="(item, index) in list" :key="index + 'x'" :style="{ ...cardStyleConfig }">
        <template slot="title">
          <slot name="cardTitle" :item="item" :index="index"></slot>
        </template>
        <template slot="extra">
          <div class="actionList">
            <div v-for="(actionItem, i) in actionList" :key="i + 'z'">
              <div class="action_item" v-if="item[actionItem.type + 'Action']">
                <a-icon :type="actionItem.iconType" @click="actionClick(item, actionItem)" />
              </div>
            </div>
          </div>
        </template>
        <slot name="cardContent" :item="item" :index="index"></slot>
      </a-card>
    </div>
    <div class="no_data" v-if="list.length == 0 && !$store.state.loding">
      <a-empty description=" 暂无数据" />
    </div>
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
  wrapperCol: { span: 18 }
}
import { message, Modal } from 'ant-design-vue'
import { VirtualScroll, FormList } from '@/my-components'

export default {
  name: 'TablePage',
  components: { VirtualScroll, FormList },
  watch: {
    list: {
      handler() {
        this.formatShowCondition()
        console.log(this.list)
      },
      deep: true
    }
  },

  props: {
    config: {
      type: Object,
      default: () => {}
    },
    searchParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      ...this.$props.config,
      form: this.$form.createForm(this),
      list: [],
      visible: {
        edit: false,
        detail: false
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
      pageSize: 10
    }
  },
  created() {
    for (let i = 0; i < 10; i++) {
      this.list.push({
        name: `name${i + 1}`,
        type: 1,
        kaiguan: true,
        date: '2017-06-07'
      })
    }
    this.slotFormList = this.formList.filter(item => item.type === 'slot')
    this.actionList.forEach(item => {
      switch (item.type) {
        case 'edit':
          if (!item.iconType) item.iconType = 'edit'
          break
        case 'detail':
          if (!item.iconType) item.iconType = 'search'
          break
        case 'delete':
          if (!item.iconType) item.iconType = 'delete'
          break

        default:
          break
      }
    })
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleAdd() {
      //   this.list2 = this.list2.slice(0, 500)
      //   return false
      if (this.openAdd) {
        this.openAdd(this.$parent)
      }
      this.form.resetFields()
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
        case 'self':
          this.$parent[actionItem.funcName]()

        default:
          break
      }
    },
    formatShowCondition() {
      this.actionList.forEach(actionItem => {
        this.list.forEach(item => {
          if (actionItem.showCondition) {
            item[actionItem.type + 'Action'] = actionItem.showCondition(item)
          } else {
            item[actionItem.type + 'Action'] = true
          }
        })
      })
    },
    onShowSizeChange(page, pageSize) {
      console.log(pageSize)
      this.page = page
      this.pageSize = pageSize
      this.getList()
    },
    actionClick(item, actionItem) {
      this.actItem = item
      if (actionItem.type === 'delete') {
        Modal.confirm({
          content: actionItem.promptContent ? actionItem.promptContent : '是否删除该站点？',
          onOk: () => {
            this.deleteOk(item, actionItem.fieldName)
          }
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
    refGetListData() {
      return this.list
    },
    handleEdit(item, editFieldName) {
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
      if (!this.searchInfo) {
        return
      }
      let params = {
        ...this.searchInfo,
        ...this.searchParams
      }
      params[this.pageInfo.pageNum] = this.page
      params[this.pageInfo.pageSize] = this.pageSize
      let dateFormArr = this.searchList.filter(item => item.type === 'date' || item.type === 'dateTime')
      dateFormArr.forEach(item => {
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
    getActItem() {
      return this.actItem
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
    }
  }
}
</script>
<style lang="less" scoped>
.cardListPage {
  .page_top {
    width: 100%;
    display: flex;
    line-height: 40px;
    align-items: flex-start;
    justify-content: space-between;
    .add_box {
      cursor: pointer;
      border-radius: 3px;
    }
    margin-bottom: 20px;
  }
  .edit_modal_content {
    display: flex;
    width: 100%;
  }
  .search_box {
    display: flex;
    justify-content: space-between;
  }
  .search_btn {
    position: relative;
    top: 4px;
  }
  .actionList {
    display: flex;
    align-items: center;
    opacity: 0;
    cursor: pointer;
    transition: 0.2s;
  }
  .cardList {
    display: flex;
    flex-wrap: wrap;

    max-height: calc(100vh - 400px);
    overflow: auto;
  }
  .action_item {
    border-radius: 5px;
    margin: 0 6px;
    font-size: 17px;
  }
  .action_item:hover {
    color: #1890ff;
  }
  .card_item {
    width: auto;
    margin: 10px;
  }
  .card_item:hover .actionList {
    opacity: 1;
  }
  .card_item:hover {
    box-shadow: 0px 0px 10px #dad8d8;
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
