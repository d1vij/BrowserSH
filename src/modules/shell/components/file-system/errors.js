"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeWithSameNameExistsError = exports.NodeIsDirectoryError = exports.NodeIsFileError = void 0;
var NodeIsFileError = /** @class */ (function (_super) {
    __extends(NodeIsFileError, _super);
    function NodeIsFileError(message) {
        if (message === void 0) { message = "Node is a file"; }
        var _newTarget = this.constructor;
        var _this = _super.call(this, "NodeIsFileError: ".concat(message)) || this;
        _this.name = 'NodeIsFileError';
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return NodeIsFileError;
}(Error));
exports.NodeIsFileError = NodeIsFileError;
var NodeIsDirectoryError = /** @class */ (function (_super) {
    __extends(NodeIsDirectoryError, _super);
    function NodeIsDirectoryError(message) {
        if (message === void 0) { message = "Node is a directory"; }
        var _newTarget = this.constructor;
        var _this = _super.call(this, "NodeIsDirectoryError: Node exits with name ".concat(message, " in directory.")) || this;
        _this.name = 'NodeIsDirectoryError';
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return NodeIsDirectoryError;
}(Error));
exports.NodeIsDirectoryError = NodeIsDirectoryError;
var NodeWithSameNameExistsError = /** @class */ (function (_super) {
    __extends(NodeWithSameNameExistsError, _super);
    function NodeWithSameNameExistsError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, "NodeWithSameNameExistsError: ".concat(message)) || this;
        _this.name = 'NodeWithSameNameExistsError';
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return NodeWithSameNameExistsError;
}(Error));
exports.NodeWithSameNameExistsError = NodeWithSameNameExistsError;
