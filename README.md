# Conrad Connect PaaS API Demo App

This Demo Application is an example use case on how to use the Conrad Connect PaaS Api.
The project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Credentials Configuration

Before starting the application, you need to configure some valid credentials to use the API.
You can contact business.solutions@conradconnect.de to get these credentials for trying out the demo app.

Next, Open the `.env` file in the project root directory. 
Enter your credentials in the following lines

REACT_APP_API_PASSWORD=<apipassword>
REACT_APP_API_USERNAME=<apiusername>
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3010](http://localhost:3010) to view it in the browser.

The page will reload if you make edits.<br />

# Pages

## User 

In the Users Page you need to first create a user to use the demo application. You can create as many users as you want with different unique email addresses.

## Switch Login

This Page allows you to switch the currently logged in user.

## Provider

On this page you can connect different providers and brands to use with the Conrad Connect Paas API. However your browser will block most of these brands, because of CORS restrictions. There is a workaround for this situation:

Scroll down to the "paasAPIDemoProvider", which you can use for exploring the possibilites of the API. Connecting the demo provider will open another page in the browser. After confirming you should have connected the provider successfully.

## Devices

When you have connected the Demo Provider, the API will have already discovered a number of devices for it. There are different types of devices present with different properties. Some of them have small icons, for reading and changing the values. Click on these to explore and get inspiration of what could be possible with the Conrad Connect Paas API !
