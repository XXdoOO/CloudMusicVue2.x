import Vue from "vue";
import VueRouter from "vue-router"
import MusicList from "../components/MusicList.vue";
import PlayList2 from "../components/PlayList2.vue";
import LoginRegister from "../components/LoginRegister.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
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