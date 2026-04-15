package server

import (
	"fmt"
	"os"
)

func TakeFolder() {
	fmt.Println(os.ReadDir("."))
}