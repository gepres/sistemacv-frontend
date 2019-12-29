<template>
  <v-container class="align-self-start">
    <v-row>
      <v-col>
        <template>
          <v-data-table
            :headers="headers"
            :items="categorias"
            :search="search"
            sort-by="calories"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Categorías</v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Buscar" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                  </template>
                  <v-form v-model="valid">
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="editedItem.nombre" :counter="50" :rules="nameRules" label="Nombre"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="editedItem.descripcion" :counter="255" :rules="descriptionRules" label="Descripción"></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text  :disabled="!valid" @click="guardar">Guardar</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-form>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon
                small
                class="mr-2"
                title="Editar"
                @click="editItem(item)"
              >
                edit
              </v-icon>
              <template v-if="item.estado">
                <!-- activar desactivar mostrar -->
                <v-icon
                title="Desactivar"
                small
                @click="accionMostrar(2,item)"
                >
                block
              </v-icon>
              </template>
              <template v-else>
                <!-- activar desactivar mostrar -->
                <v-icon
                title="Activar"
                small
                @click="accionMostrar(1,item)"
                >
                check
              </v-icon>
              </template>
              
            </template>
            <template v-slot:item.estado="{ item }">
              <div v-if="item.estado">
                <span class="blue--text">Activo</span>
              </div>
              <div v-else>
                <span class="red--text">Inactivo</span>
              </div>
            </template>
          </v-data-table>
        </template>
      </v-col>
    </v-row>
    <v-dialog v-model="admodal" max-width="290px">
      <v-card>
        <v-card-title>
          <span class="headline" v-if="adAccion == 1">Activar Item</span>
          <span class="headline" v-if="adAccion == 2">Desactivar Item</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
               <v-col cols="12" sm="12" md="12">
                 Estas a punto de <b v-if="adAccion == 1">Activar</b>
                 <b v-if="adAccion == 2">Desactivar</b> el item <b>{{adNombre}}</b>         
              </v-col>
            </v-row>
          </v-container>
         </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click="closeAdmodal" text >Cancelar</v-btn>
          <v-btn color="orange darken-4" text v-if="adAccion == 1" @click="activar" >Activar</v-btn>
          <v-btn color="orange darken-4" text v-if="adAccion == 2" @click="desactivar" >Desactivar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name:'categoria',
  data(){
    return {
      dialog: false,
      valid: true,
      search: '',
      headers: [
        { text: 'Opciones', value: 'action', sortable: false },
        { text: 'Nombre', value: 'nombre',sortable: true },
        { text: 'Descripción', value: 'descripcion',sortable: false },
        { text: 'Estado', value: 'estado',sortable: false },
      ],
      categorias: [],
      editedIndex: -1,
      nombre:'',
      descripcion:'',
      nameRules: [
        v => !!v || 'Nombre es requerido',
        v => (v && v.length <= 50) || 'Nombre tiene que tener menos de 50 caracteres',
      ],
      descriptionRules: [
        v => !!v || 'Descripción es requerido',
        v => (v && v.length <= 255) || 'Descripción tiene que tener menos de 255 caracteres',
      ],
      editedItem: {
        nombre: '',
        descripcion: '',
      },
      defaultItem: {
        nombre: '',
        descripcion: '',
      },
      admodal:false,
      adAccion:0,
      adNombre:'',
      adId:''
    }
  },
  computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
      },
    },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  created () {
    this.obtenerDatos()
  },

  methods: {
    async obtenerDatos(){
      let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}
      await this.axios.get('categoria', configuracion).then(res => {
        // console.log(res.data)
        this.categorias = res.data;
      }).catch(e => {
        console.log(e)
      })
    },

    editItem (item) {
      // this._id = item._id;
      // this.nombre = item.nombre;
      // this.descripcion = item.descripcion
        this.editedIndex = this.categorias.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
    },

    accionMostrar (accion, item) {
      this.admodal = true;
      this.adNombre = item.nombre;
      this.adId = item._id;
        if(accion == 1){
          this.adAccion = 1;
        }else if(accion == 2){
          this.adAccion = 2
        }else{
           this.admodal = false;
        }
    },

    async activar(){
      let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}
      await this.axios.get('categoria/activate/'+ this.adId,configuracion).then(res => {
        this.admodal = false;
        this.adNombre = '';
        this.adAccion = 0
        this.adId = '';
        this.obtenerDatos()
        }).catch(e => console.log(e))
    },

    async desactivar(){
      let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}

      await this.axios.get(`categoria/deactivate/${this.adId}`,configuracion).then(res => {
        this.admodal = false;
        this.adNombre = '';
        this.adAccion = 0
        this.adId = '';
        this.obtenerDatos()
        }).catch(e => console.log(e))
    },

    close () {
        this.dialog = false
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
    },
    closeAdmodal(){
      this.admodal = false
    },
    limpiar(){
      this.editedItem._id = '',
      this.editedItem.nombre = '',
      this.editedItem.descripcion = ''
      this.editedIndex = -1
    },

    async guardar () {
       let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}
        if (this.editedIndex > -1) {
        //  editar los datos
        const datos = {
            nombre: this.editedItem.nombre,
            descripcion: this.editedItem.descripcion
          }
        await this.axios.put('categoria/'+ this.editedItem._id, datos,configuracion).then(res => {
          this.obtenerDatos()
        }).catch(e => console.log(e))

        } else {
          // guardar
          const datos = {
            nombre: this.editedItem.nombre,
            descripcion: this.editedItem.descripcion
          }
          await this.axios.post('categoria',datos,configuracion).then(res => {
            this.limpiar()
            this.obtenerDatos()
          }).catch(e => console.log(e))
        }
        this.close()
    },

  }
}
</script>

<style>

</style>