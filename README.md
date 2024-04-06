# Lemon FakeAPI

## Eligibility Criteria

To check eligibility, we will apply the following criteria:

- Customer Consumption Class
  - Possible Values: Commercial, Residential, Industrial, Public Sector, and Rural.
  - Eligible: Commercial, Residential, and Industrial.
- Fare Modality
  - Possible Values: White, Blue, Green, and Conventional.
  - Eligible: Conventional, White.
- Minimum Customer Consumption
  - Calculation should be done using the average of the 12 most recent values from the consumption history.
    - Customers with Monophase connection type are only eligible if they have an average consumption greater than or equal to 400 kWh.
    - Customers with Biphase connection type are only eligible if they have an average consumption greater than or equal to 500 kWh.
    - Customers with Triphase connection type are only eligible if they have an average consumption greater than or equal to 750 kWh.
- To calculate the annual CO2 savings projection, consider that on average, 84kg of CO2 are emitted in Brazil to generate 1000 kWh.

## Utilized technologies

- Node.js v20
- Nest.js v10
- Swagger Docs
- Jest
- Husky

## Installation

### Docker version

Ensure that you've docker installed, then run following commands

Build application:

```
docker build -t lemon-fakepi .
```

Running application:

```
docker run -d -p 3333:3333 --name lemon-fakepi lemon-fakepi
```

<br/>

### Node version

Ensure that you've node installed in v20, then run following commands

With npm

```
npm install && npm run build
npm run start:prod
```

With yarn

```
yarn && yarn build
yarn start:prod
```
