package sql

import (
	"fmt"
	"database/sql"
	_ "modernc.org/sqlite"
)

func AddUsersSQL(name string, password string) error {
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return err
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return err
	}
	defer db.Close()
	_, err = db.Exec(`
		INSERT OR IGNORE INTO users (account, description, pp, nsfw) 
		VALUES (?, ?, ?, ?)
	`, name, "just a test", "default", "true")
	return nil
}