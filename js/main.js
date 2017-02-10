'use strict';
/**
 * [description] PageTransition - change pages
 */
var PageTransitions = (function () {

    var $main = $('#pt-main'),
        $pages = $main.children('div.pt-page'),
        $iterate = $('#iterateEffects'),
        animcursor = 1,
        pagesCount = $pages.length,
        current = 0,
        isAnimating = false,
        endCurrPage = false,
        endNextPage = false,
        animEndEventNames = {
            'WebkitAnimation': 'webkitAnimationEnd',
            'OAnimation': 'oAnimationEnd',
            'msAnimation': 'MSAnimationEnd',
            'animation': 'animationend'
        },
        // animation end event name
        animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
        // support css animations
        support = Modernizr.cssanimations;

    function init() {

        $pages.each(
            function () {
                var $page = $(this);
                $page.data('originalClassList', $page.attr('class'));
            }
        );

        $pages.eq(current).addClass('pt-page-current');

        $('#all-pages').dlmenu({
            onLinkClick: function (el, ev) {

                ev.preventDefault();

                if (isAnimating)
                    return;

                var link = el.find('a')[0];
                var hash = $(link).attr('href');

                if (history.pushState) {
                    history.pushState(null, null, hash);
                } else {
                    location.hash = hash;
                }

                var nameClass = el.attr('class');
                nameClass = nameClass.replace('open', 'pt');

                var page = document.getElementsByClassName(nameClass)[0];
                var openPage = $(page).index();

                var animate = 22;
                if (current > openPage) {
                    animate = 21;
                }


                if (openPage !== $pages.eq(current).index() && openPage !== -1) {
                    choosenPage(animate, openPage);
                    el.parent().children().removeClass('active');
                    el.addClass('active');
                }

                return false;

            }
        });

        $('nav .navbar-brand').on('click',
            function (el) {

                el.preventDefault();

                if ($pages.eq(current).index() !== 0) {

                    if (!isAnimating) {

                        if (history.pushState) {
                            //history.pushState('', document.title, window.location.pathname);
                            history.pushState(null, null, this.getAttribute('href'));
                        } else {
                            location.hash = this.getAttribute('href');
                        }

                        choosenPage(21, 0);

                        var $links = $('#all-pages').children().children();
                        $links.removeClass('active');
                    }

                }

            }
        );

        $('.prev-page').on('click',
            function (el) {
                el.preventDefault();
                prevPage(21);
            }
        );

        $('.next-page').on('click',
            function (el) {
                el.preventDefault();
                nextPage(22);
            }
        );




        $('.close-this').on(
            'click',
            function (e) {
                if ($(this).parent().parent().hasClass('info-about-app')) {

                    $('.about-app').removeClass('hide');


                    $('body').keyup(
                        function (e) {
                            if (e.keyCode === 37) {
                                prevPage(21);
                            }
                            if (e.keyCode === 39) {
                                nextPage(22);
                            }
                        }
                    );
                }
            }
        );

        var hash = location.hash;
        if (hash && hash !== '') {
            var element = document.querySelector(hash);
            var openPage = $(element).index();
            var link = document.querySelector('a[href="' + hash + '"]');
            if (link) {
                $(link).parent().parent().children().removeClass('active');
                $(link).parent().addClass('active');
            }
            if (openPage !== $pages.eq(current).index() && openPage !== -1) {
                choosenPage(21, openPage);
            }
        }

    }

    function nextPage(options) {

        LoadPrecenter.stopRotate();

        $("#pt-main").animate({
            scrollTop: 0
        }, 300);

        $('#pt-main').css({
            overflow: 'hidden'
        });

        var animation = (options.animation) ? options.animation : options;

        if (isAnimating) {
            return false;
        }

        isAnimating = true;

        var $currPage = $pages.eq(current);

        if (options.showPage) {
            if (options.showPage < pagesCount - 1) {
                current = options.showPage;
            } else {
                current = 0;
            }
        } else {
            if (current < pagesCount - 1) {
                ++current;
            } else {
                current = 0;
            }
        }

        var $links = $('#all-pages').children().children();
        $links.removeClass('active');
        var setActive = 'pt-page-' + (current + 1);
        setActive = setActive.replace('pt', 'open');
        if (document.getElementsByClassName(setActive).length > 0) {
            var activeLink = document.getElementsByClassName(setActive)[0];
            $(activeLink).addClass('active');
        }

        var $nextPage = $pages.eq(current).addClass('pt-page-current'),
            outClass = '',
            inClass = '';

        switch (animation) {

        case 5:
            outClass = 'pt-page-fade';
            inClass = 'pt-page-moveFromRight pt-page-ontop';
            break;
        case 6:
            outClass = 'pt-page-fade';
            inClass = 'pt-page-moveFromLeft pt-page-ontop';
            break;
        case 21:
            outClass = 'pt-page-scaleDown';
            inClass = 'pt-page-scaleUpDown pt-page-delay300';
            break;
        case 22:
            outClass = 'pt-page-scaleDownUp';
            inClass = 'pt-page-scaleUp pt-page-delay300';
            break;

        }

        $currPage.addClass(outClass).on(
            animEndEventName,
            function () {
                $currPage.off(animEndEventName);
                endCurrPage = true;
                if (endNextPage) {
                    onEndAnimation($currPage, $nextPage);
                }
            }
        );

        $nextPage.addClass(inClass).on(
            animEndEventName,
            function () {
                $nextPage.off(animEndEventName);
                endNextPage = true;
                if (endCurrPage) {
                    onEndAnimation($currPage, $nextPage);
                }
            }
        );

        if (!support) {
            onEndAnimation($currPage, $nextPage);
        }

    }

    function prevPage(options) {

        LoadPrecenter.stopRotate();

        $("#pt-main").animate({
            scrollTop: 0
        }, 300);

        $('#pt-main').css({
            overflow: 'hidden'
        });

        var animation = (options.animation) ? options.animation : options;

        if (isAnimating) {
            return false;
        }

        isAnimating = true;

        var $currPage = $pages.eq(current);

        if (options.showPage) {
            if (options.showPage >= 0) {
                current = options.showPage;
            } else {
                current = pagesCount - 1;
            }
        } else {
            if (current > 0) {
                --current;
            } else {
                current = pagesCount - 1;
            }
        }

        var $links = $('#all-pages').children().children();
        $links.removeClass('active');
        var setActive = 'pt-page-' + (current + 1);
        setActive = setActive.replace('pt', 'open');
        if (document.getElementsByClassName(setActive).length > 0) {
            var activeLink = document.getElementsByClassName(setActive)[0];
            $(activeLink).addClass('active');
        }

        var $nextPage = $pages.eq(current).addClass('pt-page-current'),
            outClass = '',
            inClass = '';

        switch (animation) {

        case 5:
            outClass = 'pt-page-fade';
            inClass = 'pt-page-moveFromRight pt-page-ontop';
            break;
        case 6:
            outClass = 'pt-page-fade';
            inClass = 'pt-page-moveFromLeft pt-page-ontop';
            break;
        case 21:
            outClass = 'pt-page-scaleDown';
            inClass = 'pt-page-scaleUpDown pt-page-delay300';
            break;
        case 22:
            outClass = 'pt-page-scaleDownUp';
            inClass = 'pt-page-scaleUp pt-page-delay300';
            break;

        }

        $currPage.addClass(outClass).on(
            animEndEventName,
            function () {
                $currPage.off(animEndEventName);
                endCurrPage = true;
                if (endNextPage) {
                    onEndAnimation($currPage, $nextPage);
                }
            }
        );

        $nextPage.addClass(inClass).on(
            animEndEventName,
            function () {
                $nextPage.off(animEndEventName);
                endNextPage = true;
                if (endCurrPage) {
                    onEndAnimation($currPage, $nextPage);
                }
            }
        );

        if (!support) {
            onEndAnimation($currPage, $nextPage);
        }

    }

    function choosenPage(options, openPage) {

        LoadPrecenter.stopRotate();

        $("#pt-main").animate({
            scrollTop: 0
        }, 300);

        $('#pt-main').css({
            overflow: 'hidden'
        });

        var animation = (options.animation) ? options.animation : options;

        if (isAnimating) {
            return false;
        }

        isAnimating = true;

        var $currPage = $pages.eq(current);

        current = openPage;

        var $nextPage = $pages.eq(current).addClass('pt-page-current'),
            outClass = '',
            inClass = '';

        switch (animation) {

        case 5:
            outClass = 'pt-page-fade';
            inClass = 'pt-page-moveFromRight pt-page-ontop';
            break;
        case 6:
            outClass = 'pt-page-fade';
            inClass = 'pt-page-moveFromLeft pt-page-ontop';
            break;
        case 21:
            outClass = 'pt-page-scaleDown';
            inClass = 'pt-page-scaleUpDown pt-page-delay300';
            break;
        case 22:
            outClass = 'pt-page-scaleDownUp';
            inClass = 'pt-page-scaleUp pt-page-delay300';
            break;

        }

        $currPage.addClass(outClass).on(
            animEndEventName,
            function () {
                $currPage.off(animEndEventName);
                endCurrPage = true;
                if (endNextPage) {
                    onEndAnimation($currPage, $nextPage);
                }
            }
        );

        $nextPage.addClass(inClass).on(
            animEndEventName,
            function () {
                $nextPage.off(animEndEventName);
                endNextPage = true;
                if (endCurrPage) {
                    onEndAnimation($currPage, $nextPage);
                }
            }
        );

        if (!support) {
            onEndAnimation($currPage, $nextPage);
        }

    }

    function onEndAnimation($outpage, $inpage) {
        endCurrPage = false;
        endNextPage = false;
        resetPage($outpage, $inpage);
        isAnimating = false;

        $('#pt-main').css({
            overflow: ''
        });

        RunScrollStyler({
            element: '#pt-main'
        });

        runClipCanvas();

        LoadPrecenter.startRotate();

        var tmp = $('.pt-page-current').find('.timer');

    }

    function resetPage($outpage, $inpage) {
        $outpage.attr('class', $outpage.data('originalClassList'));
        $inpage.attr(
            'class', $inpage.data('originalClassList') + ' pt-page-current'
        );
    }

    try {

        init();

    } catch (e) {
        alert(e);
    } finally {

        return {
            init: init,
            nextPage: nextPage,
            prevPage: prevPage
        };

    }

})();


var canvasObject = [];
/**
 * Клас для роботи з картинками, анімовано обрізає картинки при ховері, відкриває на весь екран при клікові
 * @constructor
 */
