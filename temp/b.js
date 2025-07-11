import assert from 'assert';
import { tokenize } from './a.js';
import {
    CommandStartsWithQuotesError,
    TokenContainsQuoteInMiddleErrror,
    CommandContainsUnpairedQuoteError
} from './a.js';

function test(description, fn) {
    try {
        fn();
        console.log(`✅ ${description}`);
    } catch (err) {
        console.error(`❌ ${description}`);
        console.error(err.message);
    }
}

// -- Valid test cases --

test('Simple space-separated tokens', () => {
    assert.deepStrictEqual(tokenize("echo hello world"), ["echo", "hello", "world"]);
});

test('Single quoted token', () => {
    assert.deepStrictEqual(tokenize("echo 'hello world'"), ["echo", "hello world"]);
});

test('Double quoted token', () => {
    assert.deepStrictEqual(tokenize('echo "hello world"'), ["echo", "hello world"]);
});

test('Mixed tokens with quotes', () => {
    assert.deepStrictEqual(tokenize('cmd "arg one" two \'arg three\''), ["cmd", "arg one", "two", "arg three"]);
});

test('Escaped quote inside word is allowed', () => {
    assert.deepStrictEqual(tokenize("say hell\\'o"), ["say", "hell\\'o"]);
});

// -- Invalid / error-producing test cases --

test('Throws if command starts with quote', () => {
    assert.throws(() => tokenize('"hello world'), CommandStartsWithQuotesError);
});

test('Throws if unescaped quote in middle of word', () => {
    assert.throws(() => tokenize("say hell'o"), TokenContainsQuoteInMiddleErrror);
});

test('Throws if quote never closed', () => {
    assert.throws(() => tokenize("echo 'hello world"), CommandContainsUnpairedQuoteError);
});

test('Throws if quote never closed at end', () => {
    assert.throws(() => tokenize("one two \"unclosed"), CommandContainsUnpairedQuoteError);
});

test('Handles multiple quoted tokens correctly', () => {
    assert.deepStrictEqual(
        tokenize("a 'b c' d \"e f\" g"),
        ["a", "b c", "d", "e f", "g"]
    );
});
