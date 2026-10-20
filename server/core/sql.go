package core

import (
	"database/sql"
	"fmt"

	_ "modernc.org/sqlite"
)

func CreateSQL() error {
	db, err := sql.Open("sqlite", "database/database.db")
	if err != nil {
		return fmt.Errorf("ouvrir la base de données: %w", err)
	}
	defer db.Close()
	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            account TEXT NOT NULL,
            devid INTEGER NOT NULL,
            key INTEGER NOT NULL
        )
    `)
	if err != nil {
		fmt.Println("Error with exec")
	}
	return nil
}

