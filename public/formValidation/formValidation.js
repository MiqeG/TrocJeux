$(document).ready(function () {


  $('.ui.form')
    .form({
      on: 'blur',
      fields: {

        NomUtilisateur: {
          identifier: 'NomUitilisateur',
          rules: [
            {
              type: 'regExp[^[-A-ZÀ-Ýa-zà-ý0-9@\.+_]+$]',
              prompt: "Nom d'utilisateur: les espaces ne sont pas autorisés"
            },
            {
              type: 'maxLength[20]',
              prompt: "Nom d'utilisateur maximum 20 caractères"
            },
            {
              type: 'minLength[4]',
              prompt: "Nom d'utilisateur minimum 4 caractères"
            },
            {
              type: 'empty',
              prompt: "Veuillez entrer un nom d'utilisateur"
            }
          ]
        },
        Nom: {
          identifier: 'Nom',
          rules: [
            {
              type: 'regExp[^[A-ZÀ-Ýa-zà-ý\/-]*$]',
              prompt: "Veuillez entrer un nom valide, les espaces ne sont pas autorisés"
            },
            {
              type: 'maxLength[35]',
              prompt: "Nom maximum 35 caractères"
            },
            {
              type: 'minLength[2]',
              prompt: "Nom minimum 2 caractères"
            },
           
            {
              type: 'empty',
              prompt: 'Veuillez entrer un nom'
            }
          ]
        },
        Prenom: {
          identifier: 'Prenom',
          rules: [
            {
              type: 'regExp[^[A-ZÀ-Ýa-zà-ý\/-]*$]',
              prompt: "Veuillez entrer un prénom valide, les espaces ne sont pas autorisés"
            },
            {
              type: 'maxLength[35]',
              prompt: "Prénom maximum 35 caractères"
            },
            {
              type: 'minLength[2]',
              prompt: "Prénom minimum 2 caractères"
            },
            {
              type: 'empty',
              prompt: 'Veuillez entrer un prénom'
            },
           
          ]
        },
        Email: {
          identifier: 'Email',
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
        Adresse: {
          identifier: 'Adresse',
          rules: [
            {
              type: "regExp[^[A-ZÀ-Ýa-zà-ý0-9\/,\/'\/-\/ ]+$]",
              prompt: "Veuillez entrer une adresse valide, seuls les espaces et , - ' sont autorisés"
            },
            {
              type: 'minLength[5]',
              prompt: 'Veuillez entrer une adresse valide'
            },
            {
              type: 'maxLength[400]',
              prompt: 'Adresse maximum 400 caractères'
            }
          ]
        },
        CodePostal: {
          identifier: 'CodePostal',
          rules: [
            {
              type: 'integer',
              prompt: 'Veuillez entrer un code postal valide'
            },
            {
              type: 'exactLength[5]',
              prompt: 'Veuillez entrer un code postal valide'
            }
          ]
        },
        Ville: {
          identifier: 'Ville',
          rules: [
            {
              type: 'regExp[^[a-zA-Z0-9\/ ]+$]',
              prompt: 'Veuillez entrer une ville valide'
            },
            {
              type: 'maxLength[60]',
              prompt: 'Veuillez entrer une ville valide'
            },
            {
              type: 'minLength[2]',
              prompt: 'Veuillez entrer une ville valide'
            }
          ]
        },
        Pays: {
          identifier: 'Pays',
          rules: [
            {
              type: 'empty',
              prompt: 'Veuilez choisir votre pays'
            }
           
          ]
        },
      }
    })
    function ajaxGO(options){
      $.ajax({
        url: "/ajaxCodePostal",
        type: "get", //send it through get method
        data: { 
          options:options,
         Ville: $("#Ville").val(),
          CodePostal: $("#CodePostal").val(),
          Pays:$("#Pays").val()
        },
        success: function(result) {
          //Do Something
          console.log(result)
          $("#Ville").val(result.Ville);
          $("#CodePostal").val(result.CodePostal);
          
          
        },
        error: function(err) {
         
         console.log('error')
        
        }
      });
    }
    $("#CodePostal").change(function(event){
  ajaxGO('CodePostal')
    });
    $("#Ville").change(function(event){
    ajaxGO('Ville')
    })
});
