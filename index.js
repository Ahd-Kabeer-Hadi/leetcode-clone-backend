const express = require("express");
const app = express();
const port = 3002;
app.use(express.json());
function generateRandomId() {
  return Math.random().toString(36).substr(2, 9);
}

const USERS = [];
const QUESTIONS = [
  {
    id: generateRandomId(),
    title: "Two States",
    description: "Given an array, return the maximum element of the array.",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
      {
        input: "[7, -2, 9, 0, -5]",
        output: "9",
      },
      {
        input: "[-10, -20, -5, -3]",
        output: "-3",
      },
    ],
  },
  {
    id: generateRandomId(),
    title: "Array Sum",
    description:
      "Write a function to calculate and return the sum of all elements in the array.",
    testCases: [
      {
        input: "[3, 7, 2, 8]",
        output: "20",
      },
      {
        input: "[1, 2, 3, 4, 5]",
        output: "15",
      },
      {
        input: "[-1, 0, 1]",
        output: "0",
      },
    ],
  },
  {
    id: generateRandomId(),
    title: "Factorial Calculation",
    description:
      "Write a function to calculate the factorial of a given non-negative integer.",
    testCases: [
      {
        input: "5",
        output: "120",
      },
      {
        input: "0",
        output: "1",
      },
      {
        input: "7",
        output: "5040",
      },
    ],
  },
  {
    id: generateRandomId(),
    title: "Palindrome Check",
    description:
      "Implement a function to check if a given string is a palindrome.",
    testCases: [
      {
        input: "'A man a plan a canal Panama'",
        output: "true",
      },
      {
        input: "'racecar'",
        output: "true",
      },
      {
        input: "'hello'",
        output: "false",
      },
    ],
  },
  {
    id: generateRandomId(),
    title: "Reverse String",
    description:
      "Write a function to reverse a given string without using any built-in reverse functions.",
    testCases: [
      {
        input: "'LeetCode'",
        output: "'edoCteeL'",
      },
      {
        input: "'JavaScript'",
        output: "'tpircSavaJ'",
      },
      {
        input: "'12345'",
        output: "'54321'",
      },
    ],
  },
  {
    id: generateRandomId(),
    title: "Prime Number Check",
    description:
      "Create a function to determine whether a given positive integer is a prime number.",
    testCases: [
      {
        input: "17",
        output: "true",
      },
      {
        input: "4",
        output: "false",
      },
      {
        input: "23",
        output: "true",
      },
    ],
  },
  {
    id: generateRandomId(),
    title: "Unique Elements",
    description:
      "Given an array of integers, write a function to return true if the array contains only unique elements.",
    testCases: [
      {
        input: "[1, 2, 3, 4, 5, 2]",
        output: "false",
      },
      {
        input: "[10, 20, 30, 40, 50]",
        output: "true",
      },
      {
        input: "[]",
        output: "true",
      },
    ],
  },
  // Add more questions as needed
];
let currentUser = {};


const SUBMISSION = [];

//   this is the structure of the submission object
//   let submittedObjStructure = {
//     id: 'random-id',
//     questionId: 'question-id', this is a top level key in the object
//     submissionData: {
//         submissionId: 'random-id',
//         questionId: 'question-id',
//         userAnswerObj: {
//             input: 'code that user wrote',
//             submittedOn: 'date and time of submission',
//             performanceDetails: {
//                 time: 'time taken by user',
//                 memory: 'memory used by user',
//             },
//         },
//         submittedBy: 'user email',
//         submitStatus: 'accepted or rejected based on test cases.but now randomly',
//     },
//     totalSubmissions: 'total number of submissions',
// }14

