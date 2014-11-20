var fs = require('fs')
var os = require("os");

var request = require('request')
var moment  = require('moment')
var icalendar = require('icalendar')
var async = require('async')
var express = require('express');
var app = express();

var base_url = 'https://siseveeb.ee/ametikool/veebilehe_andmed/tunniplaan'

var weeks_future = 8
var weeks_past = 8

var port = (process.argv[2] == '-p' && process.argv[3]) ? process.argv[3] : 8000

app.get('/teacher/:teacher_id/ical', function(req, res) {

  var ical = new icalendar.iCalendar();
  var urls = []
    
  for (var i = 0; i < (weeks_past + weeks_future + 1); i++) {
   
    var week = moment().day(1).subtract(weeks_past, 'w').add(i, 'w').format('YYYY-MM-DD')
    urls.push(base_url + '?nadal=' + week + '&opetaja=' + req.params.teacher_id)

  }

  async.eachSeries(urls, function(url, cb) {

    request({url: url, json: true}, function(e, r, data) {

      for (var key in data.tunnid) {

        data.tunnid[key].forEach(function(el) {

        var event = ical.addComponent('VEVENT');
     
        var start = moment(key + ' ' + el.algus).toDate()
        var end = moment(key + ' ' + el.lopp).toDate()

        event.setSummary(el.aine)
        event.setDescription(el.grupp + ' ' + el.ruum)
        event.setDate(start, end);
        
        })

      }

      cb()

    })

  }, function(err) {

// res.set('Content-Type', 'text/calendar');
   res.send(ical.toString())

  })


})


app.get('/', function(req, res) {

  var week = moment().format('YYYY-MM-DD')
  var url = 'https://siseveeb.ee/ametikool/veebilehe_andmed/tunniplaan?nimekiri=opetaja&nadal=' + week
 
  request({url: url, json: true}, function(e, r, data) {
 
    var html = fs.readFileSync('./index.html', {encoding: 'utf8'})
    for(var key in data.opetaja) {
      var teacher = data.opetaja[key].split(', ').reverse().join(' ')
      html += '<a href="/teacher/' + key + '/ical">' + teacher + '</a><br />'
    }
    html += '</article></body></html>'
    res.send(html)
 
  })

})


app.listen(port);

console.log('Server is running at http://' + os.hostname() + ':' + port)