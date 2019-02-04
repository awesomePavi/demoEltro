// ----------------------------------------------------------------- //
// ------------------------ ALL PAGE FUNC -------------------------- //
// ----------------------------------------------------------------- //
const CONST_HUMID = 'HUMID';
const CONST_TEMP = 'TEMP';
const CONST_DANGER = 'DANGER';
const CONST_TARGET = 'TARGET';
const CONST_WARNING = 'WARNING';


const CONST_TIMESTAMP = 'TIMESTAMP';


const GLOBALS = {
	'TEMP':  {
		'DANGER': 20,
		'TARGET': 50,
		'WARNING':10
	}, 'TEMP': {
		'DANGER': 5,
		'TARGET': 20,
		'WARNING':2
	}
}
// Used to execute functions on page load
const executeOnLoadStack = [];
function onPageLoaded(func) {
	executeOnLoadStack.push(func);
}

function executePageLoaded() {
	executeOnLoadStack.forEach(func => {
		func();
	});
}


// ----------------------------------------------------------------- //
// -------------------------- Threshold ---------------------------- //
// ----------------------------------------------------------------- //

// Pulls the current threshold data from the DB (Used on Index and Settings pages)
function getThresholdData() {
	console.log('d')
	const extractThresholdData = (data) => {
		let thresholds = [CONST_HUMID, CONST_TEMP];
		thresholds.forEach(type => {
			// Make sure globals exist if not add them
			GLOBALS[type] = !!GLOBALS[type] ? GLOBALS[type] : {};		

			let levels = [CONST_DANGER, CONST_TARGET, CONST_WARNING];
			if(!!data[type]) {
				levels.forEach(level => {
					if(!!data[type][level]) {
						GLOBALS[type][level] = parseFloat(data[type][level])	
					}
				});
			}
		});
		executeOnThresholdChanged();
	}

	getData(DB_THRESHOLD, extractThresholdData, () => {});

	addChangeListner(DB_THRESHOLD, () => {
		getData(DB_THRESHOLD, extractThresholdData);
	});
}

const executeOnThresholdChange = [];
function onThresholdChange(func) {
	executeOnThresholdChange.push(func);
}

function executeOnThresholdChanged() {
	executeOnThresholdChange.forEach(func => {
		func();
	});
}


// ----------------------------------------------------------------- //
// --------------------------- Helpers ----------------------------- //
// ----------------------------------------------------------------- //

// Date --> YYYY-MM-DD
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear().toString().substring(2);

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('-');
}



onPageLoaded(getThresholdData);