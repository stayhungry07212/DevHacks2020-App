import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/storage'

var config = {
    apiKey: "AIzaSyCbdkoKhX5rHX9FXSww5v-wcBqzRIBBfmg",
    authDomain: "devhacks2020-1c585.firebaseapp.com",
    databaseURL: "https://devhacks2020-1c585.firebaseio.com",
    projectId: "devhacks2020-1c585",
    storageBucket: "devhacks2020-1c585.appspot.com",
    messagingSenderId: "399419580036",
    appId: "1:399419580036:web:3e0173cfce2d35350facd1",
    measurementId: "G-SXZNB4K25J"
}

export default firebase.initializeApp(config)
