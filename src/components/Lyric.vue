<template>
  <div id="base">
    <ul
      :style="{
        transform: `translateY(-${move}px)`,
        transition: 'transform 0.5s',
      }"
    >
      <li v-for="(ll, index) in lyricList" :key="index" :class="ll.color">
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
      default() {
        let lyric = `[by:MerryLambLamb]
                     [00:04.136]
                     [00:14.752]把昨天都作废
                     [00:17.993]现在你在我眼前
                     [00:21.746]我想爱 请给我机会
                     [00:28.238]如果我错了也承担
                     [00:32.054]认定你就是答案
                     [00:36.919]我不怕谁嘲笑我极端
                     [00:41.887]相信自己的直觉
                     [00:45.766]顽固的人不喊累
                     [00:49.187]爱上你 我不撤退
                     [00:54.890]我说过 我不闪躲
                     [00:58.109]我非要这么做
                     [01:00.845]讲不听 也偏要爱
                     [01:03.501]更努力爱 让你明白
                     [01:08.763]没有别条路能走
                     [01:11.642]你决定 要不要陪我
                     [01:14.494]讲不听偏爱
                     [01:16.267]靠我感觉爱
                     [01:17.870]等你的依赖
                     [01:21.210]对你偏爱
                     [01:28.280]痛也很愉快
                     [01:36.856]把昨天都作废
                     [01:40.143]现在你在我眼前
                     [01:43.945]我想爱 请给我机会
                     [01:50.570]如果我错了也承担
                     [01:54.367]认定你就是答案
                     [01:59.245]我不怕谁嘲笑我极端
                     [02:04.220]相信自己的直觉
                     [02:08.024]顽固的人不喊累
                     [02:11.572]爱上你 我不撤退
                     [02:17.171]我说过 我不闪躲
                     [02:20.334]我非要这么做
                     [02:23.001]讲不听 也偏要爱
                     [02:25.655]更努力爱 让你明白
                     [02:30.942]没有别条路能走
                     [02:33.833]你决定 要不要陪我
                     [02:36.778]讲不听偏爱
                     [02:38.577]靠我感觉爱
                     [02:40.224]等你的依赖
                     [02:43.273]不后悔 有把握 我不闪躲
                     [02:47.773]我非要这么做
                     [02:50.354]讲不听 也偏要爱
                     [02:52.881]更努力爱 让你明白
                     [02:58.272]没有别条路能走
                     [03:01.159]你决定 要不要陪我
                     [03:04.177]讲不听偏爱
                     [03:05.850]靠我感觉爱
                     [03:07.649]等你的依赖
                     [03:10.977]对你偏爱
                     [03:18.024]痛也很愉快`;
        console.error("请传入lyricList字符串！", lyric);
        return "";
      },
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
      lyricList: [],
      index: 0,
      move: "",
    };
  },
  watch: {
    lyric(newVal) {
      let lyricList = newVal.split("\n");
      let lyricList2 = [];
      console.log(lyricList);
      lyricList = lyricList.filter((item) => {
        return item != "";
      });
      for (const item of lyricList) {
        let time = /\[(.*)\]/.exec(item)[1];
        time = time.split(/\D/);
        time =
          parseFloat(time[0]) * 60 * 1000 +
          parseFloat(time[1]) * 1000 +
          parseFloat(time[2]);
        let lyric = item.split("]")[1];
        // console.log(time);
        // console.log(lyric);
        if (lyric) {
          lyricList2.push({ time, lyric, color: "" });
        }
      }
      console.log(lyricList2);
      this.lyricList = lyricList2;
      this.index = 0;
      this.move = 0;
    },
    audio() {
      this.audio.addEventListener("timeupdate", () => {
        let time = parseInt(this.audio.currentTime * 1000);
        // console.log(time, this.lyricList[this.index].time);
        if (time >= this.lyricList[this.index].time) {
          for (const item of this.lyricList) {
            this.$set(item, "color", "");
          }
          this.$set(this.lyricList[this.index], "color", "lightGreen");
          this.index++;
          this.move = 45 * (this.index + 1);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@fontSize: 15px;

* {
  margin: 0;
  padding: 0;
  color: white;
  font-size: @fontSize;
  user-select: none;
}

div#base {
  width: 300px;
  height: calc(@fontSize * 30);
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
      line-height: calc(@fontSize * 3);
    }

    > li.lightGreen {
      color: lightgreen;
      font-size: 17px;
      transition: transform 0.5s;
    }
  }
}
</style>