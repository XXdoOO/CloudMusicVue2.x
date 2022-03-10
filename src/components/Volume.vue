<template>
  <div class="baseLine" @click.stop="jumpDot" :style="baseStyle" ref="baseLine">
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
    // 鼠标按下事件
    down: { type: Function, default() {} },

    // 鼠标移动事件
    move: { type: Function, default() {} },

    // 鼠标抬起事件
    up: { type: Function, default() {} },

    // 鼠标点击进度条事件
    jump: { type: Function, default() {} },
    baseStyle: Object,
    lineStyle: Object,
    dotStyle: Object,
  },
  data() {
    return {
      // 点距离左边的距离
      dotLeft: null,

      // 条
      lineWidth: 0,

      // 底条
      baseLineWidth: null,

      // 点半径
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
      // 鼠标是否抬起，鼠标抬起需解监鼠标移动事件，先监听鼠标按下事件再监听移动事件
      let isUp = false;

      // 记录原始位置
      let leftMove = e.pageX;

      // 右移能移动的距离
      let _right = this.baseLineWidth - this.lineWidth;

      // 左移能移动的距离
      let _left = this.lineWidth;

      console.log(leftMove, _right, _left);

      // 当前百分比
      let percentage = this.lineWidth / this.baseLineWidth;

      this.down(percentage);

      window.onmousemove = (event) => {
        if (isUp) {
          return;
        }

        // 更新右边能移动的距离
        _right = this.baseLineWidth - this.lineWidth;

        // 更新左边边能移动的距离
        _left = this.lineWidth;

        // console.log(
        //   leftMove > event.pageX ? "左移" : "右移",
        //   "移动距离：",
        //   event.pageX - leftMove
        // );

        // 瞬间移动距离
        let distance = event.pageX - leftMove;

        // 判断瞬间移动距离是否超出移动范围，超出则赋范围最大值
        if (distance > _right) {
          distance = _right;
        }
        if (distance * -1 > _left) {
          distance = -1 * _left;
        }

        console.log(distance, _right, _left);

        //右边有空间，且右移 || 左边有空间，且左移
        if ((_right > 0 && distance > 0) || (_left > 0 && distance < 0)) {
          this.dotLeft += distance;
          this.lineWidth += distance;

          percentage = this.lineWidth / this.baseLineWidth;
          console.log("移动百分比：", percentage);

          this.move(percentage);
        }

        // 更新原始位置
        leftMove = event.pageX;
      };

      onmouseup = () => {
        this.up(percentage);

        isUp = true;
        console.log("移动完毕百分比：", percentage);
        onmousemove = null;
        onmouseup = null;
      };
    },
    // 点击进度条
    jumpDot(e) {
      this.dotLeft = e.layerX - this.dotRadius;
      this.lineWidth = e.layerX;

      console.log(this.lineWidth);

      console.log("跳转百分比：", this.lineWidth / this.baseLineWidth);
      this.jump(this.dotLeft / this.baseLineWidth);
    },
  },
  // 获取点半径、底条的总长
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