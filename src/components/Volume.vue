<template>
  <div class="volume">
    <Icon @click.native="switchMute(mute)" :customStyles="volumeStyle" />
    <Bar
      :up="up"
      :jump="up"
      :percentage="percentage"
      :baseStyle="{ width: '80%' }"
    />
  </div>
</template>

<script>
import Bar from "./Bar.vue";
import Icon from "./Icon.vue";
export default {
  name: "Volume",
  components: { Bar, Icon },
  props: {
    audio: {
      require: true,
    },
  },
  data() {
    return {
      percentage: 1,
      volumeStyle: {
        background: `url(${require("../assets/images/player.png")}) 0 -144px`,
        width: "26px",
        height: "21px",
      },
      mute: false,
    };
  },
  methods: {
    up(percentage) {
      this.audio.volume = percentage;
    },
    switchMute(mute) {
      this.mute = !mute;
      if (mute) {
        this.audio.muted = false;
        this.volumeStyle = {
          background: `url(${require("../assets/images/player.png")}) 0 -144px`,
          width: "26px",
          height: "21px",
        };
      } else {
        this.audio.muted = true;
        this.volumeStyle = {
          background: `url(${require("../assets/images/player.png")}) 0 -182px`,
          width: "26px",
          height: "21px",
        };
      }
    },
  },
};
</script>

<style lang="less" scoped>
div.volume {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 150px;
}
</style>