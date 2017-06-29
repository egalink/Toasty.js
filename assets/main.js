(function(w) {

    'use strict';

    var toasty = new Toasty({
        duration: 0,
        autoClose: true,
        enableSounds: true,
        progressBar: true,
        sounds: {
            info: "./dist/sounds/info/1.mp3",
            success: "./dist/sounds/success/1.mp3",
            warning: "./dist/sounds/warning/1.mp3",
            error: "./dist/sounds/error/1.mp3",
        }
    });

    var tran = document.getElementById('select-transition');
    var btns = document.querySelectorAll('.btn-example');
    var down = document.getElementById('action-download');

    var show = function (type, message) {
        //
        conf(tran);
        
        switch (type) {
            case 'info':
                toasty.info(message);
                break;
            case 'success':
                toasty.success(message);
                break;
            case 'warning':
                toasty.warning(message);
                break;
            case 'error':
                toasty.error(message);
                break;
            default:
                console.error("Error - no toast to show!");
        }

        return type;
    }
    var conf = function(select) {
        //
        var option = select.options[select.selectedIndex];
            toasty.configure({
                transition: select.value,
                insertBefore: option.getAttribute('data-insertbefore') === 'true'
            });
    }

    for (var btn in btns) if (btns.hasOwnProperty(btn) === true) {
        //
        btns[btn].addEventListener('click', function(e) {
            // show a toast:
            e.preventDefault();
            show(this.id, this.title);
        }, false);
    }

    tran.addEventListener('change', function(e) {
        // change the transition:
        conf(this)
    }, false);

    down.addEventListener('click', function(e) {
        toasty.configure({
            transition: 'slideLeftFade',
            autoClose: true
        })
        .success("<span class=\"fa fa-download\"></span> Preparing download...", 1000);
    });

    conf(tran);

})(window);
