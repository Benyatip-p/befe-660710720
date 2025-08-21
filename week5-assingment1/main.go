package main

import (
	"github.com/gin-gonic/gin"
)

type Product struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	Unit		string  `json:"unit"`
}

func getProducts(c *gin.Context) {
	product := []Product{
		{ID: "1", Name: "Green Tea", Price: 1200, Description: "Green Tea from Japan", Unit: "500g"},
		{ID: "2", Name: "Black Tea", Price: 1500, Description: "Black Tea from India", Unit: "100g"},
		{ID: "3", Name: "Oolong Tea", Price: 1800, Description: "Oolong Tea from China", Unit: "250g"},
	}
	c.JSON(200, product)
}

func main() {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "healthy"})
	})

	r.GET("/products", getProducts)

	r.Run(":8080")

}