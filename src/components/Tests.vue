<template>
  <v-container>
    <div class="title-page">Tests</div>
    <div class="category-title">
      {{ getITCategory[0].category }}
    </div>
    <div class="category-tests">
      <v-card v-for="(item, index) in getITCategory" :key="index">
        <div class="box-item" @click="redirect(item.key)">
          <div class="title">{{ item.name }}</div>
          <div class="description">{{ getChars(item.description) }}</div>
        </div>
      </v-card>
    </div>
    <div class="category-title">
      {{ getITSoftwareCategory[0].category }}
    </div>
    <div class="category-tests">
      <v-card v-for="(item, index) in getITSoftwareCategory" :key="index">
        <div class="box-item" @click="redirect(item.key)">
          <div class="title">{{ item.name }}</div>
          <div class="description">{{ getChars(item.description) }}</div>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import router from "../plugins/router";
export default {
  name: "Tests",
  data: () => ({}),
  computed: {
    getQuizList() {
      return this.$store.getters.quizezData;
    },
    getITCategory() {
      return this.$store.getters.quizezData.filter(
        (item) => item.category === "IT"
      );
    },
    getITSoftwareCategory() {
      return this.$store.getters.quizezData.filter(
        (item) => item.category === "IT Software & Hardware"
      );
    },
  },
  methods: {
    redirect(key) {
      router.push("/tests/" + key);
    },
    getChars(item) {
      return item.slice(0, 250);
    },
  },
};
</script>

<style scoped>
.title-page {
  font-family: "dancingscript" !important;
  font-size: 2rem !important;
  padding-bottom: 5px;
  font-weight: bold;
  margin-bottom: 20px;
}
.title {
  padding-bottom: 5px;
  font-weight: bold;
  margin-bottom: 20px;
}
.v-card {
  flex: 0 0 33%;
  margin: 5px;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
}
.v-card:hover {
  box-shadow: 0px 2px 10px var(--primary-low-opacity);
}
.category-title {
  margin: 10px 0;
  font-size: 1.3rem;
}
</style>
