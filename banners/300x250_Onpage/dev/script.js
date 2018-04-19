Zepto(function ($) {
    var content = $('#ad-content'),
        loader,
        bannerWidth = content.width(),
        bannerHeight = content.height(),
        manifest = [
            { src: 'espionage.png', id: 'espionage', append: 'espionage' },
            { src: 'copy-1.png', id: 'copy-1', append: 'copy-1' },
            { src: 'copy-2.png', id: 'copy-2', append: 'copy-2' },
            { src: 'copy-3.png', id: 'copy-3', append: 'copy-3' },
            { src: 'logo.png', id: 'logo', append: 'logo' }
        ];

    function bannerInit() {
        loader = new createjs.LoadQueue(false);
        loader.addEventListener('complete', appendImages);
        loader.loadManifest(manifest, true, 'assets/');
    }

    function appendImages() {
        for (var i = 0; i < manifest.length; i++) {
            var item = manifest[i];
            if (typeof item === 'object' && item.append) {
                var itemId = item.id,
                    domEl = document.getElementById(item.append);
                domEl.appendChild(loader.getResult(itemId));
            }
        }
        animate();
    }
    function animate() {
        var txt = $('#espionage');
        var endframe = $('#end-frame');
        var cta1 = $('#copy-1');
        var cta2 = $('#copy-2');
        var cta3 = $('#copy-3');
        var logo = $('#logo');
        var tlStart = 7;

        var tl_main = new TimelineMax()
            .set(txt, { x: '-=20', opacity: 0 })
            .set(cta1, { x: '-=20', opacity: 0 })
            .set(cta2, { x: '-=20', opacity: 0 })
            .set(cta3, { x: '-=20', opacity: 0 })
            .set(logo, { y: '+=20', opacity: 0 })
            .to(txt, 1, {x: 0, opacity: 1})
            .to(txt, 1, { x: '+=30', opacity: 0 }, 3.5)
            .to(cta1, 1, { x: 0, opacity: 1 }, 4)
            .to(cta2, 1, { x: 0, opacity: 1 }, 4.25)
            .to(cta3, 1, { x: 0, opacity: 1 }, 4.5)
            .to(logo, 1, { y: 0, opacity: 1 }, 5)
            .pause()

        var vid = myFT.$("#vid");
        vid[0].play();

        vid.on("timeupdate", function (event) {
            var t = event.target.currentTime;
            if (t >= tlStart && tl_main.paused()) {
                tl_main.play();
            }
        })
        $('#preloader').addClass('off');
        content.removeClass('loading');
    };
    bannerInit();
});