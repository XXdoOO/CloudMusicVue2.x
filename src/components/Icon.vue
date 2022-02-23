<template>
  <div class="root">
    <i :style="customStyles"></i>
  </div>
</template>

<script>
export default {
  name: "Icon",
  props: {
    customStyles: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="less" scoped>
div.root {
  i {
    display: block;
    width: 30px;
    height: 30px;
    background: red;
    cursor: pointer;
  }
}
</style>