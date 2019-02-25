$(document).ready(function(){
  $('.ui.form.rvalidation')
  .form({
    on: 'blur',
    fields: {
  
      userEmail: {
        identifier: 'userEmail',
        rules: [
          {
            type: 'empty',
            prompt: 'Veuillez entrer un e-mail'
          },
          {
            type: 'email',
            prompt: 'Veuillez entrer un e-mail valide'
          }
        ]
      },
  
    }
  })
})
