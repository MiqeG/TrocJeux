{
    $(document).ready(function () {
        $(function () {

            if ($('#Ville').val() != '') {
                $('#inscriptionSubmit').fadeIn()
            } else {
                $('#inscriptionSubmit').hide()
            }
            $('#deposerform').hide()

            $('.searchCategorie')
                .dropdown({
                    allowAdditions: false,
                    clearable: true,
                    maxSelections: 3,



                })
                $('#frontlogo').click(function(){
                    window.location.href= '/'
                })
              
               
            $('.miniImage').mouseenter(function () {
                $(this).transition('jiggle')
                    ;
            })
            $('.button').mouseenter(function () {
                $(this).transition('pulse')
                    ;
            })
            $('.openbtn').click();
        });


       


        if ($('#sessionFlash').length) {

            $('#inscriptionmodal').modal('show')
        }
        $('#Pays').change(function () {
            $('.unhide').fadeIn(400)
        })
        if ($('#PaysTexte').text() != '') {

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
    

        $('.ui.accordion').accordion({
            selector: {

            }
        });
        ;
        $('.ui.dropdown.sidebardrop')
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
        $('#retourconnexion').click(function () {

            $('#connexionmodal').modal('show')

        })
        $('.reinitialiser').click(function () {
            $('.ui.modal.reinitialise')
                .modal('show')
        })

        $('#headerSearchBar').attr('placeholder', 'Recherche par ' + $('.item.searchOption.active.selected').html())



        $('.LogOut').click(function () {
            window.location.href = '/logout'
        })
        $('.result:first-child').on('error', function () {
            $(this).unbind("error").attr("src", "assets/img/error.gif");
        })
        $('.ui.search.searchapi')
            .search({
                apiSettings: {
                    url: 'searchapi/?q={query}' + '&t=' + $('.item.searchOption.active.selected').attr('data-option')
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
                maxResults: 10,

            })
            ;
        $('.memberbuttons').click(function () {
            $('#selection').attr('data-selection', $(this).attr('data-idannonce'))
        })
        $('.ZoomImage').click(function () {
            $('.ui.basic.modal.ImageModal').modal('show')
            $('#ModalImage').attr('src', $(this).attr('src'))
        })

    })

}