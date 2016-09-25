package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"

	"github.com/buaazp/fasthttprouter"
	"github.com/valyala/fasthttp"
)

var mem1 []byte
var mem2 []byte
var mem3 []byte
var internIP string
var externIP string

// HandlerStats returns the local and external ip in a json
func HandlerStats(ctx *fasthttp.RequestCtx, _ fasthttprouter.Params) {

	if internIP == "" {
		internIP = GetLocalIP()
	}
	if externIP == "" {
		externIP = GetExternalIP()
	}

	switch {
	case internIP == "" && externIP == "":
		errmsg, _ := json.Marshal(map[string]string{
			"local":    "error",
			"external": "error",
			"error":    "Failed to get ip",
		})
		ctx.Write(errmsg)
		return
	case internIP != "" && externIP == "":
		errmsg, _ := json.Marshal(map[string]string{
			"local":    internIP,
			"external": "error",
			"error":    "Failed to get external ip",
		})
		ctx.Write(errmsg)
		return
	case internIP == "" && externIP != "":
		errmsg, _ := json.Marshal(map[string]string{
			"local":    "error",
			"external": externIP,
			"error":    "Failed to get ip",
		})
		ctx.Write(errmsg)
		return
	}

	b, err := json.Marshal(map[string]string{
		"local":    internIP,
		"external": externIP,
	})

	if err != nil {
		errmsg, _ := json.Marshal(map[string]string{
			"local":    "error",
			"external": "error",
			"error":    err.Error(),
		})
		ctx.Write(errmsg)
		return
	}

	if mem1 != nil {
		ctx.Write(mem1)
	} else {
		ctx.Write(b)
		mem1 = b
	}

	return

}

// HandlerFiles opens a file, stores it in memory and serves it with
// the necessary headers
func HandlerFiles(name string) fasthttprouter.Handle {
	return func(ctx *fasthttp.RequestCtx, _ fasthttprouter.Params) {
		ctx.Response.Header.Add("Last-Modified", "Sat, 23 Sep 2016 05:44:58 GMT")
		ctx.Response.Header.Set("Cache-control", "public, max-age=259200")

		if name == "style" {
			ctx.SetContentType("text/css")
			if mem1 == nil {
				mem1 = File[name]
				log.Printf("[LOG] Not from memory: %s\n", name)
			}
			ctx.Write(mem1)
		}

		if name == "greek" {
			ctx.SetContentType("application/json")
			if mem2 == nil {
				mem2 = File[name]
				log.Printf("[LOG] Not from memory: %s\n", name)
			}
			ctx.Write(mem2)
		}
		if name == "jquery" || name == "bundle" || name == "app" {
			ctx.SetContentType("application/javascript")
			mem3 = File[name]
			if mem3 == nil {
				mem3 = File[name]
				log.Printf("[LOG] Not from memory: %s\n", name)
			}
			ctx.Write(mem3)
		}

	}
}

func HandlerFS(ctx *fasthttp.RequestCtx, ps fasthttprouter.Params) {
	dir, _ := os.Getwd()

	ctx.Response.Header.Add("Last-Modified", "Sat, 23 Sep 2016 05:44:58 GMT")
	ctx.Response.Header.Set("Cache-control", "public, max-age=259200")

	fs := &fasthttp.FS{
		Root:            path.Join(dir, "resources", "app/"),
		IndexNames:      []string{"index.html"},
		Compress:        true,
		AcceptByteRange: false,
	}

	fsHandler := fs.NewRequestHandler()

	fsHandler(ctx)
}

func HandlerIndex(ctx *fasthttp.RequestCtx, _ fasthttprouter.Params) {
	current_dir, _ := os.Getwd()
	ctx.SetContentType("text/html")

	var err error
	if mem3 == nil {
		mem3, err = ioutil.ReadFile(path.Join(current_dir, "resources", "app", "public", "index.html"))
		if err != nil {
			ctx.WriteString("Error: " + err.Error())
		}
	}

	ctx.Write(mem3)

}

func HandlerGetAll(ctx *fasthttp.RequestCtx, _ fasthttprouter.Params) {
	Src, _ = json.Marshal(map[string]interface{}{"data": GetElems()})
	ctx.SetContentType("application/json")
	ctx.Write(Src)
}

// HandlerCreateElement adds an element to a type/bucket
func HandlerCreateElement(ctx *fasthttp.RequestCtx, ps fasthttprouter.Params) {

	Src = ctx.FormValue("type")
	Dst = ctx.FormValue("size")
	// l := ctx.FormValue("limit")
	limit, err := ctx.QueryArgs().GetUint("limit")

	// limit, err := strconv.Atoi(l)
	if err != nil {
		ctx.SetStatusCode(http.StatusInternalServerError)
		ctx.WriteString(err.Error())
		return
	}

	err = CreateElem(string(Src), string(Dst), limit)
	if err != nil {
		ctx.SetStatusCode(http.StatusInternalServerError)
		ctx.WriteString(err.Error())
		return
	}

	ctx.WriteString("OK")
}

// HandlerEditElement edits an already existing element
func HandlerEditElement(ctx *fasthttp.RequestCtx, ps fasthttprouter.Params) {

	el := new(Elem)
	body := ctx.PostBody()

	err := json.Unmarshal(body, el)
	if err != nil {
		ctx.SetStatusCode(http.StatusInternalServerError)
		ctx.WriteString("decoder: " + err.Error())
		return
	}

	typ := ctx.FormValue("type")

	siz := ctx.FormValue("size")

	if err := EditElem(string(typ), string(siz), el); err != nil {
		ctx.SetStatusCode(http.StatusInternalServerError)
		ctx.WriteString(err.Error())
		return
	}

	ctx.WriteString("OK")
}

// HandlerGetElement retrieves a element from the database
func HandlerGetElement(ctx *fasthttp.RequestCtx, ps fasthttprouter.Params) {
	Src = ctx.FormValue("type")
	Dst = ctx.FormValue("size")

	el, err := GetElem(string(Src), string(Dst))
	if err != nil {
		ctx.SetStatusCode(http.StatusInternalServerError)
		ctx.WriteString(err.Error())
		return
	}

	ctx.Write(el.Marshal())
}

// HandlerDeleteElement deletes an element from the database
func HandlerDeleteElement(ctx *fasthttp.RequestCtx, _ fasthttprouter.Params) {

	Src = ctx.FormValue("type")
	Dst = ctx.FormValue("size")

	err := RemoveElem(string(Src), string(Dst))
	if err != nil {
		ctx.SetStatusCode(http.StatusInternalServerError)
		ctx.WriteString(err.Error())
		return
	}

	ctx.WriteString("OK")
}

func HandlerGetAllElements(ctx *fasthttp.RequestCtx, ps fasthttprouter.Params) {
	var err error

	Src = ctx.FormValue("type")

	els := GetElems()

	Src, err = json.Marshal(els)
	if err != nil {
		ctx.SetStatusCode(http.StatusInternalServerError)
		ctx.WriteString(err.Error())
		return
	}

	ctx.Write(Src)
}
