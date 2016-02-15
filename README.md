# ionic-test
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add https://github.com/katzer/cordova-plugin-background-mode.git
cordova plugin add cordova-plugin-whitelist

ionic platform add android

ionic build android

ionic run android -l -c -s

ionic serve android -l -c -s
