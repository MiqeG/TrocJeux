$(document).ready(function () {
$('.ui.form')
.form({
  on: 'blur',
  fields: {

    
    Texte: {
      identifier: 'Texte',
      rules: [
       
        {
          type: 'maxLength[400]',
          prompt: "Texte maximum 400 caractères"
        },
        {
          type: 'minLength[10]',
          prompt: "Veuillez saisir minimum 10 caractères de texte d'annonce"
        },

        {
          type: 'empty',
          prompt: 'Veuillez saisir du texte'
        }
      ]
    },
    Titre: {
        identifier: 'Titre',
        rules: [
         
          {
            type: 'maxLength[150]',
            prompt: "Titre maximum 150 caractères"
          },
          {
            type: 'minLength[10]',
            prompt: "Veuillez saisir minimum 10 caractères de Titre d'annonce"
          },
  
          {
            type: 'empty',
            prompt: 'Veuillez saisir un titre'
          }
        ]
      },
   Categorie : {
      identifier: 'Categorie',
      rules: [
  
        {
          type: 'empty',
          prompt: "Veuillez selectionner la catégorie de l'annonce"
        },

      ]
    },

  }
})
});