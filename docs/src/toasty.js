/*!
 * Toasty.js v2.0.0
 *
 * A minimal JavaScript notification plugin that provides a simple way
 * to display customizable toast messages.
 *
 * Edgar Jakim Hernández Arrieta <egalink@gmail.com>
 * license: MIT
 * https://github.com/egalink/Toasty.js
 */
;(function () {

    'use strict';

    var _transitions = [
        "default",
        "slideFadeLeft",
        "slideFadeRight",
    ];

    var _defaults = {
        // STRING: main class name used to styling each toast message with CSS:
        classname: "toast", 
        // STRING: Name of the CSS transition that will be used to shown or hide the toast:
        transition: "default",
        // BOOLEAN: Specifies the way in which the toasts will be inserted in the html code:
        // .... Set to BOOLEAN TRUE and the toast messages will be inserted before those already generated toasts.
        // .... Set to BOOLEAN FALSE otherwise.
        insertBefore: true,
        // INTEGER: Duration that the toast will be displayed in milliseconds:
        // .... Default value is set to 4000 (4 seconds). 
        // .... If it set to 0, the duration for each toast is calculated by message length.
        duration: 4000,
        // BOOLEAN: enable or disable toast sounds:
        // .... Set to BOOLEAN TRUE  - to enable toast sounds.
        // .... Set to BOOLEAN FALSE - otherwise.
        enableSounds: false,
        // BOOLEAN: enable or disable auto hiding on toast messages:
        // .... Set to BOOLEAN TRUE  - to enable auto hiding.
        // .... Set to BOOLEAN FALSE - disable auto hiding. Instead the user must click on toast message to close it.
        autoClose: true,
        // BOOLEAN: enable or disable the progressbar:
        // .... Set to BOOLEAN TRUE  - enable the progressbar only if the autoClose option value is set to BOOLEAN TRUE.
        // .... Set to BOOLEAN FALSE - disable the progressbar. 
        progressBar: false,
        // Yep, support custom sounds for each toast message when are shown
        // if the enableSounds option value is set to BOOLEAN TRUE:
        // NOTE: The paths must point from the project's root folder.
        sounds: {
            // path to sound for informational message:
            info: "./src/sounds/info/1.mp3",
            // path to sound for successfull message:
            success: "./src/sounds/success/1.mp3",
            // path to sound for warn message:
            warning: "./src/sounds/warning/1.mp3",
            // path to sound for error message:
            error: "./src/sounds/error/1.mp3",
        },

        // callback:
        // onShow function will be fired when a toast message appears.
        onShow: function (type) {},

        // callback:
        // onHide function will be fired when a toast message disappears.
        onHide: function (type) {},

        // The placement where prepend the toast container:
        prependTo: document.body.childNodes[0]
    };

    var _mappings = {
        container: '{:classname}-container',
        toasts: {
               info: '{:classname}--info',
            success: '{:classname}--success',
            warning: '{:classname}--warning',
              error: '{:classname}--error'
        },
        animate: {
            init: '{:transition}-init',
            show: '{:transition}-show',
            hide: '{:transition}-hide'
        },
        progressbar: '{:classname}-progressbar',
        playerclass: '{:classname}-soundplayer'
    };

    /*!
     * Private functions:
     */

    // the method to extend default options in settings:
    var _extend = function (defaults, options) {
        //
        var config = {};
        
        for (var key in defaults)
            config[key] = options.hasOwnProperty(key)? options[key] : defaults[key];

        return config;
    };

    // get the auto close duration to be set in each toast message:
    var _getAutoCloseDuration = function (message, duration, settings) {
        //
            duration = duration || settings.duration;
        if (duration == 0)
            duration = message.length *50;

        return Math.floor(duration);
    };

    // show the toast message with an CSS3 transition:
    var _showToast = function (type, el, container, animate, insertBefore, callback) {
        //
        var timer = 0;

        function delay (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };

        function onShowToast (e) {
            e.target.removeEventListener(e.type, onShowToast, false);
            if (typeof callback === 'function')
                callback(type);
        }

        function show () {
            el.addEventListener(whichTransitionEvent(), onShowToast, false);
            el.classList.add(animate.show);
        };

        var beforeNode = container.childNodes;
            beforeNode = beforeNode[insertBefore === true ? 0 : beforeNode.length];
        
        // insert in the DOM:
        container.insertBefore(el, beforeNode);
        // initialize the css transition:
        delay(show, 0);
    };

    // hide the toast message with an CSS3 transition:
    var _hideToast = function (type, el, duration, animate, callback) {
        //
        var timer = 0;
        
        function delay (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
        
        function onHideToast(e) {
            e.target.removeEventListener(e.type, onHideToast, false);
            delay(remove, 0);
            if (typeof callback === 'function')
                callback(type);
        };

        function remove () {
            var container = parentElement(el);
            el.remove();
            var num = container.childNodes.length;
            if (num < 1)
                container.remove();
        };

        function hide () {
            el.addEventListener(whichTransitionEvent(), onHideToast, false);
            el.classList.add(animate.hide);
        };

        // initialize the css transition:
        delay(hide, duration);
    };

    // hide the toast message with an CSS3 transition when the user
    // clicks on the message:
    var _hideToastOnClick = function (type, el, duration, animate, callback, class2close) {
        //
        function hideOnClick (e) {
            e.stopPropagation();
            el.classList.remove(class2close);
            _hideToast(type, el, duration, animate, callback);
        }

        el.classList.add(class2close);
        el.addEventListener('click', hideOnClick);
    };

    var _playSound = function (type, container, sounds, playerclass) {
        //
        var sound = sounds[type],
            audio = document.createElement('audio');
            audio.autoplay = 'autoplay';
            audio.onended = function() {
                var parent = parentElement(this);
                this.remove();
                if (parent.childNodes.length < 1)
                    parent.remove();
            }

        audio.className = playerclass;
        audio.innerHTML = '<source src="' + sound + '" type="audio/mpeg"/>' +
                          '<embed hidden="true" autostart="true" loop="false" src="' + sound + '" />';

        container.appendChild(audio);
    };

    var _showProgressBar = function (type, el, duration, transition) {
        //
        var progressBar = document.createElement('div');
            progressBar.classList.add(transition.progressbar);
            progressBar.classList.add(transition.progressbar + '--' + type);
            el.appendChild(progressBar);

        var iterat = 0,
            offset = 0;

        var interval = setInterval(function() {

            iterat ++;
            offset = Math.round((1000 *iterat) / duration);
        
            if (offset > 100) {
                clearInterval(interval);
            } else {
                progressBar.style.width = offset + '%';
            }

        }, 10);
    };

    /*!
     * The exposed public object:
     */

    var Toasty = function (options, transitions_) {
        //
        this.settings = {};
        this.classmap = {};
        this.configure(typeof options === 'object' ? options : {});
        
        // add classmap for default transitions:
        if (typeof _transitions === 'object')
            for (var key in _transitions) if (_transitions.hasOwnProperty(key) === true) {
                this.transition(_transitions[key]);
            }

        // add classmap for the user defined transitions:
        if (typeof transitions_ === 'object')
            for (var key in transitions_) if (transitions_.hasOwnProperty(key) === true) {
                this.transition(transitions_[key]);
            }
    };

    Toasty.prototype.configure = function (options) {
        //
        var hasSettings = Object.keys(this.settings).length;
        if (hasSettings > 1)
            this.settings = _extend(this.settings, options);
        else
            this.settings = _extend(_defaults, options);

        return this;
    };

    Toasty.prototype.transition = function (name) {
        //
        this.classmap[name] = cloner(_mappings);
        this.classmap[name] = walker(this.classmap[name], {
            '{:classname}': this.settings.classname,
            '{:transition}': name
        });
        return this;
    };

    Toasty.prototype.toast = function (type, message, duration) {
        //
        var classes = this.classmap;
        var options = this.settings;

        var transition = classes[options.transition];
        var container = null;

        // check if the toast container exists:
        if (typeof options.transition == 'string')
            container = document.querySelector('.' + transition.container + '--' + options.transition);
        else
            container = document.querySelector('.' + transition.container);

        var containerExists = !! container;

        // create the toast container if not exists:
        if (! containerExists) {
            container = document.createElement('div');
            container.classList.add(transition.container);
            container.classList.add(transition.container + '--' + options.transition);
        }

        // create a new toast instance
        var newToast = document.createElement('div');
            newToast.classList.add(options.classname);
            newToast.classList.add(transition.toasts[type]);
            newToast.classList.add(transition.animate.init);
            newToast.innerHTML = message;

        // insert the toast container into the HTML:
        if (! containerExists)
            document.body
                    .insertBefore(container, options.prependTo);

        // enable or disable toast sounds:
        if (options.enableSounds == true)
            _playSound(
                type,
                container,
                options.sounds,
                transition.playerclass
            );


        // STEP 1:
        // INI: showing the toas message
        // --------------------------------------------------------------------

        _showToast(
            type,
            newToast,
            container,
            transition.animate,
            options.insertBefore,
            options.onShow
        );

        // --------------------------------------------------------------------
        // END: showing the toas message


        // STEP 2:
        // INI: prepare the toast to hide it.
        // --------------------------------------------------------------------

        if (! options.autoClose)
            // hide the toast message on click it with an CSS3 transition:
            _hideToastOnClick(
                type,
                newToast,
                0, // duration
                transition.animate,
                options.onHide,
                'close-on-click'
            );
        else
            // hide the toast message automatically:
            _hideToast(
                type,
                newToast,
                duration,
                transition.animate,
                options.onHide
            );
            
        // --------------------------------------------------------------------
        // END: prepare the toast to hide it.

        // enable or disable the progressbar:
        if (options.progressBar == true && options.autoClose == true)
            _showProgressBar(
                type,
                newToast,
                duration,
                transition
            );

        return this;
    };

    Toasty.prototype.info = function (message, duration) {
        //
        duration = _getAutoCloseDuration(message, duration, this.settings);
        this.toast("info", message, duration);
    };

    Toasty.prototype.success = function (message, duration) {
        //
        duration = _getAutoCloseDuration(message, duration, this.settings);
        this.toast("success", message, duration);
    };

    Toasty.prototype.warning = function (message, duration) {
        //
        duration = _getAutoCloseDuration(message, duration, this.settings);
        this.toast("warning", message, duration);
    };

    Toasty.prototype.error = function (message, duration) {
        //
        duration = _getAutoCloseDuration(message, duration, this.settings);
        this.toast("error", message, duration);
    };

    // helpers:

    function walker (obj, map) {
        //
        for (var o in obj) if (obj.hasOwnProperty(o) == true) {
            // ini loop:
            switch (typeof obj[o]) {
                case 'object':
                    walker(obj[o], map);
                    break;
                case 'string':
                    for (var m in map) if (map.hasOwnProperty(m) == true) obj[o] = obj[o].replace(m, map[m]);
                    break;
            }
            // end loop.
        }

        return obj;
    }

    function cloner (object) {
        //
        var string = JSON.stringify(object);
        var cloned = JSON.parse(string);
        return cloned;
    }

    function whichTransitionEvent () {
        
        var t,
            el = document.createElement('transitionElement');

        var transitions = {
            'transition'      : 'transitionend',
            'OTransition'     : 'oTransitionEnd',
            'MozTransition'   : 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        for (t in transitions) if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }

    function parentElement (el) {
        return el.parentElement || el.parentNode;
    }

    // object:
    window.Toasty = Toasty;

})(window, document);