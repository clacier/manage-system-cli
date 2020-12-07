<template>
  <div class="format_container">
    <div class="format_box">
      <div v-for="item in columns" class="format_item" :style="`width:${item.width};margin:${lineMargin}`">
        <div :style="item.nameStyle">{{ item.name }}<span v-if="showColon">：</span></div>
        <div v-if="item.renderSlot">
          <slot :name="item.key" :data="data"></slot>
        </div>
        <div v-else-if="item.renderHtml">
          <div v-html="item.renderHtml ? item.renderHtml(data) : ''"></div>
        </div>
        <div v-else :style="item.contentStyle">
          {{ data[item.key] ? data[item.key] : '-' }}
        </div>
      </div>
      <slot></slot>
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
    columns: {
      type: Array,
      default: () => []
    },
    lineMargin: {
      type: String,
      default: '10px 0'
    },
    showColon: {
      type: Boolean,
      default: true
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
    flex-wrap: wrap;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
