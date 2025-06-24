Asteroid Watch - Earth’s Daily Asteroid Tracker

Deployment link: https://asteroid-watch-rho.vercel.app/

**How to Setup**
Make sure you have Node installed on your computer - 16.13.0 or higher

Also make sure you have npm installed - 8.1.0 or hgiher

Once that is done, do the following:
1. Clone the repository in a code editor:

git clone https://github.com/amar2468/asteroid-watch.git

2. Once cloned, type the following:

cd frontend

3. Then, inside the frontend folder, type in:

npm install

4. Once done, type the following:

cd ../backend

5. Then, inside the backend folder, type in:

npm install

6. Once that is done, do this:

cd ..

7. Now, create a file in the "Backend" folder and name it .env

8. Inside the .env file, type in the following (Replacing the <YOUR API KEY> with your API key from the following website: https://api.nasa.gov/):

NASA_API_KEY=<YOUR API KEY>

**How to start the application**

1. In the terminal, make sure that you are in the "asteroid-watch" directory (where you can see the backend and frontend folders).

2. Do the following:

(a) cd backend
(b) node index.js

3. Now, while that is running, open another terminal window (within the code editor) and make sure that you are in the asteroid-watch directory. After that, type:

(a) cd frontend
(b) npm start

**How to use the application**
Once you open the web application using the URL from Vercel that is included in this readme file (at the top), you will be met with a homepage which informs you that this web application tracks Near-Earth objects. To begin, you will need to input a start and end date, because we need a date range for this API, in order to retrieve the near-earth objects within this period.

Error-checking has been added here. For instance, you cannot enter a start date that is after an end date and vice versa. Also, if the user tries to use the backspace when inputting the date, it will give an error that states that the date is invalid. 

For this API, there is a constraint where it won't allow for date ranges that exceed 7 days from the current date. This means that you can only see near-earth objects from the last 7 days or for the next 7 days.

Once you choose the dates and click the "Search" button, it will display a number of different sections. The first is just a heading that will outline the number of near-earth objects within that date range. Following that, there is a table, that can be sorted (ascending and descending order) and searched through (using the search field). The table contains the most important fields from the API.

Below that, there is a bar chart, that displays the number of near-earth objects per day. That way, you can quickly glance to see how many near-earth objects were detected on each day, without having to analyse the table.

Then, we have the hazardous/non-hazardous near-earth objects pie chart. For people who want to quickly understand if there are potentially dangerous asteroids around within the specified date range, this can be a really good way to do so.

Finally, the last 2 bar charts refer to the largest and fastest asteroids respectively, ranked in descending order.