
/**
 * Slideshow obj.
 */
function RecordSlideshow(el, options) {
    this.el = el;

    // Options/Settings.
    this.options = extend( {}, this.options );
    extend( this.options, options );

    // Slideshow items.
    this.records = [];
    var self = this;
    [].slice.call(this.el.querySelectorAll('.single')).forEach(function(el) {
        var record = new Record(el);
        self.records.push(record);
    });
    // Total items.
    this.recordsTotal = this.records.length;
    // Current record idx.
    this.current = 0;
    // Slideshow controls.
    this.ctrls = {
        next : this.el.querySelector('.controls__navigate > button.control-button--next'),
        prev : this.el.querySelector('.controls__navigate > button.control-button--prev'),
        play : this.el.querySelector('button.control-button--play'),
        back : this.el.querySelector('button.control-button--back')
    };

    this.lpPlayCtrlPath = this.ctrls.play.querySelector('svg.icon--progress > path');
    this.lpPlayCtrlPathLen = this.lpPlayCtrlPath.getTotalLength();
    dynamics.css(this.lpPlayCtrlPath, {strokeDasharray : this.lpPlayCtrlPathLen, strokeDashoffset : this.lpPlayCtrlPathLen});

    this._initEvents();
}

/**
 * RecordSlideshow options/settings.
 */
RecordSlideshow.prototype.options = {
    // On stop callback.
    onStop : function() { return false; },
    // On load record callback.
    onLoadRecord : function() { return false; },
    // On show record callback.
    onShowRecord : function() { return false; }
};

/**
 * Shows the first record.
 */
RecordSlideshow.prototype.start = function(pos) {
    this.current = pos;
    var currentRecord = this.records[this.current];
    classie.add(currentRecord.wrapper, 'single--current');
    currentRecord.layout('down');
    currentRecord.animate('center');
    // show play ctrl
    this._showPlayCtrl();
};

/**
 * Restart where it was. Called when transitioning from the player view to the slideshow/single view.
 */
RecordSlideshow.prototype.restart = function(callback) {
    var currentRecord = this.records[this.current];
    classie.add(currentRecord.wrapper, 'single--current');
    currentRecord.layout('left');
    currentRecord.animate('center', callback);
    // show play ctrl
    this._showPlayCtrl();
};

/**
 * Init/Bind events.
 */
RecordSlideshow.prototype._initEvents = function() {
    var self = this;
    this.ctrls.next.addEventListener('click', function() {
        self._navigate('right');
    });
    this.ctrls.prev.addEventListener('click', function() {
        self._navigate('left');
    });
    this.ctrls.back.addEventListener('click', function() {
        self._stop();
    });
    this.ctrls.play.addEventListener('click', function() {
        self._loadRecord();
    });
};

/**
 * Navigate.
 */
RecordSlideshow.prototype._navigate = function(direction) {
    var self = this;

    // If the user clicked play on a previous record, then cancel it.
    if( this.isLoading ) {
        this._cancelRecordLoading();
    }

    // hide play ctrl
    this._hidePlayCtrl();

    var currentRecord = this.records[this.current];

    if( direction === 'right' ) {
        this.current = this.current < this.recordsTotal - 1 ? this.current + 1 : 0;
    }
    else {
        this.current = this.current > 0 ? this.current - 1 : this.recordsTotal - 1;
    }

    var nextRecord = this.records[this.current];
    classie.add(nextRecord.wrapper, 'single--current');

    currentRecord.animate(direction === 'right' ? 'left' : 'right', function() {
        classie.remove(currentRecord.wrapper, 'single--current');
    });

    nextRecord.layout(direction);
    nextRecord.animate('center', function() {
        // show play ctrl
        self._showPlayCtrl();
    });
};

/**
 * Load the record.
 */
RecordSlideshow.prototype._loadRecord = function() {
    // If already pressed return.
    if( this.isLoading ) {
        return false;
    }
    // Hide play symbol
    classie.add(this.ctrls.play, 'control-button--active');

    // Loading...
    this.isLoading = true;
    // Callback.
    this.options.onLoadRecord(this.records[this.current], this.lpPlayCtrlPath, this.lpPlayCtrlPathLen);
};

/**
 * Show record.
 */
RecordSlideshow.prototype._showRecord = function() {
    var self = this;

    // If the user didn't click play then return.
    if( !this.isLoading ) {
        return false;
    }

    var currentRecord = this.records[this.current];
    currentRecord.animate('left', function() {
        currentRecord.layout('hidden');
        classie.remove(currentRecord.wrapper, 'single--current');
    });

    // hide play ctrl
    this._hidePlayCtrl();

    // Callback.
    this.options.onShowRecord(currentRecord);

    // Invalidate.
    this._cancelRecordLoading();
};

/**
 * Stop the slideshow.
 */
RecordSlideshow.prototype._stop = function() {
    // If the user clicked play on a previous record, then cancel it.
    if( this.isLoading ) {
        this._cancelRecordLoading();
    }

    var currentRecord = this.records[this.current];
    currentRecord.layout('hidden');
    classie.remove(currentRecord.wrapper, 'single--current');

    // hide play ctrl
    this._hidePlayCtrl();

    // Callback.
    this.options.onStop();
};

/**
 * Cancel the loading of a record (either because the user pressed the navigation keys, or closed the slideshow after clicking the play ctrl of a specific record).
 */
RecordSlideshow.prototype._cancelRecordLoading = function() {
    this.isLoading = false;
    // Show play symbol
    classie.remove(this.ctrls.play, 'control-button--active');
    dynamics.stop(this.lpPlayCtrlPath);
    dynamics.css(this.lpPlayCtrlPath, {strokeDasharray : this.lpPlayCtrlPathLen, strokeDashoffset : this.lpPlayCtrlPathLen});
};

/**
 * Shows the play ctrl.
 */
RecordSlideshow.prototype._showPlayCtrl = function() {
    dynamics.animate(this.ctrls.play, { opacity : 1 }, { duration : 200, type : dynamics.easeOut });
};

/**
 * Hides the play ctrl.
 */
RecordSlideshow.prototype._hidePlayCtrl = function() {
    dynamics.css(this.ctrls.play, { opacity : 0 });
};