package sql

import (
	"database/sql"
	"errors"
	"fmt"

	_ "modernc.org/sqlite"
)

type RequestFavoriteAnimeUser struct {
	userid int
	animeid int
	favorite bool
	status string
	timestamp int
}

func GetFavoriteAnimeUser(name string) ([]RequestFavoriteAnimeUser, error) {
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return nil, err
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	userId := GetUserIdName(name)
	if userId == -1 {
		return nil, errors.New("userid not found in getAnimeUserInfo")
	}
	rows, err := db.Query(`
		SELECT * FROM user_anime WHERE userid = ? AND favorite = TRUE
	`, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var request []RequestFavoriteAnimeUser
	for rows.Next() {
		var userid int
		var animeid int
		var favorite bool
		var status string
		var timestamp int
		var tmp RequestFavoriteAnimeUser
		if rows.Err() != nil {
			return nil, rows.Err()
		}
		rows.Scan(&userid, &animeid, &favorite, &status, &timestamp)
		tmp.userid = userid; tmp.animeid = animeid; tmp.favorite = favorite; tmp.status = status; tmp.timestamp = timestamp
		request = append(request, tmp)
		fmt.Println(userid, animeid, favorite, status, timestamp)
	}
	return request, nil
}