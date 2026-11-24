package sql

import (
	"database/sql"
	"errors"
	"fmt"

	_ "modernc.org/sqlite"
)

type RequestFavoriteAnimeUser struct {
	Userid    int    `json:"userid"`
	Animeid   int    `json:"animeid"`
	AnimeName string `json:"animeName"`
	Favorite  bool   `json:"favorite"`
	Status    string `json:"status"`
	Timestamp int    `json:"timestamp"`
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
		SELECT ua.userid, ua.animeid, a.animeName, ua.favorite, ua.status, ua.timestamp
		FROM user_anime ua
		JOIN anime a ON a.id = ua.animeid
		WHERE ua.userid = ? AND ua.favorite = TRUE
	`, userId)
	if rows.Err() != nil {
		return nil, rows.Err()
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var request []RequestFavoriteAnimeUser
	for rows.Next() {
		var userid int
		var animeid int
		var animeName string
		var favorite bool
		var status string
		var timestamp int
		var tmp RequestFavoriteAnimeUser
		if err := rows.Scan(&userid, &animeid, &animeName, &favorite, &status, &timestamp); err != nil {
			return nil, err
		}
		tmp.Userid = userid
		tmp.Animeid = animeid
		tmp.AnimeName = animeName
		tmp.Favorite = favorite
		tmp.Status = status
		tmp.Timestamp = timestamp
		request = append(request, tmp)
		fmt.Println(userid, animeid, animeName, favorite, status, timestamp)
	}
	return request, nil
}
