//Helper functions
// to determine whether a string is empty or not
const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

//whether valid email or not (regex that matches for an email)
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}


//Validator function to validate signup data for recruiters
exports.validateRecruiterSignupData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) {
        errors.email = 'Must not be empty';;
    } else if(!isEmail(data.email)) {
        errors.email = 'Please provide a valid email address'
    }
    
    if(isEmpty(data.password)) errors.password = 'Please provide a password';
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';  
    if(isEmpty(data.name)) errors.name = 'Must not be empty';
    if(isEmpty(data.phone)) errors.phone = 'Must not be empty';
    if(isEmpty(data.designation)) errors.designation = 'Must not be empty';
    if(isEmpty(data.organization)) errors.organization = 'Must not be empty';
    
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
    
} 

//Validator function to validate signup data for JobSeekers
exports.validateJobseekerSignupData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) {
        errors.email = 'Must not be empty';;
    } else if(!isEmail(data.email)) {
        errors.email = 'Please provide a valid email address'
    }
    
    if(isEmpty(data.password)) errors.password = 'Please provide a password';
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';  
    if(isEmpty(data.firstName)) errors.firstName = 'Must not be empty';
    
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
    
} 


//Validator function to validate login data for both jobseekers and recruiters
exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = "Must not be empty";
    if(isEmpty(data.password)) errors.password = "Must not be empty";

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

//////////////////////////////////////////////Jobseeker Details////////////////////////////////////////////
//Jobseeker About Details
exports.reduceJobseekerAboutDetails = (data) => {
    let jobSeekerAboutDetails = {};

    if(!isEmpty(data.about.trim())) jobSeekerAboutDetails.about = data.about;

    return jobSeekerAboutDetails;
};

//Jobseeker Education Details
exports.reduceJobseekerEducationDetails = (data) => {
    let jobSeekerEducationDetails = {};

    if(!isEmpty(data.educationInstitute1.trim())) jobSeekerEducationDetails.educationInstitute1 = data.educationInstitute1;
    if(!isEmpty(data.educationCourse1.trim())) jobSeekerEducationDetails.educationCourse1 = data.educationCourse1;
    if(!isEmpty(data.educationInstitute2.trim())) jobSeekerEducationDetails.educationInstitute2 = data.educationInstitute2;
    if(!isEmpty(data.educationCourse2.trim())) jobSeekerEducationDetails.educationCourse2 = data.educationCourse2;
    if(!isEmpty(data.educationInstitute3.trim())) jobSeekerEducationDetails.educationInstitute3 = data.educationInstitute3;
    if(!isEmpty(data.educationCourse3.trim())) jobSeekerEducationDetails.educationCourse3 = data.educationCourse3;

    return jobSeekerEducationDetails;
};

//Jobseeker WorkExperience Details
exports.reduceJobseekerWorkExDetails = (data) => {
    let jobSeekerWorkExDetails = {};
    
    jobSeekerWorkExDetails.totalWorkEx = data.totalWorkEx;
    if(!isEmpty(data.experienceStPeriod1.trim())) jobSeekerWorkExDetails.experienceStPeriod1 = data.experienceStPeriod1;
    if(!isEmpty(data.experienceEndPeriod1.trim())) jobSeekerWorkExDetails.experienceEndPeriod1 = data.experienceEndPeriod1;
    if(!isEmpty(data.experienceCompany1.trim())) jobSeekerWorkExDetails.experienceCompany1 = data.experienceCompany1;
    if(!isEmpty(data.experienceDetails1.trim())) jobSeekerWorkExDetails.experienceDetails1 = data.experienceDetails1;
    if(!isEmpty(data.experienceStPeriod2.trim())) jobSeekerWorkExDetails.experienceStPeriod2 = data.experienceStPeriod2;
    if(!isEmpty(data.experienceEndPeriod2.trim())) jobSeekerWorkExDetails.experienceEndPeriod2 = data.experienceEndPeriod2;
    if(!isEmpty(data.experienceCompany2.trim())) jobSeekerWorkExDetails.experienceCompany2 = data.experienceCompany2;
    if(!isEmpty(data.experienceDetails2.trim())) jobSeekerWorkExDetails.experienceDetails2 = data.experienceDetails2;
    if(!isEmpty(data.experienceStPeriod3.trim())) jobSeekerWorkExDetails.experienceStPeriod3 = data.experienceStPeriod3;
    if(!isEmpty(data.experienceEndPeriod3.trim())) jobSeekerWorkExDetails.experienceEndPeriod3 = data.experienceEndPeriod3;
    if(!isEmpty(data.experienceCompany3.trim())) jobSeekerWorkExDetails.experienceCompany3 = data.experienceCompany3;
    if(!isEmpty(data.experienceDetails3.trim())) jobSeekerWorkExDetails.experienceDetails3 = data.experienceDetails3;

    return jobSeekerWorkExDetails;
};

//Jobseeker Job Preference Details
exports.reduceJobseekerJobPrefDetails = (data) => {
    let JobseekerJobPrefDetails = {};
    
    if(!isEmpty(data.skill1.trim())) JobseekerJobPrefDetails.skill1 = data.skill1;
    if(!isEmpty(data.skill2.trim())) JobseekerJobPrefDetails.skill2 = data.skill2;
    if(!isEmpty(data.skill3.trim())) JobseekerJobPrefDetails.skill3 = data.skill3;
    if(!isEmpty(data.skill4.trim())) JobseekerJobPrefDetails.skill4 = data.skill4;
    if(!isEmpty(data.skill5.trim())) JobseekerJobPrefDetails.skill5 = data.skill5;
    if(!isEmpty(data.expCTC.trim())) JobseekerJobPrefDetails.expCTC = data.expCTC;
    if(!isEmpty(data.prefLocation1.trim())) JobseekerJobPrefDetails.prefLocation1 = data.prefLocation1;
    if(!isEmpty(data.prefLocation2.trim())) JobseekerJobPrefDetails.prefLocation2 = data.prefLocation2;
    if(!isEmpty(data.prefLocation3.trim())) JobseekerJobPrefDetails.prefLocation3 = data.prefLocation3;
    if(!isEmpty(data.noticePeriod.trim())) JobseekerJobPrefDetails.noticePeriod = data.noticePeriod;
    if(!isEmpty(data.functionalArea.trim())) JobseekerJobPrefDetails.functionalArea = data.functionalArea;

    return JobseekerJobPrefDetails;
};

//Jobseeker Contact Details
exports.reduceJobseekerContactDetails = (data) => {
    let jobSeekerContactDetails = {};

    if(!isEmpty(data.phone.trim())) jobSeekerContactDetails.phone = data.phone;
    if(!isEmpty(data.currentLocation.trim())) jobSeekerContactDetails.currentLocation = data.currentLocation;

    return jobSeekerContactDetails;
};


////////////////////////////////////////////////Recruiter Details///////////////////////////////////////////////
exports.reduceRecruiterDetails = (data) => {
    let recruiterDetails = {};

    if(!isEmpty(data.location.trim())) recruiterDetails.location = data.location
    if(!isEmpty(data.website.trim())){
        if(data.website.trim().substring(0, 4) !== 'http'){
            recruiterDetails.website = `http://${data.website.trim()}`
        } else recruiterDetails.website = data.website
    } 
    
    return recruiterDetails;
};