package sessionshare

import (
	"errors"
	core "server/server/core"
)

func CreateSession(cfg core.Conf) (string, error) {
	url, err := StartSessionShare(cfg)
	if err != nil || url == "" {
		return "", errors.New("error with session share")
	}
	return url, nil
}