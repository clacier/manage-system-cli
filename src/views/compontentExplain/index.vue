<template>
  <div>
    <div v-for="item in config">
      <div style="margin:10px 0;color:#1890ff">{{ item.title }}</div>
      <Table :columns="columns" :dataList="item.data"></Table>
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: '',
  components: {},
  watch: {},
  props: {},
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  data() {
    return {
      config,
      columns: [
        {
          title: '参数',
          key: 'parmas',
          width: 200,
          align: 'center'
        },
        {
          title: '说明',
          key: 'text',
          width: 400,
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          width: 200,
          align: 'center'
        },
        {
          title: '默认值',
          key: 'default',
          width: 200,
          align: 'center'
        },
        {
          title: '可选值',
          key: 'val',
          width: 400,
          align: 'center'
        }
      ]
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped></style>
