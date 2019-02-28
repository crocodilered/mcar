<!-- https://www.highcharts.com/demo/column-drilldown -->

<template>
  <div
    ref="chart"
  />
</template>

<script>
  import Highcharts from 'highcharts'
  import ExpenseModel from '@/models/expense-model'

  export default {
    name: 'Chart',
    props: ['report'],

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

      // Render chart
      render () {
        if (!this.report) return
        const chartData = []
        for (let key in this.report.amounts) {
          chartData.push({
            name: this.getExpenseTypeName(key),
            y: this.report.amounts[key]
          })
        }

        Highcharts.chart(this.$refs.chart, {
          chart: {
            type: 'column',
            backgroundColor: 'rgba(255, 255, 255, 0.0)'
          },
          title: { text: '' },
          legend: { enabled: false },
          xAxis: { type: 'category' },
          yAxis: {
            title: { text: '' },
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            labels: { enabled: false },
            minorTickLength: 0,
            tickLength: 0
          },
          plotOptions: {
            series: {
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
            data: chartData
          }]
        })
      }
    },

    mounted () {
      this.render()
    }
  }
</script>
