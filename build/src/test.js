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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var knexpg_1 = __importDefault(require("../config/knexpg"));
var app = express_1.default();
var PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.get('/', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var knex, task_2, query;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                knex = knexpg_1.default;
                return [4 /*yield*/, knex
                        .select([
                        'org.id',
                        'org.name_uz as OrgName',
                        knex.raw("(select count(documents.id) from documents where db_id = org.id) as documentCount"),
                        knex.raw("(select count(users.id) from users where db_id = org.id) as  countUsers")
                    ])
                        .from('organizations as org')
                        .orderByRaw('countUsers desc')
                        .limit(20)];
            case 1:
                task_2 = _a.sent();
                return [4 /*yield*/, knex
                        .select([
                        'org.id',
                        'org.name_uz as OrganName',
                        knex.raw('(select count(documents.id) from documents where db_id = org.id) as documentCount'),
                        knex.raw('(select count(users.id) from users where db_id = org.id) as countUsers')
                    ])
                        .from('organizations as org')
                        .orderByRaw('countUsers DESC')
                    // console.log(task_2);
                ];
            case 2:
                query = _a.sent();
                // console.log(task_2);
                return [2 /*return*/, res.status(200).json(task_2)
                    // knex.from('users').innerJoin('accounts', 'users.id', 'accounts.user_id')
                    // SELECT d.* from president_assignments.documents as d
                    // INNER JOIN president_assignments.tasks as t on d.id = t.document_id AND t.is_deleted is not true
                    // INNER JOIN president_assignments.task_recipients as tr on t.id = tr.task_id and tr.recipient_db_id = '599e5105cf1d7c338cb6ea6d'
                    // GROUP BY d.id
                    // ORDER BY d.created_at desc
                    // LIMIT 10;
                ];
        }
    });
}); });
function startup() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                app.listen(PORT, function () {
                    console.log("App listen and runnig", PORT);
                });
            }
            catch (e) {
                console.log(e);
            }
            return [2 /*return*/];
        });
    });
}
startup();
// const pg = require('knex')({
//   client: 'pg',
//   connection: process.env.PG_CONNECTION_STRING,
//   searchPath: ['knex', 'public'],
// });
// knex.table = (table) => knex
