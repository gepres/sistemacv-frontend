<template>
    <v-container >
      <v-row wrap>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6">
          <div class="ct-chart">
            <canvas id="chartLine2" class="chartLine">
            </canvas>
            <span class="font-weight-light">Ventas de los ultimos 12 meses</span>
          </div>
        </v-col>
        <v-col cols="12" class="barchart"  xs="12" sm="12" md="6" lg="6">
           <div class="ct-chart">
              <canvas id="chartBar" class="chartBar">
              </canvas>
              <span class="font-weight-light">Ventas de los ultimos 12 meses</span>
            </div>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
// @ is an alias to /src
import Chart from 'chart.js'
// import LineChart  from '@/components/LineChart.vue'
// import BarChart  from '@/components/BarChart.vue'
export default {
  name: 'home',
  // components: {
  //   LineChart,BarChart
  // },
  data(){
    return {
      valores:[],
      meses:[],
      totales:[]
    }
  },

  methods:{
    async obtenerDatos(){
      let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}
      await this.axios.get('venta/grafico/12', configuracion).then(res => {
        // console.log(res.data)
        this.valores = res.data;
        this.graficar()
      }).catch(e => {
        console.log(e)
      })
    },

    graficar(){
      let mesn =''
      this.valores.map( x => {
        switch(parseInt(x._id.mes)){
          case 1:
            mesn = 'Ene';
            break;
          case 2:
            mesn = 'Feb';
            break;
          case 3:
            mesn = 'Mar';
            break;
          case 4:
            mesn = 'Abr';
            break;
          case 5:
            mesn = 'May';
            break;
          case 6:
            mesn = 'Jun';
            break;
          case 7:
            mesn = 'Jul';
            break;
          case 8:
            mesn = 'Ago';
            break;
          case 9:
            mesn = 'Set';
            break;
          case 10:
            mesn = 'Oct';
            break;
          case 11:
            mesn = 'Nov';
            break;
          case 12:
            mesn = 'Dic';
            break;
          default:
            mesn = 'error'
        }
        this.meses.push(mesn + '-' + x._id.year)
        this.totales.push(x.total)
      })
      this.graficarLine()
      this.graficarBar()
    },

    graficarLine(){
      var ctx = document.getElementById('chartLine2');
      var chartLine2 = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.meses,
          datasets: [{
            label: 'Ventas de los ultimos 12 meses',
            data: this.totales,
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
      })  
    },

    graficarBar(){
      var ctx = document.getElementById('chartBar');
      Chart.defaults.global.defaultFontColor = 'white'
      var chartBar = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: this.meses,
              datasets: [{
                  label: 'Ventas de los ultimos 12 meses',
                  data: this.totales,
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

  mounted(){
    this.obtenerDatos()
  }
}
</script>
<style lang="scss">
.barchart{
  @media screen and (max-width:960px) {
    margin-top: 2rem;
  }
}
</style>
<style lang="scss" scoped>
.chartBar{
  width: 90% !important;
  border-radius: 7px;
  box-shadow: 4px 4px 40px -15px rgba(0, 0, 0, 0.6);
  background: #009688;
  position: relative;
  top:-30px;
}
.chartLine{
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