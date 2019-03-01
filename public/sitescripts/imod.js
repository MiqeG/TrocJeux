$(document).ready(function(){
    $('#NomUitilisateur').addClass('disabled field')
    $('#Nom').addClass('disabled field')
    $('#Prenom').addClass('disabled field')
    $('#Email').addClass('disabled field')
    $('.iform').attr('action','/upduserinfo')
    $('.hidehead').hide()
    $('.whiteclasstitle').css('color','white')
})