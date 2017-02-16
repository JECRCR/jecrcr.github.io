var renApp = angular.module('renApp', ['ui.router','ngAnimate']);

function prefetchImages(sources,path){
    if(path==undefined)
        path = '';
    var images = [];
    var loadedImages = 0;
    var numImages = sources.length;
    for (var i=0; i < numImages; i++) {
        images[i] = new Image();
        images[i].onload = function(){
            if (++loadedImages >= numImages) { }
        };
        images[i].src = path+sources[i];
    }
};
renApp.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/welcome');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
           .state('home', {
       url: '/welcome',
       title: 'National Level Techno-Cultural Fest',
       templateUrl: 'assets/partials/partial-home.html',
       controller: function(renService, $scope, Page) {
           prefetchImages(['about-us.png', 'events.png', 'team.png', 'gallery.png', 'sponsor.png', 'support.png'], 'assets/img/logo/explore/');
           prefetchImages(['splash.png', 'quanta.png', 'alumni.png', 'tas.png', 'endeavour.png', 'zarurat.png'], 'assets/img/logo/categories/');
           renService.async().then(function(d) {
               prefetchImages(d['imgArray'], 'assets/img/logo/events/');
           });
           $scope.$on("$viewContentLoaded", function() {

           });
       }
   })

   .state('explore', {
           url: '/home',
           title: 'Home',
           templateUrl: 'assets/partials/partial-explore.html'
       })

        // Routes from explore
        .state('about', {
            url: '/about',
            title: 'About Us',
            templateUrl: 'assets/partials/partial-about.html'
        })
        .state('support', {
            url: '/support',
            title: 'Support',
            templateUrl: 'assets/partials/partial-support.html'
        })
        .state('team', {
            url: '/team',
            title: 'Team',
            templateUrl: 'assets/partials/partial-team.html',
            controller: function($scope, $state, Page){
                var memberCategories = {
                    '0': [{n: 'Anshul Mittal', m:'sdo@jecrc.ac.in',img:'anshul-sir.jpg'}],
                    '1': [{n:'Manthan Rawat',m:'rawat.manthan919@gmail.com',img:'manthan.jpg',p:'+91-9529698354'},
                           {n:'Vishesh Koul',m:'visheshkoul.jmu@gmail.com',img:'anish.jpg',p:'+91-7073874113'}],
                   '2': [{n: 'Arpit Kalra',m:'arpitkalra0003@gmail.com',img:'lokesh.jpg',p:'+91-7742440700',site:'https://www.linkedin.com/in/arpit-kalra-40b046103/'},
                           {'n': 'Atul Dada',m:'developeratuldada@gmail.com',img:'udit.jpg',p:'+91- 8696974417',site: 'https://www.linkedin.com/in/atul-dada-9ba77592/'},
                           {'n': 'Himanshu  Dixit',m:'hudixt@gmail.com',img:'himanshu.jpg',p:'',site: 'www.himanshudixit.me'}
                         ],
                     '3': [{n: 'Kapil Bindal', m: 'kapilbindal.ee18@jecrc.ac.in',p:'+91-7597506790' , img:'rajdeep.jpg'},
                           {n: 'Akshay Darshan', m: 'designflames@gmail.com',img:'raghav.jpg'}
                         ],
                     '5': [{n: 'Ankit Jhawar', m: 'kavish.goyal@live.com',img:'kavish.jpg',p:'+91-8058569071'},
                         {n: 'Abhidha Vasta', m: 'shaheen14@ymail.com',img:'shaheen.jpg',p:'+91-9983028726'}
                     ],
                     '6': [{n: 'Shubham Gupta', m: 'kavish.goyal@live.com',img:'shubham.png',p:'+91-8058569071'},
                         {n: 'Charu Upadhyay', m: 'shaheen14@ymail.com',img:'charu.jpg',p:'+91-9983028726'}
                     ],

                     '4': [{n: 'Surabhi Soni', m: 'surabhi252605@gmail.com',img:'anand.jpg',p:'+91-8764323635'},
                         {n: 'Yashdeep Bhatnagar', m: 'yashdeep.bhatnagar03@gmail.com',img:'deeksha.jpg',p:'+91-8107417995'}
                     ]

                };
                var random = function() {
                    return 0.5 - Math.random();
                };
                angular.forEach(memberCategories, function(v,k){
                    memberCategories[k].sort(random);
                });
                $scope.memberCategories = memberCategories;
            }
        })
        .state('gallery', {
            url: '/gallery',
            title: 'Gallery',
            templateUrl: 'assets/partials/partial-gallery.html',
            controller: function($scope, $state, Page){
                $scope.$on('$viewContentLoaded', function() {
                    var images = [];
                    for(i=1;i<=34;i++)
                        images.push(i+"-min.jpg");

                    $scope.images = images;
                });
            }
        })
        .state('sponsors', {
            url: '/sponsors',
            title: 'Sponsors',
            templateUrl: 'assets/partials/partial-sponsors.html',
            title: 'Sponsors',
            controller: function(Page){
                Page.setTitle('Sponsors');
            }
        })
        .state('itinerary', {
            url: '/events/itinerary',
            title: 'Itinerary',
            templateUrl: 'assets/partials/partial-itinerary.html'
        })

        .state('events', {
            url: '/events',
            title: 'Events',
            templateUrl: 'assets/partials/partial-category.html',
            data: { present : 0 },
            controller: function($scope, $state, $rootScope, Page){
                $scope.openCategory = function(catNo, catName){
                    if($rootScope.currentCategory == 0){
                        $rootScope.currentCategory = catNo;
                        $state.go('events.'+catName);
                    }
                }
                $scope.getBarClass = function(catNo){
                    if($rootScope.currentCategory == 0) return '';
                    else if($rootScope.currentCategory == catNo) return 'bar-full';
                    else return 'zero-width';
                }
                $scope.menuClicked = function(){
                    //$scope.navOpen();
                    ($rootScope.currentCategory==0) ? $state.go('explore') : ($state.go('events'));
                }
            }
        })
        /* Event Routes */
        .state('events.splash',{
            parent: 'events',
            url: '/splash',
            title: 'Splash Events',
            templateUrl: 'assets/partials/partial-category-page.html',
            controller: function(renService, $scope, $state){
                $scope.category = 'splash';
                $scope.types = ['indoor','outdoor'];
                renService.async().then(function(d) {
                    $scope.events = d['splash'];
                });
                $scope.openDetails = function(eventTitle){
                    $state.go('events.'+ $scope.category +'.eventId',{id: eventTitle});
                }
            }
        })
        .state('events.endeavour',{
            parent: 'events',
            url: '/endeavour',
            title: 'Endeavour Events',
            templateUrl: 'assets/partials/partial-category-page.html',
            controller: function(renService, $scope, $state){
                $scope.types = ['default'];
                $scope.category = 'endeavour';
                renService.async().then(function(d) {
                    $scope.events = d['endeavour'];
                });
                $scope.openDetails = function(eventTitle){
                    $state.go('events.'+ $scope.category +'.eventId',{id: eventTitle});
                }
            }
        })
        .state('events.quanta',{
            parent: 'events',
            url: '/quanta',
            title: 'Quanta Events',
            templateUrl: 'assets/partials/partial-category-page.html',
            controller: function(renService, $scope, $state, Page){

                $scope.types = ['CONSTRUCTO','CARRIAGE RETURN','ROBO FIESTA', 'VOCATIONAL'];
                $scope.category = 'quanta';
                renService.async().then(function(d) {
                    $scope.events = d['quanta'];
                });
                $scope.openDetails = function(eventTitle){
                    $state.go('events.'+ $scope.category +'.eventId',{id: eventTitle});
                }
            }
        })
        .state('events.walk-through-paradise',{
            parent: 'events',
            url: '/walk-through-paradise',
            title: 'Walk Through Paradise',
            templateUrl: 'assets/partials/partial-walk-through-paradise.html'
        })
        .state('events.zarurat',{
            parent: 'events',
            url: '/zarurat',
            title: 'Zarurat: The Help Beyond',
            templateUrl: 'assets/partials/partial-zarurat.html'
        })
        .state('events.alumni',{
            parent: 'events',
            url: '/alumni',
            title: 'Alumni Events',
            templateUrl: 'assets/partials/partial-alumni.html',
            controller: function(renService, $scope,$state){
                $scope.category = 'alumni';
                renService.async().then(function(d) {
                    $scope.events = d['alumni'];
                });
                $scope.openDetails = function(eventTitle){
                    $state.go('events.'+ $scope.category +'.eventId',{id: eventTitle});
                }
            }
        })

        .state('events.splash.eventId',{
            url: '/:id',
            templateUrl : 'assets/partials/partial-event.html',
            controller: function($scope, $stateParams, $state, renService, Page) {
                renService.async().then(function(d) {
                    $scope.details = d['splash'][$scope.id];
                    Page.setTitle($scope.details.name);
                });
                $scope.closeDetails = function () {
                    $state.go('events.splash');
                };
                $scope.id = $stateParams.id;
            }
        })
        .state('events.endeavour.eventId',{
            url: '/:id',
            templateUrl : 'assets/partials/partial-event.html',
            controller: function($scope, $stateParams, $state, renService, Page) {
                renService.async().then(function(d) {
                    $scope.details = d['endeavour'][$scope.id];
                    Page.setTitle($scope.details.name);
                });
                $scope.closeDetails = function () {
                    $state.go('events.endeavour');
                };
                $scope.id = $stateParams.id;
            }
        })
        .state('events.quanta.eventId',{
            url: '/:id',
            templateUrl : 'assets/partials/partial-event.html',
            controller: function($scope, $stateParams, $state, renService, Page) {
                renService.async().then(function(d) {
                    $scope.details = d['quanta'][$scope.id];
                    Page.setTitle($scope.details.name);
                });
                $scope.closeDetails = function () {
                    $state.go('events.quanta');
                };
                $scope.id = $stateParams.id;
            }
        })
        .state('events.alumni.eventId',{
            url: '/:id',
            templateUrl : 'assets/partials/partial-event.html',
            controller: function($scope, $stateParams, $state, renService, Page) {
                renService.async().then(function(d) {
                    $scope.details = d['alumni'][$scope.id];
                    Page.setTitle($scope.details.name);
                });
                $scope.closeDetails = function () {
                    $state.go('events.alumni');
                };
                $scope.id = $stateParams.id;
            }
        })
        ;
});

