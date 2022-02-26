<template>
  <div class="footer">
    <div class="t"></div>
    <div class="bars">
      <ControlBar
        :audio="audio"
        :currentMusicList="currentMusicList"
        :currentIndex="currentIndex"
        :mode="mode.name"
        :cutSong="cutSong"
      ></ControlBar>

      <ProgressBar
        :audio="audio"
        :currentMusic="currentMusicList[currentIndex2]"
      ></ProgressBar>
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
        v-show="!isLike"
        :customStyles="{
          background: `url(${ICON}) 0 -96px`,
          width: '23px',
          height: '21px',
        }"
        title="收藏"
        @click.native.stop="switchCollect(isLike, playList[currentIndex].id)"
      />

      <Icon
        v-show="isLike"
        :customStyles="{
          background: `url(${ICON}) -30px -96px`,
          width: '23px',
          height: '21px',
        }"
        title="取消收藏"
        @click.native.stop="switchCollect(isLike, playList[currentIndex].id)"
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
  </div>
</template>

<script>
import Icon from "../Icon.vue";
import ControlBar from "../ControlBar.vue";
import ProgressBar from "../ProgressBar.vue";

export default {
  components: {
    Icon,
    ControlBar,
    ProgressBar,
  },
  props: {
    // audio DOM元素
    audio: null,
    // 当前歌曲是否为用户喜欢的歌曲
    isLike: Boolean,
    // 当前播放的音乐列表
    currentMusicList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 当前播放的音乐下标
    currentIndex: null,
    // 收藏 / 取消收藏
    switchCollect: {
      type: Function,
    },
  },
  data() {
    return {
      // 图标图片
      ICON: require("../../assets/images/player.png"),
      // 播放模式
      mode: {
        name: "order",
        style: {},
        title: "顺序播放",
      },
      // 当前播放歌曲下标
      currentIndex2: null,
    };
  },
  watch: {
    // 监听audio源变化
    audio(newVal) {
      newVal.addEventListener("canplay", () => {
        console.log(this.audio.src, this.currentMusicList);
        for (let i = 0; i < this.currentMusicList.length; i++) {
          if (this.currentMusicList[i].src === this.audio.src) {
            this.currentIndex2 = i;
            console.log(i);
            break;
          }
        }
      });
    },
  },
  methods: {
    // 切换模式
    switchMode() {
      console.log(this.mode.name);
      switch (this.mode.name) {
        case "random":
          this.mode.name = "order";
          this.mode.title = "顺序播放";
          this.mode.style = {
            "background-position": "0 -260px",
            width: "23px",
            height: "20px",
          };
          break;
        case "cycle":
          this.mode.name = "random";
          this.mode.title = "随机播放";
          this.mode.style = {
            "background-position": "0 -74px",
            width: "25px",
            height: "19px",
          };
          break;
        default:
          this.mode.name = "cycle";
          this.mode.title = "单曲循环";
          this.mode.style = { "background-position": "0 -232px" };
          break;
      }
    },
    // 切歌
    cutSong(currentIndex) {
      this.currentIndex = currentIndex;
    },
  },
};
</script>

<style lang="less" scoped>
.t {
  height: 0;
  width: 50px;
  border-bottom: 20px solid white;
  border-right: 20px solid transparent;
  border-left: 20px solid transparent;
  position: absolute;
}

div.footer {
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
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
      display: inline-block;
      width: 50px;
    }
  }
}
</style>