function CanvasClip() {

    this.duration = 300;
    this.durationFull = 300;

    this._rand = 0;

    this._element = null;

    this._image = null;

    this._points = [[0, 0], [0, 0], [0, 0], [0, 0]];

    this._pointsFull = [[0, 0], [0, 0], [0, 0], [0, 0]];

    this._width = 0;

    this._height = 0;

    this._fit = 'contain';

    this.devPix;
}
CanvasClip.prototype.buildCanvas = function (item, img) {

    var self = this;

    var block = $(item).parent();

    self._setProperties(item);
    self._createElement(block, img);

};
CanvasClip.prototype.clipCanvas = function () {

    var self = this;

    var x1End, x1Start, x1Width,
        y1End, y1Start, y1Width,
        x2End, x2Start, x2Width,
        y2End, y2Start, y2Width,
        x3End, x3Start, x3Width,
        y3End, y3Start, y3Width,
        x4End, x4Start, x4Width,
        y4End, y4Start, y4Width;

    //  self._setPoints();

    self._setRandom();

    if (!self._getRandom()) {

        x1End = getRandomInt((30 * self._getWidth() / 100), self._getWidth() - (20 * self._getWidth() / 100));
        x1Start = self._getPoint(0, 0);
        x1Width = x1End - x1Start;

        y1Start = self._getPoint(0, 1);
        y1End = 0;
        y1Width = y1Start - y1End;

        x2Start = self._getPoint(1, 0);
        x2End = self._getWidth();
        x2Width = x2End - x2Start;

        y2End = getRandomInt((30 * self._getHeight() / 100), self._getHeight() - (20 * self._getHeight() / 100));
        y2Start = self._getPoint(1, 1);
        y2Width = y2End - y2Start;

        x3End = getRandomInt(self._getWidth() / 1.5, self._getWidth() - (20 * self._getWidth() / 100));
        x3Start = self._getPoint(2, 0);
        x3Width = x3Start - x3End;

        y3Start = self._getPoint(2, 1);
        y3End = self._getHeight();
        y3Width = y3End - y3Start;

        x4Start = self._getPoint(3, 0);
        x4End = 0;
        x4Width = x4Start - x4End;

        y4End = getRandomInt((40 * self._getHeight() / 100), self._getHeight() - (20 * self._getHeight() / 100));
        y4Start = self._getPoint(3, 1);
        y4Width = y4Start - y4End;

    }

    if (self._getRandom()) {

        y1End = getRandomInt((30 * self._getHeight() / 100), self._getHeight() / 1.5);
        y1Start = self._getPoint(0, 1);
        y1Width = y1End - y1Start;

        x1Start = self._getPoint(0, 0);
        x1End = 0;
        x1Width = x1Start - x1End;

        x2End = getRandomInt(self._getWidth() / 1.5, self._getWidth() - (30 * self._getWidth() / 100));
        x2Start = self._getPoint(1, 0);
        x2Width = x2Start - x2End;

        y2Start = self._getPoint(1, 1);
        y2End = 0;
        y2Width = y2Start - y2End;

        y3End = getRandomInt(self._getHeight() / 1.5, self._getHeight() - (30 * self._getHeight() / 100));
        y3Start = self._getPoint(2, 1);
        y3Width = y3Start - y3End;

        x3Start = self._getPoint(2, 0);
        x3End = self._getWidth();
        x3Width = x3End - x3Start;

        x4End = getRandomInt((30 * self._getWidth() / 100), self._getWidth() / 1.5);
        x4Start = self._getPoint(3, 0);
        x4Width = x4End - x4Start;

        y4Start = self._getPoint(3, 1);
        y4End = self._getHeight();
        y4Width = y4End - y4Start;

    }

    var canvas = self._getElement();

    if (canvas.getContext) {

        var ctx = canvas.getContext('2d');

        var left = 0;
        var top = 0;

        var imgWidth = $(self._getImage()).width();
        var imgHeight = $(self._getImage()).height();

        var proportion = imgWidth / imgHeight;

        imgWidth = self._getHeight() * proportion;
        imgHeight = self._getHeight();

        if (imgWidth < self._getWidth()) {
            imgWidth = self._getWidth();
            imgHeight = imgWidth / proportion;
        }

        if (self._getHeight() < imgHeight) {
            top = -(imgHeight - self._getHeight()) / 2;
        }

        if (self._getWidth() < imgWidth) {
            left = -(imgWidth - self._getWidth()) / 2;
        }

        this._animate({
            duration: self._getDuration(),
            timing: function (timeFraction) {
                return Math.pow(timeFraction, 2) * Math.pow(timeFraction - 2, 2);
            },
            draw: function (progress) {

                ctx.clearRect(0, 0, self._getWidth(), self._getHeight());

                progress = progress * 100;

                if (x1Start < x1End) {
                    x1Start = (x1End - x1Width) + x1Width * progress / 100;
                }

                if (x1Start > x1End) {
                    x1Start = (x1End + x1Width) - x1Width * progress / 100;
                }

                if (y1Start < y1End) {
                    y1Start = (y1End - y1Width) + y1Width * progress / 100;
                }

                if (y1Start > y1End) {
                    y1Start = (y1End + y1Width) - y1Width * progress / 100;
                }

                if (x2Start > x2End) {
                    x2Start = (x2End + x2Width) - (x2Width * progress / 100);
                }

                if (x2Start < x2End) {
                    x2Start = (x2End - x2Width) + (x2Width * progress / 100);
                }

                if (y2Start < y2End) {
                    y2Start = (y2End - y2Width) + y2Width * progress / 100;
                }

                if (y2Start > y2End) {
                    y2Start = (y2End + y2Width) - y2Width * progress / 100;
                }

                if (x3Start > x3End) {
                    x3Start = (x3End + x3Width) - (x3Width * progress / 100);
                }

                if (x3Start < x3End) {
                    x3Start = (x3End - x3Width) + (x3Width * progress / 100);
                }

                if (y3Start > y3End) {
                    y3Start = (y3End + y3Width) - (y3Width * progress / 100);
                }

                if (y3Start < y3End) {
                    y3Start = (y3End - y3Width) + (y3Width * progress / 100);
                }

                if (x4Start < x4End) {
                    x4Start = (x4End - x4Width) + x4Width * progress / 100;
                }

                if (x4Start > x4End) {
                    x4Start = (x4End + x4Width) - x4Width * progress / 100;
                }

                if (y4Start > y4End) {
                    y4Start = (y4End + y4Width) - (y4Width * progress / 100);
                }

                if (y4Start < y4End) {
                    y4Start = (y4End - y4Width) + (y4Width * progress / 100);
                }

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x1Start, y1Start);
                ctx.lineTo(x2Start, y2Start);
                ctx.lineTo(x3Start, y3Start);
                ctx.lineTo(x4Start, y4Start);
                ctx.lineTo(x1Start, y1Start);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(self._getImage(), left, top, imgWidth, imgHeight);
                ctx.restore();

                self._setPoint(0, 0, x1Start);
                self._setPoint(0, 1, y1Start);
                self._setPoint(1, 0, x2Start);
                self._setPoint(1, 1, y2Start);
                self._setPoint(2, 0, x3Start);
                self._setPoint(2, 1, y3Start);
                self._setPoint(3, 0, x4Start);
                self._setPoint(3, 1, y4Start);

            }
        });

    }

};
CanvasClip.prototype.unclipCanvas = function () {

    var self = this;

    var x1End, x1Start, x1Width, y1End, y1Start, y1Width, x2End, x2Start, x2Width, y2End, y2Start, y2Width, x3End,
        x3Start, x3Width, y3End, y3Start, y3Width, x4End, x4Start, x4Width, y4End, y4Start, y4Width;

    if (!self._getRandom()) {

        x1Start = self._getPoint(0, 0);
        x1End = 0;
        x1Width = self._getPoint(0, 0);

        y1Start = self._getPoint(0, 1);
        y1End = 0;
        y1Width = y1Start - y1End;

        x2Start = self._getPoint(1, 0);
        x2End = self._getWidth();
        x2Width = x2End - x2Start;

        y2Start = self._getPoint(1, 1);
        y2End = 0;
        y2Width = y2Start;

        x3Start = self._getPoint(2, 0);
        x3End = self._getWidth();
        x3Width = x3End - x3Start;

        y3Start = self._getHeight();

        x4Start = 0;

        y4Start = self._getPoint(3, 1);
        y4End = self._getHeight();
        y4Width = y4End - y4Start;

    }
    if (self._getRandom()) {

        y1Start = self._getPoint(0, 1);
        y1End = 0;
        y1Width = self._getPoint(0, 1);

        x1Start = 0;

        y2Start = 0;

        x2Start = self._getPoint(1, 0);
        x2End = self._getWidth();
        x2Width = x2End - x2Start;

        y3Start = self._getPoint(2, 1);
        y3End = self._getHeight();
        y3Width = y3End - y3Start;

        x3Start = self._getWidth();

        y4Start = self._getHeight();

        x4Start = self._getPoint(3, 0);
        x4End = 0;
        x4Width = self._getPoint(3, 0);

    }

    var canvas = self._getElement();

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        var left = 0;
        var top = 0;

        var imgWidth = $(self._getImage()).width();
        var imgHeight = $(self._getImage()).height();

        var proportion = imgWidth / imgHeight;

        imgWidth = self._getHeight() * proportion;
        imgHeight = self._getHeight();

        if (imgWidth < self._getWidth()) {
            imgWidth = self._getWidth();
            imgHeight = imgWidth / proportion;
        }

        if (self._getHeight() < imgHeight) {
            top = -(imgHeight - self._getHeight()) / 2;
        }

        if (self._getWidth() < imgWidth) {
            left = -(imgWidth - self._getWidth()) / 2;
        }

        self._animate({
            duration: self._getDuration(),
            timing: function (timeFraction) {
                return Math.pow(timeFraction, 2) * Math.pow(timeFraction - 2, 2);
            },
            draw: function (progress) {
                ctx.clearRect(0, 0, self._getWidth(), self._getHeight());

                progress = progress * 100;

                if (x1Start > x1End) {
                    x1Start = x1Width - x1Width * progress / 100;
                }

                if (y2Start > y2End) {
                    y2Start = y2Width - y2Width * progress / 100;
                }

                if (x3Start < x3End) {
                    x3Start = (x3End - x3Width) + x3Width * progress / 100;
                }

                if (y4Start < y4End) {
                    y4Start = (y4End - y4Width) + (y4Width * progress / 100);
                }

                if (y1Start > y1End) {
                    y1Start = y1Width - y1Width * progress / 100;
                }

                if (x2Start < x2End) {
                    x2Start = (x2End - x2Width) + (x2Width * progress / 100);
                }

                if (y3Start < y3End) {
                    y3Start = (y3End - y3Width) + (y3Width * progress / 100);
                }

                if (x4Start > x4End) {
                    x4Start = x4Width - x4Width * progress / 100;
                }

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x1Start, y1Start);
                ctx.lineTo(x2Start, y2Start);
                ctx.lineTo(x3Start, y3Start);
                ctx.lineTo(x4Start, y4Start);
                ctx.lineTo(x1Start, y1Start);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(self._getImage(), left, top, imgWidth, imgHeight);
                ctx.restore();

                self._setPoint(0, 0, x1Start);
                self._setPoint(0, 1, y1Start);
                self._setPoint(1, 0, x2Start);
                self._setPoint(1, 1, y2Start);
                self._setPoint(2, 0, x3Start);
                self._setPoint(2, 1, y3Start);
                self._setPoint(3, 0, x4Start);
                self._setPoint(3, 1, y4Start);

            }
        });

    }

};
CanvasClip.prototype.openFullCanvas = function (position) {

    LoadPrecenter.stopRotate();

    var self = this;

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight - 62;

    if ($('body').hasClass('inverse'))
        windowHeight = window.innerHeight - 80;

    var canvas = document.querySelector('.full-canvas');

    if (!canvas) {
        $('body').append('<canvas class="full-canvas" width=' + windowWidth + ' height=' + windowHeight + ' >update your browser</canvas>');
        canvas = document.querySelector('.full-canvas');
    }

    $(self._getElement()).addClass('opacity');

    setTimeout(
        function () {
            $(canvas).addClass('opened');
        }, self._getFullDuration() / 10
    );

    try {
        if (canvas.getContext) {

            var ctx = canvas.getContext("2d");

            //*****************************************************************/

            var top = position.top;
            var left = position.left;

            self._setPointFull(0, 0, left);
            self._setPointFull(0, 1, top);

            self._setPointFull(1, 0, self._getWidth() + left);
            self._setPointFull(1, 1, top);

            self._setPointFull(2, 0, left + self._getWidth());
            self._setPointFull(2, 1, self._getHeight() + top);

            self._setPointFull(3, 0, left);
            self._setPointFull(3, 1, top + self._getHeight());

            //***************************************************************/

            var x1pos, x1interval,
                y1pos, y1interval,
                x2pos, x2interval,
                y2pos, y2interval,
                x3pos, x3interval,
                y3pos, y3interval,
                x4pos, x4interval,
                y4pos, y4interval;

            //***************************************************************/

            if (!self._getRandom()) {

                x1pos = self._getPoint(0, 0) + left;
                x1interval = x1pos;
                y1pos = top;
                y1interval = y1pos;

                x2pos = self._getWidth() + left;
                x2interval = canvas.width - x2pos;
                y2pos = self._getPoint(1, 1) + top;
                y2interval = y2pos;

                x3pos = self._getPoint(2, 0) + left;
                x3interval = canvas.width - x3pos;
                y3pos = self._getHeight() + top;
                y3interval = windowHeight - y3pos;

                x4pos = left;
                x4interval = x4pos;
                y4pos = self._getPoint(3, 1) + top;
                y4interval = windowHeight - y4pos;

            }

            if (self._getRandom()) {

                x1pos = left;
                x1interval = x1pos;
                y1pos = self._getPoint(0, 1) + top;
                y1interval = y1pos;

                x2pos = self._getPoint(1, 0) + left;
                x2interval = windowWidth - x2pos;
                y2pos = top;
                y2interval = y2pos;

                x3pos = left + self._getWidth();
                x3interval = windowWidth - x3pos;
                y3pos = self._getPoint(2, 1) + top;
                y3interval = windowHeight - y3pos;

                x4pos = self._getPoint(3, 0) + left;
                x4interval = x4pos;
                y4pos = top + self._getHeight();
                y4interval = windowHeight - y4pos;

            }

            //***************************************************************/

            var left2 = 0;
            var top2 = 0;

            var imgWidth = $(self._getImage()).width();
            var imgHeight = $(self._getImage()).height();

            var prop = imgWidth / imgHeight;

            imgWidth = self._getHeight() * prop;
            imgHeight = self._getHeight();

            if (imgWidth < self._getWidth()) {
                imgWidth = self._getWidth();
                imgHeight = imgWidth / prop;
            }

            if (self._getHeight() < imgHeight) {
                top2 = -(imgHeight - self._getHeight()) / 2;
            }

            if (self._getWidth() < imgWidth) {
                left2 = -(imgWidth - self._getWidth()) / 2;
            }

            top += top2;
            left += left2;

            var bottom = top + imgHeight;
            var right = left + imgWidth;

            var imgFullWidth, imgFullHeight;
            var minTop, minLeft, minBottom, minRight;
            var leftWidth, topWidth, bottomWidth, rightWidth;

            imgFullWidth = windowHeight * prop;
            imgFullHeight = windowHeight;

            //***************************************************************/
            if (self._getFit() === 'cover') {

                if (imgFullWidth < windowWidth) {
                    imgFullWidth = windowWidth;
                    imgFullHeight = imgFullWidth / prop;
                }

                minTop = -(imgFullHeight - windowHeight) / 2;
                minLeft = -(imgFullWidth - windowWidth) / 2;
                minBottom = (-1) * minTop + windowHeight;
                minRight = (-1) * minLeft + windowWidth;

                leftWidth = left + (-1) * minLeft;
                topWidth = top + (-1) * minTop;
                bottomWidth = (windowHeight - top - imgHeight) + (-1) * minTop;
                rightWidth = (windowWidth - left - imgWidth) + (-1) * minLeft;


            }

            if (self._getFit() === 'contain') {

                if (imgFullWidth > windowWidth) {
                    imgFullWidth = windowWidth;
                    imgFullHeight = imgFullWidth / prop;
                }

                minTop = -(imgFullHeight - windowHeight) / 2;
                minLeft = -(imgFullWidth - windowWidth) / 2;
                minBottom = (-1) * minTop + windowHeight;
                minRight = (-1) * minLeft + windowWidth;


                if (left <= minLeft)
                    leftWidth = minLeft - left;

                if (left > minLeft)
                    leftWidth = left - minLeft;

                if (top <= minTop)
                    topWidth = minTop - top;

                if (top > minTop)
                    topWidth = top - minTop;

                if (right <= minRight)
                    rightWidth = minRight - right;

                if (bottom <= minBottom)
                    bottomWidth = minBottom - bottom;

                if (bottom > minBottom)
                    bottomWidth = bottom - minBottom;

                if (right > minRight)
                    rightWidth = right - minRight;

            }

            //***************************************************************/

            self._animateFull({
                duration: self._getFullDuration(),
                timing: function (timeFraction) {
                    //return timeFraction<.5 ? 2*timeFraction*timeFraction : -1+(4-2*timeFraction)*timeFraction;
                    // //easeInOutQuad
                    return timeFraction < .5 ? 4 * timeFraction * timeFraction * timeFraction : (timeFraction - 1) * (2 * timeFraction - 2) * (2 * timeFraction - 2) + 1; //easeInOutCubic
                    //return timeFraction<.5 ? 8*timeFraction*timeFraction*timeFraction*timeFraction :
                    // 1-8*(--timeFraction)*timeFraction*timeFraction*timeFraction; //easeInOutQuart return timeFraction<.5 ?
                    // 16*timeFraction*timeFraction*timeFraction*timeFraction*timeFraction :
                    // 1+16*(--timeFraction)*timeFraction*timeFraction*timeFraction*timeFraction; //easeInOutQuint
                },
                draw: function (progress) {

                    ctx.clearRect(0, 0, windowWidth, windowHeight);


                    x1pos = x1pos > 0 ? x1interval - (progress * x1interval) : 0;
                    y1pos = y1pos > 0 ? y1interval - (progress * y1interval) : 0;

                    x2pos = x2pos < windowWidth ? (windowWidth - x2interval) + (progress * x2interval) : windowWidth;
                    y2pos = y2pos > 0 ? y2interval - (progress * y2interval) : 0;

                    x3pos = x3pos < windowWidth ? (windowWidth - x3interval) + (progress * x3interval) : windowWidth;
                    y3pos = y3pos < windowHeight ? (windowHeight - y3interval) + (progress * y3interval) : windowHeight;

                    x4pos = x4pos > 0 ? x4interval - (progress * x4interval) : 0;
                    y4pos = y4pos < windowHeight ? (windowHeight - y4interval) + (progress * y4interval) : windowHeight;

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x1pos, y1pos);
                    ctx.lineTo(x2pos, y2pos);
                    ctx.lineTo(x3pos, y3pos);
                    ctx.lineTo(x4pos, y4pos);
                    ctx.lineTo(x1pos, y1pos);

                    ctx.clip();

                    if (self._getFit() === 'cover') {

                        top = top > minTop ? topWidth + minTop - (progress * topWidth) : minTop;
                        left = left > minLeft ? leftWidth + minLeft - (progress * leftWidth) : minLeft;
                        bottom = bottom < minBottom ? (imgHeight + topWidth + minTop) + (progress * bottomWidth) : minBottom;
                        right = right < minRight ? (imgWidth + leftWidth + minLeft) + (progress * rightWidth) : minRight;

                    }

                    if (self._getFit() === 'contain') {

                        top = top > minTop ? (minTop + topWidth) - (progress * topWidth) : (minTop - topWidth) + (progress * topWidth);
                        left = left > minLeft ? leftWidth + minLeft - (progress * leftWidth) : (minLeft - leftWidth) + (progress * leftWidth);
                        bottom = bottom > minBottom ? bottomWidth + minBottom - (progress * bottomWidth) : (minBottom - bottomWidth) + (progress * bottomWidth);
                        right = right > minRight ? rightWidth + minRight - (progress * rightWidth) : (minRight - rightWidth) + (progress * rightWidth);

                    }

                    ctx.drawImage(self._getImage(), left, top, right - left, bottom - top);
                    ctx.closePath();

                    ctx.restore();

                }
            });

        }
    } catch (e) {
        console.log('Problem with open Full Canvas ' + e);
    } finally {
        return;
    }

};
CanvasClip.prototype.closeFullCanvas = function (position, block) {

    var self = this;

    //$( block ).find( '.canvaClip' ).removeClass( 'opacity' );
    //$( self._getElement() ).addClass( 'opacity' );

    var canvas = document.querySelector('.full-canvas');

    $(canvas).removeClass('opened');

    $(canvas).addClass('opac');

    try {
        if (canvas.getContext) {

            var ctx = canvas.getContext("2d");

            //***************************************************************/
            var top = position.top;
            var left = position.left;

            var x1Start = 0,
                x1End = self._getPointFull(0, 0),
                y1Start = 0,
                y1End = self._getPointFull(0, 1);
            var x2Start = canvas.width,
                x2End = self._getPointFull(1, 0),
                x2Width = x2Start - x2End,
                y2Start = 0,
                y2End = self._getPointFull(1, 1);
            var x3Start = canvas.width,
                x3End = self._getPointFull(2, 0),
                x3Width = x3Start - x3End,
                y3Start = canvas.height,
                y3End = self._getPointFull(2, 1),
                y3Width = y3Start - y3End;
            var x4Start = 0,
                x4End = self._getPointFull(3, 0),
                y4Start = canvas.height,
                y4End = self._getPointFull(3, 1),
                y4Width = y4Start - y4End;
            //***************************************************************/


            var left2 = 0;
            var top2 = 0;

            var imgWidth = $(self._getImage()).width();
            var imgHeight = $(self._getImage()).height();

            var prop = imgWidth / imgHeight;

            imgWidth = self._getHeight() * prop;
            imgHeight = self._getHeight();

            if (imgWidth < self._getWidth()) {
                imgWidth = self._getWidth();
                imgHeight = imgWidth / prop;
            }

            if (self._getHeight() < imgHeight) {
                top2 = -(imgHeight - self._getHeight()) / 2;
            }

            if (self._getWidth() < imgWidth) {
                left2 = -(imgWidth - self._getWidth()) / 2;
            }

            top += top2;
            left += left2;


            //***************************************************************/


            var bottom = top + imgHeight;
            var right = left + imgWidth;

            var imgFullWidth;
            var imgFullHeight;

            var minTop, minTopTmp;
            var minLeft, minLeftTmp;
            var minBottom, minBottomTmp;
            var minRight, minRightTmp;

            var leftWidth;
            var topWidth;
            var bottomWidth;
            var rightWidth;

            imgFullWidth = canvas.height * prop;
            imgFullHeight = canvas.height;

            //***************************************************************/

            if (self._getFit() === 'cover') {

                if (imgFullWidth < canvas.width) {
                    imgFullWidth = canvas.width;
                    imgFullHeight = imgFullWidth / prop;
                }

            }

            if (self._getFit() === 'contain') {

                if (imgFullWidth > canvas.width) {
                    imgFullWidth = canvas.width;
                    imgFullHeight = imgFullWidth / prop;
                }

            }

            minTop = -(imgFullHeight - canvas.height) / 2;
            minLeft = -(imgFullWidth - canvas.width) / 2;
            minBottom = (-1) * minTop + canvas.height;
            minRight = (-1) * minLeft + canvas.width;

            minTopTmp = minTop;
            minLeftTmp = minLeft;
            minBottomTmp = minBottom;
            minRightTmp = minRight;

            if (left <= minLeft) {
                leftWidth = minLeft - left;
            }

            if (left > minLeft) {
                leftWidth = left - minLeft;
            }

            if (top <= minTop) {
                topWidth = minTop - top;
            }

            if (top > minTop) {
                topWidth = top - minTop;
            }

            if (right <= minRight) {
                rightWidth = minRight - right;
            }

            if (bottom <= minBottom) {
                bottomWidth = minBottom - bottom;
            }

            if (bottom > minBottom) {
                bottomWidth = bottom - minBottom;
            }

            if (right > minRight) {
                rightWidth = right - minRight;
            }
            //***************************************************************/

            var canvasWidth = canvas.width,
                canvasHeight = canvas.height;

            self._animate({
                duration: self._getFullDuration(),
                timing: function (timeFraction) {
                    return timeFraction < .5 ? 4 * timeFraction * timeFraction * timeFraction : (timeFraction - 1) * (2 * timeFraction - 2) * (2 * timeFraction - 2) + 1; //easeInOutCubic
                },
                draw: function (progress) {

                    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

                    x1Start = x1Start < x1End ? x1End * progress : x1End;
                    y1Start = y1Start < y1End ? y1End * progress : y1End;

                    x2Start = x2Start > x2End ? canvasWidth - (x2Width * progress) : x2End;
                    y2Start = y2Start < y2End ? y2End * progress : y2End;

                    x3Start = x3Start > x3End ? canvasWidth - (x3Width * progress) : x3End;
                    y3Start = y3Start > y3End ? canvasHeight - (y3Width * progress) : y3End;

                    x4Start = x4Start < x4End ? x4End * progress : x4End;
                    y4Start = y4Start > y4End ? canvasHeight - (y4Width * progress) : y4End;

                    //****************************************************/
                    if (minTop < top) {
                        minTop = topWidth * progress + minTopTmp;
                        if (minTop >= top) {
                            minTop = top;
                        }
                    }

                    if (minTop > top) {
                        minTop = minTopTmp - topWidth * progress;
                        if (minTop <= top) {
                            minTop = top;
                        }
                    }

                    if (minLeft > left) {
                        minLeft = minLeftTmp - leftWidth * progress;
                        if (minLeft <= left) {
                            minLeft = left;
                        }
                    }

                    if (minLeft < left) {
                        minLeft = leftWidth * progress + minLeftTmp;
                        if (minLeft >= left) {
                            minLeft = left;
                        }
                    }

                    if (minRight > right) {
                        minRight = minRightTmp - rightWidth * progress;
                        if (minRight <= right) {
                            minRight = right;
                        }
                    }

                    if (minRight < right) {
                        minRight = minRightTmp + rightWidth * progress;
                        if (minRight >= right) {
                            minRight = right;
                        }
                    }

                    if (minBottom > bottom) {
                        minBottom = minBottomTmp - bottomWidth * progress;
                        if (minBottom <= bottom) {
                            minBottom = bottom;
                        }
                    }

                    if (minBottom < bottom) {
                        minBottom = minBottomTmp + bottomWidth * progress;
                        if (minBottom >= bottom) {
                            minBottom = bottom;
                        }
                    }

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x1Start, y1Start);
                    ctx.lineTo(x2Start, y2Start);
                    ctx.lineTo(x3Start, y3Start);
                    ctx.lineTo(x4Start, y4Start);
                    ctx.lineTo(x1Start, y1Start);

                    ctx.clip();

                    ctx.drawImage(self._getImage(), minLeft, minTop, minRight - minLeft, minBottom - minTop);
                    ctx.closePath();
                    ctx.restore();

                }

            });

            setTimeout(
                function () {
                    $(self._getElement()).removeClass('opacity');
                    $('.full-canvas').remove();
                    LoadPrecenter.startRotate();
                    //rotateSvgElem.startRotate();
                }, self._getFullDuration() + 150
            );

        }
    } catch (e) {
        console.log(e);
    }

};
CanvasClip.prototype.resetFullCanvas = function (block, position, img) {

    var self = this;

    $(block).find('.canvaClip').removeClass('opacity');
    $(self._getElement()).addClass('opacity');

    var windowWidth = window.innerWidth;

    var windowHeight = window.innerHeight - 62;

    if ($('body').hasClass('inverse'))
        windowHeight = window.innerHeight - 80;

    var canvas = document.querySelector('.full-canvas');

    if (canvas) {
        $(canvas).remove();
    }

    $('body').append('<canvas class="full-canvas" width=' + windowWidth + ' height=' + windowHeight + ' >update your browser</canvas>');
    canvas = document.querySelector('.full-canvas');


    $(canvas).addClass('opened');

    try {

        if (canvas.getContext) {

            var ctx = canvas.getContext("2d");

            var top = parseInt(position.top, 10);
            var left = parseInt(position.left, 10);

            self._setPointFull(0, 0, left);
            self._setPointFull(0, 1, top);

            self._setPointFull(1, 0, self._getWidth() + left);
            self._setPointFull(1, 1, top);

            self._setPointFull(2, 0, left + self._getWidth());
            self._setPointFull(2, 1, self._getHeight() + top);

            self._setPointFull(3, 0, left);
            self._setPointFull(3, 1, top + self._getHeight());

            //***************************************************************/

            var imgWidth = $(self._getImage()).width();
            var imgHeight = $(self._getImage()).height();

            var prop = imgWidth / imgHeight;

            imgWidth = self._getHeight() * prop;

            if (imgWidth < self._getWidth()) {
                imgWidth = self._getWidth();
            }

            var imgFullWidth;
            var imgFullHeight;

            var minTop;
            var minLeft;
            var minBottom;
            var minRight;

            imgFullWidth = canvas.height * prop;
            imgFullHeight = canvas.height;

            //***************************************************************/
            if (self._getFit() === 'cover') {

                if (imgFullWidth < canvas.width) {
                    imgFullWidth = canvas.width;
                    imgFullHeight = imgFullWidth / prop;
                }

                minTop = -(imgFullHeight - canvas.height) / 2;
                minLeft = -(imgFullWidth - canvas.width) / 2;
                minBottom = (-1) * minTop + canvas.height;
                minRight = (-1) * minLeft + canvas.width;

            }

            if (self._getFit() === 'contain') {

                if (imgFullWidth > canvas.width) {
                    imgFullWidth = canvas.width;
                    imgFullHeight = imgFullWidth / prop;
                }

                minTop = -(imgFullHeight - canvas.height) / 2;
                minLeft = -(imgFullWidth - canvas.width) / 2;
                minBottom = (-1) * minTop + canvas.height;
                minRight = (-1) * minLeft + canvas.width;

            }
            //***************************************************************/

            var img = img ? img : self._getImage();

            ctx.drawImage(img, minLeft, minTop, minRight - minLeft, minBottom - minTop);

        }
    } catch (e) {
        console.log("Problem with reser Full Canvas " + e);
    }

};
CanvasClip.prototype._setDuration = function (duration) {
    if (!duration || !isNumeric(duration)) {
        return;
    }
    this.duration = duration;
};
CanvasClip.prototype._getDuration = function () {
    return this.duration;
};
CanvasClip.prototype._setFullDuration = function (duration) {
    if (!duration || !isNumeric(duration)) {
        return;
    }
    this.durationFull = duration;
};
CanvasClip.prototype._getFullDuration = function () {
    return this.durationFull;
};
CanvasClip.prototype._animate = function (options) {

    var start = new Date().getTime();

    window.requestAnimationFrame(
        function animate() {
            // timeFraction от 0 до 1
            var now = new Date().getTime();

            var timeFraction = (now - start) / options.duration;
            if (timeFraction > 1) {
                timeFraction = 1;
            }
            // текущее состояние анимации
            var progress = options.timing(timeFraction);
            options.draw(progress);
            if (timeFraction < 1) {
                window.requestAnimationFrame(animate);
            }
        }
    );

};
CanvasClip.prototype._animateFull = function (options) {

    //var start = performance.now();
    var start = new Date().getTime();

    window.requestAnimationFrame(
        function animate() {
            // timeFraction от 0 до 1
            //var now = performance.now();
            var now = new Date().getTime();

            var timeFraction = (now - start) / options.duration;
            if (timeFraction > 1) {
                timeFraction = 1;
            }
            // текущее состояние анимации
            var progress = options.timing(timeFraction);
            options.draw(progress);
            if (timeFraction < 1)
                window.requestAnimationFrame(animate);

        }

    );

};
CanvasClip.prototype._setProperties = function (item) {
    var self = this;

    var parentWidth = $(item).parent().width();
    var parentHeight = $(item).parent().height();

    self._setWidth(parentWidth);

    self._setHeight(parentHeight);

    self._setImage(item);

    self._setPoints();
};
CanvasClip.prototype._createElement = function (block, img) {
    var self = this;

    if (block.find('canvas.canvaClip').length) {
        block.find('canvas.canvaClip').remove();
    }

    block.append('<canvas width=' + self._getWidth() + ' height=' + self._getHeight() + ' class="canvaClip">update your browser</canvas>');

    var canvas = block.find('canvas.canvaClip')[0];

    if (canvas.getContext) {

        var ctx = canvas.getContext("2d");

        self.devPix = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
        self.devPix = (self.devPix).toFixed(1);

        canvas.width *= self.devPix;
        canvas.height *= self.devPix;
        canvas.style.width = self._getWidth() + "px";
        canvas.style.height = self._getHeight() + "px";
        ctx.scale(self.devPix, self.devPix);

        var left = 0;
        var top = 0;

        var imgWidth = img.naturalWidth;
        var imgHeight = img.naturalHeight;

        if (!imgWidth)
            imgWidth = $(self._getImage()).innerWidth();

        if (!imgHeight)
            imgHeight = $(self._getImage()).innerHeight();

        var proportion = imgWidth / imgHeight;

        imgWidth = self._getHeight() * proportion;
        imgHeight = self._getHeight();

        if (imgWidth < self._getWidth()) {
            imgWidth = self._getWidth();
            imgHeight = imgWidth / proportion;
        }

        if (self._getHeight() < imgHeight) {
            top = -(imgHeight - self._getHeight()) / 2;
        }

        if (self._getWidth() < imgWidth) {
            left = -(imgWidth - self._getWidth()) / 2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.drawImage(img, left, top, imgWidth, imgHeight);
        ctx.closePath();
        ctx.restore();

    }

    self._setElement(canvas);
};
CanvasClip.prototype._setElement = function (element) {
    this._element = element;
};
CanvasClip.prototype._getElement = function () {
    return this._element;
};
CanvasClip.prototype._setWidth = function (width) {
    this._width = width;
};
CanvasClip.prototype._getWidth = function () {
    return this._width;
};
CanvasClip.prototype._setHeight = function (height) {
    this._height = height;
};
CanvasClip.prototype._getHeight = function () {
    return this._height;
};
CanvasClip.prototype._setImage = function (image) {
    this._image = image;
};
CanvasClip.prototype._getImage = function () {
    return this._image;
};
CanvasClip.prototype._setPoints = function () {
    var self = this;

    self._points = [
        [
            0,
            0
        ],
        [
            self._getWidth(),
            0
        ],
        [
            self._getWidth(),
            self._getHeight()
        ],
        [
            0,
            self._getHeight()
        ]
    ];

};
CanvasClip.prototype._setPoint = function (row, collum, value) {
    this._points[row][collum] = value;
};
CanvasClip.prototype._getPoint = function (row, collum) {
    return this._points[row][collum];
};
CanvasClip.prototype._setPointFull = function (row, collum, value) {
    this._pointsFull[row][collum] = value;
};
CanvasClip.prototype._getPointFull = function (row, collum) {
    return this._pointsFull[row][collum];
};
CanvasClip.prototype._setRandom = function () {
    this._rand = getRandomInt(0, 2);
};
CanvasClip.prototype._getRandom = function () {
    return this._rand;
};
CanvasClip.prototype.onMouseEnter = function (callback) {
    var self = this;

    if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        $(self._getElement()).on(
            'mouseenter',
            function () {
                self.clipCanvas();
                if (callback) {
                    callback();
                }
            }
        );
    }
};
CanvasClip.prototype.onMouseLeave = function (callback) {
    var self = this;

    if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        $(self._getElement()).on(
            'mouseleave',
            function () {
                self.unclipCanvas();
                if (callback) {
                    callback();
                }
            }
        );
    }
};
CanvasClip.prototype.onMouseMove = function () {
    $(this._getElement()).on(
        'mousemove',
        function () {
            console.log('mousemove');
        }
    );
};
CanvasClip.prototype.onClick = function (canvasObject, block, count, index, fit) {

    var self = this;

    var left, top, position;

    //*****************************************************************************/
    var currentEvent; // перевіряє який івент( тач або клік )

    currentEvent = 'click';

    if (window.ontouchstart !== undefined) {
        currentEvent = 'touch';
        $(self._getElement).on('touchmove', function (e) {

            $(block).find('.item').each(
                function (index) {
                    if ($(this).hasClass('hover'))
                        canvasObject[count][index].unclipCanvas();
                }
            );
            $(block).find('.item').removeClass('hover');

        });
    }

    //******************************************************************************/

    $(self._getElement()).on(
        'mousedown',
        function (e) {
            left = e.clientX;
            top = e.clientY;
        }
    );

    $(self._getElement()).off('mouseup').on(
        'mouseup',
        function (e) {

            position = $(this).offset(); //coordinate
            var left2 = e.clientX,
                top2 = e.clientY;

            if (Math.ceil(left) !== Math.ceil(left2) || Math.ceil(top) !== Math.ceil(top2))
                return;

            if (currentEvent === 'touch') {

                if (!$(this).parent().parent().hasClass('hover')) {
                    $(block).find('.item').each(
                        function (index) {
                            canvasObject[count][index].unclipCanvas();
                        }
                    );
                    canvasObject[count][index].clipCanvas();
                    $(block).find('.item').removeClass('hover');
                    $(this).parent().parent().addClass('hover');

                    return;

                }

                $(block).find('.item').removeClass('hover');
                $(block).find('.item').each(
                    function (index) {
                        canvasObject[count][index].unclipCanvas();
                    }
                );

            }

            if ($(block).parent().find('.fotorama').length <= 0) {
                return;
            }

            self.openFullCanvas(position); //open full canvas

            $(block).owlCarousel().data('owlCarousel').settings.autoplay = false; // stop autoplay carousel

            var startActiveIndex = 0;
            var endActiveIndex = 0;
            var numeric = index;
            var plus = $(block).data('owlCarousel').settings.items;

            // carousel was resized
            $(block).off('resized.owl.carousel').on(
                'resized.owl.carousel',
                function () {

                    $('.fotorama--fullscreen').find('.fotorama__nav__frame--thumb').each(
                        function (ind, item) {
                            if ($(item).hasClass('fotorama__active')) {
                                endActiveIndex = ind;
                            }
                        }
                    );

                    plus = $(this).data('owlCarousel').settings.items;

                    if (startActiveIndex >= plus)
                        startActiveIndex = 0;

                    if (startActiveIndex < 0)
                        startActiveIndex = plus;

                    position = $(this).find('.owl-item.active').eq(startActiveIndex).find('.canvaClip').offset();

                    numeric = endActiveIndex + plus;
                    canvasObject[count][numeric].resetFullCanvas(block, position);

                }
            );

            //carousel was translated
            $(block).off('translated.owl.carousel').on(
                'translated.owl.carousel',
                function () {

                    $('.fotorama--fullscreen').find('.fotorama__nav__frame--thumb').each(
                        function (ind, item) {
                            if ($(item).hasClass('fotorama__active')) {
                                endActiveIndex = ind;
                            }
                        }
                    );

                    plus = $(this).data('owlCarousel').settings.items;

                    if (startActiveIndex >= plus)
                        startActiveIndex = 0;

                    position = $(this).find('.owl-item.active').eq(startActiveIndex).find('.canvaClip').offset();

                    numeric = endActiveIndex;

                    if ($(block).owlCarousel().data('owlCarousel').settings.loop && plus <= $(block).find('.owl-item.active').length)
                        numeric = endActiveIndex + plus;

                    if (!$(canvasObject[count][numeric]._getElement()).parent().parent().parent().hasClass('active')) {
                        var imgSrc = $(canvasObject[count][numeric]._getElement()).parent().find('img').attr('src');
                        $(this).find('.owl-item.active').find('.item_img').find('img').each(
                            function (numer, item) {
                                if (item.src.indexOf(imgSrc) !== -1) {
                                    numeric = $(this).parent().parent().parent().index();
                                }
                            }
                        );
                    }
                    canvasObject[count][numeric].resetFullCanvas(block, position);

                    $(block).trigger('to.owl.carousel', [endActiveIndex - startActiveIndex, 1, true]);

                    $(block).off('translated.owl.carousel');
                }
            );

            var isShowEndFotorama = false;

            setTimeout(
                function () {

                    //***************************************************************************/
                    var fotoramaBlock = $(block).parent().find('.fotorama'); // main fotorama's block
                    var fotorama = $(block).parent().find('.fotorama').data('fotorama'); // fotorama's object

                    var number = 0;

                    // знаходить елемент який пртрібно показати у фоторамі */
                    fotoramaBlock.find('.fotorama__nav__frame--thumb').find('img').each(
                        function (numer, item) {
                            if (item.src === self._getImage().src) {
                                number = numer;
                            }
                        }
                    );

                    $(block).parent().find('.fotorama').removeClass('hiden'); // remove class hiden
                    fotorama.setOptions({
                        fit: fit,
                        transition: 'slide'
                    }); // set some options to fotorama
                    fotorama.show(number); // show number element of fotorama
                    fotorama.requestFullScreen(); // fullscreen

                    var $fotoramaBottom = $('.fotorama__nav-wrap');

                    if ($fotoramaBottom.find('.bottom').length <= 0) // add close button
                        $fotoramaBottom.append('<div class="bottom"><a href="#" class="close-this"></a></div>');

                    var bool = true;
                    $(block).find('.owl-item.active').find('img').each(
                        function (numer, item) {
                            if (item.src === self._getImage().src && bool) {
                                startActiveIndex = numer;
                                bool = false;
                            }
                        }
                    );

                    var $fotoramaFullScreen = $('.fotorama--fullscreen');

                    // fotorama was translated
                    $fotoramaFullScreen.off('fotorama:showend').on(
                        'fotorama:showend',
                        function (e, fotorama, extra) {

                            isShowEndFotorama = true;

                            $(this).find('.fotorama__nav__frame--thumb').each(
                                function (ind, item) {
                                    if ($(item).hasClass('fotorama__active')) {
                                        endActiveIndex = ind;
                                    }
                                }
                            );

                            $('.fotorama_show-icons').off('click').on(
                                'click',
                                function (e) {
                                    e.preventDefault();
                                    $(this).addClass('open');
                                    $(this).parent().find('ul').addClass('open');
                                }
                            );

                            plus = $(block).data('owlCarousel').settings.items;

                            if (!$(block).owlCarousel().data('owlCarousel').settings.loop && plus <= $(block).find('.owl-item.active').length) {
                                $(block).trigger('to.owl.carousel', [endActiveIndex, 1, true]);
                            } else {
                                $(block).trigger('to.owl.carousel', [endActiveIndex - startActiveIndex, 1, true]);
                            }

                            $(block).off('translated.owl.carousel');

                        }
                    );

                    if ($(block).hasClass('portfolio')) {
                        $fotoramaFullScreen.addClass('portfolio');
                    }

                    setTimeout(function () { // show fullscreen fotorama after some time
                        $fotoramaFullScreen.addClass('open');
                    }, canvasObject[count][index]._getFullDuration() / 3);

                    var $fototramaShowIcons = $('.fotorama_show-icons');

                    $fototramaShowIcons.removeClass('open');
                    $fototramaShowIcons.parent().find('ul').removeClass('open');

                    $fototramaShowIcons.off('click').on(
                        'click',
                        function (e) {
                            e.preventDefault();
                            $(this).addClass('open');
                            $(this).parent().find('ul').addClass('open');
                        }
                    );

                    // CLOSE FOTORAMA */
                    $fotoramaFullScreen.find('.close-this').off('click').on(
                        'click', closeFullFotorama);

                    function closeFullFotorama(e) {

                            /*************************************/
                            if (isShowEndFotorama) {

                                if ($(block).owlCarousel().data('owlCarousel').settings.loop && plus <= $(block).find('.owl-item.active').length) {
                                    if (startActiveIndex > plus)
                                        startActiveIndex = 0;

                                    if (startActiveIndex < 0)
                                        startActiveIndex = plus;

                                    position = $(block).find('.owl-item.active').eq(startActiveIndex).find('.canvaClip').offset();

                                    numeric = endActiveIndex + plus;
                                    //numeric = endActiveIndex;

                                    if (!$(canvasObject[count][numeric]._getElement()).parent().parent().parent().hasClass('active')) {
                                        var imgSrc = $(canvasObject[count][numeric]._getElement()).parent().find('img').attr('src');
                                        $(block).find('.owl-item.active').find('.item_img').find('img').each(
                                            function (numer, item) {

                                                if ($(item).attr('src') === imgSrc) {

                                                    numeric = $(this).parent().parent().parent().index();
                                                }
                                            }
                                        );
                                    }

                                    canvasObject[count][numeric].resetFullCanvas(block, position);
                                } else {

                                    position = $(block).find('.owl-item').eq(endActiveIndex).find('.canvaClip').offset();
                                    canvasObject[count][endActiveIndex].resetFullCanvas(block, position);

                                    numeric = endActiveIndex;
                                }

                            }
                            /*****************************************/

                            var $fotoramaFullScreen = $('.fotorama--fullscreen');

                            $fotoramaFullScreen.off();

                            fotorama.setOptions({
                                transition: 'crossfade'
                            });

                            e.preventDefault();
                            $('.fotorama__nav-wrap .bottom').remove();

                            $fotoramaFullScreen.removeClass('open');
                            setTimeout(function () {
                                fotorama.cancelFullScreen();

                                if ($(window).width() > 767) {
                                    $(block).parent().find('.fotorama').addClass('hiden');
                                    setTimeout(
                                        function () {
                                            $(block).owlCarousel().data('owlCarousel').settings.autoplay = false;
                                        }, canvasObject[count][index]._getFullDuration() + 50
                                    );
                                } else {
                                    if (!$(block).parent().find('.fotorama').hasClass('size-320'))
                                        $(block).parent().find('.fotorama').addClass('size-320');
                                    fotorama.setOptions({
                                        fit: canvasObject[count][index]._getFit()
                                    });
                                }

                                $(block).off('translated.owl.carousel');
                                $(block).off('resized.owl.carousel');

                                //setTimeout(function(){
                                canvasObject[count][numeric].closeFullCanvas(position, block);
                                //}, 100);

                            }, 300);

                        }
                        //***************************************************************************/

                }, canvasObject[count][index]._getFullDuration() + 150
            );

        });

};
CanvasClip.prototype.disableClick = function () {
    $(this._getElement()).off('click');
};
CanvasClip.prototype._setFit = function (fit) {
    var a_fit = ['cover', 'contain'];
    if (a_fit.indexOf(fit) !== -1) {
        this._fit = fit;
    }
};
CanvasClip.prototype._getFit = function () {
    return this._fit;
};

