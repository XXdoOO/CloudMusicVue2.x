import Vue from "vue";
import VueRouter from "vue-router"
import LoginRegister from "../components/pages/LoginRegister.vue";
import PlayList2 from "../components/PlayList2.vue";
import MusicList from "../components/MusicList.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "index",
      component: { PlayList2 },
    },
    {
      path: "/index",
      redirect: "/",
    },
    {
      path: "/top",
      name: "top",
      component: { PlayList2 },
    },
    {
      path: "/top/playList",
      name: "tplayList",
      components: { MusicList }
    },
    {
      path: "/myMusic",
      name: "myMusic",
      meta: { requireAuth: true },
      components: { PlayList2 },
    },
    {
      path: "/myMusic/playList",
      name: "mplayList",
      components: { MusicList }
    },
    {
      path: "/search",
      name: "search",
      components: { MusicList }
    },
    {
      path: "/login",
      name: "login",
      components: { LoginRegister }
    },
    {
      path:"/logout",
      name:"logout",
      redirect: "/"
    }
  ]
});

// 守卫当前路由是否需要授权
router.beforeEach((to, from, next) => {
  console.log(to, from);
  if (to.meta.requireAuth) {
    if (localStorage.getItem("authorization")) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;