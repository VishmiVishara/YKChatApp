// 'use strict'
// //Install functions and admin sdks'
// const functions = require('firebase-functions');
// const admin =require('firebase-admin');
//
// // admin.initializeApp(functions.config().firebase);
// admin.initializeApp();
//
// exports.sendNotification = functions.database.ref('/notifications/{user_id}/{notification_id}').onWrite((change, context) => {
//     //onwrite will run if data changed
//     const user_id = context.params.user_id;
//     const notification = context.params.notification;
//
//     // If exit the function.
//     if (!change.after.val()) {
//       return console.log('User ', user_id, 'notification', notification);
//     }
//
//     // if (context.params === null) {
//     //     return console.log("Notification Has Been Deleted");
//     // }
//
//     let token_id = null;
//     const deviceToken = admin.database().ref(`/Users/${user_id}/device_token`).once('value');
//     console.log(deviceToken);
//     // return deviceToken.then(result => {
//     //
//     //     token_id = result.val();
//     //
//     //     const payload = {
//     //         notification:{
//     //             title:"Friend Request",
//     //             body:"You have recieved a new friend request",
//     //             icon:"default"
//     //         }
//     //     };
//     //
//     //
//     // });
//     //
//     //
//     // return admin.messaging().sendToDevice(token_id, payload).then(response =>{
//     //     console.log('This is the notify feature');
//     // }).catch(err => {
//     //     console.log('Error getting documents', err);
//     // });
//
//     // Get the follower profile.
//       const getFollowerProfilePromise = admin.auth().getUser(user_id);
//
//       // The snapshot to the user's tokens.
//       let tokensSnapshot;
//
//       // The array containing all the user's tokens.
//       let tokens;
//
//       return Promise.all([deviceToken, getFollowerProfilePromise]).then(results => {
//         tokensSnapshot = results[0];
//         const follower = results[1];
//
//         // Check if there are any device tokens.
//         if (!tokensSnapshot.hasChildren()) {
//           return console.log('There are no notification tokens to send to.');
//         }
//         console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
//         console.log('Fetched follower profile', follower);
//
//         // Notification details.
//         const payload = {
//           notification: {
//             title: 'You have a new follower!',
//             body: 'is now following you.',
//             icon: 'default'
//           }
//         };
//
//         // Listing all tokens as an array.
//         tokens = Object.keys(tokensSnapshot.val());
//         // Send notifications to all tokens.
//         return admin.messaging().sendToDevice(tokens, payload);
//       }).then((response) => {
//         // For each message check if there was an error.
//         const tokensToRemove = [];
//         response.results.forEach((result, index) => {
//           const error = result.error;
//           if (error) {
//             console.error('Failure sending notification to', tokens[index], error);
//             // Cleanup the tokens who are not registered anymore.
//
//               tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
//           }
//         });
//         return Promise.all(tokensToRemove);
// });
//
//
//
// });
//


'use strict'

//Install functions and admin sdks'
const functions = require('firebase-functions');
const admin =require('firebase-admin');
var FCM = require('fcm-push');
admin.initializeApp();


var serverKey = 'AAAA2U0NWhk:APA91bEIyK83CJMgM4NkA5JlO42laoT6VRAmVp4kv-DVdQB01-Eraam02B6tUiA6rYiBYrP2A08VZhgpFi2qDv4knkPi5_S2Ug7XHxzl5ILGN3-2h3tc17LMMhcMJRtqP_6KRBb_Ub2U';
var fcm = new FCM(serverKey);



exports.sendNotification = functions.database.ref('/notifications/{user_id}/{notification_id}').onWrite((change, context) => {
    //onwrite will run if data changed
    const user_id = context.params.user_id;
    const notification = context.params.notification;
console.log('user : '+user_id)
console.log('notification : '+notification)
    // If exit the function.
    if (!change.after.val()) {
      return console.log('User ', user_id, 'notification', notification);
    }

// Only edit data when it is first created.
      if (change.before.exists()) {
        return null;
      }
      // Exit when the data is deleted.
      if (!change.after.exists()) {
        return null;
      }

    // if (context.params === null) {
    //     return console.log("Notification Has Been Deleted");
    // }

//    let token_id = null;
    const deviceToken = admin.database().ref(`/Users/${user_id}/device_token`).once('value');
    console.log("Dev TOken : "+deviceToken);
    return admin.database().ref(`/Users/${user_id}/device_token`).once('value').then(result => {


        const payload = {
            notification:{
                title:"Friend Request",
                body:"You have recieved a new friend request",
            },
            tokens:deviceToken
        };

        return admin.messaging().send(payload).then(response =>{
            return console.log('This is the notify feature');
        }).catch(err => {
            return console.log('Error getting documents', err);
        });
    })


    // return deviceToken.then(result => {
    //
    //     token_id = result.val();
    //
    //     const payload = {
    //         notification:{
    //             title:"Friend Request",
    //             body:"You have recieved a new friend request",
    //             icon:"default"
    //         }
    //     };
    //
    //
    // });
    //
    //
    // return admin.messaging().sendToDevice(token_id, payload).then(response =>{
    //     console.log('This is the notify feature');
    // }).catch(err => {
    //     console.log('Error getting documents', err);
    // });


});
