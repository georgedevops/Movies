
/**********************************************************************************
 * 
 *  ITE5315 – Project* I declare that this assignment is my own work in accordance with 
 * Humber Academic Policy.* No part of this assignment has been copied manually or electronically 
 * from any other source* (including web sites) or distributed to other students.** 
 * Group member 
 * Name:George Devid John Thekkineth__ Student IDs: _NO1547325___ 
 * Name:Keziah Thomas__ Student IDs: _N01541155___ 
 * Date: __12th December________************************************
 * *********************************************/
// Load environment variables from a .env file
require("dotenv").config();
//Importing required packets
var express = require("express");
var mongoose = require("mongoose");
var app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
require('crypto').randomBytes(64).toString('hex')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
var bodyParser = require("body-parser"); // parse application/x-www-form-urlencoded
const { celebrate, Joi, errors, Segments } = require("celebrate");
app.use(bodyParser.json()); // parse application/json
const flash = require("express-flash");
const session = require("express-session");
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
var database = require("./config/database");
const passport = require("passport");
// Import the initializePassport function from passport-config.js
const initializePassport = require("./config/passport-config");
initializePassport(passport, (email) => {
  console.log(email);
  Users.find({ email: email }), async (id) => Users.findById({ _id: id });
});

//importing the path module for image storing
var path = require("path");
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

//connecting to mogio db url
mongoose.connect(database.url);

//Obtaing the mongo db schema
var Movie = require("./models/movie");
var Users = require("./models/users");
// Parse URL-encoded bodies (extended: true allows for nested objects in query strings)
app.use(express.urlencoded({ extended: true }));

// Asynchronous function to establish a connection to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(database.url);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Middleware to parse URL-encoded data using the 'body-parser' library
// This middleware is used to handle data submitted through HTML forms with the 'application/x-www-form-urlencoded' format
app.use(bodyParser.urlencoded({ extended: "true" }));

//Middleware for using flash messages in Express
app.use(flash());

// Middleware for session management in Express
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport middleware for authentication
app.use(passport.initialize());

// Enable Passport to use session-based authentication
app.use(passport.session());

// Middleware to support HTTP method override (e.g., PUT, DELETE) in forms
app.use(methodOverride("_method"));

// Serve static files from the 'public' directory
app.use(express.static("./public/"));

// Set the view engine for rendering dynamic content using Handlebars
app.set("view engine", "hbs");
// Configure Handlebars as the view engine with custom helper functions
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      // Custom Handlebars helper functions.

      // Helper to truncate and append "..." to a string if it exceeds a specified length
      decriptioncut: function (string) {
        if (string === "" || string === undefined) {
          return "No description available";
        } else {
          var trimmedString = trimString(string, 40);
          return trimmedString.substring(0, 40) + "...";
        }
      },

      // Helper to truncate and append "..." to a cast string if it exceeds a specified length
      caustshots: function (string) {
        if (string != [] || string != undefined) {
          var trimmedString = trimString(string.toString(), 40);
          return trimmedString.substring(0, 40) + "...";
        } else {
          return "No cast provided";
        }
      },

      // Helper to determine the star rating category based on IMDb rating
      ibmrating: function (rating) {
        if (rating >= 8) {
          return "8";
        } else if (rating >= 6) {
          return "6";
        } else if (rating >= 4) {
          return "4";
        } else if (rating >= 2) {
          return "2";
        } else {
          return "0";
        }
      },

      // Helper to check and provide a default image if no poster is available
      checkimage: function (image) {
        if (image === "" || image === undefined) {
          return "/photo/blur.jpg";
        } else {
          return image;
        }
      },

      // Helper to set the "selected" attribute for the movie type dropdown
      isSelected: function (type) {
        if (type === "movie") {
          return "selected";
        } else {
          return "";
        }
      },

      // Helper to convert an array of languages into a comma-separated string
      languageConverstion: function (lang) {
        return (commaSeparatedString = lang.join(", "));
      },

      // Genre-specific helper functions to check and set the "checked" attribute in checkboxes
      Comedygener: function (genre) {
        if (genre && genre.indexOf("Comedy") !== -1) {
          return "checked";
        } else {
          return "";
        }
      },
      Familygener: function (genre) {
        if (genre && genre.indexOf("Family") !== -1) {
          return "checked";
        } else {
          return "";
        }
      },
      Dramagener: function (genre) {
        if (genre && genre.indexOf("Drama") !== -1) {
          return "checked";
        } else {
          return "";
        }
      },
      Scifigener: function (genre) {
        if (genre && genre.indexOf("Sci-Fi") !== -1) {
          return "checked";
        } else {
          return "";
        }
      },
      Romancegener: function (genre) {
        if (genre && genre.indexOf("Romance") !== -1) {
          return "checked";
        } else {
          return "";
        }
      },
    },
    defaultLayout: "main", // Specify the default layout file
  })
);

