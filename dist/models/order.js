'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
exports.OrderStore = void 0;
var database_1 = __importDefault(require('../database'));
var OrderStore = /** @class */ (function () {
  function OrderStore() {}
  OrderStore.prototype.activeOrder = function (user_id) {
    return __awaiter(this, void 0, void 0, function () {
      var conn, sql, result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, database_1['default'].connect()];
          case 1:
            conn = _a.sent();
            sql =
              "SELECT order_id, product_id, SUM(quantity) as quantity FROM order_products INNER JOIN orders ON order_products.order_id=orders.id WHERE user_id=($1) AND status='active' GROUP BY order_id, product_id;";
            return [4 /*yield*/, conn.query(sql, [user_id])];
          case 2:
            result = _a.sent();
            conn.release();
            return [2 /*return*/, result.rows];
        }
      });
    });
  };
  OrderStore.prototype.create = function (user_id) {
    return __awaiter(this, void 0, void 0, function () {
      var conn, active_order_sql, active_order_result, sql, result, order;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, database_1['default'].connect()];
          case 1:
            conn = _a.sent();
            active_order_sql =
              "SELECT * FROM orders WHERE user_id=($1) AND status='active';";
            return [4 /*yield*/, conn.query(active_order_sql, [user_id])];
          case 2:
            active_order_result = _a.sent();
            if (active_order_result.rows.length != 0) {
              conn.release();
              throw new Error('User has already an active order');
            }
            sql =
              "INSERT INTO orders (user_id, status) VALUES($1, 'active') RETURNING *";
            return [4 /*yield*/, conn.query(sql, [user_id])];
          case 3:
            result = _a.sent();
            order = result.rows[0];
            conn.release();
            return [2 /*return*/, order];
        }
      });
    });
  };
  OrderStore.prototype.addProduct = function (
    quantity,
    order_id,
    product_id,
    user_id
  ) {
    return __awaiter(this, void 0, void 0, function () {
      var ordersql, conn, order_result, active_order, sql, result, order;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            ordersql = 'SELECT * FROM orders WHERE id=($1)';
            return [4 /*yield*/, database_1['default'].connect()];
          case 1:
            conn = _a.sent();
            return [4 /*yield*/, conn.query(ordersql, [order_id])];
          case 2:
            order_result = _a.sent();
            active_order = order_result.rows[0];
            if (active_order.status !== 'active') {
              conn.release();
              throw new Error(
                'Could not add product '
                  .concat(product_id, ' to order ')
                  .concat(order_id, ' because order status is ')
                  .concat(active_order.status)
              );
            }
            if (user_id != active_order.user_id) {
              throw new Error(
                'Logged in user can not add product to this order with id: '.concat(
                  order_id
                )
              );
            }
            sql =
              'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
            return [
              4 /*yield*/,
              conn.query(sql, [quantity, order_id, product_id])
            ];
          case 3:
            result = _a.sent();
            order = result.rows[0];
            conn.release();
            return [2 /*return*/, order];
        }
      });
    });
  };
  return OrderStore;
})();
exports.OrderStore = OrderStore;
