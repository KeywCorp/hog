'use strict';

angular.module('hog')
  .controller('HeaderCtrl', function ($scope, $log, $mdSidenav) {

    var vm = this;
    $scope.$on('stateChangeSuccess',
        function()
        {
            $mdSidenav('left').close();
        });
    angular.extend(vm, {
        name: 'HeaderCtrl',
        menu: [
            {
                name: 'Complex',
                state: 'home.complex'
            },
            {
                name: 'Simple',
                state: 'home.simple'
            },
            {
                name: 'List',
                state: 'home.complex.list'
            }
        ],
        toggleNav: function()
        {
            $log.debug('clicked')
            $mdSidenav('left').toggle()
                .then(
                    function()
                    {
                        $log.debug('slide');
                    });
        }
    });

  });
