package sql

import (
	"fmt"
	"database/sql"
	_ "modernc.org/sqlite"
)

func DeleteUser(name string) []UserConfig {
	if name == "admin" {
		fmt.Println("Admin delete cancel")
		return nil
	}
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
	_, err = db.Exec(`
		DELETE FROM users WHERE account == (?) 
	`, name)

	var list_users []UserConfig
	list_users = GetUsers()
	return list_users
}
