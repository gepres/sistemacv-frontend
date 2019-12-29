import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta:{
      administrador:true,
      almacenero:true,
      vendedor:true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    meta:{
      libre:true
    }
  },
  {
    path: '/categoria',
    name: 'categoria',
    component: () => import(/* webpackChunkName: "about" */ '../views/Categoria.vue'),
    meta:{
      administrador:true,
      almacenero:true
    }
  },
  {
    path: '/usuario',
    name: 'usuario',
    component: () => import(/* webpackChunkName: "about" */ '../views/Usuario.vue'),
    meta:{
      administrador:true
    }
  },
  {
    path: '/articulo',
    name: 'articulo',
    component: () => import(/* webpackChunkName: "about" */ '../views/Articulo.vue'),
    meta:{
      administrador:true,
      almacenero:true
    }
  },
  {
    path: '/cliente',
    name: 'cliente',
    component: () => import(/* webpackChunkName: "about" */ '../views/Cliente.vue'),
    meta:{
      administrador:true,
      vendedor:true
    }
  },
  {
    path: '/proveedor',
    name: 'proveedor',
    component: () => import(/* webpackChunkName: "about" */ '../views/Proveedor.vue'),
    meta:{
      administrador:true,
      almacenero:true
    }
  },
  {
    path: '/ingreso',
    name: 'ingreso',
    component: () => import(/* webpackChunkName: "about" */ '../views/Ingreso.vue'),
    meta:{
      administrador:true,
      almacenero:true
    }
  },
  {
    path: '/venta',
    name: 'venta',
    component: () => import(/* webpackChunkName: "about" */ '../views/Venta.vue'),
    meta:{
      administrador:true,
      vendedor:true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) => {
  if(to.matched.some(record => record.meta.libre)){
    next()
  }else if(store.state.usuario && store.state.usuario.rol == 'Administrador'){
    if(to.matched.some(record => record.meta.administrador)){
      next();
    }
  }else if(store.state.usuario && store.state.usuario.rol == 'Vendedor'){
    if(to.matched.some(record => record.meta.vendedor)){
      next();
    }
  }else if(store.state.usuario && store.state.usuario.rol == 'Almacenero'){
    if(to.matched.some(record => record.meta.almacenero)){
      next();
    }
  }else {
    next({name:'login'})
  }
})

export default router
