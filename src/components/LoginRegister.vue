<template>
  <div class="mask" @click="clickMask">
    <div class="content" @click.stop="">
      <div
        class="background"
        :class="background.class"
        :style="{ 'background-image': `url(${imgSrc})` }"
      ></div>

      <div class="login" :class="loginRegisterClass" :style="login.style">
        <h1>登录</h1>
        <form id="form_login">
          <input
            type="text"
            maxlength="11"
            placeholder="请输入账号"
            ref="changeLoginName"
            @input="changeLoginName(login.info.username)"
            v-model="login.info.username"
          />
          <p>&nbsp;{{ login.tip.tip }}</p>
          <input
            type="password"
            maxlength="15"
            placeholder="请输入密码"
            ref="changeLoginPwd"
            @input="changeLoginPwd(login.info.userpwd)"
            v-model="login.info.userpwd"
          />
          <p>&nbsp;{{ login.tip.tip2 }}</p>
          <button
            type="button"
            @click="clickLogin(login.username, login.userpwd)"
          >
            登录
          </button>
        </form>
        <a
          href="javascript:;"
          id="register_account"
          @click.prevent="switchRegister()"
          >注册账号</a
        >
        <span>{{ info }}</span>
      </div>

      <div class="register" :class="loginRegisterClass" :style="register.style">
        <h1>注册</h1>
        <form id="form_register">
          <input
            type="text"
            maxlength="10"
            placeholder="请输入管理员账号"
            ref="changeRegisterName"
            @input="changeRegisterName(register.info.username)"
            v-model="register.info.username"
          />
          <p>&nbsp;{{ register.tip.tip }}</p>
          <input
            type="password"
            maxlength="10"
            placeholder="请输入密码"
            ref="changeRegisterPwd"
            @input="changeRegisterPwd(register.info.userpwd)"
            v-model="register.info.userpwd"
          />
          <p>&nbsp;{{ register.tip.tip2 }}</p>
          <input
            type="password"
            maxlength="10"
            placeholder="请输入确认密码"
            ref="changeRegisterPwd2"
            @input="changeRegisterPwd2(register.info.userpwd2)"
            v-model="register.info.userpwd2"
          />
          <p>&nbsp;{{ register.tip.tip3 }}</p>
          <button
            type="button"
            @click="clickRegister(register.username, register.userpwd)"
          >
            注册
          </button>
        </form>
        <a href="javascript:;" @click.prevent="switchLogin">登录账号</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginRegister",
  props: {
    info: {
      type: String,
      default() {
        return "基于JSP+JavaBean+Servlet的怀化学院学生绩管理系统";
      },
    },
    imgSrc: String,
    requestLogin: {
      type: Function,
      default() {
        console.error(
          "请传入一个返回值为Boolean值的requestLogin(username, userpwd)函数来处理点击登录按钮事件！（true为登录成功）"
        );
      },
    },
    requestRegister: {
      type: Function,
      default() {
        console.error(
          "请传入一个返回值为Boolean值的requestRegister (username, userpwd)函数来处理点击注册按钮事件！（true为注册成功）"
        );
      },
    },
    clickMask: Function,
  },
  data() {
    return {
      background: {
        class: "backgroundGo",
      },
      login: {
        info: { username: "", userpwd: "" },
        tip: { tip: "", tip2: "" },
        style: {},
      },
      register: {
        info: { username: "", userpwd: "", userpwd2: "" },
        tip: { tip: "", tip2: "", tip3: "" },
        style: { "z-index": -1 },
      },
      loginRegisterClass: "come",
    };
  },
  methods: {
    // 切换到注册界面动画
    switchRegister() {
      this.loginRegisterClass = "go";
      this.background.class = "backgroundCome";
      setTimeout(() => {
        this.register.style = { "z-index": 1000 };
        this.login.style = { "z-index": 999 };
      }, 300);
    },
    // 切换到登录界面动画
    switchLogin() {
      this.loginRegisterClass = "come";
      this.background.class = "backgroundGo";
      setTimeout(() => {
        this.register.style = { "z-index": 999 };
        this.login.style = { "z-index": 1000 };
      }, 300);
    },
    // 监听登录框用户名
    changeLoginName(value) {
      console.log(value);
      if (!value) {
        this.login.tip.tip = "登录用户名不能为空!";
      } else {
        this.login.tip.tip = "";
      }
    },
    // 监听登录框密码
    changeLoginPwd(value) {
      console.log(value);
      if (!value) {
        this.login.tip.tip2 = "登录密码不能为空!";
      } else {
        this.login.tip.tip2 = "";
      }
    },
    // 监听注册框用户名
    changeRegisterName(value) {
      console.log(value);
      if (!value) {
        this.register.tip.tip = "注册用户名不能为空!";
      } else {
        this.register.tip.tip = "";
      }
    },
    // 监听注册框密码
    changeRegisterPwd(value) {
      console.log(value);
      if (!value) {
        this.register.tip.tip2 = "注册密码不能为空!";
      } else {
        this.register.tip.tip2 = "";
      }
      if (value !== this.register.info.userpwd2) {
        this.register.tip.tip3 = "密码与确认密码不一致!";
      } else {
        this.register.tip.tip3 = "";
      }
    },
    // 监听注册框确认密码
    changeRegisterPwd2(value) {
      console.log(value);
      if (!value) {
        this.register.tip.tip3 = "确认密码不能为空!";
      } else {
        this.register.tip.tip3 = "";
      }
      if (value !== this.register.info.userpwd) {
        this.register.tip.tip3 = "密码与确认密码不一致!";
      } else {
        this.register.tip.tip3 = "";
      }
    },
    // 点击登录按钮
    clickLogin() {
      console.log(this.login.info.username && this.login.info.userpwd);
      this.changeLoginName(this.login.info.username);
      this.changeLoginPwd(this.login.info.username);
      if (this.login.info.username && this.login.info.userpwd) {
        if (
          !this.requestLogin(this.login.info.username, this.login.info.userpwd)
        ) {
          this.login.tip.tip2 = "账号或密码错误!";
        }
      }
    },
    // 点击注册按钮
    clickRegister() {
      this.changeRegisterName(this.register.info.username);
      this.changeRegisterPwd(this.register.info.username);
      this.changeRegisterPwd2(this.register.info.username);
      if (
        this.register.info.username &&
        this.register.info.userpwd === this.register.info.userpwd2
      ) {
        if (
          !this.requestRegister(
            this.register.info.username,
            this.register.info.userpwd
          )
        ) {
          this.register.tip.tip3 = "用户已存在!";
        }
      }
    },
  },
};
</script>

