<template>
  <div class="root">
    <div class="face">
      <img v-show="imgSrc" :src="imgSrc" alt="头像" title="点击修改头像" />
      <a v-show="!imgSrc" title="点击登录/注册" @click.stop="clickLoginRegister()">登录/注册</a>
      <router-link to="/"></router-link>
    </div>
    <div class="menu" v-show="imgSrc">
      <ul>
        <li v-for="item in menuList" :key="item.src">
          <a :href="item.src">{{ item.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "PersonalInfo",
  props: {
    imgSrc: {
      type: String,
      default() {
        let src =
          "https://p4.music.126.net/5lVnlQsLRXHNGtzpIg9dwQ==/18509178744008569.jpg";
        src = "";
        return src;
      },
    },
    clickLoginRegister: {
      type: Function,
      default() {
        console.error("请传入clickLoginRegister函数处理点击登录注册事件");
      },
    },
    menuList: {
      type: Array,
      default() {
        return [
          { name: "我的主页", src: "s" },
          { name: "退出登录", src: "api/logout" },
        ];
      },
    },
  },
};
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
  user-select: none;
}

div.root {
  width: 80px;
  height: 50px;
  position: relative;

  div.face {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    > a {
      text-decoration: none;
      color: white;
      cursor: pointer;
      opacity: 0.8;
    }

    > a:hover {
      opacity: 1;
    }

    > img {
      height: 50px;
      border-radius: 50%;
    }
  }

  div.face:hover + div.menu > ul {
    display: block;
  }

  div.menu {
    position: absolute;

    > ul:hover {
      display: block;
    }

    > ul {
      width: 100px;
      height: fit-content;
      position: absolute;
      right: 0;
      left: -10px;
      display: none;

      > li {
        text-align: center;
        line-height: 30px;
        list-style: none;
        border: greenyellow 1px solid;
        cursor: pointer;
        background: red;

        > a {
          color: white;
          text-decoration: none;
        }
      }

      > li:nth-child(1) {
        border-radius: 5px 5px 0 0;
      }

      > li:last-child {
        border-radius: 0 0 5px 5px;
      }

      > li:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>