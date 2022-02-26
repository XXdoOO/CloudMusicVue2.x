<template>
  <div id="base">
    <i @click="previousMusic()"></i>
    <i @click="playMusic()" :class="playClass2"></i>
    <i @click="nextMusic(mode)"></i>
  </div>
</template>

<script>
export default {
  name: "ControlBar",
  props: {
    mode: {
      type: String,
      default() {
        console.warn("请传入mode字符串！可选：'order','random','cycle'");
        return "order";
      },
    },
    audio: {
      // type: Object,
      default() {
        console.error("请传入audio对象！");
        return {};
      },
    },
    currentMusicList: {
      type: Array,
      default() {
        let currentMusicList = [
          { name: "", singer: "", duration: 0, lyric: "" },
          { name: "", singer: "", duration: 0, lyric: "" },
        ];
        console.error(
          "请传入currentMusicList当前播放的歌曲所在的对象数组！",
          currentMusicList
        );
        return currentMusicList;
      },
    },
    currentIndex: {
      type: Number,
      default() {
        console.error("请传入currentIndex当前播放的歌曲下标");
        return 0;
      },
    },
  },
  data() {
    return {
      currentIndex2: 0,
      playClass2: "",
      playHistory2: [],
    };
  },
  watch: {
    audio(newVal) {
      // 监听音乐播放暂停
      newVal.addEventListener("play", () => {
        this.playClass2 = "playClass";
      });
      newVal.addEventListener("pause", () => {
        this.playClass2 = "";
      });

      newVal.addEventListener("canplay", () => {
        this.playHistory2.push(this.audio.src);
      });

      newVal.addEventListener("ended", () => {
        this.nextMusic(this.mode);
      });
    },
    currentIndex2(newVal) {
      this.currentIndex2 = newVal;
    },
  },
  methods: {
    // 播放/暂停
    playMusic() {
      if (this.audio.src) {
        if (this.audio.paused) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      } else {
        alert("请选择播放的歌曲！");
      }
    },
    // 上一曲
    previousMusic() {
      if (this.audio.src) {
        console.log(this.playHistory2);

        if (this.playHistory2.length > 1) {
          this.playHistory2.pop();
          this.audio.src = this.playHistory2[this.playHistory2.length - 1].src;
        } else {
          this.audio.src = this.playHistory2[0].src;
        }

        // 改变当前播放歌曲下标
        for (const index in this.currentMusicList) {
          if (
            this.playHistory2[this.playHistory2.length - 1] ==
            this.currentMusicList[index]
          ) {
            this.currentIndex2 = index;
            break;
          }
        }
      } else {
        alert("请选择播放的歌曲！");
      }
    },
    // 下一曲
    nextMusic(mode) {
      if (this.audio.src) {
        // 判断是否为歌单最后一曲
        let index = 0;
        if (this.audio.src !== this.currentMusicList[this.currentMusicList.length - 1]) {
          // 顺序播放
          if (mode === "order") {
            console.log(this.currentIndex2);
            index = this.currentIndex2 + 1;
          } else if (mode === "random") {
            // 随机播放
            index = Math.floor(Math.random() * (this.currentMusicList.length - 1));
            console.log(`当前随机歌曲下标:${index}`);
          } else if (mode === "cycle") {
            // 单曲循环
            index = this.currentIndex2;
          }
        }
        this.audio.src = this.currentMusicList[index].src;
        this.currentIndex2 = index;
      } else {
        alert("请选择播放的歌曲！");
      }
    },
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  color: white;
  user-select: none;
}

div#base {
  display: flex;
  width: 120px;
  height: 40px;
  background: transparent;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  i {
    cursor: pointer;
    opacity: 0.7;
  }

  i:hover {
    opacity: 1;
  }

  i:nth-child(1) {
    background: url(../assets/images/player.png) 0 -30px;
    width: 19px;
    height: 20px;
    display: inline-block;
  }

  i:nth-child(2) {
    background: url(../assets/images/player.png) 0 0;
    width: 21px;
    height: 29px;
    display: inline-block;
  }

  i.playClass {
    background: url(../assets/images/player.png) -30px 0;
  }

  i:nth-child(3) {
    background: url(../assets/images/player.png) 0 -52px;
    width: 19px;
    height: 20px;
    display: inline-block;
  }
}
</style>