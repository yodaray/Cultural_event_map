# Cultural Event Map
## User Guideline
`STEP 1`: Open `MongoDB Compass`. Under `URI` type `mongodb://localhost:27017` and click `Connect`.
<img width="1470" alt="Screenshot 2023-12-01 at 21 23 27" src="https://github.com/jonaswong1014/CSCI2720_Project/assets/107023977/fae44d15-07dd-4240-a03b-49f0a24afd2d">
<br></br>
`STEP 2`: Clcik the `+` button (near `Databases`) to set up a localhost Database.
<img width="1470" alt="Screenshot 2023-12-01 at 21 10 24" src="https://github.com/jonaswong1014/CSCI2720_Project/assets/107023977/8f452746-1ebb-4bac-92b1-2e8547f06307">
<br></br>
`STEP 3`: Enter `Database Name` with `Project` and `Collection Name` with `events`.
<img width="1470" alt="Screenshot 2023-12-01 at 21 29 23" src="https://github.com/jonaswong1014/CSCI2720_Project/assets/107023977/b64a6cb8-ccda-48f7-905d-303142ca327b">
<br></br>
`STEP 4`: Click the `+` button (near `Project`) to add the remaining collections, i.e., `comments`, `users` and `locations`.
<img width="1470" alt="Screenshot 2023-12-01 at 21 37 50" src="https://github.com/jonaswong1014/CSCI2720_Project/assets/107023977/e9d4b287-894d-41b4-831b-2eb9ae3ef6fa">
<br></br>
`STEP 5`: Under each collections, click  `ADD DATA` and `import JSON or CSV file` to import data stored in `/Database`. Notice that data for `comments`, `users` and `locations` collections need to be imported and data for `events` is optional. 
<img width="1470" alt="Screenshot 2023-12-01 at 21 43 08" src="https://github.com/jonaswong1014/CSCI2720_Project/assets/107023977/55431f43-6cc4-4ffa-8346-2c293fa2fe7b">
<br></br>
STEP 6: Download and unzip `GROUP_33.zip` file. Open the unzipped file using `Visual Studio Code`.
<br></br>
STEP 7: Under `Terminal`, click `New Terminal` to open terminal. Type in following commands seperately: 
```sh
cd react 
npm install 
npm start 
```
STEP 8: Repeat `STEP 7` to open a new terminal. Type in following commands seperately: 
```sh
cd server 
npm run serve
```
STEP 9: We offer three access accounts. 
## User Name and Password
| Username | Password |
| ------ | ------ |
| admin | admin |
| user1 | 12345678 |
| user2 | 87654321 |
> Users: Only authenticated users have access to the app’s contents. The user will be able to perform the “user actions”. 
<br></br>
>Admins: Admins will be able to perform arbitrary CRUD actions to the location data and the user data on the database.


