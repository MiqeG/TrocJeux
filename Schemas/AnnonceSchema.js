module.exports =AnnonceSchema={
    
        Categories: { type: Array, required: true },
        User_Id: { type: String, required: true },
        NomUitilisateur: { type: String, required: true },
        CodePostal: { type: String, required: true },
        Email: { type: String, required: true },
        Ville: { type: String, required: true },
        DatePublication: { type: Date, default: Date.now, required: true },
        Texte: { type: String, required: true },
        Titre: { type: String, required: true },
        UserImages: { type: Array, required: true },
        Active: { type: Boolean, required: true }


    }, { collection: 'Annonces' }

   

    