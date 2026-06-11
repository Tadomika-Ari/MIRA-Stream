package external

import (
	"net/http"
	"fmt"
	"encoding/json"
)

func JikanGet(info *info, name string) info {
	url := "https://api.jikan.moe/v4/anime?q="
	url = url + name
	response, err := http.Get(url)
	if err != nil {
        fmt.Print(err.Error())
        return *info
    }
	json.NewDecoder(response.Body).Decode(info)
	if len(info.Data) == 0 {
		fmt.Println("No data")
        return *info
    }
	fmt.Println(info.Data[0].Title)
	return *info
}