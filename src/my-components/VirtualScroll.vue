<template>
  <div class="VirtualScroll">
    <div
      class="table_content"
      @scroll="hanldeScroll"
      :style="`height:${viewH}px;overflow-y:auto;width:auto
            `"
    >
      <div :style="{ height: scorllH }" ref="table_content">
        <div :style="`transform:translateY(${offSetY}px); `">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  watch: {
    sourceData(val) {
      this.dataListSource = JSON.parse(JSON.stringify(val || []))
      this.scorllH = this.itemH * this.dataListSource.length + 'px'
      // 计算可视区域高度
      this.viewH = this.itemH * this.$props.itemNum
      this.list = this.dataListSource.slice(0, this.itemNum)
      console.log(this.list)
      this.$emit('visible-event', this.list)
    },
  },
  model: {
    prop: 'dataList', //这个字段，是指父组件设置 v-model 时，将变量值传给子组件的 msg
    event: 'visible-event', //这个字段，是指父组件监听 parent-event 事件
  },
  props: {
    itemNum: Number, //展示个数
    itemH: Number, // 单行高度
    lineItemNum: {
      //单行显示个数
      type: Number,
      default: 1,
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    sourceData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {},
  created() {
    this.dataListSource = JSON.parse(JSON.stringify(this.sourceData || []))
    this.scorllH = (this.itemH * this.dataListSource.length) / this.$props.lineItemNum + 'px'
    // 计算可视区域高度
    this.viewH = this.itemH * this.$props.itemNum
    this.list = this.dataListSource.slice(0, this.itemNum * this.$props.lineItemNum)
    console.log(this.list)
    this.$emit('visible-event', this.list)
  },
  data() {
    return {
      scorllH: '',
      viewH: '',
      offSetY: '',
      list: [],
      dataListSource: [],
    }
  },
  methods: {
    hanldeScroll(e) {
      // console.log(e.target.scrollTop) // 滚动条高度
      this.offSetY = e.target.scrollTop //设置动态偏移量模拟滚动
      this.list = this.dataListSource.slice(
        Math.ceil(e.target.scrollTop / this.itemH) * this.$props.lineItemNum,
        Math.ceil(e.target.scrollTop / this.itemH) * this.$props.lineItemNum + this.itemNum * this.$props.lineItemNum
      )
      console.log(this.list)
      this.$emit('visible-event', this.list)
    },
  },
}
</script>
<style lang="less" scoped>
.VirtualScroll {
}
</style>
