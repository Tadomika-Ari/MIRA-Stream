package external

import (
	"fmt"
)

type info struct {
	Data []struct {
		Title string `json:"title"`
		Images struct {
			WebP struct {
				ImageURL string `json:"image_url"`
			} `json:"webp"`
		} `json:"images"`
		Trailer struct {
			YouTubeID string `json:"youtube_id"`
		} `json:"trailer"`
		Synopsis string `json:"synopsis"`
		Status string `json:"status"`
		Score float32 `json:"score"`
	} `json:"data"`
}


func JikanInfo(name string) info {
	var info info
	var err int
	err = jikan_check()
	if err == 0 {
		fmt.Println("not ok")
		return info
	}
	JikanGet(&info, name)
	fmt.Println("ok")
	return info
}
