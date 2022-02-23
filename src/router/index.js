import Vue from "vue";
import VueRouter from "vue-router"
import MusicList from "../components/MusicList.vue";
import PlayList2 from "../components/PlayList2.vue";


Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new VueRouter({
  routes: [
    { path: "/search", components: { MusicList } },
    { path: "/playlist/track/all", components: { MusicList } },
    { path: "/myMusic", components: { PlayList2 } },
  ]
});