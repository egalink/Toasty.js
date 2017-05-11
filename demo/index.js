(function() {

    'use strict';

    Toasty.setOptions({
        animated: true,
        duration: 0, // if set to 0, the duration for each toast is calculated by message length.
        enableSounds: true,
        autoClose: true,
        showProgressBar: true
    });

    // configure the toasts:
    var successBtn = document.querySelector('#success');
    var infoBtn = document.querySelector('#info');
    var warningBtn = document.querySelector('#warning');
    var errorBtn = document.querySelector('#error');

    infoBtn.addEventListener('click', function(e)
    {
        Toasty.info('Here is some information!');
    });

    successBtn.addEventListener('click', function(e)
    {
        Toasty.success('You did something good!');
    });

    warningBtn.addEventListener('click', function(e)
    {
        Toasty.warning('Warning! Do not proceed any further!');
    });

    errorBtn.addEventListener('click', function(e)
    {
        Toasty.error('Something terrible happened!');
    });

})();
