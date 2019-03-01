{
    $(document).ready(function () {
        $(function () {
           if($('#Ville').val()!=''){
               $('#inscriptionSubmit').fadeIn()
           }else{
            $('#inscriptionSubmit').hide()
           }
          $('#deposerform').hide()
          
            $('.searchCategorie')
              .dropdown({
                allowAdditions: false,
                clearable: true,
                maxSelections: 3,
        
        
        
              })
            
           $('.miniImage').mouseenter(function(){
            $(this).transition('jiggle')
          ;
           })
           $('.button').mouseenter(function(){
            $(this).transition('pulse')
          ;
           })
            $('.openbtn').click();
        });
        $(".ui.error.message").bind("DOMNodeInserted",function(){
            $('.ui.form').removeClass('loading');
        });
        $(".ui.error.message").bind("DOMNodeRemoved",function(){
            $('.ui.form').addClass('loading');
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

            $('.coupled.modal').modal({allowMultiple:false})
        $('.Connexion').click(function () {
            $('#connexionmodal').modal('show')

        })
        $('.modalshow').click(function () {
            $('.ui.basic.modal.annoncemodal').modal('show')

        })
        $('#retourconnexion').click(function(){
         
            $('#connexionmodal').modal('show')

        })
            $('.reinitialiser').click(function(){
                $('.ui.modal.reinitialise')
      .modal('show')
        })
      
        $('#headerSearchBar').attr('placeholder', 'Recherche par ' + $('.item.searchOption.active.selected').html())

        

        $('.LogOut').click(function () {
            window.location.href = '/logout'
        })
        $('.result:first-child').on('error',function(){
            $(this).unbind("error").attr("src", "assets/img/error.gif");
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

        //manage loading event on keypress enter and cancel enter key
        document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
  var keyCode = e.keyCode;
  if(keyCode==13&&$('.ui.error.message').is(':visible')) {
 
    $('.ui.form').removeClass('loading')
  } else {
  
  }
}
       $('.modifUserData').click(function(){
      
$('.ui.basic.modal.modifmodal')
  .modal('show')
;
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
            })
        })
    })

}