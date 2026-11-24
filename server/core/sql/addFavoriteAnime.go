package sql

import (
	"database/sql"
	"errors"
	"fmt"

	_ "modernc.org/sqlite"
)

func AddFavoriteAnime(animeName string, userName string) error {
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

	userId := GetUserIdName(userName)
	animeId := GetAnimeIdName(animeName)
	if userId == -1 || animeId == -1 {
		return errors.New("userid not found in addFavoriteAnime")
	}
	rows, err := db.Exec(`
		UPDATE user_anime SET favorite = TRUE WHERE userid = ? AND animeid = ?
	`, userId, animeId)
	if err != nil {
		return err
	}
	affected, err := rows.RowsAffected()
	if err != nil {
		return err
	}

	if affected == 0 {
		return errors.New("favorite not added: user-anime relation not found")
	}
	return nil
}