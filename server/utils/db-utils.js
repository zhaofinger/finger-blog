const config = require('../../config').databaseConfig;
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: config.USERNAME,
  password: config.PASSWORD,
  database: config.DATABASE
});

let query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        resolve(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

let createTable = function (sql) {
  return query(sql, []);
};


let findDataById = function (table, id) {
  let _sql = 'SELECT * FROM ?? WHERE id = ? ';
  return query(_sql, [table, id]);
};


let findDataByPage = function (table, key, sort, keys, start, end) {
  let col = '??';
  let queryArr = null;
  if (keys === '*') {
    col = '*';
    queryArr = [table, key, start, end];
  } else {
    queryArr = [keys, table, key, start, end];
  }
  let _sql = `SELECT ${col} FROM ?? ORDER BY ?? ${sort} LIMIT ? , ?`;
  return query(_sql, queryArr);
};


let insertData = function (table, values) {
  let _sql = 'INSERT INTO ?? SET ?';
  return query(_sql, [table, values]);
};


let updateData = function (table, values, id) {
  let _sql = 'UPDATE ?? SET ? WHERE id = ?';
  return query(_sql, [table, values, id]);
};


let deleteDataById = function (table, id) {
  let _sql = 'DELETE FROM ?? WHERE id = ?';
  return query(_sql, [table, id]);
};


let select = function (table, keys) {
  let _sql = 'SELECT ?? FROM ?? ';
  return query(_sql, [keys, table]);
};

let count = function (table) {
  let _sql = 'SELECT COUNT(*) AS total_count FROM ?? ';
  return query(_sql, [table]);
};

module.exports = {
  query,
  createTable,
  findDataById,
  findDataByPage,
  deleteDataById,
  insertData,
  updateData,
  select,
  count,
};
