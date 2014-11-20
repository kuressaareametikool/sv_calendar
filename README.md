### About

This project provides easy access to teachers iCal feeds.

### Installation

It's required you have NodeJS installed. Then run

	  npm install

To run the server:

	  node server.js

To run the server in non-default port, run:

	  node server.js -p portnumber


### Run the server as a background process

Run these commands:

    sudo mkdir /var/log/sv_calendar
    nano /etc/supervisor/conf.d/sv_calendar.conf

Paste this in:

    [program:sv_calendar]
    command=/usr/bin/node INSERT-THE-SCRIPT-LOCATION/server.js
    directory=INSERT-THE-SCRIPT-LOCATION
    autostart=true
    autorestart=true
    startretries=3
    stderr_logfile=/var/log/sv_calendar/nodehook.err.log
    stdout_logfile=/var/log/sv_calendar/nodehook.out.log
    user=www-data

Then run

    supervisorctl reread
    supervisorctl update

See also this [Supervisord](https://serversforhackers.com/editions/2014/08/12/process-monitoring) guide.
