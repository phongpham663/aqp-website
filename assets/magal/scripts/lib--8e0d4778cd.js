;(function (window, document) {
    'use strict';

    const scheduleCallback = function (cb) {
        if (typeof cb !== 'function') return;

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(cb);
        } else {
            setTimeout(cb, 150);
        }
    };

    const ready = function (callback) {
        if (typeof callback !== 'function') return;

        const run = function () {
            scheduleCallback(callback);
        };

        if (document.readyState === 'complete') {
            run();
        } else {
            const onLoad = function () {
                window.removeEventListener('load', onLoad);
                run();
            };
            window.addEventListener('load', onLoad);
        }
    };

    const _ = function (selector, parent) {
        const ctx = parent || document;
        return ctx.querySelector(selector);
    };

    const __ = function (selector, parent) {
        const ctx = parent || document;
        return Array.prototype.slice.call(ctx.querySelectorAll(selector));
    };

    const currHost = function () {
        return window.location.protocol + '//' + window.location.host;
    };

    const isElementXPercentInViewport = function (el, percentVisible) {
        if (!el) return false;

        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        const topVisible = Math.floor(
            100 - (((rect.top >= 0 ? 0 : rect.top) / -rect.height) * 100)
        );
        const bottomVisible = Math.floor(
            100 - (((rect.bottom - windowHeight) / rect.height) * 100)
        );

        return !(topVisible < percentVisible || bottomVisible < percentVisible);
    };

    const animateElems = function (elemInViewport, elemToShow, elemPercentToAppear) {
        if (!elemInViewport) return;

        const run = function () {
            if (!isElementXPercentInViewport(elemInViewport, elemPercentToAppear)) return;

            if (Array.isArray(elemToShow)) {
                elemToShow.forEach(function (elem) {
                    if (elem) elem.classList.add('anim-to-zero');
                });
            } else if (elemToShow) {
                elemToShow.classList.add('anim-to-zero');
            }
        };

        if ('requestAnimationFrame' in window) {
            window.requestAnimationFrame(run);
        } else {
            setTimeout(run, 0);
        }
    };

    const animateValue = function (obj, start = 0, end = null, duration = 3000) {
        if (!obj) return;

        const textStarting = obj.innerHTML;
        const parsedEnd = end != null ? end : parseInt(textStarting.replace(/\D/g, ''), 10);

        if (isNaN(parsedEnd)) return;

        const range = parsedEnd - start;
        if (!range) return;

        const minTimer = 50;
        let stepTime = Math.abs(Math.floor(duration / range));
        stepTime = Math.max(stepTime, minTimer);

        const startTime = Date.now();
        const endTime = startTime + duration;

        const update = function () {
            const now = Date.now();
            const remaining = Math.max((endTime - now) / duration, 0);
            const value = Math.round(parsedEnd - (remaining * range));

            obj.innerHTML = textStarting.replace(/([0-9]+)/g, value);

            if (value === parsedEnd) return false;
            return true;
        };

        const tick = function () {
            const shouldContinue = update();
            if (!shouldContinue) return;
            setTimeout(tick, stepTime);
        };

        scheduleCallback(tick);
    };

    window.ready = ready;
    window._ = _;
    window.__ = __;
    window.currHost = currHost;
    window.isElementXPercentInViewport = isElementXPercentInViewport;
    window.animateElems = animateElems;
    window.animateValue = animateValue;

})(window, document);