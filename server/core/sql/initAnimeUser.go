package sql

import (
	"fmt"
	sqllib "database/sql"
	_ "modernc.org/sqlite"
)

func GetAnimeList() []string {
	var animeList []string
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return nil
	}
	db, err := sqllib.Open("sqlite", path)
	if err != nil {
		fmt.Println("ERROR DEBUG 2")
		return nil
	}
	defer db.Close()
	rows, err := db.Query(`
		SELECT animeName FROM anime
	`)
	if err != nil {
		fmt.Println("ERROR DEBUG 3")
		return nil
	}
	defer rows.Close()
	for rows.Next() {
		var animeName string
		rows.Scan(&animeName)
		animeList = append(animeList, animeName)
	}
	return  animeList
}

func InitAnimeUser(name string) error {
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
	userId := GetUserIdName(name)

	animeList := GetAnimeList()
	for _, animeName := range animeList {
		animeId := GetAnimeIdName(animeName)
		_, err = db.Exec(`
			INSERT OR IGNORE INTO user_anime (userid, animeid, favorite, status, timestamp)
			VALUES (?, ?, ?, ?, ?)
		`, userId, animeId, false, "Not watch", 0)
	}
	return err
}