package sql

import (
	"database/sql"
	"fmt"
	"errors"
	_ "modernc.org/sqlite"
)

func GetAnimeIdName(name string) int {
	var id int
	if name == "" {
		return -1
	}
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return -1
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return -1
	}
	defer db.Close()
	err = db.QueryRow(`
		SELECT id FROM anime WHERE animeName = ?
	`, name).Scan(&id)
	if err == sql.ErrNoRows {
		println("Id not found, GetAnimeIdName")
		return -1
	}
	if err != nil {
		println("ERROR with GetAnimeIdName")
		return -1
	}
	return id
}

func GetUserIdName(name string) int {
	var id int
	if name == "" {
		return -1
	}
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return -1
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return -1
	}
	defer db.Close()
	err = db.QueryRow(`
		SELECT id FROM users WHERE account = ?
	`, name).Scan(&id)
	if err == sql.ErrNoRows {
		println("Id not found for UserIdName")
		return -1
	}
	if err != nil {
		println("ERROR with GetAnimeIdName")
		return -1
	}
	return id
}

func AddUsersAnime(animeName string, userName string) error {
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
	idUser := GetUserIdName(userName)
	idAnime := GetAnimeIdName(animeName)
	if idUser == -1 || idAnime == -1 {
		return errors.New("id user or id anime not found")
	}
	_, err = db.Exec(`
		INSERT OR IGNORE INTO users (userid, animeid, favorite, status, timestamp) 
		VALUES (?, ?, ?, ?, ?)
	`, idUser, idAnime, true, "test", 0)
	return nil
}