<template>
  <div class="VirtualScroll">
    <div @scroll="hanldeScroll" ref="content" :style="`height:${viewH}px;overflow-y:auto;width:auto`">
      <div :style="{ height: scorllH }">
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
  name: 'VirtualScroll',
  watch: {
    sourceData(val) {
      let content = this.$refs.content
      content.scrollTop = 0
      this.dataListSource = JSON.parse(JSON.stringify(val || []))
      this.scorllH = (this.itemH * this.dataListSource.length) / this.$props.oneLineItemNum + 'px'
      // 计算可视区域高度
      this.viewH = this.itemH * this.$props.itemNum
      list = this.dataListSource.slice(0, this.itemNum * this.$props.oneLineItemNum)
      this.offSetY = 0
      this.$emit('changeList', list)
    },
  },
  model: {
    prop: 'dataList', // 需要展示的数组，需要双向绑定
    event: 'changeList',
  },
  props: {
    itemNum: Number, //展示个数
    itemH: Number, // 单行高度
    oneLineItemNum: {
      //单行显示个数
      type: Number,
      require: true,
      default: 1,
    },
    // 用于展示的数组
    dataList: {
      type: Array,
      require: true,
      default: () => [],
    },
    // 数据源
    sourceData: {
      type: Array,
      require: true,
      default: () => [],
    },
  },
  computed: {},
  created() {
    //   深拷贝数据源
    let list = []
    this.dataListSource = JSON.parse(JSON.stringify(this.sourceData || []))
    this.scorllH = (this.itemH * this.dataListSource.length) / this.$props.oneLineItemNum + 'px'
    // 计算可视区域高度
    this.viewH = this.itemH * this.$props.itemNum
    list = this.dataListSource.slice(0, this.itemNum * this.$props.oneLineItemNum)
    this.$emit('changeList', list)
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
      // 根据滚动条高度计算需要截取的数组区间
      let list = this.dataListSource.slice(
        Math.ceil(e.target.scrollTop / this.itemH) * this.$props.oneLineItemNum,
        Math.ceil(e.target.scrollTop / this.itemH) * this.$props.oneLineItemNum +
          this.itemNum * this.$props.oneLineItemNum
      )

      this.$emit('changeList', list)
    },
  },
}
</script>
<style lang="less" scoped>
.VirtualScroll {
}
</style>
