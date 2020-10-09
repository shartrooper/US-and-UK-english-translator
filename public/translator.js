import {
    americanOnly
}
from './american-only.js';
import {
    britishOnly
}
from './british-only.js';
import {
    americanToBritishSpelling
}
from './american-to-british-spelling.js';
import {
    americanToBritishTitles
}
from './american-to-british-titles.js';

let britishToAmericanTitles, britishToAmericanSpelling

const addCapitalLetterTitles = (object) => {
    let newObj = {
        ...object
    };
    const toUpperCaseTitle = str => {
        let newStr = str.toUpperCase();
        return newStr[0] + str.slice(1)
    };

    for (let property in object) {

        let toAdd = {};

        toAdd[toUpperCaseTitle(property)] = toUpperCaseTitle(object[property])

            newObj = {
            ...newObj,
            ...toAdd
        };
    }

    return newObj;
}

const invertKeysWithValue = (object) => {
    let newObj = {};
    for (let property in object) {
        newObj[object[property]] = property;
    }
    return newObj;
}

const translator = {
    errorMessage: '<span style="color: red;">Error: No text to translate.</span>',
    setMode: (mode, words, spelling, titles) => {
        switch (mode) {
        case "american-to-british": {
                return [words, spelling, titles, [
                        /^\d{1,2}:\d{1,2}\.?$|^\d{1,2}:\d{1,2} | \d{1,2}:\d{1,2}[ \.]?| \d{1,2}:\d{1,2}[ \.]?$/,
                        ':',
                        '.'
                    ]
                ];
            }
        case "british-to-american": {
                return [words, spelling, titles, [
                        /^\d{1,2}\.\d{1,2}\.?$|^\d{1,2}\.\d{1,2} | \d{1,2}\.\d{1,2}[ \.]?| \d{1,2}\.\d{1,2}[ \.]?$/,
                        '.',
                        ':'
                    ]
                ];
            }
        }
    },
    handleWordsAndSpelling: (target, dictionary) => {
        for (let word in dictionary) {
            let re = new RegExp(`\\b${word}\\b`, 'gi');
            target = target.replace(re, `<span class="highlight">${dictionary[word]}</span>`);
        }
        return target;
    },
    handleTitles: (target, titles) => {
        for (let title in titles) {
            target = target.replace(title + ' ', `<span class="highlight">${titles[title]} </span>`);
        }
        return target;
    },
    handleTimeFormat: (target, regex, toReplace, replacement) => {
        while (regex.test(target)) {
            let time = target.match(regex);
            let formattedTime = time[0].replace(toReplace, replacement);
            target = target.replace(time[0], `<span class="highlight">${formattedTime}</span>`);
        }
        return target;
    },
    translate: function (target, mode, translatorDictionary) {
        if (!target)
            return this.errorMessage;
        const dictionary = this.setMode(mode, ...translatorDictionary);
        const copyUntranslatedTarget = target;
        for (let i = 0; i < 2; i++) {
            target = this.handleWordsAndSpelling(target, dictionary[i]);
        }
        target = this.handleTitles(target, dictionary[2]);
        target = this.handleTimeFormat(target, ...dictionary[3]);
        return target == copyUntranslatedTarget ? "Everything looks good to me!" : target;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const textArea = document.getElementById('text-input');
    const translatedSentence = document.getElementById("translated-sentence");
    const selected = document.getElementById("locale-select");
    const expandedAmericanToBritishTitles = addCapitalLetterTitles(americanToBritishTitles);

    britishToAmericanTitles = invertKeysWithValue(expandedAmericanToBritishTitles);
    britishToAmericanSpelling = invertKeysWithValue(americanToBritishSpelling);

    document.getElementById('translate-btn').addEventListener('click', () => {
        let toTranslateText = textArea.value;
        let translatorMode = selected.value;
        let translatorDictionary = translatorMode == "american-to-british" ?
            [americanOnly, americanToBritishSpelling, expandedAmericanToBritishTitles] :
            [britishOnly, britishToAmericanSpelling, britishToAmericanTitles];

        const translation = Object.create(translator);

        translatedSentence.innerHTML = translation.translate(toTranslateText, translatorMode, translatorDictionary);
    });

    document.getElementById("clear-btn").addEventListener('click', () => {
        textArea.value = '';
        translatedSentence.innerHTML = '';
    });

});

/*
Export your functions for testing in Node.
Note: The `try` block is to prevent errors on
the client side
 */
try {
    module.exports = {
        americanOnly,
        britishOnly,
        americanToBritishSpelling,
        americanToBritishTitles,
        translator,
        addCapitalLetterTitles,
        invertKeysWithValue
    }
} catch (e) {}
