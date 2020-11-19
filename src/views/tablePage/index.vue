<template>
  <div class="">
    <TablePage :config="config" :searchParams="searchParams">
      <div slot="searchContent">
        <a-input v-model="searchParams.text" placeholder="请输入" />
      </div>
    </TablePage>
  </div>
</template>
<script>
import TablePage from '@/my-components/TablePage'
import config from './config'
export default {
  name: 'TableListWrapper',
  components: { TablePage },
  data() {
    return {
      config: config,
      searchParams: {
        add: ''
      }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang="less" scoped></style>
