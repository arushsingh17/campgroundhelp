
const mongoose = require('mongoose');
const Campground = require('../models/campground');
//to make the code shorter as exporting the campground model and pluss .. to go back a directory back and then move furth
const cities = require('./cities');//exporting the cities array

const { places, descriptors } = require('./seedhelpers');



mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', 
);



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));//to check whether the connection is established or not
db.once("open", () => {
    console.log("Database connected");
});
//return an random element

const seedDB = async () => {
    const sample = array => array[Math.floor(Math.random() * array.length)];
 
    await Campground.deleteMany({});
  
    for (let i = 0; i < 50; i++) {
      
      const random = Math.floor(Math.random() * 1000);
      const price = Math.floor(Math.random() * 20) + 10;
       const camp = new Campground({
        location: `${cities[random].city}, ${cities[random].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        description:
          'Lorem ipsum ...',
        price,
        image:"https://loremflickr.com/320/240/campground"//https://random.imagecdn.app/v1/image?width=500&height=150&category=nature&format=image
        
      });
      await camp.save();
    }
  };
seedDB().then(() => {
    mongoose.connection.close();
})//promises are thenable objects or they can be awaited as promises can be resolved but there resolving takes time so thats why await keyword is used to pause the fucktioning of the progrem plus assign a variable the resolved value of the promise

