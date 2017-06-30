/*! Toasty.js - v1.3.0 - 2017-06-30
* https://egalink.github.io/Toasty.js/
* Copyright (c) 2015-2017 Jakim Hernández; Licensed MIT */
;(function () {

    'use strict';
    
    var _transitions = [
        "fade",
        "slideLeftFade",
        "slideLeftRightFade",
        "slideRightFade",
        "slideRightLeftFade",
        "slideUpFade",
        "slideUpDownFade",
        "slideDownFade",
        "slideDownUpFade",
        "pinItUp",
        "pinItDown"
    ];

    var _defaults = {
        // STRING: main class name used to styling each toast message with CSS:
        // .... IMPORTANT NOTE:
        // .... if you change this, the configuration consider that you´re
        // .... re-stylized the plugin and default toast styles, including css3 transitions are lost.
        classname: "toast", 
        // STRING: name of the CSS transition that will be used to show and hide the toast:
        transition: "fade",
        // BOOLEAN: specifies the way in which the toasts will be inserted in the html code:
        // .... Set to BOOLEAN TRUE and the toast messages will be inserted before those already generated toasts.
        // .... Set to BOOLEAN FALSE otherwise.
        insertBefore: true,
        // INTEGER: duration that the toast will be displayed in milliseconds:
        // .... Default value is set to 4000 (4 seconds). 
        // .... If it set to 0, the duration for each toast is calculated by message length.
        duration: 4000,
        // BOOLEAN: enable or disable toast sounds:
        // .... Set to BOOLEAN TRUE  - to enable toast sounds.
        // .... Set to BOOLEAN FALSE - otherwise.
        // NOTE: this is not supported by mobile devices.
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
            info: "./dist/sounds/info/1.mp3",
            // path to sound for successfull message:
            success: "./dist/sounds/success/1.mp3",
            // path to sound for warn message:
            warning: "./dist/sounds/warning/1.mp3",
            // path to sound for error message:
            error: "./dist/sounds/error/1.mp3",
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
        container: "{:classname}-container",
        mainwrapp: "{:classname}-wrapper",
        toasts: {
               info: "{:classname}--info",
            success: "{:classname}--success",
            warning: "{:classname}--warning",
              error: "{:classname}--error",
        },
        animate: {
            init: "{:transition}-init",
            show: "{:transition}-show",
            hide: "{:transition}-hide",
        },
        progressbar: "{:classname}-progressbar",
        playerclass: "{:classname}-soundplayer"
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
            _addClass(el, animate.show);
        };

        var beforeNode = container.childNodes;
            beforeNode = beforeNode[insertBefore === true ? 0 : beforeNode.length];
        
        // insert in the DOM:
        container.insertBefore(el, beforeNode);
        // initialize the css transition:
        delay(show, 100);
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
            var container = parentElement(el); // the wrapper.
            el.remove();
            var num = container.childNodes.length;
            if (num < 1) {
                parentElement(container).remove();
            }
        };

        function hide () {
            el.addEventListener(whichTransitionEvent(), onHideToast, false);
            _addClass(el, animate.hide);
        };

        // initialize the css transition:
        delay(hide, duration +100);
    };

    // hide the toast message with an CSS3 transition when the user
    // clicks on the message:
    var _hideToastOnClick = function (type, el, duration, animate, callback, class2close) {
        //
        function hideOnClick (e) {
            e.stopPropagation();
            _removeClass(el, class2close);
            _hideToast(type, el, duration, animate, callback);
        }

        _addClass(el, class2close);
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
                    parentElement(parent).remove();
            }

        audio.className = playerclass;
        audio.innerHTML = '<source src="' + sound + '" type="audio/mpeg"/>' +
                          '<embed hidden="true" autoplay="false" loop="false" src="' + sound + '" />';

        parentElement(container).appendChild(audio);
    };

    var _showProgressBar = function (type, el, duration, transition) {
        //
        var timer = 0;
        
        function delay (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };

        function progressbar () {
            var progressBar = document.createElement('div');
            _addClass(progressBar, transition.progressbar);
            _addClass(progressBar, transition.progressbar + '--' + type);
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
        }

        delay(progressbar, 100);
    };


    /**
     * ClassList Fallback
     * Thanks to: Jean David Daviet
     * Gist: https://gist.github.com/JeanDavidDaviet/4745497
     * --------------------------------------------------------------------- */
    
        var _containsClass = function (el, className) {
            //
            if (document.documentElement.classList) {
                containsClass = function (el, className) { return el.classList.contains(className); }
            } else {
                containsClass = function (el, className) {
                    if (! el || ! el.className)
                        return false;
                    var regex = new RegExp('(^|\\s)' + className + '(\\s|$)');
                    return el.className.match(regex);
                }
            }

            return containsClass(el, className);
        };

        var _addClass = function (el, className) {
            //
            if (document.documentElement.classList)
                addClass = function (el, className) { el.classList.add(className); }
            else
                addClass = function (el, className) {
                    if (! el)
                        return false;
                    if (containsClass(el, className) == false)
                        el.className += (el.className ? " " : "") + className;
                }

            addClass(el, className);
        };

        var _removeClass = function (el, className) {
            //
            if (document.documentElement.classList)
                removeClass = function (el, className) { el.classList.remove(className); }
            else
                removeClass = function (el, className) {
                    if (! el || ! el.className)
                        return false;
                    var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
                    el.className = el.className.replace(regexp, "$2");
                }

            removeClass(el, className);
        };

        var _toggleClass = function (el, className) {
            //
            if (document.documentElement.classList)
                toggleClass = function (el, className) { return el.classList.toggle(className); }
            else
                toggleClass = function (el, className)
                {
                    if (containsClass(el, className) == true) {
                        removeClass(el, className);
                        return false;
                    } else {
                        addClass(el, className);
                        return true;
                    }
                }

            return toggleClass(el, className);
        };

    // ------------------------------------------------------------------------


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
        if (containerExists) {
            container = container.querySelector('.' + transition.mainwrapp); // use the wrapper instead of main container.
        } else {
            container = document.createElement('div');
            _addClass(container, transition.container);
            _addClass(container, transition.container + '--' + options.transition);

            // create a alert wrapper instance:
            var wrapp = document.createElement('div');
            _addClass(wrapp, transition.mainwrapp);

            // append the alert wrapper and now, this is the main container:
            container.appendChild(container = wrapp);
        }

        // create a new toast instance
        var newToast = document.createElement('div');
            _addClass(newToast, options.classname);
            _addClass(newToast, transition.toasts[type]);
            _addClass(newToast, transition.animate.init);
            newToast.innerHTML = message;

        // insert the toast container into the HTML:
        if (! containerExists)
            document.body
                    .insertBefore(parentElement(container), options.prependTo);


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
        //
        var t,
            el = document.createElement('transitionElement');

        var transitions = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        };

        for (t in transitions) if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }

    function parentElement (el) {
        //
        return el.parentElement || el.parentNode;
    }

    /**
     * IE Fallbacks:
     */

    // Create Element.remove() function if not exist:
    if ('remove' in Element.prototype) {
        // the browser supports .remove() function...
    } else {
        Element.prototype.remove = function() {
            if (this.parentNode)
                this.parentNode.removeChild(this);
        };
    }

    // object:
    window.Toasty = Toasty;

})(window, document);