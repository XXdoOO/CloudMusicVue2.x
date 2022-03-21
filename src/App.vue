<template>
  <div
    id="app"
    :style="{ background: `url(${currentMusic.album}) no-repeat fixed` }"
  >
    <audio autoplay ref="audio"></audio>
    <router-view
      name="LoginRegister"
      :requestLogin="requestLogin"
      :clickMask="clickMask"
    ></router-view>

    <Header
      :imgSrc="user.avatar"
      :name="user.name"
      :searchKeywords="searchKeywords"
      src="/login"
    />

    <div class="content">
      <router-view
        name="Home"
        :songList="songList"
        :imgPage="bannerList.length"
      >
        <a
          target="_blank"
          v-for="(item, index) in bannerList"
          :key="index"
          :href="item.url"
          style="width: 10%; height: 100%"
        >
          <img
            :src="item.imageUrl"
            :alt="item.typeTitle"
            style="height: 100%"
          />
        </a>
        ></router-view
      >

      <router-view
        name="MusicList"
        :audio="audio"
        :musicList="musicList"
        :cutSong="cutSongList"
      />

      <router-view name="PlayList2" :songList="songList" />

      <div class="contentRight">
        <AlbumCover :audio="audio" :src="currentMusic.album" />
        <Lyric :audio="audio" :lyric="currentMusic.lyric"></Lyric>
      </div>
    </div>

    <Footer
      :audio="audio"
      :currentIndex="currentIndex"
      :currentMusicList="currentMusicList"
      :uid="user.uid"
      :cutSong="cutSong"
    />
  </div>
</template>

<script>
import axios from "axios";
import Lyric from "./components/Lyric.vue";
import AlbumCover from "./components/AlbumCover.vue";
import Header from "./components/pages/Header.vue";
import Footer from "./components/pages/Footer.vue";

axios.defaults.withCredentials = true;

