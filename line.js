var config = {
    apiKey: "API-KEY",
    databaseURL: "database-url",
    projectId: "project-id",
    storageBucket: "gs://project-id",
    messagingSenderId: "Semiu"
  };
  firebase.initializeApp(config);


var newMark = new google.maps.Marker;
var semGoecode = new google.maps.Geocoder();

//get the user current location

function getloc(){
    
    if (navigator.geolocation)
    {navigator.geolocation.getCurrentPosition(showPosition);
    
    }
    else
    {//latsem.value ="Geolocation N/A";
}
    
    function showPosition(pos)
    {
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
    
    semGoecode.geocode({location: pos}, function(results, status){
            yourArea.value = results[1].formatted_address;
        });
        var mapOpt= {zoom: 7, center: new google.maps.LatLng(lat, lon)};
map = new google.maps.Map(document.getElementById('map-canvas'), mapOpt);
    }//end showposition

    //loading existing db

    loadFromDb();
    
    } //end getloc


    //saving food location info
    function saveData(){
        var area = yourArea.value;
        var oga = officer.value;
        var tele = phone.value;
        var foods = items.value;
        var thisDay = new Date();
        thisDay = thisDay.toDateString();
        
        var db = firebase.database();
        
        if ((area.length > 1) && (oga.length >1) && (foods.length > 1)){
            
            var ask = confirm("Save this to database");
            if (ask){
                //something here
                //alert("correct!");
                ourDB = db.ref("FOODS");
                ourDB.push({
                    'LOCATION': area,
                    'OFFICER':oga,
                    'CONTACT': tele,
                    'FOODS':foods,
                    'DATE_ADDED': thisDay
                }).then(function(){
                    alert("Success");
                });
            }
            
        }
        else{
            alert("Wrong data! Please check");
        }
    }

    //load from databade

    function loadFromDb(){
        var db = firebase.database();
        var ourDb = db.ref("FOODS");
        ourDb.on("child_added", function(snapshot){
            if (snapshot.val() != null){
                var np = snapshot.val();
                showTable(np.DATE_ADDED,np.LOCATION, np.OFFICER, np.CONTACT, np.FOODS);
            }
        }); 
    }

    //show the table
    function showTable(dt, loc, officer, phone, foods){
        var ls = "<tr><td>" + dt + "</td>";
        ls += "<td>" + loc + "</td>";
        ls += "<td>" + officer + "</td>";
        ls += "<td>" + phone + "</td>";
        ls += "<td>" + foods + "</td>";
        ls += "</tr>";

        resList.innerHTML += ls;
    }

    //update db

    function update(id){
        var x = document.getElementById(id).value;
        if (x.length > 1){
            var ask = confirm("This action will Change the Food items available in database?");
            if (ask){
                var db = firebase.database();
                db.ref("FOODS/" + id).update({
                    FOODS: x
                }).then(function(){
                    alert ("Updated. Refresh the page to see update.");
                });
            
            }
            
        }
        
    }
