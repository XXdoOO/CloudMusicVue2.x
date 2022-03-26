<template>
  <div class="full" @click="clickMask">
    <div class="container" @click.stop="">
      <div class="qrCode" :class="{ show: qrCodeShow }">
        <div class="qrCodeBox">
          <img src="../images/qrCode.png" alt="" class="falseqrCode" />
          <img :src="qrCode" alt="" class="trueqrCode" />
          <div
            class="trueqrCode"
            :style="{
              background: `rgba(255, 255, 255, ${qrCodeMsg.overdue ? 0.7 : 0})`,
            }"
            @click="showQrCode"
          >
            <div class="qrCodeStatus"></div>
            <div
              :style="{
                'font-size': '10px',
                background: 'rgba(255,255,255,1)',
              }"
            >
              {{ qrCodeMsg.msg }}
            </div>
          </div>
        </div>

        <div class="text" @click="qrCodeActive">
          <span>二维码登录</span>
          <img src="../images/qrCodeArrow.png" class="qrCodeArrow" alt="" />
        </div>
      </div>
      <div class="form" :class="{ show: toggleLoginRegister }">
        <div class="rotateBox login">
          <h3 class="title">登录</h3>
          <form action="">
            <input
              type="text"
              placeholder="请输入账号"
              maxlength="18"
              minlength="3"
              class="loginUserName"
              v-model="loginmsg.username"
              @input="loginUsernameChange(loginmsg.username)"
            />
            <div class="formtip">{{ loginmsg.usernametip }}</div>
            <div class="captchaBox">
              <input
                :type="passwordHidden == true ? 'password' : 'text'"
                :placeholder="loginPasswordInput"
                class="loginPassWord"
                :class="{ loginGetCaptchaInput: smsToggle }"
                v-model="loginmsg.password"
              />
              <div
                class="passwordHidden"
                :style="{ display: smsToggle == true ? 'none' : 'block' }"
                @click="passwordHidden = !passwordHidden"
              >
                <img
                  src="../images/passwordHidden.png"
                  alt=""
                  v-show="passwordHidden"
                />
                <img
                  src="../images/passwordShow.png"
                  alt=""
                  v-show="!passwordHidden"
                />
              </div>

              <button
                type="button"
                class="getCaptcha loginGetCaptcha"
                :class="{ loginGetCaptchaInput: smsToggle }"
                @click="smsTimeCountDown(loginmsg)"
                :disabled="smsTime != 0"
              >
                {{ smsButtontext }}
              </button>
              <div class="formtip">{{ loginmsg.passwordtip }}</div>
            </div>
            <div class="toggleLoginButton" @click="toggleSms" ref="msgButton">
              {{ smsToggle == true ? "密码登录" : "短信登录" }}
            </div>
            <button type="button" class="loginButton" @click="login">
              登录
            </button>
          </form>
          <div class="toggleLRbutton" @click="toggleLR">没有账户？立即注册</div>
        </div>
        <div class="rotateBox register">
          <h3 class="title">注册</h3>
          <form action="">
            <input
              type="text"
              placeholder="请输入账号"
              class="loginUserName"
              v-model="registermsg.username"
              @input="registerUsernameChange(registermsg.username)"
            />
            <div class="formtip">{{ registermsg.usernametip }}</div>
            <div :style="{ position: 'relative' }">
              <input
                :type="passwordHidden == true ? 'password' : 'text'"
                placeholder="请输入你的密码"
                class="loginPassWord"
                v-model="registermsg.password1"
                @input="registerPassword1Change(registermsg.password1)"
              />
              <div
                class="passwordHidden"
                @click="passwordHidden = !passwordHidden"
              >
                <img
                  src="../images/passwordHidden.png"
                  alt=""
                  v-show="passwordHidden"
                />
                <img
                  src="../images/passwordShow.png"
                  alt=""
                  v-show="!passwordHidden"
                />
              </div>
              <div class="formtip">{{ registermsg.passwordtip1 }}</div>
            </div>

            <input
              :type="passwordHidden == true ? 'password' : 'text'"
              placeholder="确认密码"
              class="loginPassWord"
              v-model="registermsg.password2"
              @input="registerPassword2Change"
            />
            <div class="formtip">{{ registermsg.passwordtip2 }}</div>
            <div class="captchaBox">
              <input
                type="text"
                placeholder="输入验证码"
                class="registerCaptcha"
                v-model="registermsg.smsCode"
              />
              <button
                type="button"
                class="getCaptcha"
                @click="smsTimeCountDown"
                :disabled="smsTime != 0"
              >
                {{ smsButtontext }}
              </button>
            </div>
            <div class="formtip">{{ registermsg.smstip }}</div>
            <button type="button" class="loginButton" @click="register">
              注册
            </button>
          </form>
          <div class="toggleLRbutton" @click="toggleLR">已有账户？立即登录</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "LoginResigter",
  props: {
    clickMask: Function,
    requestLogin: Function,
    requestRegister: Function,
    sendCaptcha: Function,
    verifyCaptcha: Function,
    showQrCode: Function,

    // 二维码信息
    qrCodeMsg: {
      type: Object,
      default() {
        return { overdue: false, msg: "" };
      },
    },
  },
  data() {
    return {
      toggleLoginRegister: false,
      smsToggle: false,
      loginPasswordInput: "请输入你的密码",
      qrCodeShow: false,
      passwordHidden: true,

      // 二维码链接
      qrCode: null,
      //登录信息
      loginmsg: {
        username: "",
        password: "",
        usernametip: "",
        passwordtip: "",
        smsToggle: "",
      },
      //注册信息
      registermsg: {
        username: "",
        password1: "",
        password2: "",
        usernametip: "",
        passwordtip1: "",
        passwordtip2: "",
        smsCode: "",
        smstip: "",
      },
      //短信验证码倒计时
      smsButtontext: "获取验证码",
      smsTime: "",
      timer: "",
    };
  },
  methods: {
    //登录账户检测
    loginUsernameChange(newval) {
      console.log(newval);
      var isok1 = /^1[3456789]\d{9}$/.test(newval);
      var isok2 = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(newval);
      if (newval == "") {
        this.loginmsg.usernametip = "用户名不能为空";
        console.log(this.loginmsg.usernametip);
        return false;
      } else if (isok1 || isok2) {
        this.loginmsg.usernametip = "";
        return true;
      } else {
        this.loginmsg.usernametip = "手机号或者邮箱号格式错误";
        console.log("*手机号或者邮箱号错误");
        return false;
      }
    },
    //登录密码检测
    loginPasswordChange() {
      if (this.smsToggle == false) {
        if (this.loginmsg.password == "") {
          this.loginmsg.passwordtip = "密码不能为空";
          console.log("密码为空");
          return false;
        } else {
          this.loginmsg.passwordtip = "";
          return true;
        }
      } else {
        if (this.loginmsg.password == "") {
          this.loginmsg.passwordtip = "验证码为空";
          console.log("密码为空");
          return false;
        } else {
          this.loginmsg.passwordtip = "";
          return true;
        }
      }
    },
    //登录
    login() {
      var isok1 = this.loginUsernameChange(this.loginmsg.username);
      var isok2 = this.loginPasswordChange();
      if (isok1 && isok2) {
        this.loginmsg.smsToggle = this.smsToggle;

        // 验证码登录
        if (this.loginmsg.smsToggle) {
          this.verifyCaptcha(
            this.loginmsg.username,
            this.loginmsg.password
          ).then((response) => {
            console.log(response);
            if (response) {
              // 请求登录
              this.requestLogin(this.loginmsg).then((response) => {
                if (!response) {
                  this.loginmsg.passwordtip = "账号或密码错误！";
                }
              });
            } else {
              this.loginmsg.passwordtip = "验证码错误！";
            }
          });
        } else {
          // 请求登录
          this.requestLogin(this.loginmsg).then((response) => {
            if (!response) {
              this.loginmsg.passwordtip = "账号或密码错误！";
            }
          });
        }
      }
    },
    //注册用户名验证
    registerUsernameChange(newval) {
      console.log(newval);
      var isok1 = /^1[3456789]\d{9}$/.test(newval);
      var isok2 = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(newval);
      if (newval == "") {
        this.registermsg.usernametip = "用户名不能为空";
        console.log(this.registermsg.usernametip);
        return false;
      } else if (isok1 || isok2) {
        this.registermsg.usernametip = "";
        console.log("");
        return true;
      } else {
        this.registermsg.usernametip = "手机号或者邮箱号错误";
        console.log("手机号或者邮箱号错误");
        return false;
      }
    },
    //注册密码检测
    registerPassword1Change(newval) {
      console.log(newval);
      var isok = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{6,18}$/.test(
        newval
      );
      if (newval === "") {
        this.registermsg.passwordtip1 = "密码不能为空";
        return false;
      } else if (isok) {
        this.registermsg.passwordtip1 = "";
        if (this.registermsg.password2 != "") {
          if (this.registermsg.password1 == this.registermsg.password2)
            this.registermsg.passwordtip2 = "";
          else {
            this.registermsg.passwordtip2 = "密码不一致";
          }
        } else {
          this.registermsg.passwordtip2 = "";
        }
        return true;
      } else {
        this.registermsg.passwordtip1 = "密码不小于6位的数字加字母";
        return false;
      }
    },
    //注册密码二次检测
    registerPassword2Change() {
      if (this.registerPassword1Change(this.registermsg.password1)) {
        if (this.registermsg.password2 != this.registermsg.password1) {
          this.registermsg.passwordtip2 = "密码不一致";
          return false;
        } else {
          this.registermsg.passwordtip2 = "";
          return true;
        }
      } else {
        this.registermsg.passwordtip2 = "密码不一致";
        return false;
      }
    },
    //注册验证码验证
    registerCodeChange(newval) {
      if (this.registermsg.smsCode == "") {
        this.registermsg.smstip = "验证码为空";
        return false;
      } else if (this.registermsg.smsCode != newval) {
        this.registermsg.smstip = "验证码不正确";
        return false;
      } else {
        this.registermsg.smstip = "";
        return true;
      }
    },
    //注册
    register() {
      if (
        this.registerUsernameChange(this.registermsg.username) &&
        this.registerPassword1Change(this.registermsg.password1) &&
        this.registerPassword2Change(this.registermsg.password2)
      ) {
        this.verifyCaptcha(
          this.registermsg.username,
          this.registermsg.smsCode
        ).then((response) => {
          if (response) {
            this.requestRegister(this.registermsg).then((response) => {
              if (!response) {
                this.registermsg.smstip = "账号已注册！";
              }
            });
          } else {
            this.registermsg.passwordtip = "验证码错误！";
          }
        });
      }
    },
    //验证码发送倒计时
    smsTimeCountDown() {
      this.sendCaptcha(this.loginmsg.username);

      var loginORregister;
      var loginORregistertip;
      if (this.toggleLoginRegister == false) {
        loginORregister = this.loginUsernameChange(this.loginmsg.username);
      } else {
        loginORregister = this.registerUsernameChange(
          this.registermsg.username
        );
        loginORregistertip = this.registermsg.smstip;
      }
      loginORregistertip == "123";
      if (loginORregister == true) {
        this.smsTime = 60;
        this.smsButtontext = this.smsTime + "s";
        this.timer = setInterval(() => {
          if (this.smsTime > 0) {
            this.smsTime--;
            this.smsButtontext = this.smsTime + "s";
          } else {
            this.smsTime = 0;
            this.smsButtontext = "获取验证码";
            clearInterval(this.timer);
            console.log(this);
          }
        }, 1000);
        this.loginmsg.passwordtip = "";
        this.registermsg.smstip = "";
      } else {
        if (this.toggleLoginRegister == false) {
          this.loginmsg.passwordtip = "用户名不完整";
        } else {
          this.registermsg.smstip = "用户名不完整";
        }
      }
    },
    //切换登录注册函数
    toggleLR() {
      this.toggleLoginRegister = !this.toggleLoginRegister;
      this.passwordHidden = true;
      console.log(this.toggleLoginRegister);
      this.smsTime = 0;
      this.loginmsg.smsButtontext = "获取验证码";
      this.smsButtontext = "获取验证码";
      clearInterval(this.timer);
    },
    //短信登录切换函数
    toggleSms() {
      this.passwordHidden = false;
      this.smsToggle = !this.smsToggle;
      console.log(this.smsToggle);
      this.loginPasswordInput =
        this.smsToggle == true ? "输入验证码" : "请输入你的密码";
    },
    //二维码切换
    qrCodeActive() {
      this.qrCodeShow = !this.qrCodeShow;
      if (this.qrCodeShow) {
        this.showQrCode().then((response) => {
          this.qrCode = response;
        });
        console.log(this.qrCode);
      }
    },
  },
  component: {},
};
</script>
    
