# Digiblock generator

## About

This static website generates NHS Digital digiblocks, and enables the user to download the result as an SVG image. The site offers an expor/import functionality, which allows users to download thei digiblock creations, and then later load them back in the application.

The project was created with Heroku in mind as a host solution, but - being a pre-compiled static website - can be hosted on any environment (Github Pages, AWS S3 bucket, Netlify ect.).

## Project installation

	$ npm i
	
## NPM commands

### Run the project locally

	$ npm run start
	
The project runs on `http://localhost:3000`
	
### Build the project for production

	$ npm run build-prod
	
### Build the project - debugging

	$ npm run build-dev
	
## Developer notes

This project was created using [Sprint UI](https://github.com/robertpataki/sprint-ui) - a static site generator created specifically for UI work on GOVUK and NHSUK projects. For full documentation on the site generator, please refer to the [Sprint UI NHSUK Example repository](https://github.com/robertpataki/sprint-ui-nhsuk).