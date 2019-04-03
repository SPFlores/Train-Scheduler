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
    <caption class="yellow darken-1 center-align">Current Train Schedule</caption>
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
    let firstArrival = moment(`${time}`, 'HHmm')
    let rawResult = Math.floor(firstArrival.format('HHmm') - moment().format('HHmm'))
    let rawResultStr = rawResult.toString()
    let rawResultAbs = Math.abs(rawResult)
    let rawResultAbsStr = rawResultAbs.toString()
    let minutesAgo, nextOffset, minutesAway, nextArrival, numPrev, hours, minutes
    console.log(rawResult)

    if (rawResult < 0) {
      if (rawResultAbs >= 0 && rawResultAbs <= (frequency / 60000)) {
        minutesAgo = rawResultAbs
        nextOffset = (frequency / 60000) - Math.abs(minutesAgo)
        nextArrival = moment().add(`${nextOffset}`, 'm')
      } else if (rawResultAbs > (frequency / 60000) && rawResultAbs < 100) {
        minutesAgo = rawResultAbs
        nextOffset = (frequency / 60000) - (minutesAgo % (frequency / 60000))
        nextArrival = moment().add(`${nextOffset}`, 'm')
      } else if (rawResultAbs >= 100 && rawResultAbs <= 959) {
        hours = parseInt(rawResultAbsStr.slice(0, 1) * 60)
        minutes = parseInt(rawResultAbsStr.slice(1, 3))
        minutesAgo = hours + minutes
        nextOffset = (frequency / 60000) - (minutesAgo % (frequency / 60000))
        nextArrival = moment().add(`${nextOffset}`, 'm')
      } else if (rawResultAbs > 959) {
        hours = parseInt(rawResultAbsStr.slice(0, -2) * 60)
        minutes = parseInt(rawResultAbsStr.slice(-2, rawResultAbsStr.length))
        minutesAgo = hours + minutes
        nextOffset = (frequency / 60000) - (minutesAgo % (frequency / 60000))
        nextArrival = moment().add(`${nextOffset}`, 'm')
      }
    } else if (rawResult > 0) {
      if (rawResult >= 0 && rawResult < (frequency / 60000)) {
        minutesAgo = rawResult
        nextOffset = (frequency / 60000) - Math.abs(minutesAgo)
        nextArrival = moment().add(`${nextOffset}`, 'm')
      } else if (rawResult > (frequency / 60000) && rawResult < 100) {
        minutesAgo = rawResult
        nextOffset = (frequency / 60000) - (minutesAgo % (frequency / 60000))
        nextArrival = firstArrival.add(`${(frequency / 60000) * numPrev}`, 'm')
      } else if (rawResult >= 100 && rawResult <= 959) {
        hours = parseInt(rawResult.slice(0, 1) * 60)
        minutes = parseInt(rawResultStr.slice(1, 3))
        minutesAgo = hours + minutes
        nextOffset = (frequency / 60000) - (minutesAgo % (frequency / 60000))
        nextArrival = moment().add(`${nextOffset}`, 'm')
      } else if (rawResult > 959) {
        hours = parseInt(rawResultStr.slice(0, -2) * 60)
        minutes = parseInt(rawResultStr.slice(-2, rawResultStr.length))
        console.log(hours)
        console.log(minutes)
        minutesAgo = hours + minutes
        console.log(minutesAgo)
        nextOffset = (frequency / 60000) - (minutesAgo % (frequency / 60000))
        nextArrival = moment().add(`${nextOffset}`, 'm')
      }
    }

    if (minutesAway === 0) {
      minutesAway = 'NOW'
    }

    let docElem = document.createElement('tr')
    docElem.innerHTML = `
         <td>${name}</td>
         <td>${destination}</td>
         <td>${frequency / 60000}</td>
         <td>${nextArrival.format('hh:mm a')}</td>
         <td>${nextOffset}</td>
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
    time: moment(`${(document.querySelector('#time').value)}`, 'HHmm').format('HHmm'),
    frequency: (document.querySelector('#frequency').value) * 60000
  })
}
