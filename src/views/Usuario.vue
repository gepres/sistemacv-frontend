<template>
  <v-container class="align-self-start">
    <v-row>
      <v-col>
        <template>
          <v-data-table
            :headers="headers"
            :items="usuarios"
            :search="search"
            sort-by="calories"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Usuarios</v-toolbar-title>
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
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field v-model="editedItem.nombre" :counter="50" :rules="nameRules" label="Nombre"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select :items="roles" label="Rol" v-model="editedItem.rol" :rules="fieldRules"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select :items="documentos" label="Tipo documento" v-model="editedItem.tipo_documento" :rules="fieldRules"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field v-model="editedItem.num_documento" :rules="fieldRules" label="Número documento" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field v-model="editedItem.direccion" :rules="fieldRules" label="Dirección"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field type="Number" v-model="editedItem.telefono" :rules="fieldRules" label="Telefono"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field v-model="editedItem.email" :rules="emailRules" label="Email"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field v-model="editedItem.password" type="password" :rules="passRules" label="Contraseña"></v-text-field>
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
                title="Editar"
                small
                class="mr-2"
                @click="editItem(item)"
              >
                edit
              </v-icon>
              <template v-if="item.estado">
                <!-- activar desactivar mostrar -->
                <v-icon
                small
                @click="accionMostrar(2,item)"
                title="Desactivar"
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
  name:'usuario',
  data(){
    return {
      dialog: false,
      valid: true,
      search: '',
      headers: [
        { text: 'Opciones', value: 'action', sortable: false },
        { text: 'Nombre', value: 'nombre',sortable: true },
        { text: 'Rol', value: 'rol',sortable: true },
        { text: 'Tipo Documento', value: 'tipo_documento',sortable: true },
        { text: 'Número Documento', value: 'num_documento',sortable: true },
        { text: 'Dirección', value: 'direccion',sortable: false },
        { text: 'Teléfono', value: 'telefono',sortable: false },
        { text: 'Email', value: 'email',sortable: false },
        { text: 'Estado', value: 'estado',sortable: false },
      ],
      usuarios: [],
      roles:['Administrador','Almacenero','Vendedor'],
      documentos:['DNI','RUC','PASAPORTE','CEDULA'],
      editedIndex: -1,
      nombre:'',
      descripcion:'',
      nameRules: [
        v => !!v || 'Nombre es requerido',
        v => (v && v.length <= 50) || 'Nombre tiene que tener menos de 50 caracteres',
      ],
      fieldRules: [
        v => !!v || 'Campo es requerido'
      ],
      passRules: [
        v => !!v || 'Contraseña es requerida',
        v => (v && v.length >= 6) || 'Contraseña mayor a 5 dígitos',
      ],
      emailRules: [
        v => !!v || 'E-mail es requerido',
        v => /.+@.+\..+/.test(v) || 'E-mail no válido',
      ],
      editedItem: {
        nombre: '',
        rol:'',
        tipo_documento:'',
        num_documento:'',
        direccion:'',
        telefono:'',
        email:'',
        password:''
      },
      defaultItem: {
        nombre: '',
        rol:'',
        tipo_documento:'',
        num_documento:'',
        direccion:'',
        telefono:'',
        email:'',
        password:''
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
      await this.axios.get('usuario', configuracion).then(res => {
        // console.log(res.data)
        this.usuarios = res.data;
      }).catch(e => {
        console.log(e)
      })
    },

    editItem (item) {
      // this._id = item._id;
      // this.nombre = item.nombre;
      // this.descripcion = item.descripcion
        this.editedIndex = this.usuarios.indexOf(item)
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

      await this.axios.get('usuario/activate/'+ this.adId,configuracion).then(res => {
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

      await this.axios.get(`usuario/deactivate/${this.adId}`,configuracion).then(res => {
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
      this.editedItem.rol = '',
      this.editedItem.tipo_documento ='',
      this.editedItem.num_documento ='',
      this.editedItem.direccion ='',
      this.editedItem.telefono ='',
      this.editedItem.email ='',
       this.editedItem.password =''
      this.editedIndex = -1
    },

    async guardar () {
       let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}
        if (this.editedIndex > -1) {
        //  editar los datos
        const datos = {
            _id: this.editedItem._id,
            nombre: this.editedItem.nombre,
            rol : this.editedItem.rol,
            tipo_documento : this.editedItem.tipo_documento,
            num_documento : this.editedItem.num_documento,
            direccion : this.editedItem.direccion,
            telefono: this.editedItem.telefono,
            email:this.editedItem.email,
            password:this.editedItem.password
          }
        await this.axios.put('usuario/'+ this.editedItem._id, datos,configuracion).then(res => {
          this.obtenerDatos()
        }).catch(e => console.log(e))

        } else {
          // guardar
          const datos = {
            nombre: this.editedItem.nombre,
            rol : this.editedItem.rol,
            tipo_documento : this.editedItem.tipo_documento,
            num_documento : this.editedItem.num_documento,
            direccion : this.editedItem.direccion,
            telefono: this.editedItem.telefono,
            email:this.editedItem.email,
            password:this.editedItem.password
          }
          await this.axios.post('usuario',datos,configuracion).then(res => {
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