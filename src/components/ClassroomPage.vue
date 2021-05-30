<template>
  <v-container>
    <div class="title">Classroom details</div>
    <div class="content">
      <div class="video-chat">
        <div class="video">
          <div id="auth" v-if="!uid">
            <p>
              Enter your username to start video chat (hint: superhero1,
              superhero2)
            </p>
            <form v-on:submit.prevent="authLoginUser">
              <div class="form-group">
                <input
                  name="username"
                  id="username"
                  class="form-control"
                  placeholder="Enter your username"
                  v-model="username"
                />
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-success button-add">
                  Login
                  <span v-if="showSpinner" class="fa fa-spin fa-spinner"></span>
                </button>
              </div>
            </form>
          </div>

          <div class="home" v-if="uid">
            <div id="nav">
              <button class="btn btn-success" @click="logoutUser">
                Logout
              </button>
            </div>
            <div class="form-group">
              <div class="form-group">
                <p>
                  Welcome <b>{{ this.username }}</b
                  >, your UID is <b>{{ this.uid }}</b> <br />
                  Enter the receiver Id to start a chat
                </p>
                <p v-if="error">
                  <b class="text-danger"> Receiver ID is required </b>
                </p>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter receiver UID"
                  v-model="receiver_id"
                />
              </div>

              <div v-if="incomingCall">
                <button class="btn btn-success" @click="acceptCall">
                  Accept Call
                </button>
                <button class="btn btn-success" @click="rejectCall">
                  Reject Call
                </button>
              </div>
              <div v-else-if="ongoingCall">
                <button class="btn btn-secondary">Ongoing Call ...</button>
              </div>
              <div v-else>
                <button @click="startVideoChat" class="btn btn-secondary">
                  Start Call
                  <span v-if="showSpinner" class="fa fa-spin fa-spinner"></span>
                </button>
              </div>
            </div>
            <div id="callScreen"></div>
          </div>
        </div>
        <v-card class="chat">
          <v-card-text class="old-comments">
            <v-list
              three-line
              v-if="classroomDetails && classroomDetails.comments"
            >
              <template v-for="(item, index) in classroomDetails.comments">
                <v-list-item-content :key="index" class="item-name">
                  <v-row class="card-container">
                    <v-col md="11">
                      <v-list-item-subtitle
                        class="user"
                        v-html="item.userId"
                      ></v-list-item-subtitle>
                      <v-list-item-subtitle
                        class="date"
                        v-html="item.date"
                      ></v-list-item-subtitle>
                       <div v-if="item.dateAdded" class="date-style"> {{  new Date(item.dateAdded).toLocaleString() }}</div>
                      <v-list-item-title
                        v-html="item.comment"
                      ></v-list-item-title>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                </v-list-item-content>
              </template>
            </v-list>
          </v-card-text>
          <v-card-text class="new-comment">
            <v-text-field v-model="newComment" label="Your comment here">
            </v-text-field>
            <v-btn text @click="addComment()">
              Add comment
            </v-btn>
          </v-card-text>
        </v-card>
      </div>
      <div class="files">
        <v-btn text @click="upload = !upload" class="button-add">
          <span class="mr-2">Upload</span>
        </v-btn>
        <div class="files">
          <vue-dropzone
            v-if="upload"
            :options="dropzoneOptions"
            :useCustomSlot="true"
            id="dropzone"
            v-on:vdropzone-success="uploadSuccess"
          >
            <div class="dropzone-custom-content">
              <h3 class="dropzone-custom-title">
                Drag and drop to upload content!
              </h3>
              <div class="subtitle">
                ...or click to select a file from your computer
              </div>
            </div>
          </vue-dropzone>

          <v-row v-if="upload">
            <v-col cols="3">
              <v-subheader>Add a description for your file</v-subheader>
            </v-col>
            <v-col cols="9">
              <v-text-field
                counter
                maxlength="250"
                v-model="fileDescription"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="upload">
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
          <v-row v-if="upload" class="btn-container">
            <v-btn @click="uploadDocument">Save</v-btn>
          </v-row>
          <div v-if="filteredItems.length > 0">
            <div
              v-for="(item, index) in filteredItems"
              :key="index"
              class="result-item"
            >
              <v-card v-if="!upload">
                <v-row class="card-container">
                  <v-col md="10">
                    <v-card-title class="item-name">
                      {{ item.name }}
                    </v-card-title>
                    <v-card-subtitle>
                      {{ item.description }}
                    </v-card-subtitle>
                    <v-card-text>
                      <div v-if="item.userId">
                        Uploaded by {{ getUserName(item.userId) }}
                      </div>
                      <div v-if="item.dateUpload"> {{  new Date(item.dateUpload).toLocaleString() }}</div>
                    </v-card-text>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                          <v-btn
                            class="download-btn"
                            fab
                            x-small
                            @click="downloadDoc(item)"
                          >
                            <v-icon dark>
                              mdi-download
                            </v-icon>
                          </v-btn>
                        </span>
                      </template>
                      <span>Download document</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </div>
          <div v-if="filteredItems.length <= 0">
            No items found
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { CometChat } from "@cometchat-pro/chat";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import firebase from "../plugins/firebase";
export default {
  name: "ClassroomPage",
  data() {
    return {
      id: this.$route.params.id,
      upload: false,
      fileDescription: "",
      fileDetails: "",
      typeUpload: "",
      inputData: "",
      VUE_APP_COMMETCHAT_API_KEY: "8a8985b76b57b11c2148a65581e6af67a9314bd0",
      VUE_APP_COMMETCHAT_APP_ID: "2556919f5f12b69",
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 100,
        addRemoveLinks: true,
        maxFiles: 1,
      },
      newComment: "",
      username: "",
      showSpinner: false,
      uid: "",
      session_id: "",
      receiver_id: null,
      error: false,
      incomingCall: false,
      ongoingCall: false,
    };
  },
  components: {
    vueDropzone: vue2Dropzone,
  },
  computed: {
    classroomDetails() {
      return Object.values(this.$store.getters.classroomsData).filter(
        (item) => item.key === this.id
      )[0];
    },
    getDocumentList() {
      return this.$store.getters.uploadsData;
    },
    filteredItems() {
      return Object.values(this.getDocumentList).filter(
        (item) => this.classroomDetails.key === item.classroomKey
      );
    },
    userDetails() {
      return this.$store.getters.userDetails;
    },
    usersData() {
      return this.$store.getters.usersData;
    },
  },
  methods: {
    addComment() {
      firebase
        .database()
        .ref("classrooms/" + this.classroomDetails.key + "/comments")
        .push({
          comment: this.newComment,
          dateAdded: Date.now(),
          userId: this.userDetails.name,
        }).then(() => {
          this.newComment = ''
        })
    },
    uploadSuccess: function(file) {
      this.fileDetails = file;
      console.log(file);
    },
    getUserName(userId) {
      return this.usersData
        ? this.usersData.filter((item) => item.key === userId)[0].name
        : "";
    },
    uploadDocument() {
      const selectedFile = this.fileDetails;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.ImageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(selectedFile);
      this.ImageUrl = selectedFile;
      const storageRef = firebase
        .storage()
        .ref("Documents/" + this.fileDetails.name);
      const uploadTask = storageRef.put(selectedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log("succes");
          var downloadURL = uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              firebase
                .database()
                .ref("uploads/")
                .push({
                  downloadLink: downloadURL,
                  description: this.fileDescription,
                  name: this.fileDetails.name,
                  dateUpload: Date.now(),
                  userId: this.userDetails.name,
                  downloads: 0,
                  type: this.typeUpload,
                  downloadsProfessors: 0,
                  downloadsStudents: 0,
                  classroomKey: this.classroomDetails.key,
                });
              console.log("File available at", downloadURL);
            });
          this.Image = downloadURL;
        }
      );
    },
    downloadDoc(item) {
      firebase
        .database()
        .ref("uploads/" + item.key)
        .update({
          downloads: item.downloads ? item.downloads + 1 : 1,
        });
      if (this.userDetails && this.userDetails.type) {
        if (this.userDetails.type === "professor") {
          firebase
            .database()
            .ref("uploads/" + item.key)
            .update({
              downloadsProfessors: item.downloadsProfessors
                ? item.downloadsProfessors + 1
                : 1,
            });
        }
        if (this.userDetails.type === "student") {
          firebase
            .database()
            .ref("uploads/" + item.key)
            .update({
              downloadsStudents: item.downloadsStudents
                ? item.downloadsStudents + 1
                : 1,
            });
        }
      }

      window.open(item.downloadLink, "_blank");
    },
    initializeApp() {
      var appID = this.VUE_APP_COMMETCHAT_APP_ID;
      CometChat.init(appID).then(
        () => {
          console.log("Initialization completed successfully");
        },
        (error) => {
          console.log("Initialization failed with error:", error);
        }
      );
    },
    authLoginUser() {
      var apiKey = this.VUE_APP_COMMETCHAT_API_KEY;
      this.showSpinner = true;
      CometChat.login(this.username, apiKey).then(
        () => {
          this.showSpinner = false;
          this.getLoggedInUser();
        },
        (error) => {
          this.showSpinner = false;
          console.log("Login failed with error:", error.code);
        }
      );
    },
    getLoggedInUser() {
      CometChat.getLoggedinUser().then(
        (user) => {
          this.username = user.name;
          this.uid = user.uid;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    startVideoChat() {
      if (!this.receiver_id) this.error = true;
      this.showSpinner = true;
      var receiverID = this.receiver_id;
      var callType = CometChat.CALL_TYPE.VIDEO;
      var receiverType = CometChat.RECEIVER_TYPE.USER;
      var call = new CometChat.Call(receiverID, callType, receiverType);
      CometChat.initiateCall(call).then(
        (outGoingCall) => {
          this.showSpinner = false;
          console.log("Call initiated successfully:", outGoingCall);
          // perform action on success. Like show your calling screen.
        },
        (error) => {
          console.log("Call initialization failed with exception:", error);
        }
      );
    },
    acceptCall() {
      let globalContext = this;
      this.ongoingCall = true;
      this.incomingCall = false;
      var sessionID = this.session_id;
      CometChat.acceptCall(sessionID).then(
        (call) => {
          console.log("Call accepted successfully:", call);
          console.log("call accepted now....");
          // start the call using the startCall() method
          console.log(globalContext.ongoingCall);
          CometChat.startCall(
            call.sessionId,
            document.getElementById("callScreen"),
            new CometChat.OngoingCallListener({
              onUserJoined: (user) => {
                /* Notification received here if another user joins the call. */
                console.log("User joined call:", user);
                /* this method can be use to display message or perform any actions if someone joining the call */
              },
              onUserLeft: (user) => {
                /* Notification received here if another user left the call. */
                console.log("User left call:", user);
                /* this method can be use to display message or perform any actions if someone leaving the call */
              },
              onCallEnded: (call) => {
                /* Notification received here if current ongoing call is ended. */
                console.log("Call ended:", call);
                globalContext.ongoingCall = false;
                globalContext.incomingCall = false;
                /* hiding/closing the call screen can be done here. */
              },
            })
          );
        },
        (error) => {
          console.log("Call acceptance failed with error", error);
          // handle exception
        }
      );
    },
    rejectCall() {
      var sessionID = this.session_id;
      var globalContext = this;
      var status = CometChat.CALL_STATUS.REJECTED;
      CometChat.rejectCall(sessionID, status).then(
        (call) => {
          console.log("Call rejected successfully", call);
          globalContext.incomingCall = false;
          globalContext.ongoingCall = false;
          globalContext.receiver_id = "";
        },
        (error) => {
          console.log("Call rejection failed with error:", error);
        }
      );
    },
    logoutUser() {
      CometChat.logout().then(
        (success) => {
          console.log("Logout completed successfully");
          this.$router.push({ name: "homepage" });
          console.log(success);
        },
        (error) => {
          //Logout failed with exception
          console.log("Logout failed with exception:", { error });
        }
      );
    },
  },
  created() {
    this.initializeApp();

    let globalContext = this;
    var listnerID = "UNIQUE_LISTENER_ID";
    CometChat.addCallListener(
      listnerID,
      new CometChat.CallListener({
        onIncomingCallReceived(call) {
          console.log("Incoming call:", call);
          globalContext.incomingCall = true;
          globalContext.session_id = call.sessionId;
        },
        onOutgoingCallAccepted(call) {
          console.log("Outgoing call accepted:", call);
          globalContext.ongoingCall = true;
          CometChat.startCall(
            call.sessionId,
            document.getElementById("callScreen"),
            new CometChat.OngoingCallListener({
              onUserJoined: (user) => {
                /* Notification received here if another user joins the call. */
                console.log("User joined call:", user);
                /* this method can be use to display message or perform any actions if someone joining the call */
              },
              onUserLeft: (user) => {
                /* Notification received here if another user left the call. */
                console.log("User left call:", user);
                /* this method can be use to display message or perform any actions if someone leaving the call */
              },
              onCallEnded: (call) => {
                globalContext.ongoingCall = false;
                globalContext.incomingCall = false;
                /* Notification received here if current ongoing call is ended. */
                console.log("Call ended:", call);
                /* hiding/closing the call screen can be done here. */
              },
            })
          );
          // Outgoing Call Accepted
        },
        onOutgoingCallRejected(call) {
          console.log("Outgoing call rejected:", call);
          this.incomingCall = false;
          this.ongoingCall = false;
          this.receiver_id = "";
          // Outgoing Call Rejected
        },
        onIncomingCallCancelled(call) {
          console.log("Incoming call calcelled:", call);
        },
      })
    );
  },
};
</script>
<style scoped>
#auth {
  width: 600px;
  margin: 0 auto;
}
#callScreen {
  width: 500px;
  height: 500px;
}
.home {
  width: 600px;
  margin: 0 auto;
}
.title {
  font-family: "dancingscript" !important;
  font-size: 2rem !important;
  padding-bottom: 5px;
  font-weight: bold;
}
.old-comments {
  max-height: 350px;
  overflow-y: scroll;
  background-color: var(--primary-low-opacity);
}
.old-comments .v-list {
  background-color: unset !important;
}
.old-comments .user {
  color: var(--primary);
}
.button-add {
  background-color: var(--primary) !important;
  color: var(--light-text);
  margin: 20px 0;
}
.old-comments .date {
  color: var(--primary-low-opacity);
}
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
.video-chat {
  display: flex;
  flex-flow: row;
}
.video {
  flex: 1 1 40%;
  padding-right: 10px;
  align-self: center;
  text-align: center;
  justify-content: center;
}
.chat {
  flex: 1 1 40%;
}
.btn-container {
  justify-content: center;
}
.card-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.title {
  font-family: "dancingscript" !important;
  font-size: 2rem !important;
  padding-bottom: 5px;
  font-weight: bold;
}
.upload-btn {
  background-color: var(--primary) !important;
  color: var(--light-text);
}
.download-btn {
  background-color: var(--primary) !important;
  color: var(--light-text);
  margin-right: 10px;
}
.item-name {
  color: var(--dark-text) !important;
}
.dropzone-custom-title {
  color: var(--primary);
}
.chips-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
.chip-style {
  background-color: var(--primary-low-opacity) !important;
  margin: 5px;
}
.date-style {
  color: var(--dark-text) !important;
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
