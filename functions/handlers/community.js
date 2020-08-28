const { db } = require('../util/admin')

//Post a scream
exports.postScream = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty' });
      }

    const newScream = {
        body: req.body.body,
        userEmail: req.user.email,
        userName: req.user.firstName,
        createdAt: new Date().toISOString(),
        commentCount: 0
    };

    db.collection('screams')
        .add(newScream)
        .then(doc => {
            const resScream = newScream;
            resScream.screamId= doc.id;
            res.json(resScream);
        })
        .catch(err => {
            res.status(500).json({error: 'something went wrong'});
            console.error(err);
        });
};

//Get all screams
exports.getAllScreams = (req, res) => {
    db.collection('screams')
        .orderBy('createdAt', "desc")
        .get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userEmail: doc.data().userEmail,
                    userName: doc.data().userName,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                });
            });
            return res.json(screams);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
    }

//Get a particular post 
exports.getScream = ((req, res) => {
    let screamData = {};
    db.doc(`/screams/${req.params.screamId}`).get()
    .then(doc => {
        if(!doc.exists){
            return res.status(404).json({ error: 'Scream not found'});
        }
        screamData = doc.data();
        screamData.screamId = doc.id;
        return db.collection('comments')
        .orderBy('createdAt', 'desc')
        .where('screamId', '==', req.params.screamId).get();
    })
    .then(data => {
        screamData.comments = [];
        data.forEach(doc => {
            screamData.comments.push(doc.data())
        });
        return res.json(screamData);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({ error: err.code });
    });
});

//Comment on a scream
exports.commentOnScream = ((req, res) => {
    if(req.body.body.trim() === '') 
    return res.status(400).json({ comment: 'Must not be empty' });

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userEmail: req.user.email,
        userName: req.user.firstName,
        upvoteCount: 0,
        downvoteCount: 0,
    };

    db.doc(`/screams/${req.params.screamId}`).get()
    .then(doc => {
        if(!doc.exists){
            return res.status(404).json({ error: 'Scream not found' });
        }
        return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
        return db.collection('comments').add(newComment)
        .then(doc => {
            const resComment = newComment
            resComment.commentId = doc.id
            res.json(resComment)
        })
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    });
});

//Upvote a Comment
exports.upvoteComment = ((req, res) => {
    const upvoteDocument = db.collection('upvotes').where('userEmail', '==', req.user.email)
        .where('commentId', '==', req.params.commentId).limit(1);

    const commentDocument = db.doc(`/comments/${req.params.commentId}`);

    let commentData = {};

    commentDocument.get()
    .then(doc => {
        if(doc.exists){
            commentData = doc.data();
            commentData.commentId = doc.id;
            return upvoteDocument.get();
        } else {
            return res.status(404).json({ error: 'comment not found' });
        }
    })
    .then(data => {
        if(data.empty){
            return db.collection('upvotes').add({
                commentId: req.params.commentId,
                userEmail: req.user.email,
                userName: req.user.name,
                createdAt: new Date().toISOString()
            })
            .then(() => {
                commentData.upvoteCount++ ;
                return commentDocument.update({ upvoteCount : commentData.upvoteCount});
            })
            .then(() => {
                return res.json(commentData);
            })
        } else {
            return res.status(400).json({ error: 'comment already upvoted' });
        }
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
});

//Remove upvote
exports.removeUpvote = ((req, res) => {
    const upvoteDocument = db.collection('upvotes').where('userEmail', '==', req.user.email)
    .where('commentId', '==', req.params.commentId).limit(1);

    const commentDocument = db.doc(`/comments/${req.params.commentId}`);

    let commentData = {};

    commentDocument.get()
    .then(doc => {
        if(doc.exists){
            commentData = doc.data();
            commentData.commentId = doc.id;
            return upvoteDocument.get();
        } else {
            return res.status(404).json({ error: 'comment not found' });
        }
    })
    .then(data => {
        if(data.empty){
            return res.status(400).json({ error: 'comment not upvoted' });
        } else {
            return db.doc(`/upvotes/${data.docs[0].id}`).delete()
            .then(() => {
                commentData.upvoteCount-- ;
                return commentDocument.update({ upvoteCount: commentData.upvoteCount });
            })
            .then(() => {
                return res.json(commentData);
            })
        }
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
})

//Downvote a Comment
exports.downvoteComment = ((req, res) => {
    const downvoteDocument = db.collection('downvotes').where('userEmail', '==', req.user.email)
        .where('commentId', '==', req.params.commentId).limit(1);

    const commentDocument = db.doc(`/comments/${req.params.commentId}`);

    let commentData = {};

    commentDocument.get()
    .then(doc => {
        if(doc.exists){
            commentData = doc.data();
            commentData.commentId = doc.id;
            return downvoteDocument.get();
        } else {
            return res.status(404).json({ error: 'comment not found' });
        }
    })
    .then(data => {
        if(data.empty){
            return db.collection('downvotes').add({
                commentId: req.params.commentId,
                userEmail: req.user.email,
                userName: req.user.name,
                createdAt: new Date().toISOString()
            })
            .then(() => {
                commentData.downvoteCount++ ;
                return commentDocument.update({ downvoteCount : commentData.downvoteCount});
            })
            .then(() => {
                return res.json(commentData);
            })
        } else {
            return res.status(400).json({ error: 'comment already downvoted' });
        }
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
});

//Remove downvote
exports.removeDownvote = ((req, res) => {
    const downvoteDocument = db.collection('downvotes').where('userEmail', '==', req.user.email)
    .where('commentId', '==', req.params.commentId).limit(1);

    const commentDocument = db.doc(`/comments/${req.params.commentId}`);

    let commentData = {};

    commentDocument.get()
    .then(doc => {
        if(doc.exists){
            commentData = doc.data();
            commentData.commentId = doc.id;
            return downvoteDocument.get();
        } else {
            return res.status(404).json({ error: 'comment not found' });
        }
    })
    .then(data => {
        if(data.empty){
            return res.status(400).json({ error: 'comment not downvoted' });
        } else {
            return db.doc(`/downvotes/${data.docs[0].id}`).delete()
            .then(() => {
                commentData.downvoteCount-- ;
                return commentDocument.update({ downvoteCount: commentData.downvoteCount });
            })
            .then(() => {
                return res.json(commentData);
            })
        }
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
})

//Delete a scream
exports.deleteScream = ((req, res) => {
    const document = db.doc(`/screams/${req.params.screamId}`);
    document.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Scream not found' });
            } 
            else if(doc.data().userEmail !== req.user.email){
                return res.status(403).json({ error: 'Unauthorized' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: 'Scream deleted succesfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
})

//Delete a comment
exports.deleteComment = ((req, res) => {
    const document = db.doc(`/comments/${req.params.commentId}`);
    document.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'comment not found' });
            } 
            else if(doc.data().userEmail !== req.user.email){
                return res.status(403).json({ error: 'Unauthorized' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: 'comment deleted succesfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
})