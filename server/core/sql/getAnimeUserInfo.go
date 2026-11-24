package sql

import (
	"database/sql"
	"errors"
	"fmt"

	_ "modernc.org/sqlite"
)

func GetAnimeUserInfo(name string) error {
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

	userId := GetUserIdName(name)
	if userId == -1 {
		return errors.New("userid not found in getAnimeUserInfo")
	}
	rows, err := db.Query(`
		SELECT * FROM user_anime WHERE userid = ?
	`, userId)
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var userid int
		var animeid int
		var favorite bool
		var status string
		var timestamp int
		if rows.Err() != nil {
			return rows.Err()
		}
		rows.Scan(&userid, &animeid, &favorite, &status, &timestamp)
		fmt.Println(userid, animeid, favorite, status, timestamp)
	}
	return nil
}