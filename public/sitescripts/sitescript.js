{
    $(document).ready(function () {
     
       


    
        if ($('#sessionFlash').length) {

            $('#inscriptionmodal').modal('show')
        }
        $('#Pays').change(function () {
            $('.unhide').fadeIn(400)
        })
        if ($('#PaysTexte').text() != '') {
            console.log($('#PaysTexte').text())
            $('.unhide').fadeIn(400)
        }
        $('.toggler1').click(function () {
            $('.togglerClass2').hide()
            $('.togglerClass1').fadeIn(400)
        })
        $('.toggler2').click(function () {
            $('.togglerClass1').hide()
            $('.togglerClass2').fadeIn(400)
        })
        $('.demo.items .image img')
            .visibility({
                type: 'image',
                transition: 'fade in',
                duration: 1000
            })
            ;
        $(".openbtn").on("click", function () {
            $(".ui.sidebar").toggleClass("very thin icon");
            $(".asd").toggleClass("marginlefting");
            $(".sidebar z").toggleClass("displaynone");
            $(".ui.accordion.sidebarpage").toggleClass("displaynone");
            $(".ui.dropdown.item").toggleClass("displayblock");

            $(".logo").find('img').toggle();

        })
        $('.demo.sidebar')
            .sidebar('setting', 'transition', 'overlay')
            .sidebar('toggle')
            ;
        $(".ui.dropdown").dropdown({
            allowCategorySelection: true,
            transition: "fade up",
            context: 'sidebar',
            on: "hover"
        });

        $('.ui.accordion').accordion({
            selector: {

            }
        });
        ;
        $('.ui.dropdown')
            .dropdown()
        $('.ui.top.attached.tabular.menu')
            .on('click', '.item', function () {
                if (!$(this).hasClass('dropdown')) {
                    $(this)
                        .addClass('active')
                        .siblings('.item')
                        .removeClass('active');
                }
            });


        $('.Connexion').click(function () {
            $('#connexionmodal').modal('show')

        })
        $('.modalshow').click(function () {
            $('.ui.basic.modal.annoncemodal').modal('show')

        })

$('#headerSearchBar').attr('placeholder','Recherche par '+$('.item.searchOption.active.selected').html())
        $('.LogOut').click(function () {
            window.location.href = '/logout'
        })
        $('.ui.search')
            .search({
                apiSettings: {
                    url: 'searchapi/?q={query}'+'&t='+$('.item.searchOption.active.selected').attr('data-option')
                },
                fields: {
                    results: 'results',
                    title: 'titre',
                    url: 'url',
                    image: 'image',
                    price: "localisation",

                    description: 'categorie'

                },
                minCharacters: 3,
                maxResults:10,

            })
            ;
    });

}