/**
 * Trims a string to a specified maximum length and appends "..." if it exceeds that length.
 *
 * @param {string} inputString - The input string to be trimmed.
 * @param {number} maxLength - The maximum length allowed for the string.
 * @returns {string} - The trimmed string.
 */
function trimString(inputString, maxLength) {
  if (inputString.length > maxLength) {
    return inputString.substring(0, maxLength) + "...";
  } else {
    return inputString;
  }
}





/**
 * Middleware function to check if the user is not authenticated.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
// function checkNotAuthenticated(req, res, next) {
//   const token = req.cookies.jwt;

//   // If a token is present, the user is already authenticated, so redirect to the home page
//   if (token) {
//     return res.redirect("/");
//   }

//   // If no token is present, continue to the next middleware
//   next();
// }

//Routing to home page
app.get("/", checkAuthenticated, (req, res) => {
  res.redirect("/api/movies/");
});

//Routing to log in page on pressing log out
app.get("/logout",checkAuthenticated, function (req, res) {
  // Function to logout user
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie("jwt");
    res.redirect("/login");
  });
});

//Routing to signup page while registering the user
app.get("/signup",  (req, res) => {
  res.render("signUp");
});

//Login page route
app.get("/login",  (req, res) => {
  res.render("logIn");
});

// ------------multer ------------------------
const storage = multer.diskStorage({
  destination: "./public/photo/",
  filename: function (req, file, cb) {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

//--------------multer ends-------------------

//Getting all the movies based on the page count , per page along with title if provided 
app.get(
  "/api/movies/",
  checkAuthenticated,
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().integer().min(1),
      perPage: Joi.number().integer().min(1),
      title: Joi.string().trim(),
    }),
  }),
  async (req, res) => {
    try {
      const { page, perPage, title } = req.query;

      // Convert page and perPage to integers with default values
      const pageNumber = parseInt(page, 10) || 1;
      const itemsPerPage = parseInt(perPage, 20) || 20;

      let query = {};

      // If title is provided, add it to the query
      if (title) {
        query.title = { $regex: new RegExp(title, "i") };
      }

      // Fetch movies based on the query parameters
      const movies = await Movie.find(query)
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage);

      res.render("dashboard", {
        page: pageNumber,
        perPage: itemsPerPage,
        total: await Movie.countDocuments(query),
        movies: movies,
        title: title ? title : "All",
        type: "all",
        users: req.user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).render("404");
    }
  }
);

//Display the list of all the movie added by the user by passing the user id 
app.get(
  "/mylist/:id",
  checkAuthenticated,

  async (req, res) => {
    try {
      const id = req.params.id;
      // Fetch movies based on the query parameters
      const movies = await Movie.find({ authorid: id });

      const isSameAuthor = req.user._id == movies.authorid ? true : false;

      res.render("mylist", {
        movies: movies,
        title: "All",
        users: req.user,
        isAuther: isSameAuthor,
      });
    } catch (error) {
      console.error(error);
      res.status(500).render("404");
    }
  }
);

//Getting all the movie list based on the provided type 
app.get(
  "/api/movies/type",
  checkAuthenticated,
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().integer().min(1),
      perPage: Joi.number().integer().min(1),
      type: Joi.string().trim(),
    }),
  }),
  async (req, res) => {
    try {
      const { page, perPage, type } = req.query;

      // Convert page and perPage to integers with default values
      const pageNumber = parseInt(page, 10) || 1;
      const itemsPerPage = parseInt(perPage, 20) || 20;

      let query = {};

      // If title is provided, add it to the query
      if (type) {
        query.type = { $regex: new RegExp(type, "i") };
      }

      // Fetch movies based on the query parameters
      const movies = await Movie.find(query)
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage);

      res.render("dashboard", {
        page: pageNumber,
        perPage: itemsPerPage,
        total: await Movie.countDocuments(query),
        movies: movies,
        type: type,
        title: "All " + type,
        users: req.user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).render("404");
    }
  }
);


//Function for password validation 
function isStrongPassword(password) {
  // At least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Test the password against the regular expression
  return passwordRegex.test(password);
}

/**
 * POST route for user registration.
 * Checks if the user is not authenticated, validates user input, and creates a new user account if conditions are met.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post("/signup", async (req, res) => {
  try {
    isUserExist = false;
    const user = await Users.find({ email: req.body.email });
    let message = "";
    if (user == null || undefined || user.length === 0) {
      message = "";
    } else {
      message = "User Already Exit";
    }
    if (!isStrongPassword(req.body.password)) {
      message = "Check the password Criteria";
    }

    const hashedPasword = await bcrypt.hash(req.body.password, 10);
    if (message.length === 0) {
      Users.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPasword,
      });
      res.redirect("/login");
    } else {
      res.render("signUp", {
        error: message,
        name: req.body.name,
        email: req.body.email,
      });
    }
  } catch {
  
    res.redirect("/signup");
  }
});

function checkAuthenticated(req, res, next) {
  const token = req.cookies.jwt;
  console.log("tocken value " + token)
  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log("tocken verification is done")
    if (err) {
      console.log("error with verify ")
      return res.redirect('/login');
    }

     // Set the user in the request object
    next();
  });
}


/**
 * POST route for user login.
 * Checks if the user is not authenticated, authenticates the user using passport-local strategy,
 * and redirects based on the authentication result.
 * If authentication is successful, it issues a JWT token, sets it as a cookie, and redirects to the home page.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

app.post(
  "/login", 
  passport.authenticate("local", {
    successRedirect: "/setTocken",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    console.log("req.user");
   
    const username = "aggs@gan.com"
    const user = { name : username }
    //const token = jwt.sign(user, process.env.JWT_SECRET);
    const token= "IdzrtmFYVu5B9MF"
     console.log(token);
    res.cookie('jwt', token, { httpOnly: true });

    res.redirect("/");
  }
);

app.get("/setTocken",  (req, res) => {
  const token = jwt.sign({ id: req.user._id, username: req.user.email }, process.env.JWT_SECRET);   
  console.log(token);
  res.cookie('jwt', token, { httpOnly: true });
  res.redirect("/");
});


/**
 * Middleware function to verify the presence of a valid JWT token in the request headers.
 * It extracts the token from the "Authorization" header, checks its existence, and sets it in the request object.
 * If the token is not present, it sends a 403 Forbidden status.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function to pass control to the next middleware.
 */


