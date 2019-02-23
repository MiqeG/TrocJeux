module.exports = function (req, res, SearchVille) {
    let arrayFound = ''
    if (req.query.Pays == '-' || req.query.Pays == '') { req.query.CodePostal = ''; req.query.Ville = '' }
    if (req.query.options == 'CodePostal' && req.query.CodePostal != '') {

        arrayFound = SearchVille.Villes.filter(function (item) {

            return item.CodePostal == req.query.CodePostal;

        });
    }
    else if (req.query.options == 'Ville' && req.query.Ville != '') {

        arrayFound = SearchVille.Villes.filter(function (item) {

            return item.NomCommune == req.query.Ville.toUpperCase();

        });
    }

    if (arrayFound[0] === undefined || arrayFound == '') {

        let json = { Ville: "", Pays: req.query.Pays }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(json));
        return
    }

    let json = { Ville: arrayFound[0].NomCommune, Pays: req.query.Pays, CodePostal: arrayFound[0].CodePostal }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(json));

}