const express = require('express');
const {randomUUID} = require('crypto')
const exphbs = require('express-handlebars');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Create the Express app and configure key app-level settings.
const app = express();
const PORT = 8000;
const SECRET_KEY = 'exercise-lo2-secret'; //for JWT

/****************************** AUTHENTICATION MIDDLEWARE FUNCTIONS ***********************/ 

// MIDDLEWARE: reads the JWT cookie and loads the logged-in user into req.user.
// This lets templates and protected routes know who is currently authenticated.
function setRequestUserIfTokenCookieExists(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return next();
    }

    // If the browser sent a token, validate it before using the user's data.
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            // Invalid/expired token: clear it and continue without sending a redirect,
            // otherwise the request would try to respond twice.
            res.clearCookie('token');
            req.user = null;
            return next();
        }

        // Store the authenticated user on the request so other routes can access it.
        req.user = user;
        return next();
    });
}

// MIDDLEWARE: Protect routes that require an authenticated user.
// If no user object exists, send the user back to the login screen.
function authorizeCurrentUser(req, res, next) {

   // TODO: if req.user does not exist redirect to login


    next();
}


/************************** MULTER CONFIGURATION ***************************/
// Store uploaded files on disk in the public/images folder.
// The filename includes a timestamp so images don't overwrite each other.
const storage = multer.diskStorage({
  destination: './public/images/', //TODO set destination to the public images folder
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.toLowerCase())
});

// Configure file upload handling:
// - accept only image MIME types
// - limit uploads to 2 MB each
const upload = multer({
    storage,
    limits: { }, //TODO: Limit file size to 2MB
    fileFilter: (req, file, callback) => {
      //TODO: only allow images
        if (true) {
            callback(null, true);
        }else{
            callback(new Error('Only image files are allowed.'));
        }
    }
});





/******************************** DEMO DATA **************************************/
//In-memory demo data for users and uploaded images.
// In a real app, this would be stored in a database instead.
const registeredUsers = [
    { id: randomUUID(), email: 'admin@test.ca', password: '12345Pwd', displayName: 'Admin User', birthDate: '2000-01-15' }
];
const uploadedImageData = [
    { id: randomUUID(), originalName: "dev-robot.webp", fileName: "1789482123963-dev-robot.webp",  mimeType: "image/webp", size: 1378304,
        uploaderId: registeredUsers[0].id, uploadedBy: "Admin User", uploadedAt: "2026-09-15T14:22:03.963Z"},
    { id: randomUUID(), originalName: "dev-circle.webp", fileName: "1789402144962-dev-circle.webp",  mimeType: "image/webp", size: 1357824, 
        uploaderId: registeredUsers[0].id, uploadedBy: "Admin User", uploadedAt: "2026-09-14T16:09:04.962Z"},
    { id: randomUUID(), originalName: "dev-coulds.jpg", fileName: "1789322144961-dev-clouds.jpg",  mimeType: "image/jpeg", size: 63190, 
        uploaderId: registeredUsers[0].id, uploadedBy: "Admin User", uploadedAt: "2026-09-13T17:55:44.961Z"},        
]




/******************************** CONFIGURE HANDLEBARS *******************************/
// The custom helpers make it easier to format data in templates.
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.handlebars',
    layoutsDir: './views/layouts',
    helpers: {
        eq: (a, b) => a === b, //simple equality helper function
        formatSizeMb: (bytes) => {
            // TODO: Convert the number of bytes in Megabytes to 1 decimal place
            return (bytes/100000).toFixed(1);
        },
        formatShortDate: (dateString) => 
            (new Intl.DateTimeFormat("en-CA",
            {dateStyle: "short", timeStyle: "short",}))
            .format(new Date(dateString))
    }
});``
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');




/********************* USE SOME MIDDLEWARE on EACH REQUEST  ************************/
app.use(express.static('./public')); // make files and folder in the public folder available to the web
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//Load the authenticated user from the JWT cookie for every request.
app.use(setRequestUserIfTokenCookieExists);



