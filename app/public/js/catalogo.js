(function () {
    'use strict';

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    let current_page = getParameterByName('page') || 1;
    let categoria = getParameterByName('categoria') || 'destaques';
    if (categoria !== 'destaques') {
        $('#catalogFilterContainer .nav-link').removeClass('active');
        $(`#catalogFilterContainer .nav-link[data-filter="${categoria}"]`).addClass('active');
    }
    const page_items = 6;

    const loading = $('#loading');
    const loadMore = () => {
        loading.show();
        fetch(`/api/getProdutos?currPage=${current_page}&page_items=${page_items}&categoria=${categoria}`, {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                data = JSON.parse(data);
                if (data.produtos.length > 0) {
                    data
                        .produtos
                        .forEach(prod => {
                            $('#catalogo-products').append(`
                            <div class="col-12 col-md-6">
                                <article class="produto wow fadeInUp">
                                    <div class="produto__img">
                                        <a href="${prod.imageUrl.secure_url}" data-title="${prod.title}"
                                            data-lightbox="${prod.categoria}">
                                            <img src="/images/loading.gif" data-src="${prod.imageUrl.secure_url}"
                                                class="lazy" alt="${prod.title}">
                                        </a>
                                    </div>
                                    <div class="produto__text">
                                        <h3 class="produto__text__title">${prod.title}</h3>
                                        <p class="produto__text__desc m-0">${prod.description}</p>
                                </article>
                            </div>`);
                        });
                } else {
                    $('#catalogo-products').append(`
                            <div class="col-12 mb-4">
                                <h4 class="inner-title color-main wow fadeIn" style="font-size: 20px;"> Não encotramos projetos para essa categoria :( </h4>
                            </div>`);
                }
                if (!data.has_next) {
                    $('#btnLoadMore').hide();
                }

                if (data.has_next) {
                    $('#btnLoadMore').show();
                }

                $('#catalogo-products .lazy').lazyload();
                loading.hide();
                current_page++;
            })
            .catch(error => {
                console.log(error)
            });
    }

    const btnLoadMore = document.getElementById('btnLoadMore');
    btnLoadMore.addEventListener('click', loadMore);
    loadMore();

    $('#catalogFilterContainer .nav-link').click(function (e) {
        e.preventDefault();
        $('#catalogo-products').html('');
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#catalogo-products").offset().top - 300
        }, 500);
        loading.show();
        current_page = 1;
        categoria = $(this).data('filter');
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        $('#catalogo-products')
            .children('.col-12')
            .fadeOut(300, function () {
                $(this).remove();
            })
        loadMore();
    });

})();