<template>
  <div id="app">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <audio autoplay ref="audio" controls></audio>
    <SearchInput :searchKeywords="searchKeywords" />
    <MusicList :audio="audio" :musicList="musicList" :cutSong="cutSong" />
    <ControlBar
      :audio="audio"
      :musicList="playList"
      :currentIndex="currentIndex"
      :cutSong="cutSong2"
    />
    <ProgressBar :audio="audio" :songInfo="songInfo" />
    <Lyric :audio="audio" :lyric="lyric" />
  </div>
</template>

<script>
import axios from "axios";
import SearchInput from "./components/SearchInput.vue";
import ControlBar from "./components/ControlBar.vue";
import MusicList from "./components/MusicList.vue";
import ProgressBar from "./components/ProgressBar.vue";
import Lyric from "./components/Lyric.vue";

export default {
  name: "App",
  components: {
    SearchInput,
    MusicList,
    ControlBar,
    ProgressBar,
    Lyric,
  },
  data() {
    return {
      musicList: [],
      playList: [],
      currentIndex: 0,
      audio: {},
      mode: "order",
      songInfo: {},
      lyric: "",
    };
  },
  methods: {
    searchKeywords(keywords) {
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

      axios.get(`api/api/song/media?id=${item.id}`).then(
        (response) => {
          this.lyric = response.data.lyric;
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
  },
  mounted() {
    this.audio = this.$refs.audio;
    this.audio.addEventListener("ended", () => {
      console.log("切歌", this.playList);
      let item = this.playList[this.currentIndex];
      this.songInfo = {
        name: item.name,
        singer: item.singer,
        duration: item.duration,
      };
    });
    axios.get("api/search/hot/detail").then(
      (response) => {
        console.log(response);
        for (const item of response.data.result.hots) {
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
};
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
}
html,
body {
  height: 100%;
  width: 100%;
  background: black;
  #app {
    > div:nth-child(3) {
      position: absolute;
      top: 100px;
    }

    > div:nth-child(4) {
      position: absolute;
      top: 650px;
    }

    > div:nth-child(5) {
      position: absolute;
      top: 650px;
      left: 200px;
    }

    > div:nth-child(6) {
      position: absolute;
      left: 850px;
    }
  }
}
</style>
