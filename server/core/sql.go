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
            account TEXT NOT NULL
        )
    `)
	if err != nil {
		fmt.Println("Error with exec")
		return err
	}
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS anime (
			id INTEGER PRiMARY KEY,
			animeName TEXT NOT NULL,
			nsfw BOOLEAN
		)
	`)
	if err != nil {
		fmt.Println("Error with table likeanime")
		return err
	}
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS user_anime (
			userid INTEGER NOT NULL REFERENCE user(id ) ON DELETE CASCADE,
			animeid INTEGER NOT NULL REFERENCE anime(id) ON DELETE CASCADE,
			status TEXT,
			timestamp INTEGER,
			PRIMARY KEY (userid, animeid)
		)
	`)
	return nil
}

