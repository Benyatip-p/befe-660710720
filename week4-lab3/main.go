package main

import (
	"errors"
	"fmt"
)

//นิยาม ใช้นอกไฟล์หรือ import ใช้ตัวใหญ่
type Student struct {
	ID string `json:"id"`
	Name string `json:"name"`
	Email string `json:"email"`
	Year int `json:"year"`
	GPA float64 `json:"gpa"`
}

// func ของ stur เรียกว่า method
// bool = boolean
func (s *Student) IsHonor() bool {
	return s.GPA >= 3.50
}
// func pionter name return
// ชนิดของข้อมูล error != s
func (s *Student) Validate() error {
	if s.Name == "" {
		return errors.New("name is required")
	}
	if s.Year < 1 || s.Year > 4 {
		return errors.New("year must be between 1-4")
	}
	if s.GPA < 0 || s.GPA > 4 {
		return errors.New("qpa must be between 0-4")
	}
	// nill = null/ no error
	return nil 
}

func main(){

	/* var st Student = Student{
		ID:"1", 
		Name:"benyatip", 
		Email:"phonsantia_b@su.ac.th", 
		Year:4, 
		GPA:3.90}
	/*

	/* st := Student = Student{
		ID:"1",
		Name:"benyatip",
		Email:"phonsantia_b@su.ac.th",
		Year:4,
		GPA:3.90} */

	//ระบุตัวเลขใน[]=array,ไม่ระบุคือ sild
	students := []Student{
		{
		ID:"1", 
		Name:"benyatip", 
		Email:"phonsantia_b@su.ac.th", 
		Year:4, 
		GPA:3.90},
		{
		ID:"2", 
		Name:"liz", 
		Email:"liz@su.ac.th", 
		Year:4, 
		GPA:2.75},
	}

	newStudent := Student{
		ID:"3", 
		Name:"ken", 
		Email:"ken@su.ac.th", 
		Year:1, 
		GPA:1.98}

	students = append(students, newStudent)
	
	//_ ไม่รับตัวแปรใช้แทนกับ i
	for i, student:= range students {
		fmt.Printf("%d Honor = %v\n", i,student.IsHonor())
		fmt.Printf("%d Valid = %v\n", i,student.Validate())
	}
}