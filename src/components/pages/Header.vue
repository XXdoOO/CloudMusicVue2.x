<template>
  <div class="header">
    <div class="logo">
      <a href="https://music.163.com"></a>
    </div>

    <ul class="option">
      <li
        v-for="(item, index) in menuList"
        :key="index"
        :class="active[index]"
        @click.stop="activeClass(index)"
      >
        <router-link :to="item.link">{{ item.name }}</router-link>
      </li>
    </ul>

    <SearchInput :searchKeywords="searchKeywords" />

    <PersonalInfo :src="src" :imgSrc="imgSrc" :menuList="menuList2" />
  </div>
</template>

<script>
import SearchInput from "../SearchInput.vue";
import PersonalInfo from "../PersonalInfo.vue";

export default {
  name: "Header",
  components: { SearchInput, PersonalInfo },
  props: {
    searchKeywords: Function,
    imgSrc: String,
    name: String,
    src: String,
    menuList: {
      type: Array,
      default() {
        return [
          { name: "首页", link: "/index" },
          { name: "TOP", link: "/top" },
          { name: "我的音乐", link: "/myMusic" },
        ];
      },
    },
  },
  data() {
    return {
      active: ["active", "", ""],
      menuList2: [
        { name: "", src: "/" },
        { name: "退出登录", src: "/logout" },
      ],
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        let path = to.fullPath.split("/")[1];

        if (path === "" || path === "index") {
          this.activeClass(0);
        } else if (path == "top") {
          this.activeClass(1);
        } else if (path == "myMusic") {
          this.activeClass(2);
        }
      },
    },
    name(newVal) {
      this.menuList2 = [
        { name: newVal, src: "/" },
        { name: "退出登录", src: "/logout" },
      ];
    },
  },
  methods: {
    activeClass(index) {
      for (let i = 0; i < this.active.length; i++) {
        this.$set(this.active, i, "");
      }
      this.$set(this.active, index, "active");
    },
  },
};
</script>

<style lang="less" scoped>
div.header {
  height: 40px;
  width: 80%;
  padding: 10px 10%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 998;
  border-bottom: 1px salmon solid;

  > div.logo {
    width: 176px;
    height: 69px;
    background: url(https://s2.music.126.net/style/web2/img/frame/topbar.png?d57b0144b7adea334105bfc091dffbdb)
      no-repeat 0 0;

    > a {
      height: 100%;
      width: 100%;
      display: block;
    }
  }

  > ul.option {
    width: 300px;
    height: 60px;
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: 0;

    li.active {
      opacity: 1;
    }

    li {
      list-style: none;
      display: inline-block;
      opacity: 0.8;
      line-height: 60px;
      width: 100px;
      text-align: center;
      background: red;

      a {
        text-decoration: none;
        display: inline-block;
        height: 100%;
        width: 100%;
        color: white;
      }
    }

    li:hover {
      opacity: 1;
      cursor: pointer;
    }
  }
}
</style>