/*********** HOME PAGE ************
 * URL: http://localhost:8000/
 * Home page: displays learning concepts and sample student names.
***********************************/
app.get('/', (req, res) => {
  res.render('home', {
    title: 'LO2 Demo',
    currentUser: req.user,
    // Sample student names to demonstrate how arrays are rendered in a template.
    students:[ 
      //TODO Add you team names alphabetically by first name (include First letter of Family name)
        'Riley C.',
        'Rylan W.',
        'Samuel S.'
    ]
  });
});


/*********** GET IMAGE LIST ****************
 * URL: http://localhost:8000/image-list
 * Show all uploaded images, with optional search and sorting.
 * The query string allows users to filter by text and change sort order.
***********************************/
app.get('/image-list', (req, res) => {
  // Read optional query string values for filtering and sorting.
  const { search, sort } = req.query;
  let filteredImageFiles = uploadedImageData;

  // If the user typed a search term, filter the image list before rendering it.
  if (search && search.trim().length) {
    const searchLower = search.toLowerCase();
    filteredImageFiles = uploadedImageData.filter((file) => 
      // TODO: Search in the original file name, mime type, or uploader name.
      (file.originalName.includes(searchLower) || file.mimeType.includes(searchLower) || file.uploadedBy.includes(search)) // || the other searches

    );
  }

  // Sort the results based on the URL query parameter.
  filteredImageFiles.sort((a, b) => {
    // TODO if sort is "size" sort by size, else if sort is "date" sort by date, defaul sort by name
    if(sort === "size"){
      return a.size - b.size;
    } else if(sort === "date"){
      return a.uploadedAt - b.uploadedAt;
    } else {
      // Default sort is alphabetical by original filename.
      return a.originalName.localeCompare(b.originalName);
    }
      
    
  });

  // Pass the filtered/sorted list into the Handlebars template.
  res.render('image-list', {
    title: 'Uploaded Images',
    currentUser: req.user,
    imageFiles: filteredImageFiles,
    // TODO: Pass the old input values for the search and sort fields.
    search: search,
    oldSort: sort
  });
});







/******************************* USER REGISTER AND LOGIN  ****************************/

/**********  REGISTER GET  ************
 * URL: http://localhost:8000/register
 * Registration page renders the shared account form in register mode.
***********************************/
app.get('/register', (req, res) => {
  res.render('account-forms',  // handlebar template with both register and login forms
  {
    title: 'Register',
    currentUser: req.user,
    isRegister: true // show the register form instead of the login form
  });
});

/*********  REGISTER POST ************
 * URL: http://localhost:8000/register
 * Validate registration fields before creating a new user.
 * This checks email uniqueness, password length, display name, and age requirement.
***********************************/
app.post('/register',
  [
    // Validate the email, normalize it, and make sure it is not already in use.
    body('email').isEmail().withMessage('Email is invalid.')
    .normalizeEmail() //sanitize email address
    .custom((value) => {
      const emialExists = true // TODO: check if email already exists in registeredUsers
      if (emialExists) {
        throw new Error('This email is already registered.');
      }
      return true;
    }),
    // Password must be at least 6 characters long.
    body('password').isStrongPassword() //TODO: do not require symbols in password
    .withMessage('Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.'),
    // Display name cannot be empty.
    body('displayName').notEmpty().withMessage('Display name is required.'),
    // Birth date must be valid and the user must be at least 13 years old.
    body('birthDate')
      .isISO8601().withMessage('Birthdate must be a valid date.')
      .custom((inputDate) => {
        const birthDate = new Date(inputDate);
        const minDate = new Date();
        // TODO:  figure out min date from 13 years ago,
        //  if birthdate is greater than min date throw new error " must be at least 13 years old"
        return true;
      })
  ],
  (req, res) => {
    // Collect any validation errors produced by the checks above.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Re-render the registration form so the user can correct the invalid input.
      return res.render('account-forms', // handlebar template with both register and login forms
        {
          title: 'Register',
          currentUser: req.user,
          isRegister: true, // show the register form instead of the login form
          errors: errors.array(),
          oldInput: req.body
      });
    }
 
    // Create the user object and assign a unique ID before saving it.
    const userInfo = {...req.body,  id: randomUUID()}
    console.log('New User:', userInfo);
    
    // Add the new user to the in-memory users list.
    registeredUsers.push(userInfo);
    console.log('registeredUsers:', registeredUsers);

    // Once registered, send the user to the login page.
    res.redirect('/login');
  }
);




