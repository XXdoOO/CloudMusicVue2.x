<template>
  <div style="height: 100%; overflow: auto">
    <CarouselDiagram
      :imgPage="imgPage"
      :time="time"
      style="margin-bottom: 30px; height: auto; aspect-ratio: 2.7"
      ><slot
    /></CarouselDiagram>
    <PlayList2 :songList="songList" style="height: auto" />
  </div>
</template>

<script>
import axios from "axios";
import PlayList2 from "../PlayList2.vue";
import CarouselDiagram from "../CarouselDiagram.vue";
export default {
  name: "Home",
  components: { PlayList2, CarouselDiagram },
  props: {
    //还需要自定义容器contain的宽度
    // 分页数量
    imgPage: {
      type: Number,
      default: 1,
    },

    //轮播间隔时间
    time: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return { songList: null };
  },
  beforeRouteEnter(to, from, next) {
    console.log(to, from, next);
    console.log(this);

    next((vm) => {
      console.log(vm);
      axios.get("api" + vm.GLOBAL.RECOMMEND_URL).then(
        (response) => {
          console.log(response);
          vm.songList = [];
          for (const item of response.data.playlists) {
            vm.songList.push({
              id: item.id,
              imgSrc: item.coverImgUrl,
              listName: item.name,
              trackCount: item.trackCount,
              link: `playList?id=${item.id}`,
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    });
  },
};
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  border-radius: 5px;
  background-color: rgb(99, 91, 91);
  width: 5px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: silver;
}
</style>