package sql

import (
	"fmt"
	"database/sql"
	_ "modernc.org/sqlite"
)

func GetUsers() []UserConfig {
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return nil
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		fmt.Println("ERROR DEBUG 2")
		return nil
	}
	defer db.Close()
	rows, err := db.Query(`
		SELECT * FROM users
	`)
	if err != nil {
		fmt.Println("ERROR DEBUG 3")
		return nil
	}
	defer rows.Close()

	var list_users []UserConfig

	for rows.Next() {
		var id int
		var account string
		var description string
		var pp string
		var nsfw bool
		var tmp UserConfig
		if err := rows.Scan(&id, &account, &description, &pp, &nsfw); err != nil {
			fmt.Println("ERROR DEBUG 4")
			return nil
		}
		tmp.Name = account
		tmp.Description = description
		tmp.PP = pp
		tmp.NSFW = nsfw

		println(id, account)
		list_users = append(list_users, tmp)
	}
	if err := rows.Err(); err != nil {
		fmt.Println("ERROR DEBUG 5")
		return nil
	}
	return list_users
}