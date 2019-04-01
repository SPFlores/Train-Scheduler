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
      <th>First Train</th>
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
    let nextArrival, minutesAway, minutesAgo, nextOffset, hours, minutes

    if (rawResult < 0) {
      console.log(rawResultAbs)
      if (rawResultAbs >= 0 && rawResultAbs < 40) {
        minutesAgo = rawResultAbs
        nextOffset = (frequency / 60000 ) - minutesAgo
        console.log(`${minutesAgo} min ago 1`)
        console.log(`${nextOffset} next offset 1`)
      } else if (rawResultAbs > 40 && rawResultAbs < 100) {
        minutesAgo = rawResultAbs - 40
        console.log(`${minutesAgo} min ago 2`)
      } else if (rawResultAbs >= 100 && rawResultAbs <= 959) {
        hours = parseInt(rawResultAbsStr.slice(0, 1) * 60)
        minutes = parseInt(rawResultAbsStr.slice(1, 3))
        minutesAgo = hours + minutes
        console.log(`${minutesAgo} min ago 3`)
      } else if (rawResultAbs > 959) {
        hours = parseInt(rawResultAbsStr.slice(0, 2) * 60)
        minutes = parseInt(rawResultAbsStr.slice(2, 4))
        minutesAgo = hours + minutes
        console.log(`${minutesAgo} min ago 4`)
      }
      // nextArrival = time + (((moment().format('hh:mm a')).subtract(firstArrival)) / frequency ) * frequency
      // rawResultsAbs = 53, minutesAgo = 13
      // if (rawResultAbs < (frequency / 60000)) {
      //   nextArrival = firstArrival.add((frequency - (minutesAgo * 60000)), 'ms').format('hh:mm a')
      // }

      // minutesAgo = -125 frequency = 60
      // nextArrival = firstArrival + (Math.floor(minutesAgo / frequency) * frequency) + (minutesAgo % frequency)
    } else {
      nextArrival = firstArrival.format('hh:mm a')
    }

    if (0 <= rawResult && rawResult < 40) {
      minutesAway = rawResult
    } else if (40 < rawResult && rawResult < 100) {
      minutesAway = rawResult - 40
    } else if (100 <= rawResult && rawResult <= 959) {
      hours = parseInt(rawResultStr.slice(0, 1) * 60)
      minutes = parseInt(rawResultStr.slice(1, 3))
      minutesAway = hours + minutes
    } else if (rawResult > 959) {
      hours = parseInt(rawResultStr.slice(0, 2) * 60)
      minutes = parseInt(rawResultStr.slice(2, 4))
      minutesAway = hours + minutes
    }

    let docElem = document.createElement('tr')
    docElem.innerHTML = `
         <td>${name}</td>
         <td>${destination}</td>
         <td>${time}</td>
         <td>${frequency / 60000}</td>
         <td>${nextArrival}</td>
         <td>${minutesAway}</td>
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
    time: moment(`${document.querySelector('#time').value}`, 'HHmm').format('HHmm'),
    frequency: (document.querySelector('#frequency').value) * 60000
  })
}
