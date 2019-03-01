$(document).ready(function(){
    $('.readOl').attr('autocomplete','off')
    $('.readOl').attr('readonly','readonly')
    $('#NomUitilisateur').addClass('disabled field')
    $('#Nom').addClass('disabled field')
    $('#Prenom').addClass('disabled field')
    $('#Email').addClass('disabled field')
    $('.iform').attr('action','/upduserinfo')
    $('.hidehead').hide()
    $('.whiteclasstitle').css('color','white')
    $('#VerificationMotDePasse').val($('#MotDePasse').val())
    $('.hiddeniformdiv').hide()
    $('.actualp').show()
    $('#errordiv').hide()
    $('#updformcontrol').hide()
    $('.changer').change(function(){
        $('#updformcontrol').show()
    })
   
  
    $('#mdpajax').click(function(){
        if($('#actualmdp').val().length<8){
            $('#message').text('Veuillez entrer un mot de passe valide!')
            $('#errordiv').show()
            $('.ui.form').removeClass('loading')
            return
        }
        $.ajax({
            url: '/ajaxmdp',
            type: 'POST',
            dataType: 'json',
            data: { Email: $('#Email').val(),Password: $('#actualmdp').val() },
            success: function (data) {
                $('.actualp').hide()
                $('.hiddeniformdiv').fadeIn(400)
                $('.ui.form').removeClass('loading')
                $('#errordiv').hide()
                $('#inscriptionSubmit').addClass('submit')
            },
            error: function (err) {
               
                $('#message').text(err.responseJSON.message)
              $('#errordiv').show()
                $('.ui.form').removeClass('loading')
            }
        })
    })

})