const { db } = require('../util/admin')

//Post project
// exports.postProject = (req, res) => {
//     if (req.body.problem.trim() === '') {
//         return res.status(400).json({ problem: 'Must not be empty' });
//       }
//     if (req.body.solution.trim() === '') {
//         return res.status(400).json({ solution: 'Body must not be empty' });
//       }
//     if (req.body.language.trim() === '') {
//     return res.status(400).json({ language: 'Must not be empty' });
//       }

//     const newProject = {
//         language: req.body.language,
//         problem: req.body.problem,
//         solution: req.body.solution,
//         userEmail: req.user.email,
//         userName: req.user.name,
//         status: 'Pending',
//         createdAt: new Date().toISOString(),
//     };

//     db.collection('projects')
//         .add(newProject)
//         .then(doc => {
//             const resProject = newProject;
//             resProject.projectId= doc.id;
//             res.json(resProject);
//         })
//         .catch(err => {
//             res.status(500).json({error: 'something went wrong'});
//             console.error(err);
//         });
// };


//Post skill
exports.postProject = (req, res) => {

  const newSkill = {
      skillName: req.body.skillName,
      score: req.body.score,
      userEmail: req.user.email,
      userName: req.user.name,
      createdAt: new Date().toISOString(),
  }

  db.collection('skills')
      .add(newSkill)
      .then(doc => {
          const resSkill = newSkill
          resSkill.skillId= doc.id
          res.json(resSkill)
      })
      .catch(err => {
          res.status(500).json({error: 'something went wrong'})
          console.error(err)
      })
}


//Post jobseeker feedback
exports.jobseekerFeedback = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty' });
      }

    const newFeedback = {
        body: req.body.body,
        userEmail: req.user.email,
        userName: req.user.firstName,
        createdAt: new Date().toISOString(),
    }
  
    db.collection('jobseekerFeedback')
        .add(newFeedback)
        .then(doc => {
            const resFeedback = newFeedback
            resFeedback.feedbackId= doc.id
            res.json(resFeedback)
        })
        .catch(err => {
            res.status(500).json({error: 'something went wrong'})
            console.error(err)
        })
  }

  

  //Post recruiter feedback
exports.recruiterFeedback = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty' });
      }

    const newFeedback = {
        body: req.body.body,
        userEmail: req.user.email,
        organization: req.user.organization,
        createdAt: new Date().toISOString(),
    }
  
    db.collection('recruiterFeedback')
        .add(newFeedback)
        .then(doc => {
            const resFeedback = newFeedback
            resFeedback.feedbackId= doc.id
            res.json(resFeedback)
        })
        .catch(err => {
            res.status(500).json({error: 'something went wrong'})
            console.error(err)
        })
  }