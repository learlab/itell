/**
 * pipwerks.SCORM - A lightweight SCORM API wrapper.
 *
 * Supports both SCORM 1.2 and SCORM 2004.
 * Usage:
 *   var scorm = pipwerks.SCORM;
 *   scorm.version = "1.2"; // or "2004"
 *   if (scorm.init()) {
 *       // Use scorm.get(), scorm.set(), scorm.save(), etc.
 *   }
 *   // When finished:
 *   scorm.quit();
 */
var pipwerks = pipwerks || {};
pipwerks.SCORM = (function () {
    var scorm = {};
    // Set default version; override as needed
    scorm.version = "1.2";
    scorm.API = null;
    scorm.debug = true;

    var findAPITries = 0;
    function findAPI(win) {
        // Check to see if the window (win) contains the API
        // if the window (win) does not contain the API and
        // the window (win) has a parent window and the parent window
        // is not the same as the window (win)
        
        while ((win.API == null) &&
            (win.parent != null) &&
            (win.parent != win)) {
            // increment the number of findAPITries
            findAPITries++;

            // Note: 7 is an arbitrary number, but should be more than sufficient
            if (findAPITries > 7) {
                alert("Error finding API -- too deeply nested.");
                return null;
            }

            // set the variable that represents the window being
            // being searched to be the parent of the current window
            // then search for the API again
            win = win.parent;
        }
        return win.API;
    }

    function getAPI() {
        // start by looking for the API in the current window
        var theAPI = findAPI(window);
        console.log("theAPI initially: ", theAPI);
        // if the API is null (could not be found in the current window)
        // and the current window has an opener window
        if ((theAPI == null) &&
            (window.opener != null) &&
            (typeof (window.opener) != "undefined")) {
            // try to find the API in the current window�s opener
            theAPI = findAPI(window.opener);
        }
        // if the API has not been found
        if (theAPI == null) {
            // Alert the user that the API Adapter could not be found
            alert("Unable to find an API adapter");
        }
        console.log("The api finally: ", theAPI);
        return theAPI;
    }
    /**
     * Initializes communication with the SCORM API.
     * @returns {Boolean} True if initialization succeeded, false otherwise.
     */
    scorm.init = function () {
        var API = getAPI(window);
        if (API === null || API === undefined) {
            if (scorm.debug) {
                console.error("SCORM API not found.");
            }
            return false;
        }
        if (scorm.version === "2004") {
            var result = API.Initialize("");
            if (result.toString() !== "true") {
                if (scorm.debug) {
                    console.error("SCORM 2004 API Initialize() failed.");
                }
                return false;
            }
        } else {
            var result = API.LMSInitialize("");
            if (result.toString() !== "true") {
                if (scorm.debug) {
                    console.error("SCORM 1.2 API LMSInitialize() failed.");
                }
                return false;
            }
        }
        scorm.API = API;
        console.log("SCORM API initialized.");
        return true;
    };

    /**
     * Retrieves a value from the LMS.
     * @param {String} parameter - The SCORM data model element to retrieve.
     * @returns {String} The value of the element, or an empty string if not found.
     */
    scorm.get = function (parameter) {
        var value = "";
        if (scorm.API === null) {
            if (scorm.debug) {
                console.error("SCORM API not initialized.");
            }
            return "";
        }
        if (scorm.version === "2004") {
            value = scorm.API.GetValue(parameter);
        } else {
            value = scorm.API.LMSGetValue(parameter);
        }
        return value;
    };

    /**
     * Sends a value to the LMS.
     * @param {String} parameter - The SCORM data model element to set.
     * @param {String} value - The value to assign.
     * @returns {Boolean} True if the operation succeeded, false otherwise.
     */
    scorm.set = function (parameter, value) {
        var result;
        if (scorm.API === null) {
            if (scorm.debug) {
                console.error("SCORM API not initialized.");
            }
            return false;
        }
        if (scorm.version === "2004") {
            result = scorm.API.SetValue(parameter, value);
        } else {
            result = scorm.API.LMSSetValue(parameter, value);
        }
        if (result.toString() !== "true") {
            if (scorm.debug) {
                console.error("SCORM API failed to set value for parameter: " + parameter);
            }
            return false;
        }
        return true;
    };

    /**
     * Commits the current data to the LMS.
     * @returns {Boolean} True if the commit was successful, false otherwise.
     */
    scorm.save = function () {
        var result;
        if (scorm.API === null) {
            if (scorm.debug) {
                console.error("SCORM API not initialized.");
            }
            return false;
        }
        if (scorm.version === "2004") {
            result = scorm.API.Commit("");
        } else {
            result = scorm.API.LMSCommit("");
        }
        if (result.toString() !== "true") {
            if (scorm.debug) {
                console.error("SCORM API Commit failed.");
            }
            return false;
        }
        return true;
    };

    /**
     * Terminates communication with the LMS.
     * @returns {Boolean} True if the termination succeeded, false otherwise.
     */
    scorm.quit = function () {
        var result;
        if (scorm.API === null) {
            if (scorm.debug) {
                console.error("SCORM API not initialized.");
            }
            return false;
        }
        if (scorm.version === "2004") {
            result = scorm.API.Terminate("");
        } else {
            result = scorm.API.LMSFinish("");
        }
        if (result.toString() !== "true") {
            if (scorm.debug) {
                console.error("SCORM API Terminate failed.");
            }
            return false;
        }
        scorm.API = null;
        return true;
    };

    return scorm;
})();