<template>
  <div class="table">
    <div v-if="renderA"></div>
    <div class="table_contanier">
      <div class="table_box" :style="`width:${tableW}px`">
        <div class="table_header" :style="`width:${tableW - scrollWidth}px`">
          <div
            v-if="showCheck"
            class="table_header_item"
            :style="`width:50px;text-align:center;border:${showBoder ? '' : 'none'}`"
          >
            <a-checkbox @change="handleAllCheck" v-model="checkAll"></a-checkbox>
          </div>
          <div
            class="table_header_item"
            v-for="(item, index) in cloums"
            :key="item.title"
            :style="`width:${item.width}px;text-align:${item.align};border:${showBoder ? '' : 'none'}`"
          >
            {{ item.title }}
            <div v-if="widthDrag" class="sub" @mousedown="splitDown($event, index)" />
          </div>
        </div>
        <div v-if="isDrag" class="xian" :style="`left:${xian_left}px`" />
        <!-- 开启虚拟滚动 -->
        <div
          v-if="virtualScroll"
          class="table_content"
          @scroll="hanldeScroll"
          :style="
            `height:${viewH}px;overflow-y:auto;position:${dataList.length == 0 ? 'relative' : ''}; min-height:${
              dataList.length == 0 ? '300px' : ''
            }`
          "
        >
          <div :style="{ height: scorllH }" ref="table_content">
            <div :style="`transform:translateY(${offSetY}px); `">
              <div
                class="table_conten_item_box"
                v-for="(item, index) in list"
                :style="{ height: itemH + 'px' }"
              >
                <div
                  v-if="showCheck"
                  class="table_content_item"
                  :style="`width:50px;align-items:center;justify-content:center;border:${showBoder ? '' : 'none'}`"
                >
                  <input @change="checkChange(item)" :checked="item.isCheck" type="checkbox" />
                </div>
                <div
                  v-for="(item2, key) in cloums"
                  :style="`width:${item2.width}px;text-align:${item2.align}`"
                >
                  <div
                    class="table_content_item"
                    :style="
                      `justify-content:${item2.align};align-items:${item2.align};border:${showBoder ? '' : 'none'}`
                    "
                  >
                    <slot v-if="item2.scopedSlots" :name="item2.key" :item="item" :index="index"></slot>
                    <div v-else>{{ item[item2.key] ? item[item2.key] : '-' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="no_data" v-if="dataList.length == 0">
            <a-empty description=" 暂无数据" />
          </div>
        </div>
        <!-- 不设置虚拟滚动 -->
        <div
          class="table_content"
          v-else
          ref="table_content"
          :style="
            `height:${scroll.y ? scroll.y + 'px' : 'auto'}; position:${
              dataList.length == 0 ? 'relative' : ''
            }; min-height:${dataList.length == 0 ? '300px' : ''}`
          "
        >
          <div>
            <div
              class="table_conten_item_box"
              :style="{ height: itemH + 'px' }"
              v-for="(item, index) in list"
            >
              <div
                v-if="showCheck"
                class="table_content_item"
                :style="`width:50px;align-items:center;justify-content:center;height:100%`"
              >
                <a-checkbox @change="checkChange(item)" :checked="item.isCheck"></a-checkbox>
              </div>
              <div
                v-for="(item2, key) in cloums"
                :style="`width:${item2.width}px;text-align:${item2.align}`"
              >
                <div
                  class="table_content_item"
                  :style="`justify-content:${item2.align};align-items:${item2.align}`"
                >
                  <slot v-if="item2.scopedSlots" :name="item2.key" :item="item"></slot>
                  <div v-else>{{ item[item2.key] || item[item2.key] === 0 ? item[item2.key] : '-' }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="no_data" v-if="dataList.length == 0">
            <a-empty description=" 暂无数据" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  title: 'Table',
  watch: {
    dataList(val) {
      this.list = this.$props.dataList
      // 重新计算
      if (this.$props.virtualScroll) {
        // 计算总高度
        this.scorllH = this.itemH * this.dataList.length + 'px'
        // 计算可视区域高度
        this.viewH = this.itemH * this.$props.itemNum
      }
    },
    rowCheck(val) {
      this.showCheck = val
    },
  },
  props: {
    itemNum: Number, //展示个数
    itemH: Number, // 表格单行高度
    dataList: {
      type: Array,
      default: () => [],
    },
    widthDrag: {
      type: Boolean,
      default: false,
    },
    cloums: {
      type: Array,
      default: () => [],
    },
    scroll: {
      type: Object,
      default: () => {
        return {
          y: Number,
          x: Number,
        }
      },
    },
    virtualScroll: {
      type: Boolean,
      default: false,
    },
    showBoder: {
      type: Boolean,
      default: false,
    },
    rowCheck: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      renderA: false,
      tableW: 0,
      list: [],
      checkList: [],
      checkAll: false,
      showCheck: false,
      isDrag: false,
      xian_left: '',
      viewH: '',
      terminalList: [],
      scrollWidth: '',
      total: 0,
      left: '',
      top: '',
      scorllH: '', // 列表总高度
      offSetY: '',
      page: 1,
      pageSize: 10,
    }
  },
  created() {
    if (this.$props.rowCheck) {
      this.showCheck = true
      this.$props.dataList.isCheck = false
      // this.$props.dataList.forEarch((item.isCheck = false))
    }
    console.log(this.dataList)
    this.cloums.forEach((item) => {
      this.tableW += parseInt(item.width)
    })
    if (this.$props.virtualScroll) {
      // 计算总高度
      this.scorllH = this.itemH * this.dataList.length + 'px'
      // 计算可视区域高度
      this.viewH = this.itemH * this.$props.itemNum
      // 默认展示
      this.list = this.dataList.slice(0, this.itemNum)
    } else {
      this.list = this.$props.dataList
    }
  },
  mounted() {
    const table_content = this.$refs.table_content
    this.scrollWidth = this.tableW - table_content.clientWidth
  },
  methods: {
    hanldeScroll(e) {
      // console.log(e.target.scrollTop) // 滚动条高度
      this.offSetY = e.target.scrollTop - (e.target.scrollTop % this.itemH) //设置动态偏移量模拟滚动
      this.list = this.dataList.slice(
        Math.floor(e.target.scrollTop / this.itemH),
        Math.floor(e.target.scrollTop / this.itemH) + this.itemNum
      )
    },
    getCheck() {
      console.time()
    },
    handleAllCheck(e) {
      console.log(e)
      if (e.target.checked) {
        this.list.forEach((item) => (item.isCheck = true))
        this.dataList.forEach((item) => (item.isCheck = true))
        this.renderA = !this.renderA
        this.checkList = this.dataList
      } else {
        this.list.forEach((item) => (item.isCheck = true))
        this.dataList.forEach((item) => (item.isCheck = false))
        this.renderA = !this.renderA
        this.checkList = []
      }
      this.$emit('checkChange', this.checkList)
      // this.$props.rowCheck(this.checkList)
    },
    checkChange(item) {
      item.isCheck = !item.isCheck
      if (item.isCheck) {
        this.checkList.push(item)
      } else {
        console.time()
        this.checkList = this.checkList.filter((i) => i.num != item.num)
        console.timeEnd()
        this.checkAll = false
      }
      this.renderA = !this.renderA
      this.$emit('checkChange', this.checkList)
      // this.$props.rowCheck(this.checkList)
    },
    splitDown: function (e, index) {
      // 鼠标按下
      const left = e.offsetX
      const startX = e.pageX
      this.xian_left = e.pageX
      this.isDrag = true
      const parentNode = e.target.parentNode
      const width = parseInt(this.cloums[index].width)
      const tableW = this.tableW
      window.onmousemove = (e) => {
        if (this.isDrag) {
          document.body.style.cursor = 'col-resize'
          // this.xian_left = Math.round(e.pageX )
          // 偏移量
          const l = e.pageX - startX
          if (width + l >= 36) {
            this.tableW = tableW + l
            this.cloums[index].width = width + l
            this.xian_left = e.pageX
          }
          // document.body.style.cursor = 'col-resize' //鼠标样式

          // parentNode.style.width = width + l + 'px' //td 改变宽度
        }
      }
      window.onmouseup = (e) => {
        // 鼠标松开
        if (this.isDrag) {
          const l = e.pageX - startX
          if (width + l >= 36) {
            this.tableW = tableW + l
            this.cloums[index].width = width + l
            this.xian_left = e.pageX
          }
          document.body.style.cursor = 'default' // 鼠标样式
          this.isDrag = false
          window.onmousemove = null
          window.onmouseup = null
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
.table_contanier {
  width: 100%;
  overflow-x: auto;

  .table_box {
    .table_header {
      width: 100%;
      background: #f2f9ff;
      font-weight: bold;
      display: flex;
    }
    .table_header_item {
      position: relative;
      border-top: 1px solid #e8e8e8;
      border-left: 1px solid #e8e8e8;
      padding: 10px;
    }
    .xian {
      position: fixed;
      top: 0;
      z-index: 10001;
      width: 1px;
      border: 1px dashed #999999;
      height: 100%;
    }
    .sub {
      width: 4px;
      opacity: 0;
      position: absolute;
      background: #ffffff;
      top: 0;
      height: 40px;
      right: -1px;
      cursor: col-resize;
      z-index: 1000;
    }
    .header_fixed {
      position: absolute;
      left: 0;
      top: 0;
    }
    .table_conten_item_box {
      position: relative;
      display: flex;
    }
    .table_content {
      background: #ffffff;
      overflow-y: auto;
      border-right: 1px solid #e8e8e8;
      max-height: calc(100vh - 400px);
      //   height: 70vh;
    }
    .table_content_item {
      display: flex;
      height: 100%;
      padding: 10px;
      justify-content: flex-start;
      align-items: flex-start;
      border-top: 1px solid #e8e8e8;
      border-left: 1px solid #e8e8e8;
    }
  }
}
</style>
