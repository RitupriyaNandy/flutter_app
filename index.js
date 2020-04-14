const functions = require('firebase-functions');
const admin= require('firebase-admin');

admin.initializeApp(functions.config().functions);

var newData;

exports.messageTrigger = functions.firestore.document('Carinfo/{carinfoTd}').onCreate(async(snapshot, context) => {
    if (snapshot.empty) {
        console.log('No Devices');
        return;

    }
    var tokens= [];
    newData = snapshot.data();
    const deviceTokens= await admin
        .firestore()
        .collection('Device Tokens')
        .get();
    for ( var token of deviceTokens.docs) {
        tokens.push(token.data().device_token);
    }
    var payload = {
        notification: { title: 'ACCIDENT ALERT', body:'Car number and name is'+ newData.car_no+ newData.car_owner, sound: 'default'},
        data: { click_action: 'FLUTTER_NOTIFICATION_CLICK', message: newData.car_owner},
    };
    try {
        const response = await admin.messaging().sendToDevice(tokens,payload);
        console.log('Notification sent successfully');
    } catch (err) {
        console.log('Error sending Notification');
    }
});
    