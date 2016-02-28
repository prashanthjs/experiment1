var Boom = require('boom');
var Bcrypt = require('bcrypt');
var UserEncryptPassword = (function () {
    function UserEncryptPassword() {
        var _this = this;
        this.encryptPasswordRequest = function (request, reply) {
            _this.encryptPassword(request.payload.password, function (err, hash) {
                if (err) {
                    reply(Boom.badImplementation(err));
                }
                else {
                    request.payload.password = hash;
                    reply({});
                }
            });
        };
        this.encryptPassword = function (password, next) {
            Bcrypt.genSalt(10, function (error, salt) {
                Bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        next(err);
                    }
                    else {
                        next(null, hash);
                    }
                });
            });
        };
    }

    return UserEncryptPassword;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = UserEncryptPassword;
