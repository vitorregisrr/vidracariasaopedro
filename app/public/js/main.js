(function () {
  'use strict';
  let windowWidth = (window.innerWidth > 0) ?
    window.innerWidth :
    screen.width;

  // Navbar stick event
  $(document).on("scroll", function () {
    if ($(document).scrollTop() > 100) {
      $("#main-header").addClass("shrink");
    } else if (!($(".navbar-collapse").hasClass('show'))) {
      $("#main-header").removeClass("shrink");

    }

  });

  // toggles .stick on medium devices when navbar expanded
  $(".navbar-toggler").click(function () {
    if ($(document).scrollTop() < 100) {
      $("#main-header").toggleClass('shrink');
    }
  })

  //close navbar on mobile when clicked
  $('.navbar-nav>li>a').on('click', function () {
    $('.navbar-collapse').collapse('hide');
  });

  //home index animation on scroll
  const areaToGetScrolled = windowWidth > 576 ?
    300 :
    650;
  $(document).on("scroll", function () {
    if ($(document).scrollTop() > areaToGetScrolled) {
      $("#home").addClass("scrolled");
    } else {
      $("#home").removeClass("scrolled");
    }
  });

  // wow non mobile init
  new WOW({
    boxClass: 'wowNonMobile',
    mobile: false
  }).init();

  //normal wow init
  new WOW().init();

  // Smooth Scroll
  $(document).ready(function () {
    $("a")
      .on('click', function (event) {
        if (this.hash !== "" && $(`a[href="${this.hash}"`).attr('href')[0] === '#') {
          event.preventDefault();

          const offset = this.hash == '#contato' ?
            80 :
            70;
          var hash = this.hash;
          $('html, body').animate({
            scrollTop: $(hash)
              .offset()
              .top - offset
          }, 800, function () {});

        }
      });

    setTimeout(() => {
      if (window.location.hash) {
        $(`a[href="${window.location.hash}"`).click();
      }

    }, 1000);
  });

  //Making collapse groups work
  const myGroup = $('#collapseGroup');
  myGroup.on('show.bs.collapse', '.collapse', function () {
    myGroup
      .find('.collapse.show')
      .collapse('hide');
  });

  //Input type file mask
  $('.media-upload__input').change(function (e) {
    const fileName = e.target.files[0].name;
    $(this)
      .closest('.media-upload')
      .find('.media-upload__text')
      .html(`Imagem selecionada: ${fileName}`);
  });

  //starting bootstrap tooltip
  $('[data-toggle="tooltip"]').tooltip();

  //starting lazy load
  $('.lazy').lazyload();

  //dropdown menu hover
  $('.hover-dropdown').hover(function () {
    $(this)
      .find('.dropdown-menu')
      .stop(true, true)
      .delay(200)
      .fadeIn(500);
  }, function () {
    $(this)
      .find('.dropdown-menu')
      .stop(true, true)
      .delay(200)
      .fadeOut(500);
  });

  //carousel animations
  $('.carousel').on('slide.bs.carousel', function (e) {
    const captions = $(this).find('[data-animated="true"]');
    captions.addClass('animated');
  });

  //Testimonials carousel start
  $('.owl-carousel.testi-list').owlCarousel({
    loop: true,
    nav: true,
    dots: true,
    margin: 20,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        margin: 0,
        stagePadding: 0
      },
      768: {
        items: 2
      },

      1200: {
        items: 3
      }
    }
  })

  //Set nav-link active while scrolling Cache selectors
  const mainNav = $("#main-nav"),
    mainNavHeight = mainNav.outerHeight() + 15,
    // All list items
    menuItems = mainNav.find("a"),
    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function () {
      if ($(this).attr('href')[0] === '#') {
        var item = $($(this).attr("href"));
        if (item.length) {
          return item;
        }
      }
    });

  // Bind to scroll
  $(window).scroll(function () {
    // Get container scroll position
    var fromTop = $(this).scrollTop() + mainNavHeight;

    // Get id of current scroll item
    var cur = scrollItems.map(function (cur) {

      const offset = $(this).attr('id') == 'contato' ?
        80 :
        0;
      if ($(this).offset().top < (fromTop + offset)) {
        return this;
      }
    });
    // Get the id of the current element
    cur = cur[cur.length - 1];
    var id = cur && cur.length ?
      cur[0].id :
      "";
    // Set/remove active class

    if (scrollItems.length > 1) {
      menuItems
        .parent()
        .removeClass("active")
        .end()
        .filter("[href='#" + id + "']")
        .parent()
        .addClass("active");
    }
  });

  //keep params pagination fix
  $("a.keep-params").click(function (e) {
    if (window.location.search && !window.location.search.match(/\?page=\d/)) {
      e.preventDefault(),
        $(this).attr("href", $(this).attr("href").replace("?", "&"));
      var dest = window
        .location
        .search
        .replace(/\&page=\d/g, "") + $(this).attr("href");
      window.setTimeout(function () {
        window.location.href = dest
      }, 100)
    }
  });

  $("#contato form").validate({
    rules: {
      nome: {
        required: true,
        minLength: 5
      },

      email: {
        required: true,
        email: true
      },

      telefone: {
        required: true,
        minlength: 10
      },

      endereco: {
        required: true,
        minlength: 10
      },

      mensagem: {
        required: true,
        minlength: 10
      }
    },

    messages: {
      nome: {
        required: "Parece que você não escreveu seu nome",
        minLength: "Seu nome parece estar incompleto"
      },

      email: {
        required: 'Precisamos saber seu email.',
        email: 'Email inválido.'
      },

      telefone: {
        required: 'Precisamos saber seu telefone.',
      },


      email: {
        required: 'Precisamos saber seu endereço.',
      },


      mensagem: {
        required: "Por favor, escreva uma mensagem!",
        minlength: "Sua mensagem deve ter no mínimo 10 caracteres."
      }
    }
  });

  window.dispatchEvent(new Event('resize'));
})();