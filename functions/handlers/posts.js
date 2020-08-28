const { db } = require('../util/admin')


///////////////////////////////////////////////RECRUITER///////////////////////////////////////////////////
//Post a job 
exports.postJob = (req, res) => {
    if (req.body.jobTitle.trim() === '') {
        return res.status(400).json({ jobTitle: 'Job title must not be empty' });
      }
      if (req.body.jobDesc.trim() === '') {
        return res.status(400).json({ jobDesc: 'Job Description must not be empty' });
      }
      if (req.body.location.trim() === '') {
        return res.status(400).json({ location: 'Location must not be empty' });
      }
      if (req.body.workEx.trim() === '') {
        return res.status(400).json({ workEx: 'Must not be empty' });
      }
      

    const newPost = {
        jobTitle: req.body.jobTitle,
        jobDesc: req.body.jobDesc,
        organization: req.user.organization,  
        location: req.body.location,  
        workEx: req.body.workEx,  
        reqSkills: req.body.reqSkills,
        ctc: req.body.ctc,
        email: req.user.email,
        createdAt: new Date().toISOString(),
        applyCount: 0
    };

    db.collection('jobPosts')
        .add(newPost)
        .then(doc => {
            const resPost = newPost;
            resPost.jobId= doc.id;
            res.json(resPost);
        })
        .catch(err => {
            res.status(500).json({error: 'something went wrong'});
            console.error(err);
        });
};

//Get jobs posted by the organisation
exports.getJobPostsRecruiter = (req, res) => {
    let jobPosts = {};
    db.doc(`recruiters/${req.params.email}`).get()
    .then(doc => {
        if(doc.exists){
            jobPosts.user = doc.data();
            return db.collection('jobPosts').where('email', '==', req.params.email)
            .orderBy('createdAt', 'desc')
            .get()
        } else {
            return res.status(404).json({ error: 'recruiter not found' });
        }
    })
        .then(data => {
            jobPosts = [];
            data.forEach(doc => {
                jobPosts.push({
                    jobId: doc.id,
                    jobTitle: doc.data().jobTitle,
                    organization: doc.data().organization,
                    jobDesc: doc.data().jobDesc,
                    location: doc.data().location,
                    workEx: doc.data().workEx,
                    reqSkills: doc.data().reqSkills,
                    ctc: doc.data().ctc,
                    createdAt: doc.data().createdAt,
                    applyCount: doc.data().applyCount
                });
            });
            return res.json(jobPosts);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
    }

//Get a particular job posted by the organization (with applications)
exports.getJobDetailsRecruiter = ((req, res) => {
    let jobData = {};
    db.doc(`/jobPosts/${req.params.jobId}`).get()
    .then(doc => {
        if(!doc.exists){
            return res.status(404).json({ error: 'Job not found'});
        }
        jobData = doc.data();
        jobData.jobId = doc.id;
        return db.collection('jobApplications').where('jobId', '==', req.params.jobId).get()
    })
    .then(data => {
        jobData.jobApplications = []
        data.forEach(doc => {
            jobData.jobApplications.push(doc.data())
        })
        return res.json(jobData);
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
});

//Delete a posted job
exports.deleteJob = ((req, res) => {
    const document = db.doc(`/jobPosts/${req.params.jobId}`);
    document.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'job not found' });
            } 
            else if(doc.data().email !== req.user.email){
                return res.status(403).json({ error: 'Unauthorized' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: 'job deleted succesfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
})

//Delete a job application
exports.deleteJobApplication = ((req, res) => {
    const document = db.doc(`/jobApplications/${req.params.applicationId}`);
    document.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Application not found' });
            }  else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: 'Application deleted succesfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
})

/////////////////////////////////////////////////JOBSEEKER////////////////////////////////////////////////
//Get all posted jobs
exports.getJobPosts = (req, res) => {
  db.collection('jobPosts')
      .orderBy('createdAt', "desc")
      .get()
      .then(data => {
          let jobPosts = [];
          data.forEach(doc => {
              jobPosts.push({
                  jobId: doc.id,
                  jobTitle: doc.data().jobTitle,
                  organization: doc.data().organization,
                  jobDesc: doc.data().jobDesc,
                  location: doc.data().location,
                  workEx: doc.data().workEx,
                  reqSkills: doc.data().reqSkills,
                  createdAt: doc.data().createdAt,
              });
          });
          return res.json(jobPosts);
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: err.code });
      });
  }


//Get a particular job post ( without knowing the applications)
exports.getJobDetailJobseeker = ((req, res) => {
    let jobData = {};
    db.doc(`/jobPosts/${req.params.jobId}`).get()
    .then(doc => {
        if(!doc.exists){
            return res.status(404).json({ error: 'Job not found'});
        }
        jobData = doc.data();
        jobData.jobId = doc.id;
        return db.collection('jobApplications').where('jobId', '==', req.params.jobId).get()
    })
    .then(data => {
        jobData.jobApplications = []
        data.forEach(doc => {
            jobData.jobApplications.push(doc.data())
        })
        return res.json(jobData);
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
});


// Apply for jobs 
exports.applyJob = ((req, res) => {
    const applyJob = {
        body: 'Apply',
        createdAt: new Date().toISOString(),
        jobId: req.params.jobId,
        email: req.user.email,
        name: req.user.firstName
    };

    db.doc(`/jobPosts/${req.params.jobId}`).get()
    .then(doc => {
        if(!doc.exists){
            return res.status(404).json({ error: 'Job not found' });
        }
        return doc.ref.update({applyCount: doc.data().applyCount + 1})
    })
    .then(() => {
        return db.collection('jobApplications').add(applyJob)
        .then(doc => {
            const resApply = applyJob;
            resApply.applicationId= doc.id;
            res.json(resApply);
        })
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    });
});
