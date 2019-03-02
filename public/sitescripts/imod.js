$(document).ready(function () {


    $('.whiteclasstitle').css('color', 'white')

    $('.hiddeniformdiv').hide()
    $('.actualp').show()
    $('#errordiv').hide()
    $('.ajaxloading').click(function () {
        $('#ajaxmdp').addClass('loading')
    })



    $('#mdpajax').click(function () {
        if ($('#actualmdp').val().length < 8) {
            $('#message').text('Veuillez entrer un mot de passe valide!')
            $('#errordiv').show()
            $('#ajaxmdp').removeClass('loading')
            return
        }
        $.ajax({
            url: '/ajaxmdp',
            type: 'POST',
            dataType: 'json',
            data: { Email: $('#Email').val(), Password: $('#actualmdp').val() },
            success: function (data) {
                $('.actualp').hide()
                $('.hiddeniformdiv').fadeIn(400)
                $('#ajaxmdp').removeClass('loading')
                $('#errordiv').hide()

            },
            error: function (err) {

                $('#message').text(err.responseJSON.message)
                $('#errordiv').show()
                $('#ajaxmdp').removeClass('loading')
            }
        })
    })

})