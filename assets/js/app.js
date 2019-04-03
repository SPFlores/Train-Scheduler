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
    let rawResultAbs = Math.abs(rawResult)
    let rawResultAbsStr = rawResultAbs.toString()
    let minutesAgo, nextOffset, minutesAway, nextArrival, numPrev, hours, minutes
    console.log(firstArrival.format('HHmm'))
    console.log(rawResult)

    if (rawResult < 0) {
      if (rawResultAbs >= 0 && rawResultAbs < 40) {
        minutesAgo = rawResultAbs
        nextOffset = (frequency / 60000) - minutesAgo
        nextArrival = moment().add(`${nextOffset}`, 'm')
        minutesAway = Math.floor(nextArrival.format('HHmm') - moment().format('HHmm')) - 40
      } else if (rawResultAbs > 40 && rawResultAbs < 100) {
        minutesAgo = rawResultAbs - 40
        // nextOffset = (frequency / 60000) - minutesAgo
        nextOffset = minutesAgo % (frequency / 60000)
        numPrev = Math.ceil(minutesAgo / (frequency / 60000))
        // nextArrival = firstArrival.add(`${(frequency / 60000) * numPrev}`, 'm')
        nextArrival = moment().add(`${(frequency / 60000) - nextOffset}`, 'm')
        minutesAway = Math.floor(nextArrival.format('HHmm') - moment().format('HHmm'))
      } else if (rawResultAbs >= 100 && rawResultAbs <= 959) {
        hours = parseInt(rawResultAbsStr.slice(0, 1) * 60) - 1
        minutes = parseInt(rawResultAbsStr.slice(1, 3))
        if (hours < 0) {
          minutesAgo = minutes
        } else if (hours > 0) {
          minutesAgo = hours + minutes
        }
        // nextOffset = (frequency / 60000) - minutesAgo
        nextOffset = minutesAgo % (frequency / 60000)
        // numPrev = Math.ceil(minutesAgo / (frequency / 60000))
        // nextArrival = firstArrival.add(`${(frequency / 60000) * numPrev}`, 'm')
        nextArrival = moment().add(`${(frequency / 60000) - nextOffset}`, 'm')
        minutesAway = Math.floor(nextArrival.format('HHmm') - moment().format('HHmm')) - 40
      } else if (rawResultAbs > 959) {
        hours = parseInt(rawResultAbsStr.slice(-(rawResultAbsStr.length), -2) * 60)
        minutes = parseInt(rawResultAbsStr.slice(-2, (rawResultAbsStr.length)))
        minutesAgo = hours + minutes
        nextOffset = (frequency / 60000) - minutesAgo
        numPrev = Math.ceil(minutesAgo / (frequency / 60000))
        nextArrival = firstArrival.add(`${(frequency / 60000) * numPrev}`, 'm')
        minutesAway = Math.floor(nextArrival.format('HHmm') - moment().format('HHmm')) - 40
      }
    } else if (rawResult > 0) {
      console.log(`raw result: ${rawResult}`)
      if (rawResult >= 0 && rawResult < 40) {
        minutesAgo = rawResult
        nextOffset = (frequency / 60000) - minutesAgo
        numPrev = Math.ceil(minutesAgo / (frequency / 60000))
        nextArrival = firstArrival.add(`${(frequency / 60000) * numPrev}`, 'm')
        minutesAway = Math.floor(nextArrival.format('HHmm') - moment().format('HHmm'))
      } else if (rawResult > 40 && rawResult < 100) {
        nextOffset = (frequency / 60000) - minutesAgo
        minutesAgo = rawResult - 40
        numPrev = Math.ceil(minutesAgo / (frequency / 60000))
        nextArrival = firstArrival.add(`${(frequency / 60000) * numPrev}`, 'm')
        minutesAway = Math.floor(nextArrival.format('HHmm') - moment().format('HHmm')) - 40
      } else if (rawResult >= 100 && rawResult <= 959) {
        hours = parseInt(rawResultAbsStr.slice(0, 1) * 60)
        minutes = parseInt(rawResultAbsStr.slice(1, 3))
        minutesAgo = hours + minutes
        nextOffset = (frequency / 60000) - minutesAgo
        numPrev = Math.ceil(minutesAgo / (frequency / 60000))
        nextArrival = firstArrival.add(`${(frequency / 60000) * numPrev}`, 'm')
        minutesAway = Math.floor(nextArrival.format('HHmm') - moment().format('HHmm')) - 40
      } else if (rawResult > 959) {
        hours = parseInt(rawResultAbsStr.slice(-(rawResultAbsStr.length), -2) * 60)
        minutes = parseInt(rawResultAbsStr.slice(-2, (rawResultAbsStr.length)))
        minutesAgo = hours + minutes
        nextOffset = (frequency / 60000) - minutesAgo
        numPrev = Math.ceil(minutesAgo / (frequency / 60000))
        nextArrival = firstArrival.add(`${(frequency / 60000) * numPrev}`, 'm')
        minutesAway = Math.floor(nextArrival.format('HHmm') - moment().format('HHmm')) - 40
      }
      // nextArrival = firstArrival
      // minutesAway = Math.floor(firstArrival.format('HHmm') - moment().format('HHmm')) - 40
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
    time: moment(`${(document.querySelector('#time').value)}`, 'HHmm').format('HHmm'),
    frequency: (document.querySelector('#frequency').value) * 60000
  })
}
