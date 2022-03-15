<template>
  <div class="playList">
    <div v-for="item in songList2" :key="item.id">
      <PlayList
        :link="item.link"
        :imgSrc="item.imgSrc"
        :listName="item.listName"
        :trackCount="item.trackCount"
      ></PlayList>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PlayList from "./PlayList.vue";
export default {
  name: "PlayList2",
  components: { PlayList },
  props: { songList: Array },
  data() {
    return {
      songList2: null,
    };
  },
  watch:{
    songList(newVal){
      this.songList2 = newVal;
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log(to, from, next);
    let name = to.name;
    console.log(name);
    // 判断请求路径
    if (name === "top") {
      next((vm) => {
        console.log(vm);
        vm.songList2 = [];
        axios.get("api" + vm.GLOBAL.TOP_URL).then((response) => {
          console.log(response);
          console.log(response.data.list);
          for (const item of response.data.list) {
            vm.songList2.push({
              id: item.id,
              imgSrc: item.coverImgUrl,
              listName: item.name,
              trackCount: item.trackCount,
              link: `top/playList?id=${item.id}`,
            });
          }
        });
      });
    } else {
      next();
    }
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

div.playList {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;

  > div {
    flex-basis: 33%;
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
  }
}
</style>