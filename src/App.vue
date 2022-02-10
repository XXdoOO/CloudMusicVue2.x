<template>
  <div id="app">
    <audio autoplay ref="audio"></audio>
    <LoginRegister
      v-show="isShowLoginRegister"
      :requestLogin="requestLogin"
      :isHidden="isDisplayLoginRegister"
    />

    <div class="header">
      <div class="logo">
        <a href="https://music.163.com"></a>
      </div>

      <ul class="option">
        <li :class="active[0]" @click.stop="activeClass(0)">
          <router-link to="/">首页</router-link>
        </li>
        <li :class="active[1]" @click.stop="activeClass(1)">
          <router-link to="/top">排行榜</router-link>
        </li>
        <li :class="active[2]" @click.stop="activeClass(2)">
          <router-link to="/myMusic">我的音乐</router-link>
        </li>
      </ul>

      <SearchInput :searchKeywords="searchKeywords" />

      <PersonalInfo
        @click.native.prevent="isShowLoginRegister = !isShowLoginRegister"
        :imgSrc="imgSrc"
      />
    </div>

    <div class="content">
      <router-view
        name="MusicList"
        :audio="audio"
        :musicList="musicList"
        :cutSong="cutSong"
      ></router-view>

      <div class="playList">
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
        <div><router-view name="PlayList"></router-view></div>
      </div>

      <router-view name="Lyric" :audio="audio" :lyric="lyric"></router-view>
    </div>

    <div class="footer">
      <router-view
        name="ControlBar"
        :audio="audio"
        :musicList="playList"
        :currentIndex="currentIndex"
        :cutSong="cutSong2"
      ></router-view>

      <router-view
        name="ProgressBar"
        :audio="audio"
        :songInfo="songInfo"
      ></router-view>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PersonalInfo from "./components/PersonalInfo.vue";
import LoginRegister from "./components/LoginRegister.vue";
import SearchInput from "./components/SearchInput.vue";

export default {
  name: "App",
  components: { PersonalInfo, LoginRegister, SearchInput },
  data() {
    return {
      musicList: [],
      playList: [],
      currentIndex: 0,
      audio: {},
      mode: "order",
      songInfo: {},
      lyric: "",
      isShowLoginRegister: false,
      active: ["", "", ""],
      imgSrc: "",
      uid: null,
    };
  },
  watch: {
    $route: {
      deep: true,
      handler: function (val, oldVal) {
        console.log(val, oldVal);
        let path = val.fullPath;
        if (path == "/") {
          this.activeClass(0);
        } else if (path == "/top") {
          this.activeClass(1);
        } else if (path == "/myMusic") {
          this.activeClass(2);
        }
      },
    },
  },
  methods: {
    searchKeywords(keywords) {
      this.$router.push(`/search?keywords=${keywords}`);
      console.log(keywords);
      axios.get(`api/search?keywords=${keywords}`).then(
        (resp) => {
          this.musicList = [];
          console.log(resp.data.result.songs);
          for (const item of resp.data.result.songs) {
            this.musicList.push({
              id: item.id,
              name: item.name,
              singer: item.artists[0].name,
              src: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
              duration: parseInt(item.duration / 1000),
              imgUrl: item.album.artist.img1v1Url,
            });
          }
        },
        (error) => {
          console.error(error);
        }
      );
    },
    // 请求登录
    async requestLogin(username, userpwd) {
      console.log(username, userpwd);
      let isLogin = false;
      await axios
        .post(`api/login/cellphone?phone=${username}&password=${userpwd}`)
        .then((response) => {
          console.log(response);
          if (response.data.code == 200) {
            this.imgSrc = response.data.profile.avatarUrl;
            isLogin = true;
          }
        });
      this.isShowLoginRegister = false;
      return isLogin;
    },
    cutSong(playList, currentIndex) {
      console.log("切歌");
      this.playList = playList;
      this.currentIndex = currentIndex;

      console.log("当前播放的歌单：", this.playList, this.currentIndex);

      let item = this.playList[this.currentIndex];
      this.songInfo = {
        name: item.name,
        singer: item.singer,
        duration: item.duration,
      };

      axios.get(`api/lyric?id=${item.id}`).then(
        (response) => {
          console.log(response);
          this.lyric = response.data.lrc.lyric;
        },
        (error) => {
          console.error(error);
        }
      );
    },
    cutSong2(currentIndex) {
      console.log("切歌");
      this.currentIndex = currentIndex;

      console.log("当前播放的歌单：", this.playList, this.currentIndex);

      let item = this.playList[this.currentIndex];
      this.songInfo = {
        name: item.name,
        singer: item.singer,
        duration: item.duration,
      };

      axios.get(`api/lyric?id=${item.id}`).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
    },
    isDisplayLoginRegister() {
      this.isShowLoginRegister = !this.isShowLoginRegister;
      return this.isShowLoginRegister;
    },
    activeClass(index) {
      for (let i = 0; i < this.active.length; i++) {
        this.$set(this.active, i, "");
      }
      console.log(index, this.active);
      this.$set(this.active, index, "active");
    },
  },
  mounted() {
    this.audio = this.$refs.audio;

    let path = this.$route.fullPath;
    if (path == "/") {
      this.activeClass(0);
    } else if (path == "/top") {
      this.activeClass(1);
    } else if (path == "/myMusic") {
      this.activeClass(2);
    }

    this.audio.addEventListener("ended", () => {
      console.log("切歌", this.playList);
      let item = this.playList[this.currentIndex];
      this.songInfo = {
        name: item.name,
        singer: item.singer,
        duration: item.duration,
      };
    });

    axios.get("api/login/status").then((response) => {
      console.log(response);
      if (response.data.data.code == 200) {
        this.imgSrc = response.data.data.profile.avatarUrl;
        this.uid = response.data.data.profile.userId;

        axios.get(`api/user/playlist?uid=${this.uid}`).then((response) => {
          console.log(response);
          console.log(response.data.playlist);
        });
      }
    });
  },
};
</script>

<style lang="less">
html,
body {
  // height: 100%;
  width: 100%;
  background: black;
  margin: 0;
  padding: 0;

  #app {
    width: 100%;
    height: 100%;

    > div.mask {
      position: absolute;
    }

    > div.header {
      height: 50px;
      width: 80%;
      background: skyblue;
      padding: 10px 10%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 999;

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
        height: 70px;
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
          line-height: 70px;
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

    > div.content {
      width: 80%;
      min-width: 1000px;
      background: black;
      margin: 0 auto;
      display: flex;
      align-items: center;

      > div {
        float: left;
      }

      > div.playList {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-top: 50px;
        margin-bottom: 100px;

        > div {
          flex-basis: 20%;
          display: flex;
          justify-content: center;
          margin-bottom: 50px;
        }
      }
    }

    > div.footer {
      position: fixed;
      height: 80px;
      width: 80%;
      padding: 10px 10%;
      min-width: 1000px;
      background: blue;
      bottom: 0px;

      > div {
        float: left;
      }
    }
  }
}
</style>
