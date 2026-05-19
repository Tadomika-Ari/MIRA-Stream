package external

import (
	"net/http"
)

func jikan_check() int {
	_, err := http.Get("https://api.jikan.moe/v4/")
	if err == nil {
		return 1
	} else {
		return 0
	}
}