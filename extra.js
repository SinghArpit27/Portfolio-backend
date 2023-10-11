

const userSchema2 = new mongoose.Schema({
    name: String,
    email: {
      type: String,
      unique: true,
      required: [true, "Please Enter Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Password"],
      select: false,
    },
  
    timeline: [
      {
        title: String,
        description: String,
        date: Date,
      },
    ],
  
    skills: {
      image1: {
        public_id: String,
        url: String,
      },
  
      image2: {
        public_id: String,
        url: String,
      },
      image3: {
        public_id: String,
        url: String,
      },
      image4: {
        public_id: String,
        url: String,
      },
      image5: {
        public_id: String,
        url: String,
      },
      image6: {
        public_id: String,
        url: String,
      },
    },
  
    youtube: [
      {
        url: String,
        title: String,
        image: {
          public_id: String,
          url: String,
        },
      },
    ],
  
    projects: [
      {
        url: String,
        title: String,
        image: {
          public_id: String,
          url: String,
        },
        description: String,
        techStack: String,
      },
    ],
  
    about: {
      name: String,
      title: String,
      subtitle: String,
      description: String,
      quote: String,
      avatar: {
        public_id: String,
        url: String,
      },
    },
  });
  
  export const User = mongoose.model("User2", userSchema2);






  /*
  export const sendMail = async (text) => {
  const transporter = createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    auth: {
      user: process.env.SMPT_USER,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  await transporter.sendMail({
    subject: "CONTACT REQUEST FROM PORTFOLIO",
    to: process.env.MYMAIL,
    from: process.env.MYMAIL,
    text,
  });
};
  
  
  */



    // // Add Experience Controller
    // static async addExperience(req, res) {
    //     try {
    //         const userId = req.userId;
    //         const userData = await User.findById({ _id: userId });

    //         if (userData) {
    //             const { title, company, location, startDate, endDate, description } = req.body;
    //             const projectData = await Professional.findOne({ userId: userId });

    //             if (projectData) {
    //                 // User already has a professional record, add a new experience to their existing experience array.
    //                 projectData.experience.push({
    //                     title,
    //                     company,
    //                     location,
    //                     startDate,
    //                     endDate,
    //                     description,
    //                 });

    //                 await projectData.save();
    //             } else {
    //                 // User doesn't have a professional record, create a new one with the experience.
    //                 const newProfessional = new Professional({
    //                     userId: userId,
    //                     experience: [
    //                         {
    //                             title,
    //                             company,
    //                             location,
    //                             startDate,
    //                             endDate,
    //                             description,
    //                         },
    //                     ],
    //                 });

    //                 await newProfessional.save();
    //             }

    //             httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.EXPERIENCE_ADDED);
    //         } else {
    //             httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
    //         }
    //     } catch (error) {
    //         httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
    //     }
    // }
