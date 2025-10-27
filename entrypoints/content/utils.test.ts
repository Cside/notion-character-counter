import { countCharacters, countWords } from "./utils";

describe(`${countWords.name}()`, () => {
  test.each([
    { input: "a", expected: 1 },
    { input: "a a", expected: 2 },
    { input: "Hi, John.", expected: 2 },
    { input: "( Hello, world ! )", expected: 2 },
    { input: "one, 2", expected: 2 },
    { input: "one & two", expected: 3 },
    { input: "null@null.com", expected: 1 },
    { input: "漢字　漢字", expected: 2 },
    { input: "안녕하세요", expected: 1 },
    { input: " a 　a　", expected: 2 },
    { input: "🇲🇽", expected: 1 },
  ])("$input -> $expected", ({ input, expected }) =>
    expect(countWords(input)).toBe(expected)
  );
});

describe(`${countCharacters.name}()`, () => {
  test.each([
    { input: "a", expected: 1 },
    { input: "a a", expected: 3 },
    { input: "Hi, John. (foo bar)", expected: 19 },
    { input: "漢字　漢字", expected: 5 },
    { input: "안녕하세요", expected: 5 },
    { input: " a 　a　", expected: 6 },
    { input: "🇲🇽", expected: 1 },
  ])("$input -> $expected", ({ input, expected }) =>
    expect(countCharacters(input)).toBe(expected)
  );
});
