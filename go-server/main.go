package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/rpc/v2"
	"github.com/gorilla/rpc/v2/json"
)

// HelloArgs for HelloService
type HelloArgs struct {
	Who string
	Age int
}

// HelloReply for HelloService
type HelloReply struct {
	Message string
}

// HelloService for rpc service
type HelloService struct{}

// Say something
func (h *HelloService) Say(r *http.Request, args *HelloArgs, reply *HelloReply) error {
	reply.Message = "Hello, " + args.Who + ", " + "You're " + strconv.Itoa(args.Age) + " now!"
	return nil
}

func main() {
	s := rpc.NewServer()
	s.RegisterCodec(json.NewCodec(), "application/json")
	s.RegisterService(new(HelloService), "")

	router := mux.NewRouter()
	router.Handle("/rpc", s)

	headersContentType := handlers.AllowedHeaders([]string{"Content-Type", "Access-Control-Allow-Origin"})
	// methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	log.Println("JSON-RPC server listening on :3003")
	http.ListenAndServe(":3003", handlers.CORS(headersContentType)(router))
}
