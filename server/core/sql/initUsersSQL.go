package sql

import (
	"fmt"
	sqllib "database/sql"
	_ "modernc.org/sqlite"
)

func InitUsersSQL(name string, password string, description string, pp string, nsfw bool) error {
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return err
	}
	db, err := sqllib.Open("sqlite", path)
	if err != nil {
		return err
	}
	defer db.Close()
	_, err = db.Exec(`
		INSERT OR IGNORE INTO users (account, description, pp, nsfw)
		VALUES (?, ?, ?, ?)
	`, name, description, pp, nsfw)
	return err
}