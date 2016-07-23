

for i in {0..9}
do
  for j in {0..9}
  do
    for k in {0..9}
    do
      mv="4=0."$i$j$k
      echo $mv
      echo $mv > /dev/pi-blaster
      sleep .1
    done
    sleep .5
  done
  sleep 1
done
