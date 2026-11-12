package sql

import (
	"fmt"
	"database/sql"
	_ "modernc.org/sqlite"
)

func GetAllUsersSQL() error {
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
		SELECT * FROM users
	`)
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var id int
		var account string
		var description string
		var pp string
		var nsfw bool
		if err := rows.Scan(&id, &account, &description, &pp, &nsfw); err != nil {
			return err
		}
		println(id, account, description, pp, nsfw)
	}
	return rows.Err()
}