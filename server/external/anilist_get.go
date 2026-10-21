package external

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

type anilistResponse struct {
	Data struct {
		Media struct {
			Title struct {
				Romaji  string `json:"romaji"`
				English string `json:"english"`
			} `json:"title"`
			Description string `json:"description"`
			CoverImage  struct {
				Large string `json:"large"`
			} `json:"coverImage"`
			AverageScore float32 `json:"averageScore"`
			Status       string  `json:"status"`
		} `json:"Media"`
	} `json:"data"`
	Errors []struct {
		Message string `json:"message"`
	} `json:"errors"`
}

type anilistRequest struct {
	Query     string            `json:"query"`
	Variables map[string]string `json:"variables"`
}

const anilistQuery = `query ($search: String) {
	Media(search: $search, type: ANIME) {
		title { romaji english }
		description
		coverImage { large }
		averageScore
		status
	}
}`

var anilistHTTPClient = &http.Client{Timeout: 10 * time.Second}

func anilistError(response anilistResponse) error {
	if len(response.Errors) == 0 {
		return nil
	}
	return fmt.Errorf("AniList: %s", response.Errors[0].Message)
}

func AnilistGet(info *info, name string) info {
	searchName := strings.ReplaceAll(name, "-", " ")
	requestBody, err := json.Marshal(anilistRequest{
		Query:     anilistQuery,
		Variables: map[string]string{"search": searchName},
	})
	if err != nil {
		fmt.Printf("AniList request preparation failed: %v\n", err)
		return *info
	}

	request, err := http.NewRequestWithContext(context.Background(), http.MethodPost, "https://graphql.anilist.co", bytes.NewReader(requestBody))
	if err != nil {
		fmt.Printf("AniList request creation failed: %v\n", err)
		return *info
	}
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Accept", "application/json")
	request.Header.Set("User-Agent", "MIRA-Stream/1.0")

	response, err := anilistHTTPClient.Do(request)
	if err != nil {
		fmt.Printf("AniList request failed: %v\n", err)
		return *info
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("AniList response read failed: %v\n", err)
		return *info
	}

	var result anilistResponse
	if err := json.Unmarshal(body, &result); err != nil {
		fmt.Printf("AniList response decode failed: %v\n", err)
		return *info
	}
	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		fmt.Printf("AniList returned HTTP %d: %s\n", response.StatusCode, strings.TrimSpace(string(body)))
		return *info
	}
	if err := anilistError(result); err != nil {
		fmt.Println(err)
		return *info
	}

	media := result.Data.Media
	if media.Title.Romaji == "" && media.Title.English == "" && media.CoverImage.Large == "" {
		fmt.Printf("AniList: no result for %q\n", name)
		return *info
	}
	title := media.Title.Romaji
	if title == "" {
		title = media.Title.English
	}
	info.Data = append(info.Data, struct {
		Title  string `json:"title"`
		Images struct {
			WebP struct {
				ImageURL string `json:"image_url"`
			} `json:"webp"`
		} `json:"images"`
		Trailer struct {
			YouTubeID string `json:"youtube_id"`
		} `json:"trailer"`
		Synopsis string  `json:"synopsis"`
		Status   string  `json:"status"`
		Score    float32 `json:"score"`
	}{Title: title, Synopsis: media.Description, Status: media.Status, Score: media.AverageScore})
	info.Data[len(info.Data)-1].Images.WebP.ImageURL = media.CoverImage.Large

	if len(info.Data) == 0 {
		fmt.Println("No data")
		return *info
	}
	fmt.Println(info.Data[0].Title)
	return *info
}
