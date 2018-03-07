(function(w) {

    'use strict';

    var toasty = new Toasty({
        transition: "fade",
        duration: 0, // calculated automatically.
        enableSounds: true,
        progressBar: true,
        autoClose: true,
        onShow: function (type) {
            console.log("a toast " + type + " message is shown!");
        },
        onHide: function (type) {
            console.log("the toast " + type + " message is hidden!");
        }
    });

    var tran = document.getElementById('select-transition');
    var btns = document.querySelectorAll('.btn-example');
    var down = document.getElementById('action-download');

    function show (type, message) {
        //
        config (tran);
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

    function config (select) {
        var option = select.options[select.selectedIndex];
            toasty.configure({
                classname: "toast",
                insertBefore: option.getAttribute('data-insertbefore') === 'true'
            });
            toasty.transition(select.value);
    }

    for (var btn in btns) if (btns.hasOwnProperty(btn) === true) {
        //
        btns[btn].addEventListener('click', function(e) {
            e.preventDefault();
            show(this.id, this.title);
        }, false);
    }

    tran.addEventListener('change', function(e) {
        // change the transition:
        config(this)
    }, false);

    down.addEventListener('click', function(e) {
        toasty.configure({
            transition: 'slideLeftFade',
            autoClose: true
        })
        .success("<span class=\"fa fa-download\"></span> Preparing download...", 1000);
    });

    config(tran);

    // new-transition-scale example:
    document.getElementById('new-transition-scale').addEventListener('click', function(e) {
        e.preventDefault();
        // register the new transition:
        toasty.configure({ classname: "toast" });
        toasty.transition("scale");
        // and run the first alert message:
        toasty.info("You have been registred a new scale transition correctly.", 2500);
    });

    // alerts-re-stylized example:
    document.getElementById('alerts-re-stylized').addEventListener('click', function(e) {
        e.preventDefault();

        toasty.configure({
            classname: "alert",
            insertBefore: false,
            progressBar: true,
            enableSounds: true
        });

        // register the new transition:
        toasty.transition("scale");

        // and run the first alert message:
        toasty.info("The toast messages have been re-stylized correctly.", 2500);
    });

})(window);
