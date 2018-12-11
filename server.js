//allowing you admin acces via the server side
var admin = require("firebase-admin");
//all the stuff you need to connect to your app on Firebase, provided by Firebase
var serviceAccount = require("./serviceAccountKey.json"); //this is a reference to the json file you have to download via Firebase
exports = module.exports = {};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://introvocial.firebaseio.com"
});

//creating a reference to the database object, which in this case is Firebase
var db = admin.database();

exports.writeUserData = function(userId, pass) {
    db.ref('users/' + userId).set({
    password: pass
  });
}

exports.readUserData = function(){
    db.ref('/users/').once('value').then(function(snapshot) {
        userArray = Object.entries(snapshot.val());
        for(i = 0; i < userArray.length; i++){
            userArray[i][1] = Object.values(userArray[i][1])[0];
        }
        return userArray;
  });
}

exports.writeQuestionData = function(question, answer, obj){
  console.log(question);
  console.log(answer);
  console.log(obj);

  var updates = {};
  updates['/questions/' + question] = obj;
  return db.ref().update(updates);
}

exports.readQuestionData = function(callback){
  db.ref('/questions/').once('value').then(function(snapshot){
    callback(snapshot.val());
  })
}

//.updating one username to the DB
//usersRef.update({
//    chris:{
//        birthdate: "January 2",
//        fullName: "Chris"
//    }
//});
