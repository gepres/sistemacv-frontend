<template>
 <div class="ct-chart">
    <canvas id="myChart">
    </canvas>
    <span class="font-weight-light">Ventas de los ultimos 12 meses</span>
  </div>
</template>
<script>
import Chart from 'chart.js'
export default {
  props: ['chartdata', 'options'],
  methods:{
    graficar(){
      var ctx = document.getElementById('myChart');
      Chart.defaults.global.defaultFontColor = 'white'
      var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: this.options,
              datasets: [{
                  label: 'Ventas de los ultimos 12 meses',
                  data: this.chartdata,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(54, 162, 235, 0.5)',
                      'rgba(255, 206, 86, 0.5)',
                      'rgba(75, 192, 192, 0.5)',
                      'rgba(153, 102, 255, 0.5)',
                      'rgba(255, 159, 64, 0.5)',
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(54, 162, 235, 0.5)',
                      'rgba(255, 206, 86, 0.5)',
                      'rgba(75, 192, 192, 0.5)',
                      'rgba(153, 102, 255, 0.5)',
                      'rgba(255, 159, 64, 0.5)'
                  ],
                  borderColor: [
                      'rgba(255, 99, 132)',
                      'rgba(54, 162, 235)',
                      'rgba(255, 206, 86)',
                      'rgba(75, 192, 192)',
                      'rgba(153, 102, 255)',
                      'rgba(255, 159, 64)',
                      'rgba(255, 99, 132)',
                      'rgba(54, 162, 235)',
                      'rgba(255, 206, 86)',
                      'rgba(75, 192, 192)',
                      'rgba(153, 102, 255)',
                      'rgba(255, 159, 64)'
                  ],
                  borderWidth: 2,
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                  }]
              },
            legend: {
              display:false
            }
          }
      });
    }
  },
  mounted () {
    this.graficar()
  }
}
</script>
<style lang="scss" scoped>
#myChart{
  width: 90% !important;
  border-radius: 7px;
  box-shadow: 4px 4px 40px -15px rgba(0, 0, 0, 0.6);
  background: #009688;
  position: relative;
  top:-30px;
}
.ct-chart{
  background: #fff;
  display: flex;
  justify-content: center;
  border-radius: 7px;
  box-shadow: 4px 3px 40px -15px rgba(0, 0, 0, 0.4);
  flex-direction: column;
  align-items: center;
  & span {
    margin-bottom: 1.5rem;
  }
}
</style>