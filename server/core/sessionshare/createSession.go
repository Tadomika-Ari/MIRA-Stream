package sessionshare

import (
	core "server/server/core"
)

func CreateSession(cfg core.Conf) error {
	StartSessionShare(cfg)
	return nil
}