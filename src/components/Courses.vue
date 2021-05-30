<template>
  <v-container>
    <div class="title">Courses</div>

    <div class="bar-container">
      <v-text-field
        hide-details
        prepend-icon="mdi-magnify"
        single-line
        v-model="inputData"
      ></v-text-field>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on">
            <v-btn
              v-if="getUserDetails"
              x-small
              fab
              class="add-btn"
              @click="dialogAddCourse.showDialog = !dialogAddCourse.showDialog"
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </span>
        </template>
        <span>Add course</span>
      </v-tooltip>
    </div>

    <div v-if="filteredItems.length > 0">
      <v-list three-line>
        <template v-for="(item, index) in filteredItems">
          <v-list-item-content :key="index" class="item-name">
            <v-row class="card-container">
              <v-col md="11">
                <v-list-item-title v-html="item.name"></v-list-item-title>
                <v-list-item-subtitle
                  v-html="item.description"
                ></v-list-item-subtitle>
              </v-col>
              <v-col md="1">
                <router-link
                  :to="{ name: 'CoursePage', params: { id: item.name } }"
                  style="cursor:pointer"
                >
                  <v-btn class="upload-btn" fab x-small>
                    <v-icon>mdi-format-list-bulleted-square</v-icon>
                  </v-btn>
                </router-link>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </v-list-item-content>
        </template>
      </v-list>
    </div>
    <div v-if="filteredItems.length <= 0">
      No items found
    </div>

    <v-dialog v-model="dialogAddCourse.showDialog" max-width="40vw">
      <v-card elevation="2" shaped>
        <v-card-title class="title-dialog">
          Add course
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="dialogAddCourse.name" label="Course name">
          </v-text-field>
          <v-text-field
            v-model="dialogAddCourse.description"
            label="Description"
          >
          </v-text-field>
          <v-row>
            <v-radio-group v-model="typeUpload">
              <v-radio label="Public" value="public"></v-radio>
              <v-radio
                label="For other teachers and students"
                value="student"
              ></v-radio>
              <v-radio
                label="Just for other teachers"
                value="professor"
              ></v-radio>
            </v-radio-group>
          </v-row>
        </v-card-text>

        <v-container grid-list-sm>
          <v-btn type="submit" @click="addCourse" class="save-btn">
            Save
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "../plugins/firebase";
export default {
  name: "Courses",
  data: () => ({
    dialogAddCourse: {
      showDialog: false,
      name: "",
      description: "",
    },
    inputData: "",
    typeUpload: "",
  }),
  computed: {
    getCoursesList() {
      return this.$store.getters.coursesData;
    },
    filteredItems() {
      return Object.values(this.getCoursesList).filter(
        (item) =>
          item.name.toLowerCase().includes(this.inputData.toLowerCase()) ||
          item.description.toLowerCase().includes(this.inputData.toLowerCase())
      );
    },
    getUserDetails() {
      return this.$store.getters.userDetails;
    },
  },
  methods: {
    addCourse() {
      firebase
        .database()
        .ref("courses/")
        .push({
          name: this.dialogAddCourse.name,
          description: this.dialogAddCourse.description,
          userId: this.getUserDetails.name,
          type: this.typeUpload,
        })
        .then(() => {
          this.dialogAddCourse.showDialog = false;
        });
    },
  },
};
</script>

<style scoped>
.bar-container {
  display: flex;
  margin-bottom: 30px;
}
.dropzone-custom-content {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.dropzone-custom-title {
  margin-top: 0;
  color: #00b782;
}
.subtitle {
  color: #314b5f;
}
.btn-container {
  justify-content: center;
}
.card-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-family: "dancingscript" !important;
  font-size: 2rem !important;
  padding-bottom: 5px;
  font-weight: bold;
}
.title-dialog {
  font-family: "dancingscript" !important;
  font-size: 1.5rem !important;
  padding-bottom: 5px;
  font-weight: bold !important;
}
.save-btn {
  background-color: var(--primary) !important;
  color: var(--light-text);
}
.add-btn {
  background-color: var(--primary) !important;
  color: var(--light-text);
}
.item-name {
  color: var(--dark-text) !important;
  padding: 20px;
}
.upload-btn {
  background-color: var(--primary) !important;
  color: var(--light-text);
}
</style>
