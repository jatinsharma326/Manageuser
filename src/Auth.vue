<template>
  <div class="container" id="container">
    <div class="form-container sign-in-container">
      <form action="#">
        <h1>
          Sign In
        </h1>
        <div class="social-container">
          <a href="#" class="social"> <i class="fab fa-facebook-f"></i></a>
          <a href="#" class="social"> <i class="fab fa-google-plus-g"></i></a>
          <a href="#" class="social">
            <i class="fab fa-linkedin-in"></i>
          </a>
          
        </div>
        <span>or use your account</span>
        <input v-model="email" type="text" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />

        <button class="animatebutton" @click="loginUser">Sign In</button>
      </form>
    </div>
    <div class="overlay-container">
      <div class="overlay">
        <div class="overlay-panel overlay-right">
          <h6>Hover Here</h6>
        <img class="letsanimate" @mouseover="letsanimate" src="./assets/sign-in-4.svg" alt="login.png" />
        </div>
      </div>
    </div>
  </div>


  <!-- The Real one 
<div>
    <v-card class="halfcard">
     
        <div class="auth-input-wrappers">
        <h1 class="centerlogin form-title">LOGIN</h1>
        <v-text-field
         label="email"
         type="email"
         v-model="email"
          ></v-text-field>
        <v-text-field
         label="password"
         type="password"
         v-model="password"
          >Password</v-text-field>
        <div v-show="showError" class="error-container">
          {{ errorText }}
        </div>
        <button class="mr-4 nodecbutton" @click="loginUser">
          <img src="./assets/button.svg" alt="./assets/login.png"
          style="height:60px"
          >
        </button>
        </div>
        <v-overlay :value="loaderDialog" :z-index="100">
          <v-progress-circular
            color="primary"
            indeterminate
            size="64"
          ></v-progress-circular
        ></v-overlay>
     
    </v-card>
    <v-overlay :value="loaderDialog" :z-index="100">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
</div>
-->
</template>
<script>
import { required, email } from "vuelidate/lib/validators";
import { mapActions } from "vuex";
import packageJson from "../package.json";
import gsap from 'gsap';
export default {
  name: "Auth",
  component: {},
  created() {
    console.log("Version", packageJson.version);
  },
  mounted() {},
  data() {
    return {
      showError: false,
      errorText: false,
      email: "",
      password: "",
      loaderDialog: false,
      textfields: [
        { id: 1, name: "email", type: "email" },
        { id: 2, name: "password", type: "password" },
      ],
      info: null,
    };
  },
  methods: {
    ...mapActions(["login"]),

    async loginUser() {
      this.showError = false;
      this.$v.$touch();
      if (this.$v.$invalid) {
        if (this.$v.email.$invalid) {
          this.errorText = "Please enter a valid email";
        } else if (this.$v.password.$invalid) {
          this.errorText = "Please enter a password";
        }
        this.showError = true;
      } else {
        // make login api call here
        this.loaderDialog = true;
        let result = await this.login({
          username: this.email,
          password: this.password,
        });
        if (!result.ok) {
          this.showError = true;
          this.errorText = "Invalid email or password";
        } else {
          this.$emit("startSession", {});
        }
        this.loaderDialog = false;
      }
    },
    letsanimate(){
       gsap.from(".letsanimate",{
      x:200,
      duration:2
    })
    gsap.to(".letsanimate",{
      x:0,
      duration:2
    })
    }
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
   
  },
 
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,800");
* {
  box-sizing: border-box;
}
body {
  background: #f6f5f7;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Montserrat", sans-serif;
  height: 100vh;
  margin: -20px 0 50px;
}

h1 {
  font-weight: bold;
  margin: 0;
}

h2 {
  text-align: center;
}

p {
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}

span {
  font-size: 12px;
}
a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}
button {
  border-radius: 20px;
  border: 1px solid #ff4b2b;
  background-color: #ff4b2b;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition:width 2s height 2s transform 2s
}
button:active {
  transform: scale(0.95);
   transform:translateY(-1px);
}
button:focus {
  outline: none;
}
button.ghost {
  background-color: transparent;
  border-color: #ffffff;
}
button:hover{
  transform:translateY(-3px);
  box-shadow:0 10px 20px rgba(0,0,0,0.2)
}
/* button::after{
  content:"";
  display:inline-block;
  height:100%;
  width:100%;
  border-radius:100px;
  position:absolute;
  top:0;
  left:0;
  z-index:-1;
  transition:all .4s;

}
@keyframes moveInBottom{
 0%{
   opacity: 0;
   transform:translateY(30px);
 }
 100%{
   opacity:1;
   transform:translateY(0px);
 }
} */
form {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

input {
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
}

.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 48px;
  height:500px;
  margin-top:10%;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}
.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}
.container .right-panel-active .sign-in-container {
  transform: translateX(100%);
}
/* .sign-up-container{
    left:0;
    width:50%;
    opacity:0;
    z-index:1;
  }
  .container .right-panel-active .sign-up-container{
    transform:translateX(100%);
    opacity:1;
    z-index:5;
    animation:show 0.6s;
  } */

/* @keyframes show{
  0%,49.99%{
    opacity:0;
    z-index:1;
  }
  50%,100%{
    opacity:1;
    z-index:5;
     
  }
} */
overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}
.container .right-panel-active .overlay-container {
  transform: translate(-100%);
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}
.container .right-panel-active .overlay-container {
  transform: translateX(-100%);
}
.overlay {
  background: #e7e95f;
  background: -webkit-linear-gradient(to right, #edff9b, #848f21);
  background: linear-gradient(to right, #7fd7fa, #0796cf);
  background-repeat: no-repeat;
  background-size: cover;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}
.container .right-panel-active .overlay {
  transform: translateX(50%);
}
.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}
.overlay-left {
  transform: translateX(-20%);
}
.container .right-panel-active .overlay-left {
  transform: translateX(0);
}
.overlay-right {
  right: 0;
  transform: translateX(0);
}
.container .right-panel-active .overlay-right {
  transform: translateX(20%);
}
.overlay-right {
  right: 0;
  transform: translateX(0);
}
.container .right-panel-active .overlay-right {
  transform: translateX(20%);
}
.social-container {
  margin: 20px 0;
}
.social-container a {
  border: 1px solid #dddddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}

</style>
