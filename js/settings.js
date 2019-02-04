// ----------------------------------------------------------------- //
// --------------------- SETTINGS PAGE FUNC ------------------------ //
// ----------------------------------------------------------------- //
const validToSubmit = {};
validToSubmit[CONST_TEMP] = [false, false, false],
validToSubmit[CONST_HUMID] = [false, false, false]

function populateForm() {
	let tempCurTar = document.getElementById('tempCurTar');
	let tempCurWarn = document.getElementById('tempCurWarn');
	let tempCurDanger = document.getElementById('tempCurDanger');

	tempCurTar.innerText = GLOBALS[CONST_TEMP][CONST_TARGET];
	tempCurWarn.innerText = GLOBALS[CONST_TEMP][CONST_WARNING];
	tempCurDanger.innerText = GLOBALS[CONST_TEMP][CONST_DANGER];

	let humidCurTar = document.getElementById('humidCurTar');
	let humidCurWarn = document.getElementById('humidCurWarn');
	let humidCurDanger = document.getElementById('humidCurDanger');

	humidCurTar.innerText = GLOBALS[CONST_HUMID][CONST_TARGET];
	humidCurWarn.innerText = GLOBALS[CONST_HUMID][CONST_WARNING];
	humidCurDanger.innerText = GLOBALS[CONST_HUMID][CONST_DANGER];
}

function checkForValidForms() {
	const tempSubmit = document.getElementById('tempSubmit');
	const humidSubmit = document.getElementById('humidSubmit');
	const checkTypes = [CONST_TEMP, CONST_HUMID];

	checkTypes.forEach(type => {
		let passed = validToSubmit[type].reduce((valid, check) => {
			return !check ? false : valid;
		}, true)
		if (passed) {
			(type === CONST_TEMP ? tempSubmit : humidSubmit).setAttribute('class', 'btn btn-primary');
		} else {
			(type === CONST_TEMP ? tempSubmit : humidSubmit).setAttribute('class', 'btn btn-secondary disabled');
		}
	});
}

function addInputValidators() {
	let tempNewTar = document.getElementById('tempNewTar');
	let tempNewWarn = document.getElementById('tempNewWarn');
	let tempNewDanger = document.getElementById('tempNewDanger');

	tempNewTar.addEventListener('change', () => {
		if(tempNewTar.value >= 17 && tempNewTar.value <= 27) {
			validToSubmit[CONST_TEMP][0] = true;
		} else {
			validToSubmit[CONST_TEMP][0] = false;
		}
		checkForValidForms();
	}, false);

	tempNewWarn.addEventListener('change', () => {
		if(tempNewWarn.value >= 0 && tempNewWarn.value <= 10) {
			validToSubmit[CONST_TEMP][1] = true;
		} else {
			validToSubmit[CONST_TEMP][1] = false;
		}
		checkForValidForms();
	}, false)

	tempNewDanger.addEventListener('change', () => {
		if(tempNewDanger.value >= 0 && tempNewDanger.value <= 20) {
			validToSubmit[CONST_TEMP][2] = true;
		} else {
			validToSubmit[CONST_TEMP][2] = false;
		}
		checkForValidForms();
	}, false)

	let humidNewTar = document.getElementById('humidNewTar');
	let humidNewWarn = document.getElementById('humidNewWarn');
	let humidNewDanger = document.getElementById('humidNewDanger');

	humidNewTar.addEventListener('change', () => {
		if(humidNewTar.value >= 0 && humidNewTar.value <= 200) {
			validToSubmit[CONST_HUMID][0] = true;
		} else {
			validToSubmit[CONST_HUMID][0] = false;
		}
		checkForValidForms();
	}, false);

	humidNewWarn.addEventListener('change', () => {
		if(humidNewWarn.value >= 0 && humidNewWarn.value <= 200) {
			validToSubmit[CONST_HUMID][1] = true;
		} else {
			validToSubmit[CONST_HUMID][1] = false;
		}
		checkForValidForms();
	}, false)

	humidNewDanger.addEventListener('change', () => {
		if(humidNewDanger.value >= 0 && humidNewDanger.value <= 200) {
			validToSubmit[CONST_HUMID][2] = true;
		} else {
			validToSubmit[CONST_HUMID][2] = false;
		}
		checkForValidForms();
	}, false)
}


function updateHumid(){
	let humidNewTar = document.getElementById('humidNewTar');
	let humidNewWarn = document.getElementById('humidNewWarn');
	let humidNewDanger = document.getElementById('humidNewDanger');

	let newSettings = {};
	newSettings[CONST_TARGET] = humidNewTar.value;
	newSettings[CONST_WARNING] = humidNewWarn.value;
	newSettings[CONST_DANGER] = humidNewDanger.value;

	setData(`${DB_THRESHOLD}/${CONST_HUMID}`, newSettings, () => {
		window.location.href = "./settings.html";
	});
}

function updateTemp(){
	let tempNewTar = document.getElementById('tempNewTar');
	let tempNewWarn = document.getElementById('tempNewWarn');
	let tempNewDanger = document.getElementById('tempNewDanger');

	let newSettings = {};
	newSettings[CONST_TARGET] = tempNewTar.value;
	newSettings[CONST_WARNING] = tempNewWarn.value;
	newSettings[CONST_DANGER] = tempNewDanger.value;

	setData(`${DB_THRESHOLD}/${CONST_TEMP}`, newSettings, () => {
		window.location.href = "./settings.html";
	});
}
// ------------------------ ON PAGE LOAD --------------------------- //


onThresholdChange(() => {
	populateForm();
});


// Perfom these tasks once document is loaded
onPageLoaded(() => {
	addInputValidators();
	getThresholdData();
});


