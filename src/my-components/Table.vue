/* eslint-disable camelcase */
<template>
  <div class="table">
    <div v-if="renderA"></div>
    <div class="table_contanier">
      <table class="table_box" :style="`width:${tableW}px`">
        <thead class="table_header" :style="`width:${tableW}px`">
          <tr>
            <th v-if="showCheck" :style="`width:50px;text-align:center;border:${showBorder ? '' : 'none'}`">
              <div class="table_header_item">
                <a-checkbox @change="handleAllCheck" v-model="checkAll"></a-checkbox>
              </div>
            </th>
            <th
              v-for="(item, index) in columns"
              :key="index + 'q'"
              :style="`width:${item.width}px;text-align:${item.align};border:${showBorder ? '' : 'none'}`"
            >
              <div class="table_header_item">
                {{ item.title }}
                <div v-if="widthDrag" class="sub" @mousedown="splitDown($event, index)" />
              </div>
            </th>
          </tr>
        </thead>
        <div v-if="isDrag" class="xian" :style="`left:${xian_left}px`" />
        <!-- 开启虚拟滚动 -->
        <div
          v-if="virtualScroll"
          class="table_content"
          ref="table_content"
          @scroll="hanldeScroll"
          :style="
            `height:${viewH}px;overflow-y:auto;position:${dataList.length == 0 ? 'relative' : ''}; min-height:${
              dataList.length == 0 ? '300px' : ''
            }`
          "
        >
          <div :style="{ height: scorllH }">
            <tbody :style="`transform:translateY(${offSetY}px); `">
              <tr class="table_conten_item_box" v-for="(item, index) in list" :style="{ height: itemH + 'px' }">
                <td
                  v-if="showCheck"
                  class="table_content_item"
                  :style="
                    `width:50px;align-items:center;justify-content:center;border:${showBorder ? '' : 'none'};padding:0`
                  "
                >
                  <a-checkbox @change="checkChange(item)" :checked="item.isCheck"></a-checkbox>
                </td>
                <td
                  v-for="(item2, key) in columns"
                  :key="key + 'w'"
                  class="table_content_item"
                  :style="
                    `width:${item2.width}px;text-align:${item2.align};border:${
                      showBorder ? '' : 'none'
                    };justify-content:${item2.align};align-items:center;padding:0`
                  "
                >
                  <slot
                    v-if="item2.renderSlot"
                    :name="item2.key"
                    :columnsItem="item2"
                    :item="item"
                    :index="index"
                  ></slot>
                  <div v-else-if="item2.renderHtml" v-html="item2.renderHtml(item)"></div>
                  <div v-else>{{ item[item2.key] ? item[item2.key] : '-' }}</div>
                </td>
              </tr>
            </tbody>
          </div>
          <div class="no_data" v-if="dataList.length == 0">
            <a-empty description=" 暂无数据" />
          </div>
        </div>
        <!-- 不设置虚拟滚动 -->
        <div
          v-else
          class="table_content"
          ref="table_content"
          :style="
            `height:${scroll.y ? scroll.y + 'px' : 'auto'}; position:${
              dataList.length == 0 ? 'relative' : ''
            }; min-height:${dataList.length == 0 ? '300px' : ''}`
          "
        >
          <div>
            <tbody>
              <tr
                class="table_conten_item_box"
                :key="index + 'a'"
                :style="{ height: 'auto' }"
                v-for="(item, index) in list"
              >
                <td
                  v-for="item2 in columns"
                  :key="item2.key"
                  class="table_content_item"
                  :style="
                    `width:${item2.width}px;text-align:${item2.align};justify-content:${item2.align};align-items:center`
                  "
                >
                  <slot v-if="item2.renderSlot" :name="item2.key" :columnsItem="item2" :item="item"></slot>
                  <div v-else-if="item2.renderHtml" v-html="item2.renderHtml(item)"></div>
                  <div v-else>{{ item[item2.key] || item[item2.key] === 0 ? item[item2.key] : '-' }}</div>
                </td>
              </tr>
              <div class="no_data" v-if="dataList.length == 0">
                <a-empty description=" 暂无数据" />
              </div>
            </tbody>
          </div>
        </div>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Table',
  watch: {
    dataList(val) {
      this.list = this.$props.dataList
      // 重新计算
      if (this.$props.virtualScroll) {
        // 计算总高度
        // const table_content = this.$refs.table_content
        table_content.scrollTop = 0
        this.scorllH = this.itemH * this.dataList.length + 'px'
        // 计算可视区域高度
        this.viewH = this.itemH * this.$props.itemNum
      }
    },
    rowCheck(val) {
      this.showCheck = val
    }
  },
  props: {
    itemNum: {
      type: Number,
      default: 5
    }, // 展示个数
    itemH: {
      type: Number,
      default: 40
    }, // 表格单行高度
    dataList: {
      type: Array,
      default: () => []
    },
    widthDrag: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    scroll: {
      type: Object,
      default: () => {
        return {
          y: screen.availHeight - 500,
          x: Number
        }
      }
    },
    virtualScroll: {
      type: Boolean,
      default: false
    },
    exportFileName: {
      type: String,
      default: '下载'
    },
    showBorder: {
      type: Boolean,
      default: true
    },
    rowCheck: {
      type: Boolean,
      default: false
    }
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
      pageSize: 10
    }
  },
  created() {
    this.columns.forEach(item => {
      this.tableW += parseInt(item.width)
    })
    console.log(this.scroll)
    if (this.$props.rowCheck) {
      this.showCheck = true
      this.$props.dataList.isCheck = false
      this.tableW += 50
      // this.$props.dataList.forEarch((item.isCheck = false))
    }
    console.log(this.dataList)
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
    console.log(this.tableW)
    console.log(table_content.offsetWidth, table_content.clientWidth)
    this.scrollWidth = table_content.offsetWidth - table_content.clientWidth
  },
  methods: {
    hanldeScroll(e) {
      // console.log(e.target.scrollTop) // 滚动条高度
      this.offSetY = e.target.scrollTop // 设置动态偏移量模拟滚动
      this.list = this.dataList.slice(
        Math.floor(e.target.scrollTop / this.itemH),
        Math.floor(e.target.scrollTop / this.itemH) + this.itemNum + 5
      )
    },
    getCheck() {
      console.time()
    },
    handleAllCheck(e) {
      console.log(e)
      if (e.target.checked) {
        this.list.forEach(item => (item.isCheck = true))
        this.dataList.forEach(item => (item.isCheck = true))
        this.renderA = !this.renderA
        this.checkList = this.dataList
      } else {
        this.list.forEach(item => (item.isCheck = true))
        this.dataList.forEach(item => (item.isCheck = false))
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
        this.checkList = this.checkList.filter(i => i.num != item.num)
        this.checkAll = false
      }
      this.renderA = !this.renderA
      this.$emit('checkChange', this.checkList)
      // this.$props.rowCheck(this.checkList)
    },
    handleExport() {
      if (this.list.length == 0) {
        message.error('暂无数据，无法导出')
        return false
      }
      let titleName = ''
      //列标题
      let str = ``
      let tableHeader = ''
      let tablecolumns = this.columns.filter(item => item.scopedSlots !== 'action')
      tablecolumns.forEach(item => {
        tableHeader += `<td style='text-align:center'>${item.title}</td>`
      })
      str += `<tr style='text-align:center'>${tableHeader}</tr>`
      //循环遍历，每行加入tr标签，每个单元格加td标签
      for (let i = 0; i < this.dataList.length; i++) {
        str += '<tr>'
        let item = this.dataList[i]
        tablecolumns.forEach(cloumItem => {
          str += `<td style='text-align:${cloumItem.align};height:auto;width:${cloumItem.width}px'>${
            cloumItem.renderHtml ? cloumItem.renderHtml(item) : item[cloumItem.key] + '\t'
          }</td>`
        })
        //增加\t为了不让表格显示科学计数法或者其他格式
        str += '</tr>'
      }
      //   console.log(str)
      //Worksheet名
      let worksheet = 'Sheet1'
      let url = 'data:application/vnd.ms-excel;base64,'

      //下载的表格模板数据
      let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:x="urn:schemas-microsoft-com:office:excel" 
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`
      //下载模板
      var link = document.createElement('a')
      link.href = url + this.base64(template)
      link.download = `${this.$props.exportFileName}`
      link.click()
    },
    base64(s) {
      return window.btoa(unescape(encodeURIComponent(s)))
    },
    splitDown: function(e, index) {
      // 鼠标按下
      const startX = e.pageX
      this.xian_left = e.pageX
      this.isDrag = true
      const width = parseInt(this.columns[index].width)
      const tableW = this.tableW
      window.onmousemove = e => {
        if (this.isDrag) {
          document.body.style.cursor = 'col-resize'
          // 偏移量
          const l = e.pageX - startX
          if (width + l >= 36) {
            this.tableW = tableW + l
            this.columns[index].width = width + l
            this.xian_left = e.pageX
          }
        }
      }
      window.onmouseup = e => {
        // 鼠标松开
        if (this.isDrag) {
          const l = parseInt(e.pageX - startX)
          if (width + l >= 36) {
            this.tableW = tableW + l
            this.columns[index].width = width + l
            this.xian_left = e.pageX
          }
          document.body.style.cursor = 'default' // 鼠标样式
          this.isDrag = false
          window.onmousemove = null
          window.onmouseup = null
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.table_contanier {
  max-width: 100%;
  box-sizing: content-box;
  overflow-x: auto;
  .table_box {
    border-left: 1px solid #e8e8e8;
    overflow: hidden;
    .table_header {
      background: #f2f9ff;
      font-weight: bold;
      display: flex;
      border-top: 1px solid #e8e8e8;
    }
    tr {
      height: auto;
      border-bottom: 1px solid #e8e8e8;
      //   border-left: 1px solid #e8e8e8;
    }
    tr > td,
    tr > th {
      height: auto;
      border-right: 1px solid #e8e8e8;
    }
    .table_header_item {
      position: relative;
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
    .table_conten_item_box:hover .table_content_item {
      background: rgba(0, 0, 0, 0.02);
    }
    .table_content {
      background: #ffffff;
      overflow-y: auto;
      //   max-height: calc(100vh - 400px);
      //   height: 70vh;
    }
    .table_content_item {
      display: flex;
      padding: 10px;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
