/**
 * @description Services for operaions on request by user as client
 * @author Yash
 * @since   26/11/2018
 * @version 1.1
 */

const usermodel = require('../app/models/UserModel');
const noteModel = require('../app/models/NoteModel');
const collabModel = require('../app/models/CollabModel');

const async = require('async');

/**
 * @description notes save service
 */
exports.NoteAddService = function (req, callback) {
    // console.log('req on service', req);

    let sender = req.sender;
    async.waterfall([

        function (callback) {

            usermodel.FindOneModel(sender, (err, data) => {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, data._id);
                }
            })
        },
    ],

        function (err, result) {

            if (err) {
                return callback(err);
            }
            else {
                req.userId = result;

                noteModel.noteSaveModel(req, (err, data) => {
                    if (err) {
                        return callback(err);
                    }
                    else {

                        return callback(null, data);
                    }
                })
            }

        }
    )
}

/**
 * @description Note Generic Update Service
 */
exports.noteUpdateService = function (req, callback) {

    noteModel.noteUpdateEverythingModel(req, (err, data) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, data);
        }
    })

}

/**
 * @description Note Color Update Service
 */
exports.noteUpdateColorService = function (req, callback) {
    // console.log("req on service on note display", req);

    noteModel.noteUpdateModel(req, (err, data) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, data);
        }
    })

}

/**
 * @description Note Reminder Update Service
 */
exports.noteUpdateReminderService = function (req, callback) {
    // console.log("req on service on note display", req);

    noteModel.noteUpdateModel(req, (err, data) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, data);
        }
    })

}

/**
 * @description Note Pin Update Service
 */
exports.noteUpdatePinService = function (req, callback) {
    // console.log("req on service on note display", req);

    noteModel.noteUpdateModel(req, (err, data) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, data);
        }
    })

}

/**
 * @description Note Trash Update Service
 */
exports.noteUpdateTrashService = function (req, callback) {
    // console.log("req on service on note display", req);

    noteModel.noteUpdateModel(req, (err, data) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, data);
        }
    })

}

/**
 * @description Note Trash Update Service
 */
exports.noteDeletionService = function (req, callback) {
    // console.log("req on service on note display", req);

    noteModel.noteDeletionModel(req, (err, data) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, data);
        }
    })
}

/**
 * @description Note Title or Description Update Service
 */
exports.noteUpdateTitleDescriptionService = function (req, callback) {
    // console.log("req on service on note display", req);

    noteModel.noteUpdateModel(req, (err, data) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, data);
        }
    })

}

/**
 * @description Note Title or Description Update Service
 */
exports.noteUpdateImageService = function (reqBody, reqFile, callback) {
    // console.log("req on service on note display", req);

    noteModel.noteUpdateImageModel(reqBody, reqFile, (err, data) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, data);
        }
    })

}

/**
 * @description Note Display Service
 */
exports.NoteDisplayService = function (req, callback) {

    noteModel.noteDisplayModel(req, (err, data) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, data);
        }
    })
}


//  * @param {object} data
//  * @param {callback function} callback
//  */
exports.getCompleteNoteDataService = (req, callback) => {
    // user.findUserID(data, (err, userIDRes) => {
    //     if (err) {
    //         callback(err);
    //     }
    //     else {
    var finalNotesData = [];
    noteModel.noteDisplayModel(req, (err, data) => {
        if (err) {
            callback(err);
        } else {
            usermodel.FindOneModel(req, (error, result) => {
                if (error) {
                    callback(error);
                } else {

                    const noteOwner = {
                        name: result.name,
                        email_id: result.email_id,
                        _id: result._id
                    }

                    for (var i = 0; i < data.length; i++) {

                        var userNote = {
                            note: data[i],
                            owner: noteOwner,
                            collab: []
                        }

                        finalNotesData.push(userNote);
                    }

                    collabModel.getCollabOwnerUserId(req, (err, resultOwnerCollab) => {
                        if (err) {
                            callback(err);
                        } else {

                            for (var i = 0; i < finalNotesData.length; i++) {
                                for (var j = 0; j < resultOwnerCollab.length; j++) {

                                    if (finalNotesData[i].note._id.equals(resultOwnerCollab[j].noteID)) {
                                        finalNotesData[i].collab.push(resultOwnerCollab[j].collabUserID)
                                    }
                                }
                            }
                        }
                    })

                    collabModel.getCollabNotesUserId(req, (err, resultCollab) => {
                        if (err) {
                            callback(err);
                        } else {

                            var operations = [];
                            for (var i = 0; i < resultCollab.length; i++) {
                                operations.push((function (collabData) {

                                    return function (callback) {

                                        collabService.getDataByNoteId(collabData.noteID, (errorNote, resultNote) => {
                                            console.log("123 : ", resultNote);

                                            if (errorNote) {
                                                callback(errorNote)
                                            } else {
                                                var collabUserArray = [];
                                                for (var i = 0; i < resultNote.length; i++) {
                                                    collabUserArray.push(resultNote[i].collabUserID)
                                                }
                                                var collabNote = {
                                                    note: resultNote[0].noteID,
                                                    owner: resultNote[0].userID,
                                                    collab: collabUserArray
                                                }
                                                finalResult.push(collabNote);
                                                callback(null, collabNote)

                                            }
                                        })
                                    }

                                })(resultCollab[i]))
                            }

                            async.series(operations, (errorAsync, resultAsync) => {
                                console.log(resultAsync);

                                if (errorAsync) {
                                    callback(errorAsync);
                                } else {
                                    console.log("final result ", finalResult);

                                    callback(null, finalResult)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
    // }
    // })
}
