package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"
)

// Lead represents a minimal lead structure scraped from a source.
type Lead struct {
	Name      string
	Company   string
	Email     string
	Source    string
	ScrapedAt time.Time
}

// scrapeExample is a placeholder scraping function (to adapt per target).
func scrapeExample(ctx context.Context, keyword string, limit int) ([]Lead, error) {
	// TODO: implement real scraping logic with proper HTTP client, parsing, rate limiting, etc.
	// For now, we just return a fake lead.
	leads := []Lead{
		{
			Name:      "John Doe",
			Company:   "Example Corp",
			Email:     "john.doe@example.com",
			Source:    "example.com",
			ScrapedAt: time.Now(),
		},
	}

	if len(leads) > limit {
		leads = leads[:limit]
	}
	return leads, nil
}

func handleScrape(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	keyword := r.URL.Query().Get("q")
	if keyword == "" {
		keyword = "default"
	}

	limit := 10

	leads, err := scrapeExample(ctx, keyword, limit)
	if err != nil {
		log.Printf("scrape error: %v", err)
		http.Error(w, "scrape error", http.StatusInternalServerError)
		return
	}

	for _, lead := range leads {
		_, _ = fmt.Fprintf(w, "%s;%s;%s;%s;%s\n",
			lead.Name,
			lead.Company,
			lead.Email,
			lead.Source,
			lead.ScrapedAt.Format(time.RFC3339),
		)
	}
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/scrape", handleScrape)

	srv := &http.Server{
		Addr:              ":8080",
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Println("scraper-go listening on :8080")
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server error: %v", err)
	}
}

