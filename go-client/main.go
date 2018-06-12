package main

import (
	"bytes"
	"log"
	"net/http"

	"github.com/gorilla/rpc/json"
)

type HelloArgs struct {
	Who string
	Age int
}

type HelloReply struct {
	Message string
}

func main() {
	url := "http://localhost:3000/rpc"

	args := &HelloArgs{
		Who: "ping",
		Age: 18,
	}
	message, err := json.EncodeClientRequest("HelloService.Say", args)
	if err != nil {
		log.Fatalf("%s", err)
	}
	// fmt.Println(string(message))

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(message))
	if err != nil {
		log.Fatalf("%s", err)
	}
	req.Header.Set("Content-Type", "application/json")
	client := new(http.Client)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalf("Error in sending request to %s. %s", url, err)
	}
	defer resp.Body.Close()

	var result HelloReply
	err = json.DecodeClientResponse(resp.Body, &result)
	if err != nil {
		log.Fatalf("Couldn't decode response. %s", err)
	}

	log.Printf("%s\n", result)
}
