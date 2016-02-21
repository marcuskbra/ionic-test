// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic']);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the
            // accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It
            // stops the viewport
            // from snapping when text inputs are focused. Ionic handles this
            // internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
var url = 'https://www.google.com.br/#q=john+steel';
app.factory('searchService', function ($http) {
    var getData = function () {
        return $http.get(url);
    };
    return {
        getData: getData
    };
});

app.controller('BackgroundController', function ($scope, searchService) {

    $scope.buscar = function () {
        console.log('buscando...');

        var ref = cordova.InAppBrowser.open(url, '_blank', 'hidden=yes');
        ref.addEventListener('loadstart', function (event) {
            console.log('loading...');
            console.log(event);
        });
        ref.addEventListener('loadstop', function (event) {
            console.log('loaded!');
            console.log(event);
            //TODO: estudar maneira de injetar o script do jQuery
            ref.executeScript({
                code: "document.body.innerHTML"
            }, function (values) {
                console.log('execScript callback: ' + values.length);
                //				for (var i = 0; i < values.length; i++) {
                //					console.log(' --------- ');
                //					console.log(values[i]);
                //				}
            });
        });

        /*
         * searchService.getData().then(function successCallback(response) { //
         * this callback will be called asynchronously when the response is //
         * available console.log(response); }, function errorCallback(response) { //
         * called asynchronously if an error occurs or server returns //
         * response with an error status. console.error(response); });
         */
    };

    var myService;

    document.addEventListener('deviceready', function () {
        var serviceName = 'com.MyService';
        var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService')
        myService = factory.create(serviceName);

        go();

    }, true);

    function getStatus() {
        myService.getStatus(function (r) {
            displayResult(r);
        }, function (e) {

            displayError(e);
        });
    }

    function displayResult(data) {
        alert("Is service running: " + data.ServiceRunning);
    }

    function displayError(data) {
        alert("We have an error");
        for (var prop in data) {
            // skip loop if the property is from prototype
            //if (!data.hasOwnProperty(prop)) continue;

            // your code
            console.error(prop + " = " + data[prop]);
        }

    }

    function updateHandler(data) {
        if (data.LatestResult != null) {
            try {
                var resultMessage = document.getElementById("resultMessage");
                resultMessage.innerHTML = data.LatestResult.Message;
                console.log('Executando callback do servico rodando em background: ' + data.LatestResult.Message);
                $scope.buscar();
            } catch (err) {
            	console.error(err);
            }
        }
    }

    function go() {
        myService.getStatus(function (r) {
            startService(r)
        }, function (e) {
            displayError(e)
        });
    };

    function startService(data) {
        if (data.ServiceRunning) {
            enableTimer(data);
        } else {
            myService.startService(function (r) {
                enableTimer(r)
            }, function (e) {
                displayError(e)
            });
        }
    }

    function enableTimer(data) {
        if (data.TimerEnabled) {
            registerForUpdates(data);
        } else {
            myService.enableTimer(10000, function (r) {
                registerForUpdates(r)
            }, function (e) {
                displayError(e)
            });
        }
    }

    function registerForUpdates(data) {
        if (!data.RegisteredForUpdates) {
            myService.registerForUpdates(function (r) {
                updateHandler(r)
            }, function (e) {
                handleError(e)
            });
        }
    }



});