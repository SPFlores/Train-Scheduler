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

document.querySelector('#submitBtn').addEventListener('click', e => {
  e.preventDefault()
  if (document.querySelector('#name').value === '') {
    document.querySelector('#nameFormat').style.display = 'inline'
  } else if (document.querySelector('#destination').value === '') {
    document.querySelector('#destinationFormat').style.display = 'inline'
  } else if (!(document.querySelector('#time').value).includes(':')) {
    document.querySelector('#timeFormat').style.display = 'inline'
  } else if (isNaN(parseInt(document.querySelector('#frequency').value))) {
    document.querySelector('#frequencyFormat').style.display = 'inline'
  } else {
    addNewTrain()
    document.querySelector('#nameFormat').style.display = 'none'
    document.querySelector('#name').value = ''
    document.querySelector('#destinationFormat').style.display = 'none'
    document.querySelector('#destination').value = ''
    document.querySelector('#timeFormat').style.display = 'none'
    document.querySelector('#time').value = ''
    document.querySelector('#frequencyFormat').style.display = 'none'
    document.querySelector('#frequency').value = ''
  }
})

const addNewTrain = _ => {
  console.log('added new train')

  let id = db.collection('users').doc().id

  db.collection('trains').doc(id).set({
    name: document.querySelector('#name').value,
    destination: document.querySelector('#destination').value,
    time: moment(`${document.querySelector('#time').value}`, `HH:mm`),
    frequency: (document.querySelector('#frequency').value)*60000
  })

  //   console.log(moment(`${birthday} ${time}`, 'YYYY-MM-DD HH:mm').valueOf())
  //   console.log(picture)

  //   // console.log(moment(birthday, 'YYYY-MM-DD').format('MMMM Do, YYYY'))
  //   // console.log(moment(time, 'HH:mm').format('hh:mm a'))

  //   // storage.ref('images').child(`${id}.jpg`) // or
  //   storage.ref(`images/${id}.jpg`).put(picture)

  //   document.querySelector('#name').value = ''
  //   document.querySelector('#email').value = ''
  //   document.querySelector('#birthday').value = ''
  //   document.querySelector('#time').value = ''
}
