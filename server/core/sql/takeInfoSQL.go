package sql

import (
	"fmt"
	"database/sql"
	_ "modernc.org/sqlite"
)

func TakeInfoSQL() error {
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
	rows, err := db.Query(`
		SELECT * FROM anime
	`)
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var id int
		var animeName string
		var nsfw bool
		if rows.Err() != nil {
			return rows.Err()
		}
		rows.Scan(&id, &animeName, &nsfw)
		println(id, animeName, nsfw)
	}
	return nil
}