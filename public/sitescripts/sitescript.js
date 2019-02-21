{
    $(document).ready(function () {
        $(function () {
           
           
            
            $('.openbtn').click();
        });

        $('.formloading').click(function () {
            $('.ui.form').addClass('loading');
        })
        $('.formLoadingMembre').click(function () {
            $('.ui.form.espacemembre').addClass('loading');
            $('.memberbuttons').hide()
        })


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

        $('#headerSearchBar').attr('placeholder', 'Recherche par ' + $('.item.searchOption.active.selected').html())


        $('.LogOut').click(function () {
            window.location.href = '/logout'
        })
        $('.result:first-child').on('error',function(){
            $(this).unbind("error").attr("src", "assets/img/image.png");
        })
        $('.ui.search')
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
       
        $("#Oui").click(function () {



            $.ajax({
                url: '/effacerannonce',
                type: 'POST',
                dataType: 'json',
                data: { _id: $('#selection').attr('data-selection'), User_Id: $('#selection').attr('data-user') },
                success: function (data) {
                    window.location.href = '/espacemembre'
                },
                error: function (err) {
                    alert("Erreur lors de l'effacement");
                    console.log(err)
                    window.location.href = '/espacemembre'

                }
            });
        });
    });

}