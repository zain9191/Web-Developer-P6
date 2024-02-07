const Sauce = require('../models/sauce');
const fs = require ('fs');




  //************* get all suaces ***********************************/
  exports.getAllSauces = (req, res, next) => {
    Sauce.find()
   .then((sauce) => {res.status(200).json(sauce);})
   .catch((error) => { res.status(400).json({ error: error});});
 }

//***************** get one at a time ***********************************/
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {res.status(200).json(sauce);})
    .catch((error) => {res.status(404).json({error: error});
  });
  }



  //********** add new sauce ****************************************/
exports.createSauce = (req, res, next) => {
    try {
        console.log("Trying...");
        const sauceObject = JSON.parse(req.body.sauce);
        delete sauceObject._id;
        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });

        sauce.save()
            .then(() => {
                res.status(201).json({ message: 'Sauce added successfully!' });

            })
            .catch((error) => {


                let errorMessage = 'Failed to add sauce.';
                if (error && error.message) {

                    errorMessage = error.message;
                }
                res.status(400).json({ error: errorMessage });
            });
    } catch (parseError) {
        console.log("00000000000000000000000000000")

        res.status(400).json({ error: 'Invalid sauce data format.' });
    }
};
//******************* delete sauce ****************************************/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];


        fs.unlink(`/images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'sauce supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
        
      })
      .catch(error => res.status(500).json({ error }));
};

//************************ modify sauce  *****************************/

// exports.modifySauce = (req, res, next) => {
//     const sauceObject = req.file ?
//     { 
//         ...JSON.parse(req.body.sauce),
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     } : { ...req.body };

//     Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id })
//         .then(() => {
//             res.status(201).json({message: 'sauce modified!'});
//         })
//         .catch(error => {
//             res.status(400).json({error: error});
//         });
// };


exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let oldImageUrl = null;

            if (sauce) {
                oldImageUrl = sauce.imageUrl;
            }

            const sauceObject = req.file ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body };

            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => {
                    if (req.file && oldImageUrl) {
                        // Delete the old image file
                        let filename = oldImageUrl.split('/images/')[1]; // Get the filename from the URL
                       
                        fs.unlink(`src/assets/images/${filename}`, (err) => {
                            if (err) {
                                console.error('Error deleting old image:', err);
                            } else {
                                console.log('Old image deleted:', filename);
                            }
                        });
                    }
                    res.status(201).json({ message: 'Sauce modified!' });
                })
                .catch(error => {
                    res.status(400).json({ error: error });
                });
        })
        .catch(error => {
            res.status(500).json({ error: error });
        });
};
