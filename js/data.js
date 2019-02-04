// ----------------------------------------------------------------- //
// ------------------------- ALL FIREBASE -------------------------- //
// ----------------------------------------------------------------- //
var config = {
    apiKey: "AIzaSyCuKfJGnjpKBpunbEQfH5_sKZ-8gwH8kF8",
    authDomain: "capstone-b3077.firebaseapp.com",
    databaseURL: "https://capstone-b3077.firebaseio.com",
    projectId: "capstone-b3077",
    storageBucket: "capstone-b3077.appspot.com",
    messagingSenderId: "294689120202"
};
firebase.initializeApp(config);

const DB_MAIN_DIR = "DEMOR0";
const DB_DATA = "DATA";
const DB_AVERAGE = "AVERAGE";
const DB_GRAPH = "GRAPHDATA";
const DB_THRESHOLD = "THRESHOLD";



// Museum Data
const dbRef = firebase.database().ref('/').child('DEMOR0');


function setData(location, data, callback) {
	const dbRef= firebase.database().ref(`/${DB_MAIN_DIR}/${location}`);
	dbRef.set(data, callback);
}

// Retrieves the latest x data from the latest date from the museum database
function getData(location, callback) {
	const dbRef= firebase.database().ref(`/${DB_MAIN_DIR}/${location}`);
	// Get Current Data - will needed to be updated for a sitaution where < x in cur day
	dbRef.once("value", snapshot => {
		if(!snapshot.val()) {
	  		callback(-1);
	  	} else {
	  		callback(snapshot.val());
		}
	});
}

// Retrieves the latest x data from the latest date from the museum database
function getLastXData(location, x, callback) {
	const dbRef= firebase.database().ref(`/${DB_MAIN_DIR}/${location}`);
	// Get Current Data - will needed to be updated for a sitaution where < x in cur day
	dbRef.limitToLast(x).once("value", snapshot => {
		if(!snapshot.val()) {
	  		callback(-1);
	  	} else {
	  		callback(snapshot.val());
		}
	});
}


function addChangeListner(location, callback) {
	const dbRef= firebase.database().ref(`/${DB_MAIN_DIR}/${location}`);

	// Adds a listner to be called when a child changes
	dbRef.on("child_changed", callback);
}

function addAddedListner(location, callback) {
	const dbRef= firebase.database().ref(`/${DB_MAIN_DIR}/${location}`);

	// Adds a listner to be called when a child is added
	dbRef.limitToLast(1).on("child_added", callback);
}

// ----------------------------------------------------------------- //
// ------------------------- FB HELPERS ---------------------------- //
// ----------------------------------------------------------------- //
// Retrieves the latest x data from the latest date from the museum database
function getLatestX(x, callback) {
	const dbRef= firebase.database().ref(`/${DB_MAIN_DIR}/${DB_DATA}`);

	// Once the latest entry from the museum database is retrieved
	function onValue(snapshot) {
		dbRef.limitToLast(1).off("value", onValue);
		if(!snapshot.val()) {
	  		callback(-1);
	  	} else {
	  		curDay = Object.keys(snapshot.val())[0];
			getLatestXFromDay(curDay, x, callback)
		}
	}

	// Get Current Data - will needed to be updated for a sitaution where < x in cur day
	dbRef.limitToLast(1).on("value", onValue);
}

// Retrieves the latest X entried from the specified date
function getLatestXFromDay(date, x, callback) {
	// Take the  Date and split it into YYYY-MM-DD format for DB
	const currentDate = (typeof date) === "string" ? date : formatDate(date); 
	const dbRefToday = firebase.database().ref(`/${DB_MAIN_DIR}/${DB_DATA}/`).child(currentDate);

	function onValue(snapshot) {
		dbRefToday.limitToLast(x).off("value", onValue);
		if(!snapshot.val()) {
	  		callback(-1);
	  	} else {
			//  Convert key:data --> Arr[data] sorted new --> old 
			const fromDB = snapshot.val();
			let organized = [];
			Object.keys(fromDB).reverse().forEach(key => {
				organized.push(fromDB[key]);
			})	
			callback(organized);
		}
	}

	// Get Current Data - will needed to be updated for a sitaution where < x in cur day
	dbRefToday.limitToLast(x).on("value", onValue);
}