var globalTimer;
/**
 * Ініціалізація КліпКанваса
 * @param block - блок, в якому знаходяться елементи
 * @param count - кількість елементів
 * @param option - параметри
 * @returns {boolean}
 */
function initClipCanvas(block, count, option) {

    //*****************************************************************************/
    var fullCanvas = document.querySelector('.full-canvas');

    if (fullCanvas) {
        $(fullCanvas).remove();
    }

    if ($(window).width() > 767) {

        canvasObject[count] = [];

        var z = 0;

        $(block).find('.item').removeClass('hover');

        var $items = $(block).find('.item_img').find('img');
        var imgLength = $items.length;

        var wWidth = window.innerWidth;

        $items.each(
            function (index, item) {

                var img = new Image();

                addEvent(img, 'load', function () {

                    $items[index].setAttribute('src', img.getAttribute('src'));

                    canvasObject[count][index] = new CanvasClip();
                    canvasObject[count][index].buildCanvas($items[index], img);

                    canvasObject[count][index]._setDuration(option.duration);
                    canvasObject[count][index]._setFullDuration(option.durationFull);

                    canvasObject[count][index]._setFit(option.fit);

                    canvasObject[count][index].onMouseEnter(
                        function () {
                            $(canvasObject[count][index]._getElement()).parent().parent().addClass('hover');
                        }
                    );

                    canvasObject[count][index].onMouseLeave(
                        function () {
                            $(canvasObject[count][index]._getElement()).parent().parent().removeClass('hover');
                        }
                    );

                    canvasObject[count][index].onClick(canvasObject, block, count, index, canvasObject[count][index]._getFit());

                    z++;

                    if (z === imgLength) {

                        $(block).find('.item_img').find('.canvaClip').each(function (i, element) {
                            setTimeout(function () {
                                $(element).addClass("showThis");
                                $(element).parent().find('.timer').remove();
                            }, i * 100);
                        });

                    }

                });

                img.src = item.getAttribute('data-src');

            }
        );

    }


    removeEvent(window, 'resize', resize);
    addEvent(window, 'resize', resize);

    function resize() {
        clearTimeout(globalTimer);
        globalTimer = setTimeout(
            function () {

                var owl = $('.clipCarousel');

                owl.each(
                    function (index, carousel) {

                        if (!$(carousel).hasClass('clipRunned')) {
                            return;
                        }

                        setBlockHeight(carousel);

                        //					$ ( carousel ).find ( '.timer' ).css ( 'display', '' );
                        var fit = $(carousel).hasClass('cover') ? 'cover' : 'contain';
                        option.fit = fit;
                        initClipCanvas(carousel, index, option);
                    }
                );

            }, 300
        );
    }

}

