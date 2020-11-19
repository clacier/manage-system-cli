<template>
  <div class="collectionNode">
    <div class="page_top">
      <div class="search_box">
        <div v-for="searchItem in searchList" style="margin-right: 10px">
          <a-date-picker
            :showTime="searchItem.showTime"
            v-if="searchItem.type == 'date'"
            v-model="searchInfo[searchItem.key]"
            :placeholder="searchItem.placeholder"
          />
          <a-input v-else v-model="searchInfo[searchItem.key]" :placeholder="searchItem.placeholder" />
        </div>
        <slot name="searchContent"> </slot>
        <a-button type="primary" icon="search" @click="getList">查询</a-button>
      </div>
      <a-button type="primary" class="add_box" @click="handleAdd">
        <span>
          <a-icon type="plus" />
        </span>
        <span>{{ addBtnText }}</span>
      </a-button>
    </div>
    <Modal v-model="visible" :width="modalWidth" :title="modalTitle" @ok="handleOK">
      <a-form :form="form">
        <a-form-item
          v-for="item in formList"
          :key="item.key"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          :label="item.label"
        >
          <a-select
            v-if="item.type === 'select'"
            v-decorator="[
              item.key,
              { initialValue: detailInfo[item.key], rules: [{ required: item.required, message: item.placeholder }] }
            ]"
            :placeholder="item.placeholder"
            style="width: 100%"
          >
            <a-select-option :key="selectItem.name" v-for="selectItem in item.option" :value="selectItem.value">
              {{ selectItem.name }}
            </a-select-option>
          </a-select>
          <a-switch
            :defaultChecked="detailInfo[item.key]"
            v-else-if="item.type === 'switch'"
            v-decorator="[
              item.key,
              { initialValue: detailInfo[item.key], rules: [{ required: item.required, message: item.placeholder }] }
            ]"
          />
          <a-radio-group
            v-else-if="item.type === 'radio'"
            v-decorator="[
              item.key,
              { initialValue: detailInfo[item.key], rules: [{ required: item.required, message: item.placeholder }] }
            ]"
            :placeholder="item.placeholder"
            button-style="solid"
          >
            <a-radio-button :key="radioItem.name" v-for="radioItem in item.option" :value="radioItem.value">
              {{ radioItem.name }}
            </a-radio-button>
          </a-radio-group>
          <a-checkbox-group
            v-else-if="item.type === 'checkbox'"
            v-decorator="[
              item.key,
              { initialValue: detailInfo[item.key], rules: [{ required: item.required, message: item.placeholder }] }
            ]"
            :placeholder="item.placeholder"
            button-style="solid"
          >
            <a-checkbox :key="checkItem.name" v-for="checkItem in item.option" :value="checkItem.value">
              {{ checkItem.name }}
            </a-checkbox>
          </a-checkbox-group>
          <a-date-picker
            v-else-if="item.type === 'date'"
            style="width: 100%"
            :showTime="item.showTime"
            v-decorator="[
              item.key,
              { initialValue: detailInfo[item.key], rules: [{ required: item.required, message: item.placeholder }] }
            ]"
            :placeholder="item.placeholder"
          />
          <a-textarea
            v-else-if="item.type === 'textarea'"
            style="width: 100%"
            v-decorator="[
              item.key,
              { initialValue: detailInfo[item.key], rules: [{ required: item.required, message: item.placeholder }] }
            ]"
            :placeholder="item.placeholder"
          />
          <a-input
            v-else
            allowClear
            v-decorator="[
              item.key,
              { initialValue: detailInfo[item.key], rules: [{ required: item.required, message: item.placeholder }] }
            ]"
            :placeholder="item.placeholder"
          />
        </a-form-item>
      </a-form>
    </Modal>
    <Table
      :dataList="list2"
      :cloums="cloums"
      :widthDrag="true"
      :virtualScroll="virtualScrollOpen"
      :itemNum="tableItemNum"
      :itemH="tableItemH"
    >
      <div v-for="(slotItem, i) in slotAction" :key="i + 'q'" :slot="slotItem.key" slot-scope="{ cloumsItem, item }">
        <div v-html="slotItem.renderContent(item)"></div>
      </div>
      <div slot="action" slot-scope="{ cloumsItem, item }" class="flex_box">
        <div v-for="(actionItem, index) in cloumsItem.actionList" :key="index + 'w'">
          <a-button
            :type="actionItem.btnType ? actionItem.btnType : 'primary'"
            v-if="actionItem.showCondition ? actionItem.showCondition(item) : true"
            @click="actionClick(item, actionItem)"
          >
            {{ actionItem.text }}
          </a-button>
        </div>
      </div>
    </Table>
    <div class="pagination_box" v-if="list2.length > 0">
      <a-pagination show-size-changer @change="onShowSizeChange" v-model="page" :total="total" show-less-items />
      <span style="margin-left: 10px">共{{ Math.ceil(total / pageSize) }}页</span>
    </div>
  </div>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}
