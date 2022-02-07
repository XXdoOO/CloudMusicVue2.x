<template>
  <div>
    <input
      type="text"
      title="请输入你要搜索的歌曲/歌手/专辑"
      placeholder="请输入你要搜索的歌曲/歌手/专辑"
      maxlength="15"
      v-model="keywords"
      @keyup.enter="searchKeywords(keywords)"
    />
    <i title="点击搜索"></i>
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
  width: 252px;
  height: 32px;
  position: absolute;
  background: transparent;
  input {
    width: calc(97% - 2px);
    height: calc(100% - 2px);
    // border-radius: 6px;
    border-radius: 6px;
    outline: none;
    border: 1px rgb(66, 62, 62) solid;
    padding: 0;
    padding-left: 3%;
    position: absolute;
  }
  i {
    width: 25px;
    height: 25px;
    display: inline-block;
    position: absolute;
    right: 8px;
    top: 3px;
    background: url(../assets/images/search.png) no-repeat;
    background-size: cover;
    cursor: pointer;
  }
}
</style>