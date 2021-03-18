<template>
  <div class="format_container">
    <div class="format_box">
      <div
        v-for="item in columns"
        :key="item.key"
        class="format_item"
        :style="`width:${item.width};margin:${lineMargin}`"
      >
        <div
          :style="`word-break: keep-all; ${item.nameStyle ? item.nameStyle : nameStyle}`"
          :class="`${item.nameClassName}`"
        >
          <a-icon :type="item.iconType" v-if="item.iconType" />
          {{ item.name }}<span v-if="showColon">：</span>
        </div>
        <template v-if="item.renderSlot">
          <slot :name="item.key" :data="data"></slot>
        </template>
        <div
          v-else-if="item.renderHtml"
          v-html="item.renderHtmlText"
          :class="
            `${
              item.ellipsis ? `ellipsis ${item.contentClassName ? item.contentClassName : ''}` : item.contentClassName
            }`
          "
          :style="item.contentStyle ? item.contentStyle : contentStyle"
        ></div>
        <div
          v-else
          :class="
            `${
              item.ellipsis ? `ellipsis ${item.contentClassName ? item.contentClassName : ''}` : item.contentClassName
            }`
          "
          :style="item.contentStyle ? item.contentStyle : contentStyle"
          :title="data[item.key]"
        >
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
  watch: {
    data: {
      handler() {
        this.formatRenderHtml()
      },
      deep: true
    },
    columns: {
      handler() {
        this.formatRenderHtml()
      },
      deep: true
    }
  },
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
    contentStyle: {
      type: String
    },
    nameStyle: {
      type: String
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
  created() {
    this.formatRenderHtml()
  },
  methods: {
    formatRenderHtml() {
      this.$props.columns.forEach(item => {
        if (item.renderHtml) {
          item.renderHtmlText = item.renderHtml(this.$props.data)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.format_container {
  width: 100%;
  .format_box {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .format_item {
    display: flex;
    overflow: hidden;
    align-items: center;
    text-overflow: ellipsis;
  }
}
</style>
