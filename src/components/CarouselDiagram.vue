<template>
  <div class="container">
    <!-- 左右箭头 -->
    <img src="./images/arrow.png" alt="" class="leftArrow" @click="prev" />

    <!-- 轮播图层 -->
    <div
      class="imgBox"
      ref="imgBox"
      @mouseover="clearActive"
      @mouseout="actionActive"
      :style="{ left: imgtranslate, width: `${1000}%` }"
    >
      <slot class="img"> </slot>
    </div>

    <img src="./images/arrow.png" alt="" class="rightArrow" @click="next" />

    <div class="controlDot">
      <ul>
        <li
          v-for="(item, index) in imgPage"
          :key="index"
          class="li"
          :class="{ liActive: isActive === index + 1 }"
          @click="isActive = index + 1"
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
    // 分页数量
    imgPage: {
      type: Number,
      default: 1,
    },

    //轮播间隔时间，毫秒
    time: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      // 当前轮播图的页数
      isActive: 1,

      //轮播函数的赋值
      timer: "",

      //轮播图移动的距离
      imgtranslate: "0",
    };
  },
  methods: {
    next() {
      if (this.isActive === this.imgPage) {
        this.isActive = 1;
      } else {
        this.isActive++;
      }
    },
    prev() {
      if (this.isActive === 1) {
        this.isActive = this.imgPage;
      } else {
        this.isActive--;
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
      this.timer = setInterval(() => {
        this.next();
      }, this.time);
    },
  },
  watch: {
    //轮播图的移动函数
    isActive(newVal) {
      console.log(newVal);
      this.imgtranslate = -1 * (newVal - 1) * 100 + "%";
    },
  },
  created() {
    this.actionActive();
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.container {
  position: relative;
  margin: 0 auto;
  overflow: hidden;
  flex-shrink: 0;
  width: 100%;
  height: 100%;

  //小箭头
  > img {
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
    position: absolute;
    left: 0;
    top: 0;
    transition: 0.6s;
    height: 100%;
    display: flex;
    justify-items: start;

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