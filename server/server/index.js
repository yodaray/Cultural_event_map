// run `node index.js` in the terminal

const express = require('express');
const app = express();
var mongoose = require('mongoose');
const cors = require("cors");
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
//const Bcrypt = require("bcryptjs");
const fetch = require('node-fetch');
const XMLconvert = require('xml-js');
const fs = require('fs');
const location_dict = require('./location_dictionary.json');

// Global variables and environment variables
const DATABASE = "mongodb://127.0.0.1:27017/Project";
const PORT = 4000;
const XML = "https://www.lcsd.gov.hk/datagovhk/event/events.xml";

function extractPriceValue(str) {
  const regex = /\$(\d+)/;
  const match = str.match(regex);
  if (match) {
    const price = parseInt(match[1]);
    return price;
  }
  return 0;
}

// DB Connection
mongoose.connect(DATABASE);
const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', async function () {
  console.log("Connection is open...");

  // Schemas
  const UserSchema = mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    userAc: { type: String, required: true, minLength: 3, maxLength: 21, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
  });
  const User = mongoose.model('User', UserSchema);

  const CommentSchema = mongoose.Schema({
    commentId: { type: Number, required: true, unique: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, Default: new Date() },
    content: { type: String, required: true },
  });
  const Comment = mongoose.model('Comment', CommentSchema);

  const EventSchema = mongoose.Schema({
    eventId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    date: { type: String, required: true },
    description: { type: String },
    presenter: { type: String, required: true },
    price: { type: String, required: true },
    priceNum: { type: Number, required: true }
  });
  const Event = mongoose.model('Event', EventSchema);

  const LocationSchema = mongoose.Schema({

    locationId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  });
  const Location = mongoose.model('Location', LocationSchema);


  //Upload the dataset to the mongodb
  const location_jsonData = fs.readFileSync('Project.locations.json', 'utf8');
  const location_info = JSON.parse(location_jsonData);
  const user_jsonData = fs.readFileSync('Project.users.json', 'utf8');
  const user_info = JSON.parse(user_jsonData);
  const event_jsonData = fs.readFileSync('Project.event.json', 'utf8');
  const event_info = JSON.parse(event_jsonData);
  const comment_jsonData = fs.readFileSync('Project.comments.json', 'utf8');
  const comment_info = JSON.parse(comment_jsonData);
  try {
    // Remove any existing documents in the  collection
    await Location.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});
    await Event.deleteMany({});

    // Create new documents based on the data and save them to the Location collection
    await Location.insertMany(location_info);
    console.log("Location data uploaded successfully!");
    await User.insertMany(user_info);
    console.log("User data uploaded successfully!");
    await Comment.insertMany(comment_info);
    console.log("Comment data uploaded successfully!");
    await Event.insertMany(event_info);
    console.log("Event data uploaded successfully!");


  } catch (error) {
    console.error(`Error uploading data: ${error}`);
  }

  // End of schema

  // Main
  // Handling user authentication
  app.post('/AuthenticateUser', async (req, res) => {
    try {
      let validated = false;
      console.log(req.body.UserAc);
      const result = await User.findOne({ userAc: req.body.UserAc }); //finding the user in the database under User collection

      if (result !== null && req.body.UserPw === result.password) {
        validated = true; //checking the user id and password
      }

      if (validated) {
        const output = {
          UserName: result.name,
          Admin_Status: result.isAdmin,
          UserAc: result.userAc,
          Login_Status: true
        };
        res.json(output); //return the user credentials
      } else {
        res.json({ Login_Status: false });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred.' }); // catch the error
    }
  });

  //Register a user to the system
  app.post('/RegisterUser', async (req, res) => {
    try {
      // Find the maximum userId by sorting in descending order and retrieving the first user
      const userWithMaxId = await User.findOne().sort('-userId').exec();

      let new_userId;
      if (userWithMaxId === null) {
        // If there are no users currently, set the new userId as 1
        new_userId = 1;
      } else {
        // Set the new userId as the maximum userId plus 1
        new_userId = userWithMaxId.userId + 1;
      }

      // Check if a user with the same userAc already exists
      const existingUser = await User.findOne({ userAc: req.body.uId }).exec();
      console.log(existingUser);
      let pwL = req.body.uPw.length;
      let acL = req.body.uId.length;

      if (existingUser) {
        // Make sure userAc is unique
        res.status(400).set('Content-Type', 'text/plain').send('Account Name ' + req.body.uId + ' already exists.');
        return;
      } else if (acL > 20 || acL < 4) {
        // Check if userAccount is within 4-20 characters
        res.status(400).set('Content-Type', 'text/plain').send('User Account length should be within 4-20 characters. Please check again');
        return;
      } else if (pwL > 20 || pwL < 4) {
        // Check if password is within 4-20 characters
        res.status(400).set('Content-Type', 'text/plain').send('Password length should be within 4-20 characters. Please check again');
        return;
      }

      // Create a new user object with the provided data
      const new_user = new User({
        userId: new_userId,
        userAc: req.body.uId,
        password: req.body.uPw,
        name: req.body.uId,
        isAdmin: false, // User is not an admin
        favorites: [""],
      });

      // Save the new user to the database
      await new_user.save();

      res.json({ message: 'User registered!' });
    } catch (error) {
      res.status(500).send('Cannot Save!');
    }
  });


  // Parse data from xml
  app.all('/data', async (req, res) => {
    try {
      const response = await fetch(XML, { // Fetch XML data from the specified URL
        method: 'GET',
        headers: {
          'Content-Type': 'text/xml',
          'User-Agent': '*'
        },
      });
      const xml = await response.text(); // Extract the XML response as text
      console.log("Receiving");
      let jsonOutput = XMLconvert.xml2json(xml, { compact: true, spaces: 4 }); // Convert XML to JSON
      jsonOutput = JSON.parse(jsonOutput); // Parse the JSON output
      let jEvent = jsonOutput.events.event; // Get the array of events from the JSON
      let totalC = jEvent.length; // Calculate the total number of events

      for (let i = 0; i < totalC; i++) {
        let targetLocId = jEvent[i].venueid._cdata.toString(); // Get the target location ID for the current event
        if (i % 100 == 0) console.log("Getting :" + i + "/" + totalC);

        if (location_dict[targetLocId] != null) { // Check if the target location exists in the location_dict object

          const query2 = await Event.findOne({ eventId: jEvent[i]._attributes.id }); // Check if the event already exists in the database

          if (query2 == null) { // Event does not exist, create a new event record
            let tempPrice = jEvent[i].pricee._cdata;
            if (tempPrice == null || tempPrice == undefined) {
              tempPrice = "Free";
            }

            let tempPriceNum = extractPriceValue(tempPrice);

            let tempDes = jEvent[i].desce._cdata;
            if (tempDes == null || tempDes == undefined) {
              tempDes = "";
            }

            await Event.create({ // Create a new event record in the database
              eventId: jEvent[i]._attributes.id,
              title: jEvent[i].titlee._cdata,
              venue: location_dict[targetLocId],
              date: jEvent[i].predateE._cdata,
              description: tempDes,
              presenter: jEvent[i].presenterorge._cdata,
              price: tempPrice,
              priceNum: tempPriceNum
            });
          }
          else { // Event already exists, update the existing event record
            let tempPrice = jEvent[i].pricee._cdata;
            if (tempPrice == null || tempPrice == undefined) {
              tempPrice = "Free";
            }

            let tempPriceNum = extractPriceValue(tempPrice);

            let tempDes = jEvent[i].desce._cdata;
            if (tempDes == null || tempDes == undefined) {
              tempDes = "";
            }

            await Event.findOneAndUpdate({ eventId: jEvent[i]._attributes.id }, { // Update the existing event record in the database
              eventId: jEvent[i]._attributes.id,
              title: jEvent[i].titlee._cdata,
              venue: location_dict[targetLocId],
              date: jEvent[i].predateE._cdata,
              description: tempDes,
              presenter: jEvent[i].presenterorge._cdata,
              price: tempPrice,
              priceNum: tempPriceNum
            });
          }
        }
      }

      console.log("Finished");
      res.send("DONE"); // Send a response indicating that the process is done
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred."); // Send a 500 status code response if an error occurs
    }
  });

  app.all('/GetEvent', (req, res) => {
    Event.find({}, (err, event) => { // Find all events in the database
      if (err) {
        console.log(err); // Log any errors that occur during the database query
        res.status(500).send("An error occurred.");
      } else {
        res.send(event);
      }
    });
  });

  app.all('/GetLocation', (req, res) => {
    Location.find({}, (err, location) => { // Find all locations in the database
      if (err) {
        console.log(err); // Log any errors that occur during the database query
        res.status(500).send("An error occurred.");
      } else {
        res.send(location);
      }
    });
  });

  app.all('/GetFavorite/:userAc', (req, res) => {
    console.log(req.params['userAc']); // Log the value of the 'userAc' parameter received in the request
    User.findOne({ userAc: req.params['userAc'] })
      .populate("favourites")
      .exec((err, datas) => {
        if (err) {
          console.log(err); // Log any errors that occur during the database query
          res.status(500).send("An error occurred."); // Send a 500 status code response if an error occurs
        } else {
          let str = [];
          for (let i = 0; i < datas.favourites.length; i++) {
            let key = datas.favourites[i].locationId;
            let obj = {};
            obj[key] = datas.favourites[i].name;
            obj["locationId"] = datas.favourites[i].locationId;
            obj["name"] = datas.favourites[i].name;
            obj["_id"] = datas.favourites[i]._id;
            str.push(obj);
          }
          res.send(str); // Send the modified 'str' array as the response
        }
      });
  });

  app.get('/GetComment/:locationId', (req, res) => {
    let req_locationId = req.params['locationId']; // Retrieve the value of the 'locationId' parameter from the request
    console.log(req_locationId); // Log the value of 'req_locationId'

    if (req_locationId != null && req_locationId != undefined) {
      Location.findOne({ locationId: req_locationId }).exec(function (err, loc) {
        if (err) {
          console.log(err); // Log any errors that occur during the database query
          res.status(500).send("An error occurred.");
        } else {
          Comment.find({ location: loc._id })
            .populate('author')
            .exec(function (err, comment) {
              if (err) {
                console.log(err); // Log any errors that occur during the database query
                res.status(500).send("An error occurred.");
              } else {
                let list = "[\n";
                for (let i = 0; i < comment.length; i++) {
                  let str =
                    '{\n"name": "' +
                    comment[i].author.name +
                    '",' +
                    '\n"content": "' +
                    comment[i].content +
                    '",' +
                    '\n"date": "' +
                    comment[i].date +
                    '"\n}';
                  if (i < comment.length - 1) str += "\n,";
                  list += str + "\n";
                }
                list += "]";
                res.send(list); // Send the formatted list of comments as the response
              }
            });
        }
      });
    }
  });

  app.put('/GetComment/:locationId', (req, res) => {
    let req_author = req.body['author']; // Get the username from the request body
    let req_location = req.body['location']; // Get the location ID from the request body
    let req_content = req.body['content']; // Get the comment content from the request body

    let new_commentId;
    Comment.findOne().sort('-commentId').exec(function (err, cm) {
      if (err) {
        res.status(500).send("An error occurred.");
      } else if (cm == null) {
        new_commentId = 1; // Set the new comment ID as 1 if no comment exists currently
      } else {
        new_commentId = cm.commentId + 1;
      }

      User.findOne({ userAc: req_author }).exec(function (err, user) { // Find the user with the matching username
        if (err) {
          res.status(500).send("An error occurred.");
        } else {
          Location.findOne({ locationId: req_location }).exec(function (err, loc) { // Find the location with the matching location ID
            if (err) {
              res.status(500).send("An error occurred.");
            } else {
              Comment.create({
                commentId: new_commentId,
                location: loc._id,
                author: user._id,
                content: req_content,
                date: new Date()
              }, function (err, comment) { // Create a new comment with the provided data
                if (err) {
                  res.status(500).send("An error occurred.");
                } else {
                  res.send("OK!"); // Send a success response if the comment is created successfully
                }
              });
            }
          });
        }
      });
    });
  });

  app.post('/Create/Event', async (req, res) => {
    try {
      // Check if the same event id is taken
      const existingEvent = await Event.findOne({ eventId: req.body['EventId'] }).exec();
      if (existingEvent) {
        res.status(400).send(`Event ID ${req.body['EventId']} already exists.`);
        return;
      }
      // Find the location with the specified locationId
      const loc = await Location.findOne({ locationId: req.body['LocationId'] }).exec();
      if (!loc) {
        res.status(404).send(`Location with ID ${req.body['LocationId']} is not found.`);
        return;
      }
      // Create a new event object 
      const new_event = new Event({
        eventId: req.body['EventId'],
        title: req.body['Title'],
        venue: loc._id,
        date: req.body['Date'],
        description: req.body['Description'],
        presenter: req.body['Presenter'],
        price: req.body['Price'],
        priceNum: extractPriceValue(req.body['Price'])
      });

      // Save the new event to the database
      await new_event.save();

      res.status(201).send("Event created successfully!");
    } catch (error) {
      res.status(500).send('Error: cannot save');
    }
  });

  app.post('/Create/Location', async (req, res) => {
    try {
      // Check if the same locationId is already taken
      const existingLocation = await Location.findOne({ locationId: req.body['LocationId'] }).exec();
      if (existingLocation) {
        res.status(400).send(`Location ID ${req.body['LocationId']} already exists.`);
        return;
      }

      // Create a new location object
      const new_location = new Location({
        locationId: req.body['LocationId'],
        name: req.body['Name'],
        coordinates: { lat: req.body['Latitude'], lng: req.body['Longitude'] }
      });

      // Save the new location to the database
      await new_location.save();

      res.status(201).send("Location created successfully!");
    } catch (error) {
      res.status(500).send('Error: cannot save');
    }
  });

  app.post('/Create/User', async (req, res) => {
    try {
      // Find the maximum userId by sorting in descending order and retrieving the first user
      const userWithMaxId = await User.findOne().sort('-userId').exec();

      let new_userId;
      if (userWithMaxId === null) {
        // If there are no users currently, set the new userId as 1
        new_userId = 1;
      } else {
        // Set the new userId as the maximum userId plus 1
        new_userId = userWithMaxId.userId + 1;
      }

      // Check if a user with the same userAc already exists
      const existingUser = await User.findOne({ userAc: req.body['UserAc'] }).exec();

      let pwL = req.body['Password'].length;
      let acL = req.body['UserAc'].length;

      if (existingUser) {
        // Make sure userAc is unique
        res.status(400).set('Content-Type', 'text/plain').send('Account Name ' + req.body['userAc'] + ' already exists.');
        return;
      } else if (acL > 20 || acL < 4) {
        // Check if userAccount is within 4-20 characters
        res.status(400).set('Content-Type', 'text/plain').send('User Account length should be within 4-20 characters. Please check again');
        return;
      } else if (pwL > 20 || pwL < 4) {
        // Check if password is within 4-20 characters
        res.status(400).set('Content-Type', 'text/plain').send('Password length should be within 4-20 characters. Please check again');
        return;
      }

      // Create a new user object with the provided data
      const new_user = new User({
        userId: new_userId,
        userAc: req.body['UserAc'],
        password: req.body['Password'],
        name: req.body['UserName'],
        isAdmin: false, // User is not an admin
        favorites: [""],
      });

      // Save the new user to the database
      await new_user.save();

      res.set('Content-Type', 'text/plain').status(201).send("User created successfully!");
    } catch (error) {
      res.status(500).send('Cannot Save!');
    }
  });

  //READ Event
  app.get('/Read/Event/:eventId', async (req, res) => {
    try {
      // Find the event with the given eventId and populate the "venue" field
      const event = await Event.findOne({ eventId: req.params['eventId'] })
        .populate("venue")
        .exec();
      if (!event) {
        res.status(404).set('Content-Type', 'text/plain').send("Event ID " + req.params['eventId'] + " not found!");
      } else {
        // If event is found, send the venue information in the response
        res.set('Content-Type', 'text/plain').send(event.venue);
      }
    } catch (error) { res.status(500).send('Error occurred while retrieving event.'); }
  });

  //READ related events with locationId
  app.get('/Read/Location/:locationId', async (req, res) => {
    try {
      // Find the location with the given locationId
      const location = await Location.findOne({ locationId: req.params['locationId'] }).exec();
      if (!location) {
        // If location is not found or undefined, send a 404 response
        res.status(404).set('Content-Type', 'text/plain').send("Location not found!");
      } else {
        // Find events associated with the location
        const events = await Event.find({ venue: location._id }).exec();
        if (!events) {
          // If events are not found or undefined, send a 404 response
          res.status(404).set('Content-Type', 'text/plain').send("No events found for the location!");
        } else {
          // Send the events in the response
          res.set('Content-Type', 'text/plain').send(events);
        }
      }
    } catch (error) { res.status(500).send('Error occurred while retrieving location and associated events.'); }
  });

  //READ User
  app.get('/Read/User/:userAc', async (req, res) => {
    try {
      // Find the user with the given userAc
      const user = await User.findOne({ userAc: req.params['userAc'] }).exec();
      if (!user) {
        // If user is not found or undefined, send a 404 response
        res.status(404).set('Content-Type', 'text/plain').send("User not found!");
      } else {
        // Send the user information in the response
        res.set('Content-Type', 'text/plain').send(user);
      }
    } catch (error) { res.status(500).send('Error occurred while retrieving user.'); }
  });

  //Update Event
  app.post('/Update/Event', async (req, res) => {
    try {
      // Find the location with the given locationId
      const location = await Location.findOne({ locationId: req.body['locationId'] }).exec();

      if (!location) { res.status(404).set('Content-Type', 'text/plain').send('Location ID ' + req.body['locationId'] + ' does not exist.'); }
      else {
        // Find the event with the given eventId
        const event = await Event.findOne({ eventId: req.body['eventId'] }).exec();

        if (!event) { res.status(404).set('Content-Type', 'text/plain').send('Event ID ' + req.body['eventId'] + ' does not exist.'); }
        else {
          // Update the event properties
          event.title = req.body['title'];
          event.venue = location._id;
          event.date = req.body['date'];
          event.description = req.body['description'];
          event.presenter = req.body['presenter'];
          event.price = req.body['price'];
          event.priceNum = extractPriceValue(req.body['price']);
          // Save the updated event to the database
          await event.save();
          res.set('Content-Type', 'text/plain').send("Event Updated!");
        }
      }
    } catch (error) { res.status(500).send('Error occurred while updating event.'); }
  });

  //Update Location 
  app.post('/Update/Location', async (req, res) => {
    try {
      // Find the location with the given locationId
      const location = await Location.findOne({ locationId: req.body['locationId'] }).exec();

      if (!location) { res.status(404).set('Content-Type', 'text/plain').send('Location ID ' + req.body['locationId'] + ' does not exist.'); }
      else {
        // Update the location
        location.locationId = req.body['locationId'];
        location.name = req.body['name'];
        location.coordinates = { lat: req.body['latitude'], lng: req.body['longitude'] };
        // Save the updated location to the database
        await location.save();
        res.set('Content-Type', 'text/plain').send("Location Updated!");
      }
    } catch (error) { res.status(500).send('Error occurred while updating location.'); }
  });

  //Update User
  app.post('/Update/User', async (req, res) => {
    try {
      // Find the user with the given userAc
      const user = await User.findOne({ userAc: req.body['userAc'] }).exec();
      const pwL = req.body['password'].length;

      if (!user) {
        // If user is not found or undefined, send a 404 response
        res.status(404).set('Content-Type', 'text/plain').send("User ID " + req.body['userAc'] + " does not exist.");
      } else if (pwL > 20 || pwL < 4) {
        // If password length is not within the specified range, send a 400 response
        res.status(400).set('Content-Type', 'text/plain').send('Password length should be within 4-20. Please check again');
      } else {
        const newUser = await User.findOne({ userAc: req.body['userNewAc'] }).exec();

        if (newUser) {
          // If a user with the new username already exists, send a 404 response
          res.status(404).set('Content-Type', 'text/plain').send("This Username already exists, please try again");
        } else {
          // Update the user
          user.userAc = req.body['userNewAc'];
          user.name = req.body['name'];
          user.password = req.body['password'];
          // Save the updated user to the database
          await user.save();
          console.log("done");
          res.set('Content-Type', 'text/plain').send("User updated!");
        }
      }
    } catch (error) { res.status(500).send('Error occurred while updating user.'); }
  });

  //User change Password
  app.post('/UserPwChg', async (req, res) => {
    try {
      const { o_pw, n_pw, user_Name } = req.body;
      const search_User = await User.findOne({ userAc: user_Name }).exec();
      if (!search_User) {
        res.status(500).json({ error: 'Error occurred while changing the password for a user' });
      } else {
        const pw_in_db = search_User.password;
        if (pw_in_db === o_pw) {
          search_User.password = n_pw

          await search_User.save();
          console.log("done");
          res.json({ message: 'Password updated!' });
        }
      }

    } catch (error) {
      res.status(500).json({ error: 'Error occurred while changing the password for a user' });
    }
  });

  app.post('/UserNameChg', async (req, res) => {
    try {
      const { new_name, userAc } = req.body;
      console.log(new_name, userAc);
      const search_User = await User.findOne({ userAc: userAc }).exec();
      if (!search_User) {
        res.status(500).send('Server Error : Cannot Look for a user');
      } else {
        console.log(search_User.name);
        search_User.name = new_name;
        await search_User.save();
        console.log("done");
        res.json({ message: 'nickname updated!' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error occurred while changing the password for a user' });
    }
  });

  app.post('/Delete/Event', async (req, res) => {
    try {
      const req_eventId = req.body['eventId'];
      // Find the event with the given eventId
      const event = await Event.findOne({ eventId: req_eventId }).exec();

      if (!event) { res.status(404).set('Content-Type', 'text/plain').send('Cannot find event with ID ' + req_eventId); }
      else {
        // Remove the event from the database
        await event.remove();
        res.status(200).set('Content-Type', 'text/plain').send("Event Deleted!");
      }
    } catch (error) { res.status(500).send('Error occurred while deleting event.'); }
  });

  app.post('/Delete/Location', async (req, res) => {
    try {
      const req_locationId = req.body['locationId'];
      // Find the location with the given locationId
      const location = await Location.findOne({ locationId: req_locationId }).exec();

      if (!location) { res.status(404).set('Content-Type', 'text/plain').send('Cannot find location with ID ' + req_locationId); }
      else {
        // Remove the location from the database
        await location.remove();
        res.status(200).set('Content-Type', 'text/plain').send("Location Deleted!");
      }
    } catch (error) { res.status(500).send('Error occurred while deleting location.'); }
  });

  app.post('/Delete/User', async (req, res) => {
    try {
      const req_userAc = req.body['userAc'];
      // Find the user with the given userAc
      const user = await User.findOne({ userAc: req_userAc }).exec();

      if (!user) { res.status(404).set('Content-Type', 'text/plain').send('Cannot find user with ID ' + req_userAc); }
      else {
        // Remove the user from the database
        await user.remove();
        res.status(200).set('Content-Type', 'text/plain').send("User Deleted!");
      }
    } catch (error) { res.status(500).send('Error occurred while deleting user.'); }
  });

  app.put('/AddToFavorite/:locationId', async (req, res) => {
    try {
      const req_userAc = req.body['userAc'];
      const req_locId = req.body['locationId'];
      // Find the location with the given locationId
      const locResult = await Location.findOne({ locationId: req_locId }).exec();

      // Find the user with the given userAc and check if the location is already in their favorites
      const userResult = await User.findOne({ userAc: req_userAc, favourites: locResult._id });

      if (userResult === null || userResult === undefined) {
        await User.findOneAndUpdate({ userAc: req_userAc }, { $push: { favourites: locResult._id.toString() } });
        console.log("Added");
        res.send("Add");
      } else {
        await User.findOneAndUpdate({ userAc: req_userAc }, { $pull: { favourites: locResult._id.toString() } });
        console.log("Deleted");
        res.send("Del");
      }
    } catch (error) { res.status(500).send('Error occurred while adding/removing from favorites.'); }
  });

  app.get('/AddToFavorite/:locationId', async (req, res) => {
    try {
      const req_locationId = req.params['locationId'];
      console.log(req_locationId);
      // Find the location
      const loc = await Location.findOne({ locationId: req_locationId }).exec();
      // Find all comments for the location and populate the author field
      const comments = await Comment.find({ location: loc._id }).populate('author').exec();
      let list = "[\n";
      for (let i = 0; i < comments.length; i++) {
        let str =
          '{\n"name": "' +
          comments[i].author.name +
          '",' +
          '\n"content": "' +
          comments[i].content +
          '",' +
          '\n"date": "' +
          comments[i].date +
          '"\n}';
        if (i < comments.length - 1) str += "\n,";
        list += str + "\n";
      }
      list += "]";
      res.send(list);
    } catch (error) { res.status(500).send('Error occurred while fetching comments.'); }
  });



  app.all('/*', (req, res) => {
    res.send("Server is running");
  });
})

const server = app.listen(4000);
