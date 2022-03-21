<template>
  <div class="footer">
    <div class="footerIn">
      <div class="bars">
        <ControlBar
          :audio="audio"
          :currentMusicList="currentMusicList"
          :currentIndex="currentIndex2"
          :mode="mode.name"
          :cutSong="cutSong2"
        ></ControlBar>

        <ProgressBar
          :audio="audio"
          :currentMusic="currentMusicList[currentIndex2]"
        ></ProgressBar>
      </div>

      <div class="icons">
        <Icon
          :customStyles="{
            ...{
              background: `url(${ICON}) 0 -205px`,
              width: '26px',
              height: '25px',
            },
            ...mode.style,
          }"
          :title="mode.title"
          @click.native.stop="switchMode"
        />

        <Icon
          v-show="!isLike"
          :customStyles="{
            background: `url(${ICON}) 0 -96px`,
            width: '23px',
            height: '21px',
          }"
          title="收藏"
          @click.native.stop="
            switchCollect(isLike, currentMusicList[currentIndex2].id)
          "
        />

        <Icon
          v-show="isLike"
          :customStyles="{
            background: `url(${ICON}) -30px -96px`,
            width: '23px',
            height: '21px',
          }"
          title="取消收藏"
          @click.native.stop="
            switchCollect(isLike, currentMusicList[currentIndex2].id)
          "
        />

        <Icon
          title="下载"
          :customStyles="{
            background: `url(${ICON}) 0 -120px`,
            width: '22px',
            height: '21px',
          }"
          @click.native.stop="download"
        />
        <Icon
          title="评论"
          :customStyles="{
            background: `url(${ICON}) 0 -399px`,
            width: '24px',
            height: '24px',
          }"
        />
      </div>

      <div class="volume">
        <Volume :percentage="percentage" :audio="audio" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Icon from "../Icon.vue";
import ControlBar from "../ControlBar.vue";
import ProgressBar from "../ProgressBar.vue";
import Volume from "../Volume.vue";

export default {
  name: "Footer",
  components: {
    Icon,
    ControlBar,
    ProgressBar,
    Volume,
  },
  props: {
    // audio DOM元素
    audio: {
      require: true,
    },
    // 当前播放的音乐列表
    currentMusicList: {
      type: Array,
      require: true,
      default() {
        return [];
      },
    },
    // 当前播放的音乐下标
    currentIndex: {
      type: Number,
      require: true,
    },
    // 切歌
    cutSong: Function,
    // 用户uid
    uid: Number,
    // 用户是否喜欢了该歌曲
    // isLike: Boolean,
  },
  data() {
    return {
      // 图标图片
      ICON: require("../../assets/images/player.png"),
      // 播放模式
      mode: {
        name: "order",
        style: {},
        title: "顺序播放",
      },
      // 当前播放歌曲下标，初始值为父组件给定
      currentIndex2: null,

      // 当前播放歌曲是否为用户喜欢的歌曲
      isLike: false,
      
      // 我喜欢歌单
      likeList: [],
      percentage: 0.5,
    };
  },
  watch: {
    // 播放的歌曲改变
    currentIndex(newVal) {
      this.currentIndex2 = newVal;
      console.log(
        "播放的歌单发生改变",
        this.currentMusicList[this.currentIndex]
      );
      this.isLike = this.isLikeSong(
        this.currentMusicList[this.currentIndex].id
      );
    },
    // 监听uid
    uid() {
      // 初始化我喜欢歌单
      this.setLikeList();
    },
  },
  methods: {
    // 切换模式
    switchMode() {
      console.log(this.mode.name);
      switch (this.mode.name) {
        case "random":
          this.mode.name = "order";
          this.mode.title = "顺序播放";
          this.mode.style = {
            "background-position": "0 -260px",
            width: "23px",
            height: "20px",
          };
          break;
        case "cycle":
          this.mode.name = "random";
          this.mode.title = "随机播放";
          this.mode.style = {
            "background-position": "0 -74px",
            width: "25px",
            height: "19px",
          };
          break;
        default:
          this.mode.name = "cycle";
          this.mode.title = "单曲循环";
          this.mode.style = { "background-position": "0 -232px" };
          break;
      }
    },
    // 下载歌曲
    download() {
      let currentMusic = this.currentMusicList[this.currentIndex2];
      console.log(currentMusic);
      if (currentMusic) {
        axios({
          method: "get",
          url: "api" + this.GLOBAL.downloadURL(currentMusic.id),
          responseType: "blob",
        }).then((res) => {
          console.log(res);
          // 将lob对象转换为域名结合式的url
          let blobUrl = window.URL.createObjectURL(res.data);
          let link = document.createElement("a");
          document.body.appendChild(link);
          link.style.display = "none";
          link.href = blobUrl;
          // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
          link.download = `${currentMusic.name}.mp3`;
          // 自触发click事件
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        });
      }
    },
    // 判断用户是否喜欢了该歌曲
    isLikeSong(id) {
      console.log("判断用户是否喜欢了该歌曲");
      for (const item of this.likeList) {
        if (item === id) {
          console.log("用户喜欢了当前歌曲");
          return true;
        }
      }
      console.log("用户没有喜欢当前歌曲");
      return false;
    },
    // 收藏、取消收藏
    switchCollect(isLike, id) {
      console.log(isLike ? "取消喜欢" : "喜欢");
      alert(isLike ? "取消喜欢?" : "喜欢?");
      this.isLike = !isLike;

      axios.get(`api/like?like=${!isLike}&id=${id}`).then(
        (response) => {
          console.log(response);

          // 更新我喜欢歌单
          this.setLikeList();
        },
        (error) => {
          console.error(error);
        }
      );
    },
    // 设置我喜欢歌单
    async setLikeList() {
      if (!this.uid) {
        return;
      }
      this.likeList = [];
      await axios
        .get(`api/likelist?uid=${this.uid}&time=${new Date().getTime()}`)
        .then(
          (response) => {
            console.log("获取我喜欢歌单", response);
            this.likeList = response.data.ids;
          },
          (error) => {
            console.error(error);
          }
        );
    },
    // 切歌
    cutSong2(currentIndex) {
      this.currentIndex2 = currentIndex;
      this.cutSong(this.currentIndex2);
    },
  },
};
</script>

<style lang="less" scoped>
div.footer {
  position: fixed;
  width: 100%;
  min-height: 80px;
  bottom: 0px;
  // border-top: slategray 1px solid;

  > div.footerIn {
    height: 100%;
    width: 80%;
    min-width: 1000px;
    margin: 0 auto;
    min-width: 1000px;
    display: flex;
    justify-content: space-between;

    > div.bars {
      width: 60%;
      min-width: 600px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;

      > div:last-child {
        width: calc(100% - 160px) !important;
      }
    }

    > div.icons {
      width: calc(40% - 200px);
      display: flex;
      align-items: center;
      justify-content: space-between;

      > div {
        display: inline-block;
        min-width: 50px;
      }
    }

    > div.volume {
      display: flex;
      align-items: center;
    }
  }
}
</style>