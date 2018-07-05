Zepto(function ($) {
    var content = $('#ad-content'),
        loader,
        bannerWidth = content.width(),
        bannerHeight = content.height(),
        tl_main,
        playing,
        iconReplay = $('#replay'),
        endframe = $('#copy-container'),
        vid = myFT.$("#vid"),
        manifest = [
            { src: 'gradient.jpg', id: 'bg' },
            { src: 'copy-1-1.png', id: 'copy-1-1', append: 'copy--1-1' },
            { src: 'copy-1-2.png', id: 'copy-1-2', append: 'copy--1-2' },
            { src: 'copy-1-3.png', id: 'copy-1-3', append: 'copy--1-3' },
            { src: 'copy-2-1.png', id: 'copy-2-1', append: 'copy--2-1' },
            { src: 'copy-2-2.png', id: 'copy-2-2', append: 'copy--2-2' },
            { src: 'copy-2-3.png', id: 'copy-2-3', append: 'copy--2-3' },
            { src: 'logo.png', id: 'logo', append: 'logo' }
        ];

    function bannerInit() {
        loader = new createjs.LoadQueue(false);
        loader.addEventListener('complete', appendImages);
        loader.loadManifest(manifest, true, 'assets/');
    }

   // @import '../../../utils/appendImages.js';

    function animate() {
        var video = $('#video-container');
        var logo = $('#logo');
        var copy1 = $('#copy--1-1');
        var copy2 = $('#copy--1-2');
        var copy3 = $('#copy--1-3');
        var copy4 = $('#copy--2-1');
        var copy5 = $('#copy--2-2');
        var copy6 = $('#copy--2-3');
        var tlStart = 10.7;

        tl_main = new TimelineMax({
            onComplete: function () {
                iconReplay.removeClass('off');
            },
            paused: true
        })
            .set(endframe, { opacity: 0 })
            .set(copy1, { y: '+=40' })
            .set(copy2, { y: '+=40' })
            .set(copy3, { y: '+=40' })
            .set(copy4, { y: '+=40' })
            .set(copy5, { y: '+=40' })
            .set(copy6, { y: '+=40' })
            .set(logo, { y: '+=20' })
            .to(endframe, 1, { opacity: 1, ease: Power2.easeOut })
            .to(copy1, 1.5, { y: 0, opacity: 1, ease: Power2.easeOut }, 0.8)
            .to(copy2, 1.5, { y: 0, opacity: 1, ease: Power2.easeOut }, 1)
            .to(copy3, 1.5, { y: 0, opacity: 1, ease: Power2.easeOut }, 1.2)
            .to(logo, 1.5, { y: 0, opacity: 1, ease: Power2.easeOut }, 2)
            .to(copy1, 1, { y: '-=40', opacity: 0, ease: Power2.easeIn }, 5)
            .to(copy2, 1, { y: '-=40', opacity: 0, ease: Power2.easeIn }, 5.2)
            .to(copy3, 1, { y: '-=40', opacity: 0, ease: Power2.easeIn }, 5.4)
            .to(copy4, 1.5, { y: 0, opacity: 1, ease: Power2.easeOut }, 6.2)
            .to(copy5, 1.5, { y: 0, opacity: 1, ease: Power2.easeOut }, 6.4)
            .to(copy6, 1.5, { y: 0, opacity: 1, ease: Power2.easeOut }, 6.6);

        vid.on("timeupdate", function (event) {
            var t = event.target.currentTime;
            if (t >= tlStart && tl_main.paused()) {
                tl_main.play();
            }
        });

        vid.on("ended", function () {
            playing = false;
        });

        vid[0].play();

        $('#preloader').addClass('off');
        content.removeClass('loading');
    };

    function replay() {
        playing = true;
        iconReplay.addClass('off');
        vid[0].restart();
        TweenLite.to(endframe, 0.5, { opacity: 0 });
        setTimeout(function() {
            tl_main.restart().pause();
        },500)
    }

    iconReplay.on("click", function () {
        replay();
    })

    document.addEventListener("visibilitychange", function () {
        if (!document["hidden"] && vid[0].paused && playing === true) {
            vid[0].play();
        }
    });

    
    bannerInit();
});