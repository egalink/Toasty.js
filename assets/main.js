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
        },
        onShow: function (type) { console.log("a toast " + type + " message is shown!"); },
        onHide: function (type) { console.log("the toast " + type + " message is hidden!"); }
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

    // new-transition-scale example:
    document.getElementById('new-transition-scale').addEventListener('click', function(e) {
        e.preventDefault();

        // the main Toasty function:
        var toast = new Toasty({
            transition: "scale"
        });

        // register the new transition:
        toast.transition("scale");

        // and run the first alert message:
        toast.info("You have been registred a new scale transition correctly.", 2500);
    });

    // alerts-re-stylized example:
    document.getElementById('alerts-re-stylized').addEventListener('click', function(e) {
        e.preventDefault();

        var toast = new Toasty({
            classname: "alert",
            transition: "scale",
            insertBefore: false,
            progressBar: true,
            enableSounds: true
        });

        // register the new transition:
        toast.transition("scale");

        // and run the first alert message:
        toast.info("The toast messages have been re-stylized correctly.", 2500);
    });

})(window);
