<template>
  <v-container>
    <div class="title">Classrooms</div>

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
              @click="
                dialogAddClassroom.showDialog = !dialogAddClassroom.showDialog
              "
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </span>
        </template>
        <span>Add classroom</span>
      </v-tooltip>
    </div>

    <div v-if="filteredItems.length > 0">
      <v-list three-line class="list-items">
        <template v-for="(item, index) in filteredItems">
          <v-list-item-content :key="index" class="item-name">
            <v-row class="card-container">
              <v-col md="10">
                <v-list-item-title v-html="item.name"></v-list-item-title>
                <v-list-item-subtitle
                  v-html="item.description"
                ></v-list-item-subtitle>
                <div class="date-style">
                  Created on {{ new Date(item.dateUpload).toLocaleString() }}
                </div>
              </v-col>
              <v-col md="1" v-if="getUserDetails">
                <router-link
                  :to="{ name: 'ClassroomPage', params: { id: item.key } }"
                  style="cursor:pointer"
                >
                  <v-btn class="upload-btn">
                    Join
                  </v-btn>
                </router-link>
              </v-col>
              <v-col md="2" v-if="!getUserDetails">
                <v-btn class="upload-btn" disabled>
                  Login to join
                </v-btn>
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

    <v-dialog v-model="dialogAddClassroom.showDialog" max-width="40vw">
      <v-card elevation="2" shaped>
        <v-card-title class="title-dialog">
          Add classroom
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="dialogAddClassroom.name"
            label="Classroom name"
          >
          </v-text-field>
          <v-text-field
            v-model="dialogAddClassroom.description"
            label="Description"
          >
          </v-text-field>
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-radio-group v-model="type">
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
          <v-btn type="submit" @click="addClassroom" class="save-btn">
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
  name: "Classroom",
  data: () => ({
    inputData: "",
    dialogAddClassroom: {
      showDialog: false,
      name: "",
      description: "",
    },
    type: "",
  }),
  computed: {
    classroomsData() {
      return this.$store.getters.classroomsData;
    },
    filteredItems() {
      return Object.values(this.classroomsData).filter(
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
    addClassroom() {
      firebase
        .database()
        .ref("classrooms/")
        .push({
          name: this.dialogAddClassroom.name,
          description: this.dialogAddClassroom.description,
          userId: this.getUserDetails.name,
          type: this.type,
          dateUpload: Date.now(),
        })
        .then(() => {
          this.dialogAddClassroom.showDialog = false;
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
.card-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-name {
  color: var(--dark-text) !important;
  padding: 20px;
}
.upload-btn {
  background-color: var(--primary) !important;
  color: var(--light-text);
}
.add-btn {
  background-color: var(--primary) !important;
  color: var(--light-text);
}
.title {
  font-family: "dancingscript" !important;
  font-size: 2rem !important;
  padding-bottom: 5px;
  font-weight: bold;
}
.save-btn {
  background-color: var(--primary) !important;
  color: var(--light-text);
}
.date-style {
  color: var(--light-text) !important;
  font-size: 12px;
  margin-top: 15px;
}
</style>
