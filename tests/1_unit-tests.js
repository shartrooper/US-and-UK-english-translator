/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

const {
    JSDOM
} = require('jsdom');
let Translator;
let expandedAmericanToBritishTitles, britishToAmericanSpelling, britishToAmericanTitles;

suite('Unit Tests', () => {
    suiteSetup(() => {
        // Mock the DOM for testing and load Translator
        return JSDOM.fromFile('./views/index.html', {
            runScripts: 'dangerously',
            resources: 'usable'
        }).then((dom) => {
            global.window = dom.window;
            global.document = dom.window.document;

            Translator = require('../public/translator.js');
            expandedAmericanToBritishTitles = Translator.addCapitalLetterTitles(Translator.americanToBritishTitles);
            britishToAmericanTitles = Translator.invertKeysWithValue(expandedAmericanToBritishTitles);
            britishToAmericanSpelling = Translator.invertKeysWithValue(Translator.americanToBritishSpelling);
        });
    });

    suite('Object Translator', () => {

        suite('American to British English', () => {

            const getAmericanToBritishTranslation = (input) => {
                const translation = Object.create(Translator.translator);
                let translatorMode = "american-to-british";
                let translatorDictionary = [Translator.americanOnly, Translator.americanToBritishSpelling, expandedAmericanToBritishTitles];

                return translation.translate(input, translatorMode, translatorDictionary);
            }

            test('Mangoes are my favorite fruit. --> Mangoes are my favourite fruit.', done => {
                const input = 'Mangoes are my favorite fruit.';
                const output = 'Mangoes are my <span class="highlight">favourite</span> fruit.';

                const compareOutput = getAmericanToBritishTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test('I ate yogurt for breakfast. --> I ate yoghurt for breakfast.', done => {
                const input = 'I ate yogurt for breakfast.';
                const output = 'I ate <span class="highlight">yoghurt</span> for breakfast.';
                const compareOutput = getAmericanToBritishTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test("We had a party at my friend's condo. --> We had a party at my friend's flat.", done => {
                const input = "We had a party at my friend's condo.";
                const output = `We had a party at my friend's <span class="highlight">flat</span>.`;
                const compareOutput = getAmericanToBritishTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test('Can you toss this in the trashcan for me? --> Can you toss this in the bin for me?', done => {
                const input = 'Can you toss this in the trashcan for me?';
                const output = 'Can you toss this in the <span class="highlight">bin</span> for me?';
                const compareOutput = getAmericanToBritishTranslation(input);
                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test('The parking lot was full. --> The car park was full.', done => {
                const input = 'The parking lot was full.';
                const output = 'The <span class="highlight">car park</span> was full.';
                const compareOutput = getAmericanToBritishTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();

            });

            test('Like a high tech Rube Goldberg machine. --> Like a high tech Heath Robinson device.', done => {
                const input = 'Like a high tech Rube Goldberg machine.';
                const output = 'Like a high tech <span class="highlight">Heath Robinson device</span>.';
                const compareOutput = getAmericanToBritishTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test('To play hooky means to skip class or work. --> To bunk off means to skip class or work.', done => {
                const input = 'To play hooky means to skip class or work.';
                const output = 'To <span class="highlight">bunk off</span> means to skip class or work.';
                const compareOutput = getAmericanToBritishTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test('No Mr. Bond, I expect you to die. --> No Mr Bond, I expect you to die. ', done => {
                const input = 'No Mr. Bond, I expect you to die.';
                const output = 'No <span class="highlight">Mr </span>Bond, I expect you to die.';
                const compareOutput = getAmericanToBritishTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test('Dr. Grosh will see you now. --> Dr Grosh will see you now. ', done => {
                const input = 'Dr. Grosh will see you now.';
                const output = '<span class="highlight">Dr </span>Grosh will see you now.';
                const compareOutput = getAmericanToBritishTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test('Lunch is at 12:15 today. --> Lunch is at 12.15 today.', done => {
                const input = 'Lunch is at 12:15 today.';
                const output = 'Lunch is at<span class="highlight"> 12.15 </span>today.';
                const compareOutput = getAmericanToBritishTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

        });

        suite('British to American English', () => {

            const getBritishToAmericanTranslation = (input) => {
                const translation = Object.create(Translator.translator);
                let translatorMode = "british-to-american";
                let translatorDictionary = [Translator.britishOnly, britishToAmericanSpelling, britishToAmericanTitles];

                return translation.translate(input, translatorMode, translatorDictionary);
            }

            test('We watched the footie match for a while. --> We watched the soccer match for a while.', done => {
                const input = 'We watched the footie match for a while.';
                const output = 'We watched the <span class="highlight">soccer</span> match for a while.';

                const compareOutput = getBritishToAmericanTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test('Paracetamol takes up to an hour to work. --> Tylenol takes up to an hour to work.', done => {
                const input = 'Paracetamol takes up to an hour to work.';
                const output = '<span class="highlight">Tylenol</span> takes up to an hour to work.';

                const compareOutput = getBritishToAmericanTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test('First, caramelise the onions. --> First, caramelize the onions.', done => {
                const input = 'First, caramelise the onions.';
                const output = 'First, <span class="highlight">caramelize</span> the onions.';

                const compareOutput = getBritishToAmericanTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test('I spent the bank holiday at the funfair. --> I spent the public holiday at the carnival.', done => {
                const input = 'I spent the bank holiday at the funfair.';
                const output = 'I spent the <span class="highlight">public holiday</span> at the <span class="highlight">carnival</span>.';

                const compareOutput = getBritishToAmericanTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test('I had a bicky then went to the chippy. --> I had a cookie then went to the fish-and-chip shop.', done => {
                const input = 'I had a bicky then went to the chippy.';
                const output = 'I had a <span class="highlight">cookie</span> then went to the <span class="highlight">fish-and-chip shop</span>.';

                const compareOutput = getBritishToAmericanTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test("I've just got bits and bobs in my bum bag. --> I've just got odds and ends in my fanny pack.", done => {
                const input = "I've just got bits and bobs in my bum bag.";
                const output = `I've just got <span class="highlight">odds and ends</span> in my <span class="highlight">fanny pack</span>.`;

                const compareOutput = getBritishToAmericanTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test("The car boot sale at Boxted Airfield was called off. --> The swap meet at Boxted Airfield was called off.", done => {
                const input = "The car boot sale at Boxted Airfield was called off.";
                const output = 'The <span class="highlight">swap meet</span> at Boxted Airfield was called off.';

                const compareOutput = getBritishToAmericanTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test("Have you met Mrs Kalyani? --> Have you met Mrs. Kalyani?", done => {
                const input = "Have you met Mrs Kalyani?";
                const output = 'Have you met <span class="highlight">Mrs. </span>Kalyani?';

                const compareOutput = getBritishToAmericanTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test("Prof Joyner of King's College, London. --> Prof. Joyner of King's College, London.", done => {
                const input = "Prof Joyner of King's College, London.";
                const output = `<span class="highlight">Prof. </span>Joyner of King's College, London.`;

                const compareOutput = getBritishToAmericanTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

            test('Tea time is usually around 4 or 4.30. --> Tea time is usually around 4 or 4:30.', done => {
                const input = 'Lunch is at 12.15 today.';
                const output = 'Lunch is at<span class="highlight"> 12:15 </span>today.';

                const compareOutput = getBritishToAmericanTranslation(input);

                assert.equal(compareOutput, output, 'comparison must be equal');
                done();
            });

        });

    });

});