renApp.factory('renService', function($http) {
    var url = "../events.json";
    var promise;
    var myService = {
        async: function() {
            if ( !promise ) {
                // $http returns a promise, which has a then function, which also returns a promise
                promise = $http.get(url).then(function (response) {
                    var imgArray = [];
                    var result={};
                    var categoryMap = {'1': 'splash', '2': 'quanta' , '3': 'endeavour', '4': 'alumni' };
                    angular.forEach(response.data,function(value,key){
                        var current = {};
                        angular.forEach(value.events,function(v,k){
                            current[v.title] = v;
                            imgArray.push(v.thumbnail);
                        });
                        result[categoryMap[key]] = current;
                    });
                    result['imgArray'] = imgArray;
                    return result;
                });
            }
            // Return the promise to the controller
            return promise;
        }
    };
    return myService;
});
renApp.factory('Page', function ($window) {
    var title = 'Welcome';
    return {
        title: function () { return title; },
        setTitle: function (newTitle) { title = newTitle; $window.document.title = 'JECRC Renaissance 2016 | '+ newTitle; }
    };
});

renApp.filter('type', function () {
    return function (items, type) {
        var filtered = {};
        angular.forEach(items,function(v,k){
            if(v.type==type)
            filtered[k] = v;
        })
        return filtered;
    };
}).filter('renderHTMLCorrectly', function($sce)
{
    return function(stringToParse)
    {
        return $sce.trustAsHtml(stringToParse);
    }
});

