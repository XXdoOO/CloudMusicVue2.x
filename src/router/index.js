import Vue from "vue";
import VueRouter from "vue-router"
import MusicList from "../components/MusicList.vue";
import Menu from "../components/Menu.vue";
import ProgressBar from "../components/ProgressBar.vue";
import Lyric from "../components/Lyric.vue";
import ControlBar from "../components/ControlBar.vue";
import PlayList from "../components/PlayList.vue";


Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new VueRouter({
  routes: [
    { path: "/search", components: { MusicList, Menu, ProgressBar, Lyric, ControlBar } },
    { path: "/myMusic", components: { PlayList } }
  ]
});