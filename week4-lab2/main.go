package main

import(
	"fmt"
)

// var email string = "benyatip@mail.com"

func main(){
	// var name string = "benyatip"
	var age int = 20

	email := "benyatip@hotmail.com"
	gpa := 3.75

	firstname, lastname := "benyatip", "phonsantia"

	fmt.Printf("Name %s %s, age %d, email %s, gpa %.2f\n", firstname, lastname,age,email,gpa)
}