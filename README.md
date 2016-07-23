# ventheure
![](https://raw.githubusercontent.com/dcfvg/ventheure/master/ventheure.jpg)

A clock displaying the wind direction.



[Nuno da Luz](http://www.nunodaluz.com) & [benoît verjat](http://dcfvg.com)



### notes

A Raspberry Pi connects to the web and …
- get the wind direction from an API (max 3 call per sec.)
- move the clock hands using a step motors.

**find raspberry**
`sudo nmap -sP 192.168.1.0/24 | awk '/^Nmap/{ip=$NF}/B8:27:EB/{print ip}'`

**crontab** 
```
@reboot /usr/local/bin/node /home/pi/Scripts/custom/ventheure/ventheure.js --test=true >/dev/null 2>&1
*/5 * * * * /usr/local/bin/node /home/pi/Scripts/custom/ventheure/ventheure.js >/dev/null 2>&1
* */6 * * * /usr/bin/git reset --hard prod && /usr/bin/git --git-dir=/home/pi/Scripts/custom/ventheure/.git pull origin prod >/dev/null 2>&1
```