<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
}
.full {
  width: 100%;
  height: 100vh;
  background: #1718187e;
  // pointer-events: none;
  z-index: 999;
  position: absolute;

  .container {
    position: relative;
    top: 50%;
    left: 50%;
    width: 440px;
    height: 450px;
    // background: salmon;
    display: flex;
    perspective: 800px;
    transform-origin: 50% 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    border-radius: 5px;

    // 二维码
    .qrCode {
      position: relative;
      left: 0%;
      width: 30%;
      height: 100%;
      background: aliceblue;
      transition: 1s;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      align-items: center;
      transform: rotateY(0deg);
      cursor: pointer;
      transition: 1s;
      z-index: 999;
      overflow: hidden;

      .qrCodeBox {
        position: relative;
        width: 60%;
        top: 10%;
        aspect-ratio: 1;
        left: 0%;
        top: 15%;
        perspective: 100px;
        transform-origin: 50% 50%;
        transform-style: preserve-3d;
        transform: rotate(0deg);
        transition: 1s;

        > img {
          position: absolute;
          width: 100%;
          transform: scale(1);
          transition: 1s;
        }
        .falseqrCode {
          transform: scale(1);
        }
        .trueqrCode {
          transform: scale(0);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .text {
        position: absolute;
        width: 100%;
        height: 20%;
        bottom: 0%;
        transition: 1s;

        span {
          // position: absolute;
          display: none;
          // width: 0%;
          text-align: center;
          overflow: hidden;
          // color: #158fc5;
          display: block;
          width: 100%;
          transform: scale(1);
          transition: 1s;
        }

        .qrCodeArrow {
          display: block;
          position: absolute;
          top: -15%;
          width: 40px;
          left: 0%;
          right: 0%;
          margin: 0 auto;
          margin-top: 30%;
          transition: 1s;
        }
      }
    }
    .qrCode:hover {
      span {
        color: #158fc5;
      }
    }
    .qrCode.show {
      left: 10%;
      width: 80%;
      height: 100%;
      border-radius: 5px;

      span {
        display: block;
        width: 100%;
        transform: scale(1.5);
      }

      .qrCodeArrow {
        margin-top: 10%;
        transform: rotate(180deg);
      }

      .qrCodeBox {
        .falseqrCode {
          transform: scale(0);
        }
        .trueqrCode {
          transform: scale(1);
          width: 100%;
          height: 100%;

          .qrCodeStatus {
            background: url(../images/refresh.jpg);
            background-size: cover;
            width: 15px;
            height: 15px;
            opacity: 1;
          }
        }
      }
    }
    .qrCode.show + .form {
      transform: rotateY(77.9deg);
      left: -70%;
    }

    //登录注册
    .form {
      position: relative;
      left: 0%;
      width: 80%;
      height: 100%;
      background: hsla(0, 0%, 100%, 1);
      transform-origin: 50% 50%;
      box-shadow: 0 2px 10px -5px rgb(9 2 4 / 80%);
      display: flex;
      align-items: center;
      justify-content: center;
      transform-style: preserve-3d;
      transition: all 1s ease;
      overflow: hidden;
      // flex-shrink: 0;
      // flex-shrink: 0;

      // 登录注册盒子
      .rotateBox {
        width: 100%;
        height: 100%;
        position: absolute;
        transition: 1s;
        background: hsla(0, 0%, 100%, 1);
        transform-style: preserve-3d;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
        // justify-content: space-evenly;

        // 登录注册标题
        .title {
          position: relative;
          text-align: center;
          margin-top: 1.7em;
          margin-bottom: 1.5em;

          font-size: 1.5em;
          font-weight: 700;
          color: #158fc5;
          // width: 200px;
        }

        form {
          display: flex;
          flex-direction: column;
          overflow: hidden;

          input {
            position: relative;
            width: 100%;
            display: block;
            width: 100%;
            box-sizing: border-box;
            border: none;
            border-bottom: 1px solid black;
            padding: 0.6em 0.2em;
            color: #313131;
            font-size: 1em;
            line-height: 1em;
            line-height: normal;
            height: 1em;
            box-sizing: content-box;
            background: none;
            outline: none;
          }
          input::placeholder {
            font-size: 0.9em;
          }
          // 登录提示
          .formtip {
            padding: 0.2em 0.2em;
            color: #313131;
            font-size: 0.8em;
            line-height: normal;
            height: 1em;
            box-sizing: content;
            color: red;
          }
          .passwordHidden {
            position: absolute;
            width: 20px;
            height: 20px;
            top: 10%;
            right: 0%;
            cursor: pointer;
            > img {
              position: absolute;
              width: 100%;
            }
          }
          // 登录密码与验证码
          .captchaBox {
            position: relative;
            width: 100%;

            // 获取验证码按钮
            .getCaptcha {
              position: absolute;
              width: 50%;
              height: 30px;
              top: 15%;
              right: 0%;
              padding: 0.5em 0.6em;
              box-sizing: border-box;
              font-size: 0.8em;
              text-align: center;
              border-radius: 24px;
              background: gainsboro;
              cursor: pointer;
              transition: 1s;
              border: none;
            }
            .getCaptcha[disabled] {
              background: gainsboro;
              opacity: 1;
              color: #158fc5;
              // background: red;
            }
          }
          // 短信登录切换按钮
          .toggleLoginButton {
            width: 30%;
            padding: 0.5em 0.1em;
            box-sizing: border-box;
            margin-top: 0.7em;
            margin-bottom: 1.1em;
            font-size: 0.85em;
            color: #158fc5;
            cursor: pointer;
          }
          // 登录按钮
          .loginButton {
            position: relative;
            width: 100%;
            margin: 1.5rem auto;
            height: 40px;
            border-radius: 20px;
            border: none;
            background: #158fc5;
            color: hsla(0, 0%, 100%, 1);
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            outline: none;
          }
        }
      }
      .login {
        top: 0%;
        .loginPassWord.loginGetCaptchaInput {
          width: 40%;
        }
        .getCaptcha {
          display: none;
        }
        .getCaptcha.loginGetCaptchaInput {
          display: block;
        }
      }
      .register {
        top: -100%;
        // transform: rotateY(180deg);

        form {
          .registerCaptcha {
            width: 40%;
          }
        }
      }
    }
    .form.show {
      .login {
        top: -100%;
      }
      .register {
        top: 0%;
      }
    }
    // 登录注册切换按钮
    .toggleLRbutton {
      position: relative;
      cursor: pointer;
      text-align: center;
      transition: 0.3s;
      letter-spacing: 1px;
    }
    .toggleLRbutton::after {
      content: "";
      position: absolute;
      left: 0%;
      top: 100%;
      width: 0%;
      border-top: 1px solid #158fc5;
      transition: 0.2s;
    }
    .toggleLRbutton:hover {
      color: #158fc5;
    }
    .toggleLRbutton:hover::after {
      color: #158fc5;
      width: 100%;
    }
    .logoTip {
      position: absolute;
      left: 100%;
      width: 20%;
      height: 100%;
      background: rgb(90, 89, 89);
      transform: rotatey(72.6deg);
      transform-origin: 100%;
      transition: 1s;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      // flex-shrink: 0;

      img {
        position: relative;
        width: 90%;
        top: 10%;
      }

      .logoTipSpan {
        position: absolute;
        height: 20%;
        bottom: 0%;

        span {
          display: block;
          color: whitesmoke;
        }
      }
    }
  }
}
</style>
