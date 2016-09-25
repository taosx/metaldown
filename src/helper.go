package main

import (
	"encoding/json"
	"github.com/valyala/fasthttp"
	"log"
	"net"
	"os"
	"path"
	"strings"

	"github.com/tidwall/buntdb"
)

// Open initialized the database
func Open() {
	dir, err := os.Getwd()
	dbpath := path.Join(dir, "metal.db")

	db, err = buntdb.Open(dbpath)
	if err != nil {
		log.Fatal("Failed to open the database:", err)

	}

	log.Printf("[LOG] Database opened: %s\n", dbpath)
}

// Close saved the db and kills the connection to it
func Close() {
	log.Printf("[LOG] Database closed\n")
	defer db.Close()
}

// Calculator calculates RemainingQuantity
func (el *Elem) Calculator() *Elem {
	el.RemainingQuantity = el.InitialQuantity - el.Sold
	return el
}

// Marshal returns the json bytes from an element
func (el *Elem) Marshal() []byte {
	data, err := json.Marshal(el)

	if err != nil {
		log.Fatalf("Converting element to byte has failed, probably wrong input data %s", err.Error())
		panic(err)
	}

	return data
}

func (el *Elem) Unmarshal(data []byte) *Elem {
	err := json.Unmarshal(data, el)

	if err != nil {
		log.Fatalf("Converting element from byte has failed, probably wrong input data %s", err.Error())
		panic(err)
	}

	return el
}

type bt []byte

func (b bt) Unmarshal() *Elem {
	el := new(Elem)
	err := json.Unmarshal(b, el)

	if err != nil {
		log.Fatalf("Converting element fr0m byte has failed, probably wrong input data: %s, %s", err.Error(), string(b))
		panic(err)
	}

	return el
}

func rk(vals ...string) string {
	return strings.Join(vals, ":")
}

func (el *Elem) Complete(new *Elem) *Elem {

	el.Size = new.Size
	el.Price = new.Price
	el.InitialQuantity = new.InitialQuantity
	el.RemainingQuantity = new.RemainingQuantity
	el.Sold = new.Sold
	el.Weight = new.Weight
	el.WarnLimit = new.WarnLimit

	return el

}

func GetLocalIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return ""
	}
	for _, address := range addrs {
		// check the address type and if it is not a loopback the display it
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}
	return ""
}

func GetExternalIP() string {
	_, body, err := fasthttp.Get(nil, "http://myexternalip.com/raw")
	if err != nil {
		log.Println(err.Error())
		return ""
	}

	return strings.TrimRight(string(body), "\n")
}
