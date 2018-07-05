Zepto(function ($) {
var container = $('#ad-container'),
    content = $('#ad-content'),
    bannerWidth = container.width(),
    bannerHeight = container.height(),
    manifest = [
        { src: 'bg.jpg', id: 'bg', append: 'bg-image' },
        { src: 'park.png', id: 'park', append: 'park' },
        { src: 'woman.png', id: 'woman', append: 'woman' },
        { src: 'copy-1.png', id: 'copy-1', append: 'copy-1' },
        { src: 'copy-2.png', id: 'copy-2', append: 'copy-2' },
        { src: 'copy-3.png', id: 'copy-3', append: 'copy-3' },
        { src: 'copy-4.png', id: 'copy-4', append: 'copy-4' },
        { src: 'end-copy.png', id: 'end-copy', append: 'end-copy' }
    ];

    ////////////////// READY ///////////////////

    function bannerInit() {
        loader = new createjs.LoadQueue(false);
        loader.addEventListener('complete', appendImages);
        loader.loadManifest(manifest, true, 'assets/');
    }

    ////////////////// GET SET ///////////////////

    function appendImages() {
        for (var i = 0; i < manifest.length; i++) {
            var item = manifest[i];
            if (typeof item === 'object' && item.append) {
                var itemId = item.id,
                    domEl = document.getElementById(item.append);
                domEl.appendChild(loader.getResult(itemId));
            }
        }
        showBanner();
    }

    function showBanner() {
        content.removeClass('loading');
        $('#preloader').addClass('off');
        var scene = document.getElementById('html-main'),
            parallax = new Parallax(scene, {
                limitY: 15,
                selector: '.layer'
            });
        animate();
    }

    ////////////////// GO ///////////////////

    function animate() {
    
        var background = $('#bg-image img'),
        park = $('#park img'),
        woman = $('#woman img'),
        txt1 = $('#copy-1 img'),
        txt2 = $('#copy-2 img'),
        txt3 = $('#copy-3 img'),
        txt4 = $('#copy-4 img'),
        txt5 = $('#end-copy img'),
        whiteout = $('#whiteout'),
        loop = -1;

        var tl_main = new TimelineMax({
            repeat: 1,
            repeatDelay: 0.5
        })   
           .set(background, { y: 0})
           .set(park, { y: 300})
           .set(woman, { y: 300})
            .to(whiteout, 1, {opacity: 0}, 0)
            .to(background,14, { y: -200  }, 0)
            .to(park,11, { y: 130  }, 2)
            .to(txt1,2, { opacity: 1  }, 0)     
            .to(woman,9, { y: 150  }, 5)  
            .to(txt1,1, { opacity: 0  }, 3)
            .to(txt2,2, { opacity: 1  }, 4)     
            .to(txt2,1, { opacity: 0  }, 7) 
            .to(txt3,2, { opacity: 1  }, 8)     
            .to(txt3,1, { opacity: 0  }, 11)
            .to(txt4,2, { opacity: 1  }, 12)     
            .to(txt4,1, { opacity: 0  }, 14.5)     
            .to(txt5, 2, { opacity: 1, onComplete: loopCheck  }, 15)     
            .to(txt4,1, { opacity: 0  }, 20)
            .to(txt5,1, { opacity: 0  }, 20)     
            .to(whiteout, 1, {opacity: 1, onComplete: function(){
            }}, 21);

            //.seek(15).pause()    
        
        function loopCheck() {
            loop += 1;
            loop ? tl_main.pause() : tl_main.play() 
        }

     }; //// END ANIM /////

    function getRandomInt (min, max) {
  
    return Math.floor(Math.random() * (max - min + 1)) + min;

    }

     bannerInit();

});