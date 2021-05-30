<template>
  <v-container :style="bgImage" class="bg-image">
    <div class="box-container">
      <div class="box-item" @click="redirect('search')">
        <div class="title">Search / Upload</div>
        <div class="description">search or upload documents (private or public docs)</div>
      </div>
      <div class="box-item" @click="redirect('classroom')">
        <div class="title">Classrooms</div>
        <div class="description">talk about different topics with or without a teacher</div>
      </div>
      <div class="box-item" @click="redirect('courses')">
        <div class="title">Courses</div>
        <div class="description">take courses in order to develop your knowledge</div>
      </div>
      <div class="box-item" @click="redirect('tests')">
        <div class="title">Tests</div>
        <div class="description"> take tests in order to verify your knowledge about multiple topics</div>
      </div>
    </div>
  </v-container>
</template>

<script>
import router from "../plugins/router";
export default {
  name: "HelloWorld",
  data: () => ({
    bgImage: {
      background:
        "url(" +
        require("@/assets/homepage.jpg") +
        ") no-repeat center center fixed",
    },
  }),
  methods: {
    redirect(param) {
      router.push("/" + param);
    },
  },
};
</script>

<style scoped>
.bg-image {
  height: 100%;
  overflow: hidden;
  margin: 0;
  display: flex;
  max-width: none;
  padding: 0;
  width: 100%;
  background-size: cover !important;
}
.box-container {
  display: flex;
  flex-flow: wrap;
  align-content: center;
  justify-content: flex-end;
  margin-right: 10px;
  width: 100%;
}
.box-item {
  border: 1px solid var(--primary);
  flex: 0 0 33%;
  max-height: 20%;
  border-radius: 10px;
  margin: 10px;
  padding: 30px;
  background-color: var(--primary-low-opacity);
  flex-flow: column;
  text-align: -webkit-center;
  cursor: pointer;
}
.box-item:hover {
  box-shadow: 0px 2px 10px var(--primary-low-opacity);
}
  .box-item:hover .description {
visibility: unset;
  }

.description {
  text-align: center;
  color: var(--light-text);
  visibility: hidden;
}
.title {
  text-align: -webkit-center;
  padding-bottom: 5px;
  font-family: "dancingscript" !important;
  font-weight: bold;
  font-size: 2rem !important;
  color: var(--light-text);
}
</style>