/**
 * Ініціалізація фоторами
 * */

function initFotorama(owl, count) {

    var itemsImages = $(owl).find('img'), //знаходить усі картинки каруселі
        fotoramaImages = [], //масив для запису картинок
        fotoramaInfo = [],
        j = 0, // допоміжна змінна
        i = 0;
    // записуємо у масив усі картинки для побудови фоторами

    for (i; i < itemsImages.length; i++) {
        // якщо картинка не являється клоном
        if (itemsImages[i].parentNode.parentNode.parentNode.className.indexOf('clone') === -1) {
            fotoramaImages[j] = itemsImages[i]; // записується у масив
            var p = itemsImages[i].parentNode.parentNode.getElementsByClassName('item-info')[0];
            fotoramaInfo[j] = $(p).html();
            j++;
        }
    }

    // додає головний блок для фоторами */
    if (!$(owl).parent().find('.fotorama').length && !$(owl).parent().find('.fotorama--hidden').length) {
        $(owl).parent().append(' <div class="fotorama fotorama-style"></div>');
    }
    var fotorama_div = $(owl).parent().find('.fotorama div');

    for (var i = 0; i < fotoramaImages.length; i++) {
        var src = $(fotoramaImages[i]).attr('data-src');
        if (fotorama_div[i]) {
            fotorama_div[i].setAttribute('data-thumb', src);
            fotorama_div[i].setAttribute('data-img', src);
            if (!$(fotorama_div[i]).find('.item-info').html() && !$(fotorama_div[i]).find('.item-info').length) {
                $(fotorama_div[i]).find('.item-info').html(fotoramaInfo[i]);
            }
        } else {
            var info = fotoramaInfo[i] ? fotoramaInfo[i] : '';
            $(owl).parent().find('.fotorama').append('<div class="fotorama-info" data-thumb="' + src + '" data-img="' + src + '"> ' + info + '</div>');
        }
    }

    // 1. Initialize fotorama manually.
    var $fotoramaDiv = $(owl).parent().find('.fotorama').fotorama({
        width: '100%',
        allowfullscreen: true,
        nav: 'thumbs',
        arrows: false,
        transition: 'slide',
        clicktransition: 'dissolve',
        keyboard: false,
        click: false,
        loop: true,
        thumbwidth: 61,
        thumbheight: 40,
        thumbmargin: 10,
        shadows: false,
        navwidth: '85%'
    });

    if ($('body').hasClass('inverse')) {
        $fotoramaDiv.data('fotorama').options.thumbheight = 60;
        $fotoramaDiv.data('fotorama').options.thumbwidth = 81;
    }

    // 2. Get the API object.
    var fotorama = $fotoramaDiv.data('fotorama');

    function runFotorama() {

        var $owl = $(owl),
            $fotorama = $owl.parent().find('.fotorama');

        if ($(window).width() > 767) {

            if ($owl.hasClass('hiden')) {
                $owl.removeClass('hiden');
            }
            if ($fotorama.addClass('size-320')) {
                $fotorama.removeClass('size-320');
            }
            if (!$fotorama.hasClass('hiden')) {
                $fotorama.addClass('hiden');
            }

            fotorama.setOptions({
                navwidth: '80%'
            });
        }

        if ($(window).width() <= 767) {

            if (!$owl.hasClass('hiden'))
                $owl.addClass('hiden');

            if ($('.full-canvas').length)
                $('.full-canvas').remove();


            if (fotorama !== undefined) {
                if (!$fotorama.hasClass('size-320')) {
                    $fotorama.addClass('size-320');
                }
                if ($fotorama.hasClass('hiden')) {
                    $fotorama.removeClass('hiden');
                }
                fotorama.cancelFullScreen();
                fotorama.setOptions({
                    navwidth: '100%',
                    fit: 'cover',
                    height: '50%',
                    spinner: {
                        lines: 13,
                        color: 'rgba(0, 0, 0, 0)'
                    }
                });

                mobileFotorama();

                var $showIcons = $fotorama.find('.fotorama_show-icons');

                $showIcons.off().on(
                    'click',
                    function (e) {
                        e.preventDefault();
                        $(this).addClass('open');
                        $(this).parent().find('ul').addClass('open');
                    }
                );

                $showIcons.removeClass('open');
                $showIcons.parent().find('ul').removeClass('open');
                $fotorama.find('.fotorama__nav-wrap').find('.fotorama__nav__frame--thumb').each(
                    function (index, item) {
                        if ($(item).hasClass('fotorama__active')) {
                            if (!$(item).parent().parent().find('.fotorama_mobile-count').length) {
                                $(item).parent().parent().append('<p class="fotorama_mobile-count">' + index + 1 + ' / ' + $(item).parent().find('.fotorama__nav__frame--thumb').length + '<p>');
                            }
                            $(item).parent().parent().find('.fotorama_mobile-count').html(index + 1 + ' / ' + $(item).parent().find('.fotorama__nav__frame--thumb').length);
                        }
                    }
                );
                $fotorama.on(
                    'fotorama:showend',
                    function (e, fotorama, extra) {
                        mobileFotorama();
                        $(this).find('.fotorama__nav-wrap').find('.fotorama__nav__frame--thumb').each(
                            function (index, item) {

                                if ($(item).hasClass('fotorama__active')) {
                                    if (!$(item).parent().parent().find('.fotorama_mobile-count').length) {
                                        $(item).parent().parent().append('<p class="fotorama_mobile-count">' + index + 1 + ' / ' + $(item).parent().find('.fotorama__nav__frame--thumb').length + '<p>');
                                    }
                                    $(item).parent().parent().find('.fotorama_mobile-count').html(index + 1 + ' / ' + $(item).parent().find('.fotorama__nav__frame--thumb').length);
                                }
                            }
                        );
                        $fotorama.find('.fotorama_show-icons').off('click').on(
                            'click',
                            function (e) {
                                e.preventDefault();
                                $(this).addClass('open');
                                $(this).parent().find('ul').addClass('open');
                            }
                        );
                    }
                );
            }
        }

        function mobileFotorama() {

            var $active = $(owl).parent().find('.fotorama').find('.fotorama__stage__frame.fotorama__active');

            var startx;
            var endx;

            $active.off('touchstart').on(
                'touchstart',
                function (e) {
                    var touchobj = e.originalEvent; // reference first touch point (ie: first finger)
                    startx = parseInt(touchobj.targetTouches[0].pageX, 10); // get x position of touch point relative to left
                    // edge of browser
                }
            );

            $active.off('touchend').on(
                'touchend',
                function (e) {
                    var touchobj = e.originalEvent; // reference first touch point (ie: first finger)
                    endx = parseInt(touchobj.changedTouches[0].pageX, 10); // get x position of touch point relative to left
                    // edge of browser

                    if (startx !== endx) {
                        return;
                    }

                    if ($(owl).hasClass('portfolio')) {
                        return;
                    }

                    $(this).find('.fotorama__html').addClass('open');

                    $(this).find('.fotorama-info').addClass('open');
                    fotorama.setOptions({
                        swipe: false
                    });

                    var $fotoramaMobile = $(owl).parent().find('.fotorama'),
                        $fotoramaStage = $fotoramaMobile.find('.fotorama__stage'),
                        $fotoramaNav = $fotoramaMobile.find('.fotorama__nav');

                    $fotoramaMobile.find('.fotorama__nav__shaft').addClass('hiden');
                    $fotoramaStage.addClass('open');
                    $fotoramaStage.find('.fotorama__img').addClass('hidden');
                    $(owl).parent().find('.fotorama_mobile-count').addClass('opacity');
                    if ($fotoramaNav.find('.bottom').length <= 0) {
                        $fotoramaNav.append('<div class="bottom"><a href="#" class="close-this"></a></div>');
                    }
                    $fotoramaNav.find('.close-this').off('click').on('click',
                        function (e) {

                            $(owl).parent().find('.fotorama__html').removeClass('open');

                            var $fotoramaShowIcons = $fotoramaMobile.find('.fotorama_show-icons');
                            $fotoramaShowIcons.removeClass('open');
                            $fotoramaShowIcons.parent().find('ul').removeClass('open');
                            $(owl).parent().find('.fotorama_mobile-count').removeClass('opacity');
                            e.preventDefault();
                            $fotoramaMobile.find('.fotorama__nav .bottom').remove();
                            $fotoramaMobile.find('.fotorama-info').removeClass('open');
                            $fotoramaStage.removeClass('open');
                            $fotoramaStage.removeClass('open');
                            fotorama.setOptions({
                                swipe: true
                            });
                            $fotoramaStage.find('.fotorama__img').removeClass('hidden');
                            $fotoramaMobile.find('.fotorama__nav__shaft').removeClass('hiden');

                        }
                    );

                }
            );

        }
    }

    runFotorama();

    addEvent(
        window, 'resize',
        function () {
            runFotorama();
        }
    );

}


