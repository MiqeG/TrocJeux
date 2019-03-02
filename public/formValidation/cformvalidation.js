$(document).ready(function () {
    $('.ui.error.message.div').hide()
    $('#LogIn').click(function(){
        if($('#username').val()==''||$('#password').val()==''){
            $('.ui.error.message.div').show()
            $('.ui.form').removeClass('loading')
        }
        else{
            $('.ui.error.message.div').hide()
            $('.ui.form').addClass('loading')
        }
    })
 
  })