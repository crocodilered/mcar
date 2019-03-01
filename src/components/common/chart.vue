<!-- https://www.highcharts.com/demo/column-drilldown -->

<template>
  <div
    ref="chart"
  />
</template>

<script>
  import Highcharts from 'highcharts'
  import HighchartsDrilldown from 'highcharts/modules/drilldown'
  import ExpenseModel from '@/models/expense-model'

  export default {
    name: 'Chart',
    props: ['report'],

    data () {
      return {
        data: null,
        drilldown: null
      }
    },

    methods: {
      // Lookup expense type label by value
      getExpenseTypeName (num) {
        if (!this.expenseTypeLookup) {
          // Gen it for the 1st time
          this.expenseTypeLookup = {}
          const typeEnum = ExpenseModel.getTypeEnum()
          for (let i in typeEnum) {
            this.expenseTypeLookup[typeEnum[i].value] = typeEnum[i].label
          }
        }
        return this.expenseTypeLookup[num]
      },

      prepareData () {
        this.data = []
        for (let key in this.report.amounts) {
          this.data.push({
            name: this.getExpenseTypeName(key),
            drilldown: this.getExpenseTypeName(key),
            y: this.report.amounts[key]
          })
        }

        this.drilldown = [
          {
            name: 'Обслуживание',
            id: 'Обслуживание',
            data: [
              ['1.1.213', 1, 2], ['2.1.213', 2], ['3.1.213', 3],
              ['4.1.213', 1], ['5.1.213', 2], ['6.1.213', 3],
              ['7.1.213', 1], ['8.1.213', 2], ['9.1.213', 3]
            ]
          },
          {
            name: 'Ремонт',
            id: 'Ремонт',
            data: [
              [1, 1],
              [2, 2],
              [3, 3]
            ]
          }
        ]
      },

      // Render chart
      render () {
        if (!this.report) return

        this.prepareData()

        Highcharts.chart(this.$refs.chart, {
          chart: {
            type: 'bar',
            backgroundColor: 'rgba(255, 255, 255, 0.0)'
          },
          title: {
            text: ''
          },
          legend: {
            enabled: false
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            title: { text: '' },
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            labels: {
              enabled: false
            },
            minorTickLength: 0,
            tickLength: 0
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                format: '{point.y} руб.'
              }
            }
          },
          tooltip: {
            formatter: function () {
              return '<b>' + this.point.name + '</b><br/>' +
                Highcharts.numberFormat(Math.abs(this.point.y), 0) + ' руб.'
            }
          },
          series: [{
            name: 'Расходы',
            colorByPoint: true,
            data: this.data
          }],
          drilldown: {
            series: this.drilldown
          }
        })
      }
    },

    mounted () {
      HighchartsDrilldown(Highcharts)
      this.render()
    }
  }
</script>

<style>
  .highcharts-credits {
    display: none;
  }
</style>