/*********** LOGIN GET ************
 * URL: http://localhost:8000/login
 * Login page uses the same reusable form as registration.
***********************************/
app.get('/login', (req, res) => {
    return res.render('account-forms', {
      title: 'Login',
      currentUser: req.user,
      isRegister: false //show login form instead of register form
    });
});

/*********** LOGIN  POST **********
 * URL: http://localhost:8000/login
 * Verify the credentials and issue a JWT token stored in a cookie.
***********************************/
app.post('/login', (req, res) => {
  // Pull the submitted form values from the request body.
  const { email, password } = req.body;
  // Match the email and password against the registered users list.
  const user = registeredUsers.find((u) => u.email === email && u.password === password);

  if (!user) {
    // If no user matches, show the login form again with the error message.
    return res.render('account-forms', {
      title: 'Login',
      currentUser: req.user,
      isRegister: false, // show login form instead of register form
      errors: [{ msg: 'Invalid email or password.' }],
      oldInput: req.body
    });
  }

  // Create a signed JWT so the server can identify the user on future requests.
  // We remove the password from the payload before signing it.
  const token = jwt.sign({...user, password: undefined}, SECRET_KEY, { expiresIn: '1h' });
  // Save the JWT in a cookie so the browser sends it with later requests.
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 1000 });
  // Once logged in, redirect the user to the protected upload page.
  res.redirect('/upload');
});




/**********  LOGOUT  **************
 * URL: http://localhost:8000/logout
 * Log the user out by removing the auth cookie and sending them back to login.
***********************************/
app.get('/logout', (req, res) => {
  //TODO: clear the "token" cookie
  res.redirect('/login');
});


/**********************************  PROTECTED UPLOAD ROUTES ********************************/

/******** GET UPLOAD *****************
 * URL: GET http://localhost:8000/upload
 * Upload page is protected so only logged-in users can access it.
***********************************/
app.get('/upload', authorizeCurrentUser, (req, res) => {
  res.render('upload-form', {
    title: 'Upload Image',
    currentUser: req.user,
    success: false,
    uploadedFile: null,
    error: null
  });
});

/********* POST UPLOAD *****************
 * URL: POST http://localhost:8000/upload
 * Receive a single uploaded image file, validate it, and store metadata.
***********************************/
app.post('/upload', authorizeCurrentUser, upload.single('myFile'), (req, res) => {
  // Multer adds req.file when a valid file is uploaded.
  if (!req.file) {
    // If no file arrived, show the upload form again with an error message.
    return res.render('upload-form', {
      title: 'Upload Image',
      currentUser: req.user,
      success: false,
      uploadedFile: null,
      error: 'Please upload a valid image.',
    });
  }

  // Build an object with the important file metadata for display and later sorting.
  // mainly changing the lowercase properties to use camelCase
  const imageFileInfo = {
    originalName: req.file.originalname.toLowerCase(), //convert to lower csae for later sorting
    fileName: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploaderId: req.user.id,
    uploadedBy: req.user.displayName,
    uploadedAt: new Date().toISOString()
  };

  // Save this image to the in-memory list so it appears on the image gallery.
  uploadedImageData.push(imageFileInfo);
  console.log('uploadedImageData:', uploadedImageData);

  // Render the same form again, but now indicate success with the uploaded filename.
  res.render('upload-form', {
    title: 'Upload Image',
    currentUser: req.user,
    success: true,
    uploadedFile: req.file.filename,
    error: null
  });
});



/*********** Start the server *************/
app.listen(PORT, () => {
  console.log(`Exercise-LO2 running at http://localhost:${PORT}`);
});
