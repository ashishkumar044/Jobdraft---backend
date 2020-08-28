const { admin, db } = require('./admin');

//Authentication Middleware for Recruiter
exports.FBAuthRecruiter = (req, res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else{
        console.error('No token found');
        return res.status(403).json({ error: 'Unauthorized' });
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            return db.collection('recruiters')
                .where('recruiterId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.email = data.docs[0].data().email;
            req.user.organization = data.docs[0].data().organization;
            return next();
        })
        .catch(err => {
            console.error('Error while verifying token', err);
            return res.status(403).json(err);
        });
};


//Authentication Middleware for JobSeeker
exports.FBAuthJobseeker = (req, res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else{
        console.error('No token found');
        return res.status(403).json({ error: 'Unauthorized' });
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            return db.collection('jobseekers')
                .where('jobseekerId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.email = data.docs[0].data().email;
            req.user.firstName = data.docs[0].data().firstName;
            req.user.lastName = data.docs[0].data().lastName;
            return next();
        })
        .catch(err => {
            console.error('Error while verifying token', err);
            return res.status(403).json(err);
        });
};