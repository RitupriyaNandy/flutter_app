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
    querySnapshot.docs.length
    
    const x= newData.position.latitude
    const y= newData.position.longitude
    const z= x+5
    const a= x-5
    const b= y+5
    const c= y-5
    var collectionReference = db.collection('rescuers');
    var query = collectionReference.where(('position[latitude]', '<=', z)|('position[longitude]', '<=', b)|('position[latitude]', '>=',a )|('position[latitude]', '>=', c))
    query.get().then(function(querySnapshot) {
        if (querySnapshot.docs.empty) {
            console.log('no documents found');
          } else {
              querySnapshot.docs.forEach(function(doc) {
                  tokens.push(doc.data().device_token)
                  
                  
              }).catch(function(error) {
                  console.log("error getting document" , error);
              });

            
          }
      });
   
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
    