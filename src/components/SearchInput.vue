<template>
  <div>
    <input
      type="text"
      title="搜索歌曲 / 歌手 / 专辑"
      placeholder="搜索歌曲 / 歌手 / 专辑"
      maxlength="15"
      v-model="keywords"
      @keyup.enter="searchKeywords(keywords)"
    />
    <i title="点击搜索歌曲 / 歌手 / 专辑" @click="searchKeywords(keywords)"></i>
  </div>
</template>

<script>
export default {
  name: "SearchInput",
  props: {
    searchKeywords: {
      type: Function,
      default() {
        console.error("请传入searchKeyWords(keywords)处理搜索！");
      },
    },
  },
  data() {
    return {
      keywords: "",
    };
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0px;
  padding: 0px;
  user-select: none;
}

div {
  width: 220px;
  height: 35px;
  background: transparent;
  position: relative;

  input {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    outline: none;
    border: 1px rgb(66, 62, 62) solid;
    box-sizing: border-box;
    padding: 0 4%;
  }
  i {
    width: 25px;
    height: 25px;
    display: block;
    position: absolute;
    right: 5px;
    top: 3.5px;
    background: url(../assets/images/search.png) no-repeat;
    background-size: cover;
    cursor: pointer;
  }
}
</style>