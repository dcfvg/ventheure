
for i in {0..9}
do
  for j in {0..9}
  do
    for k in {0..9}
    do
      mv="$1=0."$i$j$k
      echo $mv
      echo $mv > /dev/pi-blaster
      sleep .1
    done
    sleep .5
  done
  sleep 1
done

trap onexit SIGINT
trap onexit SIGTERM

function onexit {
    echo -en "\n## Caught SIGINT; Clean up and Exit \n"
    echo "$1=0" > /dev/pi-blaster
    exit $?
}