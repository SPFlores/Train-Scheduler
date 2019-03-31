const config = {
  apiKey: "AIzaSyABWFT1cb2jgViugI2OsYGDc_2esNZKqx8",
  authDomain: "trainscheduleify.firebaseapp.com",
  databaseURL: "https://trainscheduleify.firebaseio.com",
  projectId: "trainscheduleify",
  storageBucket: "",
  messagingSenderId: "297497188221"
}

firebase.initializeApp(config)

let db = firebase.firestore()

db.collection('trains').onSnapshot(snap => {
  document.querySelector('#trainTable').innerHTML = `
    <caption> Current Train Schedule</caption>
    <tr>
      <th>Train Name</th>
      <th>Destination</th>
      <th>Frequency (min)</th>
      <th>Next Arrival</th>
      <th>Minutes Away</th>
    </tr>
  `
  snap.docs.forEach(doc => {
    let { name, destination, time, frequency } = doc.data()
let nextArrival 
let minutesAway

    let docElem = document.createElement('tr')
    docElem.innerHTML = `
         <td>${name}</td>
         <td>${destination}</td>
         <td>${frequency}</td>
         <td></td>
         <td></td>
        `
    document.querySelector('#trainTable').append(docElem)
  })
})

document.querySelector('#submitBtn').addEventListener('click', e => {
  e.preventDefault()
  if (document.querySelector('#name').value === '') {
    document.querySelector('#nameFormat').style.display = 'inline'
  } else if (document.querySelector('#destination').value === '') {
    document.querySelector('#destinationFormat').style.display = 'inline'
  } else if ((document.querySelector('#time').value).length > 4) {
    document.querySelector('#timeFormat').style.display = 'inline'
  } else {
    addNewTrain()
    document.querySelector('#nameFormat').style.display = 'none'
    document.querySelector('#name').value = ''
    document.querySelector('#destinationFormat').style.display = 'none'
    document.querySelector('#destination').value = ''
    document.querySelector('#timeFormat').style.display = 'none'
    document.querySelector('#time').value = ''
    document.querySelector('#frequency').value = ''
  }
})

const addNewTrain = _ => {
  let id = db.collection('users').doc().id

  db.collection('trains').doc(id).set({
    name: document.querySelector('#name').value,
    destination: document.querySelector('#destination').value,
    time: moment(`${document.querySelector('#time').value}`, 'hmm').format('HH:mm'),
    frequency: (document.querySelector('#frequency').value) * 60000
  })
}