/**
 * Ініціалізація усіх карусельок із заданим класов
 * @param owl
 */
function initCarousel(owl) {

    $(owl).each(
        function (index, carousel) {

            var obj;

            if ($(carousel).hasClass('demo')) {
                setElemNumber(carousel);
                obj = $(carousel).owlCarousel({
                    center: true,
                    margin: 30,
                    loop: false,
                    autoplay: false,
                    autoplayTimeout: 3000,
                    autoplaySpeed: 1000,
                    nav: false,
                    smartSpeed: 1000,
                    autoplayHoverPause: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        500: {
                            items: 2
                        },
                        800: {
                            items: 3
                        },
                        1140: {
                            items: 4
                        },
                        callbacks: true
                    }
                });

                var isTranslate = false;

                $(carousel).find('.owl-item').on('click', function (e) {

                    e.stopPropagation();

                    if (!$(this).hasClass('center') || isTranslate) {
                        e.preventDefault();
                        $(carousel).trigger('to.owl.carousel', [$(this).index(), 400]);
                        isTranslate = true;
                    }

                    $(carousel).on('translated.owl.carousel', function () {
                        isTranslate = false;
                    });

                });

            } else {
                setElemNumber(carousel);
                obj = $(carousel).owlCarousel({
                    margin: 30,
                    loop: false,
                    autoplay: false,
                    autoplayTimeout: 3000,
                    autoplaySpeed: 1000,
                    nav: false,
                    smartSpeed: 1000,
                    autoplayHoverPause: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        500: {
                            items: 2
                        },
                        768: {
                            items: 3
                        },
                        997: {
                            items: 4
                        },
                        1140: {
                            items: 5
                        },
                        callbacks: true
                    }
                });

                setBlockHeight(carousel);

            }

            var isAnimate = false;

            $(carousel).on('mousewheel', '.owl-stage', function (e) {

                if (e.deltaY > 0) {
                    if (!isAnimate) {
                        $(carousel).trigger('next.owl.carousel', [300]);
                    }
                } else {
                    if (!isAnimate) {
                        $(carousel).trigger('prev.owl.carousel', [300]);
                    }
                }

                $(carousel).on('translate.owl.carousel', function () {
                    isAnimate = true;
                });

                $(carousel).on('translated.owl.carousel', function () {
                    isAnimate = false;
                });

                e.preventDefault();
            });

            recalcCarouselWidth(carousel);

            removeEvent(window, 'resize', resize);
            //var timer;
            addEvent(window, 'resize', resize);

            function resize() {

                if (!$(carousel).hasClass('demo'))
                    setBlockHeight(carousel);
                recalcCarouselWidth(carousel);

            }

            // LEFT RIGHT NAVIGATION

            var urlRight = "url('img/gright_white.svg'), e-resize",
                urlLeft = "url('img/gleft_white.svg'), w-resize";

            var isChange = false;

            if ($('body').hasClass('inverse') || $('body').hasClass('color_bg') || $('body').hasClass('gradient_bg')) {
                urlRight = "url('img/gright.svg'), e-resize",
                    urlLeft = "url('img/gleft.svg'), w-resize";
            }

            var goRight = false;

            //var clickCount = 0;

            var $owlItems = $(carousel).find('.owl-item');
            var owlItemsLength = $owlItems.length;

            var findClass = 'active';

            if ($(carousel).owlCarousel().data('owlCarousel').settings.center) {
                findClass = 'center';
            }

            $(carousel).parent().on('mousemove', function (event) {

                if (event.pageX > window.innerWidth / 2) {

                    $(this).parent().css('cursor', urlRight);
                    goRight = true;

                } else {

                    $(this).parent().css('cursor', urlLeft);
                    goRight = false;

                }

            });

            obj.on('change.owl.carousel', function () {
                isChange = true;
            });

            $(carousel).find('.owl-stage').on('click', function (e) {
                e.stopPropagation();
            });

            $(carousel).parent().on('click', function (e) {

                e.preventDefault();
                e.stopPropagation();

                var self = this;

                if (goRight) {
                    obj.trigger('next.owl.carousel', [500]);
                } else {
                    obj.trigger('prev.owl.carousel', [500]);
                }
            });

        }
    );
    //		}

    function setElemNumber(carousel) {
        $(carousel).find('.item').each(
            function (index) {
                var index = $(this).index();
                if (!$(this).find('.item-info').length) {
                    $(this).append('<div class="item-info"></div>');
                }
                if (!$(this).find('.item-info').find('.item-index').length) {
                    $(this).find('.item-info').append('<p class="item-index">' + (index + 1) + ' / ' + $(carousel).find('.item').length + '</p>');
                }
            }
        );
    }

    function recalcCarouselWidth(carousel) {
        var stage = $(carousel).find('.owl-stage');
        stage.width(Math.ceil(stage.width()) + 1);
    }
}

function setBlockHeight(carousel) {
        $(carousel).find('.item_img').each(
            function (index, item) {
                $(item).height($(item).width() / 1.5);
            }
        );
    }
    // Init Owl Carousel
    (function () {
        // initialize
        initCarousel('.clipCarousel');
        initCarousel('.demo');
    }());

/**
 * Ініціалізує фотораму, овл-карусель, та кліп-Канвас
 * @returns {undefined}
 * */
