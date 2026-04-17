package server

import (
	"fmt"
	"net/http"
)

func SimpleHost() {
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		fmt.Println("error server")
	}
	fmt.Println("END FUNCTION")
}