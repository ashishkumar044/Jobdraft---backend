const { admin, db } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { 
    validateRecruiterSignupData, 
    validateJobseekerSignupData, 
    validateLoginData,
    reduceJobseekerAboutDetails ,
    reduceJobseekerEducationDetails,
    reduceJobseekerWorkExDetails,
    reduceJobseekerContactDetails,
    reduceRecruiterDetails,
    reduceJobseekerJobPrefDetails
} = require('../util/validator')


/////////////////////////////////////////////RECRUITERS///////////////////////////////////////////////////
//Signup function for recruiters
exports.recruiterSignup = ((req, res) => {
    const newRecruiter = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        designation: req.body.designation,
        organization: req.body.organization,  
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }

    //Validators
    const{ valid, errors } = validateRecruiterSignupData(newRecruiter);
    if (!valid) return res.status(400).json(errors);

    let token, recruiterId;

    db.doc(`/recruiters/${newRecruiter.email}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ handle: 'Account already exists for this email' });
            }
            else {
            return firebase
                        .auth()
                        .createUserWithEmailAndPassword(newRecruiter.email, newRecruiter.password)
            }
        })
        .then(data => {
            recruiterId = data.user.uid
            return data.user.getIdToken()
        })
        .then(idToken => {
            token = idToken
            const recruiterCredentials = {
                name: newRecruiter.name,
                email: newRecruiter.email,
                phone: newRecruiter.phone,
                designation: newRecruiter.designation,
                organization: newRecruiter.organization,
                createdAt: new Date().toISOString(),
                recruiterId
            }
            return db.doc(`/recruiters/${newRecruiter.email}`).set(recruiterCredentials)
        })
        .then(() => {
            return res.status(201).json({ token })
        })
        .catch(err => {
            console.error(err)
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'Email is already in use' })
            }
            else {
                return res.status(500).json({ general: 'Something went wrong, please try again' });
            } 
        })
    })


//Login function for recruiters
exports.recruiterLogin = (req, res) => {
    const recruiter = {
        email: req.body.email,
        password: req.body.password
    };

const{ valid, errors } = validateLoginData(recruiter);

if (!valid) return res.status(400).json(errors);

    firebase
    .auth()
    .signInWithEmailAndPassword(recruiter.email, recruiter.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({ token });
    })
    .catch(err => {
        console.error(err);
         return res.status(403).json({ general: 'Wrong credentials, please try again' });
    });
};

//Add recruiter details
exports.addRecruiterDetails = ((req, res) => {
    let recruiterDetails = reduceRecruiterDetails(req.body);

    db.doc(`/recruiters/${req.user.email}`).update(recruiterDetails)
    .then(() => {
        return res.json({ message: 'Details added successfully'});
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
});

//Get recruiter own data
exports.getRecruiterOwnDetails = ((req, res) => {
    let recruiterData = {};
    db.doc(`/recruiters/${req.user.email}`).get()
    .then(doc => {
        if(doc.exists) {
            recruiterData.recruiterCredentials = doc.data();
            return db.collection('jobApplications').where('email', '==', req.user.email).get();
        }
    })
    .then(data => {
        recruiterData.jobApplications = [];
        data.forEach(doc => {
            recruiterData.jobApplications.push(doc.data());
        });
        return db.collection('jobPosts').where('email', '==', req.user.email)
        .orderBy('createdAt', 'desc').get() //Add limit
    })
    .then(data => {
        recruiterData.jobPosts = []
        data.forEach(doc => {
            recruiterData.jobPosts.push({
                jobId: doc.id,
                    jobTitle: doc.data().jobTitle,
                    organization: doc.data().organization,
                    jobDesc: doc.data().jobDesc,
                    location: doc.data().location,
                    createdAt: doc.data().createdAt,
            })
        })
        return res.json(recruiterData)
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
})

//Get applied jobseeker details
exports.getJobseekerDetails = ((req, res) => {
    let jobseekerData = {};
    db.doc(`jobseekers/${req.params.email}`).get()
    .then(doc => {
        if(doc.exists){
            jobseekerData.user = doc.data();
            return db.collection('skills').where('userEmail', '==', req.params.email).get()
        } else {
            return res.status(404).json({ error: 'Jobseeker not found' });
        }
    })
        .then(data => {
            jobseekerData.user.skills = [];
            data.forEach(doc => {
                jobseekerData.user.skills.push(doc.data());
            });
            return res.json(jobseekerData);
        })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
});


//Mark Notifications read 
exports.markNotificationsRead = ((req, res) => {
    let batch = db.batch();
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true });
    });
    batch.commit()
    .then(() => {
        return res.json({ message: 'Notifications marked read' });
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code })
    });
}); 


///////////////////////////////////////////////JOBSEEKERS//////////////////////////////////////////////////
//Signup function for jobseeker
exports.jobseekerSignup = ((req, res) => {
    const newJobseeker = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }

    //Validators
    const{ valid, errors } = validateJobseekerSignupData(newJobseeker);
    if (!valid) return res.status(400).json(errors);

    let token, jobseekerId;

    db.doc(`/jobseekers/${newJobseeker.email}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ handle: 'Account already exists for this email' });
            }
            else {
            return firebase
                        .auth()
                        .createUserWithEmailAndPassword(newJobseeker.email, newJobseeker.password)
            }
        })
        .then(data => {
            jobseekerId = data.user.uid
            return data.user.getIdToken()
        })
        .then(idToken => {
            token = idToken
            const jobseekerCredentials = {
                firstName: newJobseeker.firstName,
                lastName: newJobseeker.lastName,
                email: newJobseeker.email,
                createdAt: new Date().toISOString(),
                jobseekerId
            }
            return db.doc(`/jobseekers/${newJobseeker.email}`).set(jobseekerCredentials)
        })
        .then(() => {
            return res.status(201).json({ token })
        })
        .catch(err => {
            console.error(err)
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'Email is already in use' })
            }
            else {
                return res.status(500).json({ general: 'Something went wrong, please try again' });
            } 
        })
    })


