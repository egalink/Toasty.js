/*!
 * Toasty.js v1.1.0
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
        
        classname: 'toast', // ..... The class name user in each toast alert.

        animation: 'default', // ... The CSS class transition.

        prependTo: document.body.childNodes[0], //  The placement where prepend the toast container.

        animated: true, // ......... Defines whether toasts will be displayed or hidden with animation:
                        // ............. FALSE - show the toast without CSS3 animation.
                        // ............. TRUE  - otherwise.

        duration: 4000, // ......... Duration that the toast will be displayed in milliseconds:
                        // ............. Default value is set to 4000 (four seconds). 
                        // ............. If set to 0, the duration for each toast is calculated by message length.

        enableSounds: false, // .... ENABLE or DISABLE toast sounds:
                             // ........ TRUE  - enable toast sounds.
                             // ........ FALSE - otherwise.

        autoClose: true, // ........ ENABLE or DISABLE auto hiding on toast messages:
                         // ............ TRUE  - Enable auto hiding.
                         // ............ FALSE - Disable auto hiding. Instead the user must click on toast message to close it.

        showProgressBar: true, // . ENABLE or DISABLE progressbar:
                               // ..... TRUE  - enable the progressbar only if the autoClose option value is set to TRUE.
                               // ..... FALSE - disable the progressbar. 

        sounds: {
            info: '../src/sounds/success,\ warning/1.mp3',
            success: '../src/sounds/success,\ warning/2.mp3',
            warning: '../src/sounds/success,\ warning/3.mp3',
            error: '../src/sounds/errors/1.mp3'
        }
    };

    var classes = { // auto class names for each HTML element.
        
          container: '{:classname}-container',
        progressbar: '{:classname}-progressbar',

        animate: {
            init: '{:classname}--{:animation}-init',
            show: '{:classname}--{:animation}-show',
            hide: '{:classname}--{:animation}-hide'
        },

        toasts: { // available toast types for notifications.
               info: '{:classname}--info',
            success: '{:classname}--success',
            warning: '{:classname}--warning',
              error: '{:classname}--error',
              sound: '{:classname}--notify-sound'
        }
    };

    var Toasty = {

        config: function(opts) {
            setOptions(opts);
            init();
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

    function setClasses(dict) {
        classes = walker(classes, dict);
    }

    function setOptions(opts) {
        options = extend(opts, options);
    }

    function calculateAutoCloseDuration(msg, duration) {

        if (options.duration == 0 && duration == undefined)
            duration = msg.length *100;
        else
            duration = duration || options.duration;

        return Math.floor(duration);
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

    // show the toast with an CSS3 animation:
    function showAnimatedToast(el, container) {
        container.classList.add(classes.container + '--' + options.animation);
        el.classList.add(classes.animate.init);
        showToast(el, container);
        setTimeout(function() {
            el.classList.add(classes.animate.show);
        }, 0);
    }

    // hide the toast:
    function hideToast(el, container) {
        el.remove();
        var num = document.querySelector('.' + classes.container).childNodes.length;
        if (num < 1)
            container.remove();
    }

    // hide the toast with an CSS3 animation:
    function hideAnimatedToast(el, container) {
        el.addEventListener('transitionend', function(e) {
            var parent = e.currentTarget.parentNode;
            if (parent == null)
                return;
            hideToast(el, container);
        });
        el.classList.add(classes.animate.hide);
    }

    // hide the toast on click it.
    function closeOnClick(el, container) {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            hideToast(e.target, container);
        });
    }

    // hide the toast on click it with an CSS3 animation.
    function closeOnClickAnimated(el, container) {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            hideAnimatedToast(e.target, container);
        });
    }

    function showProgressBar(newToast, duration, type) {
        var progressBar = document.createElement('div');
            progressBar.className = classes.progressbar + ' ' + classes.progressbar + '--' + type;
            newToast.appendChild(progressBar);

        var iterat = 0,
            offset = 0;

        var interval = setInterval(function() {

            iterat ++;
            offset = Math.round((1000 *iterat) / duration);
        
            if (offset >= 100) {
                clearInterval(interval);
            } else {
                progressBar.style.width = offset + '%';
            }

        }, 10);
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
            newToast.className = options.classname + ' ' + classes.toasts[type];
            newToast.innerHTML = html;

        // insert the toast container into the HTML:
        if (! toastContainerExists) {
            document.body.insertBefore(toastContainer, options.prependTo);
        }

        // enable or disable toast sounds:
        if (options.enableSounds == true) {
            playsound(type, toastContainer);
        }

        // show / hide the toast messages:
        if (options.animated) {
            // show the toast with animation:
            showAnimatedToast(newToast, toastContainer);
            // prepare the toast to hide it:
            if (! options.autoClose)
                closeOnClickAnimated(newToast, toastContainer);
            else 
                setTimeout(function() { hideAnimatedToast(newToast, toastContainer); }, duration);

        }  else {
            // show the toast without animation:
            showToast(newToast, toastContainer);
            // prepare the toast to hide it:
            if (! options.autoClose)
                closeOnClick(newToast, toastContainer);
            else
                setTimeout(function() { hideToast(newToast, toastContainer); }, duration);

        }

        // show a progressbar on toast messages:
        if (options.showProgressBar == true && options.autoClose == true) {
            showProgressBar(newToast, duration, type);
        }

        // end main function.
    }

    // initialize the plugin configuration:
    function init()
    {
        setClasses({
            '{:classname}': options.classname,
            '{:animation}': options.animation
        });
    }

    init();

    window.Toasty = Toasty;

})();