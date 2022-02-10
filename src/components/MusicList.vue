<template>
  <div id="base">
    <ul>
      <li>
        <div>
          <i v-show="selectedAll2" @click.stop="selectedAllMusic"></i>
          <i v-show="!selectedAll2" @click.stop="selectedAllMusic"></i>
        </div>
        <div>序号</div>
        <div>歌曲</div>
        <div>歌手</div>
        <div>时长</div>
      </li>
    </ul>
    <ul>
      <li
        v-for="(ml, index) in musicList2"
        :key="ml.id"
        @dblclick.capture="playMusic(index)"
        :class="ml.liClass"
      >
        <div>
          <i v-show="ml.selected" @click.stop="selectedMusic(index)"></i>
          <i v-show="!ml.selected" @click.stop="selectedMusic(index)"></i>
        </div>
        <div :class="ml.numberClass">{{ index + 1 }}</div>
        <div>
          <div>{{ ml.name }}</div>
          <div class="listMenu">
            <i
              title="播放"
              @click.stop="playMusic(index)"
              :class="ml.playClass"
              @dblclick.stop=""
            ></i>
            <i title="添加到歌单" @dblclick.stop=""></i>
            <i title="下载到本地" @dblclick.stop=""></i>
            <i title="分享此歌曲" @dblclick.stop=""></i>
          </div>
        </div>
        <div>{{ ml.singer }}</div>
        <div class="duration" title="从此歌单中删除">{{ ml.duration }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MusicList",
  props: {
    audio: {
      // type: Object,
      default() {
        console.error("请传入audio对象！");
        return {};
      },
    },
    musicList: {
      type: Array,
      default() {
        let musicList = [
          { name: "", singer: "", duration: 0, lyric: "" },
          { name: "", singer: "", duration: 0, lyric: "" },
        ];
        console.error(
          "请传入musicList当前播放的歌曲所在的对象数组！",
          musicList
        );
        return musicList;
      },
    },
    cutSong: {
      type: Function,
      default() {
        console.error(
          "请传入cutSong(currentList, currentIndex)函数来接收当前播放歌单和歌曲下标!"
        );
      },
    },
  },
  data() {
    return {
      musicList2: [],
      selectedAll2: false,
      currentIndex2: -1,
    };
  },
  watch: {
    audio(newVal) {
      console.log(newVal);
      newVal.addEventListener("canplay", () => {
        this.inMusicList();
      });
    },
    musicList: {
      deep: true,
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        // 深复制musicList并初始化数据
        this.musicList2 = JSON.parse(JSON.stringify(newVal));
        for (const item of this.musicList2) {
          let minutes = parseInt(item.duration / 60)
            .toString()
            .padStart(2, "0");
          let seconds = parseInt(item.duration % 60)
            .toString()
            .padStart(2, "0");

          this.$set(item, "selected", false);
          this.$set(item, "playClass", "");
          this.$set(item, "numberClass", "");
          this.$set(item, "liClass", "");
          item.duration = `${minutes}:${seconds}`;
        }
      },
    },
  },
  methods: {
    playMusic(index) {
      if (!this.musicList2[index].liClass) {
        console.log("切歌", this.audio);
        this.currentIndex2 = index;
        this.cutSong(this.musicList, index);
        this.audio.src = this.musicList2[index].src;

        // 修改播放图标、序号
        for (let i = 0; i < this.musicList2.length; i++) {
          this.$set(this.musicList2[i], "playClass", "");
          this.$set(this.musicList2[i], "numberClass", "");
          this.$set(this.musicList2[i], "liClass", "");
        }

        this.$set(this.musicList2[index], "playClass", "playClass");
        this.$set(this.musicList2[index], "numberClass", "numberClass");
        this.$set(this.musicList2[index], "liClass", "liClass");
      } else {
        console.log("未切歌", this.audio.paused ? "播放" : "暂停");
        if (this.audio.paused) {
          console.log("音乐暂停->播放");
          this.audio.play();
          this.$set(this.musicList2[index], "playClass", "playClass");
          this.$set(this.musicList2[index], "numberClass", "numberClass");
        } else {
          console.log("音乐播放->暂停");
          this.audio.pause();
          this.$set(this.musicList2[index], "playClass", "");
          this.$set(this.musicList2[index], "numberClass", "");
        }
      }
    },
    selectedMusic(index) {
      this.$set(
        this.musicList2[index],
        "selected",
        !this.musicList2[index].selected
      );

      let count = 0;
      for (let item of this.musicList2) {
        if (item.selected) {
          count++;
        }
      }

      if (count === this.musicList2.length) {
        this.selectedAll = true;
      } else {
        this.selectedAll = false;
      }
    },
    selectedAllMusic() {
      let isSelectedAll = false;
      this.selectedAll = !this.selectedAll;
      if (this.selectedAll) {
        isSelectedAll = true;
      }
      for (const index in this.musicList) {
        this.$set(this.musicList2[index], "selected", isSelectedAll);
      }
    },
    inMusicList() {
      // 判断当前播放的歌曲是否在搜索结果里面
      // 修改播放图标、序号
      for (let i = 0; i < this.musicList2.length; i++) {
        this.$set(this.musicList2[i], "playClass", "");
        this.$set(this.musicList2[i], "numberClass", "");
        this.$set(this.musicList2[i], "liClass", "");
      }

      console.log(this.musicList2);

      for (const index in this.musicList2) {
        if (this.musicList2[index].src === this.audio.src) {
          console.log("当前播放的歌曲在这个列表里");

          if (this.audio.paused) {
            console.log("当前状态：pause");
            this.$set(this.musicList2[index], "liClass", "liClass");
            this.$set(this.musicList2[index], "playClass", "");
            this.$set(this.musicList2[index], "numberClass", "");
          } else {
            console.log("当前状态：play");
            this.$set(this.musicList2[index], "liClass", "liClass");
            this.$set(this.musicList2[index], "playClass", "playClass");
            this.$set(this.musicList2[index], "numberClass", "numberClass");
          }
          break;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
@fontSize: 14px;
@backgroundClor: transparent;

* {
  margin: 0;
  padding: 0;
  user-select: none;
  font-size: @fontSize;
}

::-webkit-scrollbar {
  border-radius: 5px;
  background-color: @backgroundClor;
  width: 5px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: silver;
}

div#base {
  width: 700px;
  height: 500px;
  background: @backgroundClor;
  position: relative;
  color: white;

  > ul {
    min-width: 600px;
    > li {
      height: calc(100% / 9);
      border-bottom: rgba(255, 255, 255, 0.7) 2px solid;
      box-sizing: border-box;
      list-style: none;
      display: flex;
      align-items: center;
      opacity: 0.7;
      div > {
        display: inline-block;
      }

      > div:nth-child(1) {
        width: 50px;
        text-align: center;

        i {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 1px solid #fff;
          opacity: 0.7;
        }

        i:nth-child(1) {
          background: url(../assets/images/icon_sprite.png) no-repeat -60px -80px;
        }
      }

      > div:nth-child(2) {
        width: 50px;
        text-align: center;
      }

      > div.numberClass {
        color: transparent;
        background: url(../assets/images/wave.gif) no-repeat 18px;
        opacity: 1;
      }

      > div:nth-child(3) {
        width: calc((100% - 125px) * 0.7);
        padding-left: 25px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        > div:nth-child(1) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        > div:nth-child(2) {
          min-width: 200px;
          float: right;
          display: flex;
          height: 100%;
          display: none;

          i {
            cursor: pointer;
            width: 36px;
            height: 36px;
            background: skyblue;
            display: inline-block;
            margin-left: 2%;
            align-items: center;
            background: url(../assets/images/icon_list_menu.png) no-repeat -120px
              0;
            opacity: 0.7;
          }

          i:hover {
            opacity: 1;
          }

          i.playClass {
            background-position: -80px -200px;
          }

          i:nth-child(2) {
            background-position: -120px -80px;
          }
          i:nth-child(3) {
            background-position: -120px -120px;
          }
          i:nth-child(4) {
            background-position: -120px -40px;
          }
        }
      }

      > div:nth-child(4) {
        width: calc((100% - 100px) * 0.15);
      }
    }
  }

  > ul:nth-child(1) {
    height: 10%;

    li {
      height: 100%;
    }
  }

  > ul:nth-child(2) {
    overflow: auto;
    height: 90%;

    li:hover div.listMenu {
      display: flex;
    }

    li:hover div.duration {
      color: transparent;
      background: url(../assets/images/icon_list_menu.png) no-repeat -120px -160px;
      width: 36px;
      height: 36px;
      cursor: pointer;
    }

    li.liClass {
      opacity: 1;
    }
  }
}
</style>