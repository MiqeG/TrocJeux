module.exports = function (req, res, Annonce) {
    let strRegExPatternUpper = '(?i)' + req.query.q + '(?-i)'
    let searchWithoption

    switch (req.query.t) {
        case '1':
            searchWithoption = {
                $and: [{
                    "$or": [
                        { "Titre": { "$regex": strRegExPatternUpper } }
                    ]
                }, { "Active": true }]
            }
            break;
        case '2':

            searchWithoption = {
                $and: [{
                    "$or": [
                        { Categories: { "$regex": strRegExPatternUpper } }
                    ]
                }, { "Active": true }]
            }
            break
        case '3':
            searchWithoption = {
                $and: [{
                    "$or": [
                        { "CodePostal": req.query.q }, { "Ville": { "$regex": strRegExPatternUpper } }
                    ]
                }, { "Active": true }]
            }
            break
        case '4':
            searchWithoption = {
                $and: [{
                    "$or": [
                        { "NomUitilisateur": req.query.q }
                    ]
                }, { "Active": true }]
            }
            break
        default:
            break
    }

    Annonce.find(searchWithoption, function (err, docs) {
        if (err) throw err
        console.log(docs.length)
        if (docs.length != 0) {


            let results = []
            //for (let index = 0; index < docs.length; index++) {
            for (let index = 0; index < docs.length; index++) {
                let result = {
                    titre: docs[index].Titre,
                    imgsrc: '/pregistered/' + docs[index].User_Id + '/' + docs[index]._id + '/' + docs[index].UserImages[0],
                    localisation: docs[index].Ville + ' ' + docs[index].CodePostal,
                    description: docs[index].Categories,
                    price: docs[index].Categories,
                    categorie: docs[index].Categories,
                    image: '/pregistered/' + docs[index].User_Id + '/' + docs[index]._id + '/' + docs[index].UserImages[0],
                    url: '/?a=' + docs[index]._id

                }
                results.push(result)

            }

            let pathToResults = "/searchresults/?q=" + req.query.q + '&t=' + req.query.t
            let action = { url: pathToResults, text: docs.length + " resultats cliquez pour parcourir" }
            // console.log(results)

            let returnArray = { results: results, action }





            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(returnArray));


        }
    });
}