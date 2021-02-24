<template>
  <div class="">
    <CardListPage :config="config" :searchParams="searchParams" ref="tabPage" @openDetail="openDetail">
      <!-- 页面头部自定义   -->
      <!-- <template slot="pageHeader">
        <a-tabs default-active-key="1" style="width:350px">
          <a-tab-pane key="1" tab="状态一"> </a-tab-pane>
          <a-tab-pane key="2" tab="状态二" force-render> </a-tab-pane>
          <a-tab-pane key="3" tab="状态三"> </a-tab-pane>
        </a-tabs>
      </template> -->
      <!-- 搜索自定义  -->
      <div slot="searchContent">
        <a-input v-model="searchParams.text" placeholder="请输入" />
      </div>
      <!-- 卡片标题自定义 -->
      <div slot="cardTitle" slot-scope="{ item }">
        <div>{{ item.supplierName }}</div>
      </div>
      <!-- 卡片内容自定义   -->
      <div slot="cardContent" slot-scope="{ item }">
        <div class="cardItem">
          <FormatRender :data="item" :columns="formatColums" lineMargin="0 0 5px 0"></FormatRender>
          <div class="flex_box_between">
            <a-button type="primary">自定义操作一</a-button>
            <a-button type="primary">自定义操作二</a-button>
          </div>
        </div>
      </div>
      <!-- 编辑弹窗左侧自定义 -->
      <div slot="editLeftContent"></div>
      <!-- 表单自定义 -->
      <div slot="aa">
        <a-input v-model="text" placeholder="请输入" />
      </div>
      <!-- 详情自定义 -->
      <div slot="detailContent">
        <FormatRender :data="actItem" :columns="detailColums" lineMargin="10px 0"></FormatRender>
      </div>
    </CardListPage>
  </div>
</template>
<script>
import CardListPage from '@/my-components/CardListPage'
import config from './config'
import { FormatRender } from '@/my-components'
export default {
  name: 'TableListWrapper',
  components: { CardListPage, FormatRender },
  data() {
    return {
      config: config,
      searchParams: {
        supplierAuditStatus: 1
      },
      text: '',
      actItem: {
        name: '565656'
      },
      detailColums: [
        {
          name: '公司地址',
          key: 'supplierAddr',
          width: '100%'
        },
        {
          name: '法人姓名',
          nameStyle: '',
          contentStyle: '',
          key: 'supplierName',
          width: '100%'
        },
        {
          name: '法人电话',
          nameStyle: '',
          contentStyle: 'color:blue',
          key: 'supplierCorporationPhone',
          width: '100%'
        }
      ],
      formatColums: [
        {
          name: '公司地址',
          key: 'supplierAddr',
          ellipsis: true,
          contentStyle: 'width:150px',
          width: '100%'
        },
        {
          name: '法人姓名',
          nameStyle: '',
          contentStyle: '',
          key: 'supplierName',
          ellipsis: true,
          contentStyle: 'width:150px',
          width: '100%'
        },
        {
          name: '法人电话',
          nameStyle: '',
          contentStyle: 'color:blue',
          key: 'supplierCorporationPhone',
          width: '100%'
        }
      ]
    }
  },
  created() {},
  mounted() {},
  methods: {
    openDetail(data) {
      this.actItem = data
      console.log(data)
    }
  }
}
</script>
<style lang="less" scoped>
.cardItem {
}
.title {
  color: red;
}
</style>
