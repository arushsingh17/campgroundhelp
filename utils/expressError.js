//this errorclass is used for throwing or sending custom type error

class ExpressError extends Error {//error is a already parent class defined in javascript
    constructor(message, statusCode) {
        super();//call the parent class contructor
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;//export anything into another file