import { message, Modal } from 'ant-design-vue'
import { VirtualScroll } from '@/my-components'

export default {
  name: 'TablePage',
  components: { VirtualScroll },
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
      list2: [],
      searchInfo: {},
      total: 100,
      left: '',
      top: '',
      modalTitle: '',
      searchText: '',
      detailInfo: {},
      isDrag: false,
      siteId: '',
      type: 1, //1-新增 2-编辑
      formItemLayout,
      visible: false,
      page: 1,
      list3: [],
      tableAction: [],
      pageSize: 10
    }
  },
  created() {
    for (let i = 0; i < 100; i++) {
      this.list2.push({
        name: `name${i + 1}`,
        type: 1,
        kaiguan: true
      })
    }
    this.slotAction = this.cloums.filter(item => item.scopedSlots && item.scopedSlots !== 'action')

    this.getList()
  },
  mounted() {},
  methods: {
    handleAdd() {
      //   this.list2 = this.list2.slice(0, 500)
      //   return false
      this.form.resetFields()
      this.detailInfo = ''
      this.type = 1
      this.modalTitle = this.addBtnText
      this.visible = true
    },
    onShowSizeChange(page, pageSize) {
      console.log(pageSize)
      this.page = page
      this.pageSize = pageSize
      this.getList()
    },
    actionClick(item, actionItem) {
      console.log(actionItem.type)
      if (actionItem.type === 'delete') {
        Modal.confirm({
          content: actionItem.promptContent ? actionItem.promptContent : '是否删除该站点？',
          onOk: () => {
            this.deleteOk(item, actionItem.fieldName)
          }
        })
      } else if (actionItem.type === 'edit') {
        this.handleEdit(item)
      }
    },
    refGetListData() {
      return this.list
    },
    handleEdit(item) {
      this.form.resetFields()
      this.detailInfo = item
      this.actItem = item
      console.log(this.detailInfo)
      this.type = 2
      this.modalTitle = this.editText
      this.visible = true
    },
    async getList() {
      const params = {
        ...this.searchInfo,
        ...this.searchParams,
        pageSize: this.pageSize,
        pageNum: this.page - 1
      }
      const { getList } = this.api
      const res = await getList(params)
      if (res) {
        if (res.data) {
          this.total = res.data.total
          this.list = this.formatList(res) || []
        }
      }
      console.log(res)
    },
    async add(data) {
      const { add } = this.api
      const res = await add(data)
      if (res) {
        this.visible = false
        this.getList()
        message.success('添加成功')
      }
    },
    async edit(data) {
      const { edit } = this.api
      const res = await edit(data)
      if (res.code === 2000) {
        this.getList()
        this.visible = false
        this.form.resetFields()
        message.success('修改成功')
      }
    },
    async deleteOk(item, fieldName) {
      let params = {}
      params[fieldName] = item[fieldName]
      console.log(params)
      const { del } = this.api
      const res = await del(params)
      if (res.code === 2000) {
        this.getList()
        message.success('删除成功')
      }
    },
    handleOK() {
      this.form.validateFields((err, values) => {
        if (!err) {
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
    margin-bottom: 20px;
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
