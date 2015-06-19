var f7 = new Framework7();
var $$ = Dom7;

// var mainView = f7.addView('.view-main', {
//     // Because we want to use dynamic navbar, we need to enable it for this view:
//     dynamicNavbar: true
// });

$$('.show-statics').on('click', function () {
    f7.showTab('#statics');
});
