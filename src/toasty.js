;(function() {

    'use strict';

    var options = {
        prependTo: document.body.childNodes[0], //  The placement where prepend the toast container.

        animated: true, // ........................ Defines whether toasts will be displayed or hidden with animation:
                        // ............................ FALSE - show the toast without CSS animation
                        // ............................ TRUE  - otherwise.

        duration: 4000, // ........................ Duration that the toast will be displayed in milliseconds:
                        // ............................ Default value is set to 4000 (four seconds). 
                        // ............................ If set to 0, the duration for each toast is calculated by message length.

        enableSounds: false, // ....................... Set to TRUE to enable toast sounds.
        sounds: {
            info: '../src/sounds/success,\ warning/1.mp3',
            success: '../src/sounds/success,\ warning/2.mp3',
            warning: '../src/sounds/success,\ warning/3.mp3',
            error: '../src/sounds/errors/1.mp3'
        },
    };

    var classes = {
        container: 'toast-container',
        default: 'toast',
        animate: {
            init: 'toast--default-animation-init',
            show: 'toast--default-animation-show',
            hide: 'toast--default-animation-hide',
            cont: 'toast-container--default-animation'
        },
        toasts: { // available toast types for notifications.
            info: 'toast--info',
            success: 'toast--success',
            warning: 'toast--warning',
            error: 'toast--error',
            sound: 'toast--notify-sound'
        }
    };

    var Toasty = {

        setOptions: setOptions,

        setClasses: setClasses,

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

    function extend(obj, toExtend) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && key in toExtend)
                toExtend[key] = obj[key];
        }
        return toExtend;
    }

    function calculateAutoCloseDuration(msg, duration) {

        if (options.duration == 0 && duration == undefined)
            duration = msg.length *100;
        else
            duration = duration || options.duration;

        return Math.floor(duration);
    }

    function setOptions(opts) {
        options = extend(opts, options);
    }

    function setClasses(dict) {
        classes = extend(dict, classes);
    }

    function playsound(type, container) {

        var sound = options.sounds[type],
            audio = document.createElement('audio');
            audio.autoplay = 'autoplay';
            audio.onended = function () {
                this.remove();
                var num = document.querySelector('.' + classes.container).childNodes.length;
                if (num < 1)
                    container.remove();
            }

        audio.className = classes.toasts['sound'];
        audio.innerHTML = '<source src="' + sound + '" type="audio/mpeg"/>' +
                          '<embed hidden="true" autostart="true" loop="false" src="' + sound + '" />';

        container.appendChild(audio);
    }

    // show the toast:
    function showToast(el, container) {
        container.insertBefore(el, container.childNodes[0]);
    }

    // hide the toast:
    function hideToast(el, container) {
        el.remove();
        var num = document.querySelector('.' + classes.container).childNodes.length;
        if (num < 1)
            container.remove();
    }

    // show the toast with an CSS animation:
    function showAnimatedToast(el, container) {
        container.classList.add(classes.animate.cont);
        el.classList.add(classes.animate.init);
        showToast(el, container);
        setTimeout(function() {
            el.classList.add(classes.animate.show);
        }, 0);
    }

    // hide the toast with an CSS animation:
    function hideAnimatedToast(el, container) {
        el.addEventListener('transitionend', function(e) {
            var parent = e.currentTarget.parentNode;
            if (parent == null)
                return;
            hideToast(el, container);
        });
        el.classList.add(classes.animate.hide);
    }

    // let's to create the toast:
    function createToast(html, type, duration) {

        // check if the toast container exists: 
        var toastContainer = document.querySelector('.' + classes.container);
        var toastContainerExists = !! toastContainer;

        // create the toast container if not exists:
        if (! toastContainerExists) {
            toastContainer = document.createElement('div');
            toastContainer.className = classes.container;
        }

        // create a new toast instance
        var newToast = document.createElement('div');
            newToast.className = classes.default + ' ' + classes.toasts[type];
            newToast.innerHTML = html;

        // insert the toast container into the HTML:
        if (! toastContainerExists) {
            document.body.insertBefore(toastContainer, options.prependTo);
        }

        if (options.enableSounds == true) {
            playsound(type, toastContainer);
        }

        if (options.animated) {
            // show the toast with animation:
            showAnimatedToast(newToast, toastContainer);
            // prepare the toast to hide it:
            setTimeout(function() { hideAnimatedToast(newToast, toastContainer); }, duration);
        }  else {
            // show the toast without animation:
            showToast(newToast, toastContainer);
            // prepare the toast to hide it:
            setTimeout(function() { hideToast(newToast, toastContainer); }, duration);
        }
    }

    window.Toasty = Toasty;

})();