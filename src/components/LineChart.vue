<template>
 <div class="ct-chart">
    <canvas id="chartLine">
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
      var ctx = document.getElementById('chartLine');
      var chartLine = new Chart(ctx, {
          type: 'line',
          data: {
              labels: this.options,
              datasets: [{
                  label: 'Ventas de los ultimos 12 meses',
                  data: this.chartdata,
                  backgroundColor: "transparent",
                  borderColor: "#2E7D32",
                  pointBackgroundColor: "#fff",
              }]
          },
          options: {
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
#chartLine{
  width: 90% !important;
  border-radius: 7px;
  box-shadow: 4px 4px 40px -15px rgba(0, 0, 0, 0.6);
  background: #FB8C00;
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