function runClipCanvas() {

    var $ptPage = $('.pt-page-current')
    var owl = $ptPage.find('.clipCarousel');

    if (!owl.length)
        return;

    if (owl.hasClass('clipRunned'))
        return;

    var number = $ptPage[0].className.replace(/^\D+/g, '');

    number = number.replace(' pt-page-current', '');

    var wWidth = window.innerWidth;

    if (wWidth > 991) {

        var itemImg = document.querySelectorAll('.pt-page-current .clipCarousel .item_img');
        if (itemImg) {

            var width = itemImg.clientWidth;
            var height = itemImg.clientHeight;

            var $body = $('body');

            if ($body.hasClass('inverse') || $body.hasClass('color_bg') || $body.hasClass('gradient_bg')) {
                initDaysLeft(
                    itemImg, {
                        width: width / 2,
                        height: height / 2,
                        duration: 1000,
                        time: 0,
                        numberColor: 'rgba(0,0,0,1)',
                        numberFont: '30px Abel',
                        textColor: 'rgba(0,0,0,0.2)',
                        textFont: ' ',
                        data: "",
                        text: ' ',
                        lineColor: 'rgba(0, 0, 0, 0.5)'
                    }
                );
            } else {
                initDaysLeft(
                    itemImg, {
                        width: width / 2,
                        height: height / 2,
                        duration: 1000,
                        time: 0,
                        numberColor: 'rgba(255,255,255,1)',
                        numberFont: '30px Abel',
                        textColor: 'rgba(255,255,255,0.2)',
                        textFont: ' ',
                        data: "",
                        text: ' ',
                        lineColor: 'rgba(255, 255, 255, 0.5)'
                    }
                );
            }
        }
    }

    owl.each(
        function (index, carousel) {

            $(carousel).addClass('clipRunned');

            initFotorama(carousel, index);

            //initCarousel ( carousel );

            var fit = $(carousel).hasClass('cover') ? 'cover' : 'contain';

            // change initClipCanvas setting
            initClipCanvas(
                $(carousel), number + index, {
                    duration: 300, // change if you want
                    durationFull: 500, // change if you want
                    fit: fit // if has class cover, fit = cover else fit = contain
                        // if you want that all carousel open the same, you catn change fit on the string
                        // "cover" or "contain"
                }
            );

        }
    );
}

// Timer **********************************************************************/
//class
function DaysLeft() {
    this.points = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];
    this.element = null;
    this.width = 146;
    this.height = 122;
    this.duration = 300;
    this.time = true;
    this.autoplay = true;
    this.numberColor = 'yellow';
    this.numberFont = '30px Abel';
    this.text = 'Days Left';
    this.textColor = 'white';
    this.textFont = '30px Abel';
    this.data = "";
    this.path = 1;
    this.lineColor = 'rgba(255,255,255,0.5)';
    //*****************************/
    this.x1Rand;
    this.x1Width;
    this.y1Rand;
    this.y1Width;
    this.x2Rand;
    this.x2Width;
    this.y2Rand;
    this.y2Width;
    this.x3Rand;
    this.x3Width;
    this.y3Rand;
    this.y3Width;
    this.x4Rand;
    this.x4Width;
    this.y4Rand;
    this.y4Width;
    //**************************/

    this.x1;
    this.circleX1;
    this.circleX1Width;
    this.elipseX1;
    this.elipseX1Width;
    this.y1;
    this.circleY1;
    this.circleY1Width;
    this.elipseY1;
    this.elipseY1Width;

    /*************************/

    this.devPix;
}
DaysLeft.prototype = {
    constructor: DaysLeft,
    createElement: function (block, options) {
        var self = this;
        if (options) {

            self.devPix = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
            self.devPix = (self.devPix).toFixed(1);

            self._setWidth(options.width);
            self._setHeight(options.height);
            self._setDuration(options.duration);
            self._setTime(options.time);
            self._setAutoplay(options.autoplay);
            self._setTextColor(options.textColor);
            self._setTextFont(options.textFont);
            self._setNumberColor(options.numberColor);
            self._setNumberFont(options.numberFont);
            self._setData(options.data);
            self._setText(options.text);
            self.lineColor = options.lineColor ? options.lineColor : self.lineColor;
        }

        self._setPoint(0, 0, self._getWidth() / 2);
        self._setPoint(0, 1, 0);
        self._setPoint(1, 0, self._getWidth());
        self._setPoint(1, 1, self._getHeight() / 2);
        self._setPoint(2, 0, self._getWidth() / 2);
        self._setPoint(2, 1, self._getHeight());
        self._setPoint(3, 0, 0);
        self._setPoint(3, 1, self._getHeight() / 2);
        if (!$(block).find('.timer').length)
            $(block).prepend('<canvas class="timer" width=' + self._getWidth() + ' height=' + self._getHeight() + '>update your browser</canvas>');
        var canvas = $(block).find('.timer')[0];
        self._setElement(canvas);
    },
    drawElement: function () {
        var self = this;
        var canvas = self._getElement();
        if (canvas.getContext) {

            var timer = canvas.getContext('2d');
            canvas.width *= self.devPix;
            canvas.height *= self.devPix;
            canvas.style.width = this.width + "px";
            canvas.style.height = this.height + "px";
            timer.scale(self.devPix, self.devPix);

            self._animate({
                duration: self._getDuration(),
                timing: function (timeFraction) {
                    return timeFraction * timeFraction * timeFraction * timeFraction * timeFraction * timeFraction;
                },
                draw: function (progress) {

                    //===================================================================================
                    if (self._getPoint(0, 0) < self.x1Rand) {
                        self._setPoint(0, 0, (self.x1Rand - self.x1Width) + (self.x1Width * progress));

                        if (self._getPoint(0, 0) >= self.x1Rand) {
                            self._setPoint(0, 0, self.x1Rand);
                        }
                    }
                    if (self._getPoint(0, 0) > self.x1Rand) {
                        self._setPoint(0, 0, (self.x1Rand + self.x1Width) - (self.x1Width * progress));

                        if (self._getPoint(0, 0) <= self.x1Rand) {
                            self._setPoint(0, 0, self.x1Rand);
                        }
                    }

                    if (self._getPoint(0, 1) > self.y1Rand) {
                        self._setPoint(0, 1, (self.y1Rand + self.y1Width) - (self.y1Width * progress));

                        if (self._getPoint(0, 1) <= self.y1Rand) {
                            self._setPoint(0, 1, self.y1Rand);
                        }
                    }
                    if (self._getPoint(0, 1) < self.y1Rand) {
                        self._setPoint(0, 1, (self.y1Rand - self.y1Width) + (self.y1Width * progress));

                        if (self._getPoint(0, 1) >= self.y1Rand) {
                            self._setPoint(0, 1, self.y1Rand);
                        }
                    }
                    //===================================================================================
                    if (self._getPoint(1, 0) < self.x2Rand) {
                        self._setPoint(1, 0, (self.x2Rand - self.x2Width) + (self.x2Width * progress));

                        if (self._getPoint(1, 0) >= self.x2Rand) {
                            self._setPoint(1, 0, self.x2Rand);
                        }
                    }
                    if (self._getPoint(1, 0) > self.x2Rand) {
                        self._setPoint(1, 0, (self.x2Rand + self.x2Width) - (self.x2Width * progress));

                        if (self._getPoint(1, 0) <= self.x2Rand) {
                            self._setPoint(1, 0, self.x2Rand);
                        }
                    }

                    if (self._getPoint(1, 1) < self.y2Rand) {
                        self._setPoint(1, 1, (self.y2Rand - self.y2Width) + (self.y2Width * progress));

                        if (self._getPoint(1, 1) >= self.y2Rand)
                            self._setPoint(1, 1, self.y2Rand);
                    }
                    if (self._getPoint(1, 1) > self.y2Rand) {
                        self._setPoint(1, 1, (self.y2Rand + self.y2Width) - (self.y2Width * progress));

                        if (self._getPoint(1, 1) <= self.y2Rand)
                            self._setPoint(1, 1, self.y2Rand);
                    }
                    //===================================================================================
                    if (self._getPoint(2, 0) < self.x3Rand) {
                        self._setPoint(2, 0, (self.x3Rand - self.x3Width) + (self.x3Width * progress));

                        if (self._getPoint(2, 0) >= self.x3Rand)
                            self._setPoint(2, 0, self.x3Rand);
                    }
                    if (self._getPoint(2, 0) > self.x3Rand) {
                        self._setPoint(2, 0, (self.x3Rand + self.x3Width) - (self.x3Width * progress));

                        if (self._getPoint(2, 0) <= self.x3Rand) {
                            self._setPoint(2, 0, self.x3Rand);
                        }
                    }

                    if (self._getPoint(2, 1) < self.y3Rand) {
                        self._setPoint(2, 1, (self.y3Rand - self.y3Width) + (self.y3Width * progress));

                        if (self._getPoint(2, 1) >= self.y3Rand) {
                            self._setPoint(2, 1, self.y3Rand);
                        }
                    }
                    if (self._getPoint(2, 1) > self.y3Rand) {
                        self._setPoint(2, 1, (self.y3Rand + self.y3Width) - (self.y3Width * progress));

                        if (self._getPoint(2, 1) <= self.y3Rand) {
                            self._setPoint(2, 1, self.y3Rand);
                        }
                    }
                    //===================================================================================
                    if (self._getPoint(3, 0) > self.x4Rand) {
                        self._setPoint(3, 0, (self.x4Rand + self.x4Width) - (self.x4Width * progress));

                        if (self._getPoint(3, 0) <= self.x4Rand) {
                            self._setPoint(3, 0, self.x4Rand);
                        }
                    }
                    if (self._getPoint(3, 0) < self.x4Rand) {
                        self._setPoint(3, 0, (self.x4Rand - self.x4Width) + (self.x4Width * progress));

                        if (self._getPoint(3, 0) >= self.x4Rand) {
                            self._setPoint(3, 0, self.x4Rand);
                        }
                    }

                    if (self._getPoint(3, 1) < self.y4Rand) {
                        self._setPoint(3, 1, (self.y4Rand - self.y4Width) + (self.y4Width * progress));

                        if (self._getPoint(3, 1) >= self.y4Rand)
                            self._setPoint(3, 1, self.y4Rand);
                    }
                    if (self._getPoint(3, 1) > self.y4Rand) {
                        self._setPoint(3, 1, (self.y4Rand + self.y4Width) - (self.y4Width * progress));

                        if (self._getPoint(3, 1) <= self.y4Rand) {
                            self._setPoint(3, 1, self.y4Rand);
                        }
                    }

                    timer.clearRect(0, 0, canvas.width, canvas.height);
                    timer.save();
                    timer.beginPath();
                    timer.moveTo(self._getPoint(0, 0), self._getPoint(0, 1));
                    timer.lineTo(self._getPoint(1, 0), self._getPoint(1, 1));
                    timer.lineTo(self._getPoint(2, 0), self._getPoint(2, 1));
                    timer.lineTo(self._getPoint(3, 0), self._getPoint(3, 1));
                    timer.lineTo(self._getPoint(0, 0), self._getPoint(0, 1));
                    timer.strokeStyle = self.lineColor;
                    timer.lineWidth = 1;
                    timer.stroke();

                    if (self._getData()) {
                        var now = new Date();
                        var destination_day = self._getData() + ' ' + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
                        var deadLineDate = new Date(destination_day);
                        var daysLeft = deadLineDate > now ?
                            Math.ceil((deadLineDate - now) / (1000 * 60 * 60 * 24)) :
                            0;
                        timer.font = self._getNumberFont();
                        timer.fillStyle = self._getNumberColor();
                        timer.renderText(daysLeft.toString(), self._getWidth() / 2 - timer.measureText(daysLeft).width / 2 - 5,
                            self._getHeight() / 2, 5);
                    }

                    timer.font = self._getTextFont();
                    timer.fillStyle = self._getTextColor();
                    timer.renderText(self._getText(), self._getWidth() / 2 - timer.measureText(self._getText()).width / 2 - 15, 95, 4);
                    timer.closePath();
                    timer.restore();

                }

            });
        }

    },
    drawElInElips: function () {

        var self = this;
        var canvas = self._getElement();
        if (canvas.getContext) {

            var timer = canvas.getContext('2d');
            timer.moveTo(canvas.width, canvas.height / 2);
            self._animate({
                duration: self._getDuration(),
                timing: function (timeFraction) {
                    return timeFraction;
                },
                draw: function (progress) {

                    progress = progress * 100;
                    timer.clearRect(0, 0, canvas.width, canvas.height);
                    timer.save();
                    /* ELIPSE */
                    timer.beginPath();
                    //
                    var rX = canvas.width / 2;
                    var rY = canvas.height / 2;
                    //
                    var x = rX + rX * Math.cos(2 * Math.PI * progress / 100);
                    var y = rY + rY * Math.sin(2 * Math.PI * progress / 100);
                    timer.moveTo(canvas.width, canvas.height / 2);
                    timer.lineTo(x, y);
                    timer.strokeStyle = 'rgba(255, 255, 255, 1)';
                    timer.stroke();
                    timer.closePath();
                    //
                    /* CIRCLE */
                    timer.beginPath();
                    if (rY > rX)
                        rY = rX;
                    rY /= 2;
                    timer.arc(canvas.width / 2, canvas.height / 2, rY, 0, Math.PI * 2 * progress / 100);
                    timer.strokeStyle = 'rgba(255, 255, 255, 1)';
                    timer.stroke();
                    timer.closePath();
                    /* RECTANGLE */
                    timer.beginPath();
                    timer.moveTo(self._getPoint(0, 0), self._getPoint(0, 1));
                    timer.lineTo(self._getPoint(1, 0), self._getPoint(1, 1));
                    timer.lineTo(self._getPoint(2, 0), self._getPoint(2, 1));
                    timer.lineTo(self._getPoint(3, 0), self._getPoint(3, 1));
                    timer.lineTo(self._getPoint(0, 0), self._getPoint(0, 1));
                    timer.strokeStyle = 'green';
                    timer.stroke();
                    timer.closePath();
                    timer.restore();
                    if (self._getPoint(0, 0) >= self.elipseX1)
                        self._setPoint(0, 0, (self.elipseX1 + self.elipseX1Width) - (self.elipseX1Width * progress) / 100);
                    if (self._getPoint(0, 0) < self.elipseX1)
                        self._setPoint(0, 0, (self.elipseX1 - self.elipseX1Width) + (self.elipseX1Width * progress) / 100);
                    if (self._getPoint(0, 1) >= self.elipseY1)
                        self._setPoint(0, 1, (self.elipseY1 + self.elipseY1Width) - (self.elipseY1Width * progress) / 100);
                    if (self._getPoint(0, 1) < self.elipseY1)
                        self._setPoint(0, 1, (self.elipseY1 - self.elipseY1Width) + (self.elipseY1Width * progress) / 100);
                    if (self._getPoint(1, 0) >= self.elipseX2)
                        self._setPoint(1, 0, (self.elipseX2 + self.elipseX2Width) - (self.elipseX2Width * progress) / 100);
                    if (self._getPoint(1, 0) < self.elipseX2)
                        self._setPoint(1, 0, (self.elipseX2 - self.elipseX2Width) + (self.elipseX2Width * progress) / 100);
                    if (self._getPoint(1, 1) >= self.elipseY2)
                        self._setPoint(1, 1, (self.elipseY2 + self.elipseY2Width) - (self.elipseY2Width * progress) / 100);
                    if (self._getPoint(1, 1) < self.elipseY2)
                        self._setPoint(1, 1, (self.elipseY2 - self.elipseY2Width) + (self.elipseY2Width * progress) / 100);
                    if (self._getPoint(2, 0) >= self.elipseX3)
                        self._setPoint(2, 0, (self.elipseX3 + self.elipseX3Width) - (self.elipseX3Width * progress) / 100);
                    if (self._getPoint(2, 0) < self.elipseX3)
                        self._setPoint(2, 0, (self.elipseX3 - self.elipseX3Width) + (self.elipseX3Width * progress) / 100);
                    if (self._getPoint(2, 1) >= self.elipseY3)
                        self._setPoint(2, 1, (self.elipseY3 + self.elipseY3Width) - (self.elipseY3Width * progress) / 100);
                    if (self._getPoint(2, 1) < self.elipseY3)
                        self._setPoint(2, 1, (self.elipseY3 - self.elipseY3Width) + (self.elipseY3Width * progress) / 100);
                    if (self._getPoint(3, 0) >= self.elipseX4)
                        self._setPoint(3, 0, (self.elipseX4 + self.elipseX4Width) - (self.elipseX4Width * progress) / 100);
                    if (self._getPoint(3, 0) < self.elipseX4)
                        self._setPoint(3, 0, (self.elipseX4 - self.elipseX4Width) + (self.elipseX4Width * progress) / 100);
                    if (self._getPoint(3, 1) >= self.elipseY4)
                        self._setPoint(3, 1, (self.elipseY4 + self.elipseY4Width) - (self.elipseY4Width * progress) / 100);
                    if (self._getPoint(3, 1) < self.elipseY4)
                        self._setPoint(3, 1, (self.elipseY4 - self.elipseY4Width) + (self.elipseY4Width * progress) / 100);
                }
            });
        }

    },
    _animate: function (options) {

        var self = this;
        self._setPath();

        var canvas = self._getElement();
        var start = new Date().getTime();
        window.requestAnimationFrame(function animate(time) {
            // timeFraction от 0 до 1
            var now = new Date().getTime();
            var timeFraction = (now - start) / options.duration;
            if (timeFraction >= 1) {
                setTimeout(function () {

                    if (canvas.getContext) {

                        var timer = canvas.getContext('2d');

                        self._setPath();

                        start = new Date().getTime();
                        window.requestAnimationFrame(animate);
                    }

                }, self._getTime());
            }
            // текущее состояние анимации
            var progress = options.timing(timeFraction);
            options.draw(progress);
            if (timeFraction < 1)
                window.requestAnimationFrame(animate);
        });
    },
    _setPath: function () {

        var self = this;
        self._setRandom();
        if (self._getPoint(0, 0) < 0 || self._getPoint(0, 0) > self._getWidth())
            self._setPoint(0, 0, 5);
        if (self._getPoint(0, 1) < 0 || self._getPoint(0, 1) > self._getHeight())
            self._setPoint(0, 1, 5);
        if (self._getPoint(1, 0) < 0 || self._getPoint(1, 0) > self._getWidth())
            self._setPoint(1, 0, self._getWidth());
        if (self._getPoint(1, 1) < 0 || self._getPoint(1, 1) > self._getHeight())
            self._setPoint(1, 1, 5);
        if (self._getPoint(2, 0) < 0 || self._getPoint(2, 0) > self._getWidth())
            self._setPoint(2, 0, self._getWidth());
        if (self._getPoint(2, 1) < 0 || self._getPoint(2, 1) > self._getHeight())
            self._setPoint(2, 1, self._getHeight());
        if (self._getPoint(3, 0) < 0 || self._getPoint(3, 0) > self._getWidth())
            self._setPoint(3, 0, 5);
        if (self._getPoint(3, 1) < 0 || self._getPoint(3, 1) > self._getHeight())
            self._setPoint(3, 1, self._getHeight());
        var n = 4;
        if (self._getRandom()) {

            self.x1Rand = getRandomInt(self._getWidth() / n, self._getWidth() - self._getWidth() / n);
            self.x1Width = Math.abs(self._getPoint(0, 0) - self.x1Rand);
            self.y1Rand = 5;
            self.y1Width = Math.abs(self._getPoint(0, 1) - self.y1Rand);
            self.x2Rand = self._getWidth() - 5;
            self.x2Width = Math.abs(self._getPoint(1, 0) - self.x2Rand);
            self.y2Rand = getRandomInt(self._getHeight() / n, self._getHeight() - self._getHeight() / n);
            self.y2Width = Math.abs(self._getPoint(1, 1) - self.y2Rand);
            self.x3Rand = getRandomInt(self._getWidth() / n, self._getWidth() - self._getWidth() / n);
            self.x3Width = Math.abs(self._getPoint(2, 0) - self.x3Rand);
            self.y3Rand = self._getHeight() - 5;
            self.y3Width = Math.abs(self._getPoint(2, 1) - self.y3Rand);
            self.x4Rand = 5;
            self.x4Width = Math.abs(self._getPoint(3, 0) - self.x4Rand);
            self.y4Rand = getRandomInt(self._getHeight() / n, self._getHeight() - self._getHeight() / n);
            self.y4Width = Math.abs(self._getPoint(3, 1) - self.y4Rand);
        }

        if (!self._getRandom()) {

            self.x1Rand = 5;
            self.x1Width = Math.abs(self._getPoint(0, 0) - self.x1Rand);
            self.y1Rand = getRandomInt(self._getHeight() / n, self._getHeight() - self._getHeight() / n);
            self.y1Width = Math.abs(self._getPoint(0, 1) - self.y1Rand);
            self.x2Rand = getRandomInt(self._getWidth() / n, self._getWidth() - self._getWidth() / n);
            self.x2Width = Math.abs(self._getPoint(1, 0) - self.x2Rand);
            self.y2Rand = 5;
            self.y2Width = Math.abs(self._getPoint(1, 1) - self.y2Rand);
            self.x3Rand = self._getWidth() - 5;
            self.x3Width = Math.abs(self._getPoint(2, 0) - self.x3Rand);
            self.y3Rand = getRandomInt(self._getHeight() / n, self._getHeight() - self._getHeight() / n);
            self.y3Width = Math.abs(self._getPoint(2, 1) - self.y3Rand);
            self.x4Rand = getRandomInt(self._getWidth() / n, self._getWidth() - self._getWidth() / n);
            self.x4Width = Math.abs(self._getPoint(3, 0) - self.x4Rand);
            self.y4Rand = self._getHeight() - 5;
            self.y4Width = Math.abs(self._getPoint(3, 1) - self.y4Rand);
        }

    },
    _setPathElipse: function () {

        var self = this;
        var elipseAngle = getRandomArbitrary(3 * Math.PI / 2, Math.PI * 2);
        self.elipseX1 = self._getWidth() / 2 + self._getWidth() / 2 * Math.cos(elipseAngle);
        self.elipseX1Width = Math.abs(self._getPoint(0, 0) - self.elipseX1);
        self.elipseY1 = self._getHeight() / 2 + self._getHeight() / 2 * Math.sin(elipseAngle);
        self.elipseY1Width = Math.abs(self._getPoint(0, 1) - self.elipseY1);
        elipseAngle = getRandomArbitrary(Math.PI / 2, 0);
        self.elipseX2 = self._getWidth() / 2 + self._getWidth() / 2 * Math.cos(elipseAngle);
        self.elipseX2Width = Math.abs(self._getPoint(1, 0) - self.elipseX2);
        self.elipseY2 = self._getHeight() / 2 + self._getHeight() / 2 * Math.sin(elipseAngle);
        self.elipseY2Width = Math.abs(self._getPoint(1, 1) - self.elipseY2);
        elipseAngle = getRandomArbitrary(Math.PI / 2, Math.PI);
        self.elipseX3 = self._getWidth() / 2 + self._getWidth() / 2 * Math.cos(elipseAngle);
        self.elipseX3Width = Math.abs(self._getPoint(2, 0) - self.elipseX3);
        self.elipseY3 = self._getHeight() / 2 + self._getHeight() / 2 * Math.sin(elipseAngle);
        self.elipseY3Width = Math.abs(self._getPoint(2, 1) - self.elipseY3);
        elipseAngle = getRandomArbitrary(3 * Math.PI / 2, Math.PI);
        self.elipseX4 = self._getWidth() / 2 + self._getWidth() / 2 * Math.cos(elipseAngle);
        self.elipseX4Width = Math.abs(self._getPoint(3, 0) - self.elipseX4);
        self.elipseY4 = self._getHeight() / 2 + self._getHeight() / 2 * Math.sin(elipseAngle);
        self.elipseY4Width = Math.abs(self._getPoint(3, 1) - self.elipseY4);
    },
    _setWidth: function (width) {
        if (width)
            this.width = width;
    },
    _getWidth: function () {
        return this.width;
    },
    _setHeight: function (height) {
        if (height)
            this.height = height;
    },
    _getHeight: function () {
        return this.height;
    },
    _setDuration: function (duration) {
        if (duration)
            this.duration = duration;
    },
    _getDuration: function () {
        return this.duration;
    },
    _setTime: function (time) {
        if (time)
            this.time = time;
    },
    _getTime: function () {
        return this.time;
    },
    _setAutoplay: function (autoplay) {
        this.autoplay = autoplay;
    },
    _getAutoplay: function () {
        return this.autoplay;
    },
    _setPoint: function (row, collum, value) {
        this.points[row][collum] = value;
    },
    _getPoint: function (row, collum) {
        return this.points[row][collum];
    },
    _setElement: function (element) {
        this.element = element;
    },
    _getElement: function () {
        return this.element;
    },
    _setRandom: function () {
        this.path = getRandomInt(0, 2);
    },
    _getRandom: function () {
        return this.path;
    },
    _setTextColor: function (color) {
        if (color)
            this.textColor = color;
    },
    _getTextColor: function () {
        return this.textColor;
    },
    _setText: function (text) {
        if (text)
            this.text = text;
    },
    _getText: function () {
        return this.text;
    },
    _setTextFont: function (size) {
        if (size)
            this.fontSize = size;
    },
    _getTextFont: function () {
        return this.fontSize;
    },
    _setNumberColor: function (color) {
        if (color)
            this.numberColor = color;
    },
    _getNumberColor: function () {
        return this.numberColor;
    },
    _setNumberFont: function (size) {
        if (size)
            this.numberFont = size;
    },
    _getNumberFont: function () {
        return this.numberFont;
    },
    _setData: function (data) {
        if (data)
            this.data = data;
    },
    _getData: function () {
        return this.data;
    }
};

