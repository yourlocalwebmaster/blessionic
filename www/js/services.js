angular.module('bless.services',[])
.service('BlessUserService',function(Restangular, $localStorage){
        this.loadMe = function(){
            Restangular.setBaseUrl('http://52.38.244.208/api/v1/');
            var User = Restangular.one('user/account');
            return User.get({'token':$localStorage.token}).then(function(response) {
                return response;
            });

        }
    });