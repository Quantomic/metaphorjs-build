
var cp = require("child_process"),
    Promise = require("../../metaphorjs-promise/src/metaphorjs.promise.js"),
    isDir = require("../lib/isDir.js"),
    passthru = require("../lib/passthru.js");

var Git = function(location) {

    var self = this;

    self.location = location;

};

Git.prototype = {

    location: null,

    hasChanges: function() {

        var deferred = new Promise,
            loc = this.location,
            check = isDir(loc + "/src") ? "./src" : ".";

        process.chdir(loc);

        cp.execFile("git", ["status", check], function(err, stdout) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(stdout.indexOf("modified:") != -1);
            }
        });

        return deferred;
    },

    addAll: function() {
        process.chdir(this.location);
        return passthru("git", ["add", "-A", "."]);
    },

    commit: function(message) {
        process.chdir(this.location);
        return passthru("git", ["commit", "-m", message]);
    },

    setTag: function(version) {
        process.chdir(this.location);
        return passthru("git", ["tag", version]);
    },

    push: function(remote, branch) {
        process.chdir(this.location);
        return passthru("git", ["push", remote, branch]);
    }

};

module.exports = Git;