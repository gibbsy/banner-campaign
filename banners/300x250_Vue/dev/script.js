Zepto(function ($) {
    Vue.directive('typewriter', {
        bind: function(el, binding) {
            var str = binding.value.txt,
                len = str.length,
                delay = binding.value.delay || 0,
                speed = binding.value.speed || 40,
                current = '',
                currentChars = 0,
                animating = '';

            window.setTimeout(function () {
                animate();
            }, delay);

            function animate() {
                animating = window.setInterval(buildString, speed);
            }

            function buildString() {
                var strNew = ''
                if (currentChars <= len) {
                    for (var i = 0; i < currentChars - 1; i++) {
                        strNew += str[i];
                    }
                    strNew += randomLetter();
                    el.textContent = strNew;
                    strNew = null;
                    currentChars++
                } else {
                    el.textContent = str;
                    clearInterval(animating);
                    animating = null;
                    currentChars = 0;
                }
            }
            function randomLetter() {
                return String.fromCharCode(Math.floor(((Math.random() * 1000) % 73) + 49))
            }
        },
        update: function(el, binding) {
            if (binding.value.txt != binding.oldValue.txt) {
                var str = binding.value.txt,
                    len = str.length,
                    speed = binding.value.speed || 40,
                    current = '',
                    currentChars = 0,
                    animating = '';

                el.textContent = '';
                animate();

                function animate() {
                    animating = window.setInterval(buildString, speed);
                }

                function buildString() {
                    var strNew = ''
                    if (currentChars <= len) {
                        for (var i = 0; i < currentChars - 1; i++) {
                            strNew += str[i];
                        }
                        strNew += randomLetter();
                        el.textContent = strNew;
                        strNew = null;
                        currentChars++
                    } else {
                        el.textContent = str;
                        clearInterval(animating);
                        animating = null;
                        currentChars = 0;
                    }
                }
                function randomLetter() {
                    return String.fromCharCode(Math.floor(((Math.random() * 1000) % 73) + 49))
                }
            }
        }
    });
    Vue.directive('delayed', {
        bind: function(el, binding) {
            var delay = binding.value;
            window.setTimeout(function() {
                animate();
            }, delay);
            console.log(delay)
            function animate() {
                $(el).removeClass('delayed');
            }
        }
    });
    var vue = new Vue({
        el: '#ad-content',
        data: {
            loaded: true,
            currentFrame: 1,
            choicesLeft: [
                {
                    txt: 'Accenture',
                    result: false
                },
                {
                    txt: 'PWC',
                    result: false
                },
                {
                    txt: 'GSK',
                    result: false
                },
                {
                    txt: 'HSBC',
                    result: false
                }
            ],
            choicesRight: [

                {
                    txt: 'Unilever',
                    result: false
                },
                {
                    txt: 'Barclays',
                    result: false
                },
                {
                    txt: 'Deloitte',
                    result: false
                },
                {
                    txt: 'MI5',
                    result: true
                }
            ],
            message: '',
            selected: {},
            endTimeout: ''
        },
        methods: {
            init: function() {
                $('#ad-content').removeClass('off');
                var that = this;
                this.endTimeout = window.setTimeout(function () {
                    that.currentFrame = 2;
                }, 20000);
            },
            checkResult: function(el) {
                window.clearTimeout(this.endTimeout);
                var that = this;
                if(el.result) {
                    this.selected = el;
                    this.result = true;
                    this.message = 'Well done';
                    this.endTimeout = window.setTimeout(function () {
                        that.currentFrame = 2;
                    }, 2000);
                } else {
                    this.selected = el;
                    this.result = false;
                    this.message = 'Try again';
                    this.endTimeout = window.setTimeout(function () {
                        that.currentFrame = 2;
                    }, 5000);
                }
            }
        },
        mounted: function() {
            $('#preloader').addClass('off');
            this.init();
        }
    })
});