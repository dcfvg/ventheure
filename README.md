# ventheure
![](https://raw.githubusercontent.com/dcfvg/ventheure/master/ventheure.jpg)

A clock displaying the wind direction.



[Nuno da Luz](http://www.nunodaluz.com) & [benoît verjat](http://dcfvg.com)


**technical details**

A Raspberry Pi connects to the web and …

- get the wind direction from an API (max 3 call per sec.)
- move the clock hands using a step motors.

**reminders**
find raspberry on local network
`sudo nmap -sP 192.168.1.0/24 | awk '/^Nmap/{ip=$NF}/B8:27:EB/{print ip}'`

