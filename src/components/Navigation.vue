<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-if="logueado"
    >
      <v-list dense>
        <template v-if="esAdministrador || esAlmacenero || esVendedor">
          <v-list-item :to="{name:'home'}">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item>
        </template>
        <!-- almacen -->
        <template v-if="esAdministrador || esAlmacenero">
          <v-list-group>
            <v-list-item slot="activator">
                <v-list-item-content>
                  <v-list-item-title>
                    Almacen
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              :to="{name:'categoria'}"
            >
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Categorías
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              :to="{name:'articulo'}"
            >
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Artículos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <!-- Compras -->
        <template v-if="esAdministrador || esAlmacenero">
          <v-list-group>
            <v-list-item slot="activator">
                <v-list-item-content>
                  <v-list-item-title>
                    Compras
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              :to="{name:'ingreso'}"
            >
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Ingresos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              :to="{name:'proveedor'}"
            >
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Proveedores
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <!-- Ventas -->
        <template v-if="esAdministrador || esVendedor">
          <v-list-group>
            <v-list-item slot="activator">
                <v-list-item-content>
                  <v-list-item-title>
                    Ventas
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              :to="{name:'venta'}"
            >
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              :to="{name:'cliente'}"
            >
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Clientes
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <!-- Accesos -->
        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-item slot="activator">
                <v-list-item-content>
                  <v-list-item-title>
                    Accesos
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              :to="{name:'usuario'}"
            >
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Usuarios
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <!-- Consula -->
        <template v-if="esAdministrador || esAlmacenero || esVendedor">
          <v-list-group>
            <v-list-item slot="activator">
                <v-list-item-content>
                  <v-list-item-title>
                    Consultas
                  </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              :to="{name:''}"
            >
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Consulta Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              :to="{name:''}"
            >
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Consulta Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!--  App Bar -->
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">Sistema de compra - venta</span>
      </v-toolbar-title>
      <v-spacer />
      <div class="mr-5" v-if="logueado">
        <span>{{nombre}}</span>
      <v-chip
      class="ma-2"
      color="primary"
      outlined
      text-color="white"
    >
      {{rol}}
    </v-chip>
      </div>
      <v-btn class="mr-4" @click="salir()" icon v-if="logueado">
        <v-icon>logout</v-icon>Salir
      </v-btn>
      <v-btn :to="{name:'login'}" icon v-else>
        <v-icon>apps</v-icon>
      </v-btn>
    </v-app-bar> 
  </div>
</template>

<script>
export default {
  name:'navigation',
  data(){
    return {
      drawer: false,
      usuario:{},
      nombre:'',
      rol:''
    }
  },
  computed:{
    logueado(){
      return this.$store.state.usuario
    },
    esAdministrador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Administrador' 
    },
    esVendedor(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Vendedor'
    },
    esAlmacenero(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Almacenero'
    }
  },
  created(){
    this.$store.dispatch("autoLogin")
  },
  updated(){
    this.obtenerUsuario()
  },
  methods:{
    salir(){
      this.$store.dispatch("salir")
      this.nombre = ''
      this.rol = ''
    },
    async obtenerUsuario(){
      if(this.$store.state.usuario){
        this.nombre = this.$store.state.usuario.nombre
        this.rol = this.$store.state.usuario.rol
      }else{
        return null;
      }
    }
  }
}
</script>

<style>

</style>