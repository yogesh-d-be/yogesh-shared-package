const mongoose = require('mongoose');

const catchAsync = (fn, useTransaction = false) => (req, res, next) => {
    let session;

    Promise.resolve().then(()=>{
        if(useTransaction){
            return mongoose.startSession().then((startedSession) => {
                session = startedSession;
                session.startTransaction();
                req.session = session;
            });
        }
    })
    .then(() => fn (req, res, next))
    .then(() => {
        if(session){
            return session.commitTransaction();
        }
    })
    .catch(async(err) => {
        if(session){
           try {
            await session.abortTransaction();
           } catch (abortError) {
            console.error("Error aborting transaction:", abortError);
           }
        }
        next(err);
    })
    .finally(()=> {
        if(session){
            return session.endSession();
        }
    })
    .catch(next);
}

module.exports = catchAsync;