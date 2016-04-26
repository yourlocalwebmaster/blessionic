angular.module('bless.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, Restangular) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
.controller('LoginSplashCtrl',function($scope,$state,$localStorage, Restangular){
  $scope.$on('$ionicView.enter', function(e) {
    if($localStorage.token){
        $state.go('app.home'); // There has to be a faster way to do this.. Maybe hide form until check? progress bar? etc...
    }
  });

    $scope.processLogin = function(){
        Restangular.setBaseUrl('http://52.27.157.158/api/v1/');
        var payload = {"password":this.password,"email":this.email};
        Restangular.all('user/login').post(payload).then(function(response){
            if(response.status){
                $localStorage.token = response.token;
                $state.go('app.home');
            }else{
                $scope.error = response.message;
            }
        });
    };


})
.controller('HomeCtrl', function($scope,$state,$localStorage, Restangular,$ionicPlatform){
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.myevents = true;
    $scope.myjoinedevents = false;
    $ionicPlatform.ready(function() {
        var swiper = new Swiper('.swiper-container', {
            //pagination: '.swiper-pagination',
            slidesPerView: 4,
            centeredSlides: true,
            paginationClickable: false,
            spaceBetween: 30,
            freeMode: false,
            loop: true
        });
        console.log('upd');
        Restangular.setBaseUrl('http://52.27.157.158/api/v1/');
        var User = Restangular.one('user/account');
        User.get({'token':$localStorage.token}).then(function(response) {
            $scope.me = response;
        });
    });

    $scope.logout = function(){
    delete $localStorage.token;
    $state.go('splashlogin');
  };

  $scope.$on('$ionicView.enter', function(e) {
    console.log('home entered');
  });
})
    .controller('CreateAccountCtrl',function($scope, $state, $localStorage, $cordovaCamera, $ionicGesture,Restangular,$ionicHistory, $cordovaGeolocation) {

        $ionicGesture.on('swiperight', function(){
            $ionicHistory.goBack(-1);
        },angular.element(document.querySelector('body')));

        $scope.setLocation = function(){
            document.addEventListener("deviceready",function(){
                console.log('settign location');
                var posOptions = {timeout: 10000, enableHighAccuracy: false};
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat  = position.coords.latitude
                        var long = position.coords.longitude
                        alert(lat+long);
                        /*try{
                         var UserLocation = Restangular.one('http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true');
                         UserLocation.get({'latlng':lat+','+long,'sensor':true}).then(function(response) {
                         console.log(response);
                         });
                         }*/
                        console.log(lat+' '+long);
                    }, function(err) {
                        console.log(err);
                    });
            });
        };

        $scope.setAvatar = function(){
            document.addEventListener("deviceready", function () {
                var options = {
                    quality: 80,
                    destinationType: Camera.DestinationType.DATA_URL,
                    //sourceType: Camera.PictureSourceType.CAMERA,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 200,
                    targetHeight: 200,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false,
                    correctOrientation:true
                };

                $cordovaCamera.getPicture(options).then(function(imageData) {
                    var image = document.getElementById('myImage');
                    //image.src = "data:image/jpeg;base64," + imageData;
                    $scope.avatar = "data:image/jpeg;base64," + imageData;
                    

                }, function(err) {
                    // error
                });

            }, false);
        };

        $scope.processCreateAccount = function() {
            Restangular.setBaseUrl('http://52.27.157.158/api/v1/');
            var payload = {"password":this.password,"email":this.email,"name":this.name,"notifications":this.notifications,"avatar": $scope.avatar};
            //Restangular.setBaseUrl('http://52.27.157.158/api/v1/');
            Restangular.all('user').post(payload).then(function(response){
                if(response.status){
                    $localStorage.token = response.token;
                    $state.go('app.home');
                }else{
                    $scope.errors = response.errors;
                }
            });
        }

    });
