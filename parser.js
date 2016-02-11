var fs = require('fs');
var file = require('file');
var _ = require('lodash');

var global_json = [];

function parse(file)
{
    var data = fs.readFileSync('data/'+file);

    // parse json
    var json = JSON.parse(data);
    var counties = json.file_data.curr_custs_aff.areas[0].areas;
    var time = file.replace('report_', '').replace('.json', '');
    var time_split = time.split('_');
    var year = time_split[0];
    var month = time_split[1];
    var day = time_split[2];
    var hours = time_split[3];
    var minutes = time_split[4];
    var seconds = time_split[5];
    var local_json = [];

    // filter SC counties
    counties = _.filter(counties, function(obj) { return obj.area_name.search('SC-') === -1 });

    _.each(counties, function(c) {
        var nice_name = c.area_name.replace('NC-', '').toLowerCase();
        var nice_split = nice_name.split(' ');
        for (var i in nice_split) {
            nice_split[i] = nice_split[i].charAt(0).toUpperCase() + nice_split[i].substr(1);
        }
        nice_name = nice_split.join(' ');
        local_json.push({
            "name": nice_name,
            "outages": c.custs_out,
            "total": c.total_custs
        });
    });

    global_json.push({
        "year": year,
        "month": month,
        "day": day,
        "hour": hours,
        "minute": minutes,
        "second": seconds,
        "counties": local_json
    });
}

fs.readdir('data', function(err, items) {
    var items = _.filter(items, function(str) { return str.search('report') > -1 });

    for(var i in items) {
        parse(items[i]);
    }

    console.log(global_json);

    fs.writeFile('county_data.json', JSON.stringify(global_json, null, 2));
});
