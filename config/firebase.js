// const admin = require('firebase-admin');
// const serviceAccount = require('../book-management-33f91-firebase-adminsdk-1pzse-d7ee21a82d.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   //databaseURL: `mongodb+srv://${process.env.dbUser}:${process.env.dbPassword}@cluster0.7zfjhjz.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`
// });

// exports.sendPushNotification = (fcmToken, title, body) => {
//     const message = {
//         notification: {
//             title: title,
//             body, body
//         },
//         token: fcmToken
//     };
//     admin.messaging().send(message)
//         .then(response => {
//             console.log('Successfully sent message: ', response);
//         })
//         .catch(error => {
//             console.log('Error sending the message: ', error);
//         });
// };

// module.exports = admin;
