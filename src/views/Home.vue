<template>
    <v-container >
      <v-row wrap>
        <v-col cols="6" sm="6" md="6">
          <LineChart  :chartdata="totales" :options="meses" />
        </v-col>
        <v-col cols="6" sm="6" md="6">
          <BarChart  :chartdata="totales" :options="meses" />
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
// @ is an alias to /src
import Chart from 'chart.js'
import LineChart  from '@/components/LineChart.vue'
import BarChart  from '@/components/BarChart.vue'
export default {
  name: 'home',
  components: {
    LineChart,BarChart
  },
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
    }
  },

  mounted(){
    this.obtenerDatos()
  }
}
</script>
<style lang="scss" scoped>
</style>
