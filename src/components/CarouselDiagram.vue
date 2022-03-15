<template>
  <div
    class="container"
    :style="{ width: `${containerW / imgPage}px`, height: `${containerH}px` }"
  >
    <!-- 左右箭头 -->
    <img src="./images/arrow.png" alt="" class="leftArrow" @click="prev" />
    <img src="./images/arrow.png" alt="" class="rightArrow" @click="next" />
    <!-- 轮播图层 -->
    <div
      class="imgBox"
      ref="imgBox"
      @mouseover="clearActive"
      @mouseout="actionActive"
      :style="{ left: imgtranslate }"
    >
      <slot class="img"> </slot>
    </div>
    <div class="controlDot">
      <ul>
        <li
          v-for="(item, index) in imgPage"
          :key="index"
          class="li"
          :class="{ liActive: isActive === index }"
          @click="isActive = index"
          @mouseover="clearActive"
          @mouseout="actionActive"
        >
          <div class="dot"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "CarouselDiagram",
  props: {
    //还需要自定义容器contain的宽度
    // 分页数量
    imgPage: {
      type: Number,
      default: 1,
    },

    //轮播间隔时间
    time: {
      type: Number,
      default: 4000,
    },
  },
  data() {
    return {
      // 当前轮播图的页数
      isActive: 0,

      //轮播函数的赋值
      timer: "",

      //轮播图移动的距离
      imgtranslate: "0",
      containerW: 0,
      containerH: 0,
    };
  },
  methods: {
    next() {
      if (this.isActive < this.imgPage - 1) {
        this.isActive++;
      } else if (this.isActive >= this.imgPage - 1) {
        this.isActive = 0;
      }
    },
    prev() {
      if (this.isActive > 0) {
        this.isActive--;
      } else if (this.isActive === 0) {
        this.isActive = this.imgPage - 1;
      }
    },
    //定时切换函数
    timeActive() {
      console.log("定时函数");
      if (this.isActive >= this.imgPage - 1) {
        this.isActive = 0;
      } else {
        this.isActive++;
      }
    },
    //清除定时切换函数
    clearActive() {
      console.log("清除定时函数");
      clearInterval(this.timer);
    },
    //执行定时切换函数
    actionActive() {
      console.log("执行定时切换函数");
      this.timer = setInterval(this.timeActive, this.time);
    },
  },
  watch: {
    //轮播图的移动函数
    isActive(newVal) {
      this.imgtranslate = -newVal * 100 + "%";
    },
  },
  created() {
    this.timer = null;
    this.timer = setInterval(this.timeActive, this.time);
  },
  mounted() {
    //获取容器container的高宽，
    this.containerW = this.$refs.imgBox.offsetWidth;
    this.containerH = this.$refs.imgBox.offsetHeight;
    console.log(this.$refs.imgBox.clientWidth);
    console.log(this.$refs.imgBox.clientHeight);
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.container {
  background: chocolate;
  position: relative;
  margin: 0 auto;
  overflow: hidden;
  flex-shrink: 0;

  //小箭头
  img {
    position: absolute;
    height: 10%;
    min-height: 20px;
    max-height: 40px;
    cursor: pointer;
    z-index: 99;
    top: 0%;
    bottom: 0%;
    margin: auto 0;
    padding-right: 2px;
  }
  .leftArrow {
    transform: rotate(180deg);
  }
  .rightArrow {
    right: 0%;
  }
  //中间内容层
  .imgBox {
    // border: 2px black solid;
    position: absolute;
    transition: 0.6s;

    div {
      height: 100%;
      cursor: pointer;
    }
  }
  //小圆点
  .controlDot {
    position: absolute;
    width: 100%;
    height: 20px;
    bottom: 0%;
    ul {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      li {
        margin: 0 4px 0 4px;
        list-style: none;
        width: 10px;
        height: 10px;
        background: rgb(182, 172, 172);
        opacity: 0.8;
        border-radius: 50%;
        transition: 0.4s;
        cursor: pointer;
      }
      .li:hover {
        opacity: 1;
      }
      .liActive {
        width: 13px;
        height: 13px;
        opacity: 1;
      }
    }
  }
}
</style>