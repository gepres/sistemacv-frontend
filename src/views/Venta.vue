<template>
  <v-container class="align-self-start">
    <v-row>
      <v-col>
        <template>
          <v-data-table
            :headers="headers"
            :items="ventas"
            :search="search"
            sort-by="calories"
            class="elevation-1"
            v-if="!verNuevo"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Ventas</v-toolbar-title>
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
              <v-icon small title="Imprimir" class="mr-2" @click="mostrarComprobante(item)">
                print
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
                small
                @click="accionMostrar(1,item)"
                title="Activar"
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
                <v-autocomplete label="Cliente" item-text="nombre" :disabled="verDetalle" item-value="_id" :rules="fieldRules" :items="personas" v-model="editedItem.persona"></v-autocomplete>  
              </v-col> 
              <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                <v-text-field type="Number" v-model="editedItem.impuesto" :disabled="verDetalle" :rules="fieldRules" label="Impuesto"></v-text-field>  
              </v-col>
              <v-col cols="12" sm="10" md="10" lg="" xl="10">
                <v-text-field v-model="editedItem.codigo" @keyup.enter="obtenerCodigo()" label="Código"></v-text-field>  
              </v-col>
              <v-col cols="12" sm="2" md="2" lg="2" xl="2" class="justify-center d-flex">
                <v-btn small fab dark color="teal" @click="modalArticulo()">
                  <v-icon dark>list</v-icon>
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
                    <template v-slot:item.descuento="{ item }">
                      <v-text-field v-model="item.descuento" type="Number"  min="0"></v-text-field>
                    </template>
                     <template v-slot:item.subtotal="{ item }">
                       S/. {{(item.cantidad * item.precio - item.descuento)}}.00
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
    <!-- modal reporte-->
    <v-dialog v-model="comprobanteModal" max-width="1000">
      <v-card>
        <v-card-title class="headline">
          <v-btn class="mr-4" @click="crearPDF" text><v-icon>print</v-icon></v-btn>
          Reporte de venta
        </v-card-title>
        <v-card-text>
          <div id="factura">
            <header class="header-factura">
                <div id="logo">
                    <img src="data:image/png;base64,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" id="imagen">
                </div>
                <div id="datos">
                    <p id="encabezado">
                        <b>Sistemas Gepres</b><br>Calle Lisboa, La Tinguiña - Ica, Perú<br>Telefono:(+51)945335795<br>Email:genaropretill@gmail.com
                    </p>
                </div>
                <div id="fact">
                    <p>{{editedItem.tipo_comprobante}}<br>
                    {{editedItem.serie_comprobante}} - {{editedItem.num_comprobante}}<br>
                    {{editedItem.date | momentDate}}</p>
                </div>
            </header>
            <br>
            <section>
                <div>
                    <table id="facliente">
                        <tbody>
                            <tr>
                                <td id="cliente">
                                    <strong>Sr(a). {{editedItem.persona.nombre}}</strong><br>
                                    <strong>Documento:</strong> {{editedItem.persona.num_documento}}<br>
                                    <strong>Dirección:</strong> {{editedItem.persona.direccion}}<br>
                                    <strong>Teléfono:</strong> {{editedItem.persona.telefono}}<br>
                                    <strong>Email:</strong> {{editedItem.persona.email}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <br>
            <section class="section-detalles">
                <div>
                    <table id="facarticulo">
                        <thead>
                            <tr id="fa">
                                <th>CANT</th>
                                <th>DESCRIPCION</th>
                                <th>PRECIO UNIT</th>
                                <th>DESC.</th>
                                <th>PRECIO TOTAL</th>
                            </tr>
                        </thead>
                        <tbody class="body-detalles">
                            <tr v-for="item in detalles" :key="item._id">
                                <td style="text-align:center;">{{item.cantidad}}</td>
                                 <td style="text-align:center;">{{item.articulo}}</td>
                                 <td style="text-align:center;">{{item.precio}}</td>
                                 <td style="text-align:center;">{{item.descuento}}</td>
                                 <td style="text-align:center;">{{(item.cantidad * item.precio) - item.descuento}}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th style="text-align:right; padding: .5rem 0;">SUBTOTAL</th>
                                <th style="text-align:right; padding: .5rem 0;">S/. {{editedItem.totalParcial = (editedItem.total - editedItem.totalImpuesto).toFixed(2)}}</th>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th style="text-align:right; padding-bottom: .5rem;">IVA ({{editedItem.impuesto}}%)</th>
                                <th style="text-align:right; padding-bottom: .5rem;">S/. {{editedItem.totalImpuesto = ((editedItem.total * editedItem.impuesto) / (1+editedItem.impuesto)).toFixed(2)}}</th>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th style="text-align:right;">TOTAL</th>
                                <th style="text-align:right;">S/. {{editedItem.total = calcularTotal}}.00</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </section>
            <br>
            <br>
            <footer class="footer-factura">
                <div id="gracias" class="footer-factura__content">
                    <p><b>Gracias por su compra!</b></p>
                </div>
            </footer>
          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="blue darken-1" @click="ocultarComprobante" text>
            Cancelar
          </v-btn>
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
                        v-if="addVentaController(item)"
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
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
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
        { text: 'Cliente', value: 'persona.nombre',sortable: true },
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
        { text: 'Descuento', value: 'descuento', sortable: false },
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
      ventas: [],
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
        totalImpuesto:0,
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
      verDetalle:false,
      comprobanteModal:false
    }
  },
  computed: {
      calcularTotal(){
        let resultado = 0.0;
        for(let i = 0 ; i < this.detalles.length ; i++ ){
          resultado = resultado + ((this.detalles[i].cantidad * this.detalles[i].precio) - this.detalles[i].descuento)
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
      await this.axios.get('persona/clientes', configuracion).then(res => {
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
        this.texto = ''
      }).catch(e => {
        console.log(e)
      })
    },

    async obtenerDetalles(id){
      let header = {"token" : this.$store.state.token};
      let configuracion = {headers : header}
      await this.axios.get('venta/'+id, configuracion).then(res => {
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
      await this.axios.get('venta', configuracion).then(res => {
        // console.log(res.data)
        this.ventas = res.data;
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
            precio:data.precio_venta,
            descuento:0
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

      await this.axios.get('venta/activate/'+ this.adId,configuracion).then(res => {
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

      await this.axios.get(`venta/deactivate/${this.adId}`,configuracion).then(res => {
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
      this.editedItem.persona = '',
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
      await this.axios.post('venta',datos,configuracion).then(res => {
        this.limpiar()
        this.obtenerDatos()
      }).catch(e => console.log(e))
      this.close()
    },

    mostrarComprobante(item){
      this.comprobanteModal = true
      this.limpiar();
      this.editedItem.tipo_comprobante = item.tipo_comprobante
      this.editedItem.serie_comprobante = item.serie_comprobante
      this.editedItem.num_comprobante = item.num_comprobante
      this.editedItem.persona = item.persona
      this.editedItem.impuesto = item.impuesto
      this.editedItem.date = item.date
      this.obtenerDetalles(item._id)
    },

    ocultarComprobante(){
      this.comprobanteModal = false
    },

    crearPDF(){
      var quotes = document.getElementById('factura')
      html2canvas(quotes).then( canvas => {
        var imgData = canvas.toDataURL('image/png')
        var imgWidth = 210
        var pageHeight = 295
        var imgHeight = canvas.height * imgWidth / canvas.width
        var heightLeft = imgHeight
        var doc = new jsPDF('p','mm','a4')
        var position = 0
        doc.addImage(imgData,'PNG',0,position,imgWidth,imgHeight)
        heightLeft -= pageHeight
        while(heightLeft >= 0){
          position = heightLeft - imgHeight
          doc.addPage()
          doc.addImage(imgData,'PNG',0,position,imgWidth,imgHeight)
          heightLeft -= pageHeight
        }
        doc.save('comprobanteVenta.pdf')
      })
    },

    addVentaController(item){
      if(item.estado == 1 && item.stock !== 0){
         return true   
        }else if(item.estado == 0 || item.stock == 0){
          return false
        }
      }
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
<style lang="scss" scoped>
 #factura {
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 16px ;
        }

        #logo {
            // float: left;
            margin-left: 2%;
            margin-right: 2%;
        }
        #imagen {
            width: 100px;
        }

        #fact {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }   

        #datos {
            // float: left;
            margin-top: 0%;
            margin-left: 2%;
            margin-right: 2%;
            /*text-align: justify;*/
        }

        #encabezado {
            text-align: center;
            margin-left: 10px;
            margin-right: 10px;
            font-size: 16px;
        }

        section {
            clear: left;
        }

        #cliente {
            text-align: left;
        }

        #facliente {
            width: 40%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 15px;
        }

        #fa {
            color: #FFFFFF;
            font-size: 14px;
        }

        #facarticulo {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            padding: 20px;
            margin-bottom: 15px;
        }

        #facarticulo thead {
            padding: 20px;
            background: #2183E3;
            text-align: center;
            border-bottom: 1px solid #FFFFFF;
        }

        #gracias {
            text-align: center;
        }
</style>
<style lang="scss" scoped>
.header-factura{
  width: 100% ;
  display: flex;
  & #logo{
    width: 20% ;
  }
  & #datos {
    width: 50% ;
  }
  & #fact {
    width: 25% ;
  }
}
.section-detalles {
  background: #F5F5F5;
}
.body-detalles{
  border-bottom: 1px solid;
}
.footer-factura{
  height: 50px;
  background: #039BE5;
  &__content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    & p {
      color: white;
    margin: 0;
    }
  }
}
</style>