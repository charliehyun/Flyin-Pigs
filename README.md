# Flyin-Pigs
CS 407 Senior Design Project

Members: Charlie Hyun (chyun), Jessica Yeh (yeh47), Mark Lim (lim279), Sarah Mi (mi3)

Planning to travel by plane can be a hassle. Travelers have to find airports near their departure as well as their destination. This takes up time since most flight searching includes defining which airport the traveler wants to leave from and arrive at. Locations can have many nearby airports that travelers would need to check prices for or they may not even be aware of. 

We want to create a web application that will compile airport locations within a defined radius for both departure and destination to allow travelers to find a flight with their desired needs (i.e. cheapest price, shortest time, no layovers, etc.)

The web application will have a simple and easily usable UI, immediately presenting the user with prompts for the necessary information to find the best flights, looking for departure driving radius, arrival driving radius, departure and arrival date, and some optional filters for criteria like price or total travel time.

To run the app locally:
<ol>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item
    <ol>
      <li>Indented item</li>
      <li>Indented item</li>
    </ol>
  </li>
  <li>Fourth item</li>
</ol>
  1. clone the repo
  2. create a .env in flyinPigs/server/.env with the following variables
    <ol>
      <li>a. ATLAS_URI=<Mongo URI></li>
      <li>b. EMAIL_ADDRESSS=<></li>
      <li>c. EMAIL_PASSWORD=<></li>
      <li>d. AMADEUS_KEY=<Amadeus api key></li>
      <li>e. AMADEUS_SECRET=<Amadeus api secret></li>
      <li>f. MY_SECRET=<string used for jwt token></li>
    </ol>
  3. `npm i` in flyingPigs/client
  4. `npi i` in flyingPigs/server
  5. `ng serve -o` in flyingPigs/client
  6. `npx ts-node src/server.ts` in flyingPigs/server
