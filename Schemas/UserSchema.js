module.exports=  UserSchema={
    Type: { type: String, required: true },
    NomUitilisateur: { type: String, required: true },
    Nom: { type: String, required: true },
    Prenom: { type: String, required: true },
    Email: { type: String, required: true },
    MotDePasse: { type: String, required: true },
    Adresse: { type: String, required: true },
    CodePostal: { type: Number, required: true },
    Ville: { type: String, required: true },
    Pays: { type: String, required: true },
    DateInscription: { type: Date, default: Date.now, required: true },
    Actif: { type: Boolean, required: true }
  
  
  }, { collection: 'Users' }