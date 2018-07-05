Zepto(function ($) {
  var width = 300;
  var height = 250;
  var preload, draw;
  var ui_yellow = '#f5e710';
  var ui_pink = '#bd2b7d';
  var ui_lilac = '#bd9cc7';
  var ui_teal = '#6dc8e1';
  var ui_neutral = '#54565b';

  /*=============================================>>>>>
  = RAF POLYFILL =
  ===============================================>>>>>*/

  window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (f) { return setTimeout(f, 1000 / 60) } // simulate calling code 60 

  window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function (requestID) { clearTimeout(requestID) } //fall back

  /*=============================================>>>>>
  = Banner Setup =
  ===============================================>>>>>*/

  function loadImage() {
    preload = new createjs.LoadQueue();
    preload.addEventListener("fileload", appendImage);
    preload.loadFile("assets/mpu_bg_A.jpg");
  }
  function appendImage(event) {
    $('.bg-image').append(event.result);
    animate();
  }
  function animate() {
    /*=============================================>>>>>
    = SVG GRAPHICS =
    ===============================================>>>>>*/
    draw = SVG('graphics').size('100%', '100%');
    var star = draw.group();
    var centre = star.circle(2).fill('#fff').x(18);
    var sub1 = star.group();
    var circ1 = sub1.circle(2).fill('#fff').x(10);
    var circ2 = circ1.clone().x(14);
    var circ3 = circ1.clone().x(22);
    var circ4 = circ1.clone().x(26);
    var sub2 = sub1.clone();
    var sub3 = sub1.clone();
    var sub4 = sub1.clone();

    sub2.transform({ rotation: 45 });
    sub3.transform({ rotation: 90 });
    sub4.transform({ rotation: 135 });

    star.move(260, 20);

    var rules = draw.group();
    //var l1 = draw.line(0,0, 300,0).stroke({ width: 1, color: '#fff' });
    var pattern_lines = draw.pattern(width, height, function (add) {
      for (var i = 0; i < 20; i++) {
        var ypos = (i * 16) + 4;
        //add.use(l1).move(0, ypos)
        add.line(0, ypos, 300, ypos).stroke({ width: 1, color: '#fff' })
      }
    })

    var marks = draw.rect(20, 250)
      .fill(pattern_lines)
      .move(270, -250);

    var rMask = draw.rect(20, 58).fill('#fff').move(270, 46);
    var mask1 = draw.mask().add(rMask);
    marks.maskWith(mask1);

    var rectWipe = draw.rect(20, 58).fill('#fff').move(270, 50).id('rectWipe');

    var hatch1 = draw.symbol()
    hatch1.polyline('0,0 250,250').stroke({ width: 2, color: ui_neutral });

    var hatch2 = draw.symbol()
    hatch2.polyline('0,0 250,250').stroke({ width: 2, color: '#f5e710' });

    var pattern_grey = draw.pattern(300, 250, function (add) {
      for (var i = -40; i < 80; i++) {
        var xpos = i * 5;
        add.use(hatch1).move(xpos, 0)
      }
    })
      .id('pattern_grey')
      .center(150, 125);

    var pattern_yellow = draw.pattern(300, 250, function (add) {
      for (var i = -40; i < 80; i++) {
        var xpos = i * 5;
        add.use(hatch2).move(xpos, 0)
      }
    })
      .id('pattern_yellow')
      .center(150, 125);

    var glitch1 = draw.rect(50, 18)
      .id('glitch1')
      .fill(pattern_grey)
      .move(50, 172)
      .opacity(0);

    var glitch2 = draw.rect(30, 18)
      .fill(pattern_yellow)
      .move(80, 196)
      .opacity(0);

    var glitches = draw.group()
      .add(glitch1)
      .add(glitch2)

    var plus_yellow = draw.symbol();
    plus_yellow.polygon('0,4 4,4 4,0 6,0 6,4 10,4 10,6 6,6 6,10 4,10 4,6 0,6 0,4')
      .fill(ui_yellow);

    var plus_grey = draw.symbol();
    plus_grey.polygon('0,4 4,4 4,0 6,0 6,4 10,4 10,6 6,6 6,10 4,10 4,6 0,6 0,4')
      .fill(ui_neutral);

    var plus1 = draw.use(plus_yellow)
      .opacity(0);

    var plus2 = draw.use(plus_grey)
      .opacity(0)
      .dx(12);

    var plus3 = draw.use(plus_grey)
      .opacity(0)
      .dx(24);

    var plus4 = draw.use(plus_grey)
      .opacity(0)
      .dx(36);

    var pluses = draw.group()
      .add(plus1)
      .add(plus2)
      .add(plus3)
      .add(plus4);
    pluses.move(20, 200);

    var dots = draw.group();
    var dot1 = dots.circle(6).fill('#fff').move(22, 12).opacity(0);
    var dot2 = dots.circle(6).fill('#fff').move(22, 26).opacity(0);
    var dot3 = dots.circle(6).fill('#fff').move(22, 40).opacity(0);
    var divider = dots.line(0, 0, 30, 0).stroke({ width: 2, color: '#fff' }).opacity(0);
    dots.move(260, 166)


    /*=============================================>>>>>
    = GSAP ANIMATION =
    ===============================================>>>>>*/
    var bg = $('.bg-image');
    var frame1 = $('.frame-1');
    var frame2 = $('.frame-2');
    var endframe = $('.endframe');
    var line1, line2, line3, line4, line5, line6;
    var icon_comp = $('.comp');
    var icon_window = $('.window');
    var icon_tag = $('.tag');
    var end_divider = $('#end-divider');

    function makeThisBlink(el, numTimes) {
      var tl_blinker = new TimelineMax({ repeat: numTimes })
        .to(el, 0.1, { opacity: 0 })
        .to(el, 0.1, { opacity: 1 })
      return tl_blinker;
    }

    var tl_star = new TimelineMax()
      .to(star, 1, { rotate: 90, ease: Power2.easeOut })
      .add(makeThisBlink(star, 3), 0)
      //.add(makeThisBlink(star, 3), 3)
      .to(star, 1, { rotate: -90, ease: Power2.easeOut }, 5)
      //.add(makeThisBlink(star, 3), 6)
      .to(star, 0.2, { opacity: 0 }, 12)


    var tl_marks = new TimelineMax({ yoyo: true })
      .to(marks, 2, { y: '+=250', ease: Power2.easeOut })
      .add(makeThisBlink(marks, 3), 0)
      .fromTo('#rectWipe', 0.2, { css: { scaleX: 0, transformOrigin: "left top" } }, { css: { scaleX: 1 } }, 0)
      .to('#rectWipe', 0.2, { css: { scaleX: 0, transformOrigin: "right top" } }, 0.2)
      .to(pattern_lines, 2, { y: '-=250', ease: Power2.easeInOut })
      .to(pattern_lines, 2, { y: '+=150', ease: Power2.easeInOut })
      .to(pattern_lines, 2, { y: '-=50', ease: Power2.easeInOut })
      .to(pattern_lines, 3, { y: '+=50', ease: Power2.easeInOut })
      //.add(makeThisBlink(marks, 3), 4)

      //var tl_dots = new TimelineMax({ delay: 0.5, repeat: 2, repeatDelay: 0.5, rewind: true })
      var tl_dots = new TimelineMax({ delay: 0.5 })
      .add(makeThisBlink(divider, 2))
      .to(dot1, 0.2, { opacity: 1 }, 0)
      .to(dot2, 0.2, { opacity: 1 }, 0.1)
      .to(dot3, 0.2, { opacity: 1 }, 0.2)
      .to(icon_comp, 0.2, { opacity: 1 }, 0.2)
      .add(makeThisBlink(dots, 3))
      .add(makeThisBlink(icon_comp, 3))
      .add(makeThisBlink(divider, 2))
      .to(dot1, 0.2, { opacity: 0 }, 0.5)
      .to(dot2, 0.2, { opacity: 0 }, 0.6)
      .to(dot3, 0.2, { opacity: 0 }, 0.7)
      .to(dot1, 0.2, { opacity: 1 }, 0.8)
      .to(dot2, 0.2, { opacity: 1 }, 0.9)
      .to(dot3, 0.2, { opacity: 1 }, 1)

    var tl_pluses = new TimelineMax({ paused: true })
      .to(plus1, 0.1, { opacity: 1 })
      .to(plus2, 0.1, { opacity: 1 })
      .to(plus3, 0.1, { opacity: 1 })
      .to(plus4, 0.1, { opacity: 1 })
      .to(pluses, 0, { x: '+=30' })
      .to(pluses, 0, { x: '+=30' }, '+=0.2')
      .to(pluses, 0, { x: '+=30' }, '+=0.1')
      .to(plus1, 0.1, { opacity: 0 }, '+=0.2')
      .to(plus2, 0.1, { opacity: 0 })
      .to(plus3, 0.1, { opacity: 0 })
      .to(plus4, 0.1, { opacity: 0 })
      .to(plus4, 0.1, { opacity: 0 }, '=1');

    var tl_text_glitch = new TimelineMax({ paused: true })
      .set(glitch1, { opacity: 0 })
      .to(glitch1, 0.1, { opacity: 1 })
      .to(glitch1, 0.1, { opacity: 0 })
      .to(glitch1, 0.1, { opacity: 1 })
      .to(glitch1, 0.1, { opacity: 0 })
      .set(glitch1, { x: '+=120' })
      .to(glitch1, 0.1, { opacity: 1 })
      .to(glitch1, 0.1, { opacity: 0 })
      .to(glitch1, 0.1, { opacity: 1 })
      .to(glitch1, 0.1, { opacity: 0 })
      .to(glitch2, 0.1, { opacity: 1 })
      .to(glitch2, 0.1, { opacity: 0 })
      .to(glitch2, 0.1, { opacity: 1 })
      .to(glitch2, 0.1, { opacity: 0 })
      .set(glitch2, { x: '+=120' })
      .to(glitch2, 0.1, { opacity: 1 })
      .to(glitch2, 0.1, { opacity: 0 })
      .to(glitch2, 0.1, { opacity: 1 })
      .to(glitch2, 0.1, { opacity: 0 })

    var tl_main = new TimelineMax()
      .set(end_divider, { scaleX: 0, transformOrigin: "left top" })
      //.set(bg, { transformOrigin: "left top", scale: 0.8, y: "-=10", opacity: 0 })
      .set(frame1, { opacity: 0 })
     // .set(bg, { x: "-=80", y: "-=30"}, 0)
      .to(bg, 1, { opacity: 1 }, 0) 
      .add(function () {
        line1 = new Fader($('.headline-1'))
        line2 = new Fader($('.headline-2'), 1)
        //tl_text_glitch.play();
        //tl_pluses.play();
      }, 0)
      .set(frame1, { opacity: 1 }, 0)
      .to(frame1, 1, { y: "-=30", opacity: 0, ease: Power2.easeOut }, 4)
      .add(function () {
        line3 = new Fader($('.headline-3'));
        line4 = new Fader($('.headline-4'), 1);
        //tl_text_glitch.restart();
        //tl_pluses.restart();
      }, 4.5)
      .to(frame2, 1, { y: "-=30", opacity: 0, ease: Power2.easeOut }, 9)
      .set(endframe, { opacity: 1 }, 9.5)
      .add(function () {
        line5 = new Fader($('.headline-5'))
        line6 = new Fader($('.headline-6'), 0.5)
        line7 = new Fader($('.headline-7'), 1)
      }, 9.5)
      .to(bg, 2, { opacity: 0 }, 10)
      .to('.gradient-solid', 2, {opacity: 1}, 10)
      .to(end_divider, 1, { scaleX: 1, ease: Power2.easeOut }, 11)
      .add(makeThisBlink('.tag', 3), 11)
      .add(function () {
        glitch1.move(60, 140);
        pluses.move(40,164);
        makeThisBlink(glitch1, 1);
      }, 12)
      .to(glitch1, 0.2, { x: '+=40' }, 12)
      .set(glitch1, { opacity: 0 }, 12.5)
      .add(function () {
        line8 = new Fader($('.headline-8'))
        tl_pluses.play();
      }, 12.25)
      .add(function () {
        line9 = new Fader($('.headline-9'))
        glitch2.move(80, 140);
        makeThisBlink(glitch2, 1);
      }, 13)
      .to(glitch2, 0.2, { x: '+=40' }, 13)
      .add(makeThisBlink(icon_window,2), 13)
      .set(glitch1, { opacity: 0 }, 13.5)
      .set(glitch2, { opacity: 0 }, 13.5)
      .fromTo('.logo', 1, { x: '-=20'}, {x: 0, opacity: 1}, 13.5 )
  }

  /*=============================================>>>>>
  = FADE IN CHARACTERS ANIMATION CLASS =
  ===============================================>>>>>*/
  var Fader = function (el, delay) {
    this.el = el;
    this.delay = delay || 0;
    this.txt = el.data('copyline');
    this.hcontent = '';
    this.len = this.txt.length;
    this.currentChars = 0;
    this.typing = true;
    this.stagger = 0.05;
    this.start();
  }

  Fader.prototype = {
    start: function () {
      this.el.addClass('fading');
      this.buildHtml();
    },
    buildHtml: function () {
      for (var i = 0; i < this.len; i++) {
        if (this.txt[i] == " ") {
          this.hcontent += "<span class='space char-" + i.toString() + "'>" + this.txt[i] + "</span>";
        } else {
          this.hcontent += "<span class='char-" + i.toString() + "'>" + this.txt[i] + "</span>";
        }
      }
      //console.log(this.hcontent)
      this.el.html(this.hcontent);
      this.fadeIn();
    },
    fadeIn: function () {
      var that = this;
      var tl_fader = new TimelineMax({ delay: that.delay, onComplete: that.done });
      for (var i = 0; i < this.len; i++) {
        var el = this.el.find($('.char-' + i.toString()));
        tl_fader.add(TweenMax.set(el, { x: "+=10", y: "+=30", opacity: 0 }))
          .add(TweenMax.to(el, 2, { x: 0, y: 0, opacity: 1, ease: Power4.easeOut }), i * this.stagger);
      }
    },
    done: function () {
      // console.log('faded')
    }
  }

  /*=============================================>>>>>
  = TYPEWRITER ANIMATION CLASS =
  ===============================================>>>>>*/

  var Typewriter = function (el, delay) {
    this.el = el;
    this.delay = delay || 0;
    this.txt = el.data('copyline');
    this.len = this.txt.length;
    this.fps = 30;
    this.currentChars = 0;
    this.typing = true;
    window.setTimeout(this.start.bind(this), this.delay)
  }

  Typewriter.prototype = {
    start: function () {
      this.el.addClass('typing');
      this.typeIn();
    },
    typeIn: function () {
      var that = this;
      var current = this.el.text();
      var numChars = current.length;
      var update = current += this.txt[numChars];
      this.el.text(update);
      if (this.el.text() == this.txt) {
        this.typing = false;
        this.el.removeClass('typing');
        // console.log('typed in');
      } else {
        setTimeout(function () {
          requestAnimationFrame(that.typeIn.bind(that))
        }, 1000 / this.fps)
      }
    }
  }

  /*=============================================>>>>>
  = DECODER ANIMATION CLASS =
  ===============================================>>>>>*/

  var Decoder = function (el, delay) {
    this.el = el;
    this.txt = el.data('copyline');
    this.len = this.txt.length;
    this.delay = delay * 1000 || 0;
    this.fps = 30;
    this.scrambling = true;
    this.descrambling = false;
    this.currentChars = 0;
    window.setTimeout(this.start.bind(this), this.delay)
  }

  Decoder.prototype = {
    start: function () {
      var that = this;
      this.el.addClass('typing');
      requestAnimationFrame(function (timestamp) {
        that.startTime = timestamp || new Date().getTime();
        that.typeIn();
      });
    },
    typeIn: function () {
      var that = this;
      var str = '';
      for (var i = 0; i < this.currentChars; i++) {
        str += randomLetter();
      }
      this.el.text(str);
      if (this.currentChars < this.len) {
        this.currentChars++;
        setTimeout(function () {
          requestAnimationFrame(that.typeIn.bind(that));
        }, 1000 / (this.fps * 2))
      } else {
        this.currentChars = 0;
        this.el.removeClass('typing');
        this.scramble();
      }
    },
    scramble: function (timestamp) {
      var that = this;
      var duration = 50; // how long to scramble for
      var timestamp = timestamp || new Date().getTime();
      var runtime = timestamp - this.starttime;
      var scr = '';
      var current = this.el.text();
      for (var i = 0; i < this.len; i++) {
        Math.random() <= 0.3 ? scr += randomLetter() : scr += current[i];
      }
      this.el.text(scr);
      if (runtime < duration) {
        setTimeout(function () {
          requestAnimationFrame(that.scramble.bind(that, timestamp));
        }, 1000 / this.fps)
      } else {
        this.descramble();
      }
    },
    descramble: function () {
      var that = this;
      this.scrambling = false;
      this.descrambling = true;
      var current = this.el.text()
      var descr = '';
      for (var i = 0; i < this.len; i++) {
        if (current[i] != this.txt[i]) {
          Math.random() <= 0.8 ? descr += randomLetter() : descr += this.txt[i];
        } else {
          descr += this.txt[i];
        }
      }
      this.el.text(descr);
      if (descr == this.txt) {
        this.descrambling = false;
        // console.log('descrambled')
      } else {
        setTimeout(function () {
          requestAnimationFrame(that.descramble.bind(that));
        }, 1000 / this.fps)
      }
    },
    aniOff: function () {
      this.goingOff = setInterval(this.typeOff.bind(this), 70);
    },
    typeOff: function () {
      var str = '',
        current = this.el.text();
      for (var i = 0; i < this.len; i++) {
        if (i <= this.currentChars) {
          str += String.fromCharCode(160)
        } else {
          Math.random() <= 0.5 ? str += randomLetter() : str += current[i];
        }
      }
      this.el.text(str);
      if (this.currentChars < this.len) {
        this.currentChars++
      } else {
        clearInterval(this.goingOff);
        this.currentChars = 0;
      }
    }
  };

  /*=============================================>>>>>*/

  /*=============================================>>>>>
  = UTILS =
  ===============================================>>>>>*/

  function randomLetter() {
    //https://www.w3schools.com/charsets/ref_html_ascii.asp
    var int = Math.floor(Math.random() * (90 - 64 + 1) + 64);
    return String.fromCharCode(int);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  /*=============================================>>>>>
  = START =
  ===============================================>>>>>*/
  loadImage();

})
