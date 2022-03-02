<template>
  <div class="recordplayer">
    <img
      class="bar"
      :class="{ active: baractive }"
      src="./images/playBar.png"
      alt="bar"
    />
    <div class="roundBox" :class="{ active: active, pause: pause }">
      <div class="roundRecord">
        <div class="roundImg">
          <img :src="src" alt="专辑" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AlbumCover",
  props: {
    audio: {
      require: true,
    },
    src: String,
  },
  data() {
    return {
      // bar动画类
      baractive: false,
      active: false,
      pause: false,
    };
  },

  watch: {
    audio(newVal) {
      console.log(newVal);
      newVal.addEventListener("pause", () => {
        console.log("音频暂停");
        this.baractive = false;
        this.pause = true;
      });
      newVal.addEventListener("play", () => {
        console.log("音频播放");
        this.baractive = true;
        this.active = true;
        this.pause = false;
      });
    },
  },
};
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

@keyframes myAnimate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

div.active {
  animation: myAnimate 30s linear;
  animation-iteration-count: infinite;
  animation-fill-mode: none;
}

div.pause {
  animation-play-state: paused;
}

// 长比：92*128 184 0.71875
// 宽比：256

.recordplayer {
  aspect-ratio: 0.8;
  width: 250px;
  overflow: hidden;
  position: relative;

  img.bar {
    position: absolute;
    left: 50%;
    transform: rotate(-30deg);
    transform-origin: 12px 12px;
    height: 39%;
    z-index: 666;
    transition: 1s;
  }
  .bar.active {
    transform: rotate(5deg);
  }

  .roundBox {
    position: absolute;
    width: 100%;
    height: 80%;
    background: rgb(204, 203, 203);
    border-radius: 50%;
    bottom: 0;

    .roundRecord {
      width: 90%;
      height: 90%;
      background: rgb(15, 15, 15);
      border-radius: 50%;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;

      .roundImg {
        width: 73%;
        height: 73%;
        border-radius: 50%;
        background: whitesmoke;
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        img {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>