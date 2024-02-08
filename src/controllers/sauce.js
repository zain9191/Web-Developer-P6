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
//************************ like sauce  *****************************/

exports.toggleLikeSauce = (req, res, next) => {
    const userId = req.body.userId; 
    const sauceId = req.params.id;
    const likeValue = req.body.like; // This is a number: 1, -1, or 0

    Sauce.findById(sauceId)
        .then(sauce => {
            if (!sauce) {
                return res.status(404).json({ message: 'Sauce not found' });
            }

            let update = {};

            switch (likeValue) {
                case 1: // Like
                    // Unlike if already liked 
                    if (sauce.usersLiked.includes(userId)) {
                        update = { $inc: { likes: -1 }, $pull: { usersLiked: userId } };
                    } else {
                        update = {
                            $inc: { likes: 1, dislikes: sauce.usersDisliked.includes(userId) ? -1 : 0 },
                            $addToSet: { usersLiked: userId },
                            $pull: { usersDisliked: userId }
                        };
                    }
                    break;
                case -1: // Dislike
                    // Remove dislike if already disliked or switch to dislike from like
                    if (sauce.usersDisliked.includes(userId)) {
                        update = { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } };
                    } else {
                        update = {
                            $inc: { dislikes: 1, likes: sauce.usersLiked.includes(userId) ? -1 : 0 },
                            $addToSet: { usersDisliked: userId },
                            $pull: { usersLiked: userId }
                        };
                    }
                    break;
                case 0: // remove any like or dislike
                    update = {
                        $inc: { likes: sauce.usersLiked.includes(userId) ? -1 : 0, dislikes: sauce.usersDisliked.includes(userId) ? -1 : 0 },
                        $pull: { usersLiked: userId, usersDisliked: userId }
                    };
                    break;
                default:
                    return res.status(400).json({ message: 'Invalid like value' });
            }

            //  update
            return Sauce.updateOne({ _id: sauceId }, update);
        })
        .then(() => res.status(200).json({ message: 'Sauce like/dislike updated successfully' }))
        .catch(error => res.status(500).json({ error: error.message }));
};
