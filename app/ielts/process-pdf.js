"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var pdf_parse_1 = require("pdf-parse");
// Функция для чтения PDF-файла и извлечения текста
function extractTextFromPdf(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var dataBuffer, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataBuffer = fs.readFileSync(filePath);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, pdf_parse_1.default)(dataBuffer)];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.text];
                case 3:
                    error_1 = _a.sent();
                    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0435 \u0444\u0430\u0439\u043B\u0430 ".concat(filePath, ":"), error_1);
                    return [2 /*return*/, ''];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Функция для обработки всех PDF-файлов в директории
function processDirectory(directoryPath) {
    return __awaiter(this, void 0, void 0, function () {
        var files, results, _i, files_1, file, filePath, fileStats, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = fs.readdirSync(directoryPath);
                    results = [];
                    _i = 0, files_1 = files;
                    _a.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 4];
                    file = files_1[_i];
                    filePath = path.join(directoryPath, file);
                    fileStats = fs.statSync(filePath);
                    if (!(fileStats.isFile() && path.extname(file) === '.pdf')) return [3 /*break*/, 3];
                    return [4 /*yield*/, extractTextFromPdf(filePath)];
                case 2:
                    text = _a.sent();
                    results.push({ file: file, text: text });
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, results];
            }
        });
    });
}
// Основная функция для обработки всех директорий и записи результатов в JSON-файл
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var baseDirectory, directories, allResults, _i, directories_1, dir, dirPath, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    baseDirectory = './ielts-sample-papers-2';
                    directories = [
                        'Academic Reading',
                        'Academic Writing',
                        'General Training Reading',
                        'General Training Writing',
                        'Listening',
                        'Speaking',
                    ];
                    allResults = {};
                    _i = 0, directories_1 = directories;
                    _c.label = 1;
                case 1:
                    if (!(_i < directories_1.length)) return [3 /*break*/, 4];
                    dir = directories_1[_i];
                    dirPath = path.join(baseDirectory, dir);
                    _a = allResults;
                    _b = dir;
                    return [4 /*yield*/, processDirectory(dirPath)];
                case 2:
                    _a[_b] = _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    fs.writeFileSync('ielts-data.json', JSON.stringify(allResults, null, 2));
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
