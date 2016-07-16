(function () {
    'use strict';
    angular.module('dubmonk').config(config);

    function config($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/");

        $stateProvider.state('main', {
            templateUrl: 'main/main.html',
            url: '/',
            controller: 'MainController',
            controllerAs: 'ctrl'
        })
    }
})();
