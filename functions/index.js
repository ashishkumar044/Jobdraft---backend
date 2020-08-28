const functions = require('firebase-functions');

const { FBAuthRecruiter, FBAuthJobseeker } = require('./util/fbAuth')

const cors = require('cors')

const { db } = require('./util/admin')

const express = require('express');
const app = express();

app.use(cors())

// const { db } = require('./util/admin');
const { 
    recruiterSignup, 
    recruiterLogin, 
    jobseekerSignup, 
    jobseekerLogin,
    addJobseekerAboutDetails, 
    addJobseekerEducationDetails,
    addJobseekerWorkExDetails,
    addJobseekerContactDetails,
    getJobseekerOwnDetails,
    addRecruiterDetails,
    getRecruiterOwnDetails,
    getJobseekerDetails,
    markNotificationsRead,
    addJobseekerJobPrefDetails
} = require('./handlers/users');

const { 
    postJob, 
    deleteJob,
    getJobPosts, 
    getJobPostsRecruiter,
    getJobDetailsRecruiter,
    getJobDetailJobseeker,
    applyJob,
    deleteJobApplication
} = require('./handlers/posts');

const {
    postScream,
    getAllScreams,
    getScream,
    commentOnScream,
    upvoteComment,
    removeUpvote,
    downvoteComment,
    removeDownvote,
    deleteScream,
    deleteComment
} = require('./handlers/community')

const {
    postProject,
    // postSkill
    // jobseekerQuestion,
    jobseekerFeedback,
    recruiterFeedback
} = require('./handlers/skillProject')

//Recruiter Routes
app.post('/r/signup', recruiterSignup)
app.post('/r/login', recruiterLogin)

app.post('/r/postJob', FBAuthRecruiter, postJob)
app.delete('/r/job/:jobId/delete', FBAuthRecruiter, deleteJob)
app.get('/r/jobs/:email', FBAuthRecruiter, getJobPostsRecruiter)
app.get('/r/job/:jobId', FBAuthRecruiter, getJobDetailsRecruiter)
app.post('/r/details', FBAuthRecruiter, addRecruiterDetails)
app.get('/r/details', FBAuthRecruiter, getRecruiterOwnDetails)
app.get('/r/app/:email/details', FBAuthRecruiter, getJobseekerDetails)
app.delete('/r/application/:applicationId/delete', FBAuthRecruiter, deleteJobApplication)
app.post('/r/notifications', FBAuthRecruiter, markNotificationsRead)

//Jobseeker Routes
app.post('/j/signup', jobseekerSignup)
app.post('/j/login', jobseekerLogin)

app.get('/j/jobs', FBAuthJobseeker, getJobPosts) 
app.get('/j/job/:jobId', FBAuthJobseeker, getJobDetailJobseeker)
app.get('/j/details', FBAuthJobseeker, getJobseekerOwnDetails)
app.post('/j/aboutdetails', FBAuthJobseeker, addJobseekerAboutDetails)
app.post('/j/educationdetails', FBAuthJobseeker, addJobseekerEducationDetails)
app.post('/j/workexdetails', FBAuthJobseeker, addJobseekerWorkExDetails)
app.post('/j/contactdetails', FBAuthJobseeker, addJobseekerContactDetails)
app.post('/j/job/:jobId/apply', FBAuthJobseeker, applyJob)
app.post('/j/jobPref', FBAuthJobseeker, addJobseekerJobPrefDetails)

//Project Routes
app.post('/j/project', FBAuthJobseeker, postProject)

//Feedback Route
app.post('/j/postFeedback', FBAuthJobseeker, jobseekerFeedback)
app.post('/r/postFeedback', FBAuthRecruiter, recruiterFeedback)

//Community Routes
app.post('/postScream', FBAuthJobseeker, postScream)
app.get('/getScreams', getAllScreams)
app.get('/getScream/:screamId', getScream)
app.post('/scream/:screamId/comment', FBAuthJobseeker, commentOnScream)
app.get('/comment/:commentId/upvote', FBAuthJobseeker, upvoteComment)
app.get('/comment/:commentId/removeUpvote', FBAuthJobseeker, removeUpvote)
app.get('/comment/:commentId/downvote', FBAuthJobseeker, downvoteComment)
app.get('/comment/:commentId/removeDownvote', FBAuthJobseeker, removeDownvote)
app.delete('/scream/:screamId/delete', FBAuthJobseeker, deleteScream)
app.delete('/comment/:commentId/delete', FBAuthJobseeker, deleteComment)

exports.api = functions.region('asia-east2').https.onRequest(app);


//Notification functions

//On apply
exports.createNotificationsOnApply = functions.region('asia-east2').firestore.document('jobApplications/{id}')
.onCreate((snapshot) => {
    return db.doc(`jobPosts/${snapshot.data().jobId}`).get()
    .then(doc => {
        if(doc.exists && doc.data().email !== snapshot.data().email){
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt: new Date().toISOString(),
                recipient: doc.data().email,
                sender: snapshot.data().email,
                type: 'apply',
                read: false,
                jobId: doc.id
            })
        }
    })
    .catch(err => {
        console.error(err);
        return;
    });
})
