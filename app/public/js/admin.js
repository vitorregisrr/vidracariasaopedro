$(document).ready(function () {
    //starting lazy load
    $('img.lazy').lazyload();

    if ($('#editor-rich').length ) {
        var toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'], // custom dropdow
            ['blockquote', 'code-block'],

            [{
                'header': 1
            }, {
                'header': 2
            }], // custom button values
            [{
                'list': 'ordered'
            }, {
                'list': 'bullet'
            }],
            [{
                'script': 'sub'
            }, {
                'script': 'super'
            }], // superscript/subscript
            [{
                'indent': '-1'
            }, {
                'indent': '+1'
            }], // outdent/indent
            [{
                'direction': 'rtl'
            }], // text direction

            [{
                'align': []
            }],

            ['image', 'clean'] // remove formatting button
        ];

        const editor = new Quill('#editor-rich', {
            modules: {
                toolbar: toolbarOptions
            },
            placeholder: 'Compose an epic...',
            theme: 'snow'
        });

        const deltastore = $('#editor-rich').data('deltastore');

        if ($(deltastore).val()) {
            try {
                editor.setContents(JSON.parse($(deltastore).val()));
            } catch {
                console.log('Não foi possível parsear o conteúdo existente da notícia.')
            }
        }

        editor.on('text-change', function (delta, oldDelta, source) {
            $(deltastore).val(JSON.stringify(editor.getContents()));
        });
    }
    
});