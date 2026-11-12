package sql

import (
	"fmt"
	"database/sql"
	_ "modernc.org/sqlite"
)

func CreateSQL() error {
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return err
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return fmt.Errorf("ouvrir la base de données: %w", err)
	}
	defer db.Close()
	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            account TEXT NOT NULL UNIQUE,
			description TEXT,
			pp TEXT,
			nsfw BOOL
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
			userid INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			animeid INTEGER NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
			status TEXT,
			timestamp INTEGER,
			PRIMARY KEY (userid, animeid)
		)
	`)
	return nil
}