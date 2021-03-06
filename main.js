// calendar
var CLIENT_ID = '368873152645-6817bgr1i23hk3aig7du1u2bu6s82o3q.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBjtLM_O5xj5ASZixVzGRkempSuZAHGymQ';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;

  });
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'inline-block';
  } else {
    authorizeButton.style.display = 'inline-block';
    signoutButton.style.display = 'none';
  }
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

// AJAX - load from txt file
function loaddata()
{
  // get details from localStorage
  var details = JSON.parse(localStorage.getItem('details'));
  //console.log(details);


  // change colors if not theme1
  if(details.theme != "1")
  {
    $('link[href="./main1.css"]').attr({href : "./main" + details.theme.replace("theme", "") + ".css"});
    $("#roomdiv").attr("class", "list-group-item list-group-item-dark");
    $("#phonediv").attr("class", "list-group-item list-group-item-secondary");
    $("#emaildiv").attr("class", "list-group-item list-group-item-dark");
    $("#p1").attr("class", "list-group-item list-group-item-dark");
    $("#p2").attr("class", "list-group-item list-group-item-secondary");
    $("#p3").attr("class", "list-group-item list-group-item-dark");
    $("#p4").attr("class", "list-group-item list-group-item-secondary");
    $(".badge").attr("class", "badge badge-dark float-right badge-pill");
  }

    var headingname, maintitle, headingtitle, email, imgsrc, room, phone;
    // AJAX calls to different files
    // name
    $.ajax({
      url:"./data/name.txt",
      success: function (data){
        //console.log(data);
        var lines = data.split('\n');

        headingname = lines[details.pos];
        $("#headingname").text(headingname);

        maintitle = headingname + " at IIT Guwahati";
        document.title = maintitle;

        initialarray = headingname.split(' ');
        initials = "";
        for(pos in initialarray)
        {
          initials += initialarray[pos].charAt(0);
        }

        $("a[class='navbar-brand']").text(initials);

        // google search for papers
        $.ajax({
          type: "POST",
          url:"./papers.php",
          data: { fullname : headingname},
          success: function (){
            console.log("added research papers.");
            $.ajax({
              url:"./data/papers.txt",
              success: function (data){
                var lines = data.split('\n');

                // remove empty strings
                for (var i = 1; i <= 4; i++)
                {
                  var linktext;
                  if(lines[i].split('*').filter(Boolean)[0].length > 75)
                  {
                    linktext = lines[i].split('*').filter(Boolean)[0].substr(0, 75) + "...";
                  }
                  else
                  {
                    linktext = lines[i].split('*').filter(Boolean)[0];
                  }

                  $('#link' + i).text(linktext);
                  $('#p' + i).attr("href", lines[i].split('*').filter(Boolean)[1]);
                }


              }
            });
        }
      });

    }
  });



    // title
    $.ajax({
      url:"./data/title.txt",
      success: function (data){
        //console.log(data);
        var lines = data.split('\n');

        headingtitle = lines[details.pos];
        $("#headingtitle").text(headingtitle);

      }
    });

    // research
    $.ajax({
      url:"./data/research.txt",
      success: function (data){
        //console.log(data);
        var lines = data.split('\n');

        $("#research").text(lines[details.pos]);

      }
    });

    // room
    $.ajax({
      url:"./data/room.txt",
      success: function (data){
      //  console.log(data);
        var lines = data.split('\n');

        room = lines[details.pos] + ", CSE Department";
        $("#room").text(room);
      }
    });

    // phone
    $.ajax({
      url:"./data/phone.txt",
      success: function (data){
      //  console.log(data);
        var lines = data.split('\n');

        phone = lines[details.pos];
        $("#phone").text(phone);

      }
    });


  email = details.webmail;
  $("#email").text(email);

  imgsrc = details.imgsrc;
  if(imgsrc != "NULL")
  {
    $("#headingimage").attr("src", "./images/" + imgsrc);
  }

  // only once calendar is loaded
  $("#calendar").one('load', function() {
  $.ajax({
    url:"./data/timet.txt",
    success: function (data){
      //console.log(data);
      var lines = data.split('\n');

      var coursename;
      for (var i = 0; i < lines.length; i++) {

        var times = lines[i].split(/\s+/);
        var coursename = times[0].trim();

        var valid = false;
        for(var property in details)
        {
            if((details.hasOwnProperty(property)) && (property.indexOf(coursename) !== -1))
            {
              //console.log(property, "and", coursename);
              if(details[property] == true)
              {
                valid = true;
                coursename = property;
                break;
              }
            }
        }

        if(!valid)
        {
        //  console.log(coursename, "not taken.");
          continue;
        }
        else
        {
        //  console.log(coursename, "taken!");
        }

        for (var j = 1; j < times.length; ++j)
        {
          if((times[j] != "NULL") && (times[j].length != 0))
          {
            // console.log(times[j]);

            var starttime = moment(times[j], 'YYYY-MM-DD HH:mm:ss').subtract(5, 'weeks').format();
            var endtime = moment(times[j], 'YYYY-MM-DD HH:mm:ss').subtract(5, 'weeks').add(1, 'hours').format();

            //console.log(starttime, endtime, coursename);
            addevent(starttime, endtime, coursename, ["RRULE:FREQ=WEEKLY;UNTIL=20180301T170000Z"]);

          }
        }
      }
    }
  });
});
};

$(document).ready(function() {loaddata();});
// date
$(function () {
                $('#datetimepicker1').datetimepicker();
            });


// hide alerts
        $("#requestmeeting").one("click", function (){
          $('#alertbox1').hide();
          $('#alertbox2').hide();
        });

        $('#alertbox1').hide();
        $('#alertbox2').hide();
// alert message

        $("#submitModal").on("hidden.bs.modal", function(){
                $('#alertbox1').hide();
                $('#alertbox2').hide();
         });

        $("#submitModal").on("show", function(){
                $('#alertbox1').hide();
                $('#alertbox2').hide();
         });

function addmeeting()
{
  var fullname = document.getElementById('fullname').value;
  var starttime = moment(document.getElementById('datetime').value, 'MM/DD/YYYY hh:mm A').format();
  var endtime = moment(document.getElementById('datetime').value, 'MM/DD/YYYY hh:mm A').add(1, 'hours').format();

  console.log(starttime, endtime);
  var rval = addevent(starttime, endtime, "Meeting with " + fullname);
  return rval;
}

function addevent(starttime, endtime, title, recurrence = [])
{
  // check if free first

  var busyquery = gapi.client.calendar.freebusy.query({
    "timeMin": starttime,
    "timeMax": endtime,
    "timeZone": "Asia/Kolkata",
    "items": [
      {
        "id": "primary"
      }
    ]
  });

  var free = false;
  busyquery.execute(function(resp) {
            if(resp.calendars.primary.busy.length > 0)
            {
              console.log("I'm busy");
              $("#alertbox1").show();
              $("#alertbox2").hide();
              return;
            }
            else {
              console.log("Free!");
              $("#alertbox1").hide();
              $("#alertbox2").show();
              free = true;
            }

            if(free)
            {
              var resource = {
                "end": {
                  "dateTime": endtime,
                  "timeZone": "Asia/Kolkata"
                },
                "start": {
                  "dateTime": starttime,
                  "timeZone": "Asia/Kolkata"
                },
                "summary": title,
                "recurrence": recurrence

              };


              var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': resource
              });

              request.execute();

              // reload calendar
              document.getElementById('calendar').src = document.getElementById('calendar').src;
              return true;
            }
        });


};
