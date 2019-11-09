<!--suppress ALL -->
<template>
  <div ref="contener" style="width:100%;height:100%;background:#2468a2">
    <div ref="myEchart" :style="{width: mapWidth, height: mapHeight}" />
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
require('jquery/dist/jquery.min')
// 散点图
require('echarts/lib/chart/scatter')
// 散点图放大
require('echarts/lib/chart/effectScatter')
// 地图
require('echarts/lib/chart/map')

require('codemirror/lib/codemirror')
// 图例
require('echarts/lib/component/legend')
// 提示框
require('echarts/lib/component/tooltip')
// 地图geo
require('echarts/lib/component/geo')
// 中国地图
require('echarts/map/js/china.js')

require('echarts/map/json/china.json')
// 云南省地图
require('echarts/map/js/province/yunnan')

require('echarts/map/json/province/yunnan')

export default {
  name: 'Charts',
  props: {
    userJson: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      chart: null,
      option: {
        title: {
          text: '就诊患者地域分布图',
          subtext: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          x: 'right',
          selectedMode: false,
          data: []
        },
        dataRange: {
          orient: 'horizontal',
          min: 0,
          max: 1000,
          text: ['高', '低'],
          color: ['#11264f', '#293047', '#7fb80e', '#145b7d', '#1E90FF', '#007d65', '#5e7c85', '#008792'],
          splitNumber: 0
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          x: 'right',
          y: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false }
          }
        },
        series: [
          {
            name: '人数',
            type: 'map',
            mapType: 'china',
            mapLocation: {
              x: 'left'
            },
            selectedMode: 'single',
            itemStyle: {
              normal: { label: { show: true }},
              emphasis: { label: { show: true }}
            },
            data: [
              { name: '湖南', value: 1454 },
              { name: '辽宁', value: Math.round(Math.random() * 1000) },
              { name: '内蒙古', value: Math.round(Math.random() * 1000) },
              { name: '浙江', value: Math.round(Math.random() * 1000) },
              { name: '黑龙江', value: Math.round(Math.random() * 1000) },
              { name: '陕西', value: Math.round(Math.random() * 1000) },
              { name: '广西', value: Math.round(Math.random() * 1000) },
              { name: '安徽', value: Math.round(Math.random() * 1000) },
              { name: '湖北', value: Math.round(Math.random() * 1000) },
              { name: '贵州', value: Math.round(Math.random() * 1000) },
              { name: '福建', value: Math.round(Math.random() * 1000) },
              { name: '山西', value: Math.round(Math.random() * 1000) },
              { name: '西藏', value: Math.round(Math.random() * 1000) },
              { name: '河南', value: Math.round(Math.random() * 1000) },
              { name: '江西', value: Math.round(Math.random() * 1000) },
              { name: '海南', value: Math.round(Math.random() * 1000) },
              { name: '山东', value: Math.round(Math.random() * 1000) },
              { name: '江苏', value: Math.round(Math.random() * 1000) },
              { name: '云南', value: Math.round(Math.random() * 1000), selected: true },
              { name: '北京', value: Math.round(Math.random() * 1000) },
              { name: '天津', value: Math.round(Math.random() * 1000) },
              { name: '广东', value: Math.round(Math.random() * 1000) },
              { name: '上海', value: Math.round(Math.random() * 1000) },
              { name: '新疆', value: Math.round(Math.random() * 1000) },
              { name: '青海', value: Math.round(Math.random() * 1000) },
              { name: '吉林', value: Math.round(Math.random() * 1000) },
              { name: '河北', value: Math.round(Math.random() * 1000) },
              { name: '四川', value: Math.round(Math.random() * 1000) },
              { name: '重庆', value: Math.round(Math.random() * 1000) },
              { name: '甘肃', value: Math.round(Math.random() * 1000) },
              { name: '宁夏', value: Math.round(Math.random() * 1000) },
              { name: '台湾', value: Math.round(Math.random() * 1000) },
              { name: '香港', value: Math.round(Math.random() * 1000) },
              { name: '澳门', value: Math.round(Math.random() * 1000) }
            ]
          }
        ],
        animation: false
      }
    }
  },
  computed: {
    mapWidth() {
      return window.innerWidth - 200 + 'px'
    },
    mapHeight() { return window.innerHeight + 'px' }
  },
  mounted() {
    this.chinaConfigure()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    chinaConfigure: function() {
      this.chart = echarts.init(this.$refs.myEchart)
      this.chart.setOption(this.$data.option)
    }
  }
}
</script>

<style scoped>

</style>
