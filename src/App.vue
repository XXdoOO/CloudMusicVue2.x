<template>
  <div id="app">
    <audio autoplay ref="audio"></audio>
    <router-view
      name="LoginRegister"
      :requestLogin="requestLogin"
      :clickMask="clickMask"
    ></router-view>

    <div class="header">
      <div class="logo">
        <a href="https://music.163.com"></a>
      </div>

      <ul class="option">
        <li :class="active[0]" @click.stop="activeClass(0)">
          <router-link to="/index">首页</router-link>
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
        :clickLoginRegister="isDisplayLoginRegster"
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

      <router-view name="currentMusicList2" :songList="songList"> </router-view>

      <Lyric :audio="audio" :lyric="currentMusic.lyric"></Lyric>
    </div>

    <Footer
      :audio="audio"
      :currentIndex="currentIndex"
      :isLike="isLike"
      :currentMusicList="currentMusicList"
      :switchCollect="switchCollect"
    />
  </div>
</template>

<script>
import axios from "axios";
import PersonalInfo from "./components/PersonalInfo.vue";
import SearchInput from "./components/SearchInput.vue";
import Lyric from "./components/Lyric.vue";
import Footer from "./components/pages/Footer.vue";

axios.defaults.withCredentials = true;

export default {
  name: "App",
  components: {
    PersonalInfo,
    SearchInput,
    Lyric,
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

      // 当前播放歌曲是否为用户喜欢的歌曲
      isLike: false,

      // 当前播放的歌曲信息
      currentMusic: {
        name: "未播放",
        singer: [{ name: "未播放" }],
        duration: 0,
        lyric: "未播放歌曲",
      },
      active: ["", "", ""],

      // 头像图片
      imgSrc: "",
      uid: null,
      songList: [],
    };
  },
  watch: {
    $route: {
      deep: true,
      handler: function (to, from) {
        console.log(to, from);
        let name = to.name;
        let path = to.fullPath.split("/")[1];
        console.log(path);

        if (path == "") {
          this.activeClass(0);
        } else if (path == "top") {
          this.activeClass(1);
        } else if (path == "myMusic") {
          this.activeClass(2);
        }

        switch (name) {
          case "top":
            console.log("发送top请求");
            break;
          case "myMusic":
            // 获取用户全部歌单
            console.log("获取用户全部歌单", this.uid);
            this.songList = [];
            axios
              .get(`api/user/currentMusicList?uid=${this.uid}`)
              .then((response) => {
                console.log(response);
                console.log(response.data.currentMusicList);
                for (const item of response.data.currentMusicList) {
                  this.songList.push({
                    id: item.id,
                    imgSrc: item.coverImgUrl,
                    listName: item.name,
                    trackCount: item.trackCount,
                    link: `myMusic/currentMusicList?id=${item.id}`,
                  });
                }
                console.log(this.songList);
              });
            break;
          case "mcurrentMusicList":
            console.log(to, from);
            axios
              .get(`api/currentMusicList/track/all?id=${to.query.id}`)
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
                  });
                }
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
          console.log("请求登录：", response);
          if (response.data.code == 200) {
            this.imgSrc = response.data.profile.avatarUrl;
            isLogin = true;
            this.uid = response.data.account.id;
            this.setLikeList();
            this.clickMask();
          }
        });
      return isLogin;
    },
    cutSong(currentMusicList, currentIndex) {
      // 切歌判断当前歌曲是否为用户喜欢的歌曲
      console.log(currentMusicList, currentIndex);
      this.isLike = this.isLikeSong(currentMusicList[currentIndex].id);

      this.currentMusicList = currentMusicList;
      this.currentIndex = currentIndex;

      let item = this.currentMusicList[this.currentIndex];
      this.currentMusic = item;
      
      axios.get(`api/lyric?id=${item.id}`).then(
        (response) => {
          this.$set(this.currentMusic, "lyric", response.data.lrc.lyric);
        },
        (error) => {
          console.error(error);
        }
      );
    },
    activeClass(index) {
      for (let i = 0; i < this.active.length; i++) {
        this.$set(this.active, i, "");
      }
      this.$set(this.active, index, "active");
    },
    // 获取我喜欢歌单
    async setLikeList() {
      console.log("获取我喜欢歌单");
      this.likeList = [];
      await axios.get(`api/likelist?uid=${this.uid}`).then(
        (response) => {
          console.log(response);
          this.likeList = response.data.ids;
        },
        (error) => {
          console.error(error);
        }
      );
    },
    // 收藏、取消收藏
    switchCollect(isLike, id) {
      console.log(isLike ? "取消喜欢" : "喜欢");
      this.isLike = !isLike;

      console.log(`api/like?like=${!isLike}&id=${id}`);

      axios.get(`api/like?like=${!isLike}&id=${id}`).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
    },
    // 判断用户是否喜欢了该歌曲
    isLikeSong(id) {
      for (const item of this.likeList) {
        if (item === id) {
          console.log("用户喜欢了当前歌曲");
          return true;
        }
      }
      console.log("用户没有喜欢当前歌曲");
      return false;
    },
    // 点击登录注册
    isDisplayLoginRegster() {
      console.log("点击登录注册");
      this.$router.push("/login");
    },
    // 点击蒙版
    clickMask() {
      console.log("点击蒙版");
      this.$router.push("/myMusic");
    },
  },
  async created() {
    // 判断登录状态
    await axios
      .get(`api/login/status?time=${Date.parse(new Date())}`)
      .then((response) => {
        console.log("判断登录状态：", response);
        if (response.data.data.account && response.data.data.profile) {
          this.imgSrc = response.data.data.profile.avatarUrl;
          this.uid = response.data.data.profile.userId;

          console.log(this.uid);
          this.setLikeList();
          localStorage.setItem("authorization", true);
        } else {
          localStorage.setItem("authorization", false);
        }
      });
  },
  mounted() {
    this.audio = this.$refs.audio;

    this.audio.addEventListener("ended", () => {
      console.log("切歌", this.currentMusicList);
      let item = this.currentMusicList[this.currentIndex];
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
      height: calc(100% - 270px);
      min-width: 1000px;
      background: black;
      margin: 50px auto;

      > div:nth-child(1) {
        width: calc(100% - 500px);
        height: 100%;
        float: left;
      }

      > div:last-child {
        float: right;
      }
    }
  }
}
</style>
