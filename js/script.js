'use strict';

window.addEventListener('DOMContentLoaded', () => {

  // Preloader

  window.onload = function () {
    setTimeout(() => {
      let preloader = document.querySelector('#preloader');
      if (!preloader.classList.contains('done')) {
        preloader.classList.add('done');
      }
    }, 1000);
  };

  // Header-burger

  let headerBurger = document.querySelector('#check-menu'),
    labelBurger = document.querySelector('#check-label'),
    headerBurgerMenu = document.querySelector('.header-burger__menu');

  document.addEventListener('click', (e) => {
    if (e.target !== headerBurgerMenu && e.target !== headerBurger && e.target !== labelBurger) {
      headerBurger.checked = false;
    }
  });

  // Header

  (function () {
    window.addEventListener("scroll", () => {
      let header = document.querySelector('header');
      header.classList.toggle("sticky", window.scrollY > 0);
    });
  })();

  // Masonry

  let grid = document.querySelector('.grid');

  let msnry = new Masonry(grid, {
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
  });

  imagesLoaded(grid).on('progress', function () {
    // layout Masonry after each image loads
    msnry.layout();
  });

  // Slick slider

  $(document).ready(function () {
    $('.reviews__slider').slick({
      arrows: false,
      fade: true
    });

    $('.reviews__controls-prev').click(function () {
      $('.reviews__slider').slick('slickPrev');
    });
    $('.reviews__controls-next').click(function () {
      $('.reviews__slider').slick('slickNext');
    });
  });

  // Smooth scroll

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Scroll top

  (function () {
    window.addEventListener("scroll", () => {
      let scrollTop = document.querySelector('.scroll-top');
      scrollTop.classList.toggle("scroll-topUp", window.scrollY > 500);
    });
  })();

  // Slider counter

  function slider({
    slide,
    nextArrow,
    prevArrow,
    totalCounter,
    currentCounter
  }) {
    const slides = document.querySelectorAll(slide),
      prev = document.querySelector(prevArrow),
      next = document.querySelector(nextArrow),
      total = document.querySelector(totalCounter),
      current = document.querySelector(currentCounter);

    let slideIndex = 1;

    if (slides.length < 10) {
      total.textContent = `0${slides.length}`;
      current.textContent = `0${slideIndex}`;
    } else {
      total.textContent = slides.length;
      current.textContent = slideIndex;
    }

    next.addEventListener('click', () => {

      if (slideIndex == slides.length) {
        slideIndex = 1;
      } else {
        slideIndex++;
      }

      if (slides.length < 10) {
        current.textContent = `0${slideIndex}`;
      } else {
        current.textContent = slideIndex;
      }

    });

    prev.addEventListener('click', () => {

      if (slideIndex == 1) {
        slideIndex = slides.length;
      } else {
        slideIndex--;
      }

      if (slides.length < 10) {
        current.textContent = `0${slideIndex}`;
      } else {
        current.textContent = slideIndex;
      }
    });
  }

  slider({
    nextArrow: '.trainers__arrows-next',
    prevArrow: '.trainers__arrows-prev',
    slide: '.trainers__slide-photo',
    totalCounter: '#total',
    currentCounter: '#current'
  });

  // Slick slider (trainers block)

  $(window).ready(function() {
    $('.trainers__slider-text').slick({
      arrows: false,
      fade: true,
      waitForAnimate: false,
      draggable: false,
      swipe: false,
      asNavFor: '.trainers__slider-photo'
    });

    $('.trainers__slider-photo').slick({
      arrows: false,
      fade: true,
      waitForAnimate: false,
      draggable: false,
      swipe: false,
      asNavFor: '.trainers__slider-text'
    });

    $('.trainers__arrows-prev').click(function () {
      $('.trainers__slider-text').slick('slickPrev');
    });
    $('.trainers__arrows-next').click(function () {
      $('.trainers__slider-text').slick('slickNext');
    });
  });

  // Forms
  function forms() {

    const discountsForm = document.querySelector('.discounts__form'),
      contactsForm = document.querySelector('.contacts__form');

    const message = {
      success: 'Спасибо! Мы скоро свяжемся с Вами',
      failure: 'Что-то пошло не так...'
    };

    bindPostData(discountsForm, '.discounts__form');
    bindPostData(contactsForm, '.contacts__form');

    let input = document.querySelectorAll('input');

    input.forEach(item => {
      item.addEventListener('input', () => {
        if (item.value !== '') {
          item.style.borderBottom = '1px solid #D2D2D2';
        } else {
          item.style.borderBottom = '1px solid red';
        }

        if (!item.value.match(/(?:\+|\d)[\d\-\(\) ]\d/g) && item.classList.contains('contact-phone')) {
          item.style.borderBottom = '1px solid red';
        }
      });
    });

    const postData = async (url, data) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: data
      });
      if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }
      return await res.json();
    };

    function bindPostData(form, parentSelector) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        let name = document.querySelector(`${parentSelector} .contact-name`),
          phone = document.querySelector(`${parentSelector} .contact-phone`);

        const formData = new FormData(form);
        const json = JSON.stringify(Object.fromEntries(formData.entries()));

        if (name.value !== '' && phone.value !== '') {
          postData('http://localhost:3000/posts', json)
            .then(data => {
              console.log(data);
              showThanksModal(message.success);
            })
            .catch(err => {
              console.error(err);
              showThanksModal(message.failure);
            })
            .finally(() => {
              form.reset();
            });
        } else if (name.value == '' && phone.value == '') {
          name.style.borderBottom = '1px solid red';
          phone.style.borderBottom = '1px solid red';
        } else if (name.value == '') {
          name.style.borderBottom = '1px solid red';
        } else if (phone.value == '') {
          phone.style.borderBottom = '1px solid red';
        }
      });
    }

    function showThanksModal(message) {
      const prevModalDialog = document.querySelector('.modal');
      const modalContent = document.querySelector('.modal__content');
      prevModalDialog.classList.add('show');
      modalContent.textContent = `${message}`;

      setTimeout(() => {
        prevModalDialog.classList.add('hide');
        prevModalDialog.classList.remove('show');
      }, 3000);
    }
  }

  forms();

});

