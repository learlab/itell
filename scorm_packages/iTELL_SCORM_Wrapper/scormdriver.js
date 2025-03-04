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
pipwerks.SCORM = (function() {
    var scorm = {};
    // Set default version; override as needed
    scorm.version = "1.2"; 
    scorm.API = null;
    scorm.debug = false;

    /**
     * Attempts to locate the SCORM API by traversing the parent frames.
     * @param {Window} win - The current window object.
     * @returns {Object|null} The API object or null if not found.
     */
    function getAPI(win) {
        var findAPITries = 0;
        var maxTries = 500;
        while ((!win.API && !win.API_1484_11) && win.parent && (win.parent !== win)) {
            findAPITries++;
            if (findAPITries > maxTries) {
                if (scorm.debug) {
                    console.error("Error finding SCORM API - too many attempts.");
                }
                return null;
            }
            win = win.parent;
        }
        return win.API || win.API_1484_11;
    }

    /**
     * Initializes communication with the SCORM API.
     * @returns {Boolean} True if initialization succeeded, false otherwise.
     */
    scorm.init = function() {
        var API = getAPI(window);
        if (API === null) {
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
        return true;
    };

    /**
     * Retrieves a value from the LMS.
     * @param {String} parameter - The SCORM data model element to retrieve.
     * @returns {String} The value of the element, or an empty string if not found.
     */
    scorm.get = function(parameter) {
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
    scorm.set = function(parameter, value) {
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
    scorm.save = function() {
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
    scorm.quit = function() {
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