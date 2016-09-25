package main

import "io/ioutil"

func readf(file string) []byte {
	data, err := ioutil.ReadFile(file)
	if err != nil {
		return nil
	}
	return data
}

var File = map[string][]byte{

	"jquery": readf("resources/app/public/js/jquery.min.js"),

	"bundle": readf("resources/app/public/js/bundle.js"),

	"app": readf("resources/app/public/js/app.js"),

	"style": readf("resources/app/public/css/bundle.css"),

	"greek": readf("resources/app/public/Greek.json"),
}
