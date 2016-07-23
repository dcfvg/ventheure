# ventheure
![](https://raw.githubusercontent.com/dcfvg/ventheure/master/ventheure.jpg)

A clock displaying the wind direction.

[Nuno da Luz](http://www.nunodaluz.com) & [benoît verjat](http://dcfvg.com)

## notes

A Raspberry Pi connects to the web and …
- get the wind direction from an API (max 3 call per sec.)
- move the clock hands using a step motors.

#### building api query

| location                        | API url                                                                     |
| ------------------------------- | --------------------------------------------------------------------------- |
| Paris                           | `http://api.wunderground.com/api/[api-Key]/conditions/q/France/Paris.json`  |
| Madrid                          | `http://api.wunderground.com/api/[api-Key]/conditions/q/Spain/Madrid.json`  |
| Paris Charles de Gaulle airport | `http://api.wunderground.com/api/[api-Key]/conditions/q/LFPG.json`          |
| Lisbon airport                  | `http://api.wunderground.com/api/[api-Key]/conditions/q/LFPG.json`          |

find stations : https://www.wunderground.com/wundermap

#### find Raspberry Pi on local network
`sudo nmap -sP 192.168.1.0/24 | awk '/^Nmap/{ip=$NF}/B8:27:EB/{print ip}'`

#### Raspberry Pi SD cloning for mac
http://ivanx.com/raspberrypi/

#### crontab 
```
@reboot /usr/local/bin/node /home/pi/Scripts/custom/ventheure/ventheure.js --test=true >/dev/null 2>&1
*/5 * * * * /usr/local/bin/node /home/pi/Scripts/custom/ventheure/ventheure.js >/dev/null 2>&1
* */6 * * * /usr/bin/git reset --hard prod && /usr/bin/git --git-dir=/home/pi/Scripts/custom/ventheure/.git pull origin prod >/dev/null 2>&1
```


