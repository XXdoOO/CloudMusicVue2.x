<template>
  <div class="baseLine" @click="jumpDot" :style="baseStyle" ref="baseLine">
    <div
      class="line"
      :style="{ ...{ width: lineWidth + 'px' }, ...lineStyle }"
    ></div>
    <div
      class="dot"
      @mousedown.stop="moveDot"
      @click.stop=""
      ref="dot"
      :style="{ ...{ left: dotLeft + 'px' }, ...dotStyle }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "Volume",
  props: {
    down: { type: Function, default() {} },
    move: { type: Function, default() {} },
    up: { type: Function, default() {} },
    jump: { type: Function, default() {} },
    baseStyle: Object,
    lineStyle: Object,
    dotStyle: Object,
  },
  data() {
    return {
      dotLeft: null,
      lineWidth: 0,
      baseLineWidth: null,
      dotRadius: null,
    };
  },
  methods: {
    // 获取元素相对于窗口横坐标
    getLeft(e) {
      var offset = e.offsetLeft;
      if (e.offsetParent != null) offset += this.getLeft(e.offsetParent);
      return offset;
    },
    // 获取元素相对于窗口纵坐标
    getTop(e) {
      var offset = e.offsetTop;
      if (e.offsetParent != null) offset += this.getTop(e.offsetParent);
      return offset;
    },
    // 移动进度条点
    moveDot(e) {
      this.down(e.layerX);
      let isUp = false;
      let baseLine = this.$refs.baseLine;
      let start = this.getLeft(baseLine);
      let end = start + this.baseLineWidth;
      // console.log("开始位置：", start);
      // console.log("结束位置：", end);

      window.onmousemove = (event) => {
        if (isUp) {
          return;
        }
        this.move();
        if (event.clientX >= start && event.clientX <= end) {
          this.lineWidth = event.clientX - start + this.dotRadius;
          this.dotLeft = event.clientX - start - this.dotRadius;
        }
      };

      onmouseup = () => {
        this.up();

        isUp = true;
        onmousemove = null;
        onmouseup = null;
      };
    },
    // 点击进度条
    jumpDot(e) {
      this.dotLeft = e.layerX - this.dotRadius;
      this.lineWidth = e.layerX + this.dotRadius;

      console.log("跳转百分比：", e.layerX / this.baseLineWidth);
      this.jump(this.dotLeft / this.baseLineWidth);
    },
  },
  mounted() {
    let dot = this.$refs.dot;
    let baseLine = this.$refs.baseLine;

    this.baseLineWidth = baseLine.offsetWidth;
    this.dotRadius = dot.offsetHeight / 2;
    this.dotLeft = -1 * this.dotRadius;
  },
};
</script>

<style lang="less" scoped>
div.baseLine {
  background: rgba(255, 255, 255, 0.7);
  width: 100px;
  cursor: pointer;
  border-radius: 2px;
  position: relative;
  height: 5px;
  // transform: rotate(-90deg);
  display: flex;
  align-items: center;

  > div.line {
    border-radius: 2px;
    height: 100%;
    background: white;
    position: absolute;
  }

  > div.dot {
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
    position: absolute;
    cursor: pointer;
  }
}
</style>