

# first ensure all changes are merged into ar-vc-develop branch , and then follow the below steps 
# always run the below steps from ar-vc-develop branch 


# change the version number in index.html file libs/lib-jitsi-meet.min.js?v=144 && libs/app.bundle.min.js?v=144, and then commit and follow the below commands 

make
make source-package
tar -xf jitsi-meet.tar.bz2 -C /home/ubuntu/.jitsi-meet-cfg/web

# Skip this step: it is for first time only, execute the ./copy.sh file to move the config.js and internface-config.js file 

# How to test development env:
# refresh the browser and test, your changes are there 
# for example : https://vc.campidev.in/test?meetingId=1&userId=1
