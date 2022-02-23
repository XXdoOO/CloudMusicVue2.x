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

      <router-view name="PlayList2" :songList="songList"> </router-view>

      <Lyric :audio="audio" :lyric="currentMusic.lyric"></Lyric>
    </div>

    <div class="footer">
      <div class="bars">
        <ControlBar
          :audio="audio"
          :musicList="playList"
          :currentIndex="currentIndex"
          :cutSong="cutSong2"
          :mode="mode.name"
        ></ControlBar>

        <ProgressBar :audio="audio" :currentMusic="currentMusic"></ProgressBar>
      </div>

      <div class="icons">
        <Icon
          :customStyles="{
            ...{
              background: `url(${ICON}) 0 -205px`,
              width: '26px',
              height: '25px',
            },
            ...mode.style,
          }"
          :title="mode.title"
          @click.native.stop="switchMode()"
        />
        <Icon
          :customStyles="{
            background: `url(${ICON}) 0 -96px`,
            width: '23px',
            height: '21px',
          }"
        />
        <Icon
          :customStyles="{
            background: `url(${ICON}) 0 -120px`,
            width: '22px',
            height: '21px',
          }"
        />
        <Icon
          :customStyles="{
            background: `url(${ICON}) 0 -399px`,
            width: '24px',
            height: '24px',
          }"
        />
      </div>

      <div>
        <Volume />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PersonalInfo from "./components/PersonalInfo.vue";
import LoginRegister from "./components/LoginRegister.vue";
import SearchInput from "./components/SearchInput.vue";
import Lyric from "./components/Lyric.vue";
import ControlBar from "./components/ControlBar.vue";
import ProgressBar from "./components/ProgressBar.vue";
import Icon from "./components/Icon.vue";
import Volume from "./components/Volume.vue";

axios.defaults.withCredentials = true;

export default {
  name: "App",
  components: {
    PersonalInfo,
    LoginRegister,
    SearchInput,
    Lyric,
    ProgressBar,
    ControlBar,
    Icon,
    Volume,
  },
  data() {
    return {
      audio: null,
      ICON: require("./assets/images/player.png"),
      // 当前播放音乐的歌单及下标
      playList: [],
      currentIndex: 0,
      // 当前查看的歌单
      musicList: [],
      // 播放模式
      mode: {
        name: "order",
        style: {},
        title: "顺序播放",
      },
      // 当前播放的歌曲信息
      currentMusic: {
        name: "未播放",
        singer: [{ name: "未播放" }],
        duration: 0,
        lyric: "未播放歌曲",
      },
      // 当前播放的歌曲歌词
      isShowLoginRegister: false,
      active: ["", "", ""],
      imgSrc: "",
      uid: null,
      songList: [],
    };
  },
  watch: {
    $route: {
      immediate: true,
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

        if (val.path == "/playlist/track/all") {
          if (val.query.id) {
            this.musicList = [];

            this.active[2] = "active";

            axios.get("/api/" + val.fullPath).then((response) => {
              for (const item of response.data.songs) {
                this.musicList.push({
                  id: item.id,
                  name: item.name,
                  singer: item.ar,
                  duration: item.dt,
                  src: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
                });
              }
              console.log("传入的歌单：", this.musicList);
            });
          }
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
              singer: item.artists,
              src: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
              duration: item.duration,
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
      this.playList = playList;
      this.currentIndex = currentIndex;

      console.log("当前播放的歌单：", this.playList, this.currentIndex);

      let item = this.playList[this.currentIndex];
      this.currentMusic = {
        name: item.name,
        singer: item.singer,
        duration: item.duration,
      };

      axios.get(`api/lyric?id=${item.id}`).then(
        (response) => {
          this.$set(this.currentMusic, "lyric", response.data.lrc.lyric);
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
      this.currentMusic = {
        name: item.name,
        singer: item.singer,
        duration: item.duration,
      };

      axios.get(`api/lyric?id=${item.id}`).then(
        (response) => {
          this.$set(this.currentMusic, "lyric", response.data.lrc.lyric);
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
      this.$set(this.active, index, "active");
    },
    // 切换模式
    switchMode() {
      console.log(this.mode.name);
      switch (this.mode.name) {
        case "random":
          this.mode.name = "order";
          this.mode.style = {
            "background-position": "0 -260px",
            width: "23px",
            height: "20px",
          };
          break;
        case "cycle":
          this.mode.name = "random";
          this.mode.style = {
            "background-position": "0 -74px",
            width: "25px",
            height: "19px",
          };
          break;
        default:
          this.mode.name = "cycle";
          this.mode.style = { "background-position": "0 -232px" };
          break;
      }
    },
  },
  created() {
    // 判断登录状态
    axios
      .get(`api/login/status?time=${Date.parse(new Date())}`)
      .then((response) => {
        console.log("登录状态：", response);
        if (response.data.data.code == 200 && response.data.data.profile) {
          this.imgSrc = response.data.data.profile.avatarUrl;
          this.uid = response.data.data.profile.userId;

          axios.get(`api/user/playlist?uid=${this.uid}`).then((response) => {
            console.log(response);
            console.log(response.data.playlist);
            for (const item of response.data.playlist) {
              // console.log(item);
              this.songList.push({
                id: item.id,
                imgSrc: item.coverImgUrl,
                listName: item.name,
                trackCount: item.trackCount,
                link: `/playlist/track/all?id=${item.id}`,
              });
            }
            console.log(this.songList);
          });
        }
      });
  },
  mounted() {
    this.audio = this.$refs.audio;

    this.audio.addEventListener("ended", () => {
      console.log("切歌", this.playList);
      let item = this.playList[this.currentIndex];
      this.currentMusic = {
        name: item.name,
        singer: item.singer,
        duration: item.duration,
      };
    });
  },
};
</script>

<style lang="less">
html,
body {
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
      z-index: 998;

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
      margin: 50px auto;

      > div:nth-child(1) {
        width: calc(100% - 500px);
        float: left;
      }

      > div:last-child {
        float: right;
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
      display: flex;
      justify-content: space-between;

      > div.bars {
        width: calc(100% - 500px);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      > div.icons {
        margin-left: 50px;
        width: 150px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        > div {
          display: inline-block;
        }
      }
    }
  }
}
</style>
