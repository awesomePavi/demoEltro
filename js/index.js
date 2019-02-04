// ----------------------------------------------------------------- //
// ----------------------- INDEX PAGE FUNC ------------------------- //
// ----------------------------------------------------------------- //

// ----------------------------------------------------------------- //
// --------------------------- AVERAGE ----------------------------- //
// ----------------------------------------------------------------- //
// Checks the value to see if it where it falls in the thresholds set for it
function getVarState(val, type) {
	let thresholds = GLOBALS[type];
	// Calcualte threshold pivot points 
	// [DANGER <, WARNING <, TARGET<, WARNING< >DANGER]
	let bounds = [
			thresholds[CONST_TARGET] - thresholds[CONST_DANGER],
			thresholds[CONST_TARGET] - thresholds[CONST_WARNING],
			thresholds[CONST_TARGET] + thresholds[CONST_WARNING],
			thresholds[CONST_TARGET] + thresholds[CONST_DANGER],
		]

	if(val < bounds[0]) {
		return CONST_DANGER;
	} else if(val < bounds[1]) {
		return CONST_WARNING;
	} else if(val < bounds[2]) {
		return CONST_TARGET;
	} else if(val < bounds[3]) {
		return CONST_WARNING;
	} else {
		return CONST_DANGER;
	}
}

// Updates the screen with a set of data points that it averages out
function updateAverages(data) {
	// Calc avg temp & Humidity
	let tempAvg = parseFloat(data[CONST_TEMP]).toFixed(1);
	let humidAvg = parseFloat(data[CONST_HUMID]).toFixed(2);
	let timestamp =  parseFloat(data[CONST_TIMESTAMP]);

	// Set the current Temp
	let tempUpdateTag = document.getElementById('tempUpdate');
	tempUpdateTag.innerText = `${tempAvg}°C`;

	// Check warning Status
	let tempUpdateCardTag = document.getElementById('tempUpdateCard');
	tempUpdateCardTag.classList.remove('bg-secondary');
	tempUpdateCardTag.classList.remove('bg-success');
	tempUpdateCardTag.classList.remove('bg-warning');
	tempUpdateCardTag.classList.remove('bg-danger');
	let tempWarning = getVarState(tempAvg, CONST_TEMP);
	if (tempWarning === CONST_DANGER) {
		tempUpdateCardTag.classList.add('bg-danger');
	} else if (tempWarning === CONST_WARNING) {
		tempUpdateCardTag.classList.add('bg-warning');
	} else {
		tempUpdateCardTag.classList.add('bg-success');
	}

	// Set the current Humid
	let humidUpdateTag = document.getElementById('humidUpdate');
	humidUpdateTag.innerText = `${humidAvg}%`;

	// Check warning Status
	let humidpdateCardTag = document.getElementById('humidUpdateCard');
	tempUpdateCardTag.classList.remove('bg-secondary');
	humidpdateCardTag.classList.remove('bg-success');
	humidpdateCardTag.classList.remove('bg-warning');
	humidpdateCardTag.classList.remove('bg-danger');
	let humidWarning = getVarState(humidAvg, CONST_HUMID);
	if (humidWarning === CONST_DANGER) {
		humidpdateCardTag.classList.add('bg-danger');
	} else if (humidWarning === CONST_WARNING) {
		humidpdateCardTag.classList.add('bg-warning');
	} else {
		humidpdateCardTag.classList.add('bg-success');
	}

	// Set the last updated Time
	let timeUpdateTag = document.getElementById('timeUpdate');
	const lastUpdateDate = new Date(timestamp);
	timeUpdateTag.innerText = `${lastUpdateDate.toLocaleTimeString('en-US')} - ${lastUpdateDate.toDateString()}`;

	// Check warning Status' and update time tag to reflect
	let timepdateCardTag = document.getElementById('timeUpdateCard');
	tempUpdateCardTag.classList.remove('bg-secondary');
	timepdateCardTag.classList.remove('bg-success');
	timepdateCardTag.classList.remove('bg-warning');
	timepdateCardTag.classList.remove('bg-danger');
	if (humidWarning === CONST_DANGER || tempWarning === CONST_DANGER) {
		timepdateCardTag.classList.add('bg-danger');
	} else if (humidWarning === CONST_WARNING || tempWarning === CONST_WARNING) {
		timepdateCardTag.classList.add('bg-warning');
	} else {
		timepdateCardTag.classList.add('bg-success');
	}
}

// ------------------------ ON PAGE LOAD --------------------------- //
// Perfom these tasks once document is loaded
onPageLoaded(() => {
	let currentData = {};
	getData(DB_AVERAGE, data => {
		currentData = data;
		updateAverages(currentData);
	});
	addChangeListner(DB_AVERAGE, snapshot => {
		console.log("HELLO")
		let newVal = snapshot.val()
		let keyChanged = snapshot.key;
		currentData[keyChanged] = newVal;
		updateAverages(currentData);
	});
});

onThresholdChange(() => {
	getData(DB_AVERAGE, data => {
		updateAverages(data);
	});
});

