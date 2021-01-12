# Digiblock generator

## About

This static website generates NHS Digital digiblocks, and enables the user to download the result as an SVG image. The site offers an expor/import functionality, which allows users to download thei digiblock creations, and then later load them back in the application.

The project was created with Heroku in mind as a host solution, but - being a pre-compiled static website - can be hosted on any environment (Github Pages, AWS S3 bucket, Netlify ect.).

### Example compositions

The following example compositions are available in the repo:

|Name|Public URL|Source URL|
|---|---|---|
|Composition #1|[https://nhs-digital-website.github.io/nhsd-digiblock-generator/assets/images/db-comp-1.svg](https://nhs-digital-website.github.io/nhsd-digiblock-generator/assets/images/db-comp-1.svg)|[https://github.com/NHS-digital-website/nhsd-digiblock-generator/blob/gh-pages/assets/images/db-comp-1.svg](https://github.com/NHS-digital-website/nhsd-digiblock-generator/blob/gh-pages/assets/images/db-comp-1.svg)|
|Composition #2|[https://nhs-digital-website.github.io/nhsd-digiblock-generator/assets/images/db-comp-2.svg](https://nhs-digital-website.github.io/nhsd-digiblock-generator/assets/images/db-comp-2.svg)|[https://github.com/NHS-digital-website/nhsd-digiblock-generator/blob/gh-pages/assets/images/db-comp-2.svg](https://github.com/NHS-digital-website/nhsd-digiblock-generator/blob/gh-pages/assets/images/db-comp-2.svg)|
|Composition #3|[https://nhs-digital-website.github.io/nhsd-digiblock-generator/assets/images/db-comp-3.svg](https://nhs-digital-website.github.io/nhsd-digiblock-generator/assets/images/db-comp-3.svg)|[https://github.com/NHS-digital-website/nhsd-digiblock-generator/blob/gh-pages/assets/images/db-comp-3.svg](https://github.com/NHS-digital-website/nhsd-digiblock-generator/blob/gh-pages/assets/images/db-comp-3.svg)|
|Composition #4|[https://nhs-digital-website.github.io/nhsd-digiblock-generator/assets/images/db-comp-4.svg](https://nhs-digital-website.github.io/nhsd-digiblock-generator/assets/images/db-comp-4.svg)|[https://github.com/NHS-digital-website/nhsd-digiblock-generator/blob/gh-pages/assets/images/db-comp-4.svg](https://github.com/NHS-digital-website/nhsd-digiblock-generator/blob/gh-pages/assets/images/db-comp-41.svg)|

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
	
## Deployment

The deployment happens automatically using [GitHub Actions](https://github.com/features/actions). When the master branch is pushed to origin, GitHub automatically builds and deploys the latest version of the site, and hosts it on GitHub pages. The URL is [https://nhs-digital-website.github.io/nhsd-digiblock-generator/](https://nhs-digital-website.github.io/nhsd-digiblock-generator/).

## Developer notes

This project was created using [Sprint UI](https://github.com/robertpataki/sprint-ui) - a static site generator created specifically for UI work on GOVUK and NHSUK projects. For full documentation on the site generator, please refer to the [Sprint UI NHSUK Example repository](https://github.com/robertpataki/sprint-ui-nhsuk).