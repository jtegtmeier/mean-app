'use strict';

import angular from 'angular';
import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../scss/main.scss';

let app = function() {
    return {
        template: require('./app.html'),
        controller: 'MainCtrl',
        controllerAs: 'app'
    }
};

class MainCtrl {
    constructor() {

    }
}

angular.module('app', [

    ])
    .directive('app', app)
    .controller('MainCtrl', function($scope, $http) {

        $http.get("linkdata/?q=categories").then(function success(res) {
            $scope.categories = res.data;
        }, function error(res) {
            console.log(res);
        })

        $http.get("linkdata/?q=links").then(function success(res) {
            $scope.links = res.data
        }, function error(res) {
            console.log(res);
        })

        $scope.currentCategory = undefined;

        function setCategory(category) {
            $scope.currentCategory = category;
        }

        function resetCategories() {
            $scope.currentCategory = undefined;
        }
        
        function isCurrentCategory(category){
            return $scope.currentCategory !== undefined && category === $scope.currentCategory;
        }

        $scope.setCategory = setCategory;
        $scope.resetCategories = resetCategories;
        $scope.isCurrentCategory = isCurrentCategory;
    });
