package main

import (
	"fmt"
	"os"
)

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != ""{
		return value
	}
	return defaultValue
}

func main() {
	// command export คือคำสั่งที่ใช้ในระบบปฏิบัติการ Unix-based เช่น Linux และ macOS เพื่อกำหนดค่าตัวแปรแวดล้อม (environment variables) ในเชลล์ปัจจุบัน
	// โดยค่าตัวแปรแวดล้อมเหล่านี้จะถูกใช้โดยโปรแกรมหรือสคริปต์ที่รันในเชลล์นั้น ๆ
	// echo $POSTGRES_DB คือคำสั่งที่ใช้ในเชลล์ Unix-based เพื่อแสดงค่าของตัวแปรแวดล้อมที่ชื่อว่า POSTGRES_DB
	// สิ่งแวดล้อม (environment variables) เป็นตัวแปรที่เก็บข้อมูลที่สามารถใช้โดยโปรแกรมต่าง ๆ ในระบบปฏิบัติการ
	host := getEnv("DB_HOST", "")
	name := getEnv("DB_NAME", "")
	user := getEnv("DB_USER", "")
	password := getEnv("DB_PASSWORD", "")
	port := getEnv("DB_PORT", "")


	conSt := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s", host, port, user, password, name)

	fmt.Println("DB_HOST:", conSt)
}