function initDaysLeft(block, options) {
    var timer = [];
    $(block).each(function (index, item) {
        timer[index] = new DaysLeft();
        timer[index].createElement(this, options);
        timer[index].drawElement();
    });
}

// Init days left
(function () {
    // initialize
    //try {

    var dayBlocks = document.querySelectorAll('.show-timer');
    if (dayBlocks) {
        // change initDaysLeft settings
        if ($('body').hasClass('inverse') || $('body').hasClass('color_bg') || $('body').hasClass('gradient_bg')) {
            initDaysLeft(
                dayBlocks, {
                    width: 146, // width element
                    height: 122, // height element
                    duration: 2000, // duration animation
                    time: 500, // duration delay
                    numberColor: 'rgba(0,0,0,1)', // color of Number
                    numberFont: '30px Abel', // font
                    textColor: 'rgba(0,0,0,0.5)',
                    textFont: '18px Abel',
                    data: "August 04, 2016", // YOUR DATA
                    text: 'DAYS LEFT', // text
                    lineColor: 'rgba(0,0,0,0.5)'
                }
            );
        } else {
            initDaysLeft(
                dayBlocks, {
                    width: 146, // width element
                    height: 122, // height element
                    duration: 2000, // duration animation
                    time: 500, // duration delay
                    numberColor: 'rgba(255,255,255,1)', // color of Number
                    numberFont: '30px Abel', // font
                    textColor: 'rgba(255,255,255,0.5)',
                    textFont: '18px Abel',
                    data: "February 03, 2017", // YOUR DATA
                    text: 'DAYS LEFT', // text
                    lineColor: 'rgba(255,255,255,0.5)'
                }
            );
        }
    }

    var blockquotes = document.querySelectorAll('blockquote');
    if (blockquotes) {

        if ($('body').hasClass('inverse') || $('body').hasClass('color_bg') || $('body').hasClass('gradient_bg')) {
            initDaysLeft(
                blockquotes, {
                    width: 50,
                    height: 50,
                    duration: 2000,
                    time: 1000,
                    numberColor: 'rgba(255,255,255,1)',
                    numberFont: '30px Abel',
                    textColor: 'rgba(255,255,255,0.2)',
                    textFont: ' ',
                    data: "",
                    text: ' ',
                    lineColor: 'rgba(0,0,0,0.5)'
                }
            );
        } else {
            initDaysLeft(
                blockquotes, {
                    width: 50,
                    height: 50,
                    duration: 2000,
                    time: 1000,
                    numberColor: 'rgba(255,255,255,1)',
                    numberFont: '30px Abel',
                    textColor: 'rgba(255,255,255,0.2)',
                    textFont: ' ',
                    data: "",
                    text: ' ',
                    lineColor: 'rgba(255,255,255,0.5)'
                }
            );
        }

    }

    var preload = document.querySelector('.pre-timer');
    if (preload) {

        initDaysLeft(
            preload, {
                width: 150,
                height: 150,
                duration: 1000,
                time: 0,
                numberColor: 'rgba(255,255,255,1)',
                numberFont: '30px Abel',
                textColor: 'rgba(255,255,255,0.2)',
                textFont: ' ',
                data: "",
                text: ' '
            }
        );

    }

    //} catch ( e ) {
    //    throw 'Problem with initialize Timer ' + e;
    //} finally {
    //    return;
    //}
}());

// CHANGE CATEGORY
(function () {
    var changeCategory = function () {
        $('.category-group').parent().find('.info').height('');
        $('.category-group').find('li a').off('click').on('click',
            function (e) {
                e.preventDefault();

                $('#pt-main').css({
                    overflow: 'hidden'
                });

                if ($(this).hasClass('open-map')) {

                    var self = this;
                    var position = $(this).offset();

                    var width = $(this).outerWidth();
                    var height = $(this).outerHeight(true);

                    $('.map').width(width);
                    $('.map').height(height);
                    $('.map').offset({
                        top: position.top,
                        left: position.left
                    });
                    $('.map').addClass('open');
                    $('#map-canvas').css({
                        top: -position.top + 'px',
                        left: -position.left + 'px'
                    });
                    $('#map-canvas').animate({
                        top: 0,
                        left: 0
                    }, 500);
                    $('.map').animate({
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%'
                    }, 500);
                    $('.map').find('.bottom .close-this').off('click').on(
                        'click',
                        function (e) {

                            e.preventDefault();
                            position = $(self).offset();
                            $(this).parent().parent().find('#map-canvas').animate({
                                top: -position.top + 'px',
                                left: -position.left + 'px'
                            }, 500);
                            $(this).parent().parent().animate({
                                left: position.left,
                                top: position.top,
                                width: width,
                                height: height
                            }, 500, function () {
                                $(this).removeClass('open');
                            });
                        }
                    );
                } else {

                    var height = $(this).parent().parent().parent().find('.info.open').outerHeight(true);
                    $(this).parent().parent().parent().find('.info').height('');
                    $(this).parent().parent().find('li').removeClass('active');
                    $(this).parent().addClass('active');
                    var current = $(this).parent().index();
                    var info = $(this).parent().parent().parent().find('.info');
                    $(info).removeClass('open');
                    $(info).eq(current).addClass('open');
                    var tmpHeight = $(info).eq(current).outerHeight(true);
                    $(info).eq(current).height(height);
                    $(info).eq(current).animate({
                        height: tmpHeight
                    }, 300, 'linear', function () {

                    });
                }

                setTimeout(function () {
                    $('#pt-main').css({
                        overflow: ''
                    });
                    RunScrollStyler({
                        element: '#pt-main',
                        //child: '.pt-page-curret'
                    });
                }, 400);

            }
        );
    };

    try {
        changeCategory();

        removeEvent(window, 'resize', resize);
        addEvent(window, 'resize', resize);

    } catch (e) {
        console.log(e);
    } finally {
        return;
    }

    function resize() {
        changeCategory();
    }

}());

