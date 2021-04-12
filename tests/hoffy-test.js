const chai = require('chai');
const expect = chai.expect; 
const path = require('path');
require('mocha-sinon');
Object.assign(global, require(path.join(__dirname, '../src/hoffy.js')));

// use to test console output while still allowing console.log
// to _actually_ output to screen
// source: http://stackoverflow.com/a/30626035
function mockConsoleOutput() {
    const log = console.log;
    this.sinon.stub(console, 'log').callsFake(function(...args) {
        return log(...args);
    });
}
function mockParseInt() {
    const oldParseInt = parseInt
    this.sinon.stub(global, 'parseInt').callsFake(function(...args) {
        return oldParseInt(...args);
    });
}
describe('hoffy', function() {

    describe('makeSet', function() {
        it("removes duplicate values", () => {
            expect(makeSet(1, 2, 2, 3, 1)).to.have.members([1,2,3]);
        });
        it("does not remove values if all values are unique", () => {
            expect(makeSet(1, 2, 4, 3, 5)).to.have.members([1,2,4,3,5]);
        });
        it("removes multiple duplicate values", () => {
            expect(makeSet(1, 2, 4, 3, 2, 5, 3, 7, 2)).to.have.members([1,2,4,3,5,7]);
        });
    });

    describe('findIndex', function() {
        it("returns the indices of all values matching the value passed in using the compare function where the compare function is simply === ", () => {
            expect(findIndex([1, 2, 4, 3, 5], 2, (a, b) => a === b)).to.have.members([1]);
        });
        it("returns the index of all values matching the value passed in using the compare function where the compare function mimics a naive absolute value implementation", () => {
            expect(findIndex([-3, -2, -1, 0, 1, 2, 4, 3, 5], 2, (a, b) => -a === b || a === b)).to.have.members([1, 5]);
        });
        it("returns -1 in an Array if no values match using the compare function", () => {
            expect(findIndex([-3, -1, 0, 1, 4, 3, 5], 2, (a, b) => -a === b || a === b)).to.have.members([-1]);
        });
    });

    describe("filterWith", () => {
        it("returns new function that takes Array and filters with provided function, test even", () => {
            function even(n) {return n%2 === 0;}
            const filterWithEven = filterWith(even);
            expect(filterWithEven([1, 2, 4, 3])).to.have.members([2, 4]);
        });
        it("returns new function that takes Array and filters with provided function, not isNaN", () => {
            const nums = [1, NaN, 3, NaN, NaN, 6, 7];
            const filterNaN = filterWith(n => !isNaN(n));
            expect(filterNaN(nums)).to.have.members([1,3,6,7]);
        });
    });

    describe("intersection", () => {
        it("returns same Array if both Arrays are the same and contain one element", () => {
            expect(intersection([2], [2])).to.have.members([2]);
        });
        it("returns an empty Array if no elements match", () => {
            expect(intersection([2], [1])).to.have.members([]);
        });
        it("returns only elements that match", () => {
            expect(intersection([1, 2], [1])).to.have.members([1]);
        });
        it("returns only elements that match without duplicates", () => {
            expect(intersection([2, 1, 2, 2], [1, 2, 2])).to.have.members([1, 2]);
        });
    });

    describe('repeatCall', function() {

        beforeEach(mockConsoleOutput);

        it('calls function n times', function() {
            const n = 2;
            repeatCall(console.log, n, "Hello!");
            expect(console.log.callCount).to.equal(n);
            expect(console.log.alwaysCalledWithExactly('Hello!')).to.be.true;
        });

        it('calls function n times only with first argument', function() {
            const n = 2;
            repeatCall(console.log, n, "foo", "bar", "baz", "pol");
            expect(console.log.callCount).to.equal(n);
            expect(console.log.alwaysCalledWithExactly('foo')).to.be.true;
        });
    });

    describe("constrainDecorator", () => {
        it("should allow return value within min and max to be returned as is", () => {
            const constrainedParseInt = constrainDecorator(parseInt, -10, 10);
            expect(constrainedParseInt("7")).to.be.eql(7);
        });
        it("should have a max and min that are inclusive", () => {
            const constrainedParseInt = constrainDecorator(parseInt, -10, 10);
            expect(constrainedParseInt("-10")).to.be.eql(-10);
        });
        it("sets the return value to the min value if the return value is less than min", () => {
            const constrainedParseInt = constrainDecorator(parseInt, -10, 10);
            expect(constrainedParseInt("-12")).to.be.eql(-10);
        });
        it("sets the return value to the max value if return value is greater than max", () => {
            const constrainedParseInt = constrainDecorator(parseInt, -10, 10);
            expect(constrainedParseInt("12")).to.be.eql(10);
        });
    });

    describe("limitCallsDecorator", () => {

        beforeEach(mockParseInt);

        it("gives back the same result as regular function if function invoked less than [limit] times", () => {
            const n = 3;
            const limitedParseInt = limitCallsDecorator(parseInt, n);
            expect(limitedParseInt("423")).to.be.eql(423);
            expect(parseInt.callCount).to.equal(1);
            expect(parseInt.alwaysCalledWithExactly("423")).to.be.true;
        });
        it("returns undefined once the number of function calls is greater than the limit", () => {
            const n = 3;
            const limitedParseInt = limitCallsDecorator(parseInt, n);
            expect(limitedParseInt("423")).to.be.eql(423);
            expect(limitedParseInt("423")).to.be.eql(423);
            expect(limitedParseInt("423")).to.be.eql(423);
            expect(limitedParseInt("423")).to.be.undefined;
            expect(parseInt.callCount).to.equal(3);
            expect(parseInt.alwaysCalledWithExactly("423")).to.be.true;
        });
    });

    describe("compose()", () => {

        function superCamelCase(s) {
            return s.split("").map((c, i) => (i % 2 == 0 ? c.toUpperCase() : c.toLowerCase())).join("")
        }
        function spaceText(s) {
            return s.split("").join(" ")
        }

        function addStyle(s) {
            return "~~~ " + s + " ~~~"
        }
        const aestheticFmtPipeline = compose(
            superCamelCase,
            spaceText,
            addStyle
        );

        function makeVertical(s) {
            return s.split("").join("\n")
        }

        const tallAestheticFmt = compose(aestheticFmtPipeline, makeVertical);
        it("take the return of function in pipeline and pass it in as argument to next function", () => {
            expect(aestheticFmtPipeline("hello world")).to.be.eql("~~~ H e L l O   W o R l D ~~~");
        });
        
        it("can handle nested compositions", () => {
            const expected = '~\n~\n~\n \nG\n \no\n \nO\n \nd\n \nB\n \ny\n \nE\n \n \n \nW\n \no\n \nR\n \nl\n \nD\n \n~\n~\n~';
            expect(tallAestheticFmt("goodbye world")).to.be.eql(expected);
        });
    });
});
