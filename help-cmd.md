# change the version number in index.html file libs/lib-jitsi-meet.min.js?v=144 && libs/app.bundle.min.js?v=144, and then commit and follow the below commands 

make
make source-package
tar -xf jitsi-meet.tar.bz2 -C /home/ubuntu/.jitsi-meet-cfg/web


# first time , execute the ./copy.sh file to move the config.js and internface-config.js file 
