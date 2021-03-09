<template>
  <div class="chartComponent ">
    <slot name="legend" v-if="chartConfig.hideLegend"></slot>
    <div :id="chartId" style="padding:5px 10px"></div>
  </div>
</template>
<script>
import { Chart, Util } from '@antv/g2'
import G2 from '@antv/g2'
import DataSet from '@antv/data-set'
import { chinaMap } from './chinaMap.js'
export default {
  name: 'StoreBaseChart',
  props: {
    chartId: {
      type: String,
      default: 'contanier'
    },
    chartConfig: {
      type: Object,
      default: () => {
        return {
          type: 'histogram', //line-线  histogram-柱状  radar-雷达  areaMap-面积
          options: {
            adjust: {
              type: 'dodge', //'stack -层叠' | 'dodge-分组散开' | 'jitter-扰动散开' | 'symmetric 对称'
              marginRatio: 0.1, //只对 'dodge' 生效 0~1
              dodgeBy: '', //只对 'dodge' 生效，声明以哪个数据字段为分组依据
              reverseOrder: false //只对 'stack' 生效，用于控制是否对数据进
            }
          },
          fill: '#ffffff',
          formatter: {
            y: val => {
              return val
            },
            x: val => {
              return val
            }
          },
          hideLegend: false
        }
      }
    },
    chartOptions: {
      type: Array,
      default: () => {
        return [
          {
            fields: ['a', 'b'], // 需要渲染的字段, 用于一个元素里渲染多条数据  渲染多条数据时，type无效
            x: 'item', //横坐标 //横坐标 这个字段应当作为唯一标识
            //   type: "type", //一个元素只渲染一条数据时用于区分类型
            adjust: {
              type: 'dodge', //'stack -层叠' | 'dodge-分组散开' | 'jitter-扰动散开' | 'symmetric 对称'
              marginRatio: 0.1, //只对 'dodge' 生效 0~1
              dodgeBy: '', //只对 'dodge' 生效，声明以哪个数据字段为分组依据
              reverseOrder: false //只对 'stack' 生效，用于控制是否对数据进
            }
          }
        ]
      }
    },
    sourceData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    sourceData: {
      handler(newVal, oldVal) {
        this.chart.clear()
        this.initChart(1)
        // this.renderChart()
      },
      deep: true
    }
  },
  data() {
    return {
      zoom: 1920 / screen.availWidth,
      chart: '',
      color: ['#1890ff', '#2fc25b'],
      chart_id: ''
    }
  },
  created() {
    this.initProps()
  },
  mounted() {
    this.initChart(0)
    // setTimeout(() => {
    //   this.initChart(0)
    // }, 10)
  },
  beforeDestroy() {},
  methods: {
    initProps() {
      if (!this.chartConfig.formatter) {
        this.chartConfig.formatter = {
          y: val => {
            return val
          },
          x: val => {
            return val
          }
        }
      }
      if (!this.chartConfig.fill) {
        this.chartConfig.fill = '#ffffff'
      }
      if (!this.chartConfig.alias) {
        this.chartConfig.alias = {}
      }
    },
    //  初始化chart
    initChart(type) {
      //   const { DataView } = DataSet
      if (type == 0) {
        let isMap = this.chartOptions.filter(item => item.chartType === 'map').length > 0
        this.chart = new Chart({
          container: this.chartId,
          //   theme: "dark",
          autoFit: this.chartConfig.autoFit,
          width: this.chartConfig.autoFit ? '' : this.chartConfig.width,
          height: this.chartConfig.height,
          padding: isMap ? [0, 0, 0, 0] : this.chartConfig.padding,
          renderer: 'svg' //isMap ? "canvas" : "svg",
        })
        //   const dv = new DataView().source(this.sourceData)
      }
      if (!this.chartConfig.hideLegend) {
        this.chart.legend({
          position: 'top',
          offsetX: -10,
          itemName: {
            style: {
              fill: this.chartConfig.fill,
              fontSize: 12
            }
          },
          handler: {
            style: {
              fill: '#ffffff'
            }
          },
          itemValue: {
            style: {
              fill: this.chartConfig.fill,
              fontSize: 12
            },
            formatter: (text, item, index) => {
              if (this.chartConfig.formatter.legend) {
                let formatter = this.chartConfig.formatter.legend
                return formatter(text, item, index)
              } else {
                return ''
              }
            }
          },
          ...this.chartConfig.legendOption
        })
      } else {
        this.chart.legend(false)
      }
      let scaleOption = {}
      this.chart.data(this.sourceData)
      this.chart.interaction('active-region')
      this.chartOptions.forEach(options => {
        // dv.transform({
        //   type: "fold",
        //   fields: options.fields, // 展开字段集
        //   key: "key", // key字段
        //   value: "value", // value字段
        // })
        scaleOption[options.x] = {
          alias: this.chartConfig.alias.x,
          nice: true
        }
        options.fields.forEach(fieldName => {
          scaleOption[fieldName] = {
            ...this.chartConfig.scale,
            formatter: this.chartConfig.formatter.y,
            nice: true,
            alias: this.chartConfig.alias.y,
            label: {
              style: {
                fill: this.chartConfig.fill
              }
            }
          }
          this.chart.axis(fieldName, {
            title: this.chartConfig.alias.y
              ? {
                  offset: 40,
                  autoRotate: false,
                  style: {
                    fill: this.chartConfig.fill,
                    fontSize: 16,
                    textAlign: 'end'
                    // fontWeight: 1000,
                  },
                  position: 'top'
                }
              : null,

            label: {
              style: {
                fill: this.chartConfig.fill
              }
            },
            tickLine: {
              style: {
                fill: this.chartConfig.fill,
                lineWidth: 0,
                opacity: 1
              }
            },
            line: {
              style: {
                fill: this.chartConfig.fill,
                lineWidth: 2,
                opacity: 1
              }
            }
          })
        })
        this.chart.scale(scaleOption)
        // X轴配置
        this.chart.axis(options.x, {
          title: this.chartConfig.alias.x
            ? {
                offset: 40,
                style: {
                  fill: this.chartConfig.fill,
                  fontSize: 16,
                  textAlign: 'center'
                  //   fontWeight: 1000,
                }
              }
            : null,
          label: {
            autoHide: true,
            // autoEllipsis: true,
            style: {
              fill: this.chartConfig.fill
            },
            formatter: this.chartConfig.formatter.x
          },
          //  坐标轴线
          line: {
            style: {
              fill: this.chartConfig.fill,
              lineWidth: 1,
              opacity: 1
            }
          },
          //   刻度线配置
          tickLine: {
            style: {
              fill: this.chartConfig.fill,
              lineWidth: 0
            }
          }
        })
        if (this.chartConfig.showY) {
        }
        if (!this.chartConfig.showX) {
          this.chart.axis(options.x, false)
        }
        switch (options.chartType) {
          case 'histogram':
            this.initHistogram(options)
            break
          case 'line':
            console.log(options)
            this.initLine(options)
            break
          case 'radar':
            this.initRadar(options)
            break
          case 'areaMap':
            this.initAreaMap(options)
            break
          case 'point':
            this.initPoint(options)
            break
          case 'pie':
            this.initPie(options)
            break
          case 'loopPie':
            this.initLoopPie(options)
            break

          case 'map':
            this.initMap(options)
            break

          default:
            break
        }
      })
      //   this.chart.tooltip({
      //     position: "right",
      //     showMarkers: true, // 不展示 tooltip markers
      //     shared: true,
      //     crosshairs: {
      //       type: "y",
      //       //           type: string, // 对应当前 crosshairs 的类型，值为 'x' 或者 'y'
      //       //   defaultContent: any, // 对应当前 crosshairs 默认的文本内容
      //       //   items: any[], // 对应当前 tooltip 内容框中的数据
      //       //   currentPoint: Point // 对应当前坐标点
      //       text: (type, defaultContent, items, currentPoint) => {
      //         console.log(defaultContent)
      //         return {
      //           type,
      //           items,
      //           content: defaultContent,
      //           currentPoint,
      //         }
      //       },
      //     },
      //   })

      this.chart.render()
    },
    // 面积图
    initAreaMap(options) {
      if (options.fields.length == 1) {
        let fieldName = options.fields[0]
        this.chart
          .area()
          .position(`${options.x}*${fieldName}`)
          .color(options.type || '#1890ff', options.colors && options.colors.length > 0 ? options.colors : '')
          .shape(options.shape ? options.shape : 'rect')
          .style({
            stroke: '#fff',
            strokeOpacity: 0,
            fillOpacity: 0.7
          })
        this.chart
          .line()
          .position(`${options.x}*${fieldName}`)
          .color(options.type || '#1890ff', options.colors && options.colors.length > 0 ? options.colors : '')
          .shape(options.shape ? options.shape : 'rect')
      } else {
        options.fields.forEach((fieldName, i) => {
          this.chart
            .line()
            .position(`${options.x}*${fieldName}`)
            .color(options.type || '#1890ff', options.colors && options.colors.length > 0 ? options.colors : '')
            .shape(options.shape ? options.shape : 'rect')
          this.chart
            .area()
            .position(`${options.x}*${fieldName}`)
            .color(options.type || this.color[i], options.colors && options.colors.length > 0 ? options.colors[i] : '')
            .style({
              stroke: '#fff',
              strokeOpacity: 0,
              fillOpacity: 0.6
            })
            .shape(options.shape ? options.shape : 'rect')
        })
      }
    },
    // 柱状
    initHistogram(options) {
      if (options.fields.length == 1) {
        let fieldName = options.fields[0]
        let colors = options.colors || []
        let defaultColor = colors[0] || '#1890ff'
        if (options.direction === 'row') {
          this.chart.coordinate().transpose()
        } else if (options.direction === 'radial') {
          this.chart.legend({
            position: 'right',
            offsetX: -20,
            itemName: {
              style: {
                fill: this.chartConfig.fill,
                fontSize: 12
              }
            },
            itemValue: {
              style: {
                fill: this.chartConfig.fill,
                fontSize: 12
              },
              formatter: (text, item, index) => {
                if (this.chartConfig.formatter.legend) {
                  let formatter = this.chartConfig.formatter.legend
                  return formatter(text, item, index)
                } else {
                  return ''
                }
              }
            }
          })
          this.chart.axis(fieldName, {
            title: this.chartConfig.alias.y
              ? {
                  offset: 40,
                  autoRotate: false,
                  style: {
                    fill: this.chartConfig.fill,
                    fontSize: 16,
                    textAlign: 'end'
                    // fontWeight: 1000,
                  },
                  position: 'top'
                }
              : null,

            label: null,
            grid: null,
            tickLine: null,
            line: null
          })
          let maxVal = 0
          this.sourceData.forEach(item => {
            maxVal += item[fieldName]
          })
          this.chart.scale(fieldName, {
            min: 0,
            max: maxVal + 10
          })
          this.chart.coordinate('polar', { innerRadius: 0.6 }).transpose()
        }
        this.chart
          .interval()
          .position(`${options.x}*${fieldName}`)
          .label(`${options.x}*${fieldName}`, (x, value) => {
            if (options.label) {
              return {
                content: originData => {
                  return options.label(x, value)
                },
                style: {
                  fill: '#ffffff'
                }
              }
            } else if (options.direction === 'radial') {
              //   return {
              //     labelLine: {
              //       style: {
              //         lineWidth: 2,
              //       },
              //     },
              //     content: (originData, i) => {
              //       console.log(i)
              //       return originData[fieldName]
              //     },
              //     style: {
              //       fill: "#ffffff",
              //     },
              //   }
            } else {
              return {
                style: {
                  fill: '#ffffff'
                },
                content: () => {
                  return ''
                }
              }
            }
          })
          .style({
            radius: options.shape === 'smooth' ? [40, 40, 0, 0] : [0, 0, 0, 0]
          })
          .adjust([
            options.adjust
              ? options.adjust
              : {
                  type: 'stack',
                  marginRatio: 0.1
                }
          ])
          .color(options.type || defaultColor, colors.length > 0 ? colors : '')
      } else {
        options.fields.forEach((fieldName, i) => {
          this.chart
            .interval()
            .position(`${options.x}*${fieldName}`)
            .shape(options.shape ? options.shape : 'rect')
            .adjust([
              options.adjust
                ? options.adjust
                : {
                    type: 'stack',
                    marginRatio: 0.1
                  }
            ])
            .color(options.type || this.color[i], options.colors && options.colors.length > 0 ? options.colors[i] : '')
        })
      }
    },
    // 折线
    initLine(options) {
      if (options.fields.length == 1) {
        let fieldName = options.fields[0]
        this.chart
          .line()
          .position(`${options.x}*${fieldName}`)
          .shape(options.shape ? options.shape : 'rect')
          .color(options.type || '#1890ff', options.colors && options.colors.length > 0 ? options.colors : '')
      } else {
        options.fields.forEach((fieldName, i) => {
          this.chart
            .line()
            .position(`${options.x}*${fieldName}`)
            .shape(options.shape ? options.shape : 'rect')
            .color(options.type || this.color[i], options.colors && options.colors.length > 0 ? options.colors[i] : '')
        })
      }
    },
    // 点状
    initPoint(options) {
      if (options.fields.length == 1) {
        let fieldName = options.fields[0]
        this.chart
          .point()
          .position(`${options.x}*${fieldName}`)
          .size(options.type || fieldName, [10, 20])
          //   .adjust([
          //     {
          //       type: "dodge",
          //       marginRatio: 0.1,
          //     },
          //   ])
          .shape('circle')
          .color(options.type || '#1890ff', options.colors && options.colors.length > 0 ? options.colors : '')
          .style(options.type || fieldName, () => {
            return {
              //   stroke: "l(0) 0:rgba(255,255,255,0.8) 0.5:#7ec2f3 1:#1890ff",
              lineWidth: 0,
              shadowBlur: 6,
              shadowColor: 'rgba(255,255,255,0.7)',
              fillOpacity: 0.8
            }
          })
      } else {
        options.fields.forEach((fieldName, i) => {
          this.chart
            .point()
            .position(`${options.x}*${fieldName}`)
            .size(options.type || fieldName, [10, 20])
            .adjust([
              {
                type: 'dodge',
                marginRatio: 0.1
              }
            ])
            .shape('circle')
            .color(options.type || this.color[i], options.colors && options.colors.length > 0 ? options.colors[i] : '')
            .style(options.type || fieldName, () => {
              return {
                lineWidth: 1,
                strokeOpacity: 1,
                fillOpacity: 0.8,
                opacity: 1
              }
            })
        })
      }
    },
    // 雷达
    initRadar(options) {
      this.chart.tooltip({
        shared: true,
        showCrosshairs: true,
        crosshairs: {
          line: {
            style: {
              // lineDash: [8, 8],
              //   stroke: "#ffffff",
            }
          }
        }
      })

      //   this.chart.axis(options.type || options.x, {
      //     line: null,
      //     tickLine: null,
      //     grid: {
      //       line: {
      //         style: {
      //           lineDash: null,
      //         },
      //       },
      //     },
      //   })

      this.chart.coordinate('polar', {
        radius: 0.9
      })
      if (options.fields.length == 1) {
        let fieldName = options.fields[0]
        this.chart.axis(fieldName, {
          line: null,
          tickLine: null,
          label: null,
          grid: {
            line: {
              type: 'line',
              style: {
                lineDash: null
              }
            }
          }
        })
        this.chart.axis(options.x, {
          line: null,
          tickLine: null,
          label: {
            style: {
              fill: this.chartConfig.fill
            }
          },
          grid: {
            line: {
              style: {
                lineDash: null
              }
            }
          }
        })
        this.chart
          .area()
          .position(`${options.x}*${fieldName}`)
          .color(options.type || '#1890ff', options.colors && options.colors.length > 0 ? options.colors : '')
          .style({
            stroke: '#fff',
            strokeOpacity: 0,
            fillOpacity: 0.8
          })
      } else {
        options.fields.forEach((fieldName, i) => {
          this.chart.axis(fieldName, {
            line: null,
            tickLine: null,
            grid: {
              line: {
                type: 'line',
                style: {
                  lineDash: null
                }
              }
            }
          })
          this.chart.axis(options.x, {
            line: null,
            tickLine: null,
            grid: {
              line: {
                style: {
                  lineDash: null
                }
              }
            }
          })
          this.chart
            .area()
            .position(`${options.x}*${fieldName}`)
            .color(options.type || this.color[i], options.colors && options.colors.length > 0 ? options.colors[i] : '')
        })
      }
    },
    // 饼图
    initPie(options) {
      this.chart.coordinate('theta', {
        radius: 1
      })

      if (options.fields.length == 1) {
        let fieldName = options.fields[0]
        let colors = options.colors || []
        this.chart.axis(fieldName, false)
        this.chart
          .interval()
          .adjust('stack')
          .position(`${fieldName}`)
          .shape(options.shape ? options.shape : 'rect')
          .color(options.type || defaultColor, colors.length > 0 ? colors : '')
          .style({ opacity: 0.9 })
          .state({
            active: {
              style: element => {
                const shape = element.shape
                console.log(element)
                return {
                  matrix: Util.zoom(shape, 1.1)
                }
              }
            }
          })
          .label(options.type, val => {
            return {
              offset: -30,
              style: {
                opacity: 1,
                fill: 'white',
                fontSize: 12,
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)'
              },
              content: obj => {
                return obj[options.type] + '\n' + obj[fieldName]
              }
            }
          })
      } else {
        options.fields.forEach((fieldName, i) => {
          let colors = options.colors || []
          this.chart
            .interval()
            .adjust('stack')
            .position(`${fieldName}`)
            // .shape(options.shape ? options.shape : "rect")
            .state({
              active: {
                style: element => {
                  const shape = element.shape
                  return {
                    matrix: Util.zoom(shape, 1.1)
                  }
                }
              }
            })
            .color(
              options.type || colors.length > 0 ? options.colors[0] : '#1890ff',
              colors.length > 0 ? options.colors : ''
            )
            .style({ opacity: 0.8 })
        })
      }
    },
    initLoopPie(options) {
      this.chart.coordinate('theta', {
        radius: 0.75,
        innerRadius: 0.6
      })
      if (!this.chartConfig.hideLegend) {
        this.chart.legend({
          position: 'right',
          offsetX: this.chartConfig.legendOffsetX || -10,
          itemName: {
            style: {
              fill: this.chartConfig.fill,
              fontSize: 12
            }
          },
          itemWidth: 500,
          itemValue: {
            style: {
              fill: this.chartConfig.fill,
              fontSize: 10
            },
            formatter: (text, item, index) => {
              if (this.chartConfig.formatter.legend) {
                let formatter = this.chartConfig.formatter.legend
                return formatter(text, item, index)
              } else {
                return ''
              }
            }
          }
        })
      }

      //   this.chart.tooltip({
      //     showTitle: false,
      //     showMarkers: false,
      //     itemTpl:
      //       '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
      //   })
      if (options.fields.length == 1) {
        let colors = options.colors || []
        let defaultColor = colors[0] || '#1890ff'
        let fieldName = options.fields[0]
        this.chart.axis(fieldName, false)
        this.chart
          .interval()
          .adjust('stack')
          .position(fieldName)
          .color(options.type || defaultColor, colors.length > 0 ? colors : '')
          .label(fieldName, fieldName => {
            return {
              offset: 20,
              style: {
                fill: 'white'
              },
              labelLine: {
                style: {
                  lineWidth: 2
                }
              },
              content: data => {
                return `${fieldName}`
              }
            }
          })
        //   .tooltip(`${options.type}*${fieldName}`, (item, fieldName) => {
        //     console.log(fieldName)
        //     fieldName = fieldName * 100 + "%"
        //     return {
        //       name: item,
        //       value: fieldName,
        //     }
        //   })
        this.chart.interaction('element-active')
      }
    },
    // 地图
    initMap(options) {
      this.chart.legend(false)
      this.chart.axis(false)
      this.chart.tooltip(false)
      this.chart.padding = [0, 0, 0, 0]
      // 绘制世界地图背景
      const ds = new DataSet()
      const Map = ds.createView('back').source(chinaMap, {
        type: 'GeoJSON'
      })

      console.log(Map)
      //   渲染地图背景
      const MapView = this.chart.createView()
      MapView.data(Map.rows)
      MapView.tooltip(false)
      MapView.polygon()
        .position('longitude*latitude')
        .style({
          fill: '#092C5C',
          stroke: '#3FA7C4',
          lineWidth: 1,
          shadowBlur: 20,
          shadowColor: 'rgba(255,255,255,0.7)',
          fillOpacity: 1
        })
      //
      let fieldName = options.fields[0]
      let data = JSON.parse(JSON.stringify(this.sourceData))
      //   data.sort((item, item2) => item2.type - item.type)
      const userDv = ds
        .createView()
        .source(data)
        .transform({
          geoDataView: Map,
          field: fieldName,
          type: 'geo.centroid',
          as: ['longitude', 'latitude']
        })
      this.chart.scale({
        longitude: {
          sync: true
        },
        latitude: {
          sync: true
        }
      })
      console.log(userDv.rows)
      let startItem = userDv.rows.filter(item => item.type === 1)[0]
      let lineDataArr = []
      userDv.rows.forEach(endItem => {
        if (endItem.type == 0) {
          let midArr = []
          let type = endItem.latitude - startItem.latitude > 0 ? 1 : 0 //终点纬度是否大于起点
          //   let length = Math.abs(endItem.latitude - startItem.latitude) / 0.2 //分割中间点个数
          let mid = {
            latitude: endItem.latitude + 10,
            longitude: (endItem.longitude - startItem.longitude) / 2 + startItem.longitude
          }
          midArr = this.getBezierPoints(10, startItem, mid, endItem)
          console.log(midArr)
          // for (let i = 0; i < 10; i++) {
          //   if (latitude >= endItem.latitude + 4) {
          //     isAdd = false
          //   }
          //   isAdd ? (latitude += 1 + i * 0.1) : (latitude -= 1)
          //   let midItem = {
          //     latitude: latitude,
          //     longitude:
          //       startItem.longitude +
          //       i * ((endItem.longitude - startItem.longitude) / 10),
          //   }
          //   midArr.push(midItem)
          // }
          lineDataArr.push([startItem, ...midArr, endItem])
        }
      })
      console.log(lineDataArr)
      console.log(userDv)

      this.chart.on('element:click', ev => {
        // const shape = ev.shape
        console.log(ev)
        // const element = shape.get("element")
        // const data = element.getModel().data
        // to do something
      })
      //   this.chart.on("element:mouseover", (ev) => {
      //     // const shape = ev.shape
      //     console.log(ev)
      //     document.body.style.cursor = "pointer"
      //     // const element = shape.get("element")
      //     // const data = element.getModel().data
      //     // to do something
      //   })
      //  标记点
      this.chart
        .createView()
        .data(userDv.rows)
        .point()
        .position('longitude*latitude')
        .label('name', {
          offsetX: 60,
          offsetY: 20,
          style: {
            fill: this.chartConfig.fill
          }
        })
        .color(options.type || '#1890ff', options.colors && options.colors.length > 0 ? options.colors : '')
        .shape('circle')
        .size(options.type, [5, 10])
        .style({
          lineWidth: 0,
          stroke: '#1890ff',
          shadowBlur: 20,
          shadowColor: 'rgba(255,255,255,0.7)',
          fillOpacity: 0.8
        })
      //    渲染线路
      lineDataArr.forEach(lineData => {
        let _lineData = ds.createView().source(lineData)
        console.log(_lineData)
        // this.chart.view().source(_linedata)
        let lineView = this.chart.createView()
        lineView.data(_lineData.rows)
        lineView
          .path()
          .position('longitude*latitude')
          .color('#D7AA07')
          .shape('smooth')
          .style({
            // lineCap: "square",
            lineWidth: 2,
            // miterLimit: 11,
            lineDash: [3, 3]
          })
        //   .color("x*y")
        // lineView.repaint()
      })
      //   MapView.interaction("element-active")
    },
    // 贝塞尔曲线
    getBezierPoints(num, point1, point2, point3) {
      let pointList = []
      let x1 = point1.latitude,
        y1 = point1.longitude
      let x2 = point3.latitude,
        y2 = point3.longitude
      let cx = point2.latitude,
        cy = point2.longitude
      let t = 0
      for (let i = 1; i < num + 1; i++) {
        //用i当作t，算出点坐标，放入数组
        t = i / num
        let x = Math.pow(1 - t, 2) * x1 + 2 * t * (1 - t) * cx + Math.pow(t, 2) * x2
        let y = Math.pow(1 - t, 2) * y1 + 2 * t * (1 - t) * cy + Math.pow(t, 2) * y2
        pointList.push({
          longitude: y,
          latitude: x
        })
      }
      return pointList
    },
    renderChart() {
      this.chart.data(this.sourceData) // 更新数据源
      this.chart.render()
    }
  }
}
</script>

<style lang="less">
.chartComponent {
  width: 100%;
  .chartTitle {
    text-align: center;
    width: 100%;
  }
}
</style>
