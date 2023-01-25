"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _googleapis = require("googleapis");

var _googleAuthLibrary = require("google-auth-library");

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/script.scriptapp'];

class gsheetdb {
  constructor(parameters) {
    if (!parameters) {
      throw 'You need to provide identification!';
    }

    if (!parameters.spreadsheetId) {
      throw 'You need to provide spreadsheetId!';
    }

    if (!parameters.sheetName) {
      throw 'You need to provide sheetName!';
    }

    if (!parameters.credentialsJSON) {
      throw 'You need to provide credentialsJSON!';
    }

    this.spreadsheetId = parameters.spreadsheetId;
    this.scriptId = parameters.scriptId;
    this.sheetName = parameters.sheetName;
    this.credentialsJSON = parameters.credentialsJSON;
    this.client = undefined;
    this.headerRow = [];
  }

  async connect() {
    if (!!this.client) return;
    this.client = _googleAuthLibrary.auth.fromJSON(this.credentialsJSON);
    this.client.scopes = SCOPES;

    try {
      await this.client.authorize();
    } catch (e) {
      throw new Error(`Error in GSheetDB.connect:\n${e}`);
    }
  }

  async getData(dataRange = this.sheetName) {
    try {
      await this.connect();
      let response = await _googleapis.google.sheets({
        version: 'v4'
      }).spreadsheets.values.get({
        auth: this.client,
        spreadsheetId: this.spreadsheetId,
        range: dataRange,
        valueRenderOption: 'UNFORMATTED_VALUE'
      });
      this.headerRow = response.data.values[0];
      let values = response.data.values.slice(1);
      return values.map((row, rowNb) => {
        let obj = {
          values: row,
          // update: false,
          rowNb: rowNb + 2
        }; // this.headerRow.forEach((columnName, columnNb) => {
        //   obj[columnName] = row[columnNb-1]
        // })

        return obj;
      });
    } catch (e) {
      throw new Error(`Error in GSheetDB.getData:\n${e}`);
    }
  }
  /**
   * Insert new rows
   * @param {Array} rows Array of rows (as arrays) [ [row1], [row2], etc. ]
   */


  async insertRows(rows) {
    try {
      if (!rows || !Array.isArray(rows) || !rows.length) {
        throw 'No rows provided!';
      }

      await this.connect();
      await _googleapis.google.sheets({
        version: 'v4'
      }).spreadsheets.values.append({
        auth: this.client,
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}`,
        insertDataOption: 'INSERT_ROWS',
        valueInputOption: 'RAW',
        resource: {
          range: this.sheetName,
          majorDimension: 'ROWS',
          values: rows
        }
      });
    } catch (e) {
      throw new Error(`Error in GSheetDB.insertRows:\n${e}`);
    }
  }
  /**
   * Update a row identified by its number with new data
   * @param {Integer} rowNumber Row number
   * @param {Array} rowArray New row data
   */


  async updateRow(rowNumber, rowArray) {
    try {
      if (!rowNumber) {
        throw 'No row number provided!';
      }

      if (!rowArray || !Array.isArray(rowArray) || !rowArray.length) {
        throw 'No new row provided!';
      }

      await this.connect();
      await _googleapis.google.sheets({
        version: 'v4'
      }).spreadsheets.values.batchUpdate({
        auth: this.client,
        spreadsheetId: this.spreadsheetId,
        resource: {
          valueInputOption: 'RAW',
          data: [{
            range: `${this.sheetName}!${rowNumber}:${rowNumber}`,
            majorDimension: 'ROWS',
            values: [rowArray]
          }]
        }
      });
    } catch (e) {
      throw new Error(`Error in GSheetDB.updateRow:\n${e}`);
    }
  }


  // async deleteRow(rowNumber) {
  //   try {
  //     if (!rowNumber) {
  //       throw 'No row number provided!';
  //     }

  //     await this.connect();
  //     await _googleapis.google.script({
  //       version: 'v1'
  //     }).scripts.run({
  //       auth: this.client,
  //       scriptId: this.scriptId,
  //       requestBody: {
  //         function: "deleteRow",
  //         parameters: [
  //           rowNumber,
  //           this.sheetName
  //         ]
  //       }
  //     });
  //   } catch (e) {
  //     throw new Error(`Error in GSheetDB.deleteRow:\n${e}`);
  //   }
  // }

}

exports.default = gsheetdb;