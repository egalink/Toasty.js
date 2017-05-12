/*!
 * Toasty.js v1.2.10
 *
 * A minimal JavaScript notification plugin that provides a simple way
 * to display customizable toast messages.
 *
 * Edgar Jakim Hernández Arrieta <egalink@gmail.com>
 * license: MIT
 * https://github.com/egalink/Toasty.js
 */
;(function() {

    'use strict';

    var options = {

        classname: 'toast', // STRING: main class name used to styling each toast message with CSS.

        animation: 'default', // STRING: Name of the CSS animation that will be used to shown or hide the toast.

        duration: 4000, // INTEGER: Duration that the toast will be displayed in milliseconds:
                        // .... Default value is set to 4000 (4 seconds). 
                        // .... If it set to 0, the duration for each toast is calculated by message length.

        enableSounds: false, // BOOLEAN: enable or disable toast sounds:
                             // .... Set to BOOLEAN TRUE  - to enable toast sounds.
                             // .... Set to BOOLEAN FALSE - otherwise.

        autoClose: true, // BOOLEAN: enable or disable auto hiding on toast messages:
                         // .... Set to BOOLEAN TRUE  - to enable auto hiding.
                         // .... Set to BOOLEAN FALSE - disable auto hiding. Instead the user must click on toast message to close it.

        progressBar: false, // BOOLEAN: enable or disable the progressbar:
                            // .... Set to BOOLEAN TRUE  - enable the progressbar only if the autoClose option value is set to BOOLEAN TRUE.
                            // .... Set to BOOLEAN FALSE - disable the progressbar. 

        // Yep, support custom sounds for each toast message when are shown
        // if the enableSounds option value is set to BOOLEAN TRUE:
        // NOTE: The paths must point from the project's root folder.
        sounds: {
            info: '//cdn.rawgit.com/egalink/Toasty.js/master/src/sounds/success,\ warning/1.mp3', // path to sound for informational message.
            success: '//cdn.rawgit.com/egalink/Toasty.js/master/src/sounds/success,\ warning/2.mp3', // path to sound for successfull message.
            warning: '//cdn.rawgit.com/egalink/Toasty.js/master/src/sounds/success,\ warning/3.mp3', // path to sound for warn message.
            error: '//cdn.rawgit.com/egalink/Toasty.js/master/src/sounds/errors/1.mp3' // path to sound for error message.
        },

        prependTo: document.body.childNodes[0] // The placement where prepend the toast container.
    };

    var classes = {}; // auto class names for each HTML element.

    // default class map for the classes object values:
    var classesMap = {
          container: '{:classname}-container',
        progressbar: '{:classname}-progressbar',

        animate: {
            init: '{:classname}--{:animation}-init',
            show: '{:classname}--{:animation}-show',
            hide: '{:classname}--{:animation}-hide'
        },

        // available toast types for notifications:
        toasts: {
               info: '{:classname}--info',
            success: '{:classname}--success',
            warning: '{:classname}--warning',
              error: '{:classname}--error',
              sound: '{:classname}--notify-sound'
        }
    };

    // available CSS animations registered in toasty.css file:
    var animations = [
        'default',
        'slideFadeLeft',
        'slideFadeRight',
        'slideDownFade',
        'slideUpDownFade',
        'slideRightLeftFade'
    ];

    var Toasty = {

        config: function(opts) {
            setConfiguration(opts);
            return this;
        },

        info: function(msg, duration) {
            duration = calculateAutoCloseDuration(msg, duration);
            createToast(msg, 'info', duration);
        },

        success: function(msg, duration) {
            duration = calculateAutoCloseDuration(msg, duration);
            createToast(msg, 'success', duration);
        },

        warning: function(msg, duration) {
            duration = calculateAutoCloseDuration(msg, duration);
            createToast(msg, 'warning', duration);
        },

        error: function(msg, duration) {
            duration = calculateAutoCloseDuration(msg, duration);
            createToast(msg, 'error', duration);
        }

    };

    function whichTransitionEvent() {
        
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

    function extend(obj, toExtend) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && key in toExtend)
                toExtend[key] = obj[key];
        }
        return toExtend;
    }

    function walker(obj, map) {
    
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

    function parentElement(el) {
        return el.parentElement || el.parentNode;
    }

    function getClassesMap() {
        var string = JSON.stringify(classesMap);
        var object = JSON.parse(string);
        return object;
    }

    function getClassesByAnimation() {
        return classes[options.animation];
    }

    function setClasses(dict) {
        return walker(getClassesMap(), dict);
    }

    function setOptions(opts) {
        return extend(opts, options);
    }

    function setConfiguration(opts) {
        
        if (!! opts)
            options = setOptions(opts);

        // defines the option.animation value to show the toast animatedly:
        if (typeof options.animation != 'string') options.animation = 'default';

        for (var key in animations) if (classes.hasOwnProperty(animations[key]) === false) {
                classes[animations[key]] = setClasses({
                    '{:classname}': options.classname,
                    '{:animation}': animations[key]
                });
            }
    }

    function calculateAutoCloseDuration(msg, duration) {
        if (options.duration == 0 && duration == undefined)
            duration = msg.length *100;
        else
            duration = duration || options.duration;

        return Math.floor(duration);
    }

    function playSound(type, container) {

        var animation = getClassesByAnimation();
        var sound = options.sounds[type],
            audio = document.createElement('audio');
            audio.autoplay = 'autoplay';
            audio.onended = function() {
                var parent = parentElement(this);
                this.remove();
                if (parent.childNodes.length < 1)
                    parent.remove();
            }

        audio.className = animation.toasts['sound'];
        audio.innerHTML = '<source src="' + sound + '" type="audio/mpeg"/>' +
                          '<embed hidden="true" autostart="true" loop="false" src="' + sound + '" />';

        container.appendChild(audio);
    }

    // show the toast with an CSS3 animation:
    function showToast(el, container) {

        var animation = getClassesByAnimation();
        
        var timer = 0,
            delay = function(callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };

        delay(function() {
            container.insertBefore(el, container.childNodes[0]);
            el.classList.add(animation.animate.show);
        }, 0);
    }

    // hide the toast:
    function removeToast(el) {
        var container = parentElement(el);
        el.remove();
        var num = container.childNodes.length;
        if (num < 1)
            container.remove();
    }

    // hide the toast with an CSS3 animation:
    function hideToast(el, duration) {

        var animation = getClassesByAnimation();

        var timer = 0,
            delay = function(callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };

        delay(function() {

            el.addEventListener(whichTransitionEvent(), function(e) {
                delay(function() { removeToast(el); }, 0);
            });

            el.classList.add(animation.animate.hide);

        }, duration);
    }

    // hide the toast on click it with an CSS3 animation:
    function closeOnClick(el) {
        var name = options.classname + '--close-on-click';
        el.classList.add(name);
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            el.classList.remove(name);
            hideToast(e.target, 0);
        });
    }

    function showProgressBar(el, duration, type) {
        var animation = getClassesByAnimation();
        var progressBar = document.createElement('div');
            progressBar.classList.add(animation.progressbar);
            progressBar.classList.add(animation.progressbar + '--' + type);
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

    // let's to create the toast:
    function createToast(html, type, duration) {
        
        var animation = getClassesByAnimation();
        var container = null;

        // check if the toast container exists:
        if (typeof options.animation == 'string')
            container = document.querySelector('.' + animation.container + '--' + options.animation);
        else
            container = document.querySelector('.' + animation.container);

        var containerExists = !! container;

        // create the toast container if not exists:
        if (! containerExists) {
            container = document.createElement('div');
            container.classList.add(animation.container);
            container.classList.add(animation.container + '--' + options.animation);
        }

        // create a new toast instance
        var newToast = document.createElement('div');
            newToast.classList.add(options.classname);
            newToast.classList.add(animation.toasts[type]);
            newToast.classList.add(animation.animate.init);
            newToast.innerHTML = html;

        // insert the toast container into the HTML:
        if (! containerExists)
            document.body.insertBefore(container, options.prependTo);

        // enable or disable toast sounds:
        if (options.enableSounds == true)
            playSound(type, container);

        // show the toast message:
        showToast(newToast, container);

        // prepare the toast to hide it:
        if (! options.autoClose)
            closeOnClick(newToast);
        else
            hideToast(newToast, duration);

        // show a progressbar on toast messages:
        if (options.progressBar == true && options.autoClose == true) {
            showProgressBar(newToast, duration, type);
        }

        // end main function.
    }

    // initialize the plugin configuration:
    function init() { setConfiguration(); }
    window.Toasty = Toasty;
    init();

})();