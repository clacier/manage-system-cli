<template>
  <div class="format_container">
    <div class="format_box">
      <div v-for="item in cloums" class="format_item" :style="`width:${item.width}`">
        <div>{{ item.name }}:</div>
        <div v-if="item.renderContent">
          <div v-html="item.renderContent(data)"></div>
        </div>
        <div v-else :style="`color:${item.color}`">{{ data[item.key] ? data[item.key] : '-' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  watch: {},
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    cloums: {
      type: Array,
      default: () => []
    }
  },
  computed: {},
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.format_container {
  .format_box {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .format_item {
    display: flex;
    margin: 10px 0;
  }
}
</style>
