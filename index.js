var curl = require('curlrequest');
var fs = require('fs');
var xmlparser = require('xml-parser');

var current_timestamp = "";
var check_interval = 0;

function check_timestamp()
{
    var xml = "";
    var json = "";
    curl.request('http://outagemap.duke-energy.com/data/ncsc/external/customlayers/informationpoint/metadata.xml', function(err, stdout) {
        xml = stdout;
        json = xmlparser(xml);
        if (current_timestamp !== json.root.children[0].content) {
            current_timestamp = json.root.children[0].content;

            console.log("Fetching new data from server...");
            fs.appendFile("intervals.log", current_timestamp + "\n");
            setTimeout(function() {
                // wait a minute, sometimes they haven't updated their data urls yet
                get_latest_data();
            }, 60000 * 2);

        } else {
            console.log("Up to date. Waiting...");
        }
    });
}

function get_latest_data()
{
    var report_data = curl.request('http://outagemap.duke-energy.com/data/ncsc/external/interval_generation_data/' + current_timestamp + '/report.js', function(err, stdout) {
        fs.writeFile('data/report_' + current_timestamp + '.json', stdout);
        console.log("Writing report data for " + current_timestamp + ".");
    });

    var piedmont_data = curl.request('http://outageviewer.pemc.org:88/api/weboutageviewer/get_live_data?Start=&End=&Duration=0&CustomerResponsible=false&Historical=false', function(err, stdout) {
        fs.writeFile('data/piedmont_' + current_timestamp + '.json', stdout);
        console.log("Writing piedmont data for " + current_timestamp + ".");
    });

    var data_data = curl.request('http://outagemap.duke-energy.com/data/ncsc/external/interval_generation_data/' + current_timestamp + '/data.js', function(err, stdout) {
        fs.writeFile('data/data_' + current_timestamp + '.json', stdout);
        console.log("Writing master data for " + current_timestamp + ".");
    });

    var map_data = curl.request('http://outagemap.duke-energy.com/data/ncsc/external/interval_generation_data/' + current_timestamp + '/outages/032003.js', function(err, stdout) {
        fs.writeFile('data/map_' + current_timestamp + '.json', stdout);
        console.log("Writing map data for " + current_timestamp + ".");
    });
}

check_timestamp();

check_interval = setInterval(function() {
    check_timestamp();
}, (60000 * 5)); // check every 5 minutes
