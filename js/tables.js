// firebase refrence to Days that were COLLECTED
const daysRef = firebase.database().ref('/').child('DEMOR0/DATA/COLLECTED');
// on load the default limit table row limit
var limit = 10;

var dataa = [];

// date formating function, will return : MM/DD/YYYY/ - H:M:S am/pm
function print_formatDate(date) {
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear()
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ms = date.getMilliseconds()
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    seconds = seconds < 10 ? '0'+seconds : seconds;
    var strTime = hours + ':' + minutes + ':' + seconds + " " + ampm + " - " + ms;
    var strDate = month + "/" + day + "/" + year + "/"
    return strDate + " - " + strTime;
}

// add time stamp temperature and humidity row to html tbody with tbody id: tableid
// data in JSON fomat coming from firebase
function addToTable(tableid, data){
    // table = document.getElementById(tableid);
    table = document.getElementById(tableid).getElementsByTagName('tbody')[0];
    date = new Date(parseFloat(data[CONST_TIMESTAMP]));
    time = print_formatDate(date);
    temp = `${data[CONST_TEMP]}°C`;
    hum = `${data[CONST_HUMID]}%`;

    addRow(table,time,temp,hum);
}

// genaric add row function to be called from addToTable
// string table
// string timestamp
// string info to insert to row
function addRow(table, time, temp, hum){

    // Insert a row in the table at the first row
    var newRow   = table.insertRow(0);

    // Insert a cell in the row at index 0
    var newCell0  = newRow.insertCell(0);
    var newCell1 = newRow.insertCell(1);
    var newCell2 = newRow.insertCell(2);

    // Append a text node to the cell
    newCell0.appendChild(document.createTextNode(time));
    newCell1.appendChild(document.createTextNode(temp));
    newCell2.appendChild(document.createTextNode(hum));
}



// function that will:
// 1. get all the days with data from firebase.
// 2. insert them as options for dropdown
// 3. load rows on latest day
function getAvailableDays(){
    // This ref points to dbRef from data.js currently set to firebase.database().ref('/').child('museum');
    daysRef.on('value', function(snapshot) {
        var dropdown = document.getElementById("select_dataTable_length");
        var keyArr = [];
        for (var key in snapshot.val()) {
            keyArr.push(String(key));
        }
        for (var i=keyArr.length-1; i>=0;i--) {
            var option = document.createElement("option");
            option.text = keyArr[i];
            option.value = keyArr[i];
            dropdown.add(option, dropdown[-1]);
        }

           // get day selected
        var day = document.getElementById("select_dataTable_length").value;

            // Take the  Date and split it into YYYY-MM-DD format for DB
        const currentDate = (typeof day) === "string" ? day : formatDate(day); 
        const dbRefToday = `${DB_DATA}/${currentDate}`;
        console.log(dbRefToday)
        addAddedListner(dbRefToday, (a) => {
            console.log(a.val())
            dataa.pop();
            dataa.splice(0, 0, a.val());
            setTable();
            console.log(dataa)
        })

        getLatestXFromDay(keyArr[keyArr.length-1],limit, data => {
            dataa = data;
            console.log(dataa)
            setTable();
        });
    });
}

function setTable() {
    document.getElementById("tempDataTableBody").innerHTML = "";
    Object.keys(dataa).reverse().forEach(key => {
        addToTable("tempDataTable", dataa[key]);
    })
}

// onload need to watch for 2 inputs for "onchange events"
function start(){
      document.getElementById("select_dataTable_length").addEventListener("change", addActivityItem, false);
      document.getElementById("inputLimit").addEventListener("change", changeLimit, false);
}

// when user updates the limit feild , refresh the table
function changeLimit(){
    limit = parseInt(document.getElementById("inputLimit").value);
    addActivityItem();

}

// when the day is changed refresh the table
function addActivityItem(){
    console.log("HI")
    //option is selected
    // clear tbody
    document.getElementById("tempDataTableBody").innerHTML = "";
    // get day selected
    var day = document.getElementById("select_dataTable_length").value;

        // Take the  Date and split it into YYYY-MM-DD format for DB
    const currentDate = (typeof day) === "string" ? day : formatDate(day); 
    const dbRefToday = `${DB_DATA}/${currentDate}`;
    console.log(dbRefToday)
    addAddedListner(dbRefToday, (a) => {
        console.log(a)
    })

    // re-fill table with new data
    getLatestXFromDay(day ,limit, data => {
    	Object.keys(data).reverse().forEach(key => {
          addToTable("tempDataTable", data[key]);
    	})
    });
}


// MAIN
getAvailableDays();
window.addEventListener("load", start, false);
