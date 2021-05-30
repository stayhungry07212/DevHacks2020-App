<template>
  <v-container>
    <div class="title">Course details</div>

    <v-card v-if="getCourseDetails.length > 0" class="card-intro">
      <v-row class="card-container">
        <v-col md="10">
          <v-card-title class="item-name">
            {{ getCourseDetails[0].name }}
          </v-card-title>
          <v-card-subtitle>
            {{ getCourseDetails[0].description }}
          </v-card-subtitle>
        </v-col>
      </v-row>
      <v-row class="btn-container">
        <v-btn
          class="add-btn"
          @click="showForm = !showForm"
          v-if="getUserDetails && getUserDetails.name === getCourseDetails[0].userId"
          >Add chapter</v-btn
        >
      </v-row>

      <div v-if="showForm" >
        <v-row class='form-style'> 
          <v-col md="10" >
            <v-text-field v-model="chapterDetails.title" label="Chapter title">
            </v-text-field>
            <v-text-field
              v-model="chapterDetails.theory"
              label="Chapter theory"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row class="btn-container">
          <v-btn class="add-btn" @click="saveChapter">Save</v-btn>
        </v-row>
      </div>
    </v-card>

      <div v-if="getCourseDetails[0] && getCourseDetails[0].chapters" class="chapter-container">
        <div
          v-for="(item, index) in getCourseDetails[0].chapters"
          :key="index"
          class="result-item"
        >
          <v-card style='margin-bottom: 15px'>
            <v-row class="card-container">
              <v-col md="10">
                <v-card-title class="item-name">
                  {{ item.title }}
                </v-card-title>
                <v-card-subtitle>
                  {{ item.theory }}
                </v-card-subtitle>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-card>
        </div>
      </div>
  </v-container>
</template>

<script>
import firebase from "../plugins/firebase";
export default {
  name: "CoursePage",
  data() {
    return {
      id: this.$route.params.id,
      addChapter: false,
      showForm: false,
      chapterDetails: {
        title: "",
        theory: "",
      },
    };
  },
  computed: {
    getUserDetails() {
      return this.$store.getters.userDetails;
    },
    getCourseDetails() {
      return Object.values(this.$store.getters.coursesData).filter(
      (item) => item.name === this.id
    );
    }
  },
  methods: {
    saveChapter() {
      firebase
        .database()
        .ref("courses/" + this.getCourseDetails[0].key + "/chapters")
        .push({
          title: this.chapterDetails.title,
          theory: this.chapterDetails.theory,
        })
        .then(() => {
          this.showForm = false;
        });
    },
  },
};
</script>
<style scoped>
.title {
  font-family: "dancingscript" !important;
  font-size: 2rem !important;
  padding-bottom: 30px;
  font-weight: bold;
}
.btn-container {
  justify-content: center;
}
.add-btn {
  background-color: var(--primary) !important;
  color: var(--light-text);
  margin-bottom: 20px;
}
.item-name {
  color: var(--dark-text) !important;
  margin-bottom: 10px;
}
.card-intro {
  margin-bottom: 15px;
}
.form-style {
 display: flex;
 justify-content: center
}
</style>