app.post("/signup", function (req, res) {
  const body = req.body;
  if (body.email && body.password) {
    let user = USERS.find((u) => u.email === body.email);
    if (user) {
      res.send({ statusCode: 500, message: "User already exists" });
      return;
    }
    let userDetails = {
      email: body.email,
      password: body.password,
    };
    if (body.role) {
      userDetails.role = body.role;
    } else {
      userDetails.role = "user";
    }
    USERS.push(userDetails);
    res.send({ statusCode: 200, message: "User created", userList: USERS });
  } else {
    if (body.email) {
      res.send({ statusCode: 500, message: "Please provide a password" });
    } else {
      res.send({ statusCode: 500, message: "Please provide an email" });
    }
  }
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password


  const body = req.body;
  if (body.email && body.password) {
    let user = USERS.find(
      (u) => u.email === body.email && u.password === body.password
    );
    if (user) {
      const token = generateRandomId();
      currentUser = user;
      res.send({ statusCode: 200, token: token });
    } else {
      res.send({ statusCode: 401, message: "Invalid credentials" });
    }
  } else {
    if (body.email) {
      res.send({ statusCode: 500, message: "Please provide a password" });
    } else {
      res.send({ statusCode: 500, message: "Please provide an email" });
    }
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  let questionHtmlWrapper = `
      <style>
        .question-container {
          margin-bottom: 20px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
  
        .question-title {
          font-size: 20px;
          margin-bottom: 10px;
        }
  
        .question-description {
          font-size: 16px;
          margin-bottom: 10px;
        }
  
        .test-cases {
          list-style: none;
          padding: 0;
        }
  
        .test-case-list {
          list-style: none;
          padding: 0;
        }
  
        .test-case {
          margin-bottom: 5px;
          padding: 5px;
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 3px;
        }
  
        .test-input {
          font-weight: bold;
          margin-right: 10px;
        }
        
        .test-output {
          font-weight: bold;
        }
      </style>
      <h1 class="question-title"> Questions</h1>
      `;

  QUESTIONS.forEach((q) => {
    questionHtmlWrapper += `
        <div class="question-container">
          <h1 class="question-title">Question Code: ${q.id}: ${q.title}</h1>
          <p class="question-description">${q.description}</p>
          <ul class="test-cases">
            <li>
              <ul class="test-case-list">
                ${q.testCases
                  .map(
                    (tc) => `
                  <li class="test-case">
                    <span class="test-input">Input: ${tc.input}</span>
                    <span class="test-output">Output: ${tc.output}</span>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </li>
          </ul>
        </div>`;
  });

  res.send(questionHtmlWrapper);
});

app.get("/submissions", function (req, res) {
  const body = req.query;

  // Check if user is logged in
  if (!currentUser) {
    return  res.send({ statusCode: 401, message: "Please login first" });
  }

  if (body.problemId && body.userEmail === currentUser.email) {
   
    const submissions = SUBMISSION.filter(item => item.questionId === body.problemId);
    let userSubmissions = [];
    submissions.forEach(submission => {
      return userSubmissions = submission.submissionData.filter(item => item.submittedBy === currentUser.email);
    })
    if(!userSubmissions.length) {
      return res.send({ statusCode: 404, message: "No submissions found" });
    }

    
    return res.send({ statusCode: 200, submissions: userSubmissions });
    } else if (body.userEmail !== currentUser.email) {
      return res.send({ statusCode: 401, message: "Please login with correct credentials" });
    } else {
      return res.send({ statusCode: 400, message: "Invalid request. Provide problemId and userEmail parameters." });
    }
});

app.post("/submissions", function (req, res) {
  const body = req.body;
  if (!currentUser) {
    res.send({ statusCode: 401, message: "Please login first" });
    return;
  }

  const submissionData = body.submissionData;
  const problemId = submissionData["questionId"];
  const submittedBy = currentUser.email;
  const submitStatus = Math.random() > 0.5 ? "Accepted" : "Rejected";

  const userAnswerObj = {
    submissionId: generateRandomId(),
    submissionData: submissionData,
    questionId: problemId,
    submittedBy: submittedBy,
    status: submitStatus,
  };

  const existingSubmission = SUBMISSION.find(
    (item) => item.questionId === problemId
  );

  if (existingSubmission) {
    existingSubmission.submissionData.push(userAnswerObj);
    existingSubmission.totalSubmissions++;
  } else {
    SUBMISSION.push({
      id: generateRandomId(),
      questionId: problemId,
      submissionData: [userAnswerObj],
      totalSubmissions: 1,
    });
  }

  res.send({
    statusCode: 200,
    message: "Submitted successfully",
  });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/admin/add-question", function (req, res) {
  // add the problem to the QUESTIONS array
  const body = req.body;
  if (currentUser && currentUser.role === "admin") {
    const newQuestion = {
      id: generateRandomId(),
      title: body.title,
      description: body.description,
      testCases: body.testCases,
    };
    QUESTIONS.push(newQuestion);
    res.send({
      statusCode: 200,
      message: "Added successfully",
      questions: QUESTIONS,
    });
  } else {
    res.send({ statusCode: 401, message: "Please login as admin" });
    return;
  }
});

app.listen(port, function () {
  console.log(`Leetcode is listening on port ${port}`);
});
