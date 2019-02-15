$(document).ready(function(){
  $('.ui.dropdown')
  .dropdown()

    $('.ui.form')
  .form({
    on: 'blur',
    fields: {
     
      NomUtilisateur: {
        identifier  : 'NomUtilisateur',
        rules: [
            {
                type   : 'maxLength[15]',
                prompt : "Nom d'utilisateur maximum 15 caractères"
              },
              {
                type   : 'minLength[4]',
                prompt : "Nom d'utilisateur minimum 4 caractères"
              },
          {
            type   : 'empty',
            prompt : "Veuillez entrer un nom d'utilisateur"
          }
        ]
      },
      Nom: {
        identifier  : 'Nom',
        rules: [
            {
                type   : 'maxLength[35]',
                prompt : "Nom maximum 35 caractères"
              },
              {
                type   : 'minLength[2]',
                prompt : "Nom minimum 2 caractères"
              },
          {
            type   : 'regExp[^[a-zA-Z]+$]',
            prompt : 'Veuillez entrer un nom valide'
          },
          {
            type   : 'empty',
            prompt : 'Veuillez entrer un nom'
          }
        ]
      },
      Prenom: {
        identifier  : 'Prenom',
        rules: [
            {
                type   : 'maxLength[35]',
                prompt : "Prénom maximum 35 caractères"
              },
              {
                type   : 'minLength[2]',
                prompt : "Prénom minimum 2 caractères"
              },
            {
                type   : 'empty',
                prompt : 'Veuillez entrer un prénom'
              },
              {
                type: 'regExp[^[a-zA-Z]+$]',
                prompt: 'Veuillez entrer un prénom valide'
            },
        ]
      },
      Email: {
        identifier  : 'Email',
        rules: [
          {
            type   : 'empty',
            prompt : 'Veuillez entrer un e-mail'
          },
          {
            type   : 'email',
            prompt : 'Veuillez entrer un e-mail valide'
          }
        ]
      },
      MotDePasse: {
        identifier  : 'MotDePasse',
        rules: [
          {
            type   : 'empty',
            prompt : 'Veuillez entrer un mot de passe'
          },
          {
            type   : 'regExp[^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#$^+=!*()@%&]).{8,10}$]',
            prompt : 'Veuillez entrer un mot de passe valide'
          }
       
        ]
      },
      VerificationMotDePasse: {
        identifier  : 'VerificationMotDePasse',
        rules: [
          {
            type   : 'match[MotDePasse]',
            prompt : 'Le mot de passe est différent'
          },
          {
            type   : 'empty',
            prompt : 'Veuillez vérifier votre mot de passe'
          }
        ]
      },
      Adresse: {
        identifier  : 'Adresse',
        rules: [
          {
            type   : 'minLength[5]',
            prompt : 'Veuillez entrer une adresse valide'
          },
          {
            type   : 'maxLength[400]',
            prompt : 'Adresse maximum 400 caractères'
          }
        ]
      },
      CodePostal: {
        identifier  : 'CodePostal',
        rules: [
          {
            type   : 'integer',
            prompt : 'Veuillez entrer un code postal valide'
          },
          {
              type:'exactLength[5]',
              prompt:'Veuillez entrer un code postal valide'
          }
        ]
      },
      Ville: {
        identifier  : 'Ville',
        rules: [
          {
            type   : 'regExp[^[a-zA-Z]+$]',
            prompt : 'Veuillez entrer une ville valide'
          },
          {
              type:'maxLength[60]',
              prompt:'Veuillez entrer une ville valide'
          },
          {
              type:'minLength[2]',
              prompt:'Veuillez entrer une ville valide'
          }
        ]
      },
     
    }
  })
;
  });
