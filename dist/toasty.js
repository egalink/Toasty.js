/*! Toasty.js - v1.5.0 - 2018-05-04
* https://jakim.me/Toasty.js/
* Copyright (c) 2015-2018 Jakim Hernández; Licensed MIT */
;(function () {

    'use strict';
    
    /**
     * All available default CSS transitions for plug-in:
     *
     * @var array
     */
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

    /**
     * Default configuration for plug-in:
     *
     * @var object
     */
    var _defaults = {
        // STRING: main class name used to styling each toast message with CSS:
        // .... IMPORTANT NOTE:
        // .... if you change this, the configuration consider that you´re
        // .... re-stylized the plug-in and default toast styles, including CSS3 transitions are lost.
        classname: "toast",
        // STRING: name of the CSS transition that will be used to show and hide all toast by default:
        transition: "fade",
        // BOOLEAN: specifies the way in which the toasts will be inserted in the HTML code:
        // .... Set to BOOLEAN TRUE and the toast messages will be inserted before those already generated toasts.
        // .... Set to BOOLEAN FALSE otherwise.
        insertBefore: true,
        // INTEGER: duration that the toast will be displayed in milliseconds:
        // .... Default value is set to 4000 (4 seconds). 
        // .... If it set to 0, the duration for each toast is calculated by text-message length.
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
        // IMPORTANT: mobile browsers does not support this feature!
        // Yep, support custom sounds for each toast message when are shown if the
        // enableSounds option value is set to BOOLEAN TRUE:
        // NOTE: the paths must point from the project's root folder.
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

        // the placement where prepend the toast container:
        prependTo: document.body.childNodes[0]
    };

    /**
     * Map to create each necessary CSS classess:
     *
     * @var object
     */
    var _mappings = {
        container: "{:class-name}-container",
        mainwrapp: "{:class-name}-wrapper",
        toasts: {
               info: "{:class-name}--info",
            success: "{:class-name}--success",
            warning: "{:class-name}--warning",
              error: "{:class-name}--error",
        },
        animate: {
            init: "{:transition}-init",
            show: "{:transition}-show",
            hide: "{:transition}-hide",
        },
        progressbar: "{:class-name}-progressbar",
        playerclass: "{:class-name}-soundplayer"
    };

    /**
     * A time offset to define the plug-in behavior:
     *
     * @var object
     */
    var _timeOffset = 100;

    /**
     * A native JS extend() function
     *
     * Returns a new object instead, preserving all of the original objects
     * and their properties. Supported back to IE6.
     *
     * All credits to author.
     * https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
     *
     * @return object
     */
    function extend () {

        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // check if a deep merge
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]' ) {
            deep = arguments[0];
            i ++;
        }

        // merge the object into the extended object
        var merge = function (obj) {
            for (var prop in obj) if (Object.prototype.hasOwnProperty.call(obj, prop) === true) {
                // if deep merge and property is an object, merge properties
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]')
                    extended[prop] = extend(true, extended[prop], obj[prop]);
                else
                    extended[prop] = obj[prop];
            }
        };

        // loop through each object and conduct a merge
        for (i; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;
    }

    /**
     * Simple creation of an Element Node with the specified 'name'.
     *
     * @return HTML Element
     */
    function node(name) {
        return document.createElement(name || 'div');
    }

    /**
     * Returns the parent Element or Node from any other HTML Element.
     *
     * @return HTML Element
     */
    function parentElement (el) {
        return el.parentElement || el.parentNode;
    }

    /**
     * Regexp to find a className on a string.
     *
     * @return RegExp Obj
     */
    function classReg (className) {
        return new RegExp('(^|\\s+)' + className + '(\\s+|$)');
    }

    /**
     * Returns a Boolean value, indicating whether an element has
     * the specified class name.
     * 
     * Usage:
     *
     * var exists = containsClass(element, 'className');
     * 
     * @return bool
     */
    function containsClass (el, className) {
        var fn;
        if (document.documentElement.classList) {
            fn = function (el, className) { return el.classList.contains(className); }
        } else {
            fn = function (el, className) {
                if (! el || ! el.className)
                    return false;
                return el.className.match(classReg(className));
            }
        }
        return fn(el, className);
    }

    /**
     * Adds one or more class names to an element.
     * If the specified class already exist, the class will not be added.
     *
     * Usage:
     *
     * addClass(el, 'class1', 'class2', 'class3', ...);
     *
     * @return HTML Element|bool false
     */
    function addClass (el) {
        var fn;
        var classNames = arguments;
        if (classNames.length <= 1 || typeof el != 'object')
            return false;

        if (document.documentElement.classList)
            fn = function (el, classNames) {
                for (var i = 1; i < classNames.length; i ++) if (typeof classNames[i] == 'string') {
                    el.classList.add(classNames[i]);
                }
                return el;
            }
        else
            fn = function (el, classNames) {
                for (var i = 1; i < classNames.length; i ++) if (! containsClass(el, classNames[i]) && typeof classNames[i] == 'string') {
                    el.className += (el.className ? ' ' : '') + classNames[i];
                }
                return el;
            }

        return fn(el, classNames);
    }

    /**
     * Removes one or more class names from an element.
     * Note: Removing a class that does not exist, does NOT throw an error.
     *
     * Usage:
     *
     * removeClass(el, 'class1', 'class2', 'class3', ...);
     *
     * @return HTML Element|bool false
     */
    function removeClass (el) {
        var fn;
        var classNames = arguments;
        if (classNames.length <= 1 || typeof el != 'object')
            return false;
        
        if (document.documentElement.classList)
            fn = function (el, classNames) {
                for (var i = 1; i < classNames.length; i ++) if (typeof classNames[i] == 'string') {
                    el.classList.remove(classNames[i]);
                }
                return el;
            }
        else
            fn = function (el, classNames) {
                for (var i = 1; i < classNames.length; i ++) if (containsClass(el, classNames[i]) && typeof classNames[i] == 'string') {
                    el.className = el.className.replace(classReg(classNames[i]), '$2');
                }
                return el;
            }

        return fn(el, classNames);
    }

    /**
     * Toggles between a class name for an element.
     * 
     * Usage:
     *
     * var result = toggleClass(el, 'className');
     *
     * @return bool
     */
    function toggleClass (el, className) {
        var fn;
        if (document.documentElement.classList)
            fn = function (el, className) { return el.classList.toggle(className); }
        else
            fn = function (el, className) {
                var exists = containsClass(el, className);
                var caller = exists === true ? removeClass : addClass;
                    caller(el, className);
                return ! exists;
            }
        return fn(el, className);
    }

    /**
     * Add Event
     *
     * Attaches an event handler to the document.
     *
     * http://www.thecssninja.com/javascript/handleevent
     *
     * @param  {element}  element
     * @param  {event}    event
     * @param  {Function} fn
     * @param  {boolean}  bubbling
     * @return el
     */
    function addEvent (el, evt, fn, bubble) {
        if ('addEventListener' in el) {
            // BBOS6 doesn't support handleEvent, catch and polyfill:
            try {
                el.addEventListener(evt, fn, bubble);
            } catch (e) {
                if (typeof fn === 'object' && fn.handleEvent) {
                    el.addEventListener(evt, function (e) {
                        // bind fn as this and set first arg as event object:
                        fn.handleEvent.call(fn, e);
                    }, bubble);
                } else {
                    throw e;
                }
            }
        } else if ('attachEvent' in el) {
            // check if the callback is an object and contains handleEvent:
            if (typeof fn === 'object' && fn.handleEvent) {
                el.attachEvent('on' + evt, function () {
                    // bind fn as this:
                    fn.handleEvent.call(fn);
                });
            } else {
                el.attachEvent('on' + evt, fn);
            }
        }

        return el;
    }
        
    /**
     * Remove Event
     *
     * Removes an event handler that has been attached with the 'addEvent' method.
     *
     * http://www.thecssninja.com/javascript/handleevent
     *
     * @param  {element}  element
     * @param  {event}    event
     * @param  {Function} fn
     * @param  {boolean}  bubbling
     * @return el
     */
    function removeEvent (el, evt, fn, bubble) {
        if ('removeEventListener' in el) {
            try {
                el.removeEventListener(evt, fn, bubble);
            } catch (e) {
                if (typeof fn === 'object' && fn.handleEvent) {
                    el.removeEventListener(evt, function (e) {
                        fn.handleEvent.call(fn, e);
                    }, bubble);
                } else {
                    throw e;
                }
            }
        } else if ('detachEvent' in el) {
            if (typeof fn === 'object' && fn.handleEvent) {
                el.detachEvent('on' + evt, function () {
                    fn.handleEvent.call(fn);
                });
            } else {
                el.detachEvent('on' + evt, fn);
            }
        }

        return el
    }

    /**
     * Detect the property name of supported transition event.
     * 
     * Function from David Walsh:
     * http://davidwalsh.name/css-animation-callback
     *
     * @return string|undefined (if transitions not supported by client)
     */
    function whichTransitionEvent () {
        var t,
            el = node('transitionElement');

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

    /**
     * Calculates the auto close duration to be set in
     * each toast message:
     * 
     * @return number
     */
    function getAutoCloseDuration (message, duration, settings) {
            duration = duration || settings.duration;
        if (duration == 0)
            duration = message.length * (_timeOffset /2);
        return Math.floor(duration);
    }

    /**
     * Replace each object values with a map of key => values:
     *
     * @return object
     */
    function walker (obj, map) {

        for (var o in obj) if (obj.hasOwnProperty(o) === true) {
        // ini loop:
            switch (typeof obj[o]) {
                case 'object':
                    walker(obj[o], map);
                    break;
                case 'string':
                    for (var m in map) if (map.hasOwnProperty(m) === true) {
                        obj[o] = obj[o].replace(m, map[m]);
                    }
                    break;
            }
        // end loop.
        }

        return obj;
    }

    /**
     * Generate an HTML audio instance for each type of
     * toast message:
     *
     * @return void
     */
    var playSound = function (type, container, sounds, playerclass) {
        var sound = sounds[type],
            audio = addClass(node('audio'), playerclass);
            addEvent(audio, 'ended', function() {
                var parent = parentElement(this);
                    this.remove();
                // also, remove the main container if it empty:
                if (parent.childNodes.length < 1) parentElement(parent).remove();
            });
        audio.setAttribute('autoplay', 'autoplay');
        audio.innerHTML = '<source src="' + sound + '" type="audio/mpeg"/>' +
                          '<embed hidden="true" autoplay="false" loop="false" src="' + sound + '" />';
        parentElement(container).appendChild(audio);
    };

    /**
     * Show the toast message with an CSS3 transition
     * if transition event is supported:
     *
     * @return void
     */
    var showToast = function (type, el, container, animate, duration, insertBefore, callback) {

        var timer = 0;
        var delay = function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };

        var onShowToast = function (e) {
            removeEvent(e.target, e.type, onShowToast, false);
            if (typeof callback == 'function') callback(type);
        };

        var show = function () {
            var transitionEvent = whichTransitionEvent();
            if (transitionEvent !== undefined) {
                // initialize the CSS transition event:
                addEvent(el, transitionEvent, onShowToast, false);
            } else {
                // navigator does not support transition events:
                if (typeof callback == 'function') callback(type);
            }
            addClass(el, animate.show);
        };

        // insert in the DOM and show toast:
        var beforeNode = container.childNodes;
            beforeNode = beforeNode[insertBefore === true ? 0 : beforeNode.length];
        container.insertBefore(el, beforeNode);
        delay(show, _timeOffset);
    };

    /**
     * Hide the toast message with an CSS3 transition
     * if transition event is supported:
     *
     * @return void
     */
    var hideToast = function (type, el, duration, animate, callback) {

        var timer = 0;
        var delay = function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };

        var onHideToast = function (e) {
            removeEvent(e.target, e.type, onHideToast, false);
            remove();
            if (typeof callback == 'function') callback(type);
        };

        var remove = function () {
            var container = parentElement(el); // the wrapper.
            el.remove();
            var num = container.childNodes.length;
            if (num < 1) {
                parentElement(container).remove();
            }
        };

        var hide = function () {
            var transitionEvent = whichTransitionEvent();
            if (transitionEvent !== undefined) {
                // initialize the CSS transition event:
                addEvent(el, transitionEvent, onHideToast, false);
            } else {
                // navigator does not support transition events:
                remove();
                if (typeof callback == 'function') callback(type);
            }
            addClass(el, animate.hide);
        };

        delay(hide, (_timeOffset *10) + duration);
    };

    /**
     * Hide the toast message with an CSS3 transition when
     * the user clicks on the message:
     *
     * @return void
     */
    var hideToastOnClick = function (type, el, animate, callback, class2close) {
        var hideOnClick = function (e) {
            e.stopPropagation();
            removeClass(el, class2close);
            hideToast(type, el, 0, animate, callback);
        }
        addClass(el, class2close);
        addEvent(el, 'click', hideOnClick);
    };

    /**
     * The progressbar:
     *
     * @return void
     */
    var showProgressBar = function (type, el, duration, transition) {
        
        var timer = 0;
        var delay = function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };

        var progressbar = function () {
            var progressBar = addClass(node('div'), transition.progressbar, transition.progressbar + '--' + type);
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

        delay(progressbar, _timeOffset *10);
    };

    /**
     * Register a new transition only:
     *
     * @return string
     */
    var registerTransition = function (self, name) {
        if (typeof name === "string") {
            self.classmap[name] = extend(true, _mappings, {});
            self.classmap[name] = walker(self.classmap[name], {
                '{:class-name}': self.settings.classname,
                '{:transition}': name
            });
        }
        return name;
    };

    /*!
     * The exposed public object:
     */

    var Toasty = function (options) {
        this.settings = {};
        this.classmap = {};
        this.configure(typeof options === 'object' ? options : {});
        // add classmap for default transitions:
        if (typeof _transitions === 'object')
            for (var key in _transitions) if (_transitions.hasOwnProperty(key) === true) {
                registerTransition(this, _transitions[key]);
            }
    };

    Toasty.prototype.configure = function (options) {
        this.settings = extend(true, _defaults, this.settings, options);
        return this;
    };

    Toasty.prototype.transition = function (name) {
        this.settings.transition = registerTransition(this, name);
        return this;
    };

    Toasty.prototype.toast = function (type, message, duration) {
        
        var classes = this.classmap;
        var options = this.settings;

        // check if the transition name provided in options
        // exists in classes, if not register it:
        if (classes.hasOwnProperty(options.transition) === false) registerTransition(this, options.transition);
        // use the transition name provided in options:
        var transition = classes[options.transition];

        // check if the toast container exists:
        var container = null;
        if (typeof options.transition === 'string')
            container = document.querySelector('.' + transition.container + '--' + options.transition);
        else
            container = document.querySelector('.' + transition.container);

        var containerExists = !! container;
        if (containerExists) {
            // create the toast container if not exists:
            container = container.querySelector('.' + transition.mainwrapp); // use the wrapper instead of main container.
        } else {
            container = addClass(node('div'), transition.container, transition.container + '--' + options.transition);
            // create a alert wrapper instance:
            var wrapp = addClass(node('div'), transition.mainwrapp);
            // append the alert wrapper and now, this is the main container:
            container.appendChild(container = wrapp);
        }

        // create a new toast instance
        var newToast = addClass(node('div'), options.classname, transition.toasts[type], transition.animate.init);
            newToast.innerHTML = message;

        // insert the toast container into the HTML:
        if (! containerExists)
            document.body
                    .insertBefore(parentElement(container), options.prependTo);


        // OPTIONAL STEP (must be first):
        // INI: enable or disable toast sounds.
        // --------------------------------------------------------------------
        if (options.enableSounds == true)
            playSound(type, container, options.sounds, transition.playerclass);
        // --------------------------------------------------------------------
        // END: enable or disable toast sounds.


        // STEP 1:
        // INI: showing the toas message
        // --------------------------------------------------------------------
        showToast(type, newToast, container, transition.animate, duration, options.insertBefore, options.onShow);
        // --------------------------------------------------------------------
        // END: showing the toas message


        // STEP 2:
        // INI: prepare the toast to hide it.
        // --------------------------------------------------------------------
        if (options.autoClose == true)
            // hide the toast message automatically:
            hideToast(type, newToast, duration, transition.animate, options.onHide);
        else
            // hide the toast message on click it with an CSS3 transition:
            hideToastOnClick(type, newToast, transition.animate, options.onHide, 'close-on-click');
        // --------------------------------------------------------------------
        // END: prepare the toast to hide it.


        // OPTIONAL STEP (must be last):
        // INI: Enable or disable the progressbar.
        // --------------------------------------------------------------------
        if (options.progressBar == true && options.autoClose == true)
            showProgressBar(type, newToast, duration, transition);
        // --------------------------------------------------------------------
        // END: Enable or disable the progressbar.


        return this;
    };

    Toasty.prototype.info = function (message, duration) {
        duration = getAutoCloseDuration(message, duration, this.settings);
        this.toast("info", message, duration);
    };

    Toasty.prototype.success = function (message, duration) {
        duration = getAutoCloseDuration(message, duration, this.settings);
        this.toast("success", message, duration);
    };

    Toasty.prototype.warning = function (message, duration) {
        duration = getAutoCloseDuration(message, duration, this.settings);
        this.toast("warning", message, duration);
    };

    Toasty.prototype.error = function (message, duration) {
        duration = getAutoCloseDuration(message, duration, this.settings);
        this.toast("error", message, duration);
    };

    // FALLBACK:
    // Create Element.remove() function if not exist:
    if ('remove' in Element.prototype) {
        // the browser supports .remove() function...
    } else {
        Element.prototype.remove = function() {
            if (this.parentNode)
                this.parentNode.removeChild(this);
        };
    }

    window.Toasty = Toasty;

})(window, document);