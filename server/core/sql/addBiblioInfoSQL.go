package sql

import (
	"fmt"
	"database/sql"
	_ "modernc.org/sqlite"
)

func AddBibloInfoSQL() error {
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
		INSERT INTO anime (animeName, nsfw) 
		VALUES (?, ?)
	`, "Wistoria", false)
	return nil
}