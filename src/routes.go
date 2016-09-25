package main

import (
	"github.com/buaazp/fasthttprouter"
	"github.com/valyala/fasthttp"
)

// NewRouter does this and that
func NewRouter() fasthttp.RequestHandler {
	router := fasthttprouter.New()

	router.GET("/", HandlerIndex)
	router.GET("/public/*filepath", HandlerFS)
	router.GET("/stats", HandlerStats)

	// // Element atomic routes (one element at a time)
	router.POST("/element/add", HandlerCreateElement)
	router.PUT("/element/edit", HandlerEditElement)
	router.GET("/element/get", HandlerGetElement)
	router.DELETE("/element/del", HandlerDeleteElement)
	//
	// // Elements non-atomic routes
	router.GET("/elements/get", HandlerGetAll)
	router.GET("/elements/get/:type/:limit", HandlerGetAllElements)

	return router.Handler
}
