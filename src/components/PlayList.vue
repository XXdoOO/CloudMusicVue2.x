<template>
  <div class="root">
    <a :href="link">
      <img :src="imgSrc" alt="" />
    </a>
    <div>
      <span>{{ name }}</span>
      <span>共{{ trackCount }}首</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayList",
  props: {
    link: {
      type: String,
      default() {
        return "https://music.163.com/#/playlist?id=3136952023";
      },
    },
    imgSrc: {
      type: String,
      default() {
        return "https://p2.music.126.net/3I-73aQn3YCw-2cZdK1fQw==/109951166027478939.jpg?param=140y140";
      },
    },
    name: {
      type: String,
      default() {
        return "我喜欢";
      },
    },
    trackCount: {
      type: Number,
      default() {
        return 133;
      },
    },
  },
};
</script>

<style lang="less" scoped>
div.root {
  width: 150px;
  height: 150px;
  background: red;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  
  img {
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 6px;
  }

  div {
    width: 120px;
    height: 15px;
    background: rgba(112, 63, 63, 0.5);
    position: absolute;
    bottom: 0;
    padding: 5px 15px;
    display: flex;
    justify-content: space-between;

    span {
      font-size: 12px;
      color: white;
    }
  }
}
</style>