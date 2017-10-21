'use strict';

const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.b3d16217-aa6e-42e9-a4db-f02219b3b3bf';

const populations = require('./data/populations')
const countries_de = require('./data/countries_de')
const countries_en = require('./data/countries_en')

const handlers = {
    'LaunchRequest': function () {
        this.emit(':tell', 'Herzlich Willkommen zu Weltbevölkerungen. Du kannst mich fragen: Wieviele Einwohner hat Deutschland. Diese Frage kannst du mit einem Land deiner Wahl stellen. Probier es aus!');
    },
    'GetPopulationIntent': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        const userCountry = this.event.request.intent.slots.CountryName.value
        
        if(userCountry){
            // user country is not undefined
            const index_de = countries_de.indexOf(userCountry.toLowerCase())
            const index_en = countries_en.indexOf(userCountry.toLowerCase())
            let speechOutput = ''
            if (index_de == -1 && index_en == -1) {
                speechOutput = 'Es tut mir Leid! Ich konnte dein Land nicht finden. Versuche es erneut.';
            } else {
                let population;
                index_en == -1 ? population = populations[index_de] : population = populations[index_en]
                speechOutput = userCountry + ' hat ' + population + ' Einwohner.';
            }
            
            this.emit(':tell', speechOutput); 
        }else{
            this.emit('Unhandled')
        }
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'Du kannst sagen "Wieviele Einwohner hat..." und dann ein Land deiner Wahl. Wie kann ich dir helfen?';
        const reprompt = 'Wie kann ich dir helfen?';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Auf Wiedersehen!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Auf Wiedersehen!');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', 'Auf Wiedersehen!');
    },
    'Unhandled': function () {
        this.emit(':tell', 'Es tut mir Leid! Das habe ich nicht verstanden. Du kannst mich fragen: Wieviele Einwohner hat Deutschland. Diese Frage kannst du mit einem Land deiner Wahl stellen. Versuche es erneut.');
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
