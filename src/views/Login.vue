<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" sm="8" md="5" lg="5">
        <v-card>
          <v-toolbar dark color="blue darken-3">
            Acceso al sistema
          </v-toolbar>
          <v-card-text>
            <v-text-field v-model="email" autofocus color="accent" label="Email" required></v-text-field>
            <v-text-field v-model="password" @keyup.enter="ingresar" type="password" color="accent" label="Contraseña" required></v-text-field>
            <v-col class="red--text" v-if="errorMessage"> 
              {{errorMessage}}
            </v-col>
          </v-card-text>
          <v-card-actions class="px-3 pb-3">
            <v-col class="text-right">
              <v-btn @click="ingresar" color="primary">Ingresar</v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name:'login',
  data(){
    return {
      email:'',
      password:'',
      errorMessage:''
    }
  },
  methods:{
    ingresar(){
      const datos = {
        email:this.email,
        password:this.password
      }
      this.axios.post('auth',datos).then(res => {
        // console.log(res.data.user);
        // console.log(res.data.generateJWT);
        return res.data
      }).then(data => {
        // console.log(data.generateJWT);
        this.$store.dispatch("guardarToken",data.generateJWT)
        this.$router.push({name:'home'})
      }).catch(e => {
        this.errorMessage = null;
        if(e.response.status == 404){
          this.errorMessage = 'No existe el usuario o contraseña incorrecta'
        }else{
          this.errorMessage = 'Ocurrio un error con el servidor'
          console.log(e);
        }
      })
    }
  }
}
</script>

<style>

</style>