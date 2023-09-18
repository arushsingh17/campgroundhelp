module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}//it is wrapper function for error handling the inside async function is passes as parameter which result in return  a fucntion which call the async function and any error in that function catch method is used to pass on any error to next