<template>
  <v-container class="align-self-start">
    <v-row>
      <v-col>
        <template>
          <v-data-table
            :headers="headers"
            :items="ingresos"
            :search="search"
            sort-by="calories"
            class="elevation-1"
            v-if="!verNuevo"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Ingresos</v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field v-if="!verNuevo" class="text-xs-center" v-model="search" append-icon="search" label="Buscar" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark class="mb-2" v-if="!verNuevo" @click="mostrarNuevo()">Nuevo</v-btn>
              </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon title="Detalles" small class="mr-2" @click="verIngreso(item)">
                tab
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
            <template v-slot:item.date="{ item }">
              {{item.date | momentDate}}
            </template>
            <template v-slot:item.total="{ item }">
              {{item.total | monedaconvert}}
            </template>
            <template v-slot:item.estado="{ item }">
              <div v-if="item.estado">
                <span class="blue--text">Aceptado</span>
              </div>
              <div v-else>
                <span class="red--text">Anulado</span>
              </div>
            </template>
          </v-data-table>
           <v-form v-model="valid">
          <v-container grid-list-sm class="pa-4 white" v-if="verNuevo"> 
            <v-row wrap>
              <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                <v-select v-model="editedItem.tipo_comprobante" :disabled="verDetalle" :items="comprobantes" label="Tipo Comprobante" :rules="fieldRules"></v-select>  
              </v-col>
              <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                <v-text-field v-model="editedItem.serie_comprobante" :disabled="verDetalle" label="Serie Comprobante"></v-text-field>  
              </v-col>
              <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                <v-text-field v-model="editedItem.num_comprobante" :disabled="verDetalle" label="Número Comprobante" :rules="fieldRules"></v-text-field>  
              </v-col>
              <v-col cols="12" sm="4" md="8" lg="8" xl="8">
                <v-autocomplete label="Proveedor" item-text="nombre" :disabled="verDetalle" item-value="_id" :rules="fieldRules" :items="personas" v-model="editedItem.persona"></v-autocomplete>  
              </v-col> 
              <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                <v-text-field type="Number" v-model="editedItem.impuesto" :disabled="verDetalle" :rules="fieldRules" label="Impuesto"></v-text-field>  
              </v-col>
              <v-col cols="12" sm="10" md="10" lg="" xl="10">
                <v-text-field v-model="editedItem.codigo" @keyup.enter="obtenerCodigo()" label="Código"></v-text-field>  
              </v-col>
              <v-col cols="12" sm="2" md="2" lg="2" xl="2" class="justify-center d-flex">
                <v-btn small fab dark color="teal" @click="modalArticulo()">
                  <v-icon title="Lista" dark>list</v-icon>
                </v-btn>  
              </v-col>
              <v-col cols="12" v-if="this.errorArticulo !== '' ">
                <v-alert dense outlined  v-text="errorArticulo" type="error">     
                </v-alert>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <template>
                  <v-data-table hide-default-footer :headers="cabeceraDetalles" :items="detalles" class="elevation-1">
                     <template v-slot:item.borrar="{ item }">
                       <v-icon
                        small
                        class="mr-2"
                        @click="eliminarDetalle(detalles,item)"
                        title="Borrar"
                        >
                        delete
                      </v-icon>
                    </template>
                     <template v-slot:item.cantidad="{ item }">
                       <v-text-field v-model="item.cantidad" type="Number" min="1"></v-text-field>
                    </template>
                    <template v-slot:item.precio="{ item }">
                      <v-text-field v-model="item.precio" type="Number"  min="1"></v-text-field>
                    </template>
                     <template v-slot:item.subtotal="{ item }">
                       S/. {{item.cantidad * item.precio}}.00
                    </template>
                    <template slot="no-data">
                      <h3>No hay artículos agregados al detalle.</h3>
                    </template>  
                  </v-data-table>
                  <v-col class="text-right">
                    <strong>Total Parcial :</strong>S/. {{editedItem.totalParcial = (editedItem.total - editedItem.totalImpuesto).toFixed(2)}}
                  </v-col>
                  <v-col class="text-right">
                    <strong>Total Impuesto :</strong>S/. {{editedItem.totalImpuesto = ((editedItem.total * editedItem.impuesto) / (1+editedItem.impuesto)).toFixed(2)}}
                  </v-col>
                  <v-col class="text-right">
                    <strong>Total Neto :</strong>S/. {{editedItem.total = calcularTotal}}.00
                  </v-col>
                </template>
              </v-col>
              <v-col cols="12" class="text-right">
                <v-btn color="blue darken-1" text @click="ocultarNuevo()">Cancelar</v-btn>
                <v-btn color="success" v-if="!verDetalle" :disabled="!valid" @click.native="guardar()">Guardar</v-btn>
              </v-col>
            </v-row>
          </v-container>
          </v-form>  
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
    <!-- modal articulo -->
    <v-dialog v-model="dialogArticulo" max-width="1000px">
      <v-card>
        <v-card-title>
          <span class="headline">Seleccione un Artículo</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field class="text-center" @keyup.enter="obtenerArticulos()" v-model="texto" append-icon="search" label="Búsqueda"></v-text-field>
                <template>
                  <v-data-table
                    :headers="cabeceraArticulos"
                     :items="articulos"
                    sort-by="calories"
                    class="elevation-1"
                  >
                    <template v-slot:top>
                      <v-toolbar flat color="white">
                        <v-toolbar-title>Artículos</v-toolbar-title>
                        <v-divider
                          class="mx-4"
                          inset
                          vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                    </template>
                    <template v-slot:item.seleccionar="{ item }">
                      <v-icon
                        small
                        class="mr-2" 
                        @click="agregarDetalle(item)"
                        title="Agregar"
                      >
                        add
                      </v-icon>                  
                    </template>
                    <template v-slot:item.estado="{ item }">
                      <div v-if="item.estado">
                        <span class="blue--text">Activo</span>
                      </div>
                      <div v-else>
                        <span class="red--text">Inactivo</span>
                      </div>
                    </template>
                    <template v-slot:item.categoria="{ item }">
                      <span>{{item.categoria.nombre}}</span>
                     </template>
                    <template v-slot:item.precio_venta="{ item }">
                      {{item.precio_venta | monedaconvert}}
                    </template>
                  </v-data-table>
                  </template>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>  
  </v-container>
