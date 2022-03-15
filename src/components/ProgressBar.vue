<template>
  <div id="base">
    <div>
      <span>
        <a href="" :title="currentMusic.name">{{ currentMusic.name }}</a>
        /
        <a
          href=""
          v-for="s in currentMusic.singer"
          :key="s.id"
          :title="'@' + s.name"
          >{{ "@" + s.name }}</a
        ></span
      >
      <span>{{ currentTime2 }} / {{ duration2 }}</span>
    </div>
    <Volume
      :baseStyle="{ width: '100%' }"
      :percentage="percentage"
      :down="down"
      :up="up"
      :jump="jump"
    />
  </div>
</template>

<script>
import Volume from "./Volume.vue";

export default {
  name: "ProgressBar",
  components: { Volume },
  props: {
    audio: {
      require: true,
    },
    currentMusic: {
      type: Object,
      require: true,
      default() {
        let currentMusic = {
          name: "未播放",
          singer: [{ id: 1, name: "未播放" }],
          currentTime: 0,
          duration: 0,
        };
        return currentMusic;
      },
    },
  },
  data() {
    return {
      currentTime: 0,
      percentage: 0,
    };
  },
  watch: {
    audio(newVal) {
      console.log("ProgressBar接收到音频DOM:", newVal);
      newVal.addEventListener("timeupdate", this.timeupdate);
    },
  },
  computed: {
    duration2() {
      let seconds = parseInt(this.currentMusic.duration / 1000);
      let minutes = parseInt(seconds / 60)
        .toString()
        .padStart(2, "0");
      seconds = (seconds % 60).toString().padStart(2, "0");

      return `${minutes}:${seconds}`;
    },
    currentTime2() {
      let minutes = parseInt(this.currentTime / 60)
        .toString()
        .padStart(2, "0");
      let seconds = parseInt(this.currentTime % 60)
        .toString()
        .padStart(2, "0");

      return `${minutes}:${seconds}`;
    },
  },
  methods: {
    down() {
      this.audio.removeEventListener("timeupdate", this.timeupdate);
    },
    up(percentage) {
      this.audio.addEventListener("timeupdate", this.timeupdate);
      this.percentage = percentage;

      this.audio.currentTime = percentage * this.currentMusic.duration / 1000;
    },
    jump(percentage) {
      this.percentage = percentage;
      this.audio.currentTime = percentage * this.currentMusic.duration / 1000;
    },
    timeupdate() {
      this.currentTime = this.audio.currentTime;
      console.log("sssss");
      this.percentage = this.currentTime / (this.currentMusic.duration / 1000);
    },
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  user-select: none;
}

div#base {
  height: 40px;
  width: 100%;
  padding: 10px;

  > div:nth-child(1) {
    width: 100%;

    > span {
      display: inline-block;
      color: white;
      opacity: 0.8;
    }

    > span:nth-child(1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: calc(100% - 130px);

      > a {
        color: white;
        text-decoration: none;
      }

      > a:hover {
        text-decoration: underline;
      }
    }

    > span:nth-child(2) {
      float: right;
      width: 100px;
    }
  }
}
</style>