export default {
  name: "App",
  components: {
    Lyric,
    AlbumCover,
    Header,
    Footer,
  },
  data() {
    return {
      audio: null,
      // 喜欢列表的音乐id列表
      likeList: [],

      // 当前查看的歌单
      musicList: [],

      // 当前播放的歌单
      currentMusicList: [],

      // 当前播放歌曲的下标
      currentIndex: null,

      // 当前播放的歌曲信息
      currentMusic: {
        id: null,
        name: "未播放",
        album: require("./components/images/logo.png"),
        singer: [{ name: "未播放" }],
        duration: 0,
        lyric: "未播放歌曲",
      },

      user: {
        avatar: "",
        name: "",
        uid: 0,
      },

      songList: [],

      // 轮播图
      bannerList: [],
    };
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler: async function (to) {
        let name = to.name;
        console.log("当前路由：", name);

        switch (name) {
          case "playList":
            this.getPlayList(to.query.id);
            break;
          case "tplayList":
            this.getPlayList(to.query.id);
            break;
          case "myMusic":
            // 获取用户全部歌单
            await this.status();
            console.log("获取用户全部歌单", this.user.uid);
            this.songList = [];
            axios
              .get("api" + this.GLOBAL.allPlaylistURL(this.user.uid))
              .then((response) => {
                console.log(response);
                console.log(response.data.playlist);
                for (const item of response.data.playlist) {
                  this.songList.push({
                    id: item.id,
                    imgSrc: item.coverImgUrl,
                    listName: item.name,
                    trackCount: item.trackCount,
                    link: `myMusic/playList?id=${item.id}`,
                  });
                }
                console.log(this.songList);
              });
            break;
          case "mplayList":
            await this.status();
            this.getPlayList(to.query.id);
            break;
          case "logout":
            await axios.get("api" + this.GLOBAL.LOGOUT_URL).then((response) => {
              console.log(response);
              this.$router.push("/");
              this.user = {};
              localStorage.clear("authorization");
              console.log("退出登录成功！");
            });
            break;
        }
      },
    },
  },
  methods: {
    // 搜索
    searchKeywords(keywords) {
      this.$router.push(`/search?keywords=${keywords}`);
      axios.get("api" + this.GLOBAL.searchURL(keywords)).then(
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
              album: item.album.artist.img1v1Url,
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
          console.log("请求登录：", response);
          if (response.data.code == 200) {
            isLogin = true;
            this.status();
            this.clickMask();
          }
        });
      return isLogin;
    },
    // 音乐列表切换歌单
    cutSongList(currentMusicList, currentIndex) {
      console.log("音乐列表切换歌单", currentMusicList, currentIndex);

      this.currentMusicList = currentMusicList;
      this.currentIndex = currentIndex;

      this.currentMusic = this.currentMusicList[this.currentIndex];
      this.updateLyric();
    },
    // 控制栏切换歌曲
    cutSong(currentIndex) {
      console.log("控制栏切换歌曲", currentIndex);
      this.currentIndex = currentIndex;

      this.currentMusic = this.currentMusicList[this.currentIndex];
      this.updateLyric();
    },
    // 点击登录注册
    isDisplayLoginRegster() {
      console.log("点击登录注册");
      this.$router.push("/login");
    },
    // 点击蒙版，返回上一级
    clickMask() {
      console.log("点击蒙版，返回上一级");
      this.$router.go(-1);
    },
    // 判断登录状态
    async status() {
      let allCookies = document.cookie;
      console.log(allCookies);

      await axios.post("api" + this.GLOBAL.REFRESH_STATUS_URL).then(
        async (response) => {
          console.log("刷新状态成功", response);

          await axios.post("api" + this.GLOBAL.STATUS_URL).then(
            (response) => {
              console.log("判断登录状态：", response);
              if (response.data.data.account && response.data.data.profile) {
                this.user.avatar = response.data.data.profile.avatarUrl;
                this.user.name = response.data.data.profile.nickname;
                this.user.uid = response.data.data.profile.userId;

                console.log("用户已登录，uid", this.user.uid);
                localStorage.setItem("authorization", true);
              } else {
                this.user = {};
                localStorage.clear("authorization");
                console.log("用户未登录");
              }
            },
            (error) => {
              console.log(error);
            }
          );
        },
        (error) => {
          console.log("刷新状态失败", error);
        }
      );
    },
    // 更新歌词
    updateLyric() {
      let item = this.currentMusicList[this.currentIndex];
      axios.get(`api/lyric?id=${item.id}`).then(
        (response) => {
          this.$set(this.currentMusic, "lyric", response.data.lrc.lyric);
        },
        (error) => {
          console.error(error);
        }
      );
    },
    // 更新MusicList
    getPlayList(id) {
      axios.get("api" + this.GLOBAL.allSongURL(id)).then((response) => {
        this.musicList = [];
        for (const item of response.data.songs) {
          this.musicList.push({
            id: item.id,
            name: item.name,
            singer: item.ar,
            duration: item.dt,
            src: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
            album: item.al.picUrl,
          });
        }
      });
    },
  },
  created() {
    this.status();
  },
  // 获取audio
  mounted() {
    this.audio = this.$refs.audio;

    axios.get("api" + this.GLOBAL.Banner_URL).then(
      (response) => {
        console.log(response.data.banners);
        this.bannerList = response.data.banners;
      },
      (error) => {
        console.log(error);
      }
    );
  },
};
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

  #app::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: -1;
  }

  #app::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: inherit;
    background-size: cover;
    filter: blur(100px);
    z-index: -2;
  }

  #app {
    width: 100%;
    height: 100%;
    position: relative;
    background-size: 0 !important;

    > div.content {
      z-index: 1;
      width: 80%;
      height: calc(100% - 250px);
      min-width: 1000px;
      margin: 50px auto;
      display: flex;
      justify-content: space-between;

      > .contentLeft {
        display: flex;
        flex-direction: column;
      }

      > .contentRight {
        display: flex;
        align-items: center;
        flex-direction: column;
        min-width: 400px;
        width: 40%;

        > .recordplayer {
          width: 200px;
          flex-shrink: 0;
        }
      }

      > div:nth-child(1) {
        width: 60%;
        float: left;
      }
    }
  }
}
</style>
