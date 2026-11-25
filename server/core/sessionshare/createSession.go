package sessionshare

import (
	core "server/server/core"
)

func CreateSession(cfg core.Conf) error {
	go StartSessionShare(cfg)
	return nil
}