<template>
  <div class="">
    <MultileveTablePage :config="config" :searchParams="searchParams" ref="tabPage" @openDetail="openDetail">
      <!-- 页面头部自定义   -->
      <template slot="pageHeader">
        <a-tabs default-active-key="1" style="width: 50%">
          <a-tab-pane key="1" tab="Tab 1"> </a-tab-pane>
          <a-tab-pane key="2" tab="Tab 2" force-render> </a-tab-pane>
          <a-tab-pane key="3" tab="Tab 3"> </a-tab-pane>
        </a-tabs>
      </template>
      <!-- 表格自定义  -->
      <template slot="selfAction" slot-scope="{ item }">
        <a-button @click="selfActionClick(item)">自定义操作</a-button>
      </template>
      <!-- 编辑弹窗左侧自定义 -->
      <div slot="editLeftContent"></div>
      <!-- 表单自定义 -->
      <template slot="aa">56565</template>
      <!-- 搜索自定义  -->
      <template slot="searchContent">
        <div>
          <a-input v-model="searchParams.text" placeholder="请输入" />
        </div>
      </template>
      <!-- 详情自定义 -->
      <div slot="detailContent">
        <FormatRender :data="actItem" :columns="formatColumns"></FormatRender>
      </div>
    </MultileveTablePage>
  </div>
</template>
<script>
import MultileveTablePage from '@/my-components/MultileveTablePage'
import config from './config'
import { debounce } from '@/utils/format'
import { FormatRender } from '@/my-components'
export default {
  name: 'TableListWrapper',
  components: { MultileveTablePage, FormatRender },
  data() {
    return {
      config: config,
      searchParams: {
        supplierAuditStatus: 1,
      },
      actItem: {
        name: '565656',
      },
      formatColumns: [
        {
          name: '名称',
          key: 'name',
          nameStyle: 'color:red;font-size:18px',
          contentStyle: '',
          renderSlot: true,
          slotName: 'name1',
          width: '50%',
        },
        {
          name: '名称2',
          key: 'name2',
          nameStyle: '',
          contentStyle: '',
          renderHtml: (data) => {
            return `<span>${data.name}22222<span>`
          },
          width: '100%',
        },
        {
          name: '名称3',
          nameStyle: '',
          contentStyle: '',
          key: 'name3',
          width: '50%',
        },
        {
          name: '名称4',
          nameStyle: '',
          contentStyle: 'color:blue',
          key: 'name4',
          width: '50%',
        },
      ],
    }
  },
  created() {
    // this.config.tableConfig.exportFileName = '自定义下载名称'
  },
  mounted() {},
  methods: {
    openDetail(data) {
      this.actItem = data
      console.log(data)
    },
    selfActionClick(item) {
      console.log(item)
    },
  },
}
</script>
<style lang="less" scoped></style>
