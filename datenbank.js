import sqlite3 from 'sqlite3';
import { randomUUID } from 'crypto';

export class Datenbank {
    constructor() {
        this.db = null;
    }

    verbinden(filename) {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(filename, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('Verbindung mit Datenbank ok.');
                }
            });
        });
    }

    async reset() {
        const message2 = await this.tabelleLoeschen();
        console.log(message2);

        const message3 = await this.tabelleErstellen();
        console.log(message3);

        const message4 = await this.beispielDatensaetzeErstellen();
        console.log(message4);
    }

    tabelleLoeschen() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS tier;';
            this.db.run(sql, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('Tabelle gelöscht.');
                }
            });
        });
    }

    tabelleErstellen() {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE tier(
                id TEXT PRIMARY KEY,
                spezies TEXT,
                farbe TEXT,
                telefon TEXT,
                saeugetier INTEGER
            );`;
            this.db.run(sql, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('Tabelle erstellt.');
                }
            });
        });
    }

    beispielDatensaetzeErstellen() {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO tier
                    (id, spezies, farbe, telefon, saeugetier)
                VALUES
                    ("1", "Hund", "gold", "1234", 1),
                    ("2", "Katze", "blau",  "0567", 1),
                    ("3", "Maus", "rot",  "0000", 0);`;
            this.db.run(sql, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('Datensätze erstellt.');
                }
            });
        });
    }

    //-------------------------------
    // C R U D
    //-------------------------------
    // CREATE
    createTier(tier) {
        return new Promise((resolve, reject) => {
            const id = randomUUID();
            const sql = `INSERT INTO tier
                            (id, spezies, farbe , telefon, saeugetier)
                        VALUES 
                            (?, ?, ?, ?, ?)`;
            this.db.run(sql, [id, tier.spezies, tier.farbe, tier.telefon, tier.saeugetier], (error) => {
                if (error) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }

    // READ
    readAllTiereBySQL(sql){
        return new Promise((resolve, reject) => {            
            this.db.all(sql, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    readAllTiere() {
        return this.readAllTiereBySQL(`SELECT * FROM tier;`);        
    }

    readAllTiereOrderdBySpezies() {
        return this.readAllTiereBySQL(`SELECT * FROM tier ORDER BY spezies COLLATE NOCASE DESC;`); 
    }

    readAllTiereOrderdByFarbe() {
        return this.readAllTiereBySQL(`SELECT * FROM tier ORDER BY farbe COLLATE NOCASE DESC;`);         
    }


    readTier(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tier WHERE id = ?;`;
            this.db.get(sql, [id], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // UPDATE
    updateTier(tier) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE
                            tier
                         SET
                            spezies = ?,
                            farbe = ?,
                            telefon = ?,
                            saeugetier = ?
                         WHERE
                            id = ?`;
            this.db.run(sql, [tier.spezies, tier.farbe, tier.telefon, tier.saeugetier, tier.id],
                function (error) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(this.changes);
                        // Anzahl der geänderten Datensätze
                        // 'this' funktioniert nicht mit Arrow-functions
                    }
                });
        });
    }

    // DELETE
    deleteTier(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM tier WHERE id = ?;`;
            this.db.run(sql, [id], function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve(this.changes);
                    // Anzahl der gelöschten Datensätze
                    // 'this' funktioniert nicht mit Arrow-functions
                }
            });
        });
    }

}