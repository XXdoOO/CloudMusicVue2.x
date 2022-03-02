<template>
  <div id="app">
    <audio autoplay ref="audio"></audio>
    <router-view
      name="LoginRegister"
      :requestLogin="requestLogin"
      :clickMask="clickMask"
    ></router-view>

    <Header :imgSrc="imgSrc" :searchKeywords="searchKeywords" src="/login" />

    <div class="content">
      <router-view
        name="MusicList"
        :audio="audio"
        :musicList="musicList"
        :cutSong="cutSong"
      ></router-view>

      <router-view name="PlayList2" :songList="songList"> </router-view>

      <div class="contentRight">
        <AlbumCover :audio="audio" :src="currentMusic.album"/>
        <Lyric :audio="audio" :lyric="currentMusic.lyric"></Lyric>
      </div>
    </div>

    <Footer
      :audio="audio"
      :currentIndex="currentIndex"
      :currentMusicList="currentMusicList"
      :uid="uid"
      :cutSong="cutSong2"
    />
  </div>
</template>

<script>
import axios from "axios";
import Lyric from "./components/Lyric.vue";
import Header from "./components/pages/Header.vue";
import Footer from "./components/pages/Footer.vue";
import AlbumCover from "./components/AlbumCover.vue";

axios.defaults.withCredentials = true;

export default {
  name: "App",
  components: {
    Lyric,
    Header,
    Footer,
    AlbumCover,
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
        singer: [{ name: "未播放" }],
        duration: 0,
        lyric: "未播放歌曲",
      },

      // 头像图片
      imgSrc: "",
      uid: null,
      songList: [],
    };
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler: function (to, from) {
        // console.log(to, from);

        let name = to.name;
        let path = to.fullPath.split("/")[1];
        console.log(path, name);

        this.status();

        switch (name) {
          case "top":
            console.log("发送top请求");
            break;
          case "myMusic":
            // 获取用户全部歌单
            console.log("获取用户全部歌单", this.uid);
            this.songList = [];
            axios
              .get("api" + this.GLOBAL.allPlaylistURL(this.uid))
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
            console.log(to, from);
            axios
              .get("api" + this.GLOBAL.allSongURL(to.query.id))
              .then((response) => {
                console.log(response);
                this.musicList = [];
                console.log(response.data.songs);
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
            break;
          case "logout":
            axios.get("api" + this.GLOBAL.LOGOUT_URL).then((response) => {
              console.log(response);
              this.$router.push("/");
              this.status();
              alert("退出登录成功！");
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
            this.imgSrc = response.data.profile.avatarUrl;
            isLogin = true;
            this.uid = response.data.account.id;
            localStorage.setItem("authorization", true);
            this.clickMask();
          }
        });
      return isLogin;
    },
    // 音乐列表切歌
    cutSong(currentMusicList, currentIndex) {
      console.log(currentMusicList, currentIndex);

      this.currentMusicList = currentMusicList;
      this.currentIndex = currentIndex;

      let item = this.currentMusicList[this.currentIndex];
      this.currentMusic = item;

      this.updateLyric();
    },
    // 控制栏切歌
    cutSong2(currentIndex) {
      this.currentIndex = currentIndex;
      this.updateLyric();
    },
    // 点击登录注册
    isDisplayLoginRegster() {
      console.log("点击登录注册");
      this.$router.push("/login");
    },
    // 点击蒙版
    clickMask() {
      console.log("点击蒙版，返回上一级");
      this.$router.go(-1);
    },
    // 判断登录状态
    async status() {
      await axios.post("api" + this.GLOBAL.STATUS_URL).then((response) => {
        console.log("判断登录状态：", response);
        if (response.data.data.account && response.data.data.profile) {
          this.imgSrc = response.data.data.profile.avatarUrl;
          this.uid = response.data.data.profile.userId;

          console.log(this.uid);
          localStorage.setItem("authorization", true);
        } else {
          this.imgSrc = null;
          this.uid = null;
          localStorage.clear("authorization");
        }
      });
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
  },
  // 获取audio
  mounted() {
    this.audio = this.$refs.audio;
  },
};
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  background: black;
  margin: 0;
  padding: 0;

  #app {
    width: 100%;
    height: 100%;

    > div.mask {
      position: absolute;
    }

    > div.content {
      width: 80%;
      height: calc(100% - 270px);
      min-width: 1000px;
      background: black;
      margin: 50px auto;
      display: flex;
      justify-content: space-between;

      > .contentRight {
        display: flex;
        align-items: center;
        flex-direction: column;
        min-width: 400px;
        width: 40%;

        > .recordplayer{
          width: 200px;
          flex-shrink:0;
          margin-bottom: 10%;
        }
      }

      > div:nth-child(1) {
        width: calc(100% - 500px);
        height: 100%;
        float: left;
      }
    }
  }
}
</style>