renApp.controller('mainController',['$scope','renService','$location','$rootScope','Page',function($scope,renService,$location,$rootScope,Page){
    $scope.Page = Page;
    $scope.ngclass = 'slide-top';
    $scope.go = function ( path ) {
        $location.path( path );
    };
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,fromState) {
        if (fromState.name == 'explore') {
            $scope.ngclass = 'slide-left';
        } else if(fromState.name != 'home' && toState.name == 'explore') {
            $scope.ngclass = 'slide-right';
        } else {
            $scope.ngclass = 'slide-top';
        }
    });
}]);

renApp.directive('myPostRepeatDirective', function() {
    return function(scope, element, attrs) {
        if (scope.$last){
            $('.gallery a').simpleLightbox();
        }
    };
});


renApp.run(['$rootScope','$location','$window','Page', function ($rootScope, $location, $window, Page) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.title) {
            Page.setTitle(toState.title);
        }
    });

    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {

            var sname = toState.name;
            if(sname=='events'){ $rootScope.currentCategory = 0; }
            else if(sname.indexOf('events.splash') > -1 ) $rootScope.currentCategory = 1;
            else if(sname.indexOf('events.endeavour') > -1 ) $rootScope.currentCategory = 2;
            else if(sname.indexOf('events.quanta') > -1 ) $rootScope.currentCategory = 3;
            else if(sname.indexOf('events.walk-through-paradise') > -1 ) $rootScope.currentCategory = 4;
            else if(sname.indexOf('events.zarurat') > -1 ) $rootScope.currentCategory = 5;
            else if(sname.indexOf('events.alumni') > -1 ) $rootScope.currentCategory = 6;

        }
    );
    $rootScope
        .$on('$stateChangeSuccess',
        function(event){

            if (!$window.ga)
                return;

            $window.ga('send', 'pageview', { page: $location.path() });
        });
}]);
