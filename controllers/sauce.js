const Sauce = require('../models/sauce');
const fs = require ('fs');


  //************* get all suaces ***********************************/
  exports.getAllSauces = (req, res, next) => {
    Sauce.find()
   .then((sauce) => {res.status(200).json(sauce);})
//    200 Ok
   .catch((error) => next({ status: 500, message: 'Internal Server Error' }));
    // 500 Internal Server Error/ Error getting Sauces


 }

//***************** get one at a time ***********************************/
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({ error: 'Sauce not found' });
                // 404 Not Found/ Sauce not found

            }
            res.status(200).json(sauce);
            // 200 OK/ Returns the requested sauce

        })
        .catch((error) => next({ status: 500, message: 'Internal Server Error' }));
        // 500 Internal Server Error/ Error retrieving sauce
};


  //********** add new sauce ****************************************/
  exports.createSauce = async (req, res, next) => {
    try {
        const sauceObject = JSON.parse(req.body.sauce);
        delete sauceObject._id;

        // Check if the sauce already exists in the database
        const existingSauce = await Sauce.findOne({ name: sauceObject.name });
        if (existingSauce) {

            return res.status(400).json({ message: 'Sauce already exists. Please modify the existing one.' });
            // 400 Bad Request/ Sauce already exists

        }

        // If the sauce doesn't exist, create and save it
        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        await sauce.save();
        
        res.status(201).json({ message: 'Sauce added successfully!' });
        // 201 Created/ Sauce successfully added

    } catch (error) {
        if (error instanceof SyntaxError) {
            return res.status(400).json({ error: 'Invalid sauce data format.' });
            // 400 Bad Request/ Invalid sauce data format

        }
        next({ status: 400, message: 'Bad Request' });
        // 400 Bad Request/ General bad request
    }
};

//******************* delete sauce ****************************************/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({ error: 'Sauce not found' });
                // 404 Not Found/ Sauce not found

            }
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`./src/assets/images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce deleted successfully' }))
                    // 200 OK/ Sauce deleted successfully

                    .catch((error) => next({ status: 500, message: 'Internal Server Error' }));
                    // 500 Internal Server Error/ Error deleting sauce

            });
        })
        .catch((error) => next({ status: 500, message: 'Internal Server Error' }));
        // 500 Internal Server Error/ Error finding sauce

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
                        let filename = oldImageUrl.split('/images/')[1]; 
                       
                        fs.unlink(`src/assets/images/${filename}`, (err) => {
                            if (err) {
                                console.error('Error deleting old image:', err);
                            } else {
                                console.log('Old image deleted:', filename);
                            }
                        });
                    }
                    res.status(201).json({ message: 'Sauce modified!' });
                    // 201 Created/ Sauce modified successfully

                })
                .catch(error => {
                    res.status(400).json({ error: error });
                    // 400 Bad Request/ Error modifying sauce
                });
        })
        .catch(error => {
            res.status(500).json({ error: error });
            // 500 Internal Server Error/ Error finding sauce
        });
};
//************************ like sauce  *****************************/

exports.toggleLikeSauce = (req, res, next) => {
    const userId = req.body.userId; 
    const sauceId = req.params.id;
    const likeValue = req.body.like; 

    Sauce.findById(sauceId)
        .then(sauce => {
            if (!sauce) {
                return res.status(404).json({ message: 'Sauce not found' });
                // 404 Not Found/ Sauce not found

            }
            let update = {};
            switch (likeValue) {
                case 1: // Like
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
                    throw new Error('Invalid like value');
            }
            // Update the sauce
            return Sauce.updateOne({ _id: sauceId }, update);
        })
        .then(() => {
            res.status(200).json({ message: 'Sauce like/dislike updated successfully' });
            // 200 OK/ Sauce updated successfully

        })
        .catch(error => {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
                // 400 Bad Request/ Invalid like value

            }
            res.status(500).json({ error: 'Internal server error' });
            // 500 Internal Server Error/ Generic internal server error

        });
};
