// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', [ 'ionic' ]);

app.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
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
app.factory('searchService', function($http) {
	var url = 'https://www.google.com.br/search?q=marcuskbra';
	var getData = function() {
		return $http.get(url);
	};
	return {
		getData : getData
	};
});

app.controller('BackgroundController', function($scope, searchService) {

	$scope.buscar = function() {
		console.log('buscando...');
		searchService.getData().then(function successCallback(response) {
			// this callback will be called asynchronously when the response is
			// available
			console.log(response);
		}, function errorCallback(response) {
			// called asynchronously if an error occurs or server returns
			// response with an error status.
			console.error(response);
		});
	};

	document.addEventListener('deviceready', function() {
		// Enable background mode
		cordova.plugins.backgroundMode.enable();
		var timer;
		// Called when background mode has been activated
		cordova.plugins.backgroundMode.onactivate = function() {
			var counter = 0;

			timer = setInterval(function() {
				counter = counter + 5;

				console.log('Running since ' + counter + ' sec');
				$scope.buscar();
				if (device.platform != 'Android') {
					cordova.plugins.notification.badge.set(counter);
				}

				if (counter % 15 === 0) {
					cordova.plugins.backgroundMode.configure({
						text : 'Running since ' + counter + ' sec'
					});
				}
			}, 5000);
		};

		cordova.plugins.backgroundMode.ondeactivate = function() {
			clearInterval(timer);
			if (device.platform != 'Android') {
				cordova.plugins.notification.badge.clear();
			}
		};
	}, false);
});