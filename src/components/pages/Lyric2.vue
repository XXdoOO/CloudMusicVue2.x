<template>
  <div class="lyric2">
    <AlbumCover :audio="audio" :src="src" />
    <Lyric :audio="audio" :lyric="lyric" />
  </div>
</template>

<script>
import Lyric from "../Lyric.vue";
import AlbumCover from "../AlbumCover.vue";
export default {
  name: "Lyric2",
  components: { Lyric, AlbumCover },
  props: {
    audio: {
      require: true,
    },
    src: {
      type: String,
      default: require("../images/logo.png"),
    },
    lyric: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less" scoped>
div.lyric2 {
  position: fixed;
  right: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  min-width: 400px;
}
</style>