<style lang="less" scope>
@keyframes switchover {
  from {
    background-position-x: 0;
    transform: translateX(0);
  }
  to {
    background-position-x: -475px;
    transform: translateX(100%);
  }
}

@keyframes switchover2 {
  from {
    background-position-x: -475px;
    transform: translateX(100%);
  }
  to {
    background-position-x: 0;
    transform: translateX(0);
  }
}

@keyframes switchover3 {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes switchover4 {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

* {
  user-select: none;
}

.backgroundCome {
  animation: switchover 1s forwards;
}

.backgroundGo {
  animation: switchover2 1s forwards;
}

.come {
  animation: switchover4 1s forwards;
}

.go {
  animation: switchover3 1s forwards;
}

div.mask {
  width: 100%;
  height: 100%;
  background: rgba(221, 221, 221, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  > .content {
    overflow: hidden;
    width: 1000px;
    height: 600px;
    box-sizing: border-box;
    border-radius: 0.9375rem;
    box-shadow: 0.3125rem 0.3125rem 0.625rem 0.3125rem #888888;
    position: relative;

    .background {
      width: 50%;
      height: 100%;
      float: left;
      position: relative;
      background-color: aliceblue;
      z-index: 1001;
    }

    .login,
    .register {
      position: absolute;
      right: 0;
      background-color: white;
      width: 50%;
      height: 100%;
      box-sizing: border-box;
      padding: 3.125rem 5rem;
      overflow: hidden;

      h1 {
        margin-bottom: 40px;
      }

      form {
        display: flex;
        flex-direction: column;

        input {
          padding: 10px;
          height: 1.25rem;
          font-size: 0.9375rem;
          border-radius: 0.4375rem;
          border: 1px solid powderblue;
          outline: none;
        }

        p {
          color: red;
          font-size: 0.875rem;
          display: block;
          margin-left: 0.3125rem;
        }

        button {
          padding: 10px;
          height: 40px;
          font-size: 15px;
          border-radius: 0.4375rem;
          border: 0;
          background-image: linear-gradient(45deg, #c2e59c, #64b3f4);
          outline: none;
          color: white;
        }
      }

      a {
        float: right;
        margin-top: 1.25rem;
      }

      span {
        font-size: 0.625rem;
        display: block;
        margin-top: 6.25rem;
        color: rgb(133, 133, 133);
        margin-left: 7px;
      }
    }
  }
}
</style>
