package main

//gin-gonic/gin เป็น package ที่ใช้สำหรับสร้าง web framework ในภาษา Go
//ไม่ใช่ standard library แต่เป็น package ที่ต้องติดตั้งเพิ่มเติม โดยใช้คำสั่ง go get -u github.com/gin-gonic/gin
import (
	"github.com/gin-gonic/gin"
)

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func main() {
	//สร้างobject gin.Default() เพื่อสร้าง router
	r := gin.Default()

	//ชื่อ register route
	//c คือ context 
	r.GET("/users", func(c *gin.Context) {
		//body
		//สร้าง struct สำหรับเก็บข้อมูล
		//user คือชื่อ struct
		user:=[]User{{ID:"1", Name: "Benyatip"}}

		//c.JSON ใช้สำหรับส่งข้อมูลในรูปแบบ JSON
		//200 คือ status code 200 หมายถึง OK
		//user คือข้อมูลที่ต้องการส่งกลับ
		c.JSON(200, user)
	})

	r.Run(":8080") //รัน server ที่ port 8080
	
}