// ----------------------------------------------------------------- //
// ---------------------------- GRAPH ------------------------------ //
// ----------------------------------------------------------------- //

const GRAPHS = {};

// [labels, name, data, colours, min, max, ticks, ticks add function]
function lineGraphBuilder(graphData){
	// Set new default font family and font color to mimic Bootstrap's default styling
	Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
	Chart.defaults.global.defaultFontColor = '#292b2c';
	Chart.defaults.global.animation.duration = 500;

	return {
		type: 'line',
		data: {
			labels: graphData[0],
			datasets: [{
				label: graphData[1],
				lineTension: 0.1,
				backgroundColor: "rgba(2,117,216,0.8)",
				pointRadius: 3,
				pointBorderColor: "rgba(0,0,0,.125)",
				pointHoverRadius: 7,
				pointHoverBackgroundColor: graphData[3],
				pointHitRadius: 10,
				pointBorderWidth: 1,
				data: graphData[2],
				pointBackgroundColor:graphData[3],
				fill:false
			}],
		},
		options: {
			 layout: {
		    	padding: {
		      		top: 5,
		      		bottom: 5,
		      		right: 5
		    	}
		  	},
			tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: graphData[8]
                }
            },
			title: {
            display: true,
            text: graphData[9],
            position: 'bottom'
        	},
			scales: {
				xAxes: [{
					time: {
						unit: 'date'
					},
					gridLines: {
						display: false
					},
					ticks: {
						display: false,
					}
				}],
				yAxes: [{
					ticks: {
						min: graphData[4],
						max: graphData[5],
						maxTicksLimit: graphData[6],
						callback: graphData[7]
					},
					gridLines: {
						color: "rgba(0, 0, 0, .125)",
					}
				}],
			},
			legend: {
				display: false
        	}
		}
	}
}
function buildGraph(type) {
	let chartSetup = lineGraphBuilder([
			[], 
			type,
			[], 
			[], 
			0, 
			10, 
			10,
			function(value, index, values) {
                return `${value}${type === CONST_TEMP ? "°C" : "%"}`;
            },
            function(tooltipItems, data) { 
            	return `${tooltipItems.yLabel}${type === CONST_TEMP ? "°C" : "%"}`;
            },
            '`Last 0 hours`'
		]);

	var ctx = document.getElementById(type === CONST_TEMP ? "myTempChart" : "myHumidChart");
	return new Chart(ctx, chartSetup);
}

function reBuildGraph(arrData, arrDate, type) {
	let lowerBound = arrData[0];
	let upperBound = arrData[0];
	let pointColurs = arrData.reduce((colours, data) => {
			lowerBound =  data < lowerBound ? data : lowerBound;
			upperBound =  data> upperBound ?  data : upperBound;

			let warn = getVarState(data, type);
			if (warn === CONST_DANGER) {
				colours.push('#dc3545');
			} else if (warn === CONST_WARNING) {
				colours.push('#ffc107');
			} else {
				colours.push('#28a745');
			}
			return colours;
		}, []);

	let chartSetup = lineGraphBuilder([
			arrDate, 
			type,
			arrData, 
			pointColurs, 
			Number(lowerBound,10), 
			Number(upperBound,10), 
			10,
			function(value, index, values) {
                return `${value}${type === CONST_TEMP ? "°C" : "%"}`;
            },
            function(tooltipItems, data) { 
            	return `${tooltipItems.yLabel}${type === CONST_TEMP ? "°C" : "%"}`;
            },
            `Last ${arrDate.length} hours`
		]);

	// Updates graph with new data
	GRAPHS[type].data = chartSetup.data;
	GRAPHS[type].options = chartSetup.options;
	GRAPHS[type].update();

	// Set update time
	var timeTag = document.getElementById(type === CONST_TEMP ? "myTempDate" : "myHumidDate");
	timeTag.innerText = arrDate[arrDate.length - 1];
}

// Perfom these tasks once document is loaded
function updateGraph() {
	getLastXData(DB_GRAPH, 72, data => {
		let graphData = Object.keys(data).reduce((out, key) => {
			out[0].push(parseFloat(data[key][CONST_TEMP]).toFixed(1));
			out[1].push(parseFloat(data[key][CONST_HUMID]).toFixed(2));
			let date = new Date(parseFloat(data[key][CONST_TIMESTAMP]));
			out[2].push(`${date.toLocaleTimeString('en-US')} - ${date.toDateString()}`);
			return out;
		}, [[] ,[] ,[]]);
		let tempGraph = reBuildGraph(graphData[0], graphData[2], CONST_TEMP);
		let humidGraph = reBuildGraph(graphData[1], graphData[2], CONST_HUMID);
	});
}

function makeGraphs(){
	GRAPHS[CONST_TEMP] = buildGraph(CONST_TEMP);
	GRAPHS[CONST_HUMID] = buildGraph(CONST_HUMID);
}

onPageLoaded(() => {
	makeGraphs();
	updateGraph();
	addAddedListner(DB_GRAPH, snapshot => {
		updateGraph();
	});
});

// ------------------------ ON PAGE LOAD --------------------------- //