// SHOW SUBSCRIBE FORM
(function () {
    $('.subscribe-btn').on(
        'click',
        function (e) {

            e.stopPropagation();

            var self = this;

            $(self).parent().addClass('open');
            $(self).addClass('open');
            $('.subscribe-form').addClass('open');

            $('.subscribe-form').find('.subsubmit').css({
                backgroundColor: ''
            });

            document.forms['subscribe-form'].style.backgroundColor = '';
            //document.forms[ 'subscribe-form' ].style.visibility = 'visible';
            document.forms['subscribe-form']['subscribe'].focus();
            document.forms['subscribe-form']['subscribe'].placeholder = 'ENTER YOUR EMAIL';

            $('body').on(
                'click',
                function (e) {

                    if (e.target.parentNode !== document.forms['subscribe']) {

                        $('.subscribe-form').removeClass('open');
                        $(self).parent().removeClass('open');
                        $(self).removeClass('open');

                    }

                }
            );
        }
    );
}());

// SHOW SOCIAL ICONS IN MAIN MENU
(function () {
    var showSocialIcons = function () {
        $('.navbar_show-icons').off('click').on(
            'click',
            function (e) {
                e.preventDefault();
                e.stopPropagation();

                $(this).toggleClass('active');

                if (this.parentNode.getElementsByClassName('navbar_icons').length) {
                    var ul = this.parentNode.getElementsByClassName('navbar_icons')[0].getElementsByTagName('ul')[0];
                    ul.classList.toggle('open');
                }
                if (this.parentNode.getElementsByTagName('p').length) {
                    var p = this.parentNode.getElementsByTagName('p')[0];
                    p.classList.toggle('open');
                }
                if (this.parentNode.getElementsByTagName('span').length) {
                    var p = this.parentNode.getElementsByTagName('span')[0];
                    p.classList.toggle('open');
                }
                if ($('.center-menu').length) {
                    $('.center-menu').toggleClass('iconOpen');
                }
            }
        );
    };

    $(document).on('click', function () {
        var $navShowIcons = $('.navbar_show-icons');
        $navShowIcons.removeClass('active');
        $navShowIcons.parent().find('.navbar_icons ul').removeClass('open');
        $navShowIcons.parent().find('p').removeClass('open');
        $navShowIcons.parent().find('span').removeClass('open');
        $('.center-menu').removeClass('iconOpen');
    });

    showSocialIcons();

    removeEvent(window, 'resize', resize);
    addEvent(window, 'resize', resize);

    function resize() {
        var $navShowIcons = $('.navbar_show-icons');
        $navShowIcons.removeClass('active');
        $navShowIcons.parent().find('.navbar_icons ul').removeClass('open');
        $navShowIcons.parent().find('p').removeClass('open');
        $navShowIcons.parent().find('span').removeClass('open');
        $('.center-menu').removeClass('iconOpen');
        showSocialIcons();
    }
}());

// COLLAPSED MENU
(function () {
    function collapsedMenu() {
        this.collapsed = false;
        this.elementWidth;
        this.freeWidth;
    }

    collapsedMenu.prototype = {
        collapsing: function () {
            this.elementWidth = $('.navbar-nav').width();
            this.freeWidth = $(window).width() - $('.navbar_share-icons').width() - $('.navbar-brand').width();
            this.collapsed = this.elementWidth > this.freeWidth ? true : false;
            if (this.collapsed) {
                this.hideMenu();
            } else {
                this.showMenu();
            }
        },
        hideMenu: function () {
            $('main').addClass('collapsedMenu');
            $('nav').addClass('collapsed');
            $('.navbar-toggle').css({
                display: 'block'
            });
            this.showCollapsedMenu();
        },
        showMenu: function () {
            $('main').removeClass('collapsedMenu');
            $('nav').removeClass('collapsed');
            $('.navbar-toggle').css({
                display: ''
            });
            $('#navbar').removeClass('small');
            $('nav').removeClass('open');
            $('main').removeClass('collapsedOpen');
        },
        showCollapsedMenu: function () {
            $('.navbar-toggle').off('click').on(
                'click',
                function (e) {

                    e.preventDefault();
                    e.stopPropagation();
                    if (!$('nav').hasClass('open')) {

                        $('nav').addClass('open');
                        $('main').addClass('collapsedOpen');
                        $('ul.nav').find('li').find('a').off('click').on(
                            'click',
                            function (e) {

                                $('nav').removeClass('open');
                                $('main').removeClass('collapsedOpen');
                            }
                        );
                        if ($('ul.nav').find('li').height() * $('ul.nav').find('li').length > $(window).height()) {
                            $('#navbar').addClass('small');
                        }

                    } else if ($('nav').hasClass('open')) {
                        $('#navbar').removeClass('small');
                        $('nav').removeClass('open');
                        $('main').removeClass('collapsedOpen');
                    }

                }
            );
        },
        init: function () {
            var self = this;
            self.collapsing();
        }
    };
    var collaps = new collapsedMenu();
    collaps.init();
    var timer;

    removeEvent(window, 'resize', resize);
    addEvent(window, 'resize', resize);

    function resize() {
        collaps.showMenu();
        collaps.collapsing();
    }
}());

// FUNCTION GOOGLE MAPS API
(function () {
    var initialize_map = function () {

        try {
            if (!$('.map').length)
                return;

            $('.map').css({
                top: '',
                left: '',
                width: '',
                height: ''
            });

            // customize google map api
            var mapOptions = {
                zoom: 16,
                center: new google.maps.LatLng(51.523751, -0.158435),
                scrollwheel: false,
                panControl: false,
                zoomControl: false,
                scaleControl: true,
                disableDefaultUI: true
            };

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(51.523751, -0.158435),
                title: "Property Location",
                icon: 'img/map-cursor.png'
            });
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            marker.setMap(map);
        } catch (e) {
            console.log('Problem with init google.map ' + e);
        } finally {
            return;
        }
    };

    initialize_map();

    removeEvent(window, 'resize', resize);
    addEvent(window, 'resize', resize);

    var timer;

    function resize() {
        clearTimeout(timer);
        timer = setTimeout(
            function () {
                initialize_map();
            }, 300
        );
    }
}());

// Slider proportional image
function sliderImages() {

    var winWidth = $(window).width();
    var winHeight = $(window).height();

    $('.rslides').find('img').each(
        function (index, item) {

            $(item).width('');
            $(item).height('');
            $(item).css({
                top: '',
                left: ''
            });

            var imgWidth = $(item).width();
            var imgHeight = $(item).height();

            var proportion = imgWidth / imgHeight;

            if (imgWidth < imgHeight) {

                $(item).width(winWidth);
                $(item).height(winWidth / proportion);

                if ($(item).height() > winHeight) {
                    $(item).css({
                        top: -($(item).height() - winHeight) / 2
                    });
                }
            } else {
                $(item).width(winHeight * proportion);
                $(item).height(winHeight);

                if ($(item).width() < winWidth) {
                    $(item).width(winWidth);
                    $(item).height(winWidth / proportion);
                }

                if ($(item).width() > winWidth) {
                    $(item).css({
                        left: -($(item).width() - winWidth) / 2
                    });
                }

                if ($(item).height() > winHeight) {
                    $(item).css({
                        top: -($(item).height() - winHeight) / 2
                    });
                }

            }

        }
    );

}

(function () {
    sliderImages();

    removeEvent(window, 'resize', resize);
    addEvent(window, 'resize', resize);

    //var timer;

    function resize() {
        sliderImages();
    }
}());


// validate email
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

/**
 * Повертає усі елементи, які подані на вхід навколо своєї осі
 * @param array - масив елементів, які потрібно повертати
 * @constructor
 */
function RotateSvgElem(array) {
    this.elements = Array.prototype.slice.call(array, 0);
    this.stop = null;
    this.deg = 0;
    this.length = array.length;
    this.isAnimate = true;
}
RotateSvgElem.prototype = {
    constructor: RotateSvgElem,
    rotate: function () {
        return;
    },
    stopRotate: function () {
        this.isAnimate = false;
    },
    startRotate: function () {
        this.isAnimate = true;
        this.rotate();
    }
};

// ajax
function ajax(method, url, data, callback) {
    if (!method || !url || !data) {
        console.log('Need all arguments: method:post/get, url, data');
        return;
    }
    try {
        console.log(method === 'post');

        if (!method === 'post' || !method === 'get') {
            console.log('Invalid first argument');
            return;
        }

        var xhr = new XMLHttpRequest();

        if (method === 'post') {
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(data);
        } else
        if (method === 'get') {
            xhr.open("GET", url + '?' + data, true);
            xhr.send();
        }

        xhr.onreadystatechange = function () { // (3)
            if (xhr.readyState != 4)
                return;

            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                if (callback)
                    callback(xhr.responseText);
                else
                    alert(xhr.responseText);
            }
        }

    } catch (e) {
        console.log(e);
    } finally {
        return;
    }
}

// hide main, nav
function hideAll() {
    var main = document.querySelector('#pt-main'),
        nav = document.querySelector('.navbar');

    if (main)
        main.className += ' invis';

    if (nav)
        nav.className += ' invis';
}

function showAll() {
    var main = document.querySelector('#pt-main'),
        nav = document.querySelector('.navbar');

    if (main)
        main.className = main.className.replace(' invis', '');

    if (nav)
        nav.className = nav.className.replace(' invis', '');
}

// document is ready
$(document).ready(function () {

    /**
     * run scroll styler
     */
    RunScrollStyler({
        element: '#pt-main'
    });

    // send email
    if (document.forms['subscribe-form']) {
        addEvent(document.forms['subscribe-form']['subscribe'], 'click', function (event) {
            event = event || window.event;
            event.stopPropagation();
        });
        addEvent(document.forms['subscribe-form']['subsubmit'], 'click', function (event) {
            event = event || window.event;
            event.stopPropagation();
        });
    }
    //Notify Me
    $('.notify-me').submit(function (e) {
        var form = $(this),
            message = form.find('.form-message'),
            messageSuccess = 'Your email is sended',
            messageInvalid = 'Please enter a valid email address',
            messageSigned = 'This email is already signed',
            messageErrore = 'Error request';

        e.preventDefault();

        var self = this;

        var value = this.querySelector('.submail').value;

        this.querySelector('.submail').focus();

        if (value.length <= 0 || !validateEmail(value)) {
            self.style.backgroundColor = 'rgba(245, 0, 87, 0.5)';
            self.parentNode.querySelector('.submail').placeholder = 'ENTER VALID EMAIL';
            return;
        }

        self.style.backgroundColor = 'rgba(162, 255, 0, 0.5)';

        $.ajax({
            url: 'php/notify-me.php',
            type: 'POST',
            data: form.serialize(),
            success: function (data) {
                form.find('.btn').prop('disabled', true);

                message.removeClass('text-danger').removeClass('text-success').fadeIn();

                switch (data) {
                case 0:
                    self['subscribe'].placeholder = 'ENTER YOUR EMAIL';
                    message.html(messageSuccess).addClass('text-success').fadeIn();
                    setTimeout(function () {
                        form.trigger('reset');
                        message.fadeOut().delay(500).queue(function () {
                            message.html('').dequeue();
                            self.style.backgroundColor = '';
                        });
                    }, 1000);
                    break;
                case 1:
                    self.style.backgroundColor = 'rgba(245, 0, 87, 0.5)';
                    setTimeout(function () {
                        self.style.backgroundColor = '';
                    }, 1000);
                    break;
                default:
                    message.html(messageErrore).addClass('text-danger').fadeIn();
                    self.style.backgroundColor = 'rgba(245, 0, 87, 0.5)';
                    setTimeout(function () {
                        self.style.backgroundColor = '';
                    }, 1000);
                }

                form.find('.btn').prop('disabled', false);
            }
        });

    });

    /**
     * run ElastiStack
     */
    initElastiStack();

    /**
     * run clip canvas
     */
    runClipCanvas();

    /**
     * style select list
     */
    $("select")
        .selectmenu({
            width: '100%'
        }).selectmenu("menuWidget")
        .addClass("overflow");

    /**
     * Event for select list
     */
    var selectIsClick = false;
    var select = document.querySelectorAll('.ui-selectmenu-button');
    for (var i = 0; i < select.length; i++) {
        addEvent(
            select[i], 'click',
            function (e) {
                e = e || window.Event;
                e.stopPropagation();

                selectIsClick = true;
                RunScrollStyler({
                    element: '#pt-main'
                });
                addEvent(
                    document.body, 'click',
                    function () {
                        if (selectIsClick) {
                            RunScrollStyler({
                                element: '#pt-main'
                            });
                            selectIsClick = false;
                        }
                    }
                );
            }
        );
    }

    // hide timer, main, nav
    hideAll();

});

//var rotateSvgElem;

/**
 * Уся сторінка завантажена
 */
$(window).load(
    function () {

        try {
            /**
             * try load preloader svg
             * if some poblem with load svg,
             * console log error
             * adn go to block finally
             */
            // var pre       = document.querySelector( '.genesisPreloader' );
            // if( pre ) {
            // var svgDoc    = pre.getSVGDocument();
            // var g10 = svgDoc.querySelector( '#g10' );
            // g10.setAttribute( 'filter', 'url(#f1)' );
            // }

        } catch (e) {
            console.log(e);
        } finally {
            // show main, nav
            sliderImages();
            /**
             * responsive slider
             */
            $(".rslides").responsiveSlides({
                auto: true, // Boolean: Animate automatically, true or false
                speed: 1000, // Integer: Speed of the transition, in milliseconds
                timeout: 4000, // Integer: Time between slide transitions, in milliseconds
                pager: false, // Boolean: Show pager, true or false
                nav: false, // Boolean: Show navigation, true or false
                random: false, // Boolean: Randomize the order of the slides, true or false
                pause: false, // Boolean: Pause on hover, true or false
                pauseControls: true // Boolean: Pause when hovering controls, true or false
            });

            showAll();
        }

    }
);
