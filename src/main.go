package main

import (
	"log"

	"github.com/tidwall/buntdb"
	"github.com/valyala/fasthttp"
)

var (
	// both buffers are uninitialized
	Dst []byte
	Src []byte
	db  *buntdb.DB
)

const (
	PORT = ":8080"
)

func main() {
	Open() // Initializes a connection with the database

	router := NewRouter()

	log.Fatal(fasthttp.ListenAndServe(PORT, router))

	Close() // Closes the database connection
}
