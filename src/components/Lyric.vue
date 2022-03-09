<template>
  <div id="base">
    <ul
      :style="{
        transform: `translateY(-${move}px)`,
        transition: 'transform 0.5s',
      }"
    >
      <li
        v-for="(ll, index) in lyricList"
        :key="index"
        :class="ll.color"
        ref="line"
      >
        {{ ll.lyric }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Lyric",
  props: {
    lyric: {
      type: String,
      default: "",
    },
    audio: {
      default() {
        console.error("请传入audio对象！");
        return {};
      },
    },
  },
  data() {
    return {
      lyricList: [{ lyric: "未播放歌曲" }],
      index: 0,
      move: "",
      count: 0,
      lineList: null,
    };
  },
  watch: {
    index(newVal) {
      this.move = 0;
      for (let i = 0; i <= newVal; i++) {
        this.move += this.lineList[i].clientHeight;
      }
      // console.log(this.move);
    },
    lyric(newVal) {
      // 初始化组件
      this.init();

      let lyricList = newVal.split("\n");

      // console.log("初始歌词：", lyricList);

      // 去掉空行和只有时间的行
      lyricList = lyricList.filter((item) => {
        if (item.trim() !== "" || item.split("]")[1] === "") {
          return item;
        }
      });

      // console.log("去掉空行和只有时间的行：", lyricList);

      // 判断传来的歌词是否完善
      // 为空
      if (lyricList.length === 0) {
        lyricList.push({ lyric: "该歌曲无歌词" });
        return false;
      } else {
        for (const item of lyricList) {
          let temp = item.split("]");
          let lyric;
          let time;

          if (temp.length === 1) {
            // 只有歌词
            lyric = "该歌曲歌词不支持自动滚动";
            break;
          } else {
            // 歌词完善
            lyric = temp[1];
            time = temp[0].split("[")[1];
            time = time.split(/\D/);
            time =
              parseFloat(time[0]) * 60 * 1000 +
              parseFloat(time[1]) * 1000 +
              parseFloat(time[2]);
          }

          this.lyricList.push({ time, lyric, color: "" });
        }
      }

      // console.log("最终歌词：", this.lyricList);

      // 监听当前音频播放
      this.audio.addEventListener("timeupdate", this.timeupdate);
    },
  },
  methods: {
    // 初始化
    init() {
      this.lyricList = [];
      this.index = 0;
      this.move = "";
      this.count = 0;
      this.lineList = this.$refs.line;

      this.audio.removeEventListener("timeupdate", this.timeupdate);
    },
    timeupdate() {
      let time = parseInt(this.audio.currentTime * 1000);

      for (const index in this.lyricList) {
        this.$set(this.lyricList[index], "color", "");
        if (time >= this.lyricList[index].time) {
          this.index = parseInt(index);
        }
      }

      this.$set(this.lyricList[this.index], "color", "lightGreen");
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
  width: 300px;
  height: 500px;
  background: transparent;
  overflow: hidden;
  position: relative;

  > ul {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 60%;

    > li {
      list-style: none;
      text-align: center;
      line-height: 50px;
      word-wrap: break-word;
    }

    > li.lightGreen {
      color: lightgreen;
      transition: transform 0.5s;
    }
  }
}
</style>