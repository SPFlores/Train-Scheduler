const config = {
  apiKey: "AIzaSyABWFT1cb2jgViugI2OsYGDc_2esNZKqx8",
  authDomain: "trainscheduleify.firebaseapp.com",
  databaseURL: "https://trainscheduleify.firebaseio.com",
  projectId: "trainscheduleify",
  storageBucket: "",
  messagingSenderId: "297497188221"
}

firebase.initializeApp(config)

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
    document.querySelector('#nameFormat').style.display = 'none'
    document.querySelector('#name').value = ''
    document.querySelector('#destinationFormat').style.display = 'none'
    document.querySelector('#destination').value = ''
    document.querySelector('#timeFormat').style.display = 'none'
    document.querySelector('#time').value = ''
    document.querySelector('#frequencyFormat').style.display = 'none'
    document.querySelector('#frequency').value = ''
    addNewTrain()
  }
})

const addNewTrain = _ => {
  console.log('added new train')
}
