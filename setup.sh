sudo apt-get update
sudo apt-get upgrade

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo install npm

echo "create Scripts dir"
mkdir ~/Scripts/
pwd

echo "cloning ventheure"
cd ~/Scripts/
git clone https://github.com/dcfvg/ventheure.git
cd ~/Scripts/ventheure/
npm i

echo "installing pi-blaster"
cd ~/Scripts/
git clone https://github.com/sarfata/pi-blaster.git

cd ~/Scripts/pi-blaster/

init-system-helpers autoconf

./autogen.sh
./configure
make

sudo make install
sudo ./pi-blaster

echo "change password …"
passwd

echo "installing node js"
sudo apt-get install node

