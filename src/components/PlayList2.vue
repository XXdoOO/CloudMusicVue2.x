<template>
  <div class="playList">
    <div v-for="item in songList" :key="item.id">
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
import PlayList from "./PlayList.vue";
export default {
  name: "PlayList2",
  components: { PlayList },
  props: { songList: Array },
};
</script>

<style lang="less" scoped>
div.playList {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 50px;
  margin-bottom: 100px;

  > div {
    flex-basis: 33%;
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
  }
}
</style>