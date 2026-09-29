# Exercise-LO2

One team member will submit the completed Exercise-LO2 folder WITHOUT THE NODE_MODULES FOLDER

This project is a small Express web application that demonstrates several learning outcomes
related to Node.js, Express, Handlebars, file uploads, form validation, and JWT-based authentication.


## Folder structure

```text
Exercise-LO2/
├── app.js                 # Main server and application logic
├── package.json           # Project dependencies and scripts
├── public/                # Static frontend assets
│   ├── app.css            # Styling for the pages
│   └── images/            # Uploaded image files are stored here
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── account-forms.handlebars
│   ├── home.handlebars
│   ├── image-list.handlebars
│   └── upload-form.handlebars
└── README.md              # Project documentation
```

## Main packages used

- Express
- Express Handlebars
- Express Validator
- Multer
- JSON Web Tokens (JWT)
- Cookie Parser

---

## Key middleware

### `setRequestUserIfTokenCookieExists`
- This middleware looks for a JWT in the cookie and attempts to verify it.
- If the token is valid, it loads the user into `req.user` so the app knows the current user.
- If the token is invalid or expired, it clears the cookie and continues without crashing.

### `authorizeCurrentUser`
- This middleware protects routes that should only be accessible to logged-in users.
- If `req.user` is missing, it redirects the user to the login page.

---

## Application flow

### 1. Start the app
When the server starts, Express listens on:

```text
http://localhost:8000
```

The app is created in `app.js`, where the server is configured, routes are defined, and middleware is attached.

### 2. Home page
The root route (`/`) renders the home page.

This page shows:
- a title and description
- team student names

This is a simple Handlebars page using the layout from `views/layouts/main.handlebars`.

### 3. Image gallery
The route `/image-list` displays uploaded image records.

It supports:
- searching by filename, uploader name or mime type
- sorting by size or date
- showing the output in a Handlebars template

The data comes from the in-memory array `uploadedImageData` in `app.js`.

### 4. Registration
The route `/register` renders the shared account form in registration mode.

When a user submits the registration form:
- email is validated
- password strength is checked (min 8 char , 1 upper, 1 lower, 1 digit, no synbol required ) 
- display name is required
- age is checked to confirm the user is at least 13
- duplicate emails are rejected

If validation passes, the user is added to the in-memory `registeredUsers` list and redirected to the login page.

### 5. Login
The route `/login` displays the login form.

When the form is submitted:
- the entered email and password are compared to the registered users
- if valid, a JWT token is created
- the token is stored in a cookie named `token`
- the user is redirected to `/upload`

### 6. Protected upload route
The route `/upload` is protected by `authorizeCurrentUser`.

This middleware checks whether the request has a valid logged-in user.

If no user is present, the app redirects them to `/login`.

If the user is logged in, they can:
- view the upload form
- select an image file
- submit the form

### 7. File upload handling
The upload route uses `multer` to accept a single uploaded image file.

The app checks:
- the file exists
- the file type is an image
- the file size is under the defined limit

If valid, the file is saved into `public/images`, and the file metadata is added to the in-memory image list.

### 8. Logout
The route `/logout` clears the JWT cookie and redirects the user back to `/login`.

---

## Notes

This is a learning/demo application, so the data is stored in memory rather than a real database. 
That means if the server restarts, the registered users and uploaded files are reset.

This project is designed to help students see how a full Express application can combine:
- routing
- templates
- form validation
- file uploads
- authentication
- protected pages

## Needed Fixes (Not a complete list)
- Install required packages 
(NOTE: can use nodemon, instead of node. Nodemon restarts webserver when a change is made to a file)
- Home Page: replace the students with your team members

### Image List Fixes
- image-list.handlebars: currently contains hard coded html use HandleBars #each instead 
- Image List: use handlbars helper function to format the size WHICH IS IN BYTES to display in Megabytes
- Image List: use handlbars helper function to display the date in en-CA short date and short time format
- Image List: search in the original file name, mime type, or uploader name.
- Image List: if sort is "size" sort by size, else if sort is "date" sort by date, defaul sort by name
- Image List: send the old inputs so the search form does not clear out (Hint: for the select option use the "eq" helper function)

### Register and Login Fixes
- account-form.handlebars use #if to only show either the register form or the login form (not both at the same time)
- Register Email Validator:  check if email already exists in registeredUsers
- Register Password Validator : do not require symbols (defaults: 8 char, 1 upper, 1 lower, 1 number and 1 symbol)
- Register Birthdate Validator: age is at least 13 years old (figure out today's date from 13 years ago)
- Logout: Clear the token cookie (use ressponse object)

### Upload Fixes (Protect Pages)
- Upload: fix authorizeCurrentUser to redirect to login if req.user does not exist
- Upload Multer: set destination to the public images folder
- Upload Mutler: limit file size to 2MB and only allow images
- upload-form.handlebars display the uploaded file below in an image tag
- upload-form.handlebars set the form enctype