</template>

<script>
const moment = require('moment');
export default {
  name:'ingreso',
  data(){
    return {
      dialogArticulo: false,
      valid: true,
      verNuevo:false,
      search: '',
      headers: [
        { text: 'Opciones', value: 'action', sortable: false },
        { text: 'Usuario', value: 'usuario.nombre',sortable: true },
        { text: 'Proveedor', value: 'persona.nombre',sortable: true },
        { text: 'Tipo Comprobante', value: 'tipo_comprobante',sortable: true },
        { text: 'Serie Comprobante', value: 'serie_comprobante',sortable: false },
        { text: 'Número Comprobante', value: 'num_comprobante',sortable: false },
        { text: 'Fecha', value: 'date',sortable: false },
        { text: 'Impuesto', value: 'impuesto',sortable: false },
        { text: 'Total', value: 'total',sortable: false },
        { text: 'Estado', value: 'estado',sortable: false },
      ],
      cabeceraDetalles:[
        { text: 'Borrar', value: 'borrar', sortable: false },
        { text: 'Artículo', value: 'articulo', sortable: false },
        { text: 'Cantidad', value: 'cantidad', sortable: false },
        { text: 'Precio', value: 'precio', sortable: false },
        { text: 'Sub Total', value: 'subtotal', sortable: false },
      ],
      cabeceraArticulos: [
        { text: 'Seleccionar', value: 'seleccionar', sortable: false },
        { text: 'Código', value: 'codigo', sortable: false },
        { text: 'Nombre', value: 'nombre',sortable: true },
        { text: 'Categoría', value: 'categoria.nombre',sortable: true },
        { text: 'Stock', value: 'stock',sortable: false },
        { text: 'Precio Venta', value: 'precio_venta',sortable: false },
        { text: 'Descripción', value: 'descripcion',sortable: false },
        { text: 'Estado', value: 'estado',sortable: false },
      ],
      detalles:[],
      ingresos: [],
      comprobantes:['BOLETA','FACTURA','TICKET','GUIA'],
      personas:[],
      articulos:[],
      texto:'',
      nameRules: [
        v => !!v || 'Nombre es requerido',
        v => (v && v.length <= 50) || 'Nombre tiene que tener menos de 50 caracteres',
      ],
      fieldRules: [
        v => !!v || 'Campo es requerido'
      ],
      emailRules: [
        v => !!v || 'E-mail es requerido',
        v => /.+@.+\..+/.test(v) || 'E-mail no válido',
      ],
      editedItem: {
        nombre: '',
        usuario:'',
        persona:'',
        tipo_comprobante:'',
        serie_comprobante:'',
        num_comprobante:'',
        date:'',
        impuesto:0.18,
        total:0,
        totalParcial:0,
        totalImpuesto:0
      },
      defaultItem: {
        nombre: '',
        usuario:'',
        persona:'',
        tipo_comprobante:'',
        serie_comprobante:'',
        num_comprobante:'',
        date:'',
        impuesto:'',
        total:0,
        totalParcial:0,
        totalImpuesto:0
      },
      admodal:false,
      adAccion:0,
      adNombre:'',
      adId:'',
      errorArticulo:'',
      verDetalle:false
    }
  },
  computed: {
      calcularTotal(){
        let resultado = 0.0;
        for(let i = 0 ; i < this.detalles.length ; i++ ){
          resultado = resultado + (this.detalles[i].cantidad * this.detalles[i].precio)
        }
        return resultado;
      }
    },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  created () {
    this.obtenerDatos()
    this.obtenerPersonas()
  },

  methods: {
    async obtenerPersonas(){
      let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}
      await this.axios.get('persona/proveedores', configuracion).then(res => {
        // console.log(res.data)
        this.personas = res.data;
      }).catch(e => {
        console.log(e)
      })
    },

    async obtenerArticulos(){
      let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}
      await this.axios.get('articulo?valor='+this.texto, configuracion).then(res => {
        // console.log(res.data)
        this.articulos = res.data;
      }).catch(e => {
        console.log(e)
      })
    },

    async obtenerDetalles(id){
      let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}
      await this.axios.get('ingreso/'+id, configuracion).then(res => {
        // console.log(res.data)
        this.detalles = res.data.detalles;
      }).catch(e => {
        console.log(e)
      })
    },

    verIngreso(item){
      this.limpiar();
      this.editedItem.tipo_comprobante = item.tipo_comprobante
      this.editedItem.serie_comprobante = item.serie_comprobante
      this.editedItem.num_comprobante = item.num_comprobante
      this.editedItem.persona = item.persona._id
      this.editedItem.impuesto = item.impuesto
      this.obtenerDetalles(item._id)
      this.verNuevo = true
      this.verDetalle = true
    },

    async obtenerCodigo(){
      let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}
      await this.axios.get('articulo/query/Codigo?codigo='+this.editedItem.codigo, configuracion).then(res => {
        // console.log(res.data)
        this.agregarDetalle(res.data)
      }).catch(e => {
        console.log(e)
        this.errorArticulo = 'No existe el artículo.'
        setTimeout(() => {this.errorArticulo = ''},2000)
      })
    },


    async obtenerDatos(){
      let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}
      await this.axios.get('ingreso', configuracion).then(res => {
        // console.log(res.data)
        this.ingresos = res.data;
      }).catch(e => {
        console.log(e)
      })
    },

    encuentra(id){
      let sw = false;
      for(let i = 0; i< this.detalles.length; i++){
        if(this.detalles[i]._id == id){
          sw= true;
        }
      }
      return sw
    },

    agregarDetalle(data){
      this.errorArticulo = '';
      if(this.encuentra(data._id) == true){
        this.errorArticulo = 'El artículo ya ha sido agregado'
        setTimeout(() => {this.errorArticulo = ''},2000)
      }else {
        this.detalles.push(
          {
            _id:data._id,
            articulo:data.nombre,
            cantidad:1,
            precio:data.precio_venta
          }
        );
        this.editedItem.codigo = ''
      }
      
    },

    eliminarDetalle(arr,item){
      let i = arr.indexOf(item);
      if(i != -1){
        arr.splice(i,1)
      }

    },
    accionMostrar (accion, item) {
      this.admodal = true;
      this.adNombre = item.num_comprobante;
      this.adId = item._id;
        if(accion == 1){
          this.adAccion = 1;
        }else if(accion == 2){
          this.adAccion = 2
        }else{
           this.admodal = false;
        }
    },

    modalArticulo(){
      this.dialogArticulo = true;
    },

    mostrarNuevo(){
      this.verNuevo = true;

    },

    ocultarNuevo(){
      this.verNuevo = false;
      this.limpiar()
    },

    async activar(){
      let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}

      await this.axios.get('ingreso/activate/'+ this.adId,configuracion).then(res => {
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

      await this.axios.get(`ingreso/deactivate/${this.adId}`,configuracion).then(res => {
        this.admodal = false;
        this.adNombre = '';
        this.adAccion = 0
        this.adId = '';
        this.obtenerDatos()
        }).catch(e => console.log(e))
    },

    close () {
        this.dialogArticulo = false
    },
    closeAdmodal(){
      this.admodal = false
    },
    limpiar(){
      this.editedItem._id = '',
      this.editedItem.persona,
      this.editedItem.tipo_comprobante = '',
      this.editedItem.serie_comprobante = '',
      this.editedItem.num_comprobante = '',
      this.editedItem.impuesto = 0.18,
      this.editedItem.codigo = 0,
      this.editedItem.totalParcial = 0,
      this.editedItem.totalImpuesto = 0
      this.editedItem.total = 0,
      this.detalles = [],
      this.verNuevo = false
      this.verDetalle = false
    },

    async guardar () {
      let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}
       // guardar
      const datos = {
        usuario:this.$store.state.usuario._id,
        persona:this.editedItem.persona,
        tipo_comprobante:this.editedItem.tipo_comprobante,
        serie_comprobante:this.editedItem.serie_comprobante,
        num_comprobante:this.editedItem.num_comprobante,
        impuesto:this.editedItem.impuesto,
        total:this.editedItem.total,
        detalles:this.detalles
      }
      await this.axios.post('ingreso',datos,configuracion).then(res => {
        this.limpiar()
        this.obtenerDatos()
      }).catch(e => console.log(e))
      this.close()
    },
  },

  filters:{
    monedaconvert(value) {
      return `S/. ${value}.00`
    },
    momentDate(value) {
      moment.locale('es');
      return moment(value).format('ll')
    },
  }
}
</script>

<style>

</style>