//Login function for jobseeker
exports.jobseekerLogin = (req, res) => {
    const jobseeker = {
        email: req.body.email,
        password: req.body.password
    };

const{ valid, errors } = validateLoginData(jobseeker);

if (!valid) return res.status(400).json(errors);

    firebase
    .auth()
    .signInWithEmailAndPassword(jobseeker.email, jobseeker.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({ token });
    })
    .catch(err => {
        console.error(err);
         return res.status(403).json({ general: 'Wrong credentials, please try again' });
    });
};

//Add jobseeker about details
exports.addJobseekerAboutDetails = ((req, res) => {
    let jobSeekerAboutDetails = reduceJobseekerAboutDetails(req.body);

    db.doc(`/jobseekers/${req.user.email}`).update(jobSeekerAboutDetails)
    .then(() => {
        return res.json({ message: 'About Details added successfully'});
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
});

//Add jobseeker education details
exports.addJobseekerEducationDetails = ((req, res) => {
    let jobSeekerEducationDetails = reduceJobseekerEducationDetails(req.body);

    db.doc(`/jobseekers/${req.user.email}`).update(jobSeekerEducationDetails)
    .then(() => {
        return res.json({ message: 'Education Details added successfully'});
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
});

//Add jobseeker work experience details
exports.addJobseekerWorkExDetails = ((req, res) => {
    let jobSeekerWorkExDetails = reduceJobseekerWorkExDetails(req.body);

    db.doc(`/jobseekers/${req.user.email}`).update(jobSeekerWorkExDetails)
    .then(() => {
        return res.json({ message: 'WorkEx Details added successfully'});
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
});

//Add jobseeker contact details
exports.addJobseekerContactDetails = ((req, res) => {
    let jobSeekerContactDetails = reduceJobseekerContactDetails(req.body);

    db.doc(`/jobseekers/${req.user.email}`).update(jobSeekerContactDetails)
    .then(() => {
        return res.json({ message: 'Contact Details added successfully'});
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
});

//Get jobseeker own data and project details
exports.getJobseekerOwnDetails = ((req, res) => {
    let jobseekerData = {};
    db.doc(`/jobseekers/${req.user.email}`).get()
    .then(doc => {
        if(doc.exists) {
            jobseekerData.jobseekerCredentials = doc.data();
            return db.collection('skills').where('userEmail', '==', req.user.email).get();
        }
    })
    .then(data => {
        jobseekerData.skills = [];
        data.forEach(doc => {
            jobseekerData.skills.push(doc.data());
        });
        return res.json(jobseekerData);
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
})


//Add jobseeker Job details
exports.addJobseekerJobPrefDetails = ((req, res) => {
    let jobSeekerJobPrefDetails = reduceJobseekerJobPrefDetails(req.body);

    db.doc(`/jobseekers/${req.user.email}`).update(jobSeekerJobPrefDetails)
    .then(() => {
        return res.json({ message: 'JobPref Details added successfully'});
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
});