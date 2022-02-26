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
    <div ref="baseLine" @click.stop="jumpBar">
      <div ref="line">
        <div @mousedown.stop="moveBar" ref="bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    audio: {
      // type: Object,
      default() {
        console.error("请传入audio对象！");
        return {};
      },
    },
    currentMusic: {
      type: Object,
      default() {
        let currentMusic = {
          name: "未播放",
          singer: [{ id: 1, name: "未播放" }],
          currentTime: 0,
          duration: 0,
        };
        console.error("传入currentMusic对象！", currentMusic);
        return currentMusic;
      },
    },
  },
  data() {
    return {
      currentTime: 0,
    };
  },
  watch: {
    audio(newVal) {
      console.log(newVal);
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
    // 移动进度条点
    moveBar(e) {
      console.log(e);
      let bar = this.$refs.bar;
      let line = this.$refs.line;
      let baseLine = this.$refs.baseLine;
      let isUp = false;
      let width = parseInt(getComputedStyle(baseLine, null)["width"]);
      let left = baseLine.offsetLeft + 10;
      // console.log(left);
      // console.log(width);
      // console.log(e.pageX);

      this.audio.removeEventListener("timeupdate", this.timeupdate);

      window.onmousemove = function (event) {
        if (isUp) {
          return;
        }
        // console.log("现在位置：", left, event.clientX, event.pageX);
        if (event.pageX - left >= 0 && event.pageX - left <= width) {
          // console.log(event.clientX, e.clientX);
          bar.style.left = line.style.width = event.pageX - left + 7 + "px";
        }
      };

      window.onmouseup = () => {
        console.log("鼠标抬起！");

        this.audio.addEventListener("timeupdate", this.timeupdate);
        this.audio.currentTime =
          (parseInt(getComputedStyle(line, null)["width"]) /
            parseInt(getComputedStyle(baseLine, null)["width"])) *
          (this.currentMusic.duration / 1000);

        isUp = true;
        window.onmousemove = null;
        window.onmouseup = null;
      };
    },
    // 点击进度条
    jumpBar(e) {
      let bar = this.$refs.bar;
      let line = this.$refs.line;
      let baseLine = this.$refs.baseLine;
      let left = baseLine.offsetParent.offsetLeft;
      bar.style.left = e.pageX - left - baseLine.offsetLeft - 2 + "px";
      line.style.width = e.pageX - left - baseLine.offsetLeft + 2 + "px";
      console.log(e.offsetLeft);
      console.log(baseLine.offsetParent.offsetLeft);
      console.log(
        "跳转百分比：",
        (parseInt(getComputedStyle(line, null)["width"] - 10) /
          parseInt(getComputedStyle(baseLine, null)["width"])) *
          (this.currentMusic.duration / 1000)
      );
      this.audio.currentTime =
        ((parseInt(getComputedStyle(line, null)["width"]) - 10) /
          parseInt(getComputedStyle(baseLine, null)["width"])) *
        (this.currentMusic.duration / 1000);
    },
    timeupdate() {
      this.currentTime = this.audio.currentTime;
      let width = parseInt(
        getComputedStyle(this.$refs.baseLine, null)["width"]
      );
      this.$refs.bar.style.left =
        (this.currentTime / (this.currentMusic.duration / 1000)) * width +
        4 +
        "px";
      this.$refs.line.style.width =
        (this.currentTime / (this.currentMusic.duration / 1000)) * width +
        6 +
        "px";
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
  > div:nth-child(2) {
    background: rgba(255, 255, 255, 0.7);
    height: 5px;
    cursor: pointer;
    border-radius: 2px;
    position: relative;
    margin-top: 10px;

    > div {
      display: inline-block;
      border-radius: 2px;
      height: 100%;
      background: rgba(255, 255, 255, 1);
      position: absolute;

      div {
        width: 10px;
        height: 10px;
        background: rgb(255, 255, 255);
        border-radius: 50%;
        position: absolute;
        top: -2.7px;
        cursor: pointer;
      }
    }
  }
}
</style>