//Display the details of the a particular movie
app.get("/api/movies/:id", checkAuthenticated, async (req, res) => {
  try {
    const movieId = req.params.id;

    // Find the movie by _id
    const movie = await Movie.findById(movieId);

    // Check if the movie exists
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Return the movie object
    console.log(movie);
    const isSameAuthor =
      req.user._id == movie.authorid ? "isauther" : "isNotauther";
    console.log(req.user._id + "   " + movie.authorid);
    console.log(isSameAuthor);
    res.render("view", {
      movies: movie,
      users: req.user,
      isAuther: isSameAuthor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("404");
  }
});

/**
 * PUT endpoint to update movie details based on the provided movie ID.
 * Requires authentication using the `checkAuthenticated` middleware.
 *
 * @param {Object} req - Express request object containing movie details to be updated.
 * @param {Object} res - Express response object.
 */
app.put("/api/movies/:id", checkAuthenticated, async (req, res) => {
  console.log("hh");
  try {
    const movieId = req.params.id;

    var languagesArray = req.body.languages.split(",");
    var castArray = req.body.cast.split(",");

    // Split the string using the hyphen as a delimiter
    var parts = req.body.date.split("-");

    // Extract the year (the first part after splitting)
    var year = parts[0];
    const resultArray = { rating: req.body.rating };
    console.log(req.body);
    var data = {
      plot: req.body.plot,
      genres: req.body.genre,
      runtime: req.body.runtime,
      cast: castArray,
      title: req.body.title,
      languages: languagesArray,
      year: year,
      imdb: resultArray,
      type: req.body.type,
    };

    const updatedMovie = await Movie.findByIdAndUpdate(movieId, data, {
      new: true,
    });

    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.redirect("/api/movies/" + movieId);
  } catch (error) {
    console.error(error);
    res.status(500).render("404");
  }
});

/**
 * POST endpoint to add a new movie or update an existing movie based on the provided movie ID.
 * Requires authentication using the `checkAuthenticated` middleware.
 *
 * @param {Object} req - Express request object containing movie details to be added or updated.
 * @param {Object} res - Express response object.
 */

app.post("/api/movies/:id", checkAuthenticated, async (req, res) => {
  console.log("hh");
  try {
    const movieId = req.params.id;

    var languagesArray = req.body.languages.split(",");
    var castArray = req.body.cast.split(",");

    // Split the string using the hyphen as a delimiter
    var parts = req.body.date.split("-");

    // Extract the year (the first part after splitting)
    var year = parts[0];
    const resultArray = { rating: req.body.rating };
    console.log(req.body);
    var data = {
      plot: req.body.plot,
      genres: req.body.genre,
      runtime: req.body.runtime,
      cast: castArray,
      title: req.body.title,
      languages: languagesArray,
      year: year,
      imdb: resultArray,
      type: req.body.type,
    };

    const updatedMovie = await Movie.findByIdAndUpdate(movieId, data, {
      new: true,
    });

    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.redirect("/api/movies/" + movieId);
  } catch (error) {
    console.error(error);
    res.status(500).render("404");
  }
});

/**
 * POST endpoint to add a new movie with file upload.
 * Requires authentication using the `checkAuthenticated` middleware.
 * Utilizes `upload.single("photo")` middleware for handling file uploads.
 *
 * @param {Object} req - Express request object containing movie details and uploaded file.
 * @param {Object} res - Express response object.
 */
app.post(
  "/api/movies",
  checkAuthenticated,
  upload.single("photo"),
  async (req, res) => {
    try {
      const formFile = req.file;
      console.log(formFile);
      console.log(req.body);

      // ---------datatype convertion----------

      var languagesArray = req.body.languages.split(",");
      var castArray = req.body.cast.split(",");

      // Split the string using the hyphen as a delimiter
      var parts = req.body.date.split("-");

      // Extract the year (the first part after splitting)
      var year = parts[0];
      const resultArray = { rating: req.body.rating };

      //-------------datatype conversion---------
      Movie.create({
        plot: req.body.plot,
        genres: req.body.genre,
        runtime: req.body.runtime,
        cast: castArray,
        poster: "/photo/" + formFile.filename,
        title: req.body.title,
        languages: languagesArray,
        released: req.body.released,
        year: year,
        authorid: req.user._id,
        imdb: resultArray,
        type: req.body.type,
      });

      //  res.status(200).console.log({ message:'Movie added successfully' });
      res.redirect("/mylist/" + req.user._id);
    } catch (error) {
      console.error(error);
      res.status(500).render("404");
    }
  }
);

app.delete("/api/movies/:id", checkAuthenticated, async (req, res) => {
  try {
    const movieId = req.params.id;
    const deletedMovie = await Movie.deleteOne({ _id: movieId });

    if (!deletedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).render("404");
  }
});

app.post("/del/movies/:id", checkAuthenticated, async (req, res) => {
  try {
    const movieId = req.params.id;
    const fs = require("fs");

    const filePath = req.body.imagepath;

    // Check if the file exists before attempting to delete
    if (fs.existsSync(filePath)) {
      // Remove the file
      fs.unlinkSync(filePath);
      console.log(`File ${filePath} has been deleted.`);
    } else {
      console.log(`File ${filePath} does not exist.`);
    }
    const deletedMovie = await Movie.deleteOne({ _id: movieId });

    if (!deletedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.redirect("/mylist/" + req.user._id);
  } catch (error) {
    console.error(error);
    res.status(500).render("404");
  }
});

/**
 * GET endpoint to fetch filtered movies based on genres, page, and itemsPerPage.
 * Requires authentication using the `checkAuthenticated` middleware.
 * Utilizes request query parameters validation with the `celebrate` middleware.
 *
 * @param {Object} req - Express request object containing genres, page, and itemsPerPage.
 * @param {Object} res - Express response object.
 */
app.get(
  "/api/applyfilter/:page/:perPage",
  checkAuthenticated,
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      genres: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()).required(),
        Joi.string().trim().required()
      ),
    }),
  }),
  async (req, res) => {
    try {
      const { page, perPage } = req.params;
      const { genres } = req.query;

      // Convert page and perPage to integers with default values
      const pageNumber = parseInt(page, 10) || 1;
      const itemsPerPage = parseInt(perPage, 10) || 20;

      let query = {};

      // If genres are provided, add them to the query
      if (genres) {
        if (Array.isArray(genres)) {
          query.genres = { $in: genres.map((g) => new RegExp(g, "i")) };
        } else {
          query.genres = new RegExp(genres, "i");
        }
      }

      // Fetch movies based on the query parameters
      const movies = await Movie.find(query)
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage);

      res.render("dashboard", {
        page: pageNumber,
        perPage: itemsPerPage,
        total: await Movie.countDocuments(query),
        movies: movies,
        title: "Filtered Data",
        type: "all",
        filter: genres.toString().split(","),
        users: req.user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).render("404");
    }
  }
);


/**
 * Catch-all route for handling undefined routes, responding with a 404 status
 * and rendering the "404" view.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.all("*", (req, res) => {
  res.status(404).render("404");
});

/**
 * Connect to the MongoDB database using the connectDB function.
 * Once connected, register error handling middleware using celebrate's `errors()` function.
 * Start the Express app to listen on port 2000.
 */
connectDB().then(() => {
  app.use(errors());
  app.listen(2000, () => {
    console.log("App listening on port : " + 2000);
  });
});
