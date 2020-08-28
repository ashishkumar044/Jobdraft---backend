//Recruiter
let rdb = {
    jobPost: [
        {
            jobTitle: 'Business Analyst',
            organization: 'ABC Ltd',
            jobDesc: 'This is the new job post',
            location: 'Bangalore',
            createdAt: '2020-06-16T12:35:02.219Z',
            appliedCount: 5
        }
    ],
    signup: [
        {
            name: 'Gandalf',
            email: 'grey_wiz@email.com',
            phone: '216 6969',
            designation: 'Lead HR',
            organization: 'Oakenshield Corp',
            password: 'precious',
            confirmPassword: 'precious'
        }
    ],
    notifications: [
        {
            
        recipient: 'peptalk2@email.com',
        sender: 'seeker@email.com',
        read: 'true | false',
        jobId: 'adhakeew24234as',
        type: 'apply',
        createdAt: '20Jun2020'
        }
    ]
}


//JobSeeker
let jdb = {
    signup: [
        {
            name: 'Gandalf',
            email: 'grey_wiz@email.com',
            password: 'precious',
            confirmPassword: 'precious'
        }
    ],
    credentials: [
        //Redux Data (The information to be held in redux state)
        {
            jobseekerId: '14qkgjhad123',
            about: 'I am a hardworking guy having skills in data science, python',
            educationInstitute: 'Hindu College', 
            educationCourse: 'BSc Mathematics',
            experiencePeriod: '2016 - 2018',
            experienceCompany: 'Apple',
            phone: '5433563453',
            currentLocation: 'NCR',
            email: 'seeker@email.com',
            name: 'seeker'
        },
        skills = {
            email: 'seeker@email.com',
            name: 'seeker',
            skillId: '1321411',
            createdAt: '1321411',
            level: '1',
            points: '25',
        }
    ],
    progress: [
        {
            points: 40,
            level: 1,
            stars: 3
        }
    ]

}