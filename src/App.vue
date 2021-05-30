<template>
  <v-app>
    <v-app-bar app>
      <v-btn to="/" text v-if="$route.path !== '/'">
        <span class="mr-2"
          ><v-icon dark>
            mdi-home
          </v-icon>
        </span>
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn
        v-if="!userDetails"
        text
        @click="dialogLoginForm.showDialog = !dialogLoginForm.showDialog"
      >
        <span class="mr-2">Login</span>
      </v-btn>
      <v-btn text @click="logout" v-if="userDetails">Logout</v-btn>

      <v-dialog v-model="dialogLoginForm.showDialog" max-width="40vw">
        <v-card elevation="2" shaped>
          <v-card-title>
            Login
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="dialogLoginForm.email" label="Username">
            </v-text-field>
            <v-text-field
              v-model="dialogLoginForm.password"
              label="Password"
              :type="dialogLoginForm.show ? 'text' : 'password'"
              @click:append="dialogLoginForm.show = !dialogLoginForm.show"
            >
            </v-text-field>
            <v-checkbox
              v-model="dialogLoginForm.checkbox"
              label="Login as teacher"
            ></v-checkbox>
          </v-card-text>
          <v-container grid-list-sm>
            <v-btn type="submit" @click="login">
              Login
            </v-btn>
          </v-container>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    dialogLoginForm: {
      showDialog: false,
      email: "",
      password: "",
      menu: false,
      show: false,
      checkbox: true,
    },
  }),
  computed: {
    userDetails() {
      return this.$store.getters.userDetails;
    },
  },
  methods: {
    login() {
      this.$store.dispatch("login", {
        username: this.dialogLoginForm.email,
        password: this.dialogLoginForm.password,
      });
      this.dialogLoginForm.showDialog = false;
    },
    logout() {
      this.$store.dispatch("logout");
    },
  },
  created() {
    this.$store.dispatch("getCoursesData");
    this.$store.dispatch("getClassroomsData");
    this.$store.dispatch("getUsersData");
    this.$store.dispatch("getUploadsData");
    this.$store.dispatch("getQuizezData");
    this.$store.dispatch("getDataFromLocalStorage");
  },
};
</script>
<style>
:root {
  --primary: #a25b03;
  --primary-low-opacity: #a25b036e;
  --background-light: #f6f4e7;
  --background-white: white;
  --light-text: #c4c2b4;
  --dark-text: #0d243e;
}
@font-face {
  font-family: "dancingscript";
  src: url("../src/assets/font-files/dancingscript/dancingscript-variablefont_wght-webfont.woff2")
      format("woff2"),
    url("../src/assets/font-files/dancingscript/dancingscript-variablefont_wght-webfont.woff")
      format("woff");
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: "eliseregular";
  src: url("../src/assets/font-files/eliseregular/elsie-regular-webfont.woff2")
      format("woff2"),
    url("../src/assets/font-files/eliseregular/elsie-regular-webfont.woff")
      format("woff");
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: "robotoregular";
  src: url("../src/assets/font-files/robotoregular/roboto-regular-webfont.woff2")
      format("woff2"),
    url("../src/assets/font-files/robotoregular/roboto-regular-webfont.woff")
      format("woff");
  font-weight: normal;
  font-style: normal;
}
.v-main__wrap {
  background-color: var(--background-light);
}
.v-app-bar {
  background-color: var(--primary) !important;
}
.v-app-bar .v-btn__content {
  color: var(--light-text) !important;
}
a {
  text-decoration: none;
}
.v-application--wrap {
  color: var(--dark-text);
}
.title-font {
  font-family: "dancingscript" !important;
}
.v-list-item__title,
.v-list-item__subtitle {
  white-space: pre-wrap !important;
}
.v-list-item__subtitle {
  line-height: 1.3;
  padding-top: 5px;
  color: var(--light-text);
}
</style>
