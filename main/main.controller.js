(function (window) {
    'use strict';
    angular.module('dubmonk').controller('MainController', MainController);

    MainController.$inject = ['$scope'];

    function MainController($scope) {

        // Grid, Single/Slideshow/ Player views.
        var views = {
                grid : document.querySelector('.view--grid'),
                single : document.querySelector('.view--single'),
                player : document.querySelector('.view--player')
            },
        // The initial grid element.
            lpGrid = views.grid.querySelector('ul.grid'),
        // The initial grid items.
            lps = [].slice.call(lpGrid.querySelectorAll('li.grid__item')),
            expanderEl = document.querySelector('.deco-expander'),
        // The LP svg behing each Slideshow record
            recordEl = views.player.querySelector('.player__element--lp'),
            slideshow, turntable;

        /**
         * Preload grid images and some turntable assets. Once that's done, initialize events.
         */
        function init() {
            var onready = function() {
                classie.add(lpGrid, 'grid--loaded');
                initEvents();
                // Initialize slideshow.
                slideshow = new RecordSlideshow(document.querySelector('.view--single'), {
                    // Stopping/Closing the slideshow: return to the initial grid.
                    onStop : function() {
                        changeView('single', 'grid');
                        hideExpander();
                    },
                    onLoadRecord : function(record, progressEl, progressElLen) {
                        // Load the record info into the turntable.
                        turntable.loadRecord(record.info, function() {
                            // Update record info on the turntable
                            turntable.setRecordInfo(record.info);
                            setTimeout(function() { slideshow._showRecord(); }, 50);
                        }, function(progress) {
                            if( slideshow.isLoading ) {
                                dynamics.animate(progressEl, {strokeDashoffset : progressElLen * ( 1 - progress/100 )}, {duration : 100, type : dynamics.linear});
                            }
                        });
                    },
                    onShowRecord : function(record) {
                        // Show record element.
                        dynamics.css(recordEl, { opacity : 1 });
                        // Change the cover of the record.
                        recordEl.querySelector('image').setAttribute('xlink:href', record.info.coverImg);
                        // Change view.
                        changeView('single', 'player');

                        setTimeout(function() { turntable.start(); }, 600);
                    }
                });

            };
            preload(onready);
        }

        /**
         * Preload grid images and some turntable assets. Initialize the turntable.
         */
        function preload(callback) {
            var loaded = 0,
                checkLoaded = function() {
                    ++loaded;
                    if( loaded === 2 && typeof callback === 'function' ) {
                        callback();
                    }
                };

            // Initialize Masonry after all images are loaded.
            initGridLayout(checkLoaded);
            // Load the turntable assets (noise and effects sounds).
            loadTurntableAssets(function(bufferList) {
                initTurntable(bufferList);
                checkLoaded();
            });
        }

        /**
         * Call Masonry on the initial grid.
         */
        function initGridLayout(callback) {
            imagesLoaded(views.grid, function() {
                new Masonry( '.grid', {
                    itemSelector: '.grid__item'
                });
                if( typeof callback === 'function' ) {
                    callback();
                }
            });
        }

        function loadTurntableAssets(callback) {
            new AbbeyLoad([{
                'room1' : 'mp3/room1.mp3',
                'room2' : 'mp3/room2.mp3',
                'room3' : 'mp3/room3.mp3',
                'noise' : 'mp3/noise1.mp3'
            }], function(bufferList) {
                if( typeof callback === 'function' ) {
                    callback(bufferList);
                }
            });
        };

        function initTurntable(bufferList) {
            // initialize turntable
            turntable = new Turntable(views.player, {
                noiseBuffer	: bufferList['noise'],
                effectBuffers : [bufferList['room1'],bufferList['room2'],bufferList['room3']],
                onGoBack : function() {
                    // Change view.
                    changeView('player', 'single');
                    slideshow.restart(function() {
                        // Hide record element.
                        dynamics.css(recordEl, { opacity : 0 });
                    });
                }
            });
            // force to be checked by default (firefox)
            // ctrls.noise.checked = true;
        }

        function changeView(old, current) {
            classie.remove(views[old], 'view--current');
            classie.add(views[current], 'view--current');
        }

        function initEvents() {
            lps.forEach(function(lp, pos) {
                lp.addEventListener('click', function(ev) {
                    ev.preventDefault();
                    showExpander({x: ev.pageX, y: ev.pageY}, function() {
                        changeView('grid', 'single');
                    });
                    // Start the slideshow.
                    setTimeout(function() { slideshow.start(pos);}, 80);
                });
            });

            // Window resize.
            var debounceResize = debounce(function(ev) {
                // Recalculate window sizes.
                winsize = {width : window.innerWidth, height : window.innerHeight};
            }, 10);
            window.addEventListener('resize', debounceResize);
        }

        function showExpander(position, callback) {
            dynamics.css(expanderEl, { opacity: 1, left : position.x, top : position.y, backgroundColor : '#45918e', scale : 0 });
            dynamics.animate(expanderEl, {
                scale : 1.5,
                backgroundColor : '#45cb96'
            }, {
                duration : 500,
                type : dynamics.easeOut,
                complete : function() {
                    if( typeof callback === 'function' ) {
                        callback();
                    }
                }
            });
        }

        function hideExpander() {
            dynamics.css(expanderEl, { left : window.innerWidth/2, top : window.innerHeight/2 });
            dynamics.animate(expanderEl, {
                opacity : 0
            }, {
                duration : 500,
                type : dynamics.easeOut
            });
        }

        init();

        window.AudioContext = window.AudioContext||window.webkitAudioContext;
    }
})(window);
