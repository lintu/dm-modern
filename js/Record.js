/**
 * Record obj.
 */
function Record(el) {
    this.wrapper = el;
    this.cover = this.wrapper.querySelector('.img-wrap--single');
    this.position = this.wrapper.querySelector('.number');
    this.artist = this.wrapper.querySelector('.artist');
    this.title = this.wrapper.querySelector('.title');
    this.year = this.wrapper.querySelector('.year');

    this.info = {
        coverImg : this.cover.querySelector('img').src,
        artist : this.artist.innerHTML,
        title : this.title.innerHTML,
        year : this.year.innerHTML,
        sides : {
            side1 : this.wrapper.getAttribute('data-side1') ? this.wrapper.getAttribute('data-side1').split(',') : [],
            side2 : this.wrapper.getAttribute('data-side2') ? this.wrapper.getAttribute('data-side2').split(',') : [],
        }
    };
}

/**
 * Position the record.
 */
Record.prototype.layout = function(place) {
    switch(place) {
        case 'down' :
            dynamics.css(this.cover, { opacity: 1, translateY : winsize.height });
            dynamics.css(this.position, { opacity: 1, translateY : winsize.height - 200 });
            dynamics.css(this.artist, { opacity: 1, translateY : winsize.height - 200 });
            dynamics.css(this.title, { opacity: 1, translateY : winsize.height - 180 });
            dynamics.css(this.year, { opacity: 1, translateY : winsize.height - 250 });
            break;
        case 'right' :
            dynamics.css(this.cover, { opacity: 1, translateX : winsize.width + 600 });
            dynamics.css(this.position, { opacity: 1, translateX : winsize.width + 150 });
            dynamics.css(this.artist, { opacity: 1, translateX : winsize.width });
            dynamics.css(this.title, { opacity: 1, translateX : winsize.width + 150 });
            dynamics.css(this.year, { opacity: 1, translateX : winsize.width + 50 });
            break;
        case 'left' :
            dynamics.css(this.cover, { opacity: 1, translateX : -winsize.width - 600 });
            dynamics.css(this.position, { opacity: 1, translateX : -winsize.width - 150 });
            dynamics.css(this.artist, { opacity: 1, translateX : -winsize.width });
            dynamics.css(this.title, { opacity: 1, translateX : -winsize.width - 150 });
            dynamics.css(this.year, { opacity: 1, translateX : -winsize.width - 50 });
            break;
        case 'hidden' :
            dynamics.css(this.cover, { opacity: 0 });
            dynamics.css(this.position, { opacity: 0 });
            dynamics.css(this.artist, { opacity: 0 });
            dynamics.css(this.title, { opacity: 0 });
            dynamics.css(this.year, { opacity: 0 });
            break;
    };
};

/**
 * Animate the record.
 */
Record.prototype.animate = function(direction, callback) {
    var duration = 600,
        type = dynamics.bezier,
        points = [{"x":0,"y":0,"cp":[{"x":0.2,"y":1}]},{"x":1,"y":1,"cp":[{"x":0.3,"y":1}]}],
        transform = {
            'left' : { translateX : -winsize.width, translateY : 0, opacity : 1 },
            'right' : { translateX : winsize.width, translateY : 0, opacity : 1 },
            'center' : { translateX : 0, translateY : 0, opacity : 1 }
        };

    dynamics.animate(this.cover, transform[direction], { duration : duration, type : type, points : points, complete : function() {
        if( typeof callback === 'function' ) {
            callback();
        }
    } });
    dynamics.animate(this.position, transform[direction], { duration : duration, type : type, points : points });
    dynamics.animate(this.artist, transform[direction], { duration : duration, type : type, points : points });
    dynamics.animate(this.title, transform[direction], { duration : duration, type : type, points : points });
    dynamics.animate(this.year, transform[direction], { duration : duration, type : type, points : points });
};