/*! WOW - v1.1.3 - 2016-05-06
 * Copyright (c) 2016 Matthieu Aussaguel;*/
(function () {
  var a, b, c, d, e, f = function (a, b) {
      return function () {
        return a.apply(b, arguments)
      }
    },
    g = [].indexOf || function (a) {
      for (var b = 0, c = this.length; c > b; b++)
        if (b in this && this[b] === a) return b;
      return -1
    };
  b = function () {
    function a() {}
    return a.prototype.extend = function (a, b) {
      var c, d;
      for (c in b) d = b[c], null == a[c] && (a[c] = d);
      return a
    }, a.prototype.isMobile = function (a) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)
    }, a.prototype.createEvent = function (a, b, c, d) {
      var e;
      return null == b && (b = !1), null == c && (c = !1), null == d && (d = null), null != document.createEvent ? (e = document.createEvent("CustomEvent"), e.initCustomEvent(a, b, c, d)) : null != document.createEventObject ? (e = document.createEventObject(), e.eventType = a) : e.eventName = a, e
    }, a.prototype.emitEvent = function (a, b) {
      return null != a.dispatchEvent ? a.dispatchEvent(b) : b in (null != a) ? a[b]() : "on" + b in (null != a) ? a["on" + b]() : void 0
    }, a.prototype.addEvent = function (a, b, c) {
      return null != a.addEventListener ? a.addEventListener(b, c, !1) : null != a.attachEvent ? a.attachEvent("on" + b, c) : a[b] = c
    }, a.prototype.removeEvent = function (a, b, c) {
      return null != a.removeEventListener ? a.removeEventListener(b, c, !1) : null != a.detachEvent ? a.detachEvent("on" + b, c) : delete a[b]
    }, a.prototype.innerHeight = function () {
      return "innerHeight" in window ? window.innerHeight : document.documentElement.clientHeight
    }, a
  }(), c = this.WeakMap || this.MozWeakMap || (c = function () {
    function a() {
      this.keys = [], this.values = []
    }
    return a.prototype.get = function (a) {
      var b, c, d, e, f;
      for (f = this.keys, b = d = 0, e = f.length; e > d; b = ++d)
        if (c = f[b], c === a) return this.values[b]
    }, a.prototype.set = function (a, b) {
      var c, d, e, f, g;
      for (g = this.keys, c = e = 0, f = g.length; f > e; c = ++e)
        if (d = g[c], d === a) return void(this.values[c] = b);
      return this.keys.push(a), this.values.push(b)
    }, a
  }()), a = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (a = function () {
    function a() {
      "undefined" != typeof console && null !== console && console.warn("MutationObserver is not supported by your browser."), "undefined" != typeof console && null !== console && console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.")
    }
    return a.notSupported = !0, a.prototype.observe = function () {}, a
  }()), d = this.getComputedStyle || function (a, b) {
    return this.getPropertyValue = function (b) {
      var c;
      return "float" === b && (b = "styleFloat"), e.test(b) && b.replace(e, function (a, b) {
        return b.toUpperCase()
      }), (null != (c = a.currentStyle) ? c[b] : void 0) || null
    }, this
  }, e = /(\-([a-z]){1})/g, this.WOW = function () {
    function e(a) {
      null == a && (a = {}), this.scrollCallback = f(this.scrollCallback, this), this.scrollHandler = f(this.scrollHandler, this), this.resetAnimation = f(this.resetAnimation, this), this.start = f(this.start, this), this.scrolled = !0, this.config = this.util().extend(a, this.defaults), null != a.scrollContainer && (this.config.scrollContainer = document.querySelector(a.scrollContainer)), this.animationNameCache = new c, this.wowEvent = this.util().createEvent(this.config.boxClass)
    }
    return e.prototype.defaults = {
      boxClass: "wow",
      animateClass: "animated",
      offset: 0,
      mobile: !0,
      live: !0,
      callback: null,
      scrollContainer: null
    }, e.prototype.init = function () {
      var a;
      return this.element = window.document.documentElement, "interactive" === (a = document.readyState) || "complete" === a ? this.start() : this.util().addEvent(document, "DOMContentLoaded", this.start), this.finished = []
    }, e.prototype.start = function () {
      var b, c, d, e;
      if (this.stopped = !1, this.boxes = function () {
          var a, c, d, e;
          for (d = this.element.querySelectorAll("." + this.config.boxClass), e = [], a = 0, c = d.length; c > a; a++) b = d[a], e.push(b);
          return e
        }.call(this), this.all = function () {
          var a, c, d, e;
          for (d = this.boxes, e = [], a = 0, c = d.length; c > a; a++) b = d[a], e.push(b);
          return e
        }.call(this), this.boxes.length)
        if (this.disabled()) this.resetStyle();
        else
          for (e = this.boxes, c = 0, d = e.length; d > c; c++) b = e[c], this.applyStyle(b, !0);
      return this.disabled() || (this.util().addEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler), this.util().addEvent(window, "resize", this.scrollHandler), this.interval = setInterval(this.scrollCallback, 50)), this.config.live ? new a(function (a) {
        return function (b) {
          var c, d, e, f, g;
          for (g = [], c = 0, d = b.length; d > c; c++) f = b[c], g.push(function () {
            var a, b, c, d;
            for (c = f.addedNodes || [], d = [], a = 0, b = c.length; b > a; a++) e = c[a], d.push(this.doSync(e));
            return d
          }.call(a));
          return g
        }
      }(this)).observe(document.body, {
        childList: !0,
        subtree: !0
      }) : void 0
    }, e.prototype.stop = function () {
      return this.stopped = !0, this.util().removeEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler), this.util().removeEvent(window, "resize", this.scrollHandler), null != this.interval ? clearInterval(this.interval) : void 0
    }, e.prototype.sync = function (b) {
      return a.notSupported ? this.doSync(this.element) : void 0
    }, e.prototype.doSync = function (a) {
      var b, c, d, e, f;
      if (null == a && (a = this.element), 1 === a.nodeType) {
        for (a = a.parentNode || a, e = a.querySelectorAll("." + this.config.boxClass), f = [], c = 0, d = e.length; d > c; c++) b = e[c], g.call(this.all, b) < 0 ? (this.boxes.push(b), this.all.push(b), this.stopped || this.disabled() ? this.resetStyle() : this.applyStyle(b, !0), f.push(this.scrolled = !0)) : f.push(void 0);
        return f
      }
    }, e.prototype.show = function (a) {
      return this.applyStyle(a), a.className = a.className + " " + this.config.animateClass, null != this.config.callback && this.config.callback(a), this.util().emitEvent(a, this.wowEvent), this.util().addEvent(a, "animationend", this.resetAnimation), this.util().addEvent(a, "oanimationend", this.resetAnimation), this.util().addEvent(a, "webkitAnimationEnd", this.resetAnimation), this.util().addEvent(a, "MSAnimationEnd", this.resetAnimation), a
    }, e.prototype.applyStyle = function (a, b) {
      var c, d, e;
      return d = a.getAttribute("data-wow-duration"), c = a.getAttribute("data-wow-delay"), e = a.getAttribute("data-wow-iteration"), this.animate(function (f) {
        return function () {
          return f.customStyle(a, b, d, c, e)
        }
      }(this))
    }, e.prototype.animate = function () {
      return "requestAnimationFrame" in window ? function (a) {
        return window.requestAnimationFrame(a)
      } : function (a) {
        return a()
      }
    }(), e.prototype.resetStyle = function () {
      var a, b, c, d, e;
      for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) a = d[b], e.push(a.style.visibility = "visible");
      return e
    }, e.prototype.resetAnimation = function (a) {
      var b;
      return a.type.toLowerCase().indexOf("animationend") >= 0 ? (b = a.target || a.srcElement, b.className = b.className.replace(this.config.animateClass, "").trim()) : void 0
    }, e.prototype.customStyle = function (a, b, c, d, e) {
      return b && this.cacheAnimationName(a), a.style.visibility = b ? "hidden" : "visible", c && this.vendorSet(a.style, {
        animationDuration: c
      }), d && this.vendorSet(a.style, {
        animationDelay: d
      }), e && this.vendorSet(a.style, {
        animationIterationCount: e
      }), this.vendorSet(a.style, {
        animationName: b ? "none" : this.cachedAnimationName(a)
      }), a
    }, e.prototype.vendors = ["moz", "webkit"], e.prototype.vendorSet = function (a, b) {
      var c, d, e, f;
      d = [];
      for (c in b) e = b[c], a["" + c] = e, d.push(function () {
        var b, d, g, h;
        for (g = this.vendors, h = [], b = 0, d = g.length; d > b; b++) f = g[b], h.push(a["" + f + c.charAt(0).toUpperCase() + c.substr(1)] = e);
        return h
      }.call(this));
      return d
    }, e.prototype.vendorCSS = function (a, b) {
      var c, e, f, g, h, i;
      for (h = d(a), g = h.getPropertyCSSValue(b), f = this.vendors, c = 0, e = f.length; e > c; c++) i = f[c], g = g || h.getPropertyCSSValue("-" + i + "-" + b);
      return g
    }, e.prototype.animationName = function (a) {
      var b;
      try {
        b = this.vendorCSS(a, "animation-name").cssText
      } catch (c) {
        b = d(a).getPropertyValue("animation-name")
      }
      return "none" === b ? "" : b
    }, e.prototype.cacheAnimationName = function (a) {
      return this.animationNameCache.set(a, this.animationName(a))
    }, e.prototype.cachedAnimationName = function (a) {
      return this.animationNameCache.get(a)
    }, e.prototype.scrollHandler = function () {
      return this.scrolled = !0
    }, e.prototype.scrollCallback = function () {
      var a;
      return !this.scrolled || (this.scrolled = !1, this.boxes = function () {
        var b, c, d, e;
        for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) a = d[b], a && (this.isVisible(a) ? this.show(a) : e.push(a));
        return e
      }.call(this), this.boxes.length || this.config.live) ? void 0 : this.stop()
    }, e.prototype.offsetTop = function (a) {
      for (var b; void 0 === a.offsetTop;) a = a.parentNode;
      for (b = a.offsetTop; a = a.offsetParent;) b += a.offsetTop;
      return b
    }, e.prototype.isVisible = function (a) {
      var b, c, d, e, f;
      return c = a.getAttribute("data-wow-offset") || this.config.offset, f = this.config.scrollContainer && this.config.scrollContainer.scrollTop || window.pageYOffset, e = f + Math.min(this.element.clientHeight, this.util().innerHeight()) - c, d = this.offsetTop(a), b = d + a.clientHeight, e >= d && b >= f
    }, e.prototype.util = function () {
      return null != this._util ? this._util : this._util = new b
    }, e.prototype.disabled = function () {
      return !this.config.mobile && this.util().isMobile(navigator.userAgent)
    }, e
  }()
}).call(this);
let wow = new WOW;
wow.init();