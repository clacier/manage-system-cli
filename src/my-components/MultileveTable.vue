<template>
  <div>
    <a-table
      tableLayout="fixed"
      :pagination="false"
      ref="table"
      :columns="columnsData"
      :data-source="dataList"
      :bordered="showBorder"
      size="middle"
      :row-selection="rowSelection"
      :scroll="{ y: 400 }"
    >
      <template :slot="item.key" v-for="item in slotColumns" slot-scope="text, record, index">
        <slot :name="item.key" :item="record" :index="index" :columnsItem="columnsInfo[item.key]"> </slot>
      </template>
    </a-table>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
export default {
  name: '',
  components: {},
  watch: {
    columns: {
      handler() {
        this.initColumns(this.columns)
      },
      deep: true
    }
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    dataList: {
      type: Array,
      default: () => []
    },
    rowCheck: {
      type: Boolean,
      default: false
    },
    exportFileName: {
      type: String,
      default: '下载文件'
    },
    showBorder: {
      type: Boolean,
      default: true
    }
  },
  computed: {},
  created() {
    console.log(this.dataList)
    this.initColumns(this.columns)
  },
  mounted() {},
  beforeDestroy() {},
  data() {
    return {
      columnsData: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          fixed: 'left',
          filters: [
            {
              text: 'Joe',
              value: 'Joe'
            },
            {
              text: 'John',
              value: 'John'
            }
          ],
          onFilter: (value, record) => record.name.indexOf(value) === 0
        },
        {
          title: 'Other',
          children: [
            {
              title: 'Age',
              dataIndex: 'age',
              key: 'age',
              width: 200,
              sorter: (a, b) => a.age - b.age
            },
            {
              title: 'Address',
              children: [
                {
                  title: 'Street',
                  dataIndex: 'street',
                  key: 'street',
                  width: 200
                },
                {
                  title: 'Block',
                  children: [
                    {
                      title: 'Building',
                      dataIndex: 'building',
                      key: 'building',
                      width: 100
                    },
                    {
                      title: 'Door No.',
                      dataIndex: 'number',
                      key: 'number',
                      width: 100
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Company',
          children: [
            {
              title: 'Company Address',
              dataIndex: 'companyAddress',
              key: 'companyAddress',
              width: 200
            },
            {
              title: 'Company Name',
              dataIndex: 'companyName',
              key: 'companyName'
            }
          ]
        },
        {
          title: 'Gender',
          dataIndex: 'gender',
          key: 'gender',
          width: 80,
          fixed: 'right'
        }
      ],
      rowSelection: null,
      columnsInfo: {},
      slotColumns: []
    }
  },
  methods: {
    initColumns(columns) {
      let columnsArr = []
      columns.forEach(item => {
        item.dataIndex = item.key
        if (item.renderSlot) {
          item.scopedSlots = {
            customRender: item.key
          }
        }
        this.columnsInfo[item.key] = item
        columnsArr.push(item)
        if (item.children) {
          this.initColumns(item.children)
        }
      })
      this.slotColumns = this.slotColumns.concat(columnsArr.filter(item => item.renderSlot))
      this.columnsData = columnsArr
    },
    initRowSelection() {
      if (this.rowCheck) {
        this.rowSelection = {
          onChange: (selectedRowKeys, selectedRows) => {
            this.$emit('checkChange', selectedRows)
          },
          onSelect: (record, selected, selectedRows) => {
            this.$emit('checkChange', selectedRows)
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            this.$emit('checkChange', selectedRows)
          }
        }
      }
    },
    handleExport() {
      if (this.dataList.length == 0) {
        message.error('暂无数据，无法导出')
        return false
      }
      if (this.checkExport) {
        if (this.isExport) {
          this.checkExportTable()
        } else {
          this.columns.forEach(item => {
            item.isExport = true
          })
          this.renderA = !this.renderA
          message.info('请选择你将要导出的表格列')
          this.isExport = true
        }
      } else {
        this.exportTable()
      }
    },
    exportTable() {
      let table = this.$refs.table
      let str = ``
      let tableHeader = document.querySelector('thead').innerHTML
      str += tableHeader
      let tbodyStr = document.querySelector('tbody').innerHTML
      str += tbodyStr

      // console.log(str)
      // return
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
    }
  }
}
</script>
<style lang="less" scoped></style>
