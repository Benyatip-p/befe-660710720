package main

import (
	// "net/http"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"slices"
)

// Student struct
type Student struct {
    ID       string  `json:"id"`
    Name     string  `json:"name"`
    Email    string  `json:"email"`
    Year     int     `json:"year"`
    GPA      float64 `json:"gpa"`
}

// In-memory database (ในโปรเจคจริงใช้ database)
//เชื่อมต่อ database เช่น MySQL, PostgreSQL, MongoDB
var students = []Student{
    {ID: "1", Name: "John Doe", Email: "john@example.com", Year: 3, GPA: 3.50},
    {ID: "2", Name: "Jane Smith", Email: "jane@example.com", Year: 2, GPA: 3.75},
}

func getStudents(c *gin.Context) {
	yearQuery := c.Query("year") // รับค่า year จาก query string

	if yearQuery != "" {
		filter := []Student{}
		//range คือการวนลูปผ่าน slice ของ students
		for _, student := range students {
			if fmt.Sprint(student.Year) == yearQuery {
				filter = append(filter, student)
			}
		}
		c.JSON(http.StatusOK, filter)
		return
	}
	//c.JSON คือการส่ง response กลับไปยัง client โดยมีสถานะเป็น 200 (OK) และข้อมูลในรูปแบบ JSON
	c.JSON(http.StatusOK, students)
}

func getStudent(c *gin.Context) {
	id := c.Param("id") //รับ parameter จาก path

	for _, student := range students {
		if student.ID == id {
			c.JSON(http.StatusOK, student)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
}

func createStudent(c *gin.Context) {
	var newStudent Student

	//c.ShouldBindJSON(&newStudent) ดึงข้อมูลจาก body ที่ส่งมา ถ้าสำเร็จจะเก็บไว้ในตัวแปร newStudent
	if err := c.ShouldBindJSON(&newStudent); err != nil { //nil คือไม่มีค่าอะไรเลย
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		//BadRequest คือสถานะ 400
		return
	}
	if newStudent.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name is required"})
		return
	}
	if newStudent.Year < 1 || newStudent.Year > 4 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Year must be between 1 and 4"})
		return
	}
	newStudent.ID = fmt.Sprintf("%d", len(students)+1) //สร้าง ID อัตโนมัติ
	//fmt.Sprintf คือการแปลงค่าตัวเลขเป็น string
	students = append(students, newStudent)
	c.JSON(http.StatusCreated, newStudent)
	//Created คือสถานะ 201
}

func updateStudent(c *gin.Context) {
	id := c.Param("id")
	var updatedStudent Student //Student คือ struct ที่เราสร้างไว้ข้างบน

	if err := c.ShouldBindJSON(&updatedStudent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//ค้นหา student ที่ต้องการอัพเดต
	for i, student := range students {
		if student.ID == id {
			updatedStudent.ID = id //เก็บ ID เดิมไว้
			students[i] = updatedStudent
			c.JSON(http.StatusOK, updatedStudent)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
}

func deleteStudent(c *gin.Context) {
	id := c.Param("id")

	for i, student := range students {
		if student.ID == id {
			students = slices.Delete(students, i, i+1)
			//ลบข้อมูลใน slice โดยใช้ slices.Delete
			//ถ้าลบ i = 2 จะลบแค่ index 2 แต่ถ้า i+1 = 3 จะลบ index 2 ถึง 2 (3-1)
			c.JSON(http.StatusOK, gin.H{"message": "student deleted"})
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
}

func main() {
	r := gin.Default()
	//ไว้เช็คสุขภาพของ API
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "healthy"})
	})

	api := r.Group("/api/v1")
	{
		api.GET("/students", getStudents)

		api.GET("/students/:id", getStudent) //รับ parameter แบบ path
		api.POST("/students", createStudent) //สร้างข้อมูลใหม่
		api.PUT("/students/:id", updateStudent) //อัพเดตข้อมูลทุก field
		api.DELETE("/students/:id", deleteStudent) //ลบข้อมูล
	}

	r.Run(":8080")
}