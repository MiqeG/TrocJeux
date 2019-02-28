$(document).ready(function () {


    $('.ui.form.mdpsecure')
      .form({
        on: 'blur',
        fields: {
  
        
          MotDePasse: {
            identifier: 'MotDePasse',
            rules: [
              {
                type: 'empty',
                prompt: 'Veuillez entrer un mot de passe'
              },
              {
                type: 'regExp[^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#$^+=!*()@%&]).{8,10}$]',
                prompt: 'Veuillez entrer un mot de passe valide, minimum 8 caractères,une minuscule,une majuscule,un chiffre et un caractère spécial'
              },
              {
                type: 'maxLength[40]',
                prompt: "Mot de passe maximum 40 caractères"
              }
  
            ]
          },
          VerificationMotDePasse: {
            identifier: 'VerificationMotDePasse',
            rules: [
              {
                type: 'match[MotDePasse]',
                prompt: 'Le mot de passe est différent'
              },
              {
                type: 'empty',
                prompt: 'Veuillez vérifier votre mot de passe'
              }
            ]
          },
        }
      })
    })