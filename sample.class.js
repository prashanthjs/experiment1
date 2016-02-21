var SampleController = (function () {
    function SampleController() {
        var _this = this;
        this.get = function () {
            console.log(_this);
            console.log('get');
        };
    }
    SampleController.prototype.set = function () {
        console.log('set');
    };
    return SampleController;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SampleController;
