## Clicks
This program reads the input from `input.json` which is the array of clicks, it then returns the array of clicks containing the maximum amount per hour per click. It stores the result in `resultset.json`

## Setup
Run the folllowing commands:
1. `npm install`
2. `npm run solution` will run the code and produce the resultset.json
3. `npm run test` will run tests

## Scripts
### npm run solution
This reads the input from `input.json` and processes the clicks and produces the most expensive clicks per hour per ip. It writes the output into `resultset.json`

### npm run test
This runs the test cases using mocha.

## Assumptions
I have assumed that the array contains the timestamps for one day, it does not take into account if there are clicks for multiple days.

## Libraries Used
1. Mocha and Chai for running tests.
2